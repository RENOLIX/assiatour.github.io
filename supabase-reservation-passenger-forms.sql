-- Ajoute les fiches detaillees de chaque passager dans les reservations.

alter table public.reservations
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
