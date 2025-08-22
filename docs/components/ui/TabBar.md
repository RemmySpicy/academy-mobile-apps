# TabBar Component

The **TabBar** component is a unified, comprehensive solution that consolidates the former FixedTabBar and TimesTab components into a single powerful horizontal tab interface. It supports both fixed equal-width tabs and scrollable tabs with extensive customization options.

## Features

### 🎯 Unified Design
- **Single API** for both fixed and scrollable tab layouts
- **5 visual variants**: default, underline, pills, cards, minimal
- **3 size options**: sm, md, lg
- **2 layout modes**: fixed (equal-width) and scrollable

### 🎨 Visual Customization
- **Icons** with flexible positioning (left, right, top, bottom)
- **Badge counts** with proper sizing and styling
- **Empty states** with customizable messages
- **Custom colors** for brand-specific needs
- **Responsive sizing** for tablets and mobile

### 🔧 Layout Options
- **Fixed mode**: Equal-width tabs for 2-5 options
- **Scrollable mode**: Horizontal scrolling for many tabs
- **Auto-detection**: Automatically switches to scrollable when too many tabs
- **Equal spacing**: Option for evenly distributed tabs
- **Custom gap**: Configurable spacing between tabs

## Usage

### Basic Fixed Tabs

```tsx
import { TabBar } from '@academy/mobile-shared';

// Simple string tabs
<TabBar
  tabs={['All', 'Active', 'Completed', 'Cancelled']}
  activeTab="Active"
  onTabChange={setActiveTab}
  mode="fixed"
  variant="default"
/>

// Tabs with icons and badges
<TabBar
  tabs={[
    { value: 'overview', label: 'Overview', icon: 'analytics' },
    { value: 'students', label: 'Students', icon: 'people', badge: 24 },
    { value: 'classes', label: 'Classes', icon: 'school', badge: 8 }
  ]}
  activeTab="students"
  onTabChange={setActiveTab}
  mode="fixed"
  variant="underline"
  showIcons={true}
  showBadges={true}
/>
```

### Scrollable Tabs

```tsx
import { TabBar } from '@academy/mobile-shared';

// Many tabs with automatic scrolling
<TabBar
  tabs={[
    { value: 'all', label: 'All Programs', badge: 156 },
    { value: 'swimming', label: 'Swimming', badge: 45 },
    { value: 'football', label: 'Football', badge: 32 },
    { value: 'basketball', label: 'Basketball', badge: 28 },
    { value: 'music', label: 'Music', badge: 21 },
    { value: 'coding', label: 'Coding', badge: 18 },
    { value: 'art', label: 'Art', badge: 12 }
  ]}
  activeTab="swimming"
  onTabChange={setActiveTab}
  mode="scrollable"
  variant="pills"
  showBadges={true}
/>

// Time period selection (TimesTab replacement)
<TabBar
  tabs={[
    { value: 'week', label: 'This Week', icon: 'calendar', badge: 7 },
    { value: 'month', label: 'This Month', icon: 'calendar-outline', badge: 30 },
    { value: 'year', label: 'This Year', icon: 'calendar-sharp', badge: 365 },
  ]}
  activeTab="week"
  onTabChange={setTimePeriod}
  mode="scrollable"
  variant="default"
  showIcons={true}
  showBadges={true}
  iconPosition="left"
/>
```

## API Reference

### TabBarProps

#### Core Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tabs` | `Tab[] \| string[]` | - | Array of tab configurations |
| `activeTab` | `string` | - | Currently selected tab value |
| `onTabChange` | `(value: string) => void` | - | Selection callback |

#### Layout & Mode
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `TabBarMode` | `'fixed'` | Layout mode: fixed or scrollable |
| `variant` | `TabBarVariant` | `'default'` | Visual style variant |
| `size` | `TabBarSize` | `'md'` | Size variant |
| `maxFixedTabs` | `number` | `5` | Max tabs before auto-scrollable |

#### Display Options
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showIcons` | `boolean` | `true` | Whether to show icons |
| `showBadges` | `boolean` | `true` | Whether to show badge counts |
| `iconPosition` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'left'` | Icon position relative to text |

