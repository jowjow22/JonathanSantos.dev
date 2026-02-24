# Roadmap: JonathanSantos.dev

## Milestones

- ✅ **v1.0 Portfolio Foundation** — Phases 1–7 (shipped 2026-03-02)
- 🚧 **v2.0 Content & Experience** — Phases 8–13 (in progress)

## Phases

<details>
<summary>✅ v1.0 Portfolio Foundation (Phases 1–7) — SHIPPED 2026-03-02</summary>

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Backend Foundation** - Set up Supabase integration with auth, database schema, and data access layer
- [x] **Phase 2: Admin Authentication** - Implement secure admin access with login/logout and route protection (completed 2026-02-24)
- [x] **Phase 3: Admin Dashboard Core** - Build project CRUD interface with image upload capability (completed 2026-02-24)
- [x] **Phase 4: Content Sections** - Create public-facing About, Skills, Career, and Project detail pages (completed 2026-02-25)
- [x] **Phase 5: Contact System** - Integrate contact form with email notifications and database storage (completed 2026-02-28)
- [ ] **Phase 5.1: Env Schema & Admin Quick Fixes** - Remove unused env vars from Zod schema, fix AdminSidebar collapsible prop, add status filter to fetchProjectById (Gap Closure)
- [x] **Phase 5.2: Add case_study_url to Admin ProjectForm** - Add case_study_url input to ProjectForm schema and UI, wire to create/edit mutations (Gap Closure) (completed 2026-02-28)
- [x] **Phase 6: Visual Experience** - Implement 3D hero, page transitions, interactive elements, and theme toggle (completed 2026-03-01)
- [x] **Phase 7: SEO & Analytics** - Add meta tags and analytics tracking (completed 2026-03-02)

### Phase 1: Backend Foundation
**Goal**: Establish Supabase as the data and authentication backend with proper security policies
**Depends on**: Nothing (first phase)
**Requirements**: BACK-01, BACK-02, BACK-03
**Success Criteria** (what must be TRUE):
  1. Supabase client successfully connects and authenticates requests
  2. Database tables exist with RLS policies (public SELECT, admin-only INSERT/UPDATE/DELETE)
  3. TanStack Query hooks fetch data from Supabase with caching and automatic refetching
  4. Database schema includes tables for projects, skills, career entries, and contact submissions
**Plans**: 3 plans

Plans:
- [x] 01-01-PLAN.md — Supabase client setup: install packages, CLI init, env validation, typed client singleton
- [x] 01-02-PLAN.md — Database schema, RLS policies, auth hook, storage bucket, seed script
- [x] 01-03-PLAN.md — Service layer (DAL) + TanStack Query hooks for all entities + QueryClient wiring

