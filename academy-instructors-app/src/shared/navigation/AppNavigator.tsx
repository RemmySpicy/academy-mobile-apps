import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore, useAppStore } from '@/shared/store';
import { AuthNavigator } from '@/features/auth';
import { MainNavigator } from './MainNavigator';
import { OnboardingNavigator } from './OnboardingNavigator';
import { LoadingScreen } from '@/shared/components/LoadingScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * App Navigator
 * 
 * Root navigation component that handles routing between:
 * - Onboarding flow (first launch)
 * - Authentication flow (login/register)
 * - Main application flow (authenticated users)
 * 
 * Features:
 * - Automatic route determination based on auth state
 * - Store hydration on app startup
 * - Loading states during initialization
 * - Smooth transitions between navigation stacks
 */
export const AppNavigator: React.FC = () => {
  const { 
    isAuthenticated, 
    isLoading: authLoading, 
    hydrate: hydrateAuth 
  } = useAuthStore();
  
  const { 
    isFirstLaunch, 
    hasCompletedOnboarding, 
    hydrate: hydrateApp 
  } = useAppStore();
  
  const [isHydrating, setIsHydrating] = React.useState(true);

  // Hydrate stores on app startup
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Hydrate both stores concurrently
        await Promise.all([
          hydrateAuth(),
          hydrateApp(),
        ]);
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setIsHydrating(false);
      }
    };

    initializeApp();
  }, [hydrateAuth, hydrateApp]);

  // Show loading screen during hydration
  if (isHydrating || authLoading) {
    return <LoadingScreen />;
  }

  // Determine which navigator to show
  const getInitialRouteName = (): keyof RootStackParamList => {
    // First launch - show onboarding
    if (isFirstLaunch || !hasCompletedOnboarding) {
      return 'Onboarding';
    }
    
    // Not authenticated - show auth flow
    if (!isAuthenticated) {
      return 'Auth';
    }
    
    // Authenticated - show main app
    return 'Main';
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={getInitialRouteName()}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          animationDuration: 300,
        }}
      >
        {/* Onboarding Flow */}
        <Stack.Screen
          name="Onboarding"
          component={OnboardingNavigator}
          options={{
            animation: 'fade',
          }}
        />
        
        {/* Authentication Flow */}
        <Stack.Screen
          name="Auth"
          component={AuthNavigator}
          options={{
            animation: 'slide_from_bottom',
          }}
        />
        
        {/* Main Application Flow */}
        <Stack.Screen
          name="Main"
          component={MainNavigator}
          options={{
            animation: 'fade',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};