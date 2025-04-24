import { z } from 'zod'

const envSchema = z.object({
    DEV_API_KEY: z.string().min(1),
})
const env = envSchema.safeParse(process.env)
if (!env.success) {
    console.error('Invalid environment variables:', env.error.format())
    throw new Error('Invalid environment variables')
}
const env_vars = env.data

export { env_vars as env }
