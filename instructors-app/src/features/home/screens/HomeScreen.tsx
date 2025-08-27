import React, { useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Header, InstructorDashboard, useTheme, createThemedStyles, useProgramContext, useAuthStore } from '@academy/mobile-shared';
import type { MainStackParamList } from '../../../navigation/MainNavigator';

// Sample data for testing
const sampleStudents = [
  {
    id: '1',
    first_name: 'Sarah',
    last_name: 'Johnson',
    email: 'sarah.johnson@example.com',
    program_id: 'swimming-1',
    enrollment_date: '2024-01-15',
    level: 'Beginner',
    group: 'Group A',
    performance_level: 'good' as const,
    current_attendance_rate: 92,
    today_attendance: 'present' as const,
    last_lesson_score: 85,
    total_lessons: 20,
    completed_lessons: 15,
    upcoming_assessments: 1,
    overdue_assignments: 0,
    parent_contact_required: false,
  },
  {
    id: '2',
    first_name: 'Mike',
    last_name: 'Chen',
    email: 'mike.chen@example.com',
    program_id: 'swimming-1',
    enrollment_date: '2024-02-01',
    level: 'Intermediate',
    group: 'Group B',
    performance_level: 'excellent' as const,
    current_attendance_rate: 98,
    today_attendance: 'present' as const,
    last_lesson_score: 94,
    total_lessons: 25,
    completed_lessons: 22,
    upcoming_assessments: 0,
    overdue_assignments: 0,
    parent_contact_required: false,
  },
  {
    id: '3',
    first_name: 'Emma',
    last_name: 'Davis',
    email: 'emma.davis@example.com',
    program_id: 'swimming-1',
    enrollment_date: '2024-01-20',
    level: 'Beginner',
    group: 'Group A',
    performance_level: 'needs-attention' as const,
    current_attendance_rate: 78,
    today_attendance: 'absent' as const,
    last_lesson_score: 68,
    total_lessons: 20,
    completed_lessons: 12,
    upcoming_assessments: 2,
    overdue_assignments: 1,
    parent_contact_required: true,
  },
];

const sampleChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      data: [75, 80, 85, 88, 92, 87],
      color: (opacity = 1) => `rgba(79, 46, 201, ${opacity})`,
      strokeWidth: 2,
    },
  ],
};

const sampleMetrics = [
  {
    id: 'total_students',
    title: 'Total Students',
    value: 24,
    change: 3,
    changeType: 'increase' as const,
    icon: 'people-outline',
  },
  {
    id: 'attendance_rate',
    title: 'Attendance Rate',
    value: '94%',
    change: 2.5,
    changeType: 'increase' as const,
    icon: 'checkmark-circle-outline',
  },
  {
    id: 'avg_performance',
    title: 'Avg Performance',
    value: '87%',
    change: -1.2,
    changeType: 'decrease' as const,
    icon: 'bar-chart-outline',
  },
  {
    id: 'pending_tasks',
    title: 'Pending Tasks',
    value: 12,
    icon: 'checkmark-circle-outline',
  },
];

const sampleActivities = [
  {
    id: '1',
    type: 'attendance' as const,
    student_name: 'Sarah Johnson',
    message: 'marked as present in Swimming Level 1',
    timestamp: '2 hours ago',
    priority: 'low' as const,
  },
  {
    id: '2',
    type: 'assignment' as const,
    student_name: 'Mike Chen',
    message: 'completed technique assessment',
    timestamp: '3 hours ago',
    priority: 'medium' as const,
  },
  {
    id: '3',
    type: 'alert' as const,
    student_name: 'Emma Davis',
    message: 'missed class - parent contact required',
    timestamp: '5 hours ago',
    priority: 'high' as const,
  },
];

const useScreenStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
}));

/**
 * Home Screen - Instructor Dashboard
 * 
 * Features:
 * - Enhanced header with instructor actions
 * - Comprehensive dashboard with metrics
 * - Performance charts and analytics
 * - Recent students and activities
 * - Quick actions for instructors
 */
export const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const { currentProgram } = useProgramContext();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const styles = useScreenStyles();
  const navigation = useNavigation<NavigationProp<MainStackParamList>>();
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
    navigation.navigate('Notifications');
  };

  const handleStudentPress = (student: any) => {
    console.log('Student pressed:', student.first_name, student.last_name);
  };

  const handleMetricPress = (metric: any) => {
    console.log('Metric pressed:', metric.title);
  };

  const handleViewAllStudents = () => {
    console.log('View all students');
  };

  const handleViewAllActivities = () => {
    console.log('View all activities');
  };

  // Filter data based on current program
  const filteredStudents = currentProgram 
    ? sampleStudents.filter(student => student.program_id === currentProgram.id)
    : sampleStudents;

  const filteredActivities = currentProgram
    ? sampleActivities.filter(activity => 
        filteredStudents.some(student => 
          `${student.first_name} ${student.last_name}` === activity.student_name
        )
      )
    : sampleActivities;

  return (
    <View style={styles.container}>
      {/* Enhanced Header with Integrated Program Switcher */}
      <Header
        title="Instructor Dashboard"
        showProgramSwitcher={true}
        showNotifications={true}
        onNotificationPress={handleNotifications}
        notificationCount={notificationCount}
        onSearchPress={handleSearch}
        onFilterPress={handleFilter}
        showInstructorActions={true}
        showProfile={false}
        variant="instructor"
        style={{ paddingTop: insets.top }}
      />

      {/* Instructor Dashboard */}
      <InstructorDashboard
        metrics={sampleMetrics}
        chartData={sampleChartData}
        recentStudents={filteredStudents}
        recentActivities={filteredActivities}
        onMetricPress={handleMetricPress}
        onStudentPress={handleStudentPress}
        onViewAllStudents={handleViewAllStudents}
        onViewAllActivities={handleViewAllActivities}
        showChart={true}
        showStudents={true}
        showActivities={true}
        maxStudentsShown={2}
        maxActivitiesShown={3}
      />
    </View>
  );
};

