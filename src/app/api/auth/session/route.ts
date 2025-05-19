import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { User } from '@/entities/user/model/user';
import { createServerClient } from '@supabase/ssr';

/**
 * GET /api/auth/session
 * 현재 인증된 사용자 정보를 반환하는 API
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.delete({ name, ...options });
          },
        },
      },
    );

    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('세션 API 오류:', error);
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    // 세션이 없는 경우
    if (!data.session) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // 사용자 데이터 추출
    const { id, email, user_metadata, created_at, updated_at } =
      data.session.user;

    const user: User = {
      id,
      email: email || '',
      gender: user_metadata?.gender || 'other',
      nickname: user_metadata?.nickname || email?.split('@')[0] || '',
      avatar_url: user_metadata?.avatar_url || '',
      created_at: created_at || '',
      updated_at: updated_at || '',
      deleted_at: null,
    };

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('세션 API 처리 오류:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '서버 오류' },
      { status: 500 },
    );
  }
}
