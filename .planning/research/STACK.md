# Stack Research: JonathanSantos.dev — v2.0 Addendum

**Research Date:** 2026-03-02
**Domain:** Developer portfolio — v2.0 new features
**Confidence:** HIGH
**Scope:** What's NEW for v2.0. Existing stack (React 19, TanStack Router, Framer Motion 12, Tailwind CSS 4, Radix UI, shadcn/ui, Supabase, TanStack Query, R3F) is validated and unchanged.

---

## Verdict: No New Packages Required

The existing stack is fully sufficient for every v2.0 feature. Zero new dependencies.
All capabilities are already installed and used elsewhere in the app.

---

## Framer Motion Scroll APIs (Already Installed: `motion@12.23.x`)

This is the most important section. The app currently uses `framer-motion@12.23.x` and `motion@12.23.x` in tandem — the `motion` package is the canonical name as of 2023 rebranding. The codebase imports from `motion/react` (client components) and `motion/react-client` (where RSC-style imports are used). Both are identical APIs.

### The Four Core Hooks for v2.0 Scroll Features

#### `useScroll` — Tracks scroll position relative to an element or viewport

```typescript
import { useScroll } from 'motion/react'

// Element-relative: tracks element's scroll progress through the viewport
const ref = useRef<HTMLDivElement>(null)
const { scrollYProgress } = useScroll({
  target: ref,
  offset: ["start end", "end start"] // element enters bottom → exits top
})
```

**`useScroll` options:**

| Option | Type | Purpose |
|--------|------|---------|
| `target` | `RefObject<Element>` | Element to track. Omit to track viewport scroll. |
| `offset` | `[IntersectionLabel, IntersectionLabel][]` | When animation starts/ends relative to container. |
| `container` | `RefObject<Element>` | Scrollable container. Defaults to viewport. |
| `axis` | `"x" \| "y"` | Scroll axis. Defaults to `"y"`. |

**Returns:** `{ scrollX, scrollY, scrollXProgress, scrollYProgress }` — all `MotionValue<number>`.

**Offset string format** (HIGH confidence — official docs verified):
- `"start end"` = element's leading edge meets viewport's trailing edge (element enters from bottom)
- `"end start"` = element's trailing edge meets viewport's leading edge (element exits top)
- `"start start"` = element's leading edge meets viewport's leading edge (element starts at top)
- `"end end"` = both trailing edges align (element fully visible before animating out)

#### `useTransform` — Maps one MotionValue to another

```typescript
import { useTransform } from 'motion/react'

// Map scrollYProgress [0..1] to a y translation [-100px..100px]
const y = useTransform(scrollYProgress, [0, 1], [-100, 100])

// Map with custom easing
const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
```

GPU-accelerated when the output drives `transform` or `opacity` style props on a `motion.*` element. Never apply to layout-affecting props like `width` or `height` — that forces layout recalculation.

#### `useMotionValueEvent` — Fires callbacks on MotionValue change

```typescript
import { useMotionValueEvent } from 'motion/react'

useMotionValueEvent(scrollYProgress, "change", (latest) => {
  // Runs on every scroll tick — use for non-animation side effects
  // e.g. updating a "visible entry" state for ARIA or conditional rendering
  setActiveEntry(latest > 0.5 ? 1 : 0)
})
```

Use sparingly. Prefer `useTransform` for visual changes (avoids React re-renders on every scroll tick). Reserve `useMotionValueEvent` for discrete state switches (showing/hiding a back-to-top button, tracking which career entry is "active").

#### `useSpring` — Smooths a MotionValue with spring physics

```typescript
import { useSpring } from 'motion/react'

const smoothY = useSpring(scrollYProgress, {
  stiffness: 80,
  damping: 20,
  restDelta: 0.001,
})
```

Optional enhancement for the Career section parallax. Adds a subtle lag/inertia feel. Default `useTransform` is already smooth; only add `useSpring` if the design specifically calls for "floaty" entry drift. Note: `useSpring` adds visual latency — test on mobile before committing.

---

