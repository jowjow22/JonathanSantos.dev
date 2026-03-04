# Architecture Research

**Domain:** Portfolio SPA — v2.0 feature integration into existing React 19 / TanStack Router / Framer Motion / Supabase stack
**Researched:** 2026-03-02
**Confidence:** HIGH (based on direct codebase inspection + official Motion docs)

---

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        PUBLIC LAYOUT (/__public/route.tsx)           │
│  MotionConfig reducedMotion="user" + Navbar + AnimatedOutlet         │
├───────────────────────┬─────────────────────────────────────────────┤
│  index.tsx (homepage) │  projects/$projectId.tsx (detail)            │
│                       │                                              │
│  ┌─────────────────┐  │                                              │
│  │  Hero section   │  │                                              │
│  │  (ParticleBg)   │  │                                              │
│  ├─────────────────┤  │                                              │
│  │  CareerSection  │  │   NEW v2.0 (MODIFIED):                       │
│  │  (scroll-driven)│  │   - Sticky container + useScroll parallax    │
│  ├─────────────────┤  │                                              │
│  │  SkillsSection  │  │   NEW v2.0 (MODIFIED):                       │
│  │  (hover reveal) │  │   - SkillChip gains proficiency tooltip       │
│  ├─────────────────┤  │                                              │
│  │  ProjectSection │  │   NEW v2.0: draft preview toggle             │
│  ├─────────────────┤  │                                              │
│  │  Articles       │  │                                              │
│  ├─────────────────┤  │                                              │
│  │  ContactForm    │  │                                              │
│  └─────────────────┘  │                                              │
├───────────────────────┴─────────────────────────────────────────────┤
│                        ADMIN LAYOUT (/admin/__guard/route.tsx)        │
│  SidebarProvider + AdminSidebar + Outlet + Toaster                   │
├──────────────┬──────────────┬──────────────┬────────────────────────┤
│  /projects   │  /skills     │  /career     │  /page-texts           │
│  (existing)  │  NEW v2.0    │  NEW v2.0    │  NEW v2.0              │
└──────────────┴──────────────┴──────────────┴────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────────────┐
│                      DATA LAYER                                       │
│  TanStack Query hooks → service functions → Supabase client          │
├───────────────┬────────────────┬────────────────┬───────────────────┤
│  useProjects  │  useSkills     │  useCareer     │  usePageTexts     │
│  (existing)   │  (existing)    │  (existing)    │  NEW v2.0         │
├───────────────┴────────────────┴────────────────┴───────────────────┤
│  Supabase PostgreSQL                                                  │
│  projects | skills | skill_categories | career_entries | page_texts  │
└─────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Status |
|-----------|----------------|--------|
| `/__public/route.tsx` | MotionConfig + Navbar + AnimatedOutlet | Existing — no change |
| `/__public/index.tsx` | Homepage sections composition, data fetching | Modified — add page_texts, draft param |
| `CareerSection.tsx` | Scroll-driven parallax container + entry rendering | Replaced with sticky pattern |
| `CareerTimelineEntry.tsx` | Individual entry display | Minor — depth/perspective transforms |
| `SkillsSection.tsx` | Category grouped skill chips with reveal animations | Modified — hover tooltip |
| `SkillChip.tsx` | Individual skill pill | Modified — add proficiency tooltip |
| `/admin/__guard/route.tsx` | Auth guard + sidebar layout | Existing — no change |
| `AdminSidebar.tsx` | Sidebar navigation links | Modified — add Skills/Career/PageTexts links |
| `usePageTexts.ts` | TanStack Query hook for page_texts table | New |
| `page-texts.service.ts` | Supabase CRUD for page_texts | New |

---

## Recommended Project Structure

The existing structure is already well-organized. v2.0 adds to it surgically:

