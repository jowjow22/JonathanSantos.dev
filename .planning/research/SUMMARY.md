# Project Research Summary

**Project:** JonathanSantos.dev v2.0 — Content & Experience Milestone
**Domain:** Premium developer portfolio SPA with headless admin CMS
**Researched:** 2026-03-02
**Confidence:** HIGH

## Executive Summary

JonathanSantos.dev v2.0 is not a greenfield build — it is a targeted feature milestone on top of an already-shipped React 19 / TanStack Router / Framer Motion 12 / Supabase portfolio. The existing stack is complete and requires zero new dependencies. The milestone has two parallel tracks: (1) admin CRUD expansion for Skills and Career content plus an editable page-texts system, and (2) public-facing UX upgrades that transform currently placeholder sections into premium, animated experiences. These tracks have a hard dependency order: admin forms must exist and be populated with real data before the public animation work can be meaningfully built or tuned.

The recommended architecture is surgical modification of existing patterns. Admin CRUD for Skills and Career entries mirrors the already-shipped Projects CRUD exactly — same react-hook-form + zod + TanStack Router + Supabase mutation pattern, same route file structure. Page texts use a flat `page_texts` key-value Supabase table (public SELECT, admin-only write via RLS), consumed by a new `usePageTexts()` TanStack Query hook with a 10-minute stale time. The public Career section gets a full replacement to a sticky-container + `useScroll` parallax pattern. The Skills section gets a targeted SkillChip upgrade with hover-reveal proficiency labels using `whileHover` and Radix Tooltip. Draft preview is implemented as a separate admin-guarded route that renders the public `ProjectDetail` component — never as a query-param bypass on the public route.

The primary risks are concentrated in the scroll-driven Career section: a confirmed production-build bug with `useScroll` requires `layoutEffect: false` on every call, mobile scroll jitter requires disabling parallax below 768px, and page-transition interference requires careful initialization timing. Draft preview carries a security risk if implemented naively. All other features (admin CRUD, page texts editor, SkillChip hover, draft preview routing) are low-risk and follow well-established patterns in the existing codebase.

---

## Key Findings

### Recommended Stack

The v2.0 feature set is 100% covered by the existing stack. No new packages. The four Framer Motion hooks needed for scroll animation (`useScroll`, `useTransform`, `useMotionValueEvent`, `useSpring`) have been stable since Motion v10 and are already installed at v12.23.x. TanStack Router's `validateSearch` is already used in the codebase and handles the draft preview search param pattern correctly. Supabase's standard CRUD pattern and RLS system handle the `page_texts` table without any CMS library.

Explicitly rejected: Lenis smooth scroll (conflicts with Framer Motion scroll tracking), GSAP (not in stack, duplicates Motion), Contentful/Sanity (overkill for 7-10 text fields), `react-intersection-observer` (Framer Motion `whileInView` covers this), `@supabase/ssr` (SPA, not SSR). After creating the `page_texts` migration, `npm run db:types` regenerates TypeScript types — this is the only setup step required before coding begins.

**Core technologies:**
- `motion@12.23.x` (`useScroll` + `useTransform` + `useSpring` + `whileHover`): scroll-driven parallax and hover animations — all APIs verified against official docs, stable since v10
- `@tanstack/react-router@1.130.x` (`validateSearch`, file-based routes): type-safe search params and admin route trees — established pattern already in codebase
- `@supabase/supabase-js@2.97.x`: `page_texts` table CRUD with RLS policies — standard library usage, same pattern as all other tables
- `@radix-ui/react-tooltip` (already installed): proficiency reveal on SkillChip hover — existing dependency, no new install
- `react-hook-form` + `zod` (already installed): SkillForm + CareerEntryForm — direct replication of ProjectForm pattern

### Expected Features

**Must have (table stakes) — v2.0 milestone is incomplete without all six:**
- Skills section renders real skills with hover-reveal proficiency — current placeholder signals unfinished product to visitors
- Career section renders real timeline with scroll parallax — current empty state is publicly visible
- Admin Skills CRUD (list, create, edit, delete) — only content type without admin management
- Admin Career Entry CRUD (list, create, edit, delete) — same gap as skills
- Admin Page Texts editor — hero and section copy editable without redeployment
- Admin Draft Preview for projects — standard CMS expectation; zero new infrastructure needed

