import { z } from 'zod'

export const practitionerSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  title: z.string().min(1, 'Le titre est requis (ex: Dr, Dre)'),
  specialty: z.string().optional(),
  bio: z.string().optional(),
  photoUrl: z.string().url('L\'URL de la photo est invalide').optional().or(z.literal('')),
  active: z.boolean().default(true),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Couleur invalide').default('#0EA5E9'),
})

export type PractitionerInput = z.infer<typeof practitionerSchema>
