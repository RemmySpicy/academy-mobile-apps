# Achievement System Integration Guide

This guide covers how to integrate the achievement system into Academy Apps and extend it for custom use cases.

## 🔗 Navigation Integration

### Students App Integration

The achievement system is fully integrated into the students app navigation:

#### 1. Menu Navigator Route
**File**: `students-app/src/features/menu/navigation/MenuNavigator.tsx`

```typescript
export type MenuStackParamList = {
  // ... other routes
  Achievements: undefined;
};

<Stack.Screen 
  name="Achievements" 
  component={AchievementsScreen}
/>
```

#### 2. Menu Screen Access Points  
**File**: `students-app/src/features/menu/screens/AppMenuScreen.tsx`

```typescript
// Academy Features Section (Primary Access)
{
  id: 'achievements',
  title: 'Achievements',
  icon: 'trophy',
  onPress: () => navigation.navigate('Achievements'),
  badge: '3', // Dynamic achievement count
  backgroundColor: theme.isDark ? '#1e4a3f' : '#e8f5e8',
  iconColor: theme.colors.status.success,
}

// Quick Access Card (Secondary Access)
<Pressable onPress={() => navigation.navigate('Achievements')}>
  <View style={quickAccessCardStyles}>
    <Ionicons name="trophy" size={20} color={theme.colors.status.success} />
    <Text>My Progress</Text>
  </View>
</Pressable>

// Profile Stats Integration  
<View style={{ alignItems: 'center' }}>
  <Text style={statsNumberStyle}>3</Text>
  <Text style={statsLabelStyle}>Achievements</Text>
</View>
```

## 📱 Component Integration

### Using Achievement Components

```typescript
import {
  AchievementCelebration,
  AchievementNotificationToast, 
  AchievementLeaderboard,
  achievementsService
} from '@academy/mobile-shared';

// In your component
const [celebration, setCelebration] = useState<AchievementCelebration | null>(null);
const [notification, setNotification] = useState<AchievementNotification | null>(null);

// Trigger celebration on achievement unlock
const handleAchievementUnlock = (achievement: Achievement) => {
  setCelebration({
    achievement,
    points_awarded: achievement.points,
    animation_type: 'confetti',
    sound_enabled: true,
    show_leaderboard_update: true,
  });
};

// Show progress notification
const showProgressUpdate = (achievement: Achievement, progress: number) => {
  setNotification({
    id: Date.now().toString(),
    type: 'progress',
    title: 'Progress Update!',
    message: `You're ${progress}% complete on "${achievement.title}"`,
    achievement_id: achievement.id,
    created_at: new Date().toISOString(),
    read: false,
  });
};

// Render components
return (
  <View>
    {/* Your screen content */}
    
    {/* Celebration Modal */}
    <AchievementCelebration
      celebration={celebration}
      onClose={() => setCelebration(null)}
      onViewLeaderboard={() => navigation.navigate('Leaderboard')}
    />
    
    {/* Toast Notification */}
    <AchievementNotificationToast
      notification={notification}
      onPress={() => navigation.navigate('Achievements')}
      onDismiss={() => setNotification(null)}
      duration={4000}
    />
  </View>
);
```

## 🛠 Service Integration

### Using Achievement Service Methods

```typescript
import { achievementsService } from '@academy/mobile-shared';

// Load achievements (with API integration ready)
const loadUserAchievements = async () => {
  try {
    // Production: Use real API
    const response = await achievementsService.getAchievements({
      program_id: currentProgram.id,
      include_hidden: false
    });
    
    // Development: Use mock data
    // const achievements = achievementsService.generateMockAchievements();
    
    setAchievements(response.achievements);
    setCategories(response.categories);
    setStats(response.stats);
  } catch (error) {
    console.error('Failed to load achievements:', error);
    // Fallback to mock data
    const mockData = achievementsService.generateMockAchievements();
    setAchievements(mockData);
  }
};

