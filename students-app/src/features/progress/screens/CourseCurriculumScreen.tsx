import React, { useState, useMemo } from 'react';
import { View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme, createThemedStyles, NavigationHeader } from '@academy/mobile-shared';
import type { ProgressStackParamList } from '../navigation/ProgressNavigator';

const { width } = Dimensions.get('window');

type CourseCurriculumRouteProp = RouteProp<ProgressStackParamList, 'CourseCurriculum'>;

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: 'theory' | 'practical' | 'assessment' | 'review';
  isCompleted: boolean;
  progress: number; // 0-100
  objectives: string[];
  starsEarned: number; // 0-3 stars earned by instructor grading
  maxStars: number; // Always 3 by default
}

interface Section {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  completedLessons: number;
  totalLessons: number;
}

interface AssessmentItem {
  id: string;
  title: string;
  description: string;
  starsEarned: number; // 0-3 stars earned
  maxStars: number; // Always 3
  isCompleted: boolean;
}

interface LevelAssessment {
  id: string;
  title: string;
  description: string;
  totalItems: number;
  completedItems: number;
  totalStars: number; // Sum of all possible stars
  earnedStars: number; // Sum of all earned stars
  overallScore: number; // Percentage score
  isCompleted: boolean;
  isUnlocked: boolean;
  items: AssessmentItem[];
}

interface Module {
  id: string;
  moduleNumber: number; // Module number (1, 2, 3, etc.)
  title: string;
  description: string;
  totalLessons: number;
  completedLessons: number; // Lessons with at least 2 stars earned
  progress: number; // 0-100
  estimatedTime: string; // Kept for data compatibility, but will display stars instead
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  isUnlocked: boolean;
  totalStars: number; // Total stars possible in this module
  earnedStars: number; // Total stars earned in this module
  sections: Section[];
}

interface CourseLevel {
  id: string;
  title: string;
  shortTitle: string; // For filter tabs (e.g., "Level 1", "Level 2")
  description: string;
  difficulty: string; // Level difficulty - dynamic based on curriculum data
  totalModules: number;
  completedModules: number;
  progress: number; // 0-100
  isCurrentLevel: boolean;
  isCompleted: boolean;
  isUnlocked: boolean;
  modules: Module[];
  assessment?: LevelAssessment; // Optional level assessment
}

interface CourseCurriculum {
  id: string;
  title: string;
  subtitle: string;
  overallProgress: number;
  currentLevel: number;
  totalLevels: number;
  levels: CourseLevel[];
}

const useScreenStyles = createThemedStyles((theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  courseHeader: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.elevation.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  courseTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.fontSizes['2xl'],
    fontWeight: theme.fontConfig.fontWeight.bold,
    marginBottom: theme.spacing.xs,
  },
  courseSubtitle: {
    color: theme.colors.text.secondary,
    fontSize: theme.fontSizes.base,
    marginBottom: theme.spacing.md,
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  progressInfo: {
    flex: 1,
  },
  progressLabel: {
    color: theme.colors.text.secondary,
    fontSize: theme.fontSizes.sm,
    marginBottom: theme.spacing.xs,
  },
  progressBar: {
    backgroundColor: theme.colors.border.primary,
    borderRadius: theme.borderRadius.full,
    height: 8,
    marginBottom: theme.spacing.xs,
  },
  progressFill: {
    height: 8,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.interactive.primary,
  },
  progressText: {
    color: theme.colors.text.primary,
    fontWeight: theme.fontConfig.fontWeight.semibold,
    fontSize: theme.fontSizes.sm,
  },
  // Level Filter Bar (Swipeable)
  levelFilterContainer: {
    marginBottom: theme.spacing.lg,
  },
  levelFilterScrollView: {
    paddingHorizontal: theme.spacing.md,
  },
  levelFilterTab: {
    marginRight: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    minWidth: 80,
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  activeLevelFilterTab: {
    backgroundColor: theme.colors.interactive.primary,
  },
  currentLevelFilterTab: {
    backgroundColor: theme.colors.interactive.accent,
  },
  completedLevelFilterTab: {
    backgroundColor: `${theme.colors.status.success}20`,
    borderColor: theme.colors.status.success,
    borderWidth: 1,
  },
  lockedLevelFilterTab: {
    backgroundColor: theme.colors.background.tertiary,
  },
  levelFilterText: {
    color: theme.colors.text.secondary,
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontConfig.fontWeight.medium,
  },
  currentLevelIndicator: {
    fontSize: theme.fontSizes.xs,
    fontWeight: theme.fontConfig.fontWeight.normal,
    color: theme.colors.text.tertiary,
  },
  // Level Difficulty Badge
  difficultyBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.full,
    marginLeft: theme.spacing.sm,
  },
  difficultyBadgeText: {
    fontSize: theme.fontSizes.xs,
    fontWeight: theme.fontConfig.fontWeight.medium,
  },
  activeLevelFilterText: {
    color: 'white',
  },
  // Module Cards
  moduleCard: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.xl,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    overflow: 'hidden',
    ...theme.elevation.sm,
  },
  lockedModuleCard: {
    backgroundColor: theme.colors.background.tertiary,
    opacity: 0.7,
  },
  moduleHeader: {
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  moduleInfo: {
    flex: 1,
  },
  moduleTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.fontSizes.base,
    fontWeight: theme.fontConfig.fontWeight.semibold,
    marginBottom: theme.spacing.xs / 2,
  },
  moduleDescription: {
    color: theme.colors.text.secondary,
    fontSize: theme.fontSizes.sm,
    marginBottom: theme.spacing.xs,
  },
  moduleMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricText: {
    color: theme.colors.text.tertiary,
    fontSize: theme.fontSizes.xs,
    marginLeft: theme.spacing.xs / 2,
  },
  expandButton: {
    padding: theme.spacing.xs,
  },
  // Module Content
  moduleContent: {
    backgroundColor: theme.colors.background.secondary,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.primary,
  },
  // Section Tabs
  sectionTabs: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xs,
    margin: theme.spacing.md,
    marginBottom: 0,
  },
  sectionTab: {
    flex: 1,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  activeSectionTab: {
    backgroundColor: theme.colors.interactive.primary,
  },
  sectionTabText: {
    color: theme.colors.text.secondary,
    fontSize: theme.fontSizes.xs,
    fontWeight: theme.fontConfig.fontWeight.medium,
  },
  activeSectionTabText: {
    color: 'white',
  },
  // Section Header
  sectionHeader: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  sectionDescription: {
    color: theme.colors.text.secondary,
    fontSize: theme.fontSizes.sm,
    marginTop: theme.spacing.xs,
    lineHeight: 20,
  },
  // Section Content
  sectionContent: {
    padding: theme.spacing.md,
  },
  // Lesson Cards
  lessonCard: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    ...theme.elevation.xs,
  },
  completedLessonCard: {
    backgroundColor: `${theme.colors.status.success}05`,
    borderColor: theme.colors.status.success,
  },
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  lessonIcon: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  theoryLessonIcon: {
    backgroundColor: `${theme.colors.interactive.accent}15`,
  },
  practicalLessonIcon: {
    backgroundColor: `${theme.colors.interactive.primary}15`,
  },
  assessmentLessonIcon: {
    backgroundColor: `${theme.colors.status.warning}15`,
  },
  reviewLessonIcon: {
    backgroundColor: `${theme.colors.status.info}15`,
  },
  lessonContent: {
    flex: 1,
  },
  lessonTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontConfig.fontWeight.medium,
    marginBottom: theme.spacing.xs / 2,
  },
  lessonDescription: {
    color: theme.colors.text.secondary,
    fontSize: theme.fontSizes.xs,
    marginBottom: theme.spacing.xs / 2,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  lessonDuration: {
    color: theme.colors.text.tertiary,
    fontSize: theme.fontSizes.xs,
  },
  lessonStars: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: theme.spacing.xs,
  },
  lessonProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonProgressText: {
    color: theme.colors.text.tertiary,
    fontSize: theme.fontSizes.xs,
    marginLeft: theme.spacing.xs / 2,
  },
  completionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: theme.spacing.xs,
  },
  completedText: {
    color: theme.colors.status.success,
    fontSize: theme.fontSizes.xs,
    fontWeight: theme.fontConfig.fontWeight.medium,
    marginLeft: theme.spacing.xs / 2,
  },
  statusIcon: {
    marginLeft: theme.spacing.sm,
  },
  sectionTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontConfig.fontWeight.semibold,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  // Assessment Card
  assessmentCard: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.xl,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    overflow: 'hidden',
    ...theme.elevation.sm,
  },
  assessmentHeader: {
    backgroundColor: `${theme.colors.interactive.accent}10`,
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  assessmentInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  assessmentTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontConfig.fontWeight.semibold,
    marginBottom: theme.spacing.xs,
  },
  assessmentDescription: {
    color: theme.colors.text.secondary,
    fontSize: theme.fontSizes.sm,
    marginBottom: theme.spacing.md,
  },
  assessmentStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
  assessmentStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assessmentStatText: {
    color: theme.colors.text.secondary,
    fontSize: theme.fontSizes.sm,
    marginLeft: theme.spacing.xs,
  },
  assessmentScore: {
    backgroundColor: theme.colors.interactive.accent,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    alignSelf: 'flex-start',
  },
  assessmentScoreText: {
    color: 'white',
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontConfig.fontWeight.semibold,
  },
  assessmentContent: {
    padding: theme.spacing.lg,
  },
  assessmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  completedAssessmentItem: {
    backgroundColor: `${theme.colors.status.success}05`,
    borderColor: theme.colors.status.success,
  },
  assessmentItemContent: {
    flex: 1,
  },
  assessmentItemTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontConfig.fontWeight.medium,
    marginBottom: theme.spacing.xs / 2,
  },
  assessmentItemDescription: {
    color: theme.colors.text.secondary,
    fontSize: theme.fontSizes.xs,
  },
  assessmentItemStars: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
  },
}));

