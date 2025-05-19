import { z } from 'zod';

/**
 * 이메일 유효성 검증 스키마
 * 유효한 이메일 형식인지 확인
 */
export const emailSchema = z
  .string()
  .min(1, { message: '이메일은 필수 입력 항목입니다.' })
  .email({ message: '유효한 이메일 주소를 입력해주세요.' });

/**
 * 비밀번호 유효성 검증 스키마
 * 6자 이상, 영문, 숫자, 특수문자 포함
 */
export const passwordSchema = z
  .string()
  .min(6, { message: '비밀번호는 최소 6자 이상이어야 합니다.' })
  .regex(/[A-Za-z]/, {
    message: '비밀번호는 최소 하나의 영문자를 포함해야 합니다.',
  })
  .regex(/[0-9]/, { message: '비밀번호는 최소 하나의 숫자를 포함해야 합니다.' })
  .regex(/[^A-Za-z0-9]/, {
    message: '비밀번호는 최소 하나의 특수문자를 포함해야 합니다.',
  });

/**
 * 로그인 유효성 검증 스키마
 */
export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: '비밀번호를 입력해주세요.' }),
});

/**
 * 회원가입 유효성 검증 스키마
 */
export const signUpSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z
      .string()
      .min(1, { message: '비밀번호 확인을 입력해주세요.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

/**
 * 비밀번호 변경 유효성 검증 스키마
 */
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z
      .string()
      .min(1, { message: '비밀번호 확인을 입력해주세요.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

/**
 * 비밀번호 찾기 유효성 검증 스키마
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
