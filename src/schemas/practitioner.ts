import { z } from 'zod'

export const practitionerSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  title: z.string().min(1, 'Le titre est requis (ex: Dr, Dre)'),
  specialty: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  photoUrl: z.string().url('L\'URL de la photo est invalide').nullable().optional().or(z.literal('')).or(z.null()),
  active: z.boolean(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Couleur invalide'),
})

export type PractitionerInput = z.infer<typeof practitionerSchema>