```
src/
├── routes/
│   ├── __public/
│   │   └── index.tsx                    # MODIFIED: add page_texts, draft searchParam
│   └── admin/
│       └── __guard/
│           ├── skills/
│           │   ├── index.tsx            # NEW: skills list
│           │   ├── new.tsx              # NEW: create skill form
│           │   └── $skillId/
│           │       └── edit.tsx         # NEW: edit skill form
│           ├── career/
│           │   ├── index.tsx            # NEW: career entries list
│           │   ├── new.tsx              # NEW: create entry form
│           │   └── $entryId/
│           │       └── edit.tsx         # NEW: edit entry form
│           └── page-texts/
│               └── index.tsx            # NEW: page texts editor (single page, no sub-routes)
├── components/
│   ├── CareerSection/
│   │   ├── CareerSection.tsx            # REPLACED: sticky scroll pattern
│   │   └── CareerTimelineEntry.tsx      # MODIFIED: add motion style props
│   ├── SkillsSection/
│   │   ├── SkillsSection.tsx            # MODIFIED: pass proficiency to chip
│   │   └── SkillChip.tsx               # MODIFIED: add hover tooltip/detail
│   └── admin/
│       ├── AdminSidebar.tsx             # MODIFIED: add new nav links
│       ├── SkillForm/
│       │   └── SkillForm.tsx            # NEW: create/edit skill (react-hook-form + zod)
│       └── CareerEntryForm/
│           └── CareerEntryForm.tsx      # NEW: create/edit career entry
├── hooks/
│   ├── useSkills.ts                     # MODIFIED: add admin mutation hooks
│   ├── useCareer.ts                     # MODIFIED: add admin mutation hooks
│   └── usePageTexts.ts                  # NEW: fetch + mutate page_texts
└── services/
    ├── skills.service.ts                # MODIFIED: add create/update/delete
    ├── career.service.ts                # MODIFIED: add create/update/delete
    └── page-texts.service.ts            # NEW: CRUD for page_texts table
```

### Structure Rationale

- **Admin route files mirror the public pattern**: `/admin/__guard/skills/index.tsx` follows the exact same structure as `/admin/__guard/projects/index.tsx` — consistent, predictable, copy-paste-safe.
- **page-texts has no sub-routes**: It is a single form editing all texts at once — no list/detail split needed for a single-record table.
- **Service functions stay thin**: They only call Supabase. No business logic. Hooks own query/mutation orchestration.
- **Form components in `admin/` sub-folders**: Mirrors the existing `admin/ProjectForm/` pattern exactly.

---

## Architectural Patterns

### Pattern 1: Sticky Container Scroll Parallax (Career Section)

**What:** The career section gets a tall outer container (~300vh) with a `position: sticky` inner panel. `useScroll` targets the outer container via ref and returns `scrollYProgress` (0 → 1). `useTransform` maps that value to per-entry Y translations and Z depth, creating a cinematic 3D drift.

**When to use:** Any section where entries should animate continuously as the user scrolls through — not just "enter once" (`whileInView`).

**Trade-offs:**
- Pros: Smooth 60fps at compositor level when using CSS `will-change: transform`, no JavaScript frame loop, respects `MotionConfig reducedMotion="user"` already set in PublicLayout.
- Cons: Section takes up 300vh of page height. Entries must be positioned absolutely inside the sticky panel or staggered via `useTransform` per-entry offsets. Mobile requires careful height tuning.

**Why sticky over scroll subscriber:** A scroll subscriber (`useScroll` with no target, reading `window.scrollY` in a listener) runs on the main thread. The sticky container pattern lets the browser compositor handle the sticky positioning, and Framer Motion's `scrollYProgress` MotionValue drives transforms without React re-renders. Simpler code, better perf.

**Example:**

