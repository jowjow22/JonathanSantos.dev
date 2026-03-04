import { z } from 'zod'

export const projectFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
  tech_stack: z.array(z.string()),
  live_url: z.string().refine((v) => v === '' || z.url().safeParse(v).success, {
    message: 'Invalid URL',
  }),
  repo_url: z.string().refine((v) => v === '' || z.url().safeParse(v).success, {
    message: 'Invalid URL',
  }),
  case_study_url: z
    .string()
    .refine((v) => v === '' || z.url().safeParse(v).success, {
      message: 'Invalid URL',
    }),
  sort_order: z.number().int().nonnegative(),
  status: z.enum(['draft', 'published', 'archived']),
})

export type ProjectFormData = z.infer<typeof projectFormSchema>
