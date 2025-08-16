import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInRight,
} from 'react-native-reanimated';
import type { ScreenProps, StudentsStackParamList } from '../types';

type StudentDetailScreenProps = ScreenProps<StudentsStackParamList, 'StudentDetail'>;

/**
 * Student Detail Screen
 * 
 * Features:
 * - Detailed student information
 * - Progress tracking
 * - Attendance history
 * - Notes and assessments
 * - Contact information
 */
export const StudentDetailScreen: React.FC<StudentDetailScreenProps> = ({ route, navigation }) => {
  const { studentId, studentName } = route.params;
  const insets = useSafeAreaInsets();

  // Mock student data - replace with real API call
  const student = {
    id: studentId,
    name: studentName,
    level: 'Swimming Level 2',
    progress: 75,
    attendance: 92,
    joinDate: '2024-01-15',
    age: 12,
    parentName: 'Sarah Johnson',
    parentPhone: '+1 (555) 123-4567',
    parentEmail: 'sarah.johnson@email.com',
    notes: 'Excellent swimmer, shows great improvement in backstroke technique.',
    nextSession: '2024-02-15 10:00 AM',
    totalSessions: 24,
    completedSessions: 18,
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <Animated.View
        entering={FadeInDown.delay(100).springify()}
        className="bg-white px-6 pt-4 pb-4 shadow-sm"
        style={{ paddingTop: insets.top + 16 }}
      >
        <View className="flex-row items-center">
          <Pressable 
            onPress={() => navigation.goBack()}
            className="mr-4 p-2"
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </Pressable>
          <View className="flex-1">
            <Text className="text-gray-900 text-xl font-bold">{student.name}</Text>
            <Text className="text-gray-500 text-sm">{student.level}</Text>
          </View>
        </View>
      </Animated.View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: 100, // Space for tab bar
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Student Avatar & Basic Info */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          className="px-6 py-6"
        >
          <View className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 items-center">
            <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-4">
              <Text className="text-blue-600 font-bold text-2xl">
                {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </Text>
            </View>
            <Text className="text-gray-900 text-xl font-bold">{student.name}</Text>
            <Text className="text-gray-500 text-base mt-1">{student.level}</Text>
            <Text className="text-gray-400 text-sm mt-1">Age: {student.age}</Text>
          </View>
        </Animated.View>

        {/* Progress & Stats */}
        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          className="px-6 mb-6"
        >
          <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <Text className="text-gray-900 font-semibold text-lg mb-4">Progress Overview</Text>
            
            <View className="flex-row justify-between mb-4">
              <View className="flex-1 mr-2">
                <Text className="text-gray-500 text-sm mb-2">Overall Progress</Text>
                <View className="bg-gray-200 rounded-full h-3">
                  <View 
                    className="bg-blue-500 h-3 rounded-full"
                    style={{ width: `${student.progress}%` }}
                  />
                </View>
                <Text className="text-gray-600 text-sm mt-1">{student.progress}%</Text>
              </View>
              <View className="flex-1 ml-2">
                <Text className="text-gray-500 text-sm mb-2">Attendance Rate</Text>
                <View className="bg-gray-200 rounded-full h-3">
                  <View 
                    className="bg-green-500 h-3 rounded-full"
                    style={{ width: `${student.attendance}%` }}
                  />
                </View>
                <Text className="text-gray-600 text-sm mt-1">{student.attendance}%</Text>
              </View>
            </View>

            <View className="flex-row justify-between">
              <View className="items-center">
                <Text className="text-2xl font-bold text-gray-900">{student.completedSessions}</Text>
                <Text className="text-gray-500 text-sm">Sessions Completed</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-gray-900">{student.totalSessions}</Text>
                <Text className="text-gray-500 text-sm">Total Sessions</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-gray-900">{student.totalSessions - student.completedSessions}</Text>
                <Text className="text-gray-500 text-sm">Remaining</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Parent Information */}
        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          className="px-6 mb-6"
        >
          <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <Text className="text-gray-900 font-semibold text-lg mb-4">Parent Information</Text>
            
            <View className="space-y-3">
              <View className="flex-row items-center">
                <Ionicons name="person-outline" size={20} color="#6B7280" />
                <Text className="text-gray-600 ml-3">{student.parentName}</Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="call-outline" size={20} color="#6B7280" />
                <Text className="text-gray-600 ml-3">{student.parentPhone}</Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="mail-outline" size={20} color="#6B7280" />
                <Text className="text-gray-600 ml-3">{student.parentEmail}</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Notes & Assessments */}
        <Animated.View
          entering={FadeInDown.delay(500).springify()}
          className="px-6 mb-6"
        >
          <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-gray-900 font-semibold text-lg">Notes & Assessments</Text>
              <Pressable>
                <Ionicons name="add" size={24} color="#3B82F6" />
              </Pressable>
            </View>
            
            <View className="bg-gray-50 rounded-lg p-3">
              <Text className="text-gray-600 text-sm">{student.notes}</Text>
              <Text className="text-gray-400 text-xs mt-2">Last updated: 3 days ago</Text>
            </View>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View
          entering={FadeInDown.delay(600).springify()}
          className="px-6 mb-8"
        >
          <View className="space-y-3">
            <Pressable className="bg-blue-500 rounded-xl py-4">
              <View className="flex-row items-center justify-center">
                <Ionicons name="checkmark-circle" size={20} color="white" />
                <Text className="text-white font-semibold text-base ml-2">Mark Attendance</Text>
              </View>
            </Pressable>
            
            <View className="flex-row space-x-3">
              <Pressable className="flex-1 bg-white rounded-xl py-4 border border-gray-200">
                <View className="items-center">
                  <Ionicons name="clipboard-outline" size={20} color="#374151" />
                  <Text className="text-gray-700 font-medium text-sm mt-1">Add Note</Text>
                </View>
              </Pressable>
              <Pressable className="flex-1 bg-white rounded-xl py-4 border border-gray-200">
                <View className="items-center">
                  <Ionicons name="call-outline" size={20} color="#374151" />
                  <Text className="text-gray-700 font-medium text-sm mt-1">Contact Parent</Text>
                </View>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};