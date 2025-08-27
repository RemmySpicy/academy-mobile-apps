import React, { useState } from 'react';
import { View,
  Text,
  ScrollView,
  Pressable,
  useWindowDimensions,
  Dimensions,
  StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInRight,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme, createThemedStyles, Header } from '@academy/mobile-shared';

const { width } = Dimensions.get('window');

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  index: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  trend, 
  icon, 
  color, 
  index 
}) => {
  const { theme } = useTheme();
  const styles = useThemedStyles();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return theme.colors.status.success;
      case 'down':
        return theme.colors.status.error;
      default:
        return theme.colors.text.secondary;
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return 'trending-up';
      case 'down':
        return 'trending-down';
      default:
        return 'remove';
    }
  };

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 100).springify()}
      style={[animatedStyle, { width: (width - 48) / 2 }]}
    >
      <Pressable
        onPressIn={() => {
          scale.value = withSpring(0.98);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        style={styles.metricCard}
      >
        <View style={styles.metricCardHeader}>
          <View 
            style={[
              styles.metricIcon,
              { backgroundColor: `${color}15` }
            ]}
          >
            <Ionicons name={icon} size={20} color={color} />
          </View>
          <Ionicons 
            name={getTrendIcon() as any} 
            size={16} 
            color={getTrendColor()} 
          />
        </View>
        <Text style={styles.metricValue}>{value}</Text>
        <Text style={styles.metricTitle}>{title}</Text>
        <Text 
          style={[
            styles.metricChange,
            { color: getTrendColor() }
          ]}
        >
          {change}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

interface StudentPerformanceProps {
  student: {
    id: string;
    name: string;
    level: string;
    progress: number;
    attendance: number;
    lastUpdate: string;
  };
  index: number;
}

const StudentPerformanceCard: React.FC<StudentPerformanceProps> = ({ student, index }) => {
  const { theme } = useTheme();
  const styles = useThemedStyles();
  
  return (
    <Animated.View
      entering={FadeInRight.delay(index * 50).springify()}
      style={styles.studentCard}
    >
      <View style={styles.studentCardHeader}>
        <View style={styles.studentInfoRow}>
          <View style={styles.studentAvatar}>
            <Text style={styles.studentAvatarText}>
              {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </Text>
          </View>
          <View style={styles.studentDetails}>
            <Text style={styles.studentName}>{student.name}</Text>
            <Text style={styles.studentLevel}>{student.level}</Text>
          </View>
        </View>
        <Text style={styles.lastUpdateText}>{student.lastUpdate}</Text>
      </View>

      <View style={styles.progressRow}>
        <View style={styles.progressSection}>
          <Text style={styles.progressLabel}>Progress</Text>
          <View style={styles.progressBarBackground}>
            <View 
              style={[
                styles.progressBarFill,
                styles.progressBarPrimary,
                { width: `${student.progress}%` }
              ]}
            />
          </View>
          <Text style={styles.progressPercentage}>{student.progress}%</Text>
        </View>
        <View style={styles.attendanceSection}>
          <Text style={styles.progressLabel}>Attendance</Text>
          <View style={styles.progressBarBackground}>
            <View 
              style={[
                styles.progressBarFill,
                styles.progressBarSuccess,
                { width: `${student.attendance}%` }
              ]}
            />
          </View>
          <Text style={styles.progressPercentage}>{student.attendance}%</Text>
        </View>
      </View>
    </Animated.View>
  );
};

/**
 * Performance Screen - Analytics & Reports
 * 
 * Features:
 * - Key performance metrics
 * - Student progress overview
 * - Class performance insights
 * - Attendance analytics
 * - Progress trends and comparisons
 */
export const PerformanceScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = useThemedStyles();
  const insets = useSafeAreaInsets();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month');
  const [notificationCount, setNotificationCount] = useState(4);

  const metrics = [
    {
      title: 'Average Progress',
      value: '78%',
      change: '+5% this month',
      trend: 'up' as const,
      icon: 'trending-up' as const,
      color: '#3B82F6',
    },
    {
      title: 'Attendance Rate',
      value: '92%',
      change: '+2% this month',
      trend: 'up' as const,
      icon: 'people' as const,
      color: '#10B981',
    },
    {
      title: 'Class Completion',
      value: '85%',
      change: '-1% this month',
      trend: 'down' as const,
      icon: 'checkmark-circle' as const,
      color: '#8B5CF6',
    },
    {
      title: 'Student Satisfaction',
      value: '4.6',
      change: 'No change',
      trend: 'neutral' as const,
      icon: 'star' as const,
      color: '#F59E0B',
    },
  ];

  const topStudents = [
    {
      id: '1',
      name: 'Emma Johnson',
      level: 'Swimming Level 2',
      progress: 95,
      attendance: 98,
      lastUpdate: '2 days ago',
    },
    {
      id: '2',
      name: 'Liam Smith',
      level: 'Swimming Level 3',
      progress: 88,
      attendance: 94,
      lastUpdate: '1 day ago',
    },
    {
      id: '3',
      name: 'Olivia Davis',
      level: 'Swimming Level 1',
      progress: 82,
      attendance: 96,
      lastUpdate: '3 days ago',
    },
    {
      id: '4',
      name: 'Noah Wilson',
      level: 'Swimming Level 2',
      progress: 79,
      attendance: 89,
      lastUpdate: '1 day ago',
    },
  ];

  const periods = [
    { key: 'week' as const, label: 'This Week' },
    { key: 'month' as const, label: 'This Month' },
    { key: 'quarter' as const, label: 'This Quarter' },
  ];

  const handleSearch = () => {
    console.log('Search pressed');
  };

  const handleFilter = () => {
    console.log('Filter pressed');
  };

  const handleNotifications = () => {
    console.log('Notifications pressed');
    setNotificationCount(0);
  };

  return (
    <View style={styles.container}>
      {/* Header with Program Switcher */}
      <Header
        title="Performance"
        showProgramSwitcher={true}
        variant="instructor"
        onSearchPress={handleSearch}
        onFilterPress={handleFilter}
        onNotificationPress={handleNotifications}
        notificationCount={notificationCount}
        showInstructorActions={true}
        showNotifications={true}
        showProfile={false}
        style={{ paddingTop: insets.top }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 100, // Space for tab bar
        }}
        showsVerticalScrollIndicator={false}
      >

        {/* Period Selector */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={styles.periodSelectorSection}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 24 }}
          >
            {periods.map(period => (
              <Pressable
                key={period.key}
                onPress={() => setSelectedPeriod(period.key)}
                style={[
                  styles.periodButton,
                  selectedPeriod === period.key
                    ? styles.periodButtonActive
                    : styles.periodButtonInactive
                ]}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    selectedPeriod === period.key
                      ? styles.periodButtonTextActive
                      : styles.periodButtonTextInactive
                  ]}
                >
                  {period.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Metrics Grid */}
        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          style={styles.metricsSection}
        >
          <View style={styles.metricsGrid}>
            {metrics.map((metric, index) => (
              <MetricCard
                key={metric.title}
                {...metric}
                index={index}
              />
            ))}
          </View>
        </Animated.View>

        {/* Chart Placeholder */}
        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          style={styles.chartSection}
        >
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Progress Trends</Text>
              <Pressable style={styles.viewDetailsButton}>
                <Ionicons name="bar-chart-outline" size={16} color={theme.colors.interactive.accent} />
                <Text style={styles.viewDetailsText}>View Details</Text>
              </Pressable>
            </View>
            
            {/* Simple chart placeholder */}
            <View style={styles.chartPlaceholder}>
              <Ionicons name="bar-chart-outline" size={48} color={theme.colors.icon.disabled} />
              <Text style={styles.chartPlaceholderText}>Chart will appear here</Text>
            </View>
          </View>
        </Animated.View>

        {/* Top Performing Students */}
        <Animated.View
          entering={FadeInDown.delay(500).springify()}
          style={styles.studentsSection}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Top Performing Students
            </Text>
            <Pressable>
              <Text style={styles.viewAllText}>View All</Text>
            </Pressable>
          </View>
          
          {topStudents.map((student, index) => (
            <StudentPerformanceCard
              key={student.id}
              student={student}
              index={index}
            />
          ))}
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View
          entering={FadeInDown.delay(600).springify()}
          style={styles.quickActionsSection}
        >
          <Text style={styles.sectionTitle}>
            Quick Actions
          </Text>
          <View style={styles.quickActionsRow}>
            <Pressable style={styles.quickActionCard}>
              <View style={styles.quickActionContent}>
                <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.status.infoBackground }]}>
                  <Ionicons name="document-text" size={24} color={theme.colors.interactive.accent} />
                </View>
                <Text style={styles.quickActionText}>Generate Report</Text>
              </View>
            </Pressable>
            <Pressable style={styles.quickActionCard}>
              <View style={styles.quickActionContent}>
                <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.status.successBackground }]}>
                  <Ionicons name="share" size={24} color={theme.colors.status.success} />
                </View>
                <Text style={styles.quickActionText}>Share Insights</Text>
              </View>
            </Pressable>
            <Pressable style={styles.quickActionCard}>
              <View style={styles.quickActionContent}>
                <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.status.warningBackground }]}>
                  <Ionicons name="settings" size={24} color={theme.colors.status.warning} />
                </View>
                <Text style={styles.quickActionText}>Analytics Settings</Text>
              </View>
            </Pressable>
          </View>
        </Animated.View>
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
    headerSection: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    headerTitle: {
      fontSize: theme.fontSizes['2xl'],
      fontWeight: theme.fontConfig.fontWeight.bold,
      color: theme.colors.text.primary,
    },
    headerSubtitle: {
      fontSize: theme.fontSizes.base,
      color: theme.colors.text.secondary,
      marginTop: theme.spacing.xs,
    },
    periodSelectorSection: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    periodButton: {
      marginRight: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.full,
    },
    periodButtonActive: {
      backgroundColor: theme.colors.interactive.accent,
    },
    periodButtonInactive: {
      backgroundColor: theme.colors.background.primary,
      borderWidth: 1,
      borderColor: theme.colors.border.secondary,
    },
    periodButtonText: {
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
    periodButtonTextActive: {
      color: theme.colors.text.inverse,
    },
    periodButtonTextInactive: {
      color: theme.colors.text.secondary,
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
    metricCard: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      shadowColor: theme.colors.shadow.default,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 2,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      marginBottom: theme.spacing.sm,
    },
    metricCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    metricIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    metricValue: {
      fontSize: theme.fontSizes['2xl'],
      fontWeight: theme.fontConfig.fontWeight.bold,
      color: theme.colors.text.primary,
    },
    metricTitle: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text.secondary,
      marginTop: theme.spacing.xs,
    },
    metricChange: {
      fontSize: theme.fontSizes.xs,
      fontWeight: theme.fontConfig.fontWeight.medium,
      marginTop: theme.spacing.xs,
    },
    chartSection: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    chartCard: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      shadowColor: theme.colors.shadow.default,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 2,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    chartHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.md,
    },
    chartTitle: {
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
    },
    viewDetailsButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    viewDetailsText: {
      color: theme.colors.interactive.accent,
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
      marginLeft: theme.spacing.sm,
    },
    chartPlaceholder: {
      height: 128,
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    chartPlaceholderText: {
      color: theme.colors.text.tertiary,
      fontSize: theme.fontSizes.sm,
      marginTop: theme.spacing.sm,
    },
    studentsSection: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.md,
    },
    sectionTitle: {
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
    },
    viewAllText: {
      color: theme.colors.interactive.accent,
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
    studentCard: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      shadowColor: theme.colors.shadow.default,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 2,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      marginBottom: theme.spacing.sm,
    },
    studentCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    studentInfoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    studentAvatar: {
      width: 40,
      height: 40,
      backgroundColor: theme.colors.status.infoBackground,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.sm,
    },
    studentAvatarText: {
      color: theme.colors.interactive.accent,
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.semibold,
    },
    studentDetails: {
      flex: 1,
    },
    studentName: {
      fontSize: theme.fontSizes.base,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
    },
    studentLevel: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text.secondary,
    },
    lastUpdateText: {
      fontSize: theme.fontSizes.xs,
      color: theme.colors.text.tertiary,
    },
    progressRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    progressSection: {
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    attendanceSection: {
      flex: 1,
      marginLeft: theme.spacing.sm,
    },
    progressLabel: {
      fontSize: theme.fontSizes.xs,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.xs,
    },
    progressBarBackground: {
      backgroundColor: theme.colors.border.secondary,
      borderRadius: theme.borderRadius.full,
      height: 8,
    },
    progressBarFill: {
      height: 8,
      borderRadius: theme.borderRadius.full,
    },
    progressBarPrimary: {
      backgroundColor: theme.colors.interactive.accent,
    },
    progressBarSuccess: {
      backgroundColor: theme.colors.status.success,
    },
    progressPercentage: {
      fontSize: theme.fontSizes.xs,
      color: theme.colors.text.secondary,
      marginTop: theme.spacing.xs,
    },
    quickActionsSection: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing['2xl'],
    },
    quickActionsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    quickActionCard: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      shadowColor: theme.colors.shadow.default,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 2,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      flex: 1,
      marginHorizontal: theme.spacing.xs,
    },
    quickActionContent: {
      alignItems: 'center',
    },
    quickActionIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.sm,
    },
    quickActionText: {
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: theme.colors.text.primary,
    },
  })
);