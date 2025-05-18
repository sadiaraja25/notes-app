import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authPages = ["/auth/login", "/auth/register"];
  const protectedPages = ["/create", "/bookmarks", "/settings", "/read"];
  
  const { pathname } = request.nextUrl;
  const isAuthPage = authPages.includes(pathname);
  const isProtectedPage = protectedPages.some(page => pathname.startsWith(page));
  
  const token = request.cookies.get("__session")?.value;

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/create/:path*",
    "/bookmarks/:path*",
    "/settings/:path*",
    "/read/:path*",
    "/auth/:path*",
  ],
};