import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/middleware";

function isAdminPath(path: string) {
  return (
    path === "/admin" ||
    path.startsWith("/admin/") ||
    path === "/superadmin" ||
    path.startsWith("/superadmin/") ||
    path.startsWith("/admin-area")
  );
}

function applySecurityHeaders(response: NextResponse, isProduction: boolean) {
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()",
  );
  if (isProduction) {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
  }
}

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get("host") || "";
  const { pathname } = url;
  const isProduction = process.env.NODE_ENV === "production";

  // 1. Détection du sous-domaine (Tenant)
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

  // 2. Détection de la Locale
  const locales = ["fr", "en"];
  const firstSegment = pathname.split("/")[1];
  const locale = locales.includes(firstSegment) ? firstSegment : "fr";
  const pathWithoutLocale = locales.includes(firstSegment)
    ? pathname.replace(`/${firstSegment}`, "") || "/"
    : pathname;

  // 3. Routage interne
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

  // 4. Construire la réponse finale (rewrite)
  // On la construit avant updateSession pour que les cookies Supabase atterrissent directement dessus.
  const finalResponse = NextResponse.rewrite(new URL(finalTargetPath, request.url));

  // 5. Rafraîchir la session Supabase — les cookies sont injectés dans finalResponse
  const user = await updateSession(request, finalResponse);

  // 6. Protection des routes admin/superadmin — redirige avec returnUrl pour reprendre après login
  if (isAdminPath(pathWithoutLocale) && !user) {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set("returnUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 7. Headers de sécurité HTTP
  applySecurityHeaders(finalResponse, isProduction);

  // 8. Injection des headers métier
  finalResponse.headers.set("x-locale", locale);
  const tenantSlug = isCustomDomain ? host : subdomain;
  if (tenantSlug) {
    finalResponse.headers.set("x-tenant-slug", tenantSlug);
  }

  return finalResponse;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon.png|logo.png|demo|marketing|manifest.webmanifest|manifest.json|sw.js|offline).*)",
  ],
};
