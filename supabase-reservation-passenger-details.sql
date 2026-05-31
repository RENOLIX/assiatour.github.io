-- A executer une fois dans Supabase SQL Editor.
-- Conserve les quantites ADT / CHD / INF et toutes les fiches passagers.

alter table public.reservations
  add column if not exists adult_count integer not null default 1 check (adult_count >= 1),
  add column if not exists child_count integer not null default 0 check (child_count >= 0),
  add column if not exists infant_count integer not null default 0 check (infant_count >= 0),
  add column if not exists passengers jsonb not null default '[]'::jsonb;

-- Recupere ADT 1 pour les anciennes reservations, quelle que soit la version
-- du schema utilisee auparavant (snake_case ou camelCase).
update public.reservations
set passengers = jsonb_build_array(
  jsonb_build_object(
    'type', 'ADT',
    'firstName', coalesce(to_jsonb(reservations)->>'first_name', to_jsonb(reservations)->>'firstName', ''),
    'lastName', coalesce(to_jsonb(reservations)->>'last_name', to_jsonb(reservations)->>'lastName', ''),
    'birthDate', coalesce(to_jsonb(reservations)->>'birth_date', to_jsonb(reservations)->>'birthDate', ''),
    'nationality', coalesce(to_jsonb(reservations)->>'nationality', ''),
    'passportNumber', coalesce(to_jsonb(reservations)->>'passport_number', to_jsonb(reservations)->>'passportNumber', ''),
    'passportExpiry', coalesce(to_jsonb(reservations)->>'passport_expiry', to_jsonb(reservations)->>'passportExpiry', '')
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
    if (to_jsonb(new) - 'status') is distinct from (to_jsonb(old) - 'status') then
      raise exception 'Les employes peuvent modifier uniquement le statut.';
    end if;
  end if;
  return new;
end;
$$;
