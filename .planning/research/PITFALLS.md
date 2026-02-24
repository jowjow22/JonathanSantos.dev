# Pitfalls Research

**Domain:** React 19 + Framer Motion + Supabase portfolio — v2.0 feature additions
**Researched:** 2026-03-02
**Confidence:** HIGH (code read + official docs + verified GitHub issues)

> This file replaces the v1.0 pitfalls file and covers both the retained v1.0 risks
> and the new v2.0 pitfalls introduced by scroll-driven animations, admin CRUD expansion,
> the page_texts table, and draft preview routing.

---

## Critical Pitfalls

### Pitfall 1: useScroll scrollYProgress Stays at 0 in the Existing SPA Layout

**What goes wrong:**
`useScroll()` with a `target` ref or `container` ref returns `scrollYProgress` stuck at `0` or `1`.
The Career section's parallax entries never animate. This happens because the scroll container
in this SPA is `window`, but the `main` element inside `AnimatedOutlet` clips overflow, making
the actual scrollable ancestor ambiguous. In production builds the symptom is worse — `useLayoutEffect`
fires before the DOM is fully measured, cementing a wrong initial value.

**Why it happens:**
Two compounding causes:

1. `useScroll` measures the scroll container at mount time using `useLayoutEffect`.
   If the component mounts before layout is stable (common after `AnimatePresence`'s enter
   animation runs), the measurement is stale.