```typescript
// CareerSection.tsx — skeleton of the sticky container pattern
import { useRef } from 'react'
import { useScroll, useTransform } from 'motion/react'
import * as motion from 'motion/react-client'

export const CareerSection = ({ entries }: { entries: CareerEntry[] }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  // Track how far through the tall container the user has scrolled
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  return (
    // Tall outer container — determines how long the scroll journey is
    <div ref={containerRef} style={{ height: `${entries.length * 100 + 100}vh` }}>
      {/* Sticky panel — stays in viewport while user scrolls through outer */}
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        {entries.map((entry, index) => {
          // Each entry gets a distinct scroll window: [start, peak, end]
          const start = index / entries.length
          const end = (index + 1) / entries.length

          // Y drift: entry slides up into view from below, then drifts up and out
          const y = useTransform(scrollYProgress, [start, (start + end) / 2, end], [80, 0, -60])
          // Depth: entry starts slightly back, comes forward at peak, recedes
          const scale = useTransform(scrollYProgress, [start, (start + end) / 2, end], [0.92, 1, 0.96])
          const opacity = useTransform(scrollYProgress, [start, start + 0.05, end - 0.05, end], [0, 1, 1, 0])

          return (
            <motion.div
              key={entry.id}
              style={{ y, scale, opacity, position: 'absolute', width: '100%' }}
            >
              <CareerTimelineEntry entry={entry} />
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
```

**Important constraint:** `useTransform` calls inside `.map()` are hooks called conditionally by count. This is only valid if `entries.length` is stable after initial load (it is — data comes from TanStack Query with a staleTime). To be strictly safe, extract each entry's motion values into a child component (`CareerEntryLayer`) so each component owns its own hooks.

---

### Pattern 2: page_texts Table (Editable Copy Without Redeployment)

**What:** A flat key-value table in Supabase. Each row is a named text slot (`hero_headline`, `hero_tagline`, `career_section_title`, etc.). The admin edits text values through a single form. The public site fetches all rows on page load and renders the values in place of hardcoded strings.

**Table schema:**

```sql
CREATE TABLE page_texts (
  key        TEXT PRIMARY KEY,           -- e.g. 'hero_headline'
  value      TEXT NOT NULL DEFAULT '',   -- the editable copy
  section    TEXT NOT NULL,              -- e.g. 'hero', 'career', 'skills'
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: read for all, write only for admin
ALTER TABLE page_texts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read" ON page_texts FOR SELECT USING (true);
CREATE POLICY "admin write" ON page_texts FOR ALL
  USING (auth.jwt() ->> 'user_role' = 'admin');
```

**Why this schema over a JSONB column:**
- A JSONB column on a single row (e.g., `settings.page_content`) is simpler to write but harder to query, diff, and audit. Individual rows can be updated atomically, RLS policies apply per-row if needed in the future, and TypeScript types stay clean.
- Individual rows also allow partial updates — the admin can save just the hero section without touching the career section texts.

**Fetch pattern:**

```typescript
// page-texts.service.ts
export type PageText = { key: string; value: string; section: string; updated_at: string }

export async function fetchPageTexts(): Promise<Record<string, string>> {
  const { data } = await supabase
    .from('page_texts')
    .select('key, value')
    .throwOnError()
  // Transform array to keyed object for O(1) lookup in components
  return Object.fromEntries((data ?? []).map((r) => [r.key, r.value]))
}
```

**Hook:**

```typescript
// usePageTexts.ts
export const pageTextKeys = {
  all: ['page_texts'] as const,
}

export function usePageTexts() {
  return useQuery({
    queryKey: pageTextKeys.all,
    queryFn: fetchPageTexts,
    staleTime: 10 * 60 * 1000, // texts rarely change, 10-min cache fine
    gcTime: 30 * 60 * 1000,
    placeholderData: {},         // prevents undefined spread errors
  })
}
```

**Usage in homepage:**

```typescript
// index.tsx — replace hardcoded strings
const { data: texts = {} } = usePageTexts()

// In JSX:
<Typography.H1>{texts['hero_headline'] ?? 'Jonathan Santos'}</Typography.H1>
<Typography.H3>{texts['hero_tagline'] ?? 'Front-End Developer'}</Typography.H3>
```

