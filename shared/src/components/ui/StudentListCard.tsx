import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageSourcePropType,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { useScreenDimensions } from '../../hooks';

export interface StudentData {
  id: string;
  name: string;
  level: string;
  className?: string;
  progress: number;
  avatar?: ImageSourcePropType | string;
  
  // Statistics
  attended: number;
  absence: number;
  sessions: number;
  
  // Status tags
  tags: StudentTag[];
  
  // Optional additional data
  email?: string;
  phone?: string;
  parentName?: string;
  enrollmentDate?: string;
}

export interface StudentTag {
  id: string;
  label: string;
  color: string;
  textColor?: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

export interface StudentListCardProps {
  students: StudentData[];
  onStudentPress?: (student: StudentData) => void;
  onStudentLongPress?: (student: StudentData) => void;
  
  // Display options
  showProgress?: boolean;
  showStatistics?: boolean;
  showTags?: boolean;
  showAvatar?: boolean;
  
  // Layout options
  variant?: 'compact' | 'detailed' | 'minimal';
  spacing?: number;
  
  // Empty state
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: keyof typeof Ionicons.glyphMap;
  
  // Styling
  containerStyle?: any;
}

const StudentListCard: React.FC<StudentListCardProps> = ({
  students,
  onStudentPress,
  onStudentLongPress,
  showProgress = true,
  showStatistics = true,
  showTags = true,
  showAvatar = true,
  variant = 'detailed',
  spacing = 16,
  emptyTitle = 'No Students Found',
  emptyDescription = 'There are no students to display at this time.',
  emptyIcon = 'school',
  containerStyle,
}) => {
  const { theme } = useTheme();
  const { isTablet } = useScreenDimensions();
  const styles = createStyles(theme, isTablet, spacing);

  const getTagColor = (tag: StudentTag) => {
    if (tag.color) return tag.color;
    
    switch (tag.variant) {
      case 'success':
        return theme.colors.status.success;
      case 'warning':
        return theme.colors.status.warning;
      case 'error':
        return theme.colors.status.error;
      case 'info':
        return theme.colors.interactive.primary;
      default:
        return theme.colors.background.tertiary;
    }
  };

  const getTagTextColor = (tag: StudentTag) => {
    if (tag.textColor) return tag.textColor;
    
    switch (tag.variant) {
      case 'success':
      case 'error':
      case 'info':
        return theme.colors.text.inverse;
      case 'warning':
        return theme.colors.text.primary;
      default:
        return theme.colors.text.secondary;
    }
  };

  const renderAvatar = (student: StudentData) => {
    if (!showAvatar) return null;

    return (
      <View style={styles.avatarContainer}>
        {student.avatar ? (
          <Image
            source={typeof student.avatar === 'string' ? { uri: student.avatar } : student.avatar}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={24} color={theme.colors.text.tertiary} />
          </View>
        )}
      </View>
    );
  };

  const renderProgress = (student: StudentData) => {
    if (!showProgress) return null;

    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[
            styles.progressFill,
            { width: `${Math.min(student.progress, 100)}%` }
          ]} />
        </View>
        <Text style={styles.progressText}>{student.progress}%</Text>
      </View>
    );
  };

  const renderStatistics = (student: StudentData) => {
    if (!showStatistics || variant === 'minimal') return null;

    return (
      <View style={styles.statisticsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Attended:</Text>
          <Text style={styles.statValue}>{student.attended}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Absence:</Text>
          <Text style={styles.statValue}>{student.absence}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Sessions:</Text>
          <Text style={styles.statValue}>{student.sessions}</Text>
        </View>
      </View>
    );
  };

  const renderTags = (student: StudentData) => {
    if (!showTags || !student.tags.length) return null;

    return (
      <View style={styles.tagsContainer}>
        {student.tags.map((tag) => (
          <View
            key={tag.id}
            style={[
              styles.tag,
              { backgroundColor: getTagColor(tag) }
            ]}
          >
            <Text style={[
              styles.tagText,
              { color: getTagTextColor(tag) }
            ]}>
              {tag.label}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderStudent = (student: StudentData) => (
    <TouchableOpacity
      key={student.id}
      style={[
        styles.studentCard,
        variant === 'compact' && styles.studentCardCompact,
        variant === 'minimal' && styles.studentCardMinimal,
      ]}
      onPress={() => onStudentPress?.(student)}
      onLongPress={() => onStudentLongPress?.(student)}
      accessibilityRole="button"
      accessibilityLabel={`Student ${student.name}`}
    >
      <View style={styles.studentContent}>
        {renderAvatar(student)}
        
        <View style={styles.studentInfo}>
          <View style={styles.studentHeader}>
            <Text style={styles.studentName} numberOfLines={1}>
              {student.name}
            </Text>
            <Text style={styles.studentLevel} numberOfLines={1}>
              {student.level}{student.className ? `: ${student.className}` : ''}
            </Text>
          </View>

          {renderProgress(student)}
          {renderStatistics(student)}
          {renderTags(student)}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons 
        name={emptyIcon} 
        size={64} 
        color={theme.colors.text.tertiary} 
        style={styles.emptyIcon}
      />
      <Text style={styles.emptyTitle}>{emptyTitle}</Text>
      <Text style={styles.emptyDescription}>{emptyDescription}</Text>
    </View>
  );

  if (students.length === 0) {
    return renderEmptyState();
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {students.map(renderStudent)}
    </View>
  );
};

const createStyles = (theme: any, isTablet: boolean, spacing: number) => StyleSheet.create({
  container: {
    flex: 1,
  },
  studentCard: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.lg,
    marginHorizontal: theme.spacing.lg,
    marginBottom: spacing,
    shadowColor: theme.colors.shadow.default,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  studentCardCompact: {
    marginHorizontal: theme.spacing.md,
    marginBottom: spacing * 0.75,
  },
  studentCardMinimal: {
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
    marginHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
    borderRadius: 0,
  },
  studentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  avatarContainer: {
    marginRight: theme.spacing.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.background.secondary,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  studentInfo: {
    flex: 1,
  },
  studentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  studentName: {
    fontSize: theme.fontSizes.body,
    fontWeight: theme.fontConfig.fontWeight.semibold,
    color: theme.colors.text.primary,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  studentLevel: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text.secondary,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: 3,
    marginRight: theme.spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.status.success,
    borderRadius: 3,
  },
  progressText: {
    fontSize: theme.fontSizes.small,
    fontWeight: theme.fontConfig.fontWeight.medium,
    color: theme.colors.text.primary,
    minWidth: 35,
  },
  statisticsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: theme.fontSizes.caption,
    color: theme.colors.text.secondary,
    marginRight: theme.spacing.xs,
  },
  statValue: {
    fontSize: theme.fontSizes.caption,
    fontWeight: theme.fontConfig.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  tagsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  tag: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    alignSelf: 'flex-start',
  },
  tagText: {
    fontSize: theme.fontSizes.caption,
    fontWeight: theme.fontConfig.fontWeight.medium,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xxl,
  },
  emptyIcon: {
    marginBottom: theme.spacing.lg,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: theme.fontSizes.h4,
    fontWeight: theme.fontConfig.fontWeight.semibold,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  emptyDescription: {
    fontSize: theme.fontSizes.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.body,
  },
});

export default StudentListCard;