const getLessonTypeIcon = (type: Lesson['type']) => {
  switch (type) {
    case 'theory': return 'book-outline';
    case 'practical': return 'construct-outline';
    case 'assessment': return 'checkmark-circle-outline';
    case 'review': return 'refresh-outline';
    default: return 'document-outline';
  }
};

const getLessonTypeColor = (type: Lesson['type'], theme: any) => {
  switch (type) {
    case 'theory': return theme.colors.interactive.accent;
    case 'practical': return theme.colors.interactive.primary;
    case 'assessment': return theme.colors.status.warning;
    case 'review': return theme.colors.status.info;
    default: return theme.colors.text.secondary;
  }
};

// Difficulty Color Helper - Dynamic difficulty support
const getDifficultyColor = (difficulty: string, theme: any) => {
  // Normalize the difficulty string for comparison (case-insensitive, trim whitespace)
  const normalizedDifficulty = difficulty.toLowerCase().trim();
  
  // Common difficulty mappings (extensible)
  const difficultyColorMap: Record<string, string> = {
    // Beginner variations
    'beginner': theme.colors.status.success,
    'basic': theme.colors.status.success,
    'starter': theme.colors.status.success,
    'foundation': theme.colors.status.success,
    'intro': theme.colors.status.success,
    'level 1': theme.colors.status.success,
    
    // Intermediate variations
    'intermediate': theme.colors.status.warning,
    'middle': theme.colors.status.warning,
    'developing': theme.colors.status.warning,
    'progressing': theme.colors.status.warning,
    'level 2': theme.colors.status.warning,
    'level 3': theme.colors.status.warning,
    'level 4': theme.colors.status.warning,
    
    // Advanced variations
    'advanced': theme.colors.status.error,
    'expert': theme.colors.status.error,
    'mastery': theme.colors.status.error,
    'professional': theme.colors.status.error,
    'competitive': theme.colors.status.error,
    'level 5': theme.colors.status.error,
    'level 6': theme.colors.status.error,
    'level 7': theme.colors.status.error,
  };
  
  // Check if we have a direct match
  if (difficultyColorMap[normalizedDifficulty]) {
    return difficultyColorMap[normalizedDifficulty];
  }
  
  // Intelligent fallback based on keywords
  if (normalizedDifficulty.includes('begin') || normalizedDifficulty.includes('basic') || 
      normalizedDifficulty.includes('start') || normalizedDifficulty.includes('intro') ||
      normalizedDifficulty.includes('foundation')) {
    return theme.colors.status.success; // Green for beginner-like
  }
  
  if (normalizedDifficulty.includes('advanc') || normalizedDifficulty.includes('expert') || 
      normalizedDifficulty.includes('master') || normalizedDifficulty.includes('profession') ||
      normalizedDifficulty.includes('competitive')) {
    return theme.colors.status.error; // Red for advanced-like
  }
  
  if (normalizedDifficulty.includes('intermedi') || normalizedDifficulty.includes('middle') || 
      normalizedDifficulty.includes('develop') || normalizedDifficulty.includes('progress')) {
    return theme.colors.status.warning; // Orange for intermediate-like
  }
  
  // Default fallback for completely unknown difficulties
  return theme.colors.interactive.primary; // Academy purple as neutral fallback
};

// Level Difficulty Badge Helpers
const getDifficultyBadgeStyle = (difficulty: string, theme: any) => {
  const baseColor = getDifficultyColor(difficulty, theme);
  return {
    backgroundColor: `${baseColor}15`,
  };
};

const getDifficultyTextStyle = (difficulty: string, theme: any) => {
  return {
    color: getDifficultyColor(difficulty, theme),
  };
};

// Star Rating Component
interface StarRatingProps {
  starsEarned: number;
  maxStars: number;
  size?: number;
  showCount?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  starsEarned, 
  maxStars, 
  size = 12, 
  showCount = false 
}) => {
  const { theme } = useTheme();
  
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {Array.from({ length: maxStars }).map((_, index) => (
        <Ionicons
          key={index}
          name={index < starsEarned ? "star" : "star-outline"}
          size={size}
          color={index < starsEarned ? theme.colors.status.warning : theme.colors.text.tertiary}
          style={{ marginLeft: index > 0 ? 2 : 0 }}
        />
      ))}
      {showCount && (
        <Text style={{ 
          color: theme.colors.text.tertiary, 
          fontSize: theme.fontSizes.xs, 
          marginLeft: theme.spacing.xs 
        }}>
          {starsEarned}/{maxStars}
        </Text>
      )}
    </View>
  );
};

// Mock curriculum data - structured as requested
// Helper function to calculate module stars and completed lessons
const calculateModuleStats = (sections: Section[]) => {
  let totalStars = 0;
  let earnedStars = 0;
  let completedLessons = 0;
  let totalLessons = 0;

  sections.forEach(section => {
    section.lessons.forEach(lesson => {
      totalLessons++;
      totalStars += lesson.maxStars;
      earnedStars += lesson.starsEarned;
      
      // Count lesson as completed if it has at least 2 stars earned
      if (lesson.starsEarned >= 2) {
        completedLessons++;
      }
    });
  });

  return {
    totalStars,
    earnedStars,
    completedLessons,
    totalLessons,
  };
};

