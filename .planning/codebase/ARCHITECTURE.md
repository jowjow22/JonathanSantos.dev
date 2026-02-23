# Architecture

**Analysis Date:** 2026-02-23

## Pattern Overview

**Overall:** Modern SPA with file-based routing and modular component architecture.

**Key Characteristics:**
- File-based routing using TanStack Router (automatically generated route tree)
- Component-driven UI with composite patterns (Card.Header, Card.Content, Card.Footer)
- Context API for lightweight state management (CardContext)
- Motion/animation library integration for transitions and interactions
- Form-driven validation using Zod + React Hook Form

## Layers

**Presentation Layer:**
- Purpose: React components that render UI and handle user interactions
- Location: `src/components/`
- Contains: Functional components, reusable UI primitives, page layouts
- Depends on: Contexts, hooks, utilities, UI primitives
- Used by: Routes and other components

**Routing Layer:**
- Purpose: File-based routing structure for page navigation
- Location: `src/routes/`
- Contains: Page components (created with TanStack Router's `createFileRoute`), layout components
- Depends on: Components, services, animations
- Used by: `src/main.tsx` (RouterProvider)

**Context Layer:**
- Purpose: Shared state and configuration for component trees
- Location: `src/contexts/`
- Contains: Context definitions (`CardContext`), context providers
- Depends on: React
- Used by: Components that need shared state

**Services Layer:**
- Purpose: API communication and external data fetching
- Location: `src/services/`
- Contains: `articles.service.ts` for fetching from Dev.to API
- Depends on: Type definitions
- Used by: Route components (pages)

**Hooks Layer:**
- Purpose: Custom React hooks for reusable logic
- Location: `src/hooks/`
- Contains: `useIsMobile()` for responsive detection, scroll-related hooks
- Depends on: React
- Used by: Components

**Utilities & Helpers:**
- Purpose: Helper functions and utility code
- Location: `src/lib/`
- Contains: Type definitions, environment validation, utility functions
- Depends on: Zod (for schema validation)
- Used by: Throughout application

**UI Primitives:**
- Purpose: Base unstyled or lightly-styled components from Radix UI
- Location: `src/components/ui/`
- Contains: Button, Form, Input, Textarea, Dialog, etc. (Shadcn/UI components)
- Depends on: Radix UI packages
- Used by: Composed components (Button, Form, etc.)

## Data Flow

**Page Load Flow:**
1. `src/main.tsx` - Creates router instance with generated routeTree
2. RouterProvider renders active route from `src/routes/`
3. Layout components (e.g., `__public/route.tsx`) render Navbar + Outlet
4. Page component (e.g., `__public/index.tsx`) renders sections with data

**Data Fetching Flow:**
1. Route component (e.g., `src/routes/__public/index.tsx`) mounts
2. `useEffect` calls service function (e.g., `fetchArticles()`)
3. Service fetches external API (Dev.to)
4. Callback updates component state with articles
5. Component re-renders with fetched data

**Form Submission Flow:**
1. Form component initializes with `useForm` hook
2. Zod schema validates structure
3. Submit handler receives validated data
4. Service layer (fetch) sends to backend
5. Success/error states managed in component

**State Management:**
- Component-level: `useState` for local component state
- Shared state: `CardContext` for Card variant configuration across child components
- Form state: React Hook Form manages form state and validation
- Animation state: Framer Motion/Motion handles animation sequences

## Key Abstractions

**Card System:**
- Purpose: Reusable card component with multiple layouts and animation states
- Examples: `src/components/Card/Card.tsx`, `src/components/CardExpandedContent/CardExpandedContent.tsx`
- Pattern: Composite pattern with Card.Header, Card.Content, Card.Footer sub-components
- Context-aware: CardContext provides variant configuration to nested components
- Variants: `default` (static card), `image_background` (image-as-background layout)

**Typography System:**
- Purpose: Consistent text rendering across different heading levels and paragraphs
- Examples: `src/components/Typography/Typography.tsx`
- Pattern: Static factory pattern with H1, H2, H3, H4, Paragraph exports
- Styling: Tailwind classes applied directly; responsive font sizes

**Form System:**
- Purpose: Structured form handling with validation
- Examples: `src/components/Form/Form.tsx`, `src/components/Form/components/Textfield/Textfield.tsx`
- Pattern: Wrapper over React Hook Form + Shadcn/UI Form
- Validation: Zod schema passed to form, validated on submit/blur

**Animation System:**
- Purpose: Entrance and interactive animations
- Examples: `src/animations/Reveal.tsx`, motion directives on components
- Pattern: Framer Motion (motion/react) and Motion library integration
- Variants: Pre-defined animation states (hidden/visible, opacity/transform changes)

## Entry Points

**Application Root:**
- Location: `src/main.tsx`
- Triggers: Initial page load
- Responsibilities: Creates React Router instance, renders RouterProvider, mounts to DOM

**Public Routes:**
- Location: `src/routes/__public/route.tsx`
- Triggers: Navigation to `/`, `/about`, `/projects/*`
- Responsibilities: Renders shared public layout (Navbar + Outlet)

**Home/Index Page:**
- Location: `src/routes/__public/index.tsx`
- Triggers: Navigate to `/`
- Responsibilities: Renders hero section, projects carousel, articles list, contact form

**Projects Detail Route:**
- Location: `src/routes/__public/projects/$projectId.tsx`
- Triggers: Navigate to `/projects/[id]`
- Responsibilities: Renders project detail view (currently placeholder)

**Root Layout:**
- Location: `src/routes/__root.tsx`
- Triggers: Application initialization
- Responsibilities: Renders root Outlet and devtools (Tanstack Router Devtools)

## Error Handling

**Strategy:** Try-catch with fallback to empty state.

**Patterns:**
- Services: Catch fetch errors, log to console, return empty array or fallback data
- Components: Error boundaries not explicitly implemented; rely on React's default behavior
- Forms: Validation errors managed by React Hook Form, displayed per-field
- API calls: Failed requests return empty arrays (articles) or fail silently

**Example (articles.service.ts):**
```typescript
try {
  const res = await fetch(...)
  if (!res.ok) throw new Error(...)
  return await res.json()
} catch (error) {
  console.error('Failed to fetch articles:', error)
  return []
}
```

## Cross-Cutting Concerns

**Logging:** Console-based (console.error) for errors; no structured logging framework.

**Validation:** Zod schemas for:
- Environment variables (`src/lib/env/index.ts`)
- Form data in ContactForm
- Card component variant types

**Authentication:** Not implemented. Routes not protected; login route placeholder exists (`src/routes/login.tsx`).

**Styling:** Tailwind CSS + custom class variants via CVA (class-variance-authority):
- Button variants defined in `src/components/Button/button.variants.ts`
- Card variants defined in `src/components/Card/card.variants.ts`
- Component styling uses class composition (clsx + tailwind-merge via `cn()` utility)

**Performance:** Auto code-splitting enabled in TanStack Router plugin; lazy loading on images with `loading="lazy"` attribute.

---

*Architecture analysis: 2026-02-23*
