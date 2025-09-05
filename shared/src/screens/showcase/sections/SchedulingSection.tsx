import React from 'react';
import { View, Text } from 'react-native';

// Scheduling Components
import { ScheduleInput, ScheduleList, Schedules, ScheduleTypeSelector, FilterBar as ScheduleFilterBar } from '../../../components/scheduling';

// Types
import { ShowcaseSectionProps } from '../types/showcaseTypes';

const SchedulingSection: React.FC<ShowcaseSectionProps> = ({ theme, styles }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>📋 Scheduling Components</Text>
      
      <Text style={styles.subsectionTitle}>ScheduleFilterBar</Text>
      <ScheduleFilterBar
        label="Schedule Views"
        filters={[
          { id: 'calendar', label: 'Calendar', icon: 'calendar', active: true },
          { id: 'list', label: 'List', icon: 'list' },
          { id: 'today', label: 'Today', icon: 'today' },
          { id: 'week', label: 'Week', icon: 'calendar-outline' },
          { id: 'search', label: 'Search', icon: 'search' },
        ]}
        onFilterPress={(filterId) => console.log('Filter pressed:', filterId)}
      />
      <Text style={styles.cardContent}>
        ScheduleFilterBar - Filter component for schedule views with Academy theming and icon support
      </Text>

      <Text style={styles.subsectionTitle}>ScheduleFilterBar (Compact)</Text>
      <ScheduleFilterBar
        variant="compact"
        filters={[
          { id: 'all', label: 'All', icon: 'eye', active: true },
          { id: 'group', label: 'Group', icon: 'people' },
          { id: 'private', label: 'Private', icon: 'person' },
          { id: 'cancelled', label: 'Cancelled', icon: 'close' },
        ]}
        onFilterPress={(filterId) => console.log('Compact filter pressed:', filterId)}
      />
      <Text style={styles.cardContent}>
        ScheduleFilterBar (Compact) - Space-efficient filter variant for narrow layouts
      </Text>
      
      {/* BookingCard showcase removed - using app-specific implementations
      <Text style={styles.subsectionTitle}>BookingCard</Text>
      <BookingCard
        booking={{
          id: '1',
          courseTitle: 'Advanced Swimming Technique',
          courseLevel: 'Level 4 - Competitive',
          instructor: 'Coach Sarah Miller',
          date: 'Today, March 15',
          time: '2:00 PM - 3:30 PM',
          location: 'Pool A - Lane 3-4',
          status: 'upcoming',
          price: 85,
          sessionNumber: 8,
          totalSessions: 16,
          color: theme.colors.interactive.primary,
        }}
        onPress={(booking) => console.log('Booking card pressed:', booking)}
        onStatusPress={(booking) => console.log('Status pressed:', booking)}
      />
      <Text style={styles.cardContent}>
        BookingCard - Comprehensive booking display with progress tracking, status management, and Academy theming
      </Text>

      <Text style={styles.subsectionTitle}>BookingCard (Different Statuses)</Text>
      <View style={{ gap: theme.spacing.sm }}>
        <BookingCard
          booking={{
            id: '2',
            courseTitle: 'Beginner Water Safety',
            courseLevel: 'Level 1 - Foundation',
            instructor: 'Coach Mike Johnson',
            date: 'Tomorrow, March 16',
            time: '10:00 AM - 11:00 AM',
            location: 'Pool B - Shallow End',
            status: 'completed',
            price: 45,
            sessionNumber: 4,
            totalSessions: 8,
            color: theme.colors.status.success,
          }}
          variant="compact"
          showProgress={false}
          onPress={(booking) => console.log('Completed booking pressed:', booking)}
        />
        
        <BookingCard
          booking={{
            id: '3',
            courseTitle: 'Stroke Refinement',
            courseLevel: 'Level 3 - Intermediate',
            instructor: 'Coach Emma Davis',
            date: 'March 18, 2024',
            time: '4:00 PM - 5:00 PM',
            location: 'Pool A - Lane 1-2',
            status: 'cancelled',
            price: 65,
            sessionNumber: 2,
            totalSessions: 12,
            color: theme.colors.status.error,
          }}
          variant="compact"
          onPress={(booking) => console.log('Cancelled booking pressed:', booking)}
        />
      </View>
      <Text style={styles.cardContent}>
        BookingCard variants showing different status states (completed, cancelled) with compact display
      </Text>
      */}

      <Text style={styles.subsectionTitle}>ScheduleInput</Text>
      <ScheduleInput
        classTitle="Advanced Technique Session"
        date={new Date()}
        startTime={new Date(new Date().setHours(9, 0, 0, 0))}
        endTime={new Date(new Date().setHours(10, 0, 0, 0))}
        onClassTitleChange={(title) => console.log('Class title changed:', title)}
        onDateChange={(date) => console.log('Date changed:', date)}
        onStartTimeChange={(time) => console.log('Start time changed:', time)}
        onEndTimeChange={(time) => console.log('End time changed:', time)}
      />
      <Text style={styles.cardContent}>
        ScheduleInput - Enhanced input component for creating and editing session schedules with Academy theming
      </Text>

      <Text style={styles.subsectionTitle}>ScheduleList</Text>
      <ScheduleList
        columns={[
          {
            dateLabel: 'Today',
            schedules: [
              {
                id: '1',
                title: 'Morning Swimming',
                time: '09:00-10:00',
                sessionType: 'Group Training',
                bookingType: 'Regular',
                status: 'scheduled',
                participantCount: 6,
              },
              {
                id: '2',
                title: 'Afternoon Training',
                time: '14:00-15:30',
                sessionType: 'Advanced',
                bookingType: 'Premium',
                status: 'scheduled',
                participantCount: 10,
              },
            ],
          },
          {
            dateLabel: 'Tomorrow',
            schedules: [
              {
                id: '3',
                title: 'Evening Session',
                time: '18:00-19:00',
                sessionType: 'Beginner',
                bookingType: 'Regular',
                status: 'scheduled',
                participantCount: 4,
              },
            ],
          },
        ]}
        onSchedulePress={(schedule) => console.log('Schedule pressed:', schedule)}
        onParticipantsPress={(schedule) => console.log('Participants pressed:', schedule)}
        onStatusPress={(schedule, status) => console.log('Status changed:', schedule, status)}
      />
      <Text style={styles.cardContent}>
        ScheduleList - List component for displaying multiple schedule items with sorting and filtering capabilities
      </Text>

      <Text style={styles.subsectionTitle}>Schedules</Text>
      <Schedules
        scheduleData={[
          {
            dateLabel: 'This Week',
            schedules: [
              {
                id: '1',
                title: 'Weekly Swimming Program',
                time: '09:00-10:00',
                sessionType: 'Regular • Group • All Levels',
                bookingType: '8/12 Booked',
                recurrence: 'Mon, Wed, Fri',
                status: 'scheduled',
                participantCount: 8,
              },
              {
                id: '2',
                title: 'Advanced Training',
                time: '14:00-15:30',
                sessionType: 'Advanced • Group • Competitive',
                bookingType: '6/8 Booked',
                recurrence: 'Tue, Thu',
                status: 'scheduled',
                participantCount: 6,
              },
            ],
          },
        ]}
        onSchedulePress={(schedule) => console.log('Schedule pressed:', schedule)}
        onAddSchedule={() => console.log('Add new schedule')}
        onParticipantsPress={(schedule) => console.log('Participants pressed:', schedule)}
      />
      <Text style={styles.cardContent}>
        Schedules - Comprehensive schedule management component with CRUD operations and recurring schedule support
      </Text>

      <Text style={styles.subsectionTitle}>ScheduleTypeSelector</Text>
      <ScheduleTypeSelector
        onSelectionChange={(selections) => console.log('Schedule selections changed:', selections)}
        initialSelections={{
          sessionType: 'Group',
          skillLevel: 'Intermediate',
          scheduleType: 'Recurring',
        }}
        sessionOptions={['Group', 'Private', 'Semi-Private']}
        skillOptions={['Beginner', 'Intermediate', 'Advanced', 'Swim Team', 'Masters']}
        scheduleOptions={['One Time', 'Recurring', 'Package Deal']}
        variant="default"
      />
      <Text style={styles.cardContent}>
        ScheduleTypeSelector - Multi-dropdown component for comprehensive schedule configuration with session type, skill level, and schedule pattern selection
      </Text>
    </View>
  );
};

export default SchedulingSection;