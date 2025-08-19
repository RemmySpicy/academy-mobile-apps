/**
 * StudentProfileCalendar Component
 * 
 * A specialized calendar component for student profile views with navigation controls.
 * This is now a wrapper around the consolidated AcademyCalendar component.
 */

import React from 'react';
import { ViewStyle } from 'react-native';
import AcademyCalendar, { CalendarEvent } from './AcademyCalendar';

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
  currentMonth,
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
  // Convert StudentEvent[] to CalendarEvent[]
  const calendarEvents: CalendarEvent[] = events.map(event => ({
    id: event.id,
    date: event.date,
    type: event.type as CalendarEvent['type'],
    title: event.title,
    color: event.color,
  }));

  return (
    <AcademyCalendar
      currentMonth={currentMonth}
      onMonthChange={onMonthChange}
      events={calendarEvents}
      onDateSelect={onDateSelect}
      selectedDate={selectedDate}
      style={style}
      showHeader={showHeader}
      showNavigation={showNavigation}
      enableDateSelection={true} // Student calendar allows date selection
      variant="student"
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      disableFutureNavigation={disableFutureNavigation}
      disablePastNavigation={disablePastNavigation}
    />
  );
};

export default StudentProfileCalendar;