import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useTheme, createThemedStyles, SegmentedControl } from '@academy/mobile-shared';
import type { PerformanceStackParamList } from '../navigation/PerformanceNavigator';

import { SwimmingPerformanceAdapter } from '../programs/swimming/SwimmingPerformanceAdapter';

import {
  ProgramType,
  TimePeriod,
} from '../types';

import {
  SwimmingStroke,
  PoolSize,
  PoolConfig,
  SwimmingPerformanceCard,
  SwimmingStrokeCard,
  SwimmingPerformanceFilters,
  PerformanceViewMode,
  STROKE_LABELS,
} from '../programs/swimming/types';


// Mock swimming performance cards (Times view) - based on screenshot design
const mockSwimmingPerformanceCards: SwimmingPerformanceCard[] = [
  {
    id: '17m_freestyle',
    title: '17m',
    distance: 17,
    stroke: 'freestyle',
    poolSize: '17m',
    currentTime: '00:26.30',
    currentTimeInSeconds: 26.30,
    personalBest: '00:26.30',
    personalBestInSeconds: 26.30,
    improvement: {
      percentage: 0.8,
      timeChange: '-0.23',
      period: 'vs last month'
    },
    totalRaces: 12,
    lastRaceDate: '10 Feb 2025',
    trend: 'improving',
  },
  {
    id: '34m_freestyle',
    title: '34m', 
    distance: 34,
    stroke: 'freestyle',
    poolSize: '17m',
    currentTime: '00:26.30',
    currentTimeInSeconds: 26.30,
    personalBest: '00:26.15',
    personalBestInSeconds: 26.15,
    improvement: {
      percentage: 1.2,
      timeChange: '-0.31',
      period: 'vs last month'
    },
    totalRaces: 8,
    lastRaceDate: '08 Feb 2025',
    trend: 'improving',
  },
  {
    id: '51m_freestyle',
    title: '51m',
    distance: 51,
    stroke: 'freestyle',
    poolSize: '17m',
    currentTime: '00:26.30',
    currentTimeInSeconds: 26.30,
    personalBest: '00:26.10',
    personalBestInSeconds: 26.10,
    improvement: {
      percentage: 0.5,
      timeChange: '-0.12',
      period: 'vs last month'
    },
    totalRaces: 6,
    lastRaceDate: '05 Feb 2025',
    trend: 'stable',
  },
  {
    id: '68m_freestyle',
    title: '68m',
    distance: 68,
    stroke: 'freestyle',
    poolSize: '17m',
    currentTime: '00:26.30',
    currentTimeInSeconds: 26.30,
    personalBest: '00:26.20',
    personalBestInSeconds: 26.20,
    improvement: {
      percentage: 0.9,
      timeChange: '-0.25',
      period: 'vs last month'
    },
    totalRaces: 4,
    lastRaceDate: '03 Feb 2025',
    trend: 'improving',
  },
  {
    id: '85m_freestyle',
    title: '85m',
    distance: 85,
    stroke: 'freestyle',
    poolSize: '17m',
    currentTime: '00:26.30',
    currentTimeInSeconds: 26.30,
    personalBest: '00:26.25',
    personalBestInSeconds: 26.25,
    improvement: {
      percentage: 0.3,
      timeChange: '-0.08',
      period: 'vs last month'
    },
    totalRaces: 3,
    lastRaceDate: '01 Feb 2025',
    trend: 'stable',
  },
];