#### Layout Control
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `equalWidth` | `boolean` | `true` | Equal width tabs (fixed mode only) |
| `equalSpacing` | `boolean` | `false` | Equal spacing between tabs |
| `tabSpacing` | `number` | `theme.spacing.xs` | Custom gap between tabs |

#### Empty State
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showEmptyState` | `boolean` | `false` | Show empty state when no tabs |
| `emptyStateProps` | `object` | - | Custom empty state configuration |

#### Scroll Options (Scrollable Mode)
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showsHorizontalScrollIndicator` | `boolean` | `false` | Show scroll indicator |
| `bounces` | `boolean` | `false` | Bounce at scroll edges |

### Types

```tsx
type TabBarMode = 'fixed' | 'scrollable';
type TabBarVariant = 'default' | 'underline' | 'pills' | 'cards' | 'minimal';
type TabBarSize = 'sm' | 'md' | 'lg';

interface Tab {
  id?: string;
  value: string;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  badge?: number;
  disabled?: boolean;
  color?: string;
  accessibilityLabel?: string;
}
```

## Variants

### Visual Variants

| Variant | Appearance | Use Case |
|---------|------------|----------|
| `default` | Light background on selection | General purpose tabs |
| `underline` | Bottom border indicator | Clean navigation style |
| `pills` | Rounded pill-shaped tabs | Modern filter interface |
| `cards` | Card-style with borders | Distinct section headers |
| `minimal` | Transparent, text-only | Subtle navigation |

### Layout Modes

| Mode | Behavior | Best For |
|------|----------|----------|
| `fixed` | Equal-width, non-scrolling | 2-5 tabs, section headers |
| `scrollable` | Horizontal scrolling | Many tabs, time periods |

### Size Variants

| Size | Height | Padding | Font Size | Use Case |
|------|--------|---------|-----------|----------|
| `sm` | 36px | 8px/4px | Small | Compact interfaces |
| `md` | 44px | 16px/8px | Small | Standard (default) |
| `lg` | 52px | 24px/16px | Body | Prominent navigation |

## Advanced Usage

### Icon Positioning

```tsx
// Icons on top for vertical layout
<TabBar
  tabs={[
    { value: 'stats', label: 'Stats', icon: 'stats-chart' },
    { value: 'goals', label: 'Goals', icon: 'flag' }
  ]}
  activeTab="stats"
  onTabChange={setTab}
  iconPosition="top"
  variant="default"
/>

// Icons on right for right-to-left feel
<TabBar
  tabs={[
    { value: 'inbox', label: 'Inbox', icon: 'mail', badge: 5 },
    { value: 'sent', label: 'Sent', icon: 'paper-plane' }
  ]}
  activeTab="inbox"
  onTabChange={setTab}
  iconPosition="right"
  variant="underline"
/>
```

### Custom Spacing and Layout

```tsx
// Custom spacing between tabs
<TabBar
  tabs={sectionTabs}
  activeTab={currentSection}
  onTabChange={setCurrentSection}
  tabSpacing={20}
  equalSpacing={true}
  variant="minimal"
/>

// Force scrollable with custom settings
<TabBar
  tabs={categories}
  activeTab={selectedCategory}
  onTabChange={setSelectedCategory}
  mode="scrollable"
  showsHorizontalScrollIndicator={true}
  bounces={true}
/>
```

### Empty State Handling

```tsx
<TabBar
  tabs={dynamicTabs}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  showEmptyState={true}
  emptyStateProps={{
    title: "No categories available",
    description: "Add some categories to get started",
    iconName: "albums-outline"
  }}
/>
```

## Migration from Legacy Components

### FixedTabBar → TabBar
```tsx
// Old FixedTabBar usage
<FixedTabBar
  tabs={tabOptions}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  variant="underline"
  showIcons={true}
  showBadges={true}
/>

// New TabBar usage (same API!)
<TabBar
  tabs={tabOptions}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  mode="fixed"  // Add this for fixed behavior
  variant="underline"
  showIcons={true}
  showBadges={true}
/>
```