## Career Section: Continuous Parallax Pattern

**Goal:** Each career entry drifts in 3D space as the user scrolls through a sticky-scroll container, creating a cinematic depth effect.

### Pattern: Tall container + sticky inner + per-entry element tracking

```
┌─────────────────────────────────────┐
│ <div ref={containerRef}             │  ← height: (n * 100vh) — the "scroll runway"
│   style={{ height: entries * 100vh }}│    this is what creates scroll distance
│                                     │
│   <div style={{ position: sticky,  │  ← sticky wrapper holds the visual layer
│                 top: 0, height: 100vh }}│   stays in viewport during container scroll
│                                     │
│     {entries.map(entry =>           │
│       <motion.div                   │  ← each entry tracked with its own ref
│         ref={entryRef}              │    useScroll({ target: entryRef })
│         style={{ y, opacity }}      │    y + opacity animate as it scrolls
│       />                            │
│     )}                              │
│                                     │
│   </div>                            │
│ </div>                              │
└─────────────────────────────────────┘
```

**Container-level scroll (for overall progress):**
```typescript
const { scrollYProgress } = useScroll({
  target: containerRef,
  offset: ["start start", "end end"]
})
```

**Per-entry tracking (for individual entry animation):**
```typescript
// In each CareerEntry component:
const ref = useRef(null)
const { scrollYProgress: entryProgress } = useScroll({
  target: ref,
  offset: ["start end", "end start"] // entry: enters bottom, exits top
})
const y = useTransform(entryProgress, [0, 1], [60, -60])    // drift 60px
const opacity = useTransform(entryProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
const scale = useTransform(entryProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95])
```

**Performance rule:** Only animate `transform` (y, scale, rotate) and `opacity`. Never animate `top`, `left`, `margin`, `height` — those trigger layout reflow and kill scroll perf.

**Sticky section CSS:**
```typescript
// Tailwind: sticky top-0 h-screen overflow-hidden
// The outer container height creates the scroll runway:
// height = entries.length * 100 + 'vh'  or  entries.length * 600 + 'px'
```

### No Lenis Needed

Lenis smooth scroll is a common recommendation in portfolio tutorials but it is NOT needed here. Reasons:
1. Framer Motion's `useScroll` runs on the native scroll event — already GPU-synchronized via ScrollTimeline API (Chromium) or rAF fallback.
2. Lenis intercepts native scroll, which can cause conflicts with Framer Motion's scroll tracking that are non-trivial to resolve.
3. The existing app uses native scroll + Framer Motion throughout — adding Lenis is a breaking change to the scroll architecture.
4. The `MotionConfig reducedMotion="user"` already in the public layout handles a11y.

**Decision:** Do not add Lenis. Use native scroll + Framer Motion `useScroll`.

---

## Skills Section: Interactive Hover-Reveal Grid

**Goal:** Grid of skill chips where hovering reveals proficiency or detail overlay.

### Already Available: Framer Motion `whileHover` + `AnimatePresence`

```typescript
// Existing SkillChip is a plain div — upgrade it to motion.div:
import { motion, AnimatePresence } from 'motion/react'

// whileHover scales the chip and triggers a conditional overlay
<motion.div
  whileHover="hovered"
  initial="idle"
>
  <motion.div variants={{ idle: { scale: 1 }, hovered: { scale: 1.05 } }}>
    {/* chip content */}
  </motion.div>
  <AnimatePresence>
    {isHovered && (
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 4 }}
      >
        {/* proficiency bar or detail */}
      </motion.div>
    )}
  </AnimatePresence>
</motion.div>
```

No new packages. `whileHover`, `AnimatePresence`, and variant propagation are all in `motion/react`.

**Proficiency bar:** Pure CSS + Tailwind — a `<div>` with `width: ${proficiency}%` in a container. Animate the width with `motion.div` and `initial={{ width: 0 }}` triggered by `whileInView`.

---

## Page Texts: Supabase `page_texts` Table

**Goal:** Admin-editable copy for hero headline, tagline, section headings, section intros — stored in Supabase, no redeployment needed.