// Mock swimming stroke cards (Stroke view) - based on screenshot design
const mockSwimmingStrokeCards: SwimmingStrokeCard[] = [
  {
    id: 'single_arm_free_r',
    title: 'Single Arm Free: R',
    stroke: 'freestyle',
    distance: 17,
    poolSize: '17m',
    value: 26,
    unit: '',
    date: '10 Feb 2025',
    description: 'Right arm single arm freestyle drill',
  },
  {
    id: 'single_arm_free_l',
    title: 'Single Arm Free: L', 
    stroke: 'freestyle',
    distance: 17,
    poolSize: '17m',
    value: 30,
    unit: '',
    date: '10 Feb 2025',
    description: 'Left arm single arm freestyle drill',
  },
  {
    id: 'both_arms_free',
    title: 'Both Arms Free',
    stroke: 'freestyle',
    distance: 17,
    poolSize: '17m',
    value: 23,
    unit: '',
    date: '10 Feb 2025',
    description: 'Both arms freestyle technique',
  },
  {
    id: 'frog_kick',
    title: 'Frog Kick',
    stroke: 'breaststroke',
    distance: 17,
    poolSize: '17m',
    value: 63,
    unit: '',
    date: '10 Feb 2025',
    description: 'Breaststroke kick technique',
  },
  {
    id: 'breast_pull',
    title: 'Breast Pull',
    stroke: 'breaststroke',
    distance: 17,
    poolSize: '17m',
    value: 32,
    unit: '',
    date: '10 Feb 2025',
    description: 'Breaststroke pull technique',
  },
  {
    id: 'single_arm_back_r',
    title: 'Single Arm Back: R',
    stroke: 'backstroke',
    distance: 17,
    poolSize: '17m',
    value: 32,
    unit: '',
    date: '10 Feb 2025',
    description: 'Right arm backstroke drill',
  },
];

