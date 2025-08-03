import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
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
  level: string;
  progress: number;
  lastSession: string;
  status: 'active' | 'inactive' | 'completed';
  avatar: string;
}

interface StudentCardProps {
  student: Student;
  index: number;
  onPress: (student: Student) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, index, onPress }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getStatusColor = (status: Student['status']) => {
    switch (status) {
      case 'active':
        return '#10B981';
      case 'inactive':
        return '#F59E0B';
      case 'completed':
        return '#3B82F6';
      default:
        return '#6B7280';
    }
  };

  const getStatusText = (status: Student['status']) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'inactive':
        return 'Inactive';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  return (
    <Animated.View
      layout={Layout.springify()}
      entering={FadeInRight.delay(index * 50).springify()}
      style={animatedStyle}
    >
      <Pressable
        onPress={() => onPress(student)}
        onPressIn={() => {
          scale.value = withSpring(0.98);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-3 mx-4"
      >
        <View className="flex-row items-center">
          {/* Avatar */}
          <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4">
            <Text className="text-blue-600 font-semibold text-lg">
              {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </Text>
          </View>

          {/* Student Info */}
          <View className="flex-1">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-gray-900 font-semibold text-base">
                {student.name}
              </Text>
              <View 
                className="px-2 py-1 rounded-full"
                style={{ backgroundColor: `${getStatusColor(student.status)}15` }}
              >
                <Text 
                  className="text-xs font-medium"
                  style={{ color: getStatusColor(student.status) }}
                >
                  {getStatusText(student.status)}
                </Text>
              </View>
            </View>
            
            <Text className="text-gray-500 text-sm mb-2">{student.level}</Text>
            
            {/* Progress Bar */}
            <View className="flex-row items-center">
              <View className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                <View 
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${student.progress}%` }}
                />
              </View>
              <Text className="text-gray-500 text-xs">
                {student.progress}%
              </Text>
            </View>
            
            <Text className="text-gray-400 text-xs mt-2">
              Last session: {student.lastSession}
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </View>
      </Pressable>
    </Animated.View>
  );
};

/**
 * Students Screen - Student Management
 * 
 * Features:
 * - Student list with search and filtering
 * - Progress overview for each student
 * - Quick actions (attendance, notes, etc.)
 * - Student status indicators
 * - Smooth animations and interactions
 */
export const StudentsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'inactive' | 'completed'>('all');

  // Mock data - replace with real API call
  const [students] = useState<Student[]>([
    {
      id: '1',
      name: 'Emma Johnson',
      level: 'Swimming Level 2',
      progress: 75,
      lastSession: '2 days ago',
      status: 'active',
      avatar: 'EJ',
    },
    {
      id: '2',
      name: 'Michael Chen',
      level: 'Swimming Level 1',
      progress: 45,
      lastSession: '1 week ago',
      status: 'inactive',
      avatar: 'MC',
    },
    {
      id: '3',
      name: 'Sarah Williams',
      level: 'Swimming Level 3',
      progress: 100,
      lastSession: '3 days ago',
      status: 'completed',
      avatar: 'SW',
    },
    {
      id: '4',
      name: 'David Brown',
      level: 'Swimming Level 1',
      progress: 30,
      lastSession: 'Yesterday',
      status: 'active',
      avatar: 'DB',
    },
    {
      id: '5',
      name: 'Lisa Davis',
      level: 'Swimming Level 2',
      progress: 60,
      lastSession: '4 days ago',
      status: 'active',
      avatar: 'LD',
    },
  ]);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.level.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || student.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const filters = [
    { key: 'all' as const, label: 'All', count: students.length },
    { key: 'active' as const, label: 'Active', count: students.filter(s => s.status === 'active').length },
    { key: 'inactive' as const, label: 'Inactive', count: students.filter(s => s.status === 'inactive').length },
    { key: 'completed' as const, label: 'Completed', count: students.filter(s => s.status === 'completed').length },
  ];

  const handleStudentPress = (student: Student) => {
    console.log('Navigate to student detail:', student.id);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <Animated.View
        entering={FadeInDown.delay(100).springify()}
        className="px-6 pt-4 pb-2"
        style={{ paddingTop: insets.top + 16 }}
      >
        <Text className="text-gray-900 text-2xl font-bold">Students</Text>
        <Text className="text-gray-500 text-base mt-1">
          Manage your students and track their progress
        </Text>
      </Animated.View>

      {/* Search Bar */}
      <Animated.View
        entering={FadeInDown.delay(200).springify()}
        className="px-6 mb-4"
      >
        <View className="bg-white rounded-xl border border-gray-200 flex-row items-center px-4 py-3">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-3 text-gray-900 text-base"
            placeholder="Search students..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
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

      {/* Students List */}
      <FlatList
        data={filteredStudents}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <StudentCard
            student={item}
            index={index}
            onPress={handleStudentPress}
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
            <Ionicons name="people-outline" size={64} color="#D1D5DB" />
            <Text className="text-gray-500 text-lg font-medium mt-4">
              No students found
            </Text>
            <Text className="text-gray-400 text-base mt-2 text-center px-8">
              Try adjusting your search or filter criteria
            </Text>
          </Animated.View>
        )}
      />
    </View>
  );
};