/**
 * PerformanceTimes Component
 * 
 * A comprehensive modal component for displaying detailed performance times and analytics.
 * Features chart integration, goal tracking, and historical data with Academy theming.
 */

import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import PerformanceChart from '../charts/PerformanceChart';
import { BottomSheet } from '../ui/BottomSheet';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface PerformanceTimeData {
  id: string;
  time: string;
  splitTime?: string;
  points?: string;
  date: string;
  heat?: string;
  meet?: string;
  location?: string;
  isPB?: boolean;
  isClubRecord?: boolean;
}

export interface PerformanceGoal {
  time: string;
  label: string;
  type: 'personal' | 'club' | 'national';
  achieved?: boolean;
}

export interface PerformanceBest {
  time: string;
  date: string;
  location?: string;
  isPersonalBest?: boolean;
  isClubRecord?: boolean;
}

export interface PerformanceComparison {
  current: string;
  goal: string;
  difference: string;
  type: 'ahead' | 'behind' | 'achieved';
  date?: string;
}

export interface PerformanceTimesProps {
  /** Modal visibility state */
  visible: boolean;
  
  /** Event details */
  eventName: string;
  poolSize: string;
  distance?: string;
  stroke?: string;
  
  /** Performance data */
  bestTime: PerformanceBest;
  clubRecord?: PerformanceBest;
  goals?: PerformanceGoal[];
  comparison?: PerformanceComparison;
  allTimes: PerformanceTimeData[];
  
  /** Chart data for performance visualization */
  chartData?: any;
  
  /** Close modal callback */
  onClose: () => void;
  
  /** Data point selection callback */
  onTimeSelect?: (timeData: PerformanceTimeData) => void;
  
  /** Goal action callback */
  onGoalAction?: (goal: PerformanceGoal) => void;
  
  /** Loading state */
  loading?: boolean;
  
  /** Error state */
  error?: string;
  
  /** Accessibility props */
  accessibilityLabel?: string;
  accessibilityHint?: string;
  
  /** Custom styles */
  style?: ViewStyle;
  headerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  
  /** Test ID for testing */
  testID?: string;
}

