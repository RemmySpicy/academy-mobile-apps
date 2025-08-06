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
import { Iconify } from 'react-native-iconify';
import { Show } from '../ui/Show';
import ErrorMessage from '../ui/ErrorMessage';

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
  primaryColor = '#8A74DB',
  backgroundColor = '#FFFFFF',
  textColor = '#1F2937',
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
  const [selectedPeriod, setSelectedPeriod] = useState<ChartPeriod>(period);
  const [selectedDataPoint, setSelectedDataPoint] = useState<number | null>(null);

  const periods: { key: ChartPeriod; label: string }[] = [
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
    { key: 'quarter', label: 'Quarter' },
    { key: 'year', label: 'Year' },
    { key: 'all', label: 'All Time' },
  ];

  const chartConfig = useMemo(() => ({
    backgroundColor: backgroundColor,
    backgroundGradientFrom: backgroundColor,
    backgroundGradientTo: backgroundColor,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(138, 116, 219, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(31, 41, 55, ${opacity})`,
    style: {
      borderRadius: 12,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: primaryColor,
    },
    propsForBackgroundLines: {
      strokeDasharray: showGrid ? '5,5' : '0,0',
      stroke: 'rgba(0,0,0,0.1)',
    },
    fillShadowGradient: primaryColor,
    fillShadowGradientOpacity: 0.3,
  }), [backgroundColor, primaryColor, showGrid]);

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
          <ActivityIndicator size="large" color={primaryColor} />
          <Text style={[styles.loadingText, { color: textColor }]}>
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
                <Iconify
                  icon={metric.icon!}
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
                  <Iconify
                    icon={getChangeIcon(metric.changeType)}
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

  return (
    <View
      style={[styles.container, { backgroundColor, padding }]}
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

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginVertical: 8,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
  },
  periodSelector: {
    marginBottom: 16,
  },
  periodSelectorContent: {
    paddingHorizontal: 4,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  periodButtonActive: {
    backgroundColor: '#8A74DB',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: 120,
    backgroundColor: 'rgba(0,0,0,0.02)',
    padding: 12,
    borderRadius: 8,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricIcon: {
    marginRight: 6,
  },
  metricTitle: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.7,
  },
  metricContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  changeText: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 2,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartWrapper: {
    alignItems: 'center',
    marginVertical: 8,
  },
  chart: {
    borderRadius: 12,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    opacity: 0.7,
  },
  comparisonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  comparisonItem: {
    alignItems: 'center',
  },
  comparisonLabel: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.7,
  },
  comparisonValue: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
  },
});

export default PerformanceChart;