import { createFileRoute } from '@tanstack/react-router'
import { ProjectForm } from '@/components/admin/ProjectForm/ProjectForm'

export const Route = createFileRoute('/admin/__guard/projects/new')({
  component: NewProjectPage,
})

function NewProjectPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">New Project</h1>
      <ProjectForm />
    </div>
  )
}
