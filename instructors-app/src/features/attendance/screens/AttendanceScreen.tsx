import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInRight,
  Layout,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme, createThemedStyles, Badge } from '@academy/mobile-shared';

interface Student {
  id: string;
  name: string;
  avatar: string;
  status: 'present' | 'absent' | 'late' | 'not_marked';
}

interface AttendanceClass {
  id: string;
  name: string;
  level: string;
  time: string;
  studentsCount: number;
  attendanceMarked: boolean;
  students: Student[];
}

interface ClassCardProps {
  classInfo: AttendanceClass;
  index: number;
  onPress: (classInfo: AttendanceClass) => void;
}

const ClassCard: React.FC<ClassCardProps> = ({ classInfo, index, onPress }) => {
  const { theme } = useTheme();
  const styles = useThemedStyles();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const presentCount = classInfo.students.filter(s => s.status === 'present').length;
  const absentCount = classInfo.students.filter(s => s.status === 'absent').length;

  return (
    <Animated.View
      layout={Layout.springify()}
      entering={FadeInRight.delay(index * 50).springify()}
    >
      <Animated.View style={animatedStyle}>
        <Pressable
          onPress={() => onPress(classInfo)}
          onPressIn={() => {
            scale.value = withSpring(0.98);
          }}
          onPressOut={() => {
            scale.value = withSpring(1);
          }}
        style={styles.classCard}
      >
        <View style={styles.classHeader}>
          <View style={styles.classInfoContainer}>
            <Text style={styles.className}>
              {classInfo.name}
            </Text>
            <Text style={styles.classLevel}>{classInfo.level}</Text>
            <Text style={styles.classTime}>{classInfo.time}</Text>
          </View>
          
          <Badge
            variant={classInfo.attendanceMarked ? 'success' : 'warning'}
            size="sm"
            shape="pill"
          >
            {classInfo.attendanceMarked ? 'Completed' : 'Pending'}
          </Badge>
        </View>

        {/* Attendance Summary */}
        <View style={styles.attendanceSummary}>
          <View style={styles.attendanceStatsContainer}>
            <View style={styles.attendanceStatItem}>
              <View style={styles.presentIndicator} />
              <Text style={styles.attendanceStatText}>Present: {presentCount}</Text>
            </View>
            <View style={styles.attendanceStatItem}>
              <View style={styles.absentIndicator} />
              <Text style={styles.attendanceStatText}>Absent: {absentCount}</Text>
            </View>
          </View>
          <Text style={styles.totalStudentsText}>
            Total: {classInfo.studentsCount}
          </Text>
        </View>

        {/* Action Button */}
        <Pressable 
          style={[
            styles.actionButton,
            classInfo.attendanceMarked ? styles.viewAttendanceButton : styles.markAttendanceButton
          ]}
        >
          <Ionicons 
            name={classInfo.attendanceMarked ? "eye-outline" : "checkmark-circle-outline"} 
            size={16} 
            color={classInfo.attendanceMarked ? theme.colors.interactive.accent : theme.colors.status.success} 
          />
          <Text style={[
            styles.actionButtonText,
            classInfo.attendanceMarked ? styles.viewAttendanceText : styles.markAttendanceText
          ]}>
            {classInfo.attendanceMarked ? 'View Attendance' : 'Mark Attendance'}
          </Text>
        </Pressable>
      </Pressable>
      </Animated.View>
    </Animated.View>
  );
};

/**
 * Attendance Screen - Attendance Management
 * 
 * Features:
 * - Today's classes with attendance status
 * - Quick attendance marking
 * - Attendance history and reports
 * - Student attendance patterns
 * - Bulk attendance actions
 */
