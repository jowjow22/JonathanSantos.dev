# Feature Research

**Domain:** Premium developer portfolio with CMS dashboard — v2.0 new features
**Researched:** 2026-03-02
**Confidence:** HIGH (existing codebase read; Framer Motion docs verified; CMS patterns verified against real-world implementations)

---

## Context: What Already Exists (Do Not Re-Implement)

The following are live and out of scope for this milestone:

- Project CRUD admin (create, edit, delete, publish toggle, image upload)
- Contact form with Edge Function + Resend email
- 3D particle hero, page transitions, scroll reveal animations, tilt/parallax effects
- Dark/light mode, GA4 analytics, SEO meta tags per page
- Auth guard, admin sidebar, unsaved-changes blocker dialog pattern
- SkillChip component (icon + name pill) and CareerTimelineEntry component (icon circle + vertical line + content)
- Both sections currently render "Content coming soon" when DB returns empty — infrastructure is wired

---

## Feature Landscape

### Table Stakes (Users Expect These)

These are the minimum bar. A visitor who lands on the portfolio in 2026 expects all of these. Absence signals incompleteness.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Skills section renders actual skills (not placeholder) | Data exists in DB; placeholder signals unfinished product | LOW | SkillChip and SkillsSection already exist; just needs real UX on top |
| Career section renders actual timeline (not placeholder) | Same DB situation; empty state is visible in public site | LOW | CareerSection and CareerTimelineEntry already exist |
| Admin can add/edit/delete skills | All other content is admin-managed; skills would be the only hardcoded exception | MEDIUM | Follows exact pattern of project CRUD |
| Admin can add/edit/delete career entries | Same as skills — consistency expectation | MEDIUM | Follows exact pattern of project CRUD |
| Admin can edit key page texts without a redeployment | Recruiters notice stale hero text; portability matters | MEDIUM | page_texts table needs DB migration first |
| Admin can preview a draft project before publishing | Standard CMS pattern — "publish blind" feels unprofessional | LOW | Simpler than external token/cookie approach; admin-only, single user |

### Differentiators (Competitive Advantage)

These are where the portfolio competes on visual craft. Not strictly required, but the entire value proposition of this site is "the experience is the proof."

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Scroll-driven career timeline with continuous parallax drift | Transforms a static list into a cinematic storytelling experience; signals motion expertise | HIGH | Must use useScroll + useTransform per entry ref; NOT whileInView snapshots |
| Skills grid with hover-reveal proficiency tooltip | Premium interaction that implies depth beneath the surface; rare among dev portfolios | MEDIUM | Hover card/tooltip with proficiency level + short descriptor; Framer Motion whileHover |
| Skill icons from devicons or custom URLs | Visual recognition — logos communicate faster than words | LOW | iconUrl column already in DB schema; just needs proper display and fallback |
| Career entry type differentiation (job / education / milestone) | Adds semantic richness; color-coded icons already in CareerTimelineEntry | LOW | Already implemented in component; needs no new logic — just show it properly |
| Page texts hot-editable from admin | Allows copy iteration without code deploy; shows maturity of admin system | MEDIUM | key-value flat table pattern; single form with all editable fields visible at once |
| Draft preview opens as visitor would see it | Closes the mental gap between "editing" and "publishing"; reduces publish anxiety | LOW | Admin-only route or query param; no external token needed for single-user case |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem appealing but create problems for this specific project. Explicitly avoid these.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Snap-section / full-page scroll for career timeline | Looks impressive in demos | Traps users; breaks native scroll; disables browser back; feels sluggish on mobile | Continuous scroll with parallax drift — entries appear at natural scroll speed |
| Inline editing (click to edit on the public page) | Feels modern and clever | Requires dual render modes, auth state on public routes, significant complexity | Separate admin form page; live preview via dedicated preview route |
| Proficiency bars (percentage or star ratings) | Signals numeric depth | Arbitrary, unverifiable, triggers debate ("you rated yourself 85% in React?"); common on bad resumes | Categorical labels: "Daily driver", "Proficient", "Familiar" — honest and defensible |
| Skills search/filter by category | Feels feature-rich | Overkill for a skills section with ~30 items; adds UI weight; users scroll, they don't search portfolios | Category grouping with visible headers (already the pattern) |
| WYSIWYG rich-text editor for career descriptions | Looks polished | Introduces serialization complexity, sanitization, render pipeline for a field that is one paragraph of plain text | Plain textarea with max 300 chars; markdown-lite if needed later |
| Draft versioning / revision history | CMS-complete feeling | Single admin, no collaboration, zero need for rollback — this is not a content team workflow | Simple draft/published status toggle; no version history |
| Secret URL token preview (Next.js draft mode style) | Industry standard for headless CMS | Next.js draft mode uses HTTP cookies and server rendering; this is a static SPA with client-side auth — token pattern adds complexity with zero benefit for single admin | Admin-authenticated preview route: `/admin/projects/:id/preview` renders public ProjectDetail component inside admin shell |
| Drag-to-reorder for skills/career entries in admin | Nice DX | Complex to implement correctly (dnd-kit), subtle accessibility requirements, not worth the cost for content that changes rarely | Manual sort_order number field — already the pattern for projects |

