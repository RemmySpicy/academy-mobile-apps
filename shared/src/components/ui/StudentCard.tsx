import React, { useState } from 'react';
import { View, Text, Pressable, Image, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, createThemedStyles } from '../../theme/ThemeProvider';
import { useProgramContext } from '../../hooks/useProgramContext';

// Student performance levels for quick visual identification
type PerformanceLevel =
  | 'excellent'
  | 'good'
  | 'average'
  | 'needs-attention'
  | 'critical';

// Attendance status for quick reference
type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

// Student data interface (instructor-enhanced)
interface StudentData {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  avatar_url?: string;

  // Program-specific data
  program_id: string;
  enrollment_date: string;
  level?: string;
  group?: string;

  // Performance metrics (instructor view)
  performance_level?: PerformanceLevel;
  current_attendance_rate?: number;
  today_attendance?: AttendanceStatus;
  last_lesson_score?: number;
  total_lessons?: number;
  completed_lessons?: number;

  // Quick stats for instructors
  upcoming_assessments?: number;
  overdue_assignments?: number;
  parent_contact_required?: boolean;
  special_notes?: string;

  // Emergency contact (instructor access)
  emergency_contact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

interface StudentCardProps {
  student: StudentData;
  variant?: 'compact' | 'detailed' | 'dashboard';

  // Instructor actions
  onPress?: (student: StudentData) => void;
  onAttendancePress?: (student: StudentData) => void;
  onPerformancePress?: (student: StudentData) => void;
  onContactParentPress?: (student: StudentData) => void;
  onMoreOptionsPress?: (student: StudentData) => void;

  // Display options
  showAttendance?: boolean;
  showPerformance?: boolean;
  showProgress?: boolean;
  showQuickActions?: boolean;
  showAlerts?: boolean;

  // Instructor-specific features
  enableQuickAttendance?: boolean;
  enableQuickGrading?: boolean;
  showInstructorNotes?: boolean;

  // Styling
  style?: ViewStyle;

  // Accessibility
  testID?: string;
}

const StudentCard: React.FC<StudentCardProps> = ({
  student,
  variant = 'detailed',
  onPress,
  onAttendancePress,
  onPerformancePress,
  onContactParentPress,
  onMoreOptionsPress,
  showAttendance = true,
  showPerformance = true,
  showProgress = true,
  showQuickActions = true,
  showAlerts = true,
  enableQuickAttendance = false,
  enableQuickGrading = false,
  showInstructorNotes = false,
  style,
  testID,
}) => {
  const { theme } = useTheme();
  const { currentProgram } = useProgramContext();
  const [showDetails, setShowDetails] = useState(variant === 'detailed');
  const styles = useThemedStyles();

  // Helper functions
  const getPerformanceColor = (level: PerformanceLevel) => {
    switch (level) {
      case 'excellent':
        return theme.colors.status.success;
      case 'good':
        return theme.colors.interactive.primary;
      case 'average':
        return theme.colors.academy.faded[600];
      case 'needs-attention':
        return theme.colors.status.warning;
      case 'critical':
        return theme.colors.status.error;
      default:
        return theme.colors.text.tertiary;
    }
  };

  const getAttendanceColor = (status: AttendanceStatus) => {
    switch (status) {
      case 'present':
        return theme.colors.status.success;
      case 'late':
        return theme.colors.status.warning;
      case 'absent':
        return theme.colors.status.error;
      case 'excused':
        return theme.colors.interactive.primary;
      default:
        return theme.colors.text.tertiary;
    }
  };

  const getProgressPercentage = () => {
    if (!student.total_lessons || !student.completed_lessons) return 0;
    return Math.round(
      (student.completed_lessons / student.total_lessons) * 100
    );
  };

  const renderStudentAvatar = () => (
    <View style={styles.avatarContainer}>
      {student.avatar_url ? (
        <Image
          source={{ uri: student.avatar_url }}
          style={styles.avatar}
        />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Ionicons
            name="person-outline"
            size={20}
            color={theme.colors.text.tertiary}
          />
        </View>
      )}

      {/* Performance indicator */}
      {student.performance_level && showPerformance && (
        <View
          style={[
            styles.performanceIndicator,
            { backgroundColor: getPerformanceColor(student.performance_level) },
          ]}
        />
      )}

      {/* Attendance status */}
      {student.today_attendance && showAttendance && (
        <View
          style={[
            styles.attendanceIndicator,
            { backgroundColor: getAttendanceColor(student.today_attendance) },
          ]}
        />
      )}
    </View>
  );

  const renderStudentInfo = () => (
    <View style={styles.studentInfo}>
      <Text style={styles.studentName} numberOfLines={1}>
        {student.first_name} {student.last_name}
      </Text>

      {student.level && (
        <Text style={styles.studentLevel} numberOfLines={1}>
          Level {student.level} {student.group && `• Group ${student.group}`}
        </Text>
      )}

      {showProgress && student.total_lessons && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${getProgressPercentage()}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {student.completed_lessons}/{student.total_lessons} lessons
          </Text>
        </View>
      )}
    </View>
  );