export const AttendanceScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = useThemedStyles();
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Mock data - replace with real API call
  const [classes] = useState<AttendanceClass[]>([
    {
      id: '1',
      name: 'Swimming Level 1',
      level: 'Beginner Group A',
      time: '10:00 AM - 11:00 AM',
      studentsCount: 8,
      attendanceMarked: true,
      students: [
        { id: '1', name: 'Emma Johnson', avatar: 'EJ', status: 'present' },
        { id: '2', name: 'Liam Smith', avatar: 'LS', status: 'present' },
        { id: '3', name: 'Olivia Davis', avatar: 'OD', status: 'absent' },
        { id: '4', name: 'Noah Wilson', avatar: 'NW', status: 'present' },
        { id: '5', name: 'Ava Brown', avatar: 'AB', status: 'present' },
        { id: '6', name: 'William Jones', avatar: 'WJ', status: 'present' },
        { id: '7', name: 'Sophia Garcia', avatar: 'SG', status: 'present' },
        { id: '8', name: 'James Miller', avatar: 'JM', status: 'present' },
      ],
    },
    {
      id: '2',
      name: 'Swimming Level 2',
      level: 'Intermediate Group B',
      time: '2:00 PM - 3:00 PM',
      studentsCount: 12,
      attendanceMarked: false,
      students: [
        { id: '9', name: 'Isabella Anderson', avatar: 'IA', status: 'not_marked' },
        { id: '10', name: 'Mason Taylor', avatar: 'MT', status: 'not_marked' },
        // ... more students
      ],
    },
    {
      id: '3',
      name: 'Advanced Swimming',
      level: 'Advanced Group A',
      time: '4:30 PM - 5:30 PM',
      studentsCount: 6,
      attendanceMarked: false,
      students: [
        { id: '13', name: 'Charlotte Thomas', avatar: 'CT', status: 'not_marked' },
        { id: '14', name: 'Lucas Jackson', avatar: 'LJ', status: 'not_marked' },
        // ... more students
      ],
    },
  ]);

  const handleClassPress = (classInfo: AttendanceClass) => {
    if (classInfo.attendanceMarked) {
      console.log('View attendance for:', classInfo.id);
    } else {
      console.log('Mark attendance for:', classInfo.id);
    }
  };

  const completedCount = classes.filter(c => c.attendanceMarked).length;
  const pendingCount = classes.length - completedCount;

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View
        entering={FadeInDown.delay(100).springify()}
        style={[styles.header, { paddingTop: insets.top + 16 }]}
      >
        <Text style={styles.headerTitle}>Attendance</Text>
        <Text style={styles.headerSubtitle}>
          Mark and track student attendance
        </Text>
      </Animated.View>

      {/* Date Selector & Stats */}
      <Animated.View
        entering={FadeInDown.delay(200).springify()}
        style={styles.overviewContainer}
      >
        <View style={styles.overviewCard}>
          <View style={styles.overviewHeader}>
            <Text style={styles.overviewTitle}>Today's Overview</Text>
            <Pressable 
              style={[styles.changeDateButton, { backgroundColor: theme.colors.status.infoBackground }]}
            >
              <Ionicons name="calendar-outline" size={16} color={theme.colors.interactive.accent} />
              <Text 
                style={[styles.changeDateText, { color: theme.colors.interactive.accent }]}
              >
                Change Date
              </Text>
            </Pressable>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statColumn}>
              <Text style={styles.statNumber}>{classes.length}</Text>
              <Text style={styles.statLabel}>Total Classes</Text>
            </View>
            <View style={styles.statColumn}>
              <Text style={[styles.statNumber, { color: theme.colors.status.success }]}>{completedCount}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statColumn}>
              <Text style={[styles.statNumber, { color: theme.colors.status.warning }]}>{pendingCount}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Quick Actions */}
      <Animated.View
        entering={FadeInDown.delay(300).springify()}
        style={styles.quickActionsContainer}
      >
        <View style={styles.quickActionsRow}>
          <Pressable 
            style={[styles.quickActionButton, { backgroundColor: theme.colors.status.success }]}
          >
            <View style={styles.quickActionContent}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.text.inverse} />
              <Text style={styles.quickActionText}>Mark All Present</Text>
            </View>
          </Pressable>
          <Pressable 
            style={[styles.quickActionButton, { backgroundColor: theme.colors.interactive.accent }]}
          >
            <View style={styles.quickActionContent}>
              <Ionicons name="bar-chart" size={20} color={theme.colors.text.inverse} />
              <Text style={styles.quickActionText}>View Reports</Text>
            </View>
          </Pressable>
        </View>
      </Animated.View>

      {/* Classes List */}
      <FlatList
        data={classes}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <ClassCard
            classInfo={item}
            index={index}
            onPress={handleClassPress}
          />
        )}
        contentContainerStyle={{
          paddingBottom: 100, // Space for tab bar
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <Animated.View
            entering={FadeInDown.delay(400).springify()}
            style={styles.emptyStateContainer}
          >
            <Ionicons name="calendar-outline" size={64} color={theme.colors.icon.disabled} />
            <Text style={styles.emptyStateTitle}>
              No classes scheduled
            </Text>
            <Text style={styles.emptyStateSubtitle}>
              No classes found for the selected date
            </Text>
          </Animated.View>
        )}
      />
    </View>
  );
};

