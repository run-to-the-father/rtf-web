import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/shared/lib/supabase/server';

/**
 * 세션 확인 API
 * @route GET /api/auth/session
 */
export async function GET(request: NextRequest) {
  console.log('==== 세션 확인 API 호출 시작 ====');
  console.log('요청 URL:', request.url);

  try {
    // Supabase 클라이언트 생성
    console.log('Supabase 클라이언트 생성 시작');
    const supabase = await createServerSupabaseClient();
    console.log('Supabase 클라이언트 생성 완료');

    // 세션 확인
    console.log('세션 확인 시작');
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('세션 확인 오류:', error.message);
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    if (data.session) {
      console.log('세션 확인 성공:', {
        세션ID: data.session?.access_token
          ? data.session.access_token.substring(0, 10) + '...'
          : '없음',
        만료시간: data.session?.expires_at
          ? new Date(data.session.expires_at * 1000).toISOString()
          : '없음',
      });
    } else {
      console.log('세션 없음');
    }

    // 세션 정보 반환
    console.log('세션 정보 반환');
    return NextResponse.json({ session: data.session });
  } catch (error: any) {
    console.error('세션 확인 중 예외 발생:', error);
    return NextResponse.json(
      {
        error: '서버 오류가 발생했습니다.',
        message: error.message,
      },
      { status: 500 },
    );
  } finally {
    console.log('==== 세션 확인 API 호출 종료 ====');
  }
}

/**
 * 세션 갱신 API
 * @route POST /api/auth/session
 */
export async function POST(request: NextRequest) {
  console.log('==== 세션 갱신 API 호출 시작 ====');
  console.log('요청 URL:', request.url);

  try {
    // Supabase 클라이언트 생성
    console.log('Supabase 클라이언트 생성 시작');
    const supabase = await createServerSupabaseClient();
    console.log('Supabase 클라이언트 생성 완료');

    // 현재 세션 상태 확인
    console.log('현재 세션 상태 확인');
    const { data: currentSession } = await supabase.auth.getSession();
    if (currentSession.session) {
      console.log('현재 세션 정보:', {
        세션ID: currentSession.session?.access_token ? '있음' : '없음',
        만료시간: currentSession.session?.expires_at
          ? new Date(currentSession.session.expires_at * 1000).toISOString()
          : '없음',
      });
    } else {
      console.log('현재 세션 없음');
    }

    // 세션 갱신
    console.log('세션 갱신 시도');
    const { data, error } = await supabase.auth.refreshSession();

    if (error) {
      console.error('세션 갱신 실패:', error.message);
      return NextResponse.json(
        {
          error: '세션 갱신에 실패했습니다.',
          message: error.message,
        },
        { status: 401 },
      );
    }

    console.log('세션 갱신 성공:', {
      세션ID: data.session?.access_token ? '있음' : '없음',
      만료시간: data.session?.expires_at
        ? new Date(data.session.expires_at * 1000).toISOString()
        : '없음',
    });

    // 갱신된 세션 정보 반환
    console.log('갱신된 세션 정보 반환');
    return NextResponse.json({
      message: '세션이 성공적으로 갱신되었습니다.',
      session: data.session,
    });
  } catch (error: any) {
    console.error('세션 갱신 중 예외 발생:', error);
    return NextResponse.json(
      {
        error: '서버 오류가 발생했습니다.',
        message: error.message,
      },
      { status: 500 },
    );
  } finally {
    console.log('==== 세션 갱신 API 호출 종료 ====');
  }
}