The `?? 'fallback'` pattern ensures the site never shows blank text if a key is missing from the table.

---

### Pattern 3: Draft Preview Route

**What:** The existing `/projects/$projectId` route currently calls `fetchPublishedProjectById` which filters `status = 'published'`. The admin needs to preview a draft project at the same public URL with the same layout but bypassing the published filter.

**The right approach is a search param on the existing public route — not a separate admin route.**

**Why not a separate route:**
- A separate `/admin/projects/$projectId/preview` route would need to duplicate the public project detail page layout (hero image, tech stack tags, related links). That duplicated layout will diverge over time.
- The AnimatedOutlet page transition works naturally with the existing `/__public/projects/$projectId` route. A separate admin preview route would be outside the `/__public` layout and miss the transition.

**How search params work here:**

TanStack Router search params are type-safe via Zod validation. Adding `preview=true` as an optional param to the project detail route allows:
1. The public route to detect it and call `fetchProjectById` (all statuses) instead of `fetchPublishedProjectById`
2. Auth check in the route's `beforeLoad` — if `preview=true` and user is not authenticated, strip the param or redirect

**Schema:**

```typescript
// src/routes/__public/projects/$projectId.tsx
import { z } from 'zod'

const searchSchema = z.object({
  preview: z.boolean().optional().catch(undefined),
})

export const Route = createFileRoute('/__public/projects/$projectId')({
  validateSearch: searchSchema,
  component: ProjectDetailPage,
})

function ProjectDetailPage() {
  const { projectId } = Route.useParams()
  const { preview } = Route.useSearch()
  const { data: auth } = useAuthContext()

  // Only allow preview if user is authenticated admin
  const isPreview = preview === true && auth.isAuthenticated

  const project = isPreview
    ? useProject(projectId)      // fetches all statuses (admin hook)
    : usePublishedProject(projectId) // published only (public hook)
```

**Preview banner:** When `isPreview === true`, render a sticky banner at the top of the detail page: "Preview mode — this project is not published." with a link back to the admin edit page.

**Navigation from admin:** The project edit page adds a "Preview" button:

```typescript
<Link
  to="/projects/$projectId"
  params={{ projectId }}
  search={{ preview: true }}
>
  Preview
</Link>
```

**Security consideration:** The `preview=true` param exposes draft content only to authenticated users. A logged-out user visiting `/projects/some-draft-id?preview=true` falls back to `usePublishedProject`, which returns null for a draft — the route renders a 404/not-found state. The service role key is never needed client-side.

---

### Pattern 4: Admin CRUD for Skills and Career (Parallel to Projects Pattern)

**What:** The admin skill and career CRUD routes follow the exact same pattern as the existing `/admin/__guard/projects/` routes. No new patterns — pure replication with different entity shapes.

**Skills-specific consideration:** Skill categories (`skill_categories` table) need their own management or at minimum an inline select when creating/editing a skill. The simplest approach: include a category dropdown populated from `useSkillCategories()` in the skill form. Category CRUD can be a separate sub-section if needed, but for v2.0 categories can be managed directly in the DB or via an inline "create category" modal.

**Career-specific consideration:** The `career_entry_type` enum (`job | education | milestone`) maps to a radio group or select in the form. Date fields (`start_date`, `end_date`) use `<input type="date">` with Zod `z.string().date()` validation. The `is_current` boolean toggles `end_date` visibility.

---

## Data Flow

### Public Homepage Data Flow (v2.0)

