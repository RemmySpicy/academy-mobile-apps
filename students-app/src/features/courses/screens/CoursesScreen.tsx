import React, { useState } from 'react';
import { View,
  Text,
  ScrollView,
  Pressable,
  FlatList,
  TextInput,
  useWindowDimensions,
  Dimensions } from 'react-native';
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

const { width } = Dimensions.get('window');

interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  ageRange: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
  image: string;
  color: string;
  features: string[];
  sessions: number;
  maxStudents: number;
  rating: number;
  reviews: number;
}

interface CourseCardProps {
  course: Course;
  index: number;
  onPress: (course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, index, onPress }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getLevelColor = (level: Course['level']) => {
    switch (level) {
      case 'Beginner':
        return '#10B981';
      case 'Intermediate':
        return '#F59E0B';
      case 'Advanced':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  return (
    <Animated.View
      layout={Layout.springify()}
      entering={FadeInRight.delay(index * 50).springify()}
      style={animatedStyle}
      className="mb-4"
    >
      <Pressable
        onPress={() => onPress(course)}
        onPressIn={() => {
          scale.value = withSpring(0.98);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mx-4"
      >
        {/* Course Header */}
        <View className="flex-row items-start justify-between mb-4">
          <View className="flex-1 mr-4">
            <Text className="text-gray-900 font-bold text-lg mb-1">
              {course.title}
            </Text>
            <Text className="text-gray-600 text-sm mb-2">
              {course.subtitle}
            </Text>
            <Text className="text-gray-500 text-sm leading-5">
              {course.description}
            </Text>
          </View>
          
          <View
            className="w-16 h-16 rounded-2xl items-center justify-center"
            style={{ backgroundColor: `${course.color}15` }}
          >
            <Ionicons name="water" size={28} color={course.color} />
          </View>
        </View>

        {/* Course Details */}
        <View className="flex-row flex-wrap items-center mb-4">
          <View className="flex-row items-center mr-4 mb-2">
            <Ionicons name="people-outline" size={16} color="#6B7280" />
            <Text className="text-gray-600 text-sm ml-2">{course.ageRange}</Text>
          </View>
          
          <View className="flex-row items-center mr-4 mb-2">
            <Ionicons name="time-outline" size={16} color="#6B7280" />
            <Text className="text-gray-600 text-sm ml-2">{course.duration}</Text>
          </View>
          
          <View className="flex-row items-center mb-2">
            <View
              className="px-2 py-1 rounded-full"
              style={{ backgroundColor: `${getLevelColor(course.level)}15` }}
            >
              <Text
                className="text-xs font-medium"
                style={{ color: getLevelColor(course.level) }}
              >
                {course.level}
              </Text>
            </View>
          </View>
        </View>

        {/* Features */}
        <View className="flex-row flex-wrap mb-4">
          {course.features.slice(0, 3).map((feature, idx) => (
            <View
              key={idx}
              className="bg-gray-100 px-2 py-1 rounded-lg mr-2 mb-2"
            >
              <Text className="text-gray-700 text-xs">{feature}</Text>
            </View>
          ))}
          {course.features.length > 3 && (
            <View className="bg-gray-100 px-2 py-1 rounded-lg mb-2">
              <Text className="text-gray-700 text-xs">
                +{course.features.length - 3} more
              </Text>
            </View>
          )}
        </View>

        {/* Bottom Row */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="flex-row items-center mr-4">
              <Ionicons name="star" size={16} color="#F59E0B" />
              <Text className="text-gray-600 text-sm ml-1">
                {course.rating} ({course.reviews})
              </Text>
            </View>
            <Text className="text-gray-900 font-bold text-lg">
              ${course.price}
            </Text>
            <Text className="text-gray-500 text-sm">/session</Text>
          </View>
          
          <View className="flex-row items-center">
            <Text className="text-blue-600 text-sm font-medium mr-2">
              Learn More
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#3B82F6" />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

/**
 * Courses Screen - Course Catalog
 * 
 * Features:
 * - Comprehensive course listing
 * - Advanced search and filtering
 * - Course categories
 * - Detailed course information
 * - Booking integration
 * - Rating and reviews
 */
export const CoursesScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'beginner' | 'intermediate' | 'advanced' | 'kids' | 'adults'>('all');

  // Mock courses data
  const [courses] = useState<Course[]>([
    {
      id: '1',
      title: 'Learn to Swim',
      subtitle: 'Beginner Swimming Program',
      description: 'Perfect for beginners of all ages. Learn fundamental swimming skills, water safety, and build confidence in the water.',
      ageRange: '3-30 years',
      duration: '45 min',
      level: 'Beginner',
      price: 35,
      image: 'learn-to-swim',
      color: '#3B82F6',
      features: ['Water Safety', 'Basic Strokes', 'Floating', 'Breathing'],
      sessions: 8,
      maxStudents: 6,
      rating: 4.8,
      reviews: 124,
    },
    {
      id: '2',
      title: 'Swimming Club',
      subtitle: 'Competitive Training',
      description: 'Advanced training for competitive swimmers. Focus on technique refinement, endurance, and performance improvement.',
      ageRange: '5-30 years',
      duration: '60 min',
      level: 'Advanced',
      price: 45,
      image: 'swimming-club',
      color: '#10B981',
      features: ['Technique', 'Endurance', 'Competition Prep', 'Stroke Analysis'],
      sessions: 12,
      maxStudents: 8,
      rating: 4.9,
      reviews: 89,
    },
    {
      id: '3',
      title: 'Adult Swimming',
      subtitle: 'Swimming for Adults 30+',
      description: 'Specialized program for adults looking to learn or improve their swimming skills in a comfortable environment.',
      ageRange: '30+ years',
      duration: '50 min',
      level: 'Beginner',
      price: 40,
      image: 'adult-swimming',
      color: '#8B5CF6',
      features: ['Adult-Friendly', 'Flexible Pace', 'Health Focus', 'Stress Relief'],
      sessions: 10,
      maxStudents: 4,
      rating: 4.7,
      reviews: 67,
    },
    {
      id: '4',
      title: 'Aqua Babies',
      subtitle: 'Swimming for Toddlers',
      description: 'Gentle introduction to water for infants and toddlers. Build water confidence and safety skills with parent participation.',
      ageRange: '12-36 months',
      duration: '30 min',
      level: 'Beginner',
      price: 30,
      image: 'aqua-babies',
      color: '#F59E0B',
      features: ['Parent-Child', 'Water Safety', 'Gentle Approach', 'Fun Activities'],
      sessions: 6,
      maxStudents: 4,
      rating: 4.9,
      reviews: 156,
    },
  ]);

  const categories = [
    { key: 'all' as const, label: 'All Courses', count: courses.length },
    { key: 'beginner' as const, label: 'Beginner', count: courses.filter(c => c.level === 'Beginner').length },
    { key: 'intermediate' as const, label: 'Intermediate', count: courses.filter(c => c.level === 'Intermediate').length },
    { key: 'advanced' as const, label: 'Advanced', count: courses.filter(c => c.level === 'Advanced').length },
    { key: 'kids' as const, label: 'Kids', count: courses.filter(c => c.ageRange.includes('3') || c.ageRange.includes('months')).length },
    { key: 'adults' as const, label: 'Adults', count: courses.filter(c => c.ageRange.includes('30+')).length },
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesCategory = true;
    switch (selectedCategory) {
      case 'beginner':
        matchesCategory = course.level === 'Beginner';
        break;
      case 'intermediate':
        matchesCategory = course.level === 'Intermediate';
        break;
      case 'advanced':
        matchesCategory = course.level === 'Advanced';
        break;
      case 'kids':
        matchesCategory = course.ageRange.includes('3') || course.ageRange.includes('months');
        break;
      case 'adults':
        matchesCategory = course.ageRange.includes('30+');
        break;
      default:
        matchesCategory = true;
    }
    
    return matchesSearch && matchesCategory;
  });

  const handleCoursePress = (course: Course) => {
    console.log('Navigate to course detail:', course.id);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <Animated.View
        entering={FadeInDown.delay(100).springify()}
        className="px-6 pt-4 pb-2"
        style={{ paddingTop: insets.top + 16 }}
      >
        <Text className="text-gray-900 text-2xl font-bold">Courses</Text>
        <Text className="text-gray-500 text-base mt-1">
          Find the perfect swimming program for you
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
            placeholder="Search courses..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </Pressable>
          )}
        </View>
      </Animated.View>

      {/* Category Filters */}
      <Animated.View
        entering={FadeInDown.delay(300).springify()}
        className="mb-4"
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24 }}
        >
          {categories.map(category => (
            <Pressable
              key={category.key}
              onPress={() => setSelectedCategory(category.key)}
              className={`mr-3 px-4 py-2 rounded-full ${
                selectedCategory === category.key
                  ? 'bg-blue-500'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <Text
                className={`font-medium ${
                  selectedCategory === category.key
                    ? 'text-white'
                    : 'text-gray-600'
                }`}
              >
                {category.label} ({category.count})
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Courses List */}
      <FlatList
        data={filteredCourses}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <CourseCard
            course={item}
            index={index}
            onPress={handleCoursePress}
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
            <Ionicons name="search-outline" size={64} color="#D1D5DB" />
            <Text className="text-gray-500 text-lg font-medium mt-4">
              No courses found
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