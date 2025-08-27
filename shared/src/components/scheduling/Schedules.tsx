import React, { useRef } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { ScheduleList, ScheduleItem } from './ScheduleList';
import { useTheme, createThemedStyles } from '../../theme';

export interface SchedulesProps {
  scheduleData?: {
    dateLabel: string;
    schedules: ScheduleItem[];
  }[];
  onScroll?: (event: any) => void;
  onAddSchedule?: () => void;
  onMenuPress?: () => void;
  onSchedulePress?: (schedule: ScheduleItem) => void;
  onParticipantsPress?: (schedule: ScheduleItem) => void;
  onStatusPress?: (schedule: ScheduleItem, status: string) => void;
  horizontal?: boolean;
  pagingEnabled?: boolean;
}

// Default sample data
const defaultScheduleData = [
  {
    dateLabel: "Tuesday 20th - Today",
    schedules: [
      {
        id: "1",
        title: "Preschool 1 & 2 Noon",
        time: "11:00am - 11:40am",
        sessionType: "Kids • Group • Intermediate Level",
        bookingType: "3 Booked • 2 Open",
        recurrence: "Every Tuesday",
        status: "scheduled" as const,
        participantCount: 5,
      },
      {
        id: "2",
        title: "Adult Swimming",
        time: "2:00pm - 3:00pm",
        sessionType: "Adults • Group • Beginner Level",
        bookingType: "5 Booked • 3 Open",
        recurrence: "Every Tuesday",
        status: "scheduled" as const,
        participantCount: 8,
      },
    ],
  },
  {
    dateLabel: "Wednesday 21st",
    schedules: [
      {
        id: "3",
        title: "Teen Swimming",
        time: "4:00pm - 5:00pm",
        sessionType: "Teens • Group • Advanced Level",
        bookingType: "4 Booked • 1 Open",
        recurrence: "Every Wednesday",
        status: "scheduled" as const,
        participantCount: 5,
      },
    ],
  },
  {
    dateLabel: "Friday 22nd",
    schedules: [
      {
        id: "4",
        title: "Family Swimming",
        time: "10:00am - 11:30am",
        sessionType: "Family • Group • All Levels",
        bookingType: "6 Booked • 4 Open",
        recurrence: "Every Friday",
        status: "scheduled" as const,
        participantCount: 10,
      },
    ],
  },
];

export const Schedules: React.FC<SchedulesProps> = ({
  scheduleData = defaultScheduleData,
  onScroll,
  onAddSchedule,
  onMenuPress,
  onSchedulePress,
  onParticipantsPress,
  onStatusPress,
  horizontal = true,
  pagingEnabled = true,
}) => {
  const { theme } = useTheme();
  const styles = useThemedStyles();
  const flatListRef = useRef<FlatList>(null);

  const handleAddSchedule = () => {
    console.log('Add schedule pressed');
    onAddSchedule?.();
  };

  const handleMenuPress = () => {
    console.log('Menu pressed');
    onMenuPress?.();
  };

  const handleSchedulePress = (schedule: ScheduleItem) => {
    console.log('Schedule pressed:', schedule.title);
    onSchedulePress?.(schedule);
  };

  const handleParticipantsPress = (schedule: ScheduleItem) => {
    console.log('Participants pressed for:', schedule.title);
    onParticipantsPress?.(schedule);
  };

  const handleStatusPress = (schedule: ScheduleItem, status: string) => {
    console.log('Status pressed:', status, 'for:', schedule.title);
    onStatusPress?.(schedule, status);
  };

  return (
    <View style={styles.container}>
      <ScheduleList
        columns={scheduleData}
        onAddSchedule={handleAddSchedule}
        onMenuPress={handleMenuPress}
        onSchedulePress={handleSchedulePress}
        onParticipantsPress={handleParticipantsPress}
        onStatusPress={handleStatusPress}
        onScroll={onScroll}
        flatListRef={flatListRef}
        horizontal={horizontal}
        pagingEnabled={pagingEnabled}
      />
    </View>
  );
};

const useThemedStyles = createThemedStyles((theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
}));

export default Schedules;