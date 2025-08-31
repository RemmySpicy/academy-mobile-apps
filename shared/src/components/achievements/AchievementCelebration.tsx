import React, { useEffect } from 'react';
import { View, Text, Modal, Pressable, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  withTiming,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '../../theme';
import type { AchievementCelebration } from '../../types';

const { width, height } = Dimensions.get('window');

interface ConfettiParticleProps {
  delay: number;
  color: string;
  startX: number;
}

const ConfettiParticle: React.FC<ConfettiParticleProps> = ({ delay, color, startX }) => {
  const translateY = useSharedValue(-20);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withTiming(height + 100, { duration: 2000 })
    );
    translateX.value = withDelay(
      delay,
      withTiming((Math.random() - 0.5) * 200, { duration: 2000 })
    );
    rotate.value = withDelay(
      delay,
      withTiming(360 + Math.random() * 360, { duration: 2000 })
    );
    opacity.value = withDelay(
      delay + 1500,
      withTiming(0, { duration: 500 })
    );
    scale.value = withDelay(
      delay,
      withSequence(
        withTiming(1.2, { duration: 100 }),
        withTiming(1, { duration: 100 })
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: 0,
          left: startX,
          width: 8,
          height: 8,
          backgroundColor: color,
          borderRadius: 4,
        },
        animatedStyle,
      ]}
    />
  );
};

interface SparkleProps {
  delay: number;
  x: number;
  y: number;
}

const Sparkle: React.FC<SparkleProps> = ({ delay, x, y }) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withSequence(
        withSpring(1.2, { damping: 8 }),
        withSpring(0, { damping: 8 })
      )
    );
    opacity.value = withDelay(
      delay,
      withSequence(
        withTiming(1, { duration: 300 }),
        withDelay(200, withTiming(0, { duration: 300 }))
      )
    );
    rotate.value = withDelay(
      delay,
      withTiming(180, { duration: 800 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: x,
          top: y,
        },
        animatedStyle,
      ]}
    >
      <Ionicons name="sparkles" size={24} color="#FFD700" />
    </Animated.View>
  );
};

interface AchievementCelebrationProps {
  celebration: AchievementCelebration | null;
  onClose: () => void;
  onViewLeaderboard?: () => void;
}

