'use server';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * 서버 액션에서 사용할 Supabase 클라이언트
 * @example
 * export async function myServerAction() {
 *   const supabase = createServerSupabaseClient();
 *   const { data } = await supabase.from('table').select('*');
 *   // ...
 * }
 */
export async function createServerSupabaseClient() {
  console.log('서버 액션 Supabase 클라이언트 생성 시작');
  try {
    const cookieStore = await cookies();

    return createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name) {
          try {
            const value = cookieStore.get(name)?.value;
            console.log(
              `서버 액션 쿠키 조회: ${name} = ${value ? '있음' : '없음'}`,
            );
            return value;
          } catch (error) {
            console.error(`쿠키 조회 오류 (${name}):`, error);
            return undefined;
          }
        },
        set(name, value, options) {
          try {
            console.log(`서버 액션 쿠키 설정: ${name}`);
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            console.error(`쿠키 설정 오류 (${name}):`, error);
          }
        },
        remove(name, options) {
          try {
            console.log(`서버 액션 쿠키 삭제: ${name}`);
            cookieStore.delete({ name, ...options });
          } catch (error) {
            console.error(`쿠키 삭제 오류 (${name}):`, error);
          }
        },
      },
    });
  } catch (error) {
    console.error('서버 액션 Supabase 클라이언트 생성 오류:', error);
    throw error;
  }
}

/**
 * 서버 컴포넌트에서 사용할 Supabase 클라이언트
 * @example
 * export default async function MyComponent() {
 *   const supabase = await createServerComponentSupabaseClient();
 *   const { data } = await supabase.from('table').select('*');
 *   // ...
 * }
 */
export async function createServerComponentSupabaseClient(): Promise<SupabaseClient> {
  console.log('서버 컴포넌트 Supabase 클라이언트 생성 시작');
  try {
    const cookieStore = await cookies();

    return createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name) {
          try {
            const value = cookieStore.get(name)?.value;
            console.log(
              `서버 컴포넌트 쿠키 조회: ${name} = ${value ? '있음' : '없음'}`,
            );
            return value;
          } catch (error) {
            console.error(`쿠키 조회 오류 (${name}):`, error);
            return undefined;
          }
        },
        set(name, value, options) {
          try {
            console.log(`서버 컴포넌트 쿠키 설정: ${name}`);
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            console.error(`쿠키 설정 오류 (${name}):`, error);
          }
        },
        remove(name, options) {
          try {
            console.log(`서버 컴포넌트 쿠키 삭제: ${name}`);
            cookieStore.delete({ name, ...options });
          } catch (error) {
            console.error(`쿠키 삭제 오류 (${name}):`, error);
          }
        },
      },
    });
  } catch (error) {
    console.error('서버 컴포넌트 Supabase 클라이언트 생성 오류:', error);
    throw error;
  }
}

/**
 * 현재 로그인한 사용자 정보 가져오기 (서버 컴포넌트용)
 */
export async function getServerSessionUser() {
  try {
    console.log('사용자 세션 정보 조회 시작');
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error('사용자 조회 오류:', error);
      return null;
    }

    if (!data?.user) {
      console.log('인증된 사용자 없음');
      return null;
    }

    console.log('사용자 조회 성공:', data.user.id);
    return data.user;
  } catch (error) {
    console.error('사용자 세션 정보 조회 오류:', error);
    return null;
  }
}
