import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, createThemedStyles } from '@academy/mobile-shared';
import type { AuthNavigationProps } from '../types';

/**
 * Reset Password Screen
 * 
 * TODO: Implement new password form
 */
export const ResetPasswordScreen: React.FC<AuthNavigationProps<'ResetPassword'>> = ({
  navigation,
  route,
}) => {
  const { token } = route.params;
  const { theme } = useTheme();
  const styles = useThemedStyles();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Reset Password
        </Text>
        <Text style={styles.description}>
          Enter your new password.
        </Text>
        <Text style={styles.tokenText}>
          Token: {token}
        </Text>
        <Text style={styles.todoText}>
          TODO: Implement reset password functionality
        </Text>
      </View>
    </SafeAreaView>
  );
};

const useThemedStyles = createThemedStyles((theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.md,
    },
    title: {
      fontSize: theme.fontSizes.xl,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.md,
    },
    description: {
      fontSize: theme.fontSizes.base,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
    tokenText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text.tertiary,
      textAlign: 'center',
    },
    todoText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text.tertiary,
      textAlign: 'center',
      marginTop: theme.spacing.sm,
    },
  })
);