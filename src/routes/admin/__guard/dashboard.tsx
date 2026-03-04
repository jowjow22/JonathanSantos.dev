import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/__guard/dashboard')({
  beforeLoad: () => {
    throw redirect({ to: '/admin/projects' })
  },
  component: () => null,
})
