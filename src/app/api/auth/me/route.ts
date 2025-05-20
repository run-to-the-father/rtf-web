import { NextRequest, NextResponse } from 'next/server';
import { parseUserFromSession } from '@/entities/user/model/user';
import { createServerSupabaseClient } from '@/shared/lib/supabase/server';

/**
 * 현재 로그인한 사용자 정보 가져오기 API
 * @route GET /api/auth/me
 */
export async function GET(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(2, 10);
  const startTime = Date.now();
  console.log(
    `[${requestId}] 🔍 AUTH_ME_API: 요청 시작 [${new Date().toISOString()}]`,
  );
  console.log(`[${requestId}] 📌 요청 URL: ${request.url}`);
  console.log(`[${requestId}] 📌 요청 메서드: ${request.method}`);
  console.log(
    `[${requestId}] 📌 User-Agent: ${request.headers.get('user-agent')}`,
  );

  try {
    // Supabase 클라이언트 생성
    console.log(`[${requestId}] 🔄 Supabase 클라이언트 생성 시작...`);
    const clientStartTime = Date.now();
    const supabase = await createServerSupabaseClient();
    console.log(
      `[${requestId}] ✅ Supabase 클라이언트 생성 완료 (${Date.now() - clientStartTime}ms)`,
    );

    // 쿠키 확인
    console.log(`[${requestId}] 🔄 요청 쿠키 분석 중...`);
    const cookies = request.cookies.getAll();
    console.log(`[${requestId}] 📋 쿠키 수: ${cookies.length}`);

    // Supabase 인증 관련 쿠키만 로깅
    const authCookies = cookies.filter(
      (c) =>
        c.name.includes('auth') ||
        c.name.includes('sb-') ||
        c.name.includes('supabase'),
    );

    if (authCookies.length > 0) {
      console.log(
        `[${requestId}] 🔐 인증 관련 쿠키 (${authCookies.length}개):`,
      );
      authCookies.forEach((cookie) => {
        console.log(
          `[${requestId}]   - ${cookie.name}: ${cookie.value.substring(0, 10)}...`,
        );
      });
    } else {
      console.log(`[${requestId}] ⚠️ 인증 관련 쿠키가 없습니다.`);
    }

    // 세션 확인
    console.log(`[${requestId}] 🔄 Supabase 세션 확인 중...`);
    const sessionStartTime = Date.now();
    const { data, error } = await supabase.auth.getSession();
    console.log(
      `[${requestId}] ✅ 세션 확인 완료 (${Date.now() - sessionStartTime}ms)`,
    );

    if (error) {
      console.error(`[${requestId}] ❌ 세션 확인 오류:`, error.message);
      console.error(`[${requestId}] 📊 에러 코드:`, error.status || 'N/A');
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    if (!data.session) {
      console.log(`[${requestId}] ⚠️ 세션 없음: 인증되지 않은 사용자`);
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 },
      );
    }

    console.log(`[${requestId}] ✅ 세션 확인 성공:`, {
      세션유효: true,
      세션ID: data.session?.access_token
        ? `${data.session.access_token.substring(0, 5)}...${data.session.access_token.substring(data.session.access_token.length - 5)}`
        : '없음',
      만료시간: data.session?.expires_at
        ? new Date(data.session.expires_at * 1000).toISOString()
        : '없음',
      남은시간: data.session?.expires_at
        ? `${Math.floor((data.session.expires_at * 1000 - Date.now()) / 1000 / 60)}분`
        : '알 수 없음',
    });

    // 사용자 정보 구문 분석
    console.log(`[${requestId}] 🔄 사용자 정보 파싱 중...`);
    const user = parseUserFromSession(data.session);

    if (!user) {
      console.error(`[${requestId}] ❌ 사용자 정보 파싱 실패`);
      console.error(
        `[${requestId}] 📊 세션 데이터 구조:`,
        JSON.stringify({
          hasUser: !!data.session?.user,
          hasUserId: !!data.session?.user?.id,
          hasEmail: !!data.session?.user?.email,
        }),
      );
      return NextResponse.json(
        { error: '사용자 정보를 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    console.log(`[${requestId}] ✅ 사용자 정보 파싱 성공:`, {
      id: user.id,
      email: user.email
        ? `${user.email.substring(0, 3)}...${user.email.split('@')[1]}`
        : '(없음)',
      nickname: user.nickname || '(없음)',
      gender: user.gender,
      hasAvatar: !!user.avatar_url,
    });

    // 사용자 정보 반환
    console.log(`[${requestId}] 🔄 응답 생성 중...`);
    const response = { user };
    console.log(
      `[${requestId}] ✅ 요청 처리 완료 (총 ${Date.now() - startTime}ms)`,
    );
    return NextResponse.json(response);
  } catch (error: any) {
    console.error(`[${requestId}] 🔴 예외 발생:`, error.message);
    console.error(`[${requestId}] 📊 에러 타입:`, error.constructor.name);
    console.error(`[${requestId}] 📊 스택 트레이스:`, error.stack);
    return NextResponse.json(
      {
        error: '서버 오류가 발생했습니다.',
        message: error.message,
        type: error.constructor.name,
      },
      { status: 500 },
    );
  } finally {
    console.log(
      `[${requestId}] 🏁 AUTH_ME_API: 요청 종료 [총 실행시간: ${Date.now() - startTime}ms]`,
    );
  }
}
