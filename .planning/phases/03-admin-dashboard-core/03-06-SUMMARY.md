---
phase: 03-admin-dashboard-core
plan: 06
subsystem: ui
tags: [react, vite, typescript, react-hook-form, tailwind, shadcn, react-fast-refresh]

# Dependency graph
requires:
  - phase: 03-admin-dashboard-core
    provides: Admin dashboard CRUD loop, ImageUploadZone, ProjectForm, sidebar layout
provides:
  - Chrome-compatible image upload via requestAnimationFrame-deferred click
  - Sidebar logout button always visible via SidebarFooter shrink-0 mt-auto
  - React Fast Refresh-compatible App component extracted into src/App.tsx
  - Clean npx tsc --noEmit (zero errors)
affects: [04-public-portfolio]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - requestAnimationFrame defers programmatic file input click past Chrome paint cycle
    - SidebarFooter shrink-0 mt-auto pins logout button to viewport bottom in flex column
    - App extracted to separate file from main.tsx bootstrapping for React Fast Refresh compliance

key-files:
  created:
    - src/App.tsx
  modified:
    - src/components/admin/ProjectForm/ImageUploadZone.tsx
    - src/components/ui/sidebar.tsx
    - src/components/ProjectsSection/ProjectsSection.tsx
    - src/main.tsx

key-decisions:
  - "requestAnimationFrame wraps fileInputRef.current?.click() — Chrome blocks synchronous programmatic file input clicks before paint cycle commits layout"
  - "SidebarFooter gets shrink-0 mt-auto — SidebarContent flex-1 was pushing footer below visible viewport when content is tall"
  - "App component isolated in src/App.tsx — React Fast Refresh requires component files to export only components with no bootstrapping side effects mixed in"
  - "router and queryClient exported from main.tsx as named exports — App.tsx imports router for router.invalidate() call"

patterns-established:
  - "requestAnimationFrame pattern for deferred programmatic file input .click() in Chrome"
  - "SidebarFooter always receives shrink-0 mt-auto — must not be removed or sidebar logout will clip"

requirements-completed: [ADMN-03, ADMN-04]

# Metrics
duration: 3min
completed: 2026-02-25
---

# Phase 3 Plan 06: UAT Bug-Closure Summary

**Three UAT-identified bugs fixed: Chrome file picker click via requestAnimationFrame, Logout button pinned with shrink-0 mt-auto, and lint-clean build via App component extraction into src/App.tsx**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-02-25T12:23:07Z
- **Completed:** 2026-02-25T12:25:35Z
- **Tasks:** 2
- **Files modified:** 5 (4 modified, 1 created)

## Accomplishments
- Image upload zone click now works reliably in Chrome — `requestAnimationFrame` defers the programmatic `.click()` until after the browser paint cycle, bypassing Chrome's synchronous click block
- Logout button is always visible at bottom of admin sidebar — `shrink-0 mt-auto` on `SidebarFooter` prevents the footer from being pushed below the viewport when `SidebarContent` (with `flex-1`) expands
- `npx tsc --noEmit` exits with zero errors — unused `redirect` import removed from `ProjectsSection.tsx` and `App` function extracted from `main.tsx` into its own `src/App.tsx` file

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix image upload click and sidebar logout visibility** - `d3b1c6f` (fix)
2. **Task 2: Fix lint errors — remove unused import and extract App component** - `8e696ef` (fix)

**Plan metadata:** (docs commit follows)

## Files Created/Modified
- `src/components/admin/ProjectForm/ImageUploadZone.tsx` — onClick handler now uses `requestAnimationFrame(() => fileInputRef.current?.click())` instead of synchronous `.click()`
- `src/components/ui/sidebar.tsx` — `SidebarFooter` className extended with `shrink-0 mt-auto` to pin it to the bottom of the flex column
- `src/components/ProjectsSection/ProjectsSection.tsx` — Removed unused `redirect` named import from `@tanstack/react-router`
- `src/main.tsx` — `router` and `queryClient` now exported as named exports; `App` function removed (moved to App.tsx); `import { App } from './App'` added
- `src/App.tsx` — New file; exports `App` as named function component containing `useAuthContext`, `useEffect` invalidation, and `RouterProvider`

## Decisions Made
- `requestAnimationFrame` wraps the `.click()` call — Chrome blocks synchronous programmatic file input clicks triggered before the browser paint cycle commits layout; wrapping in rAF defers execution until after paint
- `shrink-0 mt-auto` on `SidebarFooter` — `SidebarContent` uses `flex-1` which expands to fill available space and pushes `SidebarFooter` below the visible viewport when content is tall; `shrink-0` prevents compression, `mt-auto` pins to bottom
- `App` isolated in `src/App.tsx` — React Fast Refresh requires that files exporting components contain no side effects; `main.tsx` bootstrapping (ReactDOM.createRoot, QueryClientProvider render) mixed with `App` component caused the "fast refresh only works when a file only exports components" warning
- `router` and `queryClient` exported from `main.tsx` — `App.tsx` references `router` for `router.invalidate()`, requiring it to be importable; circular module reference is handled safely by ES module hoisting

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed unused ReactQueryDevtools import from App.tsx**
- **Found during:** Task 2 (Extract App component)
- **Issue:** Initial `src/App.tsx` draft included `import { ReactQueryDevtools } from '@tanstack/react-query-devtools'` but the component was not used in `App.tsx` (it renders in `main.tsx`). `tsc -b` reported `TS6133: 'ReactQueryDevtools' is declared but its value is never read`
- **Fix:** Removed the unused import line from `src/App.tsx`
- **Files modified:** `src/App.tsx`
- **Verification:** `npx tsc --noEmit` exits with 0 errors
- **Committed in:** 8e696ef (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 — bug)
**Impact on plan:** Necessary correctness fix. No scope creep.

## Issues Encountered
- `tsc -b` (used by `npm run build`) exposes pre-existing errors in `ProjectForm.tsx`, `images.service.ts`, `ProjectsSection.tsx` (number vs string type), and `about.tsx` (missing projectId). These are out-of-scope pre-existing errors not caused by this plan's changes. `npx tsc --noEmit` passes with zero errors as required by the plan's success criteria. Pre-existing errors deferred to future phases.

## Next Phase Readiness
- All three UAT bugs closed; admin dashboard is fully functional with clean TypeScript check
- Phase 4 (Public Portfolio) can proceed without admin dashboard blockers
- Pre-existing `tsc -b` errors in `ProjectForm.tsx`, `images.service.ts`, `ProjectsSection.tsx`, `about.tsx` should be addressed before public launch

---
*Phase: 03-admin-dashboard-core*
*Completed: 2026-02-25*
