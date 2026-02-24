import { useState, useEffect, useRef } from 'react'
import { useNavigate, useBlocker } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { useCreateProject, useUpdateProject } from '@/hooks/useProjects'
import {
  useProjectImages,
  useDeleteProjectImage,
  imageKeys,
} from '@/hooks/useProjectImages'
import {
  uploadProjectImage,
  insertProjectImage,
  updateProjectImageOrders,
} from '@/services/images.service'
import { updateProject } from '@/services/projects.service'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { TechStackInput } from './TechStackInput'
import { ImageUploadZone, type ImageItem } from './ImageUploadZone'
import { projectFormSchema, type ProjectFormData } from './projectForm.schema'
import type { Database } from '@/lib/types/database.types'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

type Project = Database['public']['Tables']['projects']['Row']

interface IProjectFormProps {
  project?: Project
}

export function ProjectForm({ project }: IProjectFormProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEdit = Boolean(project)
  const createProject = useCreateProject()
  const updateProjectMutation = useUpdateProject()
  const { data: savedImages = [] } = useProjectImages(project?.id ?? '')
  const deleteImage = useDeleteProjectImage(project?.id ?? '')

  // imageItems tracks both saved (from DB) and pending (local File objects) images
  const [imageItems, setImageItems] = useState<ImageItem[]>([])

  // Populate imageItems from savedImages when editing
  useEffect(() => {
    if (savedImages.length > 0) {
      setImageItems(
        savedImages.map((img) => ({
          id: img.id,
          type: 'saved' as const,
          preview: img.signedUrl,
          sort_order: img.sort_order,
          storagePath: img.storage_path,
        }))
      )
    }
  }, [savedImages])

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: project
      ? {
          title: project.title,
          description: project.description ?? '',
          tech_stack: project.tech_stack ?? [],
          live_url: project.live_url ?? '',
          repo_url: project.repo_url ?? '',
          case_study_url: project.case_study_url ?? '',
          sort_order: project.sort_order ?? 0,
          status: (project.status as ProjectFormData['status']) ?? 'draft',
        }
      : {
          title: '',
          description: '',
          tech_stack: [],
          live_url: '',
          repo_url: '',
          case_study_url: '',
          sort_order: 0,
          status: 'draft',
        },
  })

  // Ref-based save flag: bypasses the blocker when navigate() fires right after form.reset()
  // (isDirty is still true in the current render cycle at that point)
  const isSavedRef = useRef(false)

  const isDirty = form.formState.isDirty
  const blocker = useBlocker({
    shouldBlockFn: () => isDirty && !isSavedRef.current,
    enableBeforeUnload: isDirty,
    withResolver: true,
  })

  // Sync form when project data is refreshed from server (e.g. after navigate back to edit)
  // Guard prevents resetting while the user is actively editing
  useEffect(() => {
    if (!project || form.formState.isDirty) return
    form.reset({
      title: project.title,
      description: project.description ?? '',
      tech_stack: (project.tech_stack as string[]) ?? [],
      live_url: project.live_url ?? '',
      repo_url: project.repo_url ?? '',
      case_study_url: project.case_study_url ?? '',
      sort_order: project.sort_order ?? 0,
      status: (project.status as ProjectFormData['status']) ?? 'draft',
    })
    // form is stable from react-hook-form; intentionally excluded from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project])

  const isMutating = createProject.isPending || updateProjectMutation.isPending

  const onSubmit = async (data: ProjectFormData) => {
    try {
      let savedProjectId: string

      if (isEdit && project) {
        // Edit mode
        await updateProjectMutation.mutateAsync({
          id: project.id,
          updates: data,
        })
        savedProjectId = project.id
      } else {
        // Create mode
        const created = await createProject.mutateAsync(data)
        savedProjectId = created.id
      }

      // Upload pending images
      const pendingItems = imageItems.filter((i) => i.type === 'pending')
      for (let i = 0; i < pendingItems.length; i++) {
        const item = pendingItems[i]
        if (!item.file) continue
        const storagePath = await uploadProjectImage(savedProjectId, item.file)
        await insertProjectImage({
          project_id: savedProjectId,
          storage_path: storagePath,
          sort_order: imageItems.findIndex((img) => img.id === item.id),
        })
      }

      // Update sort orders for saved images that were reordered
      const savedItemsReordered = imageItems
        .filter((i) => i.type === 'saved')
        .map((i) => ({ id: i.id, sort_order: i.sort_order }))
      if (savedItemsReordered.length > 0) {
        await updateProjectImageOrders(savedItemsReordered)
      }

      // Set thumbnail_url to the first image's storage_path.
      // Fetch fresh from the DB after all uploads so the correct storage_path is
      // available regardless of whether the first image was pending or already saved.
      const { fetchProjectImages } = await import('@/services/images.service')
      const fresh = await fetchProjectImages(savedProjectId)
      if (fresh[0]) {
        await updateProject(savedProjectId, {
          thumbnail_url: fresh[0].storage_path,
        })
      }

      // Invalidate image cache so the edit form shows fresh order next visit
      queryClient.invalidateQueries({
        queryKey: imageKeys.byProject(savedProjectId),
      })

      isSavedRef.current = true
      form.reset(data)
      toast.success(isEdit ? 'Project updated' : 'Project created')
      navigate({ to: '/admin/projects' })
    } catch (error) {
      isSavedRef.current = false
      toast.error('Failed to save project', { description: String(error) })
    }
  }

  const handleDeleteSaved = (id: string, storagePath: string) => {
    deleteImage.mutate(
      { id, storagePath },
      {
        onSuccess: () => {
          setImageItems((prev) => prev.filter((i) => i.id !== id))
        },
      }
    )
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-2xl space-y-6"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title *</FormLabel>
                <FormControl>
                  <Input placeholder="Project title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Project description"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Tech Stack</FormLabel>
            <TechStackInput control={form.control} />
          </FormItem>

          <FormField
            control={form.control}
            name="live_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Live URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="repo_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Repository URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://github.com/user/repo"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="case_study_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Case Study URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/case-study"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sort_order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Order</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    className="w-32"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Images</FormLabel>
            <ImageUploadZone
              items={imageItems}
              onChange={setImageItems}
              onDeleteSaved={handleDeleteSaved}
            />
          </FormItem>

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-3">
            <Button type="submit" disabled={isMutating}>
              {isMutating
                ? 'Saving...'
                : isEdit
                  ? 'Update Project'
                  : 'Create Project'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: '/admin/projects' })}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>

      {/* Unsaved changes blocker dialog */}
      {blocker.status === 'blocked' && (
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Leave page?</AlertDialogTitle>
              <AlertDialogDescription>
                You have unsaved changes. If you leave now, your changes will be
                lost.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => blocker.reset()}>
                Keep editing
              </AlertDialogCancel>
              <AlertDialogAction onClick={() => blocker.proceed()}>
                Leave page
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )
}
