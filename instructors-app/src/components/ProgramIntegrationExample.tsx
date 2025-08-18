import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '@academy/mobile-shared';

// TODO: Uncomment when shared package types are fully implemented
// import { 
//   ProgramSelector, 
//   ProgramHeader, 
//   ProgramGuard,
//   useProgramContext,
//   componentThemes
// } from '@academy/mobile-shared';

/**
 * Example component demonstrating program context integration
 * 
 * This shows how to:
 * 1. Use ProgramContextProvider (should be in App.tsx)
 * 2. Display current program info
 * 3. Allow program switching
 * 4. Protect content based on user roles
 * 5. Use program context in data fetching
 * 
 * TODO: Re-implement when shared package types are fully resolved
 */
export function ProgramIntegrationExample() {
  const { theme } = useTheme();
  
  // Create themed styles
  const themedStyles = StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontConfig.fontWeight.bold,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
      color: theme.colors.text.primary,
    },
    description: {
      fontSize: theme.fontSizes.base,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      lineHeight: 22,
    },
  });

  // Temporary placeholder component
  return (
    <View style={themedStyles.container}>
      <Text style={themedStyles.title}>Program Integration Example</Text>
      <Text style={themedStyles.description}>
        This component will demonstrate program context integration once the shared package types are fully implemented.
      </Text>
    </View>
  );
}

// Remove old hardcoded styles - now using themedStyles above

export default ProgramIntegrationExample;