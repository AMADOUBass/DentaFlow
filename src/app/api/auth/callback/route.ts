import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Handles Supabase magic link and email confirmation redirects.
// Supabase sends users here after clicking their email link with a `code` query param.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/admin-area/admin/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Redirect to the intended destination after successful auth
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Something went wrong — send to login with an error flag
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
