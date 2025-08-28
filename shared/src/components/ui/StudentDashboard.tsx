import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, createThemedStyles } from '../../theme';
import { useProgramContext } from '../program/ProgramContextProvider';
import PerformanceChart from '../charts/PerformanceChart';

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

interface StudentCourse {
  id: string;
  title: string;
  level: string;
  instructor: string;
  progress: number;
  status: 'active' | 'completed' | 'paused';
  nextSession?: string;
  enrollment_date: string;
}

interface StudentActivity {
  id: string;
  type: 'session_completed' | 'achievement' | 'booking_confirmed' | 'progress_update' | 'assignment';
  course_name: string;
  message: string;
  timestamp: string;
  priority?: 'high' | 'medium' | 'low';
}

interface StudentDashboardProps {
  // Metrics data
  metrics?: DashboardMetric[];

  // Chart data for student progress
  chartData?: any;

  // Student's courses
  courses?: StudentCourse[];

  // Recent activities/achievements
  recentActivities?: StudentActivity[];

  // Quick actions for students
  quickActions?: QuickAction[];

  // Callbacks
  onMetricPress?: (metric: DashboardMetric) => void;
  onCoursePress?: (course: StudentCourse) => void;
  onViewAllCourses?: () => void;
  onViewAllActivities?: () => void;

