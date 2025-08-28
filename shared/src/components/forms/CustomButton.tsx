import React, { useMemo } from 'react';
import { 
  Pressable, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  ViewStyle, 
  TextStyle,
  View,
  Platform,
} from 'react-native';
import { useTheme, Theme } from '../../theme';
import { themeUtils } from '../../theme';
import { useStyleSheet, useStyleDebug } from '../../hooks/useComponentStyles';


// Academy-specific button variants matching existing design
type ButtonVariant = 
  | 'primary'           // bg-theme (purple) with white text
  | 'teal'              // bg-academy-teal (#52E2BB) with white text
  | 'outline'           // bg-[#F5F5F5] with theme-black text
  | 'outlineTheme'      // bg-white border border-theme with theme text
  | 'outlineTeal'       // bg-white border border-teal with teal text
  | 'danger'            // bg-danger bg-opacity-10 text-danger
  | 'gray'              // bg-input-border-gray text-secondary
  | 'faded'             // bg-faded text-theme
  | 'orange'            // bg-theme-orange text-theme-black
  | 'lightGray'         // bg-gray-bg text-secondary
  | 'black'             // bg-theme-black text-white
  | 'cancel'            // bg-[#4F2EC9] bg-opacity-10 text-cancel
  | 'normal'            // bg-[#F5F5F5] bg-opacity-10 text-normal
  // New enhanced variants from Enhanced Button
  | 'secondary'         // Clean neutral button with light background
  | 'ghost'             // Transparent background, useful for subtle actions
  | 'success'           // Green variant for positive actions
  | 'warning'           // Amber variant for caution actions
  | 'info';             // Light blue variant for informational actions

type ButtonSize = 'sm' | 'md';

interface CustomButtonProps {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  isLoading?: boolean;
  
  // Icons (matching existing pattern)
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  
  // Style overrides
  style?: ViewStyle;
  textStyle?: TextStyle;
  
  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
  
  // Additional props
  shadow?: boolean;
  loaderColor?: string;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  isLoading = false,
  startIcon,
  endIcon,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
  testID,
  shadow = false,
  loaderColor,
}) => {
  const { theme } = useTheme();
  
  // Debug styling issues in development
  useStyleDebug('CustomButton', __DEV__ && Platform.OS !== 'web');
  
  // Use the production-ready styling hook that fixes mobile compatibility
  const styles = useStyleSheet((theme, screenDimensions) => createStyles(theme, screenDimensions), [variant, size, shadow, disabled]);

  // Set loader color based on variant
  const defaultLoaderColor = useMemo(() => {
    switch (variant) {
      case 'primary':
      case 'teal':
      case 'success':
      case 'warning':
      case 'info':
      case 'danger':
      case 'black':
      case 'cancel':
        return theme.colors.text.inverse;
      default:
        return theme.colors.interactive.primary;
    }
  }, [variant, theme]);

  const finalLoaderColor = loaderColor || defaultLoaderColor;

  // Helper functions to get computed styles from the StyleSheet
  const getButtonStyles = () => [
    styles.button,
    styles[size],
    styles[variant],
    shadow && !disabled && styles.shadow,
    disabled && styles.disabled,
  ];

  const getTextStyles = () => [
    styles.text,
    styles[`${size}Text`],
    styles[`${variant}Text`],
    disabled && styles.disabledText,
  ];

  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator color={finalLoaderColor} size={size === 'sm' ? 'small' : 'large'} />;
    }

    return (
      <>
        {/* Start Icon at Far Left - matching existing pattern */}
        {startIcon && (
          <View style={styles.startIconContainer}>
            {startIcon}
          </View>
        )}
        
        {/* Centered Text */}
        <Text 
          style={[...getTextStyles(), textStyle]}
          allowFontScaling={false}
        >
          {title}
        </Text>
        
        {/* End Icon at Far Right */}
        {endIcon && (
          <View style={styles.endIconContainer}>
            {endIcon}
          </View>
        )}
      </>
    );
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[...getButtonStyles(), style]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || isLoading }}
      testID={testID}
      android_ripple={{ 
        color: theme.colors?.interactive?.primaryPressed || 'rgba(79, 46, 201, 0.3)',
        borderless: false,
        radius: undefined, // Let it inherit container bounds 
        foreground: true, // Ripple appears on top of content
      }}
    >
      {renderContent()}
    </Pressable>
  );
};

