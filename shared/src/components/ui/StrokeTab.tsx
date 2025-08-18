/**
 * StrokeTab Component
 * 
 * A specialized tab component for swimming strokes with performance time cards.
 * Combines horizontal tab selection with performance data display.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';

export interface StrokeTab {
  /** Unique identifier for the stroke */
  id: string;
  /** Display name for the stroke */
  label: string;
  /** Whether this stroke is disabled */
  disabled?: boolean;
}

export interface PerformanceTime {
  /** Unique identifier */
  id: string;
  /** Distance (e.g., "17m", "34m") */
  distance: string;
  /** Time achieved (e.g., "00:26.30") */
  time: string;
  /** Percentage change (e.g., "+ 0.5%") */
  change?: string;
  /** Date of performance */
  date: string;
  /** Whether the change is positive */
  isPositive?: boolean;
  /** Custom callback when pressed */
  onPress?: () => void;
}

export interface StrokeTabProps {
  /** Array of stroke tab options */
  tabs: StrokeTab[] | string[];
  /** Currently active stroke tab */
  activeTab: string;
  /** Callback when stroke tab changes */
  onTabChange: (tab: string) => void;
  /** Array of performance times to display */
  performanceTimes?: PerformanceTime[];
  /** Callback when performance card is pressed */
  onPerformancePress?: (performance: PerformanceTime) => void;
  /** Whether to show performance times section */
  showPerformanceTimes?: boolean;
  /** Custom container styles */
  containerStyle?: ViewStyle;
  /** Custom tab styles */
  tabStyle?: ViewStyle;
  /** Custom active tab styles */
  activeTabStyle?: ViewStyle;
  /** Custom performance card styles */
  performanceCardStyle?: ViewStyle;
  /** Whether tabs should be equally spaced */
  equalSpacing?: boolean;
  /** Test ID for testing */
  testID?: string;
}

