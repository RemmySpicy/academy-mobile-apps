import React from 'react';
import { View, Text } from 'react-native';
import { useTheme, Header } from '@academy/mobile-shared';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const ScheduleScreenSimple: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={{
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    }}>
      <Header
        title="My Schedule"
        showBackButton={true}
        style={{ paddingTop: insets.top }}
      />
      
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
      }}>
        <Text style={{
          color: theme.colors.text.primary,
          fontSize: theme.fontSizes.xl,
          fontWeight: theme.fontConfig.fontWeight.bold,
          textAlign: 'center',
          marginBottom: theme.spacing.md,
        }}>
          My Schedule
        </Text>
        
        <Text style={{
          color: theme.colors.text.secondary,
          fontSize: theme.fontSizes.base,
          textAlign: 'center',
          lineHeight: 24,
        }}>
          View and manage your upcoming classes, training sessions, and appointments.
        </Text>
      </View>
    </View>
  );
};