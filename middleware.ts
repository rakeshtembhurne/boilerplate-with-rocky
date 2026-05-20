import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/admin", "/settings"]

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get all cookies
  const cookies = request.cookies.getAll()
  
  // better-auth uses session_token cookie
  const sessionCookie = cookies.find(c => c.name.includes("session_token"))
  
  const isAuthenticated = !!sessionCookie?.value

  // If on protected route and not authenticated, redirect to sign-in
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !isAuthenticated) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|_next).*)",
  ],
}
