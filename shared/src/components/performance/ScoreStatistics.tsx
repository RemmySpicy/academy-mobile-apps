/**
 * ScoreStatistics Component
 * 
 * Advanced statistics component with customizable time periods,
 * progress indicators, and bar chart visualization.
 * 
 * Extracted from students-app and modernized for Academy design system.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, createThemedStyles } from '../../theme';

export interface ScoreStatsData {
  /** Number value to display */
  value: number;
  /** Label for the stat */
  label: string;
  /** Progress percentage (0-100) */
  percentage?: number;
  /** Trend direction */
  trend?: 'up' | 'down' | 'neutral';
  /** Custom color override */
  color?: string;
}

export interface ChartDataPoint {
  /** Day label (e.g., 'Mon', 'Tue') */
  day: string;
  /** Value (0-100 for percentage) */
  value: number;
  /** Custom color for this bar */
  color?: string;
}

export interface ScoreStatisticsProps {
  /** Title of the statistics section */
  title?: string;
  /** Subtitle/description */
  subtitle?: string;
  /** Available time periods */
  timePeriods?: string[];
  /** Default selected time period */
  defaultPeriod?: string;
  /** Statistics data */
  stats?: ScoreStatsData[];
  /** Chart data points */
  chartData?: ChartDataPoint[];
  /** Chart axis labels */
  axisLabels?: string[];
  /** Time period change handler */
  onPeriodChange?: (period: string) => void;
  /** Custom container style */
  style?: ViewStyle;
  /** Whether to show the time period picker */
  showTimePicker?: boolean;
  /** Whether to show the chart */
  showChart?: boolean;
  /** Test ID for testing */
  testID?: string;
}

