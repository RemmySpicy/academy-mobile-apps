import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useTheme } from '@academy/mobile-shared';

export const LoadingScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <ActivityIndicator 
        size="large" 
        color={theme.colors.interactive.primary} 
      />
      <Text style={styles.text}>
        Loading Academy Instructors...
      </Text>
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
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
});