import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

async function createTestUser() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const email = 'proprio@demo.ca'
  const password = 'Password123!'

  console.log(`Attempting to create user: ${email}...`)

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (error) {
    if (error.message.includes('already exists')) {
      console.log('✅ User already exists in Supabase Auth.')
    } else {
      console.error('❌ Error creating user:', error.message)
    }
  } else {
    console.log('✅ User created successfully in Supabase Auth.')
  }
}

createTestUser()
