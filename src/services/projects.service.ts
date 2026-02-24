import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/lib/types/database.types'
import { deleteAllProjectImages } from '@/services/images.service'

type Project = Database['public']['Tables']['projects']['Row']
type ProjectInsert = Database['public']['Tables']['projects']['Insert']
type ProjectUpdate = Database['public']['Tables']['projects']['Update']

export async function fetchPublishedProjects(): Promise<Project[]> {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'published')
    .is('deleted_at', null)
    .order('sort_order', { ascending: true })
    .throwOnError()
  return data ?? []
}

export async function fetchAllProjects(): Promise<Project[]> {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .is('deleted_at', null)
    .order('sort_order', { ascending: true })
    .throwOnError()
  return data ?? []
}

export async function fetchProjectById(id: string): Promise<Project | null> {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .maybeSingle()
    .throwOnError()
  return data ?? null
}

export async function fetchPublishedProjectById(
  id: string
): Promise<Project | null> {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .eq('status', 'published')
    .is('deleted_at', null)
    .maybeSingle()
    .throwOnError()
  return data ?? null
}

export async function createProject(project: ProjectInsert): Promise<Project> {
  const { data } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single()
    .throwOnError()
  return data!
}

export async function updateProject(
  id: string,
  updates: ProjectUpdate
): Promise<Project> {
  const { data } = await supabase
    .from('projects')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
    .throwOnError()
  return data!
}

export async function softDeleteProject(id: string): Promise<void> {
  await supabase
    .from('projects')
    .update({
      deleted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .throwOnError()
}

// Hard delete: removes all project_images + storage objects, then hard-deletes the project row
// Used by admin delete action (not the public soft-delete soft-archive)
export async function deleteProjectWithImages(id: string): Promise<void> {
  await deleteAllProjectImages(id)
  await supabase.from('projects').delete().eq('id', id).throwOnError()
}
