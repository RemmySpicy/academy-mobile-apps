import React, { useState, useMemo } from 'react';
import { View,
  Text,
  ScrollView,
  Pressable,
  useWindowDimensions,
  Dimensions,
  StyleSheet,
  Image } from 'react-native';
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
import { CustomButton, useTheme, createThemedStyles } from '@academy/mobile-shared';
import type { CoursesStackParamList } from '../navigation/CoursesNavigator';

const { width } = Dimensions.get('window');

type CourseDetailRouteProp = RouteProp<CoursesStackParamList, 'CourseDetail'>;

interface PricingTier {
  id: string;
  ageRange: string;
  price: number;
  description?: string;
}

interface LessonType {
  id: string;
  name: string;
  description: string;
  pricingTiers: PricingTier[];
  features: string[];
  icon: string;
}

interface LocationOption {
  id: string;
  name: string;
  type: 'facility' | 'preferred';
  description: string;
  icon: string;
  available: boolean;
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
  lessonTypes: LessonType[];
  locationOptions: LocationOption[];
  courseLength: string;
  sessionDuration: string;
  color: string;
  features: string[];
  curriculum: string[];
  sessions: number;
  totalEnrolled?: number;
  instructor?: {
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
    courseDetailsSection: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      ...theme.elevation.sm,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    courseDetails: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    detailItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    detailText: {
      color: theme.colors.text.secondary,
      fontSize: theme.fontSizes.sm,
      marginLeft: theme.spacing.xs,
    },
    videoContainer: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    videoCard: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      overflow: 'hidden',
      ...theme.elevation.sm,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    videoImageContainer: {
      position: 'relative',
      aspectRatio: 16 / 9,
    },
    videoImage: {
      width: '100%',
      height: '100%',
    },
    videoOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    playButton: {
      width: 64,
      height: 64,
      borderRadius: theme.borderRadius.full,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      alignItems: 'center',
      justifyContent: 'center',
      ...theme.elevation.md,
    },
    videoTitle: {
      position: 'absolute',
      bottom: theme.spacing.md,
      left: theme.spacing.md,
      right: theme.spacing.md,
    },
    videoTitleText: {
      color: 'white',
      fontSize: theme.fontSizes['2xl'],
      fontWeight: theme.fontConfig.fontWeight.bold,
      textShadowColor: 'rgba(0, 0, 0, 0.7)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 3,
    },
    videoSubtitleText: {
      color: 'white',
      fontSize: theme.fontSizes.base,
      marginTop: theme.spacing.xs / 2,
      textShadowColor: 'rgba(0, 0, 0, 0.7)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 3,
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: theme.spacing.md,
    },
    bottomAction: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.lg,
      backgroundColor: theme.colors.background.secondary,
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
    // New section styles
    locationSection: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      ...theme.elevation.sm,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    locationOptions: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.sm,
    },
    locationOption: {
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    unavailableLocationOption: {
      backgroundColor: theme.colors.background.tertiary,
      opacity: 0.6,
    },
    availableBadgeSmall: {
      position: 'absolute',
      top: theme.spacing.xs,
      right: theme.spacing.xs,
      backgroundColor: theme.colors.status.success,
      borderRadius: theme.borderRadius.full,
      width: 12,
      height: 12,
    },
    unavailableBadgeSmall: {
      position: 'absolute',
      top: theme.spacing.xs,
      right: theme.spacing.xs,
      backgroundColor: theme.colors.text.tertiary,
      borderRadius: theme.borderRadius.full,
      width: 12,
      height: 12,
    },
    locationIcon: {
      marginBottom: theme.spacing.xs,
    },
    locationName: {
      color: theme.colors.text.primary,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      fontSize: theme.fontSizes.sm,
      textAlign: 'center',
    },
    locationDescription: {
      color: theme.colors.text.secondary,
      fontSize: theme.fontSizes.xs,
      textAlign: 'center',
      marginTop: theme.spacing.xs / 2,
    },
    courseInfoGrid: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    courseInfoCard: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      alignItems: 'center',
      ...theme.elevation.sm,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    courseInfoIcon: {
      marginBottom: theme.spacing.xs,
    },
    courseInfoLabel: {
      color: theme.colors.text.secondary,
      fontSize: theme.fontSizes.xs,
      textAlign: 'center',
      marginBottom: theme.spacing.xs / 2,
    },
    courseInfoValue: {
      color: theme.colors.text.primary,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      fontSize: theme.fontSizes.sm,
      textAlign: 'center',
    },
    filterBar: {
      flexDirection: 'row',
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.xs,
      marginBottom: theme.spacing.md,
    },
    filterButton: {
      flex: 1,
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
    },
    activeFilterButton: {
      backgroundColor: theme.colors.interactive.primary,
    },
    filterButtonText: {
      color: theme.colors.text.secondary,
      fontSize: theme.fontSizes.xs,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
    activeFilterButtonText: {
      color: 'white',
    },
    lessonTypeCard: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      ...theme.elevation.sm,
    },
    lessonTypeHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    lessonTypeIcon: {
      marginRight: theme.spacing.sm,
    },
    lessonTypeInfo: {
      flex: 1,
    },
    lessonTypeName: {
      color: theme.colors.text.primary,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      fontSize: theme.fontSizes.base,
    },
    lessonTypeDescription: {
      color: theme.colors.text.secondary,
      fontSize: theme.fontSizes.sm,
      marginTop: theme.spacing.xs / 2,
    },
    lessonTypePrice: {
      color: theme.colors.interactive.primary,
      fontWeight: theme.fontConfig.fontWeight.bold,
      fontSize: theme.fontSizes.lg,
    },
    lessonFeatures: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.xs,
      marginTop: theme.spacing.sm,
    },
    lessonFeature: {
      backgroundColor: theme.colors.background.secondary,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs / 2,
      borderRadius: theme.borderRadius.full,
    },
    lessonFeatureText: {
      color: theme.colors.text.secondary,
      fontSize: theme.fontSizes.xs,
    },
    pricingDisclaimer: {
      backgroundColor: `${theme.colors.status.warning}10`,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.status.warning,
    },
    disclaimerText: {
      color: theme.colors.text.secondary,
      fontSize: theme.fontSizes.sm,
      lineHeight: theme.fontSizes.sm * 1.4,
    },
    // Perks section styles
    perkItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      ...theme.elevation.sm,
    },
    perkIcon: {
      marginRight: theme.spacing.sm,
    },
    perkContent: {
      flex: 1,
    },
    perkTitle: {
      color: theme.colors.text.primary,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      fontSize: theme.fontSizes.base,
    },
    perkDescription: {
      color: theme.colors.text.secondary,
      fontSize: theme.fontSizes.sm,
      marginTop: theme.spacing.xs / 2,
    },
    // Contact section styles
    contactGrid: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    contactCard: {
      flex: 1,
      backgroundColor: theme.colors.interactive.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      alignItems: 'center',
      ...theme.elevation.sm,
    },
    contactIcon: {
      marginBottom: theme.spacing.xs,
    },
    contactLabel: {
      color: 'white',
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      textAlign: 'center',
    },
    contactDescription: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: theme.fontSizes.xs,
      textAlign: 'center',
      marginTop: theme.spacing.xs / 2,
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

  // Some courses have instructors, some don't
  const instructors: Record<string, CourseDetail['instructor'] | undefined> = {
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
    '4': undefined, // Aqua Babies doesn't have a specific instructor
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

  const getLocationOptions = (courseId: string): LocationOption[] => {
    // Different courses have different location availability
    const locationAvailability: Record<string, { facility: boolean; preferred: boolean }> = {
      '1': { facility: true, preferred: true }, // Learn to Swim - both options
      '2': { facility: true, preferred: false }, // Swimming Club - facility only (competitive equipment needed)
      '3': { facility: true, preferred: true }, // Adult Swimming - both options
      '4': { facility: true, preferred: true }, // Aqua Babies - both options
    };

    const availability = locationAvailability[courseId] || { facility: true, preferred: false };

    return [
      {
        id: 'facility',
        name: 'Our Facilities',
        type: 'facility',
        description: 'Professional facilities with specialized equipment',
        icon: 'business-outline',
        available: availability.facility
      },
      {
        id: 'preferred',
        name: 'Your Location',
        type: 'preferred',
        description: 'We bring our instructors to your preferred location',
        icon: 'location-outline',
        available: availability.preferred
      }
    ];
  };

  const lessonTypes: LessonType[] = [
    {
      id: 'group',
      name: 'Group Lessons',
      description: 'Learn with others in a social environment',
      icon: 'people',
      features: ['4-6 students', 'Social learning', 'Cost effective', 'Peer motivation'],
      pricingTiers: course.pricingTiers || [{ id: 'default', ageRange: course.ageRange, price: course.price }]
    },
    {
      id: 'private',
      name: 'Private Lessons',
      description: '1-on-1 personalized training',
      icon: 'person',
      features: ['Personalized attention', 'Flexible schedule', 'Faster progress', 'Custom curriculum'],
      pricingTiers: (course.pricingTiers || [{ id: 'default', ageRange: course.ageRange, price: course.price }]).map(tier => ({
        ...tier,
        price: Math.round(tier.price * 1.8) // Private lessons cost about 80% more
      }))
    },
    {
      id: 'semi-private',
      name: 'Semi-Private',
      description: 'Small group of 2-3 students',
      icon: 'people-circle',
      features: ['2-3 students', 'More attention', 'Shared costs', 'Friend/family groups'],
      pricingTiers: (course.pricingTiers || [{ id: 'default', ageRange: course.ageRange, price: course.price }]).map(tier => ({
        ...tier,
        price: Math.round(tier.price * 1.4) // Semi-private costs about 40% more
      }))
    }
  ];

  return {
    ...course,
    longDescription: longDescriptions[course.id] || course.description,
    curriculum: curriculums[course.id] || [],
    instructor: instructors[course.id],
    schedule: schedules[course.id] || schedules['1'],
    locationOptions: getLocationOptions(course.id),
    lessonTypes,
    courseLength: `${course.sessions} sessions over ${Math.ceil(course.sessions / 2)} weeks`,
    sessionDuration: course.duration,
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
  const [selectedPricingTier, setSelectedPricingTier] = useState<PricingTier | null>(null);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('all');
  const [selectedLessonType, setSelectedLessonType] = useState<string>('group');

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

  const handleVideoPlay = () => {
    console.log('Play course introduction video for:', courseDetail.title);
    // Navigate to video player or show video modal
    // navigation.navigate('VideoPlayer', { videoUrl: courseDetail.videoUrl });
  };

  const getAgeGroups = () => {
    const ageGroups = ['all'];
    courseDetail.lessonTypes.forEach(lessonType => {
      lessonType.pricingTiers.forEach(tier => {
        if (!ageGroups.includes(tier.id)) {
          ageGroups.push(tier.id);
        }
      });
    });
    return ageGroups;
  };

  const getFilteredLessonTypes = () => {
    if (selectedAgeGroup === 'all') {
      return courseDetail.lessonTypes;
    }
    return courseDetail.lessonTypes.map(lessonType => ({
      ...lessonType,
      pricingTiers: lessonType.pricingTiers.filter(tier => tier.id === selectedAgeGroup)
    })).filter(lessonType => lessonType.pricingTiers.length > 0);
  };

  const renderContent = () => {
    return (
      <View style={styles.sectionContainer}>
        {/* Course Quick Info */}
        <View style={styles.courseInfoGrid}>
          <View style={styles.courseInfoCard}>
            <Ionicons name="people-outline" size={24} color={theme.colors.interactive.primary} style={styles.courseInfoIcon} />
            <Text style={styles.courseInfoLabel}>Age Range</Text>
            <Text style={styles.courseInfoValue}>{courseDetail.ageRange}</Text>
          </View>
          <View style={styles.courseInfoCard}>
            <Ionicons name="calendar-outline" size={24} color={theme.colors.interactive.primary} style={styles.courseInfoIcon} />
            <Text style={styles.courseInfoLabel}>Course Length</Text>
            <Text style={styles.courseInfoValue}>{courseDetail.courseLength}</Text>
          </View>
          <View style={styles.courseInfoCard}>
            <Ionicons name="time-outline" size={24} color={theme.colors.interactive.primary} style={styles.courseInfoIcon} />
            <Text style={styles.courseInfoLabel}>Session Duration</Text>
            <Text style={styles.courseInfoValue}>{courseDetail.sessionDuration}</Text>
          </View>
        </View>

        {/* Enrollment Stats */}
        <View style={styles.courseDetailsSection}>
          <View style={styles.detailItem}>
            <Ionicons name="people" size={20} color={theme.colors.status.success} />
            <Text style={styles.detailText}>
              {(courseDetail.totalEnrolled || 0).toLocaleString('en-NG')} students enrolled
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="trophy-outline" size={20} color={theme.colors.interactive.primary} />
            <Text style={styles.detailText}>Level: {courseDetail.level}</Text>
          </View>
        </View>

        <View>
          <Text style={styles.sectionTitle}>About This Course</Text>
          <Text style={styles.sectionText}>{courseDetail.longDescription}</Text>
        </View>
        
        {/* Location Options */}
        <View>
          <Text style={styles.sectionTitle}>Location Options</Text>
          <View style={styles.locationOptions}>
            {courseDetail.locationOptions.map((location) => (
              <View
                key={location.id}
                style={[
                  styles.locationOption,
                  !location.available && styles.unavailableLocationOption
                ]}
              >
                {location.available ? (
                  <View style={styles.availableBadgeSmall} />
                ) : (
                  <View style={styles.unavailableBadgeSmall} />
                )}
                <Ionicons 
                  name={location.icon as any} 
                  size={32} 
                  color={location.available ? theme.colors.interactive.primary : theme.colors.text.tertiary} 
                  style={styles.locationIcon}
                />
                <Text style={[
                  styles.locationName,
                  !location.available && { color: theme.colors.text.tertiary }
                ]}>{location.name}</Text>
                <Text style={[
                  styles.locationDescription,
                  !location.available && { color: theme.colors.text.tertiary }
                ]}>{location.description}</Text>
                {!location.available && (
                  <Text style={{
                    color: theme.colors.text.tertiary,
                    fontSize: theme.fontSizes.xs,
                    textAlign: 'center',
                    marginTop: theme.spacing.xs / 2,
                    fontStyle: 'italic'
                  }}>Not available for this course</Text>
                )}
              </View>
            ))}
          </View>
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
        
        {/* Pricing Options */}
        <View>
          <Text style={styles.sectionTitle}>Pricing Options</Text>
          
          {/* Age Group Filter */}
          {getAgeGroups().length > 2 && (
            <View style={styles.filterBar}>
              {getAgeGroups().map((ageGroup) => (
                <Pressable
                  key={ageGroup}
                  onPress={() => setSelectedAgeGroup(ageGroup)}
                  style={[
                    styles.filterButton,
                    selectedAgeGroup === ageGroup && styles.activeFilterButton
                  ]}
                >
                  <Text style={[
                    styles.filterButtonText,
                    selectedAgeGroup === ageGroup && styles.activeFilterButtonText
                  ]}>
                    {ageGroup === 'all' ? 'All Ages' : 
                     ageGroup === 'youth' ? 'Youth' :
                     ageGroup === 'adult' ? 'Adult' :
                     ageGroup === 'young-adult' ? 'Young Adult' :
                     ageGroup === 'senior' ? 'Senior' :
                     ageGroup === 'mature' ? 'Mature' : ageGroup}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}

          {/* Lesson Type Cards */}
          {getFilteredLessonTypes().map((lessonType) => (
            <View key={lessonType.id} style={styles.lessonTypeCard}>
              <View style={styles.lessonTypeHeader}>
                <Ionicons 
                  name={lessonType.icon as any} 
                  size={24} 
                  color={theme.colors.interactive.primary} 
                  style={styles.lessonTypeIcon}
                />
                <View style={styles.lessonTypeInfo}>
                  <Text style={styles.lessonTypeName}>{lessonType.name}</Text>
                  <Text style={styles.lessonTypeDescription}>{lessonType.description}</Text>
                </View>
                <View>
                  <Text style={styles.lessonTypePrice}>
                    From ₦{Math.min(...lessonType.pricingTiers.map(t => t.price)).toLocaleString('en-NG')}
                  </Text>
                </View>
              </View>
              
              <View style={styles.lessonFeatures}>
                {lessonType.features.map((feature, index) => (
                  <View key={index} style={styles.lessonFeature}>
                    <Text style={styles.lessonFeatureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}

          {/* Pricing Disclaimer */}
          <View style={styles.pricingDisclaimer}>
            <Text style={styles.disclaimerText}>
              💡 <Text style={{ fontWeight: theme.fontConfig.fontWeight.semibold }}>Note:</Text> Final pricing may vary based on your selected location and facility costs. Additional fees may apply for premium locations or specialized equipment. Contact us for a personalized quote.
            </Text>
          </View>
        </View>

        {/* Perks & Benefits */}
        <View>
          <Text style={styles.sectionTitle}>Perks & Benefits</Text>
          <View style={styles.perkItem}>
            <Ionicons name="people" size={24} color={theme.colors.status.success} style={styles.perkIcon} />
            <View style={styles.perkContent}>
              <Text style={styles.perkTitle}>Referral Discount</Text>
              <Text style={styles.perkDescription}>Get 15% off when you refer a friend</Text>
            </View>
          </View>
          <View style={styles.perkItem}>
            <Ionicons name="home" size={24} color={theme.colors.status.success} style={styles.perkIcon} />
            <View style={styles.perkContent}>
              <Text style={styles.perkTitle}>Family Discount</Text>
              <Text style={styles.perkDescription}>10% off for each additional family member</Text>
            </View>
          </View>
          <View style={styles.perkItem}>
            <Ionicons name="calendar" size={24} color={theme.colors.status.success} style={styles.perkIcon} />
            <View style={styles.perkContent}>
              <Text style={styles.perkTitle}>Flexible Scheduling</Text>
              <Text style={styles.perkDescription}>Easy rescheduling and makeup sessions</Text>
            </View>
          </View>
          <View style={styles.perkItem}>
            <Ionicons name="shield-checkmark" size={24} color={theme.colors.status.success} style={styles.perkIcon} />
            <View style={styles.perkContent}>
              <Text style={styles.perkTitle}>Money Back Guarantee</Text>
              <Text style={styles.perkDescription}>100% satisfaction guarantee on your first session</Text>
            </View>
          </View>
        </View>

        {/* Contact for Enrollment */}
        <View>
          <Text style={styles.sectionTitle}>Need Help with Enrollment?</Text>
          <View style={styles.contactGrid}>
            <Pressable 
              style={styles.contactCard}
              onPress={() => console.log('Call support')}
            >
              <Ionicons name="call" size={24} color="white" style={styles.contactIcon} />
              <Text style={styles.contactLabel}>Call Us</Text>
              <Text style={styles.contactDescription}>Speak to our enrollment team</Text>
            </Pressable>
            <Pressable 
              style={styles.contactCard}
              onPress={() => console.log('Open WhatsApp')}
            >
              <Ionicons name="logo-whatsapp" size={24} color="white" style={styles.contactIcon} />
              <Text style={styles.contactLabel}>WhatsApp</Text>
              <Text style={styles.contactDescription}>Quick chat support</Text>
            </Pressable>
          </View>
        </View>
        
        {/* Instructor Section - Optional */}
        {courseDetail.instructor && (
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
        )}
      </View>
    );
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

      {/* Video/Image Section */}
      <Animated.View
        entering={FadeInDown.delay(200)}
        style={styles.videoContainer}
      >
        <View style={styles.videoCard}>
          <Pressable onPress={handleVideoPlay} style={styles.videoImageContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' }}
              style={styles.videoImage}
              resizeMode="cover"
            />
            <View style={styles.videoOverlay}>
              <View style={styles.playButton}>
                <Ionicons name="play" size={24} color={theme.colors.interactive.primary} />
              </View>
            </View>
            <View style={styles.videoTitle}>
              <Text style={styles.videoTitleText}>
                {courseDetail.title}
              </Text>
              <Text style={styles.videoSubtitleText}>
                {courseDetail.subtitle}
              </Text>
            </View>
          </Pressable>
        </View>
      </Animated.View>



      {/* Content */}
      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
      >
        <Animated.View
          entering={FadeInDown.delay(300)}
        >
          {renderContent()}
        </Animated.View>

        {/* Bottom Action */}
        <Animated.View
          entering={FadeInUp.delay(400)}
          style={styles.bottomAction}
        >
          <CustomButton
            title="Enroll Now"
            onPress={handleEnrollNow}
            variant="primary"
            size="md"
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
};