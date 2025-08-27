/**
 * ProfileSettings Components
 * 
 * Reusable profile management components for Academy apps.
 * Includes sections for profile info, notifications, session management,
 * and preferences/support.
 * 
 * Extracted from students-app and enhanced for reusability.
 */

import React, { ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, createThemedStyles } from '../../theme';

// Base interfaces
export interface ProfileSettingsSection {
  /** Section icon name from Ionicons */
  icon: keyof typeof Ionicons.glyphMap;
  /** Section title */
  title: string;
  /** Section items */
  items: ProfileSettingsItem[];
  /** Custom icon size */
  iconSize?: number;
  /** Custom container style */
  containerStyle?: ViewStyle;
}

export interface ProfileSettingsItem {
  /** Item label */
  label: string;
  /** Item action handler */
  onPress: () => void;
  /** Item type for styling */
  type?: 'default' | 'destructive' | 'toggle';
  /** Right side content (for toggles, etc.) */
  rightContent?: ReactNode;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Custom icon */
  icon?: keyof typeof Ionicons.glyphMap;
  /** Item color override */
  color?: string;
}

export interface ProfileSettingsSectionProps extends ProfileSettingsSection {
  /** Test ID for testing */
  testID?: string;
}

// Individual Section Component
export const ProfileSettingsSection: React.FC<ProfileSettingsSectionProps> = ({
  icon,
  title,
  items,
  iconSize = 30,
  containerStyle,
  testID,
}) => {
  const { theme } = useTheme();
  const styles = useThemedStyles();

  return (
    <View style={[styles.sectionContainer, containerStyle]} testID={testID}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Ionicons name={icon} size={iconSize} color={theme.colors.text.primary} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>

      {/* Section Items */}
      <View style={styles.sectionItems}>
        {items.map((item, index) => (
          <Pressable
            key={index}
            style={({ pressed }) => [
              styles.sectionItem,
              pressed && styles.sectionItemPressed,
              item.disabled && styles.sectionItemDisabled,
            ]}
            onPress={item.onPress}
            disabled={item.disabled}
            testID={`${testID}-item-${index}`}
            accessibilityRole="button"
            accessibilityLabel={item.label}
          >
            <View style={styles.itemContent}>
              {item.icon && (
                <Ionicons 
                  name={item.icon} 
                  size={16} 
                  color={item.color || theme.colors.text.secondary} 
                  style={styles.itemIcon}
                />
              )}
              <Text style={[
                styles.itemLabel,
                item.type === 'destructive' && styles.destructiveText,
                item.disabled && styles.disabledText,
                item.color && { color: item.color },
              ]}>
                {item.label}
              </Text>
            </View>

            {item.rightContent || (
              <Ionicons 
                name="chevron-forward" 
                size={16} 
                color={theme.colors.text.tertiary} 
              />
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
};

// Pre-built Profile Settings Components
export interface ProfileInfoSectionProps {
  /** Profile info items */
  items?: ProfileSettingsItem[];
  /** Custom container style */
  style?: ViewStyle;
  /** Test ID */
  testID?: string;
}

export const ProfileInfoSection: React.FC<ProfileInfoSectionProps> = ({
  items = [],
  style,
  testID = 'profile-info-section',
}) => {
  const defaultItems: ProfileSettingsItem[] = [
    {
      label: 'Profile Information',
      onPress: () => console.log('Profile Information'),
    },
    {
      label: 'Account Settings', 
      onPress: () => console.log('Account Settings'),
    },
    {
      label: 'Change Password',
      onPress: () => console.log('Change Password'),
    },
  ];

  return (
    <ProfileSettingsSection
      icon="person"
      title="Profile Information"
      items={items.length > 0 ? items : defaultItems}
      containerStyle={style}
      testID={testID}
    />
  );
};

export interface NotificationSectionProps {
  /** Notification enabled state */
  notificationsEnabled?: boolean;
  /** App notifications enabled state */
  appNotificationsEnabled?: boolean;
  /** Notification toggle handler */
  onNotificationToggle?: (enabled: boolean) => void;
  /** App notification toggle handler */
  onAppNotificationToggle?: (enabled: boolean) => void;
  /** Custom items */
  items?: ProfileSettingsItem[];
  /** Custom container style */
  style?: ViewStyle;
  /** Test ID */
  testID?: string;
}

export const NotificationSection: React.FC<NotificationSectionProps> = ({
  notificationsEnabled = false,
  appNotificationsEnabled = true,
  onNotificationToggle,
  onAppNotificationToggle,
  items,
  style,
  testID = 'notification-section',
}) => {
  const { theme } = useTheme();
  
  const createToggleSwitch = (enabled: boolean, onToggle?: (enabled: boolean) => void) => (
    <Pressable
      onPress={() => onToggle?.(!enabled)}
      style={[
        {
          width: 44,
          height: 24,
          borderRadius: 12,
          backgroundColor: enabled ? theme.colors.interactive.primary : theme.colors.border.secondary,
          justifyContent: 'center',
          paddingHorizontal: 2,
        }
      ]}
    >
      <View style={[
        {
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: theme.colors.background.primary,
          transform: [{ translateX: enabled ? 20 : 0 }],
        }
      ]} />
    </Pressable>
  );

  const defaultItems: ProfileSettingsItem[] = [
    {
      label: 'Notifications',
      onPress: () => onNotificationToggle?.(!notificationsEnabled),
      rightContent: createToggleSwitch(notificationsEnabled, onNotificationToggle),
    },
    {
      label: 'App Notifications',
      onPress: () => onAppNotificationToggle?.(!appNotificationsEnabled),
      rightContent: createToggleSwitch(appNotificationsEnabled, onAppNotificationToggle),
    },
  ];

  return (
    <ProfileSettingsSection
      icon="notifications-outline"
      title="Notifications"
      items={items || defaultItems}
      containerStyle={style}
      testID={testID}
    />
  );
};

export interface SessionManagementSectionProps {
  /** Custom items */
  items?: ProfileSettingsItem[];
  /** Custom container style */
  style?: ViewStyle;
  /** Test ID */
  testID?: string;
}

export const SessionManagementSection: React.FC<SessionManagementSectionProps> = ({
  items,
  style,
  testID = 'session-management-section',
}) => {
  const defaultItems: ProfileSettingsItem[] = [
    {
      label: 'Session History',
      onPress: () => console.log('Session History'),
    },
    {
      label: 'Booking Management',
      onPress: () => console.log('Booking Management'),
    },
    {
      label: 'Payment Information',
      onPress: () => console.log('Payment Information'),
    },
  ];

  return (
    <ProfileSettingsSection
      icon="clipboard-outline"
      title="Session Management"
      items={items || defaultItems}
      containerStyle={style}
      testID={testID}
    />
  );
};

export interface PreferencesSupportSectionProps {
  /** Custom items */
  items?: ProfileSettingsItem[];
  /** Custom container style */
  style?: ViewStyle;
  /** Test ID */
  testID?: string;
}

export const PreferencesSupportSection: React.FC<PreferencesSupportSectionProps> = ({
  items,
  style,
  testID = 'preferences-support-section',
}) => {
  const defaultItems: ProfileSettingsItem[] = [
    {
      label: 'Preferences',
      onPress: () => console.log('Preferences'),
    },
    {
      label: 'Help and Support',
      onPress: () => console.log('Help and Support'),
    },
    {
      label: 'Privacy Settings',
      onPress: () => console.log('Privacy Settings'),
    },
  ];

  return (
    <ProfileSettingsSection
      icon="heart-outline"
      title="Preferences and Support"
      items={items || defaultItems}
      containerStyle={style}
      testID={testID}
    />
  );
};

const useThemedStyles = createThemedStyles((theme) => StyleSheet.create({
  sectionContainer: {
    marginVertical: theme.spacing.md,
  },
  
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  
  sectionTitle: {
    fontSize: theme.fontSizes.body,
    fontWeight: theme.fontConfig.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  
  sectionItems: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.lg,
    marginHorizontal: theme.spacing.md,
    shadowColor: theme.colors.shadow.default,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  
  sectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.border.secondary,
  },
  
  sectionItemPressed: {
    backgroundColor: theme.colors.background.tertiary,
  },
  
  sectionItemDisabled: {
    opacity: 0.5,
  },
  
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  itemIcon: {
    marginRight: theme.spacing.sm,
  },
  
  itemLabel: {
    fontSize: theme.fontSizes.body,
    color: theme.colors.text.secondary,
    flex: 1,
  },
  
  destructiveText: {
    color: theme.colors.status.error,
  },
  
  disabledText: {
    color: theme.colors.text.disabled,
  },
}));

export default ProfileSettingsSection;