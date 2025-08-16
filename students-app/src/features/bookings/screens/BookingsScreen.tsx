import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  FlatList,
  RefreshControl,
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
import { CustomButton } from '@shared/components/forms';

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

const BookingCard: React.FC<BookingCardProps> = ({ booking, index, onPress }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'upcoming':
        return '#3B82F6';
      case 'completed':
        return '#10B981';
      case 'cancelled':
        return '#EF4444';
      case 'rescheduled':
        return '#F59E0B';
      default:
        return '#6B7280';
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
        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-3 mx-4"
      >
        <View className="flex-row items-start justify-between mb-3">
          <View className="flex-1 mr-3">
            <Text className="text-gray-900 font-semibold text-lg">
              {booking.courseTitle}
            </Text>
            <Text className="text-gray-600 text-sm">{booking.courseLevel}</Text>
            <Text className="text-gray-500 text-sm mt-1">
              with {booking.instructor}
            </Text>
          </View>
          
          <View
            className="w-12 h-12 rounded-full items-center justify-center"
            style={{ backgroundColor: `${booking.color}15` }}
          >
            <Ionicons name="water" size={24} color={booking.color} />
          </View>
        </View>

        {/* Session Progress */}
        <View className="mb-3">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-gray-500 text-xs">Progress</Text>
            <Text className="text-gray-600 text-xs">
              {booking.sessionNumber}/{booking.totalSessions} sessions
            </Text>
          </View>
          <View className="bg-gray-200 rounded-full h-2">
            <View
              className="h-2 rounded-full"
              style={{
                width: `${(booking.sessionNumber / booking.totalSessions) * 100}%`,
                backgroundColor: booking.color,
              }}
            />
          </View>
        </View>

        {/* Date and Time */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <Ionicons name="calendar-outline" size={16} color="#6B7280" />
            <Text className="text-gray-600 text-sm ml-2">{booking.date}</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={16} color="#6B7280" />
            <Text className="text-gray-600 text-sm ml-2">{booking.time}</Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <Ionicons name="location-outline" size={16} color="#6B7280" />
            <Text className="text-gray-600 text-sm ml-2">{booking.location}</Text>
          </View>
          <Text className="text-gray-900 font-semibold">${booking.price}</Text>
        </View>

        {/* Status and Actions */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons 
              name={getStatusIcon(booking.status) as any} 
              size={16} 
              color={getStatusColor(booking.status)} 
            />
            <Text
              className="text-sm font-medium ml-2"
              style={{ color: getStatusColor(booking.status) }}
            >
              {getStatusText(booking.status)}
            </Text>
          </View>
          
          <View className="flex-row items-center">
            {booking.status === 'upcoming' && (
              <>
                <Pressable className="mr-3">
                  <Text className="text-orange-600 text-sm font-medium">Reschedule</Text>
                </Pressable>
                <Pressable>
                  <Text className="text-red-600 text-sm font-medium">Cancel</Text>
                </Pressable>
              </>
            )}
            {booking.status === 'completed' && (
              <Pressable>
                <Text className="text-blue-600 text-sm font-medium">Review</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

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
      color: '#3B82F6',
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
      color: '#10B981',
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
      color: '#3B82F6',
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
      color: '#8B5CF6',
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
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <Animated.View
        entering={FadeInDown.delay(100).springify()}
        className="px-6 pt-4 pb-2"
        style={{ paddingTop: insets.top + 16 }}
      >
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-gray-900 text-2xl font-bold">My Bookings</Text>
            <Text className="text-gray-500 text-base mt-1">
              Manage your swimming sessions
            </Text>
          </View>
          
          <Pressable
            onPress={handleNewBooking}
            className="bg-blue-500 w-12 h-12 rounded-full items-center justify-center shadow-sm"
          >
            <Ionicons name="add" size={24} color="white" />
          </Pressable>
        </View>
      </Animated.View>

      {/* Stats Overview */}
      <Animated.View
        entering={FadeInDown.delay(200).springify()}
        className="px-6 mb-6"
      >
        <View className="flex-row justify-between">
          <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex-1 mr-2">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-gray-500 text-sm">Next Session</Text>
              <Ionicons name="time" size={16} color="#3B82F6" />
            </View>
            <Text className="text-gray-900 text-lg font-bold">Tomorrow</Text>
            <Text className="text-blue-600 text-sm mt-1">3:00 PM</Text>
          </View>
          
          <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex-1 ml-2">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-gray-500 text-sm">This Month</Text>
              <Ionicons name="calendar" size={16} color="#10B981" />
            </View>
            <Text className="text-gray-900 text-lg font-bold">8</Text>
            <Text className="text-green-600 text-sm mt-1">Sessions</Text>
          </View>
        </View>
      </Animated.View>

      {/* Filter Tabs */}
      <Animated.View
        entering={FadeInDown.delay(300).springify()}
        className="mb-4"
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24 }}
        >
          {filters.map(filter => (
            <Pressable
              key={filter.key}
              onPress={() => setSelectedFilter(filter.key)}
              className={`mr-3 px-4 py-2 rounded-full ${
                selectedFilter === filter.key
                  ? 'bg-blue-500'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <Text
                className={`font-medium ${
                  selectedFilter === filter.key
                    ? 'text-white'
                    : 'text-gray-600'
                }`}
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
          paddingBottom: 100, // Space for tab bar
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <Animated.View
            entering={FadeInDown.delay(400).springify()}
            className="items-center justify-center py-12"
          >
            <Ionicons name="calendar-outline" size={64} color="#D1D5DB" />
            <Text className="text-gray-500 text-lg font-medium mt-4">
              No bookings found
            </Text>
            <Text className="text-gray-400 text-base mt-2 text-center px-8 mb-6">
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