export type Gender = 'male' | 'female' | 'other';

export interface User {
  id: string; // auth.users UUID
  email: string;
  gender: Gender;
  nickname?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface UserSocialAccount {
  id: number;
  user_id: string;
  provider: string;
  provider_id: string;
  connected_at: string;
  created_at: string;
}

/**
 * Supabase의 세션 정보에서 사용자 정보를 추출하는 헬퍼 함수
 */
export function parseUserFromSession(session: any): User | null {
  if (!session || !session.user) {
    return null;
  }

  const { user } = session;

  return {
    id: user.id,
    email: user.email || '',
    gender: user.user_metadata?.gender || 'other',
    nickname: user.user_metadata?.nickname || '',
    avatar_url: user.user_metadata?.avatar_url || '',
    created_at: user.created_at || '',
    updated_at: user.updated_at || '',
    deleted_at: user.deleted_at || null,
  };
}
