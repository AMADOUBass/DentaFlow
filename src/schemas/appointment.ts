import { z } from 'zod'

export const appointmentSchema = z.object({
  serviceId: z.string().min(1, "Veuillez choisir un service"),
  practitionerId: z.string().min(1, "Veuillez choisir un praticien ou 'any'"),
  date: z.string().min(1, "Veuillez choisir une date"),
  slot: z.string().min(1, "Veuillez choisir un créneau horaire"),
  
  // Patient Info
  firstName: z.string().min(2, "Le prénom est requis"),
  lastName: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Un courriel valide est requis"),
  phone: z.string().min(10, "Un numéro de téléphone valide est requis"),
  
  // Optional
  notes: z.string().optional(),
  insuranceId: z.string().optional(),
  insurancePolicy: z.string().optional(),
})

export type AppointmentInput = z.infer<typeof appointmentSchema>

// Helper to validate individual steps
export const step1Schema = appointmentSchema.pick({ serviceId: true })
export const step2Schema = appointmentSchema.pick({ practitionerId: true })
export const step3Schema = appointmentSchema.pick({ date: true })
export const step4Schema = appointmentSchema.pick({ slot: true })
