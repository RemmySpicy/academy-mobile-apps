/**
 * HeaderComponent
 * 
 * Flexible header components with Academy theming.
 * Supports various configurations: simple, with avatar, with navigation, with actions.
 */

import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ViewStyle, TextStyle, ImageStyle, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

export interface BaseHeaderProps {
  /** Title text */
  title: string;
  /** Custom container styles */
  style?: ViewStyle;
  /** Custom title styles */
  titleStyle?: TextStyle;
  /** Test ID for testing */
  testID?: string;
}

export interface SimpleHeaderProps extends BaseHeaderProps {
  /** Avatar image source */
  avatarSource?: ImageSourcePropType;
  /** Avatar size */
  avatarSize?: number;
  /** Custom avatar styles */
  avatarStyle?: ImageStyle;
  /** Callback when avatar is pressed */
  onAvatarPress?: () => void;
}

export interface NavigationHeaderProps extends BaseHeaderProps {
  /** Back button handler */
  onBackPress?: () => void;
  /** Show notification bell */
  showNotification?: boolean;
  /** Notification handler */
  onNotificationPress?: () => void;
  /** Custom back icon */
  backIcon?: keyof typeof Ionicons.glyphMap;
  /** Custom notification icon */
  notificationIcon?: keyof typeof Ionicons.glyphMap;
  /** Show notification badge */
  showNotificationBadge?: boolean;
  /** Right action buttons */
  rightActions?: React.ReactNode;
}

export interface CustomHeaderProps extends BaseHeaderProps {
  /** Left side content */
  leftContent?: React.ReactNode;
  /** Right side content */
  rightContent?: React.ReactNode;
  /** Center the title */
  centerTitle?: boolean;
}

/**
 * Simple Header with optional avatar
 */
export const SimpleHeader: React.FC<SimpleHeaderProps> = ({
  title,
  avatarSource,
  avatarSize,
  avatarStyle,
  onAvatarPress,
  style,
  titleStyle,
  testID = "simple-header",
}) => {
  const { theme, screenDimensions } = useTheme();
  const styles = createStyles(theme, screenDimensions);

  const dynamicAvatarSize = avatarSize || (screenDimensions.isTablet ? 56 : 47);

  return (
    <View 
      style={[styles.container, style]}
      testID={testID}
    >
      <Text 
        style={[styles.title, titleStyle]}
        numberOfLines={1}
        ellipsizeMode="tail"
        testID={`${testID}-title`}
      >
        {title}
      </Text>
      
      {avatarSource && (
        <TouchableOpacity
          onPress={onAvatarPress}
          disabled={!onAvatarPress}
          testID={`${testID}-avatar`}
          accessibilityRole={onAvatarPress ? "button" : "image"}
          accessibilityLabel="Profile avatar"
        >
          <Image
            source={avatarSource}
            style={[
              styles.avatar,
              {
                width: dynamicAvatarSize,
                height: dynamicAvatarSize,
              },
              avatarStyle,
            ]}
            accessibilityIgnoresInvertColors
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

/**
 * Navigation Header with back button and optional notification
 */
export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  title,
  onBackPress,
  showNotification = false,
  onNotificationPress,
  backIcon = "arrow-back",
  notificationIcon = "notifications-outline",
  showNotificationBadge = false,
  rightActions,
  style,
  titleStyle,
  testID = "navigation-header",
}) => {
  const { theme, screenDimensions } = useTheme();
  const styles = createStyles(theme, screenDimensions);

  const iconSize = screenDimensions.isTablet ? theme.iconSize.lg : theme.iconSize.md;

  return (
    <View 
      style={[styles.container, style]}
      testID={testID}
    >
      {/* Left Side - Back Button */}
      <TouchableOpacity
        onPress={onBackPress}
        style={styles.iconButton}
        disabled={!onBackPress}
        testID={`${testID}-back`}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        hitSlop={{
          top: theme.spacing.sm,
          bottom: theme.spacing.sm,
          left: theme.spacing.sm,
          right: theme.spacing.sm,
        }}
      >
        <Ionicons 
          name={backIcon} 
          size={iconSize}
          color={theme.colors.icon.primary}
        />
      </TouchableOpacity>

      {/* Center - Title */}
      <Text 
        style={[styles.centerTitle, titleStyle]}
        numberOfLines={1}
        ellipsizeMode="tail"
        testID={`${testID}-title`}
      >
        {title}
      </Text>

      {/* Right Side - Notification or Custom Actions */}
      <View style={styles.rightContainer}>
        {rightActions}
        {showNotification && onNotificationPress && (
          <TouchableOpacity
            onPress={onNotificationPress}
            style={[styles.iconButton, styles.notificationButton]}
            testID={`${testID}-notification`}
            accessibilityRole="button"
            accessibilityLabel="View notifications"
            hitSlop={{
              top: theme.spacing.sm,
              bottom: theme.spacing.sm,
              left: theme.spacing.sm,
              right: theme.spacing.sm,
            }}
          >
            <Ionicons 
              name={notificationIcon} 
              size={iconSize}
              color={theme.colors.icon.primary}
            />
            {showNotificationBadge && (
              <View style={styles.notificationBadge} />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

/**
 * Custom Header with flexible left and right content
 */
export const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  leftContent,
  rightContent,
  centerTitle = false,
  style,
  titleStyle,
  testID = "custom-header",
}) => {
  const { theme, screenDimensions } = useTheme();
  const styles = createStyles(theme, screenDimensions);

  return (
    <View 
      style={[styles.container, style]}
      testID={testID}
    >
      {/* Left Content */}
      <View style={styles.leftContainer}>
        {leftContent}
      </View>

      {/* Title */}
      <Text 
        style={[
          centerTitle ? styles.centerTitle : styles.title,
          titleStyle,
        ]}
        numberOfLines={1}
        ellipsizeMode="tail"
        testID={`${testID}-title`}
      >
        {title}
      </Text>

      {/* Right Content */}
      <View style={styles.rightContainer}>
        {rightContent}
      </View>
    </View>
  );
};

const createStyles = (theme: any, screenDimensions: any) => {
  const isTablet = screenDimensions.isTablet;
  
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.background.primary,
      minHeight: theme.safeArea.minTouchTarget.height + theme.spacing.md,
    },
    
    title: {
      fontSize: isTablet ? theme.fontSizes.h3 : theme.fontSizes.h4,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
      flex: 1,
    },
    
    centerTitle: {
      fontSize: isTablet ? theme.fontSizes.h3 : theme.fontSizes.h4,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
      textAlign: 'center',
      flex: 1,
    },
    
    avatar: {
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.background.secondary,
    },
    
    iconButton: {
      padding: theme.spacing.xs,
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: theme.safeArea.minTouchTarget.width,
      minHeight: theme.safeArea.minTouchTarget.height,
    },
    
    leftContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      minWidth: theme.safeArea.minTouchTarget.width,
    },
    
    rightContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      minWidth: theme.safeArea.minTouchTarget.width,
      justifyContent: 'flex-end',
    },
    
    notificationButton: {
      position: 'relative',
    },
    
    notificationBadge: {
      position: 'absolute',
      top: theme.spacing.xs,
      right: theme.spacing.xs,
      width: theme.spacing.sm,
      height: theme.spacing.sm,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.status.error,
    },
  });
};

// Export all header variants
export const HeaderComponent = SimpleHeader;
export const HeaderWithNotification = NavigationHeader;

export default {
  Simple: SimpleHeader,
  Navigation: NavigationHeader,
  Custom: CustomHeader,
};