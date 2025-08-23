/**
 * Unified Chip Component
 * 
 * Combines the best features of FilterChip and PillTabs into a single,
 * comprehensive chip component supporting:
 * - Multiple visual variants (default, filled, outlined, ghost, primary)
 * - Size variants (xs, sm, md, lg)
 * - Single and multi-select modes
 * - Count badges with proper styling
 * - Icons and custom colors
 * - Full accessibility support
 */

import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

/** Visual variants for Chip */
export type ChipVariant = 
  | 'default'     // Standard chip with background
  | 'primary'     // Academy purple theme
  | 'filled'      // Filled background
  | 'outlined'    // Outline only
  | 'ghost';      // Minimal background

/** Size variants for Chip */
export type ChipSize = 'xs' | 'sm' | 'md' | 'lg';

/** Count display styles */
export type ChipCountStyle = 'badge' | 'inline' | 'separate';

/** Individual chip configuration */
export interface ChipItem {
  /** Unique identifier */
  value: string;
  /** Display label */
  label: string;
  /** Optional icon */
  icon?: keyof typeof Ionicons.glyphMap | React.ReactNode;
  /** Badge count */
  count?: number | string;
  /** Whether this chip is disabled */
  disabled?: boolean;
  /** Custom color override */
  customColor?: string;
  /** Show status dot */
  showDot?: boolean;
  /** Dot color */
  dotColor?: string;
}

export interface ChipProps {
  /** Single chip mode props */
  label?: string;
  value?: string;
  selected?: boolean;
  count?: number | string;
  icon?: keyof typeof Ionicons.glyphMap | React.ReactNode;
  onPress?: (value: string) => void;
  
  /** Multi-chip mode props */
  chips?: ChipItem[] | string[];
  activeChips?: string | string[];
  onChipChange?: (value: string | string[]) => void;
  
  /** Behavior */
  multiSelect?: boolean;
  disabled?: boolean;
  scrollable?: boolean;
  minSelections?: number;
  maxSelections?: number;
  
  /** Visual variants */
  variant?: ChipVariant;
  size?: ChipSize;
  countStyle?: ChipCountStyle;
  
  /** Display options */
  showIcons?: boolean;
  showCounts?: boolean;
  showDot?: boolean;
  dotColor?: string;
  customColor?: string;
  gap?: number;
  
  /** Styling */
  style?: ViewStyle;
  scrollStyle?: ViewStyle;
  chipStyle?: ViewStyle;
  activeChipStyle?: ViewStyle;
  textStyle?: TextStyle;
  activeTextStyle?: TextStyle;
  countTextStyle?: TextStyle;
  
  /** Accessibility */
  testID?: string;
  accessibilityLabel?: string;
}

