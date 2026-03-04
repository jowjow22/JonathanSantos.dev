import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/__public/about')({
  beforeLoad: () => {
    throw redirect({ to: '/' })
  },
  component: () => null,
})
