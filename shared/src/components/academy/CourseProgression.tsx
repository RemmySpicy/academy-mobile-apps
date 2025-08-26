import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { useScreenDimensions } from '../../hooks';

export interface ProgressionLesson {
  id: string;
  title: string;
  description: string;
  achievableStars: number;
  achievedStars: number;
  isCompleted: boolean;
}

export interface ProgressionSection {
  id: string;
  name: string;
  title: string;
  lessons: ProgressionLesson[];
  isUnlocked: boolean;
}

export interface ProgressionClass {
  id: string;
  title: string;
  description?: string;
  lessonsCount: number;
  completedLessons: number;
  achievedStars: number;
  totalStars: number;
  percentageCompleted: number;
  sections: ProgressionSection[];
  isUnlocked: boolean;
  level: string;
}

export interface ProgressionLevel {
  id: string;
  name: string;
  title: string;
  classes: ProgressionClass[];
  isUnlocked: boolean;
}

export interface CourseProgressionData {
  id: string;
  title: string;
  description?: string;
  levels: ProgressionLevel[];
}

export interface CourseProgressionProps {
  progression: CourseProgressionData;
  currentLevel: string;
  onLessonPress?: (lessonId: string, classId: string, sectionId: string) => void;
  onClassPress?: (classId: string) => void;
  showEmptyStates?: boolean;
  compactMode?: boolean;
}

