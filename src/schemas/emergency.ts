import { z } from 'zod'
import { EmergencyCategory } from '@prisma/client'

export const emergencySchema = z.object({
  firstName: z.string().min(2, "Le prénom est requis"),
  lastName: z.string().min(2, "Le nom est requis"),
  phone: z.string().min(10, "Un numéro de téléphone valide est requis"),
  email: z.string().email("Un courriel valide est requis").optional().or(z.literal('')),
  painLevel: z.number().min(1).max(10),
  category: z.nativeEnum(EmergencyCategory),
  description: z.string().min(10, "Veuillez décrire brièvement votre problème"),
})

export type EmergencyInput = z.infer<typeof emergencySchema>
