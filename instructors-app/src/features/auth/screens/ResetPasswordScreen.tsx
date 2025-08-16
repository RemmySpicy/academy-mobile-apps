import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { AuthNavigationProps } from '../types';

/**
 * Reset Password Screen
 * 
 * TODO: Implement new password form
 */
export const ResetPasswordScreen: React.FC<AuthNavigationProps<'ResetPassword'>> = ({
  navigation,
  route,
}) => {
  const { token } = route.params;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-xl font-semibold text-gray-900 mb-4">
          Reset Password
        </Text>
        <Text className="text-gray-600 text-center mb-6">
          Enter your new password.
        </Text>
        <Text className="text-sm text-gray-500 text-center">
          Token: {token}
        </Text>
        <Text className="text-sm text-gray-500 text-center mt-2">
          TODO: Implement reset password functionality
        </Text>
      </View>
    </SafeAreaView>
  );
};