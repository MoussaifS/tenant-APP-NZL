import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'ar'];
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // Handle locale redirect
  if (!pathnameHasLocale) {
    const locale = request.cookies.get('NEXT_LOCALE')?.value || defaultLocale;
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  // Extract locale from pathname
  const pathSegments = pathname.split('/');
  const locale = pathSegments[1];
  
  // Check if user is trying to access login page
  const isLoginPage = pathname.includes('/login');
  
  // Check authentication status from cookies (for SSR)
  const isAuthenticated = request.cookies.get('isAuthenticated')?.value === 'true';
  
  // If user is not authenticated and not on login page, redirect to login
  if (!isAuthenticated && !isLoginPage) {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  // If user is authenticated and on login page, redirect to home
  if (isAuthenticated && isLoginPage) {
    const homeUrl = new URL(`/${locale}`, request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico).*)',
  ],
};