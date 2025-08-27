import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, createThemedStyles } from '@academy/mobile-shared';

const useThemedStyles = createThemedStyles((theme) => StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background.secondary,
    },
    title: {
      color: theme.colors.text.primary,
      fontSize: theme.fontSizes.xl,
      fontWeight: theme.fontConfig.fontWeight.semibold,
    },
    subtitle: {
      color: theme.colors.text.secondary,
      fontSize: theme.fontSizes.base,
      marginTop: theme.spacing.xs,
    },
}));

export const ResetPasswordScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = useThemedStyles();
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password Screen</Text>
      <Text style={styles.subtitle}>Coming soon...</Text>
    </View>
  );
};