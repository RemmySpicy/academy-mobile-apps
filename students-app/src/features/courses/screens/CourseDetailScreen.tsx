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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { CustomButton, useTheme, createThemedStyles, TabBar } from '@academy/mobile-shared';
import type { CoursesStackParamList } from '../navigation/CoursesNavigator';

const { width } = Dimensions.get('window');

type CourseDetailRouteProp = RouteProp<CoursesStackParamList, 'CourseDetail'>;

interface PricingTier {
  id: string;
  ageRange: string;
  price: number;
  description?: string;
}

interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  ageRange: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number; // Default/starting price for display
  pricingTiers?: PricingTier[]; // Age-based pricing tiers
  image: string;
  color: string;
  features: string[];
  sessions: number;
  totalEnrolled?: number; // Total students who have ever enrolled
}

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
  pricingTiers?: PricingTier[];
  color: string;
  features: string[];
  curriculum: string[];
  sessions: number;
  totalEnrolled?: number;
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

const useDetailThemedStyles = createThemedStyles((theme) => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    },
    header: {
      paddingHorizontal: theme.spacing.md,
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
      paddingHorizontal: theme.spacing.md,
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
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: theme.spacing.md,
    },
    bottomAction: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.background.primary,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.primary,
      paddingHorizontal: theme.spacing.md,
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
    // Pricing tiers styles
    pricingTiersContainer: {
      marginTop: theme.spacing.lg,
    },
    pricingTiersTitle: {
      color: theme.colors.text.primary,
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      marginBottom: theme.spacing.md,
    },
    pricingTierCard: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      ...theme.elevation.sm,
    },
    selectedPricingTierCard: {
      borderColor: theme.colors.interactive.primary,
      borderWidth: 2,
      backgroundColor: `${theme.colors.interactive.primary}05`,
    },
    pricingTierHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.xs,
    },
    pricingTierAgeRange: {
      color: theme.colors.text.primary,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      fontSize: theme.fontSizes.base,
    },
    pricingTierPrice: {
      color: theme.colors.interactive.primary,
      fontWeight: theme.fontConfig.fontWeight.bold,
      fontSize: theme.fontSizes.lg,
    },
    pricingTierDescription: {
      color: theme.colors.text.secondary,
      fontSize: theme.fontSizes.sm,
      lineHeight: theme.fontSizes.sm * 1.4,
    },
    selectedIndicator: {
      width: 20,
      height: 20,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.interactive.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: theme.spacing.xs,
    },
    priceRangeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    priceRangeText: {
      color: theme.colors.text.secondary,
      fontSize: theme.fontSizes.sm,
      fontStyle: 'italic',
    },
  }));

