import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInRight,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useAuthStore } from '@/shared/store';

const { width } = Dimensions.get('window');

interface QuickActionProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  color: string;
  onPress: () => void;
  index: number;
}

interface CourseCardProps {
  id: string;
  title: string;
  level: string;
  nextSession: string;
  progress: number;
  color: string;
  index: number;
  onPress: () => void;
}

const QuickActionCard: React.FC<QuickActionProps> = ({
  icon,
  title,
  subtitle,
  color,
  onPress,
  index,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 100).springify()}
      style={animatedStyle}
    >
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.95);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-3"
      >
        <View className="flex-row items-center">
          <View
            className="w-12 h-12 rounded-full items-center justify-center mr-4"
            style={{ backgroundColor: `${color}15` }}
          >
            <Ionicons name={icon} size={24} color={color} />
          </View>
          <View className="flex-1">
            <Text className="text-gray-900 font-semibold text-base">{title}</Text>
            <Text className="text-gray-500 text-sm mt-1">{subtitle}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </View>
      </Pressable>
    </Animated.View>
  );
};

const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  level,
  nextSession,
  progress,
  color,
  index,
  onPress,
}) => {
  return (
    <Animated.View
      entering={FadeInRight.delay(index * 100).springify()}
      style={{ width: width * 0.8, marginRight: 16 }}
    >
      <Pressable
        onPress={onPress}
        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
        style={{ backgroundColor: `${color}05` }}
      >
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1">
            <Text className="text-gray-900 font-semibold text-lg">{title}</Text>
            <Text className="text-gray-600 text-sm">{level}</Text>
          </View>
          <View
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: `${color}20` }}
          >
            <Ionicons name="water" size={20} color={color} />
          </View>
        </View>
        
        <View className="mb-3">
          <Text className="text-gray-500 text-xs mb-2">Progress</Text>
          <View className="bg-gray-200 rounded-full h-2">
            <View
              className="h-2 rounded-full"
              style={{ 
                width: `${progress}%`,
                backgroundColor: color 
              }}
            />
          </View>
          <Text className="text-gray-600 text-xs mt-1">{progress}% complete</Text>
        </View>

        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-gray-500 text-xs">Next Session</Text>
            <Text className="text-gray-900 text-sm font-medium">{nextSession}</Text>
          </View>
          <View className="bg-blue-50 px-3 py-1 rounded-full">
            <Text className="text-blue-600 text-xs font-medium">Active</Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

/**
 * Student Home Screen - Dashboard Overview
 * 
 * Features:
 * - Personalized welcome message
 * - Current courses overview
 * - Quick action buttons
 * - Progress summary
 * - Upcoming sessions
 * - Achievement highlights
 */
export const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { user, currentProgram } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const quickActions = [
    {
      icon: 'book-outline' as const,
      title: 'Browse Courses',
      subtitle: 'Discover new swimming programs',
      color: '#3B82F6',
      onPress: () => console.log('Navigate to courses'),
    },
    {
      icon: 'calendar-outline' as const,
      title: 'My Bookings',
      subtitle: 'View and manage your sessions',
      color: '#10B981',
      onPress: () => console.log('Navigate to bookings'),
    },
    {
      icon: 'analytics-outline' as const,
      title: 'Progress Tracker',
      subtitle: 'See your swimming achievements',
      color: '#8B5CF6',
      onPress: () => console.log('Navigate to progress'),
    },
    {
      icon: 'person-outline' as const,
      title: 'My Profile',
      subtitle: 'Update your information',
      color: '#F59E0B',
      onPress: () => console.log('Navigate to profile'),
    },
  ];

  // Mock current courses data
  const currentCourses = [
    {
      id: '1',
      title: 'Learn to Swim',
      level: 'Beginner Level 2',
      nextSession: 'Tomorrow 3:00 PM',
      progress: 65,
      color: '#3B82F6',
    },
    {
      id: '2',
      title: 'Swimming Club',
      level: 'Intermediate Training',
      nextSession: 'Friday 4:00 PM',
      progress: 30,
      color: '#10B981',
    },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: 100, // Space for tab bar
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header Section */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          className="px-6 mb-8"
        >
          <Text className="text-gray-500 text-base">{getGreeting()},</Text>
          <Text className="text-gray-900 text-2xl font-bold mt-1">
            {user?.firstName || 'Swimmer'}! 🏊‍♀️
          </Text>
          <View className="flex-row items-center mt-3 bg-blue-50 px-3 py-2 rounded-lg self-start">
            <Ionicons name="water" size={16} color="#3B82F6" />
            <Text className="text-blue-600 font-medium text-sm ml-2">
              {currentProgram?.name || 'Academy Swimming'}
            </Text>
          </View>
        </Animated.View>

        {/* Stats Overview */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          className="px-6 mb-8"
        >
          <View className="flex-row justify-between">
            <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex-1 mr-2">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-gray-500 text-sm">Active Courses</Text>
                <Ionicons name="book" size={16} color="#3B82F6" />
              </View>
              <Text className="text-gray-900 text-2xl font-bold">{currentCourses.length}</Text>
              <Text className="text-green-600 text-sm mt-1">In progress</Text>
            </View>
            
            <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex-1 ml-2">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-gray-500 text-sm">Next Session</Text>
                <Ionicons name="time" size={16} color="#10B981" />
              </View>
              <Text className="text-gray-900 text-lg font-bold">Tomorrow</Text>
              <Text className="text-blue-600 text-sm mt-1">3:00 PM</Text>
            </View>
          </View>
        </Animated.View>

        {/* Current Courses */}
        <View className="mb-8">
          <Animated.View
            entering={FadeInDown.delay(300).springify()}
            className="px-6 mb-4"
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-900 text-lg font-semibold">
                My Courses
              </Text>
              <Pressable>
                <Text className="text-blue-600 font-medium text-sm">View All</Text>
              </Pressable>
            </View>
          </Animated.View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24 }}
          >
            {currentCourses.map((course, index) => (
              <CourseCard
                key={course.id}
                {...course}
                index={index}
                onPress={() => console.log('Navigate to course:', course.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View className="px-6 mb-8">
          <Animated.Text
            entering={FadeInDown.delay(400).springify()}
            className="text-gray-900 text-lg font-semibold mb-4"
          >
            Quick Actions
          </Animated.Text>
          {quickActions.map((action, index) => (
            <QuickActionCard
              key={action.title}
              {...action}
              index={index}
            />
          ))}
        </View>

        {/* Recent Activity */}
        <Animated.View
          entering={FadeInDown.delay(500).springify()}
          className="px-6 mb-8"
        >
          <Text className="text-gray-900 text-lg font-semibold mb-4">
            Recent Activity
          </Text>
          <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <View className="flex-row items-center mb-3">
              <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="checkmark" size={16} color="#10B981" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-medium">Session completed</Text>
                <Text className="text-gray-500 text-sm">Learn to Swim - Level 2 practice</Text>
              </View>
              <Text className="text-gray-400 text-xs">2h ago</Text>
            </View>
            
            <View className="flex-row items-center mb-3">
              <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="trophy" size={16} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-medium">Achievement unlocked</Text>
                <Text className="text-gray-500 text-sm">Completed 10 backstroke laps!</Text>
              </View>
              <Text className="text-gray-400 text-xs">1d ago</Text>
            </View>
            
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-purple-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="calendar" size={16} color="#8B5CF6" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-medium">Session booked</Text>
                <Text className="text-gray-500 text-sm">Swimming Club training scheduled</Text>
              </View>
              <Text className="text-gray-400 text-xs">2d ago</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};