import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useAllProjects, useDeleteProject } from '@/hooks/useProjects'
import { DeleteProjectDialog } from '@/components/admin/DeleteProjectDialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { Database } from '@/lib/types/database.types'

type Project = Database['public']['Tables']['projects']['Row']

export const Route = createFileRoute('/admin/__guard/projects/')({
  component: ProjectsListPage,
})

function ProjectsListPage() {
  const { data: projects, isLoading } = useAllProjects()
  const deleteProject = useDeleteProject()
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return
    deleteProject.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success(`"${deleteTarget.title}" deleted`)
        setDeleteTarget(null)
      },
      onError: (error) => {
        toast.error('Failed to delete project', { description: String(error) })
      },
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button asChild>
          <Link to="/admin/projects/new">New Project</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : !projects?.length ? (
        <p className="text-muted-foreground py-12 text-center">
          No projects yet. Create your first project.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b">
                <th className="px-4 py-3 text-left font-medium">Title</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Order</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{project.title}</td>
                  <td className="text-muted-foreground px-4 py-3 capitalize">
                    {project.status}
                  </td>
                  <td className="text-muted-foreground px-4 py-3">
                    {project.sort_order}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          to="/admin/projects/$projectId/edit"
                          params={{ projectId: project.id }}
                        >
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteTarget(project)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <DeleteProjectDialog
        open={deleteTarget !== null}
        projectTitle={deleteTarget?.title ?? ''}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        isDeleting={deleteProject.isPending}
      />
    </div>
  )
}
