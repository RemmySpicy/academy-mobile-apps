/**
 * QuickFilterBar Component
 * 
 * Horizontal scrollable filter bar with filter chips.
 * Part of the unified search system.
 */

import React from 'react';
import { View, ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { Chip, ChipProps } from '../ui/Chip';
import { useTheme } from '../../theme';

export interface FilterItem extends Omit<ChipProps, 'onPress' | 'selected'> {
  /** Unique identifier for the filter */
  id: string;
  /** Filter label */
  label: string;
  /** Filter value */
  value: string;
  /** Optional count */
  count?: number;
  /** Optional icon */
  icon?: ChipProps['icon'];
  /** Custom variant */
  variant?: ChipProps['variant'];
  /** Disabled state */
  disabled?: boolean;
}

export interface QuickFilterBarProps {
  /** Array of filter items */
  filters: FilterItem[];
  /** Selected filter values */
  selectedFilters?: string[];
  /** Callback when filter selection changes */
  onFilterChange?: (selectedValues: string[]) => void;
  /** Enable multiple selection */
  multiSelect?: boolean;
  /** Show filter count in label */
  showCount?: boolean;
  /** Custom container styles */
  style?: ViewStyle;
  /** Custom scroll container styles */
  scrollStyle?: ViewStyle;
  /** Test ID for testing */
  testID?: string;
  /** Horizontal padding for the scroll view */
  contentPadding?: number;
  /** Show horizontal scroll indicators */
  showsHorizontalScrollIndicator?: boolean;
}

export const QuickFilterBar: React.FC<QuickFilterBarProps> = ({
  filters,
  selectedFilters = [],
  onFilterChange,
  multiSelect = false,
  showCount = true,
  style,
  scrollStyle,
  testID = "quick-filter-bar",
  contentPadding,
  showsHorizontalScrollIndicator = false,
}) => {
  const { theme, screenDimensions } = useTheme();
  const styles = createStyles(theme, screenDimensions);

  const handleFilterPress = (value: string) => {
    if (!onFilterChange) return;

    let newSelection: string[];

    if (multiSelect) {
      // Multi-select: toggle the filter
      if (selectedFilters.includes(value)) {
        newSelection = selectedFilters.filter(filter => filter !== value);
      } else {
        newSelection = [...selectedFilters, value];
      }
    } else {
      // Single select: replace selection or clear if same
      newSelection = selectedFilters.includes(value) ? [] : [value];
    }

    onFilterChange(newSelection);
  };

  const padding = contentPadding !== undefined ? contentPadding : theme.spacing.md;

  return (
    <View 
      style={[styles.container, style]}
      testID={testID}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
        contentContainerStyle={[
          styles.scrollContent,
          { 
            paddingHorizontal: padding,
          },
          scrollStyle,
        ]}
        style={styles.scrollView}
        testID={`${testID}-scroll`}
      >
        {filters.map((filter, index) => {
          const isSelected = selectedFilters.includes(filter.value);
          
          return (
            <Chip
              key={filter.id}
              label={filter.label}
              value={filter.value}
              selected={isSelected}
              count={showCount ? filter.count : undefined}
              icon={filter.icon}
              variant={filter.variant || 'default'}
              disabled={filter.disabled}
              onPress={handleFilterPress}
              testID={`${testID}-chip-${filter.id}`}
              style={
                index === filters.length - 1 ? styles.lastChip : undefined
              }
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

/**
 * Hook for managing filter state
 */
export const useQuickFilters = (
  initialFilters: string[] = [],
  multiSelect: boolean = false
) => {
  const [selectedFilters, setSelectedFilters] = React.useState<string[]>(initialFilters);

  const handleFilterChange = React.useCallback((newFilters: string[]) => {
    setSelectedFilters(newFilters);
  }, []);

  const clearFilters = React.useCallback(() => {
    setSelectedFilters([]);
  }, []);

  const selectFilter = React.useCallback((value: string) => {
    if (multiSelect) {
      setSelectedFilters(prev => 
        prev.includes(value) 
          ? prev.filter(f => f !== value)
          : [...prev, value]
      );
    } else {
      setSelectedFilters([value]);
    }
  }, [multiSelect]);

  const isFilterSelected = React.useCallback((value: string) => {
    return selectedFilters.includes(value);
  }, [selectedFilters]);

  return {
    selectedFilters,
    handleFilterChange,
    clearFilters,
    selectFilter,
    isFilterSelected,
  };
};

const createStyles = (theme: any, screenDimensions: any) => {
  const isTablet = screenDimensions.isTablet;
  
  return StyleSheet.create({
    container: {
      marginVertical: theme.spacing.sm,
    },
    
    scrollView: {
      flexGrow: 0,
    },
    
    scrollContent: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: isTablet ? 50 : 40,
    },
    
    lastChip: {
      marginRight: 0,
    },
  });
};

export default QuickFilterBar;