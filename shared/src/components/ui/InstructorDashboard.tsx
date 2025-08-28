import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, createThemedStyles } from '../../theme';
import { useProgramContext } from '../program/ProgramContextProvider';
import PerformanceChart from '../charts/PerformanceChart';
import StudentCard from './StudentCard';

interface DashboardMetric {
  id: string;
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: string;
  color?: string;
}

interface QuickAction {
  id: string;
  title: string;
  icon: string;
  color: string;
  onPress: () => void;
}

interface RecentActivity {
  id: string;
  type: 'attendance' | 'assignment' | 'assessment' | 'alert';
  student_name: string;
  message: string;
  timestamp: string;
  priority?: 'high' | 'medium' | 'low';
}

interface InstructorDashboardProps {
  // Metrics data
  metrics?: DashboardMetric[];

  // Chart data for performance overview
  chartData?: any;

  // Student data for quick overview
  recentStudents?: any[];

  // Recent activities/notifications
  recentActivities?: RecentActivity[];

  // Quick actions
  quickActions?: QuickAction[];

  // Callbacks
  onMetricPress?: (metric: DashboardMetric) => void;
  onStudentPress?: (student: any) => void;
  onViewAllStudents?: () => void;
  onViewAllActivities?: () => void;

  // Customization
  showChart?: boolean;
  showStudents?: boolean;
  showActivities?: boolean;
  maxStudentsShown?: number;
  maxActivitiesShown?: number;
}

