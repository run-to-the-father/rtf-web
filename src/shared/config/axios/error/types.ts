export interface ApiResponse<T = any> {
  statusCode: number;
  message: string;
  data: T;
  count?: number;
}

// Axios Interceptor에서 Axios Error를 해당 커스텀 에러로 변환
export class ApiError<T = any> extends Error {
  name: string;
  statusCode: number;
  timestamp: string;
  path: string;
  message: string;
  errorCode: string;

  constructor(
    message: string,
    statusCode: number,
    path: string,
    errorCode: string,
    timestamp: string,
  ) {
    super();
    this.name = 'ApiError';
    this.message = message;
    this.statusCode = statusCode;
    this.timestamp = timestamp;
    this.path = path;
    this.errorCode = errorCode;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
