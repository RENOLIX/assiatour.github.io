-- A executer une fois dans Supabase SQL Editor.
-- Conserve les quantites ADT / CHD / INF et toutes les fiches passagers.

alter table public.reservations
  add column if not exists adult_count integer not null default 1 check (adult_count >= 1),
  add column if not exists child_count integer not null default 0 check (child_count >= 0),
  add column if not exists infant_count integer not null default 0 check (infant_count >= 0),
  add column if not exists passengers jsonb not null default '[]'::jsonb;

update public.reservations
set passengers = jsonb_build_array(
  jsonb_build_object(
    'type', 'ADT',
    'firstName', first_name,
    'lastName', last_name,
    'birthDate', birth_date,
    'nationality', nationality,
    'passportNumber', passport_number,
    'passportExpiry', passport_expiry
  )
)
where passengers = '[]'::jsonb;

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
      or new.adult_count is distinct from old.adult_count
      or new.child_count is distinct from old.child_count
      or new.infant_count is distinct from old.infant_count
      or new.passengers is distinct from old.passengers
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
