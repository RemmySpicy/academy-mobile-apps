import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { useTheme, createThemedStyles } from '@academy/mobile-shared';
import { BasePerformanceMetric, TrendDirection } from '../../types';

interface PerformanceMetricCardProps {
  metric: BasePerformanceMetric;
  index?: number;
  variant?: 'default' | 'compact' | 'detailed';
  showTrend?: boolean;
  showGoal?: boolean;
  onPress?: () => void;
}

export const PerformanceMetricCard: React.FC<PerformanceMetricCardProps> = ({
  metric,
  index = 0,
  variant = 'default',
  showTrend = true,
  showGoal = true,
  onPress,
}) => {
  const { theme } = useTheme();
  const styles = useThemedStyles();

  const getTrendIcon = (direction: TrendDirection): keyof typeof Ionicons.glyphMap => {
    switch (direction) {
      case 'up':
        return 'trending-up';
      case 'down':
        return 'trending-down';
      default:
        return 'remove';
    }
  };

  const getTrendColor = (direction: TrendDirection): string => {
    switch (direction) {
      case 'up':
        return theme.colors.status.success;
      case 'down':
        return theme.colors.status.error;
      default:
        return theme.colors.text.secondary;
    }
  };

  const formatValue = (value: number | string): string => {
    if (typeof value === 'string') return value;
    
    // Format based on metric type
    switch (metric.type) {
      case 'time':
        // Assume value is in seconds, convert to MM:SS format
        const minutes = Math.floor(value / 60);
        const seconds = Math.floor(value % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
      case 'percentage':
        return `${value}%`;
      case 'distance':
        return `${value}m`;
      case 'score':
        return value.toString();
      default:
        return value.toString();
    }
  };

  const getCardStyle = () => {
    switch (variant) {
      case 'compact':
        return styles.compactCard;
      case 'detailed':
        return styles.detailedCard;
      default:
        return styles.defaultCard;
    }
  };

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 100).springify()}
      style={getCardStyle()}
    >
      <View style={styles.cardHeader}>
        {metric.icon && (
          <View style={[
            styles.iconContainer,
            { backgroundColor: `${metric.color || theme.colors.interactive.primary}15` }
          ]}>
            <Ionicons 
              name={metric.icon as keyof typeof Ionicons.glyphMap} 
              size={20} 
              color={metric.color || theme.colors.interactive.primary} 
            />
          </View>
        )}
        
        <View style={styles.headerContent}>
          <Text style={styles.title}>{metric.title}</Text>
          <Text style={styles.category}>{metric.category}</Text>
        </View>
        
        {showTrend && metric.trend && (
          <Ionicons 
            name={getTrendIcon(metric.trend.direction)} 
            size={16} 
            color={getTrendColor(metric.trend.direction)} 
          />
        )}
      </View>

      <View style={styles.cardBody}>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>
            {formatValue(metric.value)}
          </Text>
          {metric.unit && (
            <Text style={styles.unit}>{metric.unit}</Text>
          )}
        </View>

        {showTrend && metric.trend && (
          <View style={styles.trendContainer}>
            <Text style={[
              styles.trendText,
              { color: getTrendColor(metric.trend.direction) }
            ]}>
              {metric.trend.direction === 'up' ? '+' : metric.trend.direction === 'down' ? '-' : ''}
              {Math.abs(metric.trend.percentage)}% {metric.trend.period}
            </Text>
          </View>
        )}
      </View>

      {showGoal && (metric.goal || metric.personalBest) && variant !== 'compact' && (
        <View style={styles.cardFooter}>
          {metric.goal && (
            <View style={styles.goalContainer}>
              <Text style={styles.goalLabel}>Goal:</Text>
              <Text style={styles.goalValue}>{formatValue(metric.goal)}</Text>
            </View>
          )}
          
          {metric.personalBest && (
            <View style={styles.goalContainer}>
              <Text style={styles.goalLabel}>PB:</Text>
              <Text style={styles.personalBestValue}>{formatValue(metric.personalBest)}</Text>
            </View>
          )}
        </View>
      )}

      {variant === 'detailed' && (
        <View style={styles.metadataContainer}>
          <Text style={styles.lastUpdated}>
            Updated {metric.lastUpdated.toLocaleDateString()}
          </Text>
        </View>
      )}
    </Animated.View>
  );
};

const useThemedStyles = createThemedStyles((theme) =>
  StyleSheet.create({
    defaultCard: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      ...theme.elevation.sm,
    },
    compactCard: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.sm,
      marginBottom: theme.spacing.xs,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    detailedCard: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      ...theme.elevation.md,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.sm,
    },
    headerContent: {
      flex: 1,
    },
    title: {
      fontSize: theme.fontSizes.base,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: theme.colors.text.primary,
    },
    category: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text.secondary,
      marginTop: 2,
    },
    cardBody: {
      marginBottom: theme.spacing.sm,
    },
    valueContainer: {
      flexDirection: 'row',
      alignItems: 'baseline',
      marginBottom: theme.spacing.xs,
    },
    value: {
      fontSize: theme.fontSizes['2xl'],
      fontWeight: theme.fontConfig.fontWeight.bold,
      color: theme.colors.text.primary,
    },
    unit: {
      fontSize: theme.fontSizes.base,
      color: theme.colors.text.secondary,
      marginLeft: theme.spacing.xs,
    },
    trendContainer: {
      alignSelf: 'flex-start',
    },
    trendText: {
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
    cardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.secondary,
    },
    goalContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    goalLabel: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text.secondary,
      marginRight: theme.spacing.xs,
    },
    goalValue: {
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: theme.colors.interactive.primary,
    },
    personalBestValue: {
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: theme.colors.status.success,
    },
    metadataContainer: {
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.secondary,
    },
    lastUpdated: {
      fontSize: theme.fontSizes.xs,
      color: theme.colors.text.tertiary,
    },
  })
);