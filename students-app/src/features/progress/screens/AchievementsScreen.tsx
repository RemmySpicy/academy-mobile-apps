import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  Alert,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInRight,
  FadeInUp,
  SlideInRight,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  cancelAnimation,
} from 'react-native-reanimated';
import {
  useTheme,
  LoadingSpinner,
  createThemedStyles,
  achievementsService,
} from '@academy/mobile-shared';
import type {
  Achievement,
  AchievementCategory,
  StudentAchievementStats,
  AchievementStatus,
  AchievementType,
  AchievementRarity,
  AchievementFilters,
  AchievementSortBy,
} from '@academy/mobile-shared';

const { width } = Dimensions.get('window');

// Custom hook for optimized filtering logic
const useFilteredAchievements = (
  achievements: Achievement[], 
  searchQuery: string, 
  filters: AchievementFilters, 
  sortBy: AchievementSortBy
) => {
  return useMemo(() => {
    let filtered = achievements;

    // Search filter - most restrictive first for better performance
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(achievement => 
        achievement.title.toLowerCase().includes(searchLower) ||
        achievement.description.toLowerCase().includes(searchLower) ||
        achievement.category.toLowerCase().includes(searchLower)
      );
    }

    // Apply other filters progressively
    if (filters.categories.length > 0) {
      filtered = filtered.filter(achievement =>
        filters.categories.includes(achievement.category)
      );
    }

    if (filters.types.length > 0) {
      filtered = filtered.filter(achievement =>
        filters.types.includes(achievement.type)
      );
    }

    if (filters.statuses.length > 0) {
      filtered = filtered.filter(achievement =>
        filters.statuses.includes(achievement.status)
      );
    }

    if (filters.rarities.length > 0) {
      filtered = filtered.filter(achievement =>
        filters.rarities.includes(achievement.rarity)
      );
    }

    // Show/hide filters
    if (!filters.show_locked) {
      filtered = filtered.filter(achievement => achievement.status !== 'locked');
    }
    if (!filters.show_completed) {
      filtered = filtered.filter(achievement => achievement.status !== 'completed');
    }

    return achievementsService.sortAchievements(filtered, sortBy);
  }, [achievements, searchQuery, filters, sortBy]);
};

interface AchievementCardProps {
  achievement: Achievement;
  onPress: (achievement: Achievement) => void;
  index: number;
}

// Create themed styles for AchievementCard
const createAchievementCardStyles = (theme: any) => ({
  container: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    ...theme.elevation.sm,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  progressBar: {
    backgroundColor: theme.colors.background.secondary,
    height: 6,
    borderRadius: 3,
    marginBottom: theme.spacing.sm,
    overflow: 'hidden',
  },
  rarityBadge: {
    backgroundColor: theme.colors.background.secondary,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.xs,
    borderWidth: 1,
  },
});

// Create the styled hook
const useAchievementCardStyles = createThemedStyles(createAchievementCardStyles);

