import React, { useState, useCallback } from 'react';
import { Pressable, Text, View, StyleSheet, ActivityIndicator, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as WebBrowser from 'expo-web-browser';
import { useAuthStore } from '../../store/authStore';
import { useNotifications } from '../../store/notificationStore';
import { CustomButton } from '../forms/CustomButton';
import { useTheme } from '../../theme/ThemeProvider';
import GuestLoginButton from './GuestLoginButton';

// Complete the auth session for web browser
WebBrowser.maybeCompleteAuthSession();

export interface SocialAuthConfig {
  // Google OAuth
  googleClientId?: string;
  googleClientIdIOS?: string;
  googleClientIdAndroid?: string;
  
  // Facebook OAuth
  facebookAppId?: string;
  
  // Apple OAuth (iOS only)
  appleEnabled?: boolean;
  
  // Custom handlers
  onGoogleAuth?: (token: string, userInfo: any) => Promise<void>;
  onAppleAuth?: (token: string, userInfo: any) => Promise<void>;
  onFacebookAuth?: (token: string, userInfo: any) => Promise<void>;
  
  // UI customization
  variant?: 'outline' | 'filled' | 'minimal';
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  disabled?: boolean;
}

export interface SocialAuthButtonProps extends SocialAuthConfig {
  provider: 'google' | 'apple' | 'facebook';
  onPress?: () => void;
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
  style?: any;
  textStyle?: any;
  accessibilityLabel?: string;
}

const SocialAuthButton: React.FC<SocialAuthButtonProps> = ({
  provider,
  variant = 'outline',
  size = 'medium',
  showText = true,
  disabled = false,
  onPress,
  onSuccess,
  onError,
  style,
  textStyle,
  accessibilityLabel,
  ...config
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { showError, showSuccess } = useNotifications();
  const loginWithSocial = useAuthStore((state) => state.loginWithSocial);
  const { theme } = useTheme();

  const getProviderConfig = () => {
    const configs = {
      google: {
        icon: 'logo-google' as any,
        text: 'Continue with Google',
        // Always use light background for Google for consistency across themes
        backgroundColor: theme.colors.background.secondary, // Lighter background for better contrast
        borderColor: theme.colors.border.primary,
        textColor: theme.colors.text.primary,
        iconSize: 20,
      },
      apple: {
        icon: 'logo-apple' as any,
        text: 'Continue with Apple',
        // Apple always uses high contrast - dark button with light text
        backgroundColor: theme.colors.interactive.themeBlack || '#000000',
        borderColor: theme.colors.interactive.themeBlack || '#000000',
        textColor: theme.colors.text.inverse,
        iconSize: 18,
      },
      facebook: {
        icon: 'logo-facebook' as any,
        text: 'Continue with Facebook',
        // Facebook gets consistent branding with proper dark mode support
        backgroundColor: theme.colors.background.secondary, // Light background
        borderColor: '#1877F2', // Facebook blue border
        textColor: '#1877F2', // Facebook blue text
        iconSize: 20,
      },
    };

    return configs[provider];
  };

  const handlePress = useCallback(async () => {
    if (disabled || isLoading) return;

    try {
      setIsLoading(true);
      onPress?.();

      let result;
      switch (provider) {
        case 'google':
          result = await handleGoogleAuth();
          break;
        case 'apple':
          result = await handleAppleAuth();
          break;
        case 'facebook':
          result = await handleFacebookAuth();
          break;
        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }

      if (result) {
        await loginWithSocial(provider, result.token, result.userInfo);
        onSuccess?.(result);
        showSuccess(`Successfully signed in with ${provider}`);
      }
    } catch (error: any) {
      console.error(`${provider} auth error:`, error);
      onError?.(error);
      
      if (error.code !== 'USER_CANCELLED') {
        showError(
          error.message || 
          `Failed to sign in with ${provider}. Please try again.`
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [provider, disabled, isLoading, onPress, onSuccess, onError]);

  const handleGoogleAuth = async () => {
    const clientIds = {
      iosClientId: config.googleClientIdIOS || config.googleClientId,
      androidClientId: config.googleClientIdAndroid || config.googleClientId,
      webClientId: config.googleClientId,
    };

    const [request, response, promptAsync] = Google.useAuthRequest(clientIds);

    const result = await promptAsync();
    
    if (result.type === 'success') {
      const { authentication } = result;
      
      // Fetch user info
      const userInfoResponse = await fetch(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${authentication?.accessToken}`
      );
      const userInfo = await userInfoResponse.json();

      if (config.onGoogleAuth) {
        await config.onGoogleAuth(authentication?.accessToken || '', userInfo);
      }

      return {
        token: authentication?.accessToken,
        userInfo,
      };
    }

    if (result.type === 'cancel') {
      throw new Error('USER_CANCELLED');
    }

    throw new Error('Google authentication failed');
  };

  const handleAppleAuth = async () => {
    if (Platform.OS !== 'ios') {
      throw new Error('Apple Sign In is only available on iOS');
    }

    // Check availability
    const isAvailable = await AppleAuthentication.isAvailableAsync();
    if (!isAvailable) {
      throw new Error('Apple Sign In is not available on this device');
    }

    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const userInfo = {
        id: credential.user,
        email: credential.email,
        name: credential.fullName
          ? `${credential.fullName.givenName || ''} ${credential.fullName.familyName || ''}`.trim()
          : null,
        firstName: credential.fullName?.givenName,
        lastName: credential.fullName?.familyName,
      };

      if (config.onAppleAuth) {
        await config.onAppleAuth(credential.identityToken || '', userInfo);
      }

      return {
        token: credential.identityToken,
        userInfo,
      };
    } catch (error: any) {
      if (error.code === 'ERR_CANCELED') {
        throw new Error('USER_CANCELLED');
      }
      throw error;
    }
  };

  const handleFacebookAuth = async () => {
    const [request, response, promptAsync] = Facebook.useAuthRequest({
      clientId: config.facebookAppId || '',
    });

    const result = await promptAsync();
    
    if (result.type === 'success') {
      const { authentication } = result;
      
      // Fetch user info
      const userInfoResponse = await fetch(
        `https://graph.facebook.com/me?access_token=${authentication?.accessToken}&fields=id,name,email,picture`
      );
      const userInfo = await userInfoResponse.json();

      if (config.onFacebookAuth) {
        await config.onFacebookAuth(authentication?.accessToken || '', userInfo);
      }

      return {
        token: authentication?.accessToken,
        userInfo,
      };
    }

    if (result.type === 'cancel') {
      throw new Error('USER_CANCELLED');
    }

    throw new Error('Facebook authentication failed');
  };

  const providerConfig = getProviderConfig();
  
  // ========================================
  // TEMPORARY MOBILE FIX - SAME ISSUE AS CustomButton
  // ========================================
  // ISSUE: StyleSheet.create() works on web but not mobile
  // SOLUTION: Direct inline styles that preserve original theme-based styling
  // TODO: Remove this section when StyleSheet issue is resolved
  
  // Debug mobile styling issues
  console.log(`🔍 SocialAuthButton[${provider}]:`, {
    variant,
    size,
    providerConfig: {
      backgroundColor: providerConfig.backgroundColor,
      borderColor: providerConfig.borderColor,
      textColor: providerConfig.textColor,
    },
    theme: {
      backgroundSecondary: theme.colors?.background?.secondary,
      borderPrimary: theme.colors?.border?.primary,
      textPrimary: theme.colors?.text?.primary,
      spacingMd: theme.spacing?.md,
      spacingLg: theme.spacing?.lg,
      borderRadiusMd: theme.borderRadius?.md,
      borderWidthSm: theme.borderWidth?.sm,
      fontSizesBase: theme.fontSizes?.base,
    }
  });

  // For Apple Sign In, use the native component on iOS
  if (provider === 'apple' && Platform.OS === 'ios' && config.appleEnabled) {
    return (
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
        buttonStyle={
          variant === 'filled' 
            ? AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
            : AppleAuthentication.AppleAuthenticationButtonStyle.WHITE_OUTLINE
        }
        cornerRadius={8}
        style={[{ height: 44, borderRadius: 8 }, style]}
        onPress={handlePress}
      />
    );
  }

  // TEMPORARY: Direct button styles that would normally come from getButtonStyles() function
  const dynamicButtonStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    height: size === 'small' ? 36 : size === 'large' ? 52 : 44,
    paddingHorizontal: size === 'small' ? (theme.spacing?.md || 16) : size === 'large' ? (theme.spacing?.xl || 32) : (theme.spacing?.lg || 24),
    borderRadius: theme.borderRadius?.md || 8,
    borderWidth: variant === 'outline' ? (theme.borderWidth?.sm || 1) : 0,
    borderColor: variant === 'outline' ? (providerConfig.borderColor || '#ccc') : 'transparent',
    backgroundColor: providerConfig.backgroundColor, // Preserves original theme-based colors
    overflow: 'hidden' as const, // CRITICAL: Clips ripple/press effects to rounded borders
    shadowColor: theme.colors?.shadow?.default || 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    minHeight: 44, // Ensure minimum touch target
    width: '100%', // Ensure full width
  };

  // TEMPORARY: Direct text styles that would normally come from StyleSheet
  const dynamicTextStyle = {
    fontSize: size === 'small' ? (theme.fontSizes?.sm || 14) : size === 'large' ? (theme.fontSizes?.lg || 18) : (theme.fontSizes?.base || 16),
    fontWeight: theme.fontConfig?.fontWeight?.semibold || '600',
    color: providerConfig.textColor, // Preserves original theme-based text colors
    textAlign: 'center' as const,
  };

  // Log styles being applied for debugging
  console.log(`🎯 SocialAuthButton[${provider}] FINAL STYLES:`, {
    backgroundColor: dynamicButtonStyle.backgroundColor,
    borderWidth: dynamicButtonStyle.borderWidth,
    borderColor: dynamicButtonStyle.borderColor,
    height: dynamicButtonStyle.height,
    paddingHorizontal: dynamicButtonStyle.paddingHorizontal,
    borderRadius: dynamicButtonStyle.borderRadius,
    textColor: dynamicTextStyle.color,
    fontSize: dynamicTextStyle.fontSize,
    platform: require('react-native').Platform.OS,
  });


  return (
    <Pressable 
      style={[
        dynamicButtonStyle,
        disabled && { opacity: 0.6 },
        style,
      ]}
      onPress={handlePress}
      disabled={disabled || isLoading}
      accessibilityRole="button"
      accessibilityLabel={
        accessibilityLabel || 
        `${providerConfig.text}${isLoading ? ', loading' : ''}`
      }
      accessibilityState={{ disabled: disabled || isLoading }}
      android_ripple={{ 
        color: 'rgba(0, 0, 0, 0.1)', // Subtle ripple for all social buttons
        borderless: false,
        radius: undefined, // Let it inherit container bounds
        foreground: true, // Ripple appears on top of content
      }}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={providerConfig.textColor}
          style={{ marginRight: showText ? theme.spacing.sm : 0 }}
        />
      ) : (
        <Ionicons
          name={providerConfig.icon}
          size={providerConfig.iconSize}
          color={providerConfig.textColor}
          style={{ marginRight: showText ? theme.spacing.sm : 0 }}
        />
      )}
      
      {showText && (
        <Text style={[dynamicTextStyle, textStyle]}>
          {isLoading ? 'Signing in...' : providerConfig.text}
        </Text>
      )}
    </Pressable>
  );
};


// Individual social auth button components
export const GoogleSignInButton: React.FC<Omit<SocialAuthButtonProps, 'provider'>> = (props) => (
  <SocialAuthButton {...props} provider="google" />
);

export const AppleSignInButton: React.FC<Omit<SocialAuthButtonProps, 'provider'>> = (props) => (
  <SocialAuthButton {...props} provider="apple" />
);

export const FacebookSignInButton: React.FC<Omit<SocialAuthButtonProps, 'provider'>> = (props) => (
  <SocialAuthButton {...props} provider="facebook" />
);

// Composite component with all social auth options
export interface SocialAuthGroupProps extends SocialAuthConfig {
  providers?: ('google' | 'apple' | 'facebook')[];
  onAuthSuccess?: (provider: string, result: any) => void;
  onAuthError?: (provider: string, error: any) => void;
  style?: any;
  buttonStyle?: any;
  spacing?: number;
  showGuestOption?: boolean;
  onGuestLogin?: () => void;
  guestButtonText?: string;
}

export const SocialAuthGroup: React.FC<SocialAuthGroupProps> = ({
  providers = ['google', 'apple', 'facebook'],
  onAuthSuccess,
  onAuthError,
  style,
  buttonStyle,
  spacing = 12,
  showGuestOption = true,
  onGuestLogin,
  guestButtonText = 'Continue as Guest',
  ...config
}) => {
  const availableProviders = providers.filter(provider => {
    if (provider === 'apple') {
      return Platform.OS === 'ios' && config.appleEnabled;
    }
    return true;
  });

  return (
    <View style={[{ gap: spacing }, style]}>
      {availableProviders.map((provider) => (
        <SocialAuthButton
          key={provider}
          provider={provider}
          {...config}
          style={buttonStyle}
          onSuccess={(result) => onAuthSuccess?.(provider, result)}
          onError={(error) => onAuthError?.(provider, error)}
        />
      ))}
      
      {showGuestOption && (
        <GuestLoginButton
          onPress={onGuestLogin}
          text={guestButtonText}
          variant="minimal"
          style={buttonStyle}
        />
      )}
    </View>
  );
};

export default SocialAuthButton;