'use server';

import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
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
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value;
      },
      set(name, value, options) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name, options) {
        cookieStore.delete({ name, ...options });
      },
    },
  });
}

/**
 * 서버 컴포넌트에서 사용할 Supabase 클라이언트
 * @example
 * export default async function MyComponent() {
 *   const supabase = createServerComponentSupabaseClient();
 *   const { data } = await supabase.from('table').select('*');
 *   // ...
 * }
 */
export function createServerComponentSupabaseClient(): SupabaseClient {
  const cookieStore = cookies();

  return createServerComponentClient({ cookies: () => cookieStore });
}

/**
 * 현재 로그인한 사용자 정보 가져오기 (서버 컴포넌트용)
 */
export async function getServerSessionUser() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return null;
  }

  return data.user;
}
