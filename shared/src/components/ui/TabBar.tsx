/**
 * Unified TabBar Component
 * 
 * Consolidates FixedTabBar and TimesTab into a single, comprehensive
 * horizontal tab component supporting:
 * - Fixed equal-width tabs (2-5 tabs)
 * - Scrollable tabs (any number)
 * - Multiple visual variants
 * - Icons, badges, and empty states
 * - Flexible styling and positioning
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { EmptySearchResult } from './EmptySearchResult';

/** Visual variants for TabBar */
export type TabBarVariant = 'default' | 'underline' | 'pills' | 'cards' | 'minimal';

/** Size variants for TabBar */
export type TabBarSize = 'sm' | 'md' | 'lg';

/** Layout modes for TabBar */
export type TabBarMode = 'fixed' | 'scrollable';

/** Tab configuration */
export interface Tab {
  /** Unique identifier */
  id?: string;
  /** Tab value/key */
  value: string;
  /** Display label */
  label: string;
  /** Optional icon */
  icon?: keyof typeof Ionicons.glyphMap;
  /** Badge count */
  badge?: number;
  /** Whether this tab is disabled */
  disabled?: boolean;
  /** Custom tab color (overrides theme) */
  color?: string;
  /** Accessibility label */
  accessibilityLabel?: string;
}

export interface TabBarProps {
  /** Array of tab options */
  tabs: Tab[] | string[];
  /** Currently active tab value */
  activeTab: string;
  /** Callback when tab changes */
  onTabChange: (value: string) => void;
  
  /** Layout mode - fixed for equal width, scrollable for overflow */
  mode?: TabBarMode;
  /** Visual variant */
  variant?: TabBarVariant;
  /** Size variant */
  size?: TabBarSize;
  
  /** Display Options */
  /** Whether to show icons */
  showIcons?: boolean;
  /** Whether to show badges */
  showBadges?: boolean;
  /** Icon position relative to text */
  iconPosition?: 'left' | 'right' | 'top' | 'bottom';
  
  /** Empty State */
  /** Whether to show empty state when no tabs */
  showEmptyState?: boolean;
  /** Custom empty state props */
  emptyStateProps?: {
    title?: string;
    description?: string;
    iconName?: string;
  };
  
  /** Layout & Spacing */
  /** Whether tabs should have equal width (fixed mode only) */
  equalWidth?: boolean;
  /** Whether tabs should be equally spaced */
  equalSpacing?: boolean;
  /** Custom gap between tabs */
  tabSpacing?: number;
  /** Maximum number of tabs before forcing scrollable mode */
  maxFixedTabs?: number;
  
  /** Styling */
  /** Container style override */
  style?: ViewStyle;
  /** Scroll container style override (scrollable mode only) */
  scrollStyle?: ViewStyle;
  /** Individual tab style override */
  tabStyle?: ViewStyle;
  /** Active tab style override */
  activeTabStyle?: ViewStyle;
  /** Tab text style override */
  textStyle?: TextStyle;
  /** Active tab text style override */
  activeTextStyle?: TextStyle;
  /** Underline indicator style (for underline variant) */
  indicatorStyle?: ViewStyle;
  
  /** Scroll Options (scrollable mode only) */
  /** Whether to show horizontal scroll indicator */
  showsHorizontalScrollIndicator?: boolean;
  /** Whether scrolling bounces at edges */
  bounces?: boolean;
  
