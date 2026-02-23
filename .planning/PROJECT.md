# JonathanSantos.dev

## What This Is

A personal portfolio website for Jonathan Santos — a developer portfolio that showcases work, expertise, career path, and skills to recruiters, potential clients, and the dev community. It combines bold visual design (3D hero, page transitions, scroll animations) with a clean professional feel. Includes a private admin dashboard for managing all content through a CMS-like interface backed by Supabase.

## Core Value

Visitors immediately see a polished, memorable portfolio that communicates technical skill through both the content AND the site itself — the experience is the proof.

## Requirements

### Validated

- ✓ Public homepage with hero section — existing
- ✓ Projects carousel/gallery on homepage — existing
- ✓ Articles section fetching from Dev.to API — existing
- ✓ Contact form with validation — existing
- ✓ Responsive design with mobile detection — existing
- ✓ Navbar with navigation — existing
- ✓ Card component system with variants and animations — existing
- ✓ Typography system — existing
- ✓ File-based routing with TanStack Router — existing
- ✓ Scroll reveal animations — existing

### Active

- [ ] 3D fluid/organic hero background that sets the visual tone
- [ ] Page transitions between routes
- [ ] About me section with bio and photo
- [ ] Skills/tech stack section with visual display
- [ ] Career timeline section (work history, education, milestones)
- [ ] Project detail pages with full descriptions, images, links
- [ ] Admin dashboard at /admin/* with protected routes
- [ ] Supabase integration for auth and data storage
- [ ] Single admin authentication (just Jonathan)
- [ ] Dashboard: CRUD for projects (images, descriptions, tech used, links)
- [ ] Dashboard: CRUD for skills (categories, proficiency levels)
- [ ] Dashboard: CRUD for career timeline entries
- [ ] Dashboard: Edit key page texts/sections
- [ ] Lighthouse 90+ performance scores / Core Web Vitals optimization
- [ ] Analytics tracking (visitor behavior, clicks)

### Out of Scope

- Blog/article authoring in dashboard — articles come from Dev.to
- Multi-user auth or team access — single admin only
- Separate backend API — using Supabase BaaS
- Mobile native app — web-first
- E-commerce or payments — portfolio only
- Real-time features (chat, notifications) — static portfolio content

## Context

- Brownfield project with existing React 19 + TanStack Router + Framer Motion + Tailwind CSS + Radix UI stack
- Existing card system, typography system, form system, and animation primitives already built
- Dev.to integration already working for articles
- No backend currently — Supabase will be added for dashboard data and auth
- Design direction: between Brittany Chiang (clean/minimal) and Bruno Simon (full 3D) — bold visual elements like a fluid 3D hero and page transitions, but content stays clean and readable
- Content will be created primarily through the dashboard, partial content exists today

## Constraints

- **Tech stack**: Build on existing React 19 / TanStack Router / Framer Motion / Tailwind stack — no framework migration
- **Backend**: Supabase for all server-side needs (auth, database, storage)
- **Performance**: Lighthouse 90+ despite 3D/animation elements — lazy loading, code splitting critical
- **Auth**: Single admin user only — simple auth flow, no RBAC complexity
- **Hosting**: Static SPA deployment (current setup)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Supabase as backend | Quick setup, free tier, auth + DB + storage in one | — Pending |
| Dashboard in same app | Simpler deployment, shared components, protected routes | — Pending |
| Keep Dev.to for articles | Already working, write once publish everywhere | — Pending |
| 3D fluid/organic hero | Sets visual tone without overwhelming content | — Pending |
| Single-admin auth | Only Jonathan manages content, no RBAC needed | — Pending |

---
*Last updated: 2026-02-23 after initialization*
