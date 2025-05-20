import { NextRequest } from 'next/server';

export function getCallbackUrl(request: NextRequest) {
  const requestUrl = new URL(request.url);
  return new URL('/api/auth/callback', requestUrl.origin).toString();
}
