/**
 * IconTabBar Component
 * 
 * A compact horizontal tab bar focused on icons with optional labels and badge support.
 * Ideal for navigation and quick action switching with visual indicators.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

/** Size variants for IconTabBar */
export type IconTabBarSize = 'sm' | 'md' | 'lg';

/** Style variants for IconTabBar */
export type IconTabBarVariant = 'default' | 'filled' | 'outlined' | 'minimal';

/** Badge configuration for tab icons */
export interface TabBadge {
  /** Badge count number */
  count?: number;
  /** Show red dot indicator without count */
  showDot?: boolean;
  /** Custom badge color */
  color?: string;
  /** Maximum count to display (shows "99+" if exceeded) */
  maxCount?: number;
}

/** Tab configuration for IconTabBar */
export interface IconTab {
  /** Unique identifier */
  value: string;
  /** Icon name from Ionicons */
  icon: keyof typeof Ionicons.glyphMap;
  /** Optional label text */
  label?: string;
  /** Badge configuration */
  badge?: TabBadge;
  /** Whether this tab is disabled */
  disabled?: boolean;
  /** Accessibility label */
  accessibilityLabel?: string;
}

export interface IconTabBarProps {
  /** Array of tab options */
  tabs: IconTab[];
  /** Currently active tab value */
  activeTab: string;
  /** Callback when tab changes */
  onTabChange: (value: string) => void;
  
  // Variants
  /** Visual variant */
  variant?: IconTabBarVariant;
  /** Size variant */
  size?: IconTabBarSize;
  
  // Display Options
  /** Whether to show labels below icons */
  showLabels?: boolean;
  /** Whether to show badges */
  showBadges?: boolean;
  /** Badge position relative to icon */
  badgePosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  
  // Spacing & Layout
  /** Whether tabs should be equally spaced */
  equalSpacing?: boolean;
  /** Custom gap between tabs */
  tabSpacing?: number;
  
  // Styling
  /** Container style override */
  style?: ViewStyle;
  /** Individual tab style override */
  tabStyle?: ViewStyle;
  /** Active tab style override */
  activeTabStyle?: ViewStyle;
  /** Tab label style override */
  labelStyle?: TextStyle;
  /** Active tab label style override */
  activeLabelStyle?: TextStyle;
  
  // Accessibility
  /** Container accessibility label */
  accessibilityLabel?: string;
  /** Test ID for testing */
  testID?: string;
}

