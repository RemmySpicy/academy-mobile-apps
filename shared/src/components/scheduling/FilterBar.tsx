import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

export interface FilterOption {
  id: string;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  active?: boolean;
}

export interface FilterBarProps {
  filters?: FilterOption[];
  onFilterPress?: (filterId: string) => void;
  label?: string;
  variant?: 'default' | 'compact';
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters = [],
  onFilterPress,
  label = 'Views',
  variant = 'default',
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme, variant);

  const getIconForFilter = (filter: FilterOption) => {
    if (filter.icon) return filter.icon;

    switch (filter.id) {
      case 'group':
        return 'people';
      case 'all':
        return 'eye';
      case 'search':
        return 'search';
      case 'calendar':
        return 'calendar';
      case 'list':
        return 'list';
      case 'today':
        return 'today';
      case 'week':
        return 'calendar-outline';
      case 'month':
        return 'calendar-number';
      default:
        return 'options';
    }
  };

  return (
    <View style={styles.container}>
      {variant === 'default' && (
        <Text style={styles.label}>{label}</Text>
      )}
      <View style={styles.filtersRow}>
        {filters.map((filter, index) => (
          <TouchableOpacity
            key={filter.id || index}
            style={[
              styles.filterButton,
              filter.active && styles.activeFilterButton,
              filter.id === 'search' && styles.searchButton,
            ]}
            onPress={() => onFilterPress?.(filter.id)}
          >
            <Ionicons
              name={getIconForFilter(filter)}
              size={variant === 'compact' ? 14 : 16}
              color={filter.active ? theme.colors.text.inverse : theme.colors.interactive.primary}
            />
            {variant === 'default' && (
              <Text style={[
                styles.filterText,
                filter.active && styles.activeFilterText,
              ]}>
                {filter.label}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const createStyles = (theme: any, variant: 'default' | 'compact') =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background.primary,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: variant === 'compact' ? theme.spacing.sm : theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
    },
    label: {
      color: theme.colors.text.secondary,
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
      marginBottom: theme.spacing.sm,
    },
    filtersRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      flexWrap: 'wrap',
    },
    filterButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: variant === 'compact' ? theme.spacing.sm : theme.spacing.md,
      paddingVertical: variant === 'compact' ? theme.spacing.xs : theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      backgroundColor: theme.colors.background.secondary,
      gap: variant === 'compact' ? theme.spacing.xs / 2 : theme.spacing.xs,
    },
    activeFilterButton: {
      backgroundColor: theme.colors.interactive.primary,
      borderColor: theme.colors.interactive.primary,
    },
    searchButton: {
      backgroundColor: theme.colors.background.tertiary,
    },
    filterText: {
      color: theme.colors.text.primary,
      fontSize: variant === 'compact' ? theme.fontSizes.xs : theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
    activeFilterText: {
      color: theme.colors.text.inverse,
    },
  });

export default FilterBar;