### Pattern: Key-value table with typed keys

```sql
-- Migration needed in v2.0:
CREATE TABLE page_texts (
  key TEXT PRIMARY KEY,           -- e.g. 'hero.headline', 'skills.intro'
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: public SELECT, admin-only INSERT/UPDATE
ALTER TABLE page_texts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON page_texts FOR SELECT USING (true);
CREATE POLICY "Admin write" ON page_texts FOR ALL USING (auth.role() = 'authenticated');
```

**No new CMS library needed.** TanStack Query already handles fetching and caching. A simple `useQuery(['page_texts'], () => supabase.from('page_texts').select('*'))` returns all rows; the admin editor is a plain textarea form with `useMutation`.

**Typed keys approach (prevents typos in React):**
```typescript
// src/lib/types/page-texts.ts
export const PAGE_TEXT_KEYS = [
  'hero.headline',
  'hero.tagline',
  'skills.heading',
  'skills.intro',
  'career.heading',
  'career.intro',
  'projects.intro',
] as const

export type PageTextKey = (typeof PAGE_TEXT_KEYS)[number]
```

**After creating the table:** Run `npm run db:types` to regenerate `database.types.ts` — the `page_texts` table will appear automatically since the project already has the `supabase gen types` script.

---

## Draft Preview for Projects

**Goal:** Admin can preview a draft project (status = 'draft') using the existing public `/projects/$projectId` detail page, without publishing it.

### Pattern: TanStack Router search param `?preview=true`

The existing `content_status` enum already has `"draft" | "published" | "archived"`. The `projects` service currently fetches only `status = 'published'`. Draft preview needs:

1. **A `?preview=true` search param** on the project detail route (already at `/__public/projects/$projectId`)
2. **Auth check in the loader** — if `preview=true`, bypass the `status = 'published'` filter but require authenticated session
3. **No new route file** — modify the existing route

```typescript
// In /__public/projects/$projectId.tsx:

// 1. Add validateSearch to the route definition
export const Route = createFileRoute('/__public/projects/$projectId')({
  validateSearch: (search) => ({
    preview: search.preview === true || search.preview === 'true' || false,
  }),
  loader: async ({ params, search, context }) => {
    if (search.preview) {
      // Auth guard: redirect if not authenticated
      if (!context.auth.isAuthenticated) throw redirect({ to: '/admin/login' })
      const project = await fetchProjectById(params.projectId) // fetches any status
      return { project }
    }
    const project = await fetchPublishedProjectById(params.projectId)
    return { project }
  },
  // ...
})

// 2. Admin "Preview" button navigates with search param:
<Link to="/projects/$projectId" params={{ projectId }} search={{ preview: true }}>
  Preview
</Link>
```

**No new package needed.** TanStack Router's `validateSearch` is already used in the codebase (type-safe search params). The `context.auth` context is already wired in the admin guard route.

**Preview banner:** Add a visible "DRAFT PREVIEW" banner inside `ProjectDetailPage` when `Route.useSearch().preview === true`. Pure Tailwind — no new components.

---

## Import Conventions (Existing — Keep Consistent)

The codebase uses two Framer Motion import paths — both are correct:

| Import Path | Used In | Why |
|-------------|---------|-----|
| `import { useScroll, useTransform, ... } from 'motion/react'` | Hooks (non-component) | Correct for all hooks |
| `import * as motion from 'motion/react-client'` | RSC-compatible component imports | Used in Reveal.tsx, SkillsSection.tsx |
| `import { motion, AnimatePresence, ... } from 'motion/react'` | Standard client component use | Used in AnimatedOutlet.tsx |

For new scroll animation components: use `import { useScroll, useTransform, useMotionValueEvent, useSpring } from 'motion/react'` for hooks, and `import { motion } from 'motion/react'` for the `motion.*` elements. Both `framer-motion` and `motion` resolve to the same package at runtime; the `motion` package is the canonical name going forward.

---

## Alternatives Considered

