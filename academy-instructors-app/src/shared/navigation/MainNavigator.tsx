import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { MainStackParamList } from './types';

const Stack = createNativeStackNavigator<MainStackParamList>();

// Placeholder main screen
const HomeTabsPlaceholder = () => (
  <SafeAreaView className="flex-1 bg-white">
    <View className="flex-1 items-center justify-center p-6">
      <Text className="text-2xl font-bold text-gray-900 mb-4">
        Main App Navigation
      </Text>
      <Text className="text-gray-600 text-center mb-6">
        This will contain the main tab navigator with:
      </Text>
      <View className="space-y-2">
        <Text className="text-gray-700">• Home Dashboard</Text>
        <Text className="text-gray-700">• Student Management</Text>
        <Text className="text-gray-700">• Class Scheduling</Text>
        <Text className="text-gray-700">• Analytics</Text>
        <Text className="text-gray-700">• Profile</Text>
      </View>
      <Text className="text-sm text-gray-500 text-center mt-6">
        TODO: Implement tab navigation and feature screens
      </Text>
    </View>
  </SafeAreaView>
);

/**
 * Main Navigator
 * 
 * TODO: Implement main app navigation with:
 * - Tab navigator for primary features
 * - Modal screens for detail views
 * - Stack navigators for each tab
 */
export const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="HomeTabs"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen 
        name="HomeTabs" 
        component={HomeTabsPlaceholder}
      />
    </Stack.Navigator>
  );
};