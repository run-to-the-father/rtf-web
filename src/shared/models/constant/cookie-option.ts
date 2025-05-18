export const SESSION_COOKIE_OPTION = {
  path: '/',
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 20,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
} as const;

export const ACCESS_TOKEN_COOKIE_OPTION = {
  path: '/',
  httpOnly: false,
  maxAge: 60 * 60 * 24 * 20,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
} as const;

export const COOKIE_KEY = {
  USER_SESSION: 'user_session',
  ACCESS_TOKEN: 'user_access',
  VIEW_MODE: 'view_mode',
} as const;
