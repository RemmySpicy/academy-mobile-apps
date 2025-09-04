import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-gifted-charts';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme, createThemedStyles } from '@academy/mobile-shared';
import { PerformanceChartData, ChartType, TimePeriod } from '../../types';

const { width: screenWidth } = Dimensions.get('window');

interface PerformanceChartProps {
  chartData: PerformanceChartData;
  showPeriodSelector?: boolean;
  showFullscreen?: boolean;
  height?: number;
  onPeriodChange?: (period: TimePeriod) => void;
  onDataPointPress?: (dataPoint: any, index: number) => void;
  style?: any;
}

const TIME_PERIODS: { key: TimePeriod; label: string }[] = [
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
  { key: 'quarter', label: 'Quarter' },
  { key: 'semester', label: 'Semester' },
  { key: 'year', label: 'Year' },
];

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
  chartData,
  showPeriodSelector = true,
  showFullscreen = false,
  height = 220,
  onPeriodChange,
  onDataPointPress,
  style,
}) => {
  const { theme } = useTheme();
  const styles = useThemedStyles();
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>(chartData.period);

  const handlePeriodChange = (period: TimePeriod) => {
    setSelectedPeriod(period);
    onPeriodChange?.(period);
  };

  const renderLineChart = () => {
    // Check if this is a swimming time chart that needs inversion
    const isSwimmingChart = chartData.yAxisLabel?.toLowerCase().includes('time') || 
                           chartData.title?.toLowerCase().includes('time');
    
    // Get all values to find the range
    const values = chartData.data.map(point => 
      typeof point.value === 'number' ? point.value : parseFloat(point.value.toString())
    );
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    
    const data = chartData.data.map((point, index) => {
      const originalValue = typeof point.value === 'number' ? point.value : parseFloat(point.value.toString());
      
      // For swimming times, invert by subtracting from max + a small offset
      const displayValue = isSwimmingChart 
        ? (maxValue + minValue) - originalValue
        : originalValue;
      
      return {
        value: displayValue,
        label: point.label,
        dataPointText: point.formattedValue || originalValue.toString(),
      };
    });

    // Format y-axis values - convert back to original times for swimming charts
    const formatYAxisValue = (value: any) => {
      const numValue = typeof value === 'number' ? value : parseFloat(value);
      if (isNaN(numValue)) return value.toString();
      
      if (isSwimmingChart) {
        const originalValue = (maxValue + minValue) - numValue;
        return originalValue.toFixed(2);
      }
      
      return numValue.toFixed(2).padStart(5, '0');
    };

    // Add goal line as reference for swimming charts
    const referenceLines = [];
    if (isSwimmingChart && chartData.goalLine) {
      // Transform the goal line value using the same inversion logic
      const transformedGoalValue = (maxValue + minValue) - chartData.goalLine;
      referenceLines.push({
        value: transformedGoalValue,
        color: theme.colors.status.success,
        thickness: 2,
        dashPattern: [10, 5],
        label: 'Goal',
        labelTextStyle: { color: theme.colors.status.success, fontSize: 10 }
      });
    }

    // Set Y-axis range for swimming charts to include goal line
    const yAxisConfig = isSwimmingChart ? {
      yAxisOffset: Math.min(minValue, chartData.goalLine || minValue) - 0.1,
      maxValue: Math.max(maxValue, chartData.goalLine || maxValue) + 0.1,
    } : {};

    return (
      <LineChart
        data={data}
        width={Math.min(screenWidth - 80, screenWidth * 0.9)}
        height={height - 60}
        color={chartData.color || theme.colors.interactive.primary}
        thickness={3}
        curved={true}
        isAnimated={true}
        animationDuration={1000}
        startFillColor={`${chartData.color || theme.colors.interactive.primary}40`}
        endFillColor={`${chartData.color || theme.colors.interactive.primary}10`}
        startOpacity={0.8}
        endOpacity={0.1}
        backgroundColor="transparent"
        rulesType="solid"
        rulesColor={theme.colors.border.primary}
        xAxisColor={theme.colors.border.primary}
        yAxisColor={theme.colors.border.primary}
        yAxisTextStyle={{ color: theme.colors.text.secondary, fontSize: 12 }}
        xAxisLabelTextStyle={{ color: theme.colors.text.secondary, fontSize: 10 }}
        formatYLabel={formatYAxisValue}
        showDataPointOnPress
        pressEnabled
        showTextOnPress
        textShiftY={-10}
        textShiftX={-10}
        textColor1={theme.colors.text.primary}
        dataPointsColor={chartData.color || theme.colors.interactive.primary}
        dataPointsRadius={4}
        focusEnabled
        showStripOnFocus
        stripColor={theme.colors.border.secondary}
        stripOpacity={0.5}
        onPress={(item: any, index: number) => onDataPointPress?.(item, index)}
        referenceLinesConfig={referenceLines.length > 0 ? { referenceLinesData: referenceLines } : undefined}
        {...yAxisConfig}
      />
    );
  };

  const renderBarChart = () => {
    // Check if this is a swimming time chart that needs inversion
    const isSwimmingChart = chartData.yAxisLabel?.toLowerCase().includes('time') || 
                           chartData.title?.toLowerCase().includes('time');
    
    // Get all values to find the range
    const values = chartData.data.map(point => 
      typeof point.value === 'number' ? point.value : parseFloat(point.value.toString())
    );
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    
    const data = chartData.data.map((point, index) => {
      const originalValue = typeof point.value === 'number' ? point.value : parseFloat(point.value.toString());
      
      // For swimming times, invert by subtracting from max + min
      const displayValue = isSwimmingChart 
        ? (maxValue + minValue) - originalValue
        : originalValue;
      
      return {
        value: displayValue,
        label: point.label,
        frontColor: point.color || chartData.color || theme.colors.interactive.primary,
        gradientColor: `${point.color || chartData.color || theme.colors.interactive.primary}80`,
      };
    });

    // Format y-axis values - convert back to original times for swimming charts
    const formatYAxisValue = (value: any) => {
      const numValue = typeof value === 'number' ? value : parseFloat(value);
      if (isNaN(numValue)) return value.toString();
      
      if (isSwimmingChart) {
        const originalValue = (maxValue + minValue) - numValue;
        return originalValue.toFixed(2);
      }
      
      return numValue.toFixed(2);
    };

    // Add goal line as reference for swimming charts
    const referenceLines = [];
    if (isSwimmingChart && chartData.goalLine) {
      // Transform the goal line value using the same inversion logic
      const transformedGoalValue = (maxValue + minValue) - chartData.goalLine;
      referenceLines.push({
        value: transformedGoalValue,
        color: theme.colors.status.success,
        thickness: 2,
        dashPattern: [10, 5],
        label: 'Goal',
        labelTextStyle: { color: theme.colors.status.success, fontSize: 10 }
      });
    }

    // Set Y-axis range for swimming charts to include goal line
    const yAxisConfig = isSwimmingChart ? {
      yAxisOffset: Math.min(minValue, chartData.goalLine || minValue) - 0.1,
      maxValue: Math.max(maxValue, chartData.goalLine || maxValue) + 0.1,
    } : {};

    return (
      <BarChart
        data={data}
        width={Math.min(screenWidth - 80, screenWidth * 0.9)}
        height={height - 60}
        barWidth={Math.max(20, (screenWidth - 120) / data.length - 10)}
        spacing={Math.max(10, (screenWidth - 120) / data.length / 4)}
        isAnimated={true}
        animationDuration={1000}
        backgroundColor="transparent"
        yAxisColor={theme.colors.border.primary}
        xAxisColor={theme.colors.border.primary}
        yAxisTextStyle={{ color: theme.colors.text.secondary, fontSize: 12 }}
        xAxisLabelTextStyle={{ color: theme.colors.text.secondary, fontSize: 10 }}
        formatYLabel={formatYAxisValue}
        showGradient={true}
        roundedTop
        roundedBottom
        onPress={(item: any, index: number) => onDataPointPress?.(item, index)}
        referenceLinesConfig={referenceLines.length > 0 ? { referenceLinesData: referenceLines } : undefined}
        {...yAxisConfig}
      />
    );
  };

  const renderPieChart = () => {
    const data = chartData.data.map((point, index) => {
      const baseColor = point.color || chartData.color || theme.colors.interactive.primary;
      const opacity = Math.max(0.3, 1 - (index * 0.15));
      
      return {
        value: typeof point.value === 'number' ? point.value : parseFloat(point.value.toString()),
        color: `${baseColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
        text: point.label,
        textColor: theme.colors.text.primary,
        textSize: 12,
      };
    });

    const totalValue = data.reduce((sum, item) => sum + item.value, 0);

    return (
      <View style={styles.pieChartContainer}>
        <PieChart
          data={data}
          radius={Math.min(height / 3, 80)}
          donut={true}
          innerRadius={Math.min(height / 6, 40)}
          showText={true}
          textColor={theme.colors.text.primary}
          textSize={10}
          centerLabelComponent={() => (
            <View style={styles.pieCenterLabel}>
              <Text style={styles.pieCenterValue}>{totalValue}</Text>
              <Text style={styles.pieCenterUnit}>Total</Text>
            </View>
          )}
          onPress={(item: any, index: number) => onDataPointPress?.(item, index)}
        />
        
        <View style={styles.pieLegend}>
          {data.map((item, index) => (
            <View key={index} style={styles.pieLegendItem}>
              <View style={[styles.pieLegendColor, { backgroundColor: item.color }]} />
              <Text style={styles.pieLegendText}>{item.text}</Text>
              <Text style={styles.pieLegendValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderChart = () => {
    switch (chartData.type) {
      case 'line':
      case 'area':
        return renderLineChart();
      case 'bar':
        return renderBarChart();
      case 'pie':
        return renderPieChart();
      default:
        return renderLineChart();
    }
  };

  return (
    <Animated.View
      entering={FadeInDown.springify()}
      style={[styles.container, style]}
    >
      {/* Chart Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{chartData.title}</Text>
          {chartData.yAxisLabel && (
            <Text style={styles.subtitle}>{chartData.yAxisLabel}</Text>
          )}
        </View>
        
        {showFullscreen && (
          <Pressable style={styles.fullscreenButton}>
            <Ionicons name="expand" size={20} color={theme.colors.icon.secondary} />
          </Pressable>
        )}
      </View>

      {/* Period Selector */}
      {showPeriodSelector && (
        <View style={styles.periodSelector}>
          {TIME_PERIODS.map((period) => (
            <Pressable
              key={period.key}
              style={[
                styles.periodButton,
                selectedPeriod === period.key && styles.periodButtonActive
              ]}
              onPress={() => handlePeriodChange(period.key)}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === period.key && styles.periodButtonTextActive
              ]}>
                {period.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Chart Container */}
      <View style={[styles.chartContainer, { height }]}>
        {chartData.data.length > 0 ? (
          renderChart()
        ) : (
          <View style={styles.noDataContainer}>
            <Ionicons 
              name="bar-chart-outline" 
              size={48} 
              color={theme.colors.icon.disabled} 
            />
            <Text style={styles.noDataText}>No data available</Text>
            <Text style={styles.noDataSubtext}>
              Complete some activities to see your performance data
            </Text>
          </View>
        )}
      </View>

      {/* Chart Labels */}
      {chartData.xAxisLabel && chartData.yAxisLabel && chartData.type !== 'pie' && (
        <View style={styles.axisLabels}>
          <Text style={styles.axisLabel}>{chartData.xAxisLabel}</Text>
          <Text style={styles.axisLabel}>{chartData.yAxisLabel}</Text>
        </View>
      )}
    </Animated.View>
  );
};

const useThemedStyles = createThemedStyles((theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      ...theme.elevation.sm,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.md,
    },
    titleContainer: {
      flex: 1,
    },
    title: {
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
    },
    subtitle: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text.secondary,
      marginTop: 2,
    },
    fullscreenButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.background.secondary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    periodSelector: {
      flexDirection: 'row',
      marginBottom: theme.spacing.md,
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.xs,
    },
    periodButton: {
      flex: 1,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.xs,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
    },
    periodButtonActive: {
      backgroundColor: theme.colors.interactive.primary,
    },
    periodButtonText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text.secondary,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
    periodButtonTextActive: {
      color: theme.colors.text.inverse,
    },
    chartContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    noDataContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    noDataText: {
      fontSize: theme.fontSizes.base,
      color: theme.colors.text.secondary,
      marginTop: theme.spacing.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
    noDataSubtext: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text.tertiary,
      marginTop: theme.spacing.xs,
      textAlign: 'center',
    },
    pieChartContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    pieCenterLabel: {
      alignItems: 'center',
    },
    pieCenterValue: {
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontConfig.fontWeight.bold,
      color: theme.colors.text.primary,
    },
    pieCenterUnit: {
      fontSize: theme.fontSizes.xs,
      color: theme.colors.text.secondary,
    },
    pieLegend: {
      flex: 1,
      marginLeft: theme.spacing.lg,
    },
    pieLegendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    pieLegendColor: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: theme.spacing.sm,
    },
    pieLegendText: {
      flex: 1,
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text.primary,
    },
    pieLegendValue: {
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: theme.colors.text.secondary,
    },
    axisLabels: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.spacing.sm,
    },
    axisLabel: {
      fontSize: theme.fontSizes.xs,
      color: theme.colors.text.tertiary,
      fontStyle: 'italic',
    },
  })
);