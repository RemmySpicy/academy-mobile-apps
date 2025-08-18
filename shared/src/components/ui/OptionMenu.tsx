/**
 * OptionMenu Component
 * 
 * A reusable dropdown menu component for displaying context menu options.
 * Provides edit, delete, and custom action capabilities with Academy theming.
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  Pressable,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';

export interface MenuOption {
  /** Unique identifier for the option */
  id: string;
  /** Display text for the option */
  label: string;
  /** Icon name from Ionicons */
  iconName?: keyof typeof Ionicons.glyphMap;
  /** Icon color */
  iconColor?: string;
  /** Text color */
  textColor?: string;
  /** Callback when option is selected */
  onPress: () => void;
  /** Whether the option is destructive (uses error styling) */
  destructive?: boolean;
  /** Whether the option is disabled */
  disabled?: boolean;
}

export interface OptionMenuProps {
  /** Array of menu options */
  options: MenuOption[];
  /** Trigger icon name */
  triggerIcon?: keyof typeof Ionicons.glyphMap;
  /** Trigger icon size */
  triggerIconSize?: number;
  /** Trigger icon color */
  triggerIconColor?: string;
  /** Custom trigger component */
  triggerComponent?: React.ReactElement;
  /** Menu position relative to trigger */
  position?: 'auto' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** Custom menu container styles */
  menuStyle?: ViewStyle;
  /** Custom trigger container styles */
  triggerStyle?: ViewStyle;
  /** Custom option styles */
  optionStyle?: ViewStyle;
  /** Custom option text styles */
  optionTextStyle?: TextStyle;
  /** Whether the menu is disabled */
  disabled?: boolean;
  /** Test ID for testing */
  testID?: string;
  /** Callback when menu opens */
  onMenuOpen?: () => void;
  /** Callback when menu closes */
  onMenuClose?: () => void;
}

