import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  FlatList,
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

interface Student {
  id: string;
  name: string;
  avatar: string;
  status: 'present' | 'absent' | 'late' | 'not_marked';
}

interface AttendanceClass {
  id: string;
  name: string;
  level: string;
  time: string;
  studentsCount: number;
  attendanceMarked: boolean;
  students: Student[];
}

interface ClassCardProps {
  classInfo: AttendanceClass;
  index: number;
  onPress: (classInfo: AttendanceClass) => void;
}

const ClassCard: React.FC<ClassCardProps> = ({ classInfo, index, onPress }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const presentCount = classInfo.students.filter(s => s.status === 'present').length;
  const absentCount = classInfo.students.filter(s => s.status === 'absent').length;

  return (
    <Animated.View
      layout={Layout.springify()}
      entering={FadeInRight.delay(index * 50).springify()}
      style={animatedStyle}
    >
      <Pressable
        onPress={() => onPress(classInfo)}
        onPressIn={() => {
          scale.value = withSpring(0.98);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-3 mx-4"
      >
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1">
            <Text className="text-gray-900 font-semibold text-base">
              {classInfo.name}
            </Text>
            <Text className="text-gray-500 text-sm">{classInfo.level}</Text>
            <Text className="text-gray-400 text-xs mt-1">{classInfo.time}</Text>
          </View>
          
          {classInfo.attendanceMarked ? (
            <View className="bg-green-50 px-3 py-1 rounded-full">
              <Text className="text-green-600 font-medium text-xs">Completed</Text>
            </View>
          ) : (
            <View className="bg-orange-50 px-3 py-1 rounded-full">
              <Text className="text-orange-600 font-medium text-xs">Pending</Text>
            </View>
          )}
        </View>

        {/* Attendance Summary */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <View className="flex-row items-center mr-4">
              <View className="w-3 h-3 bg-green-500 rounded-full mr-2" />
              <Text className="text-gray-600 text-sm">Present: {presentCount}</Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-3 h-3 bg-red-500 rounded-full mr-2" />
              <Text className="text-gray-600 text-sm">Absent: {absentCount}</Text>
            </View>
          </View>
          <Text className="text-gray-500 text-sm">
            Total: {classInfo.studentsCount}
          </Text>
        </View>

        {/* Action Button */}
        <Pressable 
          className={`flex-row items-center justify-center py-2 px-4 rounded-lg ${
            classInfo.attendanceMarked ? 'bg-blue-50' : 'bg-green-50'
          }`}
        >
          <Ionicons 
            name={classInfo.attendanceMarked ? "eye-outline" : "checkmark-circle-outline"} 
            size={16} 
            color={classInfo.attendanceMarked ? "#3B82F6" : "#10B981"} 
          />
          <Text className={`font-medium text-sm ml-2 ${
            classInfo.attendanceMarked ? 'text-blue-600' : 'text-green-600'
          }`}>
            {classInfo.attendanceMarked ? 'View Attendance' : 'Mark Attendance'}
          </Text>
        </Pressable>
      </Pressable>
    </Animated.View>
  );
};

/**
 * Attendance Screen - Attendance Management
 * 
 * Features:
 * - Today's classes with attendance status
 * - Quick attendance marking
 * - Attendance history and reports
 * - Student attendance patterns
 * - Bulk attendance actions
 */
export const AttendanceScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Mock data - replace with real API call
  const [classes] = useState<AttendanceClass[]>([
    {
      id: '1',
      name: 'Swimming Level 1',
      level: 'Beginner Group A',
      time: '10:00 AM - 11:00 AM',
      studentsCount: 8,
      attendanceMarked: true,
      students: [
        { id: '1', name: 'Emma Johnson', avatar: 'EJ', status: 'present' },
        { id: '2', name: 'Liam Smith', avatar: 'LS', status: 'present' },
        { id: '3', name: 'Olivia Davis', avatar: 'OD', status: 'absent' },
        { id: '4', name: 'Noah Wilson', avatar: 'NW', status: 'present' },
        { id: '5', name: 'Ava Brown', avatar: 'AB', status: 'present' },
        { id: '6', name: 'William Jones', avatar: 'WJ', status: 'present' },
        { id: '7', name: 'Sophia Garcia', avatar: 'SG', status: 'present' },
        { id: '8', name: 'James Miller', avatar: 'JM', status: 'present' },
      ],
    },
    {
      id: '2',
      name: 'Swimming Level 2',
      level: 'Intermediate Group B',
      time: '2:00 PM - 3:00 PM',
      studentsCount: 12,
      attendanceMarked: false,
      students: [
        { id: '9', name: 'Isabella Anderson', avatar: 'IA', status: 'not_marked' },
        { id: '10', name: 'Mason Taylor', avatar: 'MT', status: 'not_marked' },
        // ... more students
      ],
    },
    {
      id: '3',
      name: 'Advanced Swimming',
      level: 'Advanced Group A',
      time: '4:30 PM - 5:30 PM',
      studentsCount: 6,
      attendanceMarked: false,
      students: [
        { id: '13', name: 'Charlotte Thomas', avatar: 'CT', status: 'not_marked' },
        { id: '14', name: 'Lucas Jackson', avatar: 'LJ', status: 'not_marked' },
        // ... more students
      ],
    },
  ]);

  const handleClassPress = (classInfo: AttendanceClass) => {
    if (classInfo.attendanceMarked) {
      console.log('View attendance for:', classInfo.id);
    } else {
      console.log('Mark attendance for:', classInfo.id);
    }
  };

  const completedCount = classes.filter(c => c.attendanceMarked).length;
  const pendingCount = classes.length - completedCount;

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <Animated.View
        entering={FadeInDown.delay(100).springify()}
        className="px-6 pt-4 pb-2"
        style={{ paddingTop: insets.top + 16 }}
      >
        <Text className="text-gray-900 text-2xl font-bold">Attendance</Text>
        <Text className="text-gray-500 text-base mt-1">
          Mark and track student attendance
        </Text>
      </Animated.View>

      {/* Date Selector & Stats */}
      <Animated.View
        entering={FadeInDown.delay(200).springify()}
        className="px-6 mb-4"
      >
        <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-gray-900 font-semibold text-base">Today's Overview</Text>
            <Pressable className="flex-row items-center bg-blue-50 px-3 py-1 rounded-lg">
              <Ionicons name="calendar-outline" size={16} color="#3B82F6" />
              <Text className="text-blue-600 font-medium text-sm ml-2">Change Date</Text>
            </Pressable>
          </View>
          
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-bold text-gray-900">{classes.length}</Text>
              <Text className="text-gray-500 text-sm">Total Classes</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-green-600">{completedCount}</Text>
              <Text className="text-gray-500 text-sm">Completed</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-orange-600">{pendingCount}</Text>
              <Text className="text-gray-500 text-sm">Pending</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Quick Actions */}
      <Animated.View
        entering={FadeInDown.delay(300).springify()}
        className="px-6 mb-4"
      >
        <View className="flex-row space-x-3">
          <Pressable className="flex-1 bg-green-500 rounded-lg py-3">
            <View className="items-center">
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text className="text-white font-medium text-sm mt-1">Mark All Present</Text>
            </View>
          </Pressable>
          <Pressable className="flex-1 bg-blue-500 rounded-lg py-3">
            <View className="items-center">
              <Ionicons name="bar-chart" size={20} color="white" />
              <Text className="text-white font-medium text-sm mt-1">View Reports</Text>
            </View>
          </Pressable>
        </View>
      </Animated.View>

      {/* Classes List */}
      <FlatList
        data={classes}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <ClassCard
            classInfo={item}
            index={index}
            onPress={handleClassPress}
          />
        )}
        contentContainerStyle={{
          paddingBottom: 100, // Space for tab bar
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <Animated.View
            entering={FadeInDown.delay(400).springify()}
            className="items-center justify-center py-12"
          >
            <Ionicons name="calendar-outline" size={64} color="#D1D5DB" />
            <Text className="text-gray-500 text-lg font-medium mt-4">
              No classes scheduled
            </Text>
            <Text className="text-gray-400 text-base mt-2 text-center px-8">
              No classes found for the selected date
            </Text>
          </Animated.View>
        )}
      />
    </View>
  );
};