-- ============================================================
-- HELPER: reusable admin role check
-- Using (select ...) subquery wrapper for performance — avoids
-- per-row JWT decode. See RESEARCH.md Pattern 6.
-- ============================================================

-- ============================================================
-- PROJECTS RLS
-- ============================================================

alter table public.projects enable row level security;

create policy "projects_public_select"
on public.projects for select
to anon, authenticated
using (
  status = 'published'
  and deleted_at is null
);

create policy "projects_admin_select"
on public.projects for select
to authenticated
using (
  (select auth.jwt()->'app_metadata'->>'role') = 'admin'
);

create policy "projects_admin_insert"
on public.projects for insert
to authenticated
with check (
  (select auth.jwt()->'app_metadata'->>'role') = 'admin'
);

create policy "projects_admin_update"
on public.projects for update
to authenticated
using (
  (select auth.jwt()->'app_metadata'->>'role') = 'admin'
)
with check (
  (select auth.jwt()->'app_metadata'->>'role') = 'admin'
);

create policy "projects_admin_delete"
on public.projects for delete
to authenticated
using (
  (select auth.jwt()->'app_metadata'->>'role') = 'admin'
);

-- ============================================================
-- PROJECT IMAGES RLS
-- ============================================================

alter table public.project_images enable row level security;

create policy "project_images_public_select"
on public.project_images for select
to anon, authenticated
using (
  exists (
    select 1 from public.projects p
    where p.id = project_images.project_id
      and p.status = 'published'
      and p.deleted_at is null
  )
);

create policy "project_images_admin_select"
on public.project_images for select
to authenticated
using (
  (select auth.jwt()->'app_metadata'->>'role') = 'admin'
);

create policy "project_images_admin_insert"
on public.project_images for insert
to authenticated
with check (
  (select auth.jwt()->'app_metadata'->>'role') = 'admin'
);

create policy "project_images_admin_update"
on public.project_images for update
to authenticated
using (
  (select auth.jwt()->'app_metadata'->>'role') = 'admin'
)
with check (
  (select auth.jwt()->'app_metadata'->>'role') = 'admin'
);

create policy "project_images_admin_delete"
on public.project_images for delete
to authenticated
using (
  (select auth.jwt()->'app_metadata'->>'role') = 'admin'
);

-- ============================================================
-- SKILL CATEGORIES RLS
-- ============================================================

alter table public.skill_categories enable row level security;

create policy "skill_categories_public_select"
on public.skill_categories for select
to anon, authenticated
using (deleted_at is null);

create policy "skill_categories_admin_select"
on public.skill_categories for select
to authenticated
using (
  (select auth.jwt()->'app_metadata'->>'role') = 'admin'
);

create policy "skill_categories_admin_insert"
on public.skill_categories for insert
to authenticated
with check (
  (select auth.jwt()->'app_metadata'->>'role') = 'admin'
);

create policy "skill_categories_admin_update"
on public.skill_categories for update
to authenticated
using (
  (select auth.jwt()->'app_metadata'->>'role') = 'admin'
)
with check (
  (select auth.jwt()->'app_metadata'->>'role') = 'admin'
);

create policy "skill_categories_admin_delete"
on public.skill_categories for delete
to authenticated
using (
  (select auth.jwt()->'app_metadata'->>'role') = 'admin'
);

-- ============================================================
-- SKILLS RLS
-- ============================================================

alter table public.skills enable row level security;

create policy "skills_public_select"
on public.skills for select
to anon, authenticated
using (
  status = 'published'
  and deleted_at is null
);

create policy "skills_admin_select"
on public.skills for select
to authenticated
using (
  (select auth.jwt()->'app_metadata'->>'role') = 'admin'
);

create policy "skills_admin_insert"
on public.skills for insert
to authenticated
with check (
  (select auth.jwt()->'app_metadata'->>'role') = 'admin'
);

create policy "skills_admin_update"
on public.skills for update
to authenticated
using (
  (select auth.jwt()->'app_metadata'->>'role') = 'admin'
)
with check (
  (select auth.jwt()->'app_metadata'->>'role') = 'admin'
);

create policy "skills_admin_delete"
on public.skills for delete
to authenticated
using (
  (select auth.jwt()->'app_metadata'->>'role') = 'admin'
);

-- ============================================================
-- CAREER ENTRIES RLS
-- ============================================================

alter table public.career_entries enable row level security;

create policy "career_entries_public_select"
on public.career_entries for select
to anon, authenticated
using (
  status = 'published'
  and deleted_at is null
);

create policy "career_entries_admin_select"
on public.career_entries for select
to authenticated
using (
  (select auth.jwt()->'app_metadata'->>'role') = 'admin'
);

create policy "career_entries_admin_insert"
on public.career_entries for insert
to authenticated
with check (
  (select auth.jwt()->'app_metadata'->>'role') = 'admin'
);

create policy "career_entries_admin_update"
on public.career_entries for update
to authenticated
using (
  (select auth.jwt()->'app_metadata'->>'role') = 'admin'
)
with check (
  (select auth.jwt()->'app_metadata'->>'role') = 'admin'
);

create policy "career_entries_admin_delete"
on public.career_entries for delete
to authenticated
using (
  (select auth.jwt()->'app_metadata'->>'role') = 'admin'
);

-- ============================================================
-- CONTACT SUBMISSIONS RLS
-- Public can INSERT (submit form), admin can SELECT (read submissions)
-- No public SELECT — contact data is private
-- ============================================================

alter table public.contact_submissions enable row level security;

create policy "contact_submissions_public_insert"
on public.contact_submissions for insert
to anon, authenticated
with check (true);

create policy "contact_submissions_admin_select"
on public.contact_submissions for select
to authenticated
using (
  (select auth.jwt()->'app_metadata'->>'role') = 'admin'
);

create policy "contact_submissions_admin_delete"
on public.contact_submissions for delete
to authenticated
using (
  (select auth.jwt()->'app_metadata'->>'role') = 'admin'
);
