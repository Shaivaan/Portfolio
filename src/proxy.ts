import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";

// Early redirect for /admin based on the session cookie alone (no DB).
// Pages and Server Actions still verify with requireAdmin().
export async function proxy(request: NextRequest) {
  const isLoginPage = request.nextUrl.pathname === "/admin/login";
  const loggedIn = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);

  if (!loggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", request.nextUrl));
  }
  if (loggedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/admin", request.nextUrl));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
