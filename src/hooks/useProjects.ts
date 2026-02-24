import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchPublishedProjects,
  fetchAllProjects,
  fetchProjectById,
  fetchPublishedProjectById,
  createProject,
  updateProject,
  deleteProjectWithImages,
} from '@/services/projects.service'
import { getSignedImageUrls } from '@/services/images.service'
import type { Database } from '@/lib/types/database.types'

type ProjectInsert = Database['public']['Tables']['projects']['Insert']
type ProjectUpdate = Database['public']['Tables']['projects']['Update']

export const projectKeys = {
  all: ['projects'] as const,
  published: () => [...projectKeys.all, 'published'] as const,
  admin: () => [...projectKeys.all, 'admin'] as const,
  detail: (id: string) => [...projectKeys.all, 'detail', id] as const,
  publishedDetail: (id: string) =>
    [...projectKeys.all, 'published', 'detail', id] as const,
}

export function usePublishedProjects() {
  return useQuery({
    queryKey: projectKeys.published(),
    queryFn: fetchPublishedProjects,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

// Like usePublishedProjects but resolves thumbnail_url storage paths to signed URLs
export function usePublishedProjectsWithThumbnails() {
  const projectsQuery = usePublishedProjects()
  const projects = projectsQuery.data ?? []

  const thumbnailPaths = projects
    .map((p) => p.thumbnail_url)
    .filter((url): url is string => Boolean(url))

  const thumbnailsQuery = useQuery({
    queryKey: ['project-thumbnails', thumbnailPaths],
    queryFn: () => getSignedImageUrls(thumbnailPaths, 3600),
    enabled: thumbnailPaths.length > 0,
    staleTime: 50 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  })

  const urlMap = new Map(
    (thumbnailsQuery.data ?? []).map((s) => [s.path, s.signedUrl])
  )

  const data = projects.map((p) => ({
    ...p,
    thumbnail_url: p.thumbnail_url
      ? (urlMap.get(p.thumbnail_url) ?? null)
      : null,
  }))

  return {
    ...projectsQuery,
    data,
    isLoading:
      projectsQuery.isLoading ||
      (thumbnailPaths.length > 0 && thumbnailsQuery.isLoading),
  }
}

export function useAllProjects() {
  return useQuery({
    queryKey: projectKeys.admin(),
    queryFn: fetchAllProjects,
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}

export function useProject(id: string) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => fetchProjectById(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: Boolean(id),
  })
}

export function usePublishedProject(id: string) {
  return useQuery({
    queryKey: projectKeys.publishedDetail(id),
    queryFn: () => fetchPublishedProjectById(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: Boolean(id),
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (project: ProjectInsert) => createProject(project),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all })
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: ProjectUpdate }) =>
      updateProject(id, updates),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all })
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(id) })
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteProjectWithImages(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all })
    },
  })
}
