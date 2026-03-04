import { z } from 'zod'

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
})
const env = envSchema.safeParse(import.meta.env)
if (!env.success) {
  throw new Error('Invalid environment variables')
}
const env_vars = env.data

export { env_vars as env }
