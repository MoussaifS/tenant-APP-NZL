import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'ar', 'es', 'zh'];
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
  const { pathname, searchParams, search } = request.nextUrl;
  
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
  
  // Detect Next.js internal requests that should not be redirected
  // Check both searchParams and the raw search string to catch RSC requests
  const hasRSCParam = searchParams.has('_rsc') || search.includes('_rsc=');
  const isPrefetch = request.headers.get('purpose') === 'prefetch' || 
                     request.headers.get('x-middleware-prefetch') === '1' ||
                     request.headers.get('x-nextjs-data') === '1';
  const isNextDataRequest = pathname.includes('/_next/data') || 
                           request.headers.get('x-nextjs-router') === 'app';
  const isInternalRequest = hasRSCParam || isPrefetch || isNextDataRequest;
  
  // Check authentication status from cookies (for SSR)
  const isAuthenticated = request.cookies.get('isAuthenticated')?.value === 'true';
  
  // For Next.js internal requests (RSC, prefetch, etc.), skip ALL redirects entirely
  // These are data fetching requests and should not trigger navigation redirects
  // This prevents the 307 redirect issue that occurs randomly across all locales
  if (isInternalRequest) {
    return NextResponse.next();
  }
  
  // Only apply authentication redirects for actual navigation requests
  // If user is not authenticated and not on login page, redirect to login
  if (!isAuthenticated && !isLoginPage) {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  // IMPORTANT: Don't redirect authenticated users away from login page in middleware
  // Let the client-side handle this redirect to avoid conflicts with RSC requests
  // The LoginPage component already has useEffect to handle this redirect client-side
  // Removing this server-side redirect prevents the 307 redirect loop issue

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico).*)',
  ],
};