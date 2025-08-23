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
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { CustomButton, useTheme, TabBar } from '@academy/mobile-shared';

const { width } = Dimensions.get('window');

interface CourseDetail {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  ageRange: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
  color: string;
  features: string[];
  curriculum: string[];
  sessions: number;
  maxStudents: number;
  rating: number;
  reviews: number;
  instructor: {
    name: string;
    experience: string;
    certifications: string[];
  };
  schedule: {
    day: string;
    time: string;
    location: string;
  }[];
}

const createDetailStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    },
    header: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    headerNav: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    navButton: {
      width: 40,
      height: 40,
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
      ...theme.elevation.sm,
    },
    courseHeaderContainer: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
    courseCard: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      ...theme.elevation.sm,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    courseHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.md,
    },
    courseContent: {
      flex: 1,
      marginRight: theme.spacing.md,
    },
    courseTitle: {
      color: theme.colors.text.primary,
      fontWeight: theme.fontConfig.fontWeight.bold,
      fontSize: theme.fontSizes['2xl'],
      marginBottom: theme.spacing.xs,
    },
    courseSubtitle: {
      color: theme.colors.text.secondary,
      fontSize: theme.fontSizes.base,
      marginBottom: theme.spacing.sm,
    },
    courseDetails: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    detailItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: theme.spacing.md,
      marginBottom: theme.spacing.xs,
    },
    detailText: {
      color: theme.colors.text.secondary,
      fontSize: theme.fontSizes.sm,
      marginLeft: theme.spacing.xs,
    },
    iconContainer: {
      width: 64,
      height: 64,
      borderRadius: theme.borderRadius['2xl'],
      alignItems: 'center',
      justifyContent: 'center',
    },
    priceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    priceSection: {
      // No specific styles needed, using flexDirection on parent
    },
    priceText: {
      color: theme.colors.text.primary,
      fontWeight: theme.fontConfig.fontWeight.bold,
      fontSize: theme.fontSizes['2xl'],
    },
    priceUnit: {
      color: theme.colors.text.tertiary,
      fontSize: theme.fontSizes.sm,
    },
    levelBadge: {
      backgroundColor: `${theme.colors.interactive.primary}15`,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.full,
    },
    levelText: {
      color: theme.colors.interactive.primary,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
    tabsContainer: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
    },
    bottomAction: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.background.primary,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.primary,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    // Content styles
    sectionContainer: {
      gap: theme.spacing.lg,
    },
    sectionTitle: {
      color: theme.colors.text.primary,
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      marginBottom: theme.spacing.sm,
    },
    sectionText: {
      color: theme.colors.text.secondary,
      fontSize: theme.fontSizes.base,
      lineHeight: theme.fontSizes.base * 1.5,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    featureText: {
      color: theme.colors.text.secondary,
      fontSize: theme.fontSizes.base,
      marginLeft: theme.spacing.sm,
    },
    instructorCard: {
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
    },
    instructorHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    instructorAvatar: {
      width: 48,
      height: 48,
      backgroundColor: `${theme.colors.interactive.primary}15`,
      borderRadius: theme.borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.sm,
    },
    instructorInitials: {
      color: theme.colors.interactive.primary,
      fontWeight: theme.fontConfig.fontWeight.semibold,
    },
    instructorInfo: {
      flex: 1,
    },
    instructorName: {
      color: theme.colors.text.primary,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      fontSize: theme.fontSizes.base,
    },
    instructorExp: {
      color: theme.colors.text.secondary,
      fontSize: theme.fontSizes.sm,
    },
    certContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    certBadge: {
      backgroundColor: theme.colors.background.primary,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs / 2,
      borderRadius: theme.borderRadius.full,
      marginRight: theme.spacing.xs,
      marginBottom: theme.spacing.xs,
    },
    certText: {
      color: theme.colors.text.secondary,
      fontSize: theme.fontSizes.xs,
    },
    curriculumItem: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      ...theme.elevation.sm,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      marginBottom: theme.spacing.md,
    },
    curriculumContent: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    curriculumNumber: {
      width: 24,
      height: 24,
      backgroundColor: theme.colors.interactive.primary,
      borderRadius: theme.borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.sm,
      marginTop: theme.spacing.xs / 2,
    },
    curriculumNumberText: {
      color: 'white',
      fontSize: theme.fontSizes.xs,
      fontWeight: theme.fontConfig.fontWeight.bold,
    },
    curriculumText: {
      color: theme.colors.text.secondary,
      fontSize: theme.fontSizes.base,
      flex: 1,
    },
    scheduleItem: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      ...theme.elevation.sm,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      marginBottom: theme.spacing.md,
    },
    scheduleContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    scheduleInfo: {
      flex: 1,
    },
    scheduleDay: {
      color: theme.colors.text.primary,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      fontSize: theme.fontSizes.base,
    },
    scheduleTime: {
      color: theme.colors.text.secondary,
      fontSize: theme.fontSizes.sm,
      marginTop: theme.spacing.xs / 2,
    },
    scheduleLocation: {
      color: theme.colors.text.tertiary,
      fontSize: theme.fontSizes.sm,
    },
    availableBadge: {
      backgroundColor: `${theme.colors.status.success}15`,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs / 2,
      borderRadius: theme.borderRadius.full,
    },
    availableText: {
      color: theme.colors.status.success,
      fontSize: theme.fontSizes.xs,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
    reviewsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    reviewsRating: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    reviewsRatingText: {
      color: theme.colors.text.secondary,
      fontSize: theme.fontSizes.sm,
      marginLeft: theme.spacing.xs,
    },
    reviewCard: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      ...theme.elevation.sm,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      marginBottom: theme.spacing.md,
    },
    reviewHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.xs,
    },
    reviewUser: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    reviewAvatar: {
      width: 32,
      height: 32,
      backgroundColor: `${theme.colors.interactive.primary}15`,
      borderRadius: theme.borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.sm,
    },
    reviewUserInitials: {
      color: theme.colors.interactive.primary,
      fontSize: theme.fontSizes.xs,
      fontWeight: theme.fontConfig.fontWeight.semibold,
    },
    reviewUserInfo: {
      // No specific styles needed
    },
    reviewUserName: {
      color: theme.colors.text.primary,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
    reviewStars: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    reviewDate: {
      color: theme.colors.text.quaternary,
      fontSize: theme.fontSizes.xs,
    },
    reviewText: {
      color: theme.colors.text.secondary,
      fontSize: theme.fontSizes.sm,
    },
  });

