import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email("Un courriel valide est requis"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
})

export type LoginInput = z.infer<typeof loginSchema>

export const magicLinkSchema = z.object({
  email: z.string().email("Un courriel valide est requis"),
})

export type MagicLinkInput = z.infer<typeof magicLinkSchema>
