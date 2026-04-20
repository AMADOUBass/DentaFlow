import { updateSession } from '@/lib/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'

const ROOT_DOMAIN = 'dentaflow.ca'
const ADMIN_SUBDOMAIN = 'admin'

/**
 * Middleware de routing multi-tenant pour DentaFlow
 * Version corrigée : Gestion unifiée des logins et prévention de récursion
 */
export default async function middleware(request: NextRequest) {
  // 0. Mise à jour de la session Supabase (essentiel pour l'Auth)
  await updateSession(request)

  const url = request.nextUrl
  const hostname = request.headers.get('host') ?? ''
  
  // Gestion localhost pour le développement
  const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1')
  const pureHostname = hostname.split(':')[0]
  const pathname = url.pathname

  // 1. GARDE CONTRE LA RÉCURSION & FICHIERS STATIQUES
  // Si on est déjà sur un chemin interne ou un fichier, on ne touche à rien
  if (
    pathname.startsWith('/marketing-site') || 
    pathname.startsWith('/public-site') || 
    pathname.startsWith('/admin-area') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.startsWith('/_next')
  ) {
    return NextResponse.next()
  }

  // 2. PRIORITÉ ABSOLUE : LES PAGES DE LOGIN
  // On centralise tous les logins sur le dossier marketing-site/login
  if (pathname.startsWith('/login')) {
    url.pathname = `/marketing-site${pathname}`
    return NextResponse.rewrite(url)
  }

  // 3. RÉSOLUTION DU DOMAINE (Admin, Tenant ou Marketing)
  let slug: string | null = null
  let isAdmin = false
  let isMarketing = false

  if (isLocalhost) {
    // En dev : demo.localhost:3000 -> slug = demo
    const parts = pureHostname.split('.')
    if (parts.length > 1) {
      if (parts[0] === ADMIN_SUBDOMAIN) {
        isAdmin = true
      } else {
        slug = parts[0]
      }
    } else {
      isMarketing = true
    }
  } else {
    // En production
    const isVercel = pureHostname.endsWith('.vercel.app')
    
    if (pureHostname === ROOT_DOMAIN || pureHostname === `www.${ROOT_DOMAIN}` || isVercel) {
      isMarketing = true
    } else if (pureHostname === `${ADMIN_SUBDOMAIN}.${ROOT_DOMAIN}`) {
      isAdmin = true
    } else if (pureHostname.endsWith(`.${ROOT_DOMAIN}`)) {
      slug = pureHostname.replace(`.${ROOT_DOMAIN}`, '')
    }
  }

  // 4. RÉÉCRITURE FINALE BASÉE SUR LA RÉSOLUTION
  
  // Sous-domaine Admin (admin.dentaflow.ca/* -> /admin-area/admin/*)
  if (isAdmin) {
    url.pathname = `/admin-area/admin${pathname}`
    return NextResponse.rewrite(url)
  }

  // Site Clinique (slug.dentaflow.ca/* -> /public-site/[slug]/*)
  if (slug) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-tenant-slug', slug)
    
    url.pathname = `/public-site/${slug}${pathname}`
    return NextResponse.rewrite(url, {
      request: {
        headers: requestHeaders,
      }
    })
  }

  // Site Marketing (Par défaut)
  url.pathname = `/marketing-site${pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
