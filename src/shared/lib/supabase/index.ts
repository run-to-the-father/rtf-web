// 브라우저와 서버에서 사용하는 Supabase 클라이언트 구성
'use client';

import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

// 브라우저와 서버에서 사용하는 Supabase 클라이언트 구성

// 브라우저와 서버에서 사용하는 Supabase 클라이언트 구성

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 클라이언트 사이드에서 사용하는 Supabase 클라이언트 인스턴스
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// 서버 컴포넌트에서 직접 import해서 사용하지 말 것
// 서버에서는 createServerClient 또는 createServerComponentClient 사용할 것
export const createStandaloneClient = (): SupabaseClient =>
  createClient(supabaseUrl, supabaseAnonKey);

// Supabase 인증 헬퍼 함수
export const auth = supabase.auth;

// Supabase 스토리지 헬퍼 함수
// 타입 단언으로 명시적 타입 지정
export const supabaseStorage = supabase.storage as any;

// Supabase 데이터베이스 헬퍼 함수
export const db = supabase;
