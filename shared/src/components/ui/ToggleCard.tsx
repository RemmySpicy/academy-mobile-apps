/**
 * ToggleCard Component
 * 
 * A reusable expandable/collapsible card component with Academy theming.
 * Supports custom count badges and responsive behavior for mobile and tablet.
 */

import React, { useState } from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

/** Status/semantic variants for ToggleCard */
export type ToggleCardVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';

/** Size variants for ToggleCard */
export type ToggleCardSize = 'sm' | 'md' | 'lg';

/** Style variants for ToggleCard */
export type ToggleCardStyle = 'filled' | 'outlined' | 'ghost' | 'elevated';

/** Icon style variants for ToggleCard */
export type ToggleCardIconStyle = 'arrow' | 'chevron' | 'plus' | 'custom';

export interface ToggleCardProps {
  /** The title text to display */
  title: string;
  /** Optional count badge number */
  count?: number;
  /** Initial expanded state */
  initialExpanded?: boolean;
  /** Callback when toggle state changes */
  onToggle?: (isExpanded: boolean) => void;
  
  // Variant Props
  /** Visual variant affecting colors and styling */
  variant?: ToggleCardVariant;
  /** Size variant affecting dimensions and typography */
  size?: ToggleCardSize;
  /** Style variant affecting appearance */
  styleVariant?: ToggleCardStyle;
  /** Icon style variant */
  iconStyle?: ToggleCardIconStyle;
  
  // Dimensional Props
  /** Width as a percentage of screen width (0-1) */
  widthPercentage?: number;
  
  // Custom Style Overrides (take precedence over variants)
  /** Custom background color (overrides theme and variant) */
  backgroundColor?: string;
  /** Custom count badge background color */
  countBackgroundColor?: string;
  /** Custom icon color */
  iconColor?: string;
  /** Custom text color */
  textColor?: string;
  /** Custom border color */
  borderColor?: string;
  
  // State Props
  /** Disabled state */
  disabled?: boolean;
  
  // Accessibility & Testing
  /** Custom test ID for testing */
  testID?: string;
  
  // Style Overrides
  /** Additional styles for the container */
  style?: ViewStyle;
  /** Additional styles for the title text */
  titleStyle?: TextStyle;
  /** Additional styles for the count badge */
  countStyle?: TextStyle;
  
  // Icon Customization
  /** Custom icon component (only used when iconStyle is 'custom') */
  customIcon?: {
    expanded: React.ReactNode;
    collapsed: React.ReactNode;
  };
}

export const ToggleCard: React.FC<ToggleCardProps> = ({
  title,
  count,
  initialExpanded = false,
  onToggle,
  variant = 'default',
  size = 'md',
  styleVariant = 'filled',
  iconStyle = 'arrow',
  widthPercentage,
  backgroundColor,
  countBackgroundColor,
  iconColor,
  textColor,
  borderColor,
  disabled = false,
  testID,
  style,
  titleStyle,
  countStyle,
  customIcon,
}) => {
  const { theme, screenDimensions } = useTheme();
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  const handlePress = () => {
    if (disabled) return;
    
    const newState = !isExpanded;
    setIsExpanded(newState);
    onToggle?.(newState);
  };

  const styles = createStyles(theme, screenDimensions);
  const variantStyles = getVariantStyles(theme, variant, size, styleVariant);

  const containerStyles = [
    styles.container,
    styles[size],
    variantStyles.container,
    styleVariant === 'outlined' && styles.outlined,
    styleVariant === 'ghost' && styles.ghost,
    styleVariant === 'elevated' && styles.elevated,
    {
      backgroundColor: backgroundColor || variantStyles.backgroundColor,
      borderColor: borderColor || variantStyles.borderColor,
      width: widthPercentage ? screenDimensions.width * widthPercentage : undefined,
      opacity: disabled ? 0.6 : 1,
    },
    style,
  ];
  
  const titleStyles = [
    styles.title,
    styles[`${size}Title`],
    {
      color: textColor || variantStyles.textColor,
    },
    titleStyle,
  ];
  
  const countStyles = [
    styles.count,
    styles[`${size}Count`],
    {
      backgroundColor: countBackgroundColor || variantStyles.countBackgroundColor,
      color: variantStyles.countTextColor,
    },
    countStyle,
  ];

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        containerStyles,
        pressed && !disabled && styles.pressed,
      ]}
      disabled={disabled}
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ 
        expanded: isExpanded,
        disabled: disabled,
      }}
      accessibilityLabel={`${title}${count !== undefined ? `, ${count} items` : ''}${isExpanded ? ', expanded' : ', collapsed'}`}
    >
      {renderIcon(iconStyle, isExpanded, {
        size: variantStyles.iconSize,
        color: iconColor || variantStyles.iconColor,
        style: styles.icon,
        customIcon,
      })}
      
      <Text 
        style={titleStyles}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {title}
      </Text>
      
      {count !== undefined && (
        <Text 
          style={countStyles}
          accessibilityLabel={`${count} items`}
        >
          {count}
        </Text>
      )}
    </Pressable>
  );
};

