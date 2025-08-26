import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

export interface QuickFilterItem {
  label: string;
  count: string | number;
}

export interface QuickFilterProps {
  filterName?: string;
  quickFilter: QuickFilterItem[];
  onFilterPress?: (item: QuickFilterItem, index: number) => void;
  selectedIndex?: number;
  horizontal?: boolean;
  showsHorizontalScrollIndicator?: boolean;
}

export const QuickFilter: React.FC<QuickFilterProps> = ({
  filterName,
  quickFilter,
  onFilterPress,
  selectedIndex = 0,
  horizontal = true,
  showsHorizontalScrollIndicator = false,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleFilterPress = (item: QuickFilterItem, index: number) => {
    onFilterPress?.(item, index);
  };

  return (
    <View style={styles.container}>
      {filterName && (
        <Text style={styles.filterName}>{filterName}</Text>
      )}

      <ScrollView
        horizontal={horizontal}
        showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {quickFilter.map((item, index) => {
          const isSelected = index === selectedIndex;
          
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.filterChip,
                isSelected && styles.filterChipSelected,
              ]}
              onPress={() => handleFilterPress(item, index)}
              accessibilityRole="button"
              accessibilityLabel={`Filter by ${item.label}, ${item.count} items`}
              accessibilityState={{ selected: isSelected }}
            >
              <Text style={[styles.filterLabel, isSelected && styles.filterLabelSelected]}>
                {item.label}
              </Text>
              <Text style={[styles.filterCount, isSelected && styles.filterCountSelected]}>
                {item.count}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    marginTop: theme.spacing.md,
  },
  filterName: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  scrollView: {
    marginTop: theme.spacing.xs,
  },
  scrollContent: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.xs,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs / 2,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    backgroundColor: 'transparent',
    marginRight: theme.spacing.sm,
    minHeight: 28,
  },
  filterChipSelected: {
    backgroundColor: theme.colors.interactive.faded,
    borderColor: theme.colors.interactive.primary,
  },
  filterLabel: {
    fontSize: theme.fontSizes.caption,
    color: theme.colors.text.secondary,
    marginRight: theme.spacing.xs / 2,
  },
  filterLabelSelected: {
    color: theme.colors.text.primary,
  },
  filterCount: {
    fontSize: theme.fontSizes.caption,
    color: theme.colors.interactive.primary,
    fontWeight: theme.fontConfig.fontWeight.bold,
  },
  filterCountSelected: {
    color: theme.colors.interactive.primary,
  },
});

export default QuickFilter;