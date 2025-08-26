// React 19 compatibility polyfill - TEMPORARILY DISABLED FOR TESTING
// import './react19-polyfill';

import React, { useEffect, useState, createContext, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import './global.css';

// Debug: Check React version to diagnose hook issues
console.log('React version:', React.version);

// Import shared library with fallback handling
let ThemeProvider: any, ProgramContextProvider: any, useAuthStore: any, ErrorBoundary: any;

try {
  const shared = require('@academy/mobile-shared');
  ({ ThemeProvider, ProgramContextProvider, useAuthStore, ErrorBoundary } = shared);
  console.log('✅ Using proper shared library');
} catch (error) {
  console.log('⚠️ Shared library unavailable, falling back to minimal theme');
  // Basic fallback for instructors app
  const { createContext, useContext, useState } = require('react');
  const fallbackTheme = { colors: { interactive: { primary: '#4F2EC9' } }, spacing: { md: 16 } };
  const ThemeContext = createContext({ theme: fallbackTheme });
  ThemeProvider = ({ children }: any) => React.createElement(ThemeContext.Provider, { value: { theme: fallbackTheme } }, children);
  ProgramContextProvider = ({ children }: any) => children;
  useAuthStore = () => {
    const [isInitializing] = useState(false);
    return { 
      isInitializing, 
      initializeAuth: async () => {} 
    };
  };
  ErrorBoundary = ({ children }: any) => children;
}
import { AppNavigator } from './src/navigation/AppNavigator';
import { LoadingScreen } from './src/components/LoadingScreen';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

/**
 * Academy Instructors App
 * 
 * Version 2.0 - Modern React Native architecture with:
 * - Enhanced Academy-themed components
 * - Zustand state management
 * - Shared component library integration
 * - Program context awareness
 * - Production-ready error handling
 * 
 * Target Users: Instructors, Coordinators, Program Admins
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