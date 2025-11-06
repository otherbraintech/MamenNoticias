import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Allow access to auth pages and public assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/auth') ||
    token
  ) {
    // If user is logged in and trying to access auth pages, redirect to dashboard
    if (token && pathname.startsWith('/auth')) {
      const url = req.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
    
    return NextResponse.next();
  }

  // Redirect to login if not authenticated and trying to access protected routes
  if (!token && (pathname.startsWith('/dashboard') || pathname.startsWith('/cursos'))) {
    const url = req.nextUrl.clone();
    url.pathname = '/auth/login';
    url.search = `callbackUrl=${encodeURIComponent(req.url)}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/cursos/:path*',
    '/auth/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

