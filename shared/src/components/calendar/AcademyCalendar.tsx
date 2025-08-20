/**
 * AcademyCalendar Component
 * 
 * A comprehensive calendar component that consolidates ClassroomCalendar and StudentProfileCalendar.
 * Features Academy theming, event highlighting, month navigation, date selection, and responsive design.
 * 
 * This component replaces both ClassroomCalendar and StudentProfileCalendar, providing:
 * - Navigation controls with month switching
 * - Date selection with callbacks
 * - Event highlighting with multiple types and colors
 * - Proper Sunday-first week layout
 * - Full accessibility support
 * - Both classroom and student event types
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const { width } = Dimensions.get('window');
// Simplified calculation to ensure all 7 days fit with minimal padding
const TOTAL_HORIZONTAL_SPACING = 48; // Conservative estimate for all horizontal spacing
const DAY_SIZE = Math.floor((width - TOTAL_HORIZONTAL_SPACING) / 7);

export interface CalendarEvent {
  id: string;
  date: number; // Day of month
  type: 
    // Classroom events
    | 'class' 
    | 'exam' 
    | 'meeting' 
    | 'holiday' 
    | 'attendance'
    // Student events  
    | 'assignment' 
    | 'test' 
    | 'project' 
    | 'lesson';
  title?: string;
  color?: 'purple' | 'red' | 'green' | 'orange' | 'blue';
}

export interface AcademyCalendarProps {
  /** Current month to display */
  currentMonth?: Date;
  /** Callback when month changes */
  onMonthChange?: (month: Date) => void;
  /** Array of events to display */
  events?: CalendarEvent[];
  /** Callback when a date is selected */
  onDateSelect?: (date: Date) => void;
  /** Currently selected date */
  selectedDate?: Date;
  /** Custom container styles */
  style?: ViewStyle;
  /** Show header with current term info and navigation */
  showHeader?: boolean;
  /** Show navigation arrows */
  showNavigation?: boolean;
  /** Allow date selection */
  enableDateSelection?: boolean;
  /** Calendar variant - affects styling and behavior */
  variant?: 'classroom' | 'student' | 'default';
  /** Test ID for testing */
  testID?: string;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Disable navigation to future months */
  disableFutureNavigation?: boolean;
  /** Disable navigation to past months */
  disablePastNavigation?: boolean;
  /** Custom header title */
  headerTitle?: string;
}