export const PerformanceScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = useThemedStyles();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<PerformanceStackParamList>>();
  
  // Swimming-focused state (program context already selected)
  const [viewMode, setViewMode] = useState<PerformanceViewMode>('times');
  const [selectedPoolSize, setSelectedPoolSize] = useState<PoolSize>('17m');
  const [selectedStrokes, setSelectedStrokes] = useState<SwimmingStroke[]>(['freestyle']);
  const [performanceCards, setPerformanceCards] = useState<SwimmingPerformanceCard[]>(mockSwimmingPerformanceCards);
  const [strokeCards, setStrokeCards] = useState<SwimmingStrokeCard[]>(mockSwimmingStrokeCards);
  const [isLoading, setIsLoading] = useState(false);

  const swimmingAdapter = new SwimmingPerformanceAdapter();

  // Pool configurations (matching screenshot)
  const poolConfigurations: PoolConfig[] = [
    { size: '17m', location: 'My Location', isUserLocation: true },
    { size: '25m' },
    { size: '50m' },
  ];

  // Available strokes for filtering
  const availableStrokes: SwimmingStroke[] = ['freestyle', 'breaststroke', 'backstroke', 'butterfly', 'individual_medley'];

  // Available stroke filters for UI
  const strokeOptions = availableStrokes.map(stroke => ({
    id: stroke,
    label: STROKE_LABELS[stroke],
    selected: selectedStrokes.includes(stroke),
  }));

  useEffect(() => {
    loadPerformanceData();
  }, [viewMode, selectedPoolSize, selectedStrokes]);

  const loadPerformanceData = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // In real app, this would fetch data based on viewMode, poolSize, and selectedStrokes
      // Filter data based on current selections
      const filteredPerformanceCards = mockSwimmingPerformanceCards.filter(card => 
        selectedStrokes.includes(card.stroke) && card.poolSize === selectedPoolSize
      );
      const filteredStrokeCards = mockSwimmingStrokeCards.filter(card =>
        selectedStrokes.includes(card.stroke) && card.poolSize === selectedPoolSize
      );
      
      setPerformanceCards(filteredPerformanceCards);
      setStrokeCards(filteredStrokeCards);
      setIsLoading(false);
    }, 500);
  };

  const handleStrokeToggle = (stroke: SwimmingStroke) => {
    setSelectedStrokes(prev => {
      if (prev.includes(stroke)) {
        // Don't allow removing all strokes
        if (prev.length === 1) return prev;
        return prev.filter(s => s !== stroke);
      } else {
        return [...prev, stroke];
      }
    });
  };

  const handleViewModeChange = (mode: PerformanceViewMode) => {
    setViewMode(mode);
  };

  const handlePoolSizeChange = (poolSize: PoolSize) => {
    setSelectedPoolSize(poolSize);
  };

  const handlePerformanceCardPress = (performanceCard: SwimmingPerformanceCard) => {
    navigation.navigate('SwimmingPerformanceDetail', { eventId: performanceCard.id });
  };

  const handleStrokeCardPress = (strokeCard: SwimmingStrokeCard) => {
    // TODO: Navigate to detailed stroke analysis screen
    console.log('Navigate to stroke detail:', strokeCard.title);
  };


  // Times/Stroke view mode selector
  const renderViewModeSelector = () => (
    <Animated.View
      entering={FadeInDown.delay(100).springify()}
      style={styles.viewModeSelectorSection}
    >
      <Text style={styles.sectionTitle}>Metric View</Text>
      <SegmentedControl
        options={['times', 'stroke']}
        selectedValue={viewMode}
        onChange={(value) => handleViewModeChange(value as PerformanceViewMode)}
        variant="compact"
        size="sm"
        style={styles.viewModeControl}
        selectedOptionStyle={styles.viewModeSelectedOption}
      />
    </Animated.View>
  );

  // Pool size selector (compact design)
  const renderPoolSizeSelector = () => (
    <Animated.View
      entering={FadeInDown.delay(150).springify()}
      style={styles.poolSizeSelectorSection}
    >
      <Text style={styles.sectionTitle}>Pool Size</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.poolSizeScrollView}
        contentContainerStyle={styles.poolSizeContainer}
      >
        {poolConfigurations.map((pool) => (
          <Pressable
            key={pool.size}
            style={[
              styles.poolSizeButtonCompact,
              selectedPoolSize === pool.size && styles.poolSizeButtonCompactActive,
            ]}
            onPress={() => handlePoolSizeChange(pool.size)}
          >
            <Text style={[
              styles.poolSizeTextCompact,
              selectedPoolSize === pool.size && styles.poolSizeTextCompactActive,
            ]}>
              {pool.size}
            </Text>
            {pool.isUserLocation && (
              <View style={styles.userLocationDot} />
            )}
          </Pressable>
        ))}
      </ScrollView>
    </Animated.View>
  );

  // Stroke filter using native components
  const renderStrokeFilter = () => (
    <Animated.View
      entering={FadeInDown.delay(200).springify()}
      style={styles.filtersSection}
    >
      <Text style={styles.sectionTitle}>Stroke Filter</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.strokeFilterScrollView}
        contentContainerStyle={styles.strokeFilterContainer}
      >
        {strokeOptions.map((option) => (
          <Pressable
            key={option.id}
            style={[
              styles.strokeFilterButton,
              option.selected && styles.strokeFilterButtonActive,
            ]}
            onPress={() => handleStrokeToggle(option.id)}
          >
            <Text style={[
              styles.strokeFilterButtonText,
              option.selected && styles.strokeFilterButtonTextActive,
            ]}>
              {option.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </Animated.View>
  );

  // Render swimming event cards (Times view)
  const renderEventCards = () => (
    <Animated.View
      entering={FadeInDown.delay(300).springify()}
      style={styles.cardsSection}
    >
      <Text style={styles.sectionTitle}>Swimming Times</Text>
      <View style={styles.cardsContainer}>
        {performanceCards.map((performanceCard, index) => (
          <Animated.View
            key={performanceCard.id}
            entering={FadeInRight.delay(index * 50).springify()}
          >
            <Pressable
              style={({ pressed }) => [
                styles.performanceCard,
                pressed && styles.cardPressed,
              ]}
              onPress={() => handlePerformanceCardPress(performanceCard)}
            >
              <View style={styles.performanceCardContent}>
                <View style={styles.performanceCardDistance}>
                  <Text style={styles.performanceCardTitle}>{performanceCard.title}</Text>
                  <Ionicons 
                    name="chevron-forward" 
                    size={20} 
                    color={theme.colors.text.secondary}
                  />
                </View>
                <Text style={styles.performanceCardTime}>{performanceCard.currentTime}</Text>
                <Text style={styles.performanceCardDate}>{performanceCard.lastRaceDate}</Text>
              </View>
            </Pressable>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );

  // Render swimming stroke cards (Stroke view)
  const renderStrokeCards = () => (
    <Animated.View
      entering={FadeInDown.delay(300).springify()}
      style={styles.cardsSection}
    >
      <Text style={styles.sectionTitle}>Stroke Analysis</Text>
      <View style={styles.cardsContainer}>
        {strokeCards.map((strokeCard, index) => (
          <Animated.View
            key={strokeCard.id}
            entering={FadeInRight.delay(index * 50).springify()}
          >
            <Pressable
              style={({ pressed }) => [
                styles.strokeCard,
                pressed && styles.cardPressed,
              ]}
              onPress={() => handleStrokeCardPress(strokeCard)}
            >
              <View style={styles.strokeCardContent}>
                <View style={styles.strokeCardHeader}>
                  <Text style={styles.strokeCardTitle}>{strokeCard.title}</Text>
                  <Ionicons 
                    name="chevron-forward" 
                    size={20} 
                    color={theme.colors.text.secondary}
                  />
                </View>
                <Text style={styles.strokeCardValue}>{strokeCard.value}</Text>
                <Text style={styles.strokeCardDate}>{strokeCard.date}</Text>
              </View>
            </Pressable>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Times/Stroke View Mode Selector */}
        {renderViewModeSelector()}

        {/* Pool Size Selector */}
        {renderPoolSizeSelector()}

        {/* Stroke Filter */}
        {renderStrokeFilter()}

        {/* Main Content - Event Cards or Stroke Cards */}
        {viewMode === 'times' ? renderEventCards() : renderStrokeCards()}

        {/* Loading State */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading performance data...</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const useThemedStyles = createThemedStyles((theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    },
    
    // Scroll View
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing['3xl'],
    },
    
    // Section Titles
    sectionTitle: {
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.md,
    },
    
    // View Mode Selector (Times/Stroke segmented control)
    viewModeSelectorSection: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    viewModeControl: {
      flex: 1,
      height: 36, // Match stroke filter button height
    },
    viewModeSelectedOption: {
      borderRadius: theme.borderRadius.lg, // More rounded than default sm
    },
    
    // Pool Size Selector
    poolSizeSelectorSection: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    poolSizeScrollView: {
      flexGrow: 0,
    },
    poolSizeContainer: {
      paddingHorizontal: theme.spacing.md,
      gap: theme.spacing.md,
    },
    poolSizeButton: {
      borderRadius: theme.borderRadius.lg,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      minHeight: theme.safeArea.minTouchTarget.height,
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: 80,
      borderWidth: theme.borderWidth.sm,
      borderColor: theme.colors.border.primary,
      backgroundColor: theme.colors.background.primary,
      ...theme.elevation.sm,
    },
    poolSizeButtonActive: {
      backgroundColor: theme.colors.interactive.primary,
      borderColor: theme.colors.interactive.primary,
    },
    poolSizeButtonPrimary: {
      borderColor: theme.colors.interactive.primary,
      backgroundColor: theme.colors.interactive.faded,
    },
    userLocationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    userLocationLabel: {
      fontSize: theme.fontSizes.caption,
      color: theme.colors.text.secondary,
    },
    poolSizeText: {
      fontSize: theme.fontSizes.body,
      fontWeight: theme.fontConfig.fontWeight.bold,
      color: theme.colors.interactive.primary,
      textAlign: 'center',
    },
    
    // Compact Pool Size Buttons
    poolSizeButtonCompact: {
      borderRadius: theme.borderRadius.full,
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
      minHeight: 32,
      minWidth: 60,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      backgroundColor: theme.colors.background.primary,
      borderWidth: theme.borderWidth.sm,
      borderColor: theme.colors.border.primary,
    },
    poolSizeButtonCompactActive: {
      backgroundColor: theme.colors.interactive.primary,
      borderColor: theme.colors.interactive.primary,
    },
    poolSizeTextCompact: {
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: theme.colors.text.primary,
      textAlign: 'center',
    },
    poolSizeTextCompactActive: {
      color: theme.colors.text.inverse,
      fontWeight: theme.fontConfig.fontWeight.semibold,
    },
    userLocationDot: {
      position: 'absolute',
      top: -2,
      right: -2,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.status.success,
    },
    
    // Stroke Filter
    filtersSection: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    strokeFilterScrollView: {
      flexGrow: 0,
    },
    strokeFilterContainer: {
      paddingHorizontal: theme.spacing.md,
      gap: theme.spacing.md,
    },
    strokeFilterButton: {
      borderRadius: theme.borderRadius.full,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
      minHeight: 36,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: theme.borderWidth.sm,
      borderColor: theme.colors.border.primary,
      backgroundColor: theme.colors.background.primary,
      ...theme.elevation.sm,
    },
    strokeFilterButtonActive: {
      backgroundColor: theme.colors.interactive.primary,
      borderColor: theme.colors.interactive.primary,
    },
    strokeFilterButtonText: {
      fontSize: theme.fontSizes.body,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: theme.colors.text.secondary,
    },
    strokeFilterButtonTextActive: {
      color: theme.colors.text.inverse,
      fontWeight: theme.fontConfig.fontWeight.semibold,
    },
    
    // Swimming Cards Section
    cardsSection: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    cardsContainer: {
      gap: theme.spacing.sm,
    },
    
    // Performance Cards (Times view)
    performanceCard: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      borderWidth: theme.borderWidth.sm,
      borderColor: theme.colors.border.primary,
      ...theme.elevation.md,
    },
    performanceCardContent: {
      gap: theme.spacing.sm,
    },
    performanceCardDistance: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    performanceCardTitle: {
      fontSize: theme.fontSizes.body,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
    },
    performanceCardTime: {
      fontSize: theme.fontSizes.h3,
      fontWeight: theme.fontConfig.fontWeight.bold,
      color: theme.colors.interactive.primary,
      marginVertical: theme.spacing.xs,
    },
    performanceCardDate: {
      fontSize: theme.fontSizes.caption,
      color: theme.colors.text.secondary,
    },
    
    // Stroke Cards (Stroke view) - Updated to match event cards
    strokeCard: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      borderWidth: theme.borderWidth.sm,
      borderColor: theme.colors.border.primary,
      ...theme.elevation.md,
    },
    strokeCardContent: {
      gap: theme.spacing.sm,
    },
    strokeCardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    strokeCardTitle: {
      fontSize: theme.fontSizes.body,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
    },
    strokeCardValue: {
      fontSize: theme.fontSizes.h3,
      fontWeight: theme.fontConfig.fontWeight.bold,
      color: theme.colors.interactive.primary,
      marginVertical: theme.spacing.xs,
    },
    strokeCardDate: {
      fontSize: theme.fontSizes.caption,
      color: theme.colors.text.secondary,
    },
    
    // General card styles
    cardPressed: {
      opacity: 0.8,
      transform: [{ scale: 0.98 }],
    },
    
    // Loading state
    loadingContainer: {
      padding: theme.spacing.xl,
      alignItems: 'center',
    },
    loadingText: {
      fontSize: theme.fontSizes.body,
      color: theme.colors.text.secondary,
      fontStyle: 'italic',
    },
  })
);