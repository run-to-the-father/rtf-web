import { NextResponse } from 'next/server';
import { supabase } from '@/shared/lib';

// Google OAuth 리다이렉트 처리
export async function GET(request: Request) {
  console.log('Google OAuth API 진입');

  try {
    // 현재 URL에서 기본 URL 생성
    const requestUrl = new URL(request.url);
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      `${requestUrl.protocol}//${requestUrl.host}`;

    // 항상 홈으로 리다이렉트
    const redirectTo = '/';

    console.log('OAuth 기본 URL:', baseUrl);
    const callbackUrl = `${baseUrl}/api/auth/callback`;
    console.log('OAuth 콜백 URL:', callbackUrl);
    console.log('최종 리다이렉트 URL:', redirectTo);

    // OAuth 설정 및 리디렉션
    console.log('Supabase signInWithOAuth 호출 중...');
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl,
        // 구글 OAuth 스코프 명시적 설정
        scopes: 'email profile',
        // offline 액세스를 위한 추가 파라미터
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
          // 디버깅용 상태 파라미터
          state: `oauth-${Date.now()}|redirectTo=/`,
        },
      },
    });

    if (error) {
      console.error('Google OAuth 오류:', error);
      return NextResponse.json(
        {
          error: '인증 처리 중 오류가 발생했습니다',
          details: error.message,
          success: false,
        },
        { status: 500 },
      );
    }

    if (!data?.url) {
      console.error('OAuth URL이 반환되지 않음');
      return NextResponse.json(
        {
          error: 'OAuth URL이 반환되지 않았습니다',
          success: false,
        },
        { status: 500 },
      );
    }

    // OAuth 제공자의 URL로 리다이렉트 (OAuth URL에 원래 redirectTo 정보 추가)
    const finalUrl = new URL(data.url);

    // 항상 홈으로 리다이렉트하도록 설정
    const originalState = finalUrl.searchParams.get('state') || '';
    finalUrl.searchParams.set('state', `${originalState}|redirectTo=/`);

    console.log('구글 OAuth URL로 리다이렉트:', finalUrl.toString());

    // 명시적인 헤더 설정으로 리다이렉트
    return new Response(null, {
      status: 302,
      headers: {
        Location: finalUrl.toString(),
        'Cache-Control': 'no-store, no-cache, max-age=0, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  } catch (error) {
    console.error('Google OAuth 처리 오류:', error);
    return NextResponse.json(
      {
        error: '서버 오류가 발생했습니다',
        details: error instanceof Error ? error.message : String(error),
        success: false,
      },
      { status: 500 },
    );
  }
}