### TimesTab → TabBar
```tsx
// Old TimesTab usage
<TimesTab
  tabs={[
    { id: 'week', label: 'This Week', icon: 'calendar', badge: 7 },
    { id: 'month', label: 'This Month', icon: 'calendar-outline', badge: 30 }
  ]}
  activeTab="week"
  onTabChange={setTimePeriod}
  showIcons={true}
  showBadges={true}
  iconPosition="left"
/>

// New TabBar usage
<TabBar
  tabs={[
    { value: 'week', label: 'This Week', icon: 'calendar', badge: 7 },  // id → value
    { value: 'month', label: 'This Month', icon: 'calendar-outline', badge: 30 }
  ]}
  activeTab="week"
  onTabChange={setTimePeriod}
  mode="scrollable"  // Add this for scrollable behavior
  showIcons={true}
  showBadges={true}
  iconPosition="left"
/>
```

## Design Guidelines

### When to Use
- **Section navigation** within a screen
- **Category filtering** with clear groupings
- **Time period selection** for analytics
- **Status-based views** (All, Active, Completed)
- **Program/subject switching** in educational apps

### Mode Selection
- **Use fixed mode** for:
  - 2-5 tabs that should all be visible
  - Section headers that don't change often
  - Equal importance tabs

- **Use scrollable mode** for:
  - 6+ tabs or dynamic tab lists
  - Time periods (Week, Month, Year, etc.)
  - Category lists that may grow
  - Tags or filters

### Best Practices
- **Limit fixed tabs** to 5 or fewer for usability
- **Use consistent labeling** across similar interfaces
- **Include badge counts** for filters to show result quantities
- **Position icons consistently** within the same interface
- **Consider empty states** for dynamic tab lists
- **Test touch targets** ensure minimum 44pt height

### Accessibility
- TabBar includes proper `accessibilityRole="tablist"` and `accessibilityRole="tab"`
- Badge information is included in accessibility labels
- Disabled states are properly announced to screen readers
- Touch targets meet minimum accessibility requirements
- Focus indicators are visible for keyboard navigation

## Examples in Academy Apps

### Program Selection
```tsx
<TabBar
  tabs={[
    { value: 'all', label: 'All Programs', badge: 156 },
    { value: 'swimming', label: 'Swimming', badge: 45 },
    { value: 'football', label: 'Football', badge: 32 },
    { value: 'basketball', label: 'Basketball', badge: 28 }
  ]}
  activeTab={selectedProgram}
  onTabChange={setSelectedProgram}
  mode="scrollable"
  variant="pills"
  showBadges={true}
/>
```

### Student Status Filters
```tsx
<TabBar
  tabs={[
    { value: 'all', label: 'All', badge: 156 },
    { value: 'active', label: 'Active', badge: 134 },
    { value: 'inactive', label: 'Inactive', badge: 22 }
  ]}
  activeTab={statusFilter}
  onTabChange={setStatusFilter}
  mode="fixed"
  variant="underline"
  showBadges={true}
/>
```

### Performance Analytics Periods
```tsx
<TabBar
  tabs={[
    { value: 'week', label: 'Week', icon: 'calendar' },
    { value: 'month', label: 'Month', icon: 'calendar-outline' },
    { value: 'semester', label: 'Semester', icon: 'calendar-sharp' },
    { value: 'year', label: 'Year', icon: 'calendar-clear' }
  ]}
  activeTab={analyticsperiod}
  onTabChange={setAnalyticsPeriod}
  mode="fixed"
  variant="cards"
  showIcons={true}
  iconPosition="top"
  size="lg"
/>
```

## Remaining Tab Components

After consolidation, the Academy Apps tab system includes:

1. **TabBar** (this component) - General horizontal tabs
2. **SegmentedControl** - iOS-style animated selector
3. **IconTabBar** - Navigation-focused with complex badge positioning  
4. **StrokeTab** - Swimming-specific performance tabs

The TabBar component now handles all general horizontal tab needs while maintaining specialized components for specific use cases.

---

The unified TabBar component provides a comprehensive, accessible solution for horizontal tab navigation while preserving the Academy design system's consistency and the specific behaviors that made FixedTabBar and TimesTab useful.