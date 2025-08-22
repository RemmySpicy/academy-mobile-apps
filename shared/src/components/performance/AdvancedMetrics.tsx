import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import MetricPool from '../ui/MetricPool';

export interface MetricData {
  id: string;
  skill: string;
  count?: number;
  time?: string;
  swolf?: number;
  improvement?: number;
  rate?: string;
}

export interface MetricPoolRenderProps {
  courseActionMetrics: MetricData[][];
  title?: string;
  showShadow?: boolean;
}

export interface MetricsTimeProps {
  courseTimeMetrics: MetricData[][];
  title?: string;
  showShadow?: boolean;
}

export interface AdvancedScoreStatisticsProps {
  title?: string;
  subtitle?: string;
  timePeriods?: string[];
  defaultPeriod?: string;
  stats?: {
    value: number;
    label: string;
    type?: 'days' | 'progress-up' | 'progress-down' | 'neutral';
  }[];
  chartData?: {
    label: string;
    value: number;
  }[];
  onPeriodChange?: (period: string) => void;
}

export const MetricPoolRender: React.FC<MetricPoolRenderProps> = ({
  courseActionMetrics,
  title = 'Metrics: Pool Name',
  showShadow = true,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const actionMetrics = useMemo(() => {
    return courseActionMetrics?.flatMap((data) => data) || [];
  }, [courseActionMetrics]);

  return (
    <View style={[styles.container, showShadow && styles.shadow]}>
      <Text style={styles.title}>{title}</Text>
      
      <View style={styles.metricsRow}>
        {actionMetrics.map((metric: MetricData, index: number) => (
          <View key={metric.id || index} style={styles.metricItem}>
            <MetricPool
              poolName={metric.skill}
              poolNumber={metric.count?.toString() || '0'}
              poolRate={metric.swolf ? `${metric.swolf}%` : '0%'}
            />
          </View>
        ))}
      </View>
      
      {actionMetrics.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="analytics-outline" size={32} color={theme.colors.text.tertiary} />
          <Text style={styles.emptyText}>No metrics available</Text>
        </View>
      )}
    </View>
  );
};

export const MetricsTime: React.FC<MetricsTimeProps> = ({
  courseTimeMetrics,
  title = 'Best Times:',
  showShadow = true,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const timeMetrics = useMemo(() => {
    return courseTimeMetrics?.flatMap((data) => data) || [];
  }, [courseTimeMetrics]);

  return (
    <View style={[styles.container, showShadow && styles.shadow]}>
      <Text style={styles.title}>{title}</Text>
      
      <View style={styles.metricsRow}>
        {timeMetrics.map((metric: MetricData, index: number) => (
          <View key={metric.id || index} style={styles.metricItem}>
            <MetricPool
              poolName={metric.skill}
              poolNumber={metric.time || '0:00'}
              poolRate={metric.improvement ? `${metric.improvement > 0 ? '+' : ''}${metric.improvement}%` : '0%'}
            />
          </View>
        ))}
      </View>
      
      {timeMetrics.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="timer-outline" size={32} color={theme.colors.text.tertiary} />
          <Text style={styles.emptyText}>No time records available</Text>
        </View>
      )}
    </View>
  );
};

