import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/shared/lib/supabase/server';

/**
 * OAuth 콜백 처리 API
 * 소셜 로그인 후 리디렉션되는 API 엔드포인트
 * @route GET /api/auth/callback
 */
export async function GET(request: NextRequest) {
  try {
    console.log('==== OAuth 콜백 처리 시작 ====');

    // URL에서 코드와 상태 추출
    const requestUrl = new URL(request.url);
    console.log('요청 URL:', request.url);

    const code = requestUrl.searchParams.get('code');
    console.log('인증 코드 존재 여부:', !!code);

    if (!code) {
      console.error('인증 코드가 없습니다.');
      return NextResponse.redirect(
        new URL(
          '/sign-in?error=auth_callback_error&reason=no_code',
          request.url,
        ),
      );
    }

    console.log('Supabase 클라이언트 생성 시작');
    // Supabase 클라이언트 생성
    const supabase = await createServerSupabaseClient();
    console.log('Supabase 클라이언트 생성 완료');

    // 현재 쿠키 상태 확인
    console.log('현재 요청의 쿠키:');
    request.cookies.getAll().forEach((cookie) => {
      console.log(`${cookie.name}: ${cookie.value.substring(0, 30)}...`);
    });

    console.log('OAuth 세션 교환 시작');
    // OAuth 세션 교환
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('OAuth 콜백 처리 오류:', error);
      return NextResponse.redirect(
        new URL(
          '/sign-in?error=auth_callback_error&reason=exchange_failed',
          request.url,
        ),
      );
    }

    console.log(
      '세션 교환 성공, 세션 ID:',
      data.session?.access_token ? '있음' : '없음',
    );

    // 인증 성공 후 리디렉션
    console.log('인증 성공, 리디렉션: /');
    return NextResponse.redirect(new URL('/', request.url));
  } catch (error: any) {
    console.error('OAuth 콜백 처리 중 예외 발생:', error);
    return NextResponse.redirect(
      new URL(
        `/sign-in?error=auth_callback_error&reason=${encodeURIComponent(error.message || 'unknown')}`,
        request.url,
      ),
    );
  } finally {
    console.log('==== OAuth 콜백 처리 종료 ====');
  }
}