### Phase 2: Admin Authentication
**Goal**: Single admin user can securely log in, log out, and access protected routes
**Depends on**: Phase 1
**Requirements**: ADMN-01, ADMN-02
**Success Criteria** (what must be TRUE):
  1. Admin can log in with email/password and stay authenticated across sessions
  2. Admin can log out from any page
  3. Unauthenticated visitors attempting to access /admin/* are redirected to login
  4. Authenticated admin can navigate to all /admin/* routes
**Plans**: 3 plans

Plans:
- [x] 02-01-PLAN.md — Route restructuring to /admin/* URLs + Supabase client sessionStorage config
- [x] 02-02-PLAN.md — Auth context hook (useAuthContext) + typed router context wiring in __root.tsx and main.tsx
- [x] 02-03-PLAN.md — Route guard (beforeLoad), login page implementation, smart /admin redirect, useLogout hook

### Phase 3: Admin Dashboard Core
**Goal**: Admin can create, edit, and publish project entries with images
**Depends on**: Phase 2
**Requirements**: ADMN-03, ADMN-04
**Success Criteria** (what must be TRUE):
  1. Admin can create a new project with title, description, tech stack, URLs, and display order
  2. Admin can upload project screenshots which are stored in Supabase Storage
  3. Admin can edit existing projects and changes save successfully
  4. Admin can delete projects and they are removed from both database and storage
  5. Admin can toggle published status to control what appears on public site
**Plans**: 6 plans

Plans:
- [x] 03-01-PLAN.md — Install deps + admin layout shell (AdminSidebar, SidebarProvider, Toaster, dashboard redirect)
- [x] 03-02-PLAN.md — Image service layer + useProjectImages hook + project hard delete with storage cleanup
- [x] 03-03-PLAN.md — Admin project list page (/admin/projects) + DeleteProjectDialog
- [x] 03-04-PLAN.md — Project form (create/edit routes, TechStackInput, ImageUploadZone, useBlocker)
- [x] 03-05-PLAN.md — Human verification of complete admin dashboard end-to-end
- [x] 03-06-PLAN.md — Gap closure: image upload click fix (rAF), logout button visibility (SidebarFooter), lint errors

### Phase 4: Content Sections
**Goal**: Visitors see complete About, Skills, Career, and Project detail content loaded from Supabase
**Depends on**: Phase 3
**Requirements**: CONT-01, CONT-02, CONT-03, CONT-04
**Success Criteria** (what must be TRUE):
  1. About section displays bio text and photo on homepage
  2. Skills section shows tech stack organized by categories with visual chip display
  3. Career timeline displays work history, education, and milestones in chronological order
  4. Clicking a project navigates to a detail page with full description, images, tech used, and links
  5. All content sections load data from Supabase and update when admin changes content
**Plans**: 3 plans

Plans:
- [x] 04-01-PLAN.md — DB migration (case_study_url), ProjectsSection data connection, Navbar + homepage section order
- [x] 04-02-PLAN.md — CareerSection + CareerTimelineEntry + SkillsSection + SkillChip components, wire into homepage
- [x] 04-03-PLAN.md — Project detail full page ($projectId.tsx), remove overlay pattern, visual verification checkpoint

### Phase 5: Contact System
**Goal**: Visitors can submit contact form and admin receives notifications
**Depends on**: Phase 4
**Requirements**: CNTC-01, CNTC-02, CNTC-03
**Success Criteria** (what must be TRUE):
  1. Contact form validates fields with per-field error messages
  2. Successful submission sends email notification to Jonathan
  3. Contact form submissions are stored in Supabase database
  4. User receives confirmation after successful submission
**Plans**: 3 plans

Plans:
- [x] 05-01-PLAN.md — Edge Function (send-contact-email): CORS, honeypot, Resend API call + config.toml verify_jwt = false
- [x] 05-02-PLAN.md — ContactForm rewrite: correct schema (name/email/message), dual submission (DB + Edge Function), loading/success/error states, honeypot field
- [x] 05-03-PLAN.md — Human setup (secrets + deploy) + end-to-end verification checkpoint

### Phase 5.1: Env Schema & Admin Quick Fixes
**Goal**: Remove deployment risks and correct spec deviations found during v1.0 milestone audit
**Depends on**: Phase 5
**Requirements**: ENV-01, ENV-02, F-02, F-03 (gap closure — no new requirements)
**Gap Closure**: Closes ENV-01, ENV-02, F-02, F-03 from v1.0-MILESTONE-AUDIT.md
**Success Criteria** (what must be TRUE):
  1. `VITE_DEV_API_KEY` and `VITE_MY_CONTACT_EMAIL` removed from Zod env schema — app starts without them
  2. AdminSidebar uses `collapsible="none"` — desktop sidebar is always-visible per spec
  3. `fetchPublishedProjectById` + `usePublishedProject` added — public route uses published-only fetch path
**Plans**: 1 plan

Plans:
- [ ] 05.1-01-PLAN.md — Zod schema cleanup (ENV-01, ENV-02), AdminSidebar collapsible fix (F-02), published project fetch split + route swap (F-03)

### Phase 5.2: Add case_study_url to Admin ProjectForm
**Goal**: Admin can set the case_study_url field through the project form UI
**Depends on**: Phase 5.1
**Requirements**: ADMN-03, CONT-02 (gap closure — fields already in DB and public page)
**Gap Closure**: Closes F-01 from v1.0-MILESTONE-AUDIT.md
**Success Criteria** (what must be TRUE):
  1. ProjectForm schema includes `case_study_url` optional field
  2. Form renders a URL input for case_study_url on create and edit pages
  3. Saving the form persists the value to the DB; public project detail page renders the link
**Plans**: 1 plan

Plans:
- [ ] 05.2-01-PLAN.md — Add case_study_url Zod schema entry, defaultValues (both branches), form.reset() sync, and FormField JSX to ProjectForm.tsx

### Phase 6: Visual Experience
**Goal**: Site has distinctive visual identity with 3D hero, smooth transitions, and interactive elements
**Depends on**: Phase 5
**Requirements**: VIS-01, VIS-02, VIS-03, VIS-04
**Success Criteria** (what must be TRUE):
  1. Homepage displays 3D fluid/organic hero background that responds to mouse movement
  2. Navigation between routes triggers smooth page transitions (< 300ms)
  3. Key sections have cursor-reactive elements (parallax, hover effects)
  4. Dark/light mode toggle works and persists user preference across sessions
  5. 3D elements are lazy-loaded and code-split to avoid impacting non-3D pages
**Plans**: 3 plans

Plans:
- [ ] 06-01-PLAN.md — AnimatedOutlet + route transitions (VIS-02) + useDarkMode hook + Navbar toggle + light mode CSS (VIS-04)
- [ ] 06-02-PLAN.md — Install R3F deps + GLSL blob shaders + BlobMesh + Hero3D lazy-loaded + hero section wiring (VIS-01)
- [ ] 06-03-PLAN.md — Career alternating slide-in + Skills stagger + Project card 3D tilt + hero parallax + contact fade-up (VIS-03)

### Phase 7: SEO & Analytics
**Goal**: Site is discoverable and trackable with proper SEO and analytics
**Depends on**: Phase 6
**Requirements**: SEO-01, ANLY-01
**Success Criteria** (what must be TRUE):
  1. Every page has unique meta tags (title, description, Open Graph tags)
  2. Analytics tracking captures page views and project click-through events
  3. Social media shares show correct preview images and descriptions
**Plans**: 2 plans

Plans:
- [x] 07-01-PLAN.md — TBD
- [x] 07-02-PLAN.md — TBD

</details>

---

### 🚧 v2.0 Content & Experience (In Progress)

**Milestone Goal:** Expand admin control to all remaining content types and deliver immersive public sections for Skills and Career — making the site feel complete and demonstrating motion expertise to every visitor.

- [ ] **Phase 8: DB Foundation** - Create page_texts table with correct RLS policies and regenerate TypeScript types
- [ ] **Phase 9: Admin CRUD — Skills & Career** - Full create/edit/delete/reorder for skills and career timeline entries
- [ ] **Phase 10: Admin Page Texts Editor** - Single-form settings page to edit all key homepage copy without redeployment
- [ ] **Phase 11: Public Skills Section** - Interactive skill grid with hover-reveal proficiency tooltips and graceful icon fallbacks
- [ ] **Phase 12: Public Career Section** - Scroll-driven parallax timeline where entries drift in 3D space as visitor scrolls
- [ ] **Phase 13: Homepage Integration & Draft Preview** - Wire page texts into public homepage and add protected admin draft preview

## Phase Details

### Phase 8: DB Foundation
**Goal**: The page_texts table exists in Supabase with correct RLS policies and TypeScript types are regenerated — unblocking all page-text work in phases 10 and 13
**Depends on**: Phase 7
**Requirements**: (prerequisite phase — unblocks ADMN-07 in Phase 10 and CONT-05 in Phase 13; no direct requirement owns the migration itself)
**Success Criteria** (what must be TRUE):
  1. `page_texts` table exists in Supabase with `key` (text, primary key) and `value` (text) columns
  2. Anonymous (public) SELECT on `page_texts` succeeds without authentication
  3. Unauthenticated INSERT/UPDATE on `page_texts` is rejected with a 403/RLS error
  4. `npm run db:types` completes without error and `database.types.ts` includes the `page_texts` table shape
  5. At least one seed row (e.g., `hero_headline`) exists confirming the table is live and readable
**Plans**: TBD

Plans:
- TBD

### Phase 9: Admin CRUD — Skills & Career
**Goal**: Admin can create, edit, delete, and reorder both skills and career timeline entries from the dashboard
**Depends on**: Phase 8
**Requirements**: ADMN-05, ADMN-06
**Success Criteria** (what must be TRUE):
  1. Admin can create a skill with name, category, proficiency level, icon URL, and sort order — entry appears in skills list immediately
  2. Admin can edit an existing skill and save changes — public skills section reflects the update on next load
  3. Admin can delete a skill — it disappears from both the admin list and the public section
  4. Admin can create a career entry with title, company, date range, type, and description — entry appears in career list immediately
  5. Admin can edit and delete career entries — changes are reflected on the public Career section on next load
**Plans**: TBD

Plans:
- TBD

### Phase 10: Admin Page Texts Editor
**Goal**: Admin can edit all key page copy (hero headline/tagline, section headings, intro texts) from a single dashboard settings page without redeployment
**Depends on**: Phase 8
**Requirements**: ADMN-07
**Success Criteria** (what must be TRUE):
  1. Admin navigates to a Page Texts settings page in the dashboard sidebar
  2. All editable text fields (hero headline, hero tagline, section headings, Experience intro, Projects intro) are visible on a single form
  3. Admin saves all changes with one Save button — values are upserted to the `page_texts` table
  4. Navigating away and returning to the settings page shows the last-saved values
**Plans**: TBD

Plans:
- TBD

### Phase 11: Public Skills Section
**Goal**: Visitors see a complete, interactive skills grid where hovering a skill reveals its proficiency label and broken icon URLs degrade gracefully
**Depends on**: Phase 9
**Requirements**: SKILL-01, SKILL-02, SKILL-03
**Success Criteria** (what must be TRUE):
  1. Visitor sees all skills organized in a grid grouped by category, loaded from Supabase
  2. Hovering a SkillChip reveals a tooltip with the proficiency label ("Daily driver", "Proficient", or "Familiar") — tooltip disappears on mouse-out
  3. A skill with a broken or missing icon URL displays a fallback icon instead of a broken image or blank space
  4. The skills grid animates in with a stagger on page load (total stagger duration under 1.5 seconds)
**Plans**: TBD

Plans:
- TBD

### Phase 12: Public Career Section
**Goal**: Visitors experience a scroll-driven career timeline where each entry drifts in with parallax depth as they scroll — disabled on mobile for smooth native scrolling
**Depends on**: Phase 9
**Requirements**: CARE-01, CARE-02, CARE-03
**Success Criteria** (what must be TRUE):
  1. Scrolling through the Career section causes entries to drift in/out with visible parallax depth (y-axis motion tied to scroll position)
  2. Each career entry displays title, company, date range, type, and description
  3. On a mobile or touch device, the parallax effect is disabled and entries are displayed in a standard static layout with no scroll jitter
  4. The section renders correctly in a Vite production build (`vite build && vite preview`) — not just in dev mode
**Plans**: TBD

Plans:
- TBD

### Phase 13: Homepage Integration & Draft Preview
**Goal**: Homepage hero and section headings render from the editable page texts system, and admin can preview any unpublished project before going live
**Depends on**: Phase 10, Phase 12
**Requirements**: CONT-05, ADMN-08
**Success Criteria** (what must be TRUE):
  1. Homepage hero headline and tagline display the values from the `page_texts` table; if a key is missing, a hardcoded fallback string is shown (no blank space)
  2. Section headings and intro texts on the homepage also render from `page_texts` with hardcoded fallbacks
  3. Admin can click a "Preview" button on a project edit page and see the full project detail page — including unpublished projects — in a protected admin route
  4. The draft preview route is unreachable without authentication (unauthenticated access redirects to login)
  5. Updating a page text in the admin settings page and refreshing the public homepage reflects the new value within the TanStack Query stale time (10 minutes)
**Plans**: TBD

Plans:
- TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 5.1 → 5.2 → 6 → 7 → 8 → 9 → 10 → 11 → 12 → 13

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Backend Foundation | v1.0 | 3/3 | Complete | 2026-02-24 |
| 2. Admin Authentication | v1.0 | 3/3 | Complete | 2026-02-24 |
| 3. Admin Dashboard Core | v1.0 | 6/6 | Complete | 2026-02-25 |
| 4. Content Sections | v1.0 | 3/3 | Complete | 2026-02-25 |
| 5. Contact System | v1.0 | 3/3 | Complete | 2026-02-28 |
| 5.1. Env Schema & Admin Quick Fixes | v1.0 | 0/1 | Not started | - |
| 5.2. Add case_study_url to Admin ProjectForm | v1.0 | 0/1 | Complete | 2026-02-28 |
| 6. Visual Experience | v1.0 | 3/3 | Complete | 2026-03-01 |
| 7. SEO & Analytics | v1.0 | 2/2 | Complete | 2026-03-02 |
| 8. DB Foundation | v2.0 | 0/TBD | Not started | - |
| 9. Admin CRUD — Skills & Career | v2.0 | 0/TBD | Not started | - |
| 10. Admin Page Texts Editor | v2.0 | 0/TBD | Not started | - |
| 11. Public Skills Section | v2.0 | 0/TBD | Not started | - |
| 12. Public Career Section | v2.0 | 0/TBD | Not started | - |
| 13. Homepage Integration & Draft Preview | v2.0 | 0/TBD | Not started | - |
