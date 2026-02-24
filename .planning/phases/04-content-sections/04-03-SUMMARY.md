---
phase: 04-content-sections
plan: 03
subsystem: ui
tags: [react, tanstack-router, embla-carousel, supabase, typescript]

# Dependency graph
requires:
  - phase: 04-content-sections P01
    provides: ProjectsSection on homepage, TanStack Router route stub for $projectId
  - phase: 04-content-sections P02
    provides: CareerSection and SkillsSection built and wired (runs in parallel)
provides:
  - Full project detail page at /projects/$projectId with carousel, tech chips, conditional links, prev/next navigation
  - Passthrough projects/route.tsx Outlet (no inline ProjectsSection overlay)
  - /about route redirects to / (dead CardExpandedContent removed)
  - usePublishedProjectsWithThumbnails hook that batch-signs thumbnail storage paths
  - Navbar hidden on project detail page via useMatchRoute
affects: [public-portfolio, phase-05, navigation]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - usePublishedProjects + sort_order sort for prev/next project navigation
    - Conditional link rendering (only render anchor if URL is non-null and non-empty)
    - Loading skeleton with isLoading guard before data render
    - Passthrough route pattern (parent route = Outlet only for TanStack file-based routing)
    - useMatchRoute to conditionally hide Navbar on child routes
    - Batch-sign thumbnail URLs in a dedicated hook to avoid separate signed-URL waterfall

key-files:
  created: []
  modified:
    - src/routes/__public/projects/route.tsx
    - src/routes/__public/projects/$projectId.tsx
    - src/routes/__public/about.tsx
    - src/routes/__public/route.tsx
    - src/hooks/useProjects.ts
    - src/components/ProjectsSection/ProjectsSection.tsx

key-decisions:
  - "sort_order column used (not display_order) for prev/next project navigation — matches actual DB schema"
  - "Carousel wrapped in px-10 container to provide clearance for CarouselPrevious/-Next absolute-positioned buttons"
  - "about.tsx replaced with beforeLoad redirect to / — dead CardExpandedContent route eliminated"
  - "Image carousel hidden entirely when images.length === 0 — avoids empty carousel UI"
  - "usePublishedProjectsWithThumbnails hook batch-signs thumbnail paths via getSignedImageUrls — prevents broken card thumbnails in ProjectsSection"
  - "Navbar hidden on /projects/$projectId via useMatchRoute in __public/route.tsx — detail page is full-bleed immersive"
  - "Native button element used for card click instead of motion.div onClick — improves a11y keyboard/screen-reader support"

patterns-established:
  - "Passthrough route pattern: parent route file exists for TanStack routing tree but renders only <Outlet />"
  - "Skeleton-first loading: single isLoading flag gates full page render with matching skeleton layout"
  - "Signed thumbnail hook: usePublishedProjectsWithThumbnails merges projects list with batch-signed URLs in one query"

requirements-completed: [CONT-02]

# Metrics
duration: 20min
completed: 2026-02-25
---

# Phase 4 Plan 03: Project Detail Page Summary

**Full-page project detail at /projects/$projectId with Embla carousel, signed thumbnail batch-signing, tech stack chips, conditional GitHub/live/case-study links, prev/next navigation — human-verified with all four Phase 4 content sections working end-to-end**

## Performance

- **Duration:** ~20 min
- **Started:** 2026-02-25T16:00:45Z
- **Completed:** 2026-02-25T19:33:06Z
- **Tasks:** 2 of 2 complete (Task 2 human-verify approved)
- **Files modified:** 6

## Accomplishments
- Replaced projects/route.tsx overlay pattern with passthrough `<Outlet />` — ProjectsSection lives on homepage only
- Built complete $projectId.tsx detail page: loading skeleton, 404 state, image carousel (hidden when empty), title, conditional links (GitHub/live/case study), tech stack chips above description, prev/next navigation
- Replaced about.tsx dead `CardExpandedContent` component with a `beforeLoad` redirect to `/`
- Added `usePublishedProjectsWithThumbnails` hook to batch-sign thumbnail storage paths so project card images load correctly
- Hid Navbar on /projects/$projectId via `useMatchRoute` in `__public/route.tsx` for a full-bleed detail experience
- Replaced motion.div card click with native `<button>` element for correct a11y keyboard/screen-reader behavior
- Human verification passed: all four content sections (About, Career, Skills, Projects) working end-to-end with real Supabase data

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix projects/route.tsx overlay and implement full project detail page** - `15dd8fc` (feat)
2. **Task 2: Post-checkpoint fixes (restore TagGroup/thumbnails/card click, navbar hide)** - `a8690e0` (fix)
3. **Task 2: Post-checkpoint fix (native button a11y)** - `ae0b3b4` (fix)
4. **Task 2: Post-checkpoint fix (sign thumbnail URLs, fix navbar useMatchRoute path)** - `74f7d50` (fix)
5. **Task 2: Post-checkpoint fix (remove decorative expand icon from cards)** - `0ebf0c0` (fix)