const CourseProgression: React.FC<CourseProgressionProps> = ({
  progression,
  currentLevel,
  onLessonPress,
  onClassPress,
  showEmptyStates = true,
  compactMode = false,
}) => {
  const { theme } = useTheme();
  const { isTablet } = useScreenDimensions();
  const styles = createStyles(theme, isTablet, compactMode);

  const [openTabs, setOpenTabs] = useState<{ [key: string]: boolean }>({});
  const [activeSections, setActiveSections] = useState<{ [key: string]: string }>({});

  const handleToggleTab = (classId: string) => {
    setOpenTabs(prev => ({
      ...prev,
      [classId]: !prev[classId],
    }));
  };

  const handleSectionChange = (classId: string, sectionId: string) => {
    setActiveSections(prev => ({
      ...prev,
      [classId]: sectionId,
    }));
  };

  const renderStars = (achieved: number, total: number, size: number = 16) => {
    return (
      <View style={styles.starsContainer}>
        {Array.from({ length: Math.max(achieved, total) }, (_, i) => (
          <Ionicons
            key={i}
            name={i < achieved ? 'star' : 'star-outline'}
            size={size}
            color={i < achieved ? theme.colors.status.warning : theme.colors.border.primary}
          />
        ))}
      </View>
    );
  };

  const renderProgressBar = (percentage: number) => (
    <View style={styles.progressBarContainer}>
      <View style={styles.progressBarBackground}>
        <View 
          style={[
            styles.progressBarFill,
            { 
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: theme.colors.interactive.primary,
            }
          ]} 
        />
      </View>
      <Text style={styles.progressText}>{percentage}%</Text>
    </View>
  );

  const renderLesson = (lesson: ProgressionLesson, classId: string, sectionId: string) => (
    <TouchableOpacity
      key={lesson.id}
      style={[
        styles.lessonCard,
        lesson.isCompleted && styles.lessonCardCompleted,
      ]}
      onPress={() => onLessonPress?.(lesson.id, classId, sectionId)}
      disabled={!lesson.isCompleted && lesson.achievedStars === 0}
    >
      <View style={styles.lessonContent}>
        <View style={styles.lessonInfo}>
          <Text style={[
            styles.lessonTitle,
            lesson.isCompleted && styles.lessonTitleCompleted,
          ]}>
            {lesson.title}
          </Text>
          {lesson.description && (
            <Text style={styles.lessonDescription}>{lesson.description}</Text>
          )}
        </View>
        
        <View style={styles.lessonStars}>
          {renderStars(lesson.achievedStars, lesson.achievableStars, 14)}
          {lesson.isCompleted && (
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={theme.colors.status.success}
              style={styles.completedIcon}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSection = (section: ProgressionSection, classItem: ProgressionClass) => {
    if (!section.isUnlocked) {
      return (
        <View key={section.id} style={styles.lockedSection}>
          <View style={styles.lockedSectionContent}>
            <Ionicons name="lock-closed" size={20} color={theme.colors.text.secondary} />
            <Text style={styles.lockedSectionText}>
              {section.title} - Complete previous sections to unlock
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View key={section.id} style={styles.sectionContent}>
        {section.lessons.length > 0 ? (
          section.lessons.map(lesson => renderLesson(lesson, classItem.id, section.id))
        ) : (
          showEmptyStates && (
            <View style={styles.emptySection}>
              <Text style={styles.emptySectionText}>
                No lessons available for {section.title}
              </Text>
            </View>
          )
        )}
      </View>
    );
  };

  const renderClass = (classItem: ProgressionClass) => {
    const isTabOpen = openTabs[classItem.id] || false;
    const activeSection = activeSections[classItem.id] || classItem.sections[0]?.id;
    const currentSection = classItem.sections.find(s => s.id === activeSection);

    return (
      <View key={classItem.id} style={[
        styles.classCard,
        !classItem.isUnlocked && styles.classCardLocked,
      ]}>
        {/* Class Header */}
        <TouchableOpacity
          style={styles.classHeader}
          onPress={() => {
            if (classItem.isUnlocked) {
              handleToggleTab(classItem.id);
              onClassPress?.(classItem.id);
            }
          }}
          disabled={!classItem.isUnlocked}
        >
          <View style={styles.classHeaderContent}>
            <View style={styles.classInfo}>
              <Text style={styles.classLabel}>Lessons:</Text>
              <Text style={[
                styles.classTitle,
                !classItem.isUnlocked && styles.classTitleLocked,
              ]}>
                {classItem.title}
              </Text>
              
              <View style={styles.classStats}>
                <View style={styles.classStat}>
                  <Ionicons name="book" size={14} color={theme.colors.text.secondary} />
                  <Text style={styles.classStatText}>
                    {classItem.completedLessons} / {classItem.lessonsCount}
                  </Text>
                </View>
                
                <View style={styles.classStat}>
                  <Ionicons name="star" size={14} color={theme.colors.status.warning} />
                  <Text style={styles.classStatText}>
                    {classItem.achievedStars} / {classItem.totalStars}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.classProgress}>
              {renderProgressBar(classItem.percentageCompleted)}
              {!classItem.isUnlocked && (
                <Ionicons name="lock-closed" size={20} color={theme.colors.text.secondary} />
              )}
            </View>
          </View>
        </TouchableOpacity>

        {/* Expandable Content */}
        {isTabOpen && classItem.isUnlocked && (
          <View style={styles.expandedContent}>
            {/* Section Tabs */}
            {classItem.sections.length > 1 && (
              <View style={styles.sectionTabs}>
                {classItem.sections.map((section) => (
                  <TouchableOpacity
                    key={section.id}
                    style={[
                      styles.sectionTab,
                      activeSection === section.id && styles.sectionTabActive,
                      !section.isUnlocked && styles.sectionTabLocked,
                    ]}
                    onPress={() => handleSectionChange(classItem.id, section.id)}
                    disabled={!section.isUnlocked}
                  >
                    <Text style={[
                      styles.sectionTabText,
                      activeSection === section.id && styles.sectionTabTextActive,
                      !section.isUnlocked && styles.sectionTabTextLocked,
                    ]}>
                      {section.name}
                    </Text>
                    {!section.isUnlocked && (
                      <Ionicons name="lock-closed" size={12} color={theme.colors.text.tertiary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Active Section Content */}
            {currentSection && renderSection(currentSection, classItem)}
          </View>
        )}

        {/* Toggle Button */}
        {classItem.isUnlocked && (
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => handleToggleTab(classItem.id)}
          >
            <Ionicons
              name={isTabOpen ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={theme.colors.text.secondary}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Find the current level data
  const currentLevelData = progression.levels.find(level => level.name === currentLevel);

  if (!currentLevelData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Level "{currentLevel}" not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {currentLevelData.classes.map(renderClass)}
    </View>
  );
};

const createStyles = (theme: any, isTablet: boolean, compactMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
  },
  classCard: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.lg,
    marginVertical: compactMode ? theme.spacing.xs : theme.spacing.sm,
    shadowColor: theme.colors.shadow.default,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  classCardLocked: {
    opacity: 0.6,
  },
  classHeader: {
    padding: theme.spacing.md,
  },
  classHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  classInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  classLabel: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text.secondary,
    fontWeight: theme.fontConfig.fontWeight.semibold,
    marginBottom: theme.spacing.xs,
  },
  classTitle: {
    fontSize: theme.fontSizes.body,
    fontWeight: theme.fontConfig.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  classTitleLocked: {
    color: theme.colors.text.secondary,
  },
  classStats: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  classStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  classStatText: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text.secondary,
  },
  classProgress: {
    alignItems: 'flex-end',
  },
  progressBarContainer: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  progressBarBackground: {
    width: 60,
    height: 6,
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: theme.fontSizes.small,
    fontWeight: theme.fontConfig.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  expandedContent: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.primary,
  },
  sectionTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  sectionTab: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    alignItems: 'center',
  },
  sectionTabActive: {
    borderBottomColor: theme.colors.interactive.primary,
  },
  sectionTabLocked: {
    opacity: 0.5,
  },
  sectionTabText: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  sectionTabTextActive: {
    color: theme.colors.interactive.primary,
    fontWeight: theme.fontConfig.fontWeight.semibold,
  },
  sectionTabTextLocked: {
    color: theme.colors.text.tertiary,
  },
  sectionContent: {
    padding: theme.spacing.sm,
  },
  lessonCard: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginVertical: theme.spacing.xs,
    marginHorizontal: theme.spacing.sm,
    shadowColor: theme.colors.shadow.default,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  lessonCardCompleted: {
    backgroundColor: theme.colors.status.success + '10',
    borderColor: theme.colors.status.success + '30',
    borderWidth: 1,
  },
  lessonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lessonInfo: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  lessonTitle: {
    fontSize: theme.fontSizes.body,
    fontWeight: theme.fontConfig.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  lessonTitleCompleted: {
    color: theme.colors.status.success,
  },
  lessonDescription: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text.secondary,
  },
  lessonStars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  completedIcon: {
    marginLeft: theme.spacing.xs,
  },
  lockedSection: {
    padding: theme.spacing.md,
    margin: theme.spacing.sm,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderStyle: 'dashed',
  },
  lockedSectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  lockedSectionText: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
  },
  emptySection: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  emptySectionText: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
  },
  toggleButton: {
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.primary,
  },
  errorContainer: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  errorText: {
    fontSize: theme.fontSizes.body,
    color: theme.colors.status.error,
    textAlign: 'center',
  },
});

export default CourseProgression;