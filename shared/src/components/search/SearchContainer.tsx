/**
 * SearchContainer Component
 * 
 * Unified search container that combines SearchInput, QuickFilterBar, and EmptySearchResult
 * for a complete search experience with Academy theming.
 */

import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { SearchInput, SearchInputProps } from './SearchInput';
import { QuickFilterBar, FilterItem, QuickFilterBarProps } from './QuickFilterBar';
import { EmptySearchResult } from '../ui/EmptySearchResult';
import { useTheme } from '../../theme';

export interface SearchContainerProps {
  /** Search input props */
  searchProps?: Omit<SearchInputProps, 'testID'>;
  /** Filter bar props */
  filterProps?: Omit<QuickFilterBarProps, 'testID'>;
  /** Show the filter bar */
  showFilters?: boolean;
  /** Show empty state when no results */
  showEmptyState?: boolean;
  /** Custom empty state props */
  emptyStateProps?: {
    title?: string;
    description?: string;
    iconName?: string;
  };
  /** Custom results component to render */
  resultsComponent?: React.ReactNode;
  /** Whether search results are loading */
  loading?: boolean;
  /** Whether to show results (has search query or selected filters) */
  hasActiveSearch?: boolean;
  /** Custom container styles */
  style?: ViewStyle;
  /** Test ID for testing */
  testID?: string;
  /** Compact mode (reduced spacing) */
  compact?: boolean;
  /** Callback when search state changes */
  onSearchStateChange?: (hasActiveSearch: boolean) => void;
}

export const SearchContainer: React.FC<SearchContainerProps> = ({
  searchProps,
  filterProps,
  showFilters = true,
  showEmptyState = true,
  emptyStateProps = {
    title: "No results found",
    description: "Try adjusting your search criteria or filters",
    iconName: "search",
  },
  resultsComponent,
  loading = false,
  hasActiveSearch,
  style,
  testID = "search-container",
  compact = false,
  onSearchStateChange,
}) => {
  const { theme, screenDimensions } = useTheme();
  const styles = createStyles(theme, screenDimensions, compact);

  // Internal state for search if not controlled
  const [internalSearchValue, setInternalSearchValue] = useState('');
  const [internalSelectedFilters, setInternalSelectedFilters] = useState<string[]>([]);

  // Determine if search is active
  const searchValue = searchProps?.value ?? internalSearchValue;
  const selectedFilters = filterProps?.selectedFilters ?? internalSelectedFilters;
  
  const isSearchActive = useMemo(() => {
    if (hasActiveSearch !== undefined) return hasActiveSearch;
    return searchValue.length > 0 || selectedFilters.length > 0;
  }, [hasActiveSearch, searchValue, selectedFilters]);

  // Notify parent when search state changes
  React.useEffect(() => {
    onSearchStateChange?.(isSearchActive);
  }, [isSearchActive, onSearchStateChange]);

  const handleSearchChange = (text: string) => {
    if (searchProps?.onChangeText) {
      searchProps.onChangeText(text);
    } else {
      setInternalSearchValue(text);
    }
  };

  const handleFilterChange = (filters: string[]) => {
    if (filterProps?.onFilterChange) {
      filterProps.onFilterChange(filters);
    } else {
      setInternalSelectedFilters(filters);
    }
  };

  const renderSearchInput = () => (
    <SearchInput
      {...searchProps}
      value={searchValue}
      onChangeText={handleSearchChange}
      loading={loading}
      testID={`${testID}-input`}
    />
  );

  const renderFilters = () => {
    if (!showFilters || !filterProps?.filters?.length) return null;

    return (
      <QuickFilterBar
        {...filterProps}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        testID={`${testID}-filters`}
        contentPadding={compact ? undefined : 0}
      />
    );
  };

  const renderResults = () => {
    // Show loading state
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          {/* Custom loading component could go here */}
        </View>
      );
    }

    // Show results if provided
    if (resultsComponent) {
      return (
        <View style={styles.resultsContainer}>
          {resultsComponent}
        </View>
      );
    }

    // Show empty state if search is active but no results
    if (isSearchActive && showEmptyState) {
      return (
        <View style={styles.emptyContainer}>
          <EmptySearchResult
            title={emptyStateProps.title!}
            description={emptyStateProps.description!}
            iconName={emptyStateProps.iconName as any}
          />
        </View>
      );
    }

    return null;
  };

  return (
    <View 
      style={[styles.container, style]}
      testID={testID}
    >
      {renderSearchInput()}
      {renderFilters()}
      {renderResults()}
    </View>
  );
};

const createStyles = (theme: any, screenDimensions: any, compact: boolean) => {
  const basePadding = compact ? theme.spacing.sm : theme.spacing.md;
  
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background.primary,
    },
    
    loadingContainer: {
      paddingVertical: theme.spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    resultsContainer: {
      marginTop: theme.spacing.sm,
    },
    
    emptyContainer: {
      paddingVertical: theme.spacing.xl,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};

export default SearchContainer;