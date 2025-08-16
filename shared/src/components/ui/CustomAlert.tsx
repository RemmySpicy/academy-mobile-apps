import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, Pressable, StyleSheet, useWindow, useWindowDimensions, Platform, Animated, PanGestureHandler, State, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNotificationStore } from '../../store/notificationStore';
import { useTheme, createThemedStyles } from '../../theme/ThemeProvider';
import { themeUtils } from '../../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type AlertType = 'success' | 'error' | 'warning' | 'info';
export type AlertPosition = 'top' | 'bottom' | 'center';

export interface AlertAction {
  label: string;
  onPress: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

export interface CustomAlertProps {
  type?: AlertType;
  title?: string;
  message: string;
  position?: AlertPosition;
  duration?: number; // 0 = no auto dismiss
  dismissible?: boolean;
  swipeToDismiss?: boolean;
  actions?: AlertAction[];
  onDismiss?: () => void;
  onPress?: () => void;
  style?: any;
  
  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: string;
  
  // Animation
  animationDuration?: number;
  slideDistance?: number;
}

interface AlertState {
  visible: boolean;
  translateY: Animated.Value;
  opacity: Animated.Value;
  scale: Animated.Value;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  type = 'info',
  title,
  message,
  position = 'top',
  duration = 4000,
  dismissible = true,
  swipeToDismiss = true,
  actions = [],
  onDismiss,
  onPress,
  style,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'alert',
  animationDuration = 300,
  slideDistance = 100,
}) => {
  const { theme } = useTheme();
  const styles = useThemedStyles();
  const insets = useSafeAreaInsets();
  const [alertState, setAlertState] = useState<AlertState>({
    visible: true,
    translateY: new Animated.Value(position === 'top' ? -slideDistance : slideDistance),
    opacity: new Animated.Value(0),
    scale: new Animated.Value(0.95),
  });

  const { removeNotification } = useNotificationStore();

  // Auto dismiss
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  // Entrance animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(alertState.translateY, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(alertState.opacity, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(alertState.scale, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleDismiss = useCallback(() => {
    if (!dismissible) return;

    const exitTranslateY = position === 'top' ? -slideDistance : slideDistance;

    Animated.parallel([
      Animated.timing(alertState.translateY, {
        toValue: exitTranslateY,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(alertState.opacity, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(alertState.scale, {
        toValue: 0.95,
        duration: animationDuration,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setAlertState(prev => ({ ...prev, visible: false }));
      onDismiss?.();
    });
  }, [dismissible, position, slideDistance, animationDuration, onDismiss]);

  const handleSwipeGesture = useCallback((event: any) => {
    if (!swipeToDismiss || !dismissible) return;

    const { translationY, velocityY, state } = event.nativeEvent;

    if (state === State.END) {
      const threshold = 50;
      const velocityThreshold = 500;

      const shouldDismiss = 
        Math.abs(translationY) > threshold || 
        Math.abs(velocityY) > velocityThreshold;

      if (shouldDismiss) {
        handleDismiss();
      } else {
        // Bounce back
        Animated.spring(alertState.translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    } else if (state === State.ACTIVE) {
      alertState.translateY.setValue(translationY);
    }
  }, [swipeToDismiss, dismissible, handleDismiss]);

  const getAlertConfig = () => {
    const configs = {
      success: {
        icon: 'checkmark-circle' as keyof typeof Ionicons.glyphMap,
        iconColor: theme.colors.status.success,
        backgroundColor: theme.colors.status.successBackground,
        borderColor: theme.colors.status.successBorder,
        textColor: theme.colors.text.primary,
      },
      error: {
        icon: 'close-circle' as keyof typeof Ionicons.glyphMap,
        iconColor: theme.colors.status.error,
        backgroundColor: theme.colors.status.errorBackground,
        borderColor: theme.colors.status.errorBorder,
        textColor: theme.colors.text.primary,
      },
      warning: {
        icon: 'warning' as keyof typeof Ionicons.glyphMap,
        iconColor: theme.colors.status.warning,
        backgroundColor: theme.colors.status.warningBackground,
        borderColor: theme.colors.status.warningBorder,
        textColor: theme.colors.text.primary,
      },
      info: {
        icon: 'information-circle' as keyof typeof Ionicons.glyphMap,
        iconColor: theme.colors.status.info,
        backgroundColor: theme.colors.status.infoBackground,
        borderColor: theme.colors.status.infoBorder,
        textColor: theme.colors.text.primary,
      },
    };

    return configs[type];
  };

  const getPositionStyles = () => {
    const baseStyle = [styles.container];

    switch (position) {
      case 'top':
        return [
          ...baseStyle,
          styles.topPosition,
          { paddingTop: Math.max(insets.top, theme.spacing[2]) + theme.spacing[2] }
        ];
      case 'bottom':
        return [
          ...baseStyle,
          styles.bottomPosition,
          { paddingBottom: Math.max(insets.bottom, theme.spacing[2]) + theme.spacing[2] }
        ];
      case 'center':
        return [...baseStyle, styles.centerPosition];
      default:
        return [...baseStyle, styles.topPosition];
    }
  };

  const config = getAlertConfig();

  if (!alertState.visible) return null;

  const alertContent = (
    <Animated.View
      style={[
        styles.alert,
        {
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor,
          transform: [
            { translateY: alertState.translateY },
            { scale: alertState.scale },
          ],
          opacity: alertState.opacity,
        },
        style,
      ]}
      accessibilityLabel={accessibilityLabel || `${type} alert: ${message}`}
      accessibilityHint={accessibilityHint || 'Double tap to dismiss'}
      accessibilityRole={accessibilityRole}
      accessible
    >
      <Pressable style={({ pressed }) => [{ opacity: pressed ? onPress || dismissible ? 0.8 : 1 : 1 }, styles.alertContent]}
        onPress={onPress || (dismissible ? handleDismiss : undefined)}
        disabled={!onPress && !dismissible}
        >
        <View style={styles.iconContainer}>
          <Ionicons
            name={config.icon}
            size={20}
            color={config.iconColor}
          />
        </View>

        <View style={styles.textContainer}>
          {title && (
            <Text 
              style={[styles.title, { color: config.textColor }]}
              numberOfLines={1}
            >
              {title}
            </Text>
          )}
          <Text 
            style={[styles.message, { color: config.textColor }]}
            numberOfLines={3}
          >
            {message}
          </Text>
        </View>

        {dismissible && (
          <Pressable 
            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }, styles.closeButton]}
            onPress={handleDismiss}
            accessibilityLabel="Dismiss alert"
            accessibilityRole="button"
          >
            <Ionicons
              name="close"
              size={16}
              color={config.textColor}
            />
          </Pressable>
        )}
      </Pressable>

      {actions.length > 0 && (
        <View style={styles.actionsContainer}>
          {actions.map((action, index) => (
            <Pressable 
              key={index}
              style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }, [
                styles.actionButton,
                action.style === 'destructive' && styles.destructiveAction,
                action.style === 'cancel' && styles.cancelAction,
              ]]}
              onPress={() => {
                action.onPress();
                handleDismiss();
              }}
              accessibilityRole="button"
            >
              <Text
                style={[
                  styles.actionText,
                  { color: config.iconColor },
                  action.style === 'destructive' && styles.destructiveText,
                  action.style === 'cancel' && styles.cancelText,
                ]}
              >
                {action.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </Animated.View>
  );

  if (swipeToDismiss && dismissible) {
    return (
      <View style={getPositionStyles()} pointerEvents="box-none">
        <PanGestureHandler onGestureEvent={handleSwipeGesture}>
          {alertContent}
        </PanGestureHandler>
      </View>
    );
  }

  return (
    <View style={getPositionStyles()} pointerEvents="box-none">
      {alertContent}
    </View>
  );
};

const useThemedStyles = createThemedStyles((theme) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      left: 0,
      right: 0,
      zIndex: 9999,
      paddingHorizontal: theme.spacing[4],
    },
    topPosition: {
      top: 0,
    },
    bottomPosition: {
      bottom: 0,
    },
    centerPosition: {
      top: '50%',
      transform: [{ translateY: -50 }],
    },
    alert: {
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      marginHorizontal: theme.spacing[4],
      ...themeUtils.createShadow('md', theme.colors.shadow.medium),
    },
    alertContent: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      padding: theme.spacing[4],
    },
    iconContainer: {
      marginRight: theme.spacing[3],
      marginTop: theme.spacing[0.5],
    },
    textContainer: {
      flex: 1,
      marginRight: theme.spacing[2],
    },
    title: {
      ...theme.typography.heading.h6,
      marginBottom: theme.spacing[1],
    },
    message: {
      ...theme.typography.body.sm,
    },
    closeButton: {
      padding: theme.spacing[1],
      marginTop: -theme.spacing[0.5],
    },
    actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      paddingHorizontal: theme.spacing[4],
      paddingBottom: theme.spacing[3],
      gap: theme.spacing[3],
    },
    actionButton: {
      paddingVertical: theme.spacing[2],
      paddingHorizontal: theme.spacing[4],
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.background.secondary,
    },
    destructiveAction: {
      backgroundColor: theme.colors.status.errorBackground,
    },
    cancelAction: {
      backgroundColor: theme.colors.background.tertiary,
    },
    actionText: {
      ...theme.typography.button.sm,
      fontWeight: theme.fontConfig.fontWeight.semibold,
    },
    destructiveText: {
      color: theme.colors.status.error,
    },
    cancelText: {
      color: theme.colors.text.secondary,
    },
  })
);

export default CustomAlert;