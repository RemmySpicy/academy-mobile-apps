/**
 * TimesTab Component
 * 
 * A horizontal scrollable tab selector for time periods or categories.
 * Includes empty state display when no content is available.
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
import { EmptySearchResult } from './EmptySearchResult';

export interface TimeTab {
  /** Unique identifier for the tab */
  id: string;
  /** Display label for the tab */
  label: string;
  /** Whether this tab is disabled */
  disabled?: boolean;
}

export interface TimesTabProps {
  /** Array of tab options */
  tabs: TimeTab[] | string[];
  /** Currently active tab (id or label) */
  activeTab: string;
  /** Callback when tab changes */
  onTabChange: (tab: string) => void;
  /** Whether to show empty state */
  showEmptyState?: boolean;
  /** Custom empty state props */
  emptyStateProps?: {
    title?: string;
    description?: string;
    iconName?: string;
  };
  /** Custom container styles */
  containerStyle?: ViewStyle;
  /** Custom scroll container styles */
  scrollStyle?: ViewStyle;
  /** Custom tab styles */
  tabStyle?: ViewStyle;
  /** Custom active tab styles */
  activeTabStyle?: ViewStyle;
  /** Custom tab text styles */
  tabTextStyle?: TextStyle;
  /** Custom active tab text styles */
  activeTabTextStyle?: TextStyle;
  /** Whether tabs should be equally spaced */
  equalSpacing?: boolean;
  /** Custom scroll indicator settings */
  showsHorizontalScrollIndicator?: boolean;
  /** Test ID for testing */
  testID?: string;
}

export const TimesTab: React.FC<TimesTabProps> = ({
  tabs,
  activeTab,
  onTabChange,
  showEmptyState = false,
  emptyStateProps = {},
  containerStyle,
  scrollStyle,
  tabStyle,
  activeTabStyle,
  tabTextStyle,
  activeTabTextStyle,
  equalSpacing = false,
  showsHorizontalScrollIndicator = false,
  testID = 'times-tab',
}) => {
  const { theme, screenDimensions } = useTheme();
  const styles = createStyles(theme, screenDimensions);

  // Normalize tabs to consistent format
  const normalizedTabs: TimeTab[] = tabs.map(tab => 
    typeof tab === 'string' 
      ? { id: tab, label: tab } 
      : tab
  );

  const handleTabPress = (tab: TimeTab) => {
    if (tab.disabled) return;
    onTabChange(tab.id);
  };

  const renderTab = (tab: TimeTab, index: number) => {
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
            tabTextStyle,
            isActive && activeTabTextStyle,
          ]}
        >
          {tab.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => {
    if (!showEmptyState) return null;

    const defaultEmptyProps = {
      title: "No Results Found",
      description: "We do not have any result for the keyword you searched.",
      showDefaultIcon: true,
    };

    return (
      <EmptySearchResult
        {...defaultEmptyProps}
        {...emptyStateProps}
        iconName="time-outline"
        style={styles.emptyState}
        testID={`${testID}-empty-state`}
      />
    );
  };

  return (
    <View 
      style={[styles.container, containerStyle]}
      testID={testID}
      accessibilityRole="tablist"
    >
      {/* Tab Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
        contentContainerStyle={[
          styles.scrollContainer,
          equalSpacing && { flexGrow: 1 },
          scrollStyle,
        ]}
        style={styles.scrollView}
        bounces={false}
        testID={`${testID}-scroll`}
      >
        {normalizedTabs.map(renderTab)}
      </ScrollView>

      {/* Content Area */}
      {showEmptyState && renderEmptyState()}
    </View>
  );
};

const createStyles = (theme: any, screenDimensions: any) => {
  const isTablet = screenDimensions.isTablet;

  return StyleSheet.create({
    container: {
      flex: 1,
    },

    scrollView: {
      flexGrow: 0,
      marginBottom: theme.spacing.md,
    },

    scrollContainer: {
      paddingHorizontal: theme.spacing.md,
      gap: theme.spacing.md,
      minHeight: 44, // Minimum touch target
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

    emptyState: {
      flex: 1,
      marginTop: theme.spacing.xl,
      paddingHorizontal: theme.spacing.md,
    },
  });
};

export default TimesTab;