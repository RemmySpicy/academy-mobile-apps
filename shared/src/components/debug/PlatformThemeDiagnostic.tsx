/**
 * Platform Theme Diagnostic
 * 
 * Diagnoses differences between web and mobile theme application
 */
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../theme';

export const PlatformThemeDiagnostic: React.FC = () => {
  const themeData = useTheme();
  const { theme } = themeData;

  // Test styles using both inline and StyleSheet approaches
  const inlineTestStyle = {
    backgroundColor: theme?.colors?.interactive?.primary || '#4F2EC9',
    padding: theme?.spacing?.md || theme?.spacing?.[4] || 16,
    marginBottom: theme?.spacing?.sm || theme?.spacing?.[2] || 8,
    borderRadius: theme?.borderRadius?.md || 8,
    borderWidth: theme?.borderWidth?.sm || 1,
    borderColor: theme?.colors?.border?.primary || '#e5e7eb',
  };

  const stylesheetTestStyles = StyleSheet.create({
    container: {
      backgroundColor: theme?.colors?.background?.secondary || '#f5f5f5',
      padding: theme?.spacing?.lg || theme?.spacing?.[6] || 24,
      borderRadius: theme?.borderRadius?.lg || 12,
    },
    testBox: {
      backgroundColor: theme?.colors?.interactive?.primary || '#4F2EC9',
      padding: theme?.spacing?.md || theme?.spacing?.[4] || 16,
      marginBottom: theme?.spacing?.sm || theme?.spacing?.[2] || 8,
      borderRadius: theme?.borderRadius?.md || 8,
      borderWidth: theme?.borderWidth?.sm || 1,
      borderColor: theme?.colors?.border?.primary || '#e5e7eb',
    },
    text: {
      color: theme?.colors?.text?.primary || '#000000',
      fontSize: theme?.fontSizes?.base || 16,
      fontWeight: theme?.fontConfig?.fontWeight?.medium || '500',
      marginBottom: theme?.spacing?.xs || 4,
    },
    whiteText: {
      color: theme?.colors?.text?.inverse || '#ffffff',
      fontSize: theme?.fontSizes?.base || 16,
      fontWeight: theme?.fontConfig?.fontWeight?.medium || '500',
    }
  });

  // Detailed theme inspection
  const themeInspection = {
    platform: Platform.OS,
    hasThemeContext: !!themeData,
    hasTheme: !!theme,
    themeKeys: theme ? Object.keys(theme) : [],
    
    // Color system
    hasColors: !!theme?.colors,
    primaryColor: theme?.colors?.interactive?.primary,
    textColor: theme?.colors?.text?.primary,
    
    // Spacing system  
    hasSpacing: !!theme?.spacing,
    spacingType: typeof theme?.spacing,
    spacingKeys: theme?.spacing ? Object.keys(theme.spacing).slice(0, 10) : [],
    spacingMd: theme?.spacing?.md,
    spacing4: theme?.spacing?.[4],
    
    // Typography
    hasFontSizes: !!theme?.fontSizes,
    fontSizeBase: theme?.fontSizes?.base,
    hasFontConfig: !!theme?.fontConfig,
    
    // Other systems
    hasBorderRadius: !!theme?.borderRadius,
    hasBorderWidth: !!theme?.borderWidth,
    hasElevation: !!theme?.elevation,
    
    // Context extras
    hasScreenDimensions: !!(themeData as any).screenDimensions,
    contextKeys: Object.keys(themeData || {}),
  };

  console.log(`🔍 Platform Theme Diagnostic [${Platform.OS}]:`, themeInspection);

  return (
    <View style={stylesheetTestStyles.container}>
      <Text style={stylesheetTestStyles.text}>
        🔍 Platform Theme Diagnostic - {Platform.OS.toUpperCase()}
      </Text>

      <Text style={stylesheetTestStyles.text}>
        Theme Status: {!!theme ? '✅ Available' : '❌ Missing'}
      </Text>

      <Text style={stylesheetTestStyles.text}>
        Primary Color: {theme?.colors?.interactive?.primary || 'undefined'}
      </Text>

      <Text style={stylesheetTestStyles.text}>
        Spacing MD: {theme?.spacing?.md || 'undefined'} | Spacing[4]: {theme?.spacing?.[4] || 'undefined'}
      </Text>

      <Text style={stylesheetTestStyles.text}>
        Font Size Base: {theme?.fontSizes?.base || 'undefined'}
      </Text>

      <Text style={stylesheetTestStyles.text}>
        Border Radius MD: {theme?.borderRadius?.md || 'undefined'}
      </Text>

      <View style={inlineTestStyle}>
        <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: '500' }}>
          ✅ INLINE STYLES (should always work)
        </Text>
      </View>

      <View style={stylesheetTestStyles.testBox}>
        <Text style={stylesheetTestStyles.whiteText}>
          🤔 STYLESHEET STYLES (may fail on mobile)
        </Text>
      </View>

      <Text style={[stylesheetTestStyles.text, { marginTop: 16, fontSize: 12 }]}>
        Check console for detailed theme inspection
      </Text>

      <Text style={[stylesheetTestStyles.text, { fontSize: 11, opacity: 0.7 }]}>
        Context Keys: {Object.keys(themeData || {}).join(', ')}
      </Text>
    </View>
  );
};

export default PlatformThemeDiagnostic;