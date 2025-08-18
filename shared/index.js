import { registerRootComponent } from 'expo';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/theme';
import { ExtractedComponentsShowcase } from './src/screens';

const App = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ExtractedComponentsShowcase />
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

registerRootComponent(App);