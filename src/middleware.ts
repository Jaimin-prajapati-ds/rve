import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes (except /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const session = request.cookies.get('admin_session');
    const secret = process.env.ADMIN_SESSION_SECRET;

    // Hardened Security: If secret is missing or session doesn't match, redirect to login
    // This prevents access if the environment variable is accidentally removed
    const isAuthenticated = session && secret && session.value === secret;

    if (!isAuthenticated) {
      const loginUrl = new URL('/admin/login', request.url);
      // Optional: Add the current path as a return URL
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
