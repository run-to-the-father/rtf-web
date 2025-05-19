/**
 * 유효성 검증 스키마를 재내보내는 파일
 * 기존 코드와의 호환성을 위해 유지
 */

// 스키마 재내보내기
export {
  emailSchema,
  passwordSchema,
  signInSchema,
  signUpSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
} from '../model/user-schema';

// 타입 재내보내기
export type {
  SignInFormData,
  SignUpFormData,
  ResetPasswordFormData,
  ForgotPasswordFormData,
} from '../model/user-schema';
