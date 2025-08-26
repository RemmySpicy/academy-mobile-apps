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

  // ========================================
  // TEMPORARY MOBILE FIX - TODO: REMOVE WHEN STYLESHEET ISSUE IS RESOLVED
  // ========================================
  // 
  // ISSUE: StyleSheet.create() works perfectly on web but styles don't render on mobile
  // ORIGINAL CODE: const styles = useMemo(() => createStyles(theme), [theme]);
  // 
  // TEMPORARY SOLUTION: Direct inline styles that preserve exact original styling
  // WHEN FIXING: Uncomment the StyleSheet.create section at bottom and remove this section
  // 
  // The inline styles below are a 1:1 mapping of the original StyleSheet variants
  // No visual changes - only the technical approach to applying styles
  const getVariantStyles = () => {
    // TEMPORARY: Maps exactly to createStyles() variants below
    // Each variant preserves original backgroundColor and textColor from StyleSheet
    const variantConfigs = {
      primary: {
        backgroundColor: theme.colors.interactive.primary,
        borderWidth: 0,
        borderColor: 'transparent',
        textColor: theme.colors.text.inverse,
      },
      teal: {
        backgroundColor: theme.colors.interactive.teal,
        borderWidth: 0,
        borderColor: 'transparent',
        textColor: theme.colors.text.inverse,
      },
      outline: {
        backgroundColor: theme.colors.background.secondary,
        borderWidth: 0,
        borderColor: 'transparent',
        textColor: theme.colors.interactive.themeBlack,
      },
      outlineTheme: {
        backgroundColor: theme.colors.background.primary,
        borderWidth: 1,
        borderColor: theme.colors.interactive.primary,
        textColor: theme.colors.interactive.primary,
      },
      outlineTeal: {
        backgroundColor: theme.colors.background.primary,
        borderWidth: 1,
        borderColor: theme.colors.interactive.teal,
        textColor: theme.colors.interactive.teal,
      },
      danger: {
        backgroundColor: theme.colors.interactive.danger,
        borderWidth: 0,
        borderColor: 'transparent',
        textColor: theme.colors.text.inverse,
      },
      gray: {
        backgroundColor: theme.colors.border.primary,
        borderWidth: 0,
        borderColor: 'transparent',
        textColor: theme.colors.text.secondary,
      },
      faded: {
        backgroundColor: theme.colors.interactive.faded,
        borderWidth: 0,
        borderColor: 'transparent',
        textColor: theme.colors.interactive.primary,
      },
      orange: {
        backgroundColor: theme.colors.interactive.orange,
        borderWidth: 0,
        borderColor: 'transparent',
        textColor: theme.colors.interactive.themeBlack,
      },
      lightGray: {
        backgroundColor: theme.colors.background.secondary,
        borderWidth: 0,
        borderColor: 'transparent',
        textColor: theme.colors.text.secondary,
      },
      black: {
        backgroundColor: theme.colors.interactive.themeBlack,
        borderWidth: 0,
        borderColor: 'transparent',
        textColor: theme.colors.text.inverse,
      },
      cancel: {
        backgroundColor: theme.colors.interactive.primary,
        borderWidth: 0,
        borderColor: 'transparent',
        textColor: theme.colors.text.inverse,
      },
      normal: {
        backgroundColor: theme.colors.background.secondary,
        borderWidth: 0,
        borderColor: 'transparent',
        textColor: theme.colors.interactive.primary,
      },
      secondary: {
        backgroundColor: theme.colors.background.secondary,
        borderWidth: 1,
        borderColor: theme.colors.border.primary,
        textColor: theme.colors.text.primary,
      },
      ghost: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        borderColor: 'transparent',
        textColor: theme.colors.interactive.primary,
      },
      success: {
        backgroundColor: theme.colors.status.success,
        borderWidth: 0,
        borderColor: 'transparent',
        textColor: theme.colors.text.inverse,
      },
      warning: {
        backgroundColor: theme.colors.status.warning,
        borderWidth: 0,
        borderColor: 'transparent',
        textColor: theme.colors.text.inverse,
      },
      info: {
        backgroundColor: theme.colors.status.info,
        borderWidth: 0,
        borderColor: 'transparent',
        textColor: theme.colors.text.inverse,
      },
    };
    
    return variantConfigs[variant as keyof typeof variantConfigs] || variantConfigs.primary;
  };

  const variantConfig = getVariantStyles();
  
  // TEMPORARY: Direct button styling that mirrors createStyles().button + size + variant
  const dynamicButtonStyle = {
    // Base button styles (from styles.button)
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    width: '100%' as const,
    borderRadius: 25, // Matching existing rounded-[25px]
    position: 'relative' as const,
    minHeight: 44,
    overflow: 'hidden' as const, // CRITICAL: Clips ripple/press effects to rounded borders
    
    // Size styles (from styles.sm/styles.md)
    height: size === 'sm' ? 36 : 48,
    paddingHorizontal: theme.spacing?.md || 16,
    
    // Variant styles (from styles[variant])
    backgroundColor: variantConfig.backgroundColor,
    borderWidth: variantConfig.borderWidth || 0,
    borderColor: variantConfig.borderColor || 'transparent',
    
    // Platform-specific adjustments (from original StyleSheet)
    ...(Platform.OS === 'android' && {
      elevation: 0, // Remove default Android elevation
    }),
    ...(Platform.OS === 'ios' && {
      shadowOpacity: 0, // Remove default iOS shadow
    }),
    ...(Platform.OS !== 'web' && {
      minWidth: 44,
      paddingVertical: 2,
    }),
    
    // Shadow handling (from themeUtils.createShadow)
    ...(shadow && !disabled && {
      shadowColor: theme.colors?.shadow?.default || 'rgba(0,0,0,0.1)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  };

  // TEMPORARY: Direct text styling that mirrors styles.text + styles[size]Text + styles[variant]Text
  const dynamicTextStyle = {
    // Base text styles (from styles.text)
    ...(theme.typography?.button?.base || {}),
    textAlign: 'center' as const,
    fontWeight: theme.fontConfig?.fontWeight?.medium || '500',
    
    // Size-specific text styles (from styles.smText/styles.mdText)
    fontSize: size === 'sm' 
      ? (theme.typography?.button?.sm?.fontSize || theme.fontSizes?.sm || 14)
      : (theme.typography?.button?.base?.fontSize || theme.fontSizes?.base || 16),
    lineHeight: size === 'sm'
      ? (theme.typography?.button?.sm?.lineHeight || theme.typography?.lineHeight?.small || 20)
      : (theme.typography?.button?.base?.lineHeight || theme.typography?.lineHeight?.body || 24),
    
    // Variant text color (from styles[variant]Text)
    color: variantConfig.textColor,
  };

  // Debug logging for mobile button styling issues
  if (Platform.OS !== 'web') {
    console.log(`🔍 CustomButton[${title}] PRESERVING ORIGINAL STYLES:`, {
      variant,
      size,
      backgroundColor: dynamicButtonStyle.backgroundColor,
      textColor: dynamicTextStyle.color,
      borderWidth: dynamicButtonStyle.borderWidth,
      borderColor: dynamicButtonStyle.borderColor,
    });
  }

  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator color={finalLoaderColor} size={size === 'sm' ? 'small' : 'large'} />;
    }

    return (
      <>
        {/* Start Icon at Far Left - matching existing pattern */}
        {startIcon && (
          <View style={{
            // TEMPORARY: Direct styles instead of styles.startIconContainer
            marginRight: theme.spacing?.xs || 4,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {startIcon}
          </View>
        )}
        
        {/* Centered Text */}
        <Text 
          style={[
            dynamicTextStyle, // TEMPORARY: Using direct styles instead of getTextStyles()
            textStyle
          ]}
          allowFontScaling={false}
        >
          {title}
        </Text>
        
        {/* End Icon at Far Right */}
        {endIcon && (
          <View style={{
            // TEMPORARY: Direct styles instead of styles.endIconContainer
            marginLeft: theme.spacing?.xs || 4,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
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
      style={[
        // TEMPORARY: Using direct styles instead of getButtonStyles()
        dynamicButtonStyle,
        disabled && { opacity: 0.6 }, // Mirrors styles.disabled
        style,
      ]}
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
// ORIGINAL STYLESHEET - WORKS ON WEB, NOT ON MOBILE  
// ========================================
//
// ISSUE: This StyleSheet.create approach works perfectly on web but styles don't render on mobile
// ROOT CAUSE: Unknown - possibly React Native StyleSheet processing difference on mobile
// INVESTIGATION NEEDED: Why StyleSheet.create fails to apply styles on mobile devices
//
// RESTORATION STEPS:
// 1. Investigate mobile StyleSheet.create issue
// 2. When fixed, uncomment this entire createStyles function
// 3. Restore: const styles = useMemo(() => createStyles(theme), [theme]);
// 4. Replace dynamicButtonStyle with: [...getButtonStyles(), style]
// 5. Replace dynamicTextStyle with: [...getTextStyles(), textStyle]  
// 6. Replace icon container direct styles with: styles.startIconContainer, styles.endIconContainer
// 7. Remove all temporary inline styling above
//
const createStyles = (theme: Theme) => {
  // COMMENTED OUT - ENABLE WHEN MOBILE STYLESHEET ISSUE IS RESOLVED
  // return StyleSheet.create({
  /*
  return StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRadius: 25, // Matching existing rounded-[25px]
    position: 'relative',
    // Ensure proper touch target size on mobile
    minHeight: 44,
    // Platform-specific adjustments
    ...(Platform.OS === 'android' && {
      elevation: 0, // Remove default Android elevation
    }),
    ...(Platform.OS === 'ios' && {
      shadowOpacity: 0, // Remove default iOS shadow
    }),
    // Mobile-specific improvements
    ...(Platform.OS !== 'web' && {
      // Ensure buttons are properly sized on mobile
      minWidth: 44,
      // Add some padding for better touch targets
      paddingVertical: 2,
    }),
  },

  // Size variants
  sm: {
    paddingHorizontal: theme.spacing.md, // px-4
    height: 36, // h-9 (9 * 4 = 36px)
    minHeight: 36,
    // Mobile-specific adjustments
    ...(Platform.OS !== 'web' && {
      minHeight: 44, // Ensure minimum touch target on mobile
    }),
  },

  md: {
    paddingHorizontal: theme.spacing.md, // px-4  
    height: 48, // h-12 (12 * 4 = 48px)
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

  // Text styles for each variant - using theme colors consistently
  text: {
    ...(theme.typography?.button?.base || {}),
    textAlign: 'center',
    fontWeight: theme.fontConfig.fontWeight.medium,
    fontSize: theme.typography?.button?.base?.fontSize || theme.fontSizes.base,
    lineHeight: theme.typography?.button?.base?.lineHeight || theme.lineHeights.base,
  },

  smText: {
    ...(theme.typography?.button?.sm || {}),
    fontSize: theme.typography?.button?.sm?.fontSize || theme.fontSizes.sm,
    lineHeight: theme.typography?.button?.sm?.lineHeight || theme.lineHeights.sm,
  },

  mdText: {
    ...(theme.typography?.button?.base || {}),
    fontSize: theme.typography?.button?.base?.fontSize || theme.fontSizes.base,
    lineHeight: theme.typography?.button?.base?.lineHeight || theme.lineHeights.base,
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
    marginRight: theme.spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },

  endIconContainer: {
    marginLeft: theme.spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
*/
// END OF COMMENTED STYLESHEET - UNCOMMENT ENTIRE SECTION WHEN MOBILE ISSUE IS RESOLVED
};