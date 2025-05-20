import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { parseUserFromSession } from '@/entities/user/model/user';
import {
  emailSchema,
  nicknameSchema,
  passwordSchema,
} from '@/entities/user/model/user-schema';
import { createServerComponentSupabaseClient } from '@/shared/lib/supabase/server';

// API 요청 검증을 위한 스키마 (confirmPassword 제외)
const apiSchema = z.object({
  nickname: nicknameSchema,
  email: emailSchema,
  password: passwordSchema,
  gender: z.enum(['male', 'female', 'other']),
});

export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(2, 10);
  const startTime = Date.now();
  console.log(
    `[${requestId}] 📝 SIGNUP_API: 요청 시작 [${new Date().toISOString()}]`,
  );
  console.log(`[${requestId}] 📌 요청 URL: ${request.url}`);
  console.log(`[${requestId}] 📌 요청 메서드: ${request.method}`);
  console.log(
    `[${requestId}] 📌 IP: ${request.headers.get('x-forwarded-for') || 'unknown'}`,
  );

  try {
    // 요청 바디 파싱
    const body = await request.json();
    console.log(
      `[${requestId}] 📧 회원가입 이메일: ${body.email ? body.email.substring(0, 3) + '...' : '없음'}`,
    );
    console.log(`[${requestId}] 👤 닉네임 제공됨: ${!!body.nickname}`);
    console.log(`[${requestId}] 🔄 성별: ${body.gender || '미지정'}`);

    // 서버 측 유효성 검사
    console.log(`[${requestId}] 🔄 데이터 유효성 검증 중...`);
    const validationStartTime = Date.now();
    const validationResult = apiSchema.safeParse(body);
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
          message: 'Invalid input data.',
          errors: validationResult.error.errors,
        },
        { status: 400 },
      );
    }
    console.log(`[${requestId}] ✅ 유효성 검증 성공`);

    const { email, password, nickname, gender } = validationResult.data;

    // Supabase 클라이언트 생성
    console.log(`[${requestId}] 🔄 Supabase 클라이언트 생성 중...`);
    const clientStartTime = Date.now();
    const supabase = await createServerComponentSupabaseClient();
    console.log(
      `[${requestId}] ✅ Supabase 클라이언트 생성 완료 (${Date.now() - clientStartTime}ms)`,
    );

    // 1단계 - 회원가입
    console.log(`[${requestId}] 🔄 Supabase Auth 회원가입 시도 중...`);
    const signupStartTime = Date.now();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
      },
    });
    console.log(
      `[${requestId}] ✅ 회원가입 요청 완료 (${Date.now() - signupStartTime}ms)`,
    );

    // 2단계 - 프로필 정보 업데이트
    if (!error && data.session) {
      console.log(`[${requestId}] 🔄 사용자 프로필 정보 업데이트 중...`);
      const updateStartTime = Date.now();
      const { error: updateError } = await supabase
        .from('users')
        .update({ nickname, gender })
        .eq('id', data.user?.id);

      if (updateError) {
        console.error(
          `[${requestId}] ⚠️ 프로필 업데이트 경고:`,
          updateError.message,
        );
      } else {
        console.log(
          `[${requestId}] ✅ 프로필 업데이트 완료 (${Date.now() - updateStartTime}ms)`,
        );
      }
    }

    if (error) {
      console.error(`[${requestId}] ❌ 회원가입 오류:`, error.message);
      console.error(`[${requestId}] 📊 에러 코드:`, error.status || 'N/A');

      // 이메일 중복 오류 처리
      if (error.message.includes('email already registered')) {
        console.log(`[${requestId}] 📊 실패 유형: 이메일 중복`);
        return NextResponse.json(
          {
            success: false,
            message: 'Email address is already registered.',
          },
          { status: 409 },
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: error.message || 'An error occurred during sign up.',
        },
        { status: 500 },
      );
    }

    // 세션 정보에서 사용자 정보 추출
    console.log(`[${requestId}] 🔄 세션 사용자 정보 파싱 중...`);
    const user = parseUserFromSession(data.session);

    if (!user) {
      console.error(
        `[${requestId}] ⚠️ 세션은 성공했으나 사용자 정보 파싱 실패`,
      );
    } else {
      console.log(`[${requestId}] ✅ 사용자 등록 성공:`, {
        id: user.id,
        email: user.email
          ? `${user.email.substring(0, 3)}...${user.email.split('@')[1]}`
          : '(없음)',
        nickname: user.nickname || '(없음)',
        gender: user.gender,
      });
    }

    console.log(
      `[${requestId}] ✅ 회원가입 API 요청 처리 완료 (총 ${Date.now() - startTime}ms)`,
    );
    return NextResponse.json({
      success: true,
      message: 'Sign up successful.',
      user,
    });
  } catch (error: any) {
    console.error(`[${requestId}] 🔴 예외 발생:`, error.message);
    console.error(`[${requestId}] 📊 에러 타입:`, error.constructor.name);
    console.error(`[${requestId}] 📊 스택 트레이스:`, error.stack);
    return NextResponse.json(
      {
        success: false,
        message: 'Server error occurred.',
        details: error instanceof Error ? error.message : String(error),
        type: error.constructor?.name,
      },
      { status: 500 },
    );
  } finally {
    console.log(
      `[${requestId}] 🏁 SIGNUP_API: 요청 종료 [총 실행시간: ${Date.now() - startTime}ms]`,
    );
  }
}
