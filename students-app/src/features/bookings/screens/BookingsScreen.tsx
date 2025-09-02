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
import { CustomButton, useTheme, createThemedStyles, Header } from '@academy/mobile-shared';
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
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.md,
    },
    headerContent: {
      // No specific styles needed
    },
    headerTitle: {
      color: theme.colors.text.primary,
      fontSize: theme.fontSizes.xl,
      fontWeight: theme.fontConfig.fontWeight.bold,
    },
    headerSubtitle: {
      color: theme.colors.text.tertiary,
      fontSize: theme.fontSizes.base,
      marginTop: theme.spacing.xs,
    },
    addButton: {
      backgroundColor: theme.colors.interactive.primary,
      width: 48,
      height: 48,
      borderRadius: theme.borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
      ...theme.elevation.sm,
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
  const [notificationCount, setNotificationCount] = useState(3);

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
      price: 15000,
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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleBookingPress = (booking: Booking) => {
    console.log('Navigate to booking detail:', booking.id);
  };

  const handleNewBooking = () => {
    console.log('Navigate to create booking');
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

      {/* Add Booking Button Row */}
      <Animated.View
        entering={FadeInDown.delay(100).springify()}
        style={[styles.headerRow, { paddingHorizontal: theme.spacing.md, paddingTop: theme.spacing.md }]}
      >
        <View>
          <Text style={[styles.headerSubtitle, { marginTop: 0 }]}>
            Manage your swimming sessions
          </Text>
        </View>
        
        <Pressable
          onPress={handleNewBooking}
          style={styles.addButton}
        >
          <Ionicons name="add" size={24} color="white" />
        </Pressable>
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
              <Text style={styles.statLabel}>This Month</Text>
              <Ionicons name="calendar" size={16} color={theme.colors.status.success} />
            </View>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statSessions}>Sessions</Text>
          </View>
        </View>
      </Animated.View>

      {/* Filter Tabs */}
      <Animated.View
        entering={FadeInDown.delay(300).springify()}
        style={styles.filtersContainer}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: theme.spacing.md }}
        >
          {filters.map(filter => (
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
          ))}
        </ScrollView>
      </Animated.View>

      {/* Bookings List */}
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
              title="Book Your First Session"
              onPress={handleNewBooking}
              variant="primary"
              size="md"
            />
          </Animated.View>
        )}
      />
    </View>
  );
};