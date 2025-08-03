import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PerformanceScreen } from '../screens/PerformanceScreen';
import type { PerformanceStackParamList } from '@/shared/navigation/types';

const Stack = createNativeStackNavigator<PerformanceStackParamList>();

/**
 * Performance Feature Navigator
 * 
 * Handles performance analytics and reporting:
 * - Student performance overview
 * - Class performance metrics
 * - Progress tracking and insights
 * - Generated reports and analytics
 */
export const PerformanceNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 250,
      }}
    >
      <Stack.Screen
        name="PerformanceOverview"
        component={PerformanceScreen}
        options={{
          title: 'Performance',
        }}
      />
    </Stack.Navigator>
  );
};