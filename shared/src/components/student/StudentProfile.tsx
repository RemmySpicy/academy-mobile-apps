import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  useWindowDimensions,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, createThemedStyles } from '../../theme/ThemeProvider';

// Student profile data interface
export interface StudentProfileData {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  avatarUrl?: string;
  backgroundImageUrl?: string;
  
  // Academic information
  level: string;
  currentClass: string;
  overallRating: {
    current: number;
    total: number;
  };
  
  // Contacts
  parent?: {
    name: string;
    avatarUrl?: string;
  };
  instructor?: {
    name: string;
    avatarUrl?: string;
  };
  
  // Progress data
  progressSummary: {
    currentTerm: string;
    improvedLessons: number;
    earnedStars: number;
    newAchievements: number;
    watermanshipPoints: number;
  };
  
  // Timeline activities
  timeline: Array<{
    id: string;
    type: 'lesson' | 'performance';
    title: string;
    subtitle: string;
    gainLoss: number;
    currentValue: number;
    isPositive: boolean;
    icon: 'star' | 'swim';
  }>;
  
  // Attendance data
  attendance: {
    present: number;
    remaining: number;
    totalSessions: number;
  };
  
  // Achievements
  achievements: Array<{
    id: string;
    title: string;
    date: string;
    iconType: 'ten' | 'twenty' | 'thirty';
  }>;
}

export interface StudentProfileProps {
  visible: boolean;
  onClose: () => void;
  student: StudentProfileData;
  onEditProfile?: () => void;
  onViewPerformanceMetrics?: () => void;
  onContactParent?: () => void;
  onContactInstructor?: () => void;
  onViewAllAchievements?: () => void;
}

