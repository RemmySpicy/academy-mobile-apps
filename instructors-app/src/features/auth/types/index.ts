import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type ScreenProps<T extends Record<string, any>, K extends keyof T> = NativeStackScreenProps<T, K>;

// Auth Form Data Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  userType: 'tutor' | 'coordinator' | 'program_admin';
  programId?: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export interface VerifyEmailFormData {
  verificationCode: string;
}

// Auth Form Errors
export interface AuthFormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  userType?: string;
  verificationCode?: string;
  general?: string;
}

// Auth Navigation Types
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
  VerifyEmail: { email: string };
};

export type AuthNavigationProps<T extends keyof AuthStackParamList> = ScreenProps<
  AuthStackParamList,
  T
>;

// Auth State Types
export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone?: string;
  profileType: 'tutor' | 'coordinator' | 'program_admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthProgram {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

// Auth Service Types
export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  user: AuthUser;
}

export interface AuthError {
  message: string;
  status: number;
  details?: any;
}