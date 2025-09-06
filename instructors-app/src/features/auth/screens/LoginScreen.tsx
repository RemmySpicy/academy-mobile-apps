import React from 'react';
import { View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { LoginForm, useTheme, createThemedStyles } from '@academy/mobile-shared';
import type { AuthNavigationProps } from '../types';

/**
 * Login Screen
 * 
 * Secure authentication screen using shared LoginForm component with:
 * - Consistent form validation and UX across all Academy apps
 * - Integration with shared authentication service
 * - Responsive design for tablet and mobile
 * - Accessibility features
 * - Loading states and error handling
 * - Brand-consistent styling with instructor-specific branding
 */
export const LoginScreen: React.FC<AuthNavigationProps<'Login'>> = ({
  navigation,
}) => {
  const { theme } = useTheme();
  const styles = useThemedStyles();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header with Brand */}
          <LinearGradient
            colors={[theme.colors.interactive.primary, theme.colors.interactive.primaryPressed]}
            style={styles.header}
          >
            <View style={styles.headerContent}>
              <View style={styles.iconContainer}>
                <Ionicons name="school" size={32} color="white" />
              </View>
              <Text style={styles.headerTitle}>
                Elitesgen Academy Instructors
              </Text>
              <Text style={styles.headerSubtitle}>
                Sign in to manage your classes and students
              </Text>
            </View>
          </LinearGradient>

          {/* Login Form */}
          <View style={styles.formContainer}>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeTitle}>
                Welcome Back
              </Text>
              <Text style={styles.welcomeSubtitle}>
                Please sign in to your account
              </Text>
            </View>

            <LoginForm
              onForgotPassword={() => navigation.navigate('ForgotPassword')}
              onSignUp={() => navigation.navigate('Register')}
              showRememberMe={true}
              showSocialAuth={true}
              showBypassLogin={true}
              bypassLoginUserType="instructor"
              onLoginSuccess={() => {
                // Navigation will be handled automatically by AppNavigator
                // based on auth state change
              }}
              onLoginError={(error) => {
                console.error('Login error:', error);
              }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const useThemedStyles = createThemedStyles((theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    
    keyboardView: {
      flex: 1,
    },
    
    scrollView: {
      flex: 1,
    },
    
    header: {
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.xl,
      paddingBottom: theme.spacing.lg,
      borderBottomLeftRadius: theme.borderRadius.xl,
      borderBottomRightRadius: theme.borderRadius.xl,
    },
    
    headerContent: {
      alignItems: 'center',
    },
    
    iconContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      padding: theme.spacing.md,
      borderRadius: 50,
      marginBottom: theme.spacing.md,
    },
    
    headerTitle: {
      color: theme.colors.text.inverse,
      ...theme.typography.display.lg,
      fontWeight: theme.fontConfig.fontWeight.bold,
      marginBottom: theme.spacing.sm,
    },
    
    headerSubtitle: {
      color: 'rgba(255, 255, 255, 0.8)',
      ...theme.typography.body.base,
      textAlign: 'center',
    },
    
    formContainer: {
      flex: 1,
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.lg,
    },
    
    welcomeSection: {
      marginBottom: theme.spacing.lg,
    },
    
    welcomeTitle: {
      color: theme.colors.text.primary,
      ...theme.typography.heading.h2,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      marginBottom: theme.spacing.sm,
    },
    
    welcomeSubtitle: {
      color: theme.colors.text.secondary,
      ...theme.typography.body.base,
    },
  })
);