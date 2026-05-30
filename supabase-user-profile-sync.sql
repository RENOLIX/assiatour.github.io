-- Synchronise auth.users vers public.profiles.
-- A executer une fois dans Supabase SQL Editor.

do $$ begin
  create type public.app_role as enum ('admin', 'employee');
exception when duplicate_object then null; end $$;

alter table public.profiles
  add column if not exists email text,
  add column if not exists name text,
  add column if not exists full_name text,
  add column if not exists role public.app_role not null default 'employee',
  add column if not exists created_at timestamptz not null default now();

update public.profiles
set
  name = coalesce(name, full_name, split_part(coalesce(email, ''), '@', 1)),
  full_name = coalesce(full_name, name, split_part(coalesce(email, ''), '@', 1));

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'full_name',
      split_part(coalesce(new.email, ''), '@', 1)
    ),
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(coalesce(new.email, ''), '@', 1)
    ),
    case
      when new.raw_user_meta_data->>'role' = 'admin' then 'admin'::public.app_role
      else 'employee'::public.app_role
    end
  )
  on conflict (id) do update set
    email = excluded.email,
    name = coalesce(public.profiles.name, excluded.name),
    full_name = coalesce(public.profiles.full_name, excluded.full_name);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

insert into public.profiles (id, email, name, full_name, role)
select
  users.id,
  users.email,
  coalesce(
    users.raw_user_meta_data->>'name',
    users.raw_user_meta_data->>'full_name',
    split_part(coalesce(users.email, ''), '@', 1)
  ),
  coalesce(
    users.raw_user_meta_data->>'full_name',
    users.raw_user_meta_data->>'name',
    split_part(coalesce(users.email, ''), '@', 1)
  ),
  case
    when users.raw_user_meta_data->>'role' = 'admin' then 'admin'::public.app_role
    else 'employee'::public.app_role
  end
from auth.users as users
on conflict (id) do update set
  email = excluded.email,
  name = coalesce(public.profiles.name, excluded.name),
  full_name = coalesce(public.profiles.full_name, excluded.full_name);

create or replace function public.ensure_current_user_profile()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, full_name, role)
  select
    users.id,
    users.email,
    coalesce(
      users.raw_user_meta_data->>'name',
      users.raw_user_meta_data->>'full_name',
      split_part(coalesce(users.email, ''), '@', 1)
    ),
    coalesce(
      users.raw_user_meta_data->>'full_name',
      users.raw_user_meta_data->>'name',
      split_part(coalesce(users.email, ''), '@', 1)
    ),
    case
      when users.raw_user_meta_data->>'role' = 'admin' then 'admin'::public.app_role
      else 'employee'::public.app_role
    end
  from auth.users as users
  where users.id = auth.uid()
  on conflict (id) do nothing;
end;
$$;

revoke all on function public.ensure_current_user_profile() from public;
grant execute on function public.ensure_current_user_profile() to authenticated;

-- Pour donner le role admin a un utilisateur precis:
-- update public.profiles set role = 'admin' where email = 'votre-email@assiatours.com';
