import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { CustomInput, CustomButton } from '@shared/components/forms';
import { SocialAuthButtons } from '@shared/components/auth';
import { validateEmail } from '@shared/utils';
import { useAuthStore } from '@/shared/store';
import type { AuthNavigationProps } from '../types';

// Validation schema
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

type LoginFormData = yup.InferType<typeof loginSchema>;

/**
 * Student Login Screen
 * 
 * Features:
 * - Student/Parent role selection
 * - Social authentication options
 * - Secure form validation
 * - Responsive design
 * - Accessibility compliance
 */
export const LoginScreen: React.FC<AuthNavigationProps<'Login'>> = ({
  navigation,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const success = await login(data.email, data.password);
      
      if (success) {
        // Navigation handled by AppNavigator based on auth state
      } else {
        Alert.alert(
          'Login Failed',
          'Invalid email or password. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        'Connection Error',
        'Unable to connect to the server. Please check your internet connection and try again.',
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
          {/* Header with Brand */}
          <LinearGradient
            colors={['#4F2EC9', '#3B82F6']}
            className="px-6 pt-12 pb-8 rounded-b-3xl"
          >
            <View className="items-center">
              <View className="bg-white/10 p-4 rounded-full mb-4">
                <Ionicons name="water" size={32} color="white" />
              </View>
              <Text className="text-white text-2xl font-bold mb-2">
                Academy Students
              </Text>
              <Text className="text-white/80 text-center text-base">
                Welcome back to your swimming journey
              </Text>
            </View>
          </LinearGradient>

          {/* Login Form */}
          <View className="flex-1 px-6 pt-8">
            <View className="mb-8">
              <Text className="text-gray-900 text-xl font-semibold mb-2">
                Sign In to Continue
              </Text>
              <Text className="text-gray-600 text-base">
                Access your courses, progress, and more
              </Text>
            </View>

            <View className="space-y-6">
              {/* Email Input */}
              <CustomInput
                name="email"
                control={control}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                leftIcon={<Ionicons name="mail-outline" size={20} color="#9CA3AF" />}
                variant="outline"
              />

              {/* Password Input */}
              <CustomInput
                name="password"
                control={control}
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                showPasswordToggle
                variant="outline"
              />

              {/* Forgot Password Link */}
              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}
                className="self-end"
              >
                <Text className="text-blue-600 text-sm font-medium">
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              {/* Login Button */}
              <CustomButton
                title="Sign In"
                onPress={handleSubmit(onSubmit)}
                isLoading={isLoading}
                disabled={!isValid || isLoading}
                variant="primary"
                className="mt-4"
              />

              {/* Social Authentication */}
              <View className="mt-6">
                <View className="flex-row items-center mb-4">
                  <View className="flex-1 h-px bg-gray-300" />
                  <Text className="mx-4 text-gray-500 text-sm">or continue with</Text>
                  <View className="flex-1 h-px bg-gray-300" />
                </View>
                
                <SocialAuthButtons
                  onGooglePress={() => console.log('Google login')}
                  onApplePress={() => console.log('Apple login')}
                  onFacebookPress={() => console.log('Facebook login')}
                />
              </View>

              {/* Register Link */}
              <View className="flex-row justify-center items-center mt-6">
                <Text className="text-gray-600 text-base">
                  New to Academy?{' '}
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Register')}
                >
                  <Text className="text-blue-600 text-base font-medium">
                    Create Account
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View className="px-6 py-4">
            <Text className="text-center text-gray-500 text-xs">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};