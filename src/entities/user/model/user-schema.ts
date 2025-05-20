import { z } from 'zod';
import type { Gender } from './user';

/**
 * 이메일 유효성 검증 스키마
 * 유효한 이메일 형식인지 확인
 */
export const emailSchema = z
  .string()
  .trim()
  .min(1, { message: 'Email is required.' })
  .email({ message: 'Please enter a valid email address.' });

/**
 * 비밀번호 유효성 검증 스키마
 * 6자 이상, 영문, 숫자, 특수문자 포함
 */
export const passwordSchema = z
  .string()
  .min(6, { message: 'Password must be at least 6 characters.' })
  .regex(/[A-Za-z]/, {
    message: 'Password must contain at least one letter.',
  })
  .regex(/[0-9]/, { message: 'Password must contain at least one number.' })
  .regex(/[^A-Za-z0-9]/, {
    message: 'Password must contain at least one special character.',
  });

/**
 * 닉네임 유효성 검증 스키마
 * 2~20자 사이, 특수문자 제한
 */
export const nicknameSchema = z
  .string()
  .trim()
  .min(2, { message: 'Nickname must be at least 2 characters.' })
  .max(20, { message: 'Nickname cannot exceed 20 characters.' })
  .regex(/^[A-Za-z0-9가-힣_]+$/, {
    message:
      'Nickname can only contain letters, numbers, Korean characters, and underscores (_).',
  });

/**
 * 로그인 유효성 검증 스키마
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: 'Please enter your password.' }),
});

/**
 * 회원가입 유효성 검증 스키마
 */
export const signUpSchema = z
  .object({
    nickname: nicknameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z
      .string()
      .min(1, { message: 'Please confirm your password.' }),
    gender: z.enum(['male', 'female', 'other'], {
      errorMap: () => ({ message: 'Please select your gender.' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

/**
 * 비밀번호 변경 유효성 검증 스키마
 */
export const passwordChangeSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z
      .string()
      .min(1, { message: 'Please confirm your password.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

/**
 * 비밀번호 찾기 유효성 검증 스키마
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
