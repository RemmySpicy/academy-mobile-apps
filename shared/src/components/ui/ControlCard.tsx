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
  TextInput,
  ScrollView,
  PixelRatio,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons, Octicons, Entypo } from '@expo/vector-icons';
// Using native Date API for better compatibility
// import { Calendar } from 'react-native-calendars';
// import dayjs from 'dayjs';
import { useTheme } from '../../theme';
import type { Theme } from '../../theme';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export interface FilterItem {
  label: string;
  num: string;
}

export interface QuickFilterItem {
  label: string;
  count: string;
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
  queryFilter?: FilterItem[];
  onQueryFilterPress?: (item: FilterItem, index: number) => void;

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

interface SearchComponentProps {
  onQueryChange: (text: string) => void;
  onSearchToggle: () => void;
  placeholder?: string;
}

interface FilterComponentProps {
  groupName?: string;
  allNames?: string;
  onGroupPress?: () => void;
  onSearchToggle: () => void;
}

interface QuickFilterComponentProps {
  items: QuickFilterItem[];
  filterName?: string;
  onItemPress?: (item: QuickFilterItem, index: number) => void;
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

const SearchComponent: React.FC<SearchComponentProps> = ({
  onQueryChange,
  onSearchToggle,
  placeholder = 'Search...',
}) => {
  const { theme } = useTheme();
  const styles = createSearchStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Octicons
          name="search"
          size={theme.iconSize.sm}
          color={theme.colors.text.tertiary}
          style={styles.searchIcon}
        />
        <TextInput
          placeholder={placeholder}
          style={styles.input}
          onChangeText={onQueryChange}
          placeholderTextColor={theme.colors.text.tertiary}
          autoFocus
        />
      </View>
      <TouchableOpacity onPress={onSearchToggle} style={styles.doneButton}>
        <Text style={styles.doneText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
};

const FilterComponent: React.FC<FilterComponentProps> = ({
  groupName,
  allNames,
  onGroupPress,
  onSearchToggle,
}) => {
  const { theme } = useTheme();
  const styles = createFilterStyles(theme);

  return (
    <View style={styles.container}>
      {/* Group Filter */}
      <TouchableOpacity 
        style={[styles.filterButton, styles.groupFilter]} 
        onPress={onGroupPress}
      >
        <Ionicons 
          name="people" 
          size={theme.iconSize.sm} 
          color={theme.colors.interactive.primary} 
        />
        <Text style={styles.groupFilterText} numberOfLines={1}>
          Group: {groupName || 'All'}
        </Text>
      </TouchableOpacity>

      {/* View Filter */}
      <TouchableOpacity style={[styles.filterButton, styles.viewFilter]}>
        <Ionicons 
          name="eye" 
          size={theme.iconSize.sm} 
          color={theme.colors.text.tertiary} 
        />
        <Text style={styles.viewFilterText} numberOfLines={1}>
          {allNames || 'All Students'}
        </Text>
      </TouchableOpacity>

      {/* Search Button */}
      <TouchableOpacity 
        style={[styles.filterButton, styles.searchFilter]} 
        onPress={onSearchToggle}
      >
        <Octicons 
          name="search" 
          size={theme.iconSize.sm} 
          color={theme.colors.text.tertiary} 
        />
        <Text style={styles.searchFilterText}>Search</Text>
      </TouchableOpacity>
    </View>
  );
};

const QuickFilterComponent: React.FC<QuickFilterComponentProps> = ({
  items,
  filterName,
  onItemPress,
}) => {
  const { theme } = useTheme();
  const styles = createQuickFilterStyles(theme);

  if (!items?.length) return null;

  return (
    <View style={styles.container}>
      {filterName && (
        <Text style={styles.filterTitle}>{filterName}</Text>
      )}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.filterPill,
              index === 0 && styles.activeFilterPill,
            ]}
            onPress={() => onItemPress?.(item, index)}
          >
            <Text style={styles.filterLabel}>{item.label}</Text>
            <Text style={styles.filterCount}>{item.count}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  const styles = useMemo(() => createStyles(theme), [theme]);

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
                  size={theme.iconSize.sm} 
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
              <TouchableOpacity 
                key={index} 
                onPress={() => onQueryFilterPress?.(item, index)}
                style={styles.queryFilterItem}
              >
                <Text style={styles.queryFilterLabel}>{item.label}</Text>
                <Text style={styles.queryFilterValue}>{item.num}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Views Section */}
        {viewName && (
          <View style={styles.viewsSection}>
            <Text style={styles.viewsTitle}>{viewName}</Text>
            {activeSearch ? (
              <SearchComponent
                onQueryChange={setQueryText}
                onSearchToggle={handleSearchToggle}
                placeholder="Search students..."
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
              <TouchableOpacity style={styles.viewAllButton} onPress={handleViewAllPress}>
                <Text style={styles.viewAllText}>View all</Text>
                <Ionicons 
                  name="arrow-forward" 
                  size={theme.iconSize.sm} 
                  color={theme.colors.interactive.primary} 
                />
              </TouchableOpacity>
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
          <QuickFilterComponent
            items={quickFilter}
            filterName={filterName}
            onItemPress={onQuickFilterPress}
          />
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
            <TouchableOpacity onPress={handleModalClose} style={styles.modalCloseButton}>
              <Ionicons 
                name="close" 
                size={theme.iconSize.lg} 
                color={theme.colors.text.primary} 
              />
            </TouchableOpacity>
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

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    marginHorizontal: theme.spacing.lg,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.background.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  schoolName: {
    ...theme.typography.body.base,
    color: theme.colors.text.primary,
    fontWeight: '500',
    flex: 1,
  },
  moreButton: {
    backgroundColor: theme.colors.background.primary,
    height: 32,
    width: 32,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.elevation.sm,
  },
  queryFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: theme.spacing.sm,
    flexWrap: 'wrap',
  },
  queryFilterItem: {
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 60,
    flex: 1,
  },
  queryFilterLabel: {
    ...theme.typography.caption.base,
    color: theme.colors.text.tertiary,
    fontSize: PixelRatio.getFontScale() * 10,
  },
  queryFilterValue: {
    ...theme.typography.caption.base,
    color: theme.colors.interactive.primary,
    fontWeight: '600',
    fontSize: PixelRatio.getFontScale() * 12,
  },
  viewsSection: {
    marginBottom: theme.spacing.sm,
  },
  viewsTitle: {
    ...theme.typography.caption.base,
    color: theme.colors.text.primary,
    fontSize: PixelRatio.getFontScale() * 12,
    marginBottom: theme.spacing.xs,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  dateSchedule: {
    ...theme.typography.caption.base,
    color: theme.colors.text.primary,
    fontWeight: '500',
  },
  dateSchedule2: {
    ...theme.typography.caption.base,
    color: theme.colors.text.secondary,
    fontSize: PixelRatio.getFontScale() * 10,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  viewAllText: {
    ...theme.typography.caption.base,
    color: theme.colors.interactive.primary,
    fontWeight: '500',
  },
  weekContainer: {
    marginTop: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  dayBox: {
    width: 40,
    height: 64,
    marginRight: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
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
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    minWidth: 28,
    alignItems: 'center',
  },
  defaultDayNumberContainer: {
    backgroundColor: theme.colors.interactive.faded,
  },
  dayNumber: {
    ...theme.typography.caption.base,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  todayDayNumber: {
    color: theme.colors.text.primary,
  },
  selectedDayNumber: {
    color: theme.colors.text.primary,
  },
  dayLabel: {
    ...theme.typography.caption.base,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.xs,
    fontSize: PixelRatio.getFontScale() * 10,
  },
  todayDayLabel: {
    color: theme.colors.text.inverse,
    fontWeight: '500',
  },
  selectedDayLabel: {
    color: theme.colors.text.inverse,
  },
  modalContent: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    paddingTop: 44 + theme.spacing.lg, // Safe area top
    paddingHorizontal: theme.spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  modalCloseButton: {
    padding: theme.spacing.xs,
  },
  modalTitle: {
    ...theme.typography.heading.h3,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  modalHeaderSpacer: {
    width: theme.iconSize.lg + theme.spacing.xs * 2,
  },
  calendarPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    margin: theme.spacing.lg,
    padding: theme.spacing.xl,
  },
  calendarPlaceholderText: {
    ...theme.typography.heading.h4,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  calendarPlaceholderSubtext: {
    ...theme.typography.body.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});

const createSearchStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.xs,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    backgroundColor: theme.colors.background.primary,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    ...theme.typography.caption.base,
    color: theme.colors.text.primary,
    paddingVertical: 0,
  },
  doneButton: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  doneText: {
    ...theme.typography.caption.base,
    color: theme.colors.interactive.primary,
    fontWeight: '500',
  },
});

const createFilterStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  filterButton: {
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
    gap: theme.spacing.xs,
  },
  groupFilter: {
    backgroundColor: theme.colors.interactive.faded,
    flex: 0.5,
  },
  viewFilter: {
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    backgroundColor: theme.colors.background.primary,
    flex: 0.35,
  },
  searchFilter: {
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    backgroundColor: theme.colors.background.primary,
    flex: 0.25,
  },
  groupFilterText: {
    ...theme.typography.caption.base,
    color: theme.colors.interactive.primary,
    fontWeight: '600',
    fontSize: PixelRatio.getFontScale() * 10,
    flexShrink: 1,
  },
  viewFilterText: {
    ...theme.typography.caption.base,
    color: theme.colors.text.tertiary,
    fontSize: PixelRatio.getFontScale() * 10,
    flexShrink: 1,
  },
  searchFilterText: {
    ...theme.typography.caption.base,
    color: theme.colors.text.tertiary,
    fontSize: PixelRatio.getFontScale() * 10,
  },
});

const createQuickFilterStyles = (theme: Theme) => StyleSheet.create({
  container: {
    marginTop: theme.spacing.md,
  },
  filterTitle: {
    ...theme.typography.caption.base,
    color: theme.colors.text.primary,
    fontSize: PixelRatio.getFontScale() * 12,
    marginBottom: theme.spacing.xs,
  },
  scrollView: {
    marginTop: theme.spacing.xs,
  },
  scrollContent: {
    gap: theme.spacing.sm,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    backgroundColor: 'transparent',
    gap: theme.spacing.xs,
  },
  activeFilterPill: {
    backgroundColor: theme.colors.interactive.faded,
    borderColor: theme.colors.interactive.primary,
  },
  filterLabel: {
    ...theme.typography.caption.base,
    color: theme.colors.text.tertiary,
    fontSize: PixelRatio.getFontScale() * 10,
  },
  filterCount: {
    ...theme.typography.caption.base,
    color: theme.colors.interactive.primary,
    fontWeight: '600',
    fontSize: PixelRatio.getFontScale() * 10,
  },
});

export default ControlCard;