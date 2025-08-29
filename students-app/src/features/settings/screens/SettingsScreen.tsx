import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  useTheme,
  useSettingsStore,
  useAuthStore,
  SettingsCard,
  SettingsSection,
  SettingsSwitch,
  SettingsPicker,
  PickerOption,
  CustomButton,
  formatQuietHours,
} from '@academy/mobile-shared';
import { SettingsStackParamList } from '../navigation/SettingsNavigator';

type SettingsScreenNavigationProp = NativeStackNavigationProp<SettingsStackParamList, 'Settings'>;

const languageOptions: PickerOption[] = [
  { label: 'English', value: 'en', icon: 'globe' },
  { label: 'Español', value: 'es', icon: 'globe' },
  { label: 'Français', value: 'fr', icon: 'globe' },
];

const themeOptions: PickerOption[] = [
  { label: 'Light Mode', value: 'light', description: 'Always use light theme', icon: 'sunny' },
  { label: 'Dark Mode', value: 'dark', description: 'Always use dark theme', icon: 'moon' },
  { label: 'System', value: 'system', description: 'Follow device settings', icon: 'phone-portrait' },
];

const fontSizeOptions: PickerOption[] = [
  { label: 'Small', value: 'small', description: 'Compact text size', icon: 'remove-circle-outline' },
  { label: 'Medium', value: 'medium', description: 'Standard text size', icon: 'text' },
  { label: 'Large', value: 'large', description: 'Larger text for readability', icon: 'add-circle-outline' },
];

const autoLockOptions: PickerOption[] = [
  { label: 'Never', value: '0', icon: 'ban-outline' },
  { label: '5 minutes', value: '5', icon: 'time-outline' },
  { label: '15 minutes', value: '15', icon: 'time-outline' },
  { label: '30 minutes', value: '30', icon: 'time-outline' },
  { label: '1 hour', value: '60', icon: 'time-outline' },
];