const getMockCurriculumData = (courseId: string): CourseCurriculum => {
  return {
    id: courseId,
    title: 'Learn to Swim',
    subtitle: 'Complete Beginner Swimming Program',
    overallProgress: 65,
    currentLevel: 2,
    totalLevels: 7,
    levels: [
      {
        id: '1',
        title: 'Level 1: Water Familiarization',
        shortTitle: 'Level 1',
        description: 'Getting comfortable in water and basic safety skills',
        difficulty: 'Beginner',
        totalModules: 5,
        completedModules: 5,
        progress: 100,
        isCurrentLevel: false,
        isCompleted: true,
        isUnlocked: true,
        assessment: {
          id: 'level-1-assessment',
          title: 'Level 1 Final Assessment',
          description: 'Comprehensive evaluation of water safety, comfort, and basic movement skills',
          totalItems: 8,
          completedItems: 8,
          totalStars: 24,
          earnedStars: 22,
          overallScore: 92,
          isCompleted: true,
          isUnlocked: true,
          items: [
            {
              id: 'safety-rules',
              title: 'Water Safety Knowledge',
              description: 'Demonstrate understanding of pool safety rules and emergency procedures',
              starsEarned: 3,
              maxStars: 3,
              isCompleted: true,
            },
            {
              id: 'pool-entry-exit',
              title: 'Safe Pool Entry & Exit',
              description: 'Show proper techniques for entering and exiting the pool safely',
              starsEarned: 3,
              maxStars: 3,
              isCompleted: true,
            },
            {
              id: 'face-submersion',
              title: 'Face Submersion Comfort',
              description: 'Comfortable with face in water and brief submersion',
              starsEarned: 2,
              maxStars: 3,
              isCompleted: true,
            },
            {
              id: 'breathing-control',
              title: 'Basic Breathing Control',
              description: 'Demonstrate bubble blowing and breath holding skills',
              starsEarned: 3,
              maxStars: 3,
              isCompleted: true,
            },
            {
              id: 'back-floating',
              title: 'Back Float Skills',
              description: 'Float on back independently for 30 seconds',
              starsEarned: 3,
              maxStars: 3,
              isCompleted: true,
            },
            {
              id: 'front-floating',
              title: 'Front Float Skills',
              description: 'Float face down and transition smoothly',
              starsEarned: 2,
              maxStars: 3,
              isCompleted: true,
            },
            {
              id: 'water-movement',
              title: 'Controlled Water Movement',
              description: 'Walk and move confidently in chest-deep water',
              starsEarned: 3,
              maxStars: 3,
              isCompleted: true,
            },
            {
              id: 'confidence-display',
              title: 'Overall Water Confidence',
              description: 'Show comfort and confidence in all water activities',
              starsEarned: 3,
              maxStars: 3,
              isCompleted: true,
            },
          ],
        },
        modules: [
          {
            id: '1-1',
            moduleNumber: 1,
            title: 'Water Safety & Pool Rules',
            description: 'Essential safety knowledge before entering the water',
            totalLessons: 7,
            completedLessons: 6, // 6 lessons have 2+ stars (one has 2 stars, rest have 3)
            progress: 100,
            estimatedTime: '2.5 hours',
            difficulty: 'Beginner',
            isUnlocked: true,
            totalStars: 21, // 7 lessons × 3 stars each
            earnedStars: 19, // 3+2+3+3+2+3+3 = 19 stars earned
            sections: [
              {
                id: '1-1-basics',
                title: 'Section 1',
                description: 'Fundamental pool safety knowledge',
                totalLessons: 3,
                completedLessons: 3,
                lessons: [
                  {
                    id: '1-1-1',
                    title: 'Pool Safety Rules',
                    description: 'Understanding basic pool safety and emergency procedures',
                    duration: '20 min',
                    type: 'theory',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Know pool rules', 'Identify emergency exits', 'Understand depth markers'],
                    starsEarned: 3,
                    maxStars: 3,
                  },
                  {
                    id: '1-1-2',
                    title: 'Emergency Recognition',
                    description: 'Identifying emergency situations and danger signs',
                    duration: '25 min',
                    type: 'theory',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Spot drowning signs', 'Recognize distress', 'Know emergency signals'],
                    starsEarned: 2,
                    maxStars: 3,
                  },
                  {
                    id: '1-1-3',
                    title: 'Pool Equipment Safety',
                    description: 'Safe use of pool equipment and facilities',
                    duration: '20 min',
                    type: 'theory',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Use equipment safely', 'Understand pool zones', 'Follow facility rules'],
                    starsEarned: 3,
                    maxStars: 3,
                  },
                ],
              },
              {
                id: '1-1-practice',
                title: 'Section 2',
                description: 'Practical safety skill application',
                totalLessons: 3,
                completedLessons: 3,
                lessons: [
                  {
                    id: '1-1-4',
                    title: 'Safe Pool Entry',
                    description: 'Practicing safe ways to enter the pool',
                    duration: '30 min',
                    type: 'practical',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Practice ladder entry', 'Learn pool side sitting', 'Understand depth awareness'],
                    starsEarned: 3,
                    maxStars: 3,
                  },
                  {
                    id: '1-1-5',
                    title: 'Emergency Signals Practice',
                    description: 'Practicing emergency hand signals and calls for help',
                    duration: '25 min',
                    type: 'practical',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Use hand signals', 'Call for help clearly', 'Get attention quickly'],
                    starsEarned: 2,
                    maxStars: 3,
                  },
                  {
                    id: '1-1-6',
                    title: 'Pool Exit Techniques',
                    description: 'Safe and efficient pool exit methods',
                    duration: '20 min',
                    type: 'practical',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Exit via ladder', 'Pool side push-up', 'Emergency exit'],
                    starsEarned: 3,
                    maxStars: 3,
                  },
                ],
              },
              {
                id: '1-1-assessment',
                title: 'Section 3',
                description: 'Testing water safety knowledge and skills',
                totalLessons: 1,
                completedLessons: 1,
                lessons: [
                  {
                    id: '1-1-7',
                    title: 'Water Safety Test',
                    description: 'Comprehensive assessment of safety knowledge and skills',
                    duration: '45 min',
                    type: 'assessment',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Pass safety quiz', 'Demonstrate emergency signals', 'Show proper pool entry/exit'],
                    starsEarned: 3,
                    maxStars: 3,
                  },
                ],
              },
            ],
          },
          {
            id: '1-2',
            moduleNumber: 2,
            title: 'Water Comfort & Breathing',
            description: 'Building confidence and learning to breathe in water',
            totalLessons: 8,
            completedLessons: 7, // 7 lessons have 2+ stars (one has 2 stars)
            progress: 100,
            estimatedTime: '3 hours',
            difficulty: 'Beginner',
            isUnlocked: true,
            totalStars: 24, // 8 lessons × 3 stars each
            earnedStars: 22, // 2+3+3+3+2+3+3+3 = 22 stars earned
            sections: [
              {
                id: '1-2-comfort',
                title: 'Section 1',
                description: 'Getting comfortable with water immersion',
                totalLessons: 3,
                completedLessons: 3,
                lessons: [
                  {
                    id: '1-2-1',
                    title: 'Face in Water',
                    description: 'Getting comfortable with face submersion',
                    duration: '30 min',
                    type: 'practical',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Hold breath underwater', 'Open eyes underwater', 'Stay calm submerged'],
                    starsEarned: 2,
                    maxStars: 3,
                  },
                  {
                    id: '1-2-2',
                    title: 'Water Relaxation',
                    description: 'Learning to relax and trust the water',
                    duration: '25 min',
                    type: 'practical',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Relax in water', 'Trust water support', 'Overcome anxiety'],
                    starsEarned: 3,
                    maxStars: 3,
                  },
                  {
                    id: '1-2-3',
                    title: 'Controlled Movement',
                    description: 'Moving confidently in shallow water',
                    duration: '35 min',
                    type: 'practical',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Walk in water', 'Turn around safely', 'Control movement'],
                    starsEarned: 3,
                    maxStars: 3,
                  },
                ],
              },
              {
                id: '1-2-breathing',
                title: 'Section 2',
                description: 'Learning proper breathing techniques',
                totalLessons: 3,
                completedLessons: 3,
                lessons: [
                  {
                    id: '1-2-4',
                    title: 'Blowing Bubbles',
                    description: 'Learning to exhale underwater',
                    duration: '25 min',
                    type: 'practical',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Blow bubbles through nose', 'Blow bubbles through mouth', 'Control exhalation'],
                    starsEarned: 3,
                    maxStars: 3,
                  },
                  {
                    id: '1-2-5',
                    title: 'Rhythmic Breathing',
                    description: 'Coordinating breathing with water immersion',
                    duration: '35 min',
                    type: 'practical',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Practice breathing pattern', 'Turn head for air', 'Maintain rhythm'],
                    starsEarned: 2,
                    maxStars: 3,
                  },
                  {
                    id: '1-2-6',
                    title: 'Breath Control',
                    description: 'Advanced breath control techniques',
                    duration: '30 min',
                    type: 'practical',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Hold breath longer', 'Control breathing rate', 'Stay calm underwater'],
                    starsEarned: 3,
                    maxStars: 3,
                  },
                ],
              },
              {
                id: '1-2-review',
                title: 'Section 3',
                description: 'Review and assessment of comfort and breathing skills',
                totalLessons: 2,
                completedLessons: 2,
                lessons: [
                  {
                    id: '1-2-7',
                    title: 'Comfort Review',
                    description: 'Review and practice water comfort skills',
                    duration: '20 min',
                    type: 'review',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Review all skills', 'Build confidence', 'Identify comfort level'],
                    starsEarned: 3,
                    maxStars: 3,
                  },
                  {
                    id: '1-2-8',
                    title: 'Breathing Skills Test',
                    description: 'Assessment of breathing and comfort skills',
                    duration: '30 min',
                    type: 'assessment',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Demonstrate proper breathing', 'Show water comfort', 'Pass skills test'],
                    starsEarned: 3,
                    maxStars: 3,
                  },
                ],
              },
            ],
          },
          // Module 3
          {
            id: '1-3',
            moduleNumber: 3,
            title: 'Basic Floating',
            description: 'Learning to float on front and back',
            totalLessons: 7,
            completedLessons: 6, // 6 lessons have 2+ stars
            progress: 100,
            estimatedTime: '2.5 hours',
            difficulty: 'Beginner',
            isUnlocked: true,
            totalStars: 21, // 7 lessons × 3 stars each
            earnedStars: 17, // Mixed performance with some 2-star lessons
            sections: [
              {
                id: '1-3-back',
                title: 'Section 1',
                description: 'Learning to float on your back',
                totalLessons: 3,
                completedLessons: 3,
                lessons: [
                  {
                    id: '1-3-1',
                    title: 'Back Float Introduction',
                    description: 'Learning to float on your back with support',
                    duration: '30 min',
                    type: 'practical',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Float with instructor support', 'Relax in water', 'Maintain body position'],
                    starsEarned: 3,
                    maxStars: 3,
                  },
                  {
                    id: '1-3-2',
                    title: 'Independent Back Float',
                    description: 'Floating on back without assistance',
                    duration: '40 min',
                    type: 'practical',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Float independently', 'Stay relaxed', 'Recover to standing'],
                    starsEarned: 3,
                    maxStars: 3,
                  },
                  {
                    id: '1-3-3',
                    title: 'Extended Back Float',
                    description: 'Floating for longer periods',
                    duration: '35 min',
                    type: 'practical',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Float for 30 seconds', 'Maintain calm', 'Control recovery'],
                    starsEarned: 2,
                    maxStars: 3,
                  },
                ],
              },
              {
                id: '1-3-front',
                title: 'Section 2',
                description: 'Learning to float face down',
                totalLessons: 3,
                completedLessons: 3,
                lessons: [
                  {
                    id: '1-3-4',
                    title: 'Front Float Basics',
                    description: 'Learning to float face down in water',
                    duration: '35 min',
                    type: 'practical',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Float face down', 'Hold breath comfortably', 'Maintain position'],
                    starsEarned: 2,
                    maxStars: 3,
                  },
                  {
                    id: '1-3-5',
                    title: 'Independent Front Float',
                    description: 'Front floating without support',
                    duration: '40 min',
                    type: 'practical',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Float independently', 'Control breathing', 'Stay relaxed'],
                    starsEarned: 3,
                    maxStars: 3,
                  },
                  {
                    id: '1-3-6',
                    title: 'Float Transitions',
                    description: 'Moving between front and back float',
                    duration: '30 min',
                    type: 'practical',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Switch positions smoothly', 'Maintain control', 'Stay calm during transition'],
                    starsEarned: 2,
                    maxStars: 3,
                  },
                ],
              },
              {
                id: '1-3-test',
                title: 'Section 3',
                description: 'Testing floating abilities',
                totalLessons: 1,
                completedLessons: 1,
                lessons: [
                  {
                    id: '1-3-7',
                    title: 'Floating Skills Assessment',
                    description: 'Test your floating abilities',
                    duration: '25 min',
                    type: 'assessment',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Demonstrate back float', 'Show front float', 'Maintain for required time'],
                    starsEarned: 3,
                    maxStars: 3,
                  },
                ],
              },
            ],
          },
          // Module 4
          {
            id: '1-4',
            moduleNumber: 4,
            title: 'Basic Water Movement',
            description: 'Learning to move through water confidently',
            totalLessons: 8,
            completedLessons: 7, // 7 lessons have 2+ stars
            progress: 100,
            estimatedTime: '3 hours',
            difficulty: 'Beginner',
            isUnlocked: true,
            totalStars: 24, // 8 lessons × 3 stars each
            earnedStars: 20, // Good performance across lessons
            sections: [
              {
                id: '1-4-walking',
                title: 'Section 1',
                description: 'Walking and moving in water',
                totalLessons: 3,
                completedLessons: 3,
                lessons: [
                  {
                    id: '1-4-1',
                    title: 'Shallow Water Walking',
                    description: 'Walking confidently in shallow water',
                    duration: '25 min',
                    type: 'practical',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Walk in chest-deep water', 'Maintain balance', 'Move with confidence'],
                    starsEarned: 3,
                    maxStars: 3,
                  },
                  {
                    id: '1-4-2',
                    title: 'Direction Changes',
                    description: 'Changing direction while moving in water',
                    duration: '30 min',
                    type: 'practical',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Turn left and right', 'Walk backwards', 'Move sideways'],
                    starsEarned: 2,
                    maxStars: 3,
                  },
                  {
                    id: '1-4-3',
                    title: 'Speed Control',
                    description: 'Controlling movement speed in water',
                    duration: '25 min',
                    type: 'practical',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Walk slowly', 'Move quickly', 'Stop and start smoothly'],
                    starsEarned: 3,
                    maxStars: 3,
                  },
                ],
              },
              {
                id: '1-4-submerging',
                title: 'Section 2',
                description: 'Comfortable submersion and recovery',
                totalLessons: 3,
                completedLessons: 3,
                lessons: [
                  {
                    id: '1-4-4',
                    title: 'Controlled Submersion',
                    description: 'Going underwater and coming back up',
                    duration: '35 min',
                    type: 'practical',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Submerge completely', 'Stay calm underwater', 'Surface smoothly'],
                    starsEarned: 2,
                    maxStars: 3,
                  },
                  {
                    id: '1-4-5',
                    title: 'Underwater Comfort',
                    description: 'Being comfortable while submerged',
                    duration: '30 min',
                    type: 'practical',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Open eyes underwater', 'Move underwater', 'Stay relaxed'],
                    starsEarned: 3,
                    maxStars: 3,
                  },
                  {
                    id: '1-4-6',
                    title: 'Recovery Techniques',
                    description: 'Different ways to return to standing',
                    duration: '25 min',
                    type: 'practical',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Stand from floating', 'Recover from submersion', 'Maintain orientation'],
                    starsEarned: 2,
                    maxStars: 3,
                  },
                ],
              },
              {
                id: '1-4-review',
                title: 'Section 3',
                description: 'Review and assessment of movement skills',
                totalLessons: 2,
                completedLessons: 2,
                lessons: [
                  {
                    id: '1-4-7',
                    title: 'Movement Skills Review',
                    description: 'Practice all water movement skills',
                    duration: '30 min',
                    type: 'review',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Review all movements', 'Build confidence', 'Prepare for next level'],
                    starsEarned: 3,
                    maxStars: 3,
                  },
                  {
                    id: '1-4-8',
                    title: 'Level 1 Final Assessment',
                    description: 'Comprehensive test of all Level 1 skills',
                    duration: '45 min',
                    type: 'assessment',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Pass all skill tests', 'Demonstrate confidence', 'Qualify for Level 2'],
                    starsEarned: 3,
                    maxStars: 3,
                  },
                ],
              },
            ],
          },
          // Module 5
          {
            id: '1-5',
            moduleNumber: 5,
            title: 'Water Confidence Building',
            description: 'Building overall confidence and preparation for Level 2',
            totalLessons: 6,
            completedLessons: 5, // 5 lessons have 2+ stars
            progress: 100,
            estimatedTime: '2.5 hours',
            difficulty: 'Beginner',
            isUnlocked: true,
            totalStars: 18, // 6 lessons × 3 stars each
            earnedStars: 16, // Strong finish to Level 1
            sections: [
              {
                id: '1-5-games',
                title: 'Section 1',
                description: 'Fun activities to build confidence',
                totalLessons: 3,
                completedLessons: 3,
                lessons: [
                  {
                    id: '1-5-1',
                    title: 'Ring Toss Game',
                    description: 'Fun games to practice submersion',
                    duration: '30 min',
                    type: 'practical',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Retrieve rings underwater', 'Have fun in water', 'Build confidence'],
                    starsEarned: 3,
                    maxStars: 3,
                  },
                  {
                    id: '1-5-2',
                    title: 'Red Light Green Light',
                    description: 'Movement game for water control',
                    duration: '25 min',
                    type: 'practical',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Control movement speed', 'Follow instructions', 'Practice stopping'],
                    starsEarned: 2,
                    maxStars: 3,
                  },
                  {
                    id: '1-5-3',
                    title: 'Follow the Leader',
                    description: 'Group activity for water movement',
                    duration: '30 min',
                    type: 'practical',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Copy movements', 'Work in group', 'Try new movements'],
                    starsEarned: 3,
                    maxStars: 3,
                  },
                ],
              },
              {
                id: '1-5-challenges',
                title: 'Section 2',
                description: 'Gentle challenges to test skills',
                totalLessons: 2,
                completedLessons: 2,
                lessons: [
                  {
                    id: '1-5-4',
                    title: 'Floating Contest',
                    description: 'Challenge to float for time',
                    duration: '25 min',
                    type: 'practical',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Float for 1 minute', 'Compete with others', 'Show improvement'],
                    starsEarned: 2,
                    maxStars: 3,
                  },
                  {
                    id: '1-5-5',
                    title: 'Treasure Hunt',
                    description: 'Finding objects in shallow water',
                    duration: '30 min',
                    type: 'practical',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Search underwater', 'Use problem solving', 'Work independently'],
                    starsEarned: 3,
                    maxStars: 3,
                  },
                ],
              },
              {
                id: '1-5-celebration',
                title: 'Section 3',
                description: 'Celebrating Level 1 completion',
                totalLessons: 1,
                completedLessons: 1,
                lessons: [
                  {
                    id: '1-5-6',
                    title: 'Level 1 Graduation',
                    description: 'Celebration and preparation for Level 2',
                    duration: '30 min',
                    type: 'review',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Celebrate achievement', 'Review progress', 'Preview Level 2'],
                    starsEarned: 3,
                    maxStars: 3,
                  },
                ],
              },
            ],
          },
        ],
      },
      // Level 2 (Current Level)
      {
        id: '2',
        title: 'Level 2: Basic Swimming Skills',
        shortTitle: 'Level 2',
        description: 'Learning fundamental swimming strokes and techniques',
        difficulty: 'Intermediate',
        totalModules: 5,
        completedModules: 2,
        progress: 65,
        isCurrentLevel: true,
        isCompleted: false,
        isUnlocked: true,
        assessment: {
          id: 'level-2-assessment',
          title: 'Level 2 Progress Assessment',
          description: 'Evaluation of swimming stroke development and technique progression',
          totalItems: 10,
          completedItems: 4,
          totalStars: 30,
          earnedStars: 11,
          overallScore: 37,
          isCompleted: false,
          isUnlocked: true,
          items: [
            {
              id: 'flutter-kick',
              title: 'Flutter Kick Technique',
              description: 'Demonstrate proper flutter kick with kickboard',
              starsEarned: 3,
              maxStars: 3,
              isCompleted: true,
            },
            {
              id: 'kick-endurance',
              title: 'Kicking Endurance',
              description: 'Sustain flutter kick for 25 meters with proper form',
              starsEarned: 2,
              maxStars: 3,
              isCompleted: true,
            },
            {
              id: 'arm-stroke-basic',
              title: 'Basic Arm Stroke',
              description: 'Show proper freestyle arm motion and hand entry',
              starsEarned: 2,
              maxStars: 3,
              isCompleted: true,
            },
            {
              id: 'arm-coordination',
              title: 'Arm Coordination',
              description: 'Coordinate left and right arm movements smoothly',
              starsEarned: 2,
              maxStars: 3,
              isCompleted: true,
            },
            {
              id: 'breathing-timing',
              title: 'Breathing with Strokes',
              description: 'Integrate breathing pattern with arm movements',
              starsEarned: 1,
              maxStars: 3,
              isCompleted: false,
            },
            {
              id: 'full-stroke-combo',
              title: 'Complete Stroke Integration',
              description: 'Combine arms, legs, and breathing in freestyle',
              starsEarned: 0,
              maxStars: 3,
              isCompleted: false,
            },
            {
              id: 'distance-swimming',
              title: '25 Meter Freestyle',
              description: 'Swim 25 meters using proper freestyle technique',
              starsEarned: 0,
              maxStars: 3,
              isCompleted: false,
            },
            {
              id: 'backstroke-basics',
              title: 'Basic Backstroke',
              description: 'Demonstrate backstroke body position and arm motion',
              starsEarned: 0,
              maxStars: 3,
              isCompleted: false,
            },
            {
              id: 'backstroke-distance',
              title: '15 Meter Backstroke',
              description: 'Swim 15 meters backstroke with proper technique',
              starsEarned: 0,
              maxStars: 3,
              isCompleted: false,
            },
            {
              id: 'stroke-confidence',
              title: 'Swimming Confidence',
              description: 'Show confidence in both freestyle and backstroke',
              starsEarned: 1,
              maxStars: 3,
              isCompleted: false,
            },
          ],
        },
        modules: [
          {
            id: '2-1',
            moduleNumber: 1,
            title: 'Kicking Fundamentals',
            description: 'Developing proper kicking technique',
            totalLessons: 7,
            completedLessons: 6, // 6 lessons have 2+ stars
            progress: 100,
            estimatedTime: '3 hours',
            difficulty: 'Beginner',
            isUnlocked: true,
            totalStars: 21, // 7 lessons × 3 stars each
            earnedStars: 17, // 2+3+2+2+3+2+3 = 17 stars earned
            sections: [
              {
                id: '2-1-basics',
                title: 'Section 1',
                description: 'Learning fundamental kicking motion',
                totalLessons: 3,
                completedLessons: 3,
                lessons: [
                  {
                    id: '2-1-1',
                    title: 'Flutter Kick Introduction',
                    description: 'Learning the basic flutter kick motion',
                    duration: '30 min',
                    type: 'practical',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Learn kick motion', 'Practice with kickboard', 'Develop rhythm'],
                    starsEarned: 2,
                    maxStars: 3,
                  },
                  {
                    id: '2-1-2',
                    title: 'Leg Position',
                    description: 'Proper leg position for effective kicking',
                    duration: '25 min',
                    type: 'practical',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Keep legs straight', 'Point toes', 'Maintain body position'],
                    starsEarned: 3,
                    maxStars: 3,
                  },
                  {
                    id: '2-1-3',
                    title: 'Kick Rhythm',
                    description: 'Developing consistent kicking rhythm',
                    duration: '30 min',
                    type: 'practical',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Count kick beats', 'Maintain steady rhythm', 'Coordinate movements'],
                    starsEarned: 2,
                    maxStars: 3,
                  },
                ],
              },
              {
                id: '2-1-breathing',
                title: 'Section 2',
                description: 'Combining kicking with proper breathing',
                totalLessons: 3,
                completedLessons: 3,
                lessons: [
                  {
                    id: '2-1-4',
                    title: 'Kick and Breathe',
                    description: 'Combining kicking with breathing pattern',
                    duration: '35 min',
                    type: 'practical',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Kick while breathing', 'Maintain steady rhythm', 'Keep body position'],
                    starsEarned: 2,
                    maxStars: 3,
                  },
                  {
                    id: '2-1-5',
                    title: 'Head Position',
                    description: 'Proper head position while kicking',
                    duration: '25 min',
                    type: 'practical',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Keep head still', 'Look down', 'Breathe to side'],
                    starsEarned: 3,
                    maxStars: 3,
                  },
                  {
                    id: '2-1-6',
                    title: 'Endurance Building',
                    description: 'Building stamina for sustained kicking',
                    duration: '40 min',
                    type: 'practical',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Kick for longer periods', 'Maintain technique', 'Build leg strength'],
                    starsEarned: 2,
                    maxStars: 3,
                  },
                ],
              },
              {
                id: '2-1-test',
                title: 'Section 3',
                description: 'Testing kicking skills',
                totalLessons: 1,
                completedLessons: 1,
                lessons: [
                  {
                    id: '2-1-7',
                    title: 'Kicking Skills Test',
                    description: 'Assessment of kicking technique and endurance',
                    duration: '35 min',
                    type: 'assessment',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Demonstrate proper kick', 'Show endurance', 'Pass technique test'],
                    starsEarned: 3,
                    maxStars: 3,
                  },
                ],
              },
            ],
          },
          {
            id: '2-2',
            moduleNumber: 2,
            title: 'Arm Movements & Coordination',
            description: 'Learning proper arm stroke technique',
            totalLessons: 8,
            completedLessons: 4, // 4 lessons have 2+ stars (3 incomplete have 0-1 stars)
            progress: 63,
            estimatedTime: '4 hours',
            difficulty: 'Intermediate',
            isUnlocked: true,
            totalStars: 24, // 8 lessons × 3 stars each
            earnedStars: 11, // 2+2+3+2+2+1+0+0 = 12 stars earned (in progress)
            sections: [
              {
                id: '2-2-arms',
                title: 'Section 1',
                description: 'Basic freestyle arm stroke',
                totalLessons: 3,
                completedLessons: 3,
                lessons: [
                  {
                    id: '2-2-1',
                    title: 'Freestyle Arm Motion',
                    description: 'Basic freestyle arm stroke technique',
                    duration: '40 min',
                    type: 'practical',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Learn arm motion', 'Practice stroke technique', 'Develop muscle memory'],
                    starsEarned: 2,
                    maxStars: 3,
                  },
                  {
                    id: '2-2-2',
                    title: 'Hand Entry',
                    description: 'Proper hand entry into water',
                    duration: '35 min',
                    type: 'practical',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Enter thumb first', 'Reach forward', 'Minimize splash'],
                    starsEarned: 2,
                    maxStars: 3,
                  },
                  {
                    id: '2-2-3',
                    title: 'Pull Phase',
                    description: 'Effective underwater pull technique',
                    duration: '45 min',
                    type: 'practical',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Catch water effectively', 'Pull straight back', 'Use whole arm'],
                    starsEarned: 3,
                    maxStars: 3,
                  },
                ],
              },
              {
                id: '2-2-coordination',
                title: 'Section 2',
                description: 'Coordinating left and right arm movements',
                totalLessons: 3,
                completedLessons: 2,
                lessons: [
                  {
                    id: '2-2-4',
                    title: 'Alternating Arms',
                    description: 'Coordinating left and right arm movements',
                    duration: '35 min',
                    type: 'practical',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Alternate arms smoothly', 'Maintain timing', 'Develop coordination'],
                    starsEarned: 2,
                    maxStars: 3,
                  },
                  {
                    id: '2-2-5',
                    title: 'Stroke Timing',
                    description: 'Proper timing between arm movements',
                    duration: '40 min',
                    type: 'practical',
                    isCompleted: true,
                    progress: 100,
                    objectives: ['Time strokes correctly', 'Avoid gaps', 'Maintain momentum'],
                    starsEarned: 2,
                    maxStars: 3,
                  },
                  {
                    id: '2-2-6',
                    title: 'Breathing Integration',
                    description: 'Adding breathing to arm movements',
                    duration: '50 min',
                    type: 'practical',
                    isCompleted: false,
                    progress: 30,
                    objectives: ['Breathe with stroke', 'Don\'t disrupt timing', 'Stay relaxed'],
                    starsEarned: 1,
                    maxStars: 3,
                  },
                ],
              },
              {
                id: '2-2-assessment',
                title: 'Section 3',
                description: 'Assessment of arm technique',
                totalLessons: 2,
                completedLessons: 0,
                lessons: [
                  {
                    id: '2-2-7',
                    title: 'Technique Review',
                    description: 'Review and refinement of arm technique',
                    duration: '30 min',
                    type: 'review',
                    isCompleted: false,
                    progress: 0,
                    objectives: ['Review all techniques', 'Identify improvements', 'Practice weak areas'],
                    starsEarned: 0,
                    maxStars: 3,
                  },
                  {
                    id: '2-2-8',
                    title: 'Arm Technique Test',
                    description: 'Evaluation of arm stroke technique',
                    duration: '30 min',
                    type: 'assessment',
                    isCompleted: false,
                    progress: 0,
                    objectives: ['Demonstrate proper technique', 'Show coordination', 'Pass skills test'],
                    starsEarned: 0,
                    maxStars: 3,
                  },
                ],
              },
            ],
          },
          // Remaining 3 modules for Level 2 (locked/incomplete)
          {
            id: '2-3',
            moduleNumber: 3,
            title: 'Full Stroke Integration',
            description: 'Combining all elements into complete freestyle',
            totalLessons: 9,
            completedLessons: 0, // No lessons completed yet
            progress: 0,
            estimatedTime: '5 hours',
            difficulty: 'Intermediate',
            isUnlocked: false,
            totalStars: 27, // 9 lessons × 3 stars each
            earnedStars: 0, // Not yet started
            sections: [
              {
                id: '2-3-integration',
                title: 'Section 1',
                description: 'Combining arms, legs, and breathing',
                totalLessons: 3,
                completedLessons: 0,
                lessons: [
                  {
                    id: '2-3-1',
                    title: 'Arms and Legs Together',
                    description: 'Coordinating arm strokes with kicking',
                    duration: '45 min',
                    type: 'practical',
                    isCompleted: false,
                    progress: 0,
                    objectives: ['Synchronize movements', 'Maintain rhythm', 'Swim continuously'],
                    starsEarned: 0,
                    maxStars: 3,
                  },
                  {
                    id: '2-3-2',
                    title: 'Body Position',
                    description: 'Maintaining proper body alignment',
                    duration: '40 min',
                    type: 'practical',
                    isCompleted: false,
                    progress: 0,
                    objectives: ['Stay horizontal', 'Reduce drag', 'Maintain streamline'],
                    starsEarned: 0,
                    maxStars: 3,
                  },
                  {
                    id: '2-3-3',
                    title: 'Breathing Coordination',
                    description: 'Adding breathing to full stroke',
                    duration: '50 min',
                    type: 'practical',
                    isCompleted: false,
                    progress: 0,
                    objectives: ['Breathe naturally', 'Don\'t stop stroke', 'Maintain rhythm'],
                    starsEarned: 0,
                    maxStars: 3,
                  },
                ],
              },
              {
                id: '2-3-distance',
                title: 'Section 2',
                description: 'Swimming longer distances',
                totalLessons: 3,
                completedLessons: 0,
                lessons: [
                  {
                    id: '2-3-4',
                    title: '10 Meter Swim',
                    description: 'Swimming 10 meters with proper technique',
                    duration: '35 min',
                    type: 'practical',
                    isCompleted: false,
                    progress: 0,
                    objectives: ['Swim 10 meters', 'Maintain technique', 'No stopping'],
                    starsEarned: 0,
                    maxStars: 3,
                  },
                  {
                    id: '2-3-5',
                    title: '25 Meter Challenge',
                    description: 'Swimming full pool length',
                    duration: '45 min',
                    type: 'practical',
                    isCompleted: false,
                    progress: 0,
                    objectives: ['Swim 25 meters', 'Good technique', 'Build endurance'],
                    starsEarned: 0,
                    maxStars: 3,
                  },
                  {
                    id: '2-3-6',
                    title: 'Endurance Building',
                    description: 'Building stamina for longer swims',
                    duration: '60 min',
                    type: 'practical',
                    isCompleted: false,
                    progress: 0,
                    objectives: ['Swim multiple lengths', 'Pace yourself', 'Stay consistent'],
                    starsEarned: 0,
                    maxStars: 3,
                  },
                ],
              },
              {
                id: '2-3-refinement',
                title: 'Section 3',
                description: 'Polishing and improving stroke',
                totalLessons: 3,
                completedLessons: 0,
                lessons: [
                  {
                    id: '2-3-7',
                    title: 'Stroke Analysis',
                    description: 'Analyzing and improving technique',
                    duration: '40 min',
                    type: 'review',
                    isCompleted: false,
                    progress: 0,
                    objectives: ['Identify weaknesses', 'Make corrections', 'Practice improvements'],
                    starsEarned: 0,
                    maxStars: 3,
                  },
                  {
                    id: '2-3-8',
                    title: 'Efficiency Focus',
                    description: 'Making stroke more efficient',
                    duration: '45 min',
                    type: 'practical',
                    isCompleted: false,
                    progress: 0,
                    objectives: ['Reduce effort', 'Increase speed', 'Improve technique'],
                    starsEarned: 0,
                    maxStars: 3,
                  },
                  {
                    id: '2-3-9',
                    title: 'Full Stroke Assessment',
                    description: 'Comprehensive test of freestyle stroke',
                    duration: '50 min',
                    type: 'assessment',
                    isCompleted: false,
                    progress: 0,
                    objectives: ['Pass technique test', 'Swim required distance', 'Demonstrate skills'],
                    starsEarned: 0,
                    maxStars: 3,
                  },
                ],
              },
            ],
          },
          {
            id: '2-4',
            moduleNumber: 4,
            title: 'Backstroke Introduction',
            description: 'Learning basic backstroke technique',
            totalLessons: 7,
            completedLessons: 0, // No lessons completed yet
            progress: 0,
            estimatedTime: '3.5 hours',
            difficulty: 'Intermediate',
            isUnlocked: false,
            totalStars: 21, // 7 lessons × 3 stars each
            earnedStars: 0, // Not yet started
            sections: [
              {
                id: '2-4-position',
                title: 'Section 1',
                description: 'Proper backstroke body position',
                totalLessons: 3,
                completedLessons: 0,
                lessons: [
                  {
                    id: '2-4-1',
                    title: 'Back Floating Position',
                    description: 'Proper body position for backstroke',
                    duration: '30 min',
                    type: 'practical',
                    isCompleted: false,
                    progress: 0,
                    objectives: ['Float on back', 'Keep hips up', 'Head still'],
                  },
                  {
                    id: '2-4-2',
                    title: 'Body Alignment',
                    description: 'Maintaining straight body line',
                    duration: '35 min',
                    type: 'practical',
                    isCompleted: false,
                    progress: 0,
                    objectives: ['Stay straight', 'Avoid sinking', 'Maintain position'],
                  },
                  {
                    id: '2-4-3',
                    title: 'Head Position',
                    description: 'Correct head position for backstroke',
                    duration: '25 min',
                    type: 'practical',
                    isCompleted: false,
                    progress: 0,
                    objectives: ['Look straight up', 'Ears underwater', 'Stay relaxed'],
                  },
                ],
              },
              {
                id: '2-4-arms',
                title: 'Section 2',
                description: 'Backstroke arm technique',
                totalLessons: 3,
                completedLessons: 0,
                lessons: [
                  {
                    id: '2-4-4',
                    title: 'Arm Motion',
                    description: 'Basic backstroke arm movement',
                    duration: '40 min',
                    type: 'practical',
                    isCompleted: false,
                    progress: 0,
                    objectives: ['Straight arm recovery', 'Enter pinky first', 'Pull underwater'],
                  },
                  {
                    id: '2-4-5',
                    title: 'Arm Timing',
                    description: 'Coordinating left and right arms',
                    duration: '35 min',
                    type: 'practical',
                    isCompleted: false,
                    progress: 0,
                    objectives: ['Alternate arms', 'Opposite timing', 'Smooth rhythm'],
                  },
                  {
                    id: '2-4-6',
                    title: 'Full Backstroke',
                    description: 'Complete backstroke with arms and legs',
                    duration: '45 min',
                    type: 'practical',
                    isCompleted: false,
                    progress: 0,
                    objectives: ['Coordinate all parts', 'Swim continuously', 'Maintain form'],
                  },
                ],
              },
              {
                id: '2-4-assessment',
                title: 'Section 3',
                description: 'Assessment of backstroke skills',
                totalLessons: 1,
                completedLessons: 0,
                lessons: [
                  {
                    id: '2-4-7',
                    title: 'Backstroke Skills Test',
                    description: 'Test backstroke technique and distance',
                    duration: '30 min',
                    type: 'assessment',
                    isCompleted: false,
                    progress: 0,
                    objectives: ['Show proper technique', 'Swim 15 meters', 'Pass skills test'],
                  },
                ],
              },
            ],
          },
          {
            id: '2-5',
            moduleNumber: 5,
            title: 'Stroke Confidence & Endurance',
            description: 'Building confidence and endurance in both strokes',
            totalLessons: 6,
            completedLessons: 0, // No lessons completed yet
            progress: 0,
            estimatedTime: '3 hours',
            difficulty: 'Intermediate',
            isUnlocked: false,
            totalStars: 18, // 6 lessons × 3 stars each
            earnedStars: 0, // Not yet started
            sections: [
              {
                id: '2-5-confidence',
                title: 'Section 1',
                description: 'Building confidence in swimming abilities',
                totalLessons: 3,
                completedLessons: 0,
                lessons: [
                  {
                    id: '2-5-1',
                    title: 'Freestyle Confidence',
                    description: 'Swimming freestyle with confidence',
                    duration: '35 min',
                    type: 'practical',
                    isCompleted: false,
                    progress: 0,
                    objectives: ['Swim without fear', 'Trust technique', 'Enjoy swimming'],
                  },
                  {
                    id: '2-5-2',
                    title: 'Backstroke Confidence',
                    description: 'Backstroke swimming with confidence',
                    duration: '35 min',
                    type: 'practical',
                    isCompleted: false,
                    progress: 0,
                    objectives: ['Relax on back', 'Swim smoothly', 'Build endurance'],
                  },
                  {
                    id: '2-5-3',
                    title: 'Stroke Selection',
                    description: 'Choosing between freestyle and backstroke',
                    duration: '30 min',
                    type: 'practical',
                    isCompleted: false,
                    progress: 0,
                    objectives: ['Switch between strokes', 'Know when to use each', 'Swim efficiently'],
                  },
                ],
              },
              {
                id: '2-5-endurance',
                title: 'Section 2',
                description: 'Building stamina and endurance',
                totalLessons: 2,
                completedLessons: 0,
                lessons: [
                  {
                    id: '2-5-4',
                    title: 'Longer Distances',
                    description: 'Swimming longer distances continuously',
                    duration: '45 min',
                    type: 'practical',
                    isCompleted: false,
                    progress: 0,
                    objectives: ['Swim 50 meters', 'Pace yourself', 'Don\'t stop'],
                  },
                  {
                    id: '2-5-5',
                    title: 'Endurance Challenge',
                    description: 'Swimming endurance test',
                    duration: '50 min',
                    type: 'practical',
                    isCompleted: false,
                    progress: 0,
                    objectives: ['Swim multiple lengths', 'Maintain form', 'Build stamina'],
                  },
                ],
              },
              {
                id: '2-5-graduation',
                title: 'Section 3',
                description: 'Celebrating Level 2 achievement',
                totalLessons: 1,
                completedLessons: 0,
                lessons: [
                  {
                    id: '2-5-6',
                    title: 'Level 2 Final Test',
                    description: 'Comprehensive Level 2 assessment',
                    duration: '60 min',
                    type: 'assessment',
                    isCompleted: false,
                    progress: 0,
                    objectives: ['Pass all requirements', 'Demonstrate both strokes', 'Qualify for Level 3'],
                  },
                ],
              },
            ],
          },
        ],
      },
      // Level 3 (Locked)
      {
        id: '3',
        title: 'Level 3: Advanced Techniques',
        shortTitle: 'Level 3',
        description: 'Mastering advanced swimming skills and stroke refinement',
        difficulty: 'Intermediate',
        totalModules: 5,
        completedModules: 0,
        progress: 0,
        isCurrentLevel: false,
        isCompleted: false,
        isUnlocked: false,
        modules: [],
      },
      // Level 4 (Locked)
      {
        id: '4',
        title: 'Level 4: Competitive Strokes',
        shortTitle: 'Level 4',
        description: 'Learning competitive swimming techniques and turns',
        difficulty: 'Intermediate',
        totalModules: 5,
        completedModules: 0,
        progress: 0,
        isCurrentLevel: false,
        isCompleted: false,
        isUnlocked: false,
        modules: [],
      },
      // Level 5 (Locked)
      {
        id: '5',
        title: 'Level 5: Speed & Endurance',
        shortTitle: 'Level 5',
        description: 'Building swimming speed, endurance, and training techniques',
        difficulty: 'Advanced',
        totalModules: 5,
        completedModules: 0,
        progress: 0,
        isCurrentLevel: false,
        isCompleted: false,
        isUnlocked: false,
        modules: [],
      },
      // Level 6 (Locked)
      {
        id: '6',
        title: 'Level 6: Advanced Training',
        shortTitle: 'Level 6',
        description: 'Advanced training methods and performance optimization',
        difficulty: 'Advanced',
        totalModules: 5,
        completedModules: 0,
        progress: 0,
        isCurrentLevel: false,
        isCompleted: false,
        isUnlocked: false,
        modules: [],
      },
      // Level 7 (Locked)
      {
        id: '7',
        title: 'Level 7: Expert Mastery',
        shortTitle: 'Level 7',
        description: 'Expert level techniques and coaching fundamentals',
        difficulty: 'Advanced',
        totalModules: 5,
        completedModules: 0,
        progress: 0,
        isCurrentLevel: false,
        isCompleted: false,
        isUnlocked: false,
        modules: [],
      },
    ],
  };
};

