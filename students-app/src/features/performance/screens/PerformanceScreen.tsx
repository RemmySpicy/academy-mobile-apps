import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { 
  useTheme, 
  createThemedStyles, 
  Header,
  FilterBar,
  CustomButton,
} from '@academy/mobile-shared';

import { PerformanceMetricCard } from '../components/shared/PerformanceMetricCard';
import { PerformanceChart } from '../components/charts/PerformanceChart';
import { SwimmingPerformanceAdapter } from '../programs/swimming/SwimmingPerformanceAdapter';

import {
  ProgramType,
  TimePeriod,
  BasePerformanceMetric,
  PerformanceChartData,
  PerformanceAnalytics,
  PerformanceFilters,
} from '../types';

// Mock data - in real app, this would come from the performance service
const mockSwimmingMetrics: BasePerformanceMetric[] = [
  {
    id: '1',
    title: '50m Freestyle',
    value: 45.23,
    unit: 'seconds',
    type: 'time',
    trend: { direction: 'up', percentage: 2.1, period: 'vs last month' },
    icon: 'timer',
    color: '#0EA5E9',
    category: 'Sprint',
    lastUpdated: new Date(),
    goal: 43.0,
    personalBest: 44.82,
  },
  {
    id: '2',
    title: 'Training Distance',
    value: 2400,
    unit: 'm',
    type: 'distance',
    trend: { direction: 'up', percentage: 15.3, period: 'vs last week' },
    icon: 'trending-up',
    color: '#10B981',
    category: 'Volume',
    lastUpdated: new Date(),
    goal: 3000,
  },
  {
    id: '3',
    title: 'Technique Score',
    value: 85,
    unit: '%',
    type: 'percentage',
    trend: { direction: 'up', percentage: 5.2, period: 'vs last session' },
    icon: 'analytics',
    color: '#8B5CF6',
    category: 'Technique',
    lastUpdated: new Date(),
    goal: 90,
  },
  {
    id: '4',
    title: 'Sessions This Week',
    value: 4,
    type: 'count',
    trend: { direction: 'neutral', percentage: 0, period: 'on target' },
    icon: 'calendar',
    color: '#F59E0B',
    category: 'Consistency',
    lastUpdated: new Date(),
    goal: 4,
  },
];

const mockChartData: PerformanceChartData[] = [
  {
    id: 'times_progress',
    title: 'Swimming Times Progress',
    type: 'line',
    data: [
      { label: 'Jan', value: 48.2 },
      { label: 'Feb', value: 47.1 },
      { label: 'Mar', value: 46.5 },
      { label: 'Apr', value: 45.9 },
      { label: 'May', value: 45.2 },
    ],
    xAxisLabel: 'Month',
    yAxisLabel: '50m Freestyle Time (sec)',
    color: '#0EA5E9',
    period: 'month',
  },
  {
    id: 'distance_weekly',
    title: 'Weekly Training Distance',
    type: 'bar',
    data: [
      { label: 'W1', value: 8500 },
      { label: 'W2', value: 9200 },
      { label: 'W3', value: 8800 },
      { label: 'W4', value: 9600 },
      { label: 'W5', value: 10200 },
    ],
    xAxisLabel: 'Week',
    yAxisLabel: 'Distance (m)',
    color: '#10B981',
    period: 'week',
  },
];

