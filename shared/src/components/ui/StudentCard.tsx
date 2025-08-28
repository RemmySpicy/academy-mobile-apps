import React, { useState } from 'react';
import { View, Text, Pressable, Image, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, createThemedStyles, colorUtils } from '../../theme';
import { useProgramContext } from '../program/ProgramContextProvider';

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
  module?: string;
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

  // Academy variant features
  paymentStatus?: 'fully-paid' | 'partial-paid' | 'unpaid' | 'overdue';
  studentType?: 'nursery' | 'preschool' | 'regular';
  sessionType?: 'school-group' | 'private-session' | 'mixed';
  tags?: string[];
  progress?: number; // Alternative progress field for academy variant
  className?: string;
  attendance?: {
    attended: number;
    absence: number;
    sessions: number;
  };

  // Emergency contact (instructor access)
  emergency_contact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

interface StudentCardProps {
  student: StudentData;
  variant?: 'compact' | 'detailed' | 'dashboard' | 'academy';

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

  // Academy variant options
  showPaymentStatus?: boolean;
  showSessionType?: boolean;
  showTags?: boolean;
  showStatusIndicator?: boolean;

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
  showPaymentStatus = false,
  showSessionType = false,
  showTags = false,
  showStatusIndicator = false,
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
        return theme.colors.interactive.faded;
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

  // Helper function to format level display
  const formatLevelDisplay = (level?: string, module?: string) => {
    let display = '';
    
    if (level) {
      display = `Level ${level}`;
      if (module) {
        display += ` Module ${module}`;
      }
    }
    
    return display || 'No Level';
  };

  // Academy variant helper functions
  const getPaymentStatusConfig = (status?: string) => {
    switch (status) {
      case 'fully-paid':
        return {
          color: theme.colors.status.success,
          text: 'Fully Paid',
        };
      case 'partial-paid':
        return {
          color: theme.colors.status.warning,
          text: 'Partial',
        };
      case 'unpaid':
        return {
          color: theme.colors.status.error,
          text: 'Unpaid',
        };
      case 'overdue':
        return {
          color: theme.colors.status.error,
          text: 'Overdue',
        };
      default:
        return {
          color: theme.colors.text.tertiary,
          text: 'Unknown',
        };
    }
  };

