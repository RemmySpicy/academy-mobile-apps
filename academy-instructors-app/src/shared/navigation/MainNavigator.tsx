import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator } from './TabNavigator';
import type { MainStackParamList } from './types';

const Stack = createNativeStackNavigator<MainStackParamList>();

/**
 * Main Navigator
 * 
 * Handles the main authenticated app navigation with:
 * - Tab navigator for primary features (Classroom, Students, Attendance, etc.)
 * - Modal screens for detail views and secondary features
 * - Stack navigators for each feature area
 * 
 * Features:
 * - Clean animation system
 * - Modal presentation for detail screens
 * - Nested navigation structure
 * - Type-safe navigation
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
      {/* Main Tab Navigation */}
      <Stack.Screen 
        name="HomeTabs" 
        component={TabNavigator}
        options={{
          animation: 'none', // No animation for main tabs
        }}
      />

      {/* Modal Screens - Presented modally over tabs */}
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        {/* TODO: Add modal screens like StudentDetail, ClassDetail, etc. */}
      </Stack.Group>
    </Stack.Navigator>
  );
};