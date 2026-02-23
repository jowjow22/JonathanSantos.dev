# Coding Conventions

**Analysis Date:** 2026-02-23

## Naming Patterns

**Files:**
- PascalCase for component files: `Button.tsx`, `Card.tsx`, `Navbar.tsx`
- kebab-case for utility/non-component files: `card.variants.ts`, `card.schema.ts`, `articles.service.ts`, `use-mobile.ts`, `use-smooth-scroll.ts`
- kebab-case for directories containing components: `CardExpandedContent`, `TagGroup`, `ArticlesSection`
- Mixed approach: UI components in `ui/` directory use lowercase kebab-case: `button.tsx`, `input.tsx`, `dropdown-menu.tsx`

**Functions:**
- camelCase for all function names
- Export named components/functions (not default exports for reusable components)
- Example: `export const Button = (...)`, `export function TextField(...)`, `export async function fetchArticles(...)`
- Prefix hook functions with `use`: `useIsMobile()`, custom hooks follow React hook naming convention

**Variables:**
- camelCase for all variables
- UPPERCASE_SNAKE_CASE for constants: `MOBILE_BREAKPOINT`, `const class_variants = ...`
- Descriptive names: `hiddenCount`, `visibleTags`, `currentWidth`, `containerRef`
- Boolean variables prefixed with `is` or `has`: `isMobile`, `isVisible`, `hasError`

**Types:**
- PascalCase for type names: `Article`, `CardVariant`, `IButtonProps`, `TextFieldProps`
- Prefix interface names with `I`: `IButtonProps`, `IFormProps`, `ITagGroupProps`
- Use inline interface definitions within component files for component-specific types
- Generic type variables: Use single uppercase letters for simple generics (`T`, `TFieldValues`, `TName`)

**React Component Pattern:**
- Functions/const exported, not arrow functions: `export const Button = ({...}) => {...}`
- Interface names prefixed with `I`: `IButtonProps`
- Props interface extends from DOM element types when needed: `extends Omit<HTMLMotionProps<'button'>, ...>`

## Code Style

**Formatting:**
- ESLint with typescript-eslint configuration: `eslint.config.js`
- Prettier for code formatting with specific settings:
  - `trailingComma: "es5"`
  - `tabWidth: 2`
  - `semi: false` (no semicolons)
  - `singleQuote: true` (single quotes)
  - Tailwind CSS plugin: `prettier-plugin-tailwindcss` for class ordering

**Linting:**
- ESLint with recommended configs for:
  - Base JS (`@eslint/js`)
  - TypeScript (`typescript-eslint`)
  - React Hooks (`eslint-plugin-react-hooks`)
  - React Refresh (`eslint-plugin-react-refresh`)
- Custom rule: `react-refresh/only-export-components: 'error'` - Components must be default or named exports only
- UI components in `src/components/ui/*` are ignored in ESLint config

**Run Commands:**
```bash
npm run lint              # Run ESLint and Prettier check
npm run lint:staged       # Run linting on staged files (git hook)
npm run ci:lint           # CI linting (check mode, no fixes)
```

## Import Organization

**Order:**
1. External packages (React, third-party libraries)
2. UI/component library imports
3. Relative imports (components, utilities, types)
4. CSS/style imports

**Examples from codebase:**
```typescript
import { IconArrowLeft } from '@tabler/icons-react'
import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from '../Button'
```

**Path Aliases:**
- `@/*` maps to `./src/*`
- Use `@/` prefix for absolute imports: `@/components/ui/form`, `@/lib/types/articles`, `@/contexts/CardContext`

**Barrel Files:**
- Used for component composition: `Card.Header = CardHeader`, `Card.Content = CardContent`, `Card.Footer = CardFooter`
- Allow for flexible compound component patterns: `<Card><Card.Header>...</Card.Header></Card>`
- Form patterns: `Form.TextField = TextField`

## Error Handling

**Patterns:**
- Try-catch blocks for async operations and API calls
- Error logging with console.error(): `console.error('Failed to fetch articles:', error)`
- Graceful fallbacks: Return empty arrays or default values on error
- Example from `articles.service.ts`:
  ```typescript
  try {
    const res = await fetch('...')
    if (!res.ok) {
      throw new Error(`API request failed: ${res.status} ${res.statusText}`)
    }
    const articles = await res.json()
    callback(articles)
    return articles
  } catch (error) {
    console.error('Failed to fetch articles:', error)
    const fallbackArticles: Article[] = []
    callback(fallbackArticles)
    return fallbackArticles
  }
  ```
- Zod validation for form schemas: Validation errors handled through react-hook-form context
- Component error boundaries: Not observed in codebase (potential gap)

## Logging

**Framework:** console (browser default)

