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
  console.log('⚠️ Shared library unavailable, falling back to complete mobile theme');
  // Complete fallback theme for mobile-first approach
  const { createContext, useContext, useState } = require('react');
  const fallbackTheme = {
    colors: {
      interactive: { primary: '#4F2EC9', primaryHover: '#3F1FA3', primaryPressed: '#5F3ED1' },
      background: { primary: '#ffffff', secondary: '#f8f9fa', tertiary: '#e9ecef' },
      text: { primary: '#000000', secondary: '#666666', tertiary: '#999999', inverse: '#ffffff' },
      border: { primary: '#e5e7eb', secondary: '#d1d5db' },
      status: { error: '#ef4444', success: '#22c55e', warning: '#f59e0b' },
      shadow: { default: 'rgba(0, 0, 0, 0.1)' }
    },
    spacing: {
      // Numeric keys for compatibility
      0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32,
      // Semantic keys
      xs: 4, sm: 8, md: 16, lg: 24, xl: 32
    },
    safeArea: {
      minTouchTarget: { width: 44, height: 44 }
    },
    borderRadius: { sm: 4, md: 8, lg: 12, full: 9999 },
    fontSizes: { sm: 14, base: 16, lg: 18 },
    typography: { 
      body: { base: { fontSize: 16, lineHeight: 24 } },
      heading: { h4: { fontSize: 18, fontWeight: '600' } }
    },
    fontConfig: { fontWeight: { medium: '500', semibold: '600', bold: '700' } }
  };
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