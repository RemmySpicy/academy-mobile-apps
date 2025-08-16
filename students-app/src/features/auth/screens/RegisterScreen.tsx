import React, { useState } from 'react';
import { View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { CustomInput, CustomButton, CustomCheckBox, SocialAuthButtons, validateEmail, useAuthStore } from '@academy/mobile-shared';
import type { AuthNavigationProps } from '../types';

// Validation schema
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
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain uppercase, lowercase and number'
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^\+?[\d\s-()]+$/, 'Please enter a valid phone number'),
  acceptTerms: yup
    .boolean()
    .oneOf([true], 'You must accept the terms and conditions'),
});

type RegisterFormData = yup.InferType<typeof registerSchema>;

/**
 * Student Registration Screen
 * 
 * Features:
 * - Comprehensive form validation
 * - Social registration options
 * - Terms acceptance
 * - Role selection integration
 * - Responsive design
 */
export const RegisterScreen: React.FC<AuthNavigationProps<'Register'>> = ({
  navigation,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, isLoading } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const success = await register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone,
      });
      
      if (success) {
        navigation.navigate('VerifyEmail', { email: data.email });
      } else {
        Alert.alert(
          'Registration Failed',
          'An account with this email may already exist. Please try signing in instead.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert(
        'Registration Error',
        'Something went wrong. Please try again later.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <LinearGradient
            colors={['#4F2EC9', '#3B82F6']}
            className="px-6 pt-12 pb-8 rounded-b-3xl"
          >
            <Pressable
              onPress={() => navigation.goBack()}
              className="mb-4"
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </Pressable>
            
            <View className="items-center">
              <View className="bg-white/10 p-4 rounded-full mb-4">
                <Ionicons name="person-add" size={32} color="white" />
              </View>
              <Text className="text-white text-2xl font-bold mb-2">
                Join Academy
              </Text>
              <Text className="text-white/80 text-center text-base">
                Start your swimming journey today
              </Text>
            </View>
          </LinearGradient>

          {/* Registration Form */}
          <View className="flex-1 px-6 pt-8">
            <View className="space-y-6">
              {/* Name Fields */}
              <View className="flex-row space-x-4">
                <View className="flex-1">
                  <CustomInput
                    name="firstName"
                    control={control}
                    placeholder="First name"
                    autoCapitalize="words"
                    variant="outline"
                    size="medium"
                  />
                </View>
                <View className="flex-1">
                  <CustomInput
                    name="lastName"
                    control={control}
                    placeholder="Last name"
                    autoCapitalize="words"
                    variant="outline"
                    size="medium"
                  />
                </View>
              </View>

              {/* Email */}
              <CustomInput
                name="email"
                control={control}
                placeholder="Email address"
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon={<Ionicons name="mail-outline" size={20} color="#9CA3AF" />}
                variant="outline"
              />

              {/* Phone */}
              <CustomInput
                name="phone"
                control={control}
                placeholder="Phone number"
                keyboardType="phone-pad"
                leftIcon={<Ionicons name="call-outline" size={20} color="#9CA3AF" />}
                variant="outline"
              />

              {/* Password */}
              <CustomInput
                name="password"
                control={control}
                placeholder="Create password"
                secureTextEntry={!showPassword}
                showPasswordToggle
                leftIcon={<Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />}
                variant="outline"
              />

              {/* Confirm Password */}
              <CustomInput
                name="confirmPassword"
                control={control}
                placeholder="Confirm password"
                secureTextEntry={!showConfirmPassword}
                showPasswordToggle
                leftIcon={<Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />}
                variant="outline"
              />

              {/* Terms Checkbox */}
              <CustomCheckBox
                name="acceptTerms"
                control={control}
                label="I agree to the Terms of Service and Privacy Policy"
              />

              {/* Register Button */}
              <CustomButton
                title="Create Account"
                onPress={handleSubmit(onSubmit)}
                isLoading={isLoading}
                disabled={!isValid || isLoading}
                variant="primary"
                className="mt-4"
              />

              {/* Social Registration */}
              <View className="mt-6">
                <View className="flex-row items-center mb-4">
                  <View className="flex-1 h-px bg-gray-300" />
                  <Text className="mx-4 text-gray-500 text-sm">or sign up with</Text>
                  <View className="flex-1 h-px bg-gray-300" />
                </View>
                
                <SocialAuthButtons
                  onGooglePress={() => console.log('Google registration')}
                  onApplePress={() => console.log('Apple registration')}
                  onFacebookPress={() => console.log('Facebook registration')}
                />
              </View>

              {/* Login Link */}
              <View className="flex-row justify-center items-center mt-6">
                <Text className="text-gray-600 text-base">
                  Already have an account?{' '}
                </Text>
                <Pressable
                  onPress={() => navigation.navigate('Login')}
                >
                  <Text className="text-blue-600 text-base font-medium">
                    Sign In
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};