```
index.tsx mounts
    │
    ├── usePublishedCareerEntries()  → career.service → Supabase (career_entries)
    ├── usePublishedSkills()         → skills.service → Supabase (skills)
    ├── useSkillCategories()         → skills.service → Supabase (skill_categories)
    ├── usePublishedProjects()       → projects.service → Supabase (projects)
    └── usePageTexts()               → page-texts.service → Supabase (page_texts)
                                                 [NEW]

All queries run in parallel (TanStack Query — no waterfall)
    │
    ↓
index.tsx renders sections with data:
    CareerSection  ←  career.data
    SkillsSection  ←  skills.data + categories.data
    ProjectSection ←  projects.data
    Hero/headings  ←  texts['hero_headline'] etc.
```

### Admin Edit → Preview Flow (v2.0)

```
Admin at /admin/projects/$projectId/edit
    │
    ├── Edits project fields (status remains 'draft')
    ├── Clicks "Preview" button
    │
    ↓
Navigate to /projects/$projectId?preview=true
    │
    ├── Route validateSearch confirms preview=true
    ├── ProjectDetailPage checks auth.isAuthenticated (true for admin)
    ├── Calls useProject(id) — fetches all statuses, finds draft
    ├── Renders page with "Preview mode" banner
    │
    ↓
Admin clicks "Back to Admin" link in banner
    └── Returns to /admin/projects/$projectId/edit
```

### page_texts Admin Edit Flow (v2.0)

```
Admin at /admin/page-texts
    │
    ├── usePageTexts() fetches all rows as Record<string, string>
    ├── Form renders one input per key, grouped by section
    │
    ├── Admin edits "hero_headline" value
    ├── Clicks "Save"
    │
    ↓
useUpdatePageTexts mutation:
    supabase.from('page_texts').upsert({ key, value, section })
    onSuccess: queryClient.invalidateQueries({ queryKey: pageTextKeys.all })
    │
    ↓
Next public load gets fresh text from DB
```

---

## Integration Points

### New vs Modified Components

| Component / File | Action | Touch Point |
|------------------|--------|-------------|
| `CareerSection.tsx` | REPLACE | Swap `whileInView` for sticky container + `useScroll` |
| `CareerTimelineEntry.tsx` | MODIFY | Accept `style` prop for motion transforms (y, scale, opacity) |
| `SkillChip.tsx` | MODIFY | Add `proficiency` prop + Radix Tooltip for hover reveal |
| `SkillsSection.tsx` | MODIFY | Pass `skill.proficiency` to `SkillChip` |
| `__public/index.tsx` | MODIFY | Add `usePageTexts()`, render `texts['key']` in hero/section headings |
| `__public/projects/$projectId.tsx` | MODIFY | Add `validateSearch`, `useProject` for preview mode, preview banner |
| `AdminSidebar.tsx` | MODIFY | Add Skills, Career, Page Texts nav links |
| `admin/__guard/skills/*` | NEW | Full CRUD pages for skills |
| `admin/__guard/career/*` | NEW | Full CRUD pages for career entries |
| `admin/__guard/page-texts/index.tsx` | NEW | Single-page text editor |
| `hooks/useSkills.ts` | MODIFY | Add `useCreateSkill`, `useUpdateSkill`, `useDeleteSkill` mutations |
| `hooks/useCareer.ts` | MODIFY | Add `useCreateCareerEntry`, `useUpdateCareerEntry`, `useDeleteCareerEntry` mutations |
| `hooks/usePageTexts.ts` | NEW | `usePageTexts()`, `useUpdatePageTexts()` |
| `services/skills.service.ts` | MODIFY | Add `createSkill`, `updateSkill`, `deleteSkill` functions |
| `services/career.service.ts` | MODIFY | Add `createCareerEntry`, `updateCareerEntry`, `deleteCareerEntry` functions |
| `services/page-texts.service.ts` | NEW | `fetchPageTexts`, `upsertPageText` |
| `lib/types/database.types.ts` | REGENERATE | After `page_texts` migration runs |
| Supabase DB | MIGRATION | Add `page_texts` table with RLS |

### External Service Integration