| Feature | Recommended | Alternative | Why Not |
|---------|-------------|-------------|---------|
| Smooth scroll | Native + Framer Motion `useScroll` | Lenis | Integration conflicts with Framer Motion scroll tracking; not needed |
| Scroll animation | Framer Motion `useScroll` + `useTransform` | GSAP ScrollTrigger | GSAP not in stack; Framer Motion handles this case fully |
| CMS for page texts | Supabase `page_texts` table | Contentful, Sanity | Overkill; adds $+ cost, new auth system, separate dashboard; key-value table is simpler |
| Draft preview route | Search param `?preview=true` on existing route | Separate `/preview/*` route tree | Avoids duplication of route logic; search param is idiomatic TanStack Router |
| Skills hover interaction | `whileHover` + `AnimatePresence` | Radix Tooltip | Tooltip UX is too small/transient; full hover-reveal card needs layout space and exit animation |

---

## What NOT to Add

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Lenis | Scroll conflicts, integration complexity, not needed for this effect | Native scroll + `useScroll` |
| GSAP or ScrollMagic | Not in stack, adds 50-80KB, duplicates Framer Motion | Framer Motion `useScroll` / `useTransform` |
| Contentful / Sanity / Prismic | External CMS cost + auth overhead for 7-10 text fields | Supabase `page_texts` key-value table |
| `react-intersection-observer` | Already handled by Framer Motion `whileInView` + `viewport` prop | `whileInView={{ opacity: 1 }}` on `motion.div` |
| `@supabase/ssr` | App is an SPA, not SSR — not applicable | `@supabase/supabase-js` already installed |

---

## Version Compatibility

| Package | Current Version | v2.0 APIs Needed | Compatible |
|---------|----------------|-----------------|------------|
| `motion` / `framer-motion` | 12.23.x | `useScroll`, `useTransform`, `useMotionValueEvent`, `useSpring`, `whileHover`, `AnimatePresence` | Yes — all stable since v10 |
| `@tanstack/react-router` | 1.130.x | `validateSearch`, `useSearch()`, search param inheritance | Yes — stable API |
| `@supabase/supabase-js` | 2.97.x | `.from('page_texts').select()` / `.upsert()` | Yes — standard CRUD |
| `react` | 19.1.x | `useRef` for scroll targets, `useState` for hover state | Yes |

---

## Installation

No new packages. Zero `npm install` commands.

The only file-system change needed before coding is:

```bash
# After creating the page_texts Supabase migration:
npm run db:types
# Regenerates src/lib/types/database.types.ts with page_texts table
```

---

## Sources

- [motion.dev — useScroll API](https://motion.dev/docs/react-use-scroll) — offset string format, target/container options (HIGH confidence)
- [motion.dev — scroll animations guide](https://motion.dev/docs/react-scroll-animations) — useScroll + useTransform composition, hardware acceleration note (HIGH confidence)
- [motion.dev — parallax tutorial](https://motion.dev/tutorials/react-parallax) — per-element tracking pattern (HIGH confidence)
- [motion.dev — reduce bundle size](https://motion.dev/docs/react-reduce-bundle-size) — `motion/react` vs `motion/react-client` import distinction (HIGH confidence)
- [Olivier Larose — perspective section transition](https://blog.olivierlarose.com/tutorials/perspective-section-transition) — sticky container + per-section useTransform pattern (MEDIUM confidence — tutorial, verified against official docs)
- [Lenis GitHub](https://github.com/darkroomengineering/lenis) — Lenis + Framer Motion integration conflicts documented (MEDIUM confidence)
- [TanStack Router — Search Params](https://tanstack.com/router/latest/docs/framework/react/guide/search-params) — `validateSearch` optional params pattern (HIGH confidence)
- Package.json inspection (direct) — confirmed exact installed versions (HIGH confidence)
- Database types inspection (direct) — confirmed `content_status` enum with `'draft'` value (HIGH confidence)

---
*Stack research for: JonathanSantos.dev v2.0 new features*
*Researched: 2026-03-02*
