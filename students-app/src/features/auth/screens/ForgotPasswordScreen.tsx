import React, { useMemo } from 'react';
import { View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Pressable,
  StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { CustomInput, CustomButton, validateEmail, useTheme } from '@academy/mobile-shared';
import type { AuthNavigationProps } from '../types';

const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .test('valid-email', 'Please enter a valid email', validateEmail),
});

type ForgotPasswordFormData = yup.InferType<typeof forgotPasswordSchema>;

const createStyles = (theme: any) =>
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
    gradient: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing['3xl'],
      paddingBottom: theme.spacing.xl,
      borderBottomLeftRadius: theme.borderRadius['3xl'],
      borderBottomRightRadius: theme.borderRadius['3xl'],
    },
    backButton: {
      marginBottom: theme.spacing.md,
    },
    headerContainer: {
      alignItems: 'center',
    },
    iconContainer: {
      backgroundColor: theme.colors.overlay.light,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.full,
      marginBottom: theme.spacing.md,
    },
    headerTitle: {
      color: 'white',
      fontSize: theme.fontSizes.xl,
      fontWeight: theme.fontConfig.fontWeight.bold,
      marginBottom: theme.spacing.xs,
    },
    headerSubtitle: {
      color: theme.colors.text.inverse,
      textAlign: 'center',
      fontSize: theme.fontSizes.base,
    },
    formContainer: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.xl,
    },
    submitButton: {
      marginTop: theme.spacing.lg,
    },
    loginLinkContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: theme.spacing.lg,
    },
    loginText: {
      color: theme.colors.text.secondary,
      fontSize: theme.fontSizes.base,
    },
    loginLink: {
      color: theme.colors.interactive.primary,
      fontSize: theme.fontSizes.base,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
});

/**
 * Forgot Password Screen
 * 
 * Allows users to request a password reset via email
 */
export const ForgotPasswordScreen: React.FC<AuthNavigationProps<'ForgotPassword'>> = ({
  navigation,
}) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Reset Link Sent',
        `We've sent a password reset link to ${data.email}. Please check your email and follow the instructions.`,
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Something went wrong. Please try again later.',
        [{ text: 'OK' }]
      );
    }
  };

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
        >
          <LinearGradient
            colors={[theme.colors.interactive.primary, theme.colors.interactive.accent]}
            style={styles.gradient}
          >
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </Pressable>
            
            <View style={styles.headerContainer}>
              <View style={styles.iconContainer}>
                <Ionicons name="key" size={32} color="white" />
              </View>
              <Text style={styles.headerTitle}>
                Forgot Password?
              </Text>
              <Text style={styles.headerSubtitle}>
                Enter your email and we'll send you a reset link
              </Text>
            </View>
          </LinearGradient>

          <View style={styles.formContainer}>
            <CustomInput
              name="email"
              control={control}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Ionicons name="mail-outline" size={20} color={theme.colors.text.tertiary} />}
              variant="outline"
            />

            <CustomButton
              title="Send Reset Link"
              onPress={handleSubmit(onSubmit)}
              variant="primary"
              style={styles.submitButton}
            />

            <View style={styles.loginLinkContainer}>
              <Text style={styles.loginText}>
                Remember your password?{' '}
              </Text>
              <Pressable
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.loginLink}>
                  Sign In
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};