---

## Feature Dependencies

```
[Admin Skills CRUD]
    └──required by──> [Public Skills Grid with hover] (needs populated data)

[Admin Career CRUD]
    └──required by──> [Public Career Timeline parallax] (needs populated data)

[DB migration: page_texts table]
    └──required by──> [Admin Page Texts Editor]
                          └──feeds──> [Public hero headline / section headings]

[Existing: project status field ('draft' | 'published' | 'archived')]
    └──enables──> [Admin Draft Preview] (status already tracked; just need a preview render route)

[Existing: SkillChip component]
    └──enhanced by──> [Hover-reveal proficiency tooltip]

[Existing: CareerTimelineEntry component]
    └──replaced by──> [Scroll-driven parallax variant] (new animation layer on top)

[Existing: ProjectForm pattern (react-hook-form + zod + toast + TanStack Router)]
    └──cloned into──> [SkillForm, CareerEntryForm, PageTextsForm]
```

### Dependency Notes

- **Admin CRUD must precede public section upgrades:** The public Career and Skills sections currently fall through to an empty state. Build and populate admin forms first, then style the public UX — otherwise animating an empty list is wasted effort.
- **page_texts DB migration is a hard blocker:** The table does not exist yet. Admin page texts editor cannot start without the migration. Include migration as the first task of that feature.
- **Draft preview has zero new infrastructure dependency:** project status='draft' already exists; `ProjectDetail` public component already exists. Preview is just routing + auth guard, not a new data model.
- **Hover proficiency requires proficiency data in DB:** The `skills` table has a `proficiency` column (check schema); if not, migration needed before hover tooltip can show meaningful data.

---

## MVP Definition

This is a milestone (v2.0), not a greenfield MVP. The milestone is complete when all six features below are shipped.

### Ship Together (v2.0)

All six features are independent enough to develop in parallel but should ship together because the public site currently shows "coming soon" for both Skills and Career — partial shipping would feel incomplete.

- [ ] Public Skills grid with hover-reveal proficiency — the visual upgrade that makes the section premium
- [ ] Public Career timeline with scroll-driven parallax drift — the cinematic centrepiece of v2.0
- [ ] Admin Skills CRUD — populates the Skills section; blocks public section being meaningful
- [ ] Admin Career Entry CRUD — populates the Career section; blocks public section being meaningful
- [ ] Admin Page Texts editor — closes the content-ownership gap; hero/section copy editable without redeploy
- [ ] Admin Draft Preview for projects — small but high-signal quality-of-life for publishing workflow

### Intentionally Deferred

- [ ] Skills filter/search by category — not needed at current scale; category grouping is sufficient
- [ ] Drag-to-reorder in admin — sort_order number field is sufficient for infrequent edits
- [ ] Inline page editing — disproportionate complexity vs separate admin form
- [ ] Career entry rich text — plain textarea sufficient; markdown later if needed

---

## Feature Prioritization Matrix

| Feature | Visitor Value | Admin Value | Implementation Cost | Priority |
|---------|--------------|-------------|---------------------|----------|
| Admin Skills CRUD | LOW (backend) | HIGH (enables section) | LOW | P1 — must precede public section |
| Admin Career CRUD | LOW (backend) | HIGH (enables section) | LOW | P1 — must precede public section |
| Public Skills grid + hover | HIGH | LOW | MEDIUM | P1 — core v2.0 deliverable |
| Public Career timeline parallax | HIGH | LOW | HIGH | P1 — centrepiece of v2.0 |
| Admin Page Texts editor | MEDIUM | HIGH | MEDIUM | P1 — closes content-ownership gap |
| Admin Draft Preview | LOW | HIGH | LOW | P2 — quality-of-life; low cost |

**Priority key:**
- P1: Required for v2.0 milestone to be called done
- P2: Should ship in v2.0; low enough cost that deferring makes no sense

---

## UX Behavior Specification

### Feature 1: Scroll-Driven Career Timeline (Continuous Parallax)

**The core UX contract:** As the user scrolls naturally down the page, each career entry drifts in from a different depth. Entries don't snap or require interaction. The user never loses their scroll position. No scroll hijacking.