const AchievementCard = React.memo<AchievementCardProps>(({ achievement, onPress, index }) => {
  const styles = useAchievementCardStyles();
  const { theme } = useTheme();
  const scaleValue = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      cancelAnimation(scaleValue);
    };
  }, [scaleValue]);

  const handlePressIn = () => {
    scaleValue.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scaleValue.value = withSpring(1);
  };

  const getStatusIcon = (status: AchievementStatus) => {
    switch (status) {
      case 'completed': return 'checkmark-circle';
      case 'in_progress': return 'time';
      case 'locked': return 'lock-closed';
      case 'expired': return 'close-circle';
      default: return 'ellipse';
    }
  };

  const getStatusColor = (status: AchievementStatus) => {
    switch (status) {
      case 'completed': return theme.colors.status.success;
      case 'in_progress': return theme.colors.status.warning;
      case 'locked': return theme.colors.text.tertiary;
      case 'expired': return theme.colors.status.error;
      default: return theme.colors.interactive.primary;
    }
  };

  const getRarityBadgeColor = (rarity: AchievementRarity) => {
    switch (rarity) {
      case 'common': return theme.colors.text.secondary;
      case 'uncommon': return theme.colors.status.success;
      case 'rare': return theme.colors.interactive.primary;
      case 'epic': return theme.colors.interactive.purple;
      case 'legendary': return theme.colors.status.warning;
      default: return theme.colors.text.secondary;
    }
  };

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 100).springify()}
      style={animatedStyle}
    >
      <Pressable
        onPress={() => onPress(achievement)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel={`Achievement: ${achievement.title}`}
        accessibilityHint={`${achievement.status === 'completed' ? 'Completed' : achievement.status === 'locked' ? 'Locked' : 'In progress'} - ${achievement.progress_percentage}% complete. Tap for details.`}
        accessibilityState={{ selected: achievement.status === 'completed' }}
        style={{
          ...styles.container,
          borderColor: achievement.status === 'completed' ? theme.colors.status.success : theme.colors.border.primary,
          opacity: achievement.status === 'locked' ? 0.6 : 1,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          {/* Achievement Icon */}
          <View style={styles.iconContainer}>
            <Ionicons
              name={achievement.icon as any}
              size={28}
              color={achievement.icon_color || theme.colors.interactive.primary}
            />
          </View>

          {/* Achievement Content */}
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Text style={{
                color: theme.colors.text.primary,
                fontSize: theme.fontSizes.base,
                fontWeight: theme.fontConfig.fontWeight.semibold,
                flex: 1,
              }}>
                {achievement.title}
              </Text>
              
              {/* Status Icon */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: theme.spacing.sm,
              }}>
                <Ionicons
                  name={getStatusIcon(achievement.status)}
                  size={18}
                  color={getStatusColor(achievement.status)}
                />
                {achievement.status === 'completed' && achievement.points > 0 && (
                  <Text style={{
                    color: theme.colors.status.success,
                    fontSize: theme.fontSizes.sm,
                    fontWeight: theme.fontConfig.fontWeight.medium,
                    marginLeft: 4,
                  }}>
                    +{achievementsService.formatPoints(achievement.points)}
                  </Text>
                )}
              </View>
            </View>

            <Text style={{
              color: theme.colors.text.secondary,
              fontSize: theme.fontSizes.sm,
              marginBottom: theme.spacing.sm,
              lineHeight: 18,
            }}>
              {achievement.description}
            </Text>

            {/* Progress Bar */}
            {achievement.status !== 'locked' && (
              <View style={styles.progressBar}>
                <View style={{
                  backgroundColor: achievement.status === 'completed' 
                    ? theme.colors.status.success 
                    : theme.colors.interactive.primary,
                  height: '100%',
                  width: `${achievement.progress_percentage}%`,
                  borderRadius: 3,
                }} />
              </View>
            )}

            {/* Bottom Row */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {/* Rarity Badge */}
                <View style={{
                  ...styles.rarityBadge,
                  borderColor: getRarityBadgeColor(achievement.rarity),
                }}>
                  <Text style={{
                    color: getRarityBadgeColor(achievement.rarity),
                    fontSize: theme.fontSizes.xs,
                    fontWeight: theme.fontConfig.fontWeight.medium,
                    textTransform: 'capitalize',
                  }}>
                    {achievement.rarity}
                  </Text>
                </View>

                {/* Category */}
                <Text style={{
                  color: theme.colors.text.tertiary,
                  fontSize: theme.fontSizes.xs,
                }}>
                  {achievement.category}
                </Text>
              </View>

              {/* Progress Text */}
              {achievement.status !== 'locked' && (
                <Text style={{
                  color: theme.colors.text.secondary,
                  fontSize: theme.fontSizes.xs,
                  fontWeight: theme.fontConfig.fontWeight.medium,
                }}>
                  {achievement.criteria.current_value}/{achievement.criteria.target_value} {achievement.criteria.unit}
                </Text>
              )}
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}, (prevProps, nextProps) => 
  prevProps.achievement.id === nextProps.achievement.id &&
  prevProps.achievement.status === nextProps.achievement.status &&
  prevProps.achievement.progress_percentage === nextProps.achievement.progress_percentage
);

interface FilterChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  color?: string;
}

// Create themed styles for FilterChip
const createFilterChipStyles = (theme: any) => ({
  container: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
  },
  text: {
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontConfig.fontWeight.medium,
  },
});

// Create the styled hook
const useFilterChipStyles = createThemedStyles(createFilterChipStyles);

