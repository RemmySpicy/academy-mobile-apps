import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { useScreenDimensions } from '../../hooks';

export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'outline' 
  | 'ghost' 
  | 'danger' 
  | 'success' 
  | 'warning' 
  | 'info'
  | 'academy';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  
  // Icons
  startIcon?: keyof typeof Ionicons.glyphMap;
  endIcon?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  
  // Styling
  fullWidth?: boolean;
  rounded?: boolean;
  shadow?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  
  // Loading
  loadingText?: string;
  loadingColor?: string;
  
  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  onPress,
  disabled = false,
  loading = false,
  startIcon,
  endIcon,
  iconSize,
  fullWidth = false,
  rounded = false,
  shadow = false,
  style,
  textStyle,
  loadingText,
  loadingColor,
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  const { theme } = useTheme();
  const { isTablet } = useScreenDimensions();
  const styles = createStyles(theme, isTablet);

  const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
    const baseStyles = {
      container: {} as ViewStyle,
      text: {} as TextStyle,
    };

    switch (variant) {
      case 'primary':
        return {
          container: {
            backgroundColor: theme.colors.interactive.primary,
            borderWidth: 0,
          },
          text: {
            color: theme.colors.text.inverse,
          },
        };

      case 'secondary':
        return {
          container: {
            backgroundColor: theme.colors.background.secondary,
            borderWidth: 1,
            borderColor: theme.colors.border.primary,
          },
          text: {
            color: theme.colors.text.primary,
          },
        };

      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: theme.colors.interactive.primary,
          },
          text: {
            color: theme.colors.interactive.primary,
          },
        };

      case 'ghost':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 0,
          },
          text: {
            color: theme.colors.interactive.primary,
          },
        };

      case 'danger':
        return {
          container: {
            backgroundColor: theme.colors.status.error,
            borderWidth: 0,
          },
          text: {
            color: theme.colors.text.inverse,
          },
        };

      case 'success':
        return {
          container: {
            backgroundColor: theme.colors.status.success,
            borderWidth: 0,
          },
          text: {
            color: theme.colors.text.inverse,
          },
        };

      case 'warning':
        return {
          container: {
            backgroundColor: theme.colors.status.warning,
            borderWidth: 0,
          },
          text: {
            color: theme.colors.text.primary,
          },
        };

      case 'info':
        return {
          container: {
            backgroundColor: theme.colors.interactive.primary + '20',
            borderWidth: 1,
            borderColor: theme.colors.interactive.primary + '40',
          },
          text: {
            color: theme.colors.interactive.primary,
          },
        };

      case 'academy':
        return {
          container: {
            backgroundColor: '#4F2EC9', // Academy purple
            borderWidth: 0,
          },
          text: {
            color: theme.colors.text.inverse,
          },
        };

      default:
        return baseStyles;
    }
  };

  const getSizeStyles = (): { container: ViewStyle; text: TextStyle; iconSize: number } => {
    const sizeConfig = {
      xs: {
        container: {
          paddingHorizontal: theme.spacing.sm,
          paddingVertical: theme.spacing.xs,
          minHeight: 32,
        },
        text: {
          fontSize: 14,
        },
        iconSize: 14,
      },
      sm: {
        container: {
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
          minHeight: 36,
        },
        text: {
          fontSize: 14,
        },
        iconSize: 16,
      },
      md: {
        container: {
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.md,
          minHeight: 44,
        },
        text: {
          fontSize: 16,
        },
        iconSize: 18,
      },
      lg: {
        container: {
          paddingHorizontal: theme.spacing.xl,
          paddingVertical: theme.spacing.lg,
          minHeight: 52,
        },
        text: {
          fontSize: 18,
        },
        iconSize: 20,
      },
      xl: {
        container: {
          paddingHorizontal: theme.spacing.xl,
          paddingVertical: theme.spacing.xl,
          minHeight: 60,
        },
        text: {
          fontSize: 20,
        },
        iconSize: 24,
      },
    };

    return sizeConfig[size];
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  const finalIconSize = iconSize || sizeStyles.iconSize;

  const containerStyle = [
    styles.container,
    sizeStyles.container,
    variantStyles.container,
    fullWidth && styles.fullWidth,
    rounded && styles.rounded,
    shadow && styles.shadow,
    disabled && styles.disabled,
    style,
  ].filter(Boolean);

  const finalTextStyle = [
    styles.text,
    sizeStyles.text,
    variantStyles.text,
    disabled && styles.disabledText,
    textStyle,
  ].filter(Boolean);

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            size="small" 
            color={loadingColor || variantStyles.text.color} 
          />
          {loadingText && (
            <Text style={[finalTextStyle, styles.loadingText]} allowFontScaling={false}>
              {loadingText}
            </Text>
          )}
        </View>
      );
    }

    return (
      <View style={styles.contentContainer}>
        {startIcon && (
          <Ionicons 
            name={startIcon} 
            size={finalIconSize} 
            color={variantStyles.text.color} 
            style={styles.startIcon}
          />
        )}
        
        <Text style={finalTextStyle} numberOfLines={1} allowFontScaling={false}>
          {title}
        </Text>
        
        {endIcon && (
          <Ionicons 
            name={endIcon} 
            size={finalIconSize} 
            color={variantStyles.text.color} 
            style={styles.endIcon}
          />
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading }}
      testID={testID}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const createStyles = (theme: any, isTablet: boolean) => StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    // Ensure proper touch target size on mobile
    minHeight: 44,
    // Platform-specific adjustments
    ...(Platform.OS === 'android' && {
      elevation: 0, // Remove default Android elevation
    }),
    ...(Platform.OS === 'ios' && {
      shadowOpacity: 0, // Remove default iOS shadow
    }),
  },
  fullWidth: {
    width: '100%',
  },
  rounded: {
    borderRadius: theme.borderRadius.full,
  },
  shadow: {
    shadowColor: theme.colors.shadow?.primary || '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: theme.fontConfig.fontWeight.semibold,
    textAlign: 'center',
    // Ensure text is visible on mobile
    color: theme.colors.text.primary,
    // Platform-specific text adjustments
    ...(Platform.OS === 'android' && {
      fontFamily: 'Roboto',
    }),
    ...(Platform.OS === 'ios' && {
      fontFamily: 'System',
    }),
  },
  disabledText: {
    opacity: 0.7,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  loadingText: {
    marginLeft: theme.spacing.sm,
  },
  startIcon: {
    marginRight: theme.spacing.sm,
  },
  endIcon: {
    marginLeft: theme.spacing.sm,
  },
});

export default Button;