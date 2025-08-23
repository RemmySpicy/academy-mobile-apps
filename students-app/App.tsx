// React 19 compatibility polyfill - TEMPORARILY DISABLED FOR TESTING
// import './react19-polyfill';

import React, { useEffect, useState, createContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import './global.css';

// Re-enable shared library import with proper error handling
let ThemeProvider: any, ProgramContextProvider: any, useAuthStore: any, ErrorBoundary: any;

try {
  const shared = require('../shared/src');
  ({ ThemeProvider, ProgramContextProvider, useAuthStore, ErrorBoundary } = shared);
  console.log('✅ Shared library loaded successfully');
} catch (error) {
  console.log('❌ Shared library failed, using fallbacks:', error.message);
  // Import our fallback theme
  const { ThemeProvider: FallbackTheme } = require('./src/fallback-theme');
  ThemeProvider = FallbackTheme;
  ProgramContextProvider = ({ children }: any) => children;
  useAuthStore = () => {
    const [isInitializing] = useState(false);
    return { 
      isInitializing, 
      initializeAuth: async () => {} 
    };
  };
  // Fallback ErrorBoundary
  ErrorBoundary = ({ children }: any) => children;
}

import { AppNavigator } from './src/navigation/AppNavigator';
import { LoadingScreen } from './src/components/LoadingScreen';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

/**
 * Academy Students App
 * 
 * Version 2.0 - Modern React Native architecture with:
 * - Enhanced Academy-themed components
 * - Zustand state management
 * - Shared component library integration
 * - Program context awareness
 * - Production-ready error handling
 * 
 * Target Users: Students, Parents, Guardians
 */
function AppContent() {
  const { isInitializing, initializeAuth } = useAuthStore();

  useEffect(() => {
    async function prepare() {
      try {
        // Initialize authentication
        await initializeAuth();
        
        // Small delay to ensure smooth loading
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e) {
        console.warn('Error during app initialization:', e);
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, [initializeAuth]);

  if (isInitializing) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

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