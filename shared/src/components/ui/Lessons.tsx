import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { useScreenDimensions } from '../../hooks';

export interface LessonStation {
  id: string;
  name: string;
  title: string;
  activities: LessonActivity[];
}

export interface LessonActivity {
  id: string;
  title: string;
  description?: string;
  stars: number;
  maxStars: number;
  rating?: string;
  completed: boolean;
}

export interface LessonData {
  id: string;
  title: string;
  className: string;
  description?: string;
  completion: number;
  totalActivities: number;
  completedActivities: number;
  overallRating: string;
  image?: ImageSourcePropType | string;
  completionImage?: ImageSourcePropType | string;
  stations: LessonStation[];
  disabled?: boolean;
}

export interface LessonsProps {
  lessons: LessonData[];
  onLessonPress?: (lesson: LessonData) => void;
  onActivityPress?: (lessonId: string, stationId: string, activityId: string) => void;
  
  // Display options
  showStations?: boolean;
  showCompletion?: boolean;
  showRating?: boolean;
  defaultExpanded?: boolean;
  
  // Styling
  variant?: 'default' | 'compact' | 'detailed';
  spacing?: number;
  
  // Empty state
  emptyTitle?: string;
  emptyDescription?: string;
}

const Lessons: React.FC<LessonsProps> = ({
  lessons,
  onLessonPress,
  onActivityPress,
  showStations = true,
  showCompletion = true,
  showRating = true,
  defaultExpanded = false,
  variant = 'default',
  spacing = 16,
  emptyTitle = 'No Lessons Available',
  emptyDescription = 'There are no lessons to display at this time.',
}) => {
  const { theme } = useTheme();
  const { isTablet } = useScreenDimensions();
  const styles = createStyles(theme, isTablet, spacing);

  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(
    new Set(defaultExpanded ? lessons.map(l => l.id) : [])
  );
  const [activeStations, setActiveStations] = useState<{ [lessonId: string]: string }>({});

  const toggleLesson = (lessonId: string) => {
    const newExpanded = new Set(expandedLessons);
    if (newExpanded.has(lessonId)) {
      newExpanded.delete(lessonId);
    } else {
      newExpanded.add(lessonId);
      // Set first station as active when expanding
      const lesson = lessons.find(l => l.id === lessonId);
      if (lesson && lesson.stations.length > 0) {
        setActiveStations(prev => ({
          ...prev,
          [lessonId]: lesson.stations[0].id,
        }));
      }
    }
    setExpandedLessons(newExpanded);
  };

  const selectStation = (lessonId: string, stationId: string) => {
    setActiveStations(prev => ({
      ...prev,
      [lessonId]: stationId,
    }));
  };

  const renderStars = (stars: number, maxStars: number) => {
    return (
      <View style={styles.starsContainer}>
        {Array.from({ length: maxStars }, (_, i) => (
          <Ionicons
            key={i}
            name={i < stars ? 'star' : 'star-outline'}
            size={14}
            color={theme.colors.status.warning}
          />
        ))}
      </View>
    );
  };

  const renderActivity = (
    activity: LessonActivity,
    lessonId: string,
    stationId: string
  ) => (
    <TouchableOpacity
      key={activity.id}
      style={[
        styles.activityCard,
        activity.completed && styles.activityCardCompleted,
      ]}
      onPress={() => onActivityPress?.(lessonId, stationId, activity.id)}
    >
      <View style={styles.activityContent}>
        <View style={styles.activityInfo}>
          <Text style={[
            styles.activityTitle,
            activity.completed && styles.activityTitleCompleted,
          ]}>
            {activity.title}
          </Text>
          {activity.description && (
            <Text style={styles.activityDescription}>
              {activity.description}
            </Text>
          )}
        </View>

        <View style={styles.activityMeta}>
          {renderStars(activity.stars, activity.maxStars)}
          {activity.rating && (
            <Text style={styles.activityRating}>{activity.rating}</Text>
          )}
          {activity.completed && (
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={theme.colors.status.success}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderStations = (lesson: LessonData) => {
    if (!showStations || !lesson.stations.length) return null;

    const isExpanded = expandedLessons.has(lesson.id);
    if (!isExpanded) return null;

    const activeStationId = activeStations[lesson.id] || lesson.stations[0]?.id;
    const activeStation = lesson.stations.find(s => s.id === activeStationId);

    return (
      <View style={styles.stationsContainer}>
        {/* Station Tabs */}
        <View style={styles.stationTabs}>
          {lesson.stations.map((station) => (
            <TouchableOpacity
              key={station.id}
              style={[
                styles.stationTab,
                activeStationId === station.id && styles.stationTabActive,
              ]}
              onPress={() => selectStation(lesson.id, station.id)}
            >
              <Text style={[
                styles.stationTabText,
                activeStationId === station.id && styles.stationTabTextActive,
              ]}>
                {station.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Active Station Content */}
        {activeStation && (
          <View style={styles.stationContent}>
            {activeStation.title && (
              <Text style={styles.stationTitle}>{activeStation.title}</Text>
            )}
            
            <View style={styles.activitiesContainer}>
              {activeStation.activities.map(activity =>
                renderActivity(activity, lesson.id, activeStation.id)
              )}
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderLesson = (lesson: LessonData) => {
    const isExpanded = expandedLessons.has(lesson.id);

    return (
      <View key={lesson.id} style={[
        styles.lessonCard,
        variant === 'compact' && styles.lessonCardCompact,
        lesson.disabled && styles.lessonCardDisabled,
      ]}>
        <TouchableOpacity
          style={styles.lessonHeader}
          onPress={() => {
            toggleLesson(lesson.id);
            onLessonPress?.(lesson);
          }}
          disabled={lesson.disabled}
        >
          <View style={styles.lessonInfo}>
            <View style={styles.lessonTitleContainer}>
              <Text style={styles.lessonLabel}>Lesson:</Text>
              <Text style={styles.lessonTitle}>{lesson.title}</Text>
              <Text style={styles.lessonClassName}>{lesson.className}</Text>
            </View>

            <View style={styles.lessonStats}>
              {lesson.image && (
                <View style={styles.statItem}>
                  <Image source={
                    typeof lesson.image === 'string' 
                      ? { uri: lesson.image } 
                      : lesson.image
                  } style={styles.statIcon} />
                  <Text style={styles.statText}>
                    {lesson.completedActivities}/{lesson.totalActivities}
                  </Text>
                </View>
              )}

              {showRating && (
                <View style={styles.statItem}>
                  <Ionicons 
                    name="star" 
                    size={16} 
                    color={theme.colors.status.warning} 
                  />
                  <Text style={styles.statText}>{lesson.overallRating}</Text>
                </View>
              )}
            </View>
          </View>

          {showCompletion && lesson.completionImage && (
            <View style={styles.lessonCompletion}>
              <Image 
                source={
                  typeof lesson.completionImage === 'string'
                    ? { uri: lesson.completionImage }
                    : lesson.completionImage
                } 
                style={styles.completionImage}
              />
            </View>
          )}
        </TouchableOpacity>

        {renderStations(lesson)}

        <TouchableOpacity
          style={styles.expandButton}
          onPress={() => toggleLesson(lesson.id)}
          disabled={lesson.disabled}
        >
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={lesson.disabled ? theme.colors.text.tertiary : theme.colors.text.secondary}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons 
        name="book" 
        size={64} 
        color={theme.colors.text.tertiary} 
        style={styles.emptyIcon}
      />
      <Text style={styles.emptyTitle}>{emptyTitle}</Text>
      <Text style={styles.emptyDescription}>{emptyDescription}</Text>
    </View>
  );

  if (lessons.length === 0) {
    return renderEmptyState();
  }

  return (
    <View style={styles.container}>
      {lessons.map(renderLesson)}
    </View>
  );
};

const createStyles = (theme: any, isTablet: boolean, spacing: number) => StyleSheet.create({
  container: {
    flex: 1,
  },
  lessonCard: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.lg,
    marginVertical: spacing * 0.5,
    shadowColor: theme.colors.shadow?.primary || '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  lessonCardCompact: {
    marginVertical: spacing * 0.25,
  },
  lessonCardDisabled: {
    opacity: 0.6,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: theme.spacing.md,
  },
  lessonInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  lessonTitleContainer: {
    marginBottom: theme.spacing.sm,
  },
  lessonLabel: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  lessonTitle: {
    fontSize: theme.fontSizes.body,
    fontWeight: theme.fontConfig.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  lessonClassName: {
    fontSize: theme.fontSizes.small,
    fontWeight: theme.fontConfig.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  lessonStats: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  statIcon: {
    width: 20,
    height: 20,
  },
  statText: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text.secondary,
  },
  lessonCompletion: {
    alignItems: 'center',
  },
  completionImage: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.md,
  },
  stationsContainer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.primary,
    paddingTop: theme.spacing.md,
  },
  stationTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  stationTab: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  stationTabActive: {
    borderBottomColor: theme.colors.interactive.primary,
  },
  stationTabText: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  stationTabTextActive: {
    color: theme.colors.interactive.primary,
    fontWeight: theme.fontConfig.fontWeight.semibold,
  },
  stationContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  stationTitle: {
    fontSize: theme.fontSizes.body,
    fontWeight: theme.fontConfig.fontWeight.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  activitiesContainer: {
    gap: theme.spacing.sm,
  },
  activityCard: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  activityCardCompleted: {
    backgroundColor: theme.colors.status.success + '10',
    borderColor: theme.colors.status.success + '30',
  },
  activityContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityInfo: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  activityTitle: {
    fontSize: theme.fontSizes.body,
    fontWeight: theme.fontConfig.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  activityTitleCompleted: {
    color: theme.colors.status.success,
  },
  activityDescription: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text.secondary,
  },
  activityMeta: {
    alignItems: 'flex-end',
    gap: theme.spacing.xs,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  activityRating: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text.secondary,
    fontWeight: theme.fontConfig.fontWeight.medium,
  },
  expandButton: {
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.primary,
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
    lineHeight: theme.typography.lineHeight?.body || 24,
  },
});

export default Lessons;