// Helper function to render icons based on icon style
const renderIcon = (
  iconStyle: ToggleCardIconStyle,
  isExpanded: boolean,
  props: {
    size: number;
    color: string;
    style: any;
    customIcon?: {
      expanded: React.ReactNode;
      collapsed: React.ReactNode;
    };
  }
) => {
  const { size, color, style, customIcon } = props;

  if (iconStyle === 'custom' && customIcon) {
    return (
      <React.Fragment>
        {isExpanded ? customIcon.expanded : customIcon.collapsed}
      </React.Fragment>
    );
  }

  const getIconName = () => {
    switch (iconStyle) {
      case 'chevron':
        return isExpanded ? 'chevron-down' : 'chevron-forward';
      case 'plus':
        return isExpanded ? 'remove' : 'add';
      case 'arrow':
      default:
        return isExpanded ? 'down' : 'right';
    }
  };

  const IconComponent = iconStyle === 'chevron' || iconStyle === 'plus' ? Ionicons : AntDesign;
  
  return (
    <IconComponent
      name={getIconName() as any}
      size={size}
      color={color}
      style={style}
    />
  );
};

// Helper function to get variant-based styles
const getVariantStyles = (
  theme: any,
  variant: ToggleCardVariant,
  size: ToggleCardSize,
  styleVariant: ToggleCardStyle
) => {
  const baseStyles = {
    backgroundColor: theme.colors.background.secondary,
    textColor: theme.colors.text.primary,
    iconColor: theme.colors.icon.primary,
    borderColor: theme.colors.border.primary,
    countBackgroundColor: theme.colors.interactive.primaryDisabled,
    countTextColor: theme.colors.text.primary,
    iconSize: size === 'sm' ? 12 : size === 'md' ? 14 : 16,
    container: {},
  };

  // Apply variant-specific colors
  switch (variant) {
    case 'primary':
      return {
        ...baseStyles,
        backgroundColor: theme.colors.interactive.primary + '10',
        borderColor: theme.colors.interactive.primary,
        textColor: theme.colors.interactive.primary,
        iconColor: theme.colors.interactive.primary,
        countBackgroundColor: theme.colors.interactive.primary,
        countTextColor: theme.colors.text.inverse,
      };
    case 'success':
      return {
        ...baseStyles,
        backgroundColor: theme.colors.status.success + '10',
        borderColor: theme.colors.status.success,
        textColor: theme.colors.status.success,
        iconColor: theme.colors.status.success,
        countBackgroundColor: theme.colors.status.success,
        countTextColor: theme.colors.text.inverse,
      };
    case 'warning':
      return {
        ...baseStyles,
        backgroundColor: theme.colors.status.warning + '10',
        borderColor: theme.colors.status.warning,
        textColor: theme.colors.status.warning,
        iconColor: theme.colors.status.warning,
        countBackgroundColor: theme.colors.status.warning,
        countTextColor: theme.colors.text.inverse,
      };
    case 'error':
      return {
        ...baseStyles,
        backgroundColor: theme.colors.status.error + '10',
        borderColor: theme.colors.status.error,
        textColor: theme.colors.status.error,
        iconColor: theme.colors.status.error,
        countBackgroundColor: theme.colors.status.error,
        countTextColor: theme.colors.text.inverse,
      };
    case 'info':
      return {
        ...baseStyles,
        backgroundColor: theme.colors.status.info + '10',
        borderColor: theme.colors.status.info,
        textColor: theme.colors.status.info,
        iconColor: theme.colors.status.info,
        countBackgroundColor: theme.colors.status.info,
        countTextColor: theme.colors.text.inverse,
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
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: theme.borderRadius.md,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.sm,
      marginBottom: theme.spacing.xs,
      minHeight: theme.safeArea.minTouchTarget.height,
      borderWidth: 0,
      // Responsive width handling
      ...(isTablet && {
        maxWidth: 400, // Prevent excessive width on tablets
        minWidth: 200, // Ensure minimum usable width
      }),
    },
    
    // Size Variants
    sm: {
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.xs,
      minHeight: 32,
      borderRadius: theme.borderRadius.sm,
    },
    
    md: {
      // Uses container default values
    },
    
    lg: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      minHeight: 56,
      borderRadius: theme.borderRadius.lg,
    },
    
    // Style Variants
    outlined: {
      backgroundColor: 'transparent',
      borderWidth: theme.borderWidth.md,
    },
    
    ghost: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
    
    elevated: {
      ...theme.elevation?.md,
      backgroundColor: theme.colors.background.elevated || theme.colors.background.secondary,
    },
    
    pressed: {
      opacity: 0.8,
      transform: [{ scale: 0.98 }],
    },
    
    icon: {
      marginRight: theme.spacing.sm,
    },
    
    title: {
      flex: 1,
      fontSize: theme.fontSizes.body,
      fontWeight: theme.fontConfig.fontWeight.medium,
      // Responsive font scaling for tablets
      ...(isTablet && {
        fontSize: theme.fontSizes.body * 1.1,
      }),
    },
    
    // Title Size Variants
    smTitle: {
      fontSize: theme.fontSizes.sm,
      ...(isTablet && {
        fontSize: theme.fontSizes.sm * 1.1,
      }),
    },
    
    mdTitle: {
      // Uses title default values
    },
    
    lgTitle: {
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      ...(isTablet && {
        fontSize: theme.fontSizes.lg * 1.1,
      }),
    },
    
    count: {
      fontSize: theme.fontSizes.caption,
      fontWeight: theme.fontConfig.fontWeight.medium,
      borderRadius: theme.borderRadius.full,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs / 2,
      marginLeft: theme.spacing.sm,
      minWidth: theme.spacing.lg,
      textAlign: 'center',
      overflow: 'hidden',
    },
    
    // Count Size Variants
    smCount: {
      fontSize: theme.fontSizes.xs,
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: theme.spacing.xs / 4,
      minWidth: theme.spacing.md,
    },
    
    mdCount: {
      // Uses count default values
    },
    
    lgCount: {
      fontSize: theme.fontSizes.sm,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      minWidth: theme.spacing.xl,
    },
  });
};

export default ToggleCard;