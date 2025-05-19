'use client';

import { supabase } from '@/shared/lib';
import { mapSupabaseUser } from '@/shared/lib/auth-helpers';
import { Gender, User, parseUserFromSession } from '../model/user';

/**
 * 현재 인증된 사용자 정보 가져오기
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    // 서버 API를 통해 사용자 정보 가져오기
    const response = await fetch('/api/auth/session');
    const data = await response.json();

    if (!data.user) {
      return null;
    }

    return data.user;
  } catch (error) {
    console.error('getCurrentUser 오류:', error);
    return null;
  }
}

/**
 * 이메일/비밀번호로 로그인
 */
export async function signInWithEmail(email: string, password: string) {
  try {
    console.log('이메일 로그인 시도:', { email });

    // 쿠키 옵션 명시적으로 설정
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('이메일 로그인 오류:', error);
      throw error;
    }

    console.log('이메일 로그인 성공:', { userId: data.user?.id });

    // 로그인 후 세션 확인
    const { data: sessionData } = await supabase.auth.getSession();
    console.log('세션 확인:', { hasSession: !!sessionData.session });

    return { success: true, user: data.user };
  } catch (error) {
    console.error('이메일 로그인 처리 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '로그인 실패',
    };
  }
}

/**
 * Google 로그인 URL 반환
 */
export function getGoogleSignInUrl(redirectTo?: string): string {
  const params = redirectTo
    ? `?redirectTo=${encodeURIComponent(redirectTo)}`
    : '';
  return `/api/auth/google${params}`;
}

/**
 * 로그아웃
 */
export async function signOut() {
  try {
    console.log('로그아웃 시도');
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('로그아웃 오류:', error);
      throw error;
    }

    // 로그아웃 후 페이지 새로고침
    window.location.href = '/sign-in';
    return { success: true };
  } catch (error) {
    console.error('로그아웃 오류 처리:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '로그아웃 실패',
    };
  }
}

/**
 * 회원 가입
 */
export async function signUp(
  email: string,
  password: string,
  userData: {
    nickname?: string;
    gender?: Gender;
  },
) {
  try {
    console.log('회원가입 시도:', { email, hasNickname: !!userData.nickname });

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nickname: userData.nickname || email.split('@')[0],
          gender: userData.gender || 'other',
        },
        emailRedirectTo: `${window.location.origin}/api/auth/callback?redirectTo=/`,
      },
    });

    if (error) {
      console.error('회원가입 오류:', error);
      throw error;
    }

    console.log('회원가입 성공:', {
      userId: data.user?.id,
      emailConfirmed: data.user?.email_confirmed_at,
    });

    return {
      success: true,
      user: data.user,
      message: '회원가입이 완료되었습니다. 이메일 인증을 진행해주세요.',
    };
  } catch (error) {
    console.error('회원가입 처리 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '회원가입 실패',
    };
  }
}
