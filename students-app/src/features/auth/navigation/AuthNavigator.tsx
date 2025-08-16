import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import { ResetPasswordScreen } from '../screens/ResetPasswordScreen';
import { VerifyEmailScreen } from '../screens/VerifyEmailScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import type { AuthStackParamList } from '../types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

/**
 * Authentication Navigator
 * 
 * Handles all authentication-related screens:
 * - Login/Register
 * - Password recovery
 * - Email verification
 * - User onboarding
 * - Role selection
 */
export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Login"
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
      />
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen}
      />
      <Stack.Screen 
        name="ResetPassword" 
        component={ResetPasswordScreen}
      />
      <Stack.Screen 
        name="VerifyEmail" 
        component={VerifyEmailScreen}
      />
      <Stack.Screen 
        name="OnboardingWelcome" 
        component={OnboardingScreen}
      />
    </Stack.Navigator>
  );
};