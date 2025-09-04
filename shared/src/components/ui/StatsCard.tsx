import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { useTheme } from '../../theme';

export interface StatsCardProps {
  title: string;
  value: number | string;
  unit?: string;
  change?: number;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
  onPress?: () => void;
  style?: ViewStyle;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'filled';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  unit = '',
  change,
  icon,
  color,
  onPress,
  style,
  size = 'md',
  variant = 'default',
}) => {
  const { theme } = useTheme();

  const cardColor = color || theme.colors.interactive.primary;
  const hasPositiveChange = change && change > 0;
  const hasNegativeChange = change && change < 0;

  const sizeStyles = {
    sm: {
      padding: theme.spacing.sm,
      iconSize: 20,
      titleSize: theme.fontSizes.sm,
      valueSize: theme.fontSizes.lg,
      changeSize: theme.fontSizes.xs,
    },
    md: {
      padding: theme.spacing.md,
      iconSize: 24,
      titleSize: theme.fontSizes.base,
      valueSize: theme.fontSizes.xl,
      changeSize: theme.fontSizes.sm,
    },
    lg: {
      padding: theme.spacing.lg,
      iconSize: 28,
      titleSize: theme.fontSizes.lg,
      valueSize: theme.fontSizes['2xl'],
      changeSize: theme.fontSizes.base,
    },
  };

  const currentSize = sizeStyles[size];

  const getContainerStyle = () => {
    const baseStyle = {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.lg,
      padding: currentSize.padding,
      ...theme.elevation.sm,
    };

    switch (variant) {
      case 'outlined':
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: theme.colors.border.primary,
          backgroundColor: 'transparent',
        };
      case 'filled':
        return {
          ...baseStyle,
          backgroundColor: `${cardColor}15`,
        };
      default:
        return baseStyle;
    }
  };

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  const renderContent = () => (
    <View>
      {/* Header with icon and title */}
      <View style={styles.header}>
        {icon && (
          <View style={[styles.iconContainer, { backgroundColor: `${cardColor}15` }]}>
            <Ionicons
              name={icon}
              size={currentSize.iconSize}
              color={cardColor}
            />
          </View>
        )}
        <Text style={[styles.title, {
          color: theme.colors.text.secondary,
          fontSize: currentSize.titleSize,
          flex: 1,
          marginLeft: icon ? theme.spacing.sm : 0,
        }]} numberOfLines={1}>
          {title}
        </Text>
      </View>

      {/* Value */}
      <View style={styles.valueContainer}>
        <Text style={[styles.value, {
          color: theme.colors.text.primary,
          fontSize: currentSize.valueSize,
          fontWeight: theme.fontConfig.fontWeight.bold,
        }]}>
          {value}
          {unit && (
            <Text style={[styles.unit, {
              color: theme.colors.text.secondary,
              fontSize: currentSize.changeSize,
              fontWeight: theme.fontConfig.fontWeight.medium,
            }]}>
              {unit}
            </Text>
          )}
        </Text>
      </View>

      {/* Change indicator */}
      {change !== undefined && (
        <View style={[styles.changeContainer, {
          backgroundColor: hasPositiveChange 
            ? `${theme.colors.status.success}15`
            : hasNegativeChange
            ? `${theme.colors.status.error}15`
            : 'transparent'
        }]}>
          <Ionicons
            name={hasPositiveChange ? 'trending-up' : hasNegativeChange ? 'trending-down' : 'remove'}
            size={currentSize.changeSize}
            color={hasPositiveChange 
              ? theme.colors.status.success
              : hasNegativeChange
              ? theme.colors.status.error
              : theme.colors.text.secondary
            }
            style={{ marginRight: theme.spacing.xs }}
          />
          <Text style={[styles.changeText, {
            color: hasPositiveChange 
              ? theme.colors.status.success
              : hasNegativeChange
              ? theme.colors.status.error
              : theme.colors.text.secondary,
            fontSize: currentSize.changeSize,
            fontWeight: theme.fontConfig.fontWeight.medium,
          }]}>
            {Math.abs(change)}%
          </Text>
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <AnimatedPressable
        entering={FadeInRight}
        style={[getContainerStyle(), style]}
        onPress={onPress}
        android_ripple={{
          color: `${cardColor}20`,
          borderless: false,
        }}
      >
        {renderContent()}
      </AnimatedPressable>
    );
  }

  return (
    <Animated.View
      entering={FadeInRight}
      style={[getContainerStyle(), style]}
    >
      {renderContent()}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: '500',
  },
  valueContainer: {
    marginBottom: 4,
  },
  value: {
    lineHeight: 1.2,
  },
  unit: {
    marginLeft: 2,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 4,
  },
  changeText: {
    lineHeight: 1,
  },
});

export default StatsCard;