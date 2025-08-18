/**
 * DatePicker Component
 * 
 * A standalone date picker component with Academy theming.
 * Can be used as a modal or inline picker.
 */

import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar, CalendarProps } from './Calendar';
import { useTheme } from '../../theme';

export interface DatePickerProps extends Omit<CalendarProps, 'onDateSelect' | 'selectedDate'> {
  /** Selected date value */
  value?: string;
  /** Callback when date is selected */
  onDateChange?: (date: string) => void;
  /** Display format for the selected date */
  displayFormat?: 'short' | 'long' | 'custom';
  /** Custom format function */
  customFormat?: (date: string) => string;
  /** Placeholder text when no date is selected */
  placeholder?: string;
  /** Show as modal picker */
  modal?: boolean;
  /** Modal title */
  modalTitle?: string;
  /** Custom trigger component */
  renderTrigger?: (onPress: () => void, formattedDate: string) => React.ReactNode;
  /** Container styles */
  style?: ViewStyle;
  /** Disabled state */
  disabled?: boolean;
  /** Test ID for testing */
  testID?: string;
  /** Show clear button */
  showClearButton?: boolean;
  /** Callback when date is cleared */
  onClear?: () => void;
  /** Custom calendar props */
  calendarProps?: Partial<CalendarProps>;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onDateChange,
  displayFormat = 'short',
  customFormat,
  placeholder = "Select date",
  modal = true,
  modalTitle = "Select Date",
  renderTrigger,
  style,
  disabled = false,
  testID = "date-picker",
  showClearButton = false,
  onClear,
  calendarProps,
  ...calendarPropsRest
}) => {
  const { theme, screenDimensions } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [tempSelectedDate, setTempSelectedDate] = useState(value);
  
  const styles = createStyles(theme, screenDimensions);

  const formatDate = (date: string): string => {
    if (!date) return '';
    
    if (customFormat) {
      return customFormat(date);
    }
    
    const dateObj = new Date(date);
    
    switch (displayFormat) {
      case 'long':
        return dateObj.toLocaleDateString('en-US', { 
          weekday: 'long',
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      case 'short':
        return dateObj.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
      default:
        return date;
    }
  };

  const handleOpen = () => {
    if (disabled) return;
    setTempSelectedDate(value);
    setIsVisible(true);
  };

  const handleClose = () => {
    setIsVisible(false);
    setTempSelectedDate(value);
  };

  const handleConfirm = () => {
    if (tempSelectedDate) {
      onDateChange?.(tempSelectedDate);
    }
    setIsVisible(false);
  };

  const handleDateSelect = (date: string) => {
    if (modal) {
      setTempSelectedDate(date);
    } else {
      onDateChange?.(date);
    }
  };

  const handleClear = () => {
    onClear?.();
    onDateChange?.('');
    if (modal) {
      setIsVisible(false);
    }
  };

  const formattedDate = value ? formatDate(value) : placeholder;

  const renderDefaultTrigger = () => (
    <Pressable
      onPress={handleOpen}
      style={({ pressed }) => [
        styles.trigger,
        pressed && !disabled && styles.triggerPressed,
        disabled && styles.triggerDisabled,
      ]}
      disabled={disabled}
      testID={`${testID}-trigger`}
      accessibilityRole="button"
      accessibilityLabel={`Date picker, ${value ? `selected ${formattedDate}` : 'no date selected'}`}
      accessibilityHint="Tap to open date picker"
    >
      <Text style={[
        styles.triggerText,
        !value && styles.placeholderText,
        disabled && styles.disabledText,
      ]}>
        {formattedDate}
      </Text>
      
      <View style={styles.triggerActions}>
        {value && showClearButton && (
          <Pressable
            onPress={handleClear}
            style={styles.clearButton}
            testID={`${testID}-clear`}
            accessibilityRole="button"
            accessibilityLabel="Clear date"
            hitSlop={{
              top: theme.spacing.sm,
              bottom: theme.spacing.sm,
              left: theme.spacing.sm,
              right: theme.spacing.sm,
            }}
          >
            <Ionicons
              name="close-circle"
              size={theme.iconSize.sm}
              color={theme.colors.icon.tertiary}
            />
          </Pressable>
        )}
        
        <Ionicons
          name="calendar-outline"
          size={theme.iconSize.sm}
          color={disabled ? theme.colors.icon.disabled : theme.colors.icon.secondary}
        />
      </View>
    </Pressable>
  );

  const renderCalendar = () => (
    <Calendar
      {...calendarPropsRest}
      {...calendarProps}
      selectedDate={modal ? tempSelectedDate : value}
      onDateSelect={handleDateSelect}
      testID={`${testID}-calendar`}
      style={modal ? styles.modalCalendar : undefined}
    />
  );

  const renderModalActions = () => (
    <View style={styles.modalActions}>
      <Pressable
        onPress={handleClose}
        style={[styles.modalButton, styles.cancelButton]}
        testID={`${testID}-cancel`}
        accessibilityRole="button"
        accessibilityLabel="Cancel"
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </Pressable>
      
      <Pressable
        onPress={handleConfirm}
        style={[styles.modalButton, styles.confirmButton]}
        disabled={!tempSelectedDate}
        testID={`${testID}-confirm`}
        accessibilityRole="button"
        accessibilityLabel="Confirm selection"
      >
        <Text style={[
          styles.confirmButtonText,
          !tempSelectedDate && styles.disabledButtonText,
        ]}>
          Confirm
        </Text>
      </Pressable>
    </View>
  );

  if (!modal) {
    return (
      <View style={[styles.container, style]} testID={testID}>
        {renderTrigger ? renderTrigger(handleOpen, formattedDate) : renderDefaultTrigger()}
        {renderCalendar()}
      </View>
    );
  }

  return (
    <View style={[styles.container, style]} testID={testID}>
      {renderTrigger ? renderTrigger(handleOpen, formattedDate) : renderDefaultTrigger()}
      
      <Modal
        visible={isVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleClose}
        testID={`${testID}-modal`}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
          </View>
          
          <View style={styles.modalContent}>
            {renderCalendar()}
          </View>
          
          {renderModalActions()}
        </View>
      </Modal>
    </View>
  );
};

/**
 * Simple DatePicker for common use cases
 */
export const SimpleDatePicker: React.FC<{
  value?: string;
  onDateChange?: (date: string) => void;
  placeholder?: string;
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
}> = ({
  value,
  onDateChange,
  placeholder = "Select date",
  disabled = false,
  style,
  testID = "simple-date-picker",
}) => {
  return (
    <DatePicker
      value={value}
      onDateChange={onDateChange}
      placeholder={placeholder}
      disabled={disabled}
      style={style}
      testID={testID}
      modal={true}
      showClearButton={!!value}
      onClear={() => onDateChange?.('')}
    />
  );
};

const createStyles = (theme: any, screenDimensions: any) => {
  const isTablet = screenDimensions.isTablet;
  
  return StyleSheet.create({
    container: {
      marginVertical: theme.spacing.sm,
    },
    
    trigger: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.background.primary,
      borderWidth: theme.borderWidth.sm,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      minHeight: theme.safeArea.minTouchTarget.height,
    },
    
    triggerPressed: {
      backgroundColor: theme.colors.background.secondary,
      borderColor: theme.colors.border.focused,
    },
    
    triggerDisabled: {
      backgroundColor: theme.colors.background.secondary,
      opacity: 0.6,
    },
    
    triggerText: {
      fontSize: isTablet ? theme.fontSizes.body : theme.fontSizes.caption,
      fontWeight: theme.fontConfig.fontWeight.regular,
      color: theme.colors.text.primary,
      flex: 1,
    },
    
    placeholderText: {
      color: theme.colors.text.tertiary,
    },
    
    disabledText: {
      color: theme.colors.text.disabled,
    },
    
    triggerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    
    clearButton: {
      padding: theme.spacing.xs / 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    modalContainer: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    
    modalHeader: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: theme.borderWidth.sm,
      borderBottomColor: theme.colors.border.primary,
      backgroundColor: theme.colors.background.secondary,
    },
    
    modalTitle: {
      fontSize: isTablet ? theme.fontSizes.h3 : theme.fontSizes.h4,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
      textAlign: 'center',
    },
    
    modalContent: {
      flex: 1,
      paddingVertical: theme.spacing.lg,
    },
    
    modalCalendar: {
      marginHorizontal: 0,
      marginBottom: 0,
    },
    
    modalActions: {
      flexDirection: 'row',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      gap: theme.spacing.md,
      borderTopWidth: theme.borderWidth.sm,
      borderTopColor: theme.colors.border.primary,
      backgroundColor: theme.colors.background.secondary,
    },
    
    modalButton: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: theme.safeArea.minTouchTarget.height,
    },
    
    cancelButton: {
      backgroundColor: theme.colors.interactive.secondary,
      borderWidth: theme.borderWidth.sm,
      borderColor: theme.colors.interactive.secondaryBorder,
    },
    
    confirmButton: {
      backgroundColor: theme.colors.interactive.primary,
    },
    
    cancelButtonText: {
      fontSize: isTablet ? theme.fontSizes.body : theme.fontSizes.caption,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: theme.colors.text.primary,
    },
    
    confirmButtonText: {
      fontSize: isTablet ? theme.fontSizes.body : theme.fontSizes.caption,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: theme.colors.text.inverse,
    },
    
    disabledButtonText: {
      color: theme.colors.text.disabled,
    },
  });
};

export default DatePicker;