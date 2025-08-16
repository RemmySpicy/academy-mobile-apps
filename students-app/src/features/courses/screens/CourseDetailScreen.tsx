import React, { useState } from 'react';
import { View,
  Text,
  ScrollView,
  Pressable,
  useWindowDimensions,
  Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { CustomButton } from '@shared/components/forms';

const { width } = Dimensions.get('window');

interface CourseDetail {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  ageRange: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
  color: string;
  features: string[];
  curriculum: string[];
  sessions: number;
  maxStudents: number;
  rating: number;
  reviews: number;
  instructor: {
    name: string;
    experience: string;
    certifications: string[];
  };
  schedule: {
    day: string;
    time: string;
    location: string;
  }[];
}

/**
 * Course Detail Screen
 * 
 * Features:
 * - Detailed course information
 * - Instructor profiles
 * - Schedule and pricing
 * - Course curriculum
 * - Reviews and ratings
 * - Direct booking integration
 */
export const CourseDetailScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const { courseId } = route.params as { courseId: string };
  const [selectedTab, setSelectedTab] = useState<'overview' | 'curriculum' | 'schedule' | 'reviews'>('overview');

  // Mock course data - replace with API call
  const courseDetail: CourseDetail = {
    id: courseId,
    title: 'Learn to Swim',
    subtitle: 'Beginner Swimming Program',
    description: 'Perfect for beginners of all ages. Learn fundamental swimming skills, water safety, and build confidence in the water.',
    longDescription: 'Our Learn to Swim program is designed for individuals who are new to swimming or want to improve their basic skills. This comprehensive course covers water safety, basic floating techniques, breathing exercises, and fundamental strokes. Our certified instructors use proven teaching methods to ensure students feel comfortable and confident in the water.',
    ageRange: '3-30 years',
    duration: '45 min',
    level: 'Beginner',
    price: 35,
    color: '#3B82F6',
    features: ['Water Safety', 'Basic Strokes', 'Floating Techniques', 'Breathing Exercises', 'Confidence Building'],
    curriculum: [
      'Water familiarization and safety',
      'Basic floating (front and back)',
      'Breathing techniques',
      'Kicking fundamentals',
      'Arm movements and coordination',
      'Basic freestyle stroke',
      'Backstroke introduction',
      'Pool safety and rescue techniques'
    ],
    sessions: 8,
    maxStudents: 6,
    rating: 4.8,
    reviews: 124,
    instructor: {
      name: 'Sarah Johnson',
      experience: '8+ years teaching experience',
      certifications: ['WSI Certified', 'CPR/AED', 'Lifeguard Certified']
    },
    schedule: [
      { day: 'Monday', time: '3:00 PM - 3:45 PM', location: 'Pool A' },
      { day: 'Wednesday', time: '3:00 PM - 3:45 PM', location: 'Pool A' },
      { day: 'Friday', time: '10:00 AM - 10:45 AM', location: 'Pool B' },
      { day: 'Saturday', time: '9:00 AM - 9:45 AM', location: 'Pool A' },
    ]
  };

  const tabs = [
    { key: 'overview' as const, label: 'Overview' },
    { key: 'curriculum' as const, label: 'Curriculum' },
    { key: 'schedule' as const, label: 'Schedule' },
    { key: 'reviews' as const, label: 'Reviews' },
  ];

  const handleBookNow = () => {
    console.log('Navigate to booking for course:', courseId);
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'overview':
        return (
          <View className="space-y-6">
            <View>
              <Text className="text-gray-900 text-lg font-semibold mb-3">About This Course</Text>
              <Text className="text-gray-600 text-base leading-6">{courseDetail.longDescription}</Text>
            </View>
            
            <View>
              <Text className="text-gray-900 text-lg font-semibold mb-3">What You'll Learn</Text>
              {courseDetail.features.map((feature, index) => (
                <View key={index} className="flex-row items-center mb-2">
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  <Text className="text-gray-600 text-base ml-3">{feature}</Text>
                </View>
              ))}
            </View>
            
            <View>
              <Text className="text-gray-900 text-lg font-semibold mb-3">Instructor</Text>
              <View className="bg-gray-50 rounded-xl p-4">
                <View className="flex-row items-center mb-3">
                  <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-3">
                    <Text className="text-blue-600 font-semibold">
                      {courseDetail.instructor.name.split(' ').map(n => n[0]).join('')}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-900 font-semibold text-base">{courseDetail.instructor.name}</Text>
                    <Text className="text-gray-600 text-sm">{courseDetail.instructor.experience}</Text>
                  </View>
                </View>
                <View className="flex-row flex-wrap">
                  {courseDetail.instructor.certifications.map((cert, index) => (
                    <View key={index} className="bg-white px-3 py-1 rounded-full mr-2 mb-2">
                      <Text className="text-gray-700 text-xs">{cert}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        );
      
      case 'curriculum':
        return (
          <View className="space-y-4">
            <Text className="text-gray-900 text-lg font-semibold">Course Curriculum</Text>
            {courseDetail.curriculum.map((item, index) => (
              <View key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <View className="flex-row items-start">
                  <View className="w-6 h-6 bg-blue-500 rounded-full items-center justify-center mr-3 mt-1">
                    <Text className="text-white text-xs font-bold">{index + 1}</Text>
                  </View>
                  <Text className="text-gray-700 text-base flex-1">{item}</Text>
                </View>
              </View>
            ))}
          </View>
        );
      
      case 'schedule':
        return (
          <View className="space-y-4">
            <Text className="text-gray-900 text-lg font-semibold">Available Sessions</Text>
            {courseDetail.schedule.map((session, index) => (
              <View key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-gray-900 font-semibold text-base">{session.day}</Text>
                    <Text className="text-gray-600 text-sm mt-1">{session.time}</Text>
                    <Text className="text-gray-500 text-sm">{session.location}</Text>
                  </View>
                  <View className="bg-green-50 px-3 py-1 rounded-full">
                    <Text className="text-green-600 text-xs font-medium">Available</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        );
      
      case 'reviews':
        return (
          <View className="space-y-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-900 text-lg font-semibold">Reviews</Text>
              <View className="flex-row items-center">
                <Ionicons name="star" size={16} color="#F59E0B" />
                <Text className="text-gray-600 text-sm ml-1">
                  {courseDetail.rating} ({courseDetail.reviews} reviews)
                </Text>
              </View>
            </View>
            
            {/* Mock reviews */}
            {[1, 2, 3].map((review) => (
              <View key={review} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <View className="flex-row items-start justify-between mb-2">
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3">
                      <Text className="text-blue-600 text-xs font-semibold">JD</Text>
                    </View>
                    <View>
                      <Text className="text-gray-900 font-medium">John Doe</Text>
                      <View className="flex-row items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Ionicons key={star} name="star" size={12} color="#F59E0B" />
                        ))}
                      </View>
                    </View>
                  </View>
                  <Text className="text-gray-400 text-xs">2 weeks ago</Text>
                </View>
                <Text className="text-gray-600 text-sm">
                  Great course! The instructor was patient and really helped me overcome my fear of water.
                </Text>
              </View>
            ))}
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <Animated.View
        entering={FadeInUp.delay(100)}
        className="px-6 py-4"
        style={{ paddingTop: insets.top + 16 }}
      >
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm"
          >
            <Ionicons name="arrow-back" size={20} color="#374151" />
          </Pressable>
          
          <Pressable className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm">
            <Ionicons name="heart-outline" size={20} color="#374151" />
          </Pressable>
        </View>
      </Animated.View>

      {/* Course Header */}
      <Animated.View
        entering={FadeInDown.delay(200)}
        className="px-6 mb-6"
      >
        <View className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <View className="flex-row items-start justify-between mb-4">
            <View className="flex-1 mr-4">
              <Text className="text-gray-900 font-bold text-2xl mb-2">
                {courseDetail.title}
              </Text>
              <Text className="text-gray-600 text-base mb-3">
                {courseDetail.subtitle}
              </Text>
              
              <View className="flex-row items-center flex-wrap">
                <View className="flex-row items-center mr-4 mb-2">
                  <Ionicons name="people-outline" size={16} color="#6B7280" />
                  <Text className="text-gray-600 text-sm ml-2">{courseDetail.ageRange}</Text>
                </View>
                <View className="flex-row items-center mr-4 mb-2">
                  <Ionicons name="time-outline" size={16} color="#6B7280" />
                  <Text className="text-gray-600 text-sm ml-2">{courseDetail.duration}</Text>
                </View>
                <View className="flex-row items-center mb-2">
                  <Ionicons name="star" size={16} color="#F59E0B" />
                  <Text className="text-gray-600 text-sm ml-1">
                    {courseDetail.rating} ({courseDetail.reviews})
                  </Text>
                </View>
              </View>
            </View>
            
            <View
              className="w-16 h-16 rounded-2xl items-center justify-center"
              style={{ backgroundColor: `${courseDetail.color}15` }}
            >
              <Ionicons name="water" size={32} color={courseDetail.color} />
            </View>
          </View>
          
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-gray-900 font-bold text-2xl">
                ${courseDetail.price}
              </Text>
              <Text className="text-gray-500 text-sm">per session</Text>
            </View>
            <View className="bg-blue-50 px-4 py-2 rounded-full">
              <Text className="text-blue-600 font-medium">{courseDetail.level}</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Tabs */}
      <Animated.View
        entering={FadeInDown.delay(300)}
        className="px-6 mb-4"
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 24 }}
        >
          {tabs.map(tab => (
            <Pressable
              key={tab.key}
              onPress={() => setSelectedTab(tab.key)}
              className={`mr-4 pb-2 ${
                selectedTab === tab.key
                  ? 'border-b-2 border-blue-500'
                  : ''
              }`}
            >
              <Text
                className={`font-medium ${
                  selectedTab === tab.key
                    ? 'text-blue-600'
                    : 'text-gray-600'
                }`}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Tab Content */}
      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Animated.View
          entering={FadeInDown.delay(400)}
          key={selectedTab} // Force re-render on tab change
        >
          {renderTabContent()}
        </Animated.View>
      </ScrollView>

      {/* Bottom Action */}
      <Animated.View
        entering={FadeInUp.delay(500)}
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <CustomButton
          title="Book Now"
          onPress={handleBookNow}
          variant="primary"
          size="md"
        />
      </Animated.View>
    </View>
  );
};