const AcademyCalendar: React.FC<AcademyCalendarProps> = ({
  currentMonth: propCurrentMonth,
  onMonthChange,
  events = [],
  onDateSelect,
  selectedDate,
  style,
  showHeader = true,
  showNavigation = true,
  enableDateSelection = true,
  variant = 'default',
  testID,
  accessibilityLabel = 'Academy Calendar',
  disableFutureNavigation = false,
  disablePastNavigation = false,
  headerTitle,
}) => {
  const { theme } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(propCurrentMonth || new Date());
  const [highlightedDates, setHighlightedDates] = useState<Record<string, string>>({});

  // Update local state when prop changes
  useEffect(() => {
    if (propCurrentMonth) {
      setCurrentMonth(propCurrentMonth);
    }
  }, [propCurrentMonth]);

  // Generate highlighted dates from events
  useEffect(() => {
    const newHighlightedDates: Record<string, string> = {};
    
    events.forEach(event => {
      const dateKey = event.date.toString();
      let color = event.color;
      
      // Default colors based on event type if no color specified
      if (!color) {
        switch (event.type) {
          case 'class':
          case 'assignment':
            color = 'purple';
            break;
          case 'exam':
          case 'test':
            color = 'red';
            break;
          case 'project':
          case 'lesson':
            color = 'blue';
            break;
          case 'meeting':
            color = 'orange';
            break;
          case 'holiday':
            color = 'green';
            break;
          default:
            color = 'purple';
        }
      }
      
      newHighlightedDates[dateKey] = color;
    });

    // If no events provided and it's a demo, generate sample data
    if (events.length === 0 && (variant === 'classroom' || variant === 'student')) {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const daysInMonth = getDaysInMonth(year, month);

      for (let i = 1; i <= daysInMonth; i++) {
        if (i % 3 === 1) {
          newHighlightedDates[i.toString()] = 'purple';
        } else if (i === 11) {
          newHighlightedDates[i.toString()] = 'red';
        } else if (i === 15) {
          newHighlightedDates[i.toString()] = 'green';
        }
      }
    }

    setHighlightedDates(newHighlightedDates);
  }, [currentMonth, events, variant]);

  const getDaysInMonth = useCallback((year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  }, []);

  const getFirstDayOfMonth = useCallback((year: number, month: number): number => {
    // Get day of week (0-6, where 0 is Sunday)
    // Return as-is since our DAYS array starts with Sunday
    return new Date(year, month, 1).getDay();
  }, []);

  const formatMonthYear = useCallback((date: Date): string => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  }, []);

  const getSuffix = useCallback((day: number): string => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }, []);

  // Format the header title with current term info
  const defaultHeaderTitle = useMemo(() => {
    if (headerTitle) return headerTitle;
    
    const today = new Date();
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    const month = monthNames[currentMonth.getMonth()];
    const date = today.getDate();
    const suffix = getSuffix(date);

    return `${month} ${date}${suffix} till date (Current Term)`;
  }, [currentMonth, getSuffix, headerTitle]);

  const getHighlightColor = useCallback((colorType: string) => {
    switch (colorType) {
      case 'purple':
        return theme.colors.interactive.primary + '20'; // Academy purple with opacity
      case 'red':
        return theme.colors.status.error + '20';
      case 'green':
        return theme.colors.status.success + '20';
      case 'orange':
        return theme.colors.interactive.orange + '20';
      case 'blue':
        return theme.colors.icon.accent + '20';
      default:
        return theme.colors.interactive.primary + '20';
    }
  }, [theme]);

  const goToPreviousMonth = useCallback(() => {
    if (disablePastNavigation) return;
    
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
    onMonthChange?.(newMonth);
  }, [currentMonth, onMonthChange, disablePastNavigation]);

  const goToNextMonth = useCallback(() => {
    if (disableFutureNavigation) return;
    
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
    onMonthChange?.(newMonth);
  }, [currentMonth, onMonthChange, disableFutureNavigation]);

  const handleDatePress = useCallback((day: number) => {
    if (enableDateSelection && onDateSelect) {
      const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      onDateSelect(selectedDate);
    }
  }, [currentMonth, onDateSelect, enableDateSelection]);

  const isDateSelected = useCallback((day: number): boolean => {
    if (!selectedDate || !enableDateSelection) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getFullYear() === currentMonth.getFullYear()
    );
  }, [selectedDate, currentMonth, enableDateSelection]);

  const renderDays = useCallback(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    // Create weeks array similar to Calendar component
    const weeks: (React.ReactNode | null)[][] = [];
    let currentWeek: (React.ReactNode | null)[] = [];

    // Add empty spaces for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      currentWeek.push(<View key={`empty-${i}`} style={styles.dayContainer} />);
    }

    // Get current date to highlight today
    const today = new Date();
    const isCurrentMonth = 
      today.getMonth() === month && today.getFullYear() === year;
    const currentDate = today.getDate();

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const dateString = i.toString();
      const isHighlighted = highlightedDates[dateString];
      const isToday = isCurrentMonth && i === currentDate;
      const isSelected = isDateSelected(i);

      const DayComponent = enableDateSelection ? TouchableOpacity : View;
      const dayProps = enableDateSelection ? {
        onPress: () => handleDatePress(i),
        activeOpacity: 0.7,
        accessible: true,
        accessibilityLabel: `${i} ${isToday ? 'today' : ''} ${isHighlighted ? 'has events' : ''} ${isSelected ? 'selected' : ''}`,
        accessibilityRole: "button" as const,
      } : {};

      const dayElement = (
        <DayComponent
          key={`day-${i}`}
          style={styles.dayContainer}
          {...dayProps}
        >
          <View
            style={[
              createStyles(theme).day,
              isHighlighted && {
                backgroundColor: getHighlightColor(isHighlighted),
              },
              isToday && createStyles(theme).today,
              isSelected && createStyles(theme).selected,
            ]}
          >
            <Text 
              style={[
                createStyles(theme).dayText, 
                isToday && createStyles(theme).todayText,
                isSelected && createStyles(theme).selectedText,
              ]}
            >
              {i}
            </Text>
          </View>
        </DayComponent>
      );

      currentWeek.push(dayElement);

      // If week is complete (7 days), add to weeks array
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // Fill remaining days of last week with empty cells
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(<View key={`empty-end-${currentWeek.length}`} style={styles.dayContainer} />);
      }
      weeks.push(currentWeek);
    }

    return weeks;
  }, [
    currentMonth, 
    highlightedDates, 
    getDaysInMonth, 
    getFirstDayOfMonth, 
    getHighlightColor, 
    theme, 
    handleDatePress, 
    isDateSelected,
    enableDateSelection
  ]);

  const containerStyles = createStyles(theme);
  const canGoToPrevious = !disablePastNavigation;
  const canGoToNext = !disableFutureNavigation;

  return (
    <View 
      style={[containerStyles.container, style]}
      testID={testID}
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="none"
    >
      {showHeader && (
        <View style={containerStyles.header}>
          <Text style={containerStyles.headerTitle}>{defaultHeaderTitle}</Text>
          {showNavigation && (
            <View style={containerStyles.arrowContainer}>
              <TouchableOpacity 
                onPress={goToPreviousMonth} 
                style={[
                  containerStyles.arrow,
                  !canGoToPrevious && containerStyles.arrowDisabled
                ]}
                disabled={!canGoToPrevious}
                accessible={true}
                accessibilityLabel="Previous month"
                accessibilityRole="button"
              >
                <Ionicons 
                  name="chevron-back" 
                  size={theme.iconSize.md} 
                  color={canGoToPrevious ? theme.colors.text.primary : theme.colors.text.disabled} 
                />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={goToNextMonth} 
                style={[
                  containerStyles.arrow,
                  !canGoToNext && containerStyles.arrowDisabled
                ]}
                disabled={!canGoToNext}
                accessible={true}
                accessibilityLabel="Next month"
                accessibilityRole="button"
              >
                <Ionicons 
                  name="chevron-forward" 
                  size={theme.iconSize.md} 
                  color={canGoToNext ? theme.colors.text.primary : theme.colors.text.disabled} 
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      <View style={containerStyles.daysHeader}>
        {DAYS.map((day) => (
          <View key={day} style={containerStyles.dayHeaderContainer}>
            <Text style={containerStyles.dayHeaderText}>{day}</Text>
          </View>
        ))}
      </View>

      <View style={containerStyles.calendarGrid}>
        {renderDays().map((week, weekIndex) => (
          <View key={weekIndex} style={containerStyles.weekRow}>
            {week}
          </View>
        ))}
      </View>
    </View>
  );
};

// Static styles that don't depend on theme
const styles = StyleSheet.create({
  dayContainer: {
    flex: 1,
    height: DAY_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// Dynamic styles that depend on theme
const createStyles = (theme: any) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    margin: theme.spacing.sm,
    shadowColor: theme.colors.shadow?.default || '#000',
    shadowOffset: { width: 0, height: theme.spacing.xs / 2 },
    shadowOpacity: 0.1,
    shadowRadius: theme.elevation?.sm?.shadowRadius || 4,
    elevation: theme.elevation?.sm?.elevation || 2,
    borderWidth: theme.borderWidth?.thin || 1,
    borderColor: theme.colors.border.primary,
  } as ViewStyle,

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  } as ViewStyle,

  headerTitle: {
    fontSize: theme.fontSizes.body,
    fontWeight: theme.fontConfig.fontWeight.semibold,
    color: theme.colors.text.primary,
    flex: 1,
  } as TextStyle,

  arrowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,

  arrow: {
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    marginHorizontal: theme.spacing.xs,
  } as ViewStyle,

  arrowDisabled: {
    opacity: 0.5,
  } as ViewStyle,

  daysHeader: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.xs,
  } as ViewStyle,

  dayHeaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,

  dayHeaderText: {
    fontSize: theme.fontSizes.caption,
    color: theme.colors.text.secondary,
    fontWeight: theme.fontConfig.fontWeight.medium,
  } as TextStyle,

  calendarGrid: {
    gap: theme.spacing.xs,
  } as ViewStyle,

  weekRow: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  } as ViewStyle,

  day: {
    width: DAY_SIZE - theme.spacing.sm,
    height: DAY_SIZE - theme.spacing.sm,
    borderRadius: (DAY_SIZE - theme.spacing.sm) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background.primary,
    shadowColor: theme.colors.shadow?.light || '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
  } as ViewStyle,

  dayText: {
    fontSize: theme.fontSizes.caption,
    color: theme.colors.text.primary,
    fontWeight: theme.fontConfig.fontWeight.regular,
  } as TextStyle,

  today: {
    borderWidth: theme.borderWidth?.medium || 2,
    borderColor: theme.colors.interactive.primary, // Academy purple
  } as ViewStyle,

  todayText: {
    fontWeight: theme.fontConfig.fontWeight.bold,
    color: theme.colors.interactive.primary, // Academy purple
  } as TextStyle,

  selected: {
    backgroundColor: theme.colors.interactive.primary, // Academy purple background
  } as ViewStyle,

  selectedText: {
    color: theme.colors.text.inverse, // White text on purple background
    fontWeight: theme.fontConfig.fontWeight.bold,
  } as TextStyle,
});

export default AcademyCalendar;