/**
 * Course Detail Screen
 * 
 * Features:
 * - Detailed course information
 * - Instructor profiles
 * - Schedule and pricing
 * - Course curriculum
 * - Reviews and ratings
 * - Direct booking integration
 */
export const CourseDetailScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = useMemo(() => createDetailStyles(theme), [theme]);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const { courseId } = route.params as { courseId: string };
  const [selectedTab, setSelectedTab] = useState<'overview' | 'curriculum' | 'schedule' | 'reviews'>('overview');

  // Mock course data - replace with API call
  const courseDetail: CourseDetail = {
    id: courseId,
    title: 'Learn to Swim',
    subtitle: 'Beginner Swimming Program',
    description: 'Perfect for beginners of all ages. Learn fundamental swimming skills, water safety, and build confidence in the water.',
    longDescription: 'Our Learn to Swim program is designed for individuals who are new to swimming or want to improve their basic skills. This comprehensive course covers water safety, basic floating techniques, breathing exercises, and fundamental strokes. Our certified instructors use proven teaching methods to ensure students feel comfortable and confident in the water.',
    ageRange: '3-30 years',
    duration: '45 min',
    level: 'Beginner',
    price: 35,
    color: theme.colors.interactive.accent,
    features: ['Water Safety', 'Basic Strokes', 'Floating Techniques', 'Breathing Exercises', 'Confidence Building'],
    curriculum: [
      'Water familiarization and safety',
      'Basic floating (front and back)',
      'Breathing techniques',
      'Kicking fundamentals',
      'Arm movements and coordination',
      'Basic freestyle stroke',
      'Backstroke introduction',
      'Pool safety and rescue techniques'
    ],
    sessions: 8,
    maxStudents: 6,
    rating: 4.8,
    reviews: 124,
    instructor: {
      name: 'Sarah Johnson',
      experience: '8+ years teaching experience',
      certifications: ['WSI Certified', 'CPR/AED', 'Lifeguard Certified']
    },
    schedule: [
      { day: 'Monday', time: '3:00 PM - 3:45 PM', location: 'Pool A' },
      { day: 'Wednesday', time: '3:00 PM - 3:45 PM', location: 'Pool A' },
      { day: 'Friday', time: '10:00 AM - 10:45 AM', location: 'Pool B' },
      { day: 'Saturday', time: '9:00 AM - 9:45 AM', location: 'Pool A' },
    ]
  };

  const tabs = [
    { value: 'overview', label: 'Overview', icon: 'information-circle-outline' as const },
    { value: 'curriculum', label: 'Curriculum', icon: 'book-outline' as const },
    { value: 'schedule', label: 'Schedule', icon: 'calendar-outline' as const },
    { value: 'reviews', label: 'Reviews', icon: 'star-outline' as const, badge: courseDetail.reviews },
  ];

  const handleBookNow = () => {
    console.log('Navigate to booking for course:', courseId);
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'overview':
        return (
          <View style={styles.sectionContainer}>
            <View>
              <Text style={styles.sectionTitle}>About This Course</Text>
              <Text style={styles.sectionText}>{courseDetail.longDescription}</Text>
            </View>
            
            <View>
              <Text style={styles.sectionTitle}>What You'll Learn</Text>
              {courseDetail.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color={theme.colors.status.success} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
            
            <View>
              <Text style={styles.sectionTitle}>Instructor</Text>
              <View style={styles.instructorCard}>
                <View style={styles.instructorHeader}>
                  <View style={styles.instructorAvatar}>
                    <Text style={styles.instructorInitials}>
                      {courseDetail.instructor.name.split(' ').map(n => n[0]).join('')}
                    </Text>
                  </View>
                  <View style={styles.instructorInfo}>
                    <Text style={styles.instructorName}>{courseDetail.instructor.name}</Text>
                    <Text style={styles.instructorExp}>{courseDetail.instructor.experience}</Text>
                  </View>
                </View>
                <View style={styles.certContainer}>
                  {courseDetail.instructor.certifications.map((cert, index) => (
                    <View key={index} style={styles.certBadge}>
                      <Text style={styles.certText}>{cert}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        );
      
      case 'curriculum':
        return (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Course Curriculum</Text>
            {courseDetail.curriculum.map((item, index) => (
              <View key={index} style={styles.curriculumItem}>
                <View style={styles.curriculumContent}>
                  <View style={styles.curriculumNumber}>
                    <Text style={styles.curriculumNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.curriculumText}>{item}</Text>
                </View>
              </View>
            ))}
          </View>
        );
      
      case 'schedule':
        return (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Available Sessions</Text>
            {courseDetail.schedule.map((session, index) => (
              <View key={index} style={styles.scheduleItem}>
                <View style={styles.scheduleContent}>
                  <View style={styles.scheduleInfo}>
                    <Text style={styles.scheduleDay}>{session.day}</Text>
                    <Text style={styles.scheduleTime}>{session.time}</Text>
                    <Text style={styles.scheduleLocation}>{session.location}</Text>
                  </View>
                  <View style={styles.availableBadge}>
                    <Text style={styles.availableText}>Available</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        );
      
      case 'reviews':
        return (
          <View style={styles.sectionContainer}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              <View style={styles.reviewsRating}>
                <Ionicons name="star" size={16} color={theme.colors.status.warning} />
                <Text style={styles.reviewsRatingText}>
                  {courseDetail.rating} ({courseDetail.reviews} reviews)
                </Text>
              </View>
            </View>
            
            {/* Mock reviews */}
            {[1, 2, 3].map((review) => (
              <View key={review} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewUser}>
                    <View style={styles.reviewAvatar}>
                      <Text style={styles.reviewUserInitials}>JD</Text>
                    </View>
                    <View style={styles.reviewUserInfo}>
                      <Text style={styles.reviewUserName}>John Doe</Text>
                      <View style={styles.reviewStars}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Ionicons key={star} name="star" size={12} color={theme.colors.status.warning} />
                        ))}
                      </View>
                    </View>
                  </View>
                  <Text style={styles.reviewDate}>2 weeks ago</Text>
                </View>
                <Text style={styles.reviewText}>
                  Great course! The instructor was patient and really helped me overcome my fear of water.
                </Text>
              </View>
            ))}
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View
        entering={FadeInUp.delay(100)}
        style={[
          styles.header,
          { paddingTop: insets.top + theme.spacing.md }
        ]}
      >
        <View style={styles.headerNav}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.navButton}
          >
            <Ionicons name="arrow-back" size={20} color={theme.colors.text.secondary} />
          </Pressable>
          
          <Pressable style={styles.navButton}>
            <Ionicons name="heart-outline" size={20} color={theme.colors.text.secondary} />
          </Pressable>
        </View>
      </Animated.View>

      {/* Course Header */}
      <Animated.View
        entering={FadeInDown.delay(200)}
        style={styles.courseHeaderContainer}
      >
        <View style={styles.courseCard}>
          <View style={styles.courseHeader}>
            <View style={styles.courseContent}>
              <Text style={styles.courseTitle}>
                {courseDetail.title}
              </Text>
              <Text style={styles.courseSubtitle}>
                {courseDetail.subtitle}
              </Text>
              
              <View style={styles.courseDetails}>
                <View style={styles.detailItem}>
                  <Ionicons name="people-outline" size={16} color={theme.colors.text.tertiary} />
                  <Text style={styles.detailText}>{courseDetail.ageRange}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="time-outline" size={16} color={theme.colors.text.tertiary} />
                  <Text style={styles.detailText}>{courseDetail.duration}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="star" size={16} color={theme.colors.status.warning} />
                  <Text style={styles.detailText}>
                    {courseDetail.rating} ({courseDetail.reviews})
                  </Text>
                </View>
              </View>
            </View>
            
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${courseDetail.color}15` }
              ]}
            >
              <Ionicons name="water" size={32} color={courseDetail.color} />
            </View>
          </View>
          
          <View style={styles.priceContainer}>
            <View style={styles.priceSection}>
              <Text style={styles.priceText}>
                ${courseDetail.price}
              </Text>
              <Text style={styles.priceUnit}>per session</Text>
            </View>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{courseDetail.level}</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Tabs */}
      <Animated.View
        entering={FadeInDown.delay(300)}
        style={styles.tabsContainer}
      >
        <TabBar
          tabs={tabs}
          activeTab={selectedTab}
          onTabChange={(value) => setSelectedTab(value as any)}
          mode="scrollable"
          variant="underline"
          size="md"
          showIcons={true}
          showBadges={true}
          iconPosition="left"
          style={{ paddingHorizontal: 0 }}
        />
      </Animated.View>

      {/* Tab Content */}
      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Animated.View
          entering={FadeInDown.delay(400)}
          key={selectedTab} // Force re-render on tab change
        >
          {renderTabContent()}
        </Animated.View>
      </ScrollView>

      {/* Bottom Action */}
      <Animated.View
        entering={FadeInUp.delay(500)}
        style={[
          styles.bottomAction,
          { paddingBottom: insets.bottom + 16 }
        ]}
      >
        <CustomButton
          title="Book Now"
          onPress={handleBookNow}
          variant="primary"
          size="md"
        />
      </Animated.View>
    </View>
  );
};