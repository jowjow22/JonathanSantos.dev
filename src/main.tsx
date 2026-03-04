import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './index.css'
import { trackPageView } from '@/lib/analytics'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create router at module level — exported so App.tsx can reference it
export const router = createRouter({
  routeTree,
  scrollRestoration: true,
  scrollRestorationBehavior: 'smooth',
  context: {
    auth: {
      isAuthenticated: false,
      isLoading: true,
      user: null,
    },
  },
})

// Track page views on every client-side navigation.
// 'onResolved' fires after the route is fully rendered and document.title is updated.
// GA4 tracks the initial page_view automatically via gtag('config'); this subscriber
// handles all subsequent client-side navigations.
router.subscribe('onResolved', () => {
  trackPageView(router.state.location.pathname, document.title)
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export const queryClient = new QueryClient()

// Import App after exports so circular reference is avoided at module scope
import { App } from './App'

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </StrictMode>
  )
}
