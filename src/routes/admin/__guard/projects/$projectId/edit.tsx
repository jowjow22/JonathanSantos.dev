import { createFileRoute } from '@tanstack/react-router'
import { useProject } from '@/hooks/useProjects'
import { ProjectForm } from '@/components/admin/ProjectForm/ProjectForm'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/admin/__guard/projects/$projectId/edit')(
  {
    component: EditProjectPage,
  }
)

function EditProjectPage() {
  const { projectId } = Route.useParams()
  const { data: project, isLoading } = useProject(projectId)

  if (isLoading) {
    return (
      <div className="max-w-2xl space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (!project) {
    return <p className="text-muted-foreground">Project not found.</p>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Project</h1>
      <ProjectForm project={project} />
    </div>
  )
}
