import React, { useState, useMemo } from 'react';
import { View,
  Text,
  ScrollView,
  Pressable,
  useWindowDimensions,
  Dimensions,
  StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInRight,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme, createThemedStyles, Header } from '@academy/mobile-shared';

const { width } = Dimensions.get('window');

interface SkillProgress {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  description: string;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
  lastUpdated: string;
}

interface CourseProgress {
  id: string;
  title: string;
  level: string;
  overallProgress: number;
  completedSessions: number;
  totalSessions: number;
  skills: SkillProgress[];
  color: string;
  nextMilestone: string;
}

interface ProgressCardProps {
  course: CourseProgress;
  index: number;
  onPress: (course: CourseProgress) => void;
}

interface SkillCardProps {
  skill: SkillProgress;
  index: number;
}

const useSkillCardStyles = createThemedStyles((theme) => StyleSheet.create({
  container: {
    width: width * 0.7,
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.md,
    marginRight: theme.spacing.md,
    ...theme.elevation.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  content: {
    flex: 1,
  },
  skillName: {
    color: theme.colors.text.primary,
    fontWeight: theme.fontConfig.fontWeight.semibold,
    fontSize: theme.fontSizes.base,
  },
  skillDescription: {
    color: theme.colors.text.secondary,
    fontSize: theme.fontSizes.sm,
    marginTop: theme.spacing.xs,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    marginBottom: theme.spacing.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  progressLabel: {
    color: theme.colors.text.secondary,
    fontSize: theme.fontSizes.xs,
  },
  progressLevel: {
    color: theme.colors.text.secondary,
    fontSize: theme.fontSizes.xs,
  },
  progressBar: {
    backgroundColor: theme.colors.border.primary,
    borderRadius: theme.borderRadius.full,
    height: 8,
  },
  progressFill: {
    height: 8,
    borderRadius: theme.borderRadius.full,
  },
  lastUpdated: {
    color: theme.colors.text.tertiary,
    fontSize: theme.fontSizes.xs,
  },
}));

const SkillCard: React.FC<SkillCardProps> = ({ skill, index }) => {
  const { theme } = useTheme();
  const styles = useSkillCardStyles();
  const progress = (skill.level / skill.maxLevel) * 100;
  
  return (
    <Animated.View
      entering={FadeInRight.delay(index * 100).springify()}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.content}>
          <Text style={styles.skillName}>{skill.name}</Text>
          <Text style={styles.skillDescription}>{skill.description}</Text>
        </View>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: `${skill.color}15` }
          ]}
        >
          <Ionicons name={skill.icon} size={20} color={skill.color} />
        </View>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Level Progress</Text>
          <Text style={styles.progressLevel}>
            Level {skill.level} of {skill.maxLevel}
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progress}%`,
                backgroundColor: skill.color,
              }
            ]}
          />
        </View>
      </View>
      
      <Text style={styles.lastUpdated}>
        Updated {skill.lastUpdated}
      </Text>
    </Animated.View>
  );
};

const useProgressCardStyles = createThemedStyles((theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    ...theme.elevation.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    color: theme.colors.text.primary,
    fontWeight: theme.fontConfig.fontWeight.bold,
    fontSize: theme.fontSizes.lg,
    marginBottom: theme.spacing.xs,
  },
  level: {
    color: theme.colors.text.secondary,
    fontSize: theme.fontSizes.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressSection: {
    marginBottom: theme.spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  progressLabel: {
    color: theme.colors.text.secondary,
    fontSize: theme.fontSizes.sm,
  },
  progressValue: {
    color: theme.colors.text.primary,
    fontWeight: theme.fontConfig.fontWeight.semibold,
    fontSize: theme.fontSizes.sm,
  },
  progressBar: {
    backgroundColor: theme.colors.border.primary,
    borderRadius: theme.borderRadius.full,
    height: 12,
  },
  progressFill: {
    height: 12,
    borderRadius: theme.borderRadius.full,
  },
  sessionProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  sessionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionText: {
    color: theme.colors.text.secondary,
    fontSize: theme.fontSizes.sm,
    marginLeft: theme.spacing.xs,
  },
  skillsPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  skillsText: {
    color: theme.colors.text.primary,
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontConfig.fontWeight.medium,
  },
  skillIcons: {
    flexDirection: 'row',
  },
  skillIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -4,
    borderWidth: 2,
    borderColor: 'white',
  },
  milestone: {
    backgroundColor: theme.colors.status.infoBackground,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.sm,
  },
  milestoneContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  milestoneText: {
    color: theme.colors.interactive.accent,
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontConfig.fontWeight.medium,
    marginLeft: theme.spacing.xs,
  },
}));

const ProgressCard: React.FC<ProgressCardProps> = ({ course, index, onPress }) => {
  const { theme } = useTheme();
  const styles = useProgressCardStyles();
  const scale = useSharedValue(1);

  // Simplified for web compatibility
  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).springify()}
    >
      <Pressable
        onPress={() => onPress(course)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.container}
      >
        <View style={styles.header}>
          <View style={styles.content}>
            <Text style={styles.title}>
              {course.title}
            </Text>
            <Text style={styles.level}>{course.level}</Text>
          </View>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: `${course.color}15` }
            ]}
          >
            <Ionicons name="water" size={24} color={course.color} />
          </View>
        </View>

        {/* Overall Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Overall Progress</Text>
            <Text style={styles.progressValue}>
              {course.overallProgress}%
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${course.overallProgress}%`,
                  backgroundColor: course.color,
                }
              ]}
            />
          </View>
        </View>

        {/* Session Progress */}
        <View style={styles.sessionProgress}>
          <View style={styles.sessionInfo}>
            <Ionicons name="calendar-outline" size={16} color={theme.colors.icon.secondary} />
            <Text style={styles.sessionText}>
              {course.completedSessions}/{course.totalSessions} sessions completed
            </Text>
          </View>
        </View>

        {/* Skills Preview */}
        <View style={styles.skillsPreview}>
          <Text style={styles.skillsText}>
            {course.skills.length} skills tracked
          </Text>
          <View style={styles.skillIcons}>
            {course.skills.slice(0, 3).map((skill, idx) => (
              <View
                key={idx}
                style={[
                  styles.skillIcon,
                  { backgroundColor: skill.color }
                ]}
              >
                <Ionicons name={skill.icon} size={12} color="white" />
              </View>
            ))}
            {course.skills.length > 3 && (
              <View style={[
                styles.skillIcon,
                { backgroundColor: theme.colors.icon.tertiary }
              ]}>
                <Text style={{
                  color: 'white',
                  fontSize: theme.fontSizes.xs,
                  fontWeight: theme.fontConfig.fontWeight.bold,
                }}>
                  +{course.skills.length - 3}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Next Milestone */}
        <View style={styles.milestone}>
          <View style={styles.milestoneContent}>
            <Ionicons name="flag-outline" size={16} color={theme.colors.interactive.accent} />
            <Text style={styles.milestoneText}>
              Next: {course.nextMilestone}
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const useScreenStyles = createThemedStyles((theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  title: {
    color: theme.colors.text.primary,
    fontSize: theme.fontSizes['2xl'],
    fontWeight: theme.fontConfig.fontWeight.bold,
  },
  subtitle: {
    color: theme.colors.text.secondary,
    fontSize: theme.fontSizes.base,
    marginTop: theme.spacing.xs,
  },
  periodSelector: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  periodButton: {
    marginRight: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  periodButtonInactive: {
    backgroundColor: theme.colors.background.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  periodButtonText: {
    fontWeight: theme.fontConfig.fontWeight.medium,
  },
  statsOverview: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.md,
    flex: 1,
    ...theme.elevation.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  statCardLeft: {
    marginRight: theme.spacing.xs,
  },
  statCardRight: {
    marginLeft: theme.spacing.xs,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    color: theme.colors.text.secondary,
    fontSize: theme.fontSizes.sm,
  },
  statValue: {
    color: theme.colors.text.primary,
    fontSize: theme.fontSizes['2xl'],
    fontWeight: theme.fontConfig.fontWeight.bold,
  },
  statChange: {
    color: theme.colors.status.success,
    fontSize: theme.fontSizes.sm,
    marginTop: theme.spacing.xs,
  },
  sectionHeader: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontConfig.fontWeight.semibold,
  },
  viewAllButton: {
    color: theme.colors.interactive.accent,
    fontWeight: theme.fontConfig.fontWeight.medium,
    fontSize: theme.fontSizes.sm,
  },
  courseProgressTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontConfig.fontWeight.semibold,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  quickActions: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.md,
    flex: 1,
    alignItems: 'center',
    ...theme.elevation.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  actionButtonLeft: {
    marginRight: theme.spacing.xs,
  },
  actionButtonCenter: {
    marginHorizontal: theme.spacing.xs,
  },
  actionButtonRight: {
    marginLeft: theme.spacing.xs,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xs,
  },
  actionText: {
    color: theme.colors.text.primary,
    fontWeight: theme.fontConfig.fontWeight.medium,
    fontSize: theme.fontSizes.sm,
    textAlign: 'center',
  },
}));

/**
 * Progress Screen - Student Progress Tracking (Simplified)
 * 
 * Features:
 * - Course progress overview
 * - Individual skill tracking
 * - Achievement highlights
 * - Progress trends
 * - Goal setting and milestones
 * - Instructor feedback
 */
export const ProgressScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = useScreenStyles();
  const insets = useSafeAreaInsets();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('month');
  const [notificationCount, setNotificationCount] = useState(1);

  // Mock progress data
  const courseProgress: CourseProgress[] = [
    {
      id: '1',
      title: 'Learn to Swim',
      level: 'Beginner Level 2',
      overallProgress: 65,
      completedSessions: 5,
      totalSessions: 8,
      color: theme.colors.interactive.accent,
      nextMilestone: 'Master freestyle breathing',
      skills: [
        {
          id: '1',
          name: 'Floating',
          level: 4,
          maxLevel: 5,
          description: 'Front and back floating',
          color: theme.colors.status.success,
          icon: 'leaf-outline',
          lastUpdated: '2 days ago',
        },
        {
          id: '2',
          name: 'Breathing',
          level: 3,
          maxLevel: 5,
          description: 'Rhythmic breathing technique',
          color: theme.colors.interactive.accent,
          icon: 'refresh-outline',
          lastUpdated: '1 week ago',
        },
        {
          id: '3',
          name: 'Freestyle',
          level: 2,
          maxLevel: 5,
          description: 'Basic stroke coordination',
          color: theme.colors.status.warning,
          icon: 'fitness-outline',
          lastUpdated: '3 days ago',
        },
        {
          id: '4',
          name: 'Water Safety',
          level: 5,
          maxLevel: 5,
          description: 'Pool safety and rescue basics',
          color: theme.colors.status.error,
          icon: 'shield-outline',
          lastUpdated: '1 day ago',
        },
      ],
    },
    {
      id: '2',
      title: 'Swimming Club',
      level: 'Intermediate Training',
      overallProgress: 30,
      completedSessions: 2,
      totalSessions: 12,
      color: theme.colors.status.success,
      nextMilestone: 'Complete first time trial',
      skills: [
        {
          id: '5',
          name: 'Endurance',
          level: 2,
          maxLevel: 5,
          description: 'Swimming distance and stamina',
          color: theme.colors.status.success,
          icon: 'fitness-outline',
          lastUpdated: '3 days ago',
        },
        {
          id: '6',
          name: 'Technique',
          level: 3,
          maxLevel: 5,
          description: 'Stroke refinement',
          color: theme.colors.interactive.purple,
          icon: 'sparkles-outline',
          lastUpdated: '5 days ago',
        },
      ],
    },
  ];

  const periods = [
    { key: 'week' as const, label: 'This Week' },
    { key: 'month' as const, label: 'This Month' },
    { key: 'all' as const, label: 'All Time' },
  ];

  const handleCoursePress = (course: CourseProgress) => {
    console.log('Navigate to course progress detail:', course.id);
  };

  const totalSkills = courseProgress.reduce((acc, course) => acc + course.skills.length, 0);
  const masterSkills = courseProgress.reduce((acc, course) => 
    acc + course.skills.filter(skill => skill.level === skill.maxLevel).length, 0
  );
  const handleSearch = () => {
    console.log('Search pressed');
  };

  const handleFilter = () => {
    console.log('Filter pressed');
  };

  const handleNotifications = () => {
    console.log('Notifications pressed');
    setNotificationCount(0);
  };

  const avgProgress = Math.round(
    courseProgress.reduce((acc, course) => acc + course.overallProgress, 0) / courseProgress.length
  );

  return (
    <View style={styles.container}>
      {/* Header with Program Switcher */}
      <Header
        title="Progress"
        showProgramSwitcher={true}
        showNotifications={true}
        onNotificationPress={handleNotifications}
        notificationCount={notificationCount}
        showProfile={false}
        style={{ paddingTop: insets.top }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{
          paddingTop: theme.spacing.lg,
          paddingBottom: theme.spacing.xxl, // Space for tab bar
        }}
        showsVerticalScrollIndicator={false}
      >

        {/* Period Selector */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={styles.periodSelector}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 24 }}
          >
            {periods.map(period => (
              <Pressable
                key={period.key}
                onPress={() => setSelectedPeriod(period.key)}
                style={[
                  styles.periodButton,
                  selectedPeriod !== period.key && styles.periodButtonInactive,
                  {
                    backgroundColor: selectedPeriod === period.key ? theme.colors.interactive.accent : undefined
                  }
                ]}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    {
                      color: selectedPeriod === period.key
                        ? 'white'
                        : theme.colors.text.secondary,
                    }
                  ]}
                >
                  {period.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Stats Overview */}
        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          style={styles.statsOverview}
        >
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, styles.statCardLeft]}>
              <View style={styles.statHeader}>
                <Text style={styles.statLabel}>Avg Progress</Text>
                <Ionicons name="trending-up" size={16} color={theme.colors.status.success} />
              </View>
              <Text style={styles.statValue}>{avgProgress}%</Text>
              <Text style={styles.statChange}>+12% this month</Text>
            </View>

            <View style={[styles.statCard, styles.statCardRight]}>
              <View style={styles.statHeader}>
                <Text style={styles.statLabel}>Skills Mastered</Text>
                <Ionicons name="trophy" size={16} color={theme.colors.status.warning} />
              </View>
              <Text style={styles.statValue}>{masterSkills}</Text>
              <Text style={[styles.statChange, { color: theme.colors.text.secondary }]}>of {totalSkills} skills</Text>
            </View>
          </View>
        </Animated.View>

        {/* Featured Skills */}
        <View style={{ marginBottom: theme.spacing.xl }}>
          <Animated.View
            entering={FadeInDown.delay(400).springify()}
            style={styles.sectionHeader}
          >
            <View style={styles.sectionHeaderContainer}>
              <Text style={styles.sectionTitle}>
                Recent Skill Updates
              </Text>
              <Pressable>
                <Text style={styles.viewAllButton}>View All</Text>
              </Pressable>
            </View>
          </Animated.View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: theme.spacing.lg }}
          >
            {courseProgress[0]?.skills.map((skill, index) => (
              <SkillCard key={skill.id} skill={skill} index={index} />
            ))}
          </ScrollView>
        </View>

        {/* Course Progress */}
        <View style={{ marginBottom: theme.spacing.xl }}>
          <Animated.Text
            entering={FadeInDown.delay(500).springify()}
            style={styles.courseProgressTitle}
          >
            Course Progress
          </Animated.Text>
          
          {courseProgress.map((course, index) => (
            <ProgressCard
              key={course.id}
              course={course}
              index={index}
              onPress={handleCoursePress}
            />
          ))}
        </View>

        {/* Quick Actions */}
        <Animated.View
          entering={FadeInDown.delay(600).springify()}
          style={styles.quickActions}
        >
          <Text style={styles.sectionTitle}>
            Quick Actions
          </Text>
          <View style={styles.quickActionsContainer}>
            <Pressable style={[styles.actionButton, styles.actionButtonLeft]}>
              <View style={[
                styles.actionIconContainer,
                { backgroundColor: `${theme.colors.interactive.purple}15` }
              ]}>
                <Ionicons name="trophy" size={24} color={theme.colors.interactive.purple} />
              </View>
              <Text style={styles.actionText}>View Achievements</Text>
            </Pressable>
            
            <Pressable style={[styles.actionButton, styles.actionButtonCenter]}>
              <View style={[
                styles.actionIconContainer,
                { backgroundColor: `${theme.colors.interactive.accent}15` }
              ]}>
                <Ionicons name="flag" size={24} color={theme.colors.interactive.accent} />
              </View>
              <Text style={styles.actionText}>Set Goals</Text>
            </Pressable>
            
            <Pressable style={[styles.actionButton, styles.actionButtonRight]}>
              <View style={[
                styles.actionIconContainer,
                { backgroundColor: `${theme.colors.status.success}15` }
              ]}>
                <Ionicons name="bar-chart" size={24} color={theme.colors.status.success} />
              </View>
              <Text style={styles.actionText}>Progress Report</Text>
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};