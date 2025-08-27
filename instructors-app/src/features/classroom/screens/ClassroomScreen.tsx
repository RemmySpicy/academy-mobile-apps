import React from 'react';
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
import { useAuthStore, useTheme, createThemedStyles, Badge, Header } from '@academy/mobile-shared';

const { width } = Dimensions.get('window');

interface ClassCardProps {
  classInfo: {
    id: string;
    name: string;
    level: string;
    time: string;
    studentCount: number;
    status: 'upcoming' | 'active' | 'completed';
    progress: number;
  };
  index: number;
  onPress: () => void;
}

const ClassCard: React.FC<ClassCardProps> = ({ classInfo, index, onPress }) => {
  const { theme } = useTheme();
  const styles = useThemedStyles();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getStatusColor = (status: ClassCardProps['classInfo']['status']) => {
    switch (status) {
      case 'upcoming':
        return theme.colors.interactive.accent;
      case 'active':
        return theme.colors.status.success;
      case 'completed':
        return theme.colors.text.secondary;
      default:
        return theme.colors.icon.tertiary;
    }
  };

  const getStatusText = (status: ClassCardProps['classInfo']['status']) => {
    switch (status) {
      case 'upcoming':
        return 'Upcoming';
      case 'active':
        return 'Active Now';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 100).springify()}
      style={animatedStyle}
    >
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.98);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        style={styles.classCard}
      >
        <View style={styles.classCardHeader}>
          <View style={styles.classInfoSection}>
            <Text style={styles.className}>{classInfo.name}</Text>
            <Text style={styles.classLevel}>{classInfo.level}</Text>
          </View>
          <Badge
            variant={
              classInfo.status === 'completed' ? 'success' :
              classInfo.status === 'active' ? 'info' :
              'warning'
            }
            size="sm"
            shape="pill"
          >
            {getStatusText(classInfo.status)}
          </Badge>
        </View>

        <View style={styles.classMetaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={16} color={theme.colors.icon.secondary} />
            <Text style={styles.metaText}>{classInfo.time}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="people-outline" size={16} color={theme.colors.icon.secondary} />
            <Text style={styles.metaText}>{classInfo.studentCount} students</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Class Progress</Text>
            <Text style={styles.progressPercentage}>{classInfo.progress}%</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View 
              style={[
                styles.progressBarFill,
                { width: `${classInfo.progress}%` }
              ]}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsRow}>
          <Pressable style={styles.attendanceButton}>
            <Ionicons name="checkmark-circle-outline" size={16} color={theme.colors.interactive.accent} />
            <Text style={styles.attendanceButtonText}>Attendance</Text>
          </Pressable>
          <Pressable style={styles.notesButton}>
            <Ionicons name="clipboard-outline" size={16} color={theme.colors.status.success} />
            <Text style={styles.notesButtonText}>Notes</Text>
          </Pressable>
        </View>
      </Pressable>
    </Animated.View>
  );
};

/**
 * Classroom Screen - Main Hub for Instructors
 * 
 * Features:
 * - Today's classes overview
 * - Quick class management actions
 * - Recent activity and notifications
 * - Performance insights
 * - Easy navigation to attendance and grading
 */
