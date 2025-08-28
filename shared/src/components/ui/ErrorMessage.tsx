import React from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Show } from './Show';
import { useTheme, createThemedStyles } from '../../theme';
import { themeUtils } from '../../theme';

export interface ErrorMessageProps {
  message?: string | string[] | null;
  title?: string;
  variant?: 'inline' | 'banner' | 'card' | 'minimal';
  severity?: 'error' | 'warning' | 'info';
  size?: 'small' | 'medium' | 'large';
  showIcon?: boolean;
  dismissible?: boolean;
  animated?: boolean;
  onDismiss?: () => void;
  onPress?: () => void;
  
  // Styling
  style?: any;
  textStyle?: any;
  containerStyle?: any;
  
  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
  
  // Action button
  actionLabel?: string;
  onActionPress?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  title,
  variant = 'inline',
  severity = 'error',
  size = 'medium',
  showIcon = true,
  dismissible = false,
  animated = true,
  onDismiss,
  onPress,
  style,
  textStyle,
  containerStyle,
  accessibilityLabel,
  accessibilityHint,
  testID,
  actionLabel,
  onActionPress,
}) => {
  const { theme } = useTheme();
  const styles = useThemedStyles();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(-10)).current;

  // Normalize message to array for consistent handling
  const messages = React.useMemo(() => {
    if (!message) return [];
    if (Array.isArray(message)) return message.filter(Boolean);
    return [message];
  }, [message]);

  // Don't render if no messages
  if (messages.length === 0) return null;

  // Animate entrance
  React.useEffect(() => {
    if (animated) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [animated, fadeAnim, slideAnim]);

  const handleDismiss = () => {
    if (!dismissible) return;

    if (animated) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -10,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onDismiss?.();
      });
    } else {
      onDismiss?.();
    }
  };

  const getConfig = () => {
    const configs = {
      error: {
        icon: 'warning-outline',
        iconColor: theme.colors.status.error,
        backgroundColor: theme.colors.status.errorBackground,
        borderColor: theme.colors.border.error,
        textColor: theme.colors.text.primary,
        titleColor: theme.colors.status.error,
      },
      warning: {
        icon: 'alert-circle-outline',
        iconColor: theme.colors.status.warning,
        backgroundColor: theme.colors.status.warningBackground,
        borderColor: theme.colors.status.warningBorder,
        textColor: theme.colors.text.primary,
        titleColor: theme.colors.status.warning,
      },
      info: {
        icon: 'information-circle-outline',
        iconColor: theme.colors.status.info,
        backgroundColor: theme.colors.status.infoBackground,
        borderColor: theme.colors.status.infoBorder,
        textColor: theme.colors.text.primary,
        titleColor: theme.colors.status.info,
      },
    };

    return configs[severity];
  };

  const getSizeConfig = () => {
    const sizes = {
      small: {
        fontSize: theme.typography.caption.base.fontSize,
        titleFontSize: theme.typography.caption.base.fontSize + 1,
        iconSize: 14,
        padding: theme.spacing[2],
        borderRadius: theme.borderRadius.sm,
      },
      medium: {
        fontSize: theme.typography.body.sm.fontSize,
        titleFontSize: theme.typography.body.base.fontSize,
        iconSize: 16,
        padding: theme.spacing[3],
        borderRadius: theme.borderRadius.md,
      },
      large: {
        fontSize: theme.typography.body.base.fontSize,
        titleFontSize: theme.typography.body.lg.fontSize,
        iconSize: 18,
        padding: theme.spacing[4],
        borderRadius: theme.borderRadius.lg,
      },
    };

    return sizes[size];
  };

  const getVariantStyles = () => {
    const config = getConfig();
    const sizeConfig = getSizeConfig();

    const variants = {
      inline: {
        container: {
          flexDirection: 'row' as const,
          alignItems: 'flex-start' as const,
          paddingVertical: 4,
        },
        content: {
          flex: 1,
        },
        text: {
          fontSize: sizeConfig.fontSize - 2,
          color: config.textColor,
          lineHeight: sizeConfig.fontSize + 2,
        },
      },
      banner: {
        container: {
          backgroundColor: config.backgroundColor,
          borderLeftWidth: 4,
          borderLeftColor: config.iconColor,
          padding: sizeConfig.padding,
          borderRadius: sizeConfig.borderRadius,
        },
        content: {
          flexDirection: 'row' as const,
          alignItems: 'flex-start' as const,
        },
        text: {
          fontSize: sizeConfig.fontSize,
          color: config.textColor,
          lineHeight: sizeConfig.fontSize + 4,
        },
      },
      card: {
        container: {
          backgroundColor: config.backgroundColor,
          borderWidth: 1,
          borderColor: config.borderColor,
          padding: sizeConfig.padding,
          borderRadius: sizeConfig.borderRadius,
          ...themeUtils.createShadow('md', theme.colors.shadow.default),
        },
        content: {
          flexDirection: 'row' as const,
          alignItems: 'flex-start' as const,
        },
        text: {
          fontSize: sizeConfig.fontSize,
          color: config.textColor,
          lineHeight: sizeConfig.fontSize + 4,
        },
      },
      minimal: {
        container: {
          flexDirection: 'row' as const,
          alignItems: 'flex-start' as const,
        },
        content: {
          flex: 1,
        },
        text: {
          fontSize: sizeConfig.fontSize,
          color: config.iconColor,
          lineHeight: sizeConfig.fontSize + 2,
        },
      },
    };

    return variants[variant];
  };

  const config = getConfig();
  const sizeConfig = getSizeConfig();
  const variantStyles = getVariantStyles();

  const containerStyle_ = [
    variantStyles.container,
    containerStyle,
    style,
  ];

  const animatedStyle = animated ? {
    opacity: fadeAnim,
    transform: [{ translateY: slideAnim }],
  } : {};

  const renderContent = () => (
    <View style={variantStyles.content}>
      <Show.When isTrue={showIcon}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={config.icon as any}
            size={sizeConfig.iconSize}
            color={config.iconColor}
          />
        </View>
      </Show.When>

      <View style={styles.textContainer}>
        <Show.When isTrue={!!title}>
          <Text
            style={[
              styles.title,
              {
                fontSize: sizeConfig.titleFontSize,
                color: config.titleColor,
                marginBottom: 2,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </Show.When>

        {messages.map((msg, index) => (
          <Text
            key={index}
            style={[
              variantStyles.text,
              textStyle,
              index > 0 && { marginTop: theme.spacing[0.5] },
            ]}
          >
            {msg}
          </Text>
        ))}

        <Show.When isTrue={!!actionLabel && !!onActionPress}>
          <Pressable 
            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }, styles.actionButton, { marginTop: theme.spacing[2] }]}
            onPress={onActionPress}
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.actionText,
                {
                  color: config.iconColor,
                  fontSize: sizeConfig.fontSize - 1,
                },
              ]}
            >
              {actionLabel}
            </Text>
          </Pressable>
        </Show.When>
      </View>

      <Show.When isTrue={dismissible}>
        <Pressable 
          style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }, styles.dismissButton]}
          onPress={handleDismiss}
          accessibilityRole="button"
          accessibilityLabel="Dismiss error message"
        >
          <Ionicons
            name="close-outline"
            size={sizeConfig.iconSize - 2}
            color={config.textColor}
          />
        </Pressable>
      </Show.When>
    </View>
  );

  const WrapperComponent = onPress ? Pressable : View;

  return (
    <Animated.View
      style={[containerStyle_, animatedStyle]}
      accessibilityRole="alert"
      accessibilityLabel={
        accessibilityLabel || 
        `${severity} message: ${messages.join(', ')}`
      }
      accessibilityHint={accessibilityHint}
      testID={testID}
    >
      <WrapperComponent
        onPress={onPress}
        style={variant === 'inline' ? undefined : styles.wrapper}
        disabled={!onPress}
      >
        {renderContent()}
      </WrapperComponent>
    </Animated.View>
  );
};

