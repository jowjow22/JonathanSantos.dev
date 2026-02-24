# JonathanSantos.dev

## What This Is

A personal portfolio website for Jonathan Santos — a developer portfolio that showcases work, expertise, career path, and skills to recruiters, potential clients, and the dev community. It combines bold visual design (3D hero, page transitions, scroll animations) with a clean professional feel. Includes a private admin dashboard for managing all content through a CMS-like interface backed by Supabase.

## Core Value

Visitors immediately see a polished, memorable portfolio that communicates technical skill through both the content AND the site itself — the experience is the proof.

## Current Milestone: v2.0 Content & Experience

**Goal:** Expand admin control to all remaining content types and deliver immersive public sections for Skills and Career.

**Target features:**
- Interactive Skills section (hover reveals proficiency/details)
- Scroll-driven Career section (continuous parallax, entries drift in 3D space)
- Admin CRUD for skills (name, category, proficiency, icon URL, order)
- Admin CRUD for career timeline entries (title, company, dates, type, description)
- Admin page texts editor (hero headline/tagline, section headings, Experience/Projects intro)
- Admin draft preview for projects before publishing

## Requirements

### Validated

- ✓ Public homepage with hero section — v1.0
- ✓ Projects carousel/gallery on homepage — v1.0
- ✓ Articles section fetching from Dev.to API — v1.0
- ✓ Contact form with validation + email notification + DB storage — v1.0
- ✓ Responsive design with mobile detection — v1.0
- ✓ Navbar with navigation — v1.0
- ✓ Card component system with variants and animations — v1.0
- ✓ Typography system — v1.0
- ✓ File-based routing with TanStack Router — v1.0
- ✓ Scroll reveal animations — v1.0
- ✓ 3D fluid/organic hero background — v1.0
- ✓ Page transitions between routes — v1.0
- ✓ About me section with bio and photo — v1.0
- ✓ Project detail pages with full descriptions, images, links — v1.0
- ✓ Admin dashboard at /admin/* with protected routes — v1.0
- ✓ Supabase integration for auth and data storage — v1.0
- ✓ Single admin authentication (just Jonathan) — v1.0
- ✓ Dashboard: CRUD for projects (images, descriptions, tech used, links) — v1.0
- ✓ Analytics tracking (visitor behavior, clicks) — v1.0
- ✓ SEO meta tags + Open Graph per page — v1.0

### Active

- [ ] Interactive public Skills section with hover-reveal details
- [ ] Scroll-driven public Career section with continuous parallax and 3D depth
- [ ] Dashboard: CRUD for skills (categories, proficiency levels, icon, order)
- [ ] Dashboard: CRUD for career timeline entries
- [ ] Dashboard: Edit key page texts (hero, section headings, section intros)
- [ ] Dashboard: Draft preview for projects before publishing

### Out of Scope

### Out of Scope

- Blog/article authoring in dashboard — articles come from Dev.to
- Multi-user auth or team access — single admin only
- Separate backend API — using Supabase BaaS
- Mobile native app — web-first
- E-commerce or payments — portfolio only
- Real-time features (chat, notifications) — static portfolio content

## Context

- React 19 + TanStack Router + Framer Motion + Tailwind CSS + Radix UI + shadcn/ui stack (v1.0 complete)
- Supabase backend live: auth, database (projects, skills, career_entries, contact_submissions tables), storage (project-images bucket), RLS, Access Token Hook
- Admin dashboard live: project CRUD with image upload, publish toggle, navigation guard
- Public site live: hero (3D blob), about, projects carousel + detail pages, contact form, GA4 analytics, page transitions, scroll reveals, dark/light mode
- Skills and Career sections currently show "coming soon" placeholder — data exists in Supabase but no public UI built
- Design direction: immersive but readable — Skills section interactive grid, Career section cinematic scroll experience
- page_texts table does not yet exist in DB — needs migration in v2.0

## Constraints

- **Tech stack**: Build on existing React 19 / TanStack Router / Framer Motion / Tailwind stack — no framework migration
- **Backend**: Supabase for all server-side needs (auth, database, storage)
- **Performance**: Lighthouse 90+ despite 3D/animation elements — lazy loading, code splitting critical
- **Auth**: Single admin user only — simple auth flow, no RBAC complexity
- **Hosting**: Static SPA deployment (current setup)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Supabase as backend | Quick setup, free tier, auth + DB + storage in one | ✓ Good |
| Dashboard in same app | Simpler deployment, shared components, protected routes | ✓ Good |
| Keep Dev.to for articles | Already working, write once publish everywhere | ✓ Good |
| 3D fluid/organic hero | Sets visual tone without overwhelming content | ✓ Good |
| Single-admin auth | Only Jonathan manages content, no RBAC needed | ✓ Good |
| sessionStorage for auth | Sessions expire on browser close, survive hot reload | ✓ Good |
| Scroll-driven career section | Cinematic entry-by-entry experience vs static timeline | — Pending |
| page_texts in Supabase DB | Editable copy without redeployment | — Pending |

---
*Last updated: 2026-03-02 after v2.0 milestone start*
