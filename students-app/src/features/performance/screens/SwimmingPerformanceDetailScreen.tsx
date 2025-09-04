import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, NavigationProp, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight, FadeInUp } from 'react-native-reanimated';
import { useTheme, createThemedStyles, Header } from '@academy/mobile-shared';
import { PerformanceChart } from '../components/charts/PerformanceChart';
import type { PerformanceStackParamList } from '../navigation/PerformanceNavigator';

import {
  SwimmingPerformanceDetail,
  SwimmingTimeDetail,
  SwimmingPerformanceGoal,
} from '../programs/swimming/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock detailed swimming performance data (based on third screenshot)
const mockPerformanceDetail: SwimmingPerformanceDetail = {
  performance: {
    title: '50m Breaststroke',
    distance: 50,
    stroke: 'breaststroke',
    poolSize: '25m',
  },
  bestTime: {
    time: '00:26.30',
    timeInSeconds: 26.30,
    date: '04 Feb 2023',
    venue: 'Academy Pool',
  },
  clubRecord: {
    time: '00:26.30',
    timeInSeconds: 26.30,
    holder: 'Club Record',
    date: '15 Jan 2023',
  },
  goals: [
    {
      id: 'season_goal',
      targetTime: '00:25.50',
      targetTimeInSeconds: 25.50,
      label: 'Season Goal',
      type: 'season',
      achieved: false,
    },
    {
      id: 'personal_best',
      targetTime: '00:26.30',
      targetTimeInSeconds: 26.30,
      label: 'Personal Best',
      type: 'personal',
      achieved: true,
      achievedDate: '15 Mar 2025',
    },
    {
      id: 'club_record',
      targetTime: '00:24.85',
      targetTimeInSeconds: 24.85,
      label: 'Club Record',
      type: 'club',
      achieved: false,
    },
  ],
  allTimes: [
    {
      id: '1',
      time: '00:26.30',
      timeInSeconds: 26.30,
      date: '15 Mar 2025',
      venue: 'Academy Pool',
      heat: 'Heat 12',
      isPB: true,
    },
    {
      id: '2',
      time: '00:26.46',
      timeInSeconds: 26.46,
      date: '10 Mar 2025',
      venue: 'East Lothian Meet',
      heat: 'Heat 11',
      isPB: false,
    },
    {
      id: '3',
      time: '00:26.62',
      timeInSeconds: 26.62,
      date: '05 Mar 2025',
      venue: 'Regional Championship',
      heat: 'Heat 8',
      isPB: false,
    },
    {
      id: '4',
      time: '00:26.78',
      timeInSeconds: 26.78,
      date: '28 Feb 2025',
      venue: 'Training Time Trial',
      heat: 'Heat 6',
      isPB: false,
    },
    {
      id: '5',
      time: '00:26.85',
      timeInSeconds: 26.85,
      date: '20 Feb 2025',
      venue: 'Club Championship',
      heat: 'Heat 9',
      isPB: false,
    },
  ],
  chartData: {
    data: [
      { label: '20 Feb', value: 26.85, formattedValue: '00:26.85' }, // First/oldest entry
      { label: '28 Feb', value: 26.78, formattedValue: '00:26.78' },
      { label: '05 Mar', value: 26.62, formattedValue: '00:26.62' },
      { label: '10 Mar', value: 26.46, formattedValue: '00:26.46' },
      { label: '15 Mar', value: 26.30, formattedValue: '00:26.30' }, // Current PB
    ],
    goalLine: 25.50,
    personalBestLine: 26.30,
  },
  statistics: {
    totalRaces: 15,
    averageTime: '00:26.45',
    averageTimeInSeconds: 26.45,
    improvement: {
      percentage: 1.8,
      timeChange: '-0.50',
      period: 'this season',
    },
    consistency: 92,
  },
};

type SwimmingPerformanceDetailScreenRouteProp = RouteProp<PerformanceStackParamList, 'SwimmingPerformanceDetail'>;

// Helper functions for time calculations
const processAllTimes = (allTimes: SwimmingTimeDetail[]): SwimmingTimeDetail[] => {
  // Sort times by date (newest first) to ensure chronological order
  const sortedTimes = [...allTimes].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });

  // Find the personal best (lowest time)
  const bestTimeValue = Math.min(...sortedTimes.map(t => t.timeInSeconds));
  
  // Mark PB and return processed times
  return sortedTimes.map(time => ({
    ...time,
    isPB: time.timeInSeconds === bestTimeValue
  }));
};

