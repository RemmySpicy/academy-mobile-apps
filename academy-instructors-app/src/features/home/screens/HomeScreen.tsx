import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Dimensions,
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

/**
 * Home Screen - Dashboard Overview
 * 
 * Features:
 * - Welcome message with current program
 * - Quick action cards with smooth animations
 * - Recent activity overview
 * - Program switching capability
 * - Statistics overview
 */
export const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { user, currentProgram } = useAuthStore();

  const quickActions = [
    {
      icon: 'people-outline' as const,
      title: 'My Students',
      subtitle: 'View and manage student progress',
      color: '#3B82F6',
      onPress: () => console.log('Navigate to students'),
    },
    {
      icon: 'calendar-outline' as const,
      title: 'Today\'s Schedule',
      subtitle: 'View upcoming classes and sessions',
      color: '#10B981',
      onPress: () => console.log('Navigate to schedule'),
    },
    {
      icon: 'analytics-outline' as const,
      title: 'Performance Insights',
      subtitle: 'Check student progress and analytics',
      color: '#8B5CF6',
      onPress: () => console.log('Navigate to analytics'),
    },
    {
      icon: 'add-circle-outline' as const,
      title: 'Quick Actions',
      subtitle: 'Add attendance, grades, or notes',
      color: '#F59E0B',
      onPress: () => console.log('Show quick actions'),
    },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: 100, // Space for tab bar
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          className="px-6 mb-8"
        >
          <Text className="text-gray-500 text-base">Welcome back,</Text>
          <Text className="text-gray-900 text-2xl font-bold mt-1">
            {user?.firstName || 'Instructor'}
          </Text>
          <View className="flex-row items-center mt-3 bg-blue-50 px-3 py-2 rounded-lg self-start">
            <Ionicons name="business-outline" size={16} color="#3B82F6" />
            <Text className="text-blue-600 font-medium text-sm ml-2">
              {currentProgram?.name || 'Select Program'}
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
              <Text className="text-gray-500 text-sm">Active Students</Text>
              <Text className="text-gray-900 text-2xl font-bold mt-1">24</Text>
              <Text className="text-green-600 text-sm mt-1">+3 this week</Text>
            </View>
            <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex-1 ml-2">
              <Text className="text-gray-500 text-sm">Today's Classes</Text>
              <Text className="text-gray-900 text-2xl font-bold mt-1">5</Text>
              <Text className="text-blue-600 text-sm mt-1">Next at 2:00 PM</Text>
            </View>
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <View className="px-6 mb-8">
          <Animated.Text
            entering={FadeInDown.delay(300).springify()}
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
                <Text className="text-gray-900 font-medium">Attendance marked</Text>
                <Text className="text-gray-500 text-sm">Swimming Level 2 - 10 students present</Text>
              </View>
              <Text className="text-gray-400 text-xs">2h ago</Text>
            </View>
            <View className="flex-row items-center mb-3">
              <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="star" size={16} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-medium">Progress updated</Text>
                <Text className="text-gray-500 text-sm">Sarah Johnson completed Level 1</Text>
              </View>
              <Text className="text-gray-400 text-xs">4h ago</Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-yellow-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="chatbubble" size={16} color="#F59E0B" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-medium">New message</Text>
                <Text className="text-gray-500 text-sm">Parent inquiry about schedule changes</Text>
              </View>
              <Text className="text-gray-400 text-xs">6h ago</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};