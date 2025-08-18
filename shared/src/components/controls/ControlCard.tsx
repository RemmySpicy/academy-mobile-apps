import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons, Entypo } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../../theme';

const { width } = Dimensions.get('window');

export interface QueryFilterItem {
  label: string;
  num: string;
}

export interface QuickFilterItem {
  label: string;
  count: string;
}

export interface ControlCardProps {
  schoolName?: string;
  dateSchedule?: string;
  dateSchedule2?: string;
  markedDates?: string[];
  queryFilter?: QueryFilterItem[];
  viewAll?: () => void;
  viewName?: string;
  groupName?: string;
  allNames?: string;
  quickFilter?: QuickFilterItem[];
  filterName?: string;
  moreInfo?: boolean;
  onDateSelect?: (date: string) => void;
  onSearchToggle?: (active: boolean) => void;
  activeSearch?: boolean;
  onFilterAction?: (action: string) => void;
  searchComponent?: React.ReactNode;
  filterComponent?: React.ReactNode;
  quickFilterComponent?: React.ReactNode;
}

const getWeekDates = (baseDate: string) => {
  const date = new Date(baseDate);
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay() + 1); // Monday
  
  return Array.from({ length: 7 }).map((_, i) => {
    const weekDate = new Date(startOfWeek);
    weekDate.setDate(startOfWeek.getDate() + i);
    return weekDate.toISOString().split('T')[0];
  });
};

