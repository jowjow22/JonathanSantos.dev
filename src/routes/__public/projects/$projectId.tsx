import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/__public/projects/$projectId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { projectId } = Route.useParams()
  return (
    <div className="z-[99999] mt-100 text-white">
      Hello "/__public/projects/{projectId}"!
    </div>
  )
}
