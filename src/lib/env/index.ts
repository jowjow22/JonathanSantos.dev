import { z } from 'zod'

const envSchema = z.object({
  VITE_DEV_API_KEY: z.string().min(1),
  VITE_MY_CONTACT_EMAIL: z.email(),
  VITE_DEV_API_BASE_URL: z.url(),
})
const env = envSchema.safeParse(import.meta.env)
if (!env.success) {
  throw new Error('Invalid environment variables')
}
const env_vars = env.data

export { env_vars as env }
