import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

import { AppNavigator } from './src/shared/navigation/AppNavigator';
import { ErrorBoundary } from './src/shared/components/ErrorBoundary';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

/**
 * Academy Instructors App
 * 
 * Version 2.0 - Modern React Native architecture with:
 * - Zustand state management
 * - Shared component library integration
 * - Offline-first capabilities
 * - Program context awareness
 * - Production-ready error handling
 * 
 * Target Users: Instructors, Coordinators, Program Admins
 */
export default function App() {
  const [isReady, setIsReady] = React.useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts (if needed)
        await Font.loadAsync({
          // Add custom fonts here if needed
        });

        // Artificial delay to show splash screen (remove in production)
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn('Error during app preparation:', e);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!isReady) {
    return null; // Splash screen is still showing
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <StatusBar style="auto" />
          <AppNavigator />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}