// Mock courses data - should match CoursesScreen data
const getCourseData = (courseId: string, theme: any): Course | null => {
  const courses: Course[] = [
    {
      id: '1',
      title: 'Learn to Swim',
      subtitle: 'Beginner Swimming Program',
      description: 'Perfect for beginners of all ages. Learn fundamental swimming skills, water safety, and build confidence in the water.',
      ageRange: '3-30 years',
      duration: '45 min',
      level: 'Beginner',
      price: 14000,
      image: 'learn-to-swim',
      color: theme.colors.interactive.accent,
      features: ['Water Safety', 'Basic Strokes', 'Floating', 'Breathing'],
      sessions: 8,
      totalEnrolled: 1247,
    },
    {
      id: '2',
      title: 'Swimming Club',
      subtitle: 'Competitive Training',
      description: 'Advanced training for competitive swimmers. Focus on technique refinement, endurance, and performance improvement.',
      ageRange: '5-30 years',
      duration: '60 min',
      level: 'Advanced',
      price: 16000, // Starting price for display
      pricingTiers: [
        {
          id: 'youth',
          ageRange: '5-17 years',
          price: 16000,
          description: 'Youth competitive training program'
        },
        {
          id: 'adult',
          ageRange: '18-30 years',
          price: 20000,
          description: 'Adult competitive training program'
        }
      ],
      image: 'swimming-club',
      color: theme.colors.status.success,
      features: ['Technique', 'Endurance', 'Competition Prep', 'Stroke Analysis'],
      sessions: 12,
      totalEnrolled: 892,
    },
    {
      id: '3',
      title: 'Adult Swimming',
      subtitle: 'Swimming for Adults 30+',
      description: 'Specialized program for adults looking to learn or improve their swimming skills in a comfortable environment.',
      ageRange: '18+ years',
      duration: '50 min',
      level: 'Beginner',
      price: 15000, // Starting price for display
      pricingTiers: [
        {
          id: 'young-adult',
          ageRange: '18-35 years',
          price: 15000,
          description: 'Young adult swimming program'
        },
        {
          id: 'senior',
          ageRange: '36-60 years',
          price: 18000,
          description: 'Senior adult swimming program with enhanced support'
        },
        {
          id: 'mature',
          ageRange: '60+ years',
          price: 14000,
          description: 'Gentle swimming program for mature adults with senior discount'
        }
      ],
      image: 'adult-swimming',
      color: theme.colors.interactive.purple,
      features: ['Adult-Friendly', 'Flexible Pace', 'Health Focus', 'Stress Relief'],
      sessions: 10,
      totalEnrolled: 2156,
    },
    {
      id: '4',
      title: 'Aqua Babies',
      subtitle: 'Swimming for Toddlers',
      description: 'Gentle introduction to water for infants and toddlers. Build water confidence and safety skills with parent participation.',
      ageRange: '12-36 months',
      duration: '30 min',
      level: 'Beginner',
      price: 12000,
      image: 'aqua-babies',
      color: theme.colors.status.warning,
      features: ['Parent-Child', 'Water Safety', 'Gentle Approach', 'Fun Activities'],
      sessions: 6,
      totalEnrolled: 3421,
    },
  ];

  return courses.find(course => course.id === courseId) || null;
};