const useThemedStyles = createThemedStyles((theme) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
    },
    iconContainer: {
      marginRight: theme.spacing[2],
      marginTop: theme.spacing[0.5],
    },
    textContainer: {
      flex: 1,
    },
    title: {
      fontWeight: theme.fontConfig.fontWeight.semibold,
    },
    dismissButton: {
      padding: theme.spacing[1],
      marginLeft: theme.spacing[2],
      marginTop: -theme.spacing[0.5],
      minWidth: theme.safeArea.minTouchTarget.width,
      minHeight: theme.safeArea.minTouchTarget.height,
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionButton: {
      alignSelf: 'flex-start',
      marginTop: theme.spacing[2],
    },
    actionText: {
      fontWeight: theme.fontConfig.fontWeight.semibold,
      textDecorationLine: 'underline',
    },
  })
);

// Convenience components for different severities
export const ErrorAlert: React.FC<Omit<ErrorMessageProps, 'severity'>> = (props) => (
  <ErrorMessage {...props} severity="error" />
);

export const WarningAlert: React.FC<Omit<ErrorMessageProps, 'severity'>> = (props) => (
  <ErrorMessage {...props} severity="warning" />
);

export const InfoAlert: React.FC<Omit<ErrorMessageProps, 'severity'>> = (props) => (
  <ErrorMessage {...props} severity="info" />
);

// Hook for form error handling
export const useErrorMessage = () => {
  const [error, setError] = React.useState<string | string[] | null>(null);

  const showError = React.useCallback((message: string | string[]) => {
    setError(message);
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  const ErrorComponent = React.useCallback((props: Omit<ErrorMessageProps, 'message'>) => (
    <ErrorMessage {...props} message={error} />
  ), [error]);

  return {
    error,
    showError,
    clearError,
    ErrorComponent,
    hasError: !!error,
  };
};

export default ErrorMessage;