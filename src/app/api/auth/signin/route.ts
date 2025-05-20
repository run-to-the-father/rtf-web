import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/entities/user/model/user-schema';
import { createServerSupabaseClient } from '@/shared/lib/supabase/server';

/**
 * 이메일/패스워드 로그인 API
 * @route POST /api/auth/signin
 */
export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(2, 10);
  const startTime = Date.now();
  console.log(
    `[${requestId}] 🔑 SIGNIN_API: 요청 시작 [${new Date().toISOString()}]`,
  );
  console.log(`[${requestId}] 📌 요청 URL: ${request.url}`);
  console.log(`[${requestId}] 📌 요청 메서드: ${request.method}`);
  console.log(
    `[${requestId}] 📌 IP: ${request.headers.get('x-forwarded-for') || 'unknown'}`,
  );

  try {
    // 요청 본문 파싱
    const requestBody = await request.json();
    console.log(
      `[${requestId}] 📧 로그인 이메일: ${requestBody.email ? requestBody.email.substring(0, 3) + '...' : '없음'}`,
    );
    console.log(`[${requestId}] 🔄 패스워드 제공됨: ${!!requestBody.password}`);

    // 유효성 검증
    console.log(`[${requestId}] 🔄 데이터 유효성 검증 중...`);
    const validationStartTime = Date.now();
    const validationResult = loginSchema.safeParse(requestBody);
    console.log(
      `[${requestId}] ✅ 유효성 검증 완료 (${Date.now() - validationStartTime}ms)`,
    );

    if (!validationResult.success) {
      console.error(
        `[${requestId}] ❌ 유효성 검증 실패:`,
        JSON.stringify(validationResult.error.issues),
      );
      return NextResponse.json(
        {
          success: false,
          error: '유효하지 않은 로그인 정보입니다.',
          details: validationResult.error.format(),
        },
        { status: 400 },
      );
    }
    console.log(`[${requestId}] ✅ 유효성 검증 성공`);

    const { email, password } = validationResult.data;

    // Supabase 클라이언트 생성
    console.log(`[${requestId}] 🔄 Supabase 클라이언트 생성 중...`);
    const clientStartTime = Date.now();
    const supabase = await createServerSupabaseClient();
    console.log(
      `[${requestId}] ✅ Supabase 클라이언트 생성 완료 (${Date.now() - clientStartTime}ms)`,
    );

    // 로그인 시도
    console.log(`[${requestId}] 🔄 이메일/패스워드 로그인 시도 중...`);
    const authStartTime = Date.now();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log(
      `[${requestId}] ✅ 로그인 요청 완료 (${Date.now() - authStartTime}ms)`,
    );

    if (error) {
      // 로그인 실패 이유 분석
      console.error(`[${requestId}] ❌ 로그인 실패:`, error.message);
      console.error(`[${requestId}] 📊 에러 코드:`, error.status || 'N/A');

      // 일반적인 로그인 오류 패턴 확인
      if (error.message.includes('Invalid login credentials')) {
        console.log(
          `[${requestId}] 📊 실패 유형: 잘못된 자격 증명 (이메일 또는 비밀번호 오류)`,
        );
        return NextResponse.json(
          {
            success: false,
            error: '이메일 또는 비밀번호가 올바르지 않습니다.',
          },
          { status: 401 },
        );
      } else if (error.message.includes('Email not confirmed')) {
        console.log(`[${requestId}] 📊 실패 유형: 이메일 미확인`);
        return NextResponse.json(
          {
            success: false,
            error: '이메일 인증이 완료되지 않았습니다. 이메일을 확인해주세요.',
          },
          { status: 401 },
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: '로그인에 실패했습니다.',
          message: error.message,
        },
        { status: 401 },
      );
    }

    // 로그인 성공 시 세션 및 쿠키 확인
    console.log(`[${requestId}] ✅ 로그인 성공, 사용자 ID:`, data.user?.id);
    console.log(`[${requestId}] 📊 세션 정보:`, {
      세션ID: data.session?.access_token
        ? `${data.session.access_token.substring(0, 5)}...${data.session.access_token.substring(data.session.access_token.length - 5)}`
        : '없음',
      만료시간: data.session?.expires_at
        ? new Date(data.session.expires_at * 1000).toISOString()
        : '없음',
      인증방식: data.user?.app_metadata?.provider || 'email',
      이메일확인: data.user?.email_confirmed_at ? '완료' : '미완료',
    });

    // 사용자 메타데이터 확인
    if (data.user) {
      console.log(`[${requestId}] 📊 사용자 메타데이터:`, {
        hasUserMetadata: !!data.user.user_metadata,
        properties: data.user.user_metadata
          ? Object.keys(data.user.user_metadata)
          : [],
      });
    }

    console.log(
      `[${requestId}] ✅ 요청 처리 완료 (총 ${Date.now() - startTime}ms)`,
    );
    return NextResponse.json({
      success: true,
      message: '로그인 성공',
      user: data.user,
    });
  } catch (error: any) {
    console.error(`[${requestId}] 🔴 예외 발생:`, error.message);
    console.error(`[${requestId}] 📊 에러 타입:`, error.constructor.name);
    console.error(`[${requestId}] 📊 스택 트레이스:`, error.stack);
    return NextResponse.json(
      {
        success: false,
        error: '서버 오류가 발생했습니다.',
        message: error.message,
        type: error.constructor.name,
      },
      { status: 500 },
    );
  } finally {
    console.log(
      `[${requestId}] 🏁 SIGNIN_API: 요청 종료 [총 실행시간: ${Date.now() - startTime}ms]`,
    );
  }
}
