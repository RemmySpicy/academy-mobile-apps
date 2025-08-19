/**
 * Calendar Component
 * 
 * A custom calendar component with Academy theming.
 * Supports event marking, selection states, and responsive design.
 */

import React, { useState, useMemo } from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD format
  title?: string;
  color?: string;
  type?: 'event' | 'deadline' | 'meeting' | 'holiday';
}

export interface CalendarProps {
  /** Current selected date */
  selectedDate?: string;
  /** Callback when date is selected */
  onDateSelect?: (date: string) => void;
  /** Array of events to display */
  events?: CalendarEvent[];
  /** Current month to display (YYYY-MM format) */
  currentMonth?: string;
  /** Callback when month changes */
  onMonthChange?: (month: string) => void;
  /** Minimum selectable date */
  minDate?: string;
  /** Maximum selectable date */
  maxDate?: string;
  /** Custom container styles */
  style?: ViewStyle;
  /** Hide navigation arrows */
  hideArrows?: boolean;
  /** Show month/year header */
  showHeader?: boolean;
  /** Custom day cell renderer */
  renderDay?: (date: string, isSelected: boolean, hasEvent: boolean) => React.ReactNode;
  /** Test ID for testing */
  testID?: string;
  /** Disabled dates */
  disabledDates?: string[];
  /** First day of week (0 = Sunday, 1 = Monday) */
  firstDayOfWeek?: number;
}

export const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onDateSelect,
  events = [],
  currentMonth,
  onMonthChange,
  minDate,
  maxDate,
  style,
  hideArrows = false,
  showHeader = true,
  renderDay,
  testID = "calendar",
  disabledDates = [],
  firstDayOfWeek = 1, // Monday by default
}) => {
  const { theme, screenDimensions } = useTheme();
  
  // Current displayed month state
  const [displayMonth, setDisplayMonth] = useState(() => {
    if (currentMonth) return currentMonth;
    if (selectedDate) return selectedDate.substring(0, 7);
    return new Date().toISOString().substring(0, 7);
  });

  const currentDisplayMonth = currentMonth || displayMonth;
  const styles = createStyles(theme, screenDimensions);

  // Generate calendar data
  const calendarData = useMemo(() => {
    const year = parseInt(currentDisplayMonth.split('-')[0]);
    const month = parseInt(currentDisplayMonth.split('-')[1]) - 1;
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Adjust first day of week
    let firstDayOfMonth = firstDay.getDay();
    firstDayOfMonth = (firstDayOfMonth - firstDayOfWeek + 7) % 7;
    
    const weeks: (string | null)[][] = [];
    let currentWeek: (string | null)[] = Array(firstDayOfMonth).fill(null);
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      currentWeek.push(dateString);
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    
    // Fill remaining days
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }
    
    return { weeks, monthName: firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) };
  }, [currentDisplayMonth, firstDayOfWeek]);

  // Event lookup for performance
  const eventMap = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    events.forEach(event => {
      const existing = map.get(event.date) || [];
      map.set(event.date, [...existing, event]);
    });
    return map;
  }, [events]);

  const handlePrevMonth = () => {
    const [year, month] = currentDisplayMonth.split('-').map(Number);
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const newMonth = `${prevYear}-${String(prevMonth).padStart(2, '0')}`;
    
    if (currentMonth) {
      onMonthChange?.(newMonth);
    } else {
      setDisplayMonth(newMonth);
    }
  };

  const handleNextMonth = () => {
    const [year, month] = currentDisplayMonth.split('-').map(Number);
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const newMonth = `${nextYear}-${String(nextMonth).padStart(2, '0')}`;
    
    if (currentMonth) {
      onMonthChange?.(newMonth);
    } else {
      setDisplayMonth(newMonth);
    }
  };

  const handleDatePress = (date: string) => {
    if (disabledDates.includes(date)) return;
    if (minDate && date < minDate) return;
    if (maxDate && date > maxDate) return;
    
    onDateSelect?.(date);
  };

  const isDateDisabled = (date: string) => {
    return disabledDates.includes(date) ||
           (minDate && date < minDate) ||
           (maxDate && date > maxDate);
  };

  const renderDayCell = (date: string | null, weekIndex: number, dayIndex: number) => {
    if (!date) return <View key={`empty-${weekIndex}-${dayIndex}`} style={styles.dayCell} />;
    
    const isSelected = selectedDate === date;
    const hasEvents = eventMap.has(date);
    const isDisabled = isDateDisabled(date);
    const isToday = date === new Date().toISOString().split('T')[0];
    
    if (renderDay) {
      return (
        <Pressable
          key={date}
          style={styles.dayCell}
          onPress={() => handleDatePress(date)}
          disabled={isDisabled}
          testID={`${testID}-day-${date}`}
        >
          {renderDay(date, isSelected, hasEvents)}
        </Pressable>
      );
    }
    
    const dayEvents = eventMap.get(date) || [];
    const eventColor = dayEvents[0]?.color || theme.colors.interactive.primary;
    
    return (
      <Pressable
        key={date}
        style={({ pressed }) => [
          styles.dayCell,
          isSelected && styles.selectedDay,
          isToday && styles.todayDay,
          hasEvents && styles.eventDay,
          pressed && !isDisabled && styles.pressedDay,
          isDisabled && styles.disabledDay,
        ]}
        onPress={() => handleDatePress(date)}
        disabled={isDisabled}
        testID={`${testID}-day-${date}`}
        accessibilityRole="button"
        accessibilityLabel={`${date}${isSelected ? ', selected' : ''}${hasEvents ? ', has events' : ''}`}
        accessibilityState={{ selected: isSelected, disabled: isDisabled }}
      >
        <Text style={[
          styles.dayText,
          isSelected && styles.selectedDayText,
          isToday && styles.todayDayText,
          isDisabled && styles.disabledDayText,
        ]}>
          {parseInt(date.split('-')[2])}
        </Text>
        
        {hasEvents && (
          <View style={[styles.eventIndicator, { backgroundColor: eventColor }]} />
        )}
      </Pressable>
    );
  };

  const weekDays = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    // Rotate based on firstDayOfWeek
    return [...days.slice(firstDayOfWeek), ...days.slice(0, firstDayOfWeek)];
  }, [firstDayOfWeek]);

  return (
    <View style={[styles.container, style]} testID={testID}>
      {/* Header */}
      {showHeader && (
        <View style={styles.header}>
          {!hideArrows && (
            <Pressable
              onPress={handlePrevMonth}
              style={styles.arrowButton}
              testID={`${testID}-prev`}
              accessibilityRole="button"
              accessibilityLabel="Previous month"
            >
              <Ionicons
                name="chevron-back"
                size={theme.iconSize.md}
                color={theme.colors.icon.primary}
              />
            </Pressable>
          )}
          
          <Text style={styles.monthTitle}>
            {calendarData.monthName}
          </Text>
          
          {!hideArrows && (
            <Pressable
              onPress={handleNextMonth}
              style={styles.arrowButton}
              testID={`${testID}-next`}
              accessibilityRole="button"
              accessibilityLabel="Next month"
            >
              <Ionicons
                name="chevron-forward"
                size={theme.iconSize.md}
                color={theme.colors.icon.primary}
              />
            </Pressable>
          )}
        </View>
      )}

      {/* Week day headers */}
      <View style={styles.weekDaysRow}>
        {weekDays.map((day) => (
          <View key={day} style={styles.weekDayCell}>
            <Text style={styles.weekDayText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={styles.calendarGrid}>
        {calendarData.weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.weekRow}>
            {week.map((date, dayIndex) => renderDayCell(date, weekIndex, dayIndex))}
          </View>
        ))}
      </View>
    </View>
  );
};

