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

interface SkillProgress {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  description: string;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
  lastUpdated: string;
}

interface CourseProgress {
  id: string;
  title: string;
  level: string;
  overallProgress: number;
  completedSessions: number;
  totalSessions: number;
  skills: SkillProgress[];
  color: string;
  nextMilestone: string;
}

interface ProgressCardProps {
  course: CourseProgress;
  index: number;
  onPress: (course: CourseProgress) => void;
}

interface SkillCardProps {
  skill: SkillProgress;
  index: number;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, index }) => {
  const progress = (skill.level / skill.maxLevel) * 100;
  
  return (
    <Animated.View
      entering={FadeInRight.delay(index * 100).springify()}
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mr-4"
      style={{ width: width * 0.7 }}
    >
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-1">
          <Text className="text-gray-900 font-semibold text-base">{skill.name}</Text>
          <Text className="text-gray-500 text-sm mt-1">{skill.description}</Text>
        </View>
        <View
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: `${skill.color}15` }}
        >
          <Ionicons name={skill.icon} size={20} color={skill.color} />
        </View>
      </View>
      
      <View className="mb-3">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-gray-500 text-xs">Level Progress</Text>
          <Text className="text-gray-600 text-xs">
            Level {skill.level} of {skill.maxLevel}
          </Text>
        </View>
        <View className="bg-gray-200 rounded-full h-2">
          <View
            className="h-2 rounded-full"
            style={{
              width: `${progress}%`,
              backgroundColor: skill.color,
            }}
          />
        </View>
      </View>
      
      <Text className="text-gray-400 text-xs">
        Updated {skill.lastUpdated}
      </Text>
    </Animated.View>
  );
};

