# Academy Apps Tab System

A comprehensive tab system providing multiple components for different navigation and selection patterns throughout the Academy Mobile Apps.

## Overview

The Academy Apps tab system includes five specialized components designed to handle various user interface patterns:

1. **SegmentedControl** - iOS-style segmented control for 2-4 options
2. **IconTabBar** - Icon-focused navigation with badge support
3. **TabBar** - Unified horizontal tabs (replaces FixedTabBar + TimesTab)
4. **Chip** - Unified chip component (replaces PillTabs) with multi-select support
5. **StrokeTab** - Specialized swimming performance tabs

## Component Selection Guide

### When to Use Each Component

| Component | Use Case | Best For | Tab Count |
|-----------|----------|----------|-----------|
| **SegmentedControl** | Simple toggles between views | Settings, filters, view modes | 2-4 |
| **IconTabBar** | Navigation with visual icons | Bottom tabs, toolbars, quick actions | 3-6 |
| **TabBar** | Horizontal navigation | Section headers, time periods, categories | Any |
| **Chip** | Filters and multi-select | Tags, categories, quick filters | Any |
| **StrokeTab** | Swimming-specific data | Performance analytics with data cards | Any |

### Visual Comparison

```
SegmentedControl:  [Option 1] [Option 2] [Option 3]
IconTabBar:        🏠 📊 ⚙️ 👤 (with badges)
TabBar:            | Tab 1 | Tab 2 | Tab 3 | or scrollable →
Chip:              (Tag1) (Tag2) (Tag3) (Tag4)
StrokeTab:         [Free] [Back] [Breast] + Performance Cards
```

## Quick Start Examples

### SegmentedControl - View Mode Toggle

```tsx
import { SegmentedControl } from '@academy/mobile-shared';

const [viewMode, setViewMode] = useState('list');

<SegmentedControl
  options={[
    { value: 'list', label: 'List', icon: 'list' },
    { value: 'grid', label: 'Grid', icon: 'grid' },
  ]}
  selectedValue={viewMode}
  onChange={setViewMode}
  variant="primary"
  size="md"
/>
```

### IconTabBar - Navigation Tabs

```tsx
import { IconTabBar } from '@academy/mobile-shared';

<IconTabBar
  tabs={[
    { value: 'home', icon: 'home', label: 'Home' },
    { value: 'stats', icon: 'stats-chart', label: 'Stats', badge: { count: 3 } },
    { value: 'settings', icon: 'settings', label: 'Settings' },
  ]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  showLabels={true}
  showBadges={true}
/>
```

### TabBar - Horizontal Navigation

```tsx
import { TabBar } from '@academy/mobile-shared';

// Fixed mode for categories
<TabBar
  tabs={[
    { value: 'all', label: 'All', badge: 24 },
    { value: 'active', label: 'Active', badge: 12 },
    { value: 'completed', label: 'Completed', badge: 8 },
  ]}
  activeTab={categoryTab}
  onTabChange={setCategoryTab}
  mode="fixed"
  variant="underline"
  showBadges={true}
/>
```

### Chip - Multi-Select Filters

```tsx
import { Chip } from '@academy/mobile-shared';

<Chip
  chips={[
    { value: 'beginner', label: 'Beginner', count: 15 },
    { value: 'intermediate', label: 'Intermediate', count: 8 },
    { value: 'advanced', label: 'Advanced', count: 3 },
  ]}
  activeChips={selectedLevels}
  onChipChange={setSelectedLevels}
  multiSelect={true}
  variant="outlined"
  showCounts={true}
/>
```

// Scrollable mode for time periods
<TabBar
  tabs={[
    { value: 'week', label: 'This Week', icon: 'calendar', badge: 7 },
    { value: 'month', label: 'This Month', icon: 'calendar-outline', badge: 30 },
    { value: 'year', label: 'This Year', icon: 'calendar-sharp' },
  ]}
  activeTab={timePeriod}
  onTabChange={setTimePeriod}
  mode="scrollable"
  showIcons={true}
  showBadges={true}
/>
```

## Detailed Component Documentation

### [SegmentedControl](./SegmentedControl.md)
iOS-style segmented control with Academy theming and animation.

**Key Features:**
- Animated selection indicator
- 4 variants (default, primary, secondary, compact)
- 3 sizes (sm, md, lg)
- Icon support
- Accessibility compliant

**Best Practices:**
- Use for 2-4 mutually exclusive options
- Perfect for view mode toggles
- Ideal for settings and preferences

### [IconTabBar](./IconTabBar.md)
Icon-focused tab navigation with comprehensive badge system.

**Key Features:**
- Badge counts and dot indicators
- 4 badge positions
- 4 visual variants
- Icon-only or icon+label modes
- Equal spacing options

**Best Practices:**
- Use for primary navigation
- Limit to 3-6 tabs for best UX
- Always provide accessibility labels

### [TabBar](./TabBar.md)
Unified horizontal tab component (replaces FixedTabBar + TimesTab).

**Key Features:**
- Fixed and scrollable modes
- 5 visual variants (default, underline, pills, cards, minimal)
- Icon positioning (left, right, top, bottom)
- Badge support and empty states
- Auto-mode detection based on tab count

**Best Practices:**
- Use fixed mode for 2-5 tabs (section headers)
- Use scrollable mode for 6+ tabs (time periods)
- Include badges for filters to show counts

### [Chip](./Chip.md)
Unified chip component with single and multi-chip capabilities (replaces PillTabs).

**Key Features:**
- Single chip and multi-chip collection modes
- 5 visual variants (default, primary, filled, outlined, ghost)
- 4 size variants (xs, sm, md, lg)
- 3 count styles (badge, inline, separate)
- Icons, dots, and custom colors
- Selection limits (min/max)

**Best Practices:**
- Use for filters, tags, and selections
- Great for space-constrained interfaces
- Supports both single and multi-select modes

// Note: TimesTab functionality is now handled by TabBar in scrollable mode

### [StrokeTab](./StrokeTab.md) - Specialized
Swimming-specific component combining tabs with performance data.

**Key Features:**
- Performance card display
- Color-coded metrics
- Touch interactions
- Specialized for swimming data

**Best Practices:**
- Use specifically for swimming performance
- Can be adapted for other sport metrics
- Combines navigation with data display

## Common Patterns & Usage

### Navigation Patterns

#### Bottom Tab Navigation
```tsx
<IconTabBar
  tabs={bottomNavTabs}
  activeTab={currentRoute}
  onTabChange={navigateToRoute}
  variant="minimal"
  showLabels={true}
  equalSpacing={true}
