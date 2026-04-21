import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const host = request.headers.get('host') || ''
  const { pathname } = url

  // 1. Détection du sous-domaine (Tenant)
  // On ignore localhost et www
  const searchParams = url.searchParams.toString()
  const path = `${pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`
  
  let subdomain = ''
  if (host.includes('.') && !host.includes('localhost:3000') && !host.startsWith('localhost')) {
     subdomain = host.split('.')[0]
  } else if (host.includes('.localhost:3000')) {
     subdomain = host.split('.localhost:3000')[0]
  }

  // 2. Détection de la Locale (fr/en)
  const locales = ['fr', 'en']
  const firstSegment = pathname.split('/')[1]
  const locale = locales.includes(firstSegment) ? firstSegment : 'fr'
  
  // On nettoie le chemin de la locale pour le routage interne si elle est présente
  const pathWithoutLocale = locales.includes(firstSegment) 
    ? pathname.replace(`/${firstSegment}`, '') || '/' 
    : pathname

  // 3. Préparer la réponse
  let targetPath = pathWithoutLocale

  // LOGIQUE DE ROUTAGE :
  if (subdomain && subdomain !== 'www') {
    // Cas : Clinique (demo.localhost) -> public-site/[tenant]
    // Utilisation d'un chemin explicite qui finit par / si on est à la racine du tenant
    const cleanPath = pathWithoutLocale === '/' ? '' : pathWithoutLocale
    targetPath = `/public-site/${subdomain}${cleanPath}`
  } else if (pathWithoutLocale.startsWith('/admin')) {
    // Cas : Espace Admin (Alias /admin -> /admin-area/admin)
    const adminPath = pathWithoutLocale.replace('/admin', '/admin-area/admin')
    targetPath = adminPath
  } else if (pathWithoutLocale.startsWith('/admin-area')) {
    // Cas : Administration (Chemin physique direct)
    targetPath = pathWithoutLocale
  } else {
    // Cas : Site Marketing -> marketing-site
    const cleanPath = pathWithoutLocale === '/' ? '' : pathWithoutLocale
    targetPath = `/marketing-site${cleanPath}`
  }

  // 4. Exécuter la réécriture interne (Invisible pour l'utilisateur)
  // On s'assure que l'URL cible est bien formée
  const urlToRewrite = new URL(targetPath === '' ? '/' : targetPath, request.url)
  const finalResponse = NextResponse.rewrite(urlToRewrite)
  
  // Injection des headers pour le code applicatif
  finalResponse.headers.set('x-locale', locale)
  if (subdomain) finalResponse.headers.set('x-tenant-slug', subdomain)

  return finalResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, icon.png, logo.png (static assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|icon.png|logo.png).*)',
  ],
}
