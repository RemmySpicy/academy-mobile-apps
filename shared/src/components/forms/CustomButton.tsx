import React from 'react';
import { 
  Pressable, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  ViewStyle, 
  TextStyle,
  View,
} from 'react-native';
import { useTheme, createThemedStyles } from '../../theme/ThemeProvider';
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
      paddingHorizontal: theme.spacing.md, // px-4
      height: 36, // h-9 (9 * 4 = 36px)
      minHeight: 36,
    },

    md: {
      paddingHorizontal: theme.spacing.md, // px-4  
      height: 48, // h-12 (12 * 4 = 48px)
      minHeight: 48,
    },

    // Button variant backgrounds (matching existing design)
    primary: {
      backgroundColor: theme.colors.interactive.primary, // #4F2EC9
    },

    teal: {
      backgroundColor: theme.colors.interactive.teal, // #52E2BB
    },

    outline: {
      backgroundColor: theme.colors.background.secondary,
    },

    outlineTheme: {
      backgroundColor: theme.colors.background.primary, // white
      borderWidth: 1,
      borderColor: theme.colors.interactive.primary, // #4F2EC9
    },

    outlineTeal: {
      backgroundColor: theme.colors.background.primary, // white
      borderWidth: 1,
      borderColor: theme.colors.interactive.teal, // #52E2BB
    },

    danger: {
      backgroundColor: theme.colors.interactive.danger + '1A', // bg-opacity-10 = 10% = 1A in hex
    },

    gray: {
      backgroundColor: theme.colors.border.primary,
    },

    faded: {
      backgroundColor: theme.colors.interactive.faded, // #EAF4F4
    },

    orange: {
      backgroundColor: theme.colors.interactive.orange, // #FEAE24
    },

    lightGray: {
      backgroundColor: theme.colors.background.secondary,
    },

    black: {
      backgroundColor: theme.colors.interactive.themeBlack, // #121212
    },

    cancel: {
      backgroundColor: theme.colors.interactive.primary + '1A', // #4F2EC9 with 10% opacity
    },

    normal: {
      backgroundColor: theme.colors.background.secondary + '1A', // with 10% opacity
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

    tealText: {
      color: theme.colors.text.inverse, // white
    },

    outlineText: {
      color: theme.colors.interactive.themeBlack, // #121212
    },

    outlineThemeText: {
      color: theme.colors.interactive.primary, // #4F2EC9
    },

    outlineTealText: {
      color: theme.colors.interactive.teal, // #52E2BB
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
      left: theme.spacing.md, // left-4
    },

    endIconContainer: {
      position: 'absolute',
      right: theme.spacing.md, // right-4
    },
  })
);

export { CustomButton };