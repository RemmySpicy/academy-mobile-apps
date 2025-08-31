import React, { useEffect } from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '../../theme';
import type { AchievementNotification } from '../../types';

const { width } = Dimensions.get('window');

interface AchievementNotificationToastProps {
  notification: AchievementNotification | null;
  onPress?: () => void;
  onDismiss: () => void;
  duration?: number; // Auto dismiss duration in ms (0 = no auto dismiss)
}

export const AchievementNotificationToast: React.FC<AchievementNotificationToastProps> = ({
  notification,
  onPress,
  onDismiss,
  duration = 4000,
}) => {
  const { theme } = useTheme();

  // Animation values
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    if (notification) {
      // Show animation
      translateY.value = withSpring(0, { damping: 15 });
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSpring(1, { damping: 15 });

      // Auto dismiss
      if (duration > 0) {
        const timer = setTimeout(() => {
          handleDismiss();
        }, duration);

        return () => clearTimeout(timer);
      }
    }
  }, [notification]);

  const handleDismiss = () => {
    translateY.value = withTiming(-100, { duration: 300 });
    opacity.value = withTiming(0, { duration: 300 });
    scale.value = withTiming(0.9, { duration: 300 }, () => {
      runOnJS(onDismiss)();
    });
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
    handleDismiss();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  if (!notification) return null;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'unlock': return 'trophy';
      case 'progress': return 'trending-up';
      case 'streak': return 'flame';
      case 'leaderboard': return 'podium';
      default: return 'notifications';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'unlock': return theme.colors.status.success;
      case 'progress': return theme.colors.interactive.primary;
      case 'streak': return theme.colors.status.warning;
      case 'leaderboard': return theme.colors.interactive.purple;
      default: return theme.colors.interactive.primary;
    }
  };

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: 60, // Account for status bar + some padding
          left: theme.spacing.md,
          right: theme.spacing.md,
          zIndex: 1000,
        },
        animatedStyle,
      ]}
    >
      <Pressable
        onPress={handlePress}
        style={{
          backgroundColor: theme.colors.background.primary,
          borderRadius: theme.borderRadius.xl,
          padding: theme.spacing.md,
          flexDirection: 'row',
          alignItems: 'flex-start',
          ...theme.elevation.lg,
          borderLeftWidth: 4,
          borderLeftColor: getNotificationColor(notification.type),
        }}
      >
        {/* Notification Icon */}
        <View style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: `${getNotificationColor(notification.type)}15`,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: theme.spacing.md,
        }}>
          <Ionicons
            name={getNotificationIcon(notification.type) as any}
            size={20}
            color={getNotificationColor(notification.type)}
          />
        </View>

        {/* Notification Content */}
        <View style={{ flex: 1 }}>
          <Text style={{
            color: theme.colors.text.primary,
            fontSize: theme.fontSizes.base,
            fontWeight: theme.fontConfig.fontWeight.semibold,
            marginBottom: 2,
          }}>
            {notification.title}
          </Text>
          
          <Text style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.sm,
            lineHeight: 18,
            marginBottom: theme.spacing.xs,
          }}>
            {notification.message}
          </Text>

          {/* Additional Info */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            {/* Points or Rank Change */}
            {notification.points_awarded && (
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <Ionicons
                  name="diamond-outline"
                  size={14}
                  color={theme.colors.status.success}
                  style={{ marginRight: 4 }}
                />
                <Text style={{
                  color: theme.colors.status.success,
                  fontSize: theme.fontSizes.sm,
                  fontWeight: theme.fontConfig.fontWeight.medium,
                }}>
                  +{notification.points_awarded}
                </Text>
              </View>
            )}

            {notification.rank_change && (
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <Ionicons
                  name={notification.rank_change > 0 ? "arrow-up" : "arrow-down"}
                  size={14}
                  color={notification.rank_change > 0 ? theme.colors.status.success : theme.colors.status.error}
                  style={{ marginRight: 4 }}
                />
                <Text style={{
                  color: notification.rank_change > 0 ? theme.colors.status.success : theme.colors.status.error,
                  fontSize: theme.fontSizes.sm,
                  fontWeight: theme.fontConfig.fontWeight.medium,
                }}>
                  {Math.abs(notification.rank_change)} rank{Math.abs(notification.rank_change) !== 1 ? 's' : ''}
                </Text>
              </View>
            )}

            {/* Time Indicator */}
            <Text style={{
              color: theme.colors.text.tertiary,
              fontSize: theme.fontSizes.xs,
            }}>
              Just now
            </Text>
          </View>
        </View>

        {/* Dismiss Button */}
        <Pressable
          onPress={handleDismiss}
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: theme.colors.background.secondary,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: theme.spacing.sm,
          }}
        >
          <Ionicons
            name="close"
            size={14}
            color={theme.colors.icon.secondary}
          />
        </Pressable>
      </Pressable>
    </Animated.View>
  );
};