import {
  createRootRouteWithContext,
  Outlet,
  HeadContent,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import type { AuthState } from '@/lib/auth/auth-context'

export interface RouterContext {
  auth: AuthState
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { title: 'Jonathan Santos — Front-End Developer' },
      {
        name: 'description',
        content:
          'Portfolio of Jonathan Santos, a Front-End Developer specialising in React, TypeScript, and full-stack web development.',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Jonathan Santos' },
      {
        property: 'og:image',
        content: 'https://jonathansantos.dev/og-image.png',
      },
    ],
  }),
  component: () => (
    <>
      <HeadContent />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
