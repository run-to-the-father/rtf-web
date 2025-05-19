'use client';

import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import {
  ACCESS_TOKEN_COOKIE_OPTION,
  COOKIE_KEY,
  REFRESH_TOKEN_COOKIE_OPTION,
} from '@/shared/models/constant/cookie-option';

/**
 * 액세스 토큰 가져오기
 */
export function getAccessToken(): string | undefined {
  const accessToken = getCookie(COOKIE_KEY.ACCESS_TOKEN);
  return accessToken?.toString();
}

/**
 * 액세스 토큰 설정
 */
export function setAccessToken(accessToken: string) {
  setCookie(COOKIE_KEY.ACCESS_TOKEN, accessToken, ACCESS_TOKEN_COOKIE_OPTION);
}

/**
 * 액세스 토큰 삭제
 */
export function deleteAccessToken() {
  deleteCookie(COOKIE_KEY.ACCESS_TOKEN);
}

/**
 * 리프레시 토큰 관련 쿠키 함수
 */
export function getRefreshToken(): string | undefined {
  const refreshToken = getCookie(COOKIE_KEY.REFRESH_TOKEN);
  return refreshToken?.toString();
}

export function setRefreshToken(refreshToken: string) {
  setCookie(
    COOKIE_KEY.REFRESH_TOKEN,
    refreshToken,
    REFRESH_TOKEN_COOKIE_OPTION,
  );
}

export function deleteRefreshToken() {
  deleteCookie(COOKIE_KEY.REFRESH_TOKEN);
}

/**
 * 모든 인증 관련 쿠키 삭제
 */
export function clearAuthCookies() {
  deleteAccessToken();
  deleteRefreshToken();
  deleteCookie(COOKIE_KEY.USER_SESSION);
}
