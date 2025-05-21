'use client';

import { useState } from 'react';
import { forgotPasswordSchema } from '@/entities/user';

export type ForgotPasswordValidationError = {
  email?: string;
  form?: string;
};

export function useForgotPassword(
  initialEmail: string = '',
  onEmailChange: (email: string) => void,
  onSendSuccess: () => void,
) {
  const [email, setEmail] = useState(initialEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ForgotPasswordValidationError>({});

  const validateForm = (): boolean => {
    try {
      // Zod 스키마로 유효성 검증
      forgotPasswordSchema.parse({ email });
      setErrors({});
      return true;
    } catch (error: any) {
      const formErrors: ForgotPasswordValidationError = {};

      if (error.errors) {
        error.errors.forEach((err: any) => {
          const path = err.path[0] as keyof ForgotPasswordValidationError;
          formErrors[path] = err.message;
        });
      }

      setErrors(formErrors);
      return false;
    }
  };

  // 이메일 변경 핸들러
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    onEmailChange(newEmail);

    // 에러가 있으면 지움
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  // 비밀번호 재설정 링크 보내기
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검증
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // API 호출하여 재설정 링크 전송
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || '비밀번호 재설정 이메일 전송에 실패했습니다.',
        );
      }

      // 다음 단계로 이동
      onSendSuccess();
    } catch (error: any) {
      console.error('비밀번호 재설정 이메일 전송 오류:', error);
      setErrors({
        form:
          error.message ||
          '비밀번호 재설정 이메일 전송 중 오류가 발생했습니다.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail: handleEmailChange,
    isLoading,
    errors,
    handleSendCode,
  };
}
