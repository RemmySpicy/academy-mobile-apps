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
  SwimmingEventDetail,
  SwimmingTimeDetail,
  SwimmingPerformanceGoal,
} from '../programs/swimming/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock detailed swimming event data (based on third screenshot)
const mockEventDetail: SwimmingEventDetail = {
  event: {
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
      id: 'personal_goal',
      targetTime: '00:26.00',
      targetTimeInSeconds: 26.00,
      label: 'Personal Goal',
      type: 'personal',
      achieved: true,
      achievedDate: '04 Feb 2023',
    },
  ],
  allTimes: [
    {
      id: '1',
      time: '00:26.30',
      timeInSeconds: 26.30,
      date: '04 Feb 2023',
      venue: 'Academy Pool',
      heat: 'Heat 13',
      isPB: true,
    },
    {
      id: '2',
      time: '00:26.30',
      timeInSeconds: 26.30,
      date: '28 Jan 2023',
      venue: 'East London Meet',
      heat: 'Heat 12',
      isPB: false,
    },
    {
      id: '3',
      time: '00:26.30',
      timeInSeconds: 26.30,
      date: '21 Jan 2023',
      venue: 'Fast London Meet',
      heat: 'Heat 11',
      isPB: false,
    },
  ],
  chartData: {
    data: [
      { label: '08:15', value: 26.80, formattedValue: '00:26.80' },
      { label: '08:23', value: 26.60, formattedValue: '00:26.60' },
      { label: '08:31', value: 26.45, formattedValue: '00:26.45' },
      { label: '09:14', value: 26.35, formattedValue: '00:26.35' },
      { label: '09:23', value: 26.30, formattedValue: '00:26.30' },
      { label: '09:31', value: 26.30, formattedValue: '00:26.30' },
      { label: '10:14', value: 26.30, formattedValue: '00:26.30' },
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

type SwimmingEventDetailScreenRouteProp = RouteProp<PerformanceStackParamList, 'SwimmingEventDetail'>;

export const SwimmingEventDetailScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = useThemedStyles();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<PerformanceStackParamList>>();
  const route = useRoute<SwimmingEventDetailScreenRouteProp>();
  
  const { eventId } = route.params;
  
  const [eventDetail, setEventDetail] = useState<SwimmingEventDetail>(mockEventDetail);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadEventDetail();
  }, [eventId]);

  const loadEventDetail = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setEventDetail(mockEventDetail);
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
        <Text style={styles.headerTitle}>{eventDetail.event.title}</Text>
        <Text style={styles.headerSubtitle}>{eventDetail.event.poolSize} pool</Text>
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
          <Text style={styles.bestTimeValue}>{eventDetail.bestTime.time}</Text>
          <Text style={styles.bestTimeDate}>{eventDetail.bestTime.date}</Text>
        </View>

        {eventDetail.clubRecord && (
          <View style={styles.clubRecordSection}>
            <View style={styles.recordIndicator}>
              <View style={styles.recordBadge}>
                <View style={styles.recordDot} />
              </View>
            </View>
            <View style={styles.clubRecordContent}>
              <Text style={styles.clubRecordTime}>{eventDetail.clubRecord.time}</Text>
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
          data: eventDetail.chartData.data,
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
      <View style={styles.goalsContainer}>
        {eventDetail.goals.map((goal, index) => (
          <Animated.View
            key={goal.id}
            entering={FadeInRight.delay(350 + index * 50).springify()}
          >
            <Pressable
              onPress={() => handleGoalPress(goal)}
              style={({ pressed }) => [
                styles.goalCard,
                goal.achieved && styles.goalCardAchieved,
                pressed && styles.goalCardPressed,
              ]}
            >
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
                <Text style={styles.goalLabel}>{goal.label}</Text>
                {goal.achieved && goal.achievedDate && (
                  <Text style={styles.goalAchievedDate}>Achieved {goal.achievedDate}</Text>
                )}
              </View>

              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={theme.colors.text.secondary}
              />
            </Pressable>
          </Animated.View>
        ))}
      </View>
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
        {eventDetail.allTimes.map((timeDetail, index) => (
          <Animated.View
            key={timeDetail.id}
            entering={FadeInRight.delay(450 + index * 75).springify()}
          >
            <Pressable
              onPress={() => handleTimePress(timeDetail)}
              style={({ pressed }) => [
                styles.timeCard,
                pressed && styles.timeCardPressed,
              ]}
            >
              <View style={styles.timeCardContent}>
                <View style={styles.timeCardMain}>
                  <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>{timeDetail.time}</Text>
                    {timeDetail.isPB && (
                      <View style={styles.pbBadge}>
                        <Text style={styles.pbText}>PB</Text>
                      </View>
                    )}
                  </View>
                  
                  <Text style={styles.timeDate}>{timeDetail.date}</Text>
                </View>

                <View style={styles.timeCardDetails}>
                  <Text style={styles.timeVenue}>{timeDetail.venue}</Text>
                  {timeDetail.heat && (
                    <Text style={styles.timeHeat}>{timeDetail.heat}</Text>
                  )}
                </View>
              </View>

              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={theme.colors.text.secondary}
              />
            </Pressable>
          </Animated.View>
        ))}
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
    goalsContainer: {
      gap: theme.spacing.sm,
    },
    goalCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background.elevated,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      borderWidth: theme.borderWidth.sm,
      borderColor: theme.colors.border.secondary,
    },
    goalCardAchieved: {
      backgroundColor: theme.colors.status.success + '10',
      borderColor: theme.colors.status.success + '30',
    },
    goalCardPressed: {
      opacity: 0.8,
      transform: [{ scale: 0.98 }],
    },
    goalIndicator: {
      marginRight: theme.spacing.md,
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
    goalContent: {
      flex: 1,
    },
    goalTime: {
      fontSize: theme.fontSizes.h5,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
    },
    goalLabel: {
      fontSize: theme.fontSizes.body,
      color: theme.colors.text.secondary,
      marginTop: theme.spacing.xs,
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
      alignItems: 'center',
      backgroundColor: theme.colors.background.elevated,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      borderWidth: theme.borderWidth.sm,
      borderColor: theme.colors.border.secondary,
    },
    timeCardPressed: {
      opacity: 0.8,
      transform: [{ scale: 0.98 }],
    },
    timeCardContent: {
      flex: 1,
    },
    timeCardMain: {
      marginBottom: theme.spacing.sm,
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
    },
    timeCardDetails: {
      gap: theme.spacing.xs,
    },
    timeVenue: {
      fontSize: theme.fontSizes.caption,
      color: theme.colors.text.secondary,
    },
    timeHeat: {
      fontSize: theme.fontSizes.caption,
      color: theme.colors.text.secondary,
      fontWeight: theme.fontConfig.fontWeight.medium,
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