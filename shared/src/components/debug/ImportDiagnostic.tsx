/**
 * Import Diagnostic
 * 
 * Helps diagnose if mobile apps are successfully importing the shared library
 */
import React from 'react';
import { View, Text, Platform } from 'react-native';
import { useTheme } from '../../theme';

export const ImportDiagnostic: React.FC = () => {
  const themeData = useTheme();
  const { theme } = themeData;

  // Check if we're getting the full shared theme or fallback theme
  const diagnostics = {
    platform: Platform.OS,
    
    // Theme source detection
    hasFullTheme: !!(theme?.colors?.interactive?.primary && 
                     theme?.spacing?.[4] && 
                     theme?.borderWidth?.sm &&
                     theme?.elevation?.sm?.shadowRadius),
    
    // Check specific theme properties that differ between full and fallback
    primaryColor: theme?.colors?.interactive?.primary,
    hasNumericSpacing: !!(theme?.spacing?.[4]),
    hasSemanticSpacing: !!(theme?.spacing?.md),
    hasCompleteElevation: !!(theme?.elevation?.sm?.shadowRadius),
    hasBorderWidthThin: !!(theme?.borderWidth?.xs),
    hasComponentSpacing: !!(theme?.componentSpacing?.form?.fieldGap),
    
    // Context completeness
    contextKeys: Object.keys(themeData || {}),
    themeKeys: theme ? Object.keys(theme).slice(0, 10) : [],
    
    // Determine likely theme source
    likelySource: (() => {
      if (theme?.colors?.interactive?.primary === '#4F2EC9' && theme?.spacing?.[4] === 16) {
        return 'FULL_SHARED_THEME';
      } else if (theme?.colors?.interactive?.primary === '#4F2EC9') {
        return 'FALLBACK_THEME';
      } else {
        return 'UNKNOWN_THEME';
      }
    })()
  };

  console.log('📊 Import Diagnostic Results:', diagnostics);

  return (
    <View style={{ 
      padding: 20, 
      backgroundColor: theme?.colors?.background?.secondary || '#f5f5f5',
      borderRadius: 8,
      margin: 10 
    }}>
      <Text style={{ 
        fontSize: 16, 
        fontWeight: 'bold', 
        marginBottom: 10,
        color: theme?.colors?.text?.primary || '#000'
      }}>
        📊 Import Diagnostic - {Platform.OS.toUpperCase()}
      </Text>

      <Text style={{ fontSize: 14, marginBottom: 5, color: theme?.colors?.text?.primary || '#000' }}>
        Theme Source: {diagnostics.likelySource}
      </Text>

      <Text style={{ fontSize: 12, marginBottom: 3, color: theme?.colors?.text?.secondary || '#666' }}>
        Has Full Theme: {diagnostics.hasFullTheme ? '✅' : '❌'}
      </Text>

      <Text style={{ fontSize: 12, marginBottom: 3, color: theme?.colors?.text?.secondary || '#666' }}>
        Primary Color: {diagnostics.primaryColor}
      </Text>

      <Text style={{ fontSize: 12, marginBottom: 3, color: theme?.colors?.text?.secondary || '#666' }}>
        Numeric Spacing: {diagnostics.hasNumericSpacing ? '✅' : '❌'} | Semantic: {diagnostics.hasSemanticSpacing ? '✅' : '❌'}
      </Text>

      <Text style={{ fontSize: 12, marginBottom: 3, color: theme?.colors?.text?.secondary || '#666' }}>
        Complete Elevation: {diagnostics.hasCompleteElevation ? '✅' : '❌'}
      </Text>

      <Text style={{ fontSize: 12, marginBottom: 10, color: theme?.colors?.text?.secondary || '#666' }}>
        Component Spacing: {diagnostics.hasComponentSpacing ? '✅' : '❌'}
      </Text>

      <Text style={{ fontSize: 11, color: theme?.colors?.text?.tertiary || '#999' }}>
        Check console for full diagnostic data
      </Text>
    </View>
  );
};

export default ImportDiagnostic;