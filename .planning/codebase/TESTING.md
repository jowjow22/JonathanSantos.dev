# Testing Patterns

**Analysis Date:** 2026-02-23

## Test Framework

**Runner:**
- Vitest 3.2.4
- Config: `vitest.config.mts`
- Testing Library React 16.3.0 for component testing
- Testing Library DOM 10.4.1 for DOM queries

**Assertion Library:**
- Vitest built-in expect (compatible with Jest)
- Testing Library jest-dom matchers via `@testing-library/jest-dom/vitest`

**Setup:**
- Setup file: `vitest.setup.ts`
- Environment: jsdom (browser-like environment for React components)
- Global test functions enabled: `globals: true`
- Watch mode disabled: `watch: false`
- Coverage provider: istanbul with HTML reporter

**Run Commands:**
```bash
npm run test                    # Run all tests with coverage report
npm run ci:test                 # CI testing (non-watch mode)
vitest run --coverage           # Run tests and generate coverage
```

## Test File Organization

**Location:**
- Co-located: Tests stored in `__tests__/` directory within component folder
- Pattern: `src/components/[ComponentName]/__tests__/[ComponentName].spec.tsx`

**Examples:**
- `src/components/Button/__tests__/Button.spec.tsx`
- `src/components/Card/__tests__/Card.spec.tsx`
- `src/components/Navbar/__tests__/Navbar.spec.tsx`
- `src/components/TagGroup/__tests__/TagGroup.spec.tsx`
- `src/components/Form/components/__tests__/Textfield.spec.tsx`
- `src/components/ArticlesSection/__tests__/ArticlesSection.spec.tsx`

**Naming:**
- `.spec.tsx` suffix for test files (not `.test.tsx`)
- Test file names match component names: `Button.spec.tsx` for `Button.tsx`

**Structure:**
```
src/components/
├── Button/
│   ├── Button.tsx
│   ├── button.variants.ts (if applicable)
│   └── __tests__/
│       └── Button.spec.tsx
├── Card/
│   ├── Card.tsx
│   ├── card.variants.ts
│   ├── card.schema.ts
│   └── __tests__/
│       └── Card.spec.tsx
```

## Test Structure

**Suite Organization:**
```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

describe('Component name', () => {
  it('should do something specific', () => {
    // Test implementation
  })

  it('should handle another case', () => {
    // Test implementation
  })
})
```

**Patterns:**

1. **Import Pattern:**
   - Import vitest functions from 'vitest': `describe`, `it`, `expect`, `vi`
   - Import Testing Library utilities: `render`, `screen`, `waitFor`, `act`
   - Import jest-dom matchers: `import '@testing-library/jest-dom/vitest'`
   - Import component under test
   - Import mock data/types as needed

2. **Setup Pattern:**
   - Minimal setup in individual tests
   - Mock global objects at test file level: `vi.stubGlobal('IntersectionObserver', ...)`
   - Mock modules using `vi.mock()`: `vi.mock('@tanstack/react-router', ...)`
   - Mocks declared before describe block

3. **Test Execution Pattern:**
   - Simple cases: Direct render and assertion
   - Interactive tests: Use `userEvent.setup()` to get user instance, then interact
   - Async operations: Wrap in `await act(async () => {...})`
   - Wait for async updates: `await screen.findByText(...)` or `waitFor(() => {...})`

4. **Assertion Pattern:**
   - Use screen queries over container queries: `screen.getByText()` not `container.querySelector()`
   - Test visible behavior, not implementation details
   - Check for presence: `toBeInTheDocument()`
   - Check CSS classes: `toHaveClass('css-class')`
   - Check attributes: `toHaveAttribute('src', ...)`
   - Check text content: `toHaveTextContent()`, `toHaveText()`

## Mocking

**Framework:** Vitest built-in mocking (`vi` namespace)

**Patterns:**

1. **Module Mocking:**
   ```typescript
   vi.mock('@tanstack/react-router', () => ({
     Link: ({ children, to, ...props }: { children: React.ReactNode; to: string; [key: string]: unknown }) => (
       <a href={to} {...props}>
         {children}
       </a>
     ),
   }))
   ```
   - Located before describe block
   - Mocks entire modules at test file level
   - Used for external dependencies

2. **Global Mocking:**
   ```typescript
   const IntersectionObserverMock = vi.fn(() => ({
     disconnect: vi.fn(),
     observe: vi.fn(),
     takeRecords: vi.fn(),
     unobserve: vi.fn(),
   }))

   vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)
   ```
   - Used for browser APIs
   - Returns object with mock methods

3. **Component Mocking:**
   ```typescript
   vi.mock('@/components/ui/carousel', () => ({
     Carousel: 'div',
     CarouselItem: 'div',
     CarouselContent: 'div',
     CarouselNext: 'div',
     CarouselPrevious: 'div',
   }))
   ```
   - Mock complex UI components as simple divs
   - Useful for testing component integration without rendering complex dependencies

4. **Function Mocking:**
   ```typescript
   const clickHandler = vi.fn()
   render(<Button onClick={clickHandler}>Click</Button>)
   user.click(button)
   expect(clickHandler).not.toHaveBeenCalled()
   ```
   - Create spy functions with `vi.fn()`
   - Assert on call count and arguments

**What to Mock:**
- External API dependencies (fetch calls)
- Browser APIs (IntersectionObserver, window.matchMedia)
- Routing libraries (@tanstack/react-router)
- Complex UI library components when testing integration
- Module exports that are not under test

