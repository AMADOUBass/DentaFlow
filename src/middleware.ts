import { updateSession } from '@/lib/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'

const ROOT_DOMAIN = 'dentaflow.ca'
const ADMIN_SUBDOMAIN = 'admin'
const LOCALES = ['fr', 'en']
const DEFAULT_LOCALE = 'fr'

/**
 * Middleware de routing multi-tenant + i18n (/fr, /en) pour DentaFlow
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

  // 2. LOGIQUE I18N (Extraction de la locale de l'URL)
  const pathnameSegments = pathname.split('/')
  const urlLocale = pathnameSegments[1]
  const isLocalePresent = LOCALES.includes(urlLocale)
  
  // S'il n'y a pas de langue dans l'URL, on redirige vers la langue par défaut (/fr/...)
  if (!isLocalePresent) {
    const redirectUrl = new URL(`/${DEFAULT_LOCALE}${pathname === '/' ? '' : pathname}`, request.url)
    // On garde les search params
    redirectUrl.search = url.search
    return NextResponse.redirect(redirectUrl)
  }

  // On extrait le reste du chemin (sans le segment de locale)
  const locale = urlLocale
  const actualPath = '/' + pathnameSegments.slice(2).join('/')

  // 3. LOGIQUE DE DÉCISION (Multi-tenant)
  let slug: string | null = null
  let isAdmin = false
  let isMarketing = false

  // Cas spécial Login (Partagé)
  if (actualPath.startsWith('/login')) {
     isMarketing = true
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
    } else {
      // 3.B TRUE CUSTOM DOMAIN LOOKUP
      // If we are here, it's a domain NOT ending in .dentaflow.ca
      try {
        // We call our internal API to get the slug for this custom domain
        // In production, we should handle this via Vercel Edge Config or Redis for speed
        const lookupUrl = new URL(`/api/tenant/lookup?domain=${pureHostname}`, request.url)
        const response = await fetch(lookupUrl)
        if (response.ok) {
           const data = await response.json()
           slug = data.slug
        } else {
           // Fallback to marketing if domain not found
           isMarketing = true
        }
      } catch (error) {
        console.error('[MW_CUSTOM_DOMAIN_ERROR]', error)
        isMarketing = true
      }
    }
  }

  // 4. CONSTRUCTION DU CHEMIN DE RÉÉCRITURE INTERNE
  let targetPath = ''
  
  if (isAdmin) {
    targetPath = `/admin-area/admin${actualPath === '/' ? '' : actualPath}`
  } else if (slug) {
    targetPath = `/public-site/${slug}${actualPath === '/' ? '' : actualPath}`
  } else {
    targetPath = `/marketing-site${actualPath === '/' ? '' : actualPath}`
  }

  // 5. RÉÉCRITURE AVEC HEADERS (Locale + Tenant)
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-locale', locale)
  if (slug) requestHeaders.set('x-tenant-slug', slug)
  
  url.pathname = targetPath
  const response = NextResponse.rewrite(url, {
    request: {
      headers: requestHeaders,
    }
  })

  // Headers de diagnostic
  response.headers.set('x-dentaflow-locale', locale)
  response.headers.set('x-dentaflow-rewrite', targetPath)
  
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
