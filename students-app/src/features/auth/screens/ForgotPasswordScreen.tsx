import React from 'react';
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

import { CustomInput, CustomButton, validateEmail } from '@academy/mobile-shared';
import type { AuthNavigationProps } from '../types';

const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .test('valid-email', 'Please enter a valid email', validateEmail),
});

type ForgotPasswordFormData = yup.InferType<typeof forgotPasswordSchema>;

/**
 * Forgot Password Screen
 * 
 * Allows users to request a password reset via email
 */
export const ForgotPasswordScreen: React.FC<AuthNavigationProps<'ForgotPassword'>> = ({
  navigation,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Reset Link Sent',
        `We've sent a password reset link to ${data.email}. Please check your email and follow the instructions.`,
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      Alert.alert(
        'Error',
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
        >
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
                <Ionicons name="key" size={32} color="white" />
              </View>
              <Text className="text-white text-2xl font-bold mb-2">
                Forgot Password?
              </Text>
              <Text className="text-white/80 text-center text-base">
                Enter your email and we'll send you a reset link
              </Text>
            </View>
          </LinearGradient>

          <View className="flex-1 px-6 pt-8">
            <CustomInput
              name="email"
              control={control}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Ionicons name="mail-outline" size={20} color="#9CA3AF" />}
              variant="outline"
            />

            <CustomButton
              title="Send Reset Link"
              onPress={handleSubmit(onSubmit)}
              variant="primary"
              className="mt-6"
            />

            <View className="flex-row justify-center items-center mt-6">
              <Text className="text-gray-600 text-base">
                Remember your password?{' '}
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};