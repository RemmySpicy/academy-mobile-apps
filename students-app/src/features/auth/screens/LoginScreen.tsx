import React, { useMemo } from 'react';
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
 * Student Login Screen
 * 
 * Features using shared LoginForm component:
 * - Consistent form validation and UX across all Academy apps
 * - Student/Parent authentication
 * - Social authentication options
 * - Secure form validation
 * - Responsive design
 * - Accessibility compliance
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
                <Ionicons name="water" size={32} color="white" />
              </View>
              <Text style={styles.headerTitle}>
                Elitesgen Academy Students
              </Text>
              <Text style={styles.headerSubtitle}>
                Welcome back to your swimming journey
              </Text>
            </View>
          </LinearGradient>

          {/* Login Form */}
          <View style={styles.formContainer}>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeTitle}>
                Sign In to Continue
              </Text>
              <Text style={styles.welcomeSubtitle}>
                Access your courses, progress, and more
              </Text>
            </View>

            <LoginForm
              onForgotPassword={() => navigation.navigate('ForgotPassword')}
              onSignUp={() => navigation.navigate('Register')}
              showRememberMe={true}
              showSocialAuth={true}
              showBypassLogin={true}
              bypassLoginUserType="student"
              onLoginSuccess={() => {
                // Navigation handled by AppNavigator based on auth state
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

const useThemedStyles = createThemedStyles((theme) => StyleSheet.create({
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
      fontSize: theme.fontSizes.xl,
      fontWeight: theme.fontConfig.fontWeight.bold,
      marginBottom: theme.spacing.sm,
    },
    
    headerSubtitle: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: theme.fontSizes.base,
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
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      marginBottom: theme.spacing.sm,
    },
    
    welcomeSubtitle: {
      color: theme.colors.text.secondary,
      fontSize: theme.fontSizes.base,
    },
}));