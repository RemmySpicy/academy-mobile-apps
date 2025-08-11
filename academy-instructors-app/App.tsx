import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';

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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <View style={styles.container}>
          <Text style={styles.title}>Academy Instructors App</Text>
          <Text style={styles.subtitle}>Version 2.0 - Development Build</Text>
          <Text style={styles.description}>
            This is a test build to verify the app loads correctly.
            The full navigation and features will be implemented next.
          </Text>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    lineHeight: 24,
  },
});