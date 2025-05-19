import { NextRequest, NextResponse } from 'next/server';
import { parseUserFromSession } from '@/entities/user/model/user';
import { createServerSupabaseClient } from '@/shared/lib/supabase/server';

/**
 * 현재 로그인한 사용자 정보 가져오기 API
 * @route GET /api/auth/me
 */
export async function GET(request: NextRequest) {
  console.log('==== 사용자 정보 조회 API 호출 시작 ====');
  console.log('요청 URL:', request.url);

  try {
    // Supabase 클라이언트 생성
    console.log('Supabase 클라이언트 생성 시작');
    const supabase = await createServerSupabaseClient();
    console.log('Supabase 클라이언트 생성 완료');

    // 쿠키 확인
    console.log('요청 쿠키 확인:');
    const cookies = request.cookies.getAll();
    console.log(`쿠키 수: ${cookies.length}`);
    cookies.forEach((cookie) => {
      console.log(`- ${cookie.name}: ${cookie.value.substring(0, 20)}...`);
    });

    // 세션 확인
    console.log('세션 확인 시작');
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('세션 확인 오류:', error.message);
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    if (!data.session) {
      console.log('세션 없음: 인증되지 않은 사용자');
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 },
      );
    }

    console.log('세션 확인 성공:', {
      세션ID: data.session?.access_token
        ? data.session.access_token.substring(0, 10) + '...'
        : '없음',
      만료시간: data.session?.expires_at
        ? new Date(data.session.expires_at * 1000).toISOString()
        : '없음',
    });

    // 사용자 정보 구문 분석
    console.log('사용자 정보 파싱 시작');
    const user = parseUserFromSession(data.session);

    if (!user) {
      console.error('사용자 정보 파싱 실패');
      return NextResponse.json(
        { error: '사용자 정보를 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    console.log('사용자 정보 파싱 성공:', {
      id: user.id,
      email: user.email,
      nickname: user.nickname || '(없음)',
    });

    // 사용자 정보 반환
    console.log('사용자 정보 반환');
    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('사용자 정보 조회 중 예외 발생:', error);
    return NextResponse.json(
      {
        error: '서버 오류가 발생했습니다.',
        message: error.message,
      },
      { status: 500 },
    );
  } finally {
    console.log('==== 사용자 정보 조회 API 호출 종료 ====');
  }
}
