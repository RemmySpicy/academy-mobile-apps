import React, { useState, useMemo } from 'react';
import { View,
  Text,
  ScrollView,
  Pressable,
  FlatList,
  TextInput,
  useWindowDimensions,
  Dimensions,
  StyleSheet } from 'react-native';
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
import { useTheme, Header } from '@academy/mobile-shared';

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

const createCardStyles = (theme: any) => StyleSheet.create({
    cardContainer: {
      marginBottom: theme.spacing.md,
    },
    card: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      ...theme.elevation.sm,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      marginHorizontal: theme.spacing.md,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.md,
    },
    cardContent: {
      flex: 1,
      marginRight: theme.spacing.md,
    },
    cardTitle: {
      color: theme.colors.text.primary,
      fontWeight: theme.fontConfig.fontWeight.bold,
      fontSize: theme.fontSizes.lg,
      marginBottom: theme.spacing.xs,
    },
    cardSubtitle: {
      color: theme.colors.text.secondary,
      fontSize: theme.fontSizes.sm,
      marginBottom: theme.spacing.xs,
    },
    cardDescription: {
      color: theme.colors.text.tertiary,
      fontSize: theme.fontSizes.sm,
      lineHeight: theme.fontSizes.sm * 1.4,
    },
    iconContainer: {
      width: 64,
      height: 64,
      borderRadius: theme.borderRadius['2xl'],
      alignItems: 'center',
      justifyContent: 'center',
    },
    detailsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    detailItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: theme.spacing.md,
      marginBottom: theme.spacing.xs,
    },
    detailText: {
      color: theme.colors.text.secondary,
      fontSize: theme.fontSizes.sm,
      marginLeft: theme.spacing.xs,
    },
    levelBadge: {
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: theme.spacing.xs / 2,
      borderRadius: theme.borderRadius.full,
      marginBottom: theme.spacing.xs,
    },
    levelText: {
      fontSize: theme.fontSizes.xs,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
    featuresRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: theme.spacing.md,
    },
    featureBadge: {
      backgroundColor: theme.colors.background.secondary,
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: theme.spacing.xs / 2,
      borderRadius: theme.borderRadius.lg,
      marginRight: theme.spacing.xs,
      marginBottom: theme.spacing.xs,
    },
    featureText: {
      color: theme.colors.text.secondary,
      fontSize: theme.fontSizes.xs,
    },
    bottomRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    ratingSection: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: theme.spacing.md,
    },
    ratingText: {
      color: theme.colors.text.secondary,
      fontSize: theme.fontSizes.sm,
      marginLeft: theme.spacing.xs,
    },
    priceText: {
      color: theme.colors.text.primary,
      fontWeight: theme.fontConfig.fontWeight.bold,
      fontSize: theme.fontSizes.lg,
    },
    priceUnit: {
      color: theme.colors.text.tertiary,
      fontSize: theme.fontSizes.sm,
    },
    rightSection: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    learnMoreText: {
      color: theme.colors.interactive.primary,
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
      marginRight: theme.spacing.xs,
    },
});

