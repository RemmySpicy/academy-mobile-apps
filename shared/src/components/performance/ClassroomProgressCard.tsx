/**
 * ClassroomProgressCard Component
 * 
 * A comprehensive component for displaying student progress cards with star ratings,
 * expandable sections, and confirmation actions. Features Academy theming and accessibility.
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  Pressable,
  ViewStyle,
  TextStyle,
  ImageSourcePropType 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { ToggleCard } from '../ui/ToggleCard';

export type StarRating = 0 | 1 | 2 | 3 | 4 | 5;
export type ConfirmationStatus = 'pending' | 'confirmed' | 'declined';

export interface StudentProgress {
  id: string;
  name: string;
  avatar?: string | ImageSourcePropType;
  rating: StarRating;
  status: ConfirmationStatus;
  additionalInfo?: string;
  lastActivity?: string;
  achievements?: string[];
}

export interface ProgressSection {
  id: string;
  title: string;
  rating: StarRating;
  students: StudentProgress[];
  count: number;
  expanded?: boolean;
  color?: string;
  description?: string;
}

export interface ClassroomProgressCardProps {
  /** Array of progress sections to display */
  sections: ProgressSection[];
  
  /** Default avatar for students without custom avatar */
  defaultAvatar?: ImageSourcePropType;
  
  /** Section expansion states */
  expandedSections?: Record<string, boolean>;
  
  /** Callbacks */
  onSectionToggle?: (sectionId: string, isExpanded: boolean) => void;
  onStudentPress?: (student: StudentProgress) => void;
  onConfirmationAction?: (studentId: string, action: 'confirm' | 'decline') => void;
  
  /** Display options */
  showConfirmationActions?: boolean;
  showStudentCount?: boolean;
  showStarRatings?: boolean;
  showLastActivity?: boolean;
  
  /** Custom styling */
  containerStyle?: ViewStyle;
  sectionStyle?: ViewStyle;
  studentCardStyle?: ViewStyle;
  
  /** Accessibility */
  accessibilityLabel?: string;
  accessibilityHint?: string;
  
  /** Test ID for testing */
  testID?: string;
}