const FilterChip = React.memo<FilterChipProps>(({ label, isSelected, onPress, color }) => {
  const styles = useFilterChipStyles();
  const { theme } = useTheme();
  
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Filter: ${label}`}
      accessibilityHint={`${isSelected ? 'Selected' : 'Not selected'} filter option`}
      accessibilityState={{ selected: isSelected }}
      style={{
        ...styles.container,
        backgroundColor: isSelected 
          ? (color || theme.colors.interactive.primary) 
          : theme.colors.background.secondary,
        borderColor: isSelected 
          ? (color || theme.colors.interactive.primary) 
          : theme.colors.border.primary,
      }}
    >
      <Text style={{
        ...styles.text,
        color: isSelected 
          ? 'white' 
          : theme.colors.text.primary,
      }}>
        {label}
      </Text>
    </Pressable>
  );
}, (prevProps, nextProps) => 
  prevProps.label === nextProps.label &&
  prevProps.isSelected === nextProps.isSelected &&
  prevProps.color === nextProps.color
);

export const AchievementsScreen: React.FC = () => {
  const { theme } = useTheme();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [categories, setCategories] = useState<AchievementCategory[]>([]);
  const [stats, setStats] = useState<StudentAchievementStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<AchievementSortBy>('newest');
  const [filters, setFilters] = useState<AchievementFilters>({
    categories: [],
    types: [],
    statuses: [],
    rarities: [],
    show_locked: true,
    show_completed: true,
  });

  const celebrationScale = useSharedValue(0);
  const celebrationOpacity = useSharedValue(0);

  useEffect(() => {
    loadAchievements();
  }, []);

  // Cleanup animations on unmount
  useEffect(() => {
    return () => {
      cancelAnimation(celebrationScale);
      cancelAnimation(celebrationOpacity);
    };
  }, [celebrationScale, celebrationOpacity]);

  const loadAchievements = async () => {
    try {
      setIsLoading(true);
      // Using mock data for development
      const mockAchievements = achievementsService.generateMockAchievements();
      const mockCategories = achievementsService.generateMockCategories();
      const mockStats = achievementsService.generateMockStats();
      
      setAchievements(mockAchievements);
      setCategories(mockCategories);
      setStats(mockStats);
    } catch (error) {
      Alert.alert('Error', 'Failed to load achievements. Please try again.');
      console.error('Failed to load achievements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadAchievements();
    setIsRefreshing(false);
  };

  const filteredAchievements = useFilteredAchievements(achievements, searchQuery, filters, sortBy);

  const handleAchievementPress = useCallback((achievement: Achievement) => {
    setSelectedAchievement(achievement);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedAchievement(null);
  }, []);

  const toggleFilter = useCallback((filterType: keyof AchievementFilters, value: string) => {
    setFilters(prev => {
      const currentList = prev[filterType] as string[];
      const isSelected = currentList.includes(value);
      
      return {
        ...prev,
        [filterType]: isSelected
          ? currentList.filter(item => item !== value)
          : [...currentList, value],
      };
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      categories: [],
      types: [],
      statuses: [],
      rarities: [],
      show_locked: true,
      show_completed: true,
    });
    setSearchQuery('');
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background.secondary }}>
        <LoadingSpinner />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.secondary }}>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: theme.spacing['3xl'] }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Overview */}
        {stats && (
          <Animated.View
            entering={FadeInDown.delay(100).springify()}
            style={{
              margin: theme.spacing.md,
              backgroundColor: theme.colors.interactive.primary,
              borderRadius: theme.borderRadius.xl,
              padding: theme.spacing.lg,
            }}
          >
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: theme.spacing.md,
            }}>
              <Ionicons name="trophy" size={24} color="white" />
              <Text style={{
                color: 'white',
                fontSize: theme.fontSizes.lg,
                fontWeight: theme.fontConfig.fontWeight.semibold,
                marginLeft: theme.spacing.sm,
              }}>
                Your Progress
              </Text>
            </View>
            
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{
                  color: 'white',
                  fontSize: theme.fontSizes.xl,
                  fontWeight: theme.fontConfig.fontWeight.bold,
                }}>
                  {stats.completed_achievements}
                </Text>
                <Text style={{
                  color: 'white',
                  fontSize: theme.fontSizes.sm,
                  opacity: 0.8,
                }}>
                  Unlocked
                </Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{
                  color: 'white',
                  fontSize: theme.fontSizes.xl,
                  fontWeight: theme.fontConfig.fontWeight.bold,
                }}>
                  {achievementsService.formatPoints(stats.total_points)}
                </Text>
                <Text style={{
                  color: 'white',
                  fontSize: theme.fontSizes.sm,
                  opacity: 0.8,
                }}>
                  Points
                </Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{
                  color: 'white',
                  fontSize: theme.fontSizes.xl,
                  fontWeight: theme.fontConfig.fontWeight.bold,
                }}>
                  {stats.completion_percentage}%
                </Text>
                <Text style={{
                  color: 'white',
                  fontSize: theme.fontSizes.sm,
                  opacity: 0.8,
                }}>
                  Complete
                </Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Search Bar with Filter Button */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={{
            paddingHorizontal: theme.spacing.md,
            marginBottom: theme.spacing.md,
          }}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.sm,
          }}>
            <View style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: theme.colors.background.primary,
              borderRadius: theme.borderRadius.xl,
              paddingHorizontal: theme.spacing.md,
              paddingVertical: theme.spacing.sm,
              borderWidth: 1,
              borderColor: theme.colors.border.primary,
            }}>
              <Ionicons name="search" size={20} color={theme.colors.icon.secondary} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search achievements..."
                placeholderTextColor={theme.colors.text.tertiary}
                accessibilityLabel="Search achievements"
                accessibilityHint="Type to search through your achievements"
                style={{
                  flex: 1,
                  marginLeft: theme.spacing.sm,
                  color: theme.colors.text.primary,
                  fontSize: theme.fontSizes.base,
                }}
              />
              {searchQuery.length > 0 && (
                <Pressable 
                  onPress={() => setSearchQuery('')}
                  accessibilityRole="button"
                  accessibilityLabel="Clear search"
                  accessibilityHint="Clear the search text"
                >
                  <Ionicons name="close-circle" size={20} color={theme.colors.icon.secondary} />
                </Pressable>
              )}
            </View>
            
            {/* Filter Button */}
            <Pressable
              onPress={() => setShowFilters(true)}
              accessibilityRole="button"
              accessibilityLabel="Filter achievements"
              accessibilityHint="Open filters and sorting options"
              style={{
                width: 44,
                height: 44,
                borderRadius: theme.borderRadius.xl,
                backgroundColor: theme.colors.background.primary,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: theme.colors.border.primary,
                ...theme.elevation.sm,
              }}
            >
              <Ionicons name="options" size={20} color={theme.colors.icon.primary} />
            </Pressable>
          </View>
        </Animated.View>

        {/* Category Filters */}
        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          style={{
            paddingHorizontal: theme.spacing.md,
            marginBottom: theme.spacing.md,
          }}
        >
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: theme.spacing.md }}
          >
            <FilterChip
              label="All"
              isSelected={filters.categories.length === 0}
              onPress={clearFilters}
              color={theme.colors.interactive.primary}
            />
            {categories.map(category => (
              <FilterChip
                key={category.id}
                label={`${category.name} (${category.completed_count}/${category.achievements_count})`}
                isSelected={filters.categories.includes(category.name)}
                onPress={() => toggleFilter('categories', category.name)}
                color={category.color}
              />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Achievements List */}
        <Animated.View
          entering={FadeInUp.delay(400).springify()}
          style={{ paddingTop: theme.spacing.sm }}
        >
          {filteredAchievements.length === 0 ? (
            <View style={{
              alignItems: 'center',
              padding: theme.spacing.xl,
            }}>
              <Ionicons name="trophy-outline" size={48} color={theme.colors.icon.tertiary} />
              <Text style={{
                color: theme.colors.text.secondary,
                fontSize: theme.fontSizes.lg,
                fontWeight: theme.fontConfig.fontWeight.medium,
                textAlign: 'center',
                marginTop: theme.spacing.md,
              }}>
                No achievements found
              </Text>
              <Text style={{
                color: theme.colors.text.tertiary,
                fontSize: theme.fontSizes.base,
                textAlign: 'center',
                marginTop: theme.spacing.sm,
              }}>
                Try adjusting your search or filters
              </Text>
            </View>
          ) : (
            filteredAchievements.map((achievement, index) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                onPress={handleAchievementPress}
                index={index}
              />
            ))
          )}
        </Animated.View>
      </ScrollView>

      {/* Achievement Detail Modal */}
      <Modal
        visible={selectedAchievement !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseModal}
      >
        {selectedAchievement && (
          <View style={{
            flex: 1,
            backgroundColor: theme.colors.background.secondary,
          }}>
            {/* Modal Header */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: theme.spacing.md,
              paddingVertical: theme.spacing.md,
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.border.primary,
              backgroundColor: theme.colors.background.primary,
            }}>
              <Text style={{
                color: theme.colors.text.primary,
                fontSize: theme.fontSizes.lg,
                fontWeight: theme.fontConfig.fontWeight.semibold,
              }}>
                Achievement Details
              </Text>
              <Pressable
                onPress={handleCloseModal}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: theme.colors.background.secondary,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="close" size={18} color={theme.colors.icon.primary} />
              </Pressable>
            </View>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: theme.spacing.lg }}>
              {/* Achievement Icon and Title */}
              <View style={{ alignItems: 'center', marginBottom: theme.spacing.xl }}>
                <View style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: theme.colors.background.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: theme.spacing.md,
                  ...theme.elevation.md,
                  borderWidth: 2,
                  borderColor: theme.colors.interactive.primary,
                }}>
                  <Ionicons
                    name={selectedAchievement.icon as any}
                    size={48}
                    color={selectedAchievement.icon_color || theme.colors.interactive.primary}
                  />
                </View>
                
                <Text style={{
                  color: theme.colors.text.primary,
                  fontSize: theme.fontSizes.xl,
                  fontWeight: theme.fontConfig.fontWeight.bold,
                  textAlign: 'center',
                  marginBottom: theme.spacing.sm,
                }}>
                  {selectedAchievement.title}
                </Text>
                
                <Text style={{
                  color: theme.colors.text.secondary,
                  fontSize: theme.fontSizes.base,
                  textAlign: 'center',
                  lineHeight: 22,
                }}>
                  {selectedAchievement.description}
                </Text>
              </View>

              {/* Progress Section */}
              {selectedAchievement.status !== 'locked' && (
                <View style={{
                  backgroundColor: theme.colors.background.primary,
                  borderRadius: theme.borderRadius.xl,
                  padding: theme.spacing.lg,
                  marginBottom: theme.spacing.lg,
                }}>
                  <Text style={{
                    color: theme.colors.text.primary,
                    fontSize: theme.fontSizes.lg,
                    fontWeight: theme.fontConfig.fontWeight.semibold,
                    marginBottom: theme.spacing.md,
                  }}>
                    Progress
                  </Text>
                  
                  <View style={{
                    backgroundColor: theme.colors.background.secondary,
                    height: 10,
                    borderRadius: 5,
                    marginBottom: theme.spacing.sm,
                    overflow: 'hidden',
                  }}>
                    <View style={{
                      backgroundColor: selectedAchievement.status === 'completed' 
                        ? theme.colors.status.success 
                        : theme.colors.interactive.primary,
                      height: '100%',
                      width: `${selectedAchievement.progress_percentage}%`,
                      borderRadius: 5,
                    }} />
                  </View>
                  
                  <Text style={{
                    color: theme.colors.text.secondary,
                    fontSize: theme.fontSizes.base,
                    textAlign: 'center',
                  }}>
                    {selectedAchievement.criteria.current_value} / {selectedAchievement.criteria.target_value} {selectedAchievement.criteria.unit}
                  </Text>
                  
                  <Text style={{
                    color: theme.colors.text.primary,
                    fontSize: theme.fontSizes.lg,
                    fontWeight: theme.fontConfig.fontWeight.semibold,
                    textAlign: 'center',
                    marginTop: theme.spacing.sm,
                  }}>
                    {selectedAchievement.progress_percentage}% Complete
                  </Text>
                </View>
              )}

              {/* Details Section */}
              <View style={{
                backgroundColor: theme.colors.background.primary,
                borderRadius: theme.borderRadius.xl,
                padding: theme.spacing.lg,
              }}>
                <Text style={{
                  color: theme.colors.text.primary,
                  fontSize: theme.fontSizes.lg,
                  fontWeight: theme.fontConfig.fontWeight.semibold,
                  marginBottom: theme.spacing.md,
                }}>
                  Details
                </Text>
                
                <View style={{ gap: theme.spacing.md }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: theme.colors.text.secondary, fontSize: theme.fontSizes.base }}>
                      Category
                    </Text>
                    <Text style={{ color: theme.colors.text.primary, fontSize: theme.fontSizes.base, fontWeight: theme.fontConfig.fontWeight.medium }}>
                      {selectedAchievement.category}
                    </Text>
                  </View>
                  
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: theme.colors.text.secondary, fontSize: theme.fontSizes.base }}>
                      Rarity
                    </Text>
                    <Text style={{ 
                      color: achievementsService.getRarityColor(selectedAchievement.rarity), 
                      fontSize: theme.fontSizes.base, 
                      fontWeight: theme.fontConfig.fontWeight.medium,
                      textTransform: 'capitalize',
                    }}>
                      {selectedAchievement.rarity}
                    </Text>
                  </View>
                  
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: theme.colors.text.secondary, fontSize: theme.fontSizes.base }}>
                      Points
                    </Text>
                    <Text style={{ color: theme.colors.status.success, fontSize: theme.fontSizes.base, fontWeight: theme.fontConfig.fontWeight.semibold }}>
                      {achievementsService.formatPoints(selectedAchievement.points)}
                    </Text>
                  </View>
                  
                  {selectedAchievement.unlocked_at && (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ color: theme.colors.text.secondary, fontSize: theme.fontSizes.base }}>
                        Unlocked
                      </Text>
                      <Text style={{ color: theme.colors.text.primary, fontSize: theme.fontSizes.base, fontWeight: theme.fontConfig.fontWeight.medium }}>
                        {new Date(selectedAchievement.unlocked_at).toLocaleDateString()}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </ScrollView>
          </View>
        )}
      </Modal>

      {/* Filters Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: theme.colors.background.secondary,
        }}>
          {/* Filters Header */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border.primary,
            backgroundColor: theme.colors.background.primary,
          }}>
            <Text style={{
              color: theme.colors.text.primary,
              fontSize: theme.fontSizes.lg,
              fontWeight: theme.fontConfig.fontWeight.semibold,
            }}>
              Filters & Sort
            </Text>
            <Pressable onPress={() => setShowFilters(false)}>
              <Text style={{
                color: theme.colors.interactive.primary,
                fontSize: theme.fontSizes.base,
                fontWeight: theme.fontConfig.fontWeight.medium,
              }}>
                Done
              </Text>
            </Pressable>
          </View>

          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: theme.spacing.lg }}>
            {/* Sort Options */}
            <View style={{ marginBottom: theme.spacing.xl }}>
              <Text style={{
                color: theme.colors.text.primary,
                fontSize: theme.fontSizes.lg,
                fontWeight: theme.fontConfig.fontWeight.semibold,
                marginBottom: theme.spacing.md,
              }}>
                Sort By
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {(['newest', 'oldest', 'progress', 'points', 'rarity', 'alphabetical'] as AchievementSortBy[]).map(option => (
                  <FilterChip
                    key={option}
                    label={option.charAt(0).toUpperCase() + option.slice(1)}
                    isSelected={sortBy === option}
                    onPress={() => setSortBy(option)}
                  />
                ))}
              </View>
            </View>

            {/* Status Filters */}
            <View style={{ marginBottom: theme.spacing.xl }}>
              <Text style={{
                color: theme.colors.text.primary,
                fontSize: theme.fontSizes.lg,
                fontWeight: theme.fontConfig.fontWeight.semibold,
                marginBottom: theme.spacing.md,
              }}>
                Status
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {(['available', 'in_progress', 'completed', 'locked'] as AchievementStatus[]).map(status => (
                  <FilterChip
                    key={status}
                    label={status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    isSelected={filters.statuses.includes(status)}
                    onPress={() => toggleFilter('statuses', status)}
                  />
                ))}
              </View>
            </View>

            {/* Rarity Filters */}
            <View style={{ marginBottom: theme.spacing.xl }}>
              <Text style={{
                color: theme.colors.text.primary,
                fontSize: theme.fontSizes.lg,
                fontWeight: theme.fontConfig.fontWeight.semibold,
                marginBottom: theme.spacing.md,
              }}>
                Rarity
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {(['common', 'uncommon', 'rare', 'epic', 'legendary'] as AchievementRarity[]).map(rarity => (
                  <FilterChip
                    key={rarity}
                    label={rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                    isSelected={filters.rarities.includes(rarity)}
                    onPress={() => toggleFilter('rarities', rarity)}
                    color={achievementsService.getRarityColor(rarity)}
                  />
                ))}
              </View>
            </View>

            {/* Clear Filters */}
            <Pressable
              onPress={clearFilters}
              style={{
                backgroundColor: theme.colors.status.errorBackground,
                borderRadius: theme.borderRadius.xl,
                padding: theme.spacing.md,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: theme.colors.status.error,
              }}
            >
              <Text style={{
                color: theme.colors.status.error,
                fontSize: theme.fontSizes.base,
                fontWeight: theme.fontConfig.fontWeight.medium,
              }}>
                Clear All Filters
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};