**Should have (competitive differentiators):**
- Scroll-driven career parallax with per-entry `useScroll` tracking — cinematic depth effect that signals motion expertise
- Categorical proficiency labels ("Daily driver" / "Proficient" / "Familiar") — honest and defensible alternative to percentage bars
- Skill icon rendering with graceful broken-URL fallback — visual polish at the detail level
- Page texts with 10-min stale-time cache — proves admin system maturity without hammering Supabase quota

**Defer to v2.1+:**
- Skills filter/search by category — overkill for ~30 items; category headers are sufficient
- Drag-to-reorder in admin — `sort_order` number field covers infrequent edits without `dnd-kit` complexity
- Inline page editing — disproportionate complexity vs a separate admin form page
- Career entry rich text / markdown — plain textarea is correct for v2.0
- Real-time order propagation across browser tabs — Supabase Realtime is out of scope

**Anti-features to avoid explicitly:**
- Full-page scroll snapping on career timeline (traps users, breaks mobile native scroll)
- Proficiency percentage bars (arbitrary, triggers skepticism from technical recruiters)
- Secret-token draft preview URLs (Next.js draft mode is server-rendering only; inapplicable to this SPA)
- WYSIWYG rich text editor for career descriptions (serialization overhead for one plain-text paragraph)

### Architecture Approach

The v2.0 architecture extends the existing layered structure (Routes → TanStack Query Hooks → Service Functions → Supabase) with four new admin route trees and two new hooks, while modifying three existing public components. The entire admin side follows one pattern: route file → form component (react-hook-form + zod) → mutation hook → service function → Supabase upsert → `queryClient.invalidateQueries(rootKey.all)`. The public side has two distinct patterns: SkillChip is an additive enhancement (new props + Radix Tooltip), while CareerSection is a structural replacement (sticky container pattern replaces `whileInView`).

**Major components and their changes:**
1. `CareerSection.tsx` — REPLACED: tall outer div (scroll runway) + `position: sticky` inner panel + per-entry `useTransform` driven by a single container `scrollYProgress`; entries extracted into a `CareerEntryLayer` child component to keep hooks unconditional
2. `SkillChip.tsx` — MODIFIED: adds `proficiency` prop + Radix Tooltip; `whileHover` scale on `motion.div`; `onError` fallback for broken icon URLs inside a fixed-size wrapper
3. `admin/__guard/skills/*` + `admin/__guard/career/*` — NEW: full CRUD route trees mirroring `/admin/__guard/projects/*` exactly
4. `admin/__guard/page-texts/index.tsx` — NEW: single-form settings page (no list/detail split needed for a single-record table); one upsert call per save
5. `hooks/usePageTexts.ts` + `services/page-texts.service.ts` — NEW: `fetchPageTexts()` returns `Record<string, string>` keyed by text slot; 10-min stale time; `?? 'fallback'` in JSX prevents blank UI on missing keys
6. Draft preview — implemented as a SEPARATE admin-guarded route (`admin/__guard/projects/$projectId/preview`) that reuses the existing `ProjectDetail` component — NOT a search param on the public project detail route

### Critical Pitfalls

1. **`useScroll` stuck at 0 in Vite production builds** — Add `layoutEffect: false` to every `useScroll` call. Confirmed Motion GitHub issue #2452 affecting Vite production builds. Must test with `vite build && vite preview`, not only `vite dev`.

2. **Scroll parallax jitters on mobile** — Use `position: sticky` as the structural mechanism; disable `useTransform` y-drift on mobile entirely via the existing `use-mobile.ts` hook. Smooth on MacBook is not predictive of smooth on mid-range Android.

3. **Page transition / scroll measurement interference** — `AnimatedOutlet mode="wait"` holds the exiting route in DOM for 250ms while the entering route mounts. `useScroll` initialized during this overlap can measure the wrong DOM. Mitigate with `layoutEffect: false` and optionally gate scroll setup on `useIsPresent()`.

