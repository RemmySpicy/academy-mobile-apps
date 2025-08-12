import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  ThemeProvider,
  ProgramContextProvider,
  useAuthStore,
} from '@academy/mobile-shared';

import { AppNavigator } from './src/navigation/AppNavigator';
import { LoadingScreen } from './src/components/LoadingScreen';
import { ErrorBoundary } from './src/components/ErrorBoundary';

/**
 * App Content Component
 * 
 * Handles authentication state and displays appropriate content
 */
const AppContent: React.FC = () => {
  const { isInitializing } = useAuthStore();

  if (isInitializing) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

/**
 * Academy Students App
 * 
 * Enhanced React Native app for students and parents with:
 * - Complete navigation system
 * - Enhanced Academy-themed components
 * - Multi-program context support
 * - Proper theme management
 * - Error boundaries and loading states
 */
export default function App() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <ThemeProvider>
            <ProgramContextProvider>
              <StatusBar style="auto" />
              <AppContent />
            </ProgramContextProvider>
          </ThemeProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}