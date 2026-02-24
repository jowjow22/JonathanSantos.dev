import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/lib/types/database.types'

type CareerEntry = Database['public']['Tables']['career_entries']['Row']

export async function fetchPublishedCareerEntries(): Promise<CareerEntry[]> {
  const { data } = await supabase
    .from('career_entries')
    .select('*')
    .eq('status', 'published')
    .is('deleted_at', null)
    .order('start_date', { ascending: false })
    .throwOnError()
  return data ?? []
}
