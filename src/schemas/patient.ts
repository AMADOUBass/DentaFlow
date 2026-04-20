import { z } from 'zod'

export const patientProfileSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  phone: z.string().min(10, 'Le numéro de téléphone est invalide'),
  address: z.string().optional().nullable(),
  insurancePolicy: z.string().optional().nullable(),
  insuranceProviderId: z.string().optional().nullable(),
  ramqNumber: z.string().optional().nullable(),
  medicalNotes: z.string().optional().nullable(),
  smsOptIn: z.boolean().default(true),
})

export type PatientProfileInput = z.infer<typeof patientProfileSchema>