2. The confirmed production build issue (Motion GitHub #2452): in Vite production builds,
   `useLayoutEffect` can fire too early, returning incorrect scroll offset. The fix is
   `layoutEffect: false` in the `useScroll` call.

**How to avoid:**
- Use `layoutEffect: false` in every `useScroll` call on this site:
  ```ts
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
    layoutEffect: false,
  })
  ```
- Do NOT pass a `container` ref unless the section truly has its own scroll container
  (it doesn't — this is a single-page scroll site).
- Verify behavior in both `vite dev` and `vite build` modes before considering it done.

**Warning signs:**
- Career entries don't move at all during scroll
- DevTools shows `scrollYProgress` motion value frozen at `0`
- Works in dev, broken in production build

**Phase to address:**
Career section scroll implementation (Phase 2 or equivalent scroll-driven phase).

---

### Pitfall 2: Scroll-Linked Parallax Jitters on Mobile (Separate Thread Problem)

**What goes wrong:**
On iOS and Android, `useScroll` + `useTransform` → `translateY` causes visible jank/jitter
on mid-range phones. Elements appear to lag 1-2 frames behind scroll position.

**Why it happens:**
Browser scroll runs on the compositor thread. JavaScript animation (including Framer Motion's
motion value updates) runs on the main thread. The two threads are not synchronized. When
`translateY` changes are driven by scroll events through JS, the browser cannot perfectly
synchronize the visual update with the scroll position, producing stutter.

This is a documented limitation acknowledged by Motion's maintainer (GitHub #2770): "position:
sticky should be used for this because browser scroll is on a different thread."

**How to avoid:**
For the Career section's "entries drift in 3D space" effect, use `position: sticky` as the
structural mechanism for pinning, and use `useScroll` only for opacity / subtle scale transforms
— NOT for primary position-tracking transforms that must stay pixel-perfect with scroll.
Applying `will-change: transform` on the animated elements hints the browser to promote to
its own compositor layer, which reduces paint cost.

Completely disable the parallax effect on mobile:
```ts
const isMobile = window.matchMedia('(max-width: 768px)').matches
const y = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [-30, 30])
```

The existing `use-mobile.ts` hook can drive this conditionally.

**Warning signs:**
- Smooth on MacBook, stutters on phone
- Chrome DevTools "Rendering > Frame rendering stats" shows dropped frames during scroll
- User feedback about site feeling "laggy on mobile"

**Phase to address:**
Career section scroll implementation. Test on real device before shipping.

---

### Pitfall 3: AnimatePresence Page Transition Interferes with Scroll-Driven Sections

**What goes wrong:**
When navigating from `/projects/$projectId` back to `/` (the homepage with Career + Skills
sections), the `AnimatedOutlet` re-mounts the homepage. All `useScroll` refs are re-created.
All `whileInView` animations have `once: true`, so they will NOT replay. But if the page
transition's `AnimatePresence mode="wait"` holds the previous page in DOM during exit
animation while the new page is mounting, scroll positions from the dying page can bleed
into the entering page's initial `useScroll` measurements.

**Why it happens:**
`AnimatedOutletInner` uses `structuredClone(routerContext)` to hold the exiting route in DOM.
Both the exiting and entering route components exist simultaneously for 250ms (exit duration).
If `useScroll` inside the entering route initializes during this overlap window, it may
measure a scroll container that is partially owned by the exiting route's layout.

**How to avoid:**
- Defer scroll-animation setup until after the enter transition completes. Use
  `useIsPresent()` from `motion/react` to gate `useScroll` initialization:
  ```tsx
  const isPresent = useIsPresent()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    layoutEffect: false,
    // only measure when page is fully present
  })
  ```
- Alternatively, add a `key` to the Career section that forces full remount on route entry,
  ensuring scroll measurements are always fresh.
- Reset `window.scrollTo(0, 0)` in `AnimatedOutlet`'s `onAnimationComplete` to ensure clean
  scroll state before parallax takes over.

**Warning signs:**
- Career parallax starts from wrong position on first render after navigation
- Stagger animations replay incorrectly on the second visit to homepage
- `scrollYProgress` jumps to a non-zero value immediately on mount

**Phase to address:**
Career section + page transitions integration testing.

---

### Pitfall 4: Skill Icon Images Break Layout When URL is Null or 404

**What goes wrong:**
`SkillChip` renders `<img src={iconUrl} alt={name} className="size-4 object-contain" />` when
`iconUrl` is non-null. If the icon URL is a broken external link or a Supabase Storage path
that requires a signed URL, the image fails silently but the layout shifts because the `size-4`
box flickers between 0 and 16px height as the broken image resolves.

With hover-reveal expanding to show proficiency/details, a broken icon inside the chip creates
an awkward visual hole. The expanded state may also have layout shift if the icon dimensions
change between collapsed and expanded.

**Why it happens:**
`SkillChip` currently renders the img unconditionally when `iconUrl` is truthy. It does not
handle the `onerror` case. In the new admin CRUD, admins can set `icon_url` to any string —
an incorrectly typed URL or a relative path will produce a broken image.

**How to avoid:**
- Add `onError` to the `<img>` to fall back to `<IconCode>`:
  ```tsx
  const [imgError, setImgError] = useState(false)
  // render IconCode if imgError
  ```
- In the admin skill form, validate that `icon_url` is an absolute URL (or empty) using Zod.
- Use a fixed `size-4` box wrapper around both the img and the fallback icon so the chip
  width never changes between states.
- For the hover-reveal expansion, lock the chip width and height before revealing details to
  prevent layout shift.

**Warning signs:**
- Skills grid has inconsistent chip widths on first render
- Console shows 404 for icon URLs in the network tab
- Layout shifts (CLS) flagged in Lighthouse

**Phase to address:**
Skills section hover-reveal implementation + admin skills CRUD form.

---

### Pitfall 5: Admin CRUD Query Key Mismatch Causes Stale Cache Between Admin and Public Views

**What goes wrong:**
When admin updates a skill or career entry, the public-facing data stays stale in TanStack
Query's cache. The existing pattern for projects (invalidating `projectKeys.all`) works
because both admin and public use the same base key. This pattern must be replicated exactly
for skills and career entries, or the public sections will display outdated data until the
user's `staleTime` (5 minutes) expires.

More specifically: `skillKeys.all` is `['skills']` and the admin mutation must invalidate
`['skills']` (not a specific sub-key) to bust both the published query and any admin-specific
query. If a developer creates `skillKeys.admin` as a separate key tree and mutates only that,
the public `['skills', 'published']` cache is untouched.

**Why it happens:**
The query key factory pattern (used correctly in `useProjects.ts`) is easy to violate when
adding new entities. If the admin skills hook is written by a different session or in a hurry,
it may invalidate `['skills', 'admin']` instead of `['skills']`, leaving the published
variant stale.

**How to avoid:**
- Invalidate the root key (`skillKeys.all`, `careerKeys.all`) in every admin mutation's
  `onSuccess`, not sub-keys. This matches the pattern in `useDeleteProject`.
- Add a comment above each key factory explaining the invalidation contract.
- For the `page_texts` feature: use a single query key `['page_texts']` and invalidate the
  whole key after any admin save — do not create separate admin/public variants.

**Warning signs:**
- Admin saves a skill → refreshes public page → old skill name still showing
- React Query Devtools shows `['skills', 'published']` with `isStale: false` after admin mutation
- Lighthouse shows stale data in browser cache

**Phase to address:**
Admin skills CRUD + admin career CRUD implementation.

---

### Pitfall 6: Draft Preview Leaks Unpublished Projects to Public via Status Filter Removal

**What goes wrong:**
The draft preview feature requires the admin to view a project with `status: 'draft'` on the
public-facing project detail page. The implementation risk is accidentally removing or
relaxing the `status = 'published'` filter in `fetchPublishedProjectById` — either by
reusing `fetchProjectById` (which queries all statuses) in the wrong route, or by passing
a query param that the public route reads to disable the published filter.

If the public route handler uses `?preview=true` as a boolean to bypass the status filter,
and that query param is discoverable (e.g., someone guesses `?preview=true` on a known
project ID), unpublished content becomes publicly accessible.

**Why it happens:**
The simplest implementation of "preview" is to add a condition: "if preview param is present,
fetch without the status filter." This is both the obvious approach AND the security hole.

**How to avoid:**
- Draft preview must NEVER relax the public fetch function. Instead, use a separate route
  under `admin/__guard/projects/$projectId/preview` that renders the public UI template
  but fetches via the admin `fetchProjectById` (which already queries all statuses,
  guarded by the auth check in `__guard/route.tsx`).
- The public `fetchPublishedProjectById` must NEVER be modified to accept a bypass flag.
- Do NOT route preview through the public URL `/projects/$projectId?preview=true` — this
  exposes the URL pattern and risks accidental public access if the guard fails.
- Guard route already uses `beforeLoad` to redirect unauthenticated users, so admin-only
  preview routes inherit the protection automatically.

**Warning signs:**
- Preview accessible when logged out
- Network tab shows the preview route calling `fetchPublishedProjectById` instead of `fetchProjectById`
- Query param `?preview=true` works on the public `/projects/$projectId` URL

**Phase to address:**
Draft preview implementation (admin phase).

---

### Pitfall 7: page_texts Table RLS Allows Public Writes if Misconfigured

**What goes wrong:**
The `page_texts` table does not yet exist and must be created in v2.0. If the developer
creates the table and enables RLS but writes the policies in the wrong order — or forgets
to add a write policy before testing — the anon role could either read nothing (breaking
the public site) or write anything (allowing public text injection).

The "public read, admin write" split is the same pattern as all other tables, but it's
easy to copy-paste the projects RLS policy and accidentally reference `projects`-specific
column names or use `uid()` in the SELECT policy (which would block public reads).

**Why it happens:**
Supabase tables have RLS disabled by default. When RLS is enabled without any policies, ALL
access is denied (including SELECT for anon). This causes the public portfolio to render
empty headings immediately after enabling RLS — before the correct policies are added.

**How to avoid:**
Order of operations matters:
1. Create table with RLS OFF
2. Write and verify the SELECT policy (anon can read all rows)
3. Write and verify the INSERT/UPDATE policy (auth.uid() matches admin UID)
4. Enable RLS only after both policies are confirmed correct in Supabase Table Editor
5. Test: unauthenticated GET returns data; unauthenticated POST returns 403

Use the existing pattern from the `projects` table as a template — it has been verified working.

**Warning signs:**
- Public site renders blank section headings after page_texts table creation
- Supabase logs show `permission denied` for anon role on `page_texts`
- Admin save returns 403 before auth check

**Phase to address:**
page_texts table migration + admin page texts editor.

---

### Pitfall 8: Stagger Animations with whileInView Replay on Every Route Re-Entry

**What goes wrong:**
The Skills section uses `whileInView` with `viewport={{ once: true }}`. The `once: true`
option fires the animation one time and never again — until the component is unmounted and
remounted. Because the homepage is unmounted on every navigation away and remounted on return
(due to `AnimatePresence mode="wait"` with the route key), the stagger animation replays
on every visit.

This is actually intentional Framer Motion behavior and is fine for entrance animations.
BUT if the animation duration is long (e.g., 50 chips × 0.06s stagger = 3s total), returning
users see the full loading sequence every time they come back to the homepage. This feels
broken, not polished.

**Why it happens:**
`once: true` means "once per mount", not "once ever". The route key change in `AnimatedOutlet`
forces a full remount of the homepage on each navigation.

**How to avoid:**
- Keep the stagger delay small: 0.06s per chip is the current value — this caps at ~3s for
  50 skills. If the final skill count is high (30+), reduce to 0.04s or 0.03s.
- Add `reducedMotion="user"` (already on `MotionConfig` in `PublicLayout`) — users with
  `prefers-reduced-motion` skip the stagger entirely.
- Consider `initial={false}` on the parent stagger container to skip the entrance animation
  on second and subsequent mounts. The `AnimatePresence` at the route level already provides
  an entrance animation, so double-animating is redundant.
- Total stagger duration should be under 1.5s for good UX.

**Warning signs:**
- Skills grid takes more than 2 seconds to fully appear
- On fast return navigation, the stagger restarts awkwardly over the page-enter animation
- Performance tab shows many simultaneous style recalculations

**Phase to address:**
Skills section implementation + polish pass.

---

### Pitfall 9: Admin Skill/Career Order Changes Not Reflected in Public Section

**What goes wrong:**
Skills and career entries have `sort_order` columns. If the admin reorders items via the
drag-and-drop UI (using `@dnd-kit/sortable`, already installed), the update mutations write
new `sort_order` values to Supabase. However, the public-facing query uses
`order('sort_order', { ascending: true })`, which means the cache must be fresh to reflect
the new order.

The specific failure mode: admin reorders skills → `queryClient.invalidateQueries(['skills'])`
fires → public page is NOT open in any tab → the invalidation marks the query as stale but
does not trigger a refetch (because there are no active observers) → later, when the public
page loads, it fetches fresh data correctly. This is actually fine.

The dangerous variant: admin reorders in one browser tab while public tab is already open →
the public tab will not refetch until its `staleTime` (5 min) expires. The public visitor
sees the wrong order for up to 5 minutes.

**Why it happens:**
This is expected TanStack Query behavior: `invalidateQueries` only refetches active queries
in the same `QueryClient` instance. The public tab is a different browser tab = different
QueryClient = no shared cache.

**How to avoid:**
This is an acceptable tradeoff for a single-admin portfolio. Document it as a known
limitation: "order changes may take up to 5 minutes to appear on the public site."
Do NOT reduce `staleTime` to 0 to "fix" this — it would cause a Supabase request on
every page render, burning through free tier quota.

If real-time order update is desired later, Supabase Realtime subscriptions could push
invalidations across tabs, but that is out of scope for v2.0.

**Warning signs:**
- "The order isn't updating!" from the admin (Jonathan) immediately after reordering
- This is not actually a bug — set expectations in admin UI with a "changes visible in
  ~5 min" note

**Phase to address:**
Admin skills CRUD (UX copy/notice).

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Reuse `ProjectForm` as a template for SkillForm/CareerForm without abstraction | Fast implementation | Four near-identical form components; any shared logic (toast, error handling) duplicated | Acceptable in v2.0 — portfolio won't grow beyond these 4 entity types |
| Implement preview as admin route instead of URL-shareable preview token | No security complexity | Admin cannot share a preview link with a client | Acceptable — single-admin portfolio, no need for shareable previews |
| page_texts as flat key-value rows with a hardcoded key enum | Simple to query | Adding a new editable text requires a migration | Acceptable — the set of editable texts is known and stable for v2.0 |
| `layoutEffect: false` on all useScroll calls | Avoids production build bug | Slightly delayed measurement on first render | Acceptable — delays are imperceptible (< 1 frame) |
| Disable parallax on mobile entirely | Avoids mobile jitter | Mobile users miss the cinematic Career experience | Acceptable — mobile experience with a clean static timeline is better than jittery parallax |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| `useScroll` + `AnimatedOutlet` | Calling `useScroll` in a component that mounts during the 250ms page transition overlap window, getting measurements from the exiting page's DOM | Use `layoutEffect: false` and defer scroll setup to after `isPresent` is true |
| `motion/react` vs `motion/react-client` import | Importing from `motion/react-client` in a non-RSC context causes no error in Vite but may behave differently from `motion/react` — the codebase already mixes both | Use `motion/react` for hooks (`useScroll`, `useTransform`, `useSpring`); use `motion/react-client` only for RSC-compatible motion components in Vite (it is equivalent in a pure CSR app, but keep it consistent) |
| Supabase `throwOnError()` + admin mutations | Using `.throwOnError()` in mutation functions causes unhandled promise rejections if the mutation is called inside an event handler without a `.catch()` — TanStack Query's `useMutation` does not catch thrown errors from `mutationFn` automatically for all cases | Wrap mutation service functions in try/catch inside `useMutation.mutationFn`, or rely on `onError` callback in `useMutation` options — the current projects pattern uses `throwOnError` and handles errors in `onError`, which is correct |
| TanStack Router search params for preview | Defining `?preview=true` as a search param on the public project route creates a URL that bypasses the published filter | Use a separate admin-guarded route for preview — never add preview logic to the public route |
| `@dnd-kit/sortable` + Framer Motion | Framer Motion layout animations (`layout` prop) and dnd-kit's drag transform can conflict, producing double-transforms during drag | Do NOT add `layout` prop to dnd-kit sortable items; let dnd-kit handle the drag transform exclusively |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| `useScroll` inside every Career entry component | Each entry gets its own scroll listener; 10 entries = 10 scroll observers firing on every scroll event | Use one `useScroll` in the parent Career section; pass individual `scrollYProgress` values via `useTransform` to each entry | Breaks noticeably with 5+ entries on mid-range mobile |
| `whileInView` with `once: false` on skill chips | Every scroll past the skills section retriggers 30+ stagger animations | Keep `once: true` (already set); never remove it | Breaks on any return visit to the homepage |
| Inline SVG icons in every skill chip (if switching from `<img>` to SVG) | 30 skills × SVG DOM nodes = hundreds of extra DOM nodes; layout thrash on hover-reveal | Continue using `<img>` for external icon URLs; use a single `<IconCode>` fallback component, not inline SVG | Breaks at 20+ skills with complex hover transforms |
| Fetching `page_texts` on every page render without caching | Each public page mount hits Supabase for editable texts | Set `staleTime: 10 * 60 * 1000` (10 min) on the page_texts query — texts change very rarely | Breaks Supabase free tier quota at ~100 daily visitors with short staleTime |
| Running both the particle canvas animation AND scroll-driven Career parallax simultaneously | Compound GPU load; particles + parallax on mid-range mobile causes dropped frames | The particle canvas is only on the hero section (above fold); Career section is below fold — they should never be on screen simultaneously. Verify with Intersection Observer that the canvas loop pauses when hero is off-screen | Breaks on devices with < 2GB RAM if sections overlap during scroll |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Creating `page_texts` table without RLS or with wrong policies | Anonymous users can inject arbitrary text into portfolio headings via direct Supabase API call | Enable RLS on `page_texts` immediately; SELECT public (anon), INSERT/UPDATE admin-only |
| Implementing draft preview by conditionally removing `status = 'published'` filter on the public route | Unpublished projects accessible to anyone who knows the project ID | Preview must be a separate admin-guarded route; public fetch functions must never be modified |
| Using `fetchProjectById` (no status filter) in a route that is outside `__guard` | Any project, including drafts and deleted items, becomes publicly readable | `fetchProjectById` is for admin-only use; all public routes must use `fetchPublishedProjectById` |
| Forgetting RLS on new tables (skills admin mutations, career mutations) | Write access without authentication; visitor can insert/delete portfolio content | The existing `skills` and `career_entries` tables already have RLS — verify policies before adding write operations in v2.0 admin hooks |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Career section parallax makes text hard to read during scroll | Content that moves while reading causes eye strain and frustration | Parallax should apply to decorative elements (background depth layers, entry icon circle) NOT to the text content itself — text stays fixed, chrome drifts |
| Hover-reveal on skills requires desktop hover — mobile has no hover | Mobile visitors never see proficiency/details for any skill | Ensure the hover-reveal state is also triggerable by tap/click on mobile; `@media (hover: hover)` to distinguish desktop hover from mobile tap |
| Admin "Edit page texts" form saves all texts as one transaction | If one field has a validation error, the entire save fails and other valid changes are lost | Save per-row (each text key saves independently) OR validate all fields client-side before submitting |
| Skills section shows "Content coming soon" flash before Supabase responds | Visitors see a "coming soon" placeholder for 200-500ms even when data exists | The current code already handles `isLoading` with skeleton — ensure the empty state ("Content coming soon") only renders when `!isLoading && skills.length === 0`, not during loading |
| Career section continuous parallax with many entries causes the section to be taller than expected | Users scroll much longer than anticipated to reach Projects section | Cap the Career section height; use `position: sticky` for a panel that advances entry content, rather than vertical expansion per-entry |

---

## "Looks Done But Isn't" Checklist

- [ ] **useScroll parallax:** Tested in `vite build` production mode, not just `vite dev` — scrollYProgress can behave differently (see Pitfall 1)
- [ ] **Mobile parallax:** Tested on a real phone or DevTools mobile throttle — jitter is invisible on desktop (see Pitfall 2)
- [ ] **Draft preview security:** Verified that `/projects/$projectId` without authentication does NOT show draft content, even with `?preview=true` appended manually (see Pitfall 6)
- [ ] **Skills stagger duration:** Count the actual published skill count and multiply by `staggerChildren` delay — total must be under 1.5s (see Pitfall 8)
- [ ] **page_texts RLS:** Tested with an unauthenticated Supabase client that SELECT works and INSERT fails (see Pitfall 7)
- [ ] **Admin mutation invalidation:** After saving a skill in admin, the public skills section on the homepage shows updated data after a hard refresh (cache was busted) (see Pitfall 5)
- [ ] **Skill icon error state:** Verified that a broken icon URL falls back gracefully without layout shift (see Pitfall 4)
- [ ] **hover-reveal mobile:** Tapping a skill chip on mobile triggers the detail reveal (not just hover) (see UX Pitfalls)
- [ ] **whileInView replay:** Navigate away from homepage and back — skill stagger animation duration is acceptable on second visit

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| scrollYProgress stuck at 0 in production | LOW | Add `layoutEffect: false` to useScroll call; redeploy |
| Mobile parallax jitter reported | LOW | Add mobile detection guard to disable parallax; keep sticky layout; redeploy |
| Draft project leaked to public | MEDIUM | Immediately unpublish or delete the project; audit logs for access; fix preview route to be admin-only; do not restore until verified secure |
| page_texts RLS blocks public site | LOW | In Supabase dashboard, add SELECT policy for anon role; takes effect immediately without redeployment |
| Stale skills data after admin save | LOW | Verify `invalidateQueries` calls the root key `skillKeys.all` not a sub-key; deploy fix; affected users see correct data within 5 min |
| Admin CRUD routes accessible without auth | CRITICAL | The `__guard` beforeLoad redirect is the gate — if broken, session auth check must be audited; roll back to last known-good commit while investigating |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| useScroll stuck at 0 in production build | Career section implementation | Test `vite build && vite preview` — Career entries animate on scroll |
| Mobile scroll jitter | Career section + mobile QA | Test on real Android/iOS device or throttled DevTools |
| Page transition / scroll measurement interference | Career section + integration testing | Navigate from project detail back to homepage — Career parallax starts correctly |
| Skill icon broken URL layout shift | Skills hover-reveal implementation | Set an invalid icon URL in admin; verify chip layout is unchanged |
| Query key mismatch — stale public cache after admin edits | Admin skills CRUD + admin career CRUD | Edit a skill in admin; hard-refresh public page; data matches |
| Draft preview security hole | Admin draft preview implementation | Confirm `/projects/$id` (public, unauthenticated) cannot access draft content by any URL manipulation |
| page_texts RLS misconfiguration | page_texts table migration | Unauthenticated Supabase client can SELECT; cannot INSERT/UPDATE |
| Stagger animation too long | Skills section implementation | Count skills, verify total stagger duration < 1.5s |
| Order changes not reflected immediately | Admin CRUD (UX copy) | Add "~5 min to propagate" note in admin reorder UI |

---

## Sources

- Motion GitHub Issue #2452 — useScroll production build layoutEffect bug: https://github.com/framer/motion/issues/2452
- Motion GitHub Issue #2770 — useScroll jitter on mobile with translateY: https://github.com/motiondivision/motion/issues/2770
- Motion Troubleshooting — useScroll ref not hydrated: https://motion.dev/troubleshooting/use-scroll-ref
- Supabase RLS Guide: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase Production Checklist: https://supabase.com/docs/guides/deployment/going-into-prod
- TanStack Query Invalidation: https://tanstack.com/query/v5/docs/framework/react/guides/query-invalidation
- TanStack Router Auth Guards: https://tanstack.com/router/v1/docs/framework/react/guide/authenticated-routes
- Chrome Developer Blog — Performant Parallaxing: https://developer.chrome.com/blog/performant-parallaxing
- Code review of existing codebase: AnimatedOutlet.tsx, CareerTimelineEntry.tsx, SkillsSection.tsx, SkillChip.tsx, useProjects.ts, useSkills.ts, useCareer.ts, projects.service.ts

---
*Pitfalls research for: JonathanSantos.dev v2.0 — scroll-driven animations + admin CRUD expansion*
*Researched: 2026-03-02*
