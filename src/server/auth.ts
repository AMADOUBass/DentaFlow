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
  const rawReturnUrl = formData.get('returnUrl') as string | null
  // Validate returnUrl: internal paths only, no open-redirect
  const returnUrl =
    rawReturnUrl && rawReturnUrl.startsWith('/') && !rawReturnUrl.startsWith('//')
      ? rawReturnUrl
      : null

  const { data: { user }, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error || !user) {
    return { error: "Identifiants invalides." }
  }

  // Fetch role from Prisma
  let dbUser = await prisma.user.findUnique({
    where: { authId: user.id },
    include: { tenant: true }
  })

  // AUTO-SYNC LOGIC: If user exists in Supabase but not in Prisma
  if (!dbUser) {
    console.log(`Syncing user ${user.email} from Supabase to Prisma...`)
    
    // Extract metadata from Supabase
    let role = (user.user_metadata?.role as UserRole) || UserRole.CLINIC_OWNER
    
    // Force SUPERADMIN if email matches master email
    if (user.email === process.env.SUPERADMIN_EMAIL) {
      role = UserRole.SUPERADMIN
    }

    const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
    const tenantId = user.user_metadata?.tenant_id as string | undefined

    dbUser = await prisma.user.create({
      data: {
        authId: user.id,
        email: user.email!,
        name: name,
        role: role,
        tenantId: tenantId || null,
      },
      include: { tenant: true }
    })
  }

  // Force SUPERADMIN role update if email matches master email
  if (user.email === process.env.SUPERADMIN_EMAIL && dbUser.role !== UserRole.SUPERADMIN) {
    console.log(`Upgrading user ${user.email} to SUPERADMIN...`)
    dbUser = await prisma.user.update({
      where: { id: dbUser.id },
      data: { role: UserRole.SUPERADMIN },
      include: { tenant: true }
    })
  }

  revalidatePath('/', 'layout')

  if (dbUser.role === UserRole.SUPERADMIN) {
    redirect(returnUrl || '/superadmin')
  }

  redirect(returnUrl || '/admin-area/admin/dashboard')
}

export async function loginWithMagicLink(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const tenantSlug = formData.get('tenantSlug') as string | null

  // Build redirect URL on the tenant subdomain so the session cookie lands on the right domain
  let emailRedirectTo: string
  if (tenantSlug) {
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000'
    const protocol = rootDomain.includes('localhost') ? 'http' : 'https'
    emailRedirectTo = `${protocol}://${tenantSlug}.${rootDomain}/api/auth/callback?next=/portail`
  } else {
    emailRedirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo },
  })

  if (error) {
    console.error('[loginWithMagicLink] Supabase OTP error:', error.message, '| redirectTo:', emailRedirectTo)
    // Expose the real reason in dev so we can diagnose; generic message in prod
    const message = process.env.NODE_ENV === 'development'
      ? `Supabase: ${error.message}`
      : "Erreur lors de l'envoi du lien. Vérifiez votre adresse courriel et réessayez."
    return { error: message }
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
