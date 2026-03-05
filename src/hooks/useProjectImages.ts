import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchProjectImages,
  getSignedImageUrls,
  deleteProjectImage,
} from '@/services/images.service'

export const imageKeys = {
  all: ['project_images'] as const,
  byProject: (projectId: string) => [...imageKeys.all, projectId] as const,
}

// Fetches project_images rows + generates signed URLs for each in one combined query
export function useProjectImages(projectId: string) {
  return useQuery({
    queryKey: imageKeys.byProject(projectId),
    queryFn: async () => {
      const images = await fetchProjectImages(projectId)
      if (images.length === 0) return []
      const signedUrls = await getSignedImageUrls(
        images.map((img) => img.storage_path),
        3600
      )
      const urlMap = new Map(signedUrls.map((s) => [s.path, s.signedUrl]))
      return images
        .filter((img) => urlMap.has(img.storage_path))
        .map((img) => ({
          ...img,
          signedUrl: urlMap.get(img.storage_path)!,
        }))
    },
    staleTime: 50 * 60 * 1000, // 50 min — refresh before 1h signed URL expiry
    gcTime: 60 * 60 * 1000,
    enabled: Boolean(projectId),
  })
}

export function useDeleteProjectImage(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, storagePath }: { id: string; storagePath: string }) =>
      deleteProjectImage(id, storagePath),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: imageKeys.byProject(projectId),
      })
    },
  })
}
