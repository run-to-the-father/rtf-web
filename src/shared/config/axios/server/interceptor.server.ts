import { InternalAxiosRequestConfig } from 'axios';
import { COOKIE_KEY } from '@/shared/model/constant/cookie-option';

/** 요청마다 헤더에 토큰을 전송 */
export const onRequestServer = async (config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    // 클라이언트 환경에서는 인터셉터를 건너뜀
    return config;
  }

  try {
    const { cookies } = await import('next/headers'); // 동적 임포트
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(COOKIE_KEY.ACCESS_TOKEN)?.value;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  } catch (error) {
    return Promise.reject(error);
  }
};