**How it works mechanically:**
- Each entry is a `motion.div` with its own `ref` passed to `useScroll({ target: ref, offset: ['start end', 'end start'] })`
- `scrollYProgress` for that entry maps from 0 (entry bottom at viewport bottom) to 1 (entry top at viewport top)
- `useTransform(scrollYProgress, [0, 1], ['40px', '-20px'])` creates a mild y-drift
- A second `useTransform` for opacity: `[0, 0.15, 0.85, 1]` → `[0, 1, 1, 0.6]` fades entries as they travel past
- Entry type icon (job/education/milestone) and color coding is already implemented — retain it
- The vertical connecting line between entries must remain visible during scroll (position it in a sticky or absolute layer, not tied to individual entry motion)

**What "continuous parallax drift" means in this context:**
- NOT: entries that snap into view one at a time like sections
- NOT: a progress bar or timeline scrubber the user interacts with
- YES: entries that start slightly below their natural position and drift upward past their resting point as you scroll through them — like leaves floating up a gentle current
- The effect should be subtle (20-40px drift range) — this is a portfolio, not a scroll-hijack demo site

**Confidence:** HIGH — useScroll + target + offset is documented and verified against motion.dev; this exact pattern (per-element scroll tracking) is well-established.

---

### Feature 2: Interactive Skills Grid (Hover-Reveal)

**The core UX contract:** Skills appear as icon+name chips (current implementation). On hover, a tooltip or popover reveals the proficiency category and optionally a short descriptor. The grid feels alive without being distracting.

**How it works:**

Current SkillChip is a static pill: icon + name. Upgrade path:

1. Wrap SkillChip in a Framer Motion `motion.div` with `whileHover={{ scale: 1.08 }}` — subtle lift
2. On hover, show a small tooltip above the chip containing:
   - Proficiency label (e.g., "Daily driver", "Proficient", "Familiar") — NOT a percentage bar
   - Optional: years of experience if stored
3. Tooltip animates in with `initial={{ opacity: 0, y: 4 }}` → `animate={{ opacity: 1, y: 0 }}`
4. Tooltip is absolutely positioned above the chip, z-indexed above siblings

**Proficiency labels (NOT bars):**
- "Daily driver" — tools used every day in production
- "Proficient" — comfortable, used on real projects
- "Familiar" — studied or used in side projects
- These map to enum values in DB (proficiency column)

**Premium signals:**
- Icon renders cleanly at 16px (devicons or SVG from iconUrl)
- Fallback to generic code icon when iconUrl is null (already done in SkillChip)
- Stagger-in animation on section scroll-into-view (already implemented with chipContainerVariants)
- Category headers are visually distinct but unobtrusive (already styled with uppercase tracking)
- Hover state has a subtle ring or glow — `box-shadow: 0 0 0 1px var(--ring)` in Tailwind

**Confidence:** HIGH — whileHover pattern is core Framer Motion; tooltip positioning is standard CSS.

---

### Feature 3: Admin Skills CRUD

**Pattern to follow exactly:** existing project CRUD
- List page: table with columns (Name, Category, Proficiency, Order) + Edit/Delete row actions
- New/Edit page: form with react-hook-form + zod validation + toast notifications + unsaved-changes blocker
- Delete: AlertDialog confirmation (same DeleteProjectDialog pattern)
- Fields: name (text), category_id (select from skill_categories), proficiency (select enum), icon_url (text input), sort_order (number)
- No image upload required — icon_url is a plain URL string

**Admin UX addition for categories:**
- Skills have categories (skill_categories table). Admin needs to manage categories too.
- Simple approach: a separate small section or tab within the Skills admin for category CRUD (name, sort_order)
- Do NOT build a fully separate route for categories — a collapsible panel on the skills list page is sufficient

**Confidence:** HIGH — mirrors existing pattern exactly; DB tables already exist per PROJECT.md.

---

### Feature 4: Admin Career Entry CRUD

**Pattern to follow exactly:** existing project CRUD
- List page: table with columns (Title, Company, Type, Start Date, Current?) + Edit/Delete
- New/Edit page: react-hook-form + zod + toast + unsaved-changes blocker
- Fields: title (text), company (text, optional), type (select: job/education/milestone), start_date (date), end_date (date, optional), is_current (checkbox), description (textarea, max 300 chars), sort_order (number)
- Delete: AlertDialog confirmation

**No complexity additions:** Do not add rich text, markdown preview, or file attachments. Plain textarea for description is correct.

**Confidence:** HIGH — mirrors existing pattern; career_entries table already exists.

---

### Feature 5: Admin Page Texts Editor

**The core UX contract:** A single admin page shows all editable text fields (hero headline, hero tagline, Experience section heading, Experience intro, Projects section heading, Projects intro). Admin edits and saves. Public site reads from DB on load.

