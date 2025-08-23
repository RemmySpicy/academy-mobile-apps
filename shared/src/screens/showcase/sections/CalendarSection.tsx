import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import type { ShowcaseSectionProps } from '../types/showcaseTypes';

// Calendar Components
import { Calendar, ClassroomCalendar, StudentProfileCalendar, AcademyCalendar } from '../../../components/calendar';
import { DatePicker } from '../../../components/calendar/DatePicker';

const CalendarSection: React.FC<ShowcaseSectionProps> = ({ theme, styles, screenDimensions }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>📅 Calendar System</Text>
      
      <Text style={styles.subsectionTitle}>Calendar</Text>
      <Calendar
        selectedDate={selectedDate ? selectedDate.toISOString().split('T')[0] : undefined}
        onDateSelect={(dateString) => setSelectedDate(new Date(dateString))}
        events={[
          {
            id: '1',
            date: new Date().toISOString().split('T')[0],
            title: 'Swimming Lesson',
            type: 'event',
          },
          {
            id: '2', 
            date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            title: 'Pool Maintenance',
            type: 'deadline',
          },
        ]}
        minDate={new Date().toISOString().split('T')[0]}
        maxDate={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
      />

      <Text style={styles.subsectionTitle}>DatePicker</Text>
      <DatePicker
        value={selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
        onDateChange={(date) => setSelectedDate(new Date(date))}
      />
      <Text style={styles.cardContent}>
        DatePicker component with Academy theming for session scheduling and event creation
      </Text>

      <Text style={styles.subsectionTitle}>ClassroomCalendar</Text>
      <ClassroomCalendar
        events={[
          {
            id: '1',
            date: new Date().getDate(),
            type: 'class',
          },
          {
            id: '2',
            date: new Date(Date.now() + 24 * 60 * 60 * 1000).getDate(),
            type: 'attendance',
          },
        ]}
      />
      <Text style={styles.cardContent}>
        ClassroomCalendar - Advanced calendar for pool scheduling, session management, and instructor assignments
      </Text>

      <Text style={styles.subsectionTitle}>StudentProfileCalendar</Text>
      <StudentProfileCalendar
        selectedDate={selectedDate}
        onDateSelect={(date) => setSelectedDate(date)}
        events={[
          {
            id: '1',
            date: new Date().getDate(),
            type: 'lesson',
            title: 'Swimming Practice',
          },
          {
            id: '2',
            date: new Date(Date.now() + 24 * 60 * 60 * 1000).getDate(),
            type: 'assignment',
            title: 'Advanced Techniques',
          },
        ]}
      />
      <Text style={styles.cardContent}>
        StudentProfileCalendar - Student-specific calendar with session tracking, progress monitoring, and achievement history
      </Text>

      <Text style={styles.subsectionTitle}>AcademyCalendar (New Consolidated)</Text>
      <AcademyCalendar
        variant="default"
        selectedDate={selectedDate}
        onDateSelect={(date) => setSelectedDate(date)}
        events={[
          {
            id: '1',
            date: 5,
            type: 'class',
            title: 'Swimming Lesson',
            color: 'purple'
          },
          {
            id: '2',
            date: 12,
            type: 'assignment',
            title: 'Pool Test',
            color: 'blue'
          },
          {
            id: '3',
            date: 18,
            type: 'exam',
            title: 'Level Assessment',
            color: 'red'
          },
          {
            id: '4',
            date: 25,
            type: 'holiday',
            title: 'Pool Closed',
            color: 'green'
          }
        ]}
        showNavigation={true}
        enableDateSelection={true}
      />
      <Text style={styles.cardContent}>
        AcademyCalendar - New consolidated calendar component that replaces both ClassroomCalendar and StudentProfileCalendar. Features full Sunday-first week layout, navigation controls, date selection, and comprehensive event highlighting.
      </Text>
    </View>
  );
};

export default CalendarSection;