export const Chip: React.FC<ChipProps> = ({
  // Single chip props
  label,
  value,
  selected = false,
  count,
  icon,
  onPress,
  
  // Multi-chip props
  chips,
  activeChips,
  onChipChange,
  
  // Behavior
  multiSelect = false,
  disabled = false,
  scrollable = true,
  minSelections = 0,
  maxSelections,
  
  // Visual
  variant = 'default',
  size = 'md',
  countStyle = 'badge',
  
  // Display
  showIcons = true,
  showCounts = true,
  showDot = false,
  dotColor,
  customColor,
  gap,
  
  // Styling
  style,
  scrollStyle,
  chipStyle,
  activeChipStyle,
  textStyle,
  activeTextStyle,
  countTextStyle,
  
  // Accessibility
  testID = 'chip',
  accessibilityLabel,
}) => {
  const { theme, screenDimensions } = useTheme();
  const styles = createStyles(theme, screenDimensions);
  
  // Single chip mode
  const isSingleMode = !chips && label && value;
  
  if (isSingleMode) {
    return (
      <SingleChip
        label={label!}
        value={value!}
        selected={selected}
        count={count}
        icon={icon}
        onPress={onPress}
        disabled={disabled}
        variant={variant}
        size={size}
        countStyle={countStyle}
        showIcons={showIcons}
        showCounts={showCounts}
        showDot={showDot}
        dotColor={dotColor}
        customColor={customColor}
        style={{...chipStyle, ...style}}
        textStyle={textStyle}
        activeTextStyle={activeTextStyle}
        countTextStyle={countTextStyle}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        theme={theme}
        screenDimensions={screenDimensions}
        styles={styles}
      />
    );
  }
  
  // Multi-chip mode
  if (!chips) return null;
  
  // Normalize chips to consistent format
  const normalizedChips: ChipItem[] = chips.map(chip => 
    typeof chip === 'string' 
      ? { value: chip, label: chip } 
      : chip
  );
  
  // Convert activeChips to array for consistent handling
  const activeChipArray = Array.isArray(activeChips) ? activeChips : activeChips ? [activeChips] : [];
  
  const isChipActive = (chipValue: string) => {
    return activeChipArray.includes(chipValue);
  };
  
  const handleChipPress = (chip: ChipItem) => {
    if (chip.disabled || disabled) return;
    if (!onChipChange) return;
    
    if (multiSelect) {
      let newSelection: string[];
      
      if (isChipActive(chip.value)) {
        // Remove from selection
        newSelection = activeChipArray.filter(value => value !== chip.value);
        
        // Ensure minimum selections
        if (newSelection.length < minSelections) {
          return;
        }
      } else {
        // Add to selection
        newSelection = [...activeChipArray, chip.value];
        
        // Ensure maximum selections
        if (maxSelections && newSelection.length > maxSelections) {
          return;
        }
      }
      
      onChipChange(newSelection);
    } else {
      // Single select
      onChipChange(chip.value);
    }
  };
  
  const renderChip = (chip: ChipItem, index: number) => {
    const isActive = isChipActive(chip.value);
    const isDisabled = chip.disabled || disabled;
    
    return (
      <SingleChip
        key={chip.value}
        label={chip.label}
        value={chip.value}
        selected={isActive}
        count={chip.count}
        icon={chip.icon}
        onPress={() => handleChipPress(chip)}
        disabled={isDisabled}
        variant={variant}
        size={size}
        countStyle={countStyle}
        showIcons={showIcons}
        showCounts={showCounts}
        showDot={chip.showDot ?? showDot}
        dotColor={chip.dotColor ?? dotColor}
        customColor={chip.customColor ?? customColor}
        style={{...chipStyle, ...(isActive && activeChipStyle)}}
        textStyle={textStyle}
        activeTextStyle={activeTextStyle}
        countTextStyle={countTextStyle}
        testID={`${testID}-${chip.value}`}
        accessibilityLabel={chip.label}
        theme={theme}
        screenDimensions={screenDimensions}
        styles={styles}
      />
    );
  };
  
  const chipsContent = (
    <View 
      style={[
        styles.chipsContainer, 
        { gap: gap ?? theme.spacing.xs },
      ]}
    >
      {normalizedChips.map(renderChip)}
    </View>
  );
  
  if (scrollable && normalizedChips.length > 3) {
    return (
      <View style={[styles.container, style]} testID={testID}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContainer, scrollStyle]}
          bounces={false}
          accessibilityRole={multiSelect ? undefined : "tablist"}
          accessibilityLabel={accessibilityLabel}
        >
          {chipsContent}
        </ScrollView>
      </View>
    );
  }
  
  return (
    <View
      style={[styles.container, style]}
      testID={testID}
      accessibilityRole={multiSelect ? undefined : "tablist"}
      accessibilityLabel={accessibilityLabel}
    >
      {chipsContent}
    </View>
  );
};

interface SingleChipProps extends Omit<ChipProps, 'chips' | 'activeChips' | 'onChipChange'> {
  label: string;
  value: string;
  selected: boolean;
  onPress?: (value: string) => void;
  theme: any;
  screenDimensions: any;
  styles: any;
}