**DB schema needed (new migration):**
```sql
CREATE TABLE page_texts (
  key   TEXT PRIMARY KEY,   -- e.g. 'hero.headline', 'experience.intro'
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Admin form pattern:**
- Single form page at `/admin/page-texts`
- Loads all rows from page_texts, maps key → field
- Uses react-hook-form with all fields pre-populated from DB values
- One "Save All" button — single upsert call
- No per-field save; this is a settings page, not a list CRUD
- Add to admin sidebar under a "Content" or "Site Settings" section

**Public consumption:**
- A `usePageTexts()` hook fetches all rows on public page load
- Falls back to hardcoded default strings if DB row is missing — prevents blank UI if migration partial
- The hook result is passed as props into the hero and section heading components
- Do NOT make page text reactive/realtime — simple fetch-on-mount is sufficient

**Keys to manage (initial set):**
- `hero.headline`
- `hero.tagline`
- `experience.heading`
- `experience.intro`
- `projects.heading`

**What NOT to do:**
- Do NOT build a WYSIWYG editor — these are short plain-text strings
- Do NOT version the texts or add revision history
- Do NOT make every string in the app editable — scope to the listed keys only

**Confidence:** HIGH — key-value table pattern is the canonical simple CMS approach; no new libraries needed.

---

### Feature 6: Admin Draft Preview for Projects

**The core UX contract:** On the project list or edit page, a "Preview" button opens a view of the project detail page exactly as a visitor would see it, even if status='draft'.

**Implementation (simple, no tokens needed):**

Since this is a single-admin SPA with client-side auth, the simplest correct approach is:

1. Add a `/admin/projects/:projectId/preview` route
2. This route is inside the `__guard` layout (auth-protected)
3. It renders the exact same `ProjectDetail` public component but with a different data fetch: fetch by ID regardless of status (admin Supabase client with service key or auth bypass)
4. Optionally wrap in a banner: "PREVIEW MODE — This project is not published"
5. The "Preview" button on the edit form navigates to this route in a new tab

**What this is NOT:**
- NOT a public preview URL with secret tokens
- NOT a cookie/server-side draft mode (this is a static SPA)
- NOT a live-updated preview pane (not a split-screen editor)

**Why the simple approach is correct here:**
- Single admin user — no need to share preview URLs with non-admin stakeholders
- Static SPA — no server rendering pipeline to hook into
- Auth guard already exists — preview route inherits protection for free
- ProjectDetail component already exists — just reuse it

**Confidence:** HIGH — this is a routing problem, not a CMS infrastructure problem. The component already exists.

---

## Competitor Feature Analysis

| Feature | Common Portfolio Pattern | How Most Devs Do It | Our Approach |
|---------|--------------------------|---------------------|--------------|
| Skills display | Static icon grid, no interaction | divs with SVG logos, no hover | Icon chips + hover proficiency tooltip |
| Career timeline | Vertical list with dots and lines | whileInView fade-in from side | useScroll per-entry parallax drift |
| Editable copy | Hardcoded in JSX, redeploy to change | String constants in component | DB-backed key-value via admin form |
| Draft preview | No preview, publish blind | Toggle published and look at site | Auth-protected preview route in admin |
| Admin for skills | Manually edit DB or redeploy | Edit Supabase table directly | Full CRUD admin form, same pattern as projects |

---

## Sources

- Motion (Framer Motion) scroll animations: [motion.dev/docs/react-scroll-animations](https://motion.dev/docs/react-scroll-animations)
- useScroll target + offset pattern verified: [motion.dev search results for useScroll element tracking]
- Parallax per-element pattern (Olivier Larose tutorial): [blog.olivierlarose.com/tutorials/smooth-parallax-scroll](https://blog.olivierlarose.com/tutorials/smooth-parallax-scroll) — HIGH confidence
- Draft preview token pattern (Payload CMS, Contentful): [payloadcms.com/docs/versions/drafts](https://payloadcms.com/docs/versions/drafts) — used to decide NOT to use token pattern for single-admin SPA
- CMS inline editing vs form editing: [contentstack.com/blog/all-about-headless/inline-editors-extinct-modern-cms](https://www.contentstack.com/blog/all-about-headless/inline-editors-extinct-modern-cms) — confirms form-based editing is current best practice for headless-style architectures
- Existing codebase: CareerSection.tsx, CareerTimelineEntry.tsx, SkillsSection.tsx, SkillChip.tsx, ProjectForm.tsx — read directly (HIGH confidence on existing patterns)

---

*Feature research for: JonathanSantos.dev v2.0 — Content & Experience milestone*
*Researched: 2026-03-02*
