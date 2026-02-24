---
phase: 04-content-sections
plan: 01
subsystem: database, ui
tags: [supabase, react-query, typescript, tanstack-router, tailwind]

# Dependency graph
requires:
  - phase: 01-backend-foundation
    provides: projects table schema, Supabase migrations, database.types.ts, useProjects/useCareer/useSkills hooks
  - phase: 03-admin-dashboard-core
    provides: ProjectsSection component, Navbar, homepage index.tsx, admin project management
provides:
  - case_study_url column on projects table (migration + types)
  - ProjectsSection connected to real Supabase data via usePublishedProjects()
  - Navbar with 6 links including Career and Skills anchor links
  - Homepage sections in locked order: About -> Career -> Skills -> Projects -> Articles -> Contact
  - About CTA updated to Contact Me linking to #contact
  - Career and Skills placeholder sections with correct layout IDs
  - Data cache priming for career/skills hooks in index.tsx
affects:
  - 04-02 (career and skills sections — depends on id="career", id="skills" section IDs and hook calls in index.tsx)
  - 04-03 (project detail page — depends on case_study_url in database types)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - usePublishedProjects() pattern for public-facing data fetching in section components
    - Skeleton loading state pattern for carousel cards (3 skeletons match card structure)
    - Empty state text "Content coming soon." (professional/neutral tone per locked decision)
    - Plain text tech_stack chips (inline-flex rounded-full bg-zinc-800) vs icon-based Tag for skills

key-files:
  created:
    - supabase/migrations/20260225000004_add_case_study_url.sql
  modified:
    - src/lib/types/database.types.ts
    - src/components/ProjectsSection/ProjectsSection.tsx
    - src/components/Navbar/Navbar.tsx
    - src/routes/__public/index.tsx

key-decisions:
  - "ProjectsSection uses plain text span chips for tech_stack — icon-based Tag reserved for skills section where Tabler icons exist"
  - "usePublishedProjects navigates from '/__public/' route — ProjectsSection now lives on homepage not /projects"
  - "Career and Skills sections use min-h-screen (not h-screen) to allow taller content in Plan 02"
  - "About CTA changed from 'My Career' + 'Buy me a coffee' buttons to single 'Contact Me' link per locked decision"
  - "Hook calls for career/skills/projects added to index.tsx to prime React Query cache ahead of Plan 02 components"

patterns-established:
  - "Section layout pattern for full-viewport sections: className='xs:px-8 flex min-h-screen w-full flex-col items-start justify-center gap-y-8 px-4 sm:px-26 lg:px-36'"
  - "Skeleton pattern inside Carousel: CarouselItem with Card skeleton matching real card structure (Header/Content/Footer)"

requirements-completed: [CONT-01, CONT-02]

# Metrics
duration: 3min
completed: 2026-02-25
---

# Phase 4 Plan 1: Content Sections Foundation Summary

**Supabase case_study_url migration applied and types regenerated; ProjectsSection wired to real data with loading/empty states; Navbar expanded to 6 links; homepage restructured to locked section order (About -> Career -> Skills -> Projects -> Articles -> Contact)**

## Performance

- **Duration:** 3 min
- **Started:** 2026-02-25T15:46:35Z
- **Completed:** 2026-02-25T15:49:41Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Migration `20260225000004_add_case_study_url.sql` applied to both local and remote Supabase; types regenerated with `case_study_url: string | null` in projects Row/Insert/Update
- ProjectsSection.tsx replaced hardcoded Array.from fake cards with usePublishedProjects() — shows skeletons while loading, "Content coming soon." when empty, real project cards with UUID navigation
- Navbar updated to 6 links (About, Career, Skills, Projects, Articles, Contact) in locked homepage order
- index.tsx restructured: correct section order with id="career" and id="skills" placeholders, About CTA fixed to Contact Me/#contact, hook calls added for cache priming

## Task Commits

Each task was committed atomically:

1. **Task 1: Add case_study_url migration and regenerate database types** - `541bc37` (feat)
2. **Task 2: Connect ProjectsSection to Supabase, update Navbar, restructure homepage** - `66cb31e` (feat)

## Files Created/Modified
- `supabase/migrations/20260225000004_add_case_study_url.sql` - SQL migration adding case_study_url TEXT NULL to projects table
- `src/lib/types/database.types.ts` - Regenerated with case_study_url in projects Row/Insert/Update types
- `src/components/ProjectsSection/ProjectsSection.tsx` - Replaced hardcoded data with usePublishedProjects(); added skeleton/empty states; UUID navigation
- `src/components/Navbar/Navbar.tsx` - Added Career (#career) and Skills (#skills) links (6 total)
- `src/routes/__public/index.tsx` - Restructured section order, added career/skills placeholders, fixed CTA, added hook imports

## Decisions Made
- Used plain text span chips for project tech_stack instead of the icon-based Tag component — skills use Tabler icons but tech_stack values are plain strings in the DB
- Career and Skills placeholder sections use `min-h-screen` (not `h-screen`) to accommodate taller content when Plan 02 implements the full sections
- Removed the "Buy me a coffee" secondary button from About CTA per locked decision — clean single CTA to #contact

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Applied migration to local DB before type regeneration**
- **Found during:** Task 1 (type regeneration)
- **Issue:** `npm run db:types` uses `--local` flag but the local Supabase DB didn't have the new migration yet (only the remote had it via `supabase db push`). Types generated without case_study_url.
- **Fix:** Ran `npx supabase migration up` to apply pending migration to local DB first, then re-ran `npm run db:types`
- **Files modified:** src/lib/types/database.types.ts (re-generated correctly)
- **Verification:** `grep -n "case_study_url"` returns 3 matches (Row/Insert/Update)
- **Committed in:** 541bc37 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Required to complete type regeneration. No scope creep.

## Issues Encountered
- `supabase` CLI not in PATH — used `npx supabase` instead (expected in npm project setup)
- `npm run db:types` uses `--local` flag which reads from local Supabase Docker, not remote — required applying migration locally first before types reflected the new column

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Plan 02 can implement CareerSection and SkillsSection components — section IDs `#career` and `#skills` exist in index.tsx with correct layout
- Plan 03 can implement project detail page — `case_study_url` field is in database types
- npx tsc --noEmit passes clean (0 errors)
- Pre-existing lint errors in ProjectForm.tsx and ImageUploadZone.tsx remain (from Phase 3, out of scope)

---
*Phase: 04-content-sections*
*Completed: 2026-02-25*
