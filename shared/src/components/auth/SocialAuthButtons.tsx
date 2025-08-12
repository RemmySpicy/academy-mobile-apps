import React, { useState, useCallback } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as WebBrowser from 'expo-web-browser';
import { useAuthStore } from '../../store/authStore';
import { useNotifications } from '../../store/notificationStore';
import CustomButton from '../forms/CustomButton';

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
  const { loginWithSocial } = useAuthStore();

  const getProviderConfig = () => {
    const configs = {
      google: {
        icon: 'logos:google-icon',
        text: 'Continue with Google',
        backgroundColor: '#FFFFFF',
        borderColor: '#DADCE0',
        textColor: '#3C4043',
        iconSize: 20,
      },
      apple: {
        icon: 'logos:apple',
        text: 'Continue with Apple',
        backgroundColor: '#000000',
        borderColor: '#000000',
        textColor: '#FFFFFF',
        iconSize: 18,
      },
      facebook: {
        icon: 'logos:facebook',
        text: 'Continue with Facebook',
        backgroundColor: '#1877F2',
        borderColor: '#1877F2',
        textColor: '#FFFFFF',
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
  const buttonStyles = getButtonStyles(variant, size, providerConfig);

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
        style={[buttonStyles.button, style]}
        onPress={handlePress}
        disabled={disabled || isLoading}
      />
    );
  }

  return (
    <TouchableOpacity
      style={[buttonStyles.button, disabled && buttonStyles.disabled, style]}
      onPress={handlePress}
      disabled={disabled || isLoading}
      accessibilityRole="button"
      accessibilityLabel={
        accessibilityLabel || 
        `${providerConfig.text}${isLoading ? ', loading' : ''}`
      }
      accessibilityState={{ disabled: disabled || isLoading }}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={providerConfig.textColor}
          style={{ marginRight: showText ? 12 : 0 }}
        />
      ) : (
        <Ionicons
          name={providerConfig.icon}
          size={providerConfig.iconSize}
          style={{ marginRight: showText ? 12 : 0 }}
        />
      )}
      
      {showText && (
        <Text style={[buttonStyles.text, textStyle]}>
          {isLoading ? 'Signing in...' : providerConfig.text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const getButtonStyles = (variant: string, size: string, config: any) => {
  const sizes = {
    small: { height: 40, paddingHorizontal: 16, fontSize: 14 },
    medium: { height: 48, paddingHorizontal: 20, fontSize: 16 },
    large: { height: 56, paddingHorizontal: 24, fontSize: 18 },
  };

  const sizeConfig = sizes[size as keyof typeof sizes];

  return StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: sizeConfig.height,
      paddingHorizontal: sizeConfig.paddingHorizontal,
      borderRadius: 8,
      borderWidth: variant === 'outline' ? 1 : 0,
      borderColor: variant === 'outline' ? config.borderColor : 'transparent',
      backgroundColor: 
        variant === 'filled' ? config.backgroundColor :
        variant === 'outline' ? '#FFFFFF' : 
        'transparent',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    text: {
      fontSize: sizeConfig.fontSize,
      fontWeight: '600',
      color: 
        variant === 'filled' ? config.textColor :
        variant === 'outline' ? config.textColor :
        config.textColor,
    },
    disabled: {
      opacity: 0.6,
    },
  });
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
}

export const SocialAuthGroup: React.FC<SocialAuthGroupProps> = ({
  providers = ['google', 'apple', 'facebook'],
  onAuthSuccess,
  onAuthError,
  style,
  buttonStyle,
  spacing = 12,
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
    </View>
  );
};

export default SocialAuthButton;