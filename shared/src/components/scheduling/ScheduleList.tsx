import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, createThemedStyles } from '../../theme';

const { width } = Dimensions.get('window');

export interface ScheduleItem {
  id: string;
  title: string;
  time: string;
  sessionType: string;
  bookingType: string;
  recurrence?: string;
  status?: 'scheduled' | 'cancelled' | 'on-hold';
  participantCount?: number;
  image?: any;
}

export interface ScheduleColumnProps {
  dateLabel: string;
  schedules: ScheduleItem[];
  onAddSchedule?: () => void;
  onMenuPress?: () => void;
  onSchedulePress?: (schedule: ScheduleItem) => void;
  onParticipantsPress?: (schedule: ScheduleItem) => void;
  onStatusPress?: (schedule: ScheduleItem, status: string) => void;
}

export interface ScheduleListProps {
  columns: {
    dateLabel: string;
    schedules: ScheduleItem[];
  }[];
  onAddSchedule?: () => void;
  onMenuPress?: () => void;
  onSchedulePress?: (schedule: ScheduleItem) => void;
  onParticipantsPress?: (schedule: ScheduleItem) => void;
  onStatusPress?: (schedule: ScheduleItem, status: string) => void;
  onScroll?: (event: any) => void;
  flatListRef?: React.RefObject<FlatList>;
  horizontal?: boolean;
  pagingEnabled?: boolean;
}

