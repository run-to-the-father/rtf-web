import { DEFAULT_ERROR_MESSAGES, ERROR_MESSAGES } from './constants';
import { ApiError } from './types';

export const DEFAULT_ERROR_MESSAGE = 'Request failed. Please try again.';

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

type CheckOrder = {
  type: 'errorCode' | 'status';
  map?: Record<string | number, string>;
};

const isValidErrorCode = (
  errorCode: string,
): errorCode is keyof typeof ERROR_MESSAGES => {
  return Object.keys(ERROR_MESSAGES).includes(errorCode);
};

class ErrorHandler {
  private error: unknown;
  private checkOrder: CheckOrder[] = [];
  private callerName: string;
  private isApiErrorChecked: boolean = false;

  constructor(error: unknown) {
    this.error = error;

    const stack = new Error().stack;
    this.callerName =
      stack?.split('\n')[3]?.trim()?.split(' ')[1]?.split('.').pop() ??
      'Unknown Function';

    this.isApiErrorChecked = isApiError(this.error);
  }

  errorCode(map: Record<string, string> = {}) {
    if (!this.isApiErrorChecked) {
      console.error(`Error in ${this.callerName}: Not an ApiError`);
      // return this.error;
    }
    this.checkOrder.push({ type: 'errorCode', map });
    return this;
  }

  status(map: Record<number, string>) {
    if (!this.isApiErrorChecked) {
      console.error(`Error in ${this.callerName}: Not an ApiError`);
      // return this.error;
    }
    this.checkOrder.push({ type: 'status', map });
    return this;
  }

  default(messageKey?: string): ApiError {
    if (!this.isApiErrorChecked) {
      console.error(`Error in ${this.callerName}: Not an ApiError`);
      // return this.error as ApiError;
    }

    const apiError = this.error as ApiError;

    // Check conditions in chaining order
    for (const check of this.checkOrder) {
      if (check.type === 'errorCode') {
        if (check.map && check.map[apiError.errorCode]) {
          const errorMessageKey = check.map[apiError.errorCode];
          console.error(`Error in ${this.callerName}: `, errorMessageKey);
          apiError.message = errorMessageKey;
          return apiError;
        }
        if (isValidErrorCode(apiError.errorCode)) {
          const errorMessageKey = ERROR_MESSAGES[apiError.errorCode];
          console.error(`Error in ${this.callerName}: `, errorMessageKey);
          apiError.message = errorMessageKey;
          return apiError;
        }
      }

      if (
        check.type === 'status' &&
        check.map &&
        check.map[apiError.statusCode]
      ) {
        const errorMessageKey = check.map[apiError.statusCode];
        console.error(`Error in ${this.callerName}: `, errorMessageKey);
        apiError.message = errorMessageKey as string;
        return apiError;
      }
    }

    // Apply global error priority
    for (const [key, defaultMessageKey] of Object.entries(
      DEFAULT_ERROR_MESSAGES,
    )) {
      if (apiError.message === defaultMessageKey) {
        console.error(`Error in ${this.callerName}: ${defaultMessageKey}`);
        apiError.message = defaultMessageKey;
        return apiError;
      }
    }

    if (ERROR_MESSAGES[apiError.errorCode as keyof typeof ERROR_MESSAGES]) {
      const errorMessageKey =
        ERROR_MESSAGES[apiError.errorCode as keyof typeof ERROR_MESSAGES];
      console.error(`Error in ${this.callerName}: `, errorMessageKey);
      apiError.message = errorMessageKey;
      return apiError;
    }

    // Assign default message key
    const errorMessage = messageKey ?? DEFAULT_ERROR_MESSAGE;
    console.log(`Error in ${this?.callerName}: `, errorMessage);
    apiError.message = errorMessage;
    return apiError;
  }
}

export const handleApiError = (error: unknown) => {
  return new ErrorHandler(error);
};
