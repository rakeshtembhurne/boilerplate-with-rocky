import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication.
const protectedRoutes = ["/dashboard", "/admin", "/items"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Coarse gate only: better-auth sets a `*.session_token` cookie. Real
  // authorization is enforced inside Server Actions and route handlers.
  const isAuthenticated = request.cookies
    .getAll()
    .some((cookie) => cookie.name.includes("session_token") && cookie.value);

  if (
    protectedRoutes.some((route) => pathname.startsWith(route)) &&
    !isAuthenticated
  ) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*|_next).*)"],
};
