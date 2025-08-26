import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Alert, Pressable } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';

// Theme
import { useTheme, createThemedStyles } from '../../theme/ThemeProvider';

// Components
import { CustomInput } from '../forms/CustomInput';
import { CustomButton } from '../forms/CustomButton';
import { CustomCheckBox } from '../forms/CustomCheckBox';
import { SocialAuthGroup } from './SocialAuthButtons';

// Store
import { useAuthStore } from '../../store/authStore';

// Validation
import { validateEmail } from '../../utils/validators';

// Form Types
interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginFormProps {
  onForgotPassword?: () => void;
  onSignUp?: () => void;
  showRememberMe?: boolean;
  showSocialAuth?: boolean;
  showBypassLogin?: boolean;
  bypassLoginUserType?: 'student' | 'instructor';
  onLoginSuccess?: () => void;
  onLoginError?: (error: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = React.memo(({
  onForgotPassword,
  onSignUp,
  showRememberMe = true,
  showSocialAuth = true,
  showBypassLogin = true,
  bypassLoginUserType = 'student' as 'student' | 'instructor',
  onLoginSuccess,
  onLoginError,
}) => {
  const { theme } = useTheme();
  // const styles = useThemedStyles(); // TODO: Uncomment when StyleSheet mobile issue is resolved  
  
  // ========================================
  // TEMPORARY MOBILE FIX - SAME ISSUE AS OTHER COMPONENTS
  // ========================================
  // ISSUE: StyleSheet.create() works on web but not mobile
  // TODO: Remove this section when StyleSheet issue is resolved
  
  // TEMPORARY: Direct inline styles that mirror useThemedStyles()
  const styles = {
    container: {
      width: '100%' as const,
    },
    form: {
      gap: theme.spacing?.[4] || 16,
    },
    formActions: {
      gap: theme.spacing?.[3] || 12,
      marginTop: theme.spacing?.[2] || 8,
    },
    inputNoMargin: {
      marginBottom: 0,
    },
    forgotPassword: {
      alignSelf: 'flex-end' as const,
      marginBottom: theme.spacing?.[2] || 8,
    },
    forgotPasswordText: {
      color: theme.colors.interactive.primary,
      ...theme.typography?.body?.sm,
      fontWeight: theme.fontConfig?.fontWeight?.medium || '500',
    },
    registerSection: {
      flexDirection: 'row' as const,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      marginTop: theme.spacing?.[3] || 12,
    },
    registerText: {
      color: theme.colors.text.secondary,
      ...theme.typography?.body?.base,
    },
    registerLink: {
      color: theme.colors.interactive.primary,
      ...theme.typography?.body?.base,
      fontWeight: theme.fontConfig?.fontWeight?.medium || '500',
    },
    divider: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      marginVertical: theme.spacing?.[4] || 16,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.border.primary,
    },
    dividerText: {
      ...theme.typography?.caption?.base,
      color: theme.colors.text.tertiary,
      paddingHorizontal: theme.spacing?.[3] || 12,
      backgroundColor: theme.colors.background.elevated,
    },
    termsContainer: {
      marginTop: theme.spacing?.[4] || 16,
      paddingHorizontal: theme.spacing?.[2] || 8,
    },
    termsText: {
      textAlign: 'center' as const,
      color: theme.colors.text.tertiary,
      ...theme.typography?.caption?.base,
    },
  };
  
  const { bypassLogin, login, isLoading } = useAuthStore();

  // Login Form
  const loginForm = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    mode: 'onChange',
  });

  const onLoginSubmit = useCallback(async (data: LoginFormData): Promise<void> => {
    try {
      await login({ email: data.email, password: data.password });
      onLoginSuccess?.();
    } catch (error) {
      const errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
      onLoginError?.(errorMessage);
      Alert.alert('Connection Error', errorMessage, [{ text: 'OK' }]);
    }
  }, [login, onLoginSuccess, onLoginError]);

  const handleBypassLogin = useCallback(() => {
    bypassLogin(bypassLoginUserType);
    Alert.alert('Success', `Logged in as ${bypassLoginUserType} for development!`);
  }, [bypassLogin, bypassLoginUserType]);

  const handleSocialAuthSuccess = useCallback((provider: string, result: any) => {
    onLoginSuccess?.();
    Alert.alert('Social Login Success', `Logged in with ${provider}`);
  }, [onLoginSuccess]);

  const handleSocialAuthError = useCallback((provider: string, error: any) => {
    onLoginError?.(`Failed to login with ${provider}: ${error.message}`);
    Alert.alert('Social Login Error', `Failed to login with ${provider}: ${error.message}`);
  }, [onLoginError]);

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Controller
          control={loginForm.control}
          name="email"
          rules={{
            validate: validateEmail,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              name="email"
              label="Email Address"
              placeholder="Enter your email"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              startIcon={<Ionicons name="mail-outline" size={20} color={theme.colors.text.tertiary} />}
              error={loginForm.formState.errors.email?.message}
              containerStyle={styles.inputNoMargin}
            />
          )}
        />

        <Controller
          control={loginForm.control}
          name="password"
          rules={{
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              name="password"
              label="Password"
              placeholder="Enter your password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              showPasswordToggle={true}
              autoComplete="password"
              textContentType="password"
              startIcon={<Ionicons name="lock-closed-outline" size={20} color={theme.colors.text.tertiary} />}
              error={loginForm.formState.errors.password?.message}
              containerStyle={styles.inputNoMargin}
            />
          )}
        />

        {showRememberMe && (
          <Controller
            control={loginForm.control}
            name="rememberMe"
            render={({ field: { onChange, value } }) => (
              <CustomCheckBox
                label="Remember me"
                description="Keep me signed in on this device"
                value={value}
                onValueChange={onChange}
                variant="primary"
              />
            )}
          />
        )}

        {/* Forgot Password Link */}
        {onForgotPassword && (
          <Pressable
            onPress={onForgotPassword}
            style={styles.forgotPassword}
          >
            <Text style={styles.forgotPasswordText}>
              Forgot Password?
            </Text>
          </Pressable>
        )}

        <View style={styles.formActions}>
          <CustomButton
            title="Sign In"
            onPress={loginForm.handleSubmit(onLoginSubmit)}
            isLoading={isLoading || loginForm.formState.isSubmitting}
            disabled={!loginForm.formState.isValid || isLoading}
            startIcon={<Ionicons name="log-in-outline" size={16} color={theme.colors.text.inverse} />}
          />
          
          {showBypassLogin && (
            <CustomButton
              title="Bypass Login (Dev)"
              variant="gray"
              onPress={handleBypassLogin}
              startIcon={<Ionicons name="bug-outline" size={16} color={theme.colors.text.secondary} />}
            />
          )}
        </View>

        {/* Sign Up Link */}
        {onSignUp && (
          <View style={styles.registerSection}>
            <Text style={styles.registerText}>
              Don't have an account?{' '}
            </Text>
            <Pressable onPress={onSignUp}>
              <Text style={styles.registerLink}>
                Sign Up
              </Text>
            </Pressable>
          </View>
        )}

        {showSocialAuth && (
          <>
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            <SocialAuthGroup
              providers={['google', 'apple', 'facebook']}
              appleEnabled={true}
              googleClientId="demo-google-client-id"
              facebookAppId="demo-facebook-app-id"
              onAuthSuccess={handleSocialAuthSuccess}
              onAuthError={handleSocialAuthError}
              onGuestLogin={handleBypassLogin}
            />
          </>
        )}

        {/* Terms Agreement Text */}
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </View>
  );
});

