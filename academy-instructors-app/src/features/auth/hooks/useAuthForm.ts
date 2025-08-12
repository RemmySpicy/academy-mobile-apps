import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { validateEmail, validatePassword } from '@academy/mobile-shared';
import type { LoginFormData, RegisterFormData, ForgotPasswordFormData } from '../types';

// Validation schemas
const loginSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .test('valid-email', 'Please enter a valid email', validateEmail),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

const registerSchema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: yup
    .string()
    .required('Email is required')
    .test('valid-email', 'Please enter a valid email', validateEmail),
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^(\+234|0)[789][01]\d{8}$/, 'Please enter a valid Nigerian phone number'),
  password: yup
    .string()
    .required('Password is required')
    .test('valid-password', 'Password must contain at least 1 uppercase, 1 lowercase, and 1 number', validatePassword),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
  userType: yup
    .string()
    .required('Please select your role')
    .oneOf(['tutor', 'coordinator', 'program_admin'], 'Invalid user type'),
});

const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .test('valid-email', 'Please enter a valid email', validateEmail),
});

/**
 * Authentication Form Hook
 * 
 * Provides form handling for various auth forms with validation
 */
export const useAuthForm = {
  login: () => {
    return useForm<LoginFormData>({
      resolver: yupResolver(loginSchema),
      mode: 'onChange',
      defaultValues: {
        email: '',
        password: '',
      },
    });
  },

  register: () => {
    return useForm<RegisterFormData>({
      resolver: yupResolver(registerSchema),
      mode: 'onChange',
      defaultValues: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        userType: 'tutor',
      },
    });
  },

  forgotPassword: () => {
    return useForm<ForgotPasswordFormData>({
      resolver: yupResolver(forgotPasswordSchema),
      mode: 'onChange',
      defaultValues: {
        email: '',
      },
    });
  },
};