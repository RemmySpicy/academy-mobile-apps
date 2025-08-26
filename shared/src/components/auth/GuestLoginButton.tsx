import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, createThemedStyles } from '../../theme/ThemeProvider';

export interface GuestLoginButtonProps {
  onPress?: () => void;
  text?: string;
  variant?: 'outline' | 'filled' | 'minimal';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: any;
  textStyle?: any;
  accessibilityLabel?: string;
}

export const GuestLoginButton: React.FC<GuestLoginButtonProps> = ({
  onPress,
  text = 'Continue as Guest',
  variant = 'outline',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
  accessibilityLabel,
}) => {
  const { theme } = useTheme();
  // const styles = useThemedStyles(); // TODO: Uncomment when StyleSheet mobile issue is resolved

  const getSizeConfig = () => {
    const sizes = {
      small: { 
        height: 36,
        paddingHorizontal: theme.spacing.md,
        fontSize: theme.fontSizes.sm
      },
      medium: { 
        height: 44,
        paddingHorizontal: theme.spacing.lg,
        fontSize: theme.fontSizes.base
      },
      large: { 
        height: 52,
        paddingHorizontal: theme.spacing.xl,
        fontSize: theme.fontSizes.lg
      },
    };
    return sizes[size];
  };

  const getVariantStyles = () => {
    const sizeConfig = getSizeConfig();
    
    const variants = {
      filled: {
        backgroundColor: theme.colors.interactive.secondary,
        borderColor: theme.colors.interactive.secondary,
        textColor: theme.colors.text.primary,
      },
      outline: {
        backgroundColor: theme.colors.background.primary,
        borderColor: theme.colors.border.secondary,
        textColor: theme.colors.text.secondary,
      },
      minimal: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        textColor: theme.colors.text.secondary,
      },
    };

    return {
      ...variants[variant],
      ...sizeConfig,
    };
  };

  const variantStyles = getVariantStyles();

  // ========================================
  // TEMPORARY MOBILE FIX - SAME ISSUE AS CustomButton
  // ========================================
  // ISSUE: StyleSheet.create() works on web but not mobile
  // TODO: Remove this section when StyleSheet issue is resolved
  
  // TEMPORARY: Direct button styles that mirror useThemedStyles()
  const dynamicButtonStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderRadius: theme.borderRadius.md,
    borderWidth: theme.borderWidth.sm,
    width: '100%' as const,
    overflow: 'hidden' as const, // CRITICAL: Clips ripple/press effects to rounded borders
    height: variantStyles.height,
    paddingHorizontal: variantStyles.paddingHorizontal,
    backgroundColor: variantStyles.backgroundColor,
    borderColor: variantStyles.borderColor,
  };

  const dynamicTextStyle = {
    ...theme.typography.body.base,
    fontWeight: theme.fontConfig.fontWeight.medium,
    textAlign: 'center' as const,
    fontSize: variantStyles.fontSize,
    color: variantStyles.textColor,
  };

  const dynamicIconStyle = {
    marginRight: theme.spacing.sm,
  };

  return (
    <Pressable style={[
        dynamicButtonStyle,
        disabled && { opacity: 0.6 }, // TEMPORARY: Direct style instead of styles.disabled
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || text}
      accessibilityState={{ disabled }}
      android_ripple={{ 
        color: 'rgba(0, 0, 0, 0.1)', // Subtle ripple for guest button
        borderless: false,
        radius: undefined, // Let it inherit container bounds
        foreground: true, // Ripple appears on top of content
      }}
      >
      <Ionicons
        name="person-outline"
        size={20}
        color={variantStyles.textColor}
        style={dynamicIconStyle} // TEMPORARY: Direct style instead of styles.icon
      />
      
      <Text
        style={[
          dynamicTextStyle, // TEMPORARY: Direct style instead of styles.text
          textStyle,
        ]}
      >
        {text}
      </Text>
    </Pressable>
  );
};

// ========================================
// ORIGINAL STYLESHEET - WORKS ON WEB, NOT ON MOBILE
// ========================================
// TODO: Uncomment when mobile StyleSheet issue is resolved
/*
const useThemedStyles = createThemedStyles((theme) =>
  StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.borderRadius.md,
      borderWidth: theme.borderWidth.sm,
      width: '100%',
    },
    icon: {
      marginRight: theme.spacing.sm,
    },
    text: {
      ...theme.typography.body.base,
      fontWeight: theme.fontConfig.fontWeight.medium,
      textAlign: 'center',
    },
    disabled: {
      opacity: 0.6,
    },
  })
);
*/

export default GuestLoginButton;