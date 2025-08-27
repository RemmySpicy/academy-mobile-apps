import React, { useState, useMemo } from 'react';
import { View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Header, StudentCard, useTheme, createThemedStyles, FadeInWrapper, Chip, SearchInput } from '@academy/mobile-shared';

// Enhanced student data structure to match our StudentCard component
interface StudentData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  program_id: string;
  enrollment_date: string;
  level: string;
  group?: string;
  performance_level: 'excellent' | 'good' | 'average' | 'needs-attention' | 'critical';
  current_attendance_rate: number;
  today_attendance?: 'present' | 'absent' | 'late' | 'excused';
  last_lesson_score?: number;
  total_lessons: number;
  completed_lessons: number;
  upcoming_assessments?: number;
  overdue_assignments?: number;
  parent_contact_required?: boolean;
  special_notes?: string;
}

/**
 * Students Screen - Enhanced Student Management
 * 
 * Features:
 * - Enhanced StudentCard components with performance indicators
 * - Student list with search and filtering
 * - Quick actions for instructors (attendance, grading, parent contact)
 * - Progress overview and alerts
 * - Academy themed interface
 */
export const StudentsScreen: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'excellent' | 'good' | 'needs-attention'>('all');
  const [notificationCount, setNotificationCount] = useState(5);
  
  const styles = useThemedStyles();

  // Enhanced sample data matching our StudentCard interface
  const [students] = useState<StudentData[]>([
    {
      id: '1',
      first_name: 'Emma',
      last_name: 'Johnson',
      email: 'emma.johnson@example.com',
      program_id: 'swimming-1',
      enrollment_date: '2024-01-15',
      level: 'Level 2',
      group: 'Group A',
      performance_level: 'good',
      current_attendance_rate: 92,
      today_attendance: 'present',
      last_lesson_score: 85,
      total_lessons: 20,
      completed_lessons: 15,
      upcoming_assessments: 1,
      overdue_assignments: 0,
      parent_contact_required: false,
      special_notes: 'Shows great improvement in backstroke technique',
    },
    {
      id: '2',
      first_name: 'Michael',
      last_name: 'Chen',
      email: 'michael.chen@example.com',
      program_id: 'swimming-1',
      enrollment_date: '2024-02-01',
      level: 'Level 3',
      group: 'Group B',
      performance_level: 'excellent',
      current_attendance_rate: 98,
      today_attendance: 'present',
      last_lesson_score: 94,
      total_lessons: 25,
      completed_lessons: 22,
      upcoming_assessments: 0,
      overdue_assignments: 0,
      parent_contact_required: false,
    },
    {
      id: '3',
      first_name: 'Sarah',
      last_name: 'Williams',
      email: 'sarah.williams@example.com',
      program_id: 'swimming-1',
      enrollment_date: '2024-01-20',
      level: 'Level 1',
      group: 'Group A',
      performance_level: 'needs-attention',
      current_attendance_rate: 78,
      today_attendance: 'absent',
      last_lesson_score: 68,
      total_lessons: 20,
      completed_lessons: 12,
      upcoming_assessments: 2,
      overdue_assignments: 1,
      parent_contact_required: true,
      special_notes: 'Struggling with floating techniques',
    },
    {
      id: '4',
      first_name: 'David',
      last_name: 'Brown',
      email: 'david.brown@example.com',
      program_id: 'swimming-1',
      enrollment_date: '2024-01-10',
      level: 'Level 2',
      group: 'Group B',
      performance_level: 'average',
      current_attendance_rate: 88,
      today_attendance: 'present',
      last_lesson_score: 76,
      total_lessons: 18,
      completed_lessons: 14,
      upcoming_assessments: 1,
      overdue_assignments: 0,
      parent_contact_required: false,
    },
    {
      id: '5',
      first_name: 'Lisa',
      last_name: 'Davis',
      email: 'lisa.davis@example.com',
      program_id: 'swimming-1',
      enrollment_date: '2024-02-15',
      level: 'Level 1',
      group: 'Group A',
      performance_level: 'good',
      current_attendance_rate: 95,
      today_attendance: 'present',
      last_lesson_score: 88,
      total_lessons: 15,
      completed_lessons: 10,
      upcoming_assessments: 0,
      overdue_assignments: 0,
      parent_contact_required: false,
    },
  ]);

  const filteredStudents = students.filter(student => {
    const fullName = `${student.first_name} ${student.last_name}`;
    const matchesSearch = fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.level.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (student.group && student.group.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = selectedFilter === 'all' || student.performance_level === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const filters = [
    { value: 'all', label: 'All Students', count: students.length, icon: 'people' as const },
    { value: 'excellent', label: 'Excellent', count: students.filter(s => s.performance_level === 'excellent').length, icon: 'star' as const },
    { value: 'good', label: 'Good', count: students.filter(s => s.performance_level === 'good').length, icon: 'thumbs-up' as const },
    { value: 'needs-attention', label: 'Needs Attention', count: students.filter(s => s.performance_level === 'needs-attention').length, icon: 'alert-circle' as const },
  ];

  const handleStudentPress = (student: StudentData) => {
    console.log('Navigate to student detail:', student.first_name, student.last_name);
  };

  const handleAttendancePress = (student: StudentData) => {
    console.log('Mark attendance for:', student.first_name, student.last_name);
  };

  const handlePerformancePress = (student: StudentData) => {
    console.log('Grade performance for:', student.first_name, student.last_name);
  };

  const handleContactParentPress = (student: StudentData) => {
    console.log('Contact parent for:', student.first_name, student.last_name);
  };

  const handleMoreOptionsPress = (student: StudentData) => {
    console.log('More options for:', student.first_name, student.last_name);
  };

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
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      {/* Enhanced Header */}
      <Header
        title="Students"
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

      {/* Search Bar */}
      <FadeInWrapper
        delay={200}
        springify={true}
        style={[styles.searchContainer, { backgroundColor: theme.colors.background.primary }]}
      >
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search students..."
          size="md"
          testID="students-search"
        />
      </FadeInWrapper>

      {/* Filter Tabs */}
      <FadeInWrapper
        delay={300}
        springify={true}
        style={styles.filterContainer}
      >
        <Chip
          chips={filters}
          activeChips={selectedFilter}
          onChipChange={(value) => setSelectedFilter(Array.isArray(value) ? value[0] : value)}
          multiSelect={false}
          variant="primary"
          countStyle="inline"
          size="md"
          showIcons={true}
          showCounts={true}
          scrollable={true}
          style={{ paddingHorizontal: theme.spacing.md }}
        />
      </FadeInWrapper>

      {/* Students List */}
      <FlatList
        data={filteredStudents}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <StudentCard
            student={item}
            onPress={handleStudentPress}
            onAttendancePress={handleAttendancePress}
            onPerformancePress={handlePerformancePress}
            onContactParentPress={handleContactParentPress}
            onMoreOptionsPress={handleMoreOptionsPress}
            showQuickActions={true}
            showAlerts={true}
            showProgress={true}
            enableQuickAttendance={true}
            enableQuickGrading={true}
            variant="detailed"
            testID={`student-card-${item.id}`}
          />
        )}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.md,
          paddingBottom: 100, // Space for tab bar
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <FadeInWrapper
            delay={400}
            springify={true}
            style={styles.emptyContainer}
          >
            <Ionicons 
              name="people-outline" 
              size={64} 
              color={theme.colors.text.tertiary} 
            />
            <Text style={[styles.emptyTitle, { color: theme.colors.text.secondary }]}>
              No students found
            </Text>
            <Text style={[styles.emptyMessage, { color: theme.colors.text.tertiary }]}>
              Try adjusting your search or filter criteria
            </Text>
          </FadeInWrapper>
        )}
      />
    </View>
  );
};

const useThemedStyles = createThemedStyles((theme) => StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  filterContainer: {
    marginBottom: theme.spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl * 2,
  },
  emptyTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontConfig.fontWeight.semibold,
    marginTop: theme.spacing.md,
  },
  emptyMessage: {
    fontSize: theme.typography.body.base.fontSize,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
}));