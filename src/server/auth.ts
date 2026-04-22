'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { clinicRegistrationSchema, type ClinicRegistrationInput } from '@/schemas/registration'
import { UserRole } from '@prisma/client'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data: { user }, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error || !user) {
    return { error: "Identifiants invalides." }
  }

  // Fetch role from Prisma
  const dbUser = await prisma.user.findUnique({
    where: { authId: user.id }
  })

  revalidatePath('/', 'layout')

  if (dbUser?.role === UserRole.SUPERADMIN) {
    redirect('/superadmin')
  }

  // Pour les cliniques, on utilise le chemin physique direct pour éviter les conflits de sous-domaines lors du login
  redirect('/admin-area/admin/dashboard')
}

export async function loginWithMagicLink(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
    },
  })

  if (error) {
    return { error: "Erreur lors de l'envoi du lien." }
  }

  return { success: "Lien envoyé ! Vérifiez vos courriels." }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

/**
 * Vérifie si un sous-domaine est disponible
 */
export async function checkSlugAvailability(slug: string) {
  const count = await prisma.tenant.count({
    where: { slug }
  })
  return count === 0
}

/**
 * Enregistre une nouvelle clinique et son administrateur
 */
export async function registerClinicAction(data: ClinicRegistrationInput) {
  // 1. Validation Zod
  const result = clinicRegistrationSchema.safeParse(data)
  if (!result.success) {
    return { error: "Données invalides." }
  }

  const { name, slug, email, password, phone, address, city, postalCode, adminName, neq } = result.data

  // 2. Vérification unicité (Double check)
  const [existingEmail, existingSlug] = await Promise.all([
    prisma.user.findUnique({ where: { email } }),
    prisma.tenant.findUnique({ where: { slug } })
  ])

  if (existingEmail) return { error: "Cet email est déjà utilisé." }
  if (existingSlug) return { error: "Ce sous-domaine est déjà pris." }

  try {
    // 3. Création du Tenant en Prisma
    const tenant = await prisma.tenant.create({
      data: {
        name,
        slug,
        phone,
        email,
        address,
        city,
        postalCode,
        neq,
        primaryColor: "#0F766E", // Défaut
      }
    })

    // 4. Inscription dans Supabase Auth
    const supabase = await createClient()
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: adminName,
          role: 'CLINIC_OWNER',
          tenant_id: tenant.id
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
      }
    })

    if (authError) {
      // Rollback Tenant creation if Auth fails (In a production env, use transactions or cleanup)
      await prisma.tenant.delete({ where: { id: tenant.id } })
      return { error: `Erreur d'inscription : ${authError.message}` }
    }

    if (!authData.user) {
      return { error: "Erreur lors de la création de l'utilisateur." }
    }

    // 5. Création du User en Prisma lié au Tenant
    await prisma.user.create({
      data: {
        authId: authData.user.id,
        email,
        name: adminName,
        role: UserRole.CLINIC_OWNER,
        tenantId: tenant.id
      }
    })

    // 6. Succès
    return { success: true }
    
  } catch (err) {
    console.error("Clinic Registration Error:", err)
    return { error: "Une erreur imprévue est survenue lors de l'inscription." }
  }
}
