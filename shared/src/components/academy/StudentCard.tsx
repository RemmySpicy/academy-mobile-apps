import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

export interface StudentInfo {
  id: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  level: string;
  className?: string;
  progress?: number;
  current_attendance_rate?: number;
  attendance?: {
    attended: number;
    absence: number;
    sessions: number;
  };
  // Alternative attendance structure from StudentsScreen
  total_lessons?: number;
  completed_lessons?: number;
  paymentStatus?: 'fully-paid' | 'partial-paid' | 'unpaid' | 'overdue';
  studentType?: 'nursery' | 'preschool' | 'regular';
  tags?: string[];
}

export interface StudentCardProps {
  student: StudentInfo;
  onPress?: (student: StudentInfo) => void;
  variant?: 'default' | 'compact' | 'detailed';
  showProgress?: boolean;
  showAttendance?: boolean;
  showPaymentStatus?: boolean;
  showTags?: boolean;
  showStatusIndicator?: boolean;
}

const StudentCard: React.FC<StudentCardProps> = ({
  student,
  onPress,
  variant = 'default',
  showProgress = true,
  showAttendance = true,
  showPaymentStatus = true,
  showTags = true,
  showStatusIndicator = false,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const getPaymentStatusConfig = (status: string) => {
    switch (status) {
      case 'fully-paid':
        return {
          color: theme.colors.status.success,
          backgroundColor: theme.colors.status.success,
          text: 'Fully Paid',
        };
      case 'partial-paid':
        return {
          color: theme.colors.status.warning,
          backgroundColor: theme.colors.status.warning,
          text: 'Partial',
        };
      case 'unpaid':
        return {
          color: theme.colors.status.error,
          backgroundColor: theme.colors.status.error,
          text: 'Unpaid',
        };
      case 'overdue':
        return {
          color: theme.colors.status.error,
          backgroundColor: theme.colors.status.error,
          text: 'Overdue',
        };
      default:
        return {
          color: theme.colors.text.secondary,
          backgroundColor: theme.colors.text.secondary,
          text: 'Unknown',
        };
    }
  };

  const paymentConfig = getPaymentStatusConfig(student.paymentStatus || 'unpaid');

  const renderProgressBar = () => {
    if (!showProgress) return null;
    
    // Handle progress from different data formats
    const progressValue = student.progress ?? student.current_attendance_rate ?? 0;
    
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { width: `${progressValue}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>{progressValue}%</Text>
      </View>
    );
  };

  const renderAttendanceStats = () => {
    if (!showAttendance) return null;

    // Handle both attendance data formats
    const attendedCount = student.attendance?.attended ?? student.completed_lessons ?? 0;
    const totalSessions = student.attendance?.sessions ?? student.total_lessons ?? 0;
    const absenceCount = student.attendance?.absence ?? (totalSessions - attendedCount);
    
    return (
      <View style={styles.attendanceContainer}>
        <Text style={styles.attendanceText}>
          Attended: {attendedCount}
        </Text>
        <Text style={styles.attendanceText}>
          Absence: {absenceCount}
        </Text>
        <Text style={styles.attendanceText}>
          Sessions: {totalSessions}
        </Text>
      </View>
    );
  };

  const renderTags = () => {
    if (!showTags || !student.tags?.length) return null;

    return (
      <View style={styles.tagsContainer}>
        {student.tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
        
        {showPaymentStatus && (
          <View style={[styles.paymentTag, { backgroundColor: paymentConfig.backgroundColor }]}>
            <Text style={[styles.paymentTagText, { color: theme.colors.background.primary }]}>
              {paymentConfig.text}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.card}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {student.avatar ? (
          <Image source={{ uri: student.avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={24} color={theme.colors.text.tertiary} />
          </View>
        )}
      </View>

      {/* Content */}
      <TouchableOpacity
        style={styles.content}
        onPress={() => onPress?.(student)}
        activeOpacity={0.7}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {student.name || `${student.first_name || ''} ${student.last_name || ''}`.trim() || 'Unknown Student'}
          </Text>
          <Text style={styles.level}>
            {student.level}{student.className ? `: ${student.className}` : ''}
          </Text>
        </View>

        {/* Progress Bar */}
        {renderProgressBar()}

        {/* Attendance Stats */}
        {renderAttendanceStats()}

        {/* Tags and Payment Status */}
        {renderTags()}
      </TouchableOpacity>

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

const createStyles = (theme: any) => StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    overflow: 'hidden',
    shadowColor: theme.colors.shadow?.default || '#000',
    shadowOffset: { width: 0, height: theme.spacing.xs / 2 },
    shadowOpacity: 0.1,
    shadowRadius: theme.elevation?.sm?.shadowRadius || 3.84,
    elevation: theme.elevation?.sm?.elevation || 2,
    borderWidth: theme.borderWidth?.thin || 1,
    borderColor: theme.colors.border.primary,
  },
  avatarContainer: {
    padding: theme.spacing.sm,
  },
  avatar: {
    width: theme.spacing.xl + theme.spacing.sm,
    height: theme.spacing.xl + theme.spacing.sm,
    borderRadius: (theme.spacing.xl + theme.spacing.sm) / 2,
  },
  avatarPlaceholder: {
    width: theme.spacing.xl + theme.spacing.sm,
    height: theme.spacing.xl + theme.spacing.sm,
    borderRadius: (theme.spacing.xl + theme.spacing.sm) / 2,
    backgroundColor: theme.colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingRight: theme.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  name: {
    fontSize: theme.fontSizes.base,
    fontWeight: theme.fontConfig.fontWeight.medium,
    color: theme.colors.text.primary,
    flex: 1,
  },
  level: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text.secondary,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: theme.spacing.sm,
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
    marginRight: theme.spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.status.success,
    borderRadius: theme.borderRadius.sm,
  },
  progressText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text.secondary,
    minWidth: theme.spacing.lg + theme.spacing.sm,
    textAlign: 'right',
  },
  attendanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  attendanceText: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.text.secondary,
  },
  tagsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tag: {
    backgroundColor: theme.colors.text.secondary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  tagText: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.background.primary,
    textAlign: 'center',
  },
  paymentTag: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  paymentTagText: {
    fontSize: theme.fontSizes.xs,
    textAlign: 'center',
    fontWeight: theme.fontConfig.fontWeight.medium,
  },
  statusIndicator: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: theme.spacing.xs,
  },
});

export default StudentCard;