const StudentProfile: React.FC<StudentProfileProps> = ({
  visible,
  onClose,
  student,
  onEditProfile,
  onViewPerformanceMetrics,
  onContactParent,
  onContactInstructor,
  onViewAllAchievements,
}) => {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const styles = useThemedStyles();
  const [currentTermIndex, setCurrentTermIndex] = useState(0);

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={onClose}
        style={styles.backButton}
        accessibilityRole="button"
        accessibilityLabel="Close student profile"
      >
        <Ionicons 
          name="arrow-back" 
          size={24} 
          color={theme.colors.text.primary} 
        />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Student Profile</Text>
      <View style={styles.headerSpacer} />
    </View>
  );

  const renderProfileSection = () => (
    <View style={styles.profileContainer}>
      <View style={styles.profileCard}>
        {/* Profile image section */}
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImage}>
            {student.avatarUrl ? (
              <Image
                source={{ uri: student.avatarUrl }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons 
                  name="person-outline" 
                  size={24} 
                  color={theme.colors.text.tertiary} 
                />
              </View>
            )}
          </View>
          <TouchableOpacity 
            style={styles.cameraButton}
            onPress={onEditProfile}
            accessibilityRole="button"
            accessibilityLabel="Edit profile picture"
          >
            <Ionicons 
              name="camera-outline" 
              size={16} 
              color={theme.colors.text.secondary} 
            />
          </TouchableOpacity>
        </View>

        {/* Background camera button */}
        <TouchableOpacity 
          style={styles.backgroundCameraButton}
          onPress={onEditProfile}
          accessibilityRole="button"
          accessibilityLabel="Edit background image"
        >
          <Ionicons 
            name="camera-outline" 
            size={16} 
            color={theme.colors.text.secondary} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.profileInfo}>
        <View style={styles.nameContainer}>
          <Text style={styles.studentName}>
            {student.firstName} {student.lastName}
          </Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={onEditProfile}
            accessibilityRole="button"
            accessibilityLabel="Edit profile information"
          >
            <Ionicons 
              name="create-outline" 
              size={14} 
              color={theme.colors.text.secondary} 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.levelContainer}>
          <Ionicons 
            name="trophy-outline" 
            size={22} 
            color={theme.colors.interactive.primary} 
          />
          <View style={styles.levelInfo}>
            <Text style={styles.levelText}>{student.level}</Text>
            <Text style={styles.classText}>{student.currentClass}</Text>
          </View>
        </View>

        <View style={styles.ratingContainer}>
          <Ionicons 
            name="star" 
            size={16} 
            color={theme.colors.status.warning} 
          />
          <Text style={styles.ratingText}>
            {student.overallRating.current} / {student.overallRating.total}
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.performanceButton}
          onPress={onViewPerformanceMetrics}
          accessibilityRole="button"
          accessibilityLabel="View performance metrics"
        >
          <Ionicons 
            name="analytics-outline" 
            size={22} 
            color={theme.colors.interactive.primary} 
          />
          <Text style={styles.performanceButtonText}>
            See Performance metrics
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderContactsSection = () => (
    <View style={styles.contactsContainer}>
      {student.parent && (
        <TouchableOpacity 
          style={styles.contactCard}
          onPress={onContactParent}
          accessibilityRole="button"
          accessibilityLabel={`Contact parent ${student.parent.name}`}
        >
          {student.parent.avatarUrl ? (
            <Image
              source={{ uri: student.parent.avatarUrl }}
              style={styles.contactImage}
            />
          ) : (
            <View style={[styles.contactImage, styles.contactImagePlaceholder]}>
              <Ionicons 
                name="person-outline" 
                size={16} 
                color={theme.colors.text.tertiary} 
              />
            </View>
          )}
          <View style={styles.contactInfo}>
            <Text style={styles.contactRole}>Parent</Text>
            <Text style={styles.contactName}>{student.parent.name}</Text>
          </View>
        </TouchableOpacity>
      )}

      {student.instructor && (
        <TouchableOpacity 
          style={styles.contactCard}
          onPress={onContactInstructor}
          accessibilityRole="button"
          accessibilityLabel={`Contact instructor ${student.instructor.name}`}
        >
          {student.instructor.avatarUrl ? (
            <Image
              source={{ uri: student.instructor.avatarUrl }}
              style={styles.contactImage}
            />
          ) : (
            <View style={[styles.contactImage, styles.contactImagePlaceholder]}>
              <Ionicons 
                name="person-outline" 
                size={16} 
                color={theme.colors.text.tertiary} 
              />
            </View>
          )}
          <View style={styles.contactInfo}>
            <Text style={styles.contactRole}>Instructor</Text>
            <Text style={styles.contactName}>{student.instructor.name}</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderProgressSection = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Progress Summary</Text>
      
      <View style={styles.termContainer}>
        <View style={styles.termSelector}>
          <Text style={styles.termText}>
            {student.progressSummary.currentTerm}
          </Text>
          <View style={styles.termNavigation}>
            <TouchableOpacity 
              style={styles.termNavButton}
              onPress={() => setCurrentTermIndex(Math.max(0, currentTermIndex - 1))}
              accessibilityRole="button"
              accessibilityLabel="Previous term"
            >
              <Ionicons 
                name="chevron-back" 
                size={15} 
                color={theme.colors.text.primary} 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.termNavButton}
              onPress={() => setCurrentTermIndex(currentTermIndex + 1)}
              accessibilityRole="button"
              accessibilityLabel="Next term"
            >
              <Ionicons 
                name="chevron-forward" 
                size={15} 
                color={theme.colors.text.primary} 
              />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.overviewTitle}>Overview</Text>
        <View style={styles.overviewGrid}>
          <View style={styles.overviewItem}>
            <View style={styles.overviewIcon}>
              <Ionicons 
                name="water-outline" 
                size={16} 
                color={theme.colors.interactive.primary} 
              />
            </View>
            <View style={styles.overviewContent}>
              <Text style={styles.overviewValue}>
                {student.progressSummary.improvedLessons}
              </Text>
              <Text style={styles.overviewLabel}>Improved Lessons</Text>
            </View>
          </View>

          <View style={styles.overviewItem}>
            <View style={styles.overviewIcon}>
              <MaterialCommunityIcons
                name="star"
                size={16}
                color={theme.colors.status.warning}
              />
            </View>
            <View style={styles.overviewContent}>
              <Text style={styles.overviewValue}>
                {student.progressSummary.earnedStars}
              </Text>
              <Text style={styles.overviewLabel}>Earned Stars</Text>
            </View>
          </View>

          <View style={styles.overviewItem}>
            <View style={styles.overviewIcon}>
              <Ionicons 
                name="trophy-outline" 
                size={16} 
                color={theme.colors.interactive.primary} 
              />
            </View>
            <View style={styles.overviewContent}>
              <Text style={styles.overviewValue}>
                {student.progressSummary.newAchievements}
              </Text>
              <Text style={styles.overviewLabel}>New Achievements</Text>
            </View>
          </View>

          <View style={styles.overviewItem}>
            <View style={styles.overviewIcon}>
              <Ionicons 
                name="water-outline" 
                size={16} 
                color={theme.colors.interactive.primary} 
              />
            </View>
            <View style={styles.overviewContent}>
              <Text style={styles.overviewValue}>
                {student.progressSummary.watermanshipPoints}
              </Text>
              <Text style={styles.overviewLabel}>Watermanship Points</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderTimelineSection = () => (
    <View style={styles.timelineContainer}>
      <Text style={styles.timelineTitle}>Timeline</Text>
      <View style={styles.timelineCard}>
        <View style={styles.timelineHeader}>
          <Text style={styles.timelineHeaderText}>Activity</Text>
          <View style={styles.timelineHeaderRight}>
            <Text style={styles.timelineHeaderText}>Gain/Loss</Text>
            <Text style={styles.timelineHeaderText}>Current</Text>
          </View>
        </View>

        {student.timeline.map((item) => (
          <View key={item.id} style={styles.timelineItem}>
            <View style={styles.timelineItemLeft}>
              <View style={styles.timelineIconContainer}>
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={theme.colors.interactive.primary}
                />
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineItemTitle}>{item.title}</Text>
                <Text style={styles.timelineItemSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
            <View style={styles.timelineItemRight}>
              <View style={styles.diffIndicator}>
                <Text
                  style={[
                    styles.diffText,
                    {
                      color: item.isPositive
                        ? theme.colors.status.success
                        : theme.colors.status.error,
                    },
                  ]}
                >
                  {item.isPositive ? '+' : ''}{item.gainLoss}
                </Text>
              </View>
              <View style={styles.currentRating}>
                {item.icon === 'star' ? (
                  <MaterialCommunityIcons
                    name="star"
                    size={16}
                    color={theme.colors.status.warning}
                  />
                ) : (
                  <Ionicons 
                    name="water-outline" 
                    size={16} 
                    color={theme.colors.interactive.primary} 
                  />
                )}
                <Text style={styles.currentRatingText}>{item.currentValue}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderAttendanceSection = () => (
    <View style={styles.attendanceContainer}>
      <Text style={styles.attendanceTitle}>Attendance</Text>
      <View style={styles.attendanceStats}>
        <Text style={styles.attendanceStat}>
          Attendance: {student.attendance.present}
        </Text>
        <Text style={styles.attendanceStat}>
          Remaining: {student.attendance.remaining}
        </Text>
        <Text style={styles.attendanceStat}>
          Total: {student.attendance.totalSessions}
        </Text>
      </View>
    </View>
  );

  const renderAchievementsSection = () => (
    <View style={styles.achievementsContainer}>
      <View style={styles.achievementsHeader}>
        <Text style={styles.achievementsTitle}>Achievements</Text>
        <TouchableOpacity 
          onPress={onViewAllAchievements}
          accessibilityRole="button"
          accessibilityLabel="View all achievements"
        >
          <Text style={styles.seeMoreText}>See more</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.achievementsList}>
        {student.achievements.map((achievement) => (
          <View key={achievement.id} style={styles.achievementItem}>
            <View style={styles.achievementIcon}>
              <Text style={styles.achievementIconText}>
                {achievement.iconType === 'ten' ? '10' : 
                 achievement.iconType === 'twenty' ? '20' : '30'}
              </Text>
            </View>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>{achievement.title}</Text>
              <Text style={styles.achievementDate}>{achievement.date}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
      accessibilityViewIsModal
    >
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {renderProfileSection()}
          {renderContactsSection()}
          {renderProgressSection()}
          {renderTimelineSection()}
          {renderAttendanceSection()}
          {renderAchievementsSection()}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const useThemedStyles = createThemedStyles((theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
    },

    backButton: {
      padding: theme.spacing.xs,
    },

    headerTitle: {
      ...theme.typography.heading.h4,
      color: theme.colors.text.primary,
    },

    headerSpacer: {
      width: 24,
    },

    scrollView: {
      flex: 1,
    },

    scrollContent: {
      paddingBottom: theme.spacing.xl,
    },

    profileContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.sm,
    },

    profileCard: {
      backgroundColor: theme.colors.background.secondary,
      borderTopLeftRadius: theme.borderRadius.lg,
      borderTopRightRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
      position: 'relative',
      justifyContent: 'space-between',
      minHeight: 120,
    },

    profileImageContainer: {
      position: 'absolute',
      top: theme.spacing.xl + theme.spacing.sm,
      left: theme.spacing.md + theme.spacing.sm,
      zIndex: 10,
    },

    profileImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.background.tertiary,
    },

    avatarPlaceholder: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.background.secondary,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },

    cameraButton: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.full,
      padding: theme.spacing.xs,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },

    backgroundCameraButton: {
      position: 'absolute',
      top: theme.spacing.xl,
      right: theme.spacing.md,
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.full,
      padding: theme.spacing.xs,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },

    profileInfo: {
      backgroundColor: theme.colors.background.tertiary,
      borderBottomLeftRadius: theme.borderRadius.xl,
      borderBottomRightRadius: theme.borderRadius.xl,
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.xl + theme.spacing.sm,
      paddingBottom: theme.spacing.md,
    },

    nameContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },

    studentName: {
      ...theme.typography.heading.h4,
      color: theme.colors.text.primary,
    },

    editButton: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.full,
      padding: theme.spacing.xs,
    },

    levelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
      gap: theme.spacing.xs,
    },

    levelInfo: {
      flex: 1,
    },

    levelText: {
      ...theme.typography.body.base,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
    },

    classText: {
      ...theme.typography.caption.base,
      color: theme.colors.text.secondary,
    },

    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
      gap: theme.spacing.xs,
    },

    ratingText: {
      ...theme.typography.body.base,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: theme.colors.text.primary,
    },

    performanceButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.border.secondary,
      borderRadius: theme.borderRadius.md,
      paddingVertical: theme.spacing.sm,
      gap: theme.spacing.xs,
    },

    performanceButtonText: {
      ...theme.typography.caption.base,
      color: theme.colors.text.secondary,
    },

    contactsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.lg,
      marginVertical: theme.spacing.md,
      gap: theme.spacing.sm,
    },

    contactCard: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      flex: 1,
      ...theme.elevation.sm,
    },

    contactImage: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: theme.colors.background.secondary,
    },

    contactImagePlaceholder: {
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },

    contactInfo: {
      flex: 1,
    },

    contactRole: {
      ...theme.typography.caption.base,
      color: theme.colors.text.tertiary,
    },

    contactName: {
      ...theme.typography.caption.base,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: theme.colors.text.secondary,
    },

    sectionContainer: {
      backgroundColor: theme.colors.background.tertiary,
      borderRadius: theme.borderRadius.lg,
      marginHorizontal: theme.spacing.md,
      marginTop: theme.spacing.md,
      padding: theme.spacing.md,
      ...theme.elevation.sm,
    },

    sectionTitle: {
      ...theme.typography.body.base,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.md,
    },

    termContainer: {
      gap: theme.spacing.md,
    },

    termSelector: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    termText: {
      ...theme.typography.body.base,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
    },

    termNavigation: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },

    termNavButton: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.full,
      padding: theme.spacing.xs,
    },

    overviewTitle: {
      ...theme.typography.body.base,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.sm,
    },

    overviewGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: theme.spacing.sm,
    },

    overviewItem: {
      width: '48%',
      flexDirection: 'row',
      borderColor: theme.colors.border.secondary,
      borderWidth: 1,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.sm,
      gap: theme.spacing.sm,
    },

    overviewIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.colors.background.secondary,
      justifyContent: 'center',
      alignItems: 'center',
    },

    overviewContent: {
      flex: 1,
      justifyContent: 'center',
    },

    overviewValue: {
      ...theme.typography.caption.base,
      fontWeight: theme.fontConfig.fontWeight.bold,
      color: theme.colors.text.primary,
    },

    overviewLabel: {
      ...theme.typography.caption.base,
      color: theme.colors.text.secondary,
    },

    timelineContainer: {
      backgroundColor: theme.colors.background.tertiary,
      borderRadius: theme.borderRadius.lg,
      marginHorizontal: theme.spacing.md,
      marginTop: theme.spacing.md,
      padding: theme.spacing.md,
      ...theme.elevation.sm,
    },

    timelineTitle: {
      ...theme.typography.body.base,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.sm,
    },

    timelineCard: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.sm,
    },

    timelineHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
      paddingBottom: theme.spacing.xs,
    },

    timelineHeaderText: {
      ...theme.typography.caption.base,
      color: theme.colors.text.secondary,
    },

    timelineHeaderRight: {
      flexDirection: 'row',
      width: 120,
      justifyContent: 'space-between',
    },

    timelineItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },

    timelineItemLeft: {
      flexDirection: 'row',
      flex: 1,
      alignItems: 'center',
      gap: theme.spacing.sm,
    },

    timelineIconContainer: {
      width: 24,
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },

    timelineContent: {
      flex: 1,
    },

    timelineItemTitle: {
      ...theme.typography.body.base,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: theme.colors.text.primary,
    },

    timelineItemSubtitle: {
      ...theme.typography.caption.base,
      color: theme.colors.text.secondary,
    },

    timelineItemRight: {
      flexDirection: 'row',
      width: 120,
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    diffIndicator: {
      width: 40,
      alignItems: 'center',
    },

    diffText: {
      ...theme.typography.body.base,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },

    currentRating: {
      flexDirection: 'row',
      alignItems: 'center',
      width: 40,
      gap: theme.spacing.xs,
    },

    currentRatingText: {
      ...theme.typography.body.base,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: theme.colors.text.primary,
    },

    attendanceContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },

    attendanceTitle: {
      ...theme.typography.body.base,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.sm,
    },

    attendanceStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },

    attendanceStat: {
      ...theme.typography.caption.base,
      color: theme.colors.text.secondary,
    },

    achievementsContainer: {
      marginHorizontal: theme.spacing.md,
      marginVertical: theme.spacing.md,
    },

    achievementsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },

    achievementsTitle: {
      ...theme.typography.body.base,
      color: theme.colors.text.primary,
    },

    seeMoreText: {
      ...theme.typography.caption.base,
      color: theme.colors.interactive.primary,
    },

    achievementsList: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: theme.spacing.sm,
    },

    achievementItem: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      gap: theme.spacing.xs,
    },

    achievementIcon: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.colors.interactive.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },

    achievementIconText: {
      ...theme.typography.heading.h5,
      fontWeight: theme.fontConfig.fontWeight.bold,
      color: theme.colors.background.primary,
    },

    achievementInfo: {
      alignItems: 'center',
    },

    achievementTitle: {
      ...theme.typography.caption.base,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      textAlign: 'center',
      color: theme.colors.text.primary,
    },

    achievementDate: {
      ...theme.typography.caption.base,
      textAlign: 'center',
      color: theme.colors.text.tertiary,
    },
  })
);

export default StudentProfile;