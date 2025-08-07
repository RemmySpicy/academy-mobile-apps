import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuthStore } from '@/shared/store';
import { LoadingScreen } from '@/shared/components/LoadingScreen';
import { AuthNavigator } from '@/features/auth/navigation/AuthNavigator';
import { TabNavigator } from './TabNavigator';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Onboarding: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Main App Navigator
 * 
 * Handles:
 * - Authentication flow
 * - Loading states
 * - Main app navigation
 * - Deep linking support
 */
export const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  // Show loading screen while checking authentication
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!isAuthenticated ? (
          // Authentication flow
          <Stack.Screen 
            name="Auth" 
            component={AuthNavigator}
          />
        ) : (
          // Main app flow
          <Stack.Screen 
            name="Main" 
            component={TabNavigator}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};