import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
// Fallback theme if shared library isn't available
let useTheme: any;
try {
  ({ useTheme } = require('shared'));
} catch {
  useTheme = () => ({ 
    theme: { 
      colors: { 
        background: { primary: '#fff' },
        interactive: { primary: '#4F2EC9' },
        text: { secondary: '#666' }
      }
    }
  });
}

export const LoadingScreen: React.FC = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <ActivityIndicator 
        size="large" 
        color={theme.colors.interactive.primary} 
      />
      <Text style={[styles.text, { color: theme.colors.text.secondary }]}>
        Loading Academy Instructors...
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  text: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
});