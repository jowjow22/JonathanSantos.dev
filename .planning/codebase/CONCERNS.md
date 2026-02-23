# Codebase Concerns

**Analysis Date:** 2026-02-23

## Tech Debt

**Motion library duplication:**
- Issue: Both `framer-motion` and `motion` packages are installed and used interchangeably
- Files: `src/components/Card/Card.tsx` (uses `motion/react-client`), `src/components/ProjectsSection/ProjectsSection.tsx` (uses `motion/react`)
- Impact: Increases bundle size unnecessarily; `motion` is a wrapper around `framer-motion` - only one is needed
- Fix approach: Choose one library (recommend `motion` as it's the newer pattern), remove `framer-motion` from dependencies, standardize imports across all components

**Oversized sidebar UI component:**
- Issue: `src/components/ui/sidebar.tsx` is 724 lines - a single-responsibility component should be smaller
- Files: `src/components/ui/sidebar.tsx`
- Impact: Hard to maintain, difficult to test individual sidebar features, increases cognitive load for modifications
- Fix approach: Split into smaller, focused components (e.g., SidebarState.tsx, SidebarContent.tsx, SidebarMenu.tsx)

**Monolithic index route:**
- Issue: `src/routes/__public/index.tsx` is 156 lines and contains four full page sections (About, Projects, Blog, Contact)
- Files: `src/routes/__public/index.tsx`
- Impact: Difficult to manage state for individual sections, hard to implement lazy loading, testing is unwieldy
- Fix approach: Extract sections into separate components (AboutSection, BlogSection, ContactSection) and import them

**Sidebar component duplication:**
- Issue: Two sidebar components exist - `src/components/ui/sidebar.tsx` (Radix-based UI primitives, 724 lines) and `src/components/Sidebar/Sidebar.tsx` (app-specific wrapper, 111 lines)
- Files: `src/components/ui/sidebar.tsx`, `src/components/Sidebar/Sidebar.tsx`
- Impact: Potential confusion about which to use; maintenance burden if one needs updates
- Fix approach: Rename/reorganize - move UI primitives to a library folder and keep only the composed `AppSidebar` in components

## Known Bugs

**Contact form error handling missing user feedback:**
- Symptoms: Form submission fails silently without user notification
- Files: `src/components/ContactForm/ContactForm.tsx` (line 31-40)
- Trigger: When `/api/email` endpoint returns non-200 status
- Workaround: None - users won't know if submission failed
- Details: `handleSuccessSubmit` checks `if (!response.ok) return` without displaying error message or disabling submit button

**Empty error handler in form:**
- Symptoms: Form validation errors don't trigger user-visible feedback
- Files: `src/components/ContactForm/ContactForm.tsx` (line 47), `src/routes/login.tsx` (line 45)
- Trigger: When form fails validation
- Workaround: None - validation runs but feedback is lost
- Details: `onError={() => {}}` callback does nothing; should display error toast or inline messages

**Articles fetch fallback without user notification:**
- Symptoms: When dev.to API fails, users see empty articles list without explanation
- Files: `src/services/articles.service.ts` (line 16-21)
- Trigger: Network error or API downtime (dev.to being unavailable)
- Workaround: None - silently falls back to empty array
- Details: Error logged to console but not communicated to UI

## Error Handling Gaps

**Missing error boundaries:**
- Risk: Any component error crashes the entire application
- Files: No error boundary detected in `src/routes/__root.tsx` or main layout
- Impact: Single component failure = app completely broken
- Recommendations: Implement React Error Boundary in root layout to catch render errors

**API error responses not differentiated:**
- Risk: All fetch failures treated identically (404, 500, network error)
- Files: `src/services/articles.service.ts`, `src/components/ContactForm/ContactForm.tsx`
- Impact: Users can't distinguish between temporary failures and permanent errors
- Recommendations: Parse error types (network vs HTTP vs validation) and handle differently

**No retry logic for failed API calls:**
- Risk: Single network glitch causes permanent data loss (articles won't load)
- Files: `src/services/articles.service.ts`, `src/components/ContactForm/ContactForm.tsx`
- Impact: Users on poor connections or during API hiccups get no data
- Recommendations: Implement exponential backoff retry for fetch requests

## Environment Configuration Issues

**Hardcoded API endpoints:**
- Risk: Changing API endpoint requires code change and rebuild
- Files: `src/services/articles.service.ts` (line 7 - hardcoded dev.to URL), `src/components/ContactForm/ContactForm.tsx` (line 31 - hardcoded `/api/email`)
- Impact: No flexibility for staging/production API switching
- Fix approach: Move all endpoints to environment variables (VITE_DEV_API_URL, VITE_EMAIL_API_URL)

**Missing validation for runtime env vars:**
- Risk: Missing required env vars discovered at runtime
- Files: `src/lib/env/index.ts` validates at app start but crashes app
- Impact: Poor startup UX if environment misconfigured
- Recommendations: Move env validation to build time; provide helpful error messages with required variable names

## Test Coverage Gaps

**Critical untested areas:**
- What's not tested: Service layer (articles.service.ts has no tests), API integration, form submission success/failure paths, error boundary behavior
- Files: `src/services/articles.service.ts`, `src/components/ContactForm/ContactForm.tsx`, `src/routes/__public/index.tsx`
- Risk: Data fetching logic could break unnoticed; form submission might not work in production
- Coverage: Only 6 test files out of 43 source files - approximately 14% covered

**Component tests lack integration testing:**
- Issue: Tests only verify rendering, not user interactions or prop flows
- Files: `src/components/Card/__tests__/Card.spec.tsx` only tests render output, not context integration
- Risk: Integration bugs (e.g., context not providing data) won't be caught

**No E2E tests:**
- Risk: User workflows untested (article fetch → display, contact form → send → feedback)
- Impact: Regressions in critical paths only caught by manual testing

## Performance Bottlenecks

**Articles loaded at page load without lazy loading:**
- Problem: `src/routes/__public/index.tsx` fetches articles on component mount for section below fold
- Files: `src/routes/__public/index.tsx` (line 28-30)
- Impact: Slows initial page render; unnecessary for users who don't scroll to blog section
- Improvement path: Use React Router's async route loading or Intersection Observer to fetch only when section becomes visible

**Sidebar checkbox state in cookies without validation:**
- Problem: Cookie state written on every toggle without size check
- Files: `src/components/ui/sidebar.tsx` (line 84)
- Impact: Small but accumulates on every state change; no validation that cookie wasn't corrupted
- Improvement path: Validate cookie before reading; use localStorage instead for better browser support

**Array.from() creating 6 dummy projects on every render:**
- Problem: Projects carousel generates fake data on each render
- Files: `src/components/ProjectsSection/ProjectsSection.tsx` (line 42)
- Impact: Not a performance issue at 6 items but signals placeholder data should be mocked elsewhere
- Improvement path: Fetch actual projects from service; remove hardcoded placeholder logic

## Fragile Areas

**Card component with schema validation in render:**
- Files: `src/components/Card/Card.tsx` (line 28, 84)
- Why fragile: Calls `cardVariantSchema.parse(variant)` inside render - if schema validation fails, component crashes
- Safe modification: Move schema parsing to context provider or validate at boundaries, not in render
- Test coverage: Covered by tests but validation error path not tested

**Context usage in Card with default fallback:**
- Files: `src/components/Card/Card.tsx` (line 26-27: `context?.variant ?? 'default'`)
- Why fragile: Silently uses default if context is missing instead of throwing error; makes it hard to detect misconfiguration
- Safe modification: Throw descriptive error like `useSidebar()` does if context not available
- Test coverage: Tests don't verify context missing scenario

**Articles fetch callback pattern:**
- Files: `src/services/articles.service.ts`, `src/routes/__public/index.tsx` (line 29)
- Why fragile: Callback-based state update instead of hook; requires manual lifecycle management
- Safe modification: Refactor to custom hook `useArticles()` that manages loading/error/data state
- Test coverage: No service tests; callback not testable without full component integration

**Hardcoded navigation routes with index-based params:**
- Files: `src/components/ProjectsSection/ProjectsSection.tsx` (line 58 - `projectId: index`)
- Why fragile: Using array index as route parameter is brittle; reordering projects breaks navigation
- Safe modification: Add id field to projects data structure; use real IDs instead of array indices
- Test coverage: Not tested

## Scaling Limits

**No pagination or virtual scrolling for articles section:**
- Current capacity: Renders all fetched articles in viewport without limits
- Limit: Once user has 50+ articles on dev.to, page becomes slow
- Scaling path: Implement pagination API or use React Virtual scrolling library

**Sidebar hardcoded nav structure:**
- Current capacity: Currently shows 3 collapsible groups with 5 items total
- Limit: If nav grows beyond ~20 items, sidebar becomes unusable on mobile
- Scaling path: Move navigation config to database/CMS; implement search/filtering in sidebar

## Dependencies at Risk

**React 19 with some incompatible packages:**
- Risk: React 19 is very new; potential incompatibilities with older Radix UI versions
- Current versions: `@radix-ui/react-*` at ^1.x while `react` is ^19.1.0
- Impact: Edge cases with concurrent rendering, hydration mismatch
- Monitoring: Watch for GitHub issues in dependent packages; consider pinning React 19-compatible versions

**Motion library wrapper adds indirection:**
- Risk: `motion` package (v12.23.9) is a thin wrapper around `framer-motion` (v12.23.9) - adds complexity without benefit
- Impact: Extra npm package to maintain, potential drift between versions
- Migration plan: Remove `motion` dependency, migrate all imports to `framer-motion` directly

## Unused/Untested Code Paths

**Version switcher component:**
- Issue: `src/components/version-switcher.tsx` exists but not used anywhere in application
- Impact: Maintenance burden; unclear purpose
- Recommendation: Document purpose or remove if obsolete

**Login route exists but not wired:**
- Issue: `src/routes/login.tsx` (79 lines) has form with submit handler but no actual authentication
- Impact: Users can navigate to /login but can't actually log in
- Recommendation: Complete authentication implementation or remove route

**Dashboard route incomplete:**
- Issue: `src/routes/__private/dashboard` route exists but likely has no content/access control
- Impact: Route leads to blank page or error
- Recommendation: Implement actual dashboard or remove route; add route-level authentication guards

## TypeScript Issues

**Generated route file suppressions:**
- Issue: `src/routeTree.gen.ts` uses `// @ts-nocheck` and `/* eslint-disable */` to suppress all type checking
- Files: `src/routeTree.gen.ts`
- Impact: Important type information lost; errors in this file can't be caught
- Workaround: File is auto-generated and shouldn't be edited anyway
- Recommendation: Document that this file is generated; consider regenerating after dependency updates

**Type casting in route generation:**
- Issue: Multiple `} as any)` in routeTree.gen.ts indicates type compatibility issues
- Impact: Type safety lost in router setup - critical app infrastructure
- Recommendation: Update @tanstack/router-vite-plugin to version that fixes type generation

---

*Concerns audit: 2026-02-23*
