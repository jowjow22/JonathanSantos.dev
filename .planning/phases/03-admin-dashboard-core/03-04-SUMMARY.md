---
phase: 03-admin-dashboard-core
plan: 04
subsystem: ui
tags: [react, react-hook-form, zod, react-dropzone, dnd-kit, tanstack-router, supabase-storage, sonner]

# Dependency graph
requires:
  - phase: 03-admin-dashboard-core/03-02
    provides: uploadProjectImage, insertProjectImage, updateProjectImageOrders, fetchProjectImages, useProjectImages, useDeleteProjectImage
  - phase: 03-admin-dashboard-core/03-01
    provides: admin layout shell, Toaster, shadcn UI components
  - phase: 03-admin-dashboard-core/03-03
    provides: /admin/projects/ list page that new/edit routes return to
provides:
  - TechStackInput chip component for string[] tech_stack field
  - ImageUploadZone with react-dropzone + @dnd-kit/sortable for reorderable image management
  - ProjectForm unified create/edit form with react-hook-form + zod validation
  - /admin/projects/new route (create mode)
  - /admin/projects/$projectId/edit route (edit mode with pre-populated data)
  - useBlocker unsaved-changes guard with AlertDialog
affects: [04-public-portfolio, 05-about-and-skills]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Controller-wrapped chip input for string[] fields (avoids useFieldArray object-wrapping)
    - Controlled image zone — parent owns ImageItem[] state, zone is fully controlled
    - Deferred image upload — Files held in state as pending until form save
    - useBlocker with withResolver:true for in-app unsaved-changes dialog

key-files:
  created:
    - src/components/admin/ProjectForm/TechStackInput.tsx
    - src/components/admin/ProjectForm/ImageUploadZone.tsx
    - src/components/admin/ProjectForm/ProjectForm.tsx
    - src/routes/admin/__guard/projects/new.tsx
    - src/routes/admin/__guard/projects/$projectId/edit.tsx
  modified: []

key-decisions:
  - "Controller-wrapped tech_stack — useFieldArray not used because it wraps strings as {value} objects, incompatible with string[] schema"
  - "Controlled ImageUploadZone — parent (ProjectForm) owns ImageItem[] state; zone receives items+onChange+onDeleteSaved props"
  - "Deferred upload pattern — Files stored as pending ImageItems until form save; avoids orphaned storage objects on cancel"
  - "Dynamic import of fetchProjectImages inside onSubmit for thumbnail_url update — avoids circular dependency while keeping service DAL clean"

patterns-established:
  - "ImageItem union type — id/type/preview/file?/sort_order/storagePath? distinguishes pending vs saved images"
  - "useBlocker withResolver:true pattern — returns {status, proceed, reset} for in-app dialog-based navigation guard"
  - "Form field order: Title → Description → Tech Stack → Live URL → Repo URL → Display Order → Images → Status"

requirements-completed: [ADMN-03, ADMN-04]

# Metrics
duration: 4min
completed: 2026-02-24
---

# Phase 3 Plan 04: Project Form Summary

**Unified create/edit project form with react-hook-form + zod, tag/chip TechStackInput, @dnd-kit sortable ImageUploadZone with deferred uploads, and useBlocker unsaved-changes guard**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-24T18:15:37Z
- **Completed:** 2026-02-24T18:18:54Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- TechStackInput: Controller-wrapped chip input — type a tech, press Enter to add, click X to remove, Backspace on empty removes last chip, duplicates silently skipped
- ImageUploadZone: react-dropzone for file selection + @dnd-kit/sortable for drag-to-reorder, Thumbnail badge on first image, X button per image, object URL cleanup on unmount
- ProjectForm: unified create/edit form (180+ lines), useBlocker with AlertDialog, deferred pending image upload on save, thumbnail_url auto-set to first image after save
- /admin/projects/new and /admin/projects/$projectId/edit routes with skeleton loading state

## Task Commits

Each task was committed atomically:

1. **Task 1: Create TechStackInput and ImageUploadZone sub-components** - `bd0f6ec` (feat)
2. **Task 2: Create ProjectForm and create/edit route pages** - `8d6e12c` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

- `src/components/admin/ProjectForm/TechStackInput.tsx` - Controller-wrapped chip input for tech_stack string[]
- `src/components/admin/ProjectForm/ImageUploadZone.tsx` - Dropzone + sortable image previews with pending/saved state; exports ImageItem type
- `src/components/admin/ProjectForm/ProjectForm.tsx` - Unified create/edit form; zod schema, useBlocker, deferred image uploads, toast feedback
- `src/routes/admin/__guard/projects/new.tsx` - Create project page using ProjectForm in create mode
- `src/routes/admin/__guard/projects/$projectId/edit.tsx` - Edit project page using ProjectForm in edit mode with skeleton loading

## Decisions Made

- Controller-wrapped TechStackInput instead of useFieldArray — useFieldArray wraps string values as {value: string} objects, which breaks the flat string[] schema
- ProjectForm owns ImageItem[] state and passes it down as props — ImageUploadZone is fully controlled, enabling parent to manage pending/saved split
- Deferred upload: Files are stored as pending ImageItems until form.handleSubmit fires — prevents orphaned storage objects if admin cancels
- Dynamic import of `fetchProjectImages` inside `onSubmit` for thumbnail_url update — avoids circular import between ProjectForm and images.service

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Admin CRUD is now complete: list, create, edit, delete for projects
- Public portfolio display phase can now consume the projects table (status='published')
- /admin/projects/new and /admin/projects/:id/edit are fully functional routes

## Self-Check: PASSED

- FOUND: src/components/admin/ProjectForm/TechStackInput.tsx
- FOUND: src/components/admin/ProjectForm/ImageUploadZone.tsx
- FOUND: src/components/admin/ProjectForm/ProjectForm.tsx
- FOUND: src/routes/admin/__guard/projects/new.tsx
- FOUND: src/routes/admin/__guard/projects/$projectId/edit.tsx
- FOUND commit: bd0f6ec (Task 1)
- FOUND commit: 8d6e12c (Task 2)
- TypeScript: exits 0 (no errors)

---
*Phase: 03-admin-dashboard-core*
*Completed: 2026-02-24*
