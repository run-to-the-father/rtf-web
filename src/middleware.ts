import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * 미들웨어에서 인증 상태를 확인하고 보호된 경로에 대한 접근을 제어합니다.
 * - 인증되지 않은 사용자가 /chat, /settings 등의 보호된 경로에 접근하면 /login으로 리디렉션
 * - 인증된 사용자가 /login, /sign-up 등의 인증 페이지에 접근하면 /chat으로 리디렉션
 */
export async function middleware(request: NextRequest) {
  console.log(`==== 미들웨어 실행: ${request.nextUrl.pathname} ====`);

  try {
    const res = NextResponse.next();

    if (request.nextUrl.pathname.startsWith('/api/auth/callback')) {
      console.log('콜백 경로는 미들웨어에서 처리하지 않습니다.');
      return res;
    }

    // Supabase 클라이언트 생성
    console.log('미들웨어 Supabase 클라이언트 생성');
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            const cookie = request.cookies.get(name);
            console.log(`쿠키 조회: ${name} = ${cookie ? '있음' : '없음'}`);
            return cookie?.value;
          },
          set(name, value, options) {
            console.log(`쿠키 설정: ${name} = 값 있음`);
            res.cookies.set({ name, value, ...options });
          },
          remove(name, options) {
            console.log(`쿠키 삭제: ${name}`);
            res.cookies.delete({ name, ...options });
          },
        },
      },
    );

    // 현재 세션 확인
    console.log('세션 확인');
    const {
      data: { session },
    } = await supabase.auth.getSession();
    console.log(`세션 상태: ${session ? '로그인됨' : '로그아웃됨'}`);

    // 현재 URL 경로
    const { pathname } = request.nextUrl;

    // 보호된 경로 목록
    const protectedRoutes = ['/chat', '/settings', '/profile'];
    const authRoutes = ['/login', '/sign-in', '/sign-up', '/register'];

    // 보호된 경로에 접근하려는 경우 인증 확인
    if (
      protectedRoutes.some((route) => pathname.startsWith(route)) &&
      !session
    ) {
      console.log('인증되지 않은 사용자가 보호된 경로에 접근 시도');
      const redirectUrl = new URL('/sign-in', request.url);
      return NextResponse.redirect(redirectUrl);
    }

    // 이미 인증된 사용자가 인증 페이지에 접근하려는 경우
    if (authRoutes.some((route) => pathname === route) && session) {
      console.log('인증된 사용자가 인증 페이지에 접근 시도');
      const redirectUrl = new URL('/', request.url);
      return NextResponse.redirect(redirectUrl);
    }

    console.log('미들웨어 처리 완료, 다음 단계로 진행');
    return res;
  } catch (error) {
    console.error('미들웨어 오류:', error);
    // 오류 발생 시에도 요청 계속 진행
    return NextResponse.next();
  }
}

// 미들웨어가 실행될 경로 설정
export const config = {
  matcher: [
    // 콜백 경로 제외
    '/((?!api/auth/callback).*)',
    // 보호된 경로
    '/chat/:path*',
    '/settings/:path*',
    '/profile/:path*',
    // 인증 경로
    '/login',
    '/sign-in',
    '/sign-up',
    '/register',
  ],
};
