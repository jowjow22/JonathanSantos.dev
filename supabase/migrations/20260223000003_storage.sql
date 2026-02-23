-- Private bucket for project images (signed URLs required for access)
-- Per CONTEXT.md: "Supabase Storage uses private bucket with signed URLs"

insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', false)
on conflict (id) do nothing;

-- Admin can upload/delete objects in the project-images bucket
create policy "project_images_admin_upload"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'project-images'
  and (select auth.jwt()->'app_metadata'->>'role') = 'admin'
);

create policy "project_images_admin_update"
on storage.objects for update
to authenticated
using (
  bucket_id = 'project-images'
  and (select auth.jwt()->'app_metadata'->>'role') = 'admin'
);

create policy "project_images_admin_delete"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'project-images'
  and (select auth.jwt()->'app_metadata'->>'role') = 'admin'
);

-- Admin can read/list objects (for generating signed URLs in dashboard)
create policy "project_images_admin_select"
on storage.objects for select
to authenticated
using (
  bucket_id = 'project-images'
  and (select auth.jwt()->'app_metadata'->>'role') = 'admin'
);
