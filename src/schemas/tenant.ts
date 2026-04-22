import { z } from 'zod'

export const tenantSettingsSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Format de courriel invalide"),
  phone: z.string().min(10, "Format de téléphone invalide"),
  address: z.string().min(5, "L'adresse est requise"),
  city: z.string().min(2, "La ville est requise"),
  postalCode: z.string().min(6, "Code postal invalide"),
  province: z.string().min(2),
  logoUrl: z.string().url().optional().or(z.literal('').or(z.null())),
  primaryColor: z.string().startsWith('#'),
  bilingual: z.boolean(),
})

export type TenantSettingsInput = z.infer<typeof tenantSettingsSchema>
