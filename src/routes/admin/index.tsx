import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/')({
  beforeLoad: ({ context }) => {
    if (context.auth.isLoading) return
    if (context.auth.isAuthenticated) {
      throw redirect({ to: '/admin/dashboard' })
    } else {
      throw redirect({ to: '/admin/login' })
    }
  },
  component: () => null,
})
