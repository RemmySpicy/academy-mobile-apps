import React, { useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Header,
  InstructorDashboard,
  useTheme,
  createThemedStyles,
  useProgramContext,
  useAuthStore,
} from '@academy/mobile-shared';

// Sample data for testing
const sampleCourses = [
  {
    id: '1',
    title: 'Learn to Swim',
    level: 'Beginner Level 2',
    instructor: 'Sarah Johnson',
    nextSession: 'Tomorrow 3:00 PM',
    progress: 65,
    sessionsCompleted: 13,
    totalSessions: 20,
    status: 'active' as const,
    enrollment_date: '2024-01-15',
    program_id: 'swimming-1',
  },
  {
    id: '2', 
    title: 'Swimming Club',
    level: 'Intermediate Training',
    instructor: 'Mike Chen',
    nextSession: 'Friday 4:00 PM',
    progress: 30,
    sessionsCompleted: 6,
    totalSessions: 20,
    status: 'active' as const,
    enrollment_date: '2024-02-01',
    program_id: 'swimming-1',
  },
];

const sampleMetrics = [
  {
    id: 'active_courses',
    title: 'Active Courses',
    value: 2,
    change: 1,
    changeType: 'increase' as const,
    icon: 'book-outline',
  },
  {
    id: 'sessions_completed',
    title: 'Sessions Completed',
    value: 19,
    change: 3,
    changeType: 'increase' as const,
    icon: 'checkmark-circle-outline',
  },
  {
    id: 'avg_progress',
    title: 'Average Progress',
    value: '48%',
    change: 5.2,
    changeType: 'increase' as const,
    icon: 'trending-up-outline',
  },
  {
    id: 'next_session',
    title: 'Next Session',
    value: 'Tomorrow',
    icon: 'time-outline',
  },
];

const sampleActivities = [
  {
    id: '1',
    type: 'session_completed' as const,
    course_name: 'Learn to Swim',
    message: 'completed Level 2 practice session',
    timestamp: '2 hours ago',
    priority: 'low' as const,
  },
  {
    id: '2',
    type: 'achievement' as const,
    course_name: 'Swimming Club',
    message: 'earned "10 Laps Champion" badge',
    timestamp: '1 day ago',
    priority: 'medium' as const,
  },
  {
    id: '3',
    type: 'booking_confirmed' as const,
    course_name: 'Learn to Swim',
    message: 'session booked for tomorrow',
    timestamp: '2 days ago',
    priority: 'low' as const,
  },
];

/**
 * Student Home Screen - Dashboard Overview
 * 
 * Features:
 * - Enhanced header with student actions
 * - Comprehensive dashboard with metrics
 * - Course progress tracking
 * - Recent activity feed
 * - Quick actions for students
 */
const useScreenStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
}));

export const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const { currentProgram } = useProgramContext();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const styles = useScreenStyles();
  const [notificationCount, setNotificationCount] = useState(3);

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

  const handleCoursePress = (course: any) => {
    console.log('Course pressed:', course.title);
  };

  const handleMetricPress = (metric: any) => {
    console.log('Metric pressed:', metric.title);
  };

  const handleViewAllCourses = () => {
    console.log('View all courses');
  };

  const handleViewAllActivities = () => {
    console.log('View all activities');
  };

  // Filter courses based on current program
  const filteredCourses = currentProgram 
    ? sampleCourses.filter(course => course.program_id === currentProgram.id)
    : sampleCourses;

  // Filter activities based on filtered courses
  const filteredActivities = currentProgram
    ? sampleActivities.filter(activity => 
        filteredCourses.some(course => 
          course.title === activity.student_name || activity.message.includes(course.title)
        )
      )
    : sampleActivities;

  return (
    <View style={styles.container}>
      {/* Enhanced Header with Integrated Program Switcher */}
      <Header
        title="Student Dashboard"
        showProgramSwitcher={true}
        showNotifications={true}
        onNotificationPress={handleNotifications}
        notificationCount={notificationCount}
        style={{ paddingTop: insets.top }}
      />

      {/* Student Dashboard - Using InstructorDashboard as base */}
      <InstructorDashboard
        metrics={sampleMetrics}
        recentStudents={filteredCourses.map(course => ({
          id: course.id,
          name: course.title,
          level: course.level,
          instructor: course.instructor,
          progress: course.progress,
          status: course.status,
          nextSession: course.nextSession,
          enrollment_date: course.enrollment_date,
        }))}
        recentActivities={filteredActivities}
        onMetricPress={handleMetricPress}
        onStudentPress={(student) => handleCoursePress(student)}
      />
    </View>
  );
};

