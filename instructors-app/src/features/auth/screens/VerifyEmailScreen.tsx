import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { AuthNavigationProps } from '../types';

/**
 * Verify Email Screen
 * 
 * TODO: Implement email verification form
 */
export const VerifyEmailScreen: React.FC<AuthNavigationProps<'VerifyEmail'>> = ({
  navigation,
  route,
}) => {
  const { email } = route.params;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-xl font-semibold text-gray-900 mb-4">
          Verify Email
        </Text>
        <Text className="text-gray-600 text-center mb-6">
          Please check your email and enter the verification code sent to:
        </Text>
        <Text className="text-blue-600 font-medium text-center mb-6">
          {email}
        </Text>
        <Text className="text-sm text-gray-500 text-center">
          TODO: Implement email verification functionality
        </Text>
      </View>
    </SafeAreaView>
  );
};