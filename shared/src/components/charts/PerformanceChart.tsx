import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
} from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { Show } from '../ui/Show';
import ErrorMessage from '../ui/ErrorMessage';
import { useTheme, createThemedStyles } from '../../theme/ThemeProvider';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type ChartType = 'line' | 'bar' | 'pie' | 'progress';
export type ChartPeriod = 'week' | 'month' | 'quarter' | 'year' | 'all';

export interface DataPoint {
  value: number;
  label?: string;
  date?: string;
  color?: string;
  legendFontColor?: string;
  legendFontSize?: number;
}

export interface Dataset {
  data: number[];
  color?: (opacity: number) => string;
  strokeWidth?: number;
  label?: string;
}

export interface ChartData {
  labels?: string[];
  datasets?: Dataset[];
  data?: DataPoint[]; // For pie charts
}

export interface PerformanceMetric {
  title: string;
  value: string | number;
  change?: number; // Percentage change
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: string;
  color?: string;
}

export interface PerformanceChartProps {
  // Data
  data: ChartData;
  metrics?: PerformanceMetric[];
  
  // Chart configuration
  type?: ChartType;
  title?: string;
  subtitle?: string;
  period?: ChartPeriod;
  
  // Styling and layout
  height?: number;
  width?: number;
  padding?: number;
  showLegend?: boolean;
  showMetrics?: boolean;
  showPeriodSelector?: boolean;
  
  // Colors and theming
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  
  // States
  loading?: boolean;
  error?: string;
  
  // Callbacks
  onPeriodChange?: (period: ChartPeriod) => void;
  onDataPointPress?: (dataPoint: any, index: number) => void;
  
  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
  
  // Chart-specific props
  bezier?: boolean;
  showGrid?: boolean;
  animated?: boolean;
  formatValue?: (value: number) => string;
  
