# Performance System Documentation

## Overview

The Performance System is a comprehensive multi-program performance tracking and analytics feature designed for the Academy Mobile Apps. It provides detailed performance analysis, progress tracking, and goal management across various academy programs.

## Architecture

### Program-Specific Implementation

The system uses a modular, program-aware architecture that supports multiple academy programs:

- **Swimming Performance** (Primary implementation)
- **Basketball Performance** (Future)
- **Football Performance** (Future)
- **Music Performance** (Future)
- **Other Academy Programs** (Extensible)

### Key Components

```
students-app/src/features/performance/
├── screens/
│   ├── PerformanceScreen.tsx           # Main performance dashboard
│   └── SwimmingEventDetailScreen.tsx   # Detailed progression view
├── navigation/
│   └── PerformanceNavigator.tsx        # Performance stack navigation
├── programs/
│   └── swimming/
│       ├── types.ts                    # Swimming-specific types
│       └── SwimmingPerformanceAdapter.ts # Data transformation layer
├── adapters/
│   └── SwimmingDataAdapter.ts          # Extensible data adapter
├── components/
│   └── charts/
│       └── PerformanceChart.tsx        # Chart visualization component
└── types.ts                           # Core performance types
```

## Features

### 1. Performance Dashboard (PerformanceScreen)

**Modern UI Components:**
- **Academy SegmentedControl**: Times/Stroke toggle with custom rounded selection indicator
- **Compact Pool Size Filter**: Pill-shaped buttons with user location indicator
- **Stroke Filter**: Full-rounded pill buttons with multi-select capability
- **Performance Cards**: Consistent card design with Academy theming

**Key Functionality:**
- **View Mode Toggle**: Switch between Times view and Stroke analysis
- **Pool Size Selection**: Filter by different pool configurations (17m, 25m, 50m)
- **Stroke Filtering**: Multi-select stroke types (freestyle, breaststroke, etc.)
- **Performance Cards**: Display current times, personal bests, and improvement metrics
- **Navigation**: Direct access to detailed event progression

### 2. Event Detail Screen (SwimmingEventDetailScreen)

**Comprehensive Performance Analysis:**
- **Best Time Display**: Large, prominent time with achievement date
- **Club Record Integration**: Shows club records with visual indicators
- **Performance Charts**: Time progression with goal lines and trend analysis
- **Goals & Targets**: Achievement tracking with completion status
- **Time History**: Complete race history with personal best badges
- **Statistics**: Race count, averages, improvement metrics, consistency scores

**Modern Design Elements:**
- **Overlapping Profile Cards**: Large time display with visual hierarchy
- **Interactive Charts**: Tap-to-explore data points with contextual information
- **Achievement Badges**: Visual indicators for personal bests and goals
- **Smooth Animations**: Staggered entrance animations using React Native Reanimated

### 3. Data Architecture

**Swimming-Specific Types:**
```typescript
interface SwimmingEventCard {
  id: string;
  title: string;              // e.g., "50m Freestyle"
  distance: number;
  stroke: SwimmingStroke;
  poolSize: PoolSize;
  currentTime: string;
  personalBest: string;
  improvement: ImprovementMetric;
  totalRaces: number;
  lastRaceDate: string;
  trend: 'improving' | 'stable' | 'declining';
}
```

**Extensible Adapter Pattern:**
- **SwimmingDataAdapter**: Transforms raw data into swimming-specific formats
- **Future Adapters**: BasketballDataAdapter, FootballDataAdapter, etc.
- **Common Interface**: Consistent data transformation patterns across programs

## Technical Implementation

### Theme Integration

