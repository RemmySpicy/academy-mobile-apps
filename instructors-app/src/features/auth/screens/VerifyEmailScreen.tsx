import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, createThemedStyles } from '@academy/mobile-shared';
import type { AuthNavigationProps } from '../types';

/**
 * Verify Email Screen
 * 
 * TODO: Implement email verification form
 */
export const VerifyEmailScreen: React.FC<AuthNavigationProps<'VerifyEmail'>> = ({
  navigation,
  route,
}) => {
  const { email } = route.params;
  const { theme } = useTheme();
  const styles = useThemedStyles();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Verify Email
        </Text>
        <Text style={styles.description}>
          Please check your email and enter the verification code sent to:
        </Text>
        <Text style={styles.email}>
          {email}
        </Text>
        <Text style={styles.todoText}>
          TODO: Implement email verification functionality
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
      paddingHorizontal: theme.spacing.lg,
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
    email: {
      fontSize: theme.fontSizes.base,
      color: theme.colors.interactive.accent,
      fontWeight: theme.fontConfig.fontWeight.medium,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
    todoText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text.tertiary,
      textAlign: 'center',
    },
  })
);