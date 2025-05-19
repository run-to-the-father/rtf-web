import { NextResponse } from 'next/server';
import { supabase } from '@/shared/lib';

export async function POST() {
  try {
    // Supabase 세션 종료
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: '로그아웃 성공',
    });
  } catch (error) {
    console.error('로그아웃 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: '로그아웃 처리 중 오류가 발생했습니다',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
