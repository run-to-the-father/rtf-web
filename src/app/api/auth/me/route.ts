import { NextResponse } from 'next/server';
import { supabase } from '@/shared/lib';

export async function GET() {
  try {
    // 현재 사용자 정보 조회
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      throw error;
    }

    if (!data.user) {
      return NextResponse.json({
        user: null,
        isAuthenticated: false,
      });
    }

    // 기본 사용자 정보 반환
    const user = {
      id: data.user.id,
      email: data.user.email,
      fullName: data.user.user_metadata?.full_name || '',
      avatarUrl: data.user.user_metadata?.avatar_url || '',
      provider: data.user.app_metadata?.provider || 'email',
    };

    return NextResponse.json({
      user,
      isAuthenticated: true,
    });
  } catch (error) {
    console.error('유저 정보 조회 오류:', error);
    return NextResponse.json(
      {
        error: '인증되지 않은 사용자입니다',
        details: error instanceof Error ? error.message : String(error),
        isAuthenticated: false,
      },
      { status: 401 },
    );
  }
}
