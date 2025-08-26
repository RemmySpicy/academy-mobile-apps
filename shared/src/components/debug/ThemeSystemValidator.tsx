/**
 * Theme System Validator
 * 
 * Comprehensive test to validate that the theme system works properly
 * across different component patterns and access methods.
 */
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../theme';

export const ThemeSystemValidator: React.FC = () => {
  const { theme, screenDimensions } = useTheme();

  // Test all the different ways components access theme properties
  const testResults = {
    // Spacing tests
    spacingNumeric: !!theme.spacing?.[4], // theme.spacing[4]
    spacingSemantic: !!theme.spacing?.md, // theme.spacing.md
    
    // BorderWidth tests
    borderWidthSm: !!theme.borderWidth?.sm, // theme.borderWidth.sm
    borderWidthThin: !!theme.borderWidth?.xs, // theme.borderWidth.xs
    
    // Elevation tests
    elevationSm: !!theme.elevation?.sm, // theme.elevation.sm
    elevationShadowRadius: !!theme.elevation?.sm?.shadowRadius, // theme.elevation.sm.shadowRadius
    
    // Color tests
    primaryColor: !!theme.colors?.interactive?.primary,
    textColor: !!theme.colors?.text?.primary,
    statusColor: !!theme.colors?.status?.success,
    iconColor: !!theme.colors?.icon?.primary,
    
    // Font tests
    fontSize: !!theme.fontSizes?.base,
    fontWeight: !!theme.fontConfig?.fontWeight?.medium,
    
    // Border radius
    borderRadius: !!theme.borderRadius?.lg,
    
    // Screen dimensions
    screenDims: !!screenDimensions,
    responsive: !!screenDimensions?.responsiveWidth,
    
    // Component spacing
    componentSpacing: !!theme.componentSpacing?.form?.fieldGap,
  };

  // Create StyleSheet using theme - this is the real test
  const styles = StyleSheet.create({
    container: {
      padding: theme.spacing?.[4] || 16, // Numeric access
      margin: theme.spacing?.sm || 8,    // Semantic access
      backgroundColor: theme.colors?.background?.secondary || '#f5f5f5',
      borderRadius: theme.borderRadius?.lg || 12,
      borderWidth: theme.borderWidth?.sm || 1,
      borderColor: theme.colors?.border?.primary || '#e5e7eb',
      ...theme.elevation?.sm, // Spread elevation
    },
    
    header: {
      fontSize: theme.fontSizes?.lg || 18,
      fontWeight: theme.fontConfig?.fontWeight?.bold || '700',
      color: theme.colors?.text?.primary || '#000000',
      marginBottom: theme.spacing?.[2] || 8,
    },
    
    testItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing?.[1] || 4,
      borderBottomWidth: theme.borderWidth?.xs || 1,
      borderBottomColor: theme.colors?.border?.secondary || '#e5e7eb',
    },
    
    testLabel: {
      fontSize: theme.fontSizes?.base || 16,
      color: theme.colors?.text?.secondary || '#666666',
      flex: 1,
    },
    
    testResult: {
      fontSize: theme.fontSizes?.base || 16,
      fontWeight: theme.fontConfig?.fontWeight?.medium || '500',
      marginLeft: theme.spacing?.[2] || 8,
    },
    
    passText: {
      color: theme.colors?.status?.success || '#22c55e',
    },
    
    failText: {
      color: theme.colors?.status?.error || '#ef4444',
    },
    
    summary: {
      marginTop: theme.spacing?.[4] || 16,
      padding: theme.spacing?.[3] || 12,
      backgroundColor: theme.colors?.background?.accent || '#f8fafc',
      borderRadius: theme.borderRadius?.md || 8,
    },
    
    summaryText: {
      fontSize: theme.fontSizes?.base || 16,
      color: theme.colors?.text?.primary || '#000000',
      textAlign: 'center',
    }
  });

  const passCount = Object.values(testResults).filter(Boolean).length;
  const totalCount = Object.keys(testResults).length;
  const allPassed = passCount === totalCount;

  console.log('🧪 Theme System Validation Results:', {
    platform: Platform.OS,
    results: testResults,
    summary: `${passCount}/${totalCount} tests passed`,
    allPassed,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Theme System Validation - {Platform.OS}
      </Text>
      
      {Object.entries(testResults).map(([testName, passed]) => (
        <View key={testName} style={styles.testItem}>
          <Text style={styles.testLabel}>
            {testName}
          </Text>
          <Text style={[
            styles.testResult, 
            passed ? styles.passText : styles.failText
          ]}>
            {passed ? '✅ PASS' : '❌ FAIL'}
          </Text>
        </View>
      ))}
      
      <View style={styles.summary}>
        <Text style={[
          styles.summaryText,
          allPassed ? styles.passText : styles.failText
        ]}>
          {allPassed 
            ? `🎉 All tests passed! Theme system is working correctly.`
            : `⚠️ ${totalCount - passCount} tests failed. Theme system needs attention.`
          }
        </Text>
      </View>
    </View>
  );
};

export default ThemeSystemValidator;