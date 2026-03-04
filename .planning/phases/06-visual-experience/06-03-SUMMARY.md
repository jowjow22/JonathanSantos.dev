---
phase: 06-visual-experience
plan: "03"
subsystem: ui
tags: [framer-motion, animation, scroll, parallax, tilt, stagger, whileInView]

# Dependency graph
requires:
  - phase: 06-visual-experience
    provides: Plan 02 - 3D blob hero with Hero3D lazy-loaded into index.tsx; section relative + article z-10 layering established
  - phase: 04-content-sections
    provides: CareerSection, SkillsSection, ProjectsSection components with Reveal wrappers; index.tsx homepage structure

provides:
  - Career timeline entries with alternating left/right whileInView slide-in animations
  - Skills chip groups with staggerChildren 0.06 scroll-triggered pop-in animation
  - Project cards wrapped in TiltCard component with 3D perspective tilt on hover
  - Hero section with cursor-reactive parallax on ProfileImage and article (heroX/heroY spring motion values)
  - Contact section inner content with whileInView fade+slide-up animation

affects:
  - 07-seo-analytics  # index.tsx hero section modified; mouse event handler added to section

# Tech tracking
tech-stack:
  added: []
  patterns:
    - whileInView + viewport once:true — scroll-triggered animation that plays exactly once per page load
    - staggerChildren on motion.div parent propagates animation timing to children with matching variants
    - useMotionValue + useTransform + useSpring inside a dedicated component (TiltCard) — one set of motion values per card instance, not shared
    - Hero parallax: useMotionValue for raw mouse position, useTransform to map [-1,1] to pixel offset, useSpring for lag
    - import * as motion from motion/react-client — enables motion.div, motion.article, motion.create() pattern

key-files:
  created: []
  modified:
    - src/components/CareerSection/CareerSection.tsx
    - src/components/SkillsSection/SkillsSection.tsx
    - src/components/ProjectsSection/ProjectsSection.tsx
    - src/routes/__public/index.tsx

key-decisions:
  - "TiltCard is a named component above ProjectsSection export (not inline in map callback) — ensures each card instance has its own useMotionValue hooks, avoiding shared state across cards"
  - "Hero parallax applies same heroX/heroY to both ProfileImage wrapper and motion.article — they move in sync for a unified layer effect"
  - "Contact section uses a single motion.div wrapping ALL inner content — one coordinated fade-up vs. animating individual children"
  - "Career alternating slides use index % 2 === 0 for fromLeft — even JS index (0-based) slides from left, odd from right"
  - "staggerChildren: 0.06 gives ~60ms per chip, within the 50-80ms target from CONTEXT.md"

patterns-established:
  - "Scroll animation pattern: motion.div whileInView + viewport once:true — used for career entries and contact section"
  - "Stagger pattern: parent variants with staggerChildren, child motion.div with item variants — used for skill chips"
  - "TiltCard pattern: useMotionValue + useTransform + useSpring inside component — reusable per-instance 3D tilt"
  - "Parallax pattern: onMouseMove handler normalizes coordinates to [-1,1], motion values mapped via useTransform, useSpring adds lag"

requirements-completed: [VIS-03]

# Metrics
duration: 2min
completed: 2026-03-01
---

# Phase 06 Plan 03: Scroll Animations & Cursor Interactions Summary

**Framer Motion scroll-triggered animations (career alternating slides, skills stagger pop-in, contact fade-up) and cursor-reactive effects (hero parallax, project card 3D tilt) using whileInView, staggerChildren, and useMotionValue + useSpring**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-01T11:15:01Z
- **Completed:** 2026-03-01T11:17:00Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Added career timeline alternating slide-in animations — odd entries from left, even from right — triggered once as they scroll into view
- Added skills chip stagger animation with ~60ms delay per chip via staggerChildren: 0.06 on motion.div container
- Built TiltCard component with 3D perspective (useMotionValue + useTransform + useSpring), rotateX/rotateY ±4 degrees and y:-4px lift on hover
- Added hero section cursor parallax — ProfileImage and article both shift 4-6px in response to mouse position with spring lag
- Added contact section whileInView fade+slide-up animation on the entire inner content block

## Task Commits

Each task was committed atomically:

1. **Task 1: Career alternating slide-in + Skills stagger scroll animations** - `974c55f` (feat)
2. **Task 2: Project card 3D tilt + hero parallax + contact fade-up** - `4c363bf` (feat)

**Plan metadata:** TBD (docs: complete plan)

## Files Created/Modified

- `src/components/CareerSection/CareerSection.tsx` - Replaced Reveal wrappers on entries with motion.div using alternating x: -40 / x: 40 initial values and whileInView slide-in; kept Reveal on heading
- `src/components/SkillsSection/SkillsSection.tsx` - Replaced chip group Reveal wrappers with motion.div staggerChildren container + motion.div item variants (scale 0.8 -> 1, opacity 0 -> 1); kept Reveal on headings and category labels
- `src/components/ProjectsSection/ProjectsSection.tsx` - Added TiltCard component above export with useMotionValue + useTransform + useSpring for 3D tilt; replaced button element with TiltCard in project card rendering
- `src/routes/__public/index.tsx` - Added motion imports, onHeroMouseMove handler, heroX/heroY spring motion values; wrapped ProfileImage in motion.div and converted article to motion.article with parallax; wrapped contact section inner content in motion.div with whileInView fade-up

## Decisions Made

- TiltCard is defined as a named component above ProjectsSection (not inside the map callback) — calling hooks inside a loop/callback is a React rules-of-hooks violation. Named component ensures each card instance gets isolated motion value state.
- Hero parallax applies the same heroX/heroY values to both ProfileImage (motion.div wrapper) and motion.article — they shift together as a cohesive layer rather than independently, which looks more natural.
- Contact section wraps ALL inner content (both columns) in one motion.div — a single coordinated entrance animation feels cleaner than two separate animations competing.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required. All animations run client-side with Framer Motion (already installed).

## Next Phase Readiness

- VIS-03 satisfied: cursor-reactive elements and scroll-triggered section animations complete
- Phase 06-visual-experience is now fully complete (all 3 plans done)
- Pre-existing build blockers (ProjectForm.tsx TS errors) remain and need resolution before public launch — out of scope for this phase

## Self-Check: PASSED

- FOUND: src/components/CareerSection/CareerSection.tsx
- FOUND: src/components/SkillsSection/SkillsSection.tsx
- FOUND: src/components/ProjectsSection/ProjectsSection.tsx
- FOUND: src/routes/__public/index.tsx
- FOUND commit: 974c55f (Task 1 — career alternating slide-in + skills stagger)
- FOUND commit: 4c363bf (Task 2 — project 3D tilt + hero parallax + contact fade-up)
- TypeScript: npx tsc --noEmit passes with 0 errors

---
*Phase: 06-visual-experience*
*Completed: 2026-03-01*