export const PerformanceTimes: React.FC<PerformanceTimesProps> = ({
  visible,
  eventName,
  poolSize,
  distance,
  stroke,
  bestTime,
  clubRecord,
  goals = [],
  comparison,
  allTimes,
  chartData,
  onClose,
  onTimeSelect,
  onGoalAction,
  loading = false,
  error,
  accessibilityLabel,
  accessibilityHint,
  style,
  headerStyle,
  contentStyle,
  testID,
}) => {
  const { theme, screenDimensions } = useTheme();
  const [selectedTimeId, setSelectedTimeId] = useState<string | null>(null);
  
  const styles = createStyles(theme, screenDimensions);

  const handleTimePress = (timeData: PerformanceTimeData) => {
    setSelectedTimeId(timeData.id);
    onTimeSelect?.(timeData);
  };

  const handleGoalPress = (goal: PerformanceGoal) => {
    onGoalAction?.(goal);
  };

  const formatTimeDisplay = (time: string) => {
    // Format time for better display (e.g., "00:26.30" -> "26.30")
    return time.startsWith('00:') ? time.substring(3) : time;
  };

  const getTimeComparison = (timeData: PerformanceTimeData) => {
    if (!comparison) return null;
    
    // Basic comparison logic - could be enhanced with actual time parsing
    const isDifferentFromGoal = timeData.time !== comparison.goal;
    return isDifferentFromGoal ? comparison.difference : null;
  };

  const renderHeader = () => (
    <View style={[styles.header, headerStyle]}>
      <Pressable
        onPress={onClose}
        style={({ pressed }) => [
          styles.backButton,
          pressed && styles.backButtonPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Close performance details"
      >
        <AntDesign 
          name="arrowleft" 
          size={theme.iconSize.md} 
          color={theme.colors.text.primary} 
        />
      </Pressable>
      
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>
          {distance && stroke ? `${distance} ${stroke}` : eventName}
        </Text>
        <Text style={styles.headerSubtitle}>{poolSize} pool</Text>
      </View>
    </View>
  );

  const renderBestTimeSection = () => (
    <View style={styles.bestTimeSection}>
      <View style={styles.bestTimeLeft}>
        <Text style={styles.bestTimeLabel}>BEST TIME</Text>
        <Text style={styles.bestTimeValue}>{formatTimeDisplay(bestTime.time)}</Text>
        <Text style={styles.bestTimeDate}>{bestTime.date}</Text>
      </View>

      {clubRecord && (
        <View style={styles.clubRecordSection}>
          <View style={styles.recordIndicator}>
            <View style={styles.recordDotOuter}>
              <View style={styles.recordDotInner} />
            </View>
          </View>
          <View style={styles.clubRecordContent}>
            <Text style={styles.clubRecordTime}>{formatTimeDisplay(clubRecord.time)}</Text>
            <Text style={styles.clubRecordLabel}>Club Record</Text>
          </View>
        </View>
      )}
    </View>
  );

  const renderChart = () => {
    if (!chartData) return null;

    return (
      <View style={styles.chartContainer}>
        <PerformanceChart
          data={chartData}
          type="line"
          height={200}
          width={SCREEN_WIDTH - 64}
          primaryColor={theme.colors.interactive.primary}
          animated={true}
          showGrid={true}
          formatValue={(value) => `${value}s`}
        />
      </View>
    );
  };

  const renderGoalsSection = () => {
    if (!goals.length && !comparison) return null;

    return (
      <View style={styles.goalsSection}>
        {goals.map((goal, index) => (
          <Pressable
            key={index}
            onPress={() => handleGoalPress(goal)}
            style={({ pressed }) => [
              styles.goalCard,
              pressed && styles.goalCardPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`${goal.label} goal: ${goal.time}`}
          >
            <View style={styles.goalIndicator}>
              <View style={styles.goalDotOuter}>
                <View style={[
                  styles.goalDotInner,
                  { backgroundColor: goal.achieved ? theme.colors.status.success : theme.colors.status.warning }
                ]} />
              </View>
            </View>
            
            <View style={styles.goalContent}>
              <Text style={styles.goalTime}>{formatTimeDisplay(goal.time)}</Text>
              <Text style={styles.goalLabel}>{goal.label}</Text>
            </View>
          </Pressable>
        ))}

        {comparison && (
          <View style={styles.comparisonCard}>
            <View style={styles.goalIndicator}>
              <View style={styles.goalDotOuter}>
                <View style={styles.goalDotInner} />
              </View>
            </View>
            
            <View style={styles.goalContent}>
              <Text style={styles.goalTime}>{formatTimeDisplay(comparison.current)}</Text>
              <Text style={styles.goalLabel}>{comparison.date || 'Current'}</Text>
            </View>
            
            <View style={styles.comparisonDifference}>
              <Text style={[
                styles.comparisonText,
                {
                  color: comparison.type === 'ahead' ? theme.colors.status.success :
                        comparison.type === 'behind' ? theme.colors.status.error :
                        theme.colors.text.secondary
                }
              ]}>
                {comparison.type === 'behind' ? '+' : ''}{comparison.difference}
              </Text>
              <Text style={styles.comparisonLabel}>
                {comparison.type === 'behind' ? 'Goal Missed by' : 
                 comparison.type === 'ahead' ? 'Ahead by' : 'Goal Achieved'}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderAllTimesSection = () => (
    <View style={styles.allTimesSection}>
      <Text style={styles.allTimesTitle}>All times</Text>
      
      {allTimes.map((timeData, index) => (
        <Pressable
          key={timeData.id}
          onPress={() => handleTimePress(timeData)}
          style={({ pressed }) => [
            styles.timeCard,
            selectedTimeId === timeData.id && styles.timeCardSelected,
            pressed && styles.timeCardPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Time: ${timeData.time}, Date: ${timeData.date}`}
        >
          <View style={styles.timeCardContent}>
            <View style={styles.timeCardLeft}>
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{formatTimeDisplay(timeData.time)}</Text>
                {timeData.isPB && (
                  <View style={styles.pbBadge}>
                    <Text style={styles.pbText}>PB</Text>
                  </View>
                )}
              </View>
              
              {timeData.splitTime && (
                <View style={styles.splitContainer}>
                  <Text style={styles.splitText}>{timeData.splitTime}</Text>
                </View>
              )}
              
              {timeData.points && (
                <Text style={styles.pointsText}>{timeData.points}</Text>
              )}
            </View>

            <View style={styles.timeCardRight}>
              <Text style={styles.dateText}>{timeData.date}</Text>
              {timeData.heat && (
                <Text style={styles.heatText}>{timeData.heat}</Text>
              )}
              {timeData.meet && (
                <Text style={styles.meetText}>{timeData.meet}</Text>
              )}
              {timeData.location && (
                <Text style={styles.locationText}>{timeData.location}</Text>
              )}
            </View>
          </View>
        </Pressable>
      ))}
    </View>
  );

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={`${eventName} - ${distance} ${stroke}`}
      snapPoints={['large', 'full']}
      initialSnapPoint="large"
      scrollable={true}
      showDragHandle={true}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
    >
      <View style={[styles.bottomSheetContent, style]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.contentContainer, contentStyle]}
          showsVerticalScrollIndicator={false}
        >
          {renderBestTimeSection()}
          {renderChart()}
          {renderGoalsSection()}
          {renderAllTimesSection()}
        </ScrollView>
      </View>
    </BottomSheet>
  );
};

const createStyles = (theme: any, screenDimensions: any) => {
  const isTablet = screenDimensions.isTablet;
  const responsivePadding = isTablet ? theme.spacing.xl : theme.spacing.lg;
  
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    
    bottomSheetContent: {
      flex: 1,
      paddingTop: theme.spacing.sm,
    },
    
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: responsivePadding,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
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
      ...(isTablet && {
        fontSize: theme.fontSizes.h3,
      }),
    },
    
    headerSubtitle: {
      fontSize: theme.fontSizes.caption,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      marginTop: theme.spacing.xs,
    },
    
    scrollView: {
      flex: 1,
    },
    
    contentContainer: {
      flexGrow: 1,
      paddingHorizontal: responsivePadding,
      paddingVertical: theme.spacing.md,
    },
    
    bestTimeSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    
    bestTimeLeft: {
      flex: 1,
    },
    
    bestTimeLabel: {
      fontSize: theme.fontSizes.caption,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
      letterSpacing: 0.5,
      marginBottom: theme.spacing.xs,
    },
    
    bestTimeValue: {
      fontSize: 38,
      fontWeight: theme.fontConfig.fontWeight.bold,
      color: theme.colors.interactive.primary,
      marginBottom: theme.spacing.xs,
    },
    
    bestTimeDate: {
      fontSize: theme.fontSizes.caption,
      color: theme.colors.text.secondary,
    },
    
    clubRecordSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    
    recordIndicator: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    recordDotOuter: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: theme.colors.status.success + '30',
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    recordDotInner: {
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
    
    chartContainer: {
      marginVertical: theme.spacing.lg,
      alignItems: 'center',
    },
    
    goalsSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.lg,
      flexWrap: 'wrap',
    },
    
    goalCard: {
      flex: 1,
      minWidth: 150,
      backgroundColor: theme.colors.background.elevated,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      ...theme.elevation.sm,
    },
    
    goalCardPressed: {
      opacity: 0.8,
      transform: [{ scale: 0.98 }],
    },
    
    comparisonCard: {
      flex: 1,
      minWidth: 200,
      backgroundColor: theme.colors.background.elevated,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      ...theme.elevation.sm,
    },
    
    goalIndicator: {
      marginRight: theme.spacing.md,
    },
    
    goalDotOuter: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: theme.colors.interactive.faded,
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    goalDotInner: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: theme.colors.interactive.primary,
    },
    
    goalContent: {
      flex: 1,
    },
    
    goalTime: {
      fontSize: theme.fontSizes.body,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
    },
    
    goalLabel: {
      fontSize: theme.fontSizes.caption,
      color: theme.colors.text.secondary,
    },
    
    comparisonDifference: {
      alignItems: 'flex-end',
    },
    
    comparisonText: {
      fontSize: theme.fontSizes.body,
      fontWeight: theme.fontConfig.fontWeight.semibold,
    },
    
    comparisonLabel: {
      fontSize: theme.fontSizes.caption,
      color: theme.colors.text.secondary,
    },
    
    allTimesSection: {
      marginTop: theme.spacing.lg,
    },
    
    allTimesTitle: {
      fontSize: theme.fontSizes.body,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.md,
    },
    
    timeCard: {
      backgroundColor: theme.colors.background.elevated,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      ...theme.elevation.sm,
    },
    
    timeCardSelected: {
      borderWidth: 2,
      borderColor: theme.colors.interactive.primary,
    },
    
    timeCardPressed: {
      opacity: 0.8,
      transform: [{ scale: 0.98 }],
    },
    
    timeCardContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    
    timeCardLeft: {
      flex: 1,
      justifyContent: 'center',
    },
    
    timeCardRight: {
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    
    timeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
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
      width: 32,
      height: 32,
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    pbText: {
      color: theme.colors.text.inverse,
      fontSize: theme.fontSizes.caption,
      fontWeight: theme.fontConfig.fontWeight.bold,
    },
    
    splitContainer: {
      backgroundColor: theme.colors.interactive.primary,
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      alignSelf: 'flex-start',
      marginBottom: theme.spacing.sm,
    },
    
    splitText: {
      color: theme.colors.text.inverse,
      fontSize: theme.fontSizes.caption,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
    
    pointsText: {
      fontSize: theme.fontSizes.caption,
      color: theme.colors.text.secondary,
    },
    
    dateText: {
      fontSize: theme.fontSizes.caption,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.xs,
    },
    
    heatText: {
      fontSize: theme.fontSizes.caption,
      color: theme.colors.text.primary,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      marginBottom: theme.spacing.xs,
    },
    
    meetText: {
      fontSize: theme.fontSizes.caption,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.xs,
    },
    
    locationText: {
      fontSize: theme.fontSizes.caption,
      color: theme.colors.text.secondary,
    },
  });
};

export default PerformanceTimes;