**What NOT to Mock:**
- React and React hooks
- Testing Library utilities
- Components being tested
- Simple HTML elements
- Vitest global functions

## Fixtures and Factories

**Test Data:**
```typescript
const mockArticles: Article[] = [
  {
    id: '123',
    title: 'test article',
    cover_image: 'url://image.com',
    published_at: '22-02-2003',
    description: 'Bla bla bla bla bla',
    url: 'url://article.com',
  },
]
```

**Pattern:**
- Inline test data within test file
- Use const declarations at top of describe block
- Follow type definitions: Use actual type names (`Article`, `CardVariant`)

**Factory Functions:**
- Used for complex test setup: `renderWithForm()` in Textfield tests
- Encapsulates component wrapping and form context setup
- Returns render result for assertions

**Example Factory:**
```typescript
function renderWithForm(
  props: Parameters<typeof TextField>[0],
  schema?: z.ZodObject<z.ZodRawShape>
) {
  const validationSchema = z.object({
    [props.name as string]: z.string().min(1, 'Required'),
  })
  const Wrapper: React.FC = () => {
    const methods = useForm<FieldValues>({
      resolver: zodResolver(schema ?? validationSchema),
      defaultValues: { [props.name as string]: '' },
      mode: 'onBlur',
    })
    set_error = methods.setError
    return (
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(() => {})}>
          <TextField {...props} control={methods.control} />
          <button type="submit">Submit</button>
        </form>
      </FormProvider>
    )
  }

  render(<Wrapper />)
}
```

**Location:**
- Test utilities and factories defined in same test file
- No shared fixtures directory observed (potential opportunity for consolidation)

## Coverage

**Requirements:** Not enforced (no coverage threshold in config)

**View Coverage:**
```bash
npm run test                              # Generates HTML coverage report
# Report available in coverage/ directory
```

**Configuration:**
- Provider: istanbul
- Reporter: HTML
- Auto-generated after test run

## Test Types

**Unit Tests:**
- Scope: Individual components in isolation
- Approach: Render component with props, assert on output
- Examples:
  - `Button.spec.tsx`: Tests variant, disabled state, icon rendering
  - `Card.spec.tsx`: Tests header, content, footer sub-components and variants
  - `TagGroup.spec.tsx`: Tests tag rendering, overflow handling, responsive behavior

**Integration Tests:**
- Scope: Components with dependencies (forms, contexts, external data)
- Approach: Set up full component tree with mocks, test interaction flows
- Examples:
  - `Navbar.spec.tsx`: Tests link selection and underline animation
  - `Textfield.spec.tsx`: Tests form validation, error display with react-hook-form integration
  - `ArticlesSection.spec.tsx`: Tests rendering article list with carousel and carousel interactions

**E2E Tests:**
- Framework: Not used
- No end-to-end test suite observed

## Common Patterns

**Async Testing:**
```typescript
// Option 1: Using act()
await act(async () => {
  render(<Navbar />)
})

// Option 2: Using findBy (already wraps in act)
const errorMessage = await screen.findByText(errorMessage)
expect(errorMessage).toBeInTheDocument()

// Option 3: Using waitFor
waitFor(() => {
  expect(screen.getByTestId('underline').parentElement).toBe(projectsLink)
})
```

**User Interaction Testing:**
```typescript
import userEvent from '@testing-library/user-event'

const user = userEvent.setup()
await user.click(button)
await user.tab()
```

**Error Testing:**
```typescript
it('shows the error message when setError is called', async () => {
  const fieldName = 'email'
  const errorMessage = 'Email is required'

  renderWithForm({ name: fieldName, label: 'Email' }, zodSchema)

  await act(async () => {
    set_error(fieldName, { type: 'manual', message: errorMessage })
  })

  expect(await screen.findByText(errorMessage)).toBeInTheDocument()
})
```

**Property/DOM Assertion:**
```typescript
// Class assertions
expect(button).toHaveClass('bg-indigo-700 text-white')
expect(button).not.toHaveClass('opacity-50')

// Attribute assertions
expect(image).toHaveAttribute('src', expect.stringContaining('custom-image.png'))

// Content assertions
expect(button).not.toHaveTextContent('View Projects')

// Element presence
const hiddenCountElements = screen.queryByText(/\+\d+/)
expect(hiddenCountElements).not.toBeInTheDocument()
```

**Property Mocking for DOM Measurements:**
```typescript
const originalOffsetWidth = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'offsetWidth'
)

Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
  configurable: true,
  value: 100,
})

// Test code here...

// Restore original
if (originalOffsetWidth) {
  Object.defineProperty(
    HTMLElement.prototype,
    'offsetWidth',
    originalOffsetWidth
  )
}
```

## Test Helpers and Utilities

**Testing Library Queries:**
- `getByText()`: Find element by text (throws if not found)
- `getByRole()`: Find element by ARIA role (preferred for accessibility)
- `getByTestId()`: Find element by data-testid (last resort)
- `queryByText()`: Find element or return null (for non-existence checks)
- `findByText()`: Async query (waits for element)
- `screen.getAllByTestId()`: Get multiple elements

**Debugging:**
- No explicit debugging patterns observed
- Standard console.log available in test code

## Test Data Attributes

**Pattern:** Use data-testid for test-specific queries

**Examples:**
- `data-testid="card-header"`
- `data-testid="button-icon"`
- `data-testid="link-about-section"`
- `data-testid="underline"`
- `data-testid="articles-titles"`

**Strategy:**
- Added to components for testing (not visible in browser)
- Used when accessible queries (getByRole, getByText) are insufficient
- Provide stable selectors for complex component testing
