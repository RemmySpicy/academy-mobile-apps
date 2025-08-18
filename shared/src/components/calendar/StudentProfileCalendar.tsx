/**
 * StudentProfileCalendar Component
 * 
 * A specialized calendar component for student profile views with navigation controls.
 * Features Academy theming, event highlighting, month navigation, and responsive design.
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

const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const { width } = Dimensions.get('window');
const DAY_SIZE = (width - 40) / 7;

export interface StudentEvent {
  id: string;
  date: number; // Day of month
  type: 'assignment' | 'test' | 'project' | 'lesson' | 'exam';
  title?: string;
  color?: 'purple' | 'red' | 'green' | 'orange' | 'blue';
}

export interface StudentProfileCalendarProps {
  /** Current month to display */
  currentMonth?: Date;
  /** Callback when month changes */
  onMonthChange?: (month: Date) => void;
  /** Array of student events to display */
  events?: StudentEvent[];
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
  /** Test ID for testing */
  testID?: string;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Disable navigation to future months */
  disableFutureNavigation?: boolean;
  /** Disable navigation to past months */
  disablePastNavigation?: boolean;
}

const StudentProfileCalendar: React.FC<StudentProfileCalendarProps> = ({
  currentMonth: propCurrentMonth,
  onMonthChange,
  events = [],
  onDateSelect,
  selectedDate,
  style,
  showHeader = true,
  showNavigation = true,
  testID,
  accessibilityLabel = 'Student Calendar',
  disableFutureNavigation = false,
  disablePastNavigation = false,
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
      const color = event.color || (event.type === 'assignment' ? 'purple' : 'red');
      newHighlightedDates[dateKey] = color;
    });

    // If no events provided, generate sample data for demonstration
    if (events.length === 0) {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const daysInMonth = getDaysInMonth(year, month);

      for (let i = 1; i <= daysInMonth; i++) {
        if (i % 3 === 1) {
          newHighlightedDates[i.toString()] = 'purple';
        } else if (i === 11) {
          newHighlightedDates[i.toString()] = 'red';
        }
      }
    }

    setHighlightedDates(newHighlightedDates);
  }, [currentMonth, events]);

  const getDaysInMonth = useCallback((year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  }, []);

  const getFirstDayOfMonth = useCallback((year: number, month: number): number => {
    // Get day of week (0-6, where 0 is Sunday)
    const day = new Date(year, month, 1).getDay();
    // Convert to 0-6 where 0 is Monday
    return day === 0 ? 6 : day - 1;
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
  const headerTitle = useMemo(() => {
    const today = new Date();
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    const month = monthNames[currentMonth.getMonth()];
    const date = today.getDate();
    const suffix = getSuffix(date);

    return `${month} ${date}${suffix} till date (Current Term)`;
  }, [currentMonth, getSuffix]);

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
    if (onDateSelect) {
      const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      onDateSelect(selectedDate);
    }
  }, [currentMonth, onDateSelect]);

  const isDateSelected = useCallback((day: number): boolean => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getFullYear() === currentMonth.getFullYear()
    );
  }, [selectedDate, currentMonth]);

  const renderDays = useCallback(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days: React.ReactNode[] = [];

    // Add empty spaces for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayContainer} />);
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

      days.push(
        <TouchableOpacity
          key={`day-${i}`}
          style={styles.dayContainer}
          onPress={() => handleDatePress(i)}
          accessible={true}
          accessibilityLabel={`${i} ${isToday ? 'today' : ''} ${isHighlighted ? 'has events' : ''} ${isSelected ? 'selected' : ''}`}
          accessibilityRole="button"
          activeOpacity={0.7}
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
        </TouchableOpacity>
      );
    }

    return days;
  }, [
    currentMonth, 
    highlightedDates, 
    getDaysInMonth, 
    getFirstDayOfMonth, 
    getHighlightColor, 
    theme, 
    handleDatePress, 
    isDateSelected
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
          <Text style={containerStyles.headerTitle}>{headerTitle}</Text>
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
                  size={24} 
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
                  size={24} 
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

      <ScrollView 
        contentContainerStyle={containerStyles.daysContainer}
        showsVerticalScrollIndicator={false}
        accessible={false}
      >
        {renderDays()}
      </ScrollView>
    </View>
  );
};

// Static styles that don't depend on theme
const styles = StyleSheet.create({
  dayContainer: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
});

// Dynamic styles that depend on theme
const createStyles = (theme: any) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    margin: theme.spacing.sm,
    shadowColor: theme.colors.shadow.default,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
  } as ViewStyle,

  arrowDisabled: {
    opacity: 0.5,
  } as ViewStyle,

  daysHeader: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  } as ViewStyle,

  dayHeaderContainer: {
    width: DAY_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,

  dayHeaderText: {
    fontSize: theme.fontSizes.caption,
    color: theme.colors.text.secondary,
    fontWeight: theme.fontConfig.fontWeight.medium,
  } as TextStyle,

  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  } as ViewStyle,

  day: {
    width: DAY_SIZE - 20,
    height: DAY_SIZE - 20,
    borderRadius: (DAY_SIZE - 20) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background.primary,
    shadowColor: theme.colors.shadow.light,
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
    borderWidth: 2,
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

export default StudentProfileCalendar;