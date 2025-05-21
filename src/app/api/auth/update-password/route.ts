import { NextResponse } from 'next/server';
import { passwordChangeSchema } from '@/entities/user';
import { createServerSupabaseClient } from '@/shared/lib/supabase/server';

/**
 * 비밀번호 업데이트 API
 * 비밀번호 재설정 링크를 통해 생성된 세션을 사용하여 새 비밀번호를 설정합니다.
 */
export async function POST(request: Request) {
  try {
    // 요청 데이터 추출
    const body = await request.json();

    // 유효성 검증
    const validationResult = passwordChangeSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid password format',
          details: validationResult.error.format(),
        },
        { status: 400 },
      );
    }

    const { password } = validationResult.data;

    // Supabase 클라이언트 생성
    const supabase = await createServerSupabaseClient();

    // 현재 사용자 세션 확인
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();

    if (sessionError) {
      console.error('Session error:', sessionError);
      return NextResponse.json(
        { error: sessionError.message },
        { status: 401 },
      );
    }

    if (!sessionData.session) {
      return NextResponse.json(
        {
          error:
            'No active session found. Please follow the reset link from your email.',
        },
        { status: 401 },
      );
    }

    // 비밀번호 업데이트
    const { data, error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      console.error('Failed to update password:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to update password' },
        { status: 500 },
      );
    }

    // 성공 응답
    return NextResponse.json({
      success: true,
      message: 'Password updated successfully',
      user: data.user,
    });
  } catch (error: any) {
    console.error('Password update failed:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 },
    );
  }
}
