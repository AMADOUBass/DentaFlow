import { createClient } from '@/lib/supabase/server'
import { prisma } from './prisma'
import { redirect } from 'next/navigation'

/**
 * Gets the current authenticated user and their Prisma record (with tenant info)
 * Used in Server Components and Server Actions
 */
export async function getAdminUser() {
  const supabase = await createClient()
  
  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch (err) {
    console.error("Supabase Auth Network Error:", err)
    redirect('/login?error=network_error')
  }

  if (!user) {
    redirect('/login')
  }

  let prismaUser = await prisma.user.findUnique({
    where: { authId: user.id },
    include: { tenant: true }
  })

  // AUTO-SYNC LOGIC: If user exists in Supabase but not in Prisma, try to heal
  if (!prismaUser) {
     console.log(`Auto-syncing user ${user.email} in getAdminUser...`)
     
     let role = (user.user_metadata?.role as any) || 'CLINIC_OWNER'

     // Force SUPERADMIN if email matches master email
     if (user.email === process.env.NEXT_PUBLIC_SUPERADMIN_EMAIL) {
       role = 'SUPERADMIN'
     }

     const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
     const tenantId = user.user_metadata?.tenant_id as string | undefined

     try {
       prismaUser = await prisma.user.create({
         data: {
           authId: user.id,
           email: user.email!,
           name: name,
           role: role,
           tenantId: tenantId || null,
         },
         include: { tenant: true }
       })
     } catch (err) {
       console.error("Auto-sync failed:", err)
       redirect('/login?error=sync_required')
     }
  }

  // Security check: only clinicians can access admin area
  const allowedRoles = ['SUPERADMIN', 'CLINIC_OWNER', 'CLINIC_STAFF', 'PRACTITIONER']
  if (!allowedRoles.includes(prismaUser.role)) {
    redirect('/login?error=unauthorized')
  }

  return prismaUser
}
