import React, { useState } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { SelectOptions } from '../ui';
import { useTheme } from '../../theme';

export interface ScheduleSelections {
  sessionType: string | null;
  skillLevel: string | null;
  scheduleType: string | null;
}

export interface ScheduleTypeSelectorProps {
  onSelectionChange?: (selections: ScheduleSelections) => void;
  initialSelections?: Partial<ScheduleSelections>;
  sessionOptions?: string[];
  skillOptions?: string[];
  scheduleOptions?: string[];
  disabled?: boolean;
  variant?: 'default' | 'compact';
}

const ScheduleTypeSelector: React.FC<ScheduleTypeSelectorProps> = ({
  onSelectionChange,
  initialSelections = {},
  sessionOptions = ['Group', 'Private'],
  skillOptions = ['Beginner', 'Intermediate', 'Advanced', 'Swim Team'],
  scheduleOptions = ['One Time', 'Recurring'],
  disabled = false,
  variant = 'default',
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [selections, setSelections] = useState<ScheduleSelections>({
    sessionType: initialSelections.sessionType || null,
    skillLevel: initialSelections.skillLevel || null,
    scheduleType: initialSelections.scheduleType || null,
  });

  const handleSelectionChange = (type: keyof ScheduleSelections, value: string[]) => {
    const selectedValue = value.length > 0 ? value[0] : null;
    const newSelections = {
      ...selections,
      [type]: selectedValue,
    };
    
    setSelections(newSelections);
    onSelectionChange?.(newSelections);
  };

  const getSelectOptions = (options: string[]) => {
    return options.map(option => ({
      id: option.toLowerCase().replace(/\s+/g, '-'),
      label: option,
      value: option,
    }));
  };

  const containerStyle = variant === 'compact' ? styles.compactContainer : styles.container;

  return (
    <View style={containerStyle}>
      {/* Session Type */}
      <View style={styles.dropdownContainer}>
        <SelectOptions
          title="Session Type"
          options={getSelectOptions(sessionOptions)}
          value={selections.sessionType ? [selections.sessionType] : []}
          onSelectionChange={(selected) => handleSelectionChange('sessionType', selected as string[])}
          multiSelect={false}
          disabled={disabled}
        />
      </View>

      {/* Skill Level */}
      <View style={styles.dropdownContainer}>
        <SelectOptions
          title="Skill Level"
          options={getSelectOptions(skillOptions)}
          value={selections.skillLevel ? [selections.skillLevel] : []}
          onSelectionChange={(selected) => handleSelectionChange('skillLevel', selected as string[])}
          multiSelect={false}
          disabled={disabled}
        />
      </View>

      {/* Schedule Type */}
      <View style={styles.dropdownContainer}>
        <SelectOptions
          title="Schedule Type"
          options={getSelectOptions(scheduleOptions)}
          value={selections.scheduleType ? [selections.scheduleType] : []}
          onSelectionChange={(selected) => handleSelectionChange('scheduleType', selected as string[])}
          multiSelect={false}
          disabled={disabled}
        />
      </View>
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    zIndex: 50,
    gap: theme.spacing.md,
  },
  compactContainer: {
    zIndex: 50,
    gap: theme.spacing.sm,
  },
  dropdownContainer: {
    marginBottom: theme.spacing.sm,
  },
});

export default ScheduleTypeSelector;