export const AdvancedScoreStatistics: React.FC<AdvancedScoreStatisticsProps> = ({
  title = 'Score Statistics',
  subtitle = 'weekly figures',
  timePeriods = ['7 Days', '30 Days', '60 Days'],
  defaultPeriod = '7 Days',
  stats = [
    { value: 4, label: 'Days', type: 'days' },
    { value: 45, label: 'Progress', type: 'progress-up' },
    { value: 45, label: 'Progress', type: 'progress-down' },
  ],
  chartData = [
    { label: 'Sn', value: 80 },
    { label: 'Mn', value: 5 },
    { label: 'Te', value: 70 },
    { label: 'Wd', value: 2 },
    { label: 'Tr', value: 90 },
    { label: 'Fr', value: 80 },
    { label: 'Sa', value: 5 },
  ],
  onPeriodChange,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [selectedPeriod, setSelectedPeriod] = useState(defaultPeriod);
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    setIsPickerVisible(false);
    onPeriodChange?.(period);
  };

  const getStatCardStyle = (type: string) => {
    switch (type) {
      case 'progress-up':
        return {
          backgroundColor: theme.colors.status.success + '20',
          textColor: theme.colors.status.success,
          icon: 'arrow-up' as const,
        };
      case 'progress-down':
        return {
          backgroundColor: theme.colors.status.error + '20',
          textColor: theme.colors.status.error,
          icon: 'arrow-down' as const,
        };
      case 'days':
      default:
        return {
          backgroundColor: theme.colors.background.primary,
          textColor: theme.colors.text.primary,
          icon: null,
        };
    }
  };

  const maxValue = Math.max(...chartData.map(item => item.value), 1);

  return (
    <View style={[styles.container, styles.shadow, styles.statisticsContainer]}>
      {/* Header */}
      <View style={styles.statisticsHeader}>
        <View>
          <Text style={styles.statisticsTitle}>{title}</Text>
          <Text style={styles.statisticsSubtitle}>{subtitle}</Text>
        </View>
        
        {/* Period Selector */}
        <TouchableOpacity
          style={styles.periodSelector}
          onPress={() => setIsPickerVisible(!isPickerVisible)}
        >
          <Text style={styles.periodText}>{selectedPeriod}</Text>
          <Ionicons 
            name={isPickerVisible ? "chevron-up" : "chevron-down"} 
            size={16} 
            color={theme.colors.text.secondary} 
          />
        </TouchableOpacity>
      </View>

      {/* Period Options */}
      {isPickerVisible && (
        <View style={styles.periodOptions}>
          {timePeriods.map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodOption,
                selectedPeriod === period && styles.selectedPeriodOption
              ]}
              onPress={() => handlePeriodChange(period)}
            >
              <Text style={[
                styles.periodOptionText,
                selectedPeriod === period && styles.selectedPeriodOptionText
              ]}>
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Statistics Cards */}
      <View style={styles.statsRow}>
        {stats.map((stat, index) => {
          const cardStyle = getStatCardStyle(stat.type || 'neutral');
          return (
            <View
              key={index}
              style={[
                styles.statCard,
                { backgroundColor: cardStyle.backgroundColor }
              ]}
            >
              <View style={styles.statContent}>
                {cardStyle.icon && (
                  <Ionicons 
                    name={cardStyle.icon} 
                    size={16} 
                    color={cardStyle.textColor}
                    style={styles.statIcon}
                  />
                )}
                <View style={styles.statTextContainer}>
                  <Text style={[styles.statValue, { color: cardStyle.textColor }]}>
                    {stat.type?.includes('progress') ? `${stat.value}%` : stat.value}
                  </Text>
                  <Text style={[styles.statLabel, { color: cardStyle.textColor }]}>
                    {stat.label}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* Chart */}
      <View style={styles.chartContainer}>
        {/* Y-axis labels */}
        <View style={styles.yAxisContainer}>
          <Text style={styles.yAxisLabel}>100</Text>
          <Text style={styles.yAxisLabel}>M</Text>
          <Text style={styles.yAxisLabel}>U</Text>
          <Text style={styles.yAxisLabel}>V</Text>
          <Text style={styles.yAxisLabel}>0</Text>
        </View>

        {/* Chart bars */}
        <View style={styles.chartBars}>
          {chartData.map((item, index) => {
            const barHeight = (item.value / maxValue) * 140; // Max height of 140px
            return (
              <View key={index} style={styles.barContainer}>
                <View style={[styles.barBackground, styles.shadow]}>
                  <View 
                    style={[
                      styles.bar,
                      { 
                        height: barHeight,
                        backgroundColor: theme.colors.interactive.primary 
                      }
                    ]} 
                  />
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* X-axis labels */}
      <View style={styles.xAxisLabels}>
        {chartData.map((item, index) => (
          <Text key={index} style={styles.xAxisLabel}>
            {item.label}
          </Text>
        ))}
      </View>
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginVertical: theme.spacing.sm,
  },
  shadow: {
    ...theme.elevation.lg,
  },
  title: {
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontConfig.fontWeight.semibold,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  metricItem: {
    flex: 1,
    minWidth: 80,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.sm,
  },
  
  // Statistics specific styles
  statisticsContainer: {
    marginTop: theme.spacing.lg,
  },
  statisticsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  statisticsTitle: {
    fontSize: theme.fontSizes.base,
    color: theme.colors.text.secondary,
    fontWeight: theme.fontConfig.fontWeight.medium,
  },
  statisticsSubtitle: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text.tertiary,
  },
  periodSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.xs,
    ...theme.elevation.xs,
  },
  periodText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text.primary,
  },
  periodOptions: {
    position: 'absolute',
    top: 80,
    right: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.md,
    ...theme.elevation.sm,
    zIndex: 1000,
  },
  periodOption: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  selectedPeriodOption: {
    backgroundColor: theme.colors.interactive.primary + '20',
  },
  periodOptionText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text.primary,
  },
  selectedPeriodOptionText: {
    color: theme.colors.interactive.primary,
    fontWeight: theme.fontConfig.fontWeight.medium,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  statCard: {
    flex: 1,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    minHeight: 60,
    justifyContent: 'center',
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIcon: {
    marginRight: theme.spacing.xs,
  },
  statTextContainer: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontConfig.fontWeight.semibold,
  },
  statLabel: {
    fontSize: theme.fontSizes.sm,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 170,
    marginVertical: theme.spacing.md,
  },
  yAxisContainer: {
    justifyContent: 'space-between',
    height: 170,
    paddingRight: theme.spacing.sm,
    paddingTop: theme.spacing.md,
  },
  yAxisLabel: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.text.tertiary,
  },
  chartBars: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 170,
    paddingTop: theme.spacing.md,
  },
  barContainer: {
    alignItems: 'center',
    height: 170 - theme.spacing.md,
  },
  barBackground: {
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: theme.borderRadius.sm,
    width: 16,
    height: 170 - theme.spacing.md,
    justifyContent: 'flex-end',
  },
  bar: {
    width: 12,
    backgroundColor: theme.colors.interactive.primary,
    borderRadius: theme.borderRadius.sm,
    alignSelf: 'center',
    marginBottom: theme.spacing.xs,
  },
  xAxisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingLeft: theme.spacing.lg,
  },
  xAxisLabel: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.text.tertiary,
  },
});

export default { MetricPoolRender, MetricsTime, AdvancedScoreStatistics };