  const renderAlerts = () => {
    if (!showAlerts) return null;

    const alerts = [];

    if (student.parent_contact_required) {
      alerts.push({
        type: 'contact',
        icon: 'ri:phone-line',
        text: 'Contact parent',
      });
    }

    if (student.overdue_assignments && student.overdue_assignments > 0) {
      alerts.push({
        type: 'assignment',
        icon: 'ri:file-warning-line',
        text: `${student.overdue_assignments} overdue`,
      });
    }

    if (student.upcoming_assessments && student.upcoming_assessments > 0) {
      alerts.push({
        type: 'assessment',
        icon: 'calendar-outline',
        text: `${student.upcoming_assessments} upcoming`,
      });
    }

    if (alerts.length === 0) return null;

    return (
      <View style={styles.alertsContainer}>
        {alerts.map((alert, index) => (
          <View key={index} style={styles.alertChip}>
            <Ionicons
              name={alert.icon}
              size={12}
              color={theme.colors.status.warning}
            />
            <Text style={styles.alertText}>{alert.text}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderQuickActions = () => {
    if (!showQuickActions) return null;

    return (
      <View style={styles.quickActions}>
        {enableQuickAttendance && onAttendancePress && (
          <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} 
            onPress={() => onAttendancePress(student)}
            style={styles.quickActionButton}
            accessibilityRole='button'
            accessibilityLabel='Mark attendance'
          >
            <Ionicons
              name='calendar-outline'
              size={16}
              color={theme.colors.interactive.primary}
            />
          </Pressable>
        )}

        {enableQuickGrading && onPerformancePress && (
          <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} 
            onPress={() => onPerformancePress(student)}
            style={styles.quickActionButton}
            accessibilityRole='button'
            accessibilityLabel='Grade performance'
          >
            <Ionicons
              name='star-outline'
              size={16}
              color={theme.colors.interactive.primary}
            />
          </Pressable>
        )}

        {onContactParentPress && (
          <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} 
            onPress={() => onContactParentPress(student)}
            style={styles.quickActionButton}
            accessibilityRole='button'
            accessibilityLabel='Contact parent'
          >
            <Ionicons
              name='people-outline'
              size={16}
              color={theme.colors.interactive.primary}
            />
          </Pressable>
        )}

        {onMoreOptionsPress && (
          <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} 
            onPress={() => onMoreOptionsPress(student)}
            style={styles.quickActionButton}
            accessibilityRole='button'
            accessibilityLabel='More options'
          >
            <Ionicons
              name='ellipsis-horizontal-outline'
              size={16}
              color={theme.colors.text.secondary}
            />
          </Pressable>
        )}
      </View>
    );
  };

  const renderDetailedStats = () => {
    if (variant === 'compact' || !showDetails) return null;

    return (
      <View style={styles.detailedStats}>
        {student.current_attendance_rate !== undefined && (
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Attendance</Text>
            <Text
              style={[
                styles.statValue,
                {
                  color:
                    student.current_attendance_rate >= 90
                      ? theme.colors.status.success
                      : student.current_attendance_rate >= 75
                        ? theme.colors.status.warning
                        : theme.colors.status.error,
                },
              ]}
            >
              {student.current_attendance_rate}%
            </Text>
          </View>
        )}

        {student.last_lesson_score !== undefined && (
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Last Score</Text>
            <Text
              style={[
                styles.statValue,
                {
                  color: getPerformanceColor(
                    student.performance_level || 'average'
                  ),
                },
              ]}
            >
              {student.last_lesson_score}%
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <Pressable 
      style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }, [styles.card, style]]}
      onPress={() => onPress?.(student)}
      accessibilityRole='button'
      accessibilityLabel={`Student card for ${student.first_name} ${student.last_name}`}
      testID={testID}
    >
      <View style={styles.cardHeader}>
        {renderStudentAvatar()}
        {renderStudentInfo()}
        {renderQuickActions()}
      </View>

      {renderAlerts()}
      {renderDetailedStats()}

      {showInstructorNotes && student.special_notes && (
        <View style={styles.notesContainer}>
          <Ionicons
            name='document-text-outline'
            size={14}
            color={theme.colors.interactive.primary}
          />
          <Text style={styles.notesText} numberOfLines={2}>
            {student.special_notes}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

const useThemedStyles = createThemedStyles(theme =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.background.elevated,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[4],
      marginBottom: theme.spacing[3],
      ...theme.elevation.sm,
      borderWidth: theme.borderWidth.sm,
      borderColor: theme.colors.border.primary,
    },

    cardHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: theme.spacing[2],
    },

    avatarContainer: {
      position: 'relative',
      marginRight: theme.spacing[3],
    },

    avatar: {
      width: theme.spacing[12],
      height: theme.spacing[12],
      borderRadius: theme.spacing[6],
      backgroundColor: theme.colors.background.secondary,
    },

    avatarPlaceholder: {
      width: theme.spacing[12],
      height: theme.spacing[12],
      borderRadius: theme.spacing[6],
      backgroundColor: theme.colors.background.secondary,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: theme.borderWidth.sm,
      borderColor: theme.colors.border.primary,
    },

    performanceIndicator: {
      position: 'absolute',
      top: -theme.spacing[0.5],
      right: -theme.spacing[0.5],
      width: theme.spacing[4],
      height: theme.spacing[4],
      borderRadius: theme.spacing[2],
      borderWidth: theme.borderWidth.md,
      borderColor: theme.colors.background.elevated,
    },

    attendanceIndicator: {
      position: 'absolute',
      bottom: -theme.spacing[0.5],
      right: -theme.spacing[0.5],
      width: theme.spacing[4],
      height: theme.spacing[4],
      borderRadius: theme.spacing[2],
      borderWidth: theme.borderWidth.md,
      borderColor: theme.colors.background.elevated,
    },

    studentInfo: {
      flex: 1,
      justifyContent: 'flex-start',
    },

    studentName: {
      ...theme.typography.heading.h5,
      color: theme.colors.text.primary,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      marginBottom: theme.spacing[1],
    },

    studentLevel: {
      ...theme.typography.caption.base,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing[2],
    },

    progressContainer: {
      marginTop: theme.spacing[1],
    },

    progressBar: {
      height: 4,
      backgroundColor: theme.colors.background.secondary,
      borderRadius: 2,
      overflow: 'hidden',
      marginBottom: theme.spacing[1],
    },

    progressFill: {
      height: '100%',
      backgroundColor: theme.colors.interactive.primary,
      borderRadius: 2,
    },

    progressText: {
      ...theme.typography.caption.small,
      color: theme.colors.text.tertiary,
    },

    quickActions: {
      flexDirection: 'row',
      gap: theme.spacing[1],
    },

    quickActionButton: {
      padding: theme.spacing[2],
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.background.secondary,
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 32,
      minHeight: 32,
    },

    alertsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing[1],
      marginBottom: theme.spacing[2],
    },

    alertChip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.status.warning + '20',
      paddingHorizontal: theme.spacing[2],
      paddingVertical: theme.spacing[1],
      borderRadius: theme.borderRadius.sm,
      gap: theme.spacing[1],
    },

    alertText: {
      ...theme.typography.caption.small,
      color: theme.colors.status.warning,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },

    detailedStats: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingTop: theme.spacing[2],
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.primary,
      marginTop: theme.spacing[2],
    },

    statItem: {
      alignItems: 'center',
    },

    statLabel: {
      ...theme.typography.caption.small,
      color: theme.colors.text.tertiary,
      marginBottom: theme.spacing[1],
    },

    statValue: {
      ...theme.typography.body.base,
      fontWeight: theme.fontConfig.fontWeight.semibold,
    },

    notesContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: theme.colors.academy.faded[100],
      padding: theme.spacing[2],
      borderRadius: theme.borderRadius.sm,
      marginTop: theme.spacing[2],
      gap: theme.spacing[2],
    },

    notesText: {
      ...theme.typography.caption.base,
      color: theme.colors.text.secondary,
      flex: 1,
      fontStyle: 'italic',
    },
  })
);

export default StudentCard;
