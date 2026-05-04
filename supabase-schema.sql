-- Assia Tours - schema Supabase
-- A coller dans Supabase SQL Editor, puis executer.
-- Important: pour supprimer la verification email, allez dans Authentication > Providers > Email
-- et desactivez "Confirm email". Ce reglage ne peut pas etre change avec du SQL public.

create extension if not exists pgcrypto;

do $$ begin
  create type public.app_role as enum ('admin', 'employee', 'client');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.reservation_status as enum ('pending', 'confirmed', 'cancelled');
exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  role public.app_role not null default 'client',
  created_at timestamptz not null default now()
);

create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  destination text not null,
  country text not null,
  flag text not null default 'WORLD',
  tagline text not null,
  description text not null default '',
  hero_image text not null default '',
  gallery_images text[] not null default '{}',
  airline text not null default '',
  duration text not null default '',
  base_price numeric(12,2) not null default 0 check (base_price >= 0),
  departures jsonb not null default '[]'::jsonb,
  hotels jsonb not null default '[]'::jsonb,
  includes text[] not null default '{}',
  excludes text[] not null default '{}',
  excursions text[] not null default '{}',
  optional_activities text[] not null default '{}',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  trip_slug text not null,
  trip_name text not null,
  departure_from text not null,
  departure_to text not null default '',
  hotel_name text not null,
  room_type text not null,
  passenger_count integer not null default 1 check (passenger_count > 0),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  address text not null,
  city text not null,
  passport_number text not null,
  passport_expiry text not null,
  nationality text not null,
  birth_date text not null,
  notes text,
  status public.reservation_status not null default 'pending',
  created_at timestamptz not null default now()
);

create index if not exists reservations_status_idx on public.reservations(status);
create index if not exists reservations_created_at_idx on public.reservations(created_at desc);
create index if not exists trips_active_idx on public.trips(active);

alter table public.trips add column if not exists gallery_images text[] not null default '{}';
alter table public.trips add column if not exists departures jsonb not null default '[]'::jsonb;
alter table public.trips add column if not exists hotels jsonb not null default '[]'::jsonb;

insert into storage.buckets (id, name, public)
values ('trip-images', 'trip-images', true)
on conflict (id) do update set public = true;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trips_touch_updated_at on public.trips;
create trigger trips_touch_updated_at
before update on public.trips
for each row execute function public.touch_updated_at();

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
    coalesce((new.raw_user_meta_data->>'role')::public.app_role, 'client')
  )
  on conflict (id) do update set
    email = excluded.email,
    name = coalesce(public.profiles.name, excluded.name);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.trips enable row level security;
alter table public.reservations enable row level security;

drop policy if exists "profiles_select_self_or_admin" on public.profiles;
create policy "profiles_select_self_or_admin"
on public.profiles for select
to authenticated
using (id = auth.uid() or public.current_user_role() in ('admin', 'employee'));

drop policy if exists "profiles_admin_update" on public.profiles;
create policy "profiles_admin_update"
on public.profiles for update
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

drop policy if exists "profiles_admin_delete" on public.profiles;
create policy "profiles_admin_delete"
on public.profiles for delete
to authenticated
using (public.current_user_role() = 'admin');

drop policy if exists "trips_public_read_active" on public.trips;
create policy "trips_public_read_active"
on public.trips for select
to anon, authenticated
using (active = true or public.current_user_role() in ('admin', 'employee'));

drop policy if exists "trips_admin_write" on public.trips;
create policy "trips_admin_write"
on public.trips for all
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

drop policy if exists "reservations_public_insert" on public.reservations;
create policy "reservations_public_insert"
on public.reservations for insert
to anon, authenticated
with check (true);

drop policy if exists "reservations_staff_select" on public.reservations;
create policy "reservations_staff_select"
on public.reservations for select
to authenticated
using (public.current_user_role() in ('admin', 'employee'));

drop policy if exists "reservations_staff_update" on public.reservations;
create policy "reservations_staff_update"
on public.reservations for update
to authenticated
using (public.current_user_role() in ('admin', 'employee'))
with check (public.current_user_role() in ('admin', 'employee'));

drop policy if exists "reservations_admin_delete" on public.reservations;
create policy "reservations_admin_delete"
on public.reservations for delete
to authenticated
using (public.current_user_role() = 'admin');

drop policy if exists "trip_images_public_read" on storage.objects;
create policy "trip_images_public_read"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'trip-images');

drop policy if exists "trip_images_staff_upload" on storage.objects;
create policy "trip_images_staff_upload"
on storage.objects for insert
to authenticated
with check (bucket_id = 'trip-images' and public.current_user_role() in ('admin', 'employee'));

drop policy if exists "trip_images_staff_update" on storage.objects;
create policy "trip_images_staff_update"
on storage.objects for update
to authenticated
using (bucket_id = 'trip-images' and public.current_user_role() in ('admin', 'employee'))
with check (bucket_id = 'trip-images' and public.current_user_role() in ('admin', 'employee'));

insert into public.trips
  (slug, destination, country, flag, tagline, description, hero_image, airline, duration, base_price, includes, excludes, excursions, optional_activities)
values
  ('prestige-istanbul', 'Istanbul', 'Turquie', 'TR', 'Prestige Istanbul 2026', 'Découvrez la magie d''Istanbul avec Assia Tours.', 'https://images.unsplash.com/photo-1694963059334-032b961079a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', 'Turkish Airlines', '7 jours / 6 nuits', 119000, array['Billet Turkish Airlines aller-retour','Hébergement 6 nuits','Transferts','Excursions guidées'], array[]::text[], array['Mosquée Bleue','Sainte-Sophie','Croisière Bosphore'], array[]::text[]),
  ('caire-sharm-el-sheikh', 'Le Caire & Sharm El-Sheikh', 'Égypte', 'EG', 'Combiné Caire & Sharm El-Sheikh', 'Pyramides, Nil et Mer Rouge en formule organisée.', 'https://images.unsplash.com/photo-1678038592672-e63442537f52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', 'Egyptair', '10 jours / 9 nuits', 288000, array['Vols Egyptair','Transferts','All Inclusive Sharm','Musée Égyptien'], array['Visa 30 USD'], array['Pyramides de Gizeh','Croisière sur le Nil','City Tour Sharm'], array['Plongée','Quad','Dauphins']),
  ('sharm-el-sheikh-direct', 'Sharm El-Sheikh', 'Égypte', 'EG', 'Sharm El-Sheikh Vol Direct', 'Vol direct depuis Alger et 8 nuits All Inclusive.', 'https://images.unsplash.com/photo-1771987428767-a4514ab87567?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', 'Air Algérie', '9 jours / 8 nuits', 234000, array['Vol direct Air Algérie','Transferts','Guides professionnels','All Inclusive Soft'], array[]::text[], array[]::text[], array['Ras Mohamed','Safari quad','Camp bédouin'])
on conflict (slug) do nothing;

-- Apres creation de votre premier compte, remplacez l'email ci-dessous puis executez:
-- update public.profiles set role = 'admin' where email = 'votre-email@example.com';
