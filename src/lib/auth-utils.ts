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

  const prismaUser = await prisma.user.findUnique({
    where: { authId: user.id },
    include: { tenant: true }
  })

  // If user is in Supabase but not in Prisma, something is wrong with sync
  if (!prismaUser) {
     console.error(`User ${user.id} not found in Prisma. Identity sync required.`)
     redirect('/login?error=sync_required')
  }

  // Security check: only clinicians can access admin area
  const allowedRoles = ['SUPERADMIN', 'CLINIC_OWNER', 'CLINIC_STAFF', 'PRACTITIONER']
  if (!allowedRoles.includes(prismaUser.role)) {
    redirect('/login?error=unauthorized')
  }

  return prismaUser
}