**Plan metadata:** `(pending — docs commit after this SUMMARY)`

## Files Created/Modified
- `src/routes/__public/projects/route.tsx` - Simplified to passthrough Outlet only (was ProjectsSection + motion overlay)
- `src/routes/__public/projects/$projectId.tsx` - Full detail page with carousel, links, tech chips, prev/next nav
- `src/routes/__public/about.tsx` - Replaced dead route with redirect to /
- `src/routes/__public/route.tsx` - Navbar hidden on project detail page via useMatchRoute
- `src/hooks/useProjects.ts` - Added usePublishedProjectsWithThumbnails hook for batch-signed thumbnail URLs
- `src/components/ProjectsSection/ProjectsSection.tsx` - Uses new thumbnail hook, native button element, restored TagGroup/Tag display

## Decisions Made
- `sort_order` used for prev/next navigation (plan called it `display_order` but actual DB schema column is `sort_order`)
- Carousel wrapped in `px-10` container to give clearance for the absolutely-positioned `CarouselPrevious`/`CarouselNext` buttons
- Image carousel is hidden entirely when `images.length === 0` to avoid empty carousel UI
- `about.tsx` replaced with `beforeLoad` redirect — CardExpandedContent is dead code, /about is a dead route
- `usePublishedProjectsWithThumbnails` added post-checkpoint — project card thumbnails require signed URLs since project-images bucket is private
- Navbar hidden on `/projects/$projectId` — detail page is full-bleed immersive, nav distracts from content
- Native `<button>` replaces motion.div click handler — satisfies a11y keyboard/focus requirements

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Used correct DB column name sort_order instead of display_order**
- **Found during:** Task 1 (prev/next navigation implementation)
- **Issue:** Plan specified `.sort((a, b) => a.display_order - b.display_order)` but the `projects` table schema uses `sort_order`, not `display_order`. Using `display_order` would cause TypeScript errors and undefined sort behavior.
- **Fix:** Changed sort key to `a.sort_order - b.sort_order` to match actual DB schema
- **Files modified:** src/routes/__public/projects/$projectId.tsx
- **Verification:** `npx tsc --noEmit` passes with no errors
- **Committed in:** 15dd8fc (Task 1 commit)

**2. [Rule 1 - Bug] Thumbnail images broken in project cards (unsigned private storage URLs)**
- **Found during:** Task 2 verification (human-verify checkpoint)
- **Issue:** ProjectsSection was passing raw `thumbnail_url` storage paths to Card image prop — private bucket requires signed URLs, so images returned 403/404.
- **Fix:** Added `usePublishedProjectsWithThumbnails` hook that batch-signs thumbnail paths via `getSignedImageUrls` before rendering; ProjectsSection switched to this hook.
- **Files modified:** src/hooks/useProjects.ts, src/components/ProjectsSection/ProjectsSection.tsx
- **Verification:** Project card thumbnails load correctly in dev server
- **Committed in:** 74f7d50

**3. [Rule 1 - Bug] Navbar visible on project detail page (useMatchRoute path mismatch)**
- **Found during:** Task 2 verification
- **Issue:** `__public/route.tsx` used TanStack file-route ID (`/__public/projects/$projectId`) instead of URL path (`/projects/$projectId`) in `useMatchRoute`, so hide-navbar logic never triggered.
- **Fix:** Changed `useMatchRoute` arg to `{ to: '/projects/$projectId' }` (URL path, not route ID).
- **Files modified:** src/routes/__public/route.tsx
- **Verification:** Navbar hidden when navigating to /projects/{uuid}
- **Committed in:** 74f7d50

**4. [Rule 2 - Missing Critical] Added a11y native button element for card click**
- **Found during:** Task 2 verification
- **Issue:** Card click used motion.div onClick — not keyboard-accessible or screen-reader friendly. Critical for a11y compliance.
- **Fix:** Replaced with native `<button>` element preserving existing styling and click handler.
- **Files modified:** src/components/ProjectsSection/ProjectsSection.tsx
- **Verification:** Card click works with keyboard Tab + Enter
- **Committed in:** ae0b3b4

---

**Total deviations:** 4 auto-fixed (2 bugs, 1 bug + 1 missing critical)
**Impact on plan:** All auto-fixes necessary for correctness, security (signed URLs), and accessibility. No scope creep.

## Issues Encountered
- Pre-existing ESLint error in ProjectForm.tsx (react-refresh/only-export-components) and warning in ImageUploadZone.tsx — these are not caused by this plan's changes, documented in STATE.md blockers.
- Post-checkpoint UAT revealed TagGroup/Tag component restoration needed after initial implementation used plain spans — restored for consistent single-line tag display in project cards.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- CONT-02 satisfied: full project detail page at /projects/{uuid} is live and human-verified
- All Phase 4 content sections complete: About (CONT-01), Projects detail (CONT-02), Skills (CONT-03), Career (CONT-04)
- Ready for Phase 5 (public portfolio polish / articles / contact sections)

---
*Phase: 04-content-sections*
*Completed: 2026-02-25*
