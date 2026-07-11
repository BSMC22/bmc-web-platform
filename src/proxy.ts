import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale, isLocale } from "@/lib/i18n-config";
import { updateSession } from "@/lib/supabase/middleware";

// Path segment (after the locale) that gates the Inspector Portal.
const PORTAL_SEGMENT = "portal";
const PORTAL_LOGIN_SEGMENT = "portal/login";

// Top-level segments for the new "Blueseas OS" module shell (Executive,
// Operations, Finance, Shareholder, Client + the shared login). These live
// outside the [lang] tree by design (single-language internal tools), so
// they must bypass the locale-prefix redirect below entirely. The Inspector
// Portal hasn't moved into this shell yet - it stays under [lang]/portal.
const APP_SHELL_SEGMENTS = ["login", "executive", "operations", "finance", "shareholder", "client"];

// Picks the best supported locale from the request's Accept-Language header.
// Falls back to English (the site's default) when no preference matches.
function getPreferredLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get("accept-language");
  if (!acceptLanguage) return defaultLocale;

  const ranked = acceptLanguage
    .split(",")
    .map((entry) => {
      const [rawTag, rawQ] = entry.trim().split(";q=");
      const q = rawQ ? parseFloat(rawQ) : 1;
      return { tag: rawTag.trim().toLowerCase(), q: Number.isNaN(q) ? 1 : q };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const primary = tag.split("-")[0];
    if (isLocale(primary)) return primary;
  }

  return defaultLocale;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Refresh the Supabase session cookie (if any) on every request so tokens
  // stay valid across navigations. Also gives us a verified `user` to gate
  // /portal routes with, without a separate network round-trip later.
  const { supabaseResponse, user } = await updateSession(request);

  // Redirect responses are brand-new NextResponse objects, so any refreshed
  // auth cookies that updateSession() just set on supabaseResponse must be
  // copied over manually — otherwise the browser keeps sending a stale
  // token on the next request, which can make `user` flip-flop between
  // requests and bounce /portal <-> /portal/login in a loop.
  const redirect = (url: URL) => {
    const response = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      response.cookies.set(cookie);
    });
    return response;
  };

  const firstSegment = pathname.split("/").filter(Boolean)[0];
  const isAppShellRoute = firstSegment ? APP_SHELL_SEGMENTS.includes(firstSegment) : false;

  if (isAppShellRoute) {
    const isLoginRoute = firstSegment === "login";
    if (!isLoginRoute && !user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return redirect(url);
    }
    return supabaseResponse;
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (!pathnameHasLocale) {
    const locale = getPreferredLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    return redirect(url);
  }

  const segments = pathname.split("/").filter(Boolean);
  const locale = segments[0];
  const restPath = segments.slice(1).join("/");

  const isPortalRoute =
    restPath === PORTAL_SEGMENT || restPath.startsWith(`${PORTAL_SEGMENT}/`);
  const isLoginRoute = restPath === PORTAL_LOGIN_SEGMENT;

  // Unauthenticated visitors trying to reach the portal get bounced to login.
  if (isPortalRoute && !isLoginRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/${PORTAL_LOGIN_SEGMENT}`;
    return redirect(url);
  }

  // Already-authenticated inspectors hitting /login get sent to the dashboard.
  if (isLoginRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/${PORTAL_SEGMENT}`;
    return redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next|api|favicon.ico|.*\\..*).*)",
  ],
};