**Academy Design System:**
- **Colors**: `theme.colors.interactive.primary` (Academy purple #4F2EC9)
- **Spacing**: Consistent `theme.spacing.md` horizontal padding, `theme.spacing.sm` gaps
- **Typography**: Academy font hierarchy with proper weights
- **Elevation**: Consistent card shadows using `theme.elevation.sm`

**Component Styling:**
```typescript
// Modern card design
eventCard: {
  backgroundColor: theme.colors.background.primary,
  borderRadius: theme.borderRadius.xl,     // Rounded corners
  padding: theme.spacing.md,               // Consistent padding
  borderWidth: theme.borderWidth.sm,
  borderColor: theme.colors.border.primary,
  ...theme.elevation.sm,                   // Academy elevation
}

// Pill-shaped filters
strokeFilterButton: {
  borderRadius: theme.borderRadius.full,   // Perfect pill shape
  paddingVertical: theme.spacing.sm,
  paddingHorizontal: theme.spacing.lg,
  minHeight: 36,                          // Consistent with segmented control
}
```

### Navigation Flow

**Primary Navigation:**
1. **Menu** → **Performance** (Main dashboard)
2. **Performance** → **Times/Stroke Selection** (Segmented control)
3. **Performance Card** → **Event Detail** (Detailed progression)

**Navigation Stack:**
```typescript
type PerformanceStackParamList = {
  Performance: undefined;
  SwimmingEventDetail: { eventId: string };
};
```

### State Management

**Performance State:**
```typescript
const [viewMode, setViewMode] = useState<PerformanceViewMode>('times');
const [selectedPoolSize, setSelectedPoolSize] = useState<PoolSize>('17m');
const [selectedStrokes, setSelectedStrokes] = useState<SwimmingStroke[]>(['freestyle']);
const [eventCards, setEventCards] = useState<SwimmingEventCard[]>([]);
const [strokeCards, setStrokeCards] = useState<SwimmingStrokeCard[]>([]);
```

### Animations

**React Native Reanimated Integration:**
- **Entrance Animations**: `FadeInDown`, `FadeInRight` with staggered delays
- **Interactive Feedback**: Scale transforms and opacity changes on press
- **Smooth Transitions**: Springify animations for natural feel

## Filter System

### Segmented Control
- **Component**: Academy `SegmentedControl` with `compact` variant
- **Size**: `sm` size with custom height (36px) to match other filters
- **Styling**: Custom `selectedOptionStyle` with `borderRadius.lg` for rounded selection indicator

### Pool Size Filter
- **Design**: Compact pill-shaped buttons with user location indicator
- **Spacing**: `theme.spacing.md` horizontal padding and gaps
- **Indicator**: Green dot for user's location pool

### Stroke Filter
- **Design**: Full-rounded pill buttons (`borderRadius.full`)
- **Functionality**: Multi-select with minimum one stroke required
- **Styling**: Academy theming with active/inactive states

## Multi-Program Extensibility

### Adapter Pattern
The system uses the adapter pattern for easy extension to other programs:

```typescript
interface PerformanceDataAdapter<TEventCard, TEventDetail, TStats> {
  transformEventCard(rawData: any): TEventCard;
  transformEventDetail(rawData: any): TEventDetail;
  transformStats(rawData: any): TStats;
  filterByPeriod(data: any[], period: string): any[];
  generateChartData(rawData: any[]): any;
}
```

### Future Program Support
- **Basketball**: Shot accuracy, game stats, skill assessments
- **Football**: Speed times, skill drills, match performance
- **Music**: Practice sessions, recital performance, technique assessments
- **Coding**: Project completions, skill certifications, algorithm challenges

## Performance Optimizations

### Data Loading
- **Lazy Loading**: Components load data on mount with loading states
- **Filtering**: Client-side filtering with efficient algorithms
- **Caching**: Data adapter includes transformation caching

### UI Performance
- **Virtualization**: Ready for large data sets with FlatList integration
- **Memoization**: Components optimized with React.memo where appropriate
- **Smooth Animations**: Hardware-accelerated animations with Reanimated

## Testing Strategy

### Unit Tests
- Data adapter transformation functions
- Filter logic and state management
- Chart data generation

### Integration Tests
- Navigation between screens
- Filter interactions and state updates
- Chart interactions and data visualization

### E2E Tests
- Complete user flows from dashboard to detail screens
- Multi-filter combinations
- Performance card interactions

## Future Enhancements

### Short Term
- **Advanced Filtering**: Date range, competition type, venue filters
- **Comparison Mode**: Side-by-side event comparisons
- **Export Functionality**: PDF reports, data export

### Medium Term
- **Social Features**: Performance sharing, team leaderboards
- **Goal Setting**: Advanced goal creation and tracking
- **Analytics Dashboard**: Advanced statistical analysis

### Long Term
- **Machine Learning**: Performance prediction and recommendations
- **Video Analysis**: Technique analysis with video integration
- **Coaching Tools**: Advanced coaching insights and recommendations

## Related Documentation

- [Theme System](../THEME_SYSTEM.md) - Academy design system
- [Component Library](../components/README.md) - Shared components
- [Navigation Architecture](../architecture/NAVIGATION.md) - App navigation patterns
- [Multi-Program Context](../architecture/MULTI_PROGRAM_CONTEXT.md) - Program switching system