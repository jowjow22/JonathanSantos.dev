---
phase: 03-admin-dashboard-core
plan: 01
subsystem: ui
tags: [react, shadcn, sidebar, tanstack-router, sonner, dnd-kit, react-dropzone]

# Dependency graph
requires:
  - phase: 02-admin-authentication
    provides: Auth guard route (/admin/__guard/route.tsx) and useLogout hook that the sidebar wraps
provides:
  - Admin layout shell with persistent left sidebar (AdminSidebar.tsx)
  - SidebarProvider wrapping all guard-protected routes
  - Toaster (sonner) mounted once in admin layout for app-wide toast access
  - /admin/dashboard redirect to /admin/projects
affects:
  - 03-admin-dashboard-core (all subsequent plans rely on this layout shell)

# Tech tracking
tech-stack:
  added:
    - react-dropzone@15 (drag-and-drop file zone for image upload in plan 03)
    - "@dnd-kit/core@6 (drag-and-drop DnD kit core)"
    - "@dnd-kit/sortable@10 (image reordering in plan 03)"
    - sonner@2 (toast notifications)
    - shadcn alert-dialog component (delete confirmation modal in plan 03)
    - shadcn sonner component wrapper (Toaster UI wrapper)
  patterns:
    - SidebarProvider wrapping admin guard layout — all admin pages inherit sidebar context
    - Toaster mounted once at layout level — any component can call toast() from sonner
    - collapsible="none" on Sidebar — always-visible on desktop, offcanvas via Sheet on mobile

key-files:
  created:
    - src/components/admin/AdminSidebar.tsx
    - src/components/ui/alert-dialog.tsx
    - src/components/ui/sonner.tsx
  modified:
    - src/routes/admin/__guard/route.tsx
    - src/routes/admin/__guard/dashboard.tsx
    - package.json
    - package-lock.json

key-decisions:
  - "collapsible='none' on Sidebar component — enforces always-visible on desktop per CONTEXT.md locked decision; offcanvas (Sheet) handles mobile automatically via shadcn Sidebar primitives"
  - "dashboard.tsx redirects to /admin/projects which does not yet exist — safe to set now, fails gracefully as 404 until plan 03 creates the route"
  - "Toaster placed at SidebarProvider root level — mounted once, available to all nested admin route components"

patterns-established:
  - "Admin layout shell pattern: SidebarProvider > AdminSidebar + main(header + Outlet) + Toaster"
  - "SidebarTrigger wrapped in md:hidden div — hamburger only visible on mobile"

requirements-completed: [ADMN-03, ADMN-04]

# Metrics
duration: 2min
completed: 2026-02-24
---

# Phase 3 Plan 01: Admin Dashboard Layout Shell Summary

**Persistent left sidebar with Projects nav and Logout button, SidebarProvider/Toaster admin layout, and pre-installed drag-and-drop + toast dependencies for Phase 3**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-24T18:09:46Z
- **Completed:** 2026-02-24T18:11:46Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments

- Installed react-dropzone, @dnd-kit/core, @dnd-kit/sortable, sonner and added shadcn alert-dialog and sonner wrapper components
- Created AdminSidebar component (47 lines) using shadcn Sidebar primitives — Projects nav link + Logout button anchored to footer
- Updated admin guard route to wrap all protected pages with SidebarProvider, AdminSidebar, and Toaster; /admin/dashboard now redirects to /admin/projects

## Task Commits

Each task was committed atomically:

1. **Task 1: Install new dependencies and shadcn components** - `489a13d` (chore)
2. **Task 2: Build AdminSidebar component and update admin guard layout** - `5c730dc` (feat)

**Plan metadata:** _(docs commit follows)_

## Files Created/Modified

- `src/components/admin/AdminSidebar.tsx` - New sidebar component with Projects link and Logout button using shadcn Sidebar primitives
- `src/components/ui/alert-dialog.tsx` - shadcn alert-dialog wrapper (for delete confirmation modal in plan 03)
- `src/components/ui/sonner.tsx` - shadcn Toaster wrapper around sonner
- `src/routes/admin/__guard/route.tsx` - Updated to wrap layout with SidebarProvider + AdminSidebar + Toaster
- `src/routes/admin/__guard/dashboard.tsx` - Updated to redirect /admin/dashboard to /admin/projects
- `package.json` - Added react-dropzone, @dnd-kit/core, @dnd-kit/sortable, sonner
- `package-lock.json` - Updated lock file

## Decisions Made

- Used `collapsible="none"` on the Sidebar component — enforces always-visible desktop behavior per the locked CONTEXT.md decision ("left sidebar, always visible on desktop, not collapsible"). The shadcn Sidebar primitives automatically handle mobile via a Sheet/offcanvas regardless of `collapsible` setting.
- Set dashboard.tsx redirect to `/admin/projects` even though the route doesn't exist yet in plan 01 — safe to do now, 404 until plan 03 creates the route.
- Placed Toaster at SidebarProvider root level so all admin route components can call `toast()` from sonner without any additional setup.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- shadcn add commands prompted to overwrite existing `button.tsx` — answered "No" to preserve the existing component. alert-dialog.tsx and sonner.tsx were created correctly as new files.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Admin layout shell is complete — all /admin/__guard/* routes now render with the left sidebar
- react-dropzone, @dnd-kit/core, @dnd-kit/sortable are installed and ready for plan 03 (project form with image upload and reordering)
- alert-dialog.tsx is ready for plan 03 (delete confirmation modal)
- Toaster is mounted — any component in admin area can call `toast()` from sonner immediately
- Pre-existing TypeScript errors in ProjectsSection.tsx and about.tsx are out of scope (noted in STATE.md blockers), `npm run ci:types` passes with no new errors

## Self-Check: PASSED

- FOUND: src/components/admin/AdminSidebar.tsx
- FOUND: src/components/ui/alert-dialog.tsx
- FOUND: src/components/ui/sonner.tsx
- FOUND: .planning/phases/03-admin-dashboard-core/03-01-SUMMARY.md
- FOUND: commit 489a13d (chore: install deps and shadcn components)
- FOUND: commit 5c730dc (feat: AdminSidebar and admin guard layout shell)

---
*Phase: 03-admin-dashboard-core*
*Completed: 2026-02-24*
