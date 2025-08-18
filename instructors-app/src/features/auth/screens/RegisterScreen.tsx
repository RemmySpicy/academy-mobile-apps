import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, createThemedStyles } from '@academy/mobile-shared';
import type { AuthNavigationProps } from '../types';

/**
 * Register Screen
 * 
 * TODO: Implement registration form with:
 * - User type selection (tutor, coordinator, program_admin)
 * - Form validation with react-hook-form + yup
 * - Program selection for coordinators/tutors
 * - Integration with shared authentication service
 */
export const RegisterScreen: React.FC<AuthNavigationProps<'Register'>> = ({
  navigation,
}) => {
  const { theme } = useTheme();
  const styles = useThemedStyles();
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Register Screen
        </Text>
        <Text style={styles.description}>
          This screen will contain the user registration form.
        </Text>
        <Text style={styles.todoText}>
          TODO: Implement registration functionality
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
    todoText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text.tertiary,
      textAlign: 'center',
    },
  })
);