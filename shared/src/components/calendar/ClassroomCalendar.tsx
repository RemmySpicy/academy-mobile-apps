/**
 * ClassroomCalendar Component
 * 
 * A specialized calendar component for classroom scheduling and attendance tracking.
 * Features Academy theming, event highlighting, and responsive design.
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const { width } = Dimensions.get('window');
const DAY_SIZE = (width - 40) / 7;

export interface ClassroomEvent {
  id: string;
  date: number; // Day of month
  type: 'class' | 'exam' | 'meeting' | 'holiday' | 'attendance';
  color?: 'purple' | 'red' | 'green' | 'orange';
}

export interface ClassroomCalendarProps {
  /** Current month to display */
  currentMonth?: Date;
  /** Callback when month changes */
  onMonthChange?: (month: Date) => void;
  /** Array of classroom events to display */
  events?: ClassroomEvent[];
  /** Custom container styles */
  style?: ViewStyle;
  /** Show header with current term info */
  showHeader?: boolean;
  /** Test ID for testing */
  testID?: string;
  /** Accessibility label */
  accessibilityLabel?: string;
}

const ClassroomCalendar: React.FC<ClassroomCalendarProps> = ({
  currentMonth: propCurrentMonth,
  onMonthChange,
  events = [],
  style,
  showHeader = true,
  testID,
  accessibilityLabel = 'Classroom Calendar',
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
      const color = event.color || (event.type === 'class' ? 'purple' : 'red');
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
      default:
        return theme.colors.interactive.primary + '20';
    }
  }, [theme]);

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

      days.push(
        <View key={`day-${i}`} style={styles.dayContainer}>
          <View
            style={[
              createStyles(theme).day,
              isHighlighted && {
                backgroundColor: getHighlightColor(isHighlighted),
              },
              isToday && createStyles(theme).today,
            ]}
            accessible={true}
            accessibilityLabel={`${i} ${isToday ? 'today' : ''} ${isHighlighted ? 'has events' : ''}`}
            accessibilityRole="button"
          >
            <Text 
              style={[
                createStyles(theme).dayText, 
                isToday && createStyles(theme).todayText
              ]}
            >
              {i}
            </Text>
          </View>
        </View>
      );
    }

    return days;
  }, [currentMonth, highlightedDates, getDaysInMonth, getFirstDayOfMonth, getHighlightColor, theme]);

  const containerStyles = createStyles(theme);

  return (
    <View 
      style={[containerStyles.container, style]}
      testID={testID}
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="none"
    >
      {showHeader && (
        <View style={containerStyles.headerContainer}>
          <Text style={containerStyles.headerTitle}>{headerTitle}</Text>
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

  headerContainer: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  } as ViewStyle,

  headerTitle: {
    fontSize: theme.fontSizes.body,
    fontWeight: theme.fontConfig.fontWeight.semibold,
    color: theme.colors.text.primary,
    textAlign: 'left',
  } as TextStyle,

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
});

export default ClassroomCalendar;