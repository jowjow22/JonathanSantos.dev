# Requirements: JonathanSantos.dev

**Defined:** 2026-02-23
**Core Value:** Visitors immediately see a polished, memorable portfolio that communicates technical skill through both the content AND the site itself

---

## v1 Requirements — COMPLETE (all 20 shipped in v1.0)

### Visual Experience

- [x] **VIS-01**: 3D fluid/organic hero background on homepage with mouse-reactive movement
- [x] **VIS-02**: Smooth page transitions between routes (enter/exit animations < 300ms)
- [x] **VIS-03**: Cursor-reactive elements (parallax, hover effects) on key sections
- [x] **VIS-04**: Dark/light mode toggle that persists across sessions

### Content Sections

- [x] **CONT-01**: About me section with bio and photo
- [x] **CONT-02**: Project detail pages with full descriptions, images, tech used, live/repo links
- [x] **CONT-03**: Skills/tech stack section with visual display and categories
- [x] **CONT-04**: Career timeline section (work history, education, milestones)

### Contact

- [x] **CNTC-01**: Contact form sends email notification to Jonathan via email service
- [x] **CNTC-02**: Contact form submissions stored in Supabase database
- [x] **CNTC-03**: Contact form validation with per-field error feedback

### Admin Dashboard

- [x] **ADMN-01**: Admin authentication with email/password (single user login/logout)
- [x] **ADMN-02**: Protected /admin/* routes that redirect to login if unauthenticated
- [x] **ADMN-03**: CRUD for projects (title, description, images, tech stack, live URL, repo URL, display order, published status)
- [x] **ADMN-04**: Image upload for project screenshots via Supabase Storage

### Backend

- [x] **BACK-01**: Supabase client integration (auth, database, storage)
- [x] **BACK-02**: Database schema with RLS policies (public SELECT, admin-only INSERT/UPDATE/DELETE)
- [x] **BACK-03**: TanStack Query hooks for data fetching, caching, and mutation invalidation

### Analytics & SEO

- [x] **SEO-01**: SEO meta tags per page (title, description, Open Graph tags)
- [x] **ANLY-01**: Analytics tracking for page views and project click-through

---

## v2 Requirements — Current Milestone (v2.0 Content & Experience)

### Admin Dashboard

- [ ] **ADMN-05**: Admin can create, edit, delete, and reorder skills (name, category, proficiency level, icon URL, sort order)
- [ ] **ADMN-06**: Admin can create, edit, delete, and reorder career timeline entries (title, company, date range, type, description)
- [ ] **ADMN-07**: Admin can edit key page texts (hero headline/tagline, section headings, Experience and Projects intro texts) from a single dashboard settings page
- [ ] **ADMN-08**: Admin can access a protected draft preview of any project before toggling it published

### Public Skills Section

- [ ] **SKILL-01**: Visitor sees skills organized in a grid by category
- [ ] **SKILL-02**: Hovering a skill reveals its proficiency label ("Daily driver" / "Proficient" / "Familiar") via tooltip
- [ ] **SKILL-03**: Skill icon displays with graceful fallback when URL is broken or missing

### Public Career Section

- [ ] **CARE-01**: Visitor experiences a scroll-driven career timeline where entries drift in/out with continuous parallax as they scroll
- [ ] **CARE-02**: Each career entry displays title, company, date range, type, and description
- [ ] **CARE-03**: Career scroll parallax is disabled on mobile/touch devices for smooth native scrolling

### Content & Texts

- [ ] **CONT-05**: Homepage hero headline, tagline, section headings, and section intro texts render from the editable page texts system with hardcoded fallbacks

---

## v3 Requirements (Deferred)

### Performance

- **PERF-01**: Lighthouse 90+ performance score
- **PERF-02**: Core Web Vitals optimization (LCP < 2.5s, CLS < 0.1, INP < 200ms)
- **PERF-03**: Structured data (JSON-LD for Person/Portfolio schema)

### Visual Polish

- **VIS-05**: Testimonials/recommendations section
- **VIS-06**: Open source contributions display

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| Blog/article authoring | Articles come from Dev.to integration (already working) |
| Multi-user auth / RBAC | Single admin only — no team access needed |
| Mobile native app | Web-first portfolio |
| Real-time features | Static portfolio content, no chat/notifications |
| SSR / Next.js migration | Existing Vite SPA works, would require full rewrite |
| Full page builder / WYSIWYG | Massive complexity for single admin |
| Video hosting | Storage/bandwidth costs, not needed |
| Skill proficiency percentage bars | Anti-pattern — arbitrary numbers trigger skepticism from technical recruiters |
| Snap/full-page scroll for career | Traps users, breaks mobile native scroll, not the requested UX |
| Token-based draft preview URLs | Next.js server-rendering concept; inapplicable to this SPA |
| Drag-to-reorder admin tables | `sort_order` number field covers infrequent edits without dnd-kit complexity |

---

## Traceability

Which phases cover which requirements.

### v1.0 Phases (complete)

| Requirement | Phase | Status |
|-------------|-------|--------|
| BACK-01 | Phase 1 | Complete |
| BACK-02 | Phase 1 | Complete |
| BACK-03 | Phase 1 | Complete |
| ADMN-01 | Phase 2 | Complete |
| ADMN-02 | Phase 2 | Complete |
| ADMN-03 | Phase 3 → Gap Closure 5.1, 5.2 | Complete |
| ADMN-04 | Phase 3 | Complete |
| CONT-01 | Phase 4 | Complete |
| CONT-02 | Phase 4 → Gap Closure 5.1, 5.2 | Complete |
| CONT-03 | Phase 4 | Complete |
| CONT-04 | Phase 4 | Complete |
| CNTC-01 | Phase 5 | Complete |
| CNTC-02 | Phase 5 | Complete |
| CNTC-03 | Phase 5 | Complete |
| VIS-01 | Phase 6 | Complete |
| VIS-02 | Phase 6 | Complete |
| VIS-03 | Phase 6 | Complete |
| VIS-04 | Phase 6 | Complete |
| SEO-01 | Phase 7 | Complete |
| ANLY-01 | Phase 7 | Complete |

### v2.0 Phases

| Requirement | Phase | Status |
|-------------|-------|--------|
| ADMN-05 | Phase 9 | Pending |
| ADMN-06 | Phase 9 | Pending |
| ADMN-07 | Phase 10 | Pending |
| ADMN-08 | Phase 13 | Pending |
| SKILL-01 | Phase 11 | Pending |
| SKILL-02 | Phase 11 | Pending |
| SKILL-03 | Phase 11 | Pending |
| CARE-01 | Phase 12 | Pending |
| CARE-02 | Phase 12 | Pending |
| CARE-03 | Phase 12 | Pending |
| CONT-05 | Phase 13 | Pending |

**Coverage:**
- v2.0 requirements: 11 total
- Mapped to phases: 11
- Unmapped: 0 ✓

---
*Requirements defined: 2026-02-23*
*Last updated: 2026-03-04 — v2.0 traceability filled (phases 8–13, 11/11 requirements mapped)*