// Unlock achievement
const unlockAchievement = async (achievementId: string) => {
  try {
    const result = await achievementsService.unlockAchievement({
      achievement_id: achievementId,
      trigger_celebration: true
    });
    
    if (result.success) {
      // Show celebration
      handleAchievementUnlock(result.achievement);
      // Update user's total points
      updateUserStats(result.new_total_points);
    }
  } catch (error) {
    console.error('Failed to unlock achievement:', error);
  }
};

// Use utility methods
const formattedPoints = achievementsService.formatPoints(1500); // "1.5k"
const rarityColor = achievementsService.getRarityColor('legendary'); // "#DC2626"
const sortedAchievements = achievementsService.sortAchievements(achievements, 'points');
```

## 🎯 Custom Achievement Integration

### Creating Custom Achievements

```typescript
// Define custom achievement
const customAchievement: Achievement = {
  id: 'custom-swimming-master',
  title: 'Swimming Master',
  description: 'Master all four swimming strokes',
  icon: 'water',
  icon_color: '#2563EB',
  background_color: '#EBF4FF',
  type: 'performance',
  category: 'Swimming',
  rarity: 'epic',
  status: 'available',
  criteria: {
    type: 'count',
    target_value: 4,
    current_value: 2,
    unit: 'strokes',
    description: 'Master 4 swimming strokes'
  },
  points: 1000,
  progress_percentage: 50,
  program_id: 'swimming-program',
  is_hidden: false,
  display_order: 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Track progress toward achievement
const updateAchievementProgress = async (achievementId: string, newValue: number) => {
  try {
    const progress = await achievementsService.updateProgress(achievementId, newValue);
    
    // Check if achievement should be unlocked
    if (progress.progress_percentage >= 100 && progress.status !== 'completed') {
      await unlockAchievement(achievementId);
    }
  } catch (error) {
    console.error('Failed to update progress:', error);
  }
};
```

### Program-Specific Integration

```typescript
// Load achievements for specific program
const loadProgramAchievements = async (programId: string) => {
  const achievements = await achievementsService.getAchievements({
    program_id: programId,
    status: 'available'
  });
  
  return achievements;
};

// Filter achievements by category
const getSwimmingAchievements = (achievements: Achievement[]) => {
  return achievementsService.getAchievementsByType(achievements, 'performance')
    .filter(achievement => achievement.category === 'Swimming');
};
```

## 🎨 Theming Integration

### Academy Design System Compliance

All achievement components use the Academy theme system:

```typescript
// Colors used in achievement system
const achievementColors = {
  primary: theme.colors.interactive.primary,      // Academy purple
  success: theme.colors.status.success,          // Achievement completion
  warning: theme.colors.status.warning,          // In progress
  background: theme.colors.background.primary,   // Card backgrounds
  text: theme.colors.text.primary,              // Primary text
  secondary: theme.colors.text.secondary,        // Secondary text
};

// Rarity-specific colors
const rarityColors = {
  common: theme.colors.text.secondary,     // Gray
  uncommon: theme.colors.status.success,   // Green  
  rare: theme.colors.interactive.primary,  // Blue
  epic: theme.colors.interactive.purple,   // Purple
  legendary: theme.colors.status.warning,  // Gold
};
```

### Custom Styling

```typescript
// Extend achievement card styling
const createAchievementCardStyles = (theme: Theme, achievement: Achievement) => ({
  container: {
    backgroundColor: achievement.background_color || theme.colors.background.primary,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: achievement.status === 'completed' 
      ? theme.colors.status.success 
      : theme.colors.border.primary,
    ...theme.elevation.sm,
    opacity: achievement.status === 'locked' ? 0.6 : 1,
  },
  icon: {
    color: achievement.icon_color || theme.colors.interactive.primary,
    backgroundColor: `${achievement.icon_color || theme.colors.interactive.primary}15`,
  }
});
```

## 🔄 State Management Integration

### Zustand Store Integration

```typescript
// achievements store (optional)
interface AchievementsStore {
  achievements: Achievement[];
  categories: AchievementCategory[];
  stats: StudentAchievementStats | null;
  filters: AchievementFilters;
  isLoading: boolean;
  
  loadAchievements: () => Promise<void>;
  unlockAchievement: (id: string) => Promise<void>;
  updateFilters: (filters: Partial<AchievementFilters>) => void;
  clearAchievements: () => void;
}

const useAchievementsStore = create<AchievementsStore>((set, get) => ({
  achievements: [],
  categories: [],
  stats: null,
  filters: {
    categories: [],
    types: [],
    statuses: [],
    rarities: [],
    show_locked: true,
    show_completed: true,
  },
  isLoading: false,
  
  loadAchievements: async () => {
    set({ isLoading: true });
    try {
      const data = await achievementsService.getAchievements();
      set({ 
        achievements: data.achievements,
        categories: data.categories,
        stats: data.stats,
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false });
    }
  },
  
  unlockAchievement: async (id: string) => {
    const result = await achievementsService.unlockAchievement({ achievement_id: id });
    if (result.success) {
      const { achievements } = get();
      const updated = achievements.map(a => 
        a.id === id ? { ...a, status: 'completed' as AchievementStatus } : a
      );
      set({ achievements: updated });
    }
  },
  
  updateFilters: (newFilters) => {
    set({ filters: { ...get().filters, ...newFilters } });
  },
  
  clearAchievements: () => {
    set({ achievements: [], categories: [], stats: null });
  },
}));
```

## 📊 Analytics Integration

### Tracking Achievement Events

```typescript
// Track achievement interactions
const trackAchievementEvent = (event: string, achievement: Achievement) => {
  // Analytics service integration
  analytics.track('Achievement Event', {
    event_type: event,
    achievement_id: achievement.id,
    achievement_title: achievement.title,
    achievement_type: achievement.type,
    achievement_rarity: achievement.rarity,
    user_id: currentUser.id,
    program_id: currentProgram.id,
    timestamp: new Date().toISOString(),
  });
};

// Usage in components
const handleAchievementView = (achievement: Achievement) => {
  trackAchievementEvent('view', achievement);
  setSelectedAchievement(achievement);
};

const handleAchievementUnlock = (achievement: Achievement) => {
  trackAchievementEvent('unlock', achievement);
  setCelebration(/* celebration data */);
};
```

## 🚀 Deployment Considerations

### Environment Configuration

```typescript
// Configure for different environments
const achievementConfig = {
  development: {
    useMockData: true,
    enableDebugLogs: true,
    celebrationDuration: 5000, // Longer for testing
  },
  staging: {
    useMockData: false,
    enableDebugLogs: true,
    celebrationDuration: 3000,
  },
  production: {
    useMockData: false,
    enableDebugLogs: false,
    celebrationDuration: 3000,
  }
};

const config = achievementConfig[process.env.NODE_ENV || 'development'];
```

### Performance Optimization

```typescript
// Lazy load achievement details
const AchievementCard = React.memo<AchievementCardProps>(({ achievement, onPress }) => {
  // Component implementation
});

// Debounce search input
const debouncedSearch = useDebounce(searchQuery, 300);

// Virtualize long lists (if needed)
import { FlatList } from 'react-native';

const renderAchievement = ({ item, index }) => (
  <AchievementCard key={item.id} achievement={item} index={index} />
);

<FlatList
  data={filteredAchievements}
  renderItem={renderAchievement}
  keyExtractor={item => item.id}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={10}
/>
```

## ✅ Integration Checklist

When integrating the achievement system:

- [ ] **Navigation**: Add achievement routes to app navigation
- [ ] **Menu Integration**: Add achievement access points in menu
- [ ] **Service Import**: Import and configure `achievementsService`
- [ ] **Component Usage**: Implement celebration and notification components
- [ ] **Theme Compliance**: Use Academy design system colors and spacing
- [ ] **Error Handling**: Implement proper error boundaries and fallbacks
- [ ] **Performance**: Optimize with memoization and efficient rendering
- [ ] **Analytics**: Track achievement events for user engagement
- [ ] **Testing**: Test all achievement flows and edge cases
- [ ] **Documentation**: Update app documentation with achievement features

The achievement system is designed for easy integration and extension while maintaining Academy design system compliance and performance standards.