export const StrokeTab: React.FC<StrokeTabProps> = ({
  tabs,
  activeTab,
  onTabChange,
  performanceTimes = [],
  onPerformancePress,
  showPerformanceTimes = true,
  containerStyle,
  tabStyle,
  activeTabStyle,
  performanceCardStyle,
  equalSpacing = false,
  testID = 'stroke-tab',
}) => {
  const { theme, screenDimensions } = useTheme();
  const styles = createStyles(theme, screenDimensions);

  // Normalize tabs to consistent format
  const normalizedTabs: StrokeTab[] = tabs.map(tab => 
    typeof tab === 'string' 
      ? { id: tab, label: tab } 
      : tab
  );

  const handleTabPress = (tab: StrokeTab) => {
    if (tab.disabled) return;
    onTabChange(tab.id);
  };

  const handlePerformancePress = (performance: PerformanceTime) => {
    if (performance.onPress) {
      performance.onPress();
    } else if (onPerformancePress) {
      onPerformancePress(performance);
    }
  };

  const renderTab = (tab: StrokeTab, index: number) => {
    const isActive = activeTab === tab.id;
    const isDisabled = tab.disabled;

    return (
      <TouchableOpacity
        key={tab.id}
        style={[
          styles.tab,
          isActive && styles.activeTab,
          isDisabled && styles.disabledTab,
          equalSpacing && styles.equalSpacingTab,
          tabStyle,
          isActive && activeTabStyle,
        ]}
        onPress={() => handleTabPress(tab)}
        disabled={isDisabled}
        testID={`${testID}-tab-${tab.id}`}
        accessibilityRole="tab"
        accessibilityLabel={tab.label}
        accessibilityState={{
          selected: isActive,
          disabled: isDisabled,
        }}
      >
        <Text
          style={[
            styles.tabText,
            isActive && styles.activeTabText,
            isDisabled && styles.disabledTabText,
          ]}
        >
          {tab.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderPerformanceCard = (performance: PerformanceTime, index: number) => {
    const isPositive = performance.isPositive ?? (performance.change?.includes('+') || false);
    const changeColor = isPositive ? theme.colors.status.success : theme.colors.status.error;

    return (
      <TouchableOpacity
        key={performance.id}
        style={[styles.performanceCard, performanceCardStyle]}
        onPress={() => handlePerformancePress(performance)}
        testID={`${testID}-performance-${performance.id}`}
        accessibilityRole="button"
        accessibilityLabel={`Performance: ${performance.distance}, ${performance.time}, ${performance.change || ''}, ${performance.date}`}
      >
        <View style={styles.performanceContent}>
          {/* Distance Badge */}
          <View style={styles.distanceBadge}>
            <Text style={styles.distanceText}>
              {performance.distance}
            </Text>
          </View>

          {/* Performance Details */}
          <View style={styles.performanceDetails}>
            <Text style={styles.timeText}>
              {performance.time}
            </Text>
            {performance.change && (
              <Text style={[styles.changeText, { color: changeColor }]}>
                {performance.change}
              </Text>
            )}
            <Text style={styles.dateText}>
              {performance.date}
            </Text>
          </View>
        </View>

        {/* Arrow Icon */}
        <Ionicons
          name="chevron-forward"
          size={theme.iconSize.sm}
          color={theme.colors.icon.tertiary}
          style={styles.arrowIcon}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View 
      style={[styles.container, containerStyle]}
      testID={testID}
    >
      {/* Stroke Tab Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.tabScrollContainer,
          equalSpacing && { flexGrow: 1 },
        ]}
        style={styles.tabScrollView}
        bounces={false}
        testID={`${testID}-tab-scroll`}
      >
        {normalizedTabs.map(renderTab)}
      </ScrollView>

      {/* Performance Times Section */}
      {showPerformanceTimes && performanceTimes.length > 0 && (
        <ScrollView
          style={styles.performanceScrollView}
          showsVerticalScrollIndicator={false}
          testID={`${testID}-performance-scroll`}
        >
          <View style={styles.performanceContainer}>
            {performanceTimes.map(renderPerformanceCard)}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const createStyles = (theme: any, screenDimensions: any) => {
  const isTablet = screenDimensions.isTablet;

  return StyleSheet.create({
    container: {
      flex: 1,
    },

    // Tab styles
    tabScrollView: {
      flexGrow: 0,
      marginBottom: theme.spacing.lg,
    },

    tabScrollContainer: {
      paddingHorizontal: theme.spacing.md,
      gap: theme.spacing.md,
      minHeight: 44,
    },

    tab: {
      paddingHorizontal: isTablet ? theme.spacing.lg : theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.background.secondary,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      minHeight: theme.safeArea.minTouchTarget.height,
      justifyContent: 'center',
      alignItems: 'center',
    },

    activeTab: {
      backgroundColor: theme.colors.interactive.primary,
      borderColor: theme.colors.interactive.primary,
      shadowColor: theme.colors.interactive.primary,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },

    disabledTab: {
      opacity: 0.5,
      backgroundColor: theme.colors.background.disabled,
    },

    equalSpacingTab: {
      flex: 1,
      minWidth: 80,
    },

    tabText: {
      fontSize: isTablet ? theme.fontSizes.caption : 10,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      lineHeight: isTablet ? 16 : 12,
    },

    activeTabText: {
      color: theme.colors.text.inverse,
      fontWeight: theme.fontConfig.fontWeight.semibold,
    },

    disabledTabText: {
      color: theme.colors.text.disabled,
    },

    // Performance styles
    performanceScrollView: {
      flex: 1,
    },

    performanceContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.lg,
      gap: theme.spacing.md,
    },

    performanceCard: {
      backgroundColor: theme.colors.background.elevated,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      shadowColor: theme.colors.shadow.primary,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      minHeight: 80,
    },

    performanceContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },

    distanceBadge: {
      backgroundColor: theme.colors.background.secondary,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      marginRight: theme.spacing.lg,
      minWidth: 60,
      alignItems: 'center',
      justifyContent: 'center',
    },

    distanceText: {
      fontSize: theme.fontSizes.caption,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: theme.colors.text.primary,
    },

    performanceDetails: {
      flex: 1,
    },

    timeText: {
      fontSize: isTablet ? theme.fontSizes.h4 : theme.fontSizes.h5,
      fontWeight: theme.fontConfig.fontWeight.bold,
      color: theme.colors.text.primary,
      marginBottom: 2,
    },

    changeText: {
      fontSize: 10,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      marginBottom: 2,
    },

    dateText: {
      fontSize: 8,
      fontWeight: theme.fontConfig.fontWeight.regular,
      color: theme.colors.text.tertiary,
    },

    arrowIcon: {
      marginLeft: theme.spacing.sm,
    },
  });
};

export default StrokeTab;