export const ClassroomProgressCard: React.FC<ClassroomProgressCardProps> = ({
  sections,
  defaultAvatar,
  expandedSections = {},
  onSectionToggle,
  onStudentPress,
  onConfirmationAction,
  showConfirmationActions = true,
  showStudentCount = true,
  showStarRatings = true,
  showLastActivity = false,
  containerStyle,
  sectionStyle,
  studentCardStyle,
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  const { theme, screenDimensions } = useTheme();
  const [localExpandedSections, setLocalExpandedSections] = useState<Record<string, boolean>>({});
  
  const styles = createStyles(theme, screenDimensions);

  // Use local state if no external control provided
  const isExpanded = (sectionId: string) => {
    return expandedSections[sectionId] ?? localExpandedSections[sectionId] ?? false;
  };

  const handleSectionToggle = (sectionId: string, isExpanded: boolean) => {
    if (onSectionToggle) {
      onSectionToggle(sectionId, isExpanded);
    } else {
      setLocalExpandedSections(prev => ({
        ...prev,
        [sectionId]: isExpanded,
      }));
    }
  };

  const handleStudentPress = (student: StudentProgress) => {
    onStudentPress?.(student);
  };

  const handleConfirmationPress = (studentId: string, action: 'confirm' | 'decline') => {
    onConfirmationAction?.(studentId, action);
  };

  const renderStarRating = (rating: StarRating, size: number = 18) => {
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= rating;
      stars.push(
        <Ionicons
          key={i}
          name={isFilled ? "star" : "star-outline"}
          size={size}
          color={isFilled ? theme.colors.status.warning : theme.colors.text.disabled}
          style={styles.starIcon}
        />
      );
    }
    
    return (
      <View 
        style={styles.ratingContainer}
        accessibilityRole="text"
        accessibilityLabel={`${rating} out of 5 stars`}
      >
        {stars}
      </View>
    );
  };

  const getConfirmationButtonStyle = (status: ConfirmationStatus) => {
    switch (status) {
      case 'confirmed':
        return {
          backgroundColor: theme.colors.status.success + '20',
          borderColor: theme.colors.status.success,
        };
      case 'declined':
        return {
          backgroundColor: theme.colors.status.error + '20',
          borderColor: theme.colors.status.error,
        };
      default:
        return {
          backgroundColor: theme.colors.status.success + '20',
          borderColor: theme.colors.status.success + '40',
        };
    }
  };

  const getConfirmationButtonText = (status: ConfirmationStatus) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'declined':
        return 'Declined';
      default:
        return 'Confirm';
    }
  };

  const renderConfirmationButton = (student: StudentProgress) => {
    if (!showConfirmationActions) return null;

    const buttonStyle = getConfirmationButtonStyle(student.status);
    const buttonText = getConfirmationButtonText(student.status);
    
    return (
      <Pressable
        onPress={() => handleConfirmationPress(student.id, 'confirm')}
        style={({ pressed }) => [
          styles.confirmationButton,
          buttonStyle,
          pressed && styles.confirmationButtonPressed,
        ]}
        disabled={student.status !== 'pending'}
        accessibilityRole="button"
        accessibilityLabel={`${buttonText} ${student.name}`}
        accessibilityState={{ disabled: student.status !== 'pending' }}
      >
        <Text style={[
          styles.confirmationButtonText,
          { 
            color: student.status === 'pending' ? 
              theme.colors.text.secondary : 
              student.status === 'confirmed' ? 
                theme.colors.status.success : 
                theme.colors.status.error
          }
        ]}>
          {buttonText}
        </Text>
      </Pressable>
    );
  };

  const renderStudentCard = (student: StudentProgress, index: number) => {
    const avatarSource = student.avatar || defaultAvatar;
    
    return (
      <Pressable
        key={student.id}
        onPress={() => handleStudentPress(student)}
        style={({ pressed }) => [
          styles.studentCard,
          studentCardStyle,
          pressed && styles.studentCardPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`Student: ${student.name}, ${student.rating} stars, ${student.status}`}
      >
        <View style={styles.studentCardContent}>
          {/* Avatar */}
          {avatarSource && (
            <Image
              source={typeof avatarSource === 'string' ? { uri: avatarSource } : avatarSource}
              style={styles.studentAvatar}
              accessibilityRole="image"
              accessibilityLabel={`${student.name}'s photo`}
            />
          )}
          
          {/* Student Info */}
          <View style={styles.studentInfo}>
            <View style={styles.studentHeader}>
              <Text style={styles.studentName} numberOfLines={1}>
                {student.name}
              </Text>
              
              {showStarRatings && renderStarRating(student.rating)}
            </View>
            
            {showLastActivity && student.lastActivity && (
              <Text style={styles.lastActivity} numberOfLines={1}>
                {student.lastActivity}
              </Text>
            )}
            
            {student.additionalInfo && (
              <Text style={styles.additionalInfo} numberOfLines={2}>
                {student.additionalInfo}
              </Text>
            )}
          </View>
          
          {/* Confirmation Button */}
          {renderConfirmationButton(student)}
        </View>
      </Pressable>
    );
  };

  const renderSection = (section: ProgressSection) => {
    const sectionExpanded = isExpanded(section.id);
    
    return (
      <View key={section.id} style={[styles.section, sectionStyle]}>
        <ToggleCard
          title={`${section.rating} ${section.rating === 1 ? 'star' : 'stars'}`}
          count={showStudentCount ? section.count : undefined}
          initialExpanded={sectionExpanded}
          onToggle={(expanded) => handleSectionToggle(section.id, expanded)}
          widthPercentage={0.33}
          backgroundColor={section.color}
          testID={`${testID}-section-${section.id}`}
        />
        
        {sectionExpanded && (
          <View style={styles.studentsContainer}>
            {section.students.map((student, index) => 
              renderStudentCard(student, index)
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View 
      style={[styles.container, containerStyle]}
      testID={testID}
      accessibilityLabel={accessibilityLabel || "Classroom progress cards"}
      accessibilityHint={accessibilityHint}
    >
      {sections.map(renderSection)}
    </View>
  );
};

const createStyles = (theme: any, screenDimensions: any) => {
  const isTablet = screenDimensions.isTablet;
  
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    
    section: {
      marginBottom: theme.spacing.md,
    },
    
    studentsContainer: {
      marginTop: theme.spacing.sm,
    },
    
    studentCard: {
      backgroundColor: theme.colors.background.elevated,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      marginBottom: theme.spacing.md,
      ...theme.elevation.sm,
    },
    
    studentCardPressed: {
      opacity: 0.8,
      transform: [{ scale: 0.98 }],
    },
    
    studentCardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
    },
    
    studentAvatar: {
      width: 47,
      height: 47,
      borderRadius: 23.5,
      marginRight: theme.spacing.md,
      backgroundColor: theme.colors.background.secondary,
    },
    
    studentInfo: {
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    
    studentHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    
    studentName: {
      flex: 1,
      fontSize: theme.fontSizes.body,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: theme.colors.text.primary,
      marginRight: theme.spacing.sm,
      ...(isTablet && {
        fontSize: theme.fontSizes.body * 1.1,
      }),
    },
    
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    
    starIcon: {
      marginHorizontal: 1,
    },
    
    lastActivity: {
      fontSize: theme.fontSizes.xs,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.xs,
    },
    
    additionalInfo: {
      fontSize: theme.fontSizes.xs,
      color: theme.colors.text.secondary,
      lineHeight: theme.typography.caption.base.lineHeight,
    },
    
    confirmationButton: {
      borderRadius: theme.borderRadius.full,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderWidth: 1,
      minWidth: 70,
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    confirmationButtonPressed: {
      opacity: 0.8,
      transform: [{ scale: 0.95 }],
    },
    
    confirmationButtonText: {
      fontSize: theme.fontSizes.xs,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
  });
};

export default ClassroomProgressCard;