'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Gender,
  SignUpFormData,
  getGoogleSignInUrl,
  signUp,
  signUpSchema,
} from '@/entities/user';

export type SignUpValidationError = {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
};

export function useSignUp() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState<Gender>('other');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<SignUpValidationError>({});

  const validateForm = (): boolean => {
    try {
      // Zod 스키마로 유효성 검증
      signUpSchema.parse({ email, password, confirmPassword });
      setErrors({});
      return true;
    } catch (error: any) {
      const formErrors: SignUpValidationError = {};

      if (error.errors) {
        error.errors.forEach((err: any) => {
          const path = err.path[0] as keyof SignUpValidationError;
          formErrors[path] = err.message;
        });
      }

      setErrors(formErrors);
      return false;
    }
  };

  // 입력 필드 변경 핸들러
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    // 에러가 있으면 지움
    if (errors.username) {
      setErrors((prev) => ({ ...prev, username: undefined }));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // 에러가 있으면 지움
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    // 에러가 있으면 지움
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setConfirmPassword(e.target.value);
    // 에러가 있으면 지움
    if (errors.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
    }
  };

  const handleGenderChange = (value: Gender) => {
    setGender(value);
  };

  // 회원가입 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검증
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // 회원가입 API 호출
      const result = await signUp(email, password, {
        nickname: username,
        gender: gender,
      });

      if (result.success) {
        // 성공 시 로그인 페이지로 이동
        router.push('/sign-in?signup=success');
      } else {
        throw new Error(result.error || '회원가입 실패');
      }
    } catch (error) {
      console.error('회원가입 오류:', error);
      // 폼 에러 설정
      setErrors({
        form:
          error instanceof Error
            ? error.message
            : '회원가입 처리 중 오류가 발생했습니다.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Google 회원가입
  const handleGoogleSignUp = () => {
    try {
      // Google 로그인/회원가입 API로 리다이렉트
      window.location.href = getGoogleSignInUrl();
    } catch (error) {
      console.error('Google 회원가입 오류:', error);
      setErrors({ form: 'Google 회원가입 중 오류가 발생했습니다.' });
    }
  };

  // 비밀번호 표시 토글
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // 비밀번호 확인 표시 토글
  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return {
    username,
    setUsername: handleUsernameChange,
    email,
    setEmail: handleEmailChange,
    password,
    setPassword: handlePasswordChange,
    confirmPassword,
    setConfirmPassword: handleConfirmPasswordChange,
    gender,
    setGender: handleGenderChange,
    showPassword,
    showConfirmPassword,
    isLoading,
    errors,
    handleSubmit,
    handleGoogleSignUp,
    toggleShowPassword,
    toggleShowConfirmPassword,
  };
}