const SingleChip: React.FC<SingleChipProps> = ({
  label,
  value,
  selected,
  count,
  icon,
  onPress,
  disabled = false,
  variant = 'default',
  size = 'md',
  countStyle = 'badge',
  showIcons = true,
  showCounts = true,
  showDot = false,
  dotColor,
  customColor,
  style,
  textStyle,
  activeTextStyle,
  countTextStyle,
  testID = "chip",
  accessibilityLabel,
  theme,
  screenDimensions,
  styles,
}) => {
  const variantStyles = getVariantStyles(theme, variant, selected, size);
  
  const handlePress = () => {
    if (!disabled && onPress) {
      onPress(value);
    }
  };
  
  const getIconSize = () => {
    switch (size) {
      case 'xs': return screenDimensions.isTablet ? 12 : 10;
      case 'sm': return screenDimensions.isTablet ? 14 : 12;
      case 'lg': return screenDimensions.isTablet ? 20 : 18;
      default: return screenDimensions.isTablet ? 16 : 14;
    }
  };
  
  const renderIcon = () => {
    if (!showIcons || !icon) return null;
    
    if (React.isValidElement(icon)) {
      return <View style={styles.iconContainer}>{icon}</View>;
    }
    
    return (
      <View style={styles.iconContainer}>
        <Ionicons
          name={icon as keyof typeof Ionicons.glyphMap}
          size={getIconSize()}
          color={selected ? variantStyles.activeIconColor : variantStyles.iconColor}
        />
      </View>
    );
  };
  
  const renderCount = () => {
    if (!showCounts || (count === undefined && count !== 0)) return null;
    
    const displayCount = typeof count === 'number' && count > 99 ? '99+' : count?.toString();
    
    if (countStyle === 'inline') {
      return (
        <Text style={[styles.countInline, styles[`${size}CountInline`], countTextStyle]}>
          {displayCount}
        </Text>
      );
    }
    
    if (countStyle === 'separate') {
      return (
        <Text style={[styles.countSeparate, styles[`${size}CountSeparate`], countTextStyle]}>
          {displayCount}
        </Text>
      );
    }
    
    // Default badge style
    const getBadgeStyles = () => {
      const baseBadgeStyle = [styles.countBadge, styles[`${size}CountBadge`]];
      const baseTextStyle = [styles.countBadgeText, styles[`${size}CountBadgeText`]];
      
      if (!selected) {
        return {
          badgeStyle: baseBadgeStyle,
          textStyle: baseTextStyle
        };
      }

      // Selected state - provide high contrast based on variant while maintaining shape
      switch (variant) {
        case 'outlined':
        case 'ghost':
          return {
            badgeStyle: [...baseBadgeStyle, { backgroundColor: theme.colors.interactive.primary }],
            textStyle: [...baseTextStyle, { color: theme.colors.text.inverse }]
          };
        default:
          return {
            badgeStyle: [...baseBadgeStyle, { backgroundColor: 'rgba(255, 255, 255, 0.9)' }],
            textStyle: [...baseTextStyle, { color: theme.colors.interactive.primary }]
          };
      }
    };

    const { badgeStyle, textStyle } = getBadgeStyles();

    return (
      <View style={badgeStyle}>
        <Text style={textStyle}>
          {displayCount}
        </Text>
      </View>
    );
  };
  
  const renderDot = () => {
    if (!showDot) return null;
    
    return (
      <View style={[
        styles.dot,
        styles[`${size}Dot`],
        { backgroundColor: dotColor || theme.colors.interactive.primary }
      ]} />
    );
  };
  
  const containerStyle = {
    ...styles.chip,
    ...styles[size],
    ...variantStyles.chip,
    ...(selected && variantStyles.activeChip),
    ...(customColor && { borderColor: customColor }),
    ...(customColor && selected && { backgroundColor: customColor }),
    ...(disabled && styles.disabled),
    ...style,
  };
  
  const labelStyle = {
    ...styles.chipText,
    ...styles[`${size}Text`],
    color: selected ? variantStyles.activeTextColor : variantStyles.textColor,
    ...(customColor && selected && { color: theme.colors.text.inverse }),
    ...textStyle,
    ...(selected && activeTextStyle),
  };
  
  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => ({
        ...containerStyle,
        ...(pressed && !disabled && styles.pressed),
      })}
      disabled={disabled}
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ 
        selected: selected,
        disabled: disabled,
      }}
      accessibilityLabel={accessibilityLabel || `${label}${count !== undefined ? `, ${count} items` : ''}`}
      hitSlop={{
        top: theme.spacing.xs,
        bottom: theme.spacing.xs,
        left: theme.spacing.xs,
        right: theme.spacing.xs,
      }}
    >
      {renderDot()}
      {renderIcon()}
      
      <Text 
        style={labelStyle}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {label}
      </Text>
      
      {renderCount()}
    </Pressable>
  );
};