// Transform course data to detail format
const transformCourseToDetail = (course: Course, theme: any): CourseDetail => {
  const longDescriptions: Record<string, string> = {
    '1': 'Our Learn to Swim program is designed for individuals who are new to swimming or want to improve their basic skills. This comprehensive course covers water safety, basic floating techniques, breathing exercises, and fundamental strokes. Our certified instructors use proven teaching methods to ensure students feel comfortable and confident in the water.',
    '2': 'The Swimming Club is our most advanced program, designed for swimmers who want to compete or significantly improve their technique and endurance. This intensive training focuses on stroke refinement, competitive strategies, and performance analytics to help swimmers reach their full potential.',
    '3': 'Our Adult Swimming program recognizes that learning to swim as an adult requires a different approach. We provide a supportive, non-intimidating environment where adults can learn at their own pace, focusing on health benefits, stress relief, and building confidence in the water.',
    '4': 'Aqua Babies is our specialized program for the youngest swimmers. With parent participation, we introduce infants and toddlers to water in a safe, fun way that builds confidence and basic water safety skills through play and gentle exercises.',
  };

  const curriculums: Record<string, string[]> = {
    '1': [
      'Water familiarization and safety',
      'Basic floating (front and back)',
      'Breathing techniques',
      'Kicking fundamentals',
      'Arm movements and coordination',
      'Basic freestyle stroke',
      'Backstroke introduction',
      'Pool safety and rescue techniques'
    ],
    '2': [
      'Advanced stroke technique analysis',
      'Competitive starts and turns',
      'Endurance and interval training',
      'Race strategy and pacing',
      'Performance video analysis',
      'Mental preparation techniques',
      'Competition preparation',
      'Advanced rescue techniques'
    ],
    '3': [
      'Adult-specific water introduction',
      'Overcoming water anxiety',
      'Basic floating and buoyancy',
      'Breathing and relaxation',
      'Freestyle stroke development',
      'Backstroke for comfort',
      'Pool exercise and fitness',
      'Water safety and confidence'
    ],
    '4': [
      'Water familiarization with parent',
      'Supported floating exercises',
      'Gentle submersion techniques',
      'Kicking and movement play',
      'Basic safety awareness',
      'Fun water activities',
      'Parent-child bonding exercises',
      'Confidence building games'
    ],
  };

  const instructors: Record<string, CourseDetail['instructor']> = {
    '1': {
      name: 'Sarah Johnson',
      experience: '8+ years teaching experience',
      certifications: ['WSI Certified', 'CPR/AED', 'Lifeguard Certified']
    },
    '2': {
      name: 'Mike Wilson',
      experience: '12+ years competitive coaching',
      certifications: ['USA Swimming Certified', 'Level 4 Coach', 'CPR/AED']
    },
    '3': {
      name: 'Linda Martinez',
      experience: '10+ years adult instruction',
      certifications: ['Adult Learn to Swim Instructor', 'Water Safety Instructor', 'CPR/AED']
    },
    '4': {
      name: 'Emma Thompson',
      experience: '6+ years infant/toddler instruction',
      certifications: ['Infant Swimming Resource', 'Parent-Child Instructor', 'CPR/AED']
    },
  };

  const schedules: Record<string, CourseDetail['schedule']> = {
    '1': [
      { day: 'Monday', time: '3:00 PM - 3:45 PM', location: 'Pool A' },
      { day: 'Wednesday', time: '3:00 PM - 3:45 PM', location: 'Pool A' },
      { day: 'Friday', time: '10:00 AM - 10:45 AM', location: 'Pool B' },
      { day: 'Saturday', time: '9:00 AM - 9:45 AM', location: 'Pool A' },
    ],
    '2': [
      { day: 'Monday', time: '6:00 PM - 7:00 PM', location: 'Pool A' },
      { day: 'Wednesday', time: '6:00 PM - 7:00 PM', location: 'Pool A' },
      { day: 'Friday', time: '6:00 PM - 7:00 PM', location: 'Pool A' },
      { day: 'Saturday', time: '7:00 AM - 8:00 AM', location: 'Pool A' },
    ],
    '3': [
      { day: 'Tuesday', time: '7:00 PM - 7:50 PM', location: 'Pool B' },
      { day: 'Thursday', time: '7:00 PM - 7:50 PM', location: 'Pool B' },
      { day: 'Saturday', time: '10:00 AM - 10:50 AM', location: 'Pool B' },
    ],
    '4': [
      { day: 'Monday', time: '10:00 AM - 10:30 AM', location: 'Pool C' },
      { day: 'Wednesday', time: '10:00 AM - 10:30 AM', location: 'Pool C' },
      { day: 'Friday', time: '10:00 AM - 10:30 AM', location: 'Pool C' },
      { day: 'Saturday', time: '11:00 AM - 11:30 AM', location: 'Pool C' },
    ],
  };

  return {
    ...course,
    longDescription: longDescriptions[course.id] || course.description,
    curriculum: curriculums[course.id] || [],
    instructor: instructors[course.id] || instructors['1'],
    schedule: schedules[course.id] || schedules['1'],
  };
};

/**
 * Course Detail Screen
 * 
 * Features:
 * - Detailed course information
 * - Instructor profiles
 * - Schedule and pricing with age-based tiers
 * - Course curriculum
 * - Unlimited enrollment tracking (cumulative total)
 * - Direct enrollment integration
 */
