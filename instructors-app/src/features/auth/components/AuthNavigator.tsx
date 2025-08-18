import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@academy/mobile-shared';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import { ResetPasswordScreen } from '../screens/ResetPasswordScreen';
import { VerifyEmailScreen } from '../screens/VerifyEmailScreen';
import type { AuthStackParamList } from '../types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

/**
 * Authentication Navigator
 * 
 * Handles all authentication-related screens and flows:
 * - Login/Register
 * - Password reset
 * - Email verification
 * 
 * Features:
 * - Smooth slide transitions
 * - Custom header styling aligned with brand
 * - Keyboard-aware navigation
 * - Error handling integration
 */
export const AuthNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.background.primary,
        },
        headerTintColor: theme.colors.text.primary,
        headerTitleStyle: {
          fontWeight: theme.fontConfig.fontWeight.semibold,
          fontSize: theme.fontSizes.lg,
        },
        headerShadowVisible: false,
        animation: 'slide_from_right',
        contentStyle: {
          backgroundColor: theme.colors.background.primary,
        },
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: 'Sign In',
          headerShown: false, // Custom header in component
        }}
      />
      
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          title: 'Create Account',
          headerBackTitle: 'Back',
        }}
      />
      
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          title: 'Reset Password',
          headerBackTitle: 'Back',
        }}
      />
      
      <Stack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{
          title: 'New Password',
          headerBackTitle: 'Back',
        }}
      />
      
      <Stack.Screen
        name="VerifyEmail"
        component={VerifyEmailScreen}
        options={{
          title: 'Verify Email',
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
};