const CourseCard: React.FC<CourseCardProps> = ({ course, index, onPress }) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createCardStyles(theme), [theme]);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getLevelColor = (level: Course['level']) => {
    switch (level) {
      case 'Beginner':
        return theme.colors.status.success;
      case 'Intermediate':
        return theme.colors.status.warning;
      case 'Advanced':
        return theme.colors.status.error;
      default:
        return theme.colors.text.tertiary;
    }
  };

  return (
    <Animated.View
      layout={Layout.springify()}
      entering={FadeInRight.delay(index * 50).springify()}
      style={[animatedStyle, styles.cardContainer]}
    >
      <Pressable
        onPress={() => onPress(course)}
        onPressIn={() => {
          scale.value = withSpring(0.98);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        style={styles.card}
      >
        {/* Course Header */}
        <View style={styles.cardHeader}>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              {course.title}
            </Text>
            <Text style={styles.cardSubtitle}>
              {course.subtitle}
            </Text>
            <Text style={styles.cardDescription}>
              {course.description}
            </Text>
          </View>
          
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: `${course.color}15` }
            ]}
          >
            <Ionicons name="water" size={28} color={course.color} />
          </View>
        </View>

        {/* Course Details */}
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Ionicons name="people-outline" size={16} color={theme.colors.text.tertiary} />
            <Text style={styles.detailText}>{course.ageRange}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color={theme.colors.text.tertiary} />
            <Text style={styles.detailText}>{course.duration}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <View
              style={[
                styles.levelBadge,
                { backgroundColor: `${getLevelColor(course.level)}15` }
              ]}
            >
              <Text
                style={[
                  styles.levelText,
                  { color: getLevelColor(course.level) }
                ]}
              >
                {course.level}
              </Text>
            </View>
          </View>
        </View>

        {/* Features */}
        <View style={styles.featuresRow}>
          {course.features.slice(0, 3).map((feature, idx) => (
            <View
              key={idx}
              style={styles.featureBadge}
            >
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
          {course.features.length > 3 && (
            <View style={styles.featureBadge}>
              <Text style={styles.featureText}>
                +{course.features.length - 3} more
              </Text>
            </View>
          )}
        </View>

        {/* Bottom Row */}
        <View style={styles.bottomRow}>
          <View style={styles.leftSection}>
            <View style={styles.ratingSection}>
              <Ionicons name="star" size={16} color={theme.colors.status.warning} />
              <Text style={styles.ratingText}>
                {course.rating} ({course.reviews})
              </Text>
            </View>
            <Text style={styles.priceText}>
              ${course.price}
            </Text>
            <Text style={styles.priceUnit}>/session</Text>
          </View>
          
          <View style={styles.rightSection}>
            <Text style={styles.learnMoreText}>
              Learn More
            </Text>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.interactive.primary} />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const createScreenStyles = (theme: any) => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    },
    header: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.xs,
    },
    headerTitle: {
      color: theme.colors.text.primary,
      fontSize: theme.fontSizes['2xl'],
      fontWeight: theme.fontConfig.fontWeight.bold,
    },
    headerSubtitle: {
      color: theme.colors.text.tertiary,
      fontSize: theme.fontSizes.base,
      marginTop: theme.spacing.xs,
    },
    searchContainer: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
    searchBox: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    searchInput: {
      flex: 1,
      marginLeft: theme.spacing.sm,
      color: theme.colors.text.primary,
      fontSize: theme.fontSizes.base,
    },
    filtersContainer: {
      marginBottom: theme.spacing.md,
    },
    categoryButton: {
      marginRight: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.full,
    },
    activeCategoryButton: {
      backgroundColor: theme.colors.interactive.primary,
    },
    inactiveCategoryButton: {
      backgroundColor: theme.colors.background.primary,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    activeCategoryText: {
      color: 'white',
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
    inactiveCategoryText: {
      color: theme.colors.text.secondary,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing['3xl'],
    },
    emptyTitle: {
      color: theme.colors.text.tertiary,
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontConfig.fontWeight.medium,
      marginTop: theme.spacing.md,
    },
    emptySubtitle: {
      color: theme.colors.text.quaternary,
      fontSize: theme.fontSizes.base,
      marginTop: theme.spacing.xs,
      textAlign: 'center',
      paddingHorizontal: theme.spacing.xl,
    },
});

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
  const { theme } = useTheme();
  const styles = useMemo(() => createScreenStyles(theme), [theme]);
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'beginner' | 'intermediate' | 'advanced' | 'kids' | 'adults'>('all');
  const [notificationCount, setNotificationCount] = useState(2);

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
      color: theme.colors.interactive.accent,
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
      color: theme.colors.status.success,
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
      color: theme.colors.interactive.purple,
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
      color: theme.colors.status.warning,
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

  const handleSearch = () => {
    console.log('Search pressed');
  };

  const handleFilter = () => {
    console.log('Filter pressed');
  };

  const handleNotifications = () => {
    console.log('Notifications pressed');
    setNotificationCount(0);
  };

  return (
    <View style={styles.container}>
      {/* Header with Program Switcher */}
      <Header
        title="Courses"
        showProgramSwitcher={true}
        showNotifications={true}
        onNotificationPress={handleNotifications}
        notificationCount={notificationCount}
        showProfile={false}
        style={{ paddingTop: insets.top }}
      />

      {/* Search Bar */}
      <Animated.View
        entering={FadeInDown.delay(200).springify()}
        style={styles.searchContainer}
      >
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color={theme.colors.text.tertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search courses..."
            placeholderTextColor={theme.colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={theme.colors.text.tertiary} />
            </Pressable>
          )}
        </View>
      </Animated.View>

      {/* Category Filters */}
      <Animated.View
        entering={FadeInDown.delay(300).springify()}
        style={styles.filtersContainer}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: theme.spacing.lg }}
        >
          {categories.map(category => (
            <Pressable
              key={category.key}
              onPress={() => setSelectedCategory(category.key)}
              style={[
                styles.categoryButton,
                selectedCategory === category.key
                  ? styles.activeCategoryButton
                  : styles.inactiveCategoryButton
              ]}
            >
              <Text
                style={[
                  selectedCategory === category.key
                    ? styles.activeCategoryText
                    : styles.inactiveCategoryText
                ]}
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
          paddingBottom: theme.spacing['3xl'], // Space for tab bar
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <Animated.View
            entering={FadeInDown.delay(400).springify()}
            style={styles.emptyContainer}
          >
            <Ionicons name="search-outline" size={64} color={theme.colors.text.quaternary} />
            <Text style={styles.emptyTitle}>
              No courses found
            </Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search or filter criteria
            </Text>
          </Animated.View>
        )}
      />
    </View>
  );
};