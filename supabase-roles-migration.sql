-- Assia Tours - migration roles et permissions
-- A coller dans Supabase SQL Editor si votre base existe deja avec le role "client".
-- Remplacez admin@assiatour.com par votre vrai email admin avant execution.

drop policy if exists "profiles_select_self_or_admin" on public.profiles;
drop policy if exists "profiles_admin_update" on public.profiles;
drop policy if exists "profiles_admin_delete" on public.profiles;
drop policy if exists "trips_public_read_active" on public.trips;
drop policy if exists "trips_admin_write" on public.trips;
drop policy if exists "reservations_public_insert" on public.reservations;
drop policy if exists "reservations_staff_select" on public.reservations;
drop policy if exists "reservations_staff_update" on public.reservations;
drop policy if exists "reservations_admin_delete" on public.reservations;
drop policy if exists "trip_images_public_read" on storage.objects;
drop policy if exists "trip_images_staff_upload" on storage.objects;
drop policy if exists "trip_images_staff_update" on storage.objects;

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop function if exists public.current_user_role();

do $$
begin
  if exists (
    select 1
    from pg_type t
    join pg_enum e on e.enumtypid = t.oid
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public'
      and t.typname = 'app_role'
      and e.enumlabel = 'client'
  ) then
    create type public.app_role_new as enum ('admin', 'employee');
    alter table public.profiles alter column role drop default;
    update public.profiles set role = 'employee' where role::text = 'client';
    alter table public.profiles
      alter column role type public.app_role_new
      using role::text::public.app_role_new;
    drop type public.app_role;
    alter type public.app_role_new rename to app_role;
  end if;
end $$;

alter table public.profiles alter column role set default 'employee'::public.app_role;
update public.profiles set role = 'employee' where role::text not in ('admin', 'employee');

create or replace function public.current_user_role()
returns public.app_role
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    case
      when new.raw_user_meta_data->>'role' = 'admin' then 'admin'::public.app_role
      else 'employee'::public.app_role
    end
  )
  on conflict (id) do update set
    email = excluded.email,
    name = coalesce(public.profiles.name, excluded.name);
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.employee_can_update_reservation_status_only()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.current_user_role() = 'employee' then
    if new.id is distinct from old.id
      or new.trip_slug is distinct from old.trip_slug
      or new.trip_name is distinct from old.trip_name
      or new.departure_from is distinct from old.departure_from
      or new.departure_to is distinct from old.departure_to
      or new.hotel_name is distinct from old.hotel_name
      or new.room_type is distinct from old.room_type
      or new.passenger_count is distinct from old.passenger_count
      or new.first_name is distinct from old.first_name
      or new.last_name is distinct from old.last_name
      or new.email is distinct from old.email
      or new.phone is distinct from old.phone
      or new.address is distinct from old.address
      or new.city is distinct from old.city
      or new.passport_number is distinct from old.passport_number
      or new.passport_expiry is distinct from old.passport_expiry
      or new.nationality is distinct from old.nationality
      or new.birth_date is distinct from old.birth_date
      or new.notes is distinct from old.notes
      or new.created_at is distinct from old.created_at
    then
      raise exception 'Les employes peuvent modifier uniquement le statut.';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists reservations_employee_status_only on public.reservations;
create trigger reservations_employee_status_only
before update on public.reservations
for each row execute function public.employee_can_update_reservation_status_only();

do $$ begin
  create type public.reservation_status as enum ('pending', 'confirmed', 'cancelled');
exception when duplicate_object then null; end $$;
alter table public.reservations
  alter column status set default 'pending'::public.reservation_status;

insert into storage.buckets (id, name, public)
values ('trip-images', 'trip-images', true)
on conflict (id) do update set public = true;

create policy "profiles_select_self_or_admin"
on public.profiles for select
to authenticated
using (id = auth.uid() or public.current_user_role() = 'admin');

create policy "profiles_admin_update"
on public.profiles for update
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy "profiles_admin_delete"
on public.profiles for delete
to authenticated
using (public.current_user_role() = 'admin');

create policy "trips_public_read_active"
on public.trips for select
to anon, authenticated
using (active = true or public.current_user_role() = 'admin');

create policy "trips_admin_write"
on public.trips for all
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy "reservations_public_insert"
on public.reservations for insert
to anon, authenticated
with check (true);

create policy "reservations_staff_select"
on public.reservations for select
to authenticated
using (public.current_user_role() in ('admin', 'employee'));

create policy "reservations_staff_update"
on public.reservations for update
to authenticated
using (public.current_user_role() in ('admin', 'employee'))
with check (public.current_user_role() in ('admin', 'employee'));

create policy "reservations_admin_delete"
on public.reservations for delete
to authenticated
using (public.current_user_role() = 'admin');

create policy "trip_images_public_read"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'trip-images');

create policy "trip_images_staff_upload"
on storage.objects for insert
to authenticated
with check (bucket_id = 'trip-images' and public.current_user_role() = 'admin');

create policy "trip_images_staff_update"
on storage.objects for update
to authenticated
using (bucket_id = 'trip-images' and public.current_user_role() = 'admin')
with check (bucket_id = 'trip-images' and public.current_user_role() = 'admin');

-- Donnez le pouvoir total a votre compte admin:
update public.profiles set role = 'admin' where email = 'admin@assiatour.com';
