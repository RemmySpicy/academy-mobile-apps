import React, { useState } from 'react';
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

const { width } = Dimensions.get('window');

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  index: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  trend, 
  icon, 
  color, 
  index 
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return '#10B981';
      case 'down':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return 'trending-up';
      case 'down':
        return 'trending-down';
      default:
        return 'remove';
    }
  };

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 100).springify()}
      style={[animatedStyle, { width: (width - 48) / 2 }]}
    >
      <Pressable
        onPressIn={() => {
          scale.value = withSpring(0.98);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-3"
      >
        <View className="flex-row items-center justify-between mb-2">
          <View 
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: `${color}15` }}
          >
            <Ionicons name={icon} size={20} color={color} />
          </View>
          <Ionicons 
            name={getTrendIcon() as any} 
            size={16} 
            color={getTrendColor()} 
          />
        </View>
        <Text className="text-gray-900 text-2xl font-bold">{value}</Text>
        <Text className="text-gray-500 text-sm mt-1">{title}</Text>
        <Text 
          className="text-xs font-medium mt-1"
          style={{ color: getTrendColor() }}
        >
          {change}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

interface StudentPerformanceProps {
  student: {
    id: string;
    name: string;
    level: string;
    progress: number;
    attendance: number;
    lastUpdate: string;
  };
  index: number;
}

const StudentPerformanceCard: React.FC<StudentPerformanceProps> = ({ student, index }) => {
  return (
    <Animated.View
      entering={FadeInRight.delay(index * 50).springify()}
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-3"
    >
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center flex-1">
          <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
            <Text className="text-blue-600 font-semibold text-sm">
              {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-gray-900 font-semibold text-base">{student.name}</Text>
            <Text className="text-gray-500 text-sm">{student.level}</Text>
          </View>
        </View>
        <Text className="text-gray-400 text-xs">{student.lastUpdate}</Text>
      </View>

      <View className="flex-row justify-between">
        <View className="flex-1 mr-2">
          <Text className="text-gray-500 text-xs mb-1">Progress</Text>
          <View className="bg-gray-200 rounded-full h-2">
            <View 
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${student.progress}%` }}
            />
          </View>
          <Text className="text-gray-600 text-xs mt-1">{student.progress}%</Text>
        </View>
        <View className="flex-1 ml-2">
          <Text className="text-gray-500 text-xs mb-1">Attendance</Text>
          <View className="bg-gray-200 rounded-full h-2">
            <View 
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${student.attendance}%` }}
            />
          </View>
          <Text className="text-gray-600 text-xs mt-1">{student.attendance}%</Text>
        </View>
      </View>
    </Animated.View>
  );
};

/**
 * Performance Screen - Analytics & Reports
 * 
 * Features:
 * - Key performance metrics
 * - Student progress overview
 * - Class performance insights
 * - Attendance analytics
 * - Progress trends and comparisons
 */