export const PerformanceScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = useThemedStyles();
  const insets = useSafeAreaInsets();
  
  const [selectedProgram, setSelectedProgram] = useState<ProgramType>('swimming');
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('month');
  const [metrics, setMetrics] = useState<BasePerformanceMetric[]>(mockSwimmingMetrics);
  const [charts, setCharts] = useState<PerformanceChartData[]>(mockChartData);
  const [analytics, setAnalytics] = useState<PerformanceAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const swimmingAdapter = new SwimmingPerformanceAdapter();

  const programs = [
    { id: 'swimming', label: 'Swimming', icon: 'water', color: '#0EA5E9' },
    { id: 'basketball', label: 'Basketball', icon: 'basketball', color: '#F97316' },
    { id: 'football', label: 'Football', icon: 'football', color: '#22C55E' },
    { id: 'music', label: 'Music', icon: 'musical-notes', color: '#A855F7' },
    { id: 'coding', label: 'Coding', icon: 'code-slash', color: '#3B82F6' },
  ];

  const filterGroups = [
    {
      id: 'period',
      title: 'Time Period',
      options: [
        { id: 'week', label: 'Week', value: 'week' },
        { id: 'month', label: 'Month', value: 'month' },
        { id: 'quarter', label: 'Quarter', value: 'quarter' },
        { id: 'semester', label: 'Semester', value: 'semester' },
        { id: 'year', label: 'Year', value: 'year' },
      ],
      multiSelect: false,
    },
  ];

  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string[] }>({
    period: [selectedPeriod]
  });

  useEffect(() => {
    loadPerformanceData();
  }, [selectedProgram, selectedPeriod]);

  const loadPerformanceData = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // In real app, this would fetch data based on selectedProgram and selectedPeriod
      setIsLoading(false);
    }, 1000);
  };

  const handleFilterChange = (groupId: string, optionId: string, selected: boolean) => {
    setSelectedFilters(prev => {
      const group = filterGroups.find(g => g.id === groupId);
      if (!group) return prev;

      if (group.multiSelect) {
        const currentSelections = prev[groupId] || [];
        if (selected) {
          return { ...prev, [groupId]: [...currentSelections, optionId] };
        } else {
          return { ...prev, [groupId]: currentSelections.filter(id => id !== optionId) };
        }
      } else {
        setSelectedPeriod(optionId as TimePeriod);
        return { ...prev, [groupId]: [optionId] };
      }
    });
  };

  const handleProgramSelect = (program: ProgramType) => {
    setSelectedProgram(program);
  };

  const handleExportData = () => {
    // TODO: Implement export functionality
    console.log('Export performance data');
  };

  const handleSetGoals = () => {
    // TODO: Navigate to goals screen
    console.log('Navigate to goals screen');
  };

  const renderProgramSelector = () => (
    <Animated.View
      entering={FadeInDown.delay(100).springify()}
      style={styles.programSelectorSection}
    >
      <Text style={styles.sectionTitle}>Select Program</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.programSelectorContainer}
      >
        {programs.map((program) => (
          <Pressable
            key={program.id}
            style={[
              styles.programButton,
              selectedProgram === program.id && styles.programButtonActive,
              { backgroundColor: selectedProgram === program.id ? program.color : theme.colors.background.secondary }
            ]}
            onPress={() => handleProgramSelect(program.id as ProgramType)}
          >
            <Ionicons 
              name={program.icon as keyof typeof Ionicons.glyphMap} 
              size={24} 
              color={selectedProgram === program.id ? 'white' : program.color}
            />
            <Text style={[
              styles.programButtonText,
              selectedProgram === program.id && styles.programButtonTextActive
            ]}>
              {program.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </Animated.View>
  );

  const renderMetrics = () => (
    <Animated.View
      entering={FadeInDown.delay(200).springify()}
      style={styles.metricsSection}
    >
      <Text style={styles.sectionTitle}>Key Performance Metrics</Text>
      <View style={styles.metricsGrid}>
        {metrics.map((metric, index) => (
          <View key={metric.id} style={styles.metricCardContainer}>
            <PerformanceMetricCard
              metric={metric}
              index={index}
              variant="default"
              showTrend={true}
              showGoal={true}
            />
          </View>
        ))}
      </View>
    </Animated.View>
  );

  const renderCharts = () => (
    <Animated.View
      entering={FadeInDown.delay(300).springify()}
      style={styles.chartsSection}
    >
      <Text style={styles.sectionTitle}>Performance Analysis</Text>
      {charts.map((chartData, index) => (
        <PerformanceChart
          key={chartData.id}
          chartData={chartData}
          showPeriodSelector={false}
          onDataPointPress={(dataPoint, index) => {
            console.log('Chart data point pressed:', dataPoint, index);
          }}
          style={{ marginBottom: theme.spacing.md }}
        />
      ))}
    </Animated.View>
  );

  const renderRecommendations = () => {
    const recommendations = swimmingAdapter.getRecommendations(analytics || {} as any);
    
    return (
      <Animated.View
        entering={FadeInDown.delay(400).springify()}
        style={styles.recommendationsSection}
      >
        <Text style={styles.sectionTitle}>Recommendations</Text>
        <View style={styles.recommendationsContainer}>
          {recommendations.map((recommendation, index) => (
            <View key={index} style={styles.recommendationCard}>
              <Ionicons 
                name="bulb" 
                size={20} 
                color={theme.colors.status.warning} 
                style={styles.recommendationIcon}
              />
              <Text style={styles.recommendationText}>{recommendation}</Text>
            </View>
          ))}
        </View>
      </Animated.View>
    );
  };

  const renderQuickActions = () => (
    <Animated.View
      entering={FadeInDown.delay(500).springify()}
      style={styles.quickActionsSection}
    >
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActionsContainer}>
        <CustomButton
          title="Set Goals"
          variant="secondary"
          size="md"
          onPress={handleSetGoals}
          style={styles.actionButton}
          leftIcon="flag"
        />
        <CustomButton
          title="Export Data"
          variant="outline"
          size="md"
          onPress={handleExportData}
          style={styles.actionButton}
          leftIcon="download"
        />
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Performance"
        showProgramSwitcher={false}
        showNotifications={false}
        style={{ paddingTop: insets.top }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Program Selector */}
        {renderProgramSelector()}

        {/* Time Period Filter */}
        <Animated.View
          entering={FadeInDown.delay(150).springify()}
          style={styles.filtersSection}
        >
          <FilterBar
            filters={filterGroups}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            variant="horizontal"
            scrollable={true}
            showCounts={false}
            showIcons={false}
            showClearAll={false}
            compactMode={true}
          />
        </Animated.View>

        {/* Performance Metrics */}
        {renderMetrics()}

        {/* Performance Charts */}
        {renderCharts()}

        {/* Recommendations */}
        {renderRecommendations()}

        {/* Quick Actions */}
        {renderQuickActions()}
      </ScrollView>
    </View>
  );
};

const useThemedStyles = createThemedStyles((theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing['3xl'],
    },
    programSelectorSection: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    programSelectorContainer: {
      paddingRight: theme.spacing.md,
    },
    programButton: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      marginRight: theme.spacing.sm,
      minWidth: 80,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    programButtonActive: {
      borderColor: 'transparent',
    },
    programButtonText: {
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: theme.colors.text.secondary,
      marginTop: theme.spacing.xs,
    },
    programButtonTextActive: {
      color: 'white',
    },
    filtersSection: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.md,
    },
    metricsSection: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    metricsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    metricCardContainer: {
      width: '48%',
      marginBottom: theme.spacing.sm,
    },
    chartsSection: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    recommendationsSection: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    recommendationsContainer: {
      gap: theme.spacing.sm,
    },
    recommendationCard: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'flex-start',
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    recommendationIcon: {
      marginRight: theme.spacing.sm,
      marginTop: 2,
    },
    recommendationText: {
      flex: 1,
      fontSize: theme.fontSizes.base,
      color: theme.colors.text.primary,
      lineHeight: 22,
    },
    quickActionsSection: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    quickActionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: theme.spacing.sm,
    },
    actionButton: {
      flex: 1,
    },
  })
);