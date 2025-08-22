# ControlCard Component

Enhanced management interface component with comprehensive control features including calendar integration, search functionality, filtering, and customizable actions.

## 🎯 Overview

The ControlCard is a feature-rich component designed for complex data management interfaces. It combines multiple interaction patterns into a single, cohesive component while maintaining flexibility through variant props and component injection.

## 📊 Key Features

- **Multiple Layouts**: Default, minimal, detailed, dashboard
- **Size Variants**: Compact, normal, expanded
- **Visual Variants**: Elevated, outlined, filled, ghost
- **Date Management**: Week/month calendar views with marked dates
- **Search & Filtering**: Built-in search with customizable filters
- **Action System**: Configurable action buttons with multiple variants
- **Loading States**: Built-in loading and error handling
- **Accessibility**: Full screen reader and keyboard navigation support

## 🚀 Basic Usage

```typescript
import React from 'react';
import { ControlCard } from '@academy/mobile-shared';

export default function BasicExample() {
  return (
    <ControlCard
      title="Academy Management"
      subtitle="Downtown Location"
      description="Manage student progress and scheduling"
      variant="elevated"
      size="normal"
      layout="default"
    />
  );
}
```

## 🎛️ Layout Variants

### Default Layout
```typescript
<ControlCard
  layout="default"
  title="Swimming Academy"
  dateRangeType="week"
  markedDates={['2024-12-20', '2024-12-22']}
  onDateSelect={(date) => console.log(date)}
/>
```

### Dashboard Layout
```typescript
<ControlCard
  layout="dashboard"
  title="Session Overview"
  actions={[
    { id: '1', label: 'New Session', onPress: () => {}, variant: 'primary' },
    { id: '2', label: 'Export', onPress: () => {}, variant: 'outline' }
  ]}
  queryFilter={[
    { id: '1', label: 'Today', num: '6', isActive: true },
    { id: '2', label: 'This Week', num: '42' }
  ]}
/>
```

### Minimal Layout
```typescript
<ControlCard
  layout="minimal"
  variant="ghost"
  title="Quick Access"
  actions={[
    { id: '1', label: 'Check In', onPress: () => {}, icon: 'log-in' }
  ]}
/>
```

## 📏 Size Variants

### Compact Size
```typescript
<ControlCard
  size="compact"
  variant="outlined"
  title="Quick Stats"
  queryFilter={[
    { id: '1', label: 'Active', num: '24', icon: 'checkmark-circle' }
  ]}
/>
```

### Expanded Size
```typescript
<ControlCard
  size="expanded"
  title="December Schedule"
  dateRangeType="month"
  showWeekdays={false}
/>
```

## 🎨 Visual Variants

### Elevated (Default)
```typescript
<ControlCard variant="elevated" title="Standard Card" />
```

### Outlined
```typescript
<ControlCard variant="outlined" title="Outlined Card" />
```

### Ghost
```typescript
<ControlCard variant="ghost" title="Transparent Card" />
```

## 📅 Calendar Integration

### Week View
```typescript
<ControlCard
  title="Weekly Schedule"
  dateRangeType="week"
  dateSchedule="December 18 - 22"
  dateSchedule2="This Week"
  markedDates={['2024-12-20', '2024-12-22']}
  onDateSelect={(date) => console.log('Selected:', date)}
  viewAll={() => console.log('View all dates')}
/>
```

### Month View
```typescript
<ControlCard
  title="Monthly Overview"
  dateRangeType="month"
  selectedDate="2024-12-15"
  markedDates={['2024-12-05', '2024-12-12', '2024-12-19']}
  highlightToday={true}
  minDate="2024-12-01"
  maxDate="2024-12-31"
/>
```

## 🔍 Search & Filtering

### Search Integration
```typescript
<ControlCard
  title="Student Management"
  searchEnabled={true}
  searchPlaceholder="Search students..."
  searchValue={searchValue}
  onSearchChange={setSearchValue}
  activeSearch={searchValue.length > 0}
/>
```

### Query Filters
```typescript
<ControlCard
  queryFilter={[
    { 
      id: '1', 
      label: 'Active', 
      num: '24', 
      icon: 'checkmark-circle',
      color: theme.colors.status.success,
      onPress: () => console.log('Active filter')
    },
    { 
      id: '2', 
      label: 'Pending', 
      num: '8', 
      icon: 'time',
      isActive: true
    }
  ]}
  onQueryFilterPress={(item) => console.log('Filter:', item)}
/>
```

### Quick Filters
```typescript
<ControlCard
  quickFilter={[
    { id: '1', label: 'Beginners', count: '12', icon: 'star-outline' },
    { id: '2', label: 'Advanced', count: '8', color: theme.colors.status.success }
  ]}
  filterName="Skill Level"
  onQuickFilterPress={(item) => console.log('Quick filter:', item)}
/>
```

## ⚡ Actions System

### Basic Actions
```typescript
<ControlCard
  actions={[
    { 
      id: '1', 
      label: 'New Session', 
      onPress: () => {}, 
      icon: 'add',
      variant: 'primary' 
    },
    { 
      id: '2', 
      label: 'Export', 
      onPress: () => {}, 
      icon: 'download-outline',
      variant: 'outline' 
    }
  ]}
/>
```

