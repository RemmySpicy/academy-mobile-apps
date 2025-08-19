# Chip System Standardization

This document outlines the standardized chip and badge system for the Academy Mobile Apps, consolidating the various chip-like elements found across the codebase into a consistent, unified approach.

## Overview

Previously, the Academy Apps had inconsistent chip implementations:
- Custom filter tabs in StudentsScreen
- Custom status badges in ClassroomScreen and AttendanceScreen  
- Multiple chip components (FilterChip, QuickFilter, FilterBar)
- Different styling patterns across screens

**Solution**: Two unified components that preserve unique design elements while ensuring consistency:
1. **Enhanced FilterChip** - For interactive filtering and selection
2. **New Badge Component** - For status indicators and labels

## Enhanced FilterChip Component

Location: `shared/src/components/search/FilterChip.tsx`

### Supported Patterns

#### 1. **Standard Filter Chips** (variant: 'default')
- Basic filtering interface
- Academy-themed selection states
- Supports icons and counts

```tsx
<FilterChip
  label="All Students"
  value="all"
  count={25}
  selected={true}
  variant="default"
/>
```

#### 2. **QuickFilter Pattern** (variant: 'quickFilter')
- Label + count side by side (preserving existing design)
- Academy faded background when selected
- Horizontal scrollable layout

```tsx
<FilterChip
  label="Excellent" 
  value="excellent"
  count={8}
  selected={true}
  variant="quickFilter"
  countStyle="inline"
/>
```

#### 3. **FilterBar Pattern** (variant: 'filterBar')  
- Advanced multi-group filtering
- Count badges with sophisticated styling
- Icon support with dynamic coloring

```tsx
<FilterChip
  label="Beginner"
  value="beginner" 
  count={12}
  selected={false}
  variant="filterBar"
  countStyle="badge"
  icon="water-outline"
/>
```

### Key Features

- **Multiple Variants**: default, primary, secondary, outline, badge, quickFilter, filterBar
- **Count Styles**: badge (FilterBar pattern), inline (QuickFilter pattern), separate
- **Size Options**: sm, md, lg
- **Icon Support**: Ionicons or custom React elements
- **Accessibility**: Full ARIA support and hit slop
- **Theme Integration**: Uses Academy purple (`theme.colors.interactive.primary`)

### Usage Guidelines

**Use FilterChip for:**
- ✅ Student filters (All, Excellent, Good, etc.)
- ✅ Program selection filters
- ✅ Any interactive selection interface
- ✅ Multi-select filtering systems

**Don't use FilterChip for:**
- ❌ Status indicators (use Badge instead)
- ❌ Action buttons (use Button component)
- ❌ Non-interactive labels

## Badge Component

Location: `shared/src/components/ui/Badge.tsx`

### Purpose
Dedicated component for read-only status indicators and labels.

### Variants

#### Status-Based Variants
- **success**: Completed states (green)
- **warning**: Pending states (amber)  
- **error**: Failed/error states (red)
- **info**: Active/information states (blue)
- **primary**: Academy purple theme
- **secondary**: Secondary theme
- **default**: Neutral gray

### Usage Examples

#### Class Status Indicators
```tsx
<Badge variant="success" size="sm" shape="pill">
  Completed
</Badge>

<Badge variant="warning" size="sm" shape="pill">
  Pending
</Badge>

<Badge variant="info" size="sm" shape="pill">
  Active Now
</Badge>
```

#### Features
- **Status Variants**: Semantic color coding for different states
- **Size Options**: xs, sm, md, lg
- **Shape Options**: rounded, pill, square
- **Icon Support**: Optional Ionicons
- **Dot Indicators**: Optional colored dots
- **Theme Integration**: Follows Academy design system

### Usage Guidelines

**Use Badge for:**
- ✅ Status indicators (Completed, Pending, Active)
- ✅ Category labels
- ✅ Notification counts
- ✅ Progress indicators
- ✅ Read-only information display

**Don't use Badge for:**
- ❌ Interactive filtering (use FilterChip)
- ❌ Action buttons (use Button component)  
- ❌ Navigation elements

## Implementation Results

### StudentsScreen Updates
- **Before**: Custom filter tab styling with inconsistent theming
- **After**: `FilterChip` with `variant="quickFilter"` and `countStyle="inline"`
- **Preserved**: Original label + count side-by-side layout
- **Improved**: Consistent Academy theming, proper accessibility

### ClassroomScreen Updates  
- **Before**: Custom status badge implementation
- **After**: `Badge` component with semantic variants
- **Preserved**: Visual hierarchy and color meanings
- **Improved**: Consistent sizing, proper semantic colors

### AttendanceScreen Updates
- **Before**: Custom completion status badges  
- **After**: `Badge` component with success/warning variants
- **Preserved**: Color-coded status meaning
- **Improved**: Standardized styling, better accessibility

## Design System Benefits

### Consistency
- ✅ Unified theming across all chip-like elements
- ✅ Consistent Academy purple brand usage
- ✅ Standardized spacing and typography

### Maintainability  
- ✅ Single source of truth for chip styling
- ✅ Easy to update designs across entire app
- ✅ Reduced code duplication

### Accessibility
- ✅ Built-in ARIA support
- ✅ Proper hit slop for touch interactions
- ✅ Semantic HTML roles and states

### Flexibility
- ✅ Supports all existing patterns
- ✅ Extensible for future needs
- ✅ Customizable while maintaining consistency

## Migration Guide

### For Existing Chip Usage

1. **Replace custom filter implementations**:
   ```tsx
   // Old
   <CustomFilterTab selected={true}>All Students (25)</CustomFilterTab>
   
   // New  
   <FilterChip
     label="All Students"
     count={25}
     selected={true}
     variant="quickFilter"
     countStyle="inline"
   />
   ```

2. **Replace custom status badges**:
   ```tsx
   // Old
   <View style={customStatusStyle}>
     <Text>Completed</Text>
   </View>
   
   // New
   <Badge variant="success" size="sm" shape="pill">
     Completed
   </Badge>
   ```

### Component Deprecation

- **QuickFilter** (`shared/src/components/controls/QuickFilter.tsx`)
  - Status: Deprecated 
  - Replacement: Use `FilterChip` with `variant="quickFilter"`
  - Migration: Update imports and props

## Future Considerations

### Planned Enhancements
- [ ] Animation support for state transitions
- [ ] Custom variant theming per program
- [ ] Advanced filtering with search integration
- [ ] Keyboard navigation support

### Performance Optimizations
- [ ] Memo optimization for large filter sets
- [ ] Virtualization for extensive chip lists
- [ ] Reduced re-render cycles

## Implementation Summary

This standardization effort successfully:
1. ✅ **Preserved unique design elements** from extracted components
2. ✅ **Unified styling** across the entire design system  
3. ✅ **Improved accessibility** and user experience
4. ✅ **Reduced code duplication** and maintenance overhead
5. ✅ **Enhanced consistency** with Academy branding

The result is a robust, flexible chip system that maintains the distinctive look of the Academy Apps while providing a solid foundation for future development.