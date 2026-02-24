import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/lib/types/database.types'

type ContactInsert =
  Database['public']['Tables']['contact_submissions']['Insert']

export async function submitContactForm(
  submission: ContactInsert
): Promise<void> {
  await supabase.from('contact_submissions').insert(submission).throwOnError()
}