const StatusChip: React.FC<{
  status: string;
  count: number;
  color: string;
  backgroundColor: string;
  borderColor: string;
  onPress?: () => void;
}> = ({ status, count, color, backgroundColor, borderColor, onPress }) => {
  const { theme } = useTheme();
  
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          backgroundColor,
          borderColor,
          borderWidth: 1,
          borderRadius: theme.borderRadius.full,
          paddingVertical: 2,
          paddingHorizontal: 8,
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.xs,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${status}: ${count} items`}
    >
      <View
        style={{
          backgroundColor: color,
          borderRadius: theme.borderRadius.full,
          height: 6,
          width: 6,
        }}
      />
      <Text style={{ fontSize: 10, fontWeight: '600', color }}>
        {status}
      </Text>
      <Text
        style={{
          fontSize: 10,
          backgroundColor: theme.colors.background.primary,
          borderRadius: theme.borderRadius.full,
          paddingHorizontal: 6,
          paddingVertical: 1,
        }}
      >
        {count}
      </Text>
    </TouchableOpacity>
  );
};

const ScheduleColumn: React.FC<ScheduleColumnProps> = ({
  dateLabel,
  schedules,
  onAddSchedule,
  onMenuPress,
  onSchedulePress,
  onParticipantsPress,
  onStatusPress,
}) => {
  const { theme } = useTheme();
  const styles = useThemedStyles();

  const renderScheduleItem = ({ item }: { item: ScheduleItem }) => (
    <TouchableOpacity
      style={styles.scheduleItem}
      onPress={() => onSchedulePress?.(item)}
      accessibilityRole="button"
      accessibilityLabel={`Schedule: ${item.title} at ${item.time}`}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{item.title}</Text>
        <TouchableOpacity onPress={onMenuPress} accessibilityRole="button" accessibilityLabel="More options">
          <Ionicons name="ellipsis-vertical" size={15} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      {item.recurrence && (
        <View style={styles.recurrenceChip}>
          <View style={styles.recurrenceDot} />
          <Text style={styles.recurrenceText}>{item.recurrence}</Text>
        </View>
      )}

      <View style={styles.statusContainer}>
        <StatusChip
          status="Scheduled"
          count={3}
          color="#067A58"
          backgroundColor="#067A580D"
          borderColor="#067A5833"
          onPress={() => onStatusPress?.(item, 'scheduled')}
        />
        <StatusChip
          status="Cancelled"
          count={3}
          color="#C73A3A"
          backgroundColor="#C73A3A0D"
          borderColor="#C73A3A0D"
          onPress={() => onStatusPress?.(item, 'cancelled')}
        />
        <StatusChip
          status="On Hold"
          count={3}
          color="#B9B9B9"
          backgroundColor="transparent"
          borderColor="#E7E7E7"
          onPress={() => onStatusPress?.(item, 'on-hold')}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.row}>
          <Ionicons name="time" size={20} color={theme.colors.text.secondary} />
          <Text style={styles.detailText}>{item.time}</Text>
        </View>
        <View style={styles.row}>
          <Ionicons name="location" size={20} color={theme.colors.text.secondary} />
          <Text style={styles.detailText}>{item.sessionType}</Text>
        </View>
        <View style={styles.row}>
          <Ionicons name="bookmark" size={20} color={theme.colors.text.secondary} />
          <Text style={styles.detailText}>{item.bookingType}</Text>
        </View>
        <TouchableOpacity
          style={styles.row}
          onPress={() => onParticipantsPress?.(item)}
          accessibilityRole="button"
          accessibilityLabel="Add or remove participants"
        >
          <Ionicons name="people" size={20} color={theme.colors.text.secondary} />
          <Text style={styles.detailText}>Add/Remove Participants</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.column}>
      <View style={styles.columnHeader}>
        <View style={styles.dateChip}>
          <Text style={styles.dateChipText}>{dateLabel}</Text>
        </View>
        <View style={styles.columnActions}>
          <TouchableOpacity onPress={onAddSchedule} accessibilityRole="button" accessibilityLabel="Add schedule">
            <Text style={styles.addButton}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={onMenuPress}
            accessibilityRole="button"
            accessibilityLabel="Column menu"
          >
            <Ionicons name="ellipsis-horizontal" size={15} color={theme.colors.text.secondary} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={schedules}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={renderScheduleItem}
        contentContainerStyle={styles.schedulesList}
      />
    </View>
  );
};

export const ScheduleList: React.FC<ScheduleListProps> = ({
  columns,
  onAddSchedule,
  onMenuPress,
  onSchedulePress,
  onParticipantsPress,
  onStatusPress,
  onScroll,
  flatListRef,
  horizontal = true,
  pagingEnabled = true,
}) => {
  const { theme } = useTheme();
  const styles = useThemedStyles();

  const renderColumn = ({ item }: { item: typeof columns[0] }) => (
    <ScheduleColumn
      dateLabel={item.dateLabel}
      schedules={item.schedules}
      onAddSchedule={onAddSchedule}
      onMenuPress={onMenuPress}
      onSchedulePress={onSchedulePress}
      onParticipantsPress={onParticipantsPress}
      onStatusPress={onStatusPress}
    />
  );

  return (
    <FlatList
      ref={flatListRef}
      data={columns}
      keyExtractor={(item, index) => index.toString()}
      horizontal={horizontal}
      pagingEnabled={pagingEnabled}
      onScroll={onScroll}
      scrollEventThrottle={16}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      renderItem={renderColumn}
    />
  );
};

const useThemedStyles = createThemedStyles((theme) => StyleSheet.create({
  listContainer: {
    padding: theme.spacing.md,
  },
  column: {
    width: width * 0.9,
    marginRight: theme.spacing.md,
  },
  columnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
  },
  dateChip: {
    backgroundColor: theme.colors.interactive.primary,
    borderRadius: theme.borderRadius.full,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  dateChipText: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text.inverse,
    fontWeight: theme.fontConfig.fontWeight.medium,
  },
  columnActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  addButton: {
    fontSize: 24,
    color: theme.colors.text.secondary,
  },
  menuButton: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  schedulesList: {
    paddingBottom: theme.spacing.lg,
  },
  scheduleItem: {
    backgroundColor: theme.colors.background.secondary,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    shadowColor: theme.colors.shadow.default,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontConfig.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  recurrenceChip: {
    backgroundColor: '#067A580D',
    borderColor: '#067A5833',
    borderWidth: 1,
    borderRadius: theme.borderRadius.full,
    paddingVertical: 2,
    paddingHorizontal: 8,
    marginTop: theme.spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    alignSelf: 'flex-start',
  },
  recurrenceDot: {
    backgroundColor: '#067A58',
    borderRadius: theme.borderRadius.full,
    height: 6,
    width: 6,
  },
  recurrenceText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#067A58',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  content: {
    marginTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  detailText: {
    fontSize: theme.fontSizes.body,
    color: theme.colors.text.secondary,
  },
}));

export default ScheduleList;