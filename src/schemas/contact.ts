import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(2, "Votre nom est requis"),
  email: z.string().email("Un courriel valide est requis"),
  subject: z.string().min(5, "Le sujet doit contenir au moins 5 caractères"),
  message: z.string().min(10, "Votre message est trop court"),
})

export type ContactInput = z.infer<typeof contactSchema>
