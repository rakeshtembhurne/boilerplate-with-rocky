import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { headers } from "next/headers"

// Proxy always runs on Node.js runtime - no explicit runtime needed

export default async function proxy(request: NextRequest) {
  // Get session using betterAuth
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const { pathname } = request.nextUrl

  // Protect admin routes - require ADMIN role
  if (pathname.startsWith("/admin")) {
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.redirect(new URL("/auth/sign-in", request.url))
    }
  }

  // Protect protected routes - require authentication
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/protected")) {
    if (!session?.user) {
      const signInUrl = new URL("/auth/sign-in", request.url)
      signInUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(signInUrl)
    }
  }

  // Redirect authenticated users from auth pages
  if (
    pathname.startsWith("/auth") &&
    pathname !== "/auth/sign-in" &&
    pathname !== "/auth/sign-up" &&
    pathname !== "/auth/forgot-password" &&
    pathname !== "/auth/reset-password" &&
    pathname !== "/auth/verify-email"
  ) {
    if (session?.user) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  // Redirect authenticated users from sign-in/sign-up pages
  if (pathname === "/auth/sign-in" || pathname === "/auth/sign-up") {
    if (session?.user) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  // Allow access to public routes
  return NextResponse.next()
}

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
