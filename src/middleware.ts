import { updateSession } from '@/lib/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'

const ROOT_DOMAIN = 'dentaflow.ca'
const ADMIN_SUBDOMAIN = 'admin'

/**
 * Middleware de routing multi-tenant pour DentaFlow
 * Version DEBUG : Normalisation des chemins et headers de diagnostic
 */
export default async function middleware(request: NextRequest) {
  // 0. Mise à jour de la session Supabase
  await updateSession(request)

  const url = request.nextUrl
  const hostname = request.headers.get('host') ?? ''
  
  // Normalisation du hostname
  const pureHostname = hostname.split(':')[0]
  const isLocalhost = pureHostname.includes('localhost') || pureHostname.includes('127.0.0.1')
  const isVercel = pureHostname.endsWith('.vercel.app')
  const pathname = url.pathname

  // 1. GARDE CONTRE LA RÉCURSION & FICHIERS & API
  if (
    pathname.startsWith('/marketing-site') || 
    pathname.startsWith('/public-site') || 
    pathname.startsWith('/admin-area') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // 2. LOGIQUE DE DÉCISION
  let slug: string | null = null
  let isAdmin = false
  let isMarketing = false

  // Cas spécial Login (Partagé)
  if (pathname.startsWith('/login')) {
     isMarketing = true // On le traite via le dossier marketing
  } else if (isLocalhost) {
    const parts = pureHostname.split('.')
    if (parts.length > 1) {
      if (parts[0] === ADMIN_SUBDOMAIN) isAdmin = true
      else slug = parts[0]
    } else {
      isMarketing = true
    }
  } else {
    // Production
    if (pureHostname === ROOT_DOMAIN || pureHostname === `www.${ROOT_DOMAIN}` || isVercel) {
      isMarketing = true
    } else if (pureHostname === `${ADMIN_SUBDOMAIN}.${ROOT_DOMAIN}`) {
      isAdmin = true
    } else if (pureHostname.endsWith(`.${ROOT_DOMAIN}`)) {
      slug = pureHostname.replace(`.${ROOT_DOMAIN}`, '')
    }
  }

  // 3. CONSTRUCTION DU CHEMIN DE RÉÉCRITURE (SANS DOUBLE SLASH)
  let targetPath = ''
  
  if (isAdmin) {
    targetPath = `/admin-area/admin${pathname === '/' ? '' : pathname}`
  } else if (slug) {
    targetPath = `/public-site/${slug}${pathname === '/' ? '' : pathname}`
  } else if (isMarketing) {
    targetPath = `/marketing-site${pathname === '/' ? '' : pathname}`
  } else {
    // Fallback ultime vers le site marketing
    targetPath = `/marketing-site${pathname === '/' ? '' : pathname}`
  }

  // 4. RÉÉCRITURE AVEC HEADERS DE DEBUG
  const requestHeaders = new Headers(request.headers)
  if (slug) requestHeaders.set('x-tenant-slug', slug)
  
  url.pathname = targetPath
  const response = NextResponse.rewrite(url, {
    request: {
      headers: requestHeaders,
    }
  })

  // On ajoute le header pour debug visible dans les outils de dev (Network)
  response.headers.set('x-dentaflow-rewrite', targetPath)
  response.headers.set('x-dentaflow-hostname', pureHostname)
  
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
