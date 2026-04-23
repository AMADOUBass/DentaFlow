import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // 1. Refresh Supabase session and get the initial response
  let response = await updateSession(request);

  const url = request.nextUrl.clone();
  const host = request.headers.get("host") || "";
  const { pathname } = url;

  // 2. Détection du sous-domaine (Tenant)
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";
  let subdomain = "";
  let isCustomDomain = false;

  if (host === rootDomain || host === `www.${rootDomain}`) {
    subdomain = "";
  } else if (host.endsWith(`.${rootDomain}`)) {
    subdomain = host.replace(`.${rootDomain}`, "");
  } else if (host !== "localhost:3000" && !host.includes(".localhost:3000")) {
    isCustomDomain = true;
  } else if (host.includes(".localhost:3000")) {
    subdomain = host.split(".localhost:3000")[0];
  }

  // 3. Détection de la Locale
  const locales = ["fr", "en"];
  const firstSegment = pathname.split("/")[1];
  const locale = locales.includes(firstSegment) ? firstSegment : "fr";
  const pathWithoutLocale = locales.includes(firstSegment)
    ? pathname.replace(`/${firstSegment}`, "") || "/"
    : pathname;

  // 4. Protection des routes Admin/Superadmin
  // Note: On laisse getAdminUser() faire le check de rôle fin, mais on bloque les non-connectés ici.
  // Cependant, pour ne pas casser le flow de login, on ignore /login et /register.
  if (pathWithoutLocale.startsWith("/admin-area") || pathWithoutLocale.startsWith("/admin") || pathWithoutLocale.startsWith("/superadmin")) {
     // Si updateSession n'a pas trouvé d'user (on pourrait repasser par supabase.auth.getUser() ici si besoin)
     // Mais pour simplifier et éviter de re-fetcher, on se fie à getAdminUser dans les pages.
     // Si on veut vraiment bloquer ici, il faut que updateSession retourne l'user.
  }

  // 5. Routage interne
  let targetPath = pathWithoutLocale;

  if (pathWithoutLocale === "/admin" || pathWithoutLocale.startsWith("/admin/")) {
    targetPath = pathWithoutLocale.replace(/^\/admin/, "/admin-area/admin");
  } else if (pathWithoutLocale === "/superadmin" || pathWithoutLocale.startsWith("/superadmin/")) {
    targetPath = pathWithoutLocale.replace(/^\/superadmin/, "/admin-area/superadmin");
  } else if (pathWithoutLocale.startsWith("/admin-area")) {
    targetPath = pathWithoutLocale;
  } else if ((subdomain && subdomain !== "www") || isCustomDomain) {
    const tenantIdentifier = isCustomDomain ? host : subdomain;
    const cleanPath = pathWithoutLocale === "/" ? "" : pathWithoutLocale;
    targetPath = `/public-site/${tenantIdentifier}${cleanPath}`;
  } else if (pathWithoutLocale === "/offline") {
    targetPath = pathname;
  } else {
    const cleanPath = pathWithoutLocale === "/" ? "" : pathWithoutLocale;
    targetPath = `/marketing-site${cleanPath}`;
  }

  const finalTargetPath = targetPath.startsWith("/") ? targetPath : `/${targetPath}`;
  
  // 6. Créer la réponse réécrite en conservant les cookies de updateSession
  const finalResponse = NextResponse.rewrite(new URL(finalTargetPath, request.url));
  
  // Copier les headers et cookies de la réponse de updateSession
  response.headers.forEach((value, key) => {
    finalResponse.headers.set(key, value);
  });

  // Injection des headers métier
  finalResponse.headers.set("x-locale", locale);
  const tenantSlug = isCustomDomain ? host : subdomain;
  if (tenantSlug) {
    finalResponse.headers.set("x-tenant-slug", tenantSlug);
  }

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
