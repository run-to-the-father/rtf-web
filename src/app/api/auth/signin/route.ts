import { NextRequest, NextResponse } from 'next/server';
import { signInSchema } from '@/entities/user/model/user-schema';
import { createServerSupabaseClient } from '@/shared/lib/supabase/server';

/**
 * 이메일/패스워드 로그인 API
 * @route POST /api/auth/signin
 */
export async function POST(request: NextRequest) {
  console.log('==== 이메일/패스워드 로그인 API 호출 시작 ====');
  console.log('요청 URL:', request.url);
  console.log('요청 메서드:', request.method);

  try {
    // 요청 본문 파싱
    const requestBody = await request.json();
    console.log('로그인 요청 이메일:', requestBody.email);

    // 유효성 검증
    console.log('유효성 검증 시작');
    const validationResult = signInSchema.safeParse(requestBody);
    if (!validationResult.success) {
      console.error('유효성 검증 실패:', validationResult.error.format());
      return NextResponse.json(
        {
          error: '유효하지 않은 로그인 정보입니다.',
          details: validationResult.error.format(),
        },
        { status: 400 },
      );
    }
    console.log('유효성 검증 성공');

    const { email, password } = validationResult.data;

    // Supabase 클라이언트 생성
    console.log('Supabase 클라이언트 생성 시작');
    const supabase = await createServerSupabaseClient();
    console.log('Supabase 클라이언트 생성 완료');

    // 로그인 시도
    console.log('이메일/패스워드 로그인 시도:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('로그인 실패:', error.message);
      return NextResponse.json(
        {
          error: '로그인에 실패했습니다.',
          message: error.message,
        },
        { status: 401 },
      );
    }

    // 로그인 성공
    console.log('로그인 성공, 사용자 ID:', data.user?.id);
    console.log('세션 정보:', {
      세션ID: data.session?.access_token ? '있음' : '없음',
      만료시간: data.session?.expires_at
        ? new Date(data.session.expires_at * 1000).toISOString()
        : '없음',
    });

    return NextResponse.json({
      message: '로그인 성공',
      user: data.user,
    });
  } catch (error: any) {
    console.error('로그인 처리 중 예외 발생:', error);
    return NextResponse.json(
      {
        error: '서버 오류가 발생했습니다.',
        message: error.message,
      },
      { status: 500 },
    );
  } finally {
    console.log('==== 이메일/패스워드 로그인 API 호출 종료 ====');
  }
}
