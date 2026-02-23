# Codebase Structure

**Analysis Date:** 2026-02-23

## Directory Layout

```
src/
├── animations/              # Animation components and utilities
│   └── Reveal.tsx          # Entrance reveal animation component
├── components/              # React UI components
│   ├── ui/                 # Shadcn/Radix UI base components
│   ├── Button/             # Custom button component with variants
│   ├── Card/               # Card composite component system
│   ├── CardExpandedContent/# Expanded card view overlay
│   ├── ContactForm/        # Contact form with validation
│   ├── Form/               # Form wrapper with React Hook Form
│   ├── Navbar/             # Navigation bar
│   ├── ProfileImage/       # Profile image component
│   ├── ProjectsSection/    # Projects carousel section
│   ├── Typography/         # Typography system (H1-H4, Paragraph)
│   ├── ArticlesSection/    # Blog articles display section
│   ├── Tag/                # Tag/badge component
│   ├── TagGroup/           # Grouped tags container
│   ├── Sidebar/            # Sidebar navigation
│   ├── SmoothScrollLink/   # Smooth scroll anchor link
│   └── Other UI files      # Utility components
├── contexts/               # React Context providers
│   ├── CardContext.tsx     # Card variant context provider
│   └── card-context.ts     # Card context type definition
├── hooks/                  # Custom React hooks
│   ├── use-mobile.ts       # Responsive mobile detection hook
│   └── use-smooth-scroll.ts# Smooth scroll utility
├── lib/                    # Utilities and helpers
│   ├── types/             # TypeScript type definitions
│   │   └── articles.ts    # Article type from Dev.to API
│   ├── env/               # Environment variable validation
│   │   └── index.ts       # Zod schema for env vars
│   ├── helpers/           # Helper functions
│   │   └── date-formater.ts# Date formatting utility
│   └── utils.ts           # Utility functions (cn() for class merging)
├── routes/                # File-based routing (TanStack Router)
│   ├── __root.tsx         # Root layout
│   ├── __public/          # Public route group
│   │   ├── route.tsx      # Public layout (Navbar + Outlet)
│   │   ├── index.tsx      # Home page
│   │   ├── about.tsx      # About page
│   │   └── projects/      # Projects route group
│   │       ├── route.tsx  # Projects layout with modal overlay
│   │       └── $projectId.tsx # Project detail page
│   ├── __private/         # Private route group
│   │   ├── route.tsx      # Private layout
│   │   └── dashboard.tsx  # Dashboard page
│   └── login.tsx          # Login page (placeholder)
├── services/              # API communication layer
│   └── articles.service.ts# Fetch articles from Dev.to API
├── main.tsx               # Application entry point
├── index.css              # Global styles
└── routeTree.gen.ts       # Generated route tree (auto-generated)

public/
└── sample-project.png     # Static assets
```

## Directory Purposes

**`src/animations/`:**
- Purpose: Reusable animation components and keyframe definitions
- Contains: Motion/Framer Motion wrapped components
- Key files: `Reveal.tsx` (entrance animation with overlay effect)

**`src/components/`:**
- Purpose: All React UI components organized by feature/domain
- Contains: Functional components with TypeScript interfaces
- Naming: PascalCase directories, PascalCase files (e.g., `Button/Button.tsx`)
- Sub-directories: Each component may have `__tests__/` directory

**`src/components/ui/`:**
- Purpose: Base unstyled or minimally-styled Shadcn/UI components
- Contains: Radix UI wrappers (Button, Dialog, Sheet, Form, etc.)
- Auto-generated: These are typically copied from Shadcn/UI registry

**`src/contexts/`:**
- Purpose: React Context API providers and type definitions
- Contains: Context creation, provider wrappers, types
- Naming: `[Name].tsx` for provider, `[name]-context.ts` for type definition
- Current: CardContext for variant configuration

**`src/hooks/`:**
- Purpose: Reusable React hooks extracted from component logic
- Contains: Custom hooks following React hooks conventions
- Naming: `use-[name].ts` (kebab-case for files, camelCase exports)
- Examples: `useIsMobile()`, scroll utilities

**`src/lib/types/`:**
- Purpose: Centralized TypeScript type definitions
- Contains: Domain types (Article, etc.)
- Naming: `[domain].ts` (e.g., `articles.ts`)

**`src/lib/env/`:**
- Purpose: Environment variable validation and schema
- Contains: Zod schema and validated env object
- Pattern: Validates env vars at startup; throws if invalid

**`src/lib/helpers/`:**
- Purpose: Utility functions for specific domains
- Contains: Date formatting, string manipulation, etc.
- Naming: `[domain]-[purpose].ts` (e.g., `date-formater.ts`)

**`src/routes/`:**
- Purpose: File-based routing structure (TanStack Router)
- Contains: Route definitions, layout components, page components
- Pattern: File path = route path (e.g., `__public/projects/$projectId.tsx` = `/projects/:projectId`)
- Special: `__public`, `__private` are route groups; `__root.tsx` is app root; `$` denotes dynamic segments
- Generated: `routeTree.gen.ts` auto-generated by TanStack Router plugin

