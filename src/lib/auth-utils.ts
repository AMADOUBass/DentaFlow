import { createClient } from '@/lib/supabase/server'
import { prisma } from './prisma'
import { redirect } from 'next/navigation'
import { UserRole } from '@prisma/client'

/**
 * Gets the current authenticated user and their Prisma record (with tenant info)
 * Used in Server Components and Server Actions
 */
export async function getAdminUser() {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    redirect('/login')
  }

  let prismaUser = await prisma.user.findUnique({
    where: { authId: user.id },
    include: { tenant: true }
  })


  // AUTO-SYNC LOGIC: If user exists in Supabase but not in Prisma, try to heal
  if (!prismaUser) {
     console.log(`Auto-syncing user ${user.email} in getAdminUser...`)
     
     let role = (user.user_metadata?.role as UserRole) || UserRole.CLINIC_OWNER

     // Force SUPERADMIN if email matches master email
     if (user.email === process.env.SUPERADMIN_EMAIL) {
       role = UserRole.SUPERADMIN
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
     }

     if (!prismaUser) {
       redirect('/login?error=sync_required')
     }
  }

  // Force role repair if email matches master email but role is wrong
  if (user.email === process.env.SUPERADMIN_EMAIL && prismaUser.role !== UserRole.SUPERADMIN) {
     console.log(`Repairing role for ${user.email} to SUPERADMIN...`)
     try {
       prismaUser = await prisma.user.update({
         where: { id: prismaUser.id },
         data: { role: UserRole.SUPERADMIN },
         include: { tenant: true }
       })
     } catch (err) {
       console.error("Role repair failed:", err)
     }
  }

  // Security check: only clinicians can access admin area
  const allowedRoles: UserRole[] = [
    UserRole.SUPERADMIN, 
    UserRole.CLINIC_OWNER, 
    UserRole.CLINIC_STAFF, 
    UserRole.PRACTITIONER
  ]
  
  if (!allowedRoles.includes(prismaUser.role)) {
    console.error(`Access denied: User ${user.email} has role ${prismaUser.role} which is not allowed in admin area.`)
    redirect('/login?error=unauthorized')
  }

  return prismaUser
}
