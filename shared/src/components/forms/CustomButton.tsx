import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  ViewStyle, 
  TextStyle,
  View,
} from 'react-native';
import { useTheme, createThemedStyles } from '../../theme/ThemeProvider';

// Academy-specific button variants matching existing design
type ButtonVariant = 
  | 'primary'           // bg-theme (purple) with white text
  | 'outline'           // bg-[#F5F5F5] with theme-black text
  | 'outlineTheme'      // bg-white border border-theme with theme text
  | 'danger'            // bg-danger bg-opacity-10 text-danger
  | 'gray'              // bg-input-border-gray text-secondary
  | 'faded'             // bg-faded text-theme
  | 'orange'            // bg-theme-orange text-theme-black
  | 'lightGray'         // bg-gray-bg text-secondary
  | 'black'             // bg-theme-black text-white
  | 'cancel'            // bg-[#4F2EC9] bg-opacity-10 text-cancel
  | 'normal';           // bg-[#F5F5F5] bg-opacity-10 text-normal

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
  className?: string; // For compatibility with existing code
  textClassName?: string; // For compatibility with existing code
  
  // Shadow support (from existing design)
  shadow?: boolean;
  shadowColor?: string;
  shadowOpacity?: number;
  shadowOffset?: { width: number; height: number };
  shadowRadius?: number;
  
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
  className,
  textClassName,
  shadow = false,
  shadowColor = '#000',
  shadowOpacity = 0.2,
  shadowOffset = { width: 0, height: 2 },
  shadowRadius = 4,
  loaderColor = 'white',
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  const { theme } = useTheme();
  const styles = useThemedStyles();

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
      baseStyles.push({
        shadowColor,
        shadowOffset,
        shadowOpacity,
        shadowRadius,
        elevation: shadowRadius,
      });
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
      return <ActivityIndicator color={loaderColor} size={size === 'sm' ? 'small' : 'default'} />;
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
        <Text style={[...getTextStyles(), textStyle]}>
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
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[...getButtonStyles(), style]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || isLoading }}
      testID={testID}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const useThemedStyles = createThemedStyles((theme) =>
  StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      borderRadius: 25, // Matching existing rounded-[25px]
      position: 'relative',
    },

    // Size variants
    sm: {
      paddingHorizontal: theme.spacing[4], // px-4
      height: 36, // h-9 (9 * 4 = 36px)
      minHeight: 36,
    },

    md: {
      paddingHorizontal: theme.spacing[4], // px-4  
      height: 48, // h-12 (12 * 4 = 48px)
      minHeight: 48,
    },

    // Button variant backgrounds (matching existing design)
    primary: {
      backgroundColor: theme.colors.interactive.primary, // #4F2EC9
    },

    outline: {
      backgroundColor: '#F5F5F5', // Exact match from existing
    },

    outlineTheme: {
      backgroundColor: theme.colors.background.primary, // white
      borderWidth: 1,
      borderColor: theme.colors.interactive.primary, // #4F2EC9
    },

    danger: {
      backgroundColor: theme.colors.interactive.danger + '1A', // bg-opacity-10 = 10% = 1A in hex
    },

    gray: {
      backgroundColor: '#D7D7D7', // input_border_gray from existing
    },

    faded: {
      backgroundColor: theme.colors.interactive.faded, // #EAF4F4
    },

    orange: {
      backgroundColor: theme.colors.interactive.orange, // #FEAE24
    },

    lightGray: {
      backgroundColor: '#F9F9F9', // gray_bg from existing
    },

    black: {
      backgroundColor: theme.colors.interactive.themeBlack, // #121212
    },

    cancel: {
      backgroundColor: theme.colors.interactive.primary + '1A', // #4F2EC9 with 10% opacity
    },

    normal: {
      backgroundColor: '#F5F5F5' + '1A', // with 10% opacity
    },

    disabled: {
      backgroundColor: theme.colors.interactive.primaryDisabled,
      opacity: 0.6,
    },

    // Text styles for each variant
    text: {
      ...theme.typography.button.base,
      textAlign: 'center',
      fontWeight: theme.fontConfig.fontWeight.medium,
    },

    smText: {
      ...theme.typography.button.sm,
    },

    mdText: {
      ...theme.typography.button.base,
    },

    // Text colors for each variant (matching existing design)
    primaryText: {
      color: theme.colors.text.inverse, // white
    },

    outlineText: {
      color: theme.colors.interactive.themeBlack, // #121212
    },

    outlineThemeText: {
      color: theme.colors.interactive.primary, // #4F2EC9
    },

    dangerText: {
      color: theme.colors.text.inverse, // white (for danger buttons)
    },

    grayText: {
      color: theme.colors.text.secondary, // #5B5F5F
    },

    fadedText: {
      color: theme.colors.interactive.primary, // #4F2EC9
    },

    orangeText: {
      color: theme.colors.interactive.themeBlack, // #121212
    },

    lightGrayText: {
      color: theme.colors.text.secondary, // #5B5F5F
    },

    blackText: {
      color: theme.colors.text.inverse, // white
    },

    cancelText: {
      color: theme.colors.text.inverse, // white
    },

    normalText: {
      color: theme.colors.interactive.primary, // #4F2EC9
    },

    disabledText: {
      color: theme.colors.text.disabled,
    },

    // Icon containers (matching existing absolute positioning)
    startIconContainer: {
      position: 'absolute',
      left: theme.spacing[4], // left-4
    },

    endIconContainer: {
      position: 'absolute',
      right: theme.spacing[4], // right-4
    },
  })
);

export default CustomButton;