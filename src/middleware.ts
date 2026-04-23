import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple in-memory rate limiting for demo/small scale
// In production, use Upstash Redis or similar
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // 100 requests per minute

export async function middleware(request: NextRequest) {
  // Rate limiting logic
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
  const now = Date.now();
  const rateLimit = rateLimitMap.get(ip) || { count: 0, lastReset: now };

  if (now - rateLimit.lastReset > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
  } else {
    rateLimit.count++;
    if (rateLimit.count > MAX_REQUESTS) {
      return new NextResponse("Too Many Requests", { status: 429 });
    }
    rateLimitMap.set(ip, rateLimit);
  }

  const url = request.nextUrl.clone();
  const host = request.headers.get("host") || "";
  const { pathname } = url;

  // 1. Détection du sous-domaine (Tenant)
  // On ignore localhost et www
  const searchParams = url.searchParams.toString();
  const path = `${pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";
  
  let subdomain = "";
  let isCustomDomain = false;

  // Détection du tenant (sous-domaine ou domaine personnalisé)
  if (host === rootDomain || host === `www.${rootDomain}`) {
    // Cas : Site Principal (marketing)
    subdomain = "";
  } else if (host.endsWith(`.${rootDomain}`)) {
    // Cas : Sous-domaine (ex: demo.oros.homes)
    subdomain = host.replace(`.${rootDomain}`, "");
  } else if (host !== "localhost:3000" && !host.includes(".localhost:3000")) {
    // Cas : Domaine personnalisé (ex: clinique.oros.ca)
    isCustomDomain = true;
  } else if (host.includes(".localhost:3000")) {
    // Cas : Localhost avec sous-domaine
    subdomain = host.split(".localhost:3000")[0];
  }

  // 2. Détection de la Locale (fr/en)
  const locales = ["fr", "en"];
  const firstSegment = pathname.split("/")[1];
  const locale = locales.includes(firstSegment) ? firstSegment : "fr";

  // On nettoie le chemin de la locale pour le routage interne si elle est présente
  const pathWithoutLocale = locales.includes(firstSegment)
    ? pathname.replace(`/${firstSegment}`, "") || "/"
    : pathname;

  // 3. Préparer la réponse
  let targetPath = pathWithoutLocale;

  // LOGIQUE DE ROUTAGE GLOBALE :
  if (
    pathWithoutLocale === "/admin" ||
    pathWithoutLocale.startsWith("/admin/")
  ) {
    // Alias /admin -> /admin-area/admin
    targetPath = pathWithoutLocale.replace(/^\/admin/, "/admin-area/admin");
  } else if (
    pathWithoutLocale === "/superadmin" ||
    pathWithoutLocale.startsWith("/superadmin/")
  ) {
    // Alias /superadmin -> /admin-area/superadmin
    targetPath = pathWithoutLocale.replace(
      /^\/superadmin/,
      "/admin-area/superadmin",
    );
  } else if (pathWithoutLocale.startsWith("/admin-area")) {
    // Chemin physique direct
    targetPath = pathWithoutLocale;
  } else if ((subdomain && subdomain !== "www") || isCustomDomain) {
    // Cas : Clinique (demo.localhost ou domaine.ca) -> public-site/[tenant]
    const tenantIdentifier = isCustomDomain ? host : subdomain;
    const cleanPath = pathWithoutLocale === "/" ? "" : pathWithoutLocale;
    targetPath = `/public-site/${tenantIdentifier}${cleanPath}`;
  } else if (pathWithoutLocale === "/offline") {
    targetPath = pathname;
  } else {
    // Cas : Site Marketing -> marketing-site
    const cleanPath = pathWithoutLocale === "/" ? "" : pathWithoutLocale;
    targetPath = `/marketing-site${cleanPath}`;
  }

  // 4. Exécuter la réécriture interne (Invisible pour l'utilisateur)
  // Utilisation d'un chemin relatif pour éviter les problèmes de résolution de domaine
  const finalTargetPath = targetPath.startsWith("/")
    ? targetPath
    : `/${targetPath}`;
  const finalResponse = NextResponse.rewrite(
    new URL(finalTargetPath, request.url),
  );

  // Injection des headers pour le code applicatif
  finalResponse.headers.set("x-locale", locale);
  if (subdomain) finalResponse.headers.set("x-tenant-slug", subdomain);

  return finalResponse;
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
    "/((?!api|_next/static|_next/image|favicon.ico|icon.png|logo.png|demo|marketing|manifest.webmanifest|manifest.json|sw.js|offline).*)",
  ],
};
