import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/shared/lib/supabase/server';

/**
 * 이메일 인증 재발송 API
 * @route POST /api/auth/resend-verification
 */
export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(2, 10);
  const startTime = Date.now();
  console.log(
    `[${requestId}] 📧 RESEND_VERIFICATION_API: 요청 시작 [${new Date().toISOString()}]`,
  );

  try {
    // 요청 본문 파싱
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email is required',
        },
        { status: 400 },
      );
    }

    console.log(
      `[${requestId}] 📧 인증 재발송 이메일: ${email.substring(0, 3)}...`,
    );

    // Supabase 클라이언트 생성
    const supabase = await createServerSupabaseClient();

    // 현재 세션 확인 (세션 보존을 위해)
    const { data: sessionData } = await supabase.auth.getSession();
    console.log(
      `[${requestId}] 📊 현재 세션 상태:`,
      sessionData.session ? '활성' : '비활성',
    );

    // 이메일 인증 재발송
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
      },
    });

    if (error) {
      console.error(`[${requestId}] ❌ 인증 재발송 실패:`, error.message);

      return NextResponse.json(
        {
          success: false,
          error: error.message || 'Failed to resend verification email',
        },
        { status: 500 },
      );
    }

    console.log(`[${requestId}] ✅ 인증 이메일 재발송 성공`);

    // 응답 생성 및 쿠키 설정
    const response = NextResponse.json({
      success: true,
      message: 'Verification email has been resent. Please check your inbox.',
      sessionPreserved: !!sessionData.session,
    });

    // Supabase 쿠키를 응답에 포함시킴
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      console.log(`[${requestId}] 📊 세션 유지를 위한 쿠키 설정`);
    }

    return response;
  } catch (error: any) {
    console.error(`[${requestId}] 🔴 예외 발생:`, error.message);

    return NextResponse.json(
      {
        success: false,
        error: 'Server error occurred.',
        message: error.message,
      },
      { status: 500 },
    );
  } finally {
    console.log(
      `[${requestId}] 🏁 RESEND_VERIFICATION_API: 요청 종료 [총 실행시간: ${Date.now() - startTime}ms]`,
    );
  }
}
