import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

const { width } = Dimensions.get('window');

export interface ScheduleInputProps {
  classTitle?: string;
  date?: Date;
  startTime?: Date;
  endTime?: Date;
  onClassTitleChange?: (title: string) => void;
  onDateChange?: (date: Date) => void;
  onStartTimeChange?: (time: Date) => void;
  onEndTimeChange?: (time: Date) => void;
  classTitlePlaceholder?: string;
  dateLabel?: string;
  timeLabel?: string;
  startTimeLabel?: string;
  endTimeLabel?: string;
  disabled?: boolean;
}

export const ScheduleInput: React.FC<ScheduleInputProps> = ({
  classTitle = '',
  date = new Date(),
  startTime = new Date(),
  endTime = new Date(),
  onClassTitleChange,
  onDateChange,
  onStartTimeChange,
  onEndTimeChange,
  classTitlePlaceholder = 'Enter class title',
  dateLabel = 'Select Date',
  timeLabel = 'Set Time',
  startTimeLabel = 'Start Time',
  endTimeLabel = 'End Time',
  disabled = false,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      onDateChange?.(selectedDate);
    }
  };

  const handleStartTimeChange = (event: any, selectedTime?: Date) => {
    setShowStartPicker(false);
    if (selectedTime) {
      onStartTimeChange?.(selectedTime);
    }
  };

  const handleEndTimeChange = (event: any, selectedTime?: Date) => {
    setShowEndPicker(false);
    if (selectedTime) {
      onEndTimeChange?.(selectedTime);
    }
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      {/* Class Title Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Class Title</Text>
        <TextInput
          style={[styles.textInput, disabled && styles.disabledInput]}
          placeholder={classTitlePlaceholder}
          placeholderTextColor={theme.colors.text.tertiary}
          value={classTitle}
          onChangeText={onClassTitleChange}
          editable={!disabled}
          accessibilityLabel="Class title input"
          accessibilityHint="Enter the title for your class"
        />
      </View>

      {/* Date Picker */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{dateLabel}</Text>
        <TouchableOpacity
          style={[styles.pickerButton, disabled && styles.disabledInput]}
          onPress={() => setShowDatePicker(true)}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel={`Select date, currently ${date.toDateString()}`}
        >
          <Text style={[styles.pickerText, disabled && styles.disabledText]}>
            {date.toDateString()}
          </Text>
          <Ionicons 
            name="calendar" 
            size={24} 
            color={disabled ? theme.colors.text.disabled : theme.colors.text.secondary} 
          />
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}
      </View>

      {/* Time Picker */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{timeLabel}</Text>
        <View style={styles.timeContainer}>
          <TouchableOpacity
            style={[styles.timeButton, disabled && styles.disabledInput]}
            onPress={() => setShowStartPicker(true)}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={`Select start time, currently ${formatTime(startTime)}`}
          >
            <Text style={[styles.timeText, disabled && styles.disabledText]}>
              {formatTime(startTime)}
            </Text>
          </TouchableOpacity>

          <Text style={styles.toText}>To</Text>

          <TouchableOpacity
            style={[styles.timeButton, disabled && styles.disabledInput]}
            onPress={() => setShowEndPicker(true)}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={`Select end time, currently ${formatTime(endTime)}`}
          >
            <Text style={[styles.timeText, disabled && styles.disabledText]}>
              {formatTime(endTime)}
            </Text>
          </TouchableOpacity>
        </View>

        {showStartPicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleStartTimeChange}
          />
        )}

        {showEndPicker && (
          <DateTimePicker
            value={endTime}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleEndTimeChange}
          />
        )}
      </View>
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    gap: theme.spacing.md,
  },
  inputGroup: {
    gap: theme.spacing.xs,
  },
  label: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text.secondary,
    fontWeight: theme.fontConfig.fontWeight.medium,
  },
  textInput: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.secondary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  pickerText: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text.primary,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeButton: {
    width: width * 0.35,
    backgroundColor: theme.colors.background.secondary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    alignItems: 'center',
  },
  timeText: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  toText: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text.secondary,
    paddingHorizontal: theme.spacing.md,
  },
  disabledInput: {
    backgroundColor: theme.colors.background.tertiary,
    borderColor: theme.colors.border.secondary,
    opacity: 0.6,
  },
  disabledText: {
    color: theme.colors.text.disabled,
  },
});

export default ScheduleInput;