4. **Draft preview security hole** — Implementing preview as `?preview=true` on the public project detail route creates a publicly-discoverable URL that bypasses the `status = 'published'` filter. The correct implementation is a separate route under `admin/__guard/` that is unreachable without authentication.

5. **TanStack Query key mismatch leaves public cache stale after admin edits** — Mutations must invalidate the root key (`skillKeys.all`, `careerKeys.all`), not sub-keys. Mirror the exact pattern from `useDeleteProject`.

6. **`useTransform` hooks inside `.map()` violates Rules of Hooks** — If entry count changes between renders, hook call count changes and React throws. Extract each entry's motion values into a `CareerEntryLayer` child component so each component owns its own hooks unconditionally.

7. **`page_texts` RLS blocks public reads if policies are created out of order** — When RLS is enabled with no SELECT policy, all access is denied including anonymous reads. Create both policies (anon SELECT, admin write) and verify them before enabling RLS.

---

## Implications for Roadmap

Based on the dependency graph from research, a 6-phase build order is recommended. The core constraint: public section upgrades require real populated data, so admin CRUD must precede public animation work. The `page_texts` migration is a hard blocker for Phase 3 and must run first.

### Phase 1: DB Foundation
**Rationale:** The `page_texts` table does not yet exist. No UI work for page texts can begin until the table and TypeScript types are available. This is a short task that unblocks the entire milestone.
**Delivers:** `page_texts` table with correct RLS policies + regenerated `database.types.ts` + initial text rows seeded
**Addresses:** Pre-condition for Admin Page Texts editor and public homepage text rendering
**Avoids:** Pitfall 7 (RLS misconfiguration) — create and verify both policies before enabling RLS
**Research flag:** None — standard Supabase migration pattern used by all existing tables; skip phase research

### Phase 2: Admin CRUD — Skills and Career Entries
**Rationale:** Admin forms must be built and populated with real data before the public sections can be meaningfully built or animation heights tuned. Both entities follow the existing Projects CRUD pattern exactly — direct replication, low risk.
**Delivers:** Full admin CRUD for skills (with category dropdown), full admin CRUD for career entries; both added to AdminSidebar navigation
**Addresses:** Admin Skills CRUD + Admin Career CRUD features
**Uses:** react-hook-form, zod, TanStack Router file routes, TanStack Query mutations, Supabase
**Avoids:** Pitfall 5 (query key mismatch) — invalidate root keys `skillKeys.all` and `careerKeys.all` in every mutation's `onSuccess`
**Research flag:** None — direct replication of existing Projects pattern; skip phase research

### Phase 3: Admin Page Texts Editor
**Rationale:** Can be built independently of public UI changes. Building it before the public homepage integration ensures text values exist in the DB when public rendering is tested, preventing false positives from fallback strings.
**Delivers:** `/admin/page-texts` settings page; `usePageTexts()` hook with 10-min stale time; `page-texts.service.ts`; AdminSidebar link
**Addresses:** Admin Page Texts editor feature
**Avoids:** Pitfall 7 (RLS) — verify anon SELECT works and unauthenticated INSERT returns 403 before marking complete
**Research flag:** None — key-value CMS pattern is well-documented; skip phase research

### Phase 4: Public Skills Section — Hover-Reveal Upgrade
**Rationale:** Lower animation complexity than the Career section; a good proving ground for Framer Motion hover patterns before tackling sticky-scroll parallax. Requires Phase 2 data for proficiency values to display meaningfully.
**Delivers:** `SkillChip` with Radix Tooltip hover-reveal (categorical proficiency label); `whileHover` scale; broken icon URL `onError` fallback; stagger duration verified under 1.5s total
**Addresses:** Interactive skills grid differentiator feature
**Avoids:** Pitfall 4 (icon broken URL layout shift), Pitfall 8 (stagger animation too long on return navigation)
**Research flag:** None — `whileHover` + `AnimatePresence` is core Framer Motion; Radix Tooltip is already installed; skip phase research

