# External Integrations

**Analysis Date:** 2026-02-23

## APIs & External Services

**Dev.to API:**
- Used for fetching published articles
- Service: Dev.to (https://dev.to)
- Endpoint: `https://dev.to/api/articles?username=jow`
- SDK/Client: Native Fetch API
- Auth: None (public endpoint, username-based filtering)
- Implementation: `src/services/articles.service.ts`
  - Function: `fetchArticles(callback: (articles: Article[]) => void): Promise<Article[]>`
  - Error handling: Returns empty array on failure, logs error to console
  - Used in: `src/routes/__public/index.tsx` as part of homepage blog section

**Development Proxy:**
- Dev server proxies `/dev-api` to `https://dev.to/articles/me/published`
- Configured in: `vite.config.ts`
- Purpose: Enable local development API access during development

## Data Storage

**Databases:**
- Not applicable - This is a static portfolio site with no backend database

**File Storage:**
- Local filesystem only - No cloud storage integration detected
- Public assets: Icons, images served from `/public` directory

**Caching:**
- Browser caching via HTTP headers (configured by deployment host)
- No client-side cache layer detected
- Article fetches are not cached (fresh request on each page load)

## Authentication & Identity

**Auth Provider:**
- None - Application is fully public with no authentication
- No user accounts, login, or protected routes

**Social Links (Read-Only):**
- GitHub: https://github.com/jowjow22
- LinkedIn: https://www.linkedin.com/in/jonathansantossilva/
- Email: jonathan224santos@gmail.com

## Monitoring & Observability

**Error Tracking:**
- Not integrated - No error tracking service configured

**Logs:**
- Browser console only
- Error logging in `src/services/articles.service.ts` for API failures
- No centralized logging infrastructure

## CI/CD & Deployment

**Hosting:**
- Not specified in codebase - Deployment target not configured
- Build output: `dist/` directory (created by Vite)
- Suitable for: Vercel, Netlify, GitHub Pages, or any static hosting

**CI Pipeline:**
- Not configured in codebase
- Available CI scripts in package.json:
  - `ci:lint` - ESLint validation
  - `ci:types` - TypeScript type checking
  - `ci:test` - Vitest test suite

**Build Process:**
- Vite bundling with code splitting enabled
  - Router plugin: `autoCodeSplitting: true`
- TypeScript compilation with strict type checking
- Tailwind CSS purging to production-optimized CSS

## Environment Configuration

**Required Environment Variables:**

Development:
- `VITE_DEV_API_KEY` (string) - API key for dev.to integration (if using authenticated endpoints)
- `VITE_MY_CONTACT_EMAIL` (email) - Contact form destination email

Production:
- Same as development (no secrets required)
- All variables must pass Zod validation schema in `src/lib/env/index.ts`

**Validation:**
- Schema validation enforced at runtime via Zod
- Missing or invalid variables throw error: "Invalid environment variables"
- Validation occurs in: `src/lib/env/index.ts`

**Secrets Location:**
- `.env` file (not committed to git)
- Variables are client-side environment variables (Vite `VITE_` prefix)
- No server secrets or private keys in use

## Webhooks & Callbacks

**Incoming:**
- Contact form: `src/components/ContactForm/ContactForm.tsx`
  - Email submission capability (form structure present, backend integration status unknown)

**Outgoing:**
- No outgoing webhooks detected
- No event-based integrations

## Third-Party Form Services

**Contact Form:**
- Form component: `src/components/ContactForm/ContactForm.tsx`
- Framework: React Hook Form 7.61.1
- Validation: Zod schema
- Integration: Unknown - No email service integration detected (Resend, SendGrid, etc.)
- Status: Form UI present, backend submission handler not visible in frontend code

## API Rate Limiting

**Dev.to API:**
- No rate limiting configuration visible
- Public endpoint may have rate limits (check Dev.to documentation)
- No retry logic or backoff strategy implemented

## Data Flow

**Article Fetching:**
1. User lands on homepage (`src/routes/__public/index.tsx`)
2. `useEffect` triggers `fetchArticles()` on component mount
3. Service fetches from `https://dev.to/api/articles?username=jow`
4. Articles stored in local component state `setArticles()`
5. Rendered in `ArticlesSection` component

**Contact Form Submission:**
- Contact form structure exists in `src/components/ContactForm/ContactForm.tsx`
- Actual submission handler implementation not visible in explored files
- Likely requires backend service integration for email delivery

---

*Integration audit: 2026-02-23*
