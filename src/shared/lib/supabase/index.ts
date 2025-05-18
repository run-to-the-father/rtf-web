import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Supabase 클라이언트 인스턴스 생성
export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey,
);

// Supabase 인증 헬퍼 함수
export const auth = supabase.auth;

// Supabase 스토리지 헬퍼 함수
// 타입 단언으로 명시적 타입 지정
export const supabaseStorage = supabase.storage as any;

// Supabase 데이터베이스 헬퍼 함수
export const db = supabase;
