import { NextRequest } from 'next/server';

export function getCallbackUrl(request: NextRequest) {
  const requestUrl = new URL(request.url);
  return new URL('/api/auth/callback', requestUrl.origin).toString();
}

export function getRedirectToUrl(request: NextRequest, path: string) {
  const requestUrl = new URL(request.url);
  return new URL(path, requestUrl.origin).toString();
}
