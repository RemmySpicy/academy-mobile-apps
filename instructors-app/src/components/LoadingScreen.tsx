import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useTheme, createThemedStyles } from '@academy/mobile-shared';

export const LoadingScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = useThemedStyles();

  return (
    <View style={styles.container}>
      <ActivityIndicator 
        size="large" 
        color={theme.colors.interactive.primary} 
      />
      <Text style={styles.text}>
        Loading Elitesgen Academy Instructors...
      </Text>
    </View>
  );
};

const useThemedStyles = createThemedStyles((theme) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
  },
  text: {
    fontSize: theme.fontSizes.base,
    marginTop: theme.spacing.md,
    textAlign: 'center',
    color: theme.colors.text.secondary,
  },
}));