export const IconTabBar: React.FC<IconTabBarProps> = ({
  tabs,
  activeTab,
  onTabChange,
  variant = 'default',
  size = 'md',
  showLabels = true,
  showBadges = true,
  badgePosition = 'top-right',
  equalSpacing = true,
  tabSpacing,
  style,
  tabStyle,
  activeTabStyle,
  labelStyle,
  activeLabelStyle,
  accessibilityLabel,
  testID = 'icon-tab-bar',
}) => {
  const { theme, screenDimensions } = useTheme();
  const styles = createStyles(theme, screenDimensions);
  const variantStyles = getVariantStyles(theme, variant, size);

  const handleTabPress = (tab: IconTab) => {
    if (tab.disabled) return;
    onTabChange(tab.value);
  };

  const formatBadgeCount = (count: number, maxCount: number = 99) => {
    if (count <= maxCount) return count.toString();
    return `${maxCount}+`;
  };

  const renderBadge = (badge: TabBadge | undefined) => {
    if (!showBadges || !badge) return null;

    if (badge.showDot) {
      return (
        <View
          style={[
            styles.badgeDot,
            styles[`${size}BadgeDot`],
            styles[`badge${badgePosition.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('')}`],
            { backgroundColor: badge.color || theme.colors.status.error },
          ]}
        />
      );
    }

    if (badge.count && badge.count > 0) {
      return (
        <View
          style={[
            styles.badgeContainer,
            styles[`${size}Badge`],
            styles[`badge${badgePosition.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('')}`],
            { backgroundColor: badge.color || theme.colors.status.error },
          ]}
        >
          <Text style={[styles.badgeText, styles[`${size}BadgeText`]]}>
            {formatBadgeCount(badge.count, badge.maxCount)}
          </Text>
        </View>
      );
    }

    return null;
  };

  const renderTab = (tab: IconTab, index: number) => {
    const isActive = activeTab === tab.value;
    const isDisabled = tab.disabled;

    return (
      <Pressable
        key={tab.value}
        style={[
          styles.tab,
          styles[size],
          variantStyles.tab,
          equalSpacing && styles.equalSpacingTab,
          isActive && [styles.activeTab, variantStyles.activeTab],
          isDisabled && styles.disabledTab,
          tabStyle,
          isActive && activeTabStyle,
          tabSpacing && { marginHorizontal: tabSpacing / 2 },
        ]}
        onPress={() => handleTabPress(tab)}
        disabled={isDisabled}
        testID={`${testID}-tab-${tab.value}`}
        accessibilityRole="tab"
        accessibilityLabel={tab.accessibilityLabel || tab.label || `Tab ${index + 1}`}
        accessibilityState={{
          selected: isActive,
          disabled: isDisabled,
        }}
      >
        {/* Icon Container with Badge */}
        <View style={styles.iconContainer}>
          <Ionicons
            name={tab.icon}
            size={variantStyles.iconSize}
            color={
              isDisabled 
                ? theme.colors.icon.disabled
                : isActive 
                  ? variantStyles.activeIconColor 
                  : variantStyles.iconColor
            }
            style={styles.tabIcon}
          />
          {renderBadge(tab.badge)}
        </View>

        {/* Label */}
        {showLabels && tab.label && (
          <Text
            style={[
              styles.tabLabel,
              styles[`${size}Label`],
              {
                color: isDisabled 
                  ? theme.colors.text.disabled
                  : isActive 
                    ? variantStyles.activeLabelColor 
                    : variantStyles.labelColor
              },
              labelStyle,
              isActive && activeLabelStyle,
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {tab.label}
          </Text>
        )}
      </Pressable>
    );
  };

  return (
    <View
      style={[
        styles.container,
        variantStyles.container,
        !tabSpacing && { gap: theme.spacing.sm },
        style,
      ]}
      testID={testID}
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
    >
      {tabs.map(renderTab)}
    </View>
  );
};

// Helper function to get variant-based styles
const getVariantStyles = (
  theme: any,
  variant: IconTabBarVariant,
  size: IconTabBarSize
) => {
  const baseStyles = {
    container: {
      backgroundColor: 'transparent',
    },
    tab: {},
    activeTab: {
      backgroundColor: theme.colors.interactive.primary + '10',
    },
    iconColor: theme.colors.icon.primary,
    activeIconColor: theme.colors.interactive.primary,
    labelColor: theme.colors.text.secondary,
    activeLabelColor: theme.colors.interactive.primary,
    iconSize: size === 'sm' ? 20 : size === 'md' ? 24 : 28,
  };

  switch (variant) {
    case 'filled':
      return {
        ...baseStyles,
        container: {
          backgroundColor: theme.colors.background.secondary,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.xs,
        },
        activeTab: {
          backgroundColor: theme.colors.interactive.primary,
        },
        activeIconColor: theme.colors.text.inverse,
        activeLabelColor: theme.colors.text.inverse,
      };
    
    case 'outlined':
      return {
        ...baseStyles,
        container: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.border.primary,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.xs,
        },
        tab: {
          borderRadius: theme.borderRadius.md,
        },
        activeTab: {
          backgroundColor: theme.colors.interactive.primary + '15',
          borderWidth: 1,
          borderColor: theme.colors.interactive.primary,
        },
      };
    
    case 'minimal':
      return {
        ...baseStyles,
        activeTab: {},
        activeIconColor: theme.colors.interactive.primary,
        activeLabelColor: theme.colors.interactive.primary,
      };
    
    case 'default':
    default:
      return baseStyles;
  }
};

const createStyles = (theme: any, screenDimensions: any) => {
  const isTablet = screenDimensions.isTablet;

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    tab: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      minHeight: theme.safeArea.minTouchTarget.height,
    },

    equalSpacingTab: {
      flex: 1,
    },

    activeTab: {
      backgroundColor: theme.colors.interactive.primary + '10',
    },

    disabledTab: {
      opacity: 0.5,
    },

    // Size variants
    sm: {
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      minHeight: 32,
    },

    md: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      minHeight: 40,
    },

    lg: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      minHeight: 48,
    },

    iconContainer: {
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
    },

    tabIcon: {
      marginBottom: theme.spacing.xs,
    },

    tabLabel: {
      fontSize: theme.fontSizes.caption,
      fontWeight: theme.fontConfig.fontWeight.medium,
      textAlign: 'center',
      lineHeight: 14,
      ...(isTablet && {
        fontSize: theme.fontSizes.caption * 1.1,
      }),
    },

    // Label size variants
    smLabel: {
      fontSize: theme.fontSizes.xs,
      lineHeight: 12,
      ...(isTablet && {
        fontSize: theme.fontSizes.xs * 1.1,
      }),
    },

    mdLabel: {
      fontSize: theme.fontSizes.caption,
      lineHeight: 14,
      ...(isTablet && {
        fontSize: theme.fontSizes.caption * 1.1,
      }),
    },

    lgLabel: {
      fontSize: theme.fontSizes.sm,
      lineHeight: 16,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      ...(isTablet && {
        fontSize: theme.fontSizes.sm * 1.1,
      }),
    },

    // Badge styles
    badgeContainer: {
      position: 'absolute',
      backgroundColor: theme.colors.status.error,
      borderRadius: theme.borderRadius.full,
      minWidth: 18,
      height: 18,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 4,
    },

    badgeDot: {
      position: 'absolute',
      backgroundColor: theme.colors.status.error,
      borderRadius: theme.borderRadius.full,
      width: 8,
      height: 8,
    },

    badgeText: {
      color: theme.colors.text.inverse,
      fontSize: 10,
      fontWeight: theme.fontConfig.fontWeight.bold,
      lineHeight: 12,
    },

    // Badge size variants
    smBadge: {
      minWidth: 14,
      height: 14,
    },

    mdBadge: {
      minWidth: 18,
      height: 18,
    },

    lgBadge: {
      minWidth: 20,
      height: 20,
    },

    smBadgeDot: {
      width: 6,
      height: 6,
    },

    mdBadgeDot: {
      width: 8,
      height: 8,
    },

    lgBadgeDot: {
      width: 10,
      height: 10,
    },

    smBadgeText: {
      fontSize: 8,
      lineHeight: 10,
    },

    mdBadgeText: {
      fontSize: 10,
      lineHeight: 12,
    },

    lgBadgeText: {
      fontSize: 11,
      lineHeight: 13,
    },

    // Badge position variants
    badgeTopRight: {
      top: -2,
      right: -2,
    },

    badgeTopLeft: {
      top: -2,
      left: -2,
    },

    badgeBottomRight: {
      bottom: -2,
      right: -2,
    },

    badgeBottomLeft: {
      bottom: -2,
      left: -2,
    },
  });
};

export default IconTabBar;