// ========================================
// ORIGINAL STYLESHEET - WORKS ON WEB, NOT ON MOBILE
// ========================================
// TODO: Uncomment when mobile StyleSheet issue is resolved
/*
const useThemedStyles = createThemedStyles((theme) =>
  StyleSheet.create({
    container: {
      width: '100%',
    },

    form: {
      gap: theme.spacing[4],
    },

    formActions: {
      gap: theme.spacing[3],
      marginTop: theme.spacing[2],
    },

    inputNoMargin: {
      marginBottom: 0,
    },

    forgotPassword: {
      alignSelf: 'flex-end',
      marginBottom: theme.spacing[2],
    },

    forgotPasswordText: {
      color: theme.colors.interactive.primary,
      ...theme.typography.body.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },

    registerSection: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: theme.spacing[3],
    },

    registerText: {
      color: theme.colors.text.secondary,
      ...theme.typography.body.base,
    },

    registerLink: {
      color: theme.colors.interactive.primary,
      ...theme.typography.body.base,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },

    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: theme.spacing[4],
    },

    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.border.primary,
    },

    dividerText: {
      ...theme.typography.caption.base,
      color: theme.colors.text.tertiary,
      paddingHorizontal: theme.spacing[3],
      backgroundColor: theme.colors.background.elevated,
    },

    termsContainer: {
      marginTop: theme.spacing[4],
      paddingHorizontal: theme.spacing[2],
    },

    termsText: {
      textAlign: 'center',
      color: theme.colors.text.tertiary,
      ...theme.typography.caption.base,
    },
  })
);
*/