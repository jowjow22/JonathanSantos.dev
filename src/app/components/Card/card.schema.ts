import { z } from 'zod'

export const cardVariantSchema = z.enum([
    'default',
    'image_background',
    ])
export type CardVariant = z.infer<typeof cardVariantSchema>