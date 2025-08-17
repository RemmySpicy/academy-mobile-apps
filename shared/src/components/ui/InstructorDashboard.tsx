import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, useWindowDimensions, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, createThemedStyles } from '../../theme/ThemeProvider';
import { useProgramContext } from '../program/ProgramContextProvider';
import PerformanceChart from '../charts/PerformanceChart';
import StudentCard from './StudentCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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
  const styles = useThemedStyles();
  const [selectedPeriod, setSelectedPeriod] = useState<
    'week' | 'month' | 'quarter'
  >('month');

  const defaultMetrics: DashboardMetric[] = [
    {
      id: 'total_students',
      title: 'Total Students',
      value: recentStudents.length || 0,
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
  ];

  const defaultQuickActions: QuickAction[] = [
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
  ];

  const displayMetrics = metrics.length > 0 ? metrics : defaultMetrics;
  const displayQuickActions =
    quickActions.length > 0 ? quickActions : defaultQuickActions;

  const renderMetricsOverview = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Overview</Text>
      <View style={styles.metricsGrid}>
        {displayMetrics.map(metric => (
          <Pressable 
            key={metric.id}
            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }, styles.metricCard]}
            onPress={() => onMetricPress?.(metric)}
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
  );

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

  const renderRecentStudents = () => {
    if (!showStudents || recentStudents.length === 0) return null;

    const studentsToShow = recentStudents.slice(0, maxStudentsShown);

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Students</Text>
          {recentStudents.length > maxStudentsShown && (
            <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} 
              onPress={onViewAllStudents}
              accessibilityRole='button'
              accessibilityLabel='View all students'
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
            onPress={onStudentPress}
            showQuickActions={false}
            showProgress={false}
            style={styles.compactStudentCard}
          />
        ))}
      </View>
    );
  };

  const renderRecentActivities = () => {
    if (!showActivities || recentActivities.length === 0) return null;

    const activitiesToShow = recentActivities.slice(0, maxActivitiesShown);

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {recentActivities.length > maxActivitiesShown && (
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

const useThemedStyles = createThemedStyles(theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },

    contentContainer: {
      padding: theme.spacing.md,
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
      gap: theme.spacing[3],
    },

    metricCard: {
      backgroundColor: theme.colors.background.elevated,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      width: (SCREEN_WIDTH - theme.spacing[4] * 2 - theme.spacing[3]) / 2,
      ...theme.elevation.sm,
    },

    metricHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing[3],
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
    },

    metricValue: {
      ...theme.typography.heading.h3,
      color: theme.colors.text.primary,
      fontWeight: theme.fontConfig.fontWeight.bold,
    },

    changeIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
      gap: theme.spacing.xs,
    },

    changeText: {
      ...theme.typography.caption.base,
      fontWeight: theme.fontConfig.fontWeight.semibold,
    },

    // Quick Actions
    quickActionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing[3],
    },

    quickActionCard: {
      backgroundColor: theme.colors.background.elevated,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      width: (SCREEN_WIDTH - theme.spacing[4] * 2 - theme.spacing[3]) / 2,
      alignItems: 'center',
      ...theme.elevation.sm,
    },

    quickActionIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing[3],
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
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
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

    // Student Cards
    compactStudentCard: {
      marginBottom: theme.spacing.sm,
    },

    // Activities
    activityItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      padding: theme.spacing[3],
      backgroundColor: theme.colors.background.elevated,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.sm,
      gap: theme.spacing[3],
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
    },

    studentName: {
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
    },
  })
);

export default InstructorDashboard;
