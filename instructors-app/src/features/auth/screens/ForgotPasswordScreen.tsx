import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { AuthNavigationProps } from '../types';

/**
 * Forgot Password Screen
 * 
 * TODO: Implement password reset request form
 */
export const ForgotPasswordScreen: React.FC<AuthNavigationProps<'ForgotPassword'>> = ({
  navigation,
}) => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-xl font-semibold text-gray-900 mb-4">
          Forgot Password
        </Text>
        <Text className="text-gray-600 text-center mb-6">
          Enter your email to reset your password.
        </Text>
        <Text className="text-sm text-gray-500 text-center">
          TODO: Implement forgot password functionality
        </Text>
      </View>
    </SafeAreaView>
  );
};