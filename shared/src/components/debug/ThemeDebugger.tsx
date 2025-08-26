/**
 * Theme Debug Component
 * 
 * Helps diagnose why StyleSheet.create works on web but not mobile
 */
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../theme';

export const ThemeDebugger: React.FC = () => {
  const { theme } = useTheme();

  // Test 1: Direct inline styles (should work everywhere)
  const inlineStyles = {
    backgroundColor: theme.colors.interactive.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  };

  // Test 2: StyleSheet.create with theme (fails on mobile?)
  const stylesheetStyles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.interactive.primary,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginTop: 10,
    },
    text: {
      color: theme.colors.text.inverse,
      fontSize: theme.fontSizes.base,
      fontWeight: theme.fontConfig.fontWeight.medium,
    }
  });

  // Test 3: StyleSheet.create without theme reference
  const staticStyles = StyleSheet.create({
    container: {
      backgroundColor: '#4F2EC9',
      padding: 16,
      borderRadius: 12,
      marginTop: 10,
    },
    text: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '500' as const,
    }
  });

  console.log('🐛 Theme Debug Info:', {
    platform: Platform.OS,
    themeExists: !!theme,
    primaryColor: theme?.colors?.interactive?.primary,
    spacing: theme?.spacing?.md,
    borderRadius: theme?.borderRadius?.md,
  });

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ marginBottom: 10, fontSize: 16, fontWeight: 'bold' }}>
        Theme Debug Test - {Platform.OS}
      </Text>

      {/* Test 1: Inline styles */}
      <View style={inlineStyles}>
        <Text style={{ color: theme.colors.text.inverse }}>
          ✅ Inline Styles (should work)
        </Text>
      </View>

      {/* Test 2: StyleSheet with theme */}
      <View style={stylesheetStyles.container}>
        <Text style={stylesheetStyles.text}>
          🤔 StyleSheet + Theme (may fail on mobile)
        </Text>
      </View>

      {/* Test 3: Static StyleSheet */}
      <View style={staticStyles.container}>
        <Text style={staticStyles.text}>
          📝 Static StyleSheet (should work)
        </Text>
      </View>

      <Text style={{ marginTop: 20, fontSize: 12 }}>
        Check console for theme object details
      </Text>
    </View>
  );
};

export default ThemeDebugger;