export const OptionMenu: React.FC<OptionMenuProps> = ({
  options,
  triggerIcon = 'ellipsis-vertical',
  triggerIconSize,
  triggerIconColor,
  triggerComponent,
  position = 'auto',
  menuStyle,
  triggerStyle,
  optionStyle,
  optionTextStyle,
  disabled = false,
  testID = 'option-menu',
  onMenuOpen,
  onMenuClose,
}) => {
  const { theme, screenDimensions } = useTheme();
  const styles = createStyles(theme, screenDimensions);
  
  const [isVisible, setIsVisible] = useState(false);
  const [menuLayout, setMenuLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const triggerRef = useRef<any>(null);
  
  const dynamicTriggerIconSize = triggerIconSize || (screenDimensions.isTablet ? theme.iconSize.lg : theme.iconSize.md);
  const dynamicTriggerIconColor = triggerIconColor || theme.colors.icon.primary;

  const openMenu = () => {
    if (disabled) return;
    
    triggerRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setMenuLayout({ x: pageX, y: pageY, width, height });
      setIsVisible(true);
      onMenuOpen?.();
    });
  };

  const closeMenu = () => {
    setIsVisible(false);
    onMenuClose?.();
  };

  const handleOptionPress = (option: MenuOption) => {
    if (option.disabled) return;
    closeMenu();
    option.onPress();
  };

  const calculateMenuPosition = () => {
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const menuWidth = 200; // Estimated menu width
    const menuHeight = options.length * 48 + 24; // Estimated menu height
    
    let left = menuLayout.x;
    let top = menuLayout.y + menuLayout.height + 4;
    
    // Adjust position based on screen boundaries
    if (position === 'auto') {
      // Horizontal adjustment
      if (left + menuWidth > screenWidth) {
        left = menuLayout.x + menuLayout.width - menuWidth;
      }
      
      // Vertical adjustment
      if (top + menuHeight > screenHeight) {
        top = menuLayout.y - menuHeight - 4;
      }
    } else {
      // Manual positioning
      switch (position) {
        case 'top-left':
          left = menuLayout.x;
          top = menuLayout.y - menuHeight - 4;
          break;
        case 'top-right':
          left = menuLayout.x + menuLayout.width - menuWidth;
          top = menuLayout.y - menuHeight - 4;
          break;
        case 'bottom-left':
          left = menuLayout.x;
          top = menuLayout.y + menuLayout.height + 4;
          break;
        case 'bottom-right':
          left = menuLayout.x + menuLayout.width - menuWidth;
          top = menuLayout.y + menuLayout.height + 4;
          break;
      }
    }
    
    return {
      left: Math.max(8, Math.min(left, screenWidth - menuWidth - 8)),
      top: Math.max(8, Math.min(top, screenHeight - menuHeight - 8)),
      minWidth: menuWidth,
    };
  };

  const renderTrigger = () => {
    if (triggerComponent) {
      return React.cloneElement(triggerComponent, {
        onPress: openMenu,
      } as any);
    }

    return (
      <TouchableOpacity
        ref={triggerRef}
        onPress={openMenu}
        style={[styles.trigger, triggerStyle]}
        disabled={disabled}
        testID={`${testID}-trigger`}
        accessibilityRole="button"
        accessibilityLabel="Open menu"
        accessibilityHint="Opens a context menu with available actions"
      >
        <Ionicons
          name={triggerIcon}
          size={dynamicTriggerIconSize}
          color={disabled ? theme.colors.icon.disabled : dynamicTriggerIconColor}
        />
      </TouchableOpacity>
    );
  };

  const renderOption = (option: MenuOption, index: number) => {
    const isDestructive = option.destructive;
    const isDisabled = option.disabled;
    const iconColor = option.iconColor || 
      (isDestructive ? theme.colors.status.error : 
       isDisabled ? theme.colors.icon.disabled : theme.colors.icon.primary);
    const textColor = option.textColor || 
      (isDestructive ? theme.colors.status.error : 
       isDisabled ? theme.colors.text.disabled : theme.colors.text.primary);

    return (
      <TouchableOpacity
        key={option.id}
        style={[
          styles.option,
          index === 0 && styles.firstOption,
          index === options.length - 1 && styles.lastOption,
          isDisabled && styles.disabledOption,
          optionStyle,
        ]}
        onPress={() => handleOptionPress(option)}
        disabled={isDisabled}
        testID={`${testID}-option-${option.id}`}
        accessibilityRole="menuitem"
        accessibilityLabel={option.label}
        accessibilityState={{ disabled: isDisabled }}
      >
        <View style={styles.optionContent}>
          {option.iconName && (
            <Ionicons
              name={option.iconName}
              size={theme.iconSize.sm}
              color={iconColor}
              style={styles.optionIcon}
            />
          )}
          <Text
            style={[
              styles.optionText,
              { color: textColor },
              optionTextStyle,
            ]}
          >
            {option.label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View testID={testID}>
      {renderTrigger()}
      
      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <Pressable
          style={styles.backdrop}
          onPress={closeMenu}
          testID={`${testID}-backdrop`}
        >
          <View
            style={[
              styles.menuContainer,
              calculateMenuPosition(),
              menuStyle,
            ]}
          >
            {options.map(renderOption)}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const createStyles = (theme: any, screenDimensions: any) => {
  return StyleSheet.create({
    trigger: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: theme.safeArea.minTouchTarget.width,
      minHeight: theme.safeArea.minTouchTarget.height,
    },

    backdrop: {
      flex: 1,
      backgroundColor: 'transparent',
    },

    menuContainer: {
      position: 'absolute',
      backgroundColor: theme.colors.background.elevated,
      borderRadius: theme.borderRadius.lg,
      paddingVertical: theme.spacing.sm,
      shadowColor: theme.colors.shadow.primary,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },

    option: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      minHeight: 48,
      justifyContent: 'center',
    },

    firstOption: {
      borderTopLeftRadius: theme.borderRadius.lg,
      borderTopRightRadius: theme.borderRadius.lg,
    },

    lastOption: {
      borderBottomLeftRadius: theme.borderRadius.lg,
      borderBottomRightRadius: theme.borderRadius.lg,
    },

    disabledOption: {
      opacity: 0.5,
    },

    optionContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    optionIcon: {
      marginRight: theme.spacing.sm,
    },

    optionText: {
      fontSize: theme.fontSizes.body,
      fontWeight: theme.fontConfig.fontWeight.regular,
      lineHeight: 20,
    },
  });
};

export default OptionMenu;