### Action Variants
```typescript
// Primary action (default)
{ id: '1', label: 'Save', variant: 'primary' }

// Secondary action
{ id: '2', label: 'Cancel', variant: 'secondary' }

// Outline action
{ id: '3', label: 'Export', variant: 'outline' }

// Ghost action
{ id: '4', label: 'More', variant: 'ghost' }
```

## 🔄 Loading & Error States

### Loading State
```typescript
<ControlCard
  loading={true}
  loadingText="Loading session data..."
/>
```

### Error State
```typescript
<ControlCard
  error="Failed to load session data. Please check your connection."
  onRetry={() => console.log('Retry pressed')}
/>
```

## 🧩 Custom Components

### Header & Footer
```typescript
<ControlCard
  title="Custom Integration"
  headerComponent={
    <View style={{ backgroundColor: theme.colors.interactive.primary, padding: 8 }}>
      <Text style={{ color: theme.colors.text.inverse }}>🏆 Premium Account</Text>
    </View>
  }
  footerComponent={
    <View style={{ marginTop: 16, padding: 12 }}>
      <Text>Last updated: {new Date().toLocaleTimeString()}</Text>
    </View>
  }
/>
```

### Custom Search & Filter
```typescript
<ControlCard
  searchComponent={
    <CustomSearchInput
      placeholder="Advanced search..."
      value={searchValue}
      onChangeText={setSearchValue}
    />
  }
  filterComponent={
    <CustomFilterPanel
      filters={filters}
      onFilterChange={handleFilterChange}
    />
  }
/>
```

## 📱 Responsive Design

The ControlCard automatically adapts to different screen sizes:

```typescript
// Compact for small screens
<ControlCard size="compact" />

// Normal for standard screens  
<ControlCard size="normal" />

// Expanded for large screens
<ControlCard size="expanded" />
```

## ♿ Accessibility Features

All ControlCard components include:

- **Screen Reader Support**: Proper accessibility labels
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Clear focus indicators
- **Touch Targets**: Minimum 44px touch areas

```typescript
<ControlCard
  accessibilityLabel="Academy management interface"
  accessibilityHint="Manage student sessions and schedules"
  // Components automatically include proper accessibility
/>
```

## 🎨 Theming Integration

ControlCard uses the Academy theme system:

```typescript
import { useTheme } from '@academy/mobile-shared';

function ThemedControlCard() {
  const { theme } = useTheme();
  
  return (
    <ControlCard
      title="Themed Card"
      // Automatically uses theme.colors.interactive.primary
      // and other Academy design tokens
    />
  );
}
```

## 🔧 Utility Functions

ControlCard includes extracted utility functions for reuse:

```typescript
import { 
  getDateRange, 
  formatDate, 
  getActionButtonStyles,
  getDayBoxStyles 
} from '@academy/mobile-shared';

// Use utilities in custom components
const weekDates = getDateRange('2024-12-15', 'week');
const formattedDate = formatDate('2024-12-15', 'DD/MM/YYYY');
const buttonStyles = getActionButtonStyles(theme, 'primary', false);
```

## 📋 Props Reference

### ControlCardProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Main title text |
| `subtitle` | `string` | - | Secondary title text |
| `description` | `string` | - | Description text (hidden in compact) |
| `size` | `'compact' \| 'normal' \| 'expanded'` | `'normal'` | Component size variant |
| `layout` | `'default' \| 'minimal' \| 'detailed' \| 'dashboard'` | `'default'` | Layout variant |
| `variant` | `'elevated' \| 'outlined' \| 'filled' \| 'ghost'` | `'elevated'` | Visual variant |
| `dateRangeType` | `'week' \| 'month' \| 'custom' \| 'none'` | `'week'` | Date range type |
| `searchEnabled` | `boolean` | `false` | Enable search functionality |
| `loading` | `boolean` | `false` | Show loading state |
| `error` | `string` | - | Error message to display |
| `actions` | `ActionButton[]` | - | Action buttons array |
| `queryFilter` | `QueryFilterItem[]` | - | Query filter items |
| `quickFilter` | `QuickFilterItem[]` | - | Quick filter items |

### ActionButton Interface

```typescript
interface ActionButton {
  id: string;
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  color?: string;
  disabled?: boolean;
}
```

### QueryFilterItem Interface

```typescript
interface QueryFilterItem {
  id: string;
  label: string;
  num: string;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
  isActive?: boolean;
}
```

## 🔗 Related Components

- **[FilterComponent](./FilterComponent.md)** - Advanced filtering
- **[SearchComponent](./SearchComponent.md)** - Search utilities  
- **[QuickFilter](./QuickFilter.md)** - Quick filter interface
- **[Calendar](../calendar/Calendar.md)** - Calendar components
- **[CustomButton](../forms/CustomButton.md)** - Action buttons

## 📚 Examples

See the **ExtractedComponentsShowcase** screen in the Academy apps for live examples of all ControlCard variants and features.

---

The ControlCard component provides a comprehensive foundation for building sophisticated data management interfaces while maintaining the Academy design system and accessibility standards.