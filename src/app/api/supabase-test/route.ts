import { NextResponse } from 'next/server';
import { supabase } from '@/shared/lib';

export async function GET() {
  try {
    // Supabase 버전 정보만 가져오기 (데이터베이스 쿼리 없이)
    const { data: version } = await supabase.rpc('version');

    return NextResponse.json({
      message: 'Supabase 연결 성공!',
      version,
      success: true,
    });
  } catch (error) {
    console.error('Supabase 연결 테스트 오류:', error);
    return NextResponse.json(
      {
        error: '서버 오류가 발생했습니다',
        details: error instanceof Error ? error.message : String(error),
        success: false,
      },
      { status: 500 },
    );
  }
}
