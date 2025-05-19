import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

// 인증이 필요한 경로 목록
const PROTECTED_ROUTES = ['/chat', '/upgrade-plan', '/settings'];

// 인증이 필요하지 않은 경로 목록 (로그인 상태에서 접근 불가)
const AUTH_ROUTES = ['/sign-in', '/sign-up', '/password'];

// 미들웨어에서 검사하지 않을 경로들 (API, auth 콜백 등)
const EXEMPTED_ROUTES = [
  '/api/auth/callback',
  '/api/auth/google',
  '/api/auth',
  '/auth/callback',
];

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // 미들웨어 처리에서 제외된 경로인 경우 즉시 통과
  const isExemptedRoute = EXEMPTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  if (isExemptedRoute) {
    console.log('미들웨어 예외 경로 통과:', pathname);
    return NextResponse.next();
  }

  // 정적 자산 경로 바로 통과
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  // API 요청은 권한 확인 없이 통과
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const res = NextResponse.next();

  // Supabase 클라이언트 생성
  const supabase = createMiddlewareClient({ req: request, res });

  // 현재 세션 확인
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  // 오류 발생 시 로깅하고 진행
  if (error) {
    console.error('미들웨어 세션 확인 오류:', error);
  }

  // 로그인 상태
  const isAuthenticated = !!session;

  console.log('Middleware 실행:', {
    path: pathname,
    query: search,
    isAuthenticated,
    sessionExists: !!session,
    userId: session?.user?.id,
  });

  // 인증이 필요한 경로에 접근하려는데 로그인이 안 된 경우
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtectedRoute && !isAuthenticated) {
    console.log('인증 필요한 페이지 접근 시도 - 로그인으로 리디렉트');
    const redirectUrl = new URL('/sign-in', request.url);
    redirectUrl.searchParams.set('redirectTo', pathname + search);
    return NextResponse.redirect(redirectUrl);
  }

  // 홈 페이지 접근 시 로그인 상태 확인
  if (pathname === '/' && !isAuthenticated) {
    console.log('홈 접근 - 로그인되지 않음, 로그인 페이지로 리디렉트');
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // 이미 로그인한 상태에서 인증 페이지에 접근하는 경우
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (isAuthRoute && isAuthenticated) {
    // URL에 redirectTo 파라미터가 있으면 해당 경로로 리다이렉트
    const redirectTo = request.nextUrl.searchParams.get('redirectTo');
    const targetUrl = redirectTo || '/';

    console.log(
      '이미 로그인된 상태에서 인증 페이지 접근 - 리다이렉트:',
      targetUrl,
    );
    return NextResponse.redirect(new URL(targetUrl, request.url));
  }

  return res;
}

// 미들웨어가 실행될 경로 설정 (인증 관련 경로와 보호된 경로)
export const config = {
  matcher: [
    '/',
    // 인증 관련 페이지
    '/sign-in/:path*',
    '/sign-up/:path*',
    '/password/:path*',
    // 보호된 페이지
    '/chat/:path*',
    '/upgrade-plan/:path*',
    '/settings/:path*',
  ],
};