### Phase 5: Public Career Section — Scroll-Driven Parallax
**Rationale:** Highest animation complexity in v2.0. All three scroll-specific pitfalls hit this phase. Isolated so that failures here do not block other phases. Must follow Phase 2 (real data required to tune `vh` heights correctly) and Phase 4 (simpler scroll work validates the team's comfort with MotionValue patterns).
**Delivers:** `CareerSection.tsx` replaced with sticky container + `useScroll` parallax; `CareerTimelineEntry.tsx` modified to accept `style` props; mobile parallax disabled via `use-mobile.ts`; `layoutEffect: false` on all `useScroll` calls
**Addresses:** Scroll-driven career timeline differentiator feature
**Avoids:** Pitfall 1 (`layoutEffect: false`), Pitfall 2 (mobile parallax disabled), Pitfall 3 (page transition scroll measurement), Pitfall 6 (hooks in `.map()` → `CareerEntryLayer` child component)
**Research flag:** Investigate iOS Safari `100vh` measurement behavior with address bar if sticky container height breaks on mobile Safari. The `dvh` CSS unit (iOS 15.4+) or `window.visualViewport.height` via JS may be required. Validate on a real device before marking this phase complete.

### Phase 6: Homepage Integration — Page Texts + Draft Preview
**Rationale:** Done last because it modifies two already-live, stable routes (`__public/index.tsx` and the project detail route). Requires Phase 3 (page text values in DB) and Phase 5 (Career section stable). Lowest risk if isolated to its own phase.
**Delivers:** `usePageTexts()` wired into hero and section headings with `?? 'fallback'` guards; admin-guarded draft preview route (`admin/__guard/projects/$projectId/preview`) rendering `ProjectDetail` with a "Preview mode" banner; "Preview" button on the project edit page navigating to the admin preview route
**Addresses:** Page texts hot-edit feature + Admin draft preview feature
**Avoids:** Pitfall 6 (draft preview security) — preview route lives under `admin/__guard/`, not on the public project route
**Research flag:** None — routing patterns are clear from existing codebase; skip phase research

### Phase Ordering Rationale

- **DB migration first:** Regenerating `database.types.ts` after the `page_texts` migration eliminates type errors across all subsequent phases. A single 15-minute task unblocks everything.
- **Admin before public:** Both public sections (Career, Skills) currently show "Content coming soon." Animating empty lists is wasted tuning effort. Real data from Phase 2 is required to set correct `vh` heights for the Career scroll runway and to populate meaningful proficiency values for the Skills hover reveal.
- **Skills before Career:** The Skills hover-reveal is a lower-risk animation task. It validates comfort with Framer Motion hover patterns before committing to the more complex `useScroll` sticky-container architecture in Phase 5.
- **Integration last:** Homepage and preview route changes touch stable production routes. Isolating them in the final phase minimizes regression risk to existing functionality.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 5 (Career scroll, iOS Safari):** Viewport height measurement on iOS Safari differs from desktop when the address bar is partially hidden. If `100vh` produces incorrect sticky container heights, research `dvh`/`svh` CSS units or `window.visualViewport.height`. Validate on a real iOS device before shipping.

Phases with standard patterns (skip `/gsd:research-phase` during roadmap):
- **Phase 1:** Supabase migration + RLS is documented and follows the existing tables pattern exactly
- **Phase 2:** Direct replication of existing Projects CRUD — no unknowns
- **Phase 3:** TanStack Query + Supabase key-value pattern — well-documented
- **Phase 4:** `whileHover` + Radix Tooltip — existing stack, no new integrations
- **Phase 6:** Route modifications with known patterns — no new architecture

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Direct codebase inspection confirmed all installed versions; Motion API calls verified against official v12 docs; zero new dependencies means zero version compatibility risk |
| Features | HIGH | Six features explicitly scoped with dependency graph; anti-features reasoned with concrete alternatives; existing component inventory read directly from source |
| Architecture | HIGH | Based on direct inspection of live production code (ProjectForm, useProjects, AnimatedOutlet); Motion scroll pattern verified against official docs and Olivier Larose tutorial; all new patterns extend live production code |
| Pitfalls | HIGH | Critical pitfalls backed by confirmed GitHub issues (#2452, #2770) and direct codebase inspection; security pitfall analysis is clear-cut for this auth model |

**Overall confidence:** HIGH

### Gaps to Address

- **iOS Safari `100vh` in sticky container:** The Career section scroll runway relies on `height: ${entries.length * 100}vh`. On iOS Safari with a visible address bar, `100vh` can exceed the actual visible viewport, causing the scroll sequence to end before the last entry is fully reached. Validate on a real iOS device during Phase 5 and fix with `100dvh` (iOS 15.4+) if needed.

- **`proficiency` column shape on the `skills` table:** Research assumes a proficiency enum column exists. If the column is missing or is typed as plain `text` rather than an enum, a migration is needed at the start of Phase 2. Verify against the actual DB schema before writing the SkillForm.

- **Skill categories admin UX scope:** Research recommends a collapsible category management panel on the skills admin list page. If the DB already has all expected categories pre-seeded, a read-only category dropdown in the skill form may be sufficient for v2.0 without building full category CRUD. Confirm category count before building.

- **`useIsPresent()` gating validation:** PITFALLS.md recommends gating Career section `useScroll` initialization on `useIsPresent()` from `motion/react` to avoid stale measurements during the 250ms AnimatePresence overlap window. This pattern needs live validation — if the 250ms delay before scroll tracking activates produces a visible pop or uncaught position jump, fall back to `layoutEffect: false` alone.

---

## Sources

### Primary (HIGH confidence)
- Motion official docs — [useScroll hook](https://motion.dev/docs/react-use-scroll) — offset string format, `target`/`container` options, `layoutEffect` flag
- Motion official docs — [Scroll animations guide](https://motion.dev/docs/react-scroll-animations) — `useScroll` + `useTransform` composition, hardware acceleration
- Motion official docs — [Reduce bundle size](https://motion.dev/docs/react-reduce-bundle-size) — `motion/react` vs `motion/react-client` import path distinction
- TanStack Router docs — [Search params validation with Zod](https://tanstack.com/router/latest/docs/framework/react/how-to/validate-search-params) — `validateSearch` pattern
- Supabase docs — [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security) — policy creation order and anon role behavior
- Supabase docs — [Custom claims and RBAC](https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac) — `auth.jwt() ->> 'user_role'` in RLS policies
- TanStack Query docs — [Query invalidation](https://tanstack.com/query/v5/docs/framework/react/guides/query-invalidation) — root key vs sub-key invalidation behavior
- Direct codebase inspection — AnimatedOutlet.tsx, CareerSection.tsx, CareerTimelineEntry.tsx, SkillsSection.tsx, SkillChip.tsx, ProjectForm.tsx, useProjects.ts, useSkills.ts, useCareer.ts, projects.service.ts, package.json, database.types.ts

### Secondary (MEDIUM confidence)
- Motion GitHub Issue #2452 — `useScroll` production build `layoutEffect` bug: [github.com/framer/motion/issues/2452](https://github.com/framer/motion/issues/2452)
- Motion GitHub Issue #2770 — `useScroll` jitter on mobile with `translateY`: [github.com/motiondivision/motion/issues/2770](https://github.com/motiondivision/motion/issues/2770)
- Olivier Larose — [Cards parallax with Framer Motion](https://blog.olivierlarose.com/tutorials/cards-parallax) — sticky container + per-section `useTransform` pattern (verified against official docs)
- Chrome Developer Blog — [Performant Parallaxing](https://developer.chrome.com/blog/performant-parallaxing) — compositor thread vs main thread scroll animation tradeoffs
- Lenis GitHub — integration conflicts with Framer Motion scroll tracking documented: [github.com/darkroomengineering/lenis](https://github.com/darkroomengineering/lenis)

### Tertiary (LOW confidence — used to inform exclusions)
- Payload CMS docs — draft preview token pattern — referenced to decide NOT to use token-based preview for a single-admin SPA (inapplicable server-rendering architecture)
- Contentstack blog — inline editing vs form editing — general guidance supporting separate admin form approach for headless-style architectures

---
*Research completed: 2026-03-02*
*Synthesized: 2026-03-04*
*Ready for roadmap: yes*
