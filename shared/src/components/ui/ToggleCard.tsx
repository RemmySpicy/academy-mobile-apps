/**
 * ToggleCard Component
 * 
 * A reusable expandable/collapsible card component with Academy theming.
 * Supports custom count badges and responsive behavior for mobile and tablet.
 */

import React, { useState } from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useTheme } from '../../theme';

export interface ToggleCardProps {
  /** The title text to display */
  title: string;
  /** Optional count badge number */
  count?: number;
  /** Initial expanded state */
  initialExpanded?: boolean;
  /** Callback when toggle state changes */
  onToggle?: (isExpanded: boolean) => void;
  /** Width as a percentage of screen width (0-1) */
  widthPercentage?: number;
  /** Custom background color (overrides theme) */
  backgroundColor?: string;
  /** Custom count badge background color */
  countBackgroundColor?: string;
  /** Custom icon color */
  iconColor?: string;
  /** Custom text color */
  textColor?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Custom test ID for testing */
  testID?: string;
  /** Additional styles for the container */
  style?: ViewStyle;
  /** Additional styles for the title text */
  titleStyle?: TextStyle;
  /** Additional styles for the count badge */
  countStyle?: TextStyle;
}

export const ToggleCard: React.FC<ToggleCardProps> = ({
  title,
  count,
  initialExpanded = false,
  onToggle,
  widthPercentage,
  backgroundColor,
  countBackgroundColor,
  iconColor,
  textColor,
  disabled = false,
  testID,
  style,
  titleStyle,
  countStyle,
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

  const containerStyles = [
    styles.container,
    {
      backgroundColor: backgroundColor || theme.colors.background.secondary,
      width: widthPercentage ? screenDimensions.width * widthPercentage : undefined,
      opacity: disabled ? 0.6 : 1,
    },
    style,
  ];
  
  const titleStyles = [
    styles.title,
    {
      color: textColor || theme.colors.text.primary,
    },
    titleStyle,
  ];
  
  const countStyles = [
    styles.count,
    {
      backgroundColor: countBackgroundColor || theme.colors.interactive.primaryDisabled,
      color: theme.colors.text.primary,
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
      <AntDesign 
        name={isExpanded ? "down" : "right"} 
        size={theme.iconSize.sm}
        color={iconColor || theme.colors.icon.primary}
        style={styles.icon}
      />
      
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
      // Responsive width handling
      ...(isTablet && {
        maxWidth: 400, // Prevent excessive width on tablets
        minWidth: 200, // Ensure minimum usable width
      }),
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
  });
};

export default ToggleCard;