import axios, { AxiosInstance } from 'axios';
import { onRequestClient, onResponseClient } from './interceptor.client';
import { onResponseClientError } from './interceptor.client';

const ROOT_API_URL = process.env.NEXT_PUBLIC_API_URL;
export const createAxiosInstance = (
  baseURL: string | undefined,
): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    withCredentials: true,
    timeout: 60000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use(onRequestClient);
  instance.interceptors.response.use(onResponseClient, onResponseClientError);

  return instance;
};

export const ClientInstance = createAxiosInstance(ROOT_API_URL);
