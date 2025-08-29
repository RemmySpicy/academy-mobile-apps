import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../theme';

export interface SettingsSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  style?: any;
  delay?: number;
  showDivider?: boolean;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  subtitle,
  children,
  style,
  delay = 0,
  showDivider = false,
}) => {
  const { theme } = useTheme();

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify()}
      style={[
        {
          paddingHorizontal: theme.spacing.md,
          marginBottom: theme.spacing.xl,
        },
        style,
      ]}
    >
      {/* Section Header */}
      <View style={{ marginBottom: theme.spacing.md }}>
        <Text style={{
          color: theme.colors.text.primary,
          fontSize: theme.fontSizes.lg,
          fontWeight: theme.fontConfig.fontWeight.semibold,
        }}>
          {title}
        </Text>
        
        {subtitle && (
          <Text style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.sm,
            marginTop: theme.spacing.xs,
            lineHeight: 20,
          }}>
            {subtitle}
          </Text>
        )}
        
        {showDivider && (
          <View style={{
            height: 1,
            backgroundColor: theme.colors.border.primary,
            marginTop: theme.spacing.md,
            opacity: 0.3,
          }} />
        )}
      </View>

      {/* Section Content */}
      {children}
    </Animated.View>
  );
};