import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { useScreenDimensions } from '../../hooks';
import { ControlCard } from '../ui';

export interface ClassroomGroup {
  id: string;
  name: string;
  studentCount: number;
  color?: string;
  isActive?: boolean;
}

export interface LessonSection {
  id: string;
  title: string;
  description?: string;
  warmUp?: string[];
  mainSet?: LessonActivity[];
}

export interface LessonActivity {
  id: string;
  title: string;
  description?: string;
  starDistribution: { [key: number]: number }; // stars -> count
  onGradePress?: (activityId: string, stars: number) => void;
}

export interface ClassroomLesson {
  id: string;
  level: string;
  title: string;
  className: string;
  currentSection?: string;
  sections: LessonSection[];
  icon?: string;
}

export interface ClassroomStats {
  totalStudents: number;
  myStudents: number;
  instructors: number;
  totalLessons: number;
  zeroStars: number;
  oneStars: number;
  twoStars: number;
}

export interface MyClassroomProps {
  schoolName: string;
  location?: string;
  groups: ClassroomGroup[];
  lessons: ClassroomLesson[];
  stats: ClassroomStats;
  onGroupChange?: (groupId: string) => void;
  onGradingModalOpen?: () => void;
  onLessonToggle?: (lessonId: string, expanded: boolean) => void;
  defaultExpandedLesson?: string;
}

