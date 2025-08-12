import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Header,
  StudentDashboard,
  useTheme,
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
  },
];

const sampleMetrics = [
  {
    id: 'active_courses',
    title: 'Active Courses',
    value: 2,
    change: 1,
    changeType: 'increase' as const,
    icon: 'ri:book-line',
  },
  {
    id: 'sessions_completed',
    title: 'Sessions Completed',
    value: 19,
    change: 3,
    changeType: 'increase' as const,
    icon: 'ri:calendar-check-line',
  },
  {
    id: 'avg_progress',
    title: 'Average Progress',
    value: '48%',
    change: 5.2,
    changeType: 'increase' as const,
    icon: 'ri:line-chart-line',
  },
  {
    id: 'next_session',
    title: 'Next Session',
    value: 'Tomorrow',
    icon: 'ri:time-line',
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
export const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
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

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      {/* Enhanced Header */}
      <Header
        title="Student Dashboard"
        variant="student"
        onSearchPress={handleSearch}
        onFilterPress={handleFilter}
        onNotificationPress={handleNotifications}
        notificationCount={notificationCount}
        showStudentActions={true}
        showNotifications={true}
        showProfile={true}
        style={{ paddingTop: insets.top }}
      />

      {/* Student Dashboard */}
      <StudentDashboard
        metrics={sampleMetrics}
        currentCourses={sampleCourses}
        recentActivities={sampleActivities}
        onMetricPress={handleMetricPress}
        onCoursePress={handleCoursePress}
        onViewAllCourses={handleViewAllCourses}
        onViewAllActivities={handleViewAllActivities}
        showMetrics={true}
        showCourses={true}
        showActivities={true}
        maxCoursesShown={2}
        maxActivitiesShown={3}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});