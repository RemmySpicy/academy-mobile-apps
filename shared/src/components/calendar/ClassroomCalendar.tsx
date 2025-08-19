/**
 * ClassroomCalendar Component
 * 
 * A specialized calendar component for classroom scheduling and attendance tracking.
 * This is now a wrapper around the consolidated AcademyCalendar component.
 */

import React from 'react';
import { ViewStyle } from 'react-native';
import AcademyCalendar, { CalendarEvent } from './AcademyCalendar';

export interface ClassroomEvent {
  id: string;
  date: number; // Day of month
  type: 'class' | 'exam' | 'meeting' | 'holiday' | 'attendance';
  color?: 'purple' | 'red' | 'green' | 'orange';
  title?: string;
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
  currentMonth,
  onMonthChange,
  events = [],
  style,
  showHeader = true,
  testID,
  accessibilityLabel = 'Classroom Calendar',
}) => {
  // Convert ClassroomEvent[] to CalendarEvent[]
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
      style={style}
      showHeader={showHeader}
      showNavigation={false} // Classroom calendar typically doesn't have navigation
      enableDateSelection={false} // Classroom calendar is usually display-only
      variant="classroom"
      testID={testID}
      accessibilityLabel={accessibilityLabel}
    />
  );
};

export default ClassroomCalendar;