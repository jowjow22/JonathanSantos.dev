import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/lib/types/database.types'

type Skill = Database['public']['Tables']['skills']['Row']
type SkillCategory = Database['public']['Tables']['skill_categories']['Row']

export async function fetchPublishedSkills(): Promise<Skill[]> {
  const { data } = await supabase
    .from('skills')
    .select('*')
    .eq('status', 'published')
    .is('deleted_at', null)
    .order('sort_order', { ascending: true })
    .throwOnError()
  return data ?? []
}

export async function fetchSkillCategories(): Promise<SkillCategory[]> {
  const { data } = await supabase
    .from('skill_categories')
    .select('*')
    .is('deleted_at', null)
    .order('sort_order', { ascending: true })
    .throwOnError()
  return data ?? []
}
