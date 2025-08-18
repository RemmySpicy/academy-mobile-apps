import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@academy/mobile-shared';

const createStyles = (theme: any) => StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background.secondary,
    },
    title: {
      color: theme.colors.text.primary,
      fontSize: theme.fontSizes.xl,
      fontWeight: theme.fontConfig.fontWeight.semibold,
    },
    subtitle: {
      color: theme.colors.text.secondary,
      fontSize: theme.fontSizes.base,
      marginTop: theme.spacing.xs,
    },
});

export const BookingDetailScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Detail Screen</Text>
      <Text style={styles.subtitle}>Coming soon...</Text>
    </View>
  );
};