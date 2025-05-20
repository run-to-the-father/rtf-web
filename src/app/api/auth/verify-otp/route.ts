import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerSupabaseClient } from '@/shared/lib/supabase/server';

// OTP 검증을 위한 스키마
const verifyOtpSchema = z.object({
  email: z.string().email('Invalid email format'),
  token: z.string().min(6, 'OTP must be at least 6 characters'),
});

/**
 * OTP 코드 검증 API
 * 이메일과 OTP 코드를 검증하고 세션을 설정합니다.
 */
export async function POST(request: Request) {
  try {
    // 요청 데이터 추출
    const body = await request.json();

    // 유효성 검증
    const validationResult = verifyOtpSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid input data',
          details: validationResult.error.format(),
        },
        { status: 400 },
      );
    }

    const { email, token } = validationResult.data;

    // Supabase 클라이언트 생성
    const supabase = await createServerSupabaseClient();

    // OTP 코드 검증
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'recovery',
    });

    if (error) {
      console.error('Failed to verify OTP:', error);
      return NextResponse.json(
        { error: 'Failed to verify OTP code' },
        { status: 401 },
      );
    }

    // 성공 응답 (세션 정보 포함)
    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      session: data.session,
    });
  } catch (error) {
    console.error('OTP verification failed:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
