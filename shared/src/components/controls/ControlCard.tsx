import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons, Entypo } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../../theme';
import { getDateRange, formatDate, isToday as isTodayUtil, type DateRangeType } from './dateUtils';
import { 
  createControlCardStyles, 
  getActionButtonStyles, 
  getActionButtonTextStyles,
  getDayBoxStyles,
  type ControlCardSize, 
  type ControlCardLayout, 
  type ControlCardVariant 
} from './styleUtils';

const { width } = Dimensions.get('window');

export interface QueryFilterItem {
  id: string;
  label: string;
  num: string;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
  isActive?: boolean;
}

export interface QuickFilterItem {
  id: string;
  label: string;
  count: string;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
  isActive?: boolean;
}

export interface FilterOption {
  id: string;
  label: string;
  value: string;
  count?: number;
  icon?: keyof typeof Ionicons.glyphMap;
}

export interface ActionButton {
  id: string;
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  color?: string;
  disabled?: boolean;
}

export type FilterLayout = 'horizontal' | 'vertical' | 'grid';

// Re-export types from utilities
export type { DateRangeType } from './dateUtils';
export type { ControlCardSize, ControlCardLayout, ControlCardVariant } from './styleUtils';

export interface ControlCardProps {
  // Basic Info
  title?: string;
  subtitle?: string;
  description?: string;
  schoolName?: string; // Legacy support
  
  // Layout & Size
  size?: ControlCardSize;
  layout?: ControlCardLayout;
  variant?: ControlCardVariant;
  
  // Date & Calendar
  dateSchedule?: string;
  dateSchedule2?: string;
  dateRangeType?: DateRangeType;
  markedDates?: string[];
  selectedDate?: string;
  minDate?: string;
  maxDate?: string;
  onDateSelect?: (date: string) => void;
  onDateRangeSelect?: (startDate: string, endDate: string) => void;
  customDateFormat?: string;
  showWeekdays?: boolean;
  highlightToday?: boolean;
  
  // Filters & Query
  queryFilter?: QueryFilterItem[];
  quickFilter?: QuickFilterItem[];
  filterOptions?: FilterOption[];
  activeFilters?: string[];
  filterLayout?: FilterLayout;
  filterName?: string;
  onFilterChange?: (filterId: string, active: boolean) => void;
  onQueryFilterPress?: (item: QueryFilterItem) => void;
  onQuickFilterPress?: (item: QuickFilterItem) => void;
  
  // Search
  searchEnabled?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (text: string) => void;
  onSearchToggle?: (active: boolean) => void;
  activeSearch?: boolean;
  searchComponent?: React.ReactNode;
  
  // Actions & Navigation
  actions?: ActionButton[];
  viewAll?: () => void;
  viewAllText?: string;
  moreInfo?: boolean;
  onMoreInfo?: () => void;
  
  // Views & Groups
  viewName?: string;
  groupName?: string;
  allNames?: string;
  
  // Loading & States
  loading?: boolean;
  loadingText?: string;
  error?: string;
  onRetry?: () => void;
  
  // Custom Components
  headerComponent?: React.ReactNode;
  footerComponent?: React.ReactNode;
  filterComponent?: React.ReactNode;
  quickFilterComponent?: React.ReactNode;
  dateComponent?: React.ReactNode;
  
  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
  
  // Style Overrides
  containerStyle?: object;
  contentStyle?: object;
  
  // Event Handlers
  onPress?: () => void;
  onLongPress?: () => void;
  onLayout?: (event: any) => void;
}

// Date and format utilities are now imported from dateUtils

