import React from 'react';
import { View, Text } from 'react-native';
import { useTheme, Header } from '@academy/mobile-shared';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const ServicesScreenSimple: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={{
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    }}>
      <Header
        title="Our Services"
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
          Our Services
        </Text>
        
        <Text style={{
          color: theme.colors.text.secondary,
          fontSize: theme.fontSizes.base,
          textAlign: 'center',
          lineHeight: 24,
        }}>
          Explore our professional services including personal training, group classes, and specialized coaching programs.
        </Text>
      </View>
    </View>
  );
};