**`src/services/`:**
- Purpose: External API communication and data fetching
- Contains: Service functions that handle HTTP requests
- Naming: `[entity].service.ts` (e.g., `articles.service.ts`)
- Pattern: Async functions that return data or empty fallback; use callbacks or promises

## Key File Locations

**Entry Points:**
- `src/main.tsx`: App initialization, React Router setup
- `src/routes/__root.tsx`: Root layout with Outlet
- `src/routes/__public/route.tsx`: Public layout (Navbar + Outlet)
- `src/routes/__public/index.tsx`: Home page (hero, projects, articles, contact)

**Configuration:**
- `vite.config.ts`: Vite build config with TanStack Router plugin, Tailwind, aliases
- `tsconfig.json`: TypeScript configuration
- `tailwind.config.ts`: Tailwind CSS theme customization
- `.prettierrc`: Code formatting rules
- `.eslintrc.cjs`: ESLint rules

**Core Logic:**
- `src/components/Card/Card.tsx`: Composite card component with variants
- `src/components/Form/Form.tsx`: Form wrapper with React Hook Form
- `src/components/Button/Button.tsx`: Motion-enabled button component
- `src/services/articles.service.ts`: Dev.to API integration
- `src/lib/env/index.ts`: Environment variable validation

**Testing:**
- `src/components/**/__tests__/[ComponentName].spec.tsx`: Co-located test files
- `vitest.config.ts`: Vitest configuration
- `src/setupTests.ts` (if exists): Test setup and mocks

## Naming Conventions

**Files:**
- Components: PascalCase (e.g., `Button.tsx`, `ProfileImage.tsx`)
- Hooks: camelCase with `use-` prefix (e.g., `use-mobile.ts`)
- Services: `[entity].service.ts` (e.g., `articles.service.ts`)
- Types: `[domain].ts` (e.g., `articles.ts`)
- Variants: `[component].variants.ts` (e.g., `button.variants.ts`)
- Schemas: `[component].schema.ts` (e.g., `card.schema.ts`)
- Tests: `[ComponentName].spec.tsx` or `[ComponentName].test.tsx`

**Directories:**
- Components: PascalCase matching component name (e.g., `Button/`, `Card/`)
- Feature areas: kebab-case (e.g., `__public/`, `CardExpandedContent/`)
- Utilities: lowercase (e.g., `lib/`, `hooks/`, `services/`)

**Variables & Functions:**
- React components: PascalCase (e.g., `function Button() {}`)
- Regular functions: camelCase (e.g., `fetchArticles()`)
- Hooks: camelCase with `use-` prefix (e.g., `useIsMobile()`)
- Constants: UPPER_SNAKE_CASE (e.g., `MOBILE_BREAKPOINT`)
- Type names: PascalCase (e.g., `Article`, `CardContextType`)

## Where to Add New Code

**New Feature (Page):**
- Primary code: `src/routes/__public/[feature]/index.tsx`
- Sub-routes: `src/routes/__public/[feature]/[subroute].tsx`
- Supporting components: `src/components/[FeatureName]/[Component].tsx`
- Tests: `src/components/[FeatureName]/__tests__/[Component].spec.tsx`
- Services (if needed): `src/services/[feature].service.ts`

**New Component/Module:**
- Implementation: `src/components/[ComponentName]/[ComponentName].tsx`
- Variants (if styled): `src/components/[ComponentName]/[component].variants.ts`
- Schema (if validated): `src/components/[ComponentName]/[component].schema.ts`
- Tests: `src/components/[ComponentName]/__tests__/[ComponentName].spec.tsx`
- Sub-components: `src/components/[ComponentName]/components/[SubComponent]/[SubComponent].tsx`

**Utilities & Helpers:**
- Shared hooks: `src/hooks/use-[feature].ts`
- Type definitions: `src/lib/types/[domain].ts`
- Helper functions: `src/lib/helpers/[domain]-[purpose].ts`
- Utility functions: `src/lib/utils.ts` (or new file if domain-specific)

**Context/State:**
- New context: `src/contexts/[Feature]Context.tsx` (provider) + `src/contexts/[feature]-context.ts` (types)

**API Services:**
- New service: `src/services/[entity].service.ts`
- Pattern: Export async functions that handle fetch + error handling

## Special Directories

**`public/`:**
- Purpose: Static assets served at root
- Generated: No
- Committed: Yes (tracked in git)
- Usage: Images, icons, fonts referenced by URL directly

**`.tanstack/tmp/`:**
- Purpose: TanStack Router plugin temporary files
- Generated: Yes (auto-generated by router plugin)
- Committed: No (in .gitignore)

**`src/routeTree.gen.ts`:**
- Purpose: Auto-generated route tree from file-based routes
- Generated: Yes (by `@tanstack/router-plugin` during build/dev)
- Committed: Yes (generated file checked in)
- Modification: Do not edit manually; regenerated on file changes

**`node_modules/`:**
- Purpose: Package dependencies
- Generated: Yes (by npm/yarn)
- Committed: No (in .gitignore)

---

*Structure analysis: 2026-02-23*
