import { deleteCookie, getCookie, setCookie } from 'cookies-next/client';
import {
  ACCESS_TOKEN_COOKIE_OPTION,
  COOKIE_KEY,
} from '@shared/models/constant/cookie-option';

export function getAccessToken() {
  const accessToken = getCookie(COOKIE_KEY.ACCESS_TOKEN);
  return accessToken;
}

export function setAccessToken(accessToken: string) {
  setCookie(COOKIE_KEY.ACCESS_TOKEN, accessToken, ACCESS_TOKEN_COOKIE_OPTION);
}

export function deleteAccessToken() {
  deleteCookie(COOKIE_KEY.ACCESS_TOKEN);
}