  // Advanced
  goal?: number;
  goalLabel?: string;
  comparison?: {
    value: number;
    label: string;
    type: 'above' | 'below' | 'equal';
  };
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({
  data,
  metrics = [],
  type = 'line',
  title,
  subtitle,
  period = 'month',
  height = 220,
  width = SCREEN_WIDTH - 32,
  padding = 16,
  showLegend = false,
  showMetrics = true,
  showPeriodSelector = true,
  primaryColor,
  backgroundColor,
  textColor,
  loading = false,
  error,
  onPeriodChange,
  onDataPointPress,
  accessibilityLabel,
  accessibilityHint,
  bezier = true,
  showGrid = true,
  animated = true,
  formatValue,
  goal,
  goalLabel,
  comparison,
}) => {
  const { theme } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<ChartPeriod>(period);
  const [selectedDataPoint, setSelectedDataPoint] = useState<number | null>(null);
  
  // Use theme colors as defaults
  const resolvedPrimaryColor = primaryColor || theme.colors.interactive.primary;
  const resolvedBackgroundColor = backgroundColor || theme.colors.background.primary;
  const resolvedTextColor = textColor || theme.colors.text.primary;

  const periods: { key: ChartPeriod; label: string }[] = [
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
    { key: 'quarter', label: 'Quarter' },
    { key: 'year', label: 'Year' },
    { key: 'all', label: 'All Time' },
  ];

  const chartConfig = useMemo(() => ({
    backgroundColor: resolvedBackgroundColor,
    backgroundGradientFrom: resolvedBackgroundColor,
    backgroundGradientTo: resolvedBackgroundColor,
    decimalPlaces: 0,
    color: (opacity = 1) => resolvedPrimaryColor + Math.round(opacity * 255).toString(16).padStart(2, '0'),
    labelColor: (opacity = 1) => resolvedTextColor + Math.round(opacity * 255).toString(16).padStart(2, '0'),
    style: {
      borderRadius: 12,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: resolvedPrimaryColor,
    },
    propsForBackgroundLines: {
      strokeDasharray: showGrid ? '5,5' : '0,0',
      stroke: theme.colors.border.primary,
    },
    fillShadowGradient: resolvedPrimaryColor,
    fillShadowGradientOpacity: 0.3,
  }), [resolvedBackgroundColor, resolvedPrimaryColor, resolvedTextColor, showGrid, theme.colors.border.primary]);

  const handlePeriodChange = (newPeriod: ChartPeriod) => {
    setSelectedPeriod(newPeriod);
    onPeriodChange?.(newPeriod);
  };

  const handleDataPointPress = (point: any, pointIndex: number) => {
    setSelectedDataPoint(pointIndex);
    onDataPointPress?.(point, pointIndex);
  };

  const getChangeIcon = (changeType?: string) => {
    switch (changeType) {
      case 'increase':
        return 'ri:arrow-up-line';
      case 'decrease':
        return 'ri:arrow-down-line';
      default:
        return 'ri:subtract-line';
    }
  };

  const getChangeColor = (changeType?: string) => {
    switch (changeType) {
      case 'increase':
        return '#10B981';
      case 'decrease':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const renderChart = () => {
    if (loading) {
      return (
        <View style={[styles.chartContainer, { height, justifyContent: 'center' }]}>
          <ActivityIndicator size="large" color={resolvedPrimaryColor} />
          <Text style={[styles.loadingText, { color: resolvedTextColor }]}>
            Loading chart data...
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={[styles.chartContainer, { height }]}>
          <ErrorMessage
            message={error}
            variant="card"
            severity="error"
            title="Chart Error"
          />
        </View>
      );
    }

    const commonProps = {
      width,
      height,
      chartConfig,
      style: styles.chart,
      onDataPointClick: onDataPointPress ? handleDataPointPress : undefined,
    };

    switch (type) {
      case 'line':
        return (
          <LineChart
            data={data as any}
            bezier={bezier}
            {...commonProps}
          />
        );
      
      case 'bar':
        return (
          <BarChart
            data={data as any}
            showValuesOnTopOfBars={true}
            fromZero={true}
            {...commonProps}
          />
        );
      
      case 'pie':
        return (
          <PieChart
            data={data.data || []}
            width={width}
            height={height}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="value"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            style={styles.chart}
          />
        );
      
      case 'progress':
        const progressData = data.data?.reduce((acc, item) => {
          acc[item.label || 'progress'] = item.value / 100;
          return acc;
        }, {} as any) || {};

        return (
          <ProgressChart
            data={progressData}
            width={width}
            height={height}
            strokeWidth={16}
            radius={32}
            chartConfig={chartConfig}
            hideLegend={!showLegend}
            style={styles.chart}
          />
        );
      
      default:
        return null;
    }
  };

  const renderMetrics = () => {
    if (!showMetrics || metrics.length === 0) return null;

    return (
      <View style={styles.metricsContainer}>
        {metrics.map((metric, index) => (
          <View key={index} style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Show.When isTrue={!!metric.icon}>
                <Ionicons
                  name={metric.icon!}
                  size={20}
                  color={metric.color || primaryColor}
                  style={styles.metricIcon}
                />
              </Show.When>
              <Text style={[styles.metricTitle, { color: textColor }]}>
                {metric.title}
              </Text>
            </View>
            
            <View style={styles.metricContent}>
              <Text style={[styles.metricValue, { color: textColor }]}>
                {formatValue ? formatValue(Number(metric.value)) : metric.value}
              </Text>
              
              <Show.When isTrue={metric.change !== undefined}>
                <View style={[
                  styles.changeContainer,
                  { backgroundColor: getChangeColor(metric.changeType) + '20' }
                ]}>
                  <Ionicons
                    name={getChangeIcon(metric.changeType)}
                    size={12}
                    color={getChangeColor(metric.changeType)}
                  />
                  <Text style={[
                    styles.changeText,
                    { color: getChangeColor(metric.changeType) }
                  ]}>
                    {Math.abs(metric.change || 0)}%
                  </Text>
                </View>
              </Show.When>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderPeriodSelector = () => {
    if (!showPeriodSelector) return null;

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.periodSelector}
        contentContainerStyle={styles.periodSelectorContent}
      >
        {periods.map((p) => (
          <TouchableOpacity
            key={p.key}
            style={[
              styles.periodButton,
              selectedPeriod === p.key && [
                styles.periodButtonActive,
                { backgroundColor: primaryColor }
              ]
            ]}
            onPress={() => handlePeriodChange(p.key)}
            accessibilityRole="button"
            accessibilityLabel={`Select ${p.label} period`}
          >
            <Text style={[
              styles.periodButtonText,
              { color: textColor },
              selectedPeriod === p.key && styles.periodButtonTextActive
            ]}>
              {p.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderGoalComparison = () => {
    if (!goal && !comparison) return null;

    return (
      <View style={styles.comparisonContainer}>
        <Show.When isTrue={!!goal}>
          <View style={styles.comparisonItem}>
            <Text style={[styles.comparisonLabel, { color: textColor }]}>
              {goalLabel || 'Goal'}:
            </Text>
            <Text style={[styles.comparisonValue, { color: primaryColor }]}>
              {formatValue ? formatValue(goal!) : goal}
            </Text>
          </View>
        </Show.When>

        <Show.When isTrue={!!comparison}>
          <View style={styles.comparisonItem}>
            <Text style={[styles.comparisonLabel, { color: textColor }]}>
              {comparison!.label}:
            </Text>
            <Text style={[
              styles.comparisonValue,
              {
                color: comparison!.type === 'above' ? '#10B981' :
                       comparison!.type === 'below' ? '#EF4444' : '#6B7280'
              }
            ]}>
              {comparison!.type === 'above' ? '+' : comparison!.type === 'below' ? '-' : ''}
              {formatValue ? formatValue(comparison!.value) : comparison!.value}
            </Text>
          </View>
        </Show.When>
      </View>
    );
  };

  const styles = useThemedStyles();

  return (
    <View
      style={[styles.container, { backgroundColor: resolvedBackgroundColor, padding }]}
      accessibilityLabel={accessibilityLabel || `${title} performance chart`}
      accessibilityHint={accessibilityHint}
    >
      <Show.When isTrue={!!(title || subtitle)}>
        <View style={styles.header}>
          <Show.When isTrue={!!title}>
            <Text style={[styles.title, { color: textColor }]}>
              {title}
            </Text>
          </Show.When>
          <Show.When isTrue={!!subtitle}>
            <Text style={[styles.subtitle, { color: textColor + '80' }]}>
              {subtitle}
            </Text>
          </Show.When>
        </View>
      </Show.When>

      {renderPeriodSelector()}
      {renderMetrics()}
      
      <View style={styles.chartWrapper}>
        {renderChart()}
      </View>
      
      {renderGoalComparison()}
    </View>
  );
};

const useThemedStyles = createThemedStyles((theme) =>
  StyleSheet.create({
    container: {
      borderRadius: theme.borderRadius.lg,
      marginVertical: theme.spacing[2],
      backgroundColor: theme.colors.background.elevated,
      ...theme.elevation.sm,
    },
    header: {
      marginBottom: theme.spacing[4],
    },
    title: {
      ...theme.typography.heading.h4,
      color: theme.colors.text.primary,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      marginBottom: theme.spacing[1],
    },
    subtitle: {
      ...theme.typography.body.sm,
      color: theme.colors.text.secondary,
    },
    periodSelector: {
      marginBottom: theme.spacing[4],
    },
    periodSelectorContent: {
      paddingHorizontal: theme.spacing[1],
    },
    periodButton: {
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[2],
      borderRadius: theme.borderRadius.full,
      marginHorizontal: theme.spacing[1],
      backgroundColor: theme.colors.background.secondary,
    },
    periodButtonActive: {
      backgroundColor: theme.colors.interactive.primary,
    },
    periodButtonText: {
      ...theme.typography.caption.base,
      color: theme.colors.text.secondary,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
    periodButtonTextActive: {
      color: theme.colors.text.inverse,
    },
    metricsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: theme.spacing[4],
      gap: theme.spacing[3],
    },
    metricCard: {
      flex: 1,
      minWidth: 120,
      backgroundColor: theme.colors.background.secondary,
      padding: theme.spacing[3],
      borderRadius: theme.borderRadius.md,
    },
    metricHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing[2],
    },
    metricIcon: {
      marginRight: theme.spacing[2],
    },
    metricTitle: {
      ...theme.typography.caption.base,
      color: theme.colors.text.secondary,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
    metricContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    metricValue: {
      ...theme.typography.heading.h5,
      color: theme.colors.text.primary,
      fontWeight: theme.fontConfig.fontWeight.semibold,
    },
    changeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing[2],
      paddingVertical: theme.spacing[1],
      borderRadius: theme.borderRadius.sm,
    },
    changeText: {
      ...theme.typography.caption.small,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      marginLeft: theme.spacing[1],
    },
    chartContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    chartWrapper: {
      alignItems: 'center',
      marginVertical: theme.spacing[2],
    },
    chart: {
      borderRadius: theme.borderRadius.lg,
    },
    loadingText: {
      ...theme.typography.body.sm,
      color: theme.colors.text.secondary,
      marginTop: theme.spacing[2],
    },
    comparisonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: theme.spacing[4],
      paddingTop: theme.spacing[4],
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.primary,
    },
    comparisonItem: {
      alignItems: 'center',
    },
    comparisonLabel: {
      ...theme.typography.caption.base,
      color: theme.colors.text.secondary,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
    comparisonValue: {
      ...theme.typography.body.base,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      marginTop: theme.spacing[1],
    },
  })
);

export default PerformanceChart;