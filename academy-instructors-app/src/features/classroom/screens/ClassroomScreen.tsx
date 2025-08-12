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
import { useAuthStore } from '@academy/mobile-shared';

const { width } = Dimensions.get('window');

interface ClassCardProps {
  classInfo: {
    id: string;
    name: string;
    level: string;
    time: string;
    studentCount: number;
    status: 'upcoming' | 'active' | 'completed';
    progress: number;
  };
  index: number;
  onPress: () => void;
}

const ClassCard: React.FC<ClassCardProps> = ({ classInfo, index, onPress }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getStatusColor = (status: ClassCardProps['classInfo']['status']) => {
    switch (status) {
      case 'upcoming':
        return '#3B82F6';
      case 'active':
        return '#10B981';
      case 'completed':
        return '#6B7280';
      default:
        return '#9CA3AF';
    }
  };

  const getStatusText = (status: ClassCardProps['classInfo']['status']) => {
    switch (status) {
      case 'upcoming':
        return 'Upcoming';
      case 'active':
        return 'Active Now';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 100).springify()}
      style={animatedStyle}
    >
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.98);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4 mx-4"
      >
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1">
            <Text className="text-gray-900 font-semibold text-lg">{classInfo.name}</Text>
            <Text className="text-gray-500 text-sm">{classInfo.level}</Text>
          </View>
          <View 
            className="px-3 py-1 rounded-full"
            style={{ backgroundColor: `${getStatusColor(classInfo.status)}15` }}
          >
            <Text 
              className="text-xs font-medium"
              style={{ color: getStatusColor(classInfo.status) }}
            >
              {getStatusText(classInfo.status)}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={16} color="#6B7280" />
            <Text className="text-gray-600 text-sm ml-2">{classInfo.time}</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="people-outline" size={16} color="#6B7280" />
            <Text className="text-gray-600 text-sm ml-2">{classInfo.studentCount} students</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View className="mb-3">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-gray-500 text-xs">Class Progress</Text>
            <Text className="text-gray-500 text-xs">{classInfo.progress}%</Text>
          </View>
          <View className="bg-gray-200 rounded-full h-2">
            <View 
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${classInfo.progress}%` }}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row justify-between">
          <Pressable className="flex-row items-center bg-blue-50 px-3 py-2 rounded-lg flex-1 mr-2">
            <Ionicons name="checkmark-circle-outline" size={16} color="#3B82F6" />
            <Text className="text-blue-600 font-medium text-sm ml-2">Attendance</Text>
          </Pressable>
          <Pressable className="flex-row items-center bg-green-50 px-3 py-2 rounded-lg flex-1 ml-2">
            <Ionicons name="clipboard-outline" size={16} color="#10B981" />
            <Text className="text-green-600 font-medium text-sm ml-2">Notes</Text>
          </Pressable>
        </View>
      </Pressable>
    </Animated.View>
  );
};

/**
 * Classroom Screen - Main Hub for Instructors
 * 
 * Features:
 * - Today's classes overview
 * - Quick class management actions
 * - Recent activity and notifications
 * - Performance insights
 * - Easy navigation to attendance and grading
 */
export const ClassroomScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { user, currentProgram } = useAuthStore();

  // Mock data - replace with real API call
  const todaysClasses = [
    {
      id: '1',
      name: 'Swimming Level 1',
      level: 'Beginner Group A',
      time: '10:00 AM - 11:00 AM',
      studentCount: 8,
      status: 'completed' as const,
      progress: 100,
    },
    {
      id: '2',
      name: 'Swimming Level 2',
      level: 'Intermediate Group B',
      time: '2:00 PM - 3:00 PM',
      studentCount: 12,
      status: 'active' as const,
      progress: 45,
    },
    {
      id: '3',
      name: 'Advanced Swimming',
      level: 'Advanced Group A',
      time: '4:30 PM - 5:30 PM',
      studentCount: 6,
      status: 'upcoming' as const,
      progress: 0,
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
          className="px-6 mb-6"
        >
          <Text className="text-gray-500 text-base">Good morning,</Text>
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

        {/* Quick Stats */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          className="px-6 mb-6"
        >
          <View className="flex-row justify-between">
            <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex-1 mr-2">
              <View className="flex-row items-center">
                <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center">
                  <Ionicons name="calendar" size={16} color="#3B82F6" />
                </View>
                <View className="ml-3">
                  <Text className="text-gray-500 text-sm">Today's Classes</Text>
                  <Text className="text-gray-900 text-xl font-bold">{todaysClasses.length}</Text>
                </View>
              </View>
            </View>
            <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex-1 ml-2">
              <View className="flex-row items-center">
                <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center">
                  <Ionicons name="people" size={16} color="#10B981" />
                </View>
                <View className="ml-3">
                  <Text className="text-gray-500 text-sm">Total Students</Text>
                  <Text className="text-gray-900 text-xl font-bold">
                    {todaysClasses.reduce((acc, cls) => acc + cls.studentCount, 0)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Today's Classes */}
        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          className="mb-6"
        >
          <Text className="text-gray-900 text-lg font-semibold mb-4 px-6">
            Today's Classes
          </Text>
          {todaysClasses.map((classInfo, index) => (
            <ClassCard
              key={classInfo.id}
              classInfo={classInfo}
              index={index}
              onPress={() => console.log('Navigate to class:', classInfo.id)}
            />
          ))}
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          className="px-6 mb-6"
        >
          <Text className="text-gray-900 text-lg font-semibold mb-4">
            Quick Actions
          </Text>
          <View className="flex-row justify-between">
            <Pressable className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex-1 mr-2">
              <View className="items-center">
                <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mb-2">
                  <Ionicons name="add" size={24} color="#3B82F6" />
                </View>
                <Text className="text-gray-900 font-medium text-sm">Add Class</Text>
              </View>
            </Pressable>
            <Pressable className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex-1 mx-1">
              <View className="items-center">
                <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mb-2">
                  <Ionicons name="clipboard" size={24} color="#10B981" />
                </View>
                <Text className="text-gray-900 font-medium text-sm">Quick Note</Text>
              </View>
            </Pressable>
            <Pressable className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex-1 ml-2">
              <View className="items-center">
                <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mb-2">
                  <Ionicons name="bar-chart" size={24} color="#8B5CF6" />
                </View>
                <Text className="text-gray-900 font-medium text-sm">Reports</Text>
              </View>
            </Pressable>
          </View>
        </Animated.View>

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
                <Text className="text-gray-900 font-medium">Attendance completed</Text>
                <Text className="text-gray-500 text-sm">Swimming Level 1 - All 8 students present</Text>
              </View>
              <Text className="text-gray-400 text-xs">2m ago</Text>
            </View>
            <View className="flex-row items-center mb-3">
              <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="star" size={16} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-medium">Student progress updated</Text>
                <Text className="text-gray-500 text-sm">Emma Johnson advanced to Level 3</Text>
              </View>
              <Text className="text-gray-400 text-xs">1h ago</Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-yellow-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="clipboard" size={16} color="#F59E0B" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-medium">Class note added</Text>
                <Text className="text-gray-500 text-sm">Advanced Swimming - Technique improvements noted</Text>
              </View>
              <Text className="text-gray-400 text-xs">3h ago</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};