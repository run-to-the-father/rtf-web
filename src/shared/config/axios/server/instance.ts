import axios, { AxiosInstance } from 'axios';
import { onRequestServer } from './interceptor.server';

const ROOT_API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createAxiosInstance = (
  baseURL: string | undefined,
  isServer: boolean,
): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    withCredentials: true,
    timeout: 60000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (isServer) {
    instance.interceptors.request.use(onRequestServer);
  }

  return instance;
};

// 서버 환경에서만 실행되도록 체크
export const ServerInstance = createAxiosInstance(
  ROOT_API_URL,
  typeof window === 'undefined',
);
