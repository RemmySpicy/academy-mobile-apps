# Chip Component

The **Chip** component is a unified, comprehensive solution that consolidates the former FilterChip and PillTabs components into a single powerful interface element. It supports both single chip usage and multi-chip collections with extensive customization options.

## Features

### 🎯 Unified Design
- **Single API** for both individual chips and chip collections
- **5 visual variants**: default, primary, filled, outlined, ghost
- **4 size options**: xs, sm, md, lg
- **3 count styles**: badge, inline, separate

### 🎨 Visual Customization
- **Icons** with Ionicons support
- **Status dots** with custom colors
- **Count badges** with improved styling and opacity backgrounds
- **Custom colors** for brand-specific needs
- **Responsive sizing** for tablets and mobile

### 🔧 Behavior Options
- **Single or multi-select** modes
- **Horizontal scrolling** for large chip collections
- **Min/max selection** limits for multi-select
- **Disabled states** with proper accessibility
- **Interactive feedback** with press animations

## Usage

### Single Chip

```tsx
import { Chip } from '@academy/mobile-shared';

// Basic chip
<Chip
  label="Swimming"
  value="swimming"
  selected={true}
  onPress={(value) => console.log('Selected:', value)}
/>

// Chip with count and icon
<Chip
  label="Advanced"
  value="advanced"
  selected={false}
  count={12}
  icon="star"
  variant="primary"
  size="md"
  onPress={(value) => setSelectedLevel(value)}
/>

// Chip with custom styling
<Chip
  label="Custom"
  value="custom"
  selected={true}
  customColor="#ff6b6b"
  showDot={true}
  dotColor="#51cf66"
  onPress={(value) => handleSelection(value)}
/>
```

### Multi-Chip Collection

```tsx
import { Chip } from '@academy/mobile-shared';

const skillLevels = [
  { value: 'beginner', label: 'Beginner', count: 15, icon: 'star-outline' },
  { value: 'intermediate', label: 'Intermediate', count: 8, icon: 'star-half' },
  { value: 'advanced', label: 'Advanced', count: 3, icon: 'star' },
];

// Multi-select chip collection
<Chip
  chips={skillLevels}
  activeChips={selectedLevels}
  onChipChange={setSelectedLevels}
  variant="outlined"
  multiSelect={true}
  showIcons={true}
  showCounts={true}
  scrollable={true}
/>

// Single-select chip collection
<Chip
  chips={['All', 'Active', 'Completed', 'Cancelled']}
  activeChips={currentFilter}
  onChipChange={setCurrentFilter}
  variant="default"
  multiSelect={false}
/>
```

## API Reference

### ChipProps

#### Single Chip Mode
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Display text for the chip |
| `value` | `string` | - | Unique identifier |
| `selected` | `boolean` | `false` | Whether chip is selected |
| `count` | `number \| string` | - | Optional count to display |
| `icon` | `keyof Ionicons.glyphMap \| ReactNode` | - | Optional icon |
| `onPress` | `(value: string) => void` | - | Selection callback |

#### Multi-Chip Mode
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `chips` | `ChipItem[] \| string[]` | - | Array of chip configurations |
| `activeChips` | `string \| string[]` | - | Currently selected chip(s) |
| `onChipChange` | `(value: string \| string[]) => void` | - | Selection callback |
| `multiSelect` | `boolean` | `false` | Allow multiple selections |
| `minSelections` | `number` | `0` | Minimum required selections |
| `maxSelections` | `number` | - | Maximum allowed selections |

#### Visual Options
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `ChipVariant` | `'default'` | Visual style variant |
| `size` | `ChipSize` | `'md'` | Size variant |
| `countStyle` | `ChipCountStyle` | `'badge'` | Count display style |
| `showIcons` | `boolean` | `true` | Whether to show icons |
| `showCounts` | `boolean` | `true` | Whether to show counts |
| `showDot` | `boolean` | `false` | Show status dot |
| `dotColor` | `string` | - | Custom dot color |
| `customColor` | `string` | - | Custom brand color |

#### Layout & Behavior
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `disabled` | `boolean` | `false` | Disable interaction |
| `scrollable` | `boolean` | `true` | Enable horizontal scrolling |
| `gap` | `number` | `theme.spacing.xs` | Space between chips |

### Types

