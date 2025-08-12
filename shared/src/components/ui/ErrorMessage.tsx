import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Show } from './Show';

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
        icon: 'ri:error-warning-line',
        iconColor: '#EF4444',
        backgroundColor: '#FEF2F2',
        borderColor: '#FECACA',
        textColor: '#991B1B',
        titleColor: '#7F1D1D',
      },
      warning: {
        icon: 'ri:alert-line',
        iconColor: '#F59E0B',
        backgroundColor: '#FFFBEB',
        borderColor: '#FED7AA',
        textColor: '#92400E',
        titleColor: '#78350F',
      },
      info: {
        icon: 'ri:information-line',
        iconColor: '#3B82F6',
        backgroundColor: '#EFF6FF',
        borderColor: '#BFDBFE',
        textColor: '#1E40AF',
        titleColor: '#1E3A8A',
      },
    };

    return configs[severity];
  };

  const getSizeConfig = () => {
    const sizes = {
      small: {
        fontSize: 12,
        titleFontSize: 13,
        iconSize: 14,
        padding: 8,
        borderRadius: 4,
      },
      medium: {
        fontSize: 14,
        titleFontSize: 15,
        iconSize: 16,
        padding: 12,
        borderRadius: 6,
      },
      large: {
        fontSize: 16,
        titleFontSize: 18,
        iconSize: 18,
        padding: 16,
        borderRadius: 8,
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
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
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
            name={config.icon}
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
              index > 0 && { marginTop: 2 },
            ]}
          >
            {msg}
          </Text>
        ))}

        <Show.When isTrue={!!actionLabel && !!onActionPress}>
          <TouchableOpacity
            style={[styles.actionButton, { marginTop: 8 }]}
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
          </TouchableOpacity>
        </Show.When>
      </View>

      <Show.When isTrue={dismissible}>
        <TouchableOpacity
          style={styles.dismissButton}
          onPress={handleDismiss}
          accessibilityRole="button"
          accessibilityLabel="Dismiss error message"
        >
          <Ionicons
            name="ri:close-line"
            size={sizeConfig.iconSize - 2}
            color={config.textColor}
          />
        </TouchableOpacity>
      </Show.When>
    </View>
  );

  const WrapperComponent = onPress ? TouchableOpacity : View;

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

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  iconContainer: {
    marginRight: 8,
    marginTop: 1,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
  },
  dismissButton: {
    padding: 4,
    marginLeft: 8,
    marginTop: -2,
  },
  actionButton: {
    alignSelf: 'flex-start',
  },
  actionText: {
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

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