import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Paths that are never localized: API, Next internals, and asset files.
 */
function isExcludedPath(pathname: string): boolean {
  return (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt" ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/books/") ||
    pathname.startsWith("/og/")
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isExcludedPath(pathname)) {
    return NextResponse.next();
  }

  // English is served under the visible /en prefix and maps directly to [lang]=en.
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return NextResponse.next();
  }

  // Arabic is the default and is served at the root. Internally rewrite to /ar/*
  // so the [lang] segment resolves, while keeping the visible URL at the root.
  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? "/ar" : `/ar${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    /*
     * Match all paths except Next internals and static files so that the
     * locale rewrite runs where needed.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