const ProgressCard: React.FC<ProgressCardProps> = ({ course, index, onPress }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).springify()}
      style={animatedStyle}
    >
      <Pressable
        onPress={() => onPress(course)}
        onPressIn={() => {
          scale.value = withSpring(0.98);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-4 mx-4"
      >
        <View className="flex-row items-start justify-between mb-4">
          <View className="flex-1">
            <Text className="text-gray-900 font-bold text-lg mb-1">
              {course.title}
            </Text>
            <Text className="text-gray-600 text-sm">{course.level}</Text>
          </View>
          <View
            className="w-12 h-12 rounded-full items-center justify-center"
            style={{ backgroundColor: `${course.color}15` }}
          >
            <Ionicons name="water" size={24} color={course.color} />
          </View>
        </View>

        {/* Overall Progress */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-gray-500 text-sm">Overall Progress</Text>
            <Text className="text-gray-900 font-semibold text-sm">
              {course.overallProgress}%
            </Text>
          </View>
          <View className="bg-gray-200 rounded-full h-3">
            <View
              className="h-3 rounded-full"
              style={{
                width: `${course.overallProgress}%`,
                backgroundColor: course.color,
              }}
            />
          </View>
        </View>

        {/* Session Progress */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <Ionicons name="calendar-outline" size={16} color="#6B7280" />
            <Text className="text-gray-600 text-sm ml-2">
              {course.completedSessions}/{course.totalSessions} sessions completed
            </Text>
          </View>
        </View>

        {/* Skills Preview */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-gray-700 text-sm font-medium">
            {course.skills.length} skills tracked
          </Text>
          <View className="flex-row">
            {course.skills.slice(0, 3).map((skill, idx) => (
              <View
                key={idx}
                className="w-6 h-6 rounded-full items-center justify-center -ml-1 border-2 border-white"
                style={{ backgroundColor: skill.color }}
              >
                <Ionicons name={skill.icon} size={12} color="white" />
              </View>
            ))}
            {course.skills.length > 3 && (
              <View className="w-6 h-6 rounded-full items-center justify-center -ml-1 border-2 border-white bg-gray-400">
                <Text className="text-white text-xs font-bold">
                  +{course.skills.length - 3}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Next Milestone */}
        <View className="bg-blue-50 rounded-lg p-3">
          <View className="flex-row items-center">
            <Ionicons name="flag-outline" size={16} color="#3B82F6" />
            <Text className="text-blue-700 text-sm font-medium ml-2">
              Next: {course.nextMilestone}
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

/**
 * Progress Screen - Student Progress Tracking (Simplified)
 * 
 * Features:
 * - Course progress overview
 * - Individual skill tracking
 * - Achievement highlights
 * - Progress trends
 * - Goal setting and milestones
 * - Instructor feedback
 */
export const ProgressScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('month');

  // Mock progress data
  const courseProgress: CourseProgress[] = [
    {
      id: '1',
      title: 'Learn to Swim',
      level: 'Beginner Level 2',
      overallProgress: 65,
      completedSessions: 5,
      totalSessions: 8,
      color: '#3B82F6',
      nextMilestone: 'Master freestyle breathing',
      skills: [
        {
          id: '1',
          name: 'Floating',
          level: 4,
          maxLevel: 5,
          description: 'Front and back floating',
          color: '#10B981',
          icon: 'leaf-outline',
          lastUpdated: '2 days ago',
        },
        {
          id: '2',
          name: 'Breathing',
          level: 3,
          maxLevel: 5,
          description: 'Rhythmic breathing technique',
          color: '#3B82F6',
          icon: 'refresh-outline',
          lastUpdated: '1 week ago',
        },
        {
          id: '3',
          name: 'Freestyle',
          level: 2,
          maxLevel: 5,
          description: 'Basic stroke coordination',
          color: '#F59E0B',
          icon: 'fitness-outline',
          lastUpdated: '3 days ago',
        },
        {
          id: '4',
          name: 'Water Safety',
          level: 5,
          maxLevel: 5,
          description: 'Pool safety and rescue basics',
          color: '#EF4444',
          icon: 'shield-outline',
          lastUpdated: '1 day ago',
        },
      ],
    },
    {
      id: '2',
      title: 'Swimming Club',
      level: 'Intermediate Training',
      overallProgress: 30,
      completedSessions: 2,
      totalSessions: 12,
      color: '#10B981',
      nextMilestone: 'Complete first time trial',
      skills: [
        {
          id: '5',
          name: 'Endurance',
          level: 2,
          maxLevel: 5,
          description: 'Swimming distance and stamina',
          color: '#10B981',
          icon: 'fitness-outline',
          lastUpdated: '3 days ago',
        },
        {
          id: '6',
          name: 'Technique',
          level: 3,
          maxLevel: 5,
          description: 'Stroke refinement',
          color: '#8B5CF6',
          icon: 'sparkles-outline',
          lastUpdated: '5 days ago',
        },
      ],
    },
  ];

  const periods = [
    { key: 'week' as const, label: 'This Week' },
    { key: 'month' as const, label: 'This Month' },
    { key: 'all' as const, label: 'All Time' },
  ];

  const handleCoursePress = (course: CourseProgress) => {
    console.log('Navigate to course progress detail:', course.id);
  };

  const totalSkills = courseProgress.reduce((acc, course) => acc + course.skills.length, 0);
  const masterSkills = courseProgress.reduce((acc, course) => 
    acc + course.skills.filter(skill => skill.level === skill.maxLevel).length, 0
  );
  const avgProgress = Math.round(
    courseProgress.reduce((acc, course) => acc + course.overallProgress, 0) / courseProgress.length
  );

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
          className="px-6 mb-8"
        >
          <Text className="text-gray-900 text-2xl font-bold">My Progress</Text>
          <Text className="text-gray-500 text-base mt-1">
            Track your swimming journey and achievements
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

        {/* Stats Overview */}
        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          className="px-6 mb-8"
        >
          <View className="flex-row justify-between">
            <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex-1 mr-2">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-gray-500 text-sm">Avg Progress</Text>
                <Ionicons name="trending-up" size={16} color="#10B981" />
              </View>
              <Text className="text-gray-900 text-2xl font-bold">{avgProgress}%</Text>
              <Text className="text-green-600 text-sm mt-1">+12% this month</Text>
            </View>

            <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex-1 ml-2">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-gray-500 text-sm">Skills Mastered</Text>
                <Ionicons name="trophy" size={16} color="#F59E0B" />
              </View>
              <Text className="text-gray-900 text-2xl font-bold">{masterSkills}</Text>
              <Text className="text-gray-600 text-sm mt-1">of {totalSkills} skills</Text>
            </View>
          </View>
        </Animated.View>

        {/* Featured Skills */}
        <View className="mb-8">
          <Animated.View
            entering={FadeInDown.delay(400).springify()}
            className="px-6 mb-4"
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-900 text-lg font-semibold">
                Recent Skill Updates
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
            {courseProgress[0]?.skills.map((skill, index) => (
              <SkillCard key={skill.id} skill={skill} index={index} />
            ))}
          </ScrollView>
        </View>

        {/* Course Progress */}
        <View className="mb-8">
          <Animated.Text
            entering={FadeInDown.delay(500).springify()}
            className="text-gray-900 text-lg font-semibold mb-4 px-6"
          >
            Course Progress
          </Animated.Text>
          
          {courseProgress.map((course, index) => (
            <ProgressCard
              key={course.id}
              course={course}
              index={index}
              onPress={handleCoursePress}
            />
          ))}
        </View>

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
                <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mb-2">
                  <Ionicons name="trophy" size={24} color="#8B5CF6" />
                </View>
                <Text className="text-gray-900 font-medium text-sm">View Achievements</Text>
              </View>
            </Pressable>
            
            <Pressable className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex-1 mx-1">
              <View className="items-center">
                <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mb-2">
                  <Ionicons name="flag" size={24} color="#3B82F6" />
                </View>
                <Text className="text-gray-900 font-medium text-sm">Set Goals</Text>
              </View>
            </Pressable>
            
            <Pressable className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex-1 ml-2">
              <View className="items-center">
                <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mb-2">
                  <Ionicons name="bar-chart" size={24} color="#10B981" />
                </View>
                <Text className="text-gray-900 font-medium text-sm">Progress Report</Text>
              </View>
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};