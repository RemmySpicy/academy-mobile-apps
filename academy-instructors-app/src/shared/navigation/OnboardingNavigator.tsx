import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from './types';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

// Placeholder screens
const WelcomeScreen = () => (
  <SafeAreaView className="flex-1 bg-white">
    <View className="flex-1 items-center justify-center p-6">
      <Text className="text-2xl font-bold text-gray-900 mb-4">
        Welcome to Academy Instructors
      </Text>
      <Text className="text-gray-600 text-center">
        TODO: Implement onboarding flow
      </Text>
    </View>
  </SafeAreaView>
);

const FeaturesScreen = () => (
  <SafeAreaView className="flex-1 bg-white">
    <View className="flex-1 items-center justify-center p-6">
      <Text className="text-xl font-semibold text-gray-900 mb-4">
        Features Overview
      </Text>
      <Text className="text-gray-600 text-center">
        TODO: Show app features
      </Text>
    </View>
  </SafeAreaView>
);

const PermissionsScreen = () => (
  <SafeAreaView className="flex-1 bg-white">
    <View className="flex-1 items-center justify-center p-6">
      <Text className="text-xl font-semibold text-gray-900 mb-4">
        Permissions Setup
      </Text>
      <Text className="text-gray-600 text-center">
        TODO: Request app permissions
      </Text>
    </View>
  </SafeAreaView>
);

const CompleteScreen = () => (
  <SafeAreaView className="flex-1 bg-white">
    <View className="flex-1 items-center justify-center p-6">
      <Text className="text-xl font-semibold text-gray-900 mb-4">
        Setup Complete
      </Text>
      <Text className="text-gray-600 text-center">
        TODO: Complete onboarding
      </Text>
    </View>
  </SafeAreaView>
);

/**
 * Onboarding Navigator
 * 
 * TODO: Implement comprehensive onboarding flow with:
 * - Welcome and app introduction
 * - Feature highlights
 * - Permission requests (notifications, location)
 * - Setup completion
 */
export const OnboardingNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Features" component={FeaturesScreen} />
      <Stack.Screen name="Permissions" component={PermissionsScreen} />
      <Stack.Screen name="Complete" component={CompleteScreen} />
    </Stack.Navigator>
  );
};