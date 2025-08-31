import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@academy/mobile-shared';

/**
 * Temporary placeholder for Progress feature
 * Used while isolating loading issues
 */
export const ProgressNavigatorPlaceholder: React.FC = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background.primary,
      padding: theme.spacing.lg,
    },
    title: {
      fontSize: theme.fontSizes.xl,
      fontWeight: theme.fontConfig.fontWeight.bold,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    message: {
      fontSize: theme.fontSizes.base,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      lineHeight: 24,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progress Feature</Text>
      <Text style={styles.message}>
        Temporarily disabled for troubleshooting.
        {'\n'}This will be restored once loading issues are resolved.
      </Text>
    </View>
  );
};