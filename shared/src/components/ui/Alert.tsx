import React, { useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  FadeInDown, 
  FadeOutUp, 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  runOnJS
} from 'react-native-reanimated';
import { useTheme } from '../../theme';

export interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  title?: string;
  duration?: number;
  visible: boolean;
  onDismiss?: () => void;
  dismissible?: boolean;
  position?: 'top' | 'bottom';
  actionLabel?: string;
  onActionPress?: () => void;
}

const Alert: React.FC<AlertProps> = ({
  type = 'info',
  message,
  title,
  duration = 4000,
  visible,
  onDismiss,
  dismissible = true,
  position = 'top',
  actionLabel,
  onActionPress,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(position === 'top' ? -100 : 100);

  const alertConfig = useMemo(() => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: theme.colors.status.success,
          borderColor: theme.colors.status.success,
          iconName: 'checkmark-circle' as const,
          iconColor: theme.colors.icon.success || theme.colors.status.success,
        };
      case 'error':
        return {
          backgroundColor: theme.colors.status.error,
          borderColor: theme.colors.status.error,
          iconName: 'close-circle' as const,
          iconColor: theme.colors.icon.error || theme.colors.status.error,
        };
      case 'warning':
        return {
          backgroundColor: theme.colors.status.warning,
          borderColor: theme.colors.status.warning,
          iconName: 'warning' as const,
          iconColor: theme.colors.icon.warning || theme.colors.status.warning,
        };
      case 'info':
      default:
        return {
          backgroundColor: theme.colors.interactive.primary,
          borderColor: theme.colors.interactive.primary,
          iconName: 'information-circle' as const,
          iconColor: theme.colors.icon.primary || theme.colors.interactive.primary,
        };
    }
  }, [type, theme]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const handleDismiss = useCallback(() => {
    opacity.value = withTiming(0, { duration: 300 });
    translateY.value = withTiming(
      position === 'top' ? -100 : 100, 
      { duration: 300 },
      () => {
        if (onDismiss) {
          runOnJS(onDismiss)();
        }
      }
    );
  }, [onDismiss, opacity, translateY, position]);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withTiming(0, { duration: 300 });

      if (duration > 0) {
        const timer = setTimeout(handleDismiss, duration);
        return () => clearTimeout(timer);
      }
    } else {
      handleDismiss();
    }
  }, [visible, duration, handleDismiss, opacity, translateY]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View 
      style={[
        styles.container,
        position === 'top' ? styles.topPosition : styles.bottomPosition,
        animatedStyle,
        {
          backgroundColor: `${alertConfig.backgroundColor}15`,
          borderColor: alertConfig.borderColor,
        }
      ]}
      entering={FadeInDown.duration(300)}
      exiting={FadeOutUp.duration(300)}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons 
            name={alertConfig.iconName}
            size={24}
            color={alertConfig.iconColor}
          />
        </View>

        <View style={styles.textContainer}>
          {title && (
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>
              {title}
            </Text>
          )}
          <Text style={[styles.message, { color: theme.colors.text.secondary }]}>
            {message}
          </Text>
        </View>

        <View style={styles.actionContainer}>
          {actionLabel && onActionPress && (
            <TouchableOpacity 
              style={[styles.actionButton, { borderColor: alertConfig.borderColor }]}
              onPress={onActionPress}
            >
              <Text style={[styles.actionText, { color: alertConfig.iconColor }]}>
                {actionLabel}
              </Text>
            </TouchableOpacity>
          )}

          {dismissible && (
            <TouchableOpacity 
              style={styles.dismissButton}
              onPress={handleDismiss}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons 
                name="close"
                size={20}
                color={theme.colors.text.secondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    position: 'absolute',
    left: theme.spacing.md,
    right: theme.spacing.md,
    borderWidth: 1,
    borderRadius: theme.borderRadius.lg,
    shadowColor: theme.colors.shadow?.primary || '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 1000,
  },
  topPosition: {
    top: 60,
  },
  bottomPosition: {
    bottom: 40,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: theme.spacing.md,
  },
  iconContainer: {
    marginRight: theme.spacing.sm,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  title: {
    fontSize: theme.fontSizes.body,
    fontWeight: theme.fontConfig.fontWeight.semibold,
    marginBottom: theme.spacing.xs,
    lineHeight: theme.typography.lineHeight?.body || 22,
  },
  message: {
    fontSize: theme.fontSizes.small,
    fontWeight: theme.fontConfig.fontWeight.regular,
    lineHeight: theme.typography.lineHeight?.small || 18,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  actionButton: {
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  actionText: {
    fontSize: theme.fontSizes.small,
    fontWeight: theme.fontConfig.fontWeight.medium,
  },
  dismissButton: {
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
});

export default Alert;