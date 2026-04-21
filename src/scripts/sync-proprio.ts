import { PrismaClient, UserRole } from '@prisma/client'

const prisma = new PrismaClient()

async function sync() {
  const email = 'proprio@demo.ca'
  const authId = '739a11d7-e0ad-41f6-a0b7-7642652fb126'

  console.log(`🔍 Synchronisation de l'utilisateur ${email}...`)

  try {
    // 1. Trouver le tenant démo
    const tenant = await prisma.tenant.findUnique({
      where: { slug: 'demo' }
    })

    if (!tenant) {
      console.error("❌ Erreur : Le tenant 'demo' n'existe pas. Veuillez lancer 'npm run prisma db seed' d'abord.")
      return
    }

    // 2. Upsert de l'utilisateur
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        authId: authId,
        role: UserRole.CLINIC_OWNER,
        tenantId: tenant.id
      },
      create: {
        email,
        authId,
        name: 'Proprio Démo',
        role: UserRole.CLINIC_OWNER,
        tenantId: tenant.id
      }
    })

    console.log(`✅ Utilisateur synchronisé avec succès !`)
    console.log(`ID Prisma : ${user.id}`)
    console.log(`ID Auth (Supabase) : ${user.authId}`)
  } catch (error) {
    console.error(`❌ Erreur lors de la synchronisation :`, error)
  } finally {
    await prisma.$disconnect()
  }
}

sync()
