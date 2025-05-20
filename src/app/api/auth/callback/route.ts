import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/shared/lib/supabase/server';

/**
 * OAuth 및 이메일 인증 콜백 처리 API
 * 소셜 로그인 또는 이메일 인증 후 리디렉션되는 API 엔드포인트
 * @route GET /api/auth/callback
 */
export async function GET(request: NextRequest) {
  try {
    console.log('==== 인증 콜백 처리 시작 ====');

    // URL에서 코드와 파라미터 추출
    const requestUrl = new URL(request.url);
    console.log('요청 URL:', request.url);

    const code = requestUrl.searchParams.get('code');
    const error = requestUrl.searchParams.get('error');
    const errorCode = requestUrl.searchParams.get('error_code');
    const type = requestUrl.searchParams.get('type') || 'oauth'; // 기본값은 oauth

    console.log('인증 코드 존재 여부:', !!code);
    console.log('에러 존재 여부:', !!error);
    console.log('인증 타입:', type);

    // 에러 체크
    if (error) {
      console.error('인증 콜백 에러:', error, errorCode);
      return NextResponse.redirect(
        new URL(
          `/auth/callback?error=${error}&error_code=${errorCode || ''}&error_description=${requestUrl.searchParams.get('error_description') || ''}`,
          request.url,
        ),
      );
    }

    // 인증 코드 체크
    if (!code) {
      console.error('인증 코드가 없습니다.');
      return NextResponse.redirect(
        new URL(
          '/auth/callback?error=auth_callback_error&reason=no_code',
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

    console.log('세션 교환 시작');
    // 인증 코드로 세션 교환
    const { data, error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('세션 교환 오류:', exchangeError);
      return NextResponse.redirect(
        new URL(
          `/auth/callback?error=auth_callback_error&error_code=${exchangeError.status || 'exchange_failed'}&error_description=${encodeURIComponent(exchangeError.message)}`,
          request.url,
        ),
      );
    }

    console.log(
      '세션 교환 성공, 세션 ID:',
      data.session?.access_token ? '있음' : '없음',
    );

    // 인증 성공 후 리디렉션
    console.log('인증 성공, 리디렉션: /auth/callback');
    return NextResponse.redirect(new URL('/auth/callback', request.url));
  } catch (error: any) {
    console.error('인증 콜백 처리 중 예외 발생:', error);
    return NextResponse.redirect(
      new URL(
        `/auth/callback?error=auth_callback_error&error_description=${encodeURIComponent(error.message || 'unknown')}`,
        request.url,
      ),
    );
  } finally {
    console.log('==== 인증 콜백 처리 종료 ====');
  }
}
