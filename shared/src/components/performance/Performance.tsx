/**
 * Performance Component
 * 
 * A comprehensive performance analytics dashboard component with Academy theming.
 * Supports switching between times and stroke metrics with mobile/tablet responsive design.
 */

import React, { useState } from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  Pressable, 
  StyleSheet,
  ViewStyle,
  TextStyle 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../theme';

export type MetricTab = 'Times' | 'Stroke';
export type PoolSize = '17m' | '25m' | '50m';

export interface PerformanceUser {
  id: string;
  name: string;
  avatar?: string;
}

export interface PerformanceTabData {
  id: string;
  label: string;
  data?: any;
}

export interface PoolConfig {
  size: PoolSize;
  location?: string;
  isUserLocation?: boolean;
}

export interface PerformanceProps {
  /** Current user being analyzed */
  user: PerformanceUser;
  
  /** Active metric tab */
  activeTab: MetricTab;
  
  /** Available times tabs data */
  timesTabs: PerformanceTabData[];
  
  /** Available stroke tabs data */
  strokeTabs: PerformanceTabData[];
  
  /** Current active times tab */
  activeTimesTab?: string;
  
  /** Current active stroke tab */
  activeStrokeTab?: string;
  
  /** Available pool configurations */
  poolConfigs?: PoolConfig[];
  
  /** Selected pool size */
  selectedPoolSize?: PoolSize;
  
  /** Tab change callback */
  onTabChange: (tab: MetricTab) => void;
  
  /** Times tab change callback */
  onTimesTabChange?: (tabId: string) => void;
  
  /** Stroke tab change callback */
  onStrokeTabChange?: (tabId: string) => void;
  
  /** Pool size change callback */
  onPoolSizeChange?: (size: PoolSize) => void;
  
  /** Performance times modal trigger */
  onPerformanceTimesOpen?: () => void;
  
  /** Times tab component to render */
  TimesTabComponent?: React.ComponentType<any>;
  
  /** Stroke tab component to render */
  StrokeTabComponent?: React.ComponentType<any>;
  
  /** Custom header title */
  title?: string;
  
  /** Show user section */
  showUserSection?: boolean;
  
  /** Show pool size selector */
  showPoolSizeSelector?: boolean;
  
  /** Accessibility props */
  accessibilityLabel?: string;
  accessibilityHint?: string;
  
  /** Custom styles */
  style?: ViewStyle;
  containerStyle?: ViewStyle;
  headerStyle?: ViewStyle;
  
  /** Test ID for testing */
  testID?: string;
}

export const Performance: React.FC<PerformanceProps> = ({
  user,
  activeTab,
  timesTabs,
  strokeTabs,
  activeTimesTab,
  activeStrokeTab,
  poolConfigs = [
    { size: '17m', location: 'My Location', isUserLocation: true },
    { size: '25m' },
    { size: '50m' }
  ],
  selectedPoolSize = '17m',
  onTabChange,
  onTimesTabChange,
  onStrokeTabChange,
  onPoolSizeChange,
  onPerformanceTimesOpen,
  TimesTabComponent,
  StrokeTabComponent,
  title = 'Performance',
  showUserSection = true,
  showPoolSizeSelector = true,
  accessibilityLabel,
  accessibilityHint,
  style,
  containerStyle,
  headerStyle,
  testID,
}) => {
  const { theme, screenDimensions } = useTheme();
  const styles = createStyles(theme, screenDimensions);

  const handleTabPress = (tab: MetricTab) => {
    onTabChange(tab);
  };

  const handlePoolSizePress = (size: PoolSize) => {
    onPoolSizeChange?.(size);
  };

  const renderTabButton = (tab: MetricTab, label: string) => {
    const isActive = activeTab === tab;
    
    return (
      <Pressable
        key={tab}
        onPress={() => handleTabPress(tab)}
        style={({ pressed }) => [
          styles.tabButton,
          isActive && styles.tabButtonActive,
          pressed && styles.tabButtonPressed,
        ]}
        accessibilityRole="tab"
        accessibilityState={{ selected: isActive }}
        accessibilityLabel={`${label} tab`}
      >
        <Text 
          style={[
            styles.tabButtonText,
            isActive && styles.tabButtonTextActive,
          ]}
        >
          {label}
        </Text>
      </Pressable>
    );
  };

  const renderPoolSizeButton = (config: PoolConfig) => {
    const isSelected = selectedPoolSize === config.size;
    const isUserLocation = config.isUserLocation;
    
    return (
      <Pressable
        key={config.size}
        onPress={() => handlePoolSizePress(config.size)}
        style={({ pressed }) => [
          styles.poolSizeButton,
          isUserLocation && styles.poolSizeButtonPrimary,
          !isUserLocation && styles.poolSizeButtonSecondary,
          pressed && styles.poolSizeButtonPressed,
        ]}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
        accessibilityLabel={`${config.size} pool${config.location ? `, ${config.location}` : ''}`}
      >
        {isUserLocation ? (
          <View style={styles.userLocationContainer}>
            <Text style={styles.userLocationLabel}>My Location:</Text>
            <Text style={styles.poolSizeText}>{config.size}</Text>
          </View>
        ) : (
          <Text style={styles.poolSizeText}>{config.size}</Text>
        )}
      </Pressable>
    );
  };

  const renderUserSection = () => {
    if (!showUserSection) return null;

    return (
      <View style={styles.userSection}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <View style={styles.userIconContainer}>
            <Feather 
              name="users" 
              size={theme.iconSize.sm} 
              color={theme.colors.text.primary} 
            />
          </View>
        </View>
      </View>
    );
  };

  const renderMetricSelector = () => (
    <View style={styles.metricSection}>
      <Text style={styles.sectionLabel}>Metric View</Text>
      <View style={styles.tabContainer}>
        {renderTabButton('Times', 'Times')}
        {renderTabButton('Stroke', 'Stroke')}
      </View>
    </View>
  );

  const renderPoolSizeSelector = () => {
    if (!showPoolSizeSelector) return null;

    return (
      <View style={styles.poolSection}>
        <Text style={styles.sectionLabel}>Pool Size</Text>
        <View style={styles.poolSizeContainer}>
          {poolConfigs.map(renderPoolSizeButton)}
        </View>
      </View>
    );
  };

  const renderTabContent = () => {
    if (activeTab === 'Stroke' && StrokeTabComponent) {
      return (
        <StrokeTabComponent
          strokeTabs={strokeTabs}
          activeStrokeTab={activeStrokeTab}
          onStrokeTabChange={onStrokeTabChange}
          onPerformanceTimesOpen={onPerformanceTimesOpen}
        />
      );
    }

    if (activeTab === 'Times' && TimesTabComponent) {
      return (
        <TimesTabComponent
          timesTabs={timesTabs}
          activeTimesTab={activeTimesTab}
          onTimesTabChange={onTimesTabChange}
        />
      );
    }

    return null;
  };

  return (
    <ScrollView
      style={[styles.container, style]}
      contentContainerStyle={[styles.contentContainer, containerStyle]}
      showsVerticalScrollIndicator={false}
      testID={testID}
      accessibilityLabel={accessibilityLabel || `${title} analytics dashboard`}
      accessibilityHint={accessibilityHint}
    >
      {/* Header */}
      <View style={[styles.header, headerStyle]}>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Main Content Card */}
      <View style={styles.mainCard}>
        {renderUserSection()}
        {renderMetricSelector()}
        {renderPoolSizeSelector()}
      </View>

      {/* Tab Content */}
      <View style={styles.tabContent}>
        {renderTabContent()}
      </View>
    </ScrollView>
  );
};

