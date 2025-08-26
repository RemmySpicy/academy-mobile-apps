/**
 * StyleSheet Tester Component
 * 
 * Tests if StyleSheet.create works properly with the theme system
 */
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../theme';

export const StyleSheetTester: React.FC = () => {
  const { theme } = useTheme();

  // Test StyleSheet.create with theme
  const styles = StyleSheet.create({
    container: {
      padding: theme.spacing?.md || 16,
      margin: theme.spacing?.sm || 8,
      backgroundColor: theme.colors?.background?.secondary || '#f5f5f5',
      borderRadius: theme.borderRadius?.md || 8,
      borderWidth: theme.borderWidth?.sm || 1,
      borderColor: theme.colors?.border?.primary || '#e5e7eb',
    },
    title: {
      fontSize: theme.fontSizes?.lg || 18,
      fontWeight: theme.fontConfig?.fontWeight?.semibold || '600',
      color: theme.colors?.text?.primary || '#000000',
      marginBottom: theme.spacing?.xs || 4,
    },
    text: {
      fontSize: theme.fontSizes?.base || 16,
      color: theme.colors?.text?.secondary || '#666666',
      lineHeight: theme.typography?.lineHeight?.body || 24,
    },
    button: {
      backgroundColor: theme.colors?.interactive?.primary || '#4F2EC9',
      padding: theme.spacing?.sm || 8,
      borderRadius: theme.borderRadius?.sm || 4,
      marginTop: theme.spacing?.md || 16,
    },
    buttonText: {
      color: theme.colors?.text?.inverse || '#ffffff',
      fontSize: theme.fontSizes?.base || 16,
      fontWeight: theme.fontConfig?.fontWeight?.medium || '500',
      textAlign: 'center',
    },
  });

  // Log theme structure for debugging
  console.log('🎨 StyleSheetTester - Theme structure check:', {
    platform: Platform.OS,
    hasTheme: !!theme,
    hasColors: !!theme?.colors,
    hasSpacing: !!theme?.spacing,
    hasFontSizes: !!theme?.fontSizes,
    hasBorderRadius: !!theme?.borderRadius,
    hasBorderWidth: !!theme?.borderWidth,
    primaryColor: theme?.colors?.interactive?.primary,
    mediumSpacing: theme?.spacing?.md,
    baseFontSize: theme?.fontSizes?.base,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        StyleSheet Test - {Platform.OS}
      </Text>
      
      <Text style={styles.text}>
        This component uses StyleSheet.create() with the theme system.
        If you can see proper styling, the theme integration is working correctly.
      </Text>

      <View style={styles.button}>
        <Text style={styles.buttonText}>
          Test Button Style
        </Text>
      </View>

      <Text style={[styles.text, { marginTop: 10, fontSize: 12 }]}>
        Check console logs for theme structure details
      </Text>
    </View>
  );
};

export default StyleSheetTester;