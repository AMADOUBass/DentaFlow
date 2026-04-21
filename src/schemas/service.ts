import { z } from 'zod'
import { ServiceCategory } from '@prisma/client'

export const serviceSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
   nameEn: z.string().nullable().optional(),
   description: z.string().nullable().optional(),
  durationMin: z.number().min(5, 'La durée doit être d\'au moins 5 minutes'),
  priceCents: z.number().optional().nullable(),
  category: z.nativeEnum(ServiceCategory),
  active: z.boolean(),
  order: z.number(),
})

export type ServiceInput = z.infer<typeof serviceSchema>
