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
  try {
    // 요청 바디 파싱
    const body = await request.json();

    // 서버 측 유효성 검사
    const validationResult = apiSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: '입력 데이터가 유효하지 않습니다.',
          errors: validationResult.error.errors,
        },
        { status: 400 },
      );
    }

    const { email, password, nickname, gender } = validationResult.data;

    // Supabase 클라이언트 생성
    const supabase = await createServerComponentSupabaseClient();

    // Supabase Auth를 사용하여 회원가입
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nickname,
          gender,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    });

    if (error) {
      console.error('회원가입 오류:', error);

      // 이메일 중복 오류 처리
      if (error.message.includes('email already registered')) {
        return NextResponse.json(
          {
            success: false,
            message: '이미 등록된 이메일 주소입니다.',
          },
          { status: 409 },
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: error.message || '회원가입 처리 중 오류가 발생했습니다.',
        },
        { status: 500 },
      );
    }

    // 세션 정보에서 사용자 정보 추출
    const user = parseUserFromSession(data.session);

    return NextResponse.json({
      success: true,
      message: '회원가입에 성공했습니다.',
      user,
    });
  } catch (error) {
    console.error('회원가입 처리 오류:', error);
    return NextResponse.json(
      {
        success: false,
        message: '서버 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