  /** Accessibility */
  /** Container accessibility label */
  accessibilityLabel?: string;
  /** Test ID for testing */
  testID?: string;
}

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTab,
  onTabChange,
  mode = 'fixed',
  variant = 'default',
  size = 'md',
  showIcons = true,
  showBadges = true,
  iconPosition = 'left',
  showEmptyState = false,
  emptyStateProps,
  equalWidth = true,
  equalSpacing = false,
  tabSpacing,
  maxFixedTabs = 5,
  style,
  scrollStyle,
  tabStyle,
  activeTabStyle,
  textStyle,
  activeTextStyle,
  indicatorStyle,
  showsHorizontalScrollIndicator = false,
  bounces = false,
  accessibilityLabel,
  testID = 'tab-bar',
}) => {
  const { theme, screenDimensions } = useTheme();
  const styles = createStyles(theme, screenDimensions);
  const variantStyles = getVariantStyles(theme, variant, size);
  
  // Normalize tabs to consistent format
  const normalizedTabs: Tab[] = tabs.map((tab, index) => 
    typeof tab === 'string' 
      ? { value: tab, label: tab, id: tab } 
      : { id: tab.id || tab.value, ...tab }
  );
  
  // Auto-determine mode based on tab count
  const shouldScrollable = normalizedTabs.length > maxFixedTabs;
  const effectiveMode = shouldScrollable ? 'scrollable' : mode;
  
  // Empty state
  if (normalizedTabs.length === 0 && showEmptyState) {
    return (
      <View style={[styles.container, style]} testID={`${testID}-empty`}>
        <EmptySearchResult
          title={emptyStateProps?.title || "No tabs available"}
          description={emptyStateProps?.description || "No content to display"}
          iconName={(emptyStateProps?.iconName as keyof typeof Ionicons.glyphMap) || "albums-outline"}
        />
      </View>
    );
  }
  
  const renderBadge = (badge: number | undefined) => {
    if (!showBadges || !badge || badge <= 0) return null;
    
    const displayBadge = badge > 99 ? '99+' : badge.toString();
    
    return (
      <View style={[styles.badge, styles[`${size}Badge`]]}>
        <Text style={[styles.badgeText, styles[`${size}BadgeText`]]}>
          {displayBadge}
        </Text>
      </View>
    );
  };
  
  const renderIcon = (tab: Tab, isActive: boolean) => {
    if (!showIcons || !tab.icon) return null;
    
    const iconSize = size === 'sm' ? 16 : size === 'lg' ? 24 : 20;
    const iconColor = isActive 
      ? variantStyles.activeIconColor 
      : tab.disabled 
        ? theme.colors.icon.disabled
        : variantStyles.iconColor;
    
    return (
      <View style={[
        styles.iconContainer,
        styles[`icon${iconPosition.charAt(0).toUpperCase() + iconPosition.slice(1)}`]
      ]}>
        <Ionicons
          name={tab.icon}
          size={screenDimensions.isTablet ? iconSize * 1.2 : iconSize}
          color={iconColor}
        />
      </View>
    );
  };
  
  const renderTab = (tab: Tab, index: number) => {
    const isActive = activeTab === tab.value;
    const isDisabled = tab.disabled;
    
    const handlePress = () => {
      if (!isDisabled && tab.value !== activeTab) {
        onTabChange(tab.value);
      }
    };
    
    const tabContainerStyle = {
      ...styles.tab,
      ...styles[size],
      ...variantStyles.tab,
      ...(isActive && variantStyles.activeTab),
      ...(isDisabled && styles.disabledTab),
      ...(tab.color && isActive && { backgroundColor: tab.color }),
      ...(effectiveMode === 'fixed' && equalWidth && { flex: 1 }),
      ...tabStyle,
      ...(isActive && activeTabStyle),
    };
    
    const tabTextStyle = {
      ...styles.tabText,
      ...styles[`${size}Text`],
      color: isActive 
        ? variantStyles.activeTextColor 
        : isDisabled 
          ? theme.colors.text.disabled
          : variantStyles.textColor,
      ...(tab.color && isActive && { color: theme.colors.text.inverse }),
      ...textStyle,
      ...(isActive && activeTextStyle),
    };
    
    const contentDirection = iconPosition === 'top' || iconPosition === 'bottom' 
      ? 'column' 
      : 'row';
    
    const iconFirst = iconPosition === 'left' || iconPosition === 'top';
    
    return (
      <Pressable
        key={tab.id || tab.value}
        style={tabContainerStyle}
        onPress={handlePress}
        disabled={isDisabled}
        testID={`${testID}-tab-${tab.value}`}
        accessibilityRole="tab"
        accessibilityState={{ 
          selected: isActive,
          disabled: isDisabled,
        }}
        accessibilityLabel={tab.accessibilityLabel || tab.label}
      >
        <View style={[
          styles.tabContent,
          { flexDirection: contentDirection }
        ]}>
          {iconFirst && renderIcon(tab, isActive)}
          
          <View style={styles.labelContainer}>
            <Text style={tabTextStyle} numberOfLines={1} ellipsizeMode="tail">
              {tab.label}
            </Text>
            {renderBadge(tab.badge)}
          </View>
          
          {!iconFirst && renderIcon(tab, isActive)}
        </View>
        
        {/* Underline indicator for underline variant */}
        {variant === 'underline' && isActive && (
          <View style={[
            styles.underlineIndicator,
            styles[`${size}Indicator`],
            variantStyles.indicator,
            indicatorStyle,
          ]} />
        )}
      </Pressable>
    );
  };
  
  const tabsContent = (
    <View 
      style={[
        styles.tabsContainer,
        effectiveMode === 'scrollable' && styles.scrollableContainer,
        equalSpacing && styles.equalSpacing,
        { gap: tabSpacing ?? theme.spacing.xs },
      ]}
    >
      {normalizedTabs.map(renderTab)}
    </View>
  );
  
  if (effectiveMode === 'scrollable') {
    return (
      <View style={[styles.container, style]} testID={testID}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
          contentContainerStyle={[styles.scrollContainer, scrollStyle]}
          bounces={bounces}
          accessibilityRole="tablist"
          accessibilityLabel={accessibilityLabel}
        >
          {tabsContent}
        </ScrollView>
      </View>
    );
  }
  
  return (
    <View
      style={[styles.container, style]}
      testID={testID}
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
    >
      {tabsContent}
    </View>
  );
};

