import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  FlatList,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInRight,
  Layout,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { CustomButton, useTheme, createThemedStyles, Header, SegmentedControl } from '@academy/mobile-shared';
import type { AppStackParamList } from '../../../navigation/AppNavigator';
import { BookingCard } from '../components/BookingCard';

interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  role: 'student' | 'parent' | 'instructor';
}

interface Booking {
  id: string;
  scheduleTitle: string;
  scheduleType: string;
  instructor: string;
  date: string;
  time: string;
  location: string;
  status: 'upcoming' | 'completed' | 'cancelled' | 'rescheduled';
  price: number;
  sessionNumber: number;
  totalSessions: number;
  color: string;
  participants?: Participant[];
  maxParticipants?: number;
  isRecurring?: boolean;
  recurringDay?: string;
}

interface FacilitySchedule {
  id: string;
  scheduleTitle: string;
  scheduleType: string;
  instructor: string;
  date: string;
  time: string;
  location: string;
  totalSessions: number;
  color: string;
  currentParticipants: number;
  maxParticipants: number;
  isRecurring?: boolean;
  recurringDay?: string;
  description?: string;
  availableSpots: number;
  ageRange?: string;
  skillLevel?: string;
  dayOfWeek: string; // Day of the week this schedule runs on
}




const useScreenStyles = createThemedStyles((theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    },
    header: {
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.xs,
    },
    statsContainer: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    statCard: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      ...theme.elevation.sm,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      flex: 1,
    },
    statCardLeft: {
      marginRight: theme.spacing.xs,
      flex: 0.6, // Smaller card for Next Session
    },
    statCardRight: {
      marginLeft: theme.spacing.xs,
      flex: 1.4, // Larger card for Term Progress
    },
    statHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.xs,
    },
    statLabel: {
      color: theme.colors.text.tertiary,
      fontSize: theme.fontSizes.sm,
    },
    statValue: {
      color: theme.colors.text.primary,
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontConfig.fontWeight.bold,
    },
    statTime: {
      color: theme.colors.interactive.primary,
      fontSize: theme.fontSizes.sm,
      marginTop: theme.spacing.xs / 2,
    },
    statSessions: {
      color: theme.colors.status.success,
      fontSize: theme.fontSizes.sm,
      marginTop: theme.spacing.xs / 2,
    },
    termProgressContainer: {
      marginTop: theme.spacing.xs,
    },
    termProgressRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.xs / 2,
    },
    termProgressItem: {
      alignItems: 'center',
      flex: 1,
    },
    termProgressValue: {
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontConfig.fontWeight.bold,
      marginBottom: 2,
    },
    termProgressLabel: {
      fontSize: theme.fontSizes.xs,
      textAlign: 'center',
      lineHeight: theme.fontSizes.xs * 1.2,
    },
    completedColor: {
      color: theme.colors.status.success,
    },
    scheduledColor: {
      color: theme.colors.interactive.primary,
    },
    remainingColor: {
      color: theme.colors.text.tertiary,
    },
    filtersContainer: {
      marginBottom: theme.spacing.md,
    },
    filterButton: {
      marginRight: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.full,
    },
    activeFilter: {
      backgroundColor: theme.colors.interactive.primary,
    },
    inactiveFilter: {
      backgroundColor: theme.colors.background.primary,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    activeFilterText: {
      color: 'white',
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
    inactiveFilterText: {
      color: theme.colors.text.secondary,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing['3xl'],
    },
    emptyTitle: {
      color: theme.colors.text.tertiary,
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontConfig.fontWeight.medium,
      marginTop: theme.spacing.md,
    },
    emptySubtitle: {
      color: theme.colors.text.tertiary,
      fontSize: theme.fontSizes.base,
      marginTop: theme.spacing.xs,
      textAlign: 'center',
      paddingHorizontal: theme.spacing.xl,
      marginBottom: theme.spacing.lg,
    },
    segmentedControlContainer: {
      paddingHorizontal: theme.spacing.md,
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    scheduleTypeTabs: {
      flexDirection: 'row',
      backgroundColor: theme.colors.background.tertiary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.xs,
    },
    scheduleTypeTab: {
      flex: 1,
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
    },
    activeScheduleTypeTab: {
      backgroundColor: theme.colors.interactive.primary,
    },
    scheduleTypeTabText: {
      color: theme.colors.text.secondary,
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
    activeScheduleTypeTabText: {
      color: 'white',
    },
    currentDayFilter: {
      backgroundColor: theme.colors.interactive.primary + '30', // Semi-transparent
      borderColor: theme.colors.interactive.primary,
      borderWidth: 2,
    },
    currentDayFilterText: {
      color: theme.colors.interactive.primary,
      fontWeight: theme.fontConfig.fontWeight.bold,
    },
  })
);

/**
 * Bookings Screen - Manage Session Bookings
 * 
 * Features:
 * - View all bookings with status filtering
 * - Quick actions for upcoming sessions
 * - Booking history and completed sessions
 * - Reschedule and cancellation options
 * - Payment status and receipts
 */
export const BookingsScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = useScreenStyles();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<AppStackParamList>>();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [facilityFilter, setFacilityFilter] = useState<'all' | 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday'>('all');
  const [notificationCount, setNotificationCount] = useState(3);
  const [scheduleType, setScheduleType] = useState<'my-schedules' | 'facility-schedules'>('my-schedules');
  
  // Mock user session credits (in real app, this would come from user profile/API)
  const [userSessionCredits, setUserSessionCredits] = useState(12);

  // Get current day of the week
  const getCurrentDay = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date();
    return days[today.getDay()];
  };

  const currentDay = getCurrentDay();

  // Segmented control options
  const scheduleOptions = [
    { value: 'my-schedules', label: 'My Schedules' },
    { value: 'facility-schedules', label: 'Facility Schedules' },
  ];

  // Mock bookings data
  const [bookings] = useState<Booking[]>([
    {
      id: '1',
      scheduleTitle: 'Learn to Swim',
      scheduleType: 'Kids • Private • Beginner',
      instructor: 'Sarah Johnson',
      date: 'Tomorrow',
      time: '3:00 PM - 3:45 PM',
      location: 'Pool A',
      status: 'upcoming',
      price: 14000,
      sessionNumber: 3,
      totalSessions: 8,
      color: theme.colors.interactive.accent,
      maxParticipants: 1,
      participants: [
        {
          id: 'p24',
          firstName: 'Emma',
          lastName: 'Johnson',
          role: 'student',
          avatarUrl: undefined,
        },
      ],
    },
    {
      id: '2',
      scheduleTitle: 'Family Swimming Session',
      scheduleType: 'Adults • Group • Intermediate',
      instructor: 'Mike Wilson & Sarah Johnson',
      date: 'Friday, Jan 12', // Will show "Every Friday"
      time: '4:00 PM - 5:00 PM',
      location: 'Pool B',
      status: 'upcoming',
      price: 0, // No price display for schedule cards
      isRecurring: true,
      recurringDay: 'Friday',
      sessionNumber: 2,
      totalSessions: 12,
      color: theme.colors.status.success,
      maxParticipants: 6,
      participants: [
        {
          id: 'p1',
          firstName: 'Emma',
          lastName: 'Wilson',
          role: 'student',
          avatarUrl: undefined,
        },
        {
          id: 'p2',
          firstName: 'James',
          lastName: 'Wilson',
          role: 'parent',
          avatarUrl: undefined,
        },
        {
          id: 'p3',
          firstName: 'Sophie',
          lastName: 'Wilson',
          role: 'student',
          avatarUrl: undefined,
        },
      ],
    },
    {
      id: '3',
      scheduleTitle: 'Open Water Training',
      scheduleType: 'Adults • Group • Swim Team',
      instructor: 'David Smith & Lisa Chen',
      date: 'Monday, Jan 8',
      time: '6:00 AM - 7:30 AM',
      location: 'Outdoor Pool',
      status: 'completed',
      price: 35000,
      sessionNumber: 5,
      totalSessions: 8,
      color: theme.colors.interactive.primary,
      maxParticipants: 8,
      participants: [
        {
          id: 'p4',
          firstName: 'Alex',
          lastName: 'Johnson',
          role: 'student',
          avatarUrl: undefined,
        },
        {
          id: 'p5',
          firstName: 'Maria',
          lastName: 'Garcia',
          role: 'student',
          avatarUrl: undefined,
        },
        {
          id: 'p6',
          firstName: 'John',
          lastName: 'Doe',
          role: 'student',
          avatarUrl: undefined,
        },
        {
          id: 'p7',
          firstName: 'Lisa',
          lastName: 'Brown',
          role: 'student',
          avatarUrl: undefined,
        },
        {
          id: 'p8',
          firstName: 'Michael',
          lastName: 'Davis',
          role: 'student',
          avatarUrl: undefined,
        },
        {
          id: 'p9',
          firstName: 'Sarah',
          lastName: 'Wilson',
          role: 'student',
          avatarUrl: undefined,
        },
      ],
    },
    {
      id: '4',
      scheduleTitle: 'Kids Swimming Lessons',
      scheduleType: 'Kids • Group • Beginner',
      instructor: 'Sarah Johnson',
      date: 'Wednesday, Jan 10', // Will show "Every Wednesday"
      time: '2:00 PM - 2:45 PM',
      location: 'Pool A',
      status: 'upcoming',
      price: 12000,
      isRecurring: true,
      recurringDay: 'Wednesday',
      sessionNumber: 1,
      totalSessions: 8,
      color: theme.colors.interactive.accent,
      maxParticipants: 6,
      participants: [
        {
          id: 'p25',
          firstName: 'Tommy',
          lastName: 'Anderson',
          role: 'student',
          avatarUrl: undefined,
        },
        {
          id: 'p26',
          firstName: 'Lucy',
          lastName: 'Davis',
          role: 'student',
          avatarUrl: undefined,
        },
        {
          id: 'p27',
          firstName: 'Max',
          lastName: 'Wilson',
          role: 'student',
          avatarUrl: undefined,
        },
      ],
    },
    {
      id: '5',
      scheduleTitle: 'Community Swim Meet',
      scheduleType: 'All Ages • Group • All Levels',
      instructor: 'David Smith, Sarah Johnson & Mike Wilson',
      date: 'Saturday, Jan 13',
      time: '10:00 AM - 12:00 PM',
      location: 'Main Pool Complex',
      status: 'upcoming',
      price: 0, // No price display for schedule cards
      sessionNumber: 1,
      totalSessions: 1,
      color: theme.colors.status.success,
      maxParticipants: 15,
      participants: [
        {
          id: 'p10',
          firstName: 'Emma',
          lastName: 'Thompson',
          role: 'student',
          avatarUrl: undefined,
        },
        {
          id: 'p11',
          firstName: 'Liam',
          lastName: 'Johnson',
          role: 'student',
          avatarUrl: undefined,
        },
        {
          id: 'p12',
          firstName: 'Olivia',
          lastName: 'Williams',
          role: 'student',
          avatarUrl: undefined,
        },
        {
          id: 'p13',
          firstName: 'Noah',
          lastName: 'Brown',
          role: 'student',
          avatarUrl: undefined,
        },
        {
          id: 'p14',
          firstName: 'Ava',
          lastName: 'Davis',
          role: 'student',
          avatarUrl: undefined,
        },
        {
          id: 'p15',
          firstName: 'William',
          lastName: 'Miller',
          role: 'student',
          avatarUrl: undefined,
        },
        {
          id: 'p16',
          firstName: 'Sophia',
          lastName: 'Wilson',
          role: 'student',
          avatarUrl: undefined,
        },
        {
          id: 'p17',
          firstName: 'James',
          lastName: 'Moore',
          role: 'student',
          avatarUrl: undefined,
        },
        {
          id: 'p18',
          firstName: 'Isabella',
          lastName: 'Taylor',
          role: 'student',
          avatarUrl: undefined,
        },
        {
          id: 'p19',
          firstName: 'Benjamin',
          lastName: 'Anderson',
          role: 'student',
          avatarUrl: undefined,
        },
      ],
    },
    {
      id: '6',
      scheduleTitle: 'Water Aerobics Class',
      scheduleType: 'Adults • Group • Beginner & Intermediate',
      instructor: 'Lisa Chen & Maria Garcia',
      date: 'Thursday, Jan 11', // Will show "Every Thursday"
      time: '6:00 PM - 7:00 PM',
      location: 'Therapy Pool',
      status: 'upcoming',
      price: 0, // No price display for schedule cards
      isRecurring: true,
      recurringDay: 'Thursday',
      sessionNumber: 4,
      totalSessions: 8,
      color: theme.colors.status.info || theme.colors.interactive.accent,
      maxParticipants: 12,
      participants: [
        {
          id: 'p20',
          firstName: 'Mary',
          lastName: 'Johnson',
          role: 'student',
          avatarUrl: undefined,
        },
        {
          id: 'p21',
          firstName: 'Robert',
          lastName: 'Smith',
          role: 'student',
          avatarUrl: undefined,
        },
        {
          id: 'p22',
          firstName: 'Patricia',
          lastName: 'Williams',
          role: 'student',
          avatarUrl: undefined,
        },
        {
          id: 'p23',
          firstName: 'Michael',
          lastName: 'Brown',
          role: 'student',
          avatarUrl: undefined,
        },
      ],
    },
    {
      id: '7',
      scheduleTitle: 'Morning Swim Training',
      scheduleType: 'Adults • Private • Intermediate',
      instructor: 'David Smith',
      date: 'Tuesday, Jan 9', // Will show "Every Tuesday"
      time: '7:00 AM - 8:00 AM',
      location: 'Pool C',
      status: 'upcoming',
      sessionNumber: 6,
      totalSessions: 12,
      color: theme.colors.interactive.primary,
      isRecurring: true,
      recurringDay: 'Tuesday',
      maxParticipants: 1,
      participants: [
        {
          id: 'p28',
          firstName: 'John',
          lastName: 'Mitchell',
          role: 'student',
          avatarUrl: undefined,
        },
      ],
    },
    {
      id: '8',
      scheduleTitle: 'Adult Swimming',
      scheduleType: 'Adults • Group • Beginner',
      instructor: 'Lisa Chen',
      date: 'Friday, Jan 5', // One-time schedule (specific date)
      time: '7:00 PM - 7:50 PM',
      location: 'Pool C',
      status: 'cancelled',
      price: 16000,
      sessionNumber: 1,
      totalSessions: 10,
      color: theme.colors.interactive.purple,
      maxParticipants: 8,
      participants: [
        {
          id: 'p29',
          firstName: 'Sarah',
          lastName: 'Miller',
          role: 'student',
          avatarUrl: undefined,
        },
        {
          id: 'p30',
          firstName: 'David',
          lastName: 'Thomas',
          role: 'student',
          avatarUrl: undefined,
        },
      ],
    },
  ]);

  // Mock facility schedules data
  const [facilitySchedules] = useState<FacilitySchedule[]>([
    {
      id: 'fs1',
      scheduleTitle: 'Beginner Adult Swimming',
      scheduleType: 'Adults • Group • Beginner',
      instructor: 'Sarah Johnson',
      date: 'Mondays',
      time: '6:00 PM - 7:00 PM',
      location: 'Pool A',
      totalSessions: 8,
      color: theme.colors.interactive.primary,
      currentParticipants: 4,
      maxParticipants: 8,
      availableSpots: 4,
      isRecurring: true,
      recurringDay: 'Monday',
      dayOfWeek: 'monday',
      description: 'Perfect for adults who are new to swimming or want to improve basic techniques.',
      ageRange: '18+',
      skillLevel: 'Beginner',
    },
    {
      id: 'fs2',
      scheduleTitle: 'Kids Water Safety',
      scheduleType: 'Kids • Group • Safety',
      instructor: 'Mike Wilson',
      date: 'Tuesdays',
      time: '4:00 PM - 4:45 PM',
      location: 'Pool B',
      totalSessions: 6,
      color: theme.colors.interactive.accent,
      currentParticipants: 6,
      maxParticipants: 8,
      availableSpots: 2,
      isRecurring: true,
      recurringDay: 'Tuesday',
      dayOfWeek: 'tuesday',
      description: 'Essential water safety skills for children aged 5-12.',
      ageRange: '5-12 years',
      skillLevel: 'All Levels',
    },
    {
      id: 'fs3',
      scheduleTitle: 'Advanced Competitive Swimming',
      scheduleType: 'Teens • Group • Advanced',
      instructor: 'David Smith & Lisa Chen',
      date: 'Wednesdays',
      time: '5:30 PM - 7:00 PM',
      location: 'Competition Pool',
      totalSessions: 12,
      color: theme.colors.status.success,
      currentParticipants: 12,
      maxParticipants: 12,
      availableSpots: 0,
      isRecurring: true,
      recurringDay: 'Wednesday & Friday',
      dayOfWeek: 'wednesday',
      description: 'High-performance training for competitive swimmers.',
      ageRange: '13-18 years',
      skillLevel: 'Advanced',
    },
    {
      id: 'fs4',
      scheduleTitle: 'Family Swimming Fun',
      scheduleType: 'All Ages • Group • All Levels',
      instructor: 'Sarah Johnson & Mike Wilson',
      date: 'Saturdays',
      time: '10:00 AM - 11:30 AM',
      location: 'Family Pool',
      totalSessions: 4,
      color: theme.colors.status.info || theme.colors.interactive.accent,
      currentParticipants: 8,
      maxParticipants: 15,
      availableSpots: 7,
      isRecurring: true,
      recurringDay: 'Saturday',
      dayOfWeek: 'saturday',
      description: 'Fun swimming activities for the whole family to enjoy together.',
      ageRange: 'All Ages',
      skillLevel: 'All Levels',
    },
    {
      id: 'fs5',
      scheduleTitle: 'Adult Lap Swimming',
      scheduleType: 'Adults • Open • Intermediate',
      instructor: 'Open Session',
      date: 'Thursdays',
      time: '6:00 AM - 8:00 AM',
      location: 'Lap Pool',
      totalSessions: 1,
      color: theme.colors.interactive.purple,
      currentParticipants: 3,
      maxParticipants: 20,
      availableSpots: 17,
      isRecurring: true,
      recurringDay: 'Thursday',
      dayOfWeek: 'thursday',
      description: 'Open lap swimming for fitness and training.',
      ageRange: '18+',
      skillLevel: 'Intermediate+',
    },
    {
      id: 'fs6',
      scheduleTitle: 'Water Aerobics Plus',
      scheduleType: 'Adults • Group • Beginner & Intermediate',
      instructor: 'Maria Garcia',
      date: 'Fridays',
      time: '7:00 PM - 8:00 PM',
      location: 'Therapy Pool',
      totalSessions: 8,
      color: theme.colors.status.warning,
      currentParticipants: 10,
      maxParticipants: 12,
      availableSpots: 2,
      isRecurring: true,
      recurringDay: 'Friday',
      dayOfWeek: 'friday',
      description: 'Low-impact water exercises perfect for all fitness levels.',
      ageRange: '25+',
      skillLevel: 'Beginner',
    },
    {
      id: 'fs7',
      scheduleTitle: 'Teen Swimming Technique',
      scheduleType: 'Teens • Semi-Private • Intermediate',
      instructor: 'Lisa Chen',
      date: 'Sundays',
      time: '3:30 PM - 4:30 PM',
      location: 'Pool C',
      totalSessions: 10,
      color: theme.colors.interactive.primary,
      currentParticipants: 3,
      maxParticipants: 4,
      availableSpots: 1,
      isRecurring: true,
      recurringDay: 'Sunday',
      dayOfWeek: 'sunday',
      description: 'Focused technique improvement for teenage swimmers.',
      ageRange: '13-17 years',
      skillLevel: 'Intermediate',
    },
    {
      id: 'fs8',
      scheduleTitle: 'Open Water Prep',
      scheduleType: 'Adults • Group • Advanced',
      instructor: 'David Smith',
      date: 'Saturdays',
      time: '8:00 AM - 10:00 AM',
      location: 'Outdoor Pool',
      totalSessions: 6,
      color: theme.colors.status.success,
      currentParticipants: 5,
      maxParticipants: 8,
      availableSpots: 3,
      isRecurring: true,
      recurringDay: 'Saturday',
      dayOfWeek: 'saturday',
      description: 'Prepare for open water swimming challenges and competitions.',
      ageRange: '18+',
      skillLevel: 'Advanced',
    },
  ]);

  const filters = [
    { key: 'all' as const, label: 'All', count: bookings.length },
    { key: 'upcoming' as const, label: 'Upcoming', count: bookings.filter(b => b.status === 'upcoming').length },
    { key: 'completed' as const, label: 'Completed', count: bookings.filter(b => b.status === 'completed').length },
    { key: 'cancelled' as const, label: 'Cancelled', count: bookings.filter(b => b.status === 'cancelled').length },
  ];

  const filteredBookings = bookings.filter(booking => {
    if (selectedFilter === 'all') return true;
    return booking.status === selectedFilter;
  });

  // Facility schedules filters - Days of the week
  const facilityFilters = [
    { key: 'all' as const, label: 'All', count: facilitySchedules.length },
    { key: 'sunday' as const, label: 'Sun', count: facilitySchedules.filter(s => s.dayOfWeek === 'sunday').length },
    { key: 'monday' as const, label: 'Mon', count: facilitySchedules.filter(s => s.dayOfWeek === 'monday').length },
    { key: 'tuesday' as const, label: 'Tue', count: facilitySchedules.filter(s => s.dayOfWeek === 'tuesday').length },
    { key: 'wednesday' as const, label: 'Wed', count: facilitySchedules.filter(s => s.dayOfWeek === 'wednesday').length },
    { key: 'thursday' as const, label: 'Thu', count: facilitySchedules.filter(s => s.dayOfWeek === 'thursday').length },
    { key: 'friday' as const, label: 'Fri', count: facilitySchedules.filter(s => s.dayOfWeek === 'friday').length },
    { key: 'saturday' as const, label: 'Sat', count: facilitySchedules.filter(s => s.dayOfWeek === 'saturday').length },
  ];

  const filteredFacilitySchedules = facilitySchedules.filter(schedule => {
    if (facilityFilter === 'all') return true;
    return schedule.dayOfWeek === facilityFilter;
  });

  // Calculate term progress statistics
  const termStats = useMemo(() => {
    // Assuming a standard term of 8 sessions as mentioned in the requirements
    const STANDARD_TERM_SESSIONS = 8;
    
    // Get all unique bookings (not individual sessions)
    const uniqueBookings = bookings.filter(booking => booking.totalSessions > 0);
    
    let completedSessions = 0;
    let scheduledSessions = 0;
    let totalTermSessions = 0;
    
    uniqueBookings.forEach(booking => {
      if (booking.status === 'completed') {
        completedSessions += 1;
      } else if (booking.status === 'upcoming') {
        scheduledSessions += 1;
      }
      // Use the minimum of totalSessions and standard term to avoid overcount
      totalTermSessions += Math.min(booking.totalSessions, STANDARD_TERM_SESSIONS);
    });
    
    // For demo purposes, let's simulate term progress more realistically
    // Assuming current active bookings represent ongoing terms
    const activeBookings = uniqueBookings.filter(b => b.status === 'upcoming' || b.status === 'completed');
    const avgProgress = activeBookings.length > 0 
      ? activeBookings.reduce((sum, b) => sum + (b.sessionNumber / b.totalSessions), 0) / activeBookings.length 
      : 0;
    
    const estimatedCompletedInTerm = Math.round(avgProgress * STANDARD_TERM_SESSIONS);
    const estimatedScheduledInTerm = Math.max(1, Math.min(3, STANDARD_TERM_SESSIONS - estimatedCompletedInTerm)); // 1-3 upcoming
    const remainingSessions = Math.max(0, STANDARD_TERM_SESSIONS - estimatedCompletedInTerm - estimatedScheduledInTerm);
    
    return {
      completed: estimatedCompletedInTerm,
      scheduled: estimatedScheduledInTerm, 
      remaining: remainingSessions,
      total: STANDARD_TERM_SESSIONS
    };
  }, [bookings]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleBookingPress = (booking: Booking) => {
    console.log('Navigate to booking detail:', booking.id);
  };


  const handleSearch = () => {
    console.log('Search pressed');
  };

  const handleFilter = () => {
    console.log('Filter pressed');
  };

  const handleNotifications = () => {
    navigation.navigate('Notifications');
    setNotificationCount(0);
  };

  const handleManageParticipants = (bookingId: string) => {
    console.log('Manage participants for booking:', bookingId);
    // TODO: This could trigger a refresh of booking data or update state
  };

  const handleJoinSchedule = (scheduleId: string, sessionCount: number, participants: string[]) => {
    const creditsNeeded = sessionCount * participants.length;
    console.log('Join schedule:', scheduleId, 'sessions:', sessionCount, 'participants:', participants, 'credits needed:', creditsNeeded);
    
    // Deduct credits from user account
    setUserSessionCredits(prev => prev - creditsNeeded);
    
    // TODO: Implement complete join schedule logic
    // This should:
    // 1. ✅ Deduct sessionCount * participants.length credits from user account (done above)
    // 2. Create booking entries for the selected sessions (API call)
    // 3. Update UI to reflect new bookings (refresh bookings data)
    // 4. Show success confirmation (toast notification)
    
    // For now, show a simple success message
    console.log(`Successfully joined schedule! ${creditsNeeded} credits deducted. Remaining: ${userSessionCredits - creditsNeeded}`);
  };

  const handleViewScheduleDetails = (schedule: FacilitySchedule) => {
    console.log('View schedule details:', schedule.id);
    // TODO: Navigate to schedule detail screen
  };

  const handleNewBooking = () => {
    console.log('Navigate to new booking');
    // TODO: Navigate to booking creation or facility schedules tab
    if (scheduleType === 'my-schedules') {
      setScheduleType('facility-schedules');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Program Switcher */}
      <Header
        title="Bookings"
        showProgramSwitcher={true}
        showNotifications={true}
        onNotificationPress={handleNotifications}
        notificationCount={notificationCount}
        showProfile={false}
        style={{ paddingTop: insets.top }}
      />


      {/* Schedule Type Selector */}
      <Animated.View
        entering={FadeInDown.delay(150).springify()}
        style={styles.segmentedControlContainer}
      >
        <View style={styles.scheduleTypeTabs}>
          {scheduleOptions.map((option) => (
            <Pressable
              key={option.value}
              style={[
                styles.scheduleTypeTab,
                scheduleType === option.value && styles.activeScheduleTypeTab
              ]}
              onPress={() => setScheduleType(option.value as 'my-schedules' | 'facility-schedules')}
            >
              <Text style={[
                styles.scheduleTypeTabText,
                scheduleType === option.value && styles.activeScheduleTypeTabText
              ]}>
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </Animated.View>

      {/* Stats Overview */}
      <Animated.View
        entering={FadeInDown.delay(200).springify()}
        style={styles.statsContainer}
      >
        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.statCardLeft]}>
            <View style={styles.statHeader}>
              <Text style={styles.statLabel}>Next Session</Text>
              <Ionicons name="time" size={16} color={theme.colors.interactive.primary} />
            </View>
            <Text style={styles.statValue}>Tomorrow</Text>
            <Text style={styles.statTime}>3:00 PM</Text>
          </View>
          
          <View style={[styles.statCard, styles.statCardRight]}>
            <View style={styles.statHeader}>
              <Text style={styles.statLabel}>This Term</Text>
              <Ionicons name="calendar" size={16} color={theme.colors.status.success} />
            </View>
            <View style={styles.termProgressContainer}>
              <View style={styles.termProgressRow}>
                <View style={styles.termProgressItem}>
                  <Text style={[styles.termProgressValue, styles.completedColor]}>
                    {termStats.completed}
                  </Text>
                  <Text style={[styles.termProgressLabel, styles.completedColor]}>
                    Completed
                  </Text>
                </View>
                <View style={styles.termProgressItem}>
                  <Text style={[styles.termProgressValue, styles.scheduledColor]}>
                    {termStats.scheduled}
                  </Text>
                  <Text style={[styles.termProgressLabel, styles.scheduledColor]}>
                    Scheduled
                  </Text>
                </View>
                <View style={styles.termProgressItem}>
                  <Text style={[styles.termProgressValue, styles.remainingColor]}>
                    {termStats.remaining}
                  </Text>
                  <Text style={[styles.termProgressLabel, styles.remainingColor]}>
                    Remaining
                  </Text>
                </View>
              </View>
              <Text style={[styles.statSessions, { textAlign: 'center', marginTop: theme.spacing.xs / 2 }]}>
                {termStats.completed + termStats.scheduled}/{termStats.total} sessions
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Filter Tabs - Different filters for each tab */}
      <Animated.View
        entering={FadeInDown.delay(300).springify()}
        style={styles.filtersContainer}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: theme.spacing.md }}
        >
          {scheduleType === 'my-schedules' 
            ? filters.map(filter => (
                <Pressable
                  key={filter.key}
                  onPress={() => setSelectedFilter(filter.key)}
                  style={[
                    styles.filterButton,
                    selectedFilter === filter.key
                      ? styles.activeFilter
                      : styles.inactiveFilter
                  ]}
                >
                  <Text
                    style={[
                      selectedFilter === filter.key
                        ? styles.activeFilterText
                        : styles.inactiveFilterText
                    ]}
                  >
                    {filter.label} ({filter.count})
                  </Text>
                </Pressable>
              ))
            : facilityFilters.map(filter => {
                const isCurrentDay = filter.key === currentDay;
                const isSelected = facilityFilter === filter.key;
                return (
                  <Pressable
                    key={filter.key}
                    onPress={() => setFacilityFilter(filter.key)}
                    style={[
                      styles.filterButton,
                      isSelected
                        ? styles.activeFilter
                        : isCurrentDay
                        ? styles.currentDayFilter
                        : styles.inactiveFilter
                    ]}
                  >
                    <Text
                      style={[
                        isSelected
                          ? styles.activeFilterText
                          : isCurrentDay
                          ? styles.currentDayFilterText
                          : styles.inactiveFilterText
                      ]}
                    >
                      {filter.label} ({filter.count})
                      {isCurrentDay && !isSelected && (
                        <Text style={{ fontSize: theme.fontSizes.xs }}> •</Text>
                      )}
                    </Text>
                  </Pressable>
                );
              })
          }
        </ScrollView>
      </Animated.View>

      {/* Content - Conditional based on schedule type */}
      {scheduleType === 'my-schedules' ? (
        <FlatList
          data={filteredBookings}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            return (
              <BookingCard
                booking={{
                  ...item,
                  participants: item.participants || []
                }}
                index={index}
                onPress={handleBookingPress}
                onManageParticipants={handleManageParticipants}
              />
            );
          }}
          contentContainerStyle={{
            paddingBottom: theme.spacing['3xl'], // Space for tab bar
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={() => (
            <Animated.View
              entering={FadeInDown.delay(400).springify()}
              style={styles.emptyContainer}
            >
              <Ionicons name="calendar-outline" size={64} color={theme.colors.text.tertiary} />
              <Text style={styles.emptyTitle}>
                No bookings found
              </Text>
              <Text style={styles.emptySubtitle}>
                {selectedFilter === 'all' 
                  ? "You haven't made any bookings yet"
                  : `No ${selectedFilter} bookings to show`
                }
              </Text>
              <CustomButton
                title="Browse Available Schedules"
                onPress={handleNewBooking}
                variant="primary"
                size="md"
              />
            </Animated.View>
          )}
        />
      ) : (
        <FlatList
          data={filteredFacilitySchedules}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            return (
              <BookingCard
                booking={item}
                index={index}
                variant="facility-schedule"
                onJoinSchedule={handleJoinSchedule}
                onViewDetails={handleViewScheduleDetails}
                userSessionCredits={userSessionCredits}
              />
            );
          }}
          contentContainerStyle={{
            paddingBottom: theme.spacing['3xl'], // Space for tab bar
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={() => (
            <Animated.View
              entering={FadeInDown.delay(400).springify()}
              style={styles.emptyContainer}
            >
              <Ionicons name="water-outline" size={64} color={theme.colors.text.tertiary} />
              <Text style={styles.emptyTitle}>
                No schedules available
              </Text>
              <Text style={styles.emptySubtitle}>
                Check back later for new schedules or contact us for custom arrangements.
              </Text>
            </Animated.View>
          )}
        />
      )}
    </View>
  );
};