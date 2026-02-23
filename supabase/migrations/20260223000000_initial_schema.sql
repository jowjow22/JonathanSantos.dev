-- Enable required extensions
create extension if not exists "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================

create type public.content_status as enum ('draft', 'published', 'archived');

create type public.career_entry_type as enum ('job', 'education', 'milestone');

-- ============================================================
-- SKILL CATEGORIES (must come before skills due to FK)
-- ============================================================

create table public.skill_categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz
);

-- ============================================================
-- SKILLS
-- ============================================================

create table public.skills (
  id          uuid primary key default gen_random_uuid(),
  category_id uuid references public.skill_categories(id) on delete set null,
  name        text not null,
  icon_url    text,
  proficiency smallint check (proficiency between 1 and 5),
  sort_order  int  not null default 0,
  status      public.content_status not null default 'draft',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz
);

-- ============================================================
-- PROJECTS
-- ============================================================

create table public.projects (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  description    text,
  tech_stack     text[] not null default '{}',
  live_url       text,
  repo_url       text,
  thumbnail_url  text,
  sort_order     int  not null default 0,
  is_featured    boolean not null default false,
  status         public.content_status not null default 'draft',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  deleted_at     timestamptz
);

-- ============================================================
-- PROJECT IMAGES (gallery)
-- ============================================================

create table public.project_images (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects(id) on delete cascade,
  storage_path text not null,
  alt_text    text,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ============================================================
-- CAREER ENTRIES
-- ============================================================

create table public.career_entries (
  id          uuid primary key default gen_random_uuid(),
  type        public.career_entry_type not null,
  title       text not null,
  company     text,
  location    text,
  description text,
  start_date  date not null,
  end_date    date,
  is_current  boolean not null default false,
  sort_order  int  not null default 0,
  status      public.content_status not null default 'draft',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz
);

-- ============================================================
-- CONTACT SUBMISSIONS
-- ============================================================

create table public.contact_submissions (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  message     text not null,
  read_at     timestamptz,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- INDEXES
-- ============================================================

create index on public.projects (sort_order) where deleted_at is null;
create index on public.projects (status) where deleted_at is null;
create index on public.skills (category_id) where deleted_at is null;
create index on public.career_entries (type, start_date desc) where deleted_at is null;
create index on public.project_images (project_id, sort_order);
