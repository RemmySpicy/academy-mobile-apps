import React from 'react';
import { Switch, Platform } from 'react-native';
import { useTheme } from '../../theme';

export interface SettingsSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  size?: 'small' | 'medium';
}

export const SettingsSwitch: React.FC<SettingsSwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
  size = 'medium',
}) => {
  const { theme } = useTheme();

  const trackColorEnabled = theme.colors.interactive.primary;
  const trackColorDisabled = theme.colors.border.primary;
  
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{
        false: trackColorDisabled,
        true: trackColorEnabled,
      }}
      thumbColor={value ? '#ffffff' : '#f4f3f4'}
      ios_backgroundColor={trackColorDisabled}
      style={[
        size === 'small' && Platform.OS === 'ios' && {
          transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }]
        }
      ]}
    />
  );
};