const useThemedStyles = createThemedStyles((theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    },
    header: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
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
    overviewContainer: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
    overviewCard: {
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
    overviewHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.md,
    },
    overviewTitle: {
      fontSize: theme.fontSizes.base,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
    },
    changeDateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.lg,
    },
    changeDateText: {
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
      marginLeft: theme.spacing.sm,
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    statColumn: {
      alignItems: 'center',
    },
    statNumber: {
      fontSize: theme.fontSizes['2xl'],
      fontWeight: theme.fontConfig.fontWeight.bold,
      color: theme.colors.text.primary,
    },
    statLabel: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text.secondary,
    },
    quickActionsContainer: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
    quickActionsRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    quickActionButton: {
      flex: 1,
      borderRadius: theme.borderRadius.lg,
      paddingVertical: theme.spacing.sm,
    },
    quickActionContent: {
      alignItems: 'center',
    },
    quickActionText: {
      color: theme.colors.text.inverse,
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
      marginTop: theme.spacing.xs,
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
      marginBottom: theme.spacing.sm,
      marginHorizontal: theme.spacing.md,
    },
    classHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    classInfoContainer: {
      flex: 1,
    },
    className: {
      fontSize: theme.fontSizes.base,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
    },
    classLevel: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text.secondary,
    },
    classTime: {
      fontSize: theme.fontSizes.xs,
      color: theme.colors.text.tertiary,
      marginTop: theme.spacing.xs,
    },
    attendanceSummary: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    attendanceStatsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    attendanceStatItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: theme.spacing.md,
    },
    presentIndicator: {
      width: 12,
      height: 12,
      backgroundColor: theme.colors.status.success,
      borderRadius: theme.borderRadius.full,
      marginRight: theme.spacing.sm,
    },
    absentIndicator: {
      width: 12,
      height: 12,
      backgroundColor: theme.colors.status.error,
      borderRadius: theme.borderRadius.full,
      marginRight: theme.spacing.sm,
    },
    attendanceStatText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text.secondary,
    },
    totalStudentsText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text.secondary,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
    },
    viewAttendanceButton: {
      backgroundColor: theme.colors.status.infoBackground,
    },
    markAttendanceButton: {
      backgroundColor: theme.colors.status.successBackground,
    },
    actionButtonText: {
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
      marginLeft: theme.spacing.sm,
    },
    viewAttendanceText: {
      color: theme.colors.interactive.accent,
    },
    markAttendanceText: {
      color: theme.colors.status.success,
    },
    emptyStateContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing['3xl'],
    },
    emptyStateTitle: {
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: theme.colors.text.secondary,
      marginTop: theme.spacing.md,
    },
    emptyStateSubtitle: {
      fontSize: theme.fontSizes.base,
      color: theme.colors.text.tertiary,
      marginTop: theme.spacing.sm,
      textAlign: 'center',
      paddingHorizontal: theme.spacing['2xl'],
    },
  })
);