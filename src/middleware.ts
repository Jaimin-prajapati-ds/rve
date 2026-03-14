import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes (except /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const session = request.cookies.get('admin_session');
    const secret = process.env.ADMIN_SESSION_SECRET;

    // Hardened Security: If secret is missing, DENY access immediately.
    // This prevents "direct" open if the environment variables are not loaded.
    if (!secret) {
      console.warn('SECURITY_ALERT: ADMIN_SESSION_SECRET is missing. Access denied.');
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    const isAuthenticated = session && session.value === secret;

    if (!isAuthenticated) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
