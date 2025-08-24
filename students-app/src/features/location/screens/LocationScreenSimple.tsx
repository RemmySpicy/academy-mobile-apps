import React from 'react';
import { View, Text } from 'react-native';
import { useTheme, Header } from '@academy/mobile-shared';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const LocationScreenSimple: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={{
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    }}>
      <Header
        title="Locate Us"
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
          Find Our Locations
        </Text>
        
        <Text style={{
          color: theme.colors.text.secondary,
          fontSize: theme.fontSizes.base,
          textAlign: 'center',
          lineHeight: 24,
        }}>
          Visit any of our convenient locations for world-class training and facilities. Find directions, hours, and contact information here.
        </Text>
      </View>
    </View>
  );
};