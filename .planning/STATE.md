---
gsd_state_version: 1.0
milestone: v2.0
milestone_name: Content & Experience
status: ready_to_plan
last_updated: "2026-03-04T00:00:00.000Z"
progress:
  total_phases: 6
  completed_phases: 0
  total_plans: 0
  completed_plans: 0
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-02)

**Core value:** Visitors immediately see a polished, memorable portfolio that communicates technical skill through both the content AND the site itself — the experience is the proof.
**Current focus:** v2.0 milestone — Phase 8 ready to plan (DB Foundation)

## Current Position

Phase: 8 of 13 (DB Foundation — first v2.0 phase)
Plan: 0 of TBD in current phase
Status: Ready to plan
Last activity: 2026-03-04 — v2.0 roadmap created (phases 8–13, 11 requirements mapped)

Progress: [███████░░░░░░] 54% (v1.0 complete, v2.0 not started)

## Performance Metrics

**Velocity:**
- Total plans completed: 20 (v1.0)
- Average duration: ~45 min
- Total execution time: ~15 hours

**By Phase:**

| Phase | Plans | Avg/Plan |
|-------|-------|----------|
| v1.0 Phases 1–7 | 20 | ~45 min |
| v2.0 Phases 8–13 | TBD | — |

## Accumulated Context

### Decisions

Recent decisions affecting v2.0 work:

- Scroll-driven career section: cinematic entry-by-entry parallax via sticky container + useScroll (pending Phase 12)
- page_texts in Supabase DB: editable copy without redeployment — flat key-value table (pending Phase 8)
- Draft preview as separate admin-guarded route, NOT a query param on public route (security requirement)
- useScroll must use layoutEffect: false on all calls — Vite production build bug (Motion GitHub #2452)
- page_texts RLS: create both policies (anon SELECT + admin write) BEFORE enabling RLS to avoid lockout
- Admin CRUD for skills/career mirrors ProjectForm pattern exactly (react-hook-form + zod + toast + useBlocker)
- Invalidate skillKeys.all and careerKeys.all root keys in mutation onSuccess (not sub-keys)
- CareerEntryLayer child component required — no hooks inside .map() (Rules of Hooks)
- Disable career parallax on mobile via use-mobile.ts hook (scroll jitter on mid-range Android)

### Pending Todos

None yet.

### Blockers/Concerns

- [v1.0 carry-over] Pre-existing TypeScript errors in ProjectForm.tsx (resolver type incompatibility) — npx tsc --noEmit passes but npm run build fails. Needs resolution before public launch.
- [Phase 12 flag] iOS Safari 100vh sticky container height: validate on real device; may need 100dvh (iOS 15.4+) if scroll sequence ends early.
- [Phase 9 pre-check] Verify proficiency column shape on skills table before writing SkillForm — may need migration if typed as plain text instead of enum.

## Session Continuity

Last session: 2026-03-04
Stopped at: v2.0 roadmap created. Ready to plan Phase 8 (DB Foundation).
Resume file: None
