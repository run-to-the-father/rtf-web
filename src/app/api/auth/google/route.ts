import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/shared/lib/supabase/server';

/**
 * Google 로그인 리디렉션 API
 * @route GET /api/auth/google
 */
export async function GET(request: NextRequest) {
  try {
    console.log('==== Google 로그인 시작 ====');

    // 리디렉션 URL 구성
    const requestUrl = new URL(request.url);
    console.log('요청 URL:', request.url);

    const callbackUrl = new URL(
      '/api/auth/callback',
      requestUrl.origin,
    ).toString();
    console.log('콜백 URL:', callbackUrl);

    // Supabase 클라이언트 생성
    console.log('Supabase 클라이언트 생성 시작');
    const supabase = await createServerSupabaseClient();
    console.log('Supabase 클라이언트 생성 완료');

    // Google OAuth 시작 URL 가져오기
    console.log('Google OAuth 시작 URL 요청');
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error('Google 로그인 URL 생성 오류:', error);
      return NextResponse.json(
        {
          error: 'Google 인증 초기화에 실패했습니다.',
          message: error.message,
        },
        { status: 500 },
      );
    }

    console.log(
      'OAuth URL 생성 성공, 리디렉션:',
      data.url.substring(0, 50) + '...',
    );

    // OAuth 제공자의 URL로 리디렉션
    return NextResponse.redirect(data.url);
  } catch (error: any) {
    console.error('Google 로그인 오류:', error);
    return NextResponse.json(
      {
        error: '서버 오류가 발생했습니다.',
        message: error.message,
      },
      { status: 500 },
    );
  } finally {
    console.log('==== Google 로그인 처리 종료 ====');
  }
}
