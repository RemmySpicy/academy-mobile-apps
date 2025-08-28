/**
 * ControlCard Component
 * 
 * A comprehensive control card component that provides:
 * - School/organization name display with optional menu
 * - Date scheduling with week view navigation
 * - Calendar modal with marked dates
 * - Filter controls for groups and search
 * - Quick filter pills with counts
 * - Statistical overview with query filters
 * 
 * Features Academy design system theming and full TypeScript support.
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  Pressable,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons, Octicons, Entypo } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import type { Theme } from '../../theme';
import { CustomButton } from '../forms/CustomButton';
import { QuickFilterBar, FilterItem } from '../search/QuickFilterBar';
import { SimpleSearchBar } from '../search/SearchBar';
import { useStyleSheet } from '../../hooks/useComponentStyles';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export interface QueryFilterItem {
  label: string;
  value: string;
}

export interface QuickFilterItem extends FilterItem {
  label: string;
  count?: number;
  value: string;
  id: string;
}

export interface ControlCardProps {
  // Header Section
  schoolName?: string;
  moreInfo?: boolean;
  onMoreInfoPress?: () => void;

  // Date and Calendar Section
  dateSchedule?: string;
  dateSchedule2?: string;
  markedDates?: string[];
  onDateSelect?: (date: string) => void;

  // Filter Section
  queryFilter?: QueryFilterItem[];
  onQueryFilterPress?: (item: QueryFilterItem, index: number) => void;

  // View and Search Section
  viewName?: string;
  groupName?: string;
  allNames?: string;
  onGroupFilterPress?: () => void;
  onViewAllPress?: () => void;
  onSearchSubmit?: (query: string) => void;

  // Quick Filter Section
  quickFilter?: QuickFilterItem[];
  filterName?: string;
  onQuickFilterPress?: (item: QuickFilterItem, index: number) => void;

  // Style Overrides
  style?: ViewStyle;
  containerStyle?: ViewStyle;
}

interface FilterComponentProps {
  groupName?: string;
  allNames?: string;
  onGroupPress?: () => void;
  onSearchToggle: () => void;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

const getWeekDates = (baseDate: string): string[] => {
  const date = new Date(baseDate);
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Calculate start of week (Monday)
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - dayOfWeek + 1);
  
  return Array.from({ length: 7 }).map((_, i) => {
    const weekDate = new Date(startOfWeek);
    weekDate.setDate(startOfWeek.getDate() + i);
    return weekDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  });
};

const generateCalendarMarkedDates = (
  markedDates: string[],
  weekDates: string[],
  today: string,
  selected: string,
  theme: Theme
) => {
  let marked: any = {};

  // Mark week dates with custom styling
  weekDates.forEach((date) => {
    const isToday = date === today;
    const isMarked = markedDates.includes(date);
    
    marked[date] = {
      customStyles: {
        container: {
          backgroundColor: isToday ? theme.colors.interactive.primary : theme.colors.background.primary,
          shadowColor: isMarked && !isToday ? theme.colors.interactive.orange : 'transparent',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.4,
          shadowRadius: 4,
          elevation: isMarked ? 5 : 0,
          borderRadius: theme.borderRadius.full,
        },
        text: {
          color: isToday ? theme.colors.text.inverse : theme.colors.text.primary,
          fontWeight: isToday ? '600' : '400',
        },
      },
    };
  });

  // Add selected date styling
  if (selected && selected !== today) {
    marked[selected] = {
      ...marked[selected],
      selected: true,
      selectedColor: theme.colors.interactive.primary,
      disableTouchEvent: true,
    };
  }

  // Add additional marked dates for full calendar
  markedDates.forEach((date) => {
    if (!marked[date]) {
      marked[date] = {
        customStyles: {
          container: {
            shadowColor: theme.colors.interactive.orange,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.4,
            shadowRadius: 4,
            elevation: 5,
            backgroundColor: theme.colors.background.primary,
            borderRadius: theme.borderRadius.md,
          },
        },
      };
    }
  });

  return marked;
};

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

const FilterComponent: React.FC<FilterComponentProps> = ({
  groupName,
  allNames,
  onGroupPress,
  onSearchToggle,
}) => {
  const { theme, screenDimensions } = useTheme();
  const isTablet = screenDimensions?.isTablet || false;
  const styles = createFilterStyles(theme, isTablet);

  return (
    <View style={styles.container}>
      {/* Group Filter */}
      <Pressable 
        style={({ pressed }) => [
          styles.filterButton, 
          styles.groupFilter,
          pressed && { opacity: 0.8, transform: [{ scale: 0.96 }] }
        ]} 
        onPress={onGroupPress}
        android_ripple={{ 
          color: theme.colors.interactive.primaryPressed,
          borderless: false 
        }}
      >
        <Ionicons 
          name="people" 
          size={theme.iconSize?.sm || 16} 
          color={theme.colors.interactive.primary} 
        />
        <Text style={styles.groupFilterText} numberOfLines={1}>
          Group: {groupName || 'All'}
        </Text>
      </Pressable>

      {/* View Filter */}
      <Pressable 
        style={({ pressed }) => [
          styles.filterButton, 
          styles.viewFilter,
          pressed && { opacity: 0.8, transform: [{ scale: 0.96 }] }
        ]}
        android_ripple={{ 
          color: theme.colors.interactive.primaryPressed,
          borderless: false 
        }}
      >
        <Ionicons 
          name="eye" 
          size={theme.iconSize?.sm || 16} 
          color={theme.colors.text.tertiary} 
        />
        <Text style={styles.viewFilterText} numberOfLines={1}>
          {allNames || 'All Students'}
        </Text>
      </Pressable>

      {/* Search Button */}
      <Pressable 
        style={({ pressed }) => [
          styles.filterButton, 
          styles.searchFilter,
          pressed && { opacity: 0.8, transform: [{ scale: 0.96 }] }
        ]} 
        onPress={onSearchToggle}
        android_ripple={{ 
          color: theme.colors.interactive.primaryPressed,
          borderless: false 
        }}
      >
        <Octicons 
          name="search" 
          size={theme.iconSize?.sm || 16} 
          color={theme.colors.text.tertiary} 
        />
        <Text style={styles.searchFilterText}>Search</Text>
      </Pressable>
    </View>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const ControlCard: React.FC<ControlCardProps> = ({
  schoolName,
  moreInfo = false,
  onMoreInfoPress,
  dateSchedule,
  dateSchedule2,
  markedDates = [],
  onDateSelect,
  queryFilter,
  onQueryFilterPress,
  viewName,
  groupName,
  allNames,
  onGroupFilterPress,
  onViewAllPress,
  onSearchSubmit,
  quickFilter,
  filterName,
  onQuickFilterPress,
  style,
  containerStyle,
}) => {
  const { theme } = useTheme();
  const styles = useStyleSheet((theme, screenDimensions) => createStyles(theme, screenDimensions), []);

  // State management
  const today = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState(today);
  const [activeSearch, setActiveSearch] = useState(false);
  const [queryText, setQueryText] = useState('');

  // Computed values
  const weekDates = useMemo(() => getWeekDates(today), [today]);
  const calendarMarkedDates = useMemo(
    () => generateCalendarMarkedDates(markedDates, weekDates, today, selected, theme),
    [markedDates, weekDates, today, selected, theme]
  );

  // Event handlers
  const handleSearchToggle = useCallback(() => {
    setActiveSearch(!activeSearch);
    if (activeSearch && queryText) {
      onSearchSubmit?.(queryText);
    }
  }, [activeSearch, queryText, onSearchSubmit]);

  const handleDateSelect = useCallback((date: string) => {
    setSelected(date);
    onDateSelect?.(date);
  }, [onDateSelect]);

  const handleCalendarDayPress = useCallback(({ dateString }: any) => {
    setSelected(dateString);
    onDateSelect?.(dateString);
  }, [onDateSelect]);

  const handleViewAllPress = useCallback(() => {
    setModalVisible(true);
    onViewAllPress?.();
  }, [onViewAllPress]);

  const handleModalClose = useCallback(() => {
    setModalVisible(false);
  }, []);

  const renderWeekDay = useCallback(({ item }: { item: string }) => {
    const isToday = item === today;
    const isMarked = markedDates.includes(item);
    const isSelected = item === selected;

    return (
      <TouchableOpacity onPress={() => handleDateSelect(item)}>
        <View style={[
          styles.dayBox,
          isToday && styles.todayDayBox,
          isSelected && !isToday && styles.selectedDayBox,
          isMarked && !isToday && !isSelected && styles.markedDayBox,
        ]}>
          <View style={[
            styles.dayNumberContainer,
            !isToday && !isSelected && styles.defaultDayNumberContainer,
          ]}>
            <Text style={[
              styles.dayNumber,
              isToday && styles.todayDayNumber,
              isSelected && !isToday && styles.selectedDayNumber,
            ]}>
              {new Date(item).getDate()}
            </Text>
          </View>
          <Text style={[
            styles.dayLabel,
            isToday && styles.todayDayLabel,
            isSelected && !isToday && styles.selectedDayLabel,
          ]}>
            {new Date(item).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }, [today, markedDates, selected, handleDateSelect, styles]);

  return (
    <>
      <View style={[styles.container, containerStyle, style]}>
        {/* Header Section */}
        {schoolName && (
          <View style={styles.header}>
            <Text style={styles.schoolName}>{schoolName}</Text>
            {moreInfo && (
              <TouchableOpacity style={styles.moreButton} onPress={onMoreInfoPress}>
                <Entypo 
                  name="dots-three-horizontal" 
                  size={theme.iconSize?.sm || 16} 
                  color={theme.colors.text.primary} 
                />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Query Filter Section */}
        {queryFilter && queryFilter.length > 0 && (
          <View style={styles.queryFilterContainer}>
            {queryFilter.map((item, index) => (
              <Pressable 
                key={index} 
                onPress={() => onQueryFilterPress?.(item, index)}
                style={({ pressed }) => [
                  styles.queryFilterItem,
                  pressed && styles.queryFilterItemPressed
                ]}
                android_ripple={{ 
                  color: theme.colors.interactive.primaryPressed,
                  borderless: false 
                }}
              >
                <Text style={styles.queryFilterLabel}>{item.label}</Text>
                <Text style={styles.queryFilterValue}>{item.value}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Views Section */}
        {viewName && (
          <View style={styles.viewsSection}>
            <Text style={styles.viewsTitle}>{viewName}</Text>
            {activeSearch ? (
              <SimpleSearchBar
                value={queryText}
                onChangeText={setQueryText}
                onDonePress={handleSearchToggle}
                placeholder="Search students..."
                style={styles.searchBarContainer}
                testID="control-card-search"
              />
            ) : (
              <FilterComponent
                groupName={groupName}
                allNames={allNames}
                onGroupPress={onGroupFilterPress}
                onSearchToggle={handleSearchToggle}
              />
            )}
          </View>
        )}

        {/* Date Schedule Section */}
        {!activeSearch && dateSchedule && (
          <>
            <View style={styles.dateHeader}>
              <View style={styles.dateInfo}>
                <Text style={styles.dateSchedule}>{dateSchedule}</Text>
                {dateSchedule2 && (
                  <Text style={styles.dateSchedule2}>{dateSchedule2}</Text>
                )}
              </View>
              <CustomButton
                title="View all"
                onPress={handleViewAllPress}
                variant="ghost"
                size="sm"
                endIcon={
                  <Ionicons 
                    name="arrow-forward" 
                    size={theme.iconSize?.sm || 16} 
                    color={theme.colors.interactive.primary} 
                  />
                }
                style={styles.viewAllButton}
                textStyle={styles.viewAllText}
              />
            </View>

            {/* Week View */}
            <FlatList
              horizontal
              data={weekDates}
              keyExtractor={(item) => item}
              contentContainerStyle={styles.weekContainer}
              showsHorizontalScrollIndicator={false}
              renderItem={renderWeekDay}
            />
          </>
        )}

        {/* Quick Filter Section */}
        {quickFilter && quickFilter.length > 0 && (
          <View style={styles.quickFilterSection}>
            {filterName && (
              <Text style={styles.filterTitle}>{filterName}</Text>
            )}
            <QuickFilterBar
              filters={quickFilter.map(item => ({
                id: item.id || item.value,
                label: item.label,
                value: item.value,
                count: item.count,
              }))}
              onFilterChange={(selectedValues) => {
                const selectedItem = quickFilter.find(item => 
                  selectedValues.includes(item.value) || selectedValues.includes(item.id)
                );
                if (selectedItem) {
                  const index = quickFilter.indexOf(selectedItem);
                  onQuickFilterPress?.(selectedItem, index);
                }
              }}
              showCount={true}
              multiSelect={false}
              contentPadding={0}
              style={styles.quickFilterBar}
              testID="control-card-quick-filters"
            />
          </View>
        )}
      </View>

      {/* Full Calendar Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <CustomButton
              title=""
              onPress={handleModalClose}
              variant="ghost"
              size="sm"
              startIcon={
                <Ionicons 
                  name="close" 
                  size={theme.iconSize?.lg || 24} 
                  color={theme.colors.text.primary} 
                />
              }
              style={styles.modalCloseButton}
            />
            <Text style={styles.modalTitle}>Select Date</Text>
            <View style={styles.modalHeaderSpacer} />
          </View>
          {/* TODO: Add react-native-calendars as peer dependency to enable full calendar view */}
          <View style={styles.calendarPlaceholder}>
            <Text style={styles.calendarPlaceholderText}>
              Full Calendar View
            </Text>
            <Text style={styles.calendarPlaceholderSubtext}>
              Install react-native-calendars to enable this feature
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
};

// =============================================================================
// STYLES
// =============================================================================

const createStyles = (theme: Theme, screenDimensions: any) => {
  const isTablet = screenDimensions?.isTablet || false;
  const responsivePadding = isTablet ? theme.spacing.xl : theme.spacing.lg;
  const responsiveSpacing = isTablet ? theme.spacing.lg : theme.spacing.md;
  
  return StyleSheet.create({
    container: {
      marginHorizontal: responsivePadding,
      padding: responsivePadding,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.background.secondary,
      ...theme.elevation?.sm,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: responsiveSpacing,
    },
    schoolName: {
      fontSize: isTablet ? theme.fontSizes.lg : theme.fontSizes.body,
      color: theme.colors.text.primary,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      flex: 1,
    },
    moreButton: {
      backgroundColor: theme.colors.background.primary,
      height: isTablet ? 36 : 32,
      width: isTablet ? 36 : 32,
      borderRadius: theme.borderRadius.full,
      justifyContent: 'center',
      alignItems: 'center',
      ...theme.elevation?.sm,
    },
    queryFilterContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: responsiveSpacing,
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    queryFilterItem: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: isTablet ? 80 : 60,
      flex: 1,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.xs,
      borderRadius: theme.borderRadius.md,
      minHeight: theme.safeArea?.minTouchTarget?.height || 44,
    },
    queryFilterItemPressed: {
      backgroundColor: theme.colors.interactive.faded,
      transform: [{ scale: 0.96 }],
    },
    queryFilterLabel: {
      fontSize: isTablet ? theme.fontSizes.caption * 1.1 : theme.fontSizes.caption,
      color: theme.colors.text.tertiary,
      fontWeight: theme.fontConfig.fontWeight.regular,
      textAlign: 'center',
      marginBottom: theme.spacing.xs,
    },
    queryFilterValue: {
      fontSize: isTablet ? theme.fontSizes.body : theme.fontSizes.caption,
      color: theme.colors.interactive.primary,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      textAlign: 'center',
    },
    viewsSection: {
      marginBottom: responsiveSpacing,
    },
    viewsTitle: {
      fontSize: isTablet ? theme.fontSizes.body : theme.fontSizes.caption,
      color: theme.colors.text.primary,
      fontWeight: theme.fontConfig.fontWeight.medium,
      marginBottom: theme.spacing.sm,
    },
    searchBarContainer: {
      marginVertical: 0,
      paddingHorizontal: 0,
    },
    dateHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: responsiveSpacing,
      marginBottom: theme.spacing.sm,
    },
    dateInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    dateSchedule: {
      fontSize: isTablet ? theme.fontSizes.body : theme.fontSizes.caption,
      color: theme.colors.text.primary,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
    dateSchedule2: {
      fontSize: isTablet ? theme.fontSizes.caption : theme.fontSizes.xs,
      color: theme.colors.text.secondary,
      fontWeight: theme.fontConfig.fontWeight.regular,
    },
    viewAllButton: {
      paddingHorizontal: 0,
      paddingVertical: 0,
      minHeight: 'auto' as any,
      height: 'auto' as any,
    },
    viewAllText: {
      fontSize: isTablet ? theme.fontSizes.body : theme.fontSizes.caption,
      color: theme.colors.interactive.primary,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
    weekContainer: {
      marginTop: responsiveSpacing,
      paddingVertical: theme.spacing.sm,
    },
    dayBox: {
      width: isTablet ? 48 : 40,
      height: isTablet ? 72 : 64,
      marginRight: responsiveSpacing,
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    todayDayBox: {
      backgroundColor: theme.colors.interactive.primary,
    },
    selectedDayBox: {
      backgroundColor: theme.colors.interactive.primaryHover,
    },
    markedDayBox: {
      shadowColor: theme.colors.interactive.orange,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 3,
      elevation: 5,
    },
    dayNumberContainer: {
      flexDirection: 'column',
      backgroundColor: theme.colors.background.primary,
      padding: isTablet ? theme.spacing.sm : theme.spacing.xs,
      borderRadius: theme.borderRadius.full,
      minWidth: isTablet ? 32 : 28,
      minHeight: isTablet ? 32 : 28,
      alignItems: 'center',
      justifyContent: 'center',
    },
    defaultDayNumberContainer: {
      backgroundColor: theme.colors.interactive.faded,
    },
    dayNumber: {
      fontSize: isTablet ? theme.fontSizes.body : theme.fontSizes.caption,
      color: theme.colors.text.primary,
      fontWeight: theme.fontConfig.fontWeight.semibold,
    },
    todayDayNumber: {
      color: theme.colors.text.primary,
    },
    selectedDayNumber: {
      color: theme.colors.text.primary,
    },
    dayLabel: {
      fontSize: isTablet ? theme.fontSizes.caption : theme.fontSizes.xs,
      color: theme.colors.text.tertiary,
      marginTop: theme.spacing.xs,
      fontWeight: theme.fontConfig.fontWeight.regular,
    },
    todayDayLabel: {
      color: theme.colors.text.inverse,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
    selectedDayLabel: {
      color: theme.colors.text.inverse,
    },
    modalContent: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
      paddingTop: 44 + responsivePadding,
      paddingHorizontal: responsivePadding,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: responsivePadding,
      paddingBottom: responsiveSpacing,
      borderBottomWidth: theme.borderWidth?.sm || 1,
      borderBottomColor: theme.colors.border.primary,
    },
    modalCloseButton: {
      padding: 0,
      minHeight: 'auto' as any,
      height: 'auto' as any,
      width: 'auto' as any,
      backgroundColor: 'transparent',
    },
    modalTitle: {
      fontSize: isTablet ? theme.fontSizes.h2 : theme.fontSizes.h3,
      color: theme.colors.text.primary,
      fontWeight: theme.fontConfig.fontWeight.semibold,
    },
    modalHeaderSpacer: {
      width: (theme.iconSize?.lg || 24) + theme.spacing.xs * 2,
    },
    calendarPlaceholder: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.lg,
      margin: responsivePadding,
      padding: isTablet ? theme.spacing.xxl : theme.spacing.xl,
    },
    calendarPlaceholderText: {
      fontSize: isTablet ? theme.fontSizes.h3 : theme.fontSizes.h4,
      color: theme.colors.text.primary,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      textAlign: 'center',
      marginBottom: responsiveSpacing,
    },
    calendarPlaceholderSubtext: {
      fontSize: isTablet ? theme.fontSizes.body : theme.fontSizes.sm,
      color: theme.colors.text.secondary,
      fontWeight: theme.fontConfig.fontWeight.regular,
      textAlign: 'center',
      lineHeight: isTablet ? theme.lineHeights.relaxed : theme.lineHeights.normal,
    },
    
    // New styles for improved components
    quickFilterSection: {
      marginTop: responsiveSpacing,
    },
    
    filterTitle: {
      fontSize: isTablet ? theme.fontSizes.body : theme.fontSizes.caption,
      color: theme.colors.text.primary,
      fontWeight: theme.fontConfig.fontWeight.medium,
      marginBottom: theme.spacing.sm,
    },
    
    quickFilterBar: {
      marginVertical: 0,
    },
  });
};

const createFilterStyles = (theme: Theme, isTablet: boolean) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  filterButton: {
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
    gap: theme.spacing.xs,
    minHeight: theme.safeArea?.minTouchTarget?.height || 44,
  },
  groupFilter: {
    backgroundColor: theme.colors.interactive.faded,
    flex: 0.5,
  },
  viewFilter: {
    borderWidth: theme.borderWidth?.sm || 1,
    borderColor: theme.colors.border.primary,
    backgroundColor: theme.colors.background.primary,
    flex: 0.35,
  },
  searchFilter: {
    borderWidth: theme.borderWidth?.sm || 1,
    borderColor: theme.colors.border.primary,
    backgroundColor: theme.colors.background.primary,
    flex: 0.25,
  },
  groupFilterText: {
    fontSize: isTablet ? theme.fontSizes.caption * 1.1 : theme.fontSizes.caption,
    color: theme.colors.interactive.primary,
    fontWeight: theme.fontConfig.fontWeight.semibold,
    flexShrink: 1,
  },
  viewFilterText: {
    fontSize: isTablet ? theme.fontSizes.caption * 1.1 : theme.fontSizes.caption,
    color: theme.colors.text.tertiary,
    fontWeight: theme.fontConfig.fontWeight.regular,
    flexShrink: 1,
  },
  searchFilterText: {
    fontSize: isTablet ? theme.fontSizes.caption * 1.1 : theme.fontSizes.caption,
    color: theme.colors.text.tertiary,
    fontWeight: theme.fontConfig.fontWeight.regular,
  },
});

export default ControlCard;