| Service | Integration | Notes |
|---------|-------------|-------|
| Supabase (existing) | New table `page_texts` — same client, same pattern | RLS must allow public SELECT |
| Supabase auth (existing) | No change — `preview` route uses existing auth context | Do NOT use service role key client-side |
| motion/react (existing) | `useScroll` + `useTransform` added to CareerSection | Already installed as `motion@^12.23.9` |
| Radix UI Tooltip (existing) | `@radix-ui/react-tooltip` already in package.json | Use for SkillChip proficiency reveal |
| TanStack Router (existing) | `validateSearch: z.object({ preview: z.boolean().optional() })` | Zod already a dependency |

---

## Build Order Recommendation

The correct order respects hard dependencies (DB must exist before UI, mutations must exist before preview):

```
Phase 1: DB Migration
    Add page_texts table + RLS
    Regenerate database.types.ts
    Seed initial page_texts rows (hero_headline, etc.)

    GATE: No UI work should begin until types are regenerated.
          All subsequent phases depend on accurate TypeScript types.

Phase 2: Admin CRUD — Skills + Career
    services/skills.service.ts MODIFY (add mutations)
    services/career.service.ts MODIFY (add mutations)
    hooks/useSkills.ts MODIFY (add mutation hooks)
    hooks/useCareer.ts MODIFY (add mutation hooks)
    SkillForm.tsx + CareerEntryForm.tsx (new form components)
    Admin route files: /admin/__guard/skills/*, /admin/__guard/career/*
    AdminSidebar.tsx MODIFY (add nav links)

    RATIONALE: Admin CRUD first means real content can be entered into DB
    before the public UI is built. CareerSection's scroll redesign requires
    real data with realistic lengths to tune the vh heights correctly.
    Skills CRUD must exist before SkillChip proficiency display (need data).

Phase 3: Admin page_texts Editor
    services/page-texts.service.ts NEW
    hooks/usePageTexts.ts NEW
    /admin/__guard/page-texts/index.tsx NEW
    AdminSidebar MODIFY (add Page Texts link)

    RATIONALE: page_texts editor can be built independently from public UI.
    Build it before the public homepage integration so texts exist in DB
    when public rendering is tested.

Phase 4: Public Skills Section (SkillChip hover reveal)
    SkillChip.tsx MODIFY (add proficiency + Radix Tooltip)
    SkillsSection.tsx MODIFY (pass proficiency prop)

    RATIONALE: Simple enhancement. Requires Phase 2 to exist so proficiency
    values are populated in the DB. No scroll mechanics — lower risk.

Phase 5: Public Career Section (scroll-driven parallax)
    CareerSection.tsx REPLACE (sticky container + useScroll)
    CareerTimelineEntry.tsx MODIFY (accept style prop)

    RATIONALE: Highest animation complexity in v2.0. Keep it isolated in its
    own phase. Requires real data from Phase 2 to be visible and usable.
    Must be done after SkillsSection (simpler) to validate the scroll pattern
    approach before committing to the more complex Career implementation.

Phase 6: Public Homepage — page_texts + Draft Preview
    __public/index.tsx MODIFY (usePageTexts, render text values)
    __public/projects/$projectId.tsx MODIFY (validateSearch, preview banner)
    AdminSidebar or project edit page — add Preview link

    RATIONALE: Done last because it touches two existing stable routes.
    page_texts integration requires Phase 3. Draft preview requires the admin
    project edit UX to already exist so the Preview button has a home.
```

**Summary table:**

| Phase | What | Depends On | Risk |
|-------|------|------------|------|
| 1: DB Migration | `page_texts` table + RLS + type regen | Nothing | Low |
| 2: Admin Skills/Career CRUD | Service mutations + route files | Phase 1 | Low (copy projects pattern) |
| 3: Admin page_texts editor | New service + hook + admin route | Phase 1 | Low |
| 4: Public SkillChip hover | Tooltip + proficiency prop | Phase 2 (real data) | Low |
| 5: Career scroll parallax | Sticky container + useScroll | Phase 2 (real data) | Medium (animation tuning) |
| 6: Homepage texts + preview | usePageTexts + validateSearch | Phases 3 + 5 | Low-Medium |

