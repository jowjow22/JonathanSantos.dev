---
phase: 07-seo-analytics
plan: 01
subsystem: ui
tags: [seo, meta-tags, open-graph, tanstack-router, head-api]

# Dependency graph
requires:
  - phase: 04-content-sections
    provides: project detail route ($projectId.tsx) and public route structure
  - phase: 01-backend-foundation
    provides: fetchPublishedProjectById service function
provides:
  - Per-route unique <title> tags via TanStack Router head() API
  - Open Graph and Twitter Card meta tags on all public pages
  - Dynamic project-specific meta tags driven by route loader
  - Static OG fallback tags in index.html for social crawlers
  - og-image.png (1200x630) in /public for social share previews
affects:
  - 07-seo-analytics (subsequent plans in this phase)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - TanStack Router head() API for per-route meta tag injection
    - HeadContent singleton in __root.tsx only (not in layout routes)
    - Route loader for SEO-critical data fetch before render
    - Static fallback OG tags in index.html for JS-disabled crawlers

key-files:
  created:
    - public/og-image.png
    - .planning/phases/07-seo-analytics/07-01-SUMMARY.md
  modified:
    - src/routes/__root.tsx
    - src/routes/__public/index.tsx
    - src/routes/__public/projects/$projectId.tsx
    - index.html

key-decisions:
  - "HeadContent placed exclusively in __root.tsx component — singleton pattern, not in layout routes"
  - "Route loader added to $projectId.tsx to fetch project data for dynamic head() — does not cause double-fetch because usePublishedProject hook reads from React Query cache"
  - "og-image.png generated with Python Pillow (dark #0f0f0f background, white name + zinc subtitle) — ImageMagick unavailable on build machine"
  - "All og:image and twitter:image references use absolute https://jonathansantos.dev/og-image.png URL"
  - "index.html static tags serve as fallback for social crawlers that do not execute JavaScript"

patterns-established:
  - "head() function alongside component in createFileRoute/createRootRouteWithContext options object"
  - "Child route head() overrides parent head() for same meta name/property"
  - "Loader + head() pattern: loader fetches, head() reads ctx.loaderData for dynamic tags"

requirements-completed: [SEO-01]

# Metrics
duration: 2min
completed: 2026-03-02
---

# Phase 07 Plan 01: SEO Meta Tags Summary

**TanStack Router head() API wired to every public route — per-page title+OG tags for homepage and dynamic project detail, plus static index.html fallback for social crawlers**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-03-02T06:40:59Z
- **Completed:** 2026-03-02T06:42:49Z
- **Tasks:** 3 (2 auto + 1 human-verify checkpoint — approved)
- **Files modified:** 5

## Accomplishments
- HeadContent singleton added to __root.tsx with site-wide fallback meta tags (title, description, og:type, og:image)
- Homepage-specific head() added to index.tsx with OG title, description, and URL
- Project detail route gains route loader + dynamic head() — title shows "[Project Name] — Jonathan Santos" after load
- index.html fully populated with static OG/Twitter tags for social crawlers (LinkedIn, Slack, WhatsApp)
- og-image.png (1200x630, dark background) created at public/ for social share preview

## Task Commits

Each task was committed atomically:

1. **Task 1: Add HeadContent + root head() defaults and per-route head()** - `ed6a943` (feat)
2. **Task 2: Add static OG fallback tags to index.html and og-image.png** - `2888589` (feat)
3. **Task 3: Visual verification checkpoint** - Approved by user
   - Bug fix discovered during verification: `7a69b5b` (fix: replace motion.create(CarouselItem) with motion.div inside CarouselItem)
   - Follow-up fix: `7745e01` (fix: restore motion/react-client star import for motion.div)

**Plan metadata:** `a1e1fdc` (docs: complete SEO meta tags plan — SEO-01 satisfied)

## Files Created/Modified
- `src/routes/__root.tsx` - Added HeadContent import + head() fallback, HeadContent in component
- `src/routes/__public/index.tsx` - Added head() with homepage-specific OG title/description/url
- `src/routes/__public/projects/$projectId.tsx` - Added fetchPublishedProjectById import, route loader, and dynamic head()
- `index.html` - Replaced minimal head with full SEO/OG/Twitter static meta tags
- `public/og-image.png` - Created 1200x630 PNG using Python Pillow (dark background with name + role text)

## Decisions Made
- HeadContent placed exclusively in `__root.tsx` component — not in any layout route file. This is the TanStack Router singleton pattern.
- Route loader added to `$projectId.tsx` alongside existing `usePublishedProject` hook. The loader calls `fetchPublishedProjectById` directly; the hook reads from React Query cache (no double-fetch).
- og-image.png generated with Python Pillow (ImageMagick not available). Dark `#0f0f0f` background with white "Jonathan Santos" heading and zinc "Front-End Developer" subtitle.
- All `og:image` and `twitter:image` values use the absolute URL `https://jonathansantos.dev/og-image.png` (not relative paths).

## Deviations from Plan

### Auto-fixed Issues (discovered during human-verify checkpoint)

**1. [Rule 1 - Bug] Fixed CarouselItem opacity stuck at 0 due to missing forwardRef**
- **Found during:** Task 3 (human-verify checkpoint)
- **Issue:** `motion.create(CarouselItem)` was used to wrap the carousel item with motion capabilities, but `CarouselItem` does not implement `forwardRef`. As a result, `whileInView` could not attach to the DOM node and the opacity never animated — project cards were invisible on scroll.
- **Fix:** Replaced `motion.create(CarouselItem)` with a plain `motion.div` inside `CarouselItem`, giving motion a direct DOM element reference. Restored the `motion/react-client` star import that the replacement required.
- **Files modified:** `src/components/ProjectsSection/ProjectsSection.tsx`
- **Verification:** Verified during human-verify checkpoint — user confirmed cards visible.
- **Committed in:** `7a69b5b`, `7745e01`

---

**Total deviations:** 1 auto-fixed (Rule 1 - Bug)
**Impact on plan:** Bug fix essential for correct animation behavior — project cards were invisible without it. No scope creep.

## Issues Encountered
None — TypeScript passed with zero errors after all changes.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness
- SEO-01 satisfied: unique title per route, meta description on all public pages, OG tags in index.html, valid og-image.png
- Human-verify checkpoint (Task 3) approved — browser tab titles and DevTools meta tags confirmed correct
- Phase 07 Plan 02 (analytics — ANLY-01) can proceed

---
*Phase: 07-seo-analytics*
*Completed: 2026-03-02*
