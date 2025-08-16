import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
  VerifyEmail: { email: string };
  RoleSelection: undefined;
  OnboardingWelcome: undefined;
  OnboardingPreferences: undefined;
  OnboardingGoals: undefined;
};

export type AuthNavigationProps<T extends keyof AuthStackParamList> = 
  NativeStackScreenProps<AuthStackParamList, T>;

export interface UserRole {
  type: 'student' | 'parent';
  label: string;
  description: string;
  features: string[];
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
  isComplete: boolean;
}