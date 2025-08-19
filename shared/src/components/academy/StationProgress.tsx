/**
 * StationProgress Component
 * 
 * Displays lesson progress within a station with star ratings.
 * Useful for showing individual lesson achievements and progress tracking.
 * 
 * Extracted from students-app and enhanced with Academy theming.
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

export interface StationLesson {
  /** Lesson ID */
  id: string;
  /** Lesson description/title */
  description: string;
  /** Number of stars achievable for this lesson */
  achievableStars: number;
  /** Number of stars currently achieved */
  achievedStars?: number;
  /** Whether the lesson is completed */
  completed?: boolean;
  /** Lesson status */
  status?: 'not_started' | 'in_progress' | 'completed' | 'locked';
}

export interface StationProgressProps {
  /** Station data containing lessons */
  station: {
    /** Station ID */
    id?: string;
    /** Station name */
    name?: string;
    /** Array of lessons in this station */
    lessons: StationLesson[];
  };
  /** Custom container style */
  style?: ViewStyle;
  /** Whether to show lesson status icons */
  showStatusIcons?: boolean;
  /** Whether to make the list scrollable */
  scrollable?: boolean;
  /** Maximum height for scrollable content */
  maxHeight?: number;
  /** Custom star color */
  starColor?: string;
  /** Callback when lesson is pressed */
  onLessonPress?: (lesson: StationLesson) => void;
  /** Test ID for testing */
  testID?: string;
}

export const StationProgress: React.FC<StationProgressProps> = ({
  station,
  style,
  showStatusIcons = false,
  scrollable = false,
  maxHeight,
  starColor,
  onLessonPress,
  testID = 'station-progress',
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme, starColor);

  const renderStars = (achievableStars: number, achievedStars = 0) => {
    const stars = [];
    
    for (let i = 0; i < achievableStars; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i < achievedStars ? 'star' : 'star-outline'}
          size={16}
          color={i < achievedStars ? styles.starFilled.color : styles.starEmpty.color}
        />
      );
    }
    
    return (
      <View style={styles.starsContainer}>
        {stars}
      </View>
    );
  };

  const renderStatusIcon = (status?: StationLesson['status']) => {
    if (!showStatusIcons || !status) return null;

    const getStatusIcon = () => {
      switch (status) {
        case 'completed':
          return { name: 'checkmark-circle', color: theme.colors.status.success };
        case 'in_progress':
          return { name: 'hourglass-outline', color: theme.colors.status.warning };
        case 'locked':
          return { name: 'lock-closed-outline', color: theme.colors.text.disabled };
        default:
          return { name: 'ellipse-outline', color: theme.colors.text.tertiary };
      }
    };

    const icon = getStatusIcon();
    
    return (
      <Ionicons
        name={icon.name as any}
        size={16}
        color={icon.color}
        style={styles.statusIcon}
      />
    );
  };

  const renderLesson = (lesson: StationLesson, index: number) => {
    const isDisabled = lesson.status === 'locked';
    
    return (
      <View
        key={lesson.id || index}
        style={[
          styles.lessonItem,
          isDisabled && styles.lessonItemDisabled,
          index === station.lessons.length - 1 && styles.lessonItemLast,
        ]}
      >
        {renderStatusIcon(lesson.status)}
        
        <View style={styles.lessonContent}>
          <Text style={[
            styles.lessonDescription,
            isDisabled && styles.lessonDescriptionDisabled,
          ]}>
            {lesson.description}
          </Text>
        </View>

        <View style={styles.lessonMeta}>
          {renderStars(lesson.achievableStars, lesson.achievedStars)}
          <Text style={styles.starCount}>
            {lesson.achievedStars || 0}/{lesson.achievableStars}
          </Text>
        </View>
      </View>
    );
  };

  const renderContent = () => (
    <View style={[styles.container, style]} testID={testID}>
      {station.name && (
        <View style={styles.header}>
          <Text style={styles.stationTitle}>{station.name}</Text>
        </View>
      )}
      
      <View style={styles.lessonsContainer}>
        {station.lessons.map((lesson, index) => renderLesson(lesson, index))}
      </View>
    </View>
  );

  if (scrollable) {
    return (
      <ScrollView 
        style={[{ maxHeight }, style]}
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>
    );
  }

  return renderContent();
};

const createStyles = (theme: any, customStarColor?: string) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.lg,
    shadowColor: theme.colors.shadow.default,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },

  header: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.border.secondary,
  },

  stationTitle: {
    fontSize: theme.fontSizes.body,
    fontWeight: theme.fontConfig.fontWeight.semibold,
    color: theme.colors.text.primary,
  },

  lessonsContainer: {
    paddingVertical: theme.spacing.xs,
  },

  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.border.secondary,
  },

  lessonItemDisabled: {
    opacity: 0.5,
  },

  lessonItemLast: {
    borderBottomWidth: 0,
  },

  statusIcon: {
    marginRight: theme.spacing.sm,
  },

  lessonContent: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },

  lessonDescription: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text.secondary,
    lineHeight: theme.fontSizes.small * 1.4,
  },

  lessonDescriptionDisabled: {
    color: theme.colors.text.disabled,
  },

  lessonMeta: {
    alignItems: 'flex-end',
  },

  starsContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.xs,
  },

  starFilled: {
    color: customStarColor || theme.colors.status.warning,
  },

  starEmpty: {
    color: theme.colors.border.secondary,
  },

  starCount: {
    fontSize: theme.fontSizes.caption,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
  },
});

export default StationProgress;