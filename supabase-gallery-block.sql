-- Bloc galerie: photos du bloc "Explorez le Monde"
-- A executer dans Supabase SQL Editor apres le schema principal.

insert into storage.buckets (id, name, public)
values ('trip-images', 'trip-images', true)
on conflict (id) do update set public = true;

create table if not exists public.gallery_block_photos (
  id uuid primary key default gen_random_uuid(),
  line text not null check (line in ('line1', 'line2')),
  position integer not null default 0,
  image_url text not null,
  created_at timestamptz not null default now()
);

alter table public.gallery_block_photos enable row level security;

drop policy if exists "gallery_block_public_read" on public.gallery_block_photos;
create policy "gallery_block_public_read"
on public.gallery_block_photos for select
to anon, authenticated
using (true);

drop policy if exists "gallery_block_admin_insert" on public.gallery_block_photos;
create policy "gallery_block_admin_insert"
on public.gallery_block_photos for insert
to authenticated
with check (public.current_user_role() = 'admin');

drop policy if exists "gallery_block_admin_update" on public.gallery_block_photos;
create policy "gallery_block_admin_update"
on public.gallery_block_photos for update
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

drop policy if exists "gallery_block_admin_delete" on public.gallery_block_photos;
create policy "gallery_block_admin_delete"
on public.gallery_block_photos for delete
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
with check (bucket_id = 'trip-images' and public.current_user_role() = 'admin');

drop policy if exists "trip_images_staff_update" on storage.objects;
create policy "trip_images_staff_update"
on storage.objects for update
to authenticated
using (bucket_id = 'trip-images' and public.current_user_role() = 'admin')
with check (bucket_id = 'trip-images' and public.current_user_role() = 'admin');

truncate table public.gallery_block_photos;

insert into public.gallery_block_photos (line, position, image_url)
values
  ('line1', 0, 'https://images.unsplash.com/photo-1768047845974-a1830dfb186a?auto=format&fit=crop&fm=jpg&q=90&w=800'),
  ('line1', 1, 'https://images.unsplash.com/photo-1694786121274-29aa4b36e8d5?auto=format&fit=crop&fm=jpg&q=90&w=800'),
  ('line1', 2, 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&fm=jpg&q=90&w=800'),
  ('line1', 3, 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&fm=jpg&q=90&w=800'),
  ('line1', 4, 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&fm=jpg&q=90&w=800'),
  ('line1', 5, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&fm=jpg&q=90&w=800'),
  ('line1', 6, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&fm=jpg&q=90&w=800'),
  ('line1', 7, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&fm=jpg&q=90&w=800'),
  ('line1', 8, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&fm=jpg&q=90&w=800'),
  ('line1', 9, 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&fm=jpg&q=90&w=800'),
  ('line2', 0, 'https://images.unsplash.com/photo-1540202404-a2f29016b523?auto=format&fit=crop&fm=jpg&q=90&w=800'),
  ('line2', 1, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&fm=jpg&q=90&w=800'),
  ('line2', 2, 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&fm=jpg&q=90&w=800'),
  ('line2', 3, 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&fm=jpg&q=90&w=800'),
  ('line2', 4, 'https://images.unsplash.com/photo-1505881502353-a1986add3762?auto=format&fit=crop&fm=jpg&q=90&w=800'),
  ('line2', 5, 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&fm=jpg&q=90&w=800'),
  ('line2', 6, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&fm=jpg&q=90&w=800'),
  ('line2', 7, 'https://images.unsplash.com/photo-1520454974749-611b7248ffdb?auto=format&fit=crop&fm=jpg&q=90&w=800'),
  ('line2', 8, 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&fm=jpg&q=90&w=800'),
  ('line2', 9, 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&fm=jpg&q=90&w=800');