export const ControlCard: React.FC<ControlCardProps> = ({
  schoolName,
  dateSchedule,
  dateSchedule2,
  markedDates = [],
  queryFilter,
  quickFilter,
  viewName,
  groupName,
  allNames,
  filterName,
  moreInfo = false,
  onDateSelect,
  onSearchToggle,
  activeSearch = false,
  onFilterAction,
  searchComponent,
  filterComponent,
  quickFilterComponent,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  const today = new Date().toISOString().split('T')[0];
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState(today);
  const weekDates = getWeekDates(today);

  const handleDateSelect = (date: string) => {
    setSelected(date);
    onDateSelect?.(date);
  };

  const handleSearchToggle = () => {
    onSearchToggle?.(!activeSearch);
  };

  const handleViewAll = () => {
    setModalVisible(true);
  };

  const generateMarkedDates = () => {
    let marked: any = {};
    weekDates.forEach((date) => {
      marked[date] = {
        customStyles: {
          container: {
            backgroundColor: date === today ? theme.colors.interactive.primary : theme.colors.background.primary,
            shadowColor: markedDates.includes(date) && date !== today 
              ? theme.colors.status.warning 
              : 'transparent',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.4,
            shadowRadius: 4,
            elevation: markedDates.includes(date) ? 5 : 0,
            borderRadius: theme.borderRadius.lg,
          },
          text: {
            color: date === today ? theme.colors.text.inverse : theme.colors.text.primary,
            fontWeight: date === today ? theme.fontConfig.fontWeight.bold : theme.fontConfig.fontWeight.regular,
          },
        },
      };
    });
    return marked;
  };

  const renderDayItem = ({ item }: { item: string }) => {
    const isToday = item === today;
    const isMarked = markedDates.includes(item);
    
    return (
      <TouchableOpacity 
        onPress={() => handleDateSelect(item)}
        accessibilityRole="button"
        accessibilityLabel={`Select date ${new Date(item).toLocaleDateString()}`}
      >
        <View
          style={[
            styles.dayBox,
            isToday && { backgroundColor: theme.colors.interactive.primary },
            isMarked && !isToday && styles.shadowBox,
          ]}
        >
          <View style={[!isToday && styles.offShadowBox]}>
            <Text style={[styles.dayNum, isToday && styles.todayText]}>
              {new Date(item).getDate()}
            </Text>
          </View>
          <Text style={[isToday ? styles.activeDayLabel : styles.dayLabel]}>
            {new Date(item).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View style={styles.container}>
        {/* Header */}
        {schoolName && (
          <View style={styles.header}>
            <Text style={styles.schoolName}>{schoolName}</Text>
            {moreInfo && (
              <TouchableOpacity 
                style={styles.moreBtn}
                accessibilityRole="button"
                accessibilityLabel="More options"
              >
                <Entypo name="dots-three-horizontal" size={15} color={theme.colors.text.primary} />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Query Filter Section */}
        {queryFilter && (
          <View style={styles.queryFilterContainer}>
            {queryFilter.map((item, index) => (
              <TouchableOpacity 
                key={index}
                accessibilityRole="button"
                accessibilityLabel={`${item.label}: ${item.num}`}
              >
                <View style={styles.queryFilterItem}>
                  <Text style={styles.queryFilterLabel}>{item.label}</Text>
                  <Text style={styles.queryFilterNumber}>{item.num}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Views Section */}
        {viewName && (
          <View>
            <Text style={styles.viewName}>{viewName}</Text>

            {/* Filter & Search Section */}
            {activeSearch ? (
              searchComponent || (
                <Text style={styles.placeholder}>Search component goes here</Text>
              )
            ) : (
              filterComponent || (
                <Text style={styles.placeholder}>Filter component goes here</Text>
              )
            )}
          </View>
        )}

        {/* Week Section */}
        {!activeSearch && dateSchedule && (
          <>
            <View style={styles.row}>
              <View style={styles.dateContainer}>
                <Text style={styles.dateSchedule}>{dateSchedule}</Text>
                <Text style={styles.dateSchedule2}>{dateSchedule2}</Text>
              </View>
              <TouchableOpacity
                style={styles.viewAllBtn}
                onPress={handleViewAll}
                accessibilityRole="button"
                accessibilityLabel="View all dates in calendar"
              >
                <Text style={styles.viewAllText}>View all</Text>
                <Ionicons name="arrow-forward" size={14} color={theme.colors.interactive.primary} />
              </TouchableOpacity>
            </View>

            {/* Mini Week View */}
            <FlatList
              horizontal
              data={weekDates}
              keyExtractor={(item) => item}
              contentContainerStyle={styles.weekRow}
              showsHorizontalScrollIndicator={false}
              renderItem={renderDayItem}
              accessibilityRole="list"
            />
          </>
        )}

        {/* Quick Filter */}
        {quickFilter && (
          quickFilterComponent || (
            <Text style={styles.placeholder}>Quick filter component goes here</Text>
          )
        )}
      </View>

      {/* Full Calendar Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        accessibilityViewIsModal={true}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={() => setModalVisible(false)}
              accessibilityRole="button"
              accessibilityLabel="Close calendar"
            >
              <Ionicons name="close" size={18} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>
          <DateTimePicker
            value={new Date(selected)}
            mode="date"
            display="default"
            onChange={(event, date) => {
              if (date) {
                handleDateSelect(date.toISOString().split('T')[0]);
                setModalVisible(false);
              }
            }}
            accessibilityViewIsModal={true}
          />
        </View>
      </Modal>
    </>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    marginHorizontal: theme.spacing.lg,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.background.secondary,
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
    marginBottom: theme.spacing.sm,
  },
  schoolName: {
    fontSize: theme.fontSizes.body,
    color: theme.colors.text.primary,
    fontWeight: theme.fontConfig.fontWeight.medium,
  },
  moreBtn: {
    backgroundColor: theme.colors.background.primary,
    height: 24,
    width: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  queryFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: theme.spacing.sm,
  },
  queryFilterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  queryFilterLabel: {
    fontSize: theme.fontSizes.caption,
    color: theme.colors.text.secondary,
  },
  queryFilterNumber: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.interactive.primary,
    fontWeight: theme.fontConfig.fontWeight.semiBold,
  },
  viewName: {
    fontSize: theme.fontSizes.small,
    paddingBottom: theme.spacing.xs,
    color: theme.colors.text.primary,
  },
  placeholder: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
    padding: theme.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  dateSchedule: {
    fontSize: theme.fontSizes.small,
    fontWeight: theme.fontConfig.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  dateSchedule2: {
    fontSize: theme.fontSizes.caption,
    color: theme.colors.text.secondary,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    color: theme.colors.interactive.primary,
    fontSize: theme.fontSizes.small,
    marginRight: theme.spacing.xs,
  },
  weekRow: {
    marginTop: theme.spacing.md,
    justifyContent: 'space-between',
  },
  dayBox: {
    width: 40,
    height: 60,
    marginRight: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadowBox: {
    shadowColor: theme.colors.status.warning,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
  },
  offShadowBox: {
    backgroundColor: theme.colors.interactive.faded || '#DCD5F4',
    padding: 7,
    borderRadius: theme.borderRadius.full,
  },
  dayNum: {
    fontSize: theme.fontSizes.small,
    fontWeight: theme.fontConfig.fontWeight.semiBold,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.primary,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: theme.borderRadius.lg,
  },
  dayLabel: {
    fontSize: theme.fontSizes.caption,
    color: theme.colors.text.tertiary,
  },
  activeDayLabel: {
    fontSize: theme.fontSizes.caption,
    paddingTop: theme.spacing.xs,
    color: theme.colors.text.inverse,
  },
  todayText: {
    color: theme.colors.text.primary,
  },
  modalContent: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
    paddingTop: 40,
    paddingHorizontal: theme.spacing.md,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
});

export default ControlCard;