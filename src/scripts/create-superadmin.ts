
import { createClient } from '@supabase/supabase-js'
import { PrismaClient, UserRole } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2] || 'admin@dentaflow.ca'
  const password = process.argv[3] || 'DentaFlow2026!'

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase credentials in .env")
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  console.log(`Creating SuperAdmin in Supabase Auth: ${email}...`)
  
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  })

  if (authError) {
    if (authError.message.includes('already registered')) {
      console.log("User already exists in Supabase. Attempting to sync with Prisma...")
      // Get the existing user's ID
      const { data: listData, error: listError } = await supabase.auth.admin.listUsers()
      const existingUser = listData?.users.find(u => u.email === email)
      if (!existingUser) throw new Error("Could not find existing user ID")
      
      await syncPrisma(existingUser.id, email)
    } else {
      throw authError
    }
  } else {
    console.log("Supabase user created successfully.")
    await syncPrisma(authData.user.id, email)
  }

  console.log("\n-------------------------------------------")
  console.log("ACCÈS SUPERADMIN CRÉÉ")
  console.log(`Email: ${email}`)
  console.log(`Password: ${password}`)
  console.log("-------------------------------------------")
}

async function syncPrisma(authId: string, email: string) {
  console.log(`Syncing with Prisma: ${email} (authId: ${authId})...`)
  
  await prisma.user.upsert({
    where: { email },
    update: {
      authId,
      role: UserRole.SUPERADMIN
    },
    create: {
      authId,
      email,
      name: 'Platform Administrator',
      role: UserRole.SUPERADMIN
    }
  })
  
  console.log("Prisma record synchronized.")
}

main()
  .catch(e => console.error("Error:", e))
  .finally(async () => await prisma.$disconnect())
