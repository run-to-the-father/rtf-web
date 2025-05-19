/**
 * 타입 확장
 */
import { User } from '@supabase/supabase-js';

// Supabase 쿠키 타입
declare module '@supabase/ssr' {
  interface CookieOptions {
    domain?: string;
    expires?: Date;
    httpOnly?: boolean;
    maxAge?: number;
    path?: string;
    sameSite?: 'lax' | 'strict' | 'none';
    secure?: boolean;
  }

  interface CookieMethods {
    get(name: string): string | undefined;
    set(name: string, value: string, options?: CookieOptions): void;
    remove(name: string, options?: CookieOptions): void;
  }
}

// 세션 사용자 타입
declare global {
  interface SessionUser extends User {
    role?: string;
    nickname?: string;
    gender?: string;
  }
}
