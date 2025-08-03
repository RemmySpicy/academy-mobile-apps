import type { ScreenProps } from '@/shared/navigation/types';

// Student Core Types
export interface Student {
  id: string;
  userId: string;
  programId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  profileType: 'student';
  isActive: boolean;
  
  // Relationships
  enrollments: StudentEnrollment[];
  parentRelationships: ParentRelationship[];
  
  // Computed fields
  age: number;
  fullName: string;
  currentLevel?: string;
  overallProgress: number;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface StudentEnrollment {
  id: string;
  studentId: string;
  courseId: string;
  facilityId: string;
  status: 'active' | 'completed' | 'cancelled' | 'pending' | 'suspended';
  enrollmentDate: string;
  completionDate?: string;
  progressPercentage: number;
  
  // Course info
  course: {
    id: string;
    name: string;
    description?: string;
    totalSessions: number;
    ageGroup: string;
  };
  
  // Facility info
  facility: {
    id: string;
    name: string;
    address: string;
  };
  
  // Progress tracking
  currentLevel?: number;
  currentModule?: number;
  sessionsCompleted: number;
  totalSessions: number;
}

export interface ParentRelationship {
  id: string;
  parentId: string;
  studentId: string;
  relationshipType: 'parent' | 'guardian' | 'emergency_contact';
  
  parent: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
}

// Student Progress Types
export interface StudentProgress {
  studentId: string;
  overallProgress: number;
  
  enrollments: Array<{
    enrollmentId: string;
    courseName: string;
    progressPercentage: number;
    currentLevel?: number;
    currentModule?: number;
    sessionsCompleted: number;
    totalSessions: number;
    recentActivity: ProgressActivity[];
  }>;
  
  milestones: StudentMilestone[];
  attendanceRate: number;
  performanceMetrics: PerformanceMetric[];
}

export interface ProgressActivity {
  id: string;
  type: 'session_completed' | 'level_up' | 'milestone_achieved' | 'assessment_passed';
  title: string;
  description: string;
  date: string;
  metadata?: Record<string, any>;
}

export interface StudentMilestone {
  id: string;
  title: string;
  description: string;
  achievedDate: string;
  category: 'skill' | 'attendance' | 'behavior' | 'academic';
  iconName: string;
}

export interface PerformanceMetric {
  category: string;
  label: string;
  value: number;
  maxValue: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

// Filter Types
export interface StudentFilters {
  search?: string;
  status?: 'all' | 'active' | 'inactive' | 'pending';
  courseId?: string;
  facilityId?: string;
  ageGroup?: string;
  gender?: 'male' | 'female' | 'other';
  enrollmentStatus?: 'active' | 'completed' | 'cancelled' | 'pending' | 'suspended';
  sortBy?: 'name' | 'enrollmentDate' | 'progress' | 'lastActivity';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Navigation Types
export type StudentsStackParamList = {
  StudentsList: undefined;
  StudentDetail: { studentId: string };
  StudentProgress: { studentId: string };
  AddStudent: undefined;
  EditStudent: { studentId: string };
};

export type StudentNavigationProps<T extends keyof StudentsStackParamList> = ScreenProps<
  StudentsStackParamList,
  T
>;

// API Response Types
export interface StudentsListResponse {
  students: Student[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface StudentDetailResponse {
  student: Student;
  recentActivity: ProgressActivity[];
  upcomingClasses: UpcomingClass[];
}

export interface UpcomingClass {
  id: string;
  courseName: string;
  sessionTitle: string;
  date: string;
  time: string;
  facilityName: string;
  instructorName: string;
}

// Form Types
export interface AddStudentFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  parentEmail?: string;
  parentFirstName?: string;
  parentLastName?: string;
  parentPhone?: string;
  relationshipType?: 'parent' | 'guardian' | 'emergency_contact';
}

export interface EditStudentFormData extends Partial<AddStudentFormData> {
  id: string;
  isActive?: boolean;
}

// Component Props Types
export interface StudentCardProps {
  student: Student;
  onPress: (student: Student) => void;
  onLongPress?: (student: Student) => void;
  showProgress?: boolean;
  compact?: boolean;
}

export interface StudentListProps {
  students: Student[];
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  onStudentPress: (student: Student) => void;
  onEndReached?: () => void;
  ListEmptyComponent?: React.ComponentType;
}

export interface StudentFiltersProps {
  filters: StudentFilters;
  onFiltersChange: (filters: StudentFilters) => void;
  availableCourses: Array<{ id: string; name: string }>;
  availableFacilities: Array<{ id: string; name: string }>;
}