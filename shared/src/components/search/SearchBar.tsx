/**
 * SearchBar Component
 * 
 * Complete search bar that combines SearchInput with FilterChips and actions.
 * Provides a comprehensive search interface with Academy theming.
 */

import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { SearchInput, SearchInputProps } from './SearchInput';
import { QuickFilterBar, FilterItem, QuickFilterBarProps } from './QuickFilterBar';
import { useTheme } from '../../theme';

export interface SearchBarAction {
  /** Action label */
  label: string;
  /** Action handler */
  onPress: () => void;
  /** Action variant */
  variant?: 'primary' | 'secondary' | 'text';
  /** Disabled state */
  disabled?: boolean;
}

export interface SearchBarProps {
  /** Search input props */
  searchProps?: Omit<SearchInputProps, 'testID'>;
  /** Filter bar props */
  filterProps?: Omit<QuickFilterBarProps, 'testID'>;
  /** Show the filter bar */
  showFilters?: boolean;
  /** Action buttons (like Done, Cancel, etc.) */
  actions?: SearchBarAction[];
  /** Container title */
  title?: string;
  /** Subtitle or description */
  subtitle?: string;
  /** Custom container styles */
  style?: ViewStyle;
  /** Custom title styles */
  titleStyle?: TextStyle;
  /** Custom subtitle styles */
  subtitleStyle?: TextStyle;
  /** Test ID for testing */
  testID?: string;
  /** Show search suggestions/results */
  showResults?: boolean;
  /** Custom results component */
  resultsComponent?: React.ReactNode;
  /** Compact mode (reduced padding) */
  compact?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchProps,
  filterProps,
  showFilters = true,
  actions = [],
  title,
  subtitle,
  style,
  titleStyle,
  subtitleStyle,
  testID = "search-bar",
  showResults = false,
  resultsComponent,
  compact = false,
}) => {
  const { theme, screenDimensions } = useTheme();
  const styles = createStyles(theme, screenDimensions, compact);

  const renderHeader = () => {
    if (!title && !subtitle) return null;

    return (
      <View style={styles.headerContainer}>
        {title && (
          <Text 
            style={[styles.title, titleStyle]}
            testID={`${testID}-title`}
          >
            {title}
          </Text>
        )}
        {subtitle && (
          <Text 
            style={[styles.subtitle, subtitleStyle]}
            testID={`${testID}-subtitle`}
          >
            {subtitle}
          </Text>
        )}
      </View>
    );
  };

  const renderSearchSection = () => {
    const hasActions = actions.length > 0;

    return (
      <View style={styles.searchSection}>
        <View style={hasActions ? styles.searchInputContainer : styles.searchInputFull}>
          <SearchInput
            {...searchProps}
            testID={`${testID}-input`}
          />
        </View>
        
        {hasActions && (
          <View style={styles.actionsContainer}>
            {actions.map((action, index) => (
              <Pressable
                key={index}
                onPress={action.onPress}
                style={({ pressed }) => [
                  styles.actionButton,
                  action.variant === 'primary' ? styles.actionPrimary :
                  action.variant === 'secondary' ? styles.actionSecondary :
                  styles.actionText,
                  pressed && styles.actionPressed,
                  action.disabled && styles.actionDisabled,
                ]}
                disabled={action.disabled}
                testID={`${testID}-action-${index}`}
                accessibilityRole="button"
                accessibilityLabel={action.label}
              >
                <Text style={[
                  styles.actionTextBase,
                  action.variant === 'primary' ? styles.actionTextPrimary :
                  action.variant === 'secondary' ? styles.actionTextSecondary :
                  styles.actionTextText,
                ]}>
                  {action.label}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderFilters = () => {
    if (!showFilters || !filterProps?.filters?.length) return null;

    return (
      <QuickFilterBar
        {...filterProps}
        testID={`${testID}-filters`}
        contentPadding={compact ? theme.spacing.sm : theme.spacing.md}
      />
    );
  };

  const renderResults = () => {
    if (!showResults || !resultsComponent) return null;

    return (
      <View style={styles.resultsContainer}>
        {resultsComponent}
      </View>
    );
  };

  return (
    <View 
      style={[styles.container, style]}
      testID={testID}
    >
      {renderHeader()}
      {renderSearchSection()}
      {renderFilters()}
      {renderResults()}
    </View>
  );
};

/**
 * Simplified SearchBar for common use cases
 */
export const SimpleSearchBar: React.FC<{
  value?: string;
  onChangeText?: (text: string) => void;
  onDonePress?: () => void;
  placeholder?: string;
  style?: ViewStyle;
  testID?: string;
}> = ({
  value,
  onChangeText,
  onDonePress,
  placeholder = "Search...",
  style,
  testID = "simple-search-bar",
}) => {
  return (
    <SearchBar
      searchProps={{
        value,
        onChangeText,
        placeholder,
      }}
      actions={onDonePress ? [{
        label: "Done",
        onPress: onDonePress,
        variant: "text",
      }] : []}
      showFilters={false}
      compact
      style={style}
      testID={testID}
    />
  );
};

const createStyles = (theme: any, screenDimensions: any, compact: boolean) => {
  const isTablet = screenDimensions.isTablet;
  const basePadding = compact ? theme.spacing.sm : theme.spacing.md;
  
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background.primary,
      paddingHorizontal: basePadding,
      paddingVertical: compact ? theme.spacing.xs : theme.spacing.sm,
    },
    
    headerContainer: {
      marginBottom: theme.spacing.sm,
    },
    
    title: {
      fontSize: isTablet ? theme.fontSizes.h4 : theme.fontSizes.body,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.xs,
    },
    
    subtitle: {
      fontSize: isTablet ? theme.fontSizes.caption * 1.1 : theme.fontSizes.caption,
      fontWeight: theme.fontConfig.fontWeight.regular,
      color: theme.colors.text.secondary,
    },
    
    searchSection: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    
    searchInputContainer: {
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    
    searchInputFull: {
      flex: 1,
    },
    
    actionsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    
    actionButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      marginLeft: theme.spacing.xs,
      minHeight: theme.safeArea.minTouchTarget.height * 0.8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    actionPrimary: {
      backgroundColor: theme.colors.interactive.primary,
    },
    
    actionSecondary: {
      backgroundColor: theme.colors.interactive.secondary,
      borderWidth: theme.borderWidth.sm,
      borderColor: theme.colors.interactive.secondaryBorder,
    },
    
    actionText: {
      backgroundColor: 'transparent',
    },
    
    actionPressed: {
      opacity: 0.8,
      transform: [{ scale: 0.96 }],
    },
    
    actionDisabled: {
      opacity: 0.5,
    },
    
    actionTextBase: {
      fontSize: isTablet ? theme.fontSizes.caption * 1.1 : theme.fontSizes.caption,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
    
    actionTextPrimary: {
      color: theme.colors.text.inverse,
    },
    
    actionTextSecondary: {
      color: theme.colors.text.primary,
    },
    
    actionTextText: {
      color: theme.colors.interactive.primary,
    },
    
    resultsContainer: {
      marginTop: theme.spacing.sm,
    },
  });
};

export default SearchBar;