const createStyles = (theme: any, screenDimensions: any) => {
  const isTablet = screenDimensions.isTablet;
  
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    
    contentContainer: {
      flexGrow: 1,
      paddingTop: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
    },
    
    header: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
    },
    
    title: {
      fontSize: theme.fontSizes.h4,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
      ...(isTablet && {
        fontSize: theme.fontSizes.h3,
      }),
    },
    
    mainCard: {
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      paddingBottom: theme.spacing.lg,
      marginVertical: theme.spacing.md,
      borderWidth: theme.borderWidth.sm,
      borderColor: theme.colors.border.primary,
      ...theme.elevation.sm,
    },
    
    userSection: {
      marginBottom: theme.spacing.md,
    },
    
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.sm,
    },
    
    userName: {
      fontSize: theme.fontSizes.body,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: theme.colors.text.primary,
    },
    
    userIconContainer: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.full,
      padding: theme.spacing.sm,
    },
    
    metricSection: {
      marginBottom: theme.spacing.md,
    },
    
    poolSection: {
      // Last section, no margin bottom
    },
    
    sectionLabel: {
      fontSize: theme.fontSizes.caption,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.sm,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: theme.colors.background.elevated,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.xs,
      marginTop: theme.spacing.sm,
      borderWidth: theme.borderWidth.sm,
      borderColor: theme.colors.border.secondary,
      ...theme.elevation.sm,
    },
    
    tabButton: {
      flex: 1,
      borderRadius: theme.borderRadius.md,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: theme.safeArea.minTouchTarget.height,
      marginHorizontal: theme.spacing.xs,
    },
    
    tabButtonActive: {
      backgroundColor: theme.colors.interactive.primary,
      ...theme.elevation.sm,
    },
    
    tabButtonPressed: {
      opacity: 0.8,
      transform: [{ scale: 0.98 }],
    },
    
    tabButtonText: {
      fontSize: theme.fontSizes.body,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.secondary,
      textAlign: 'center',
    },
    
    tabButtonTextActive: {
      color: theme.colors.text.inverse,
      fontWeight: theme.fontConfig.fontWeight.bold,
    },
    
    poolSizeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      paddingTop: theme.spacing.sm,
      flexWrap: 'wrap',
    },
    
    poolSizeButton: {
      borderRadius: theme.borderRadius.lg,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      minHeight: theme.safeArea.minTouchTarget.height,
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: 60,
      ...theme.elevation.sm,
    },
    
    poolSizeButtonPrimary: {
      backgroundColor: theme.colors.interactive.faded,
      borderWidth: theme.borderWidth.sm,
      borderColor: theme.colors.interactive.primary,
    },
    
    poolSizeButtonSecondary: {
      borderWidth: theme.borderWidth.sm,
      borderColor: theme.colors.border.primary,
      backgroundColor: theme.colors.background.primary,
    },
    
    poolSizeButtonPressed: {
      opacity: 0.8,
      transform: [{ scale: 0.98 }],
    },
    
    userLocationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    
    userLocationLabel: {
      fontSize: theme.fontSizes.caption,
      color: theme.colors.text.secondary,
    },
    
    poolSizeText: {
      fontSize: theme.fontSizes.body,
      fontWeight: theme.fontConfig.fontWeight.bold,
      color: theme.colors.interactive.primary,
      textAlign: 'center',
    },
    
    tabContent: {
      flex: 1,
      marginBottom: theme.spacing.lg,
    },
  });
};

export default Performance;