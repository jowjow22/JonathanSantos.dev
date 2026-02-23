# Technology Stack

**Analysis Date:** 2026-02-23

## Languages

**Primary:**
- TypeScript 5.8.3 - Used throughout the application for type-safe development
- JSX/TSX - React component syntax for UI development

**Secondary:**
- JavaScript - Configuration files and build scripts

## Runtime

**Environment:**
- Node.js v22.17.0 (verified locally, no .nvmrc specified)

**Package Manager:**
- npm (npm 10.x bundled with Node.js)
- Lockfile: `package-lock.json` (v3 lockfile format)

## Frameworks

**Core:**
- React 19.1.0 - User interface framework
- TanStack React Router 1.130.1 - File-based routing with type safety
- Vite 7.0.4 - Build tool and dev server

**UI & Styling:**
- Tailwind CSS 4.1.11 - Utility-first CSS framework via @tailwindcss/vite
- Radix UI - Unstyled, accessible component primitives
  - @radix-ui/react-collapsible 1.1.11
  - @radix-ui/react-dialog 1.1.14
  - @radix-ui/react-dropdown-menu 2.1.15
  - @radix-ui/react-label 2.1.7
  - @radix-ui/react-separator 1.1.7
  - @radix-ui/react-slot 1.2.3
  - @radix-ui/react-tooltip 1.2.7
- Class Variance Authority 0.7.1 - Component variant management
- Tailwind Merge 3.3.1 - Merge Tailwind CSS classes

**Animation & Motion:**
- Framer Motion 12.23.9 - React animation library
- Motion 12.23.9 - Animation primitives
- Embla Carousel React 8.6.0 - Carousel/slider component

**Form & Validation:**
- React Hook Form 7.61.1 - Efficient form state management
- Zod 4.0.10 - TypeScript-first schema validation
- @hookform/resolvers 5.2.0 - Form resolver integration

**Icons & Utilities:**
- Tabler Icons React 3.34.1 - Icon set with React components
- Lucide React 0.526.0 - Icon library
- clsx 2.1.1 - Conditional class name utility

**State Management:**
- TanStack React Query 5.83.0 - Server state management (installed but not actively used in current codebase)

## Testing

**Test Runner:**
- Vitest 3.2.4 - Vite-native unit testing framework
- Config: `vitest.config.mts`

**Testing Libraries:**
- @testing-library/react 16.3.0 - React component testing utilities
- @testing-library/dom 10.4.1 - DOM testing utilities
- @testing-library/user-event 14.6.1 - User interaction simulation
- @testing-library/jest-dom 6.6.4 - DOM matchers for assertions
- jsdom 26.1.0 - DOM implementation for Node.js

**Coverage:**
- @vitest/coverage-istanbul 3.2.4 - Code coverage provider (Istanbul)

## Build & Development

**Build Tools:**
- Vite 7.0.4 - Next-generation frontend build tool
- @vitejs/plugin-react 4.6.0 - React Fast Refresh plugin
- @tailwindcss/vite 4.1.11 - Tailwind CSS Vite integration
- TanStack Router Vite Plugin 1.129.9 - File-based routing code generation

**Code Quality:**
- ESLint 9.30.1 - JavaScript/TypeScript linter
  - @eslint/js 9.30.1
  - typescript-eslint 8.35.1
  - eslint-plugin-react-hooks 5.2.0
  - eslint-plugin-react-refresh 0.4.20
- Prettier 3.6.2 - Code formatter
  - prettier-plugin-tailwindcss 0.6.14 - Tailwind class sorting

**Git Hooks:**
- Husky 9.1.7 - Git hooks manager
- @commitlint/cli 19.8.1 - Commit message linting
- @commitlint/config-conventional 19.8.1 - Conventional commits config

**Build Configuration:**
- TypeScript 5.8.3 - Type checking during build (`tsc -b`)
- PostCSS 8.5.6 - CSS processor for Tailwind
- Autoprefixer 10.4.21 - Vendor prefix automation

**Development Utilities:**
- vite-tsconfig-paths 5.1.4 - Path alias resolution
- @types/node 24.1.0 - Node.js type definitions
- @types/react 19.1.8 - React type definitions
- @types/react-dom 19.1.6 - React DOM type definitions
- globals 16.3.0 - Global variable definitions
- tw-animate-css 1.3.6 - Tailwind animation utilities

## Configuration

**Environment Variables:**
- Schema defined in `src/lib/env/index.ts` using Zod
- Required variables:
  - `VITE_DEV_API_KEY` (string) - Dev.to API key
  - `VITE_MY_CONTACT_EMAIL` (email) - Contact email address
- `.env` file present (contents not committed)
- Vite environment variables prefixed with `VITE_` are automatically exposed to client

**Build Configuration:**
- `vite.config.ts` - Vite build and dev server config
- `tsconfig.json` - TypeScript compiler options with path aliases
  - Base path: `@/*` maps to `./src/*`
- `tailwind.config.ts` - Tailwind CSS theme configuration
- `postcss.config.cjs` (if present) - PostCSS pipeline
- `.prettierrc` - Prettier formatting rules
- `eslint.config.js` - ESLint linting rules
- `commitlint.config.mjs` - Conventional commits enforcement
- `vitest.config.mts` - Test runner configuration

**Build Scripts:**
```bash
dev              # Start dev server with hot reload
build            # Run type checking then build with Vite
lint             # Run ESLint and Prettier formatting
lint:staged      # Run linting only on staged files (git hook)
ci:lint          # Run linting in CI (no fixes)
ci:types         # Type checking in CI
ci:test          # Run tests in CI
test             # Run tests with coverage report
preview          # Preview production build locally
prepare          # Install Husky git hooks
```

## Platform Requirements

**Development:**
- Node.js 22.x (tested with v22.17.0)
- npm 10.x (bundled with Node.js)
- Bash shell (for lint:staged script)

**Production:**
- Static hosting capable of serving SPA
- No backend runtime required
- Dev server proxies `/dev-api/*` to dev.to API during development

## Dependencies at Risk

**None identified in current analysis** - All dependencies are active and well-maintained.

---

*Stack analysis: 2026-02-23*
