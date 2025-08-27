import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

export interface MetricPoolProps {
  poolName: string;
  poolNumber: string | number;
  poolRate?: string | number;
  width?: number;
  height?: number;
  backgroundColor?: string;
  borderColor?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  onPress?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  showTrend?: boolean;
  trendDirection?: 'up' | 'down' | 'neutral';
  suffix?: string;
  prefix?: string;
  loading?: boolean;
}

const MetricPool: React.FC<MetricPoolProps> = ({
  poolName,
  poolNumber,
  poolRate,
  width = 90,
  height = 100,
  backgroundColor,
  borderColor,
  icon,
  iconColor,
  onPress,
  disabled = false,
  variant = 'default',
  showTrend = true,
  trendDirection = 'neutral',
  suffix = '',
  prefix = '',
  loading = false,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme, width, height);

  const getTrendColor = () => {
    if (!poolRate || !showTrend) return theme.colors.text.secondary;
    
    const rateString = poolRate.toString();
    if (trendDirection === 'up' || (!rateString.includes('-') && parseFloat(rateString) > 0)) {
      return theme.colors.status.success;
    } else if (trendDirection === 'down' || rateString.includes('-')) {
      return theme.colors.status.error;
    }
    return theme.colors.text.secondary;
  };

  const getTrendIcon = () => {
    if (!poolRate || !showTrend) return null;
    
    const rateString = poolRate.toString();
    if (trendDirection === 'up' || (!rateString.includes('-') && parseFloat(rateString) > 0)) {
      return 'trending-up';
    } else if (trendDirection === 'down' || rateString.includes('-')) {
      return 'trending-down';
    }
    return 'remove';
  };

  const formatNumber = (num: string | number) => {
    if (loading) return '...';
    
    const numValue = typeof num === 'string' ? parseFloat(num) : num;
    if (isNaN(numValue)) return num;
    
    // Format large numbers with K, M notation
    if (numValue >= 1000000) {
      return `${(numValue / 1000000).toFixed(1)}M`;
    } else if (numValue >= 1000) {
      return `${(numValue / 1000).toFixed(1)}K`;
    }
    
    return numValue.toString();
  };

  const containerStyle = [
    styles.container,
    variant === 'compact' && styles.compactContainer,
    variant === 'detailed' && styles.detailedContainer,
    backgroundColor && { backgroundColor },
    borderColor && { borderColor },
    disabled && styles.disabled,
  ];

  const content = (
    <View style={containerStyle}>
      {/* Icon */}
      {icon && (
        <View style={styles.iconContainer}>
          <Ionicons
            name={icon}
            size={variant === 'compact' ? 16 : 20}
            color={iconColor || theme.colors.interactive.primary}
          />
        </View>
      )}

      {/* Pool Name */}
      <View style={styles.nameContainer}>
        <Text 
          style={[styles.poolName, { color: theme.colors.text.secondary }]}
          numberOfLines={variant === 'compact' ? 1 : 2}
        >
          {poolName}
        </Text>
      </View>

      {/* Pool Number */}
      <View style={styles.numberContainer}>
        <Text style={[styles.poolNumber, { color: theme.colors.text.primary }]}>
          {prefix}{formatNumber(poolNumber)}{suffix}
        </Text>
      </View>

      {/* Pool Rate */}
      {poolRate !== undefined && (
        <View style={styles.rateContainer}>
          <View style={styles.rateContent}>
            {showTrend && getTrendIcon() && (
              <Ionicons
                name={getTrendIcon() as keyof typeof Ionicons.glyphMap}
                size={12}
                color={getTrendColor()}
                style={styles.trendIcon}
              />
            )}
            <Text style={[styles.poolRate, { color: getTrendColor() }]}>
              {loading ? '...' : poolRate}
            </Text>
          </View>
        </View>
      )}

      {/* Loading Indicator */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={[styles.loadingSpinner, { borderColor: theme.colors.interactive.primary }]} />
        </View>
      )}
    </View>
  );

  if (onPress && !disabled) {
    return (
      <TouchableOpacity 
        onPress={onPress}
        style={styles.touchable}
        accessibilityRole="button"
        accessibilityLabel={`${poolName}: ${poolNumber}${suffix}`}
        accessibilityHint={poolRate ? `Trend: ${poolRate}` : undefined}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const createStyles = (theme: any, width: number, height: number) => StyleSheet.create({
  touchable: {
    borderRadius: theme.borderRadius.lg,
  },
  container: {
    width,
    height,
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    shadowColor: theme.colors.shadow.default,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  compactContainer: {
    height: height * 0.8,
    paddingVertical: theme.spacing.xs,
  },
  detailedContainer: {
    height: height * 1.2,
    paddingVertical: theme.spacing.md,
  },
  disabled: {
    opacity: 0.5,
  },
  iconContainer: {
    marginBottom: theme.spacing.xs,
  },
  nameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xs,
  },
  poolName: {
    fontSize: theme.fontSizes.caption,
    fontWeight: theme.fontConfig.fontWeight.regular,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.caption,
  },
  numberContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: theme.spacing.xs,
  },
  poolNumber: {
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontConfig.fontWeight.bold,
    textAlign: 'center',
  },
  rateContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rateContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendIcon: {
    marginRight: 2,
  },
  poolRate: {
    fontSize: theme.fontSizes.small,
    fontWeight: theme.fontConfig.fontWeight.semibold,
    textAlign: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: theme.borderRadius.lg,
  },
  loadingSpinner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderTopColor: 'transparent',
    // Note: In a real app, you'd add rotation animation here
  },
});

export default MetricPool;