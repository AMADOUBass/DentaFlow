import { z } from 'zod'

export const clinicRegistrationSchema = z.object({
  // Clinic Info
  name: z.string().min(3, "Le nom de la clinique doit contenir au moins 3 caractères"),
  slug: z.string()
    .min(3, "Le sous-domaine doit contenir au moins 3 caractères")
    .regex(/^[a-z0-0-]+$/, "Le sous-domaine ne peut contenir que des lettres minuscules, chiffres et tirets"),
  neq: z.string().length(10, "Le NEQ doit comporter exactement 10 chiffres").regex(/^\d+$/, "Le NEQ ne doit contenir que des chiffres"),
  phone: z.string().min(10, "Un numéro de téléphone valide est requis"),
  address: z.string().min(5, "Une adresse complète est requise"),
  city: z.string().min(2, "La ville est requise"),
  postalCode: z.string().regex(/^[A-Z]\d[A-Z] \d[A-Z]\d$/, "Format postal invalide (ex: G1V 2M3)"),
  
  // Admin Info
  adminName: z.string().min(3, "Veuillez saisir votre nom complet"),
  email: z.string().email("Un courriel valide est requis"),
  password: z.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"]
})

export type ClinicRegistrationInput = z.infer<typeof clinicRegistrationSchema>