// Helper function to get variant-based styles
const getVariantStyles = (
  theme: any,
  variant: ChipVariant,
  selected: boolean,
  size: ChipSize
) => {
  const baseStyles = {
    chip: {
      backgroundColor: theme.colors.background.secondary,
      borderColor: theme.colors.border.primary,
      borderWidth: 1,
    },
    activeChip: {
      backgroundColor: theme.colors.interactive.primary,
      borderColor: theme.colors.interactive.primary,
    },
    textColor: theme.colors.text.secondary,
    activeTextColor: theme.colors.text.inverse,
    iconColor: theme.colors.icon.secondary,
    activeIconColor: theme.colors.text.inverse,
  };

  if (selected) {
    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          activeChip: {
            backgroundColor: theme.colors.interactive.primary,
            borderColor: theme.colors.interactive.primary,
            borderWidth: 1,
          },
        };
        
      case 'filled':
        return {
          ...baseStyles,
          activeChip: {
            backgroundColor: theme.colors.interactive.primary,
            borderWidth: 0,
          },
        };
        
      case 'outlined':
        return {
          ...baseStyles,
          activeChip: {
            backgroundColor: 'transparent',
            borderColor: theme.colors.interactive.primary,
            borderWidth: 2,
          },
          activeTextColor: theme.colors.interactive.primary,
          activeIconColor: theme.colors.interactive.primary,
        };
        
      case 'ghost':
        return {
          ...baseStyles,
          activeChip: {
            backgroundColor: theme.colors.interactive.primary + '15',
            borderWidth: 0,
          },
          activeTextColor: theme.colors.interactive.primary,
          activeIconColor: theme.colors.interactive.primary,
        };
        
      default: // 'default'
        return {
          ...baseStyles,
          activeChip: {
            backgroundColor: theme.colors.interactive.primary + '15',
            borderColor: theme.colors.interactive.primary,
            borderWidth: 1,
          },
          activeTextColor: theme.colors.interactive.primary,
          activeIconColor: theme.colors.interactive.primary,
        };
    }
  }

  // Unselected state modifications by variant
  switch (variant) {
    case 'filled':
      return {
        ...baseStyles,
        chip: {
          backgroundColor: theme.colors.background.tertiary,
          borderWidth: 0,
        },
      };
      
    case 'outlined':
      return {
        ...baseStyles,
        chip: {
          backgroundColor: 'transparent',
          borderColor: theme.colors.border.primary,
          borderWidth: 1,
        },
        textColor: theme.colors.text.primary,
        iconColor: theme.colors.icon.primary,
      };
      
    case 'ghost':
      return {
        ...baseStyles,
        chip: {
          backgroundColor: 'transparent',
          borderWidth: 0,
        },
        textColor: theme.colors.text.primary,
        iconColor: theme.colors.icon.primary,
      };
      
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
    
    chipsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background.secondary,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.full,
      marginRight: theme.spacing.sm,
      marginBottom: theme.spacing.xs,
    },
    
    pressed: {
      opacity: 0.8,
      transform: [{ scale: 0.96 }],
    },
    
    disabled: {
      opacity: 0.5,
    },
    
    // Size variants
    xs: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      minHeight: isTablet ? 28 : 24,
      borderRadius: 12,
    },
    
    sm: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      minHeight: isTablet ? 32 : 28,
      borderRadius: 14,
    },
    
    md: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      minHeight: isTablet ? 36 : 32,
      borderRadius: theme.borderRadius.full,
    },
    
    lg: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      minHeight: isTablet ? 44 : 40,
      borderRadius: theme.borderRadius.full,
    },
    
    // Dot styles
    dot: {
      borderRadius: 4,
      marginRight: theme.spacing.xs,
    },
    
    xsDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    
    smDot: {
      width: 7,
      height: 7,
      borderRadius: 3.5,
    },
    
    mdDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    
    lgDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    
    // Icon styles
    iconContainer: {
      marginRight: theme.spacing.xs,
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    // Text styles
    chipText: {
      fontWeight: theme.fontConfig.fontWeight.medium,
      flexShrink: 1,
    },
    
    xsText: {
      fontSize: isTablet ? theme.fontSizes.xs * 1.1 : theme.fontSizes.xs,
    },
    
    smText: {
      fontSize: isTablet ? theme.fontSizes.sm * 1.1 : theme.fontSizes.sm,
    },
    
    mdText: {
      fontSize: isTablet ? theme.fontSizes.small * 1.1 : theme.fontSizes.small,
    },
    
    lgText: {
      fontSize: isTablet ? theme.fontSizes.body * 1.1 : theme.fontSizes.body,
    },
    
    // Count badge styles
    countBadge: {
      backgroundColor: theme.colors.background.tertiary,
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: 2,
      marginLeft: theme.spacing.xs,
      minWidth: theme.spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    countBadgeText: {
      fontWeight: theme.fontConfig.fontWeight.bold,
      color: theme.colors.text.secondary,
      textAlign: 'center',
    },
    
    // Count badge size variants
    xsCountBadge: {
      minWidth: 16,
      height: 16,
      borderRadius: 8,
      paddingHorizontal: 4,
    },
    
    smCountBadge: {
      minWidth: 18,
      height: 18,
      borderRadius: 9,
      paddingHorizontal: 5,
    },
    
    mdCountBadge: {
      minWidth: 20,
      height: 20,
      borderRadius: 10,
      paddingHorizontal: 6,
    },
    
    lgCountBadge: {
      minWidth: 24,
      height: 24,
      borderRadius: 12,
      paddingHorizontal: 8,
    },
    
    xsCountBadgeText: {
      fontSize: isTablet ? 9 : 8,
      lineHeight: 10,
    },
    
    smCountBadgeText: {
      fontSize: isTablet ? 10 : 9,
      lineHeight: 11,
    },
    
    mdCountBadgeText: {
      fontSize: isTablet ? 11 : 10,
      lineHeight: 12,
    },
    
    lgCountBadgeText: {
      fontSize: isTablet ? 12 : 11,
      lineHeight: 13,
    },
    
    // Count inline styles
    countInline: {
      fontWeight: theme.fontConfig.fontWeight.bold,
      color: theme.colors.interactive.primary,
      marginLeft: theme.spacing.xs,
    },
    
    xsCountInline: {
      fontSize: isTablet ? theme.fontSizes.xs * 1.1 : theme.fontSizes.xs,
    },
    
    smCountInline: {
      fontSize: isTablet ? theme.fontSizes.sm * 1.1 : theme.fontSizes.sm,
    },
    
    mdCountInline: {
      fontSize: isTablet ? theme.fontSizes.small * 1.1 : theme.fontSizes.small,
    },
    
    lgCountInline: {
      fontSize: isTablet ? theme.fontSizes.body * 1.1 : theme.fontSizes.body,
    },
    
    // Count separate styles
    countSeparate: {
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: theme.colors.text.tertiary,
      marginLeft: theme.spacing.xs,
    },
    
    xsCountSeparate: {
      fontSize: isTablet ? theme.fontSizes.xs * 0.9 : theme.fontSizes.xs * 0.8,
    },
    
    smCountSeparate: {
      fontSize: isTablet ? theme.fontSizes.sm * 0.9 : theme.fontSizes.sm * 0.8,
    },
    
    mdCountSeparate: {
      fontSize: isTablet ? theme.fontSizes.small * 0.9 : theme.fontSizes.small * 0.8,
    },
    
    lgCountSeparate: {
      fontSize: isTablet ? theme.fontSizes.body * 0.9 : theme.fontSizes.body * 0.8,
    },
  });
};

export default Chip;