export const ScoreStatistics: React.FC<ScoreStatisticsProps> = ({
  title = 'Score Statistics',
  subtitle = 'weekly figures',
  timePeriods = ['7 Days', '30 Days', '60 Days'],
  defaultPeriod,
  stats = [],
  chartData = [],
  axisLabels = ['Sn', 'Mn', 'Te', 'Wd', 'Tr', 'Fr', 'Sa'],
  onPeriodChange,
  style,
  showTimePicker = true,
  showChart = true,
  testID = 'score-statistics',
}) => {
  const { theme } = useTheme();
  const styles = useThemedStyles();
  
  const [selectedPeriod, setSelectedPeriod] = useState(defaultPeriod || timePeriods[0]);
  const [showPicker, setShowPicker] = useState(false);

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    setShowPicker(false);
    onPeriodChange?.(period);
  };

  const renderStatCard = (stat: ScoreStatsData, index: number) => {
    const getStatStyle = () => {
      if (stat.color) return { backgroundColor: stat.color };
      
      switch (stat.trend) {
        case 'up':
          return styles.positiveStatCard;
        case 'down':
          return styles.negativeStatCard;
        default:
          return styles.neutralStatCard;
      }
    };

    const getTextColor = () => {
      switch (stat.trend) {
        case 'up':
          return theme.colors.status.success;
        case 'down':
          return theme.colors.status.error;
        default:
          return theme.colors.text.primary;
      }
    };

    const getTrendIcon = () => {
      switch (stat.trend) {
        case 'up':
          return 'arrow-up';
        case 'down':
          return 'arrow-down';
        default:
          return null;
      }
    };

    return (
      <View key={index} style={[styles.statCard, getStatStyle()]}>
        {stat.trend && stat.trend !== 'neutral' ? (
          <View style={styles.trendStatContent}>
            <Ionicons 
              name={getTrendIcon() as any} 
              size={15} 
              color={getTextColor()} 
            />
            <View>
              <Text style={[styles.statValue, { color: getTextColor() }]}>
                {stat.percentage ? `${stat.percentage}%` : stat.value}
              </Text>
              <Text style={[styles.statLabelSmall, { color: getTextColor() }]}>
                {stat.label}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.neutralStatContent}>
            <Text style={[styles.statValue, { color: getTextColor() }]}>
              {stat.value}
            </Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderChart = () => {
    if (!showChart || chartData.length === 0) return null;

    const maxValue = Math.max(...chartData.map(d => d.value));
    
    return (
      <View style={styles.chartContainer}>
        {/* Y-axis labels */}
        <View style={styles.yAxisContainer}>
          {axisLabels.slice(0, 5).map((label, index) => (
            <Text key={index} style={styles.axisLabel}>
              {label}
            </Text>
          ))}
        </View>

        {/* Chart bars */}
        <View style={styles.barsContainer}>
          {chartData.map((dataPoint, index) => {
            const heightPercentage = (dataPoint.value / maxValue) * 100;
            
            return (
              <View key={index} style={styles.barContainer}>
                <View style={[
                  styles.bar,
                  { 
                    height: `${heightPercentage}%`,
                    backgroundColor: dataPoint.color || theme.colors.interactive.primary 
                  }
                ]} />
              </View>
            );
          })}
        </View>

        {/* X-axis labels */}
        <View style={styles.xAxisContainer}>
          {chartData.map((dataPoint, index) => (
            <Text key={index} style={styles.xAxisLabel}>
              {dataPoint.day}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  // Default stats if none provided
  const defaultStats: ScoreStatsData[] = [
    { value: 4, label: 'Days' },
    { value: 45, label: 'Progress', percentage: 45, trend: 'up' },
    { value: 15, label: 'Decrease', percentage: 15, trend: 'down' },
  ];

  // Default chart data if none provided
  const defaultChartData: ChartDataPoint[] = [
    { day: 'Sn', value: 80 },
    { day: 'Mn', value: 5 },
    { day: 'Te', value: 70 },
    { day: 'Wd', value: 2 },
    { day: 'Tr', value: 90 },
    { day: 'Fr', value: 80 },
    { day: 'Sa', value: 5 },
  ];

  const displayStats = stats.length > 0 ? stats : defaultStats;
  const displayChartData = chartData.length > 0 ? chartData : defaultChartData;

  return (
    <View style={[styles.container, style]} testID={testID}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        {/* Time Period Picker */}
        {showTimePicker && (
          <View style={styles.pickerContainer}>
            <Pressable 
              style={styles.pickerButton}
              onPress={() => setShowPicker(!showPicker)}
            >
              <Text style={styles.pickerButtonText}>{selectedPeriod}</Text>
              <Ionicons 
                name={showPicker ? 'chevron-up' : 'chevron-down'} 
                size={16} 
                color={theme.colors.text.secondary}
              />
            </Pressable>
            
            {showPicker && (
              <View style={styles.pickerDropdown}>
                {timePeriods.map((period) => (
                  <Pressable
                    key={period}
                    style={styles.pickerOption}
                    onPress={() => handlePeriodChange(period)}
                  >
                    <Text style={styles.pickerOptionText}>{period}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        )}
      </View>

      {/* Statistics Cards */}
      <View style={styles.statsContainer}>
        {displayStats.map((stat, index) => renderStatCard(stat, index))}
      </View>

      {/* Chart */}
      {renderChart()}
    </View>
  );
};

const useThemedStyles = createThemedStyles((theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: theme.borderWidth.sm,
    borderColor: theme.colors.border.primary,
    ...theme.elevation.sm,
    marginVertical: theme.spacing.md,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.lg,
  },

  titleContainer: {
    flex: 1,
  },

  title: {
    fontSize: theme.fontSizes.body,
    fontWeight: theme.fontConfig.fontWeight.medium,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },

  subtitle: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text.tertiary,
  },

  pickerContainer: {
    position: 'relative',
    minWidth: 120,
  },

  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderWidth: theme.borderWidth.sm,
    borderColor: theme.colors.border.secondary,
    ...theme.elevation.sm,
  },

  pickerButtonText: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text.primary,
    marginRight: theme.spacing.sm,
  },

  pickerDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.md,
    borderWidth: theme.borderWidth.sm,
    borderColor: theme.colors.border.primary,
    ...theme.elevation.sm,
    zIndex: 1000,
  },

  pickerOption: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.border.secondary,
  },

  pickerOptionText: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text.primary,
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },

  statCard: {
    flex: 1,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 70,
  },

  neutralStatCard: {
    backgroundColor: theme.colors.background.primary,
  },

  positiveStatCard: {
    backgroundColor: theme.colors.status.successBackground,
  },

  negativeStatCard: {
    backgroundColor: theme.colors.status.errorBackground,
  },

  neutralStatContent: {
    alignItems: 'center',
  },

  trendStatContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },

  statValue: {
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontConfig.fontWeight.bold,
  },

  statLabel: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },

  statLabelSmall: {
    fontSize: theme.fontSizes.caption,
    textAlign: 'center',
  },

  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 170,
    marginTop: theme.spacing.md,
  },

  yAxisContainer: {
    justifyContent: 'space-between',
    height: 120,
    marginRight: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },

  axisLabel: {
    fontSize: theme.fontSizes.caption,
    color: theme.colors.text.tertiary,
  },

  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
    gap: theme.spacing.sm,
  },

  barContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },

  bar: {
    backgroundColor: theme.colors.interactive.primary,
    borderRadius: theme.borderRadius.sm,
    minHeight: 4,
    ...theme.elevation.sm,
  },

  xAxisContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: theme.spacing.sm,
    paddingLeft: theme.spacing.lg,
  },

  xAxisLabel: {
    fontSize: theme.fontSizes.caption,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    flex: 1,
  },
}));

export default ScoreStatistics;