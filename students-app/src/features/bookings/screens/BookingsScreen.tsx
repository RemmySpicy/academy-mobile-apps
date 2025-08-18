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
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInRight,
  Layout,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { CustomButton, useTheme } from '@academy/mobile-shared';

interface Booking {
  id: string;
  courseTitle: string;
  courseLevel: string;
  instructor: string;
  date: string;
  time: string;
  location: string;
  status: 'upcoming' | 'completed' | 'cancelled' | 'rescheduled';
  price: number;
  sessionNumber: number;
  totalSessions: number;
  color: string;
}

interface BookingCardProps {
  booking: Booking;
  index: number;
  onPress: (booking: Booking) => void;
}

const createCardStyles = (theme: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      ...theme.elevation.sm,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      marginBottom: theme.spacing.sm,
      marginHorizontal: theme.spacing.md,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    content: {
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    title: {
      color: theme.colors.text.primary,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      fontSize: theme.fontSizes.lg,
    },
    level: {
      color: theme.colors.text.secondary,
      fontSize: theme.fontSizes.sm,
    },
    instructor: {
      color: theme.colors.text.tertiary,
      fontSize: theme.fontSizes.sm,
      marginTop: theme.spacing.xs / 2,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: theme.borderRadius.full,
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
      color: theme.colors.text.tertiary,
      fontSize: theme.fontSizes.xs,
    },
    progressText: {
      color: theme.colors.text.secondary,
      fontSize: theme.fontSizes.xs,
    },
    progressBar: {
      backgroundColor: theme.colors.border.secondary,
      borderRadius: theme.borderRadius.full,
      height: 8,
    },
    progressFill: {
      height: 8,
      borderRadius: theme.borderRadius.full,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    detailItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    detailText: {
      color: theme.colors.text.secondary,
      fontSize: theme.fontSizes.sm,
      marginLeft: theme.spacing.xs,
    },
    price: {
      color: theme.colors.text.primary,
      fontWeight: theme.fontConfig.fontWeight.semibold,
    },
    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    statusItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statusText: {
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
      marginLeft: theme.spacing.xs,
    },
    actionsRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionButton: {
      marginRight: theme.spacing.sm,
    },
    rescheduleText: {
      color: theme.colors.status.warning,
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
    cancelText: {
      color: theme.colors.status.error,
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
    reviewText: {
      color: theme.colors.interactive.primary,
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
  });

const BookingCard: React.FC<BookingCardProps> = ({ booking, index, onPress }) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createCardStyles(theme), [theme]);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'upcoming':
        return theme.colors.interactive.primary;
      case 'completed':
        return theme.colors.status.success;
      case 'cancelled':
        return theme.colors.status.error;
      case 'rescheduled':
        return theme.colors.status.warning;
      default:
        return theme.colors.text.tertiary;
    }
  };

  const getStatusText = (status: Booking['status']) => {
    switch (status) {
      case 'upcoming':
        return 'Upcoming';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'rescheduled':
        return 'Rescheduled';
      default:
        return 'Unknown';
    }
  };

  const getStatusIcon = (status: Booking['status']) => {
    switch (status) {
      case 'upcoming':
        return 'time-outline';
      case 'completed':
        return 'checkmark-circle';
      case 'cancelled':
        return 'close-circle';
      case 'rescheduled':
        return 'refresh-circle';
      default:
        return 'help-circle';
    }
  };

  return (
    <Animated.View
      layout={Layout.springify()}
      entering={FadeInRight.delay(index * 50).springify()}
      style={animatedStyle}
    >
      <Pressable
        onPress={() => onPress(booking)}
        onPressIn={() => {
          scale.value = withSpring(0.98);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        style={styles.card}
      >
        <View style={styles.header}>
          <View style={styles.content}>
            <Text style={styles.title}>
              {booking.courseTitle}
            </Text>
            <Text style={styles.level}>{booking.courseLevel}</Text>
            <Text style={styles.instructor}>
              with {booking.instructor}
            </Text>
          </View>
          
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: `${booking.color}15` }
            ]}
          >
            <Ionicons name="water" size={24} color={booking.color} />
          </View>
        </View>

        {/* Session Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Text style={styles.progressText}>
              {booking.sessionNumber}/{booking.totalSessions} sessions
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${(booking.sessionNumber / booking.totalSessions) * 100}%`,
                  backgroundColor: booking.color,
                }
              ]}
            />
          </View>
        </View>

        {/* Date and Time */}
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={16} color={theme.colors.text.tertiary} />
            <Text style={styles.detailText}>{booking.date}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color={theme.colors.text.tertiary} />
            <Text style={styles.detailText}>{booking.time}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={16} color={theme.colors.text.tertiary} />
            <Text style={styles.detailText}>{booking.location}</Text>
          </View>
          <Text style={styles.price}>${booking.price}</Text>
        </View>

        {/* Status and Actions */}
        <View style={styles.statusRow}>
          <View style={styles.statusItem}>
            <Ionicons 
              name={getStatusIcon(booking.status) as any} 
              size={16} 
              color={getStatusColor(booking.status)} 
            />
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(booking.status) }
              ]}
            >
              {getStatusText(booking.status)}
            </Text>
          </View>
          
          <View style={styles.actionsRow}>
            {booking.status === 'upcoming' && (
              <>
                <Pressable style={styles.actionButton}>
                  <Text style={styles.rescheduleText}>Reschedule</Text>
                </Pressable>
                <Pressable>
                  <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>
              </>
            )}
            {booking.status === 'completed' && (
              <Pressable>
                <Text style={styles.reviewText}>Review</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const createScreenStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    },
    header: {
      paddingHorizontal: theme.spacing.lg,
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
      paddingHorizontal: theme.spacing.lg,
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
      color: theme.colors.text.quaternary,
      fontSize: theme.fontSizes.base,
      marginTop: theme.spacing.xs,
      textAlign: 'center',
      paddingHorizontal: theme.spacing.xl,
      marginBottom: theme.spacing.lg,
    },
  });