export const CourseDetailScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = useDetailThemedStyles();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<CourseDetailRouteProp>();
  const { courseId } = route.params;
  const [selectedTab, setSelectedTab] = useState<'overview' | 'curriculum' | 'schedule'>('overview');
  const [selectedPricingTier, setSelectedPricingTier] = useState<PricingTier | null>(null);

  // Get course data
  const course = getCourseData(courseId, theme);
  
  if (!course) {
    // Handle course not found
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Ionicons name="alert-circle-outline" size={64} color={theme.colors.text.tertiary} />
        <Text style={{ color: theme.colors.text.primary, fontSize: theme.fontSizes.lg, marginTop: theme.spacing.md }}>
          Course not found
        </Text>
        <CustomButton
          title="Go Back"
          onPress={() => navigation.goBack()}
          variant="secondary"
          size="sm"
          style={{ marginTop: theme.spacing.md }}
        />
      </View>
    );
  }

  const courseDetail = transformCourseToDetail(course, theme);

  // Set default pricing tier on course load
  React.useEffect(() => {
    if (courseDetail.pricingTiers && courseDetail.pricingTiers.length > 0 && !selectedPricingTier) {
      setSelectedPricingTier(courseDetail.pricingTiers[0]);
    }
  }, [courseDetail.pricingTiers, selectedPricingTier]);

  // Get current price to display
  const getCurrentPrice = () => {
    if (selectedPricingTier) {
      return selectedPricingTier.price;
    }
    if (courseDetail.pricingTiers && courseDetail.pricingTiers.length > 0) {
      return courseDetail.pricingTiers[0].price;
    }
    return courseDetail.price;
  };

  // Get price range display
  const getPriceRangeText = () => {
    if (!courseDetail.pricingTiers || courseDetail.pricingTiers.length === 0) {
      return null;
    }
    const prices = courseDetail.pricingTiers.map(tier => tier.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    if (minPrice === maxPrice) {
      return null;
    }
    return `₦${minPrice.toLocaleString('en-NG')} - ₦${maxPrice.toLocaleString('en-NG')}`;
  };

  const tabs = [
    { value: 'overview', label: 'Overview', icon: 'information-circle-outline' as const },
    { value: 'curriculum', label: 'Curriculum', icon: 'book-outline' as const },
    { value: 'schedule', label: 'Schedule', icon: 'calendar-outline' as const },
  ];

  const handleEnrollNow = () => {
    const enrollmentData = {
      courseId,
      courseName: courseDetail.title,
      price: getCurrentPrice(),
      pricingTier: selectedPricingTier,
      // Add other relevant enrollment data
    };
    console.log('Navigate to enrollment with data:', enrollmentData);
    // Navigate to enrollment screen with the selected pricing tier
    // navigation.navigate('Enrollment', { courseData: enrollmentData });
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
            
            {/* Pricing Tiers */}
            {courseDetail.pricingTiers && courseDetail.pricingTiers.length > 1 && (
              <View style={styles.pricingTiersContainer}>
                <Text style={styles.pricingTiersTitle}>Pricing Options</Text>
                {courseDetail.pricingTiers.map((tier, index) => (
                  <Pressable
                    key={tier.id}
                    onPress={() => setSelectedPricingTier(tier)}
                    style={[
                      styles.pricingTierCard,
                      selectedPricingTier?.id === tier.id && styles.selectedPricingTierCard
                    ]}
                  >
                    <View style={styles.pricingTierHeader}>
                      <View style={styles.priceRangeContainer}>
                        <Text style={styles.pricingTierAgeRange}>
                          {tier.ageRange}
                        </Text>
                        {selectedPricingTier?.id === tier.id && (
                          <View style={styles.selectedIndicator}>
                            <Ionicons name="checkmark" size={12} color="white" />
                          </View>
                        )}
                      </View>
                      <Text style={styles.pricingTierPrice}>
                        ₦{tier.price.toLocaleString('en-NG')}
                      </Text>
                    </View>
                    {tier.description && (
                      <Text style={styles.pricingTierDescription}>
                        {tier.description}
                      </Text>
                    )}
                  </Pressable>
                ))}
              </View>
            )}
            
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
                  <Ionicons name="people" size={16} color={theme.colors.status.success} />
                  <Text style={styles.detailText}>
                    {(courseDetail.totalEnrolled || 0).toLocaleString('en-NG')} students
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
                ₦{getCurrentPrice().toLocaleString('en-NG')}
              </Text>
              <Text style={styles.priceUnit}>per term ({courseDetail.sessions} sessions)</Text>
              {getPriceRangeText() && (
                <Text style={styles.priceRangeText}>
                  {getPriceRangeText()} range
                </Text>
              )}
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
          title="Enroll Now"
          onPress={handleEnrollNow}
          variant="primary"
          size="md"
        />
      </Animated.View>
    </View>
  );
};