// Helper function to get variant-based styles
const getVariantStyles = (
  theme: any,
  variant: TabBarVariant,
  size: TabBarSize
) => {
  const baseStyles = {
    tab: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
    activeTab: {
      backgroundColor: theme.colors.interactive.primary + '15',
    },
    textColor: theme.colors.text.secondary,
    activeTextColor: theme.colors.interactive.primary,
    iconColor: theme.colors.icon.secondary,
    activeIconColor: theme.colors.interactive.primary,
    indicator: {
      backgroundColor: theme.colors.interactive.primary,
    },
  };

  switch (variant) {
    case 'underline':
      return {
        ...baseStyles,
        tab: {
          backgroundColor: 'transparent',
          borderBottomWidth: 2,
          borderBottomColor: 'transparent',
        },
        activeTab: {
          backgroundColor: 'transparent',
          borderBottomColor: theme.colors.interactive.primary,
        },
        textColor: theme.colors.text.primary,
        activeTextColor: theme.colors.interactive.primary,
        iconColor: theme.colors.icon.primary,
        activeIconColor: theme.colors.interactive.primary,
      };
    
    case 'pills':
      return {
        ...baseStyles,
        tab: {
          backgroundColor: theme.colors.background.secondary,
          borderRadius: theme.borderRadius.full,
          borderWidth: 1,
          borderColor: theme.colors.border.primary,
        },
        activeTab: {
          backgroundColor: theme.colors.interactive.primary,
          borderColor: theme.colors.interactive.primary,
        },
        activeTextColor: theme.colors.text.inverse,
        activeIconColor: theme.colors.text.inverse,
      };
    
    case 'cards':
      return {
        ...baseStyles,
        tab: {
          backgroundColor: theme.colors.background.secondary,
          borderRadius: theme.borderRadius.md,
          borderWidth: 1,
          borderColor: theme.colors.border.primary,
        },
        activeTab: {
          backgroundColor: theme.colors.interactive.primary,
          borderColor: theme.colors.interactive.primary,
        },
        activeTextColor: theme.colors.text.inverse,
        activeIconColor: theme.colors.text.inverse,
      };
    
    case 'minimal':
      return {
        ...baseStyles,
        tab: {
          backgroundColor: 'transparent',
        },
        activeTab: {
          backgroundColor: 'transparent',
        },
        textColor: theme.colors.text.tertiary,
        activeTextColor: theme.colors.text.primary,
        iconColor: theme.colors.icon.tertiary,
        activeIconColor: theme.colors.icon.primary,
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
      flexGrow: 0,
    },
    
    scrollContainer: {
      paddingHorizontal: theme.spacing.md,
    },
    
    tabsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    
    scrollableContainer: {
      paddingHorizontal: theme.spacing.sm,
    },
    
    equalSpacing: {
      justifyContent: 'space-around',
    },
    
    tab: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      minHeight: 44, // Accessibility minimum
      position: 'relative',
    },
    
    disabledTab: {
      opacity: 0.5,
    },
    
    tabContent: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    labelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    
    tabText: {
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
      textAlign: 'center',
      ...(isTablet && {
        fontSize: theme.fontSizes.sm * 1.1,
      }),
    },
    
    // Size variants
    sm: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      minHeight: 36,
    },
    
    md: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      minHeight: 44,
    },
    
    lg: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      minHeight: 52,
    },
    
    // Text size variants
    smText: {
      fontSize: isTablet ? theme.fontSizes.xs * 1.1 : theme.fontSizes.xs,
    },
    
    mdText: {
      fontSize: isTablet ? theme.fontSizes.sm * 1.1 : theme.fontSizes.sm,
    },
    
    lgText: {
      fontSize: isTablet ? theme.fontSizes.body * 1.1 : theme.fontSizes.body,
    },
    
    // Icon positioning
    iconContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    iconLeft: {
      marginRight: theme.spacing.xs,
    },
    
    iconRight: {
      marginLeft: theme.spacing.xs,
    },
    
    iconTop: {
      marginBottom: theme.spacing.xs,
    },
    
    iconBottom: {
      marginTop: theme.spacing.xs,
    },
    
    // Badge styles
    badge: {
      backgroundColor: theme.colors.interactive.primary,
      borderRadius: theme.borderRadius.full,
      marginLeft: theme.spacing.xs,
      minWidth: 18,
      height: 18,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 4,
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
      minWidth: 22,
      height: 22,
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
    
    // Underline indicator
    underlineIndicator: {
      position: 'absolute',
      bottom: 0,
      left: theme.spacing.sm,
      right: theme.spacing.sm,
      height: 2,
      borderRadius: 1,
    },
    
    smIndicator: {
      height: 1.5,
    },
    
    mdIndicator: {
      height: 2,
    },
    
    lgIndicator: {
      height: 3,
    },
  });
};

export default TabBar;