/**
 * Bookings Screen - Manage Course Bookings
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
  const styles = useMemo(() => createScreenStyles(theme), [theme]);
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');

  // Mock bookings data
  const [bookings] = useState<Booking[]>([
    {
      id: '1',
      courseTitle: 'Learn to Swim',
      courseLevel: 'Beginner Level 2',
      instructor: 'Sarah Johnson',
      date: 'Tomorrow',
      time: '3:00 PM - 3:45 PM',
      location: 'Pool A',
      status: 'upcoming',
      price: 35,
      sessionNumber: 3,
      totalSessions: 8,
      color: theme.colors.interactive.accent,
    },
    {
      id: '2',
      courseTitle: 'Swimming Club',
      courseLevel: 'Intermediate Training',
      instructor: 'Mike Wilson',
      date: 'Friday, Jan 12',
      time: '4:00 PM - 5:00 PM',
      location: 'Pool B',
      status: 'upcoming',
      price: 45,
      sessionNumber: 2,
      totalSessions: 12,
      color: theme.colors.status.success,
    },
    {
      id: '3',
      courseTitle: 'Learn to Swim',
      courseLevel: 'Beginner Level 2',
      instructor: 'Sarah Johnson',
      date: 'Monday, Jan 8',
      time: '3:00 PM - 3:45 PM',
      location: 'Pool A',
      status: 'completed',
      price: 35,
      sessionNumber: 2,
      totalSessions: 8,
      color: theme.colors.interactive.accent,
    },
    {
      id: '4',
      courseTitle: 'Adult Swimming',
      courseLevel: 'Beginner Adult',
      instructor: 'Lisa Chen',
      date: 'Friday, Jan 5',
      time: '7:00 PM - 7:50 PM',
      location: 'Pool C',
      status: 'cancelled',
      price: 40,
      sessionNumber: 1,
      totalSessions: 10,
      color: theme.colors.interactive.purple,
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View
        entering={FadeInDown.delay(100).springify()}
        style={[
          styles.header,
          { paddingTop: insets.top + theme.spacing.md }
        ]}
      >
        <View style={styles.headerRow}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>My Bookings</Text>
            <Text style={styles.headerSubtitle}>
              Manage your swimming sessions
            </Text>
          </View>
          
          <Pressable
            onPress={handleNewBooking}
            style={styles.addButton}
          >
            <Ionicons name="add" size={24} color="white" />
          </Pressable>
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
          contentContainerStyle={{ paddingHorizontal: theme.spacing.lg }}
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
        renderItem={({ item, index }) => (
          <BookingCard
            booking={item}
            index={index}
            onPress={handleBookingPress}
          />
        )}
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
            <Ionicons name="calendar-outline" size={64} color={theme.colors.text.quaternary} />
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