import { NextResponse } from 'next/server';
import { forgotPasswordSchema } from '@/entities/user';
import { createServerSupabaseClient } from '@/shared/lib/supabase/server';

/**
 * 비밀번호 재설정을 위한 이메일 발송 API
 * OTP 코드만 포함된 이메일을 발송합니다.
 */
export async function POST(request: Request) {
  try {
    // 요청 데이터 추출
    const body = await request.json();

    // 유효성 검증
    const validationResult = forgotPasswordSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid email format',
          details: validationResult.error.format(),
        },
        { status: 400 },
      );
    }

    const { email } = validationResult.data;

    // Supabase 클라이언트 생성
    const supabase = await createServerSupabaseClient();

    // 비밀번호 재설정 이메일 발송
    // redirectTo는 사용하지 않지만, API 요구사항이므로 빈 문자열로 전달
    // 이메일에는 OTP 코드만 포함되도록 설정되어 있어야 함
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: '',
    });

    if (error) {
      console.error('Failed to send reset password email:', error);
      return NextResponse.json(
        { error: 'Failed to send reset password email' },
        { status: 500 },
      );
    }

    // 성공 응답
    return NextResponse.json({
      success: true,
      message: 'Reset password email sent with OTP code',
    });
  } catch (error) {
    console.error('Password reset request failed:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