  // Customization
  showChart?: boolean;
  showCourses?: boolean;
  showActivities?: boolean;
  maxCoursesShown?: number;
  maxActivitiesShown?: number;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({
  metrics = [],
  chartData,
  courses = [],
  recentActivities = [],
  quickActions = [],
  onMetricPress,
  onCoursePress,
  onViewAllCourses,
  onViewAllActivities,
  showChart = true,
  showCourses = true,
  showActivities = true,
  maxCoursesShown = 3,
  maxActivitiesShown = 5,
}) => {
  const { theme } = useTheme();
  const { currentProgram } = useProgramContext();
  const { width: screenWidth } = useWindowDimensions();
  const useThemedStyles = useMemo(() => createResponsiveStyles(screenWidth), [screenWidth]);
  const styles = useThemedStyles();
  const [selectedPeriod, setSelectedPeriod] = useState<
    'week' | 'month' | 'quarter'
  >('month');

  // Mobile-optimized responsive breakpoints
  const isSmallDevice = screenWidth < 380;

  // Memoize default data for student-specific metrics
  const defaultMetrics = useMemo((): DashboardMetric[] => [
    {
      id: 'active_courses',
      title: 'Active Courses',
      value: courses.filter(course => course.status === 'active').length,
      icon: 'book-outline',
      color: theme.colors.interactive.primary,
    },
    {
      id: 'sessions_completed',
      title: 'Sessions Completed',
      value: courses.reduce((total, course) => total + Math.floor(course.progress / 100 * 20), 0),
      change: 15,
      changeType: 'increase',
      icon: 'checkmark-circle-outline',
      color: theme.colors.status.success,
    },
    {
      id: 'avg_progress',
      title: 'Average Progress',
      value: `${Math.round(courses.reduce((total, course) => total + course.progress, 0) / courses.length || 0)}%`,
      change: 8.5,
      changeType: 'increase',
      icon: 'trending-up-outline',
      color: theme.colors.interactive.primary,
    },
    {
      id: 'next_session',
      title: 'Next Session',
      value: courses.find(course => course.nextSession)?.nextSession || 'None scheduled',
      icon: 'time-outline',
      color: theme.colors.interactive.orange,
    },
  ], [courses, theme]);

  const defaultQuickActions = useMemo((): QuickAction[] => [
    {
      id: 'book_session',
      title: 'Book Session',
      icon: 'calendar-outline',
      color: theme.colors.interactive.primary,
      onPress: () => {},
    },
    {
      id: 'view_progress',
      title: 'View Progress',
      icon: 'bar-chart-outline',
      color: theme.colors.status.success,
      onPress: () => {},
    },
    {
      id: 'assignments',
      title: 'Assignments',
      icon: 'document-text-outline',
      color: theme.colors.interactive.orange,
      onPress: () => {},
    },
    {
      id: 'contact_instructor',
      title: 'Contact Instructor',
      icon: 'mail-outline',
      color: theme.colors.status.info,
      onPress: () => {},
    },
  ], [theme]);

  // Memoize expensive computations
  const displayMetrics = useMemo(
    () => (metrics && metrics.length > 0 ? metrics : defaultMetrics),
    [metrics, defaultMetrics]
  );
  
  const displayQuickActions = useMemo(
    () => (quickActions && quickActions.length > 0 ? quickActions : defaultQuickActions),
    [quickActions, defaultQuickActions]
  );

  // Mobile-optimized data slicing
  const coursesToShow = useMemo(
    () => courses.slice(0, maxCoursesShown),
    [courses, maxCoursesShown]
  );

  const activitiesToShow = useMemo(
    () => recentActivities.slice(0, maxActivitiesShown),
    [recentActivities, maxActivitiesShown]
  );

  // Memoized callbacks
  const handleMetricPressCallback = useCallback((metric: DashboardMetric) => {
    onMetricPress?.(metric);
  }, [onMetricPress]);

  const handleCoursePressCallback = useCallback((course: StudentCourse) => {
    onCoursePress?.(course);
  }, [onCoursePress]);

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

  const renderProgressChart = () => {
    if (!showChart || !chartData) return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Progress Trend</Text>
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

  const renderMyCourses = useCallback(() => {
    if (!showCourses || courses.length === 0) return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Courses</Text>
          {courses.length > maxCoursesShown && (
            <Pressable 
              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} 
              onPress={onViewAllCourses}
              accessibilityRole='button'
              accessibilityLabel='View all courses'
            >
              <Text style={styles.viewAllText}>View All</Text>
            </Pressable>
          )}
        </View>

        {coursesToShow.map(course => (
          <Pressable 
            key={course.id}
            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }, styles.courseCard]}
            onPress={() => handleCoursePressCallback(course)}
            accessibilityRole='button'
            accessibilityLabel={`${course.title} course, ${course.progress}% complete`}
          >
            <View style={styles.courseHeader}>
              <View style={styles.courseInfo}>
                <Text style={styles.courseTitle}>{course.title}</Text>
                <Text style={styles.courseLevel}>{course.level}</Text>
                <Text style={styles.courseInstructor}>Instructor: {course.instructor}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(course.status) + '20' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(course.status) }]}>
                  {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                </Text>
              </View>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressInfo}>
                <Text style={styles.progressLabel}>Progress: {course.progress}%</Text>
                {course.nextSession && (
                  <Text style={styles.nextSession}>{course.nextSession}</Text>
                )}
              </View>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${course.progress}%`,
                      backgroundColor: theme.colors.interactive.primary 
                    }
                  ]} 
                />
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    );
  }, [showCourses, courses, coursesToShow, maxCoursesShown, onViewAllCourses, handleCoursePressCallback, styles, theme]);

  const renderRecentActivities = () => {
    if (!showActivities || recentActivities.length === 0) return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {recentActivities.length > maxActivitiesShown && (
            <Pressable 
              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} 
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
                <Text style={styles.courseName}>{activity.course_name}</Text>
                {' - ' + activity.message}
              </Text>
              <Text style={styles.activityTime}>{activity.timestamp}</Text>
            </View>

            {activity.priority === 'high' && (
              <View style={styles.priorityIndicator}>
                <Ionicons
                  name='star-outline'
                  size={14}
                  color={theme.colors.interactive.orange}
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return theme.colors.status.success;
      case 'completed':
        return theme.colors.interactive.primary;
      case 'paused':
        return theme.colors.status.warning;
      default:
        return theme.colors.text.secondary;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'session_completed':
        return 'checkmark-circle-outline';
      case 'achievement':
        return 'trophy-outline';
      case 'booking_confirmed':
        return 'calendar-outline';
      case 'progress_update':
        return 'trending-up-outline';
      case 'assignment':
        return 'document-text-outline';
      default:
        return 'information-circle-outline';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'session_completed':
        return theme.colors.status.success;
      case 'achievement':
        return theme.colors.interactive.orange;
      case 'booking_confirmed':
        return theme.colors.interactive.primary;
      case 'progress_update':
        return theme.colors.status.info;
      case 'assignment':
        return theme.colors.text.secondary;
      default:
        return theme.colors.text.secondary;
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
      removeClippedSubviews={true}
      scrollEventThrottle={16}
    >
      {currentProgram && (
        <View style={styles.programHeader}>
          <Text style={styles.programName}>{currentProgram.name}</Text>
          <Text style={styles.programSubtitle}>Student Dashboard</Text>
        </View>
      )}

      {renderMetricsOverview()}
      {renderQuickActions()}
      {renderProgressChart()}
      {renderMyCourses()}
      {renderRecentActivities()}
    </ScrollView>
  );
};

const createResponsiveStyles = (screenWidth: number) => createThemedStyles((theme) => {
  const containerPadding = theme.spacing.md;
  const availableWidth = screenWidth - containerPadding * 2;
  const cardGap = theme.spacing.sm;
  const cardWidth = (availableWidth - cardGap) / 2;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },

    contentContainer: {
      padding: containerPadding,
      paddingBottom: theme.spacing['3xl'],
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

    // Metrics Grid
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
    },

    // Quick Actions
    quickActionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: cardGap,
    },

    quickActionCard: {
      flexDirection: 'column',
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
    },

    quickActionIcon: {
      flexDirection: 'column',
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
    },

    periodButtonTextActive: {
      color: theme.colors.text.inverse,
    },

    // Course Cards
    courseCard: {
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      ...theme.elevation.sm,
    },

    courseHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.sm,
    },

    courseInfo: {
      flex: 1,
      flexDirection: 'column',
    },

    courseTitle: {
      ...theme.typography.heading.h5,
      color: theme.colors.text.primary,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      marginBottom: theme.spacing.xs / 2,
    },

    courseLevel: {
      ...theme.typography.body.sm,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.xs / 2,
    },

    courseInstructor: {
      ...theme.typography.caption.base,
      color: theme.colors.text.tertiary,
    },

    statusBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs / 2,
      borderRadius: theme.borderRadius.sm,
      marginLeft: theme.spacing.sm,
    },

    statusText: {
      ...theme.typography.caption.base,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },

    progressContainer: {
      marginTop: theme.spacing.sm,
    },

    progressInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },

    progressLabel: {
      ...theme.typography.body.sm,
      color: theme.colors.text.primary,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },

    nextSession: {
      ...theme.typography.caption.base,
      color: theme.colors.interactive.primary,
    },

    progressBar: {
      height: 6,
      backgroundColor: theme.colors.background.tertiary,
      borderRadius: theme.borderRadius.sm,
      overflow: 'hidden',
    },

    progressFill: {
      height: '100%',
      borderRadius: theme.borderRadius.sm,
    },

    // Activities
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
    },

    activityIcon: {
      flexDirection: 'column',
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },

    activityContent: {
      flex: 1,
      flexDirection: 'column',
    },

    activityMessage: {
      ...theme.typography.body.sm,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.xs,
      lineHeight: theme.fontSizes.sm * 1.3,
    },

    courseName: {
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.interactive.primary,
    },

    activityTime: {
      ...theme.typography.caption.base,
      color: theme.colors.text.tertiary,
    },

    priorityIndicator: {
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: theme.spacing.xs,
    },
  });
});

export default StudentDashboard;