const InstructorDashboard: React.FC<InstructorDashboardProps> = ({
  metrics = [],
  chartData,
  recentStudents = [],
  recentActivities = [],
  quickActions = [],
  onMetricPress,
  onStudentPress,
  onViewAllStudents,
  onViewAllActivities,
  showChart = true,
  showStudents = true,
  showActivities = true,
  maxStudentsShown = 3,
  maxActivitiesShown = 5,
}) => {
  const { theme } = useTheme();
  const { currentProgram } = useProgramContext();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const useThemedStyles = useMemo(() => createResponsiveStyles(screenWidth), [screenWidth]);
  const styles = useThemedStyles();
  const [selectedPeriod, setSelectedPeriod] = useState<
    'week' | 'month' | 'quarter'
  >('month');

  // Mobile-optimized responsive breakpoints
  const isSmallDevice = screenWidth < 380;
  const isTablet = screenWidth > 768;

  // Memoize default data to prevent recreation and ensure safe prop access
  const defaultMetrics = useMemo((): DashboardMetric[] => [
    {
      id: 'total_students',
      title: 'Total Students',
      value: (recentStudents || []).length,
      icon: 'people-outline',
      color: theme.colors.interactive.primary,
    },
    {
      id: 'attendance_rate',
      title: 'Attendance Rate',
      value: '94%',
      change: 2.5,
      changeType: 'increase',
      icon: 'calendar-outline',
      color: theme.colors.status.success,
    },
    {
      id: 'avg_performance',
      title: 'Avg Performance',
      value: '87%',
      change: -1.2,
      changeType: 'decrease',
      icon: 'bar-chart-outline',
      color: theme.colors.interactive.primary,
    },
    {
      id: 'pending_tasks',
      title: 'Pending Tasks',
      value: 12,
      icon: 'checkmark-circle-outline',
      color: theme.colors.status.warning,
    },
  ], [recentStudents, theme]);

  const defaultQuickActions = useMemo((): QuickAction[] => [
    {
      id: 'take_attendance',
      title: 'Take Attendance',
      icon: 'calendar-outline',
      color: theme.colors.status.success,
      onPress: () => {},
    },
    {
      id: 'grade_assignments',
      title: 'Grade Work',
      icon: 'pencil-outline',
      color: theme.colors.interactive.primary,
      onPress: () => {},
    },
    {
      id: 'message_parents',
      title: 'Message Parents',
      icon: 'mail-outline',
      color: theme.colors.interactive.orange,
      onPress: () => {},
    },
    {
      id: 'create_assessment',
      title: 'New Assessment',
      icon: 'document-text-outline',
      color: theme.colors.interactive.faded,
      onPress: () => {},
    },
  ], [theme]);

  // Memoize expensive computations for mobile performance
  const displayMetrics = useMemo(
    () => (metrics && metrics.length > 0 ? metrics : defaultMetrics),
    [metrics, defaultMetrics]
  );
  
  const displayQuickActions = useMemo(
    () => (quickActions && quickActions.length > 0 ? quickActions : defaultQuickActions),
    [quickActions, defaultQuickActions]
  );

  // Mobile-optimized data slicing
  const studentsToShow = useMemo(
    () => (recentStudents || []).slice(0, maxStudentsShown),
    [recentStudents, maxStudentsShown]
  );

  const activitiesToShow = useMemo(
    () => (recentActivities || []).slice(0, maxActivitiesShown),
    [recentActivities, maxActivitiesShown]
  );

  // Memoized callbacks for mobile performance
  const handlePeriodChange = useCallback((period: 'week' | 'month' | 'quarter') => {
    setSelectedPeriod(period);
  }, []);

  const handleMetricPressCallback = useCallback((metric: DashboardMetric) => {
    onMetricPress?.(metric);
  }, [onMetricPress]);

  const handleStudentPressCallback = useCallback((student: any) => {
    onStudentPress?.(student);
  }, [onStudentPress]);

  const renderMetricsOverview = useCallback(() => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Overview</Text>
      <View style={styles.metricsGrid}>
        {displayMetrics.map(metric => (
          <Pressable 
            key={metric.id}
            style={({ pressed }) => [
              { opacity: pressed ? 0.8 : 1 }, 
              styles.metricCard
            ]}
            onPress={() => handleMetricPressCallback(metric)}
            accessibilityRole='button'
            accessibilityLabel={`${metric.title}: ${metric.value}`}
            accessibilityHint={`Tap to view details for ${metric.title}`}
          >
            <View style={styles.metricHeader}>
              <Ionicons
                name={metric.icon as any}
                size={20}
                color={metric.color || theme.colors.interactive.primary}
              />
              <Text style={styles.metricTitle}>{metric.title}</Text>
            </View>

            <View style={styles.metricContent}>
              <Text style={styles.metricValue}>{metric.value}</Text>
              {metric.change !== undefined && (
                <View
                  style={[
                    styles.changeIndicator,
                    {
                      backgroundColor: getChangeColor(metric.changeType) + '20',
                    },
                  ]}
                >
                  <Ionicons
                    name={getChangeIcon(metric.changeType)}
                    size={12}
                    color={getChangeColor(metric.changeType)}
                  />
                  <Text
                    style={[
                      styles.changeText,
                      { color: getChangeColor(metric.changeType) },
                    ]}
                  >
                    {Math.abs(metric.change)}%
                  </Text>
                </View>
              )}
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  ), [displayMetrics, styles, handleMetricPressCallback]);

  const renderQuickActions = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActionsGrid}>
        {displayQuickActions.map(action => (
          <Pressable 
            key={action.id}
            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }, styles.quickActionCard]}
            onPress={action.onPress}
            accessibilityRole='button'
            accessibilityLabel={action.title}
          >
            <View
              style={[
                styles.quickActionIcon,
                { backgroundColor: action.color + '20' },
              ]}
            >
              <Ionicons name={action.icon as any} size={24} color={action.color} />
            </View>
            <Text style={styles.quickActionTitle}>{action.title}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  const renderPerformanceChart = () => {
    if (!showChart || !chartData) return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Performance Trend</Text>
          <View style={styles.periodSelector}>
            {['week', 'month', 'quarter'].map(period => (
              <Pressable 
                key={period}
                style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }, [
                  styles.periodButton,
                  selectedPeriod === period && styles.periodButtonActive,
                ]]}
                onPress={() => setSelectedPeriod(period as any)}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    selectedPeriod === period && styles.periodButtonTextActive,
                  ]}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <PerformanceChart
          data={chartData}
          type='line'
          height={200}
          showPeriodSelector={false}
          showMetrics={false}
          primaryColor={theme.colors.interactive.primary}
        />
      </View>
    );
  };

  const renderRecentStudents = useCallback(() => {
    if (!showStudents || !recentStudents || recentStudents.length === 0) return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Students</Text>
          {recentStudents && recentStudents.length > maxStudentsShown && (
            <Pressable 
              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} 
              onPress={onViewAllStudents}
              accessibilityRole='button'
              accessibilityLabel='View all students'
              accessibilityHint='Opens full students list'
            >
              <Text style={styles.viewAllText}>View All</Text>
            </Pressable>
          )}
        </View>

        {studentsToShow.map(student => (
          <StudentCard
            key={student.id}
            student={student}
            variant='compact'
            onPress={handleStudentPressCallback}
            showQuickActions={false}
            showProgress={false}
            style={styles.compactStudentCard}
          />
        ))}
      </View>
    );
  }, [showStudents, recentStudents, studentsToShow, maxStudentsShown, onViewAllStudents, handleStudentPressCallback, styles]);

  const renderRecentActivities = () => {
    if (!showActivities || !recentActivities || recentActivities.length === 0) return null;

    const activitiesToShow = (recentActivities || []).slice(0, maxActivitiesShown);

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {recentActivities && recentActivities.length > maxActivitiesShown && (
            <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} 
              onPress={onViewAllActivities}
              accessibilityRole='button'
              accessibilityLabel='View all activities'
            >
              <Text style={styles.viewAllText}>View All</Text>
            </Pressable>
          )}
        </View>

        {activitiesToShow.map(activity => (
          <View key={activity.id} style={styles.activityItem}>
            <View
              style={[
                styles.activityIcon,
                { backgroundColor: getActivityColor(activity.type) + '20' },
              ]}
            >
              <Ionicons
                name={getActivityIcon(activity.type)}
                size={16}
                color={getActivityColor(activity.type)}
              />
            </View>

            <View style={styles.activityContent}>
              <Text style={styles.activityMessage} numberOfLines={2}>
                <Text style={styles.studentName}>{activity.student_name}</Text>
                {' ' + activity.message}
              </Text>
              <Text style={styles.activityTime}>{activity.timestamp}</Text>
            </View>

            {activity.priority === 'high' && (
              <View style={styles.priorityIndicator}>
                <Ionicons
                  name='warning-outline'
                  size={14}
                  color={theme.colors.status.error}
                />
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  const getChangeColor = (changeType?: string) => {
    switch (changeType) {
      case 'increase':
        return theme.colors.status.success;
      case 'decrease':
        return theme.colors.status.error;
      default:
        return theme.colors.text.tertiary;
    }
  };

  const getChangeIcon = (changeType?: string) => {
    switch (changeType) {
      case 'increase':
        return 'arrow-up-outline';
      case 'decrease':
        return 'arrow-down-outline';
      default:
        return 'remove-outline';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'attendance':
        return 'calendar-outline';
      case 'assignment':
        return 'document-text-outline';
      case 'assessment':
        return 'bar-chart-outline';
      case 'alert':
        return 'warning-outline';
      default:
        return 'information-circle-outline';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'attendance':
        return theme.colors.status.success;
      case 'assignment':
        return theme.colors.interactive.primary;
      case 'assessment':
        return theme.colors.interactive.orange;
      case 'alert':
        return theme.colors.status.error;
      default:
        return theme.colors.text.secondary;
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
      removeClippedSubviews={true} // Mobile performance optimization
      scrollEventThrottle={16} // 60fps scroll performance
    >
      {currentProgram && (
        <View style={styles.programHeader}>
          <Text style={styles.programName}>{currentProgram.name}</Text>
          <Text style={styles.programSubtitle}>Instructor Dashboard</Text>
        </View>
      )}

      {renderMetricsOverview()}
      {renderQuickActions()}
      {renderPerformanceChart()}
      {renderRecentStudents()}
      {renderRecentActivities()}
    </ScrollView>
  );
};

const createResponsiveStyles = (screenWidth: number) => createThemedStyles((theme) => {
  // Responsive width calculation using passed screen dimensions
  const containerPadding = theme.spacing.md * 2; // Left + right padding
  const availableWidth = screenWidth - containerPadding;
  const cardGap = theme.spacing.sm;
  const cardWidth = (availableWidth - cardGap) / 2;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },

    contentContainer: {
      padding: containerPadding,
      paddingBottom: theme.spacing['3xl'], // Extra space for tab bar
    },

    programHeader: {
      marginBottom: theme.spacing.lg,
      alignItems: 'center',
    },

    programName: {
      ...theme.typography.heading.h2,
      color: theme.colors.text.primary,
      fontWeight: theme.fontConfig.fontWeight.bold,
      textAlign: 'center',
    },

    programSubtitle: {
      ...theme.typography.body.base,
      color: theme.colors.text.secondary,
      marginTop: theme.spacing.xs,
    },

    section: {
      marginBottom: theme.spacing.lg,
    },

    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },

    sectionTitle: {
      ...theme.typography.heading.h4,
      color: theme.colors.text.primary,
      fontWeight: theme.fontConfig.fontWeight.semibold,
    },

    viewAllText: {
      ...theme.typography.body.sm,
      color: theme.colors.interactive.primary,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },

    // Metrics Grid - Mobile Responsive
    metricsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: cardGap,
    },

    metricCard: {
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      width: cardWidth,
      minHeight: 100,
      ...theme.elevation.sm,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      // Enhanced mobile visibility
      shadowColor: theme.colors.shadow?.default || '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
    },

    metricHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },

    metricTitle: {
      ...theme.typography.caption.base,
      color: theme.colors.text.secondary,
      marginLeft: theme.spacing.sm,
      flex: 1,
      fontSize: theme.fontSizes.sm,
    },

    metricContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
    },

    metricValue: {
      ...theme.typography.heading.h3,
      color: theme.colors.text.primary,
      fontWeight: theme.fontConfig.fontWeight.bold,
      fontSize: theme.fontSizes.xl,
    },

    changeIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
      gap: 2,
      marginTop: theme.spacing.xs / 2,
    },

    changeText: {
      ...theme.typography.caption.base,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      fontSize: theme.fontSizes.xs,
    },

    // Quick Actions - Mobile Responsive
    quickActionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: cardGap,
    },

    quickActionCard: {
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      width: cardWidth,
      minHeight: 100,
      alignItems: 'center',
      justifyContent: 'center',
      ...theme.elevation.sm,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      // Enhanced mobile visibility
      shadowColor: theme.colors.shadow?.default || '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
    },

    quickActionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.xs,
    },

    quickActionTitle: {
      ...theme.typography.body.sm,
      color: theme.colors.text.primary,
      textAlign: 'center',
      fontWeight: theme.fontConfig.fontWeight.medium,
      fontSize: theme.fontSizes.sm,
    },

    // Period Selector
    periodSelector: {
      flexDirection: 'row',
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.xs,
    },

    periodButton: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.md,
      minWidth: 50,
      alignItems: 'center',
    },

    periodButtonActive: {
      backgroundColor: theme.colors.interactive.primary,
    },

    periodButtonText: {
      ...theme.typography.caption.base,
      color: theme.colors.text.secondary,
      fontWeight: theme.fontConfig.fontWeight.medium,
      fontSize: theme.fontSizes.xs,
    },

    periodButtonTextActive: {
      color: theme.colors.text.inverse,
    },

    // Student Cards
    compactStudentCard: {
      marginBottom: theme.spacing.sm,
    },


    // Activities - Mobile Optimized
    activityItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.sm,
      gap: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      // Enhanced mobile visibility
      shadowColor: theme.colors.shadow?.default || '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },

    activityIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },

    activityContent: {
      flex: 1,
    },

    activityMessage: {
      ...theme.typography.body.sm,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.xs,
      lineHeight: theme.fontSizes.sm * 1.3,
    },

    studentName: {
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.interactive.primary,
    },

    activityTime: {
      ...theme.typography.caption.base,
      color: theme.colors.text.tertiary,
      fontSize: theme.fontSizes.xs,
    },

    priorityIndicator: {
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: theme.spacing.xs,
    },
  });
});

export default InstructorDashboard;