**Patterns:**
- Use `console.error()` for errors: `console.error('Failed to fetch articles:', error)`
- No debug logging observed in production code
- Test files use vitest `describe`, `it`, `expect` for test output

## Comments

**When to Comment:**
- Minimal commenting observed in the codebase - code is self-documenting
- Comments appear primarily in generated code (`routeTree.gen.ts`) and boilerplate
- Comments used for configuration files and module declarations
- Example: `// Import the generated route tree` in `main.tsx`

**JSDoc/TSDoc:**
- Not observed in the codebase
- TypeScript interfaces provide type documentation instead
- Props are documented through inline TypeScript interfaces

## Function Design

**Size:** Functions are concise and focused
- Helper functions extracted for reusability: `calculateVisibleTags()` in `TagGroup.tsx`
- Component render functions kept under 50 lines
- Utility functions are small and single-purpose

**Parameters:**
- Destructured props in function signatures: `({ children, variant = 'primary', ... })`
- Default values provided in destructuring: `variant = 'primary'`, `disabled = false`
- Type safety through TypeScript interfaces
- Spread operator for remaining props: `{ ...rest }`

**Return Values:**
- Components return JSX.Element (inferred by TypeScript)
- Async functions return Promise types: `Promise<Article[]>`
- Functions with conditional returns use proper typing
- Null/undefined returns are typed explicitly: `CardContext: createContext<CardContextType | undefined>(undefined)`

## Module Design

**Exports:**
- Named exports for components: `export const Button = (...)`
- Named exports for functions: `export async function fetchArticles(...)`
- Named exports for types: `export type CardVariant = ...`
- Avoid default exports in component files (required by eslint rule)

**Re-exports:**
- Used in context providers: `export { CardContext }` in `CardContext.tsx`
- Allows clean public API: One file controls what's exported

**Component File Structure:**
- Single component per file
- Related utilities (variants, schemas) in separate files: `card.variants.ts`, `card.schema.ts`
- Sub-components defined in same file if tightly coupled: `CardHeader`, `CardFooter`, `CardContent` in `Card.tsx`
- Tests in `__tests__/` directory within component folder

## Tailwind CSS

**Usage:**
- Classes applied directly to JSX elements: `className="flex w-full gap-2"`
- Utility classes for layout, spacing, colors, responsive design
- Merged with custom classes using `clsx`: `className={\`${class_variants} ${className}\`}`
- Prettier plugin reorders classes automatically

**Class-Variance-Authority (CVA):**
- Used for component variant management: `button`, `card`, `cardContainer`, `cardHeader`, `cardContent`
- Variants defined in separate `*.variants.ts` files
- Provides type-safe variant management and class composition
- Example structure:
  ```typescript
  export const button = cva(baseClasses, {
    variants: {
      variant: {
        primary: 'bg-indigo-700 text-white',
        secondary: 'bg-transparent text-white border-2 border-gray-600/50',
      },
      disabled: {
        true: 'cursor-not-allowed! opacity-50',
      },
    },
  })
  ```

## Motion/Animation

**Framework:** Framer Motion via `motion/react-client`

**Patterns:**
- Import: `import * as motion from 'motion/react-client'`
- Use `motion.` prefix for animated elements: `motion.button`, `motion.nav`, `motion.article`
- Animation props: `whileTap`, `whileHover`, `transition`
- Layout animations: `layout` prop for coordinated animations
- Example: Button tap animation with `whileTap={{ scale: 0.95 }}` and transition
- Navbar uses `layoutId` for animated underline: `layoutId="underline"`

## Validation

**Framework:** Zod for schema validation

**Patterns:**
- Type-safe schema definitions: `z.enum(['default', 'image_background'])`
- Infer TypeScript types from schemas: `z.infer<typeof cardVariantSchema>`
- Validation in form fields: `cardVariantSchema.parse(variant)`
- Integration with react-hook-form for form validation
- Example:
  ```typescript
  export const cardVariantSchema = z.enum(['default', 'image_background'])
  export type CardVariant = z.infer<typeof cardVariantSchema>
  ```

## React Patterns

**State Management:**
- useState for local component state: `const [selectedLink, setSelectedLink] = useState<number>(0)`
- useContext for cross-component communication: `const context = useContext(CardContext)`
- useMemo for computed values: `const childrenArray = useMemo(...)` in TagGroup
- useRef for DOM references: `const containerRef = useRef<HTMLDivElement>(null)`
- useEffect for side effects: Event listeners, resize handlers

**Context Pattern:**
- Type-safe contexts with TypeScript: `createContext<CardContextType | undefined>(undefined)`
- Context providers as separate components: `CardContextProvider`
- Value memoization in providers: `const value = useMemo(() => ({ variant }), [variant])`

**Component Composition:**
- Compound components pattern: `Card.Header`, `Card.Content`, `Card.Footer`
- Controlled components through props
- Flexible children rendering
