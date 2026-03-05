import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/lib/types/database.types'

type ProjectImage = Database['public']['Tables']['project_images']['Row']
type ProjectImageInsert =
  Database['public']['Tables']['project_images']['Insert']

// Upload a File to Supabase Storage, return the storage_path
// Storage path convention: {projectId}/{uuid}.{ext}
export async function uploadProjectImage(
  projectId: string,
  file: File
): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${projectId}/${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage
    .from('project-images')
    .upload(path, file, { cacheControl: '3600', upsert: false })
  if (error) throw error
  return path
}

// Insert a project_images row; returns the inserted row
export async function insertProjectImage(
  row: ProjectImageInsert
): Promise<ProjectImage> {
  const { data } = await supabase
    .from('project_images')
    .insert(row)
    .select()
    .single()
    .throwOnError()
  if (!data) throw new Error('Insert returned no data')
  return data
}

// Delete a single image: remove storage object + DB row
export async function deleteProjectImage(
  id: string,
  storagePath: string
): Promise<void> {
  const { error } = await supabase.storage
    .from('project-images')
    .remove([storagePath])
  if (error) throw error
  await supabase.from('project_images').delete().eq('id', id).throwOnError()
}

// Batch generate signed URLs for display (admin session duration)
export async function getSignedImageUrls(
  paths: string[],
  expiresIn = 3600
): Promise<Array<{ path: string; signedUrl: string }>> {
  if (paths.length === 0) return []
  const { data, error } = await supabase.storage
    .from('project-images')
    .createSignedUrls(paths, expiresIn)
  if (error) throw error
  return (data ?? [])
    .filter(
      (item): item is typeof item & { path: string; signedUrl: string } =>
        item.path !== null && Boolean(item.signedUrl)
    )
    .map((item) => ({
      path: item.path,
      signedUrl: item.signedUrl,
    }))
}

// Fetch all project_images rows for a project, ordered by sort_order ascending
export async function fetchProjectImages(
  projectId: string
): Promise<ProjectImage[]> {
  const { data } = await supabase
    .from('project_images')
    .select('*')
    .eq('project_id', projectId)
    .order('sort_order', { ascending: true })
    .throwOnError()
  return data ?? []
}

// Batch update sort_order values after image reorder
export async function updateProjectImageOrders(
  updates: Array<{ id: string; sort_order: number }>
): Promise<void> {
  await Promise.all(
    updates.map(({ id, sort_order }) =>
      supabase
        .from('project_images')
        .update({ sort_order })
        .eq('id', id)
        .throwOnError()
    )
  )
}

// Delete ALL images for a project (used during project hard delete)
// Fetches rows, removes all storage objects in one call, then deletes all DB rows
export async function deleteAllProjectImages(projectId: string): Promise<void> {
  const images = await fetchProjectImages(projectId)
  if (images.length === 0) return
  const paths = images.map((img) => img.storage_path)
  const { error } = await supabase.storage.from('project-images').remove(paths)
  if (error) throw error
  await supabase
    .from('project_images')
    .delete()
    .eq('project_id', projectId)
    .throwOnError()
}
