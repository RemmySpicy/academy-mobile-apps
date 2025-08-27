import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, createThemedStyles } from '@academy/mobile-shared';
import type { AuthNavigationProps } from '../types';

/**
 * Forgot Password Screen
 * 
 * TODO: Implement password reset request form
 */
export const ForgotPasswordScreen: React.FC<AuthNavigationProps<'ForgotPassword'>> = ({
  navigation,
}) => {
  const { theme } = useTheme();
  const styles = useThemedStyles();
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Forgot Password
        </Text>
        <Text style={styles.description}>
          Enter your email to reset your password.
        </Text>
        <Text style={styles.todoText}>
          TODO: Implement forgot password functionality
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
    todoText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text.tertiary,
      textAlign: 'center',
    },
  })
);