// ========================================
// PRODUCTION-READY STYLESHEET - FIXED FOR MOBILE COMPATIBILITY  
// ========================================
//
// FIXED: Mobile StyleSheet compatibility using useStyleSheet hook
// SOLUTION: Enhanced styling approach that works across web and mobile
// FEATURES: Real device dimensions, responsive breakpoints, platform optimization
//
const createStyles = (theme: Theme, screenDimensions: any) => {
  return {
    button: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      width: '100%' as const,
      borderRadius: 25, // Matching existing rounded-[25px]
      position: 'relative' as const,
      overflow: 'hidden' as const, // Clips ripple/press effects to rounded borders
      // Ensure proper touch target size on mobile
      minHeight: 44,
      // Platform-specific adjustments
      ...(Platform.OS === 'android' && {
        elevation: 0, // Remove default Android elevation
      }),
      ...(Platform.OS === 'ios' && {
        shadowOpacity: 0, // Remove default iOS shadow
      }),
      // Mobile-specific improvements with real screen dimensions
      ...(Platform.OS !== 'web' && {
        minWidth: Math.max(44, screenDimensions.width * 0.1), // Responsive minimum width
        paddingVertical: 2,
      }),
    },

    // Size variants with responsive adjustments
    sm: {
      paddingHorizontal: theme.spacing.md,
      height: screenDimensions.isPhone ? 40 : 36, // Slightly larger on phones
      minHeight: screenDimensions.isPhone ? 44 : 36,
    },

    md: {
      paddingHorizontal: theme.spacing.md,
      height: screenDimensions.isPhone ? 48 : 44, // Responsive sizing
      minHeight: 48,
    },

  // Button variant backgrounds - using theme colors consistently
  primary: {
    backgroundColor: theme.colors.interactive.primary,
  },

  teal: {
    backgroundColor: theme.colors.interactive.teal,
  },

  outline: {
    backgroundColor: theme.colors.background.secondary,
  },

  outlineTheme: {
    backgroundColor: theme.colors.background.primary,
    borderWidth: 1,
    borderColor: theme.colors.interactive.primary,
  },

  outlineTeal: {
    backgroundColor: theme.colors.background.primary,
    borderWidth: 1,
    borderColor: theme.colors.interactive.teal,
  },

  danger: {
    backgroundColor: theme.colors.interactive.danger,
  },

  gray: {
    backgroundColor: theme.colors.border.primary,
  },

  faded: {
    backgroundColor: theme.colors.interactive.faded,
  },

  orange: {
    backgroundColor: theme.colors.interactive.orange,
  },

  lightGray: {
    backgroundColor: theme.colors.background.secondary,
  },

  black: {
    backgroundColor: theme.colors.interactive.themeBlack,
  },

  cancel: {
    backgroundColor: theme.colors.interactive.primary,
  },

  normal: {
    backgroundColor: theme.colors.background.secondary,
  },

  // New enhanced variants
  secondary: {
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },

  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },

  success: {
    backgroundColor: theme.colors.status.success,
  },

  warning: {
    backgroundColor: theme.colors.status.warning,
  },

  info: {
    backgroundColor: theme.colors.status.info,
  },

    disabled: {
      backgroundColor: theme.colors.interactive.primaryDisabled,
      opacity: 0.6,
    },

    // Shadow style for buttons with shadow prop
    shadow: {
      shadowColor: theme.colors.shadow.default,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },

    // Text styles for each variant - using theme colors consistently
    text: {
      ...(theme.typography?.button?.base || {}),
      textAlign: 'center' as const,
      fontWeight: theme.fontConfig.fontWeight.medium,
      fontSize: theme.typography?.button?.base?.fontSize || theme.fontSizes.base,
      lineHeight: theme.typography?.button?.base?.lineHeight || theme.lineHeights.normal,
    },

    smText: {
      ...(theme.typography?.button?.sm || {}),
      fontSize: theme.typography?.button?.sm?.fontSize || theme.fontSizes.sm,
      lineHeight: theme.typography?.button?.sm?.lineHeight || theme.lineHeights.tight,
    },

    mdText: {
      ...(theme.typography?.button?.base || {}),
      fontSize: theme.typography?.button?.base?.fontSize || theme.fontSizes.base,
      lineHeight: theme.typography?.button?.base?.lineHeight || theme.lineHeights.normal,
    },

  // Text colors for each variant using theme
  primaryText: {
    color: theme.colors.text.inverse,
  },

  tealText: {
    color: theme.colors.text.inverse,
  },

  outlineText: {
    color: theme.colors.interactive.themeBlack,
  },

  outlineThemeText: {
    color: theme.colors.interactive.primary,
  },

  outlineTealText: {
    color: theme.colors.interactive.teal,
  },

  dangerText: {
    color: theme.colors.text.inverse,
  },

  grayText: {
    color: theme.colors.text.secondary,
  },

  fadedText: {
    color: theme.colors.interactive.primary,
  },

  orangeText: {
    color: theme.colors.interactive.themeBlack,
  },

  lightGrayText: {
    color: theme.colors.text.secondary,
  },

  blackText: {
    color: theme.colors.text.inverse,
  },

  cancelText: {
    color: theme.colors.text.inverse,
  },

  normalText: {
    color: theme.colors.interactive.primary,
  },

  // Text styles for new enhanced variants
  secondaryText: {
    color: theme.colors.text.primary,
  },

  ghostText: {
    color: theme.colors.interactive.primary,
  },

  successText: {
    color: theme.colors.text.inverse,
  },

  warningText: {
    color: theme.colors.text.inverse,
  },

  infoText: {
    color: theme.colors.text.inverse,
  },

  disabledText: {
    color: theme.colors.text.disabled,
    opacity: 1, // Don't double-apply opacity
  },

    // Icon container styles
    startIconContainer: {
      flexDirection: 'column' as const,
      marginRight: theme.spacing.xs,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },

    endIconContainer: {
      flexDirection: 'column' as const,
      marginLeft: theme.spacing.xs,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
  };
};