  const getSessionTypeConfig = (sessionType?: string) => {
    // All session types use the same color (School Group color)
    const uniformColor = theme.colors.text.secondary;
    
    switch (sessionType) {
      case 'school-group':
        return {
          color: uniformColor,
          text: 'School Group',
        };
      case 'private-session':
        return {
          color: uniformColor,
          text: 'Private Session',
        };
      case 'mixed':
        return {
          color: uniformColor,
          text: 'Mixed Sessions',
        };
      default:
        return {
          color: uniformColor,
          text: 'School Group',
        };
    }
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
          {formatLevelDisplay(student.level, student.module)} {student.group && `• Group ${student.group}`}
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
        icon: 'call-outline',
        text: 'Contact parent',
      });
    }

    if (student.overdue_assignments && student.overdue_assignments > 0) {
      alerts.push({
        type: 'assignment',
        icon: 'warning-outline',
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

    // Create consolidated more options handler that includes all actions
    const handleMoreOptions = () => {
      // For demonstration, we'll log the available actions
      // In a real implementation, this would show a menu/modal with options
      console.log('More options for student:', student.first_name, student.last_name);
      console.log('Available actions:');
      
      if (enableQuickAttendance && onAttendancePress) {
        console.log('- Mark Attendance');
      }
      if (enableQuickGrading && onPerformancePress) {
        console.log('- Grade Performance');  
      }
      if (onContactParentPress) {
        console.log('- Contact Parent/Guardian');
      }
      if (onMoreOptionsPress) {
        console.log('- Additional Options');
      }
      
      // Call the original more options handler if provided
      if (onMoreOptionsPress) {
        onMoreOptionsPress(student);
      }
    };

    return (
      <View style={styles.quickActions}>
        <Pressable 
          onPress={handleMoreOptions}
          style={({ pressed }) => [styles.quickActionButton, { opacity: pressed ? 0.8 : 1 }]}
          accessibilityRole='button'
          accessibilityLabel={`More options for ${student.first_name} ${student.last_name}`}
        >
          <Ionicons
            name='ellipsis-horizontal-outline'
            size={16}
            color={theme.colors.text.secondary}
          />
        </Pressable>
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

  // Academy variant render methods
  const renderAcademyProgressBar = () => {
    if (!showProgress) return null;
    
    // Handle progress from different data formats
    const progressValue = student.progress ?? student.current_attendance_rate ?? 0;
    
    return (
      <View style={styles.academyProgressContainer}>
        <View style={styles.academyProgressBar}>
          <View 
            style={[
              styles.academyProgressFill,
              { width: `${progressValue}%` }
            ]} 
          />
        </View>
        <Text style={styles.academyProgressText}>{progressValue}%</Text>
      </View>
    );
  };

  const renderAcademyAttendanceStats = () => {
    if (!showAttendance) return null;

    // Handle both attendance data formats
    const attendedCount = student.attendance?.attended ?? student.completed_lessons ?? 0;
    const totalSessions = student.attendance?.sessions ?? student.total_lessons ?? 0;
    const absenceCount = student.attendance?.absence ?? (totalSessions - attendedCount);
    
    return (
      <View style={styles.academyAttendanceContainer}>
        <Text style={styles.academyAttendanceText}>
          Attended: {attendedCount}
        </Text>
        <Text style={styles.academyAttendanceText}>
          Absence: {absenceCount}
        </Text>
        <Text style={styles.academyAttendanceText}>
          Sessions: {totalSessions}
        </Text>
      </View>
    );
  };

  const renderAcademyTags = () => {
    const shouldRenderContainer = (showTags && student.tags?.length) || showSessionType || showPaymentStatus;
    if (!shouldRenderContainer) return null;

    const paymentConfig = getPaymentStatusConfig(student.paymentStatus);
    const sessionTypeConfig = getSessionTypeConfig(student.sessionType);

    return (
      <View style={styles.academyTagsContainer}>
        {/* Render custom tags */}
        <View style={styles.customTagsContainer}>
          {showTags && student.tags?.map((tag, index) => (
            <View key={index} style={styles.customTag}>
              <Text style={styles.customTagText}>{tag}</Text>
            </View>
          ))}
        </View>
        
        {/* Render status indicators */}
        <View style={styles.statusTagsContainer}>
          {showSessionType && (
            <View style={[styles.sessionTypeTag, { backgroundColor: sessionTypeConfig.color }]}>
              <Text style={[styles.sessionTypeTagText, { color: theme.colors.text.inverse }]}>
                {sessionTypeConfig.text}
              </Text>
            </View>
          )}
          
          {showPaymentStatus && (
            <View style={[styles.paymentTag, { backgroundColor: paymentConfig.color }]}>
              <Text style={[styles.paymentTagText, { color: theme.colors.text.inverse }]}>
                {paymentConfig.text}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderAcademyCard = () => {
    const paymentConfig = getPaymentStatusConfig(student.paymentStatus);
    
    return (
      <View style={[styles.academyCard, style]}>
        {/* Top Row - Avatar and Content */}
        <View style={styles.academyTopRow}>
          {/* Avatar */}
          <View style={styles.academyAvatarContainer}>
            <View style={styles.academyAvatarPlaceholder}>
              {/* Performance indicator dot */}
              <View
                style={[
                  styles.performanceDot,
                  {
                    backgroundColor: getPerformanceColor(student.performance_level),
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    zIndex: 1,
                  }
                ]}
              />
              <Ionicons name="person-outline" size={20} color={theme.colors.text.tertiary} />
            </View>
          </View>

          {/* Content */}
          <Pressable
            style={styles.academyContent}
            onPress={() => onPress?.(student)}
            accessibilityRole="button"
            accessibilityLabel={`Academy student card for ${student.first_name} ${student.last_name}`}
            testID={testID}
          >
            {/* Header */}
            <View style={styles.academyHeader}>
              <Text style={styles.academyName}>
                {`${student.first_name || ''} ${student.last_name || ''}`.trim() || 'Unknown Student'}
              </Text>
              <Text style={styles.academyLevel}>
                {formatLevelDisplay(student.level, student.module)}
              </Text>
            </View>

            {/* Progress Bar */}
            {renderAcademyProgressBar()}

            {/* Attendance Stats */}
            {renderAcademyAttendanceStats()}
          </Pressable>
        </View>

        {/* Full Width Tags and Payment Status */}
        {renderAcademyTags()}

        {/* Status Indicator */}
        {showStatusIndicator && (
          <View style={[
            styles.statusIndicator,
            { backgroundColor: paymentConfig.color }
          ]} />
        )}
      </View>
    );
  };

  // Return academy variant if specified
  if (variant === 'academy') {
    return renderAcademyCard();
  }

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
      flexDirection: 'column',
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
      flexDirection: 'column',
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
      ...theme.typography.caption.base,
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
      ...theme.typography.caption.base,
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
      ...theme.typography.caption.base,
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
      backgroundColor: theme.colors.background.secondary,
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

    // Academy variant styles
    academyCard: {
      backgroundColor: theme.colors.background.elevated,
      borderRadius: theme.borderRadius.xl,
      flexDirection: 'column',
      marginBottom: theme.spacing[2],
      overflow: 'hidden',
      ...theme.elevation.sm,
      borderWidth: theme.borderWidth.sm,
      borderColor: theme.colors.border.primary,
    },

    academyTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    academyAvatarContainer: {
      padding: theme.spacing[3],
    },

    academyAvatar: {
      width: theme.spacing[12],
      height: theme.spacing[12],
      borderRadius: theme.spacing[6],
    },

    academyAvatarPlaceholder: {
      width: theme.spacing[12],
      height: theme.spacing[12],
      borderRadius: theme.spacing[6],
      backgroundColor: theme.colors.background.secondary,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: theme.borderWidth.sm,
      borderColor: theme.colors.border.primary,
    },

    academyContent: {
      flex: 1,
      paddingVertical: theme.spacing[3],
      paddingRight: theme.spacing[3],
    },

    academyHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing[2],
    },

    academyName: {
      ...theme.typography.body.base,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
      flex: 1,
    },

    academyLevel: {
      ...theme.typography.caption.base,
      color: theme.colors.text.secondary,
    },

    academyProgressContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing[2],
    },

    academyProgressBar: {
      flex: 1,
      height: theme.spacing[2],
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.sm,
      overflow: 'hidden',
      marginRight: theme.spacing[2],
    },

    academyProgressFill: {
      height: '100%',
      backgroundColor: theme.colors.interactive.primary,
      borderRadius: theme.borderRadius.sm,
    },

    academyProgressText: {
      ...theme.typography.caption.base,
      color: theme.colors.text.secondary,
      minWidth: theme.spacing[8],
      textAlign: 'right',
    },

    academyAttendanceContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing[2],
    },

    academyAttendanceText: {
      ...theme.typography.caption.base,
      color: theme.colors.text.secondary,
    },

    academyTagsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing[3],
      paddingBottom: theme.spacing[3],
    },

    customTagsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[1],
      flex: 1,
    },

    statusTagsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[1],
    },

    customTag: {
      backgroundColor: theme.colors.background.secondary,
      paddingHorizontal: theme.spacing[2],
      paddingVertical: theme.spacing[1],
      borderRadius: theme.borderRadius.sm,
      borderWidth: theme.borderWidth.sm,
      borderColor: theme.colors.border.primary,
    },

    customTagText: {
      ...theme.typography.caption.base,
      color: theme.colors.text.primary,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },

    sessionTypeTag: {
      paddingHorizontal: theme.spacing[2],
      paddingVertical: theme.spacing[1],
      borderRadius: theme.borderRadius.sm,
    },

    sessionTypeTagText: {
      ...theme.typography.caption.base,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },

    paymentTag: {
      paddingHorizontal: theme.spacing[2],
      paddingVertical: theme.spacing[1],
      borderRadius: theme.borderRadius.sm,
    },

    paymentTagText: {
      ...theme.typography.caption.base,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },

    statusIndicator: {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: theme.spacing[1],
    },

    performanceDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: theme.colors.background.elevated,
    },
  })
);

// Add displayName for debugging
StudentCard.displayName = 'StudentCard';

export default StudentCard;
