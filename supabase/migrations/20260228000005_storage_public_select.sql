-- Allow public (anon + authenticated) users to generate signed URLs for images
-- that belong to published projects.
--
-- Root cause: the project-images bucket only had admin SELECT on storage.objects,
-- so createSignedUrls() returned signedURL: null for public visitors, causing
-- thumbnail_url to resolve to null and images to not render on the homepage
-- and project detail page.
--
-- The check joins storage.objects.name (which is the storage_path like
-- "{projectId}/{uuid}.ext") against project_images and projects to confirm
-- the image's project is published and not soft-deleted.

create policy "project_images_public_select"
on storage.objects for select
to anon, authenticated
using (
  bucket_id = 'project-images'
  and exists (
    select 1
    from public.project_images pi
    join public.projects p on p.id = pi.project_id
    where pi.storage_path = name
      and p.status = 'published'
      and p.deleted_at is null
  )
);
