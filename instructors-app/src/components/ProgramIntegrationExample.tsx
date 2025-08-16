import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

// TODO: Uncomment when shared package types are fully implemented
// import { 
//   ProgramSelector, 
//   ProgramHeader, 
//   ProgramGuard,
//   useProgramContext,
//   useTheme,
//   componentThemes
// } from 'shared';

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
  // Temporary placeholder component
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Program Integration Example</Text>
      <Text style={styles.description}>
        This component will demonstrate program context integration once the shared package types are fully implemented.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default ProgramIntegrationExample;