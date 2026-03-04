import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/__public/projects')({
  component: ProjectsRoute,
})

function ProjectsRoute() {
  return <Outlet />
}
