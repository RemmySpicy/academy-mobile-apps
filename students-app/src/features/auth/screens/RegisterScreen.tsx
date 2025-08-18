import React, { useState, useMemo } from 'react';
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

import { CustomInput, CustomButton, CustomCheckBox, SocialAuthButtons, validateEmail, useAuthStore, useTheme } from '@academy/mobile-shared';
import type { AuthNavigationProps } from '../types';

// Validation schema
const registerSchema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: yup
    .string()
    .required('Email is required')
    .test('valid-email', 'Please enter a valid email', validateEmail),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain uppercase, lowercase and number'
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^\+?[\d\s-()]+$/, 'Please enter a valid phone number'),
  acceptTerms: yup
    .boolean()
    .oneOf([true], 'You must accept the terms and conditions'),
});

type RegisterFormData = yup.InferType<typeof registerSchema>;

const createStyles = (theme: any) => StyleSheet.create({
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
    formContent: {
      gap: theme.spacing.lg,
    },
    nameRow: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    nameField: {
      flex: 1,
    },
    submitButton: {
      marginTop: theme.spacing.md,
    },
    socialContainer: {
      marginTop: theme.spacing.lg,
    },
    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.border.primary,
    },
    dividerText: {
      marginHorizontal: theme.spacing.md,
      color: theme.colors.text.secondary,
      fontSize: theme.fontSizes.sm,
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
 * Student Registration Screen
 * 
 * Features:
 * - Comprehensive form validation
 * - Social registration options
 * - Terms acceptance
 * - Role selection integration
 * - Responsive design
 */
export const RegisterScreen: React.FC<AuthNavigationProps<'Register'>> = ({
  navigation,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, isLoading } = useAuthStore();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const success = await register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone,
      });
      
      if (success) {
        navigation.navigate('VerifyEmail', { email: data.email });
      } else {
        Alert.alert(
          'Registration Failed',
          'An account with this email may already exist. Please try signing in instead.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert(
        'Registration Error',
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
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
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
                <Ionicons name="person-add" size={32} color="white" />
              </View>
              <Text style={styles.headerTitle}>
                Join Academy
              </Text>
              <Text style={styles.headerSubtitle}>
                Start your swimming journey today
              </Text>
            </View>
          </LinearGradient>

          {/* Registration Form */}
          <View style={styles.formContainer}>
            <View style={styles.formContent}>
              {/* Name Fields */}
              <View style={styles.nameRow}>
                <View style={styles.nameField}>
                  <CustomInput
                    name="firstName"
                    control={control}
                    placeholder="First name"
                    autoCapitalize="words"
                    variant="outline"
                    size="medium"
                  />
                </View>
                <View style={styles.nameField}>
                  <CustomInput
                    name="lastName"
                    control={control}
                    placeholder="Last name"
                    autoCapitalize="words"
                    variant="outline"
                    size="medium"
                  />
                </View>
              </View>

              {/* Email */}
              <CustomInput
                name="email"
                control={control}
                placeholder="Email address"
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon={<Ionicons name="mail-outline" size={20} color={theme.colors.text.tertiary} />}
                variant="outline"
              />

              {/* Phone */}
              <CustomInput
                name="phone"
                control={control}
                placeholder="Phone number"
                keyboardType="phone-pad"
                leftIcon={<Ionicons name="call-outline" size={20} color={theme.colors.text.tertiary} />}
                variant="outline"
              />

              {/* Password */}
              <CustomInput
                name="password"
                control={control}
                placeholder="Create password"
                secureTextEntry={!showPassword}
                showPasswordToggle
                leftIcon={<Ionicons name="lock-closed-outline" size={20} color={theme.colors.text.tertiary} />}
                variant="outline"
              />

              {/* Confirm Password */}
              <CustomInput
                name="confirmPassword"
                control={control}
                placeholder="Confirm password"
                secureTextEntry={!showConfirmPassword}
                showPasswordToggle
                leftIcon={<Ionicons name="lock-closed-outline" size={20} color={theme.colors.text.tertiary} />}
                variant="outline"
              />

              {/* Terms Checkbox */}
              <CustomCheckBox
                name="acceptTerms"
                control={control}
                label="I agree to the Terms of Service and Privacy Policy"
              />

              {/* Register Button */}
              <CustomButton
                title="Create Account"
                onPress={handleSubmit(onSubmit)}
                isLoading={isLoading}
                disabled={!isValid || isLoading}
                variant="primary"
                style={styles.submitButton}
              />

              {/* Social Registration */}
              <View style={styles.socialContainer}>
                <View style={styles.dividerContainer}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or sign up with</Text>
                  <View style={styles.dividerLine} />
                </View>
                
                <SocialAuthButtons
                  onGooglePress={() => console.log('Google registration')}
                  onApplePress={() => console.log('Apple registration')}
                  onFacebookPress={() => console.log('Facebook registration')}
                />
              </View>

              {/* Login Link */}
              <View style={styles.loginLinkContainer}>
                <Text style={styles.loginText}>
                  Already have an account?{' '}
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
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};