/>
```

#### Top Tab Navigation  
```tsx
<TabBar
  tabs={sectionTabs}
  activeTab={currentSection}
  onTabChange={setCurrentSection}
  mode="fixed"
  variant="underline"
  size="md"
/>
```

### Filtering Patterns

#### Single Filter
```tsx
<SegmentedControl
  options={['All', 'Active', 'Completed']}
  selectedValue={statusFilter}
  onChange={setStatusFilter}
  variant="primary"
/>
```

#### Multi-Filter
```tsx
<Chip
  chips={filterOptions}
  activeChips={selectedFilters}
  onChipChange={setSelectedFilters}
  multiSelect={true}
  maxSelections={3}
/>
```

### Time/Period Selection
```tsx
<TabBar
  tabs={timePeriods}
  activeTab={selectedPeriod}
  onTabChange={setSelectedPeriod}
  mode="scrollable"
  showIcons={true}
  iconPosition="left"
/>
```

## Theme Integration

All tab components integrate seamlessly with the Academy theme system:

### Color Usage
```tsx
// Academy purple for active states
theme.colors.interactive.primary      // #4F2EC9

// Status colors for badges and indicators  
theme.colors.status.success          // Green
theme.colors.status.warning          // Orange
theme.colors.status.error            // Red

// Neutral colors for inactive states
theme.colors.text.secondary          // Secondary text
theme.colors.background.secondary    // Card backgrounds
```

### Responsive Design
- **Mobile**: Optimized touch targets (44px minimum)
- **Tablet**: Increased font sizes and spacing
- **Accessibility**: Full ARIA support and screen reader compatibility

## Performance Considerations

### Optimization Tips

1. **Use appropriate component for context**
   - Don't use scrollable tabs for 2-3 options
   - Avoid fixed tabs for 8+ options

2. **Minimize re-renders**
   - Memoize tab data when possible
   - Use stable keys for tab identification

3. **Lazy load tab content**
   - Only render active tab content for heavy components
   - Use conditional rendering for tab panels

4. **Badge updates**
   - Update badges efficiently to avoid unnecessary renders
   - Consider debouncing rapid badge count changes

## Accessibility Best Practices

All components include:
- **ARIA roles** (`tab`, `tablist`, `tabpanel`)
- **Keyboard navigation** (arrow keys, enter, space)
- **Screen reader support** (descriptive labels, state announcements)
- **Focus management** (clear focus indicators)
- **Touch targets** (minimum 44px height)

### Example Accessibility Implementation
```tsx
<FixedTabBar
  tabs={tabs}
  activeTab={activeTab}
  onTabChange={handleTabChange}
  accessibilityLabel="Section navigation"
  testID="section-tabs"
/>
```

## Migration Guide

### From Legacy Components

#### TabBar Migration (FixedTabBar + TimesTab)
```tsx
// Old FixedTabBar
<FixedTabBar
  tabs={tabOptions}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  variant="underline"
/>

// Old TimesTab  
<TimesTab
  tabs={[
    { id: 'week', label: 'Week', icon: 'calendar', badge: 7 },
    { id: 'month', label: 'Month', icon: 'calendar-outline', badge: 30 }
  ]}
  activeTab={period}
  onTabChange={setPeriod}
/>

// New unified TabBar
<TabBar
  tabs={[
    { value: 'week', label: 'Week', icon: 'calendar', badge: 7 },  // id → value
    { value: 'month', label: 'Month', icon: 'calendar-outline', badge: 30 }
  ]}
  activeTab={period}
  onTabChange={setPeriod}
  mode="scrollable"  // or "fixed" for FixedTabBar behavior
  showIcons={true}
  showBadges={true}
/>
```

#### Custom Tab Implementation
If you have custom tab implementations, consider replacing with appropriate components:

```tsx
// Custom implementation
const CustomTabs = ({ options, selected, onChange }) => (
  <View style={styles.container}>
    {options.map(option => (
      <Pressable
        key={option}
        style={[styles.tab, selected === option && styles.active]}
        onPress={() => onChange(option)}
      >
        <Text>{option}</Text>
      </Pressable>
    ))}
  </View>
);

// Replace with
<SegmentedControl
  options={options}
  selectedValue={selected}
  onChange={onChange}
  variant="primary"
  size="md"
/>
```

## Contributing

When adding new tab variants or features:

1. Follow existing naming conventions
2. Include comprehensive TypeScript interfaces
3. Implement full accessibility support
4. Add responsive design considerations
5. Include Academy theme integration
6. Provide usage examples in documentation
7. Add to the ExtractedComponentsShowcase

---

*Part of the Academy Mobile Apps component library. See individual component documentation for detailed APIs and examples.*