const createStyles = (theme: any, screenDimensions: any) => {
  const isTablet = screenDimensions.isTablet;
  const daySize = isTablet ? 48 : 36;
  
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.lg,
      ...theme.elevation.sm,
    },
    
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      borderBottomWidth: theme.borderWidth.sm,
      borderBottomColor: theme.colors.border.primary,
    },
    
    arrowButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: theme.safeArea.minTouchTarget.width,
      minHeight: theme.safeArea.minTouchTarget.height,
    },
    
    monthTitle: {
      fontSize: isTablet ? theme.fontSizes.h3 : theme.fontSizes.h4,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
      textAlign: 'center',
      flex: 1,
    },
    
    weekDaysRow: {
      flexDirection: 'row',
      marginBottom: theme.spacing.sm,
    },
    
    weekDayCell: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
    },
    
    weekDayText: {
      fontSize: isTablet ? theme.fontSizes.caption * 1.1 : theme.fontSizes.caption,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: theme.colors.text.secondary,
      textAlign: 'center',
    },
    
    calendarGrid: {
      gap: theme.spacing.xs,
    },
    
    weekRow: {
      flexDirection: 'row',
      gap: theme.spacing.xs,
    },
    
    dayCell: {
      flex: 1,
      width: daySize,
      height: daySize,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: daySize / 2,
      backgroundColor: theme.colors.background.primary,
      position: 'relative',
    },
    
    selectedDay: {
      backgroundColor: theme.colors.interactive.primary,
      ...theme.elevation.md,
    },
    
    todayDay: {
      borderWidth: theme.borderWidth.md,
      borderColor: theme.colors.interactive.faded,
    },
    
    eventDay: {
      borderWidth: theme.borderWidth.md,
      borderColor: theme.colors.interactive.primary,
    },
    
    pressedDay: {
      opacity: 0.8,
      transform: [{ scale: 0.95 }],
    },
    
    disabledDay: {
      opacity: 0.3,
    },
    
    dayText: {
      fontSize: isTablet ? theme.fontSizes.caption * 1.1 : theme.fontSizes.caption,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: theme.colors.text.primary,
      textAlign: 'center',
    },
    
    selectedDayText: {
      color: theme.colors.text.inverse,
      fontWeight: theme.fontConfig.fontWeight.semibold,
    },
    
    todayDayText: {
      color: theme.colors.interactive.primary,
      fontWeight: theme.fontConfig.fontWeight.semibold,
    },
    
    disabledDayText: {
      color: theme.colors.text.disabled,
    },
    
    eventIndicator: {
      position: 'absolute',
      bottom: theme.spacing.xs / 2,
      width: theme.spacing.xs,
      height: theme.spacing.xs,
      borderRadius: theme.borderRadius.full,
    },
  });
};

export default Calendar;