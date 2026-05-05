-- Ajoute le detail des passagers dans les reservations:
-- ADT = adultes, CHD = enfants, INF = bebes.

alter table public.reservations
  add column if not exists adult_count integer not null default 1 check (adult_count >= 1),
  add column if not exists child_count integer not null default 0 check (child_count >= 0),
  add column if not exists infant_count integer not null default 0 check (infant_count >= 0);

update public.reservations
set
  adult_count = greatest(1, passenger_count),
  child_count = coalesce(child_count, 0),
  infant_count = coalesce(infant_count, 0)
where adult_count = 1 and passenger_count > 1;
