import { NextRequest, NextResponse } from 'next/server';
import { forgotPasswordSchema } from '@/entities/user';
import { createServerSupabaseClient } from '@/shared/lib/supabase/server';
import { getRedirectToUrl } from '@/app/api/(lib)/utils';

/**
 * 비밀번호 재설정을 위한 이메일 발송 API
 * 재설정 링크가 포함된 이메일을 발송합니다.
 */
export async function POST(request: NextRequest) {
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
    // redirectTo를 설정하여 자체 reset-password 페이지로 이동하도록 함
    const redirectUrl = getRedirectToUrl(request, '/reset-password');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
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
      message: 'Reset password email sent successfully',
    });
  } catch (error) {
    console.error('Password reset request failed:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