export const ClassroomScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = useThemedStyles();
  const insets = useSafeAreaInsets();
  const { user, currentProgram } = useAuthStore();
  const [notificationCount, setNotificationCount] = React.useState(1);

  // Mock data - replace with real API call
  const todaysClasses = [
    {
      id: '1',
      name: 'Swimming Level 1',
      level: 'Beginner Group A',
      time: '10:00 AM - 11:00 AM',
      studentCount: 8,
      status: 'completed' as const,
      progress: 100,
    },
    {
      id: '2',
      name: 'Swimming Level 2',
      level: 'Intermediate Group B',
      time: '2:00 PM - 3:00 PM',
      studentCount: 12,
      status: 'active' as const,
      progress: 45,
    },
    {
      id: '3',
      name: 'Advanced Swimming',
      level: 'Advanced Group A',
      time: '4:30 PM - 5:30 PM',
      studentCount: 6,
      status: 'upcoming' as const,
      progress: 0,
    },
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
        title="Classroom"
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

        {/* Quick Stats */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={styles.statsSection}
        >
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={styles.statCardContent}>
                <View style={[styles.statIcon, { backgroundColor: theme.colors.status.infoBackground }]}>
                  <Ionicons name="calendar" size={16} color={theme.colors.interactive.accent} />
                </View>
                <View style={styles.statTextContainer}>
                  <Text style={styles.statLabel}>Today's Classes</Text>
                  <Text style={styles.statValue}>{todaysClasses.length}</Text>
                </View>
              </View>
            </View>
            <View style={styles.statCard}>
              <View style={styles.statCardContent}>
                <View style={[styles.statIcon, { backgroundColor: theme.colors.status.successBackground }]}>
                  <Ionicons name="people" size={16} color={theme.colors.status.success} />
                </View>
                <View style={styles.statTextContainer}>
                  <Text style={styles.statLabel}>Total Students</Text>
                  <Text style={styles.statValue}>
                    {todaysClasses.reduce((acc, cls) => acc + cls.studentCount, 0)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Today's Classes */}
        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          style={styles.classesSection}
        >
          <Text style={styles.sectionTitle}>
            Today's Classes
          </Text>
          {todaysClasses.map((classInfo, index) => (
            <ClassCard
              key={classInfo.id}
              classInfo={classInfo}
              index={index}
              onPress={() => console.log('Navigate to class:', classInfo.id)}
            />
          ))}
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          style={styles.quickActionsSection}
        >
          <Text style={styles.sectionTitle}>
            Quick Actions
          </Text>
          <View style={styles.quickActionsRow}>
            <Pressable style={styles.quickActionCard}>
              <View style={styles.quickActionContent}>
                <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.status.infoBackground }]}>
                  <Ionicons name="add" size={24} color={theme.colors.interactive.accent} />
                </View>
                <Text style={styles.quickActionText}>Add Class</Text>
              </View>
            </Pressable>
            <Pressable style={styles.quickActionCard}>
              <View style={styles.quickActionContent}>
                <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.status.successBackground }]}>
                  <Ionicons name="clipboard" size={24} color={theme.colors.status.success} />
                </View>
                <Text style={styles.quickActionText}>Quick Note</Text>
              </View>
            </Pressable>
            <Pressable style={styles.quickActionCard}>
              <View style={styles.quickActionContent}>
                <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.status.warningBackground }]}>
                  <Ionicons name="bar-chart" size={24} color={theme.colors.status.warning} />
                </View>
                <Text style={styles.quickActionText}>Reports</Text>
              </View>
            </Pressable>
          </View>
        </Animated.View>

        {/* Recent Activity */}
        <Animated.View
          entering={FadeInDown.delay(500).springify()}
          style={styles.recentActivitySection}
        >
          <Text style={styles.sectionTitle}>
            Recent Activity
          </Text>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: theme.colors.status.successBackground }]}>
                <Ionicons name="checkmark" size={16} color={theme.colors.status.success} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Attendance completed</Text>
                <Text style={styles.activityDescription}>Swimming Level 1 - All 8 students present</Text>
              </View>
              <Text style={styles.activityTime}>2m ago</Text>
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: theme.colors.status.infoBackground }]}>
                <Ionicons name="star" size={16} color={theme.colors.interactive.accent} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Student progress updated</Text>
                <Text style={styles.activityDescription}>Emma Johnson advanced to Level 3</Text>
              </View>
              <Text style={styles.activityTime}>1h ago</Text>
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: theme.colors.status.warningBackground }]}>
                <Ionicons name="clipboard" size={16} color={theme.colors.status.warning} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Class note added</Text>
                <Text style={styles.activityDescription}>Advanced Swimming - Technique improvements noted</Text>
              </View>
              <Text style={styles.activityTime}>3h ago</Text>
            </View>
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
    greetingText: {
      fontSize: theme.fontSizes.base,
      color: theme.colors.text.secondary,
    },
    instructorName: {
      fontSize: theme.fontSizes['2xl'],
      fontWeight: theme.fontConfig.fontWeight.bold,
      color: theme.colors.text.primary,
      marginTop: theme.spacing.xs,
    },
    programBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.sm,
      backgroundColor: theme.colors.status.infoBackground,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      alignSelf: 'flex-start',
    },
    programBadgeText: {
      color: theme.colors.interactive.accent,
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
      marginLeft: theme.spacing.sm,
    },
    statsSection: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    statCard: {
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
      marginHorizontal: theme.spacing.sm,
    },
    statCardContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    statTextContainer: {
      marginLeft: theme.spacing.sm,
    },
    statLabel: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text.secondary,
    },
    statValue: {
      fontSize: theme.fontSizes.xl,
      fontWeight: theme.fontConfig.fontWeight.bold,
      color: theme.colors.text.primary,
    },
    classesSection: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
    },
    classCard: {
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
      marginBottom: theme.spacing.md,
      marginHorizontal: theme.spacing.md,
    },
    classCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    classInfoSection: {
      flex: 1,
    },
    className: {
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
    },
    classLevel: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text.secondary,
    },
    classMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    metaText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text.secondary,
      marginLeft: theme.spacing.sm,
    },
    progressSection: {
      marginBottom: theme.spacing.sm,
    },
    progressHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.xs,
    },
    progressLabel: {
      fontSize: theme.fontSizes.xs,
      color: theme.colors.text.secondary,
    },
    progressPercentage: {
      fontSize: theme.fontSizes.xs,
      color: theme.colors.text.secondary,
    },
    progressBarBackground: {
      backgroundColor: theme.colors.border.secondary,
      borderRadius: theme.borderRadius.full,
      height: 8,
    },
    progressBarFill: {
      backgroundColor: theme.colors.interactive.accent,
      height: 8,
      borderRadius: theme.borderRadius.full,
    },
    actionButtonsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    attendanceButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.status.infoBackground,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    attendanceButtonText: {
      color: theme.colors.interactive.accent,
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
      marginLeft: theme.spacing.sm,
    },
    notesButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.status.successBackground,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      flex: 1,
      marginLeft: theme.spacing.sm,
    },
    notesButtonText: {
      color: theme.colors.status.success,
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
      marginLeft: theme.spacing.sm,
    },
    quickActionsSection: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.lg,
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
    recentActivitySection: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing['2xl'],
    },
    activityCard: {
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
    activityItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    activityIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.sm,
    },
    activityContent: {
      flex: 1,
    },
    activityTitle: {
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: theme.colors.text.primary,
    },
    activityDescription: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text.secondary,
    },
    activityTime: {
      fontSize: theme.fontSizes.xs,
      color: theme.colors.text.tertiary,
    },
  })
);