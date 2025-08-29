import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

export interface StatsCardProps {
  /** The title/label for the stat */
  title: string;
  /** The main value to display */
  value: number | string;
  /** The unit for the value (%, $, etc.) */
  unit?: string;
  /** The change value (positive/negative) */
  change?: number;
  /** Icon to display */
  icon?: keyof typeof Ionicons.glyphMap;
  /** Color for the icon and accent */
  color?: string;
  /** Custom styles for the card */
  style?: ViewStyle;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show the change indicator */
  showChange?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  unit = '',
  change,
  icon,
  color,
  style,
  size = 'md',
  showChange = true,
}) => {
  const { theme } = useTheme();

  const isPositiveChange = change !== undefined ? change >= 0 : null;
  const defaultColor = color || theme.colors.interactive.primary;

  const styles = createStyles(theme, size, defaultColor);
  const iconSize = styles.iconSize as number;

  return (
    <View style={[styles.container, style]}>
      {/* Icon */}
      {icon && (
        <View style={styles.iconContainer}>
          <Ionicons
            name={icon}
            size={iconSize}
            color={defaultColor}
          />
        </View>
      )}

      {/* Main Content */}
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        {/* Value */}
        <View style={styles.valueContainer}>
          <Text style={styles.value}>
            {value}
            {unit && (
              <Text style={styles.unit}>{unit}</Text>
            )}
          </Text>
        </View>

        {/* Change Indicator */}
        {showChange && change !== undefined && (
          <View style={styles.changeContainer}>
            <Ionicons
              name={isPositiveChange ? 'trending-up' : 'trending-down'}
              size={14}
              color={isPositiveChange ? theme.colors.status.success : theme.colors.status.error}
              style={styles.changeIcon}
            />
            <Text style={[
              styles.changeText,
              {
                color: isPositiveChange ? theme.colors.status.success : theme.colors.status.error,
              },
            ]}>
              {isPositiveChange ? '+' : ''}{change.toFixed(1)}%
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const createStyles = (theme: any, size: 'sm' | 'md' | 'lg', accentColor: string) => {
  const sizeConfig = {
    sm: {
      padding: theme.spacing.sm,
      iconSize: 18,
      titleSize: theme.fontSizes.sm,
      valueSize: theme.fontSizes.lg,
      unitSize: theme.fontSizes.sm,
      changeSize: theme.fontSizes.xs,
    },
    md: {
      padding: theme.spacing.md,
      iconSize: 20,
      titleSize: theme.fontSizes.base,
      valueSize: theme.fontSizes.xl,
      unitSize: theme.fontSizes.base,
      changeSize: theme.fontSizes.sm,
    },
    lg: {
      padding: theme.spacing.lg,
      iconSize: 24,
      titleSize: theme.fontSizes.lg,
      valueSize: theme.fontSizes['2xl'],
      unitSize: theme.fontSizes.lg,
      changeSize: theme.fontSizes.base,
    },
  };

  const config = sizeConfig[size];

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.lg,
      padding: config.padding,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      ...theme.elevation.sm,
    },
    iconContainer: {
      width: config.iconSize + 16,
      height: config.iconSize + 16,
      borderRadius: (config.iconSize + 16) / 2,
      backgroundColor: `${accentColor}15`,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.sm,
      alignSelf: 'flex-start',
    },
    content: {
      flex: 1,
    },
    title: {
      color: theme.colors.text.secondary,
      fontSize: config.titleSize,
      fontWeight: theme.fontConfig.fontWeight.medium,
      marginBottom: theme.spacing.xs,
      lineHeight: config.titleSize * 1.2,
    },
    valueContainer: {
      flexDirection: 'row',
      alignItems: 'baseline',
      marginBottom: theme.spacing.xs,
    },
    value: {
      color: theme.colors.text.primary,
      fontSize: config.valueSize,
      fontWeight: theme.fontConfig.fontWeight.bold,
      lineHeight: config.valueSize * 1.1,
    },
    unit: {
      color: theme.colors.text.secondary,
      fontSize: config.unitSize,
      fontWeight: theme.fontConfig.fontWeight.medium,
      marginLeft: 2,
    },
    changeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    changeIcon: {
      marginRight: 4,
    },
    changeText: {
      fontSize: config.changeSize,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
  });

  // Return styles with dynamic properties
  return {
    ...styles,
    iconSize: config.iconSize,
  };
};

// Add displayName for debugging
StatsCard.displayName = 'StatsCard';

export default StatsCard;