const calculateTimeComparison = (currentTime: SwimmingTimeDetail, previousTime: SwimmingTimeDetail | null) => {
  if (!previousTime) return null;
  
  const timeDifference = currentTime.timeInSeconds - previousTime.timeInSeconds;
  const isImprovement = timeDifference < 0; // Negative means faster (improvement)
  
  return {
    isImprovement,
    difference: Math.abs(timeDifference),
    sign: isImprovement ? '-' : '+'
  };
};

export const SwimmingPerformanceDetailScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = useThemedStyles();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<PerformanceStackParamList>>();
  const route = useRoute<SwimmingPerformanceDetailScreenRouteProp>();
  
  const { eventId } = route.params;
  
  const [performanceDetail, setPerformanceDetail] = useState<SwimmingPerformanceDetail>(mockPerformanceDetail);
  const [isLoading, setIsLoading] = useState(false);
  
  // Process times to ensure correct PB calculation and chronological order
  const processedTimes = processAllTimes(performanceDetail.allTimes);

  useEffect(() => {
    loadPerformanceDetail();
  }, [eventId]);

  const loadPerformanceDetail = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPerformanceDetail(mockPerformanceDetail);
      setIsLoading(false);
    }, 500);
  };

  const handleTimePress = (timeDetail: SwimmingTimeDetail) => {
    console.log('Time detail pressed:', timeDetail.time);
  };

  const handleGoalPress = (goal: SwimmingPerformanceGoal) => {
    console.log('Goal pressed:', goal.label);
  };

  // Custom header with back button
  const renderHeader = () => (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <Pressable
        onPress={() => navigation.goBack()}
        style={({ pressed }) => [
          styles.backButton,
          pressed && styles.backButtonPressed,
        ]}
      >
        <Ionicons 
          name="arrow-back" 
          size={24} 
          color={theme.colors.text.primary} 
        />
      </Pressable>
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>{performanceDetail.performance.title}</Text>
        <Text style={styles.headerSubtitle}>{performanceDetail.performance.poolSize} pool</Text>
      </View>
    </View>
  );


  // Best time section with modern card design
  const renderBestTimeSection = () => (
    <Animated.View
      entering={FadeInUp.delay(100).springify()}
      style={styles.bestTimeCard}
    >
      <View style={styles.bestTimeContent}>
        <View style={styles.bestTimeMain}>
          <Text style={styles.bestTimeLabel}>BEST TIME</Text>
          <Text style={styles.bestTimeValue}>{performanceDetail.bestTime.time}</Text>
          <Text style={styles.bestTimeDate}>{performanceDetail.bestTime.date}</Text>
        </View>

        {performanceDetail.clubRecord && (
          <View style={styles.clubRecordSection}>
            <View style={styles.recordIndicator}>
              <View style={styles.recordBadge}>
                <View style={styles.recordDot} />
              </View>
            </View>
            <View style={styles.clubRecordContent}>
              <Text style={styles.clubRecordTime}>{performanceDetail.clubRecord.time}</Text>
              <Text style={styles.clubRecordLabel}>Club Record</Text>
            </View>
          </View>
        )}
      </View>
    </Animated.View>
  );

  // Performance chart with modern styling
  const renderChart = () => (
    <Animated.View
      entering={FadeInDown.delay(200).springify()}
    >
      <PerformanceChart
        chartData={{
          id: 'progression',
          title: 'Time Progression',
          type: 'line',
          data: performanceDetail.chartData.data,
          xAxisLabel: 'Date',
          yAxisLabel: 'Time (sec)',
          color: theme.colors.interactive.primary,
          period: 'session',
        }}
        showPeriodSelector={false}
        onDataPointPress={(dataPoint, index) => {
          console.log('Chart point pressed:', dataPoint);
        }}
      />
    </Animated.View>
  );

  // Goals section with achievement indicators
  const renderGoalsSection = () => (
    <Animated.View
      entering={FadeInDown.delay(300).springify()}
      style={styles.goalsCard}
    >
      <Text style={styles.sectionTitle}>Goals & Targets</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.goalsScrollContainer}
      >
        {performanceDetail.goals.map((goal, index) => (
          <Animated.View
            key={goal.id}
            entering={FadeInRight.delay(350 + index * 50).springify()}
            style={styles.goalCardWrapper}
          >
            <View style={[
              styles.goalCard,
              goal.achieved && styles.goalCardAchieved,
            ]}>
              <View style={styles.goalIndicator}>
                <View style={[
                  styles.goalBadge,
                  goal.achieved ? styles.goalBadgeAchieved : styles.goalBadgePending
                ]}>
                  {goal.achieved ? (
                    <Ionicons name="checkmark" size={16} color={theme.colors.text.inverse} />
                  ) : (
                    <Ionicons name="flag" size={14} color={theme.colors.interactive.primary} />
                  )}
                </View>
              </View>
              
              <View style={styles.goalContent}>
                <Text style={styles.goalTime}>{goal.targetTime}</Text>
                {goal.achieved && goal.achievedDate ? (
                  <Text style={styles.goalAchievedDate}>{goal.achievedDate}</Text>
                ) : (
                  <Text style={styles.goalLabel}>{goal.label}</Text>
                )}
              </View>
            </View>
          </Animated.View>
        ))}
      </ScrollView>
    </Animated.View>
  );

  // All times section with modern list design
  const renderAllTimesSection = () => (
    <Animated.View
      entering={FadeInDown.delay(400).springify()}
      style={styles.allTimesCard}
    >
      <Text style={styles.sectionTitle}>ALL TIMES</Text>
      <View style={styles.timesContainer}>
        {processedTimes.map((timeDetail, index) => {
          // For chronological comparison, we need the older time (next in array since it's sorted newest first)
          const olderTime = index < processedTimes.length - 1 ? processedTimes[index + 1] : null;
          const comparison = calculateTimeComparison(timeDetail, olderTime);
          
          return (
            <Animated.View
              key={timeDetail.id}
              entering={FadeInRight.delay(450 + index * 75).springify()}
            >
              <View style={styles.timeCard}>
                {/* Left side - Time info */}
                <View style={styles.timeCardLeft}>
                  <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>{timeDetail.time}</Text>
                    {timeDetail.isPB && (
                      <View style={styles.pbBadge}>
                        <Text style={styles.pbText}>PB</Text>
                      </View>
                    )}
                  </View>
                  
                  {/* Progression indicator below time */}
                  {comparison && (
                    <View style={[
                      styles.timeProgressionBadge,
                      comparison.isImprovement 
                        ? { backgroundColor: theme.colors.status.success } 
                        : { backgroundColor: theme.colors.status.error }
                    ]}>
                      <Text style={styles.timeProgressionText}>
                        {comparison.sign}{comparison.difference.toFixed(2)}
                      </Text>
                    </View>
                  )}
                  
                  {/* FINA Points */}
                  <Text style={styles.finaPoints}>484 FINA Points</Text>
                </View>

                {/* Right side - Date and venue info */}
                <View style={styles.timeCardRight}>
                  <Text style={styles.timeDate}>{timeDetail.date}</Text>
                  {timeDetail.heat && (
                    <Text style={styles.timeHeat}>{timeDetail.heat}</Text>
                  )}
                  <Text style={styles.timeVenue}>{timeDetail.venue}</Text>
                </View>
              </View>
            </Animated.View>
          );
        })}
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Best Time Section */}
        {renderBestTimeSection()}

        {/* Performance Chart */}
        {renderChart()}

        {/* Goals Section */}
        {renderGoalsSection()}

        {/* All Times Section */}
        {renderAllTimesSection()}

        {/* Loading State */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading performance data...</Text>
          </View>
        )}
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
    
    // Header
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background.primary,
      borderBottomWidth: theme.borderWidth.sm,
      borderBottomColor: theme.colors.border.primary,
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.md,
    },
    backButton: {
      padding: theme.spacing.sm,
      marginRight: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
    },
    backButtonPressed: {
      backgroundColor: theme.colors.background.secondary,
    },
    headerContent: {
      flex: 1,
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: theme.fontSizes.h4,
      fontWeight: theme.fontConfig.fontWeight.bold,
      color: theme.colors.text.primary,
      textAlign: 'center',
    },
    headerSubtitle: {
      fontSize: theme.fontSizes.caption,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      marginTop: theme.spacing.xs,
    },
    
    // Scroll View
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingTop: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing['3xl'],
    },
    
    // Best Time Card
    bestTimeCard: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      borderWidth: theme.borderWidth.sm,
      borderColor: theme.colors.border.primary,
      ...theme.elevation.md,
    },
    bestTimeContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    bestTimeMain: {
      flex: 1,
    },
    bestTimeLabel: {
      fontSize: theme.fontSizes.caption,
      fontWeight: theme.fontConfig.fontWeight.bold,
      color: theme.colors.text.primary,
      letterSpacing: 1,
      marginBottom: theme.spacing.sm,
    },
    bestTimeValue: {
      fontSize: 42,
      fontWeight: theme.fontConfig.fontWeight.bold,
      color: theme.colors.interactive.primary,
      marginBottom: theme.spacing.xs,
    },
    bestTimeDate: {
      fontSize: theme.fontSizes.body,
      color: theme.colors.text.secondary,
    },
    
    // Club Record
    clubRecordSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    recordIndicator: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    recordBadge: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme.colors.status.success + '20',
      alignItems: 'center',
      justifyContent: 'center',
    },
    recordDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: theme.colors.status.success,
    },
    clubRecordContent: {
      alignItems: 'flex-end',
    },
    clubRecordTime: {
      fontSize: theme.fontSizes.h5,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
    },
    clubRecordLabel: {
      fontSize: theme.fontSizes.caption,
      color: theme.colors.text.secondary,
    },
    
    
    // Goals Card
    goalsCard: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      borderWidth: theme.borderWidth.sm,
      borderColor: theme.colors.border.primary,
      ...theme.elevation.sm,
    },
    sectionTitle: {
      fontSize: theme.fontSizes.h5,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.sm,
    },
    goalsScrollContainer: {
      paddingRight: theme.spacing.md,
    },
    goalCardWrapper: {
      marginRight: theme.spacing.sm,
    },
    goalCard: {
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: theme.colors.background.elevated,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      borderWidth: theme.borderWidth.sm,
      borderColor: theme.colors.border.secondary,
      width: 140,
      minHeight: 120,
    },
    goalCardAchieved: {
      backgroundColor: theme.colors.status.success + '10',
      borderColor: theme.colors.status.success + '30',
    },
    goalIndicator: {
      marginBottom: theme.spacing.sm,
    },
    goalBadge: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    goalBadgeAchieved: {
      backgroundColor: theme.colors.status.success,
    },
    goalBadgePending: {
      backgroundColor: theme.colors.interactive.faded,
      borderWidth: 2,
      borderColor: theme.colors.interactive.primary,
    },
    goalBadgeMissed: {
      backgroundColor: theme.colors.status.error,
    },
    goalContent: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    goalTime: {
      fontSize: theme.fontSizes.h5,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
      textAlign: 'center',
    },
    goalLabel: {
      fontSize: theme.fontSizes.caption,
      color: theme.colors.text.secondary,
      marginTop: theme.spacing.xs,
      textAlign: 'center',
    },
    goalAchievedDate: {
      fontSize: theme.fontSizes.caption,
      color: theme.colors.status.success,
      marginTop: theme.spacing.xs,
    },
    
    // All Times Card
    allTimesCard: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      borderWidth: theme.borderWidth.sm,
      borderColor: theme.colors.border.primary,
      ...theme.elevation.sm,
    },
    timesContainer: {
      gap: theme.spacing.sm,
    },
    timeCard: {
      flexDirection: 'row',
      backgroundColor: theme.colors.background.elevated,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      borderWidth: theme.borderWidth.sm,
      borderColor: theme.colors.border.secondary,
    },
    timeCardLeft: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    timeCardRight: {
      flex: 1,
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
    },
    timeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    timeText: {
      fontSize: theme.fontSizes.h5,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.interactive.primary,
      marginRight: theme.spacing.sm,
    },
    pbBadge: {
      backgroundColor: theme.colors.status.success,
      borderRadius: theme.borderRadius.full,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
    },
    pbText: {
      color: theme.colors.text.inverse,
      fontSize: theme.fontSizes.caption,
      fontWeight: theme.fontConfig.fontWeight.bold,
    },
    timeDate: {
      fontSize: theme.fontSizes.body,
      color: theme.colors.text.primary,
      fontWeight: theme.fontConfig.fontWeight.medium,
      textAlign: 'right',
      marginBottom: theme.spacing.xs,
    },
    timeVenue: {
      fontSize: theme.fontSizes.caption,
      color: theme.colors.text.secondary,
      textAlign: 'right',
      marginBottom: theme.spacing.xs,
    },
    timeHeat: {
      fontSize: theme.fontSizes.caption,
      color: theme.colors.text.secondary,
      fontWeight: theme.fontConfig.fontWeight.medium,
      textAlign: 'right',
      marginBottom: theme.spacing.xs,
    },
    timeProgressionBadge: {
      backgroundColor: theme.colors.interactive.primary,
      borderRadius: theme.borderRadius.full,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      marginTop: theme.spacing.xs,
      marginBottom: theme.spacing.xs,
      alignSelf: 'flex-start',
    },
    timeProgressionText: {
      color: theme.colors.text.inverse,
      fontSize: theme.fontSizes.caption,
      fontWeight: theme.fontConfig.fontWeight.bold,
    },
    finaPoints: {
      fontSize: theme.fontSizes.caption,
      color: theme.colors.text.secondary,
      marginTop: theme.spacing.xs,
    },
    
    // Loading state
    loadingContainer: {
      padding: theme.spacing.xl,
      alignItems: 'center',
    },
    loadingText: {
      fontSize: theme.fontSizes.body,
      color: theme.colors.text.secondary,
      fontStyle: 'italic',
    },
  })
);