export const ControlCard: React.FC<ControlCardProps> = ({
  // Basic Info
  title,
  subtitle,
  description,
  schoolName, // Legacy support
  
  // Layout & Size
  size = 'normal',
  layout = 'default',
  variant = 'elevated',
  
  // Date & Calendar
  dateSchedule,
  dateSchedule2,
  dateRangeType = 'week',
  markedDates = [],
  selectedDate,
  minDate,
  maxDate,
  onDateSelect,
  onDateRangeSelect,
  customDateFormat,
  showWeekdays = true,
  highlightToday = true,
  
  // Filters & Query
  queryFilter,
  quickFilter,
  filterOptions,
  activeFilters = [],
  filterLayout = 'horizontal',
  filterName,
  onFilterChange,
  onQueryFilterPress,
  onQuickFilterPress,
  
  // Search
  searchEnabled = false,
  searchPlaceholder = 'Search...',
  searchValue = '',
  onSearchChange,
  onSearchToggle,
  activeSearch = false,
  searchComponent,
  
  // Actions & Navigation
  actions,
  viewAll,
  viewAllText = 'View all',
  moreInfo = false,
  onMoreInfo,
  
  // Views & Groups
  viewName,
  groupName,
  allNames,
  
  // Loading & States
  loading = false,
  loadingText = 'Loading...',
  error,
  onRetry,
  
  // Custom Components
  headerComponent,
  footerComponent,
  filterComponent,
  quickFilterComponent,
  dateComponent,
  
  // Accessibility
  accessibilityLabel,
  accessibilityHint,
  
  // Style Overrides
  containerStyle,
  contentStyle,
  
  // Event Handlers
  onPress,
  onLongPress,
  onLayout,
}) => {
  const { theme } = useTheme();
  const baseStyles = createControlCardStyles(theme, size, layout, variant);
  const additionalStyles = createAdditionalStyles(theme, size as ControlCardSize);
  const styles = { ...baseStyles, ...additionalStyles };
  
  const today = new Date().toISOString().split('T')[0];
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState(selectedDate || today);
  const [internalSearchValue, setInternalSearchValue] = useState(searchValue);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const dateRange = useMemo(() => {
    if (dateRangeType === 'none') return [];
    return getDateRange(selected, dateRangeType as DateRangeType);
  }, [selected, dateRangeType]);
  
  const displayTitle = title || schoolName;
  const isCompact = size === 'compact';
  const isMinimal = layout === 'minimal';

  const handleDateSelect = useCallback((date: string) => {
    setSelected(date);
    onDateSelect?.(date);
  }, [onDateSelect]);

  const handleSearchToggle = useCallback(() => {
    onSearchToggle?.(!activeSearch);
  }, [activeSearch, onSearchToggle]);

  const handleSearchChange = useCallback((text: string) => {
    setInternalSearchValue(text);
    onSearchChange?.(text);
  }, [onSearchChange]);

  const handleViewAll = useCallback(() => {
    setModalVisible(true);
  }, []);

  const handleQueryFilterPress = useCallback((item: QueryFilterItem) => {
    item.onPress?.();
    onQueryFilterPress?.(item);
  }, [onQueryFilterPress]);

  const handleQuickFilterPress = useCallback((item: QuickFilterItem) => {
    item.onPress?.();
    onQuickFilterPress?.(item);
  }, [onQuickFilterPress]);

  const handleFilterChange = useCallback((filterId: string, active: boolean) => {
    onFilterChange?.(filterId, active);
  }, [onFilterChange]);

  const handleMoreInfo = useCallback(() => {
    onMoreInfo?.();
  }, [onMoreInfo]);

  const generateMarkedDates = useCallback(() => {
    let marked: any = {};
    dateRange.forEach((date) => {
      const isToday = date === today && highlightToday;
      const isSelected = date === selected;
      const isMarked = markedDates.includes(date);
      
      marked[date] = {
        customStyles: {
          container: {
            backgroundColor: isSelected || isToday 
              ? theme.colors.interactive.primary 
              : theme.colors.background.primary,
            shadowColor: isMarked && !isSelected && !isToday
              ? theme.colors.status.warning 
              : 'transparent',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.4,
            shadowRadius: 4,
            elevation: isMarked ? 5 : 0,
            borderRadius: theme.borderRadius.lg,
          },
          text: {
            color: (isSelected || isToday) 
              ? theme.colors.text.inverse 
              : theme.colors.text.primary,
            fontWeight: (isSelected || isToday) 
              ? theme.fontConfig.fontWeight.bold 
              : theme.fontConfig.fontWeight.regular,
          },
        },
      };
    });
    return marked;
  }, [dateRange, today, selected, markedDates, highlightToday, theme]);

  const renderDayItem = useCallback(({ item }: { item: string }) => {
    const isToday = isTodayUtil(item) && highlightToday;
    const isSelected = item === selected;
    const isMarked = markedDates.includes(item);
    const isActive = isSelected || isToday;
    
    return (
      <TouchableOpacity 
        onPress={() => handleDateSelect(item)}
        accessibilityRole="button"
        accessibilityLabel={`Select date ${formatDate(item, customDateFormat)}`}
        style={styles.dayContainer}
      >
        <View
          style={getDayBoxStyles(theme, size as ControlCardSize, isActive, isMarked)}
        >
          <View style={[!isActive && styles.offShadowBox]}>
            <Text style={[styles.dayNum, isActive && styles.todayText]}>
              {new Date(item).getDate()}
            </Text>
          </View>
          {showWeekdays && (
            <Text style={[isActive ? styles.activeDayLabel : styles.dayLabel]}>
              {new Date(item).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }, [today, selected, markedDates, highlightToday, handleDateSelect, customDateFormat, theme, isCompact, showWeekdays]);
  
  const renderQueryFilter = useCallback(() => {
    if (!queryFilter?.length) return null;
    
    return (
      <View style={[styles.queryFilterContainer, filterLayout === 'vertical' && styles.verticalLayout]}>
        {queryFilter.map((item, index) => (
          <TouchableOpacity 
            key={item.id || index}
            onPress={() => handleQueryFilterPress(item)}
            accessibilityRole="button"
            accessibilityLabel={`${item.label}: ${item.num}`}
            style={[styles.queryFilterButton, item.isActive && styles.activeFilterButton]}
          >
            <View style={styles.queryFilterItem}>
              {item.icon && (
                <Ionicons 
                  name={item.icon} 
                  size={14} 
                  color={item.color || theme.colors.text.secondary} 
                  style={styles.filterIcon}
                />
              )}
              <Text style={[styles.queryFilterLabel, item.isActive && styles.activeFilterLabel]}>
                {item.label}
              </Text>
              <Text style={[styles.queryFilterNumber, { color: item.color || theme.colors.interactive.primary }]}>
                {item.num}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  }, [queryFilter, filterLayout, handleQueryFilterPress, theme]);
  
  const renderQuickFilter = useCallback(() => {
    if (!quickFilter?.length) return null;
    
    return (
      <View style={[styles.quickFilterContainer, filterLayout === 'vertical' && styles.verticalLayout]}>
        {quickFilter.map((item, index) => (
          <TouchableOpacity 
            key={item.id || index}
            onPress={() => handleQuickFilterPress(item)}
            accessibilityRole="button"
            accessibilityLabel={`${item.label}: ${item.count}`}
            style={[styles.quickFilterButton, item.isActive && styles.activeFilterButton]}
          >
            {item.icon && (
              <Ionicons 
                name={item.icon} 
                size={16} 
                color={item.color || theme.colors.interactive.primary} 
                style={styles.filterIcon}
              />
            )}
            <Text style={[styles.quickFilterLabel, item.isActive && styles.activeFilterLabel]}>
              {item.label}
            </Text>
            <Text style={[styles.quickFilterCount, { color: item.color || theme.colors.text.secondary }]}>
              {item.count}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }, [quickFilter, filterLayout, handleQuickFilterPress, theme]);
  
  const renderSearchInput = useCallback(() => {
    if (searchComponent) return searchComponent;
    
    return (
      <View style={styles.searchContainer}>
        <Ionicons 
          name="search" 
          size={18} 
          color={theme.colors.text.secondary} 
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder={searchPlaceholder}
          placeholderTextColor={theme.colors.text.secondary}
          value={internalSearchValue}
          onChangeText={handleSearchChange}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          accessibilityLabel={`Search ${searchPlaceholder}`}
        />
        {(internalSearchValue || isSearchFocused) && (
          <TouchableOpacity
            onPress={() => {
              setInternalSearchValue('');
              onSearchChange?.('');
            }}
            style={styles.clearButton}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
          >
            <Ionicons name="close-circle" size={16} color={theme.colors.text.secondary} />
          </TouchableOpacity>
        )}
      </View>
    );
  }, [searchComponent, searchPlaceholder, internalSearchValue, handleSearchChange, isSearchFocused, onSearchChange, theme]);
  
  const renderActions = useCallback(() => {
    if (!actions?.length) return null;
    
    return (
      <View style={styles.actionsContainer}>
        {actions.map((action, index) => (
          <TouchableOpacity
            key={action.id || index}
            onPress={action.onPress}
            disabled={action.disabled}
            style={getActionButtonStyles(theme, action.variant, action.disabled)}
            accessibilityRole="button"
            accessibilityLabel={action.label}
          >
            {action.icon && (
              <Ionicons 
                name={action.icon} 
                size={16} 
                color={action.color || theme.colors.text.inverse} 
                style={styles.actionIcon}
              />
            )}
            <Text style={getActionButtonTextStyles(theme, action.variant, action.disabled)}>
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }, [actions, theme]);
  
  if (loading) {
    return (
      <View style={[styles.container, containerStyle]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.colors.interactive.primary} />
          <Text style={styles.loadingText}>{loadingText}</Text>
        </View>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={[styles.container, containerStyle]}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={24} color={theme.colors.status.error} />
          <Text style={styles.errorText}>{error}</Text>
          {onRetry && (
            <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onPress}
      onLongPress={onLongPress}
      onLayout={onLayout}
      activeOpacity={onPress ? 0.7 : 1}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      disabled={!onPress}
    >
      <View style={[styles.content, contentStyle]}>
        {/* Custom Header Component */}
        {headerComponent}
        
        {/* Header */}
        {displayTitle && (
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{displayTitle}</Text>
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
              {description && !isCompact && (
                <Text style={styles.description}>{description}</Text>
              )}
            </View>
            {(moreInfo || actions?.length) && (
              <View style={styles.headerActions}>
                {renderActions()}
                {moreInfo && (
                  <TouchableOpacity 
                    style={styles.moreBtn}
                    onPress={handleMoreInfo}
                    accessibilityRole="button"
                    accessibilityLabel="More options"
                  >
                    <Entypo name="dots-three-horizontal" size={15} color={theme.colors.text.primary} />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        )}

        {/* Query Filter Section */}
        {!isMinimal && renderQueryFilter()}

        {/* Views Section */}
        {(viewName || searchEnabled || filterComponent) && (
          <View>
            {viewName && <Text style={styles.viewName}>{viewName}</Text>}

            {/* Filter & Search Section */}
            {searchEnabled && activeSearch ? (
              renderSearchInput()
            ) : (
              filterComponent || (
                <View style={styles.defaultFilterContainer}>
                  {groupName && (
                    <Text style={styles.groupName}>{groupName}</Text>
                  )}
                  {allNames && (
                    <Text style={styles.allNames}>{allNames}</Text>
                  )}
                </View>
              )
            )}
            
            {searchEnabled && (
              <TouchableOpacity
                style={styles.searchToggle}
                onPress={handleSearchToggle}
                accessibilityRole="button"
                accessibilityLabel={activeSearch ? "Hide search" : "Show search"}
              >
                <Ionicons 
                  name={activeSearch ? "close" : "search"} 
                  size={18} 
                  color={theme.colors.interactive.primary} 
                />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Date Section */}
        {!activeSearch && dateRangeType !== 'none' && (
          dateComponent || (
            <>
              {(dateSchedule || dateSchedule2) && (
                <View style={styles.row}>
                  <View style={styles.dateContainer}>
                    {dateSchedule && (
                      <Text style={styles.dateSchedule}>{dateSchedule}</Text>
                    )}
                    {dateSchedule2 && (
                      <Text style={styles.dateSchedule2}>{dateSchedule2}</Text>
                    )}
                  </View>
                  {viewAll && (
                    <TouchableOpacity
                      style={styles.viewAllBtn}
                      onPress={handleViewAll}
                      accessibilityRole="button"
                      accessibilityLabel="View all dates in calendar"
                    >
                      <Text style={styles.viewAllText}>{viewAllText}</Text>
                      <Ionicons name="arrow-forward" size={14} color={theme.colors.interactive.primary} />
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* Date Range View */}
              {dateRange.length > 0 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.dateRangeContainer}
                >
                  <FlatList
                    horizontal
                    data={dateRange}
                    keyExtractor={(item) => item}
                    contentContainerStyle={styles.weekRow}
                    showsHorizontalScrollIndicator={false}
                    renderItem={renderDayItem}
                    accessibilityRole="list"
                    scrollEnabled={false}
                  />
                </ScrollView>
              )}
            </>
          )
        )}

        {/* Quick Filter */}
        {!isMinimal && (quickFilter?.length || quickFilterComponent) && (
          <View style={styles.quickFilterSection}>
            {filterName && <Text style={styles.filterSectionTitle}>{filterName}</Text>}
            {quickFilterComponent || renderQuickFilter()}
          </View>
        )}
        
        {/* Custom Footer Component */}
        {footerComponent}
      </View>

      {/* Full Calendar Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        accessibilityViewIsModal={true}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Date</Text>
            <TouchableOpacity 
              onPress={() => setModalVisible(false)}
              accessibilityRole="button"
              accessibilityLabel="Close calendar"
              style={styles.modalCloseButton}
            >
              <Ionicons name="close" size={20} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>
          <DateTimePicker
            value={new Date(selected)}
            mode="date"
            display="default"
            minimumDate={minDate ? new Date(minDate) : undefined}
            maximumDate={maxDate ? new Date(maxDate) : undefined}
            onChange={(event, date) => {
              if (date) {
                handleDateSelect(date.toISOString().split('T')[0]);
                setModalVisible(false);
              }
            }}
            accessibilityViewIsModal={true}
          />
        </View>
      </Modal>
    </TouchableOpacity>
  );
};

// Additional styles not covered by utilities
const createAdditionalStyles = (theme: any, size: ControlCardSize) => StyleSheet.create({
  // Styles specific to ControlCard functionality
  moreBtn: {
    backgroundColor: theme.colors.background.primary,
    height: 24,
    width: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  queryFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginVertical: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  verticalLayout: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  queryFilterButton: {
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    backgroundColor: 'transparent',
  },
  queryFilterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  queryFilterLabel: {
    fontSize: theme.fontSizes.caption,
    color: theme.colors.text.secondary,
  },
  queryFilterNumber: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.interactive.primary,
    fontWeight: theme.fontConfig.fontWeight.semiBold,
  },
  activeFilterButton: {
    backgroundColor: theme.colors.interactive.faded || theme.colors.interactive.primary + '20',
  },
  activeFilterLabel: {
    color: theme.colors.interactive.primary,
    fontWeight: theme.fontConfig.fontWeight.semiBold,
  },
  filterIcon: {
    marginRight: theme.spacing.xs,
  },
  viewName: {
    fontSize: theme.fontSizes.small,
    paddingBottom: theme.spacing.xs,
    color: theme.colors.text.primary,
    fontWeight: theme.fontConfig.fontWeight.medium,
  },
  defaultFilterContainer: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.md,
  },
  groupName: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text.primary,
    fontWeight: theme.fontConfig.fontWeight.medium,
  },
  allNames: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  searchToggle: {
    position: 'absolute',
    right: theme.spacing.sm,
    top: theme.spacing.sm,
    padding: theme.spacing.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    marginVertical: theme.spacing.sm,
  },
  searchIcon: {
    marginRight: theme.spacing.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.fontSizes.body,
    color: theme.colors.text.primary,
    padding: theme.spacing.xs,
  },
  clearButton: {
    padding: theme.spacing.xs,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  dateSchedule: {
    fontSize: theme.fontSizes.small,
    fontWeight: theme.fontConfig.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  dateSchedule2: {
    fontSize: theme.fontSizes.caption,
    color: theme.colors.text.secondary,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    color: theme.colors.interactive.primary,
    fontSize: theme.fontSizes.small,
    marginRight: theme.spacing.xs,
  },
  dateRangeContainer: {
    paddingHorizontal: theme.spacing.sm,
  },
  weekRow: {
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  dayContainer: {
    marginRight: theme.spacing.xs,
  },
  // Day box styles now handled by getDayBoxStyles utility
  // shadowBox now handled by getDayBoxStyles utility
  offShadowBox: {
    backgroundColor: theme.colors.interactive.faded,
    padding: size === 'compact' ? 5 : 7,
    borderRadius: theme.borderRadius.full,
  },
  dayNum: {
    fontSize: size === 'compact' ? theme.fontSizes.caption : theme.fontSizes.small,
    fontWeight: theme.fontConfig.fontWeight.semiBold,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.primary,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: theme.borderRadius.lg,
    textAlign: 'center',
    minWidth: 20,
  },
  dayLabel: {
    fontSize: theme.fontSizes.caption,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    marginTop: 2,
  },
  activeDayLabel: {
    fontSize: theme.fontSizes.caption,
    paddingTop: theme.spacing.xs,
    color: theme.colors.text.inverse,
    textAlign: 'center',
  },
  todayText: {
    color: theme.colors.text.primary,
  },
  quickFilterSection: {
    marginTop: theme.spacing.md,
  },
  filterSectionTitle: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text.primary,
    fontWeight: theme.fontConfig.fontWeight.medium,
    marginBottom: theme.spacing.sm,
  },
  quickFilterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  quickFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.xs,
  },
  quickFilterLabel: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text.primary,
  },
  quickFilterCount: {
    fontSize: theme.fontSizes.small,
    fontWeight: theme.fontConfig.fontWeight.semiBold,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    flexWrap: 'wrap',
  },
  // Action button styles now handled by utility functions
  actionIcon: {
    marginRight: theme.spacing.xs,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  loadingText: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text.secondary,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  errorText: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.status.error,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.interactive.primary,
    borderRadius: theme.borderRadius.md,
  },
  retryButtonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.fontSizes.small,
    fontWeight: theme.fontConfig.fontWeight.medium,
  },
  modalContent: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
    paddingTop: 40,
    paddingHorizontal: theme.spacing.md,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  modalTitle: {
    fontSize: theme.fontSizes.heading6,
    color: theme.colors.text.primary,
    fontWeight: theme.fontConfig.fontWeight.semiBold,
  },
  modalCloseButton: {
    padding: theme.spacing.xs,
  },
});

// Export all types for external use (types already exported above)
// QueryFilterItem, QuickFilterItem, FilterOption, ActionButton, FilterLayout already defined
// ControlCardSize, ControlCardLayout, ControlCardVariant, DateRangeType re-exported from utilities

export default ControlCard;