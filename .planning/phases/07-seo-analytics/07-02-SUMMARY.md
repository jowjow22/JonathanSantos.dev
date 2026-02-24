---
phase: 07-seo-analytics
plan: 02
subsystem: analytics
tags: [google-analytics, ga4, gtag, tracking, page-view, event-tracking, tanstack-router]

# Dependency graph
requires:
  - phase: 07-seo-analytics plan 01
    provides: TanStack Router head() system, index.html OG meta tags baseline
provides:
  - GA4 gtag.js integration wired with real Measurement ID G-17KTT4E73S
  - trackPageView fired on every client-side navigation via router.subscribe('onResolved')
  - trackEvent('project_click') fired before project card navigation with project_id and project_title
affects: [deployment, public-launch]

# Tech tracking
tech-stack:
  added: [GA4 gtag.js (browser global, no npm package)]
  patterns: [thin window.gtag optional-chain wrapper, router subscriber for SPA page tracking]

key-files:
  created:
    - src/lib/analytics.ts
  modified:
    - index.html
    - src/main.tsx
    - src/components/ProjectsSection/ProjectsSection.tsx

key-decisions:
  - "GA4 via native gtag browser global (no npm package) — optional chaining ensures safe no-ops when gtag unavailable"
  - "send_page_view: false removed during verification — GA4 auto page_view covers initial load, router subscriber covers subsequent navigations"
  - "router.subscribe('onResolved') chosen over React effect — fires after route fully resolved and document.title updated"
  - "goToProject accepts projectTitle parameter to include human-readable title in project_click event payload"
  - "Real GA4 Measurement ID G-17KTT4E73S added to index.html during human-verify checkpoint"

patterns-established:
  - "Analytics wrapper pattern: src/lib/analytics.ts exports typed helper functions over raw window.gtag calls"
  - "SPA page tracking pattern: router.subscribe('onResolved') in main.tsx captures all navigation events after initial load; GA4 auto page_view handles the first load"

requirements-completed: [ANLY-01]

# Metrics
duration: 10min
completed: 2026-03-02
---

# Phase 7 Plan 02: Google Analytics 4 Integration Summary

**GA4 page-view tracking on every TanStack Router navigation and project_click custom event wired into the portfolio SPA — verified with real Measurement ID G-17KTT4E73S in GA4 Realtime**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-03-02T06:57:45Z
- **Completed:** 2026-03-02T07:15:00Z
- **Tasks:** 3 (2 auto + 1 checkpoint, all complete)
- **Files modified:** 4

## Accomplishments

- Created `src/lib/analytics.ts` — thin optional-chain wrapper over `window.gtag` exporting `trackPageView` and `trackEvent`; calls are safe no-ops when gtag is not loaded (tests, ad blockers)
- Added GA4 gtag.js script block to `index.html` with real Measurement ID `G-17KTT4E73S` using Google's standard snippet
- Wired `router.subscribe('onResolved', ...)` in `src/main.tsx` to fire `trackPageView` on every client-side navigation using live `router.state.location.pathname` and `document.title`
- Added `trackEvent('project_click', { project_id, project_title })` in `ProjectsSection.tsx` before `navigate()` so GA4 captures which projects attract user attention
- Human-verify checkpoint passed: user confirmed GA4 events visible in Realtime report

## Task Commits

Each task was committed atomically:

1. **Task 1: Create analytics.ts wrapper and wire GA4 script + router subscriber** - `d85c1fe` (feat)
2. **Task 2: Add project_click event tracking to ProjectsSection** - `0aaae1e` (feat)
3. **Task 3: Human-verify checkpoint approved** - `fbe4045` (fix — bug found and corrected during verification)

## Files Created/Modified

- `src/lib/analytics.ts` — Created: thin gtag wrapper exporting trackPageView and trackEvent
- `index.html` — Modified: added GA4 gtag.js script tag with real Measurement ID G-17KTT4E73S (standard snippet, no send_page_view override)
- `src/main.tsx` — Modified: import trackPageView, add router.subscribe('onResolved') subscriber; updated comment to reflect GA4 auto page_view covers initial load
- `src/components/ProjectsSection/ProjectsSection.tsx` — Modified: import trackEvent, update goToProject to accept projectTitle and fire project_click event

## Decisions Made

- GA4 via native browser global `window.gtag` (no npm package) — keeps bundle size zero, follows Google's recommended approach for SPAs
- Optional chaining (`window.gtag?.()`) ensures all analytics calls are silent no-ops in test environments or when browser ad blockers prevent the GA4 script from loading
- `send_page_view: false` was originally set to prevent duplicate page_view on first load, but during verification this was found to suppress the initial page_view entirely — GA4 auto page_view covers the initial load, the router subscriber covers all subsequent navigations. Removed during fix.
- `router.subscribe('onResolved')` is the correct event — fires after full route resolution including document.title update (from TanStack Router head() system wired in plan 07-01), ensuring page_title is accurate
- `goToProject` updated to accept `projectTitle` alongside `projectId` to include the human-readable name in the GA4 event payload, making the GA4 Events report meaningful without needing to look up IDs

## User Setup Required

**GA4 Measurement ID is already set to G-17KTT4E73S in index.html.** No further setup required — tracking is live.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] send_page_view: false suppressed initial page_view entirely**
- **Found during:** Task 3 (human-verify checkpoint)
- **Issue:** The plan specified `send_page_view: false` to prevent double-firing on initial load. In practice, `router.subscribe('onResolved')` only fires on navigations that occur after the initial load — not on the first page load itself. With `send_page_view: false`, the initial page_view was being suppressed by GA4 and never replaced by the router subscriber, leaving the first page load untracked. GA4 flagged the installation as broken.
- **Fix:** Removed `{ send_page_view: false }` from `gtag('config')` call, reverting to Google's standard snippet. The real GA4 Measurement ID `G-17KTT4E73S` was also set at this point. Updated comment in `src/main.tsx` to clarify the split responsibility (GA4 auto handles initial, router subscriber handles subsequent navigations).
- **Files modified:** `index.html`, `src/main.tsx`
- **Verification:** GA4 Realtime confirmed events visible in dashboard; no console errors during navigation
- **Committed in:** `fbe4045`

---

**Total deviations:** 1 auto-fixed (Rule 1 - bug)
**Impact on plan:** Fix was necessary for correct GA4 tracking. The must_haves artifact spec for `send_page_view` in index.html no longer applies — the standard snippet without this override is the correct implementation. No scope creep.

## Issues Encountered

None beyond the auto-fixed deviation above.

## Next Phase Readiness

- ANLY-01 satisfied: page-view and project_click event tracking implemented and verified with real GA4 events
- Phase 07-seo-analytics: both plans complete (SEO-01 and ANLY-01 satisfied)
- GA4 Measurement ID G-17KTT4E73S active in production index.html
- Pre-existing TypeScript errors in ProjectForm.tsx remain (not introduced by this plan)

---
*Phase: 07-seo-analytics*
*Completed: 2026-03-02*