export const SettingsScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  
  const {
    app,
    notifications,
    privacy,
    security,
    updateAppSettings,
    updateNotificationSettings,
    updatePrivacySettings,
    updateSecuritySettings,
    resetToDefaults,
  } = useSettingsStore();

  const { user, logout } = useAuthStore();

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'This will reset all settings to their default values. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            resetToDefaults();
            Alert.alert('Settings Reset', 'All settings have been reset to defaults.');
          }
        }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: logout
        }
      ]
    );
  };

  return (
    <View style={{
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: theme.spacing.lg,
          paddingBottom: theme.spacing['3xl'],
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          style={{
            paddingHorizontal: theme.spacing.md,
            marginBottom: theme.spacing.xl,
          }}
        >
          <Text style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.base,
            textAlign: 'center',
            lineHeight: 24,
          }}>
            Customize your Academy experience and manage your preferences.
          </Text>
        </Animated.View>

        {/* Account Section */}
        <SettingsSection title="Account" delay={200}>
          <SettingsCard
            icon="person-circle"
            title={user?.name || 'Student'}
            subtitle={user?.email || 'student@academy.com'}
            onPress={() => navigation.navigate('Profile')}
            showChevron
            style={{ marginBottom: theme.spacing.sm }}
          />
          
          <SettingsCard
            icon="notifications"
            title="Notifications"
            subtitle="Manage your notification preferences"
            onPress={() => navigation.navigate('NotificationSettings')}
            showChevron
            rightElement={
              <View style={{
                backgroundColor: notifications.pushNotifications 
                  ? theme.colors.status.success + '20' 
                  : theme.colors.status.error + '20',
                paddingHorizontal: theme.spacing.sm,
                paddingVertical: theme.spacing.xs / 2,
                borderRadius: theme.borderRadius.sm,
                marginRight: theme.spacing.sm,
              }}>
                <Text style={{
                  color: notifications.pushNotifications 
                    ? theme.colors.status.success 
                    : theme.colors.status.error,
                  fontSize: theme.fontSizes.xs,
                  fontWeight: theme.fontConfig.fontWeight.medium,
                }}>
                  {notifications.pushNotifications ? 'ON' : 'OFF'}
                </Text>
              </View>
            }
            style={{ marginBottom: theme.spacing.sm }}
          />

          <SettingsCard
            icon="shield-checkmark"
            title="Privacy & Security"
            subtitle="Control your data and security settings"
            onPress={() => navigation.navigate('PrivacySettings')}
            showChevron
          />
        </SettingsSection>

        {/* App Preferences */}
        <SettingsSection title="App Preferences" delay={300}>
          <View style={{ gap: theme.spacing.sm }}>
            <SettingsPicker
              title="Theme"
              options={themeOptions}
              selectedValue={app.theme}
              onSelectionChange={(value) => updateAppSettings({ theme: value as any })}
            />

            <SettingsPicker
              title="Language"
              options={languageOptions}
              selectedValue={app.language}
              onSelectionChange={(value) => updateAppSettings({ language: value as any })}
            />

            <SettingsPicker
              title="Font Size"
              options={fontSizeOptions}
              selectedValue={app.fontSize}
              onSelectionChange={(value) => updateAppSettings({ fontSize: value as any })}
            />
          </View>
        </SettingsSection>

        {/* Experience Settings */}
        <SettingsSection title="Experience" delay={400}>
          <SettingsCard
            icon="flash"
            title="Animations"
            subtitle="Enable smooth transitions and animations"
            rightElement={
              <SettingsSwitch
                value={app.animations}
                onValueChange={(value) => updateAppSettings({ animations: value })}
              />
            }
            style={{ marginBottom: theme.spacing.sm }}
          />

          <SettingsCard
            icon="phone-portrait"
            title="Haptic Feedback"
            subtitle="Feel vibrations for button presses"
            rightElement={
              <SettingsSwitch
                value={app.hapticFeedback}
                onValueChange={(value) => updateAppSettings({ hapticFeedback: value })}
              />
            }
            style={{ marginBottom: theme.spacing.sm }}
          />

          <SettingsCard
            icon="volume-high"
            title="Sound Effects"
            subtitle="Play sounds for interactions"
            rightElement={
              <SettingsSwitch
                value={app.soundEffects}
                onValueChange={(value) => updateAppSettings({ soundEffects: value })}
              />
            }
          />
        </SettingsSection>

        {/* Quick Settings */}
        <SettingsSection title="Quick Settings" delay={500}>
          <SettingsCard
            icon="lock-closed"
            title="Biometric Login"
            subtitle="Use fingerprint or face ID to sign in"
            rightElement={
              <SettingsSwitch
                value={security.biometricLogin}
                onValueChange={(value) => updateSecuritySettings({ biometricLogin: value })}
              />
            }
            style={{ marginBottom: theme.spacing.sm }}
          />

          <View style={{ marginBottom: theme.spacing.sm }}>
            <SettingsPicker
              title="Auto-Lock"
              options={autoLockOptions}
              selectedValue={security.autoLockTimeout.toString()}
              onSelectionChange={(value) => updateSecuritySettings({ autoLockTimeout: parseInt(value) })}
            />
          </View>

          <SettingsCard
            icon="moon"
            title="Quiet Hours"
            subtitle={`${formatQuietHours(notifications.quietHoursStart, notifications.quietHoursEnd)}`}
            rightElement={
              <SettingsSwitch
                value={notifications.quietHoursEnabled}
                onValueChange={(value) => updateNotificationSettings({ quietHoursEnabled: value })}
              />
            }
            style={{ marginBottom: theme.spacing.sm }}
          />

          <SettingsCard
            icon="eye-off"
            title="Usage Analytics"
            subtitle="Help improve the app by sharing usage data"
            rightElement={
              <SettingsSwitch
                value={privacy.usageAnalytics}
                onValueChange={(value) => updatePrivacySettings({ usageAnalytics: value })}
              />
            }
          />
        </SettingsSection>

        {/* Support & Info */}
        <SettingsSection title="Support & Information" delay={600}>
          <SettingsCard
            icon="help-circle"
            title="Help & Support"
            subtitle="Get help and contact support"
            onPress={() => navigation.navigate('About')}
            showChevron
            style={{ marginBottom: theme.spacing.sm }}
          />

          <SettingsCard
            icon="document-text"
            title="About Academy"
            subtitle="Version, terms, and privacy policy"
            onPress={() => navigation.navigate('About')}
            showChevron
            style={{ marginBottom: theme.spacing.sm }}
          />

          <SettingsCard
            icon="refresh"
            title="Reset Settings"
            subtitle="Restore all settings to defaults"
            onPress={handleResetSettings}
            variant="warning"
          />
        </SettingsSection>

        {/* Account Actions */}
        <SettingsSection title="Account Actions" delay={700}>
          <SettingsCard
            icon="log-out"
            title="Sign Out"
            subtitle="Sign out of your account"
            onPress={handleLogout}
            variant="danger"
          />
        </SettingsSection>
      </ScrollView>
    </View>
  );
};