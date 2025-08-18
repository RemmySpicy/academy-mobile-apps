import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@academy/mobile-shared';

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontConfig.fontWeight.bold,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
    color: theme.colors.text.primary,
  },
  description: {
    fontSize: theme.fontSizes.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: theme.fontSizes.base * 1.375,
  },
});

/**
 * Example component demonstrating program context integration for student app
 * 
 * TODO: Re-implement when shared package types are fully resolved
 */
export function ProgramIntegrationExample() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // Temporary placeholder component
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Program Integration Example</Text>
      <Text style={styles.description}>
        This component will demonstrate student-specific program context integration once the shared package types are fully implemented.
      </Text>
    </View>
  );
}

export default ProgramIntegrationExample;