interface LessonCardProps {
  lesson: Lesson;
  onLessonPress: (lesson: Lesson) => void;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, onLessonPress }) => {
  const { theme } = useTheme();
  const styles = useScreenStyles();

  const iconStyles = {
    theory: styles.theoryLessonIcon,
    practical: styles.practicalLessonIcon,
    assessment: styles.assessmentLessonIcon,
    review: styles.reviewLessonIcon,
  };

  return (
    <Pressable
      style={[
        styles.lessonCard,
        lesson.isCompleted && styles.completedLessonCard
      ]}
      onPress={() => onLessonPress(lesson)}
    >
      <View style={styles.lessonHeader}>
        <View style={[styles.lessonIcon, iconStyles[lesson.type]]}>
          <Ionicons
            name={getLessonTypeIcon(lesson.type) as any}
            size={16}
            color={getLessonTypeColor(lesson.type, theme)}
          />
        </View>

        <View style={styles.lessonContent}>
          <Text style={styles.lessonTitle}>{lesson.title}</Text>
          <Text style={styles.lessonDescription}>{lesson.description}</Text>
        </View>

        <View style={styles.statusIcon}>
          {lesson.progress > 0 || lesson.isCompleted ? (
            <Ionicons name="play-circle-outline" size={24} color={theme.colors.interactive.primary} />
          ) : (
            <Ionicons name="lock-closed-outline" size={20} color={theme.colors.text.tertiary} />
          )}
        </View>
      </View>

      <View style={styles.lessonMeta}>
        <Text style={styles.lessonDuration}>{lesson.duration}</Text>
        <View style={styles.lessonStars}>
          <StarRating 
            starsEarned={lesson.starsEarned} 
            maxStars={lesson.maxStars} 
            size={12} 
          />
        </View>
        {lesson.isCompleted && (
          <View style={styles.completionIndicator}>
            <Ionicons name="checkmark-circle" size={12} color={theme.colors.status.success} />
            <Text style={styles.completedText}>Completed</Text>
          </View>
        )}
        {lesson.progress > 0 && lesson.progress < 100 && (
          <View style={styles.lessonProgress}>
            <Ionicons name="time-outline" size={12} color={theme.colors.text.tertiary} />
            <Text style={styles.lessonProgressText}>{lesson.progress}%</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

interface ModuleCardProps {
  module: Module;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onLessonPress: (lesson: Lesson) => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  isExpanded,
  onToggleExpand,
  onLessonPress
}) => {
  const { theme } = useTheme();
  const styles = useScreenStyles();
  const rotation = useSharedValue(0);
  const [activeSection, setActiveSection] = useState(module.sections[0]?.id || '');


  const animatedIconStyle = useAnimatedStyle(() => {
    rotation.value = withSpring(isExpanded ? 180 : 0);
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const currentSection = module.sections.find(section => section.id === activeSection);

  return (
    <View style={[
      styles.moduleCard,
      !module.isUnlocked && styles.lockedModuleCard
    ]}>
      <Pressable style={styles.moduleHeader} onPress={onToggleExpand}>
        <View style={styles.moduleInfo}>
          <Text style={styles.moduleTitle}>Module {module.moduleNumber}: {module.title}</Text>
          <Text style={styles.moduleDescription}>{module.description}</Text>
          <View style={styles.moduleMetrics}>
            <View style={styles.metricItem}>
              <Ionicons name="book-outline" size={12} color={theme.colors.text.tertiary} />
              <Text style={styles.metricText}>{module.completedLessons}/{module.totalLessons} lessons</Text>
            </View>
            <View style={styles.metricItem}>
              <Ionicons name="star" size={12} color={theme.colors.status.warning} />
              <Text style={styles.metricText}>{module.earnedStars}/{module.totalStars} stars</Text>
            </View>
            {module.progress > 0 && (
              <View style={styles.metricItem}>
                <Ionicons name="checkmark-circle-outline" size={12} color={theme.colors.status.success} />
                <Text style={styles.metricText}>{module.progress}%</Text>
              </View>
            )}
          </View>
        </View>
        <Animated.View style={[styles.expandButton, animatedIconStyle]}>
          <Ionicons name="chevron-down" size={20} color={theme.colors.text.secondary} />
        </Animated.View>
      </Pressable>

      {isExpanded && module.sections.length > 0 && (
        <Animated.View
          entering={FadeInDown.duration(300)}
          style={styles.moduleContent}
        >
          {/* Section Tabs */}
          {module.sections.length > 1 && (
            <View style={styles.sectionTabs}>
              {module.sections.map((section) => (
                <Pressable
                  key={section.id}
                  style={[
                    styles.sectionTab,
                    activeSection === section.id && styles.activeSectionTab
                  ]}
                  onPress={() => setActiveSection(section.id)}
                >
                  <Text style={[
                    styles.sectionTabText,
                    activeSection === section.id && styles.activeSectionTabText
                  ]}>
                    {section.title}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}

          {/* Section Description */}
          {currentSection && currentSection.description && (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionDescription}>{currentSection.description}</Text>
            </View>
          )}

          {/* Section Content */}
          {currentSection && (
            <View style={styles.sectionContent}>
              {currentSection.lessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  onLessonPress={onLessonPress}
                />
              ))}
            </View>
          )}
        </Animated.View>
      )}
    </View>
  );
};

/**
 * Course Curriculum Screen - Restructured with level filters and module sections
 * 
 * Features:
 * - Level filter tabs at top
 * - Module cards for selected level (5 modules per level)
 * - Expandable modules with 2-3 section tabs
 * - Lesson cards within each section (~3 lessons per section)
 * - Progress tracking at all levels
 * - Interactive expandable content
 */
export const CourseCurriculumScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = useScreenStyles();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<CourseCurriculumRouteProp>();
  const { courseId } = route.params;

  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [isAssessmentExpanded, setIsAssessmentExpanded] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('2'); // Start with current level
  
  const assessmentRotation = useSharedValue(0);

  // Get curriculum data
  const curriculum = useMemo(() => getMockCurriculumData(courseId), [courseId]);

  // Get current level data
  const currentLevel = curriculum.levels.find(level => level.id === selectedLevel);

  // Assessment arrow animation
  const assessmentAnimatedIconStyle = useAnimatedStyle(() => {
    assessmentRotation.value = withSpring(isAssessmentExpanded ? 180 : 0);
    return {
      transform: [{ rotate: `${assessmentRotation.value}deg` }],
    };
  });

  const handleToggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const handleToggleAssessment = () => {
    setIsAssessmentExpanded(prev => !prev);
  };

  const handleLessonPress = (lesson: Lesson) => {
    console.log('Open lesson details:', lesson.title);
    // Navigate to lesson detail screen or open lesson content
  };

  const getLevelTabStyle = (level: CourseLevel, isSelected: boolean) => {
    if (isSelected) return styles.activeLevelFilterTab;
    if (level.isCompleted) return styles.completedLevelFilterTab;
    if (!level.isUnlocked) return styles.lockedLevelFilterTab;
    return {};
  };

  return (
    <View style={styles.container}>
      <NavigationHeader
        title="Course Curriculum"
        onBackPress={() => navigation.goBack()}
        style={{ paddingTop: insets.top }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: insets.bottom + theme.spacing.lg }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Course Header */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.courseHeader}>
          <Text style={styles.courseTitle}>{curriculum.title}</Text>
          <Text style={styles.courseSubtitle}>{curriculum.subtitle}</Text>
          
          <View style={styles.progressSection}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressLabel}>Overall Progress</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${curriculum.overallProgress}%` }
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {curriculum.overallProgress}% • Level {curriculum.currentLevel} of {curriculum.totalLevels}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Level Filter Bar (Swipeable) */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.levelFilterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.levelFilterScrollView}
          >
            {curriculum.levels.map((level) => (
              <Pressable
                key={level.id}
                style={[
                  styles.levelFilterTab,
                  getLevelTabStyle(level, selectedLevel === level.id)
                ]}
                onPress={() => setSelectedLevel(level.id)}
              >
                <Text style={[
                  styles.levelFilterText,
                  selectedLevel === level.id && styles.activeLevelFilterText
                ]}>
                  {level.shortTitle}
                  {level.isCurrentLevel && (
                    <Text style={[
                      styles.currentLevelIndicator,
                      selectedLevel === level.id && styles.activeLevelFilterText
                    ]}>
                      {' • Current'}
                    </Text>
                  )}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Current Level Info */}
        {currentLevel && (
          <Animated.View entering={FadeInDown.delay(400)}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.xs }}>
              <Text style={styles.sectionTitle}>{currentLevel.title}</Text>
              <View style={[styles.difficultyBadge, getDifficultyBadgeStyle(currentLevel.difficulty, theme)]}>
                <Text style={[styles.difficultyBadgeText, getDifficultyTextStyle(currentLevel.difficulty, theme)]}>
                  {currentLevel.difficulty}
                </Text>
              </View>
            </View>
            <Text style={[styles.courseSubtitle, { marginBottom: theme.spacing.lg }]}>
              {currentLevel.description} • {currentLevel.completedModules}/{currentLevel.totalModules} modules completed
            </Text>
          </Animated.View>
        )}

        {/* Module Cards */}
        {currentLevel?.modules.map((module, index) => (
          <Animated.View
            key={module.id}
            entering={FadeInDown.delay(500 + index * 100)}
          >
            <ModuleCard
              module={module}
              isExpanded={expandedModules.has(module.id)}
              onToggleExpand={() => handleToggleModule(module.id)}
              onLessonPress={handleLessonPress}
            />
          </Animated.View>
        ))}

        {/* Level Assessment Card */}
        {currentLevel?.assessment && (
          <Animated.View
            entering={FadeInDown.delay(600)}
            style={styles.assessmentCard}
          >
            <Pressable style={styles.assessmentHeader} onPress={handleToggleAssessment}>
              <View style={styles.assessmentInfo}>
                <Text style={styles.assessmentTitle}>{currentLevel.assessment.title}</Text>
                <Text style={styles.assessmentDescription}>
                  {currentLevel.assessment.description}
                </Text>
                <View style={styles.assessmentStats}>
                  <View style={styles.assessmentStat}>
                    <Ionicons name="document-text-outline" size={16} color={theme.colors.text.secondary} />
                    <Text style={styles.assessmentStatText}>
                      {currentLevel.assessment.completedItems}/{currentLevel.assessment.totalItems} items
                    </Text>
                  </View>
                  <View style={styles.assessmentStat}>
                    <Ionicons name="star" size={14} color={theme.colors.status.warning} />
                    <Text style={styles.assessmentStatText}>
                      {currentLevel.assessment.earnedStars}/{currentLevel.assessment.totalStars} stars
                    </Text>
                  </View>
                  {currentLevel.assessment.isCompleted && (
                    <View style={styles.assessmentScore}>
                      <Text style={styles.assessmentScoreText}>
                        {currentLevel.assessment.overallScore}%
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              <Animated.View style={[styles.expandButton, assessmentAnimatedIconStyle]}>
                <Ionicons name="chevron-down" size={20} color={theme.colors.text.secondary} />
              </Animated.View>
            </Pressable>
            
            {isAssessmentExpanded && (
              <Animated.View 
                entering={FadeInDown.duration(300)}
                style={styles.assessmentContent}
              >
                {currentLevel.assessment.items.map((item, index) => (
                  <View
                    key={item.id}
                    style={[
                      styles.assessmentItem,
                      item.isCompleted && styles.completedAssessmentItem
                    ]}
                  >
                    <View style={styles.assessmentItemContent}>
                      <Text style={styles.assessmentItemTitle}>
                        {index + 1}. {item.title}
                      </Text>
                      <Text style={styles.assessmentItemDescription}>
                        {item.description}
                      </Text>
                    </View>
                    <View style={styles.assessmentItemStars}>
                      <StarRating 
                        starsEarned={item.starsEarned} 
                        maxStars={item.maxStars} 
                        size={14} 
                      />
                    </View>
                  </View>
                ))}
              </Animated.View>
            )}
          </Animated.View>
        )}

        {/* Empty state for locked levels */}
        {currentLevel && !currentLevel.isUnlocked && (
          <Animated.View
            entering={FadeInDown.delay(500)}
            style={[styles.courseHeader, { alignItems: 'center', paddingVertical: theme.spacing.xl }]}
          >
            <Ionicons name="lock-closed-outline" size={64} color={theme.colors.text.tertiary} />
            <Text style={[styles.moduleTitle, { textAlign: 'center', marginTop: theme.spacing.lg }]}>
              {currentLevel.title} is Locked
            </Text>
            <Text style={[styles.moduleDescription, { textAlign: 'center', marginTop: theme.spacing.sm }]}>
              {currentLevel.description}
            </Text>
            <Text style={[styles.moduleDescription, { 
              textAlign: 'center', 
              marginTop: theme.spacing.md,
              color: theme.colors.interactive.primary,
              fontWeight: theme.fontConfig.fontWeight.medium 
            }]}>
              Complete previous levels to unlock this content.
            </Text>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
};