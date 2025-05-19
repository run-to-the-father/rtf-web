import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/shared/lib/supabase/server';

/**
 * 로그아웃 API
 * @route POST /api/auth/signout
 */
export async function POST(request: NextRequest) {
  console.log('==== 로그아웃 API 호출 시작 ====');
  console.log('요청 URL:', request.url);

  try {
    // Supabase 클라이언트 생성
    console.log('Supabase 클라이언트 생성 시작');
    const supabase = await createServerSupabaseClient();
    console.log('Supabase 클라이언트 생성 완료');

    // 현재 세션 확인
    console.log('현재 세션 확인');
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData.session) {
      console.log('로그아웃 전 세션 정보:', {
        사용자ID: sessionData.session?.user?.id || '알 수 없음',
        세션ID: sessionData.session?.access_token ? '있음' : '없음',
        만료시간: sessionData.session?.expires_at
          ? new Date(sessionData.session.expires_at * 1000).toISOString()
          : '없음',
      });
    } else {
      console.log('로그아웃 요청 시점에 세션이 없음');
    }

    // 로그아웃 처리
    console.log('로그아웃 처리 시작');
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('로그아웃 실패:', error.message);
      return NextResponse.json(
        {
          error: '로그아웃 처리 중 오류가 발생했습니다.',
          message: error.message,
        },
        { status: 500 },
      );
    }

    // 로그아웃 후 세션 확인
    console.log('로그아웃 후 세션 확인');
    const { data: afterLogoutSession } = await supabase.auth.getSession();
    console.log('로그아웃 후 세션 존재 여부:', !!afterLogoutSession.session);

    // 로그아웃 성공
    console.log('로그아웃 성공');
    return NextResponse.json({ message: '로그아웃 성공' });
  } catch (error: any) {
    console.error('로그아웃 중 예외 발생:', error);
    return NextResponse.json(
      {
        error: '서버 오류가 발생했습니다.',
        message: error.message,
      },
      { status: 500 },
    );
  } finally {
    console.log('==== 로그아웃 API 호출 종료 ====');
  }
}
