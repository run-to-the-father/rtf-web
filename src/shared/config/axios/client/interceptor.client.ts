import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { removeServerSession } from '@/shared/lib';
import { getAccessToken } from '@/shared/lib';
import { ApiError, ApiResponse, DEFAULT_ERROR_MESSAGES } from '../error';

/** 요청마다 헤더에 토큰을 전송 */
export const onRequestClient = async (config: InternalAxiosRequestConfig) => {
  try {
    const accessToken = getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const onResponseClientError = async (err: any) => {
  const { response } = err;

  if (response) {
    const statusCode = response.status;
    const errorData = response.data as ApiError;

    if (statusCode === 401 || statusCode === 403) {
      removeServerSession();
      window.location.href = '/sign-in';
      return Promise.resolve();
    }

    if (statusCode > 500) {
      return Promise.reject(
        new ApiError(
          DEFAULT_ERROR_MESSAGES.server,
          statusCode,
          errorData.path,
          errorData.errorCode,
          errorData.timestamp,
        ),
      );
    }

    return Promise.reject(
      new ApiError(
        errorData.message,
        statusCode,
        errorData.path,
        errorData.errorCode,
        errorData.timestamp,
      ),
    );
  } else if (err.request) {
    if (err.code === 'ECONNABORTED') {
      return Promise.reject(
        new ApiError(
          DEFAULT_ERROR_MESSAGES.timeout,
          408,
          '',
          'TIMEOUT',
          new Date().toISOString(),
        ),
      );
    } else if (err.code === 'ERR_NETWORK') {
      return Promise.reject(
        new ApiError(
          DEFAULT_ERROR_MESSAGES.network,
          0,
          '',
          'NETWORK_ERROR',
          new Date().toISOString(),
        ),
      );
    }
  }

  return Promise.reject(
    new ApiError(
      DEFAULT_ERROR_MESSAGES.unknown,
      0,
      '',
      'UNKNOWN_ERROR',
      new Date().toISOString(),
    ),
  );
};

export const onResponseClient = async (
  response: AxiosResponse,
): Promise<AxiosResponse<ApiResponse>> => {
  // 성공적인 응답 처리
  const apiResponse: ApiResponse = {
    statusCode: response.status,
    message: response.data.message || 'Success',
    data: response.data.data,
    count: response.data.count,
  };

  return {
    ...response,
    data: apiResponse,
  };
};