---

## Anti-Patterns

### Anti-Pattern 1: Scroll Subscriber on Window

**What people do:** Add a `useEffect` with `window.addEventListener('scroll', handler)` and read `window.scrollY` to drive animation state via `useState`.

**Why it's wrong:** Fires on the main thread every scroll event, causes React re-renders at 60fps, defeats Framer Motion's MotionValue architecture which specifically bypasses React render for performance. Will jank on mobile.

**Do this instead:** Use `useScroll({ target: containerRef })` which returns a MotionValue that updates off the React render cycle. Pass the MotionValue directly to `motion.div style={{ y: motionValue }}`.

---

### Anti-Pattern 2: Service Role Key in the Browser

**What people do:** Create a second Supabase client with the service role key to bypass RLS for draft preview.

**Why it's wrong:** Service role keys must never be exposed in client-side bundles — they bypass all RLS and give full database access to anyone who opens DevTools.

**Do this instead:** Use the existing authenticated user session. The admin's JWT already carries the `user_role: 'admin'` claim (via the custom access token hook). Write an RLS policy `FOR SELECT USING (auth.jwt() ->> 'user_role' = 'admin')` on the drafts. The existing `supabase` client will use the admin's session token when authenticated.

---

### Anti-Pattern 3: useTransform Hooks Inside .map()

**What people do:** Call `useTransform(scrollYProgress, ...)` inside `.map()` on the entries array.

**Why it's wrong:** React hooks cannot be called conditionally or in loops. If entries.length changes between renders (e.g., during loading), hook call count changes and React throws.

**Do this instead:** Extract each entry's motion value computation into a child component (e.g., `CareerEntryLayer`). The child component calls its own `useTransform` unconditionally. This is the correct React pattern and aligns with how the existing per-entry `motion.div` pattern in CareerSection already works.

---

### Anti-Pattern 4: Hardcoded Copy Bypassing page_texts

**What people do:** Keep some strings hardcoded in JSX and only route some through `texts[key]`.

**Why it's wrong:** Partial adoption means the admin can't trust that editing a text key actually changes what visitors see. It also creates confusion about which strings are editable.

**Do this instead:** Define a complete list of page_texts keys upfront in the DB migration seed. Every section heading and intro that the admin should control must have a corresponding row. Fallback values (`?? 'Default Text'`) in JSX ensure graceful degradation but should never appear in production after initial seeding.

---

## Scaling Considerations

This is a single-admin personal portfolio. Scaling is not a concern. The architecture choices here optimize for:

1. **Developer experience** — predictable patterns (same shape as existing code)
2. **Content maintainability** — admin can update all copy without a redeployment
3. **Animation performance** — MotionValue-driven scroll (compositor thread) over JS scroll listeners
4. **Zero operational cost** — Supabase free tier is sufficient indefinitely for this traffic level

---

## Sources

- Motion official docs: [React scroll animations](https://motion.dev/docs/react-scroll-animations)
- Motion official docs: [useScroll hook](https://motion.dev/docs/react-use-scroll)
- Scroll pattern reference: [Cards parallax with Framer Motion](https://blog.olivierlarose.com/tutorials/cards-parallax)
- TanStack Router docs: [Search params validation with Zod](https://tanstack.com/router/latest/docs/framework/react/how-to/validate-search-params)
- Supabase docs: [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- Supabase docs: [Custom claims and RBAC](https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac)
- Direct codebase inspection: all findings about existing patterns are HIGH confidence from source

---
*Architecture research for: JonathanSantos.dev v2.0 feature integration*
*Researched: 2026-03-02*
