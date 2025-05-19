// 브라우저와 서버에서 사용하는 Supabase 클라이언트 구성
'use client';

import { createBrowserClient } from '@supabase/ssr';
import { type SupabaseClient } from '@supabase/supabase-js';

// 브라우저와 서버에서 사용하는 Supabase 클라이언트 구성

// 브라우저와 서버에서 사용하는 Supabase 클라이언트 구성

// 브라우저와 서버에서 사용하는 Supabase 클라이언트 구성

// 브라우저와 서버에서 사용하는 Supabase 클라이언트 구성

// 브라우저와 서버에서 사용하는 Supabase 클라이언트 구성

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 클라이언트 사이드에서 사용하는 Supabase 클라이언트 인스턴스
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// 서버 컴포넌트에서 직접 import해서 사용하지 말 것
// 서버에서는 shared/lib/supabase/server.ts의 함수를 사용할 것
export const createStandaloneClient = (): SupabaseClient => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};

// Supabase 인증 헬퍼 함수
export const auth = supabase.auth;

// Supabase 스토리지 헬퍼 함수
export const supabaseStorage = supabase.storage as any;

// Supabase 데이터베이스 헬퍼 함수
export const db = supabase;