const MyClassroom: React.FC<MyClassroomProps> = ({
  schoolName,
  location = "All location",
  groups,
  lessons,
  stats,
  onGroupChange,
  onGradingModalOpen,
  onLessonToggle,
  defaultExpandedLesson,
}) => {
  const { theme } = useTheme();
  const { isTablet } = useScreenDimensions();
  const styles = createStyles(theme, isTablet);

  const [activeGroup, setActiveGroup] = useState(groups.find(g => g.isActive)?.id || groups[0]?.id);
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(
    new Set(defaultExpandedLesson ? [defaultExpandedLesson] : [])
  );
  const [activeSections, setActiveSections] = useState<{ [lessonId: string]: string }>({});

  const handleGroupChange = (groupId: string) => {
    setActiveGroup(groupId);
    onGroupChange?.(groupId);
  };

  const handleLessonToggle = (lessonId: string) => {
    const newExpanded = new Set(expandedLessons);
    if (newExpanded.has(lessonId)) {
      newExpanded.delete(lessonId);
    } else {
      newExpanded.add(lessonId);
    }
    setExpandedLessons(newExpanded);
    onLessonToggle?.(lessonId, newExpanded.has(lessonId));
  };

  const handleSectionChange = (lessonId: string, sectionId: string) => {
    setActiveSections(prev => ({
      ...prev,
      [lessonId]: sectionId,
    }));
  };

  const renderStarRating = (activity: LessonActivity, interactive: boolean = true) => {
    const maxStars = Math.max(...Object.keys(activity.starDistribution).map(Number));
    
    return (
      <View style={styles.starRatingContainer}>
        {Object.entries(activity.starDistribution).map(([stars, count]) => {
          const starCount = parseInt(stars);
          const isInteractive = interactive && count > 0;
          
          return (
            <TouchableOpacity
              key={stars}
              style={[
                styles.starChip,
                !isInteractive && styles.starChipDisabled,
              ]}
              onPress={() => {
                if (isInteractive && activity.onGradePress) {
                  activity.onGradePress(activity.id, starCount);
                } else if (isInteractive && onGradingModalOpen) {
                  onGradingModalOpen();
                }
              }}
              disabled={!isInteractive}
            >
              <View style={styles.starGroup}>
                {Array.from({ length: starCount }, (_, i) => (
                  <Ionicons
                    key={i}
                    name={starCount === 0 ? 'star-outline' : 'star'}
                    size={16}
                    color={theme.colors.status.warning}
                  />
                ))}
              </View>
              <Text style={[
                styles.starCount,
                { color: theme.colors.interactive.primary }
              ]}>
                {count}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderLessonSection = (lesson: ClassroomLesson, section: LessonSection) => (
    <View key={section.id} style={styles.sectionContent}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
        {section.description && (
          <Text style={styles.sectionDescription}>{section.description}</Text>
        )}
      </View>

      {section.warmUp && section.warmUp.length > 0 && (
        <View style={styles.warmUpSection}>
          <Text style={styles.warmUpTitle}>Warm Up</Text>
          {section.warmUp.map((exercise, index) => (
            <Text key={index} style={styles.exerciseText}>{exercise}</Text>
          ))}
        </View>
      )}

      {section.mainSet && section.mainSet.length > 0 && (
        <View style={styles.mainSetSection}>
          <Text style={styles.mainSetTitle}>Main Set</Text>
          {section.mainSet.map((activity) => (
            <View key={activity.id} style={styles.activityCard}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              {activity.description && (
                <Text style={styles.activityDescription}>{activity.description}</Text>
              )}
              {renderStarRating(activity)}
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderLesson = (lesson: ClassroomLesson) => {
    const isExpanded = expandedLessons.has(lesson.id);
    const activeSection = activeSections[lesson.id] || lesson.sections[0]?.id;
    const currentSection = lesson.sections.find(s => s.id === activeSection);

    return (
      <View key={lesson.id} style={styles.lessonCard}>
        <View style={styles.lessonHeader}>
          <View style={styles.lessonInfo}>
            <Text style={styles.lessonLabel}>Current Lessons:</Text>
            <View style={styles.lessonTitleRow}>
              {lesson.icon && (
                <Ionicons 
                  name={lesson.icon as any} 
                  size={20} 
                  color={theme.colors.status.warning} 
                />
              )}
              <View style={styles.lessonTitleContainer}>
                <Text style={styles.lessonTitle}>
                  {lesson.level}: {lesson.title}
                </Text>
                <Text style={styles.lessonClassName}>{lesson.className}</Text>
              </View>
            </View>
          </View>
        </View>

        {isExpanded && lesson.sections.length > 1 && (
          <View style={styles.sectionTabs}>
            {lesson.sections.map((section) => (
              <TouchableOpacity
                key={section.id}
                style={[
                  styles.sectionTab,
                  activeSection === section.id && styles.sectionTabActive,
                ]}
                onPress={() => handleSectionChange(lesson.id, section.id)}
              >
                <Text style={[
                  styles.sectionTabText,
                  activeSection === section.id && styles.sectionTabTextActive,
                ]}>
                  {section.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {isExpanded && currentSection && renderLessonSection(lesson, currentSection)}

        <TouchableOpacity
          style={styles.expandButton}
          onPress={() => handleLessonToggle(lesson.id)}
        >
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={theme.colors.text.secondary}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const queryFilter = [
    { id: "total-students", label: "Total student: ", num: stats.totalStudents.toString() },
    { id: "my-students", label: "My student: ", num: stats.myStudents.toString() },
    { id: "instructors", label: "Instructor: ", num: stats.instructors.toString() },
  ];

  const quickFilter = [
    { id: "all-lessons", label: "All Lessons: ", count: stats.totalLessons.toString() },
    { id: "zero-stars", label: "0 Stars: ", count: stats.zeroStars.toString() },
    { id: "one-stars", label: "1 Stars: ", count: stats.oneStars.toString() },
    { id: "two-stars", label: "2 Stars: ", count: stats.twoStars.toString() },
  ];

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <ControlCard
        filterName="Quick Filter"
        schoolName={schoolName}
        allNames={location}
        quickFilter={quickFilter}
        queryFilter={queryFilter}
        viewName="Views"
        groupName="Locations"
        moreInfo={true}
      />

      {/* Group Selection */}
      <View style={styles.groupSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {groups.map((group) => (
            <TouchableOpacity
              key={group.id}
              style={[
                styles.groupChip,
                activeGroup === group.id && styles.groupChipActive,
                { backgroundColor: group.color },
              ]}
              onPress={() => handleGroupChange(group.id)}
            >
              <Text style={[
                styles.groupChipText,
                activeGroup === group.id && styles.groupChipTextActive,
              ]}>
                {group.name} - {group.studentCount}
              </Text>
            </TouchableOpacity>
          ))}
          
          {/* Add Group Button */}
          <TouchableOpacity style={styles.addGroupButton}>
            <Text style={styles.addGroupText}>+</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Lessons */}
      <View style={styles.lessonsContainer}>
        {lessons.map(renderLesson)}
      </View>
    </ScrollView>
  );
};

const createStyles = (theme: any, isTablet: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  groupSelector: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  groupChip: {
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.sm,
  },
  groupChipActive: {
    backgroundColor: theme.colors.interactive.primary,
  },
  groupChipText: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text.primary,
  },
  groupChipTextActive: {
    color: theme.colors.text.inverse,
    fontWeight: theme.fontConfig.fontWeight.medium,
  },
  addGroupButton: {
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 40,
  },
  addGroupText: {
    fontSize: theme.fontSizes.large,
    color: theme.colors.text.primary,
    fontWeight: theme.fontConfig.fontWeight.medium,
  },
  lessonsContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  lessonCard: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.lg,
    marginVertical: theme.spacing.sm,
    shadowColor: theme.colors.shadow?.primary || '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  lessonHeader: {
    padding: theme.spacing.md,
  },
  lessonInfo: {
    marginBottom: theme.spacing.sm,
  },
  lessonLabel: {
    fontSize: theme.fontSizes.caption,
    color: theme.colors.text.secondary,
    fontWeight: theme.fontConfig.fontWeight.semibold,
    marginBottom: theme.spacing.xs,
  },
  lessonTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  lessonTitleContainer: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: theme.fontSizes.body,
    fontWeight: theme.fontConfig.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  lessonClassName: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text.secondary,
    fontWeight: theme.fontConfig.fontWeight.medium,
  },
  sectionTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  sectionTab: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  sectionTabActive: {
    borderBottomColor: theme.colors.interactive.primary,
  },
  sectionTabText: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text.secondary,
  },
  sectionTabTextActive: {
    color: theme.colors.interactive.primary,
    fontWeight: theme.fontConfig.fontWeight.semibold,
  },
  sectionContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  sectionHeader: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.body,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  sectionDescription: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text.secondary,
  },
  warmUpSection: {
    marginBottom: theme.spacing.md,
  },
  warmUpTitle: {
    fontSize: theme.fontSizes.body,
    color: theme.colors.text.primary,
    fontWeight: theme.fontConfig.fontWeight.semibold,
    marginBottom: theme.spacing.sm,
  },
  exerciseText: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  mainSetSection: {
    marginBottom: theme.spacing.md,
  },
  mainSetTitle: {
    fontSize: theme.fontSizes.body,
    color: theme.colors.text.primary,
    fontWeight: theme.fontConfig.fontWeight.semibold,
    marginBottom: theme.spacing.sm,
  },
  activityCard: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    shadowColor: theme.colors.shadow?.primary || '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activityTitle: {
    fontSize: theme.fontSizes.body,
    fontWeight: theme.fontConfig.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  activityDescription: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  starRatingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  starChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.background.primary,
  },
  starChipDisabled: {
    opacity: 0.5,
  },
  starGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  starCount: {
    fontSize: theme.fontSizes.small,
    marginLeft: theme.spacing.xs,
    fontWeight: theme.fontConfig.fontWeight.medium,
  },
  expandButton: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.primary,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MyClassroom;