```tsx
type ChipVariant = 'default' | 'primary' | 'filled' | 'outlined' | 'ghost';
type ChipSize = 'xs' | 'sm' | 'md' | 'lg';
type ChipCountStyle = 'badge' | 'inline' | 'separate';

interface ChipItem {
  value: string;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap | React.ReactNode;
  count?: number | string;
  disabled?: boolean;
  customColor?: string;
  showDot?: boolean;
  dotColor?: string;
}
```

## Variants

### Visual Variants

| Variant | Selected State | Unselected State | Use Case |
|---------|---------------|------------------|----------|
| `default` | Academy purple background with opacity | Light background | General purpose filters |
| `primary` | Academy purple background | Light background | Important selections |
| `filled` | Academy purple background | Darker background | Grouped filters |
| `outlined` | Transparent with purple border | Transparent with light border | Minimal design |
| `ghost` | Purple background with opacity | Transparent | Subtle interactions |

### Size Variants

| Size | Height | Padding | Font Size | Use Case |
|------|--------|---------|-----------|----------|
| `xs` | 24-28px | 8px/4px | Caption | Compact filters |
| `sm` | 28-32px | 8px/4px | Small | Dense layouts |
| `md` | 32-36px | 16px/8px | Small | Standard (default) |
| `lg` | 40-44px | 24px/16px | Body | Prominent actions |

### Count Styles

| Style | Appearance | Use Case |
|-------|------------|----------|
| `badge` | Rounded background with contrast text | Filter counts, notification badges |
| `inline` | Bold colored text next to label | Simple counters |
| `separate` | Muted text after label | Additional info |

## Design Guidelines

### When to Use
- **Filter interfaces** with single or multiple selections
- **Tag systems** for categorization
- **Quick action buttons** with status indicators
- **Navigation tabs** with count badges
- **Status indicators** with visual feedback

### Best Practices
- Use **meaningful labels** that clearly describe the option
- Include **count badges** for filter chips to show result quantities
- Implement **proper spacing** between chips for touch targets
- Provide **visual feedback** for selected states
- Consider **keyboard navigation** for accessibility
- Use **icons consistently** across related chip groups

### Accessibility
- Chips include proper `accessibilityRole` and `accessibilityState`
- Count information is included in accessibility labels
- Disabled states are properly announced to screen readers
- Touch targets meet minimum 44pt requirements
- Focus indicators are visible for keyboard navigation

## Migration from FilterChip/PillTabs

### FilterChip → Chip
```tsx
// Old FilterChip usage
<FilterChip
  label="Swimming"
  value="swimming"
  selected={true}
  count={12}
  variant="primary"
  onPress={handlePress}
/>

// New Chip usage (same API!)
<Chip
  label="Swimming"
  value="swimming"
  selected={true}
  count={12}
  variant="primary"
  onPress={handlePress}
/>
```

### PillTabs → Chip
```tsx
// Old PillTabs usage
<PillTabs
  tabs={tabOptions}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  variant="outlined"
  multiSelect={true}
/>

// New Chip usage
<Chip
  chips={tabOptions}
  activeChips={activeTab}
  onChipChange={setActiveTab}
  variant="outlined"
  multiSelect={true}
/>
```

## Examples in Academy Apps

### Student Level Filters
```tsx
<Chip
  chips={[
    { value: 'beginner', label: 'Beginner', count: 15, icon: 'star-outline' },
    { value: 'intermediate', label: 'Intermediate', count: 8, icon: 'star-half' },
    { value: 'advanced', label: 'Advanced', count: 3, icon: 'star' }
  ]}
  activeChips={selectedLevels}
  onChipChange={setSelectedLevels}
  variant="primary"
  multiSelect={true}
  size="md"
/>
```

### Program Type Selection
```tsx
<Chip
  chips={['Swimming', 'Football', 'Basketball', 'Music', 'Coding']}
  activeChips={currentProgram}
  onChipChange={setCurrentProgram}
  variant="filled"
  multiSelect={false}
  size="lg"
/>
```

### Status Indicators
```tsx
<Chip
  label="Active"
  value="active"
  selected={true}
  showDot={true}
  dotColor="#51cf66"
  variant="ghost"
  size="sm"
/>
```

The unified Chip component provides a powerful, flexible solution for all chip-based interactions while maintaining the Academy design system's consistency and accessibility standards.