export const PerformanceScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month');

  const metrics = [
    {
      title: 'Average Progress',
      value: '78%',
      change: '+5% this month',
      trend: 'up' as const,
      icon: 'trending-up' as const,
      color: '#3B82F6',
    },
    {
      title: 'Attendance Rate',
      value: '92%',
      change: '+2% this month',
      trend: 'up' as const,
      icon: 'people' as const,
      color: '#10B981',
    },
    {
      title: 'Class Completion',
      value: '85%',
      change: '-1% this month',
      trend: 'down' as const,
      icon: 'checkmark-circle' as const,
      color: '#8B5CF6',
    },
    {
      title: 'Student Satisfaction',
      value: '4.6',
      change: 'No change',
      trend: 'neutral' as const,
      icon: 'star' as const,
      color: '#F59E0B',
    },
  ];

  const topStudents = [
    {
      id: '1',
      name: 'Emma Johnson',
      level: 'Swimming Level 2',
      progress: 95,
      attendance: 98,
      lastUpdate: '2 days ago',
    },
    {
      id: '2',
      name: 'Liam Smith',
      level: 'Swimming Level 3',
      progress: 88,
      attendance: 94,
      lastUpdate: '1 day ago',
    },
    {
      id: '3',
      name: 'Olivia Davis',
      level: 'Swimming Level 1',
      progress: 82,
      attendance: 96,
      lastUpdate: '3 days ago',
    },
    {
      id: '4',
      name: 'Noah Wilson',
      level: 'Swimming Level 2',
      progress: 79,
      attendance: 89,
      lastUpdate: '1 day ago',
    },
  ];

  const periods = [
    { key: 'week' as const, label: 'This Week' },
    { key: 'month' as const, label: 'This Month' },
    { key: 'quarter' as const, label: 'This Quarter' },
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
        {/* Header */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          className="px-6 mb-6"
        >
          <Text className="text-gray-900 text-2xl font-bold">Performance</Text>
          <Text className="text-gray-500 text-base mt-1">
            Analytics and student progress insights
          </Text>
        </Animated.View>

        {/* Period Selector */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          className="px-6 mb-6"
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 24 }}
          >
            {periods.map(period => (
              <Pressable
                key={period.key}
                onPress={() => setSelectedPeriod(period.key)}
                className={`mr-3 px-4 py-2 rounded-full ${
                  selectedPeriod === period.key
                    ? 'bg-blue-500'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <Text
                  className={`font-medium ${
                    selectedPeriod === period.key
                      ? 'text-white'
                      : 'text-gray-600'
                  }`}
                >
                  {period.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Metrics Grid */}
        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          className="px-6 mb-6"
        >
          <View className="flex-row flex-wrap justify-between">
            {metrics.map((metric, index) => (
              <MetricCard
                key={metric.title}
                {...metric}
                index={index}
              />
            ))}
          </View>
        </Animated.View>

        {/* Chart Placeholder */}
        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          className="px-6 mb-6"
        >
          <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-gray-900 font-semibold text-lg">Progress Trends</Text>
              <Pressable className="flex-row items-center">
                <Ionicons name="bar-chart-outline" size={16} color="#3B82F6" />
                <Text className="text-blue-600 font-medium text-sm ml-2">View Details</Text>
              </Pressable>
            </View>
            
            {/* Simple chart placeholder */}
            <View className="h-32 bg-gray-50 rounded-lg items-center justify-center">
              <Ionicons name="bar-chart-outline" size={48} color="#D1D5DB" />
              <Text className="text-gray-400 text-sm mt-2">Chart will appear here</Text>
            </View>
          </View>
        </Animated.View>

        {/* Top Performing Students */}
        <Animated.View
          entering={FadeInDown.delay(500).springify()}
          className="px-6 mb-6"
        >
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-gray-900 text-lg font-semibold">
              Top Performing Students
            </Text>
            <Pressable>
              <Text className="text-blue-600 font-medium text-sm">View All</Text>
            </Pressable>
          </View>
          
          {topStudents.map((student, index) => (
            <StudentPerformanceCard
              key={student.id}
              student={student}
              index={index}
            />
          ))}
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View
          entering={FadeInDown.delay(600).springify()}
          className="px-6 mb-8"
        >
          <Text className="text-gray-900 text-lg font-semibold mb-4">
            Quick Actions
          </Text>
          <View className="flex-row justify-between">
            <Pressable className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex-1 mr-2">
              <View className="items-center">
                <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mb-2">
                  <Ionicons name="document-text" size={24} color="#3B82F6" />
                </View>
                <Text className="text-gray-900 font-medium text-sm">Generate Report</Text>
              </View>
            </Pressable>
            <Pressable className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex-1 mx-1">
              <View className="items-center">
                <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mb-2">
                  <Ionicons name="share" size={24} color="#10B981" />
                </View>
                <Text className="text-gray-900 font-medium text-sm">Share Insights</Text>
              </View>
            </Pressable>
            <Pressable className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex-1 ml-2">
              <View className="items-center">
                <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mb-2">
                  <Ionicons name="settings" size={24} color="#8B5CF6" />
                </View>
                <Text className="text-gray-900 font-medium text-sm">Analytics Settings</Text>
              </View>
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};