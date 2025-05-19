'use client';

import { User } from '@/entities/user/model/user';
import { supabase } from '@/shared/lib/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';

/**
 * Supabase 사용자 객체를 애플리케이션 User 모델로 변환
 */
export function mapSupabaseUser(
  supabaseUser: SupabaseUser | null,
): User | null {
  if (!supabaseUser) return null;

  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    nickname:
      supabaseUser.user_metadata?.nickname ||
      supabaseUser.email?.split('@')[0] ||
      '',
    gender: supabaseUser.user_metadata?.gender || 'other',
    avatar_url: supabaseUser.user_metadata?.avatar_url || '',
    created_at: supabaseUser.created_at || new Date().toISOString(),
    updated_at: supabaseUser.updated_at || new Date().toISOString(),
    deleted_at: null,
  };
}

/**
 * 현재 세션 정보를 API로부터 가져옵니다.
 */
export async function getSessionUser(): Promise<User | null> {
  try {
    // 서버 API를 통해 세션 정보 가져오기
    const response = await fetch('/api/auth/session', {
      headers: { 'Cache-Control': 'no-cache, no-store' },
    });

    if (!response.ok) {
      throw new Error(`세션 조회 실패: ${response.status}`);
    }

    const data = await response.json();
    return data.user || null;
  } catch (error) {
    console.error('세션 사용자 정보 가져오기 실패:', error);
    return null;
  }
}

/**
 * 로그아웃
 */
export async function signOut(): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    // 로그아웃 성공 시 세션 페이지로 이동
    window.location.href = '/sign-in';
    return { success: true };
  } catch (error) {
    console.error('로그아웃 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '로그아웃 실패',
    };
  }
}

/**
 * 세션 이벤트 리스너 설정
 */
export function setupAuthListener(
  callback: (user: User | null) => void,
): () => void {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('Auth 상태 변경:', event, !!session);

    if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
      try {
        // 서버 API를 통해 최신 사용자 정보 가져오기
        const user = await getSessionUser();
        callback(user);
      } catch (error) {
        console.error('Auth 상태 변경 중 오류:', error);
        const fallbackUser = session ? mapSupabaseUser(session.user) : null;
        callback(fallbackUser);
      }
    } else if (event === 'SIGNED_OUT') {
      callback(null);
    }
  });

  // 구독 해제 함수 반환
  return () => {
    subscription.unsubscribe();
  };
}