export const AchievementCelebration: React.FC<AchievementCelebrationProps> = ({
  celebration,
  onClose,
  onViewLeaderboard,
}) => {
  const { theme } = useTheme();
  
  // Animation values
  const backdropOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.8);
  const cardTranslateY = useSharedValue(50);
  const iconScale = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const pointsScale = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    if (celebration) {
      // Backdrop
      backdropOpacity.value = withTiming(1, { duration: 300 });
      
      // Card entrance
      cardScale.value = withDelay(100, withSpring(1, { damping: 15 }));
      cardTranslateY.value = withDelay(100, withSpring(0, { damping: 15 }));
      
      // Icon animation
      iconScale.value = withDelay(300, withSequence(
        withSpring(1.3, { damping: 8 }),
        withSpring(1, { damping: 8 })
      ));
      
      // Title fade in
      titleOpacity.value = withDelay(500, withTiming(1, { duration: 400 }));
      
      // Points animation
      pointsScale.value = withDelay(700, withSequence(
        withSpring(1.2, { damping: 10 }),
        withSpring(1, { damping: 10 })
      ));
      
      // Buttons fade in
      buttonOpacity.value = withDelay(900, withTiming(1, { duration: 400 }));
    } else {
      // Reset values
      backdropOpacity.value = 0;
      cardScale.value = 0.8;
      cardTranslateY.value = 50;
      iconScale.value = 0;
      titleOpacity.value = 0;
      pointsScale.value = 0;
      buttonOpacity.value = 0;
    }
  }, [celebration]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: cardScale.value },
      { translateY: cardTranslateY.value },
    ],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  const pointsStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pointsScale.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  if (!celebration) return null;

  const { achievement, points_awarded, animation_type, show_leaderboard_update } = celebration;

  // Generate confetti particles
  const confettiColors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
  const confettiParticles = animation_type === 'confetti' ? 
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      delay: Math.random() * 1000,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      startX: Math.random() * width,
    })) : [];

  // Generate sparkles
  const sparkles = (animation_type === 'sparkles' || animation_type === 'fireworks') ?
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      delay: Math.random() * 1500,
      x: Math.random() * width,
      y: Math.random() * height * 0.7,
    })) : [];

  return (
    <Modal
      visible={true}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <Animated.View
        style={[
          {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: theme.spacing.lg,
          },
          backdropStyle,
        ]}
      >
        {/* Confetti */}
        {animation_type === 'confetti' && confettiParticles.map(particle => (
          <ConfettiParticle
            key={particle.id}
            delay={particle.delay}
            color={particle.color}
            startX={particle.startX}
          />
        ))}

        {/* Sparkles */}
        {(animation_type === 'sparkles' || animation_type === 'fireworks') && sparkles.map(sparkle => (
          <Sparkle
            key={sparkle.id}
            delay={sparkle.delay}
            x={sparkle.x}
            y={sparkle.y}
          />
        ))}

        {/* Celebration Card */}
        <Animated.View
          style={[
            {
              backgroundColor: theme.colors.background.primary,
              borderRadius: theme.borderRadius['2xl'],
              padding: theme.spacing['2xl'],
              alignItems: 'center',
              maxWidth: width * 0.9,
              ...theme.elevation.xl,
            },
            cardStyle,
          ]}
        >
          {/* Achievement Icon */}
          <Animated.View
            style={[
              {
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: achievement.background_color || `${theme.colors.interactive.primary}20`,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: theme.spacing.xl,
                ...theme.elevation.lg,
              },
              iconStyle,
            ]}
          >
            <Ionicons
              name={achievement.icon as any}
              size={60}
              color={achievement.icon_color || theme.colors.interactive.primary}
            />
          </Animated.View>

          {/* Success Message */}
          <Animated.View style={[{ alignItems: 'center' }, titleStyle]}>
            <Text style={{
              color: theme.colors.status.success,
              fontSize: theme.fontSizes.lg,
              fontWeight: theme.fontConfig.fontWeight.bold,
              textAlign: 'center',
              marginBottom: theme.spacing.sm,
            }}>
              🎉 Achievement Unlocked! 🎉
            </Text>

            <Text style={{
              color: theme.colors.text.primary,
              fontSize: theme.fontSizes['2xl'],
              fontWeight: theme.fontConfig.fontWeight.bold,
              textAlign: 'center',
              marginBottom: theme.spacing.sm,
            }}>
              {achievement.title}
            </Text>

            <Text style={{
              color: theme.colors.text.secondary,
              fontSize: theme.fontSizes.base,
              textAlign: 'center',
              lineHeight: 22,
              marginBottom: theme.spacing.xl,
            }}>
              {achievement.description}
            </Text>
          </Animated.View>

          {/* Points Awarded */}
          {points_awarded > 0 && (
            <Animated.View
              style={[
                {
                  backgroundColor: theme.colors.status.successBackground,
                  borderRadius: theme.borderRadius.xl,
                  paddingHorizontal: theme.spacing.lg,
                  paddingVertical: theme.spacing.md,
                  marginBottom: theme.spacing.xl,
                  borderWidth: 1,
                  borderColor: theme.colors.status.success,
                },
                pointsStyle,
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons
                  name="diamond"
                  size={20}
                  color={theme.colors.status.success}
                  style={{ marginRight: theme.spacing.sm }}
                />
                <Text style={{
                  color: theme.colors.status.success,
                  fontSize: theme.fontSizes.lg,
                  fontWeight: theme.fontConfig.fontWeight.bold,
                }}>
                  +{points_awarded} Points Earned!
                </Text>
              </View>
            </Animated.View>
          )}

          {/* Achievement Details */}
          <View style={{
            backgroundColor: theme.colors.background.secondary,
            borderRadius: theme.borderRadius.lg,
            padding: theme.spacing.md,
            width: '100%',
            marginBottom: theme.spacing.xl,
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: theme.spacing.sm,
            }}>
              <Text style={{
                color: theme.colors.text.secondary,
                fontSize: theme.fontSizes.sm,
              }}>
                Category
              </Text>
              <Text style={{
                color: theme.colors.text.primary,
                fontSize: theme.fontSizes.sm,
                fontWeight: theme.fontConfig.fontWeight.medium,
              }}>
                {achievement.category}
              </Text>
            </View>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Text style={{
                color: theme.colors.text.secondary,
                fontSize: theme.fontSizes.sm,
              }}>
                Rarity
              </Text>
              <View style={{
                backgroundColor: `${getRarityColor(achievement.rarity)}20`,
                paddingHorizontal: theme.spacing.sm,
                paddingVertical: 2,
                borderRadius: theme.borderRadius.full,
              }}>
                <Text style={{
                  color: getRarityColor(achievement.rarity),
                  fontSize: theme.fontSizes.sm,
                  fontWeight: theme.fontConfig.fontWeight.medium,
                  textTransform: 'capitalize',
                }}>
                  {achievement.rarity}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <Animated.View
            style={[
              { width: '100%', gap: theme.spacing.md },
              buttonStyle,
            ]}
          >
            {show_leaderboard_update && onViewLeaderboard && (
              <Pressable
                onPress={onViewLeaderboard}
                style={{
                  backgroundColor: theme.colors.interactive.primary,
                  borderRadius: theme.borderRadius.xl,
                  paddingVertical: theme.spacing.md,
                  paddingHorizontal: theme.spacing.lg,
                  alignItems: 'center',
                  marginBottom: theme.spacing.sm,
                }}
              >
                <Text style={{
                  color: 'white',
                  fontSize: theme.fontSizes.base,
                  fontWeight: theme.fontConfig.fontWeight.semibold,
                }}>
                  View Leaderboard
                </Text>
              </Pressable>
            )}

            <Pressable
              onPress={onClose}
              style={{
                backgroundColor: theme.colors.background.secondary,
                borderRadius: theme.borderRadius.xl,
                paddingVertical: theme.spacing.md,
                paddingHorizontal: theme.spacing.lg,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: theme.colors.border.primary,
              }}
            >
              <Text style={{
                color: theme.colors.text.primary,
                fontSize: theme.fontSizes.base,
                fontWeight: theme.fontConfig.fontWeight.medium,
              }}>
                Awesome!
              </Text>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

// Helper function to get rarity color
const getRarityColor = (rarity: string): string => {
  switch (rarity) {
    case 'common': return '#6B7280';
    case 'uncommon': return '#059669';
    case 'rare': return '#2563EB';
    case 'epic': return '#7C3AED';
    case 'legendary': return '#DC2626';
    default: return '#6B7280';
  }
};