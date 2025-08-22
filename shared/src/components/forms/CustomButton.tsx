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
import { useTheme } from '../../theme';
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
  
  // Styling
  style?: ViewStyle;
  textStyle?: TextStyle;
  
  // Shadow support (uses theme elevation system)
  shadow?: boolean;
  
  // Loading
  loaderColor?: string;
  
  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
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
  shadow = false,
  loaderColor = 'white',
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  const { theme } = useTheme();
  
  // Debug logging for mobile issues
  if (Platform.OS !== 'web') {
    console.log('🔍 CustomButton render:', {
      title,
      variant,
      size,
      themeExists: !!theme,
      colorsExist: !!theme?.colors,
      primaryColor: theme?.colors?.interactive?.primary,
      textColor: theme?.colors?.text?.primary,
      backgroundColor: theme?.colors?.background?.primary,
      // Log the actual theme object structure
      themeKeys: theme ? Object.keys(theme) : 'NO_THEME',
      colorsKeys: theme?.colors ? Object.keys(theme.colors) : 'NO_COLORS',
      interactiveKeys: theme?.colors?.interactive ? Object.keys(theme.colors.interactive) : 'NO_INTERACTIVE',
    });
  }
  
  const styles = useMemo(() => createStyles(theme), [theme]);

  const getButtonStyles = () => {
    const baseStyles = [
      styles.button,
      styles[size],
      styles[variant],
    ];

    if (disabled) {
      baseStyles.push(styles.disabled);
    }

    if (shadow && !disabled) {
      const shadowStyle = themeUtils.createShadow('sm', theme.colors.shadow.default);
      baseStyles.push(shadowStyle as any);
    }

    return baseStyles;
  };

  const getTextStyles = () => {
    const baseStyles = [
      styles.text,
      styles[`${variant}Text`],
      styles[`${size}Text`],
    ];

    if (disabled) {
      baseStyles.push(styles.disabledText);
    }

    return baseStyles;
  };

  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator color={loaderColor} size={size === 'sm' ? 'small' : 'large'} />;
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
      style={({ pressed }) => [
        ...getButtonStyles(), 
        style,
        { 
          pointerEvents: (disabled || isLoading) ? 'none' : 'auto',
          opacity: pressed ? 0.8 : 1,
        }
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || isLoading }}
      testID={testID}
      android_ripple={{ 
        color: theme.colors.interactive.primaryPressed,
        borderless: false 
      }}
    >
      {renderContent()}
    </Pressable>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
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
    // Fallback styles to ensure visibility - ALWAYS show these
    backgroundColor: theme?.colors?.interactive?.primary || '#4F2EC9',
    borderWidth: 0,
    // Force visibility on mobile
    ...(Platform.OS !== 'web' && {
      backgroundColor: '#4F2EC9', // Force Academy purple
      borderWidth: 0,
    }),
  },

  // Size variants
  sm: {
    paddingHorizontal: theme?.spacing?.md || 16, // px-4
    height: 36, // h-9 (9 * 4 = 36px)
    minHeight: 36,
    // Mobile-specific adjustments
    ...(Platform.OS !== 'web' && {
      minHeight: 44, // Ensure minimum touch target on mobile
    }),
  },

  md: {
    paddingHorizontal: theme?.spacing?.md || 16, // px-4  
    height: 48, // h-12 (12 * 4 = 48px)
    minHeight: 48,
  },

  // Button variant backgrounds (matching existing design)
  primary: {
    backgroundColor: theme?.colors?.interactive?.primary || '#4F2EC9',
    // Force primary color on mobile
    ...(Platform.OS !== 'web' && {
      backgroundColor: '#4F2EC9',
    }),
  },

  teal: {
    backgroundColor: theme?.colors?.interactive?.teal || '#52E2BB',
    // Force teal color on mobile
    ...(Platform.OS !== 'web' && {
      backgroundColor: '#52E2BB',
    }),
  },

  outline: {
    backgroundColor: theme?.colors?.background?.secondary || '#F5F5F5',
    // Force outline color on mobile
    ...(Platform.OS !== 'web' && {
      backgroundColor: '#F5F5F5',
    }),
  },

  outlineTheme: {
    backgroundColor: theme?.colors?.background?.primary || '#FFFFFF',
    borderWidth: 1,
    borderColor: theme?.colors?.interactive?.primary || '#4F2EC9',
    // Force outline theme colors on mobile
    ...(Platform.OS !== 'web' && {
      backgroundColor: '#FFFFFF',
      borderColor: '#4F2EC9',
    }),
  },

  outlineTeal: {
    backgroundColor: theme?.colors?.background?.primary || '#FFFFFF',
    borderWidth: 1,
    borderColor: theme?.colors?.interactive?.teal || '#52E2BB',
    // Force outline teal colors on mobile
    ...(Platform.OS !== 'web' && {
      backgroundColor: '#FFFFFF',
      borderColor: '#52E2BB',
    }),
  },

  danger: {
    backgroundColor: (theme?.colors?.interactive?.danger || '#EE4A52') + '1A', // bg-opacity-10 = 10% = 1A in hex
    // Force danger color on mobile
    ...(Platform.OS !== 'web' && {
      backgroundColor: '#EE4A52',
    }),
  },

  gray: {
    backgroundColor: theme?.colors?.border?.primary || '#E5E5E5',
    // Force gray color on mobile
    ...(Platform.OS !== 'web' && {
      backgroundColor: '#E5E5E5',
    }),
  },

  faded: {
    backgroundColor: theme?.colors?.interactive?.faded || '#EAF4F4',
    // Force faded color on mobile
    ...(Platform.OS !== 'web' && {
      backgroundColor: '#EAF4F4',
    }),
  },

  orange: {
    backgroundColor: theme?.colors?.interactive?.orange || '#FEAE24',
    // Force orange color on mobile
    ...(Platform.OS !== 'web' && {
      backgroundColor: '#FEAE24',
    }),
  },

  lightGray: {
    backgroundColor: theme?.colors?.background?.secondary || '#FAFAFA',
    // Force light gray color on mobile
    ...(Platform.OS !== 'web' && {
      backgroundColor: '#FAFAFA',
    }),
  },

  black: {
    backgroundColor: theme?.colors?.interactive?.themeBlack || '#121212',
    // Force black color on mobile
    ...(Platform.OS !== 'web' && {
      backgroundColor: '#121212',
    }),
  },

  cancel: {
    backgroundColor: (theme?.colors?.interactive?.primary || '#4F2EC9') + '1A', // #4F2EC9 with 10% opacity
    // Force cancel color on mobile
    ...(Platform.OS !== 'web' && {
      backgroundColor: '#4F2EC9',
    }),
  },

  normal: {
    backgroundColor: (theme?.colors?.background?.secondary || '#F5F5F5') + '1A', // with 10% opacity
    // Force normal color on mobile
    ...(Platform.OS !== 'web' && {
      backgroundColor: '#F5F5F5',
    }),
  },

  // New enhanced variants from Enhanced Button - following Academy design system
  secondary: {
    backgroundColor: theme?.colors?.background?.secondary || '#FAFAFA',
    borderWidth: 1,
    borderColor: theme?.colors?.border?.primary || '#E5E5E5',
    // Force secondary colors on mobile
    ...(Platform.OS !== 'web' && {
      backgroundColor: '#FAFAFA',
      borderColor: '#E5E5E5',
    }),
  },

  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    // Transparent on all platforms
  },

  success: {
    backgroundColor: theme?.colors?.status?.success || '#059669',
    // Force success color on mobile
    ...(Platform.OS !== 'web' && {
      backgroundColor: '#059669',
    }),
  },

  warning: {
    backgroundColor: theme?.colors?.status?.warning || '#D97706',
    // Force warning color on mobile
    ...(Platform.OS !== 'web' && {
      backgroundColor: '#D97706',
    }),
  },

  info: {
    backgroundColor: theme?.colors?.status?.info || '#2563EB',
    // Force info color on mobile
    ...(Platform.OS !== 'web' && {
      backgroundColor: '#2563EB',
    }),
  },

  disabled: {
    backgroundColor: theme?.colors?.interactive?.primaryDisabled || '#D1D5DB',
    opacity: 0.6,
  },

  // Text styles for each variant
  text: {
    ...(theme?.typography?.button?.base || {}),
    textAlign: 'center',
    fontWeight: theme?.fontConfig?.fontWeight?.medium || '500',
    // Ensure text is visible on mobile
    color: theme?.colors?.text?.primary || '#000000',
    // Platform-specific text adjustments
    ...(Platform.OS === 'android' && {
      fontFamily: 'Roboto',
    }),
    ...(Platform.OS === 'ios' && {
      fontFamily: 'System',
    }),
    // Mobile-specific text improvements
    ...(Platform.OS !== 'web' && {
      // Ensure text is readable on mobile
      fontSize: Math.max((theme?.typography?.button?.base?.fontSize || 14), 14),
      lineHeight: Math.max((theme?.typography?.button?.base?.lineHeight || 20), 20),
      // Force text color on mobile
      color: '#FFFFFF', // Force white text for visibility
    }),
    // Fallback font size
    fontSize: theme?.typography?.button?.base?.fontSize || 14,
    lineHeight: theme?.typography?.button?.base?.lineHeight || 20,
  },

  smText: {
    ...(theme?.typography?.button?.sm || {}),
    // Mobile-specific adjustments
    ...(Platform.OS !== 'web' && {
      fontSize: Math.max((theme?.typography?.button?.sm?.fontSize || 12), 12),
      lineHeight: Math.max((theme?.typography?.button?.sm?.lineHeight || 16), 16),
      // Force text color on mobile
      color: '#FFFFFF',
    }),
    // Fallback font size
    fontSize: theme?.typography?.button?.sm?.fontSize || 12,
    lineHeight: theme?.typography?.button?.sm?.lineHeight || 16,
  },

  mdText: {
    ...(theme?.typography?.button?.base || {}),
    // Mobile-specific adjustments
    ...(Platform.OS !== 'web' && {
      fontSize: Math.max((theme?.typography?.button?.base?.fontSize || 14), 14),
      lineHeight: Math.max((theme?.typography?.button?.base?.lineHeight || 20), 20),
      // Force text color on mobile
      color: '#FFFFFF',
    }),
    // Fallback font size
    fontSize: theme?.typography?.button?.base?.fontSize || 14,
    lineHeight: theme?.typography?.button?.base?.lineHeight || 20,
  },

  // Text colors for each variant (matching existing design)
  primaryText: {
    color: theme?.colors?.text?.inverse || '#FFFFFF', // white
    // Force white text on mobile
    ...(Platform.OS !== 'web' && {
      color: '#FFFFFF',
    }),
  },

  tealText: {
    color: theme?.colors?.text?.inverse || '#FFFFFF', // white
    // Force white text on mobile
    ...(Platform.OS !== 'web' && {
      color: '#FFFFFF',
    }),
  },

  outlineText: {
    color: theme?.colors?.interactive?.themeBlack || '#121212',
    // Force dark text on mobile for outline buttons
    ...(Platform.OS !== 'web' && {
      color: '#121212',
    }),
  },

  outlineThemeText: {
    color: theme?.colors?.interactive?.primary || '#4F2EC9',
    // Force primary color text on mobile
    ...(Platform.OS !== 'web' && {
      color: '#4F2EC9',
    }),
  },

  outlineTealText: {
    color: theme?.colors?.interactive?.teal || '#52E2BB',
    // Force teal color text on mobile
    ...(Platform.OS !== 'web' && {
      color: '#52E2BB',
    }),
  },

  dangerText: {
    color: theme?.colors?.text?.inverse || '#FFFFFF', // white (for danger buttons)
    // Force white text on mobile
    ...(Platform.OS !== 'web' && {
      color: '#FFFFFF',
    }),
  },

  grayText: {
    color: theme?.colors?.text?.secondary || '#5B5F5F',
    // Force secondary text color on mobile
    ...(Platform.OS !== 'web' && {
      color: '#5B5F5F',
    }),
  },

  fadedText: {
    color: theme?.colors?.interactive?.primary || '#4F2EC9',
    // Force primary color text on mobile
    ...(Platform.OS !== 'web' && {
      color: '#4F2EC9',
    }),
  },

  orangeText: {
    color: theme?.colors?.interactive?.themeBlack || '#121212',
    // Force dark text on mobile
    ...(Platform.OS !== 'web' && {
      color: '#121212',
    }),
  },

  lightGrayText: {
    color: theme?.colors?.text?.secondary || '#5B5F5F',
    // Force secondary text color on mobile
    ...(Platform.OS !== 'web' && {
      color: '#5B5F5F',
    }),
  },

  blackText: {
    color: theme?.colors?.text?.inverse || '#FFFFFF',
    // Force white text on mobile
    ...(Platform.OS !== 'web' && {
      color: '#FFFFFF',
    }),
  },

  cancelText: {
    color: theme?.colors?.text?.inverse || '#FFFFFF',
    // Force white text on mobile
    ...(Platform.OS !== 'web' && {
      color: '#FFFFFF',
    }),
  },

  normalText: {
    color: theme?.colors?.interactive?.primary || '#4F2EC9',
    // Force primary color text on mobile
    ...(Platform.OS !== 'web' && {
      color: '#4F2EC9',
    }),
  },

  // Text styles for new enhanced variants
  secondaryText: {
    color: theme?.colors?.text?.primary || '#111827',
    // Force dark text on mobile for secondary buttons
    ...(Platform.OS !== 'web' && {
      color: '#111827',
    }),
  },

  ghostText: {
    color: theme?.colors?.interactive?.primary || '#4F2EC9',
    // Force primary color text on mobile for ghost buttons
    ...(Platform.OS !== 'web' && {
      color: '#4F2EC9',
    }),
  },

  successText: {
    color: theme?.colors?.text?.inverse || '#FFFFFF',
    // Force white text on mobile for success buttons
    ...(Platform.OS !== 'web' && {
      color: '#FFFFFF',
    }),
  },

  warningText: {
    color: theme?.colors?.text?.inverse || '#FFFFFF', 
    // Force white text on mobile for warning buttons
    ...(Platform.OS !== 'web' && {
      color: '#FFFFFF',
    }),
  },

  infoText: {
    color: theme?.colors?.text?.inverse || '#FFFFFF',
    // Force white text on mobile for info buttons
    ...(Platform.OS !== 'web' && {
      color: '#FFFFFF',
    }),
  },

  disabledText: {
    color: theme?.colors?.text?.disabled || '#9CA3AF',
  },

  // Icon containers (matching existing absolute positioning)
  startIconContainer: {
    position: 'absolute',
    left: theme?.spacing?.md || 16, // left-4
  },

  endIconContainer: {
    position: 'absolute',
    right: theme?.spacing?.md || 16, // right-4
  },
});

export { CustomButton };