import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { AuthNavigationProps } from '../types';

/**
 * Register Screen
 * 
 * TODO: Implement registration form with:
 * - User type selection (tutor, coordinator, program_admin)
 * - Form validation with react-hook-form + yup
 * - Program selection for coordinators/tutors
 * - Integration with shared authentication service
 */
export const RegisterScreen: React.FC<AuthNavigationProps<'Register'>> = ({
  navigation,
}) => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-xl font-semibold text-gray-900 mb-4">
          Register Screen
        </Text>
        <Text className="text-gray-600 text-center mb-6">
          This screen will contain the user registration form.
        </Text>
        <Text className="text-sm text-gray-500 text-center">
          TODO: Implement registration functionality
        </Text>
      </View>
    </SafeAreaView>
  );
};