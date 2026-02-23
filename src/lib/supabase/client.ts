import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database.types'
import { env } from '@/lib/env'

export const supabase = createClient<Database>(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_PUBLISHABLE_KEY
)
