import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "growth_session";

const publicPaths = ["/login", "/api/auth"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname === "/" ||
    publicPaths.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(COOKIE_NAME);
  if (!cookie) {
    const slug = pathname.split("/")[1];
    return NextResponse.redirect(
      new URL(`/login/${slug || "volta"}`, request.url)
    );
  }

  try {
    const data = JSON.parse(
      Buffer.from(cookie.value, "base64").toString("utf-8")
    );
    const slug = pathname.split("/")[1];
    if (data.slug !== slug) {
      return NextResponse.redirect(new URL(`/login/${slug}`, request.url));
    }
  } catch {
    const slug = pathname.split("/")[1];
    return NextResponse.redirect(
      new URL(`/login/${slug || "volta"}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
