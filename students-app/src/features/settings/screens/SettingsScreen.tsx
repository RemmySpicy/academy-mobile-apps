import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Switch,
  Alert,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useTheme, useAuthStore } from '@academy/mobile-shared';

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  type: 'switch' | 'select' | 'action' | 'info';
  value?: boolean | string;
  options?: string[];
  onPress?: () => void;
  onValueChange?: (value: boolean | string) => void;
  color?: string;
  showChevron?: boolean;
}

interface SettingSection {
  title: string;
  items: SettingItem[];
}

const SettingItemComponent: React.FC<{ item: SettingItem; index: number }> = ({
  item,
  index,
}) => {
  const { theme } = useTheme();
  
  const renderRightContent = () => {
    switch (item.type) {
      case 'switch':
        return (
          <Switch
            value={item.value as boolean}
            onValueChange={item.onValueChange as (value: boolean) => void}
            trackColor={{
              false: theme.colors.background.secondary,
              true: theme.colors.interactive.primary,
            }}
            thumbColor={item.value ? 'white' : '#f4f3f4'}
            ios_backgroundColor={theme.colors.background.secondary}
          />
        );
      
      case 'select':
        return (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{
              color: theme.colors.text.secondary,
              fontSize: theme.fontSizes.sm,
              marginRight: theme.spacing.xs,
            }}>
              {item.value}
            </Text>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.icon.tertiary} />
          </View>
        );
      
      case 'info':
        return (
          <Text style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.sm,
          }}>
            {item.value}
          </Text>
        );
      
      case 'action':
      default:
        return item.showChevron !== false ? (
          <Ionicons name="chevron-forward" size={20} color={theme.colors.icon.tertiary} />
        ) : null;
    }
  };

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 50).springify()}
      style={{
        backgroundColor: theme.colors.background.primary,
        borderRadius: theme.borderRadius.lg,
        marginBottom: theme.spacing.sm,
        overflow: 'hidden',
      }}
    >
      <Pressable
        onPress={item.type === 'switch' ? undefined : item.onPress}
        style={{
          padding: theme.spacing.md,
          flexDirection: 'row',
          alignItems: 'center',
        }}
        android_ripple={{ color: theme.colors.interactive.primaryBackground }}
      >
        <View style={{
          width: 40,
          height: 40,
          backgroundColor: item.color ? `${item.color}15` : `${theme.colors.interactive.primary}15`,
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: theme.spacing.md,
        }}>
          <Ionicons 
            name={item.icon} 
            size={20} 
            color={item.color || theme.colors.interactive.primary} 
          />
        </View>
        
        <View style={{ flex: 1 }}>
          <Text style={{
            color: theme.colors.text.primary,
            fontWeight: theme.fontConfig.fontWeight.medium,
            fontSize: theme.fontSizes.base,
          }}>
            {item.title}
          </Text>
          {item.subtitle && (
            <Text style={{
              color: theme.colors.text.secondary,
              fontSize: theme.fontSizes.sm,
              marginTop: 2,
            }}>
              {item.subtitle}
            </Text>
          )}
        </View>
        
        {renderRightContent()}
      </Pressable>
    </Animated.View>
  );
};

export const SettingsScreen: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();

  // Settings state
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [biometricAuth, setBiometricAuth] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [highQualityImages, setHighQualityImages] = useState(true);
  const [autoPlayVideos, setAutoPlayVideos] = useState(false);
  const [language, setLanguage] = useState('English');
  const [theme_setting, setThemeSetting] = useState('System');
  const [currency, setCurrency] = useState('NGN (₦)');
  const [timeFormat, setTimeFormat] = useState('12-hour');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');

  // Modals
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showTimeFormatModal, setShowTimeFormatModal] = useState(false);
  const [showDateFormatModal, setShowDateFormatModal] = useState(false);

  const languages = ['English', 'Yoruba', 'Hausa', 'Igbo', 'French'];
  const themes = ['Light', 'Dark', 'System'];
  const currencies = ['NGN (₦)', 'USD ($)', 'GBP (£)', 'EUR (€)'];
  const timeFormats = ['12-hour', '24-hour'];
  const dateFormats = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'];

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data including images and offline content. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement cache clearing
            Alert.alert('Success', 'Cache cleared successfully');
          },
        },
      ]
    );
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'This will reset all app settings to their default values. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            // Reset all settings to defaults
            setPushNotifications(true);
            setEmailNotifications(true);
            setSmsNotifications(false);
            setBiometricAuth(false);
            setAutoSync(true);
            setOfflineMode(false);
            setHighQualityImages(true);
            setAutoPlayVideos(false);
            setLanguage('English');
            setThemeSetting('System');
            setCurrency('NGN (₦)');
            setTimeFormat('12-hour');
            setDateFormat('DD/MM/YYYY');
            
            Alert.alert('Success', 'Settings reset to defaults');
          },
        },
      ]
    );
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'Choose how you would like to contact our support team:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Email', onPress: () => console.log('Open email') },
        { text: 'Phone', onPress: () => console.log('Open phone') },
        { text: 'Chat', onPress: () => console.log('Open chat') },
      ]
    );
  };

  const settingSections: SettingSection[] = [
    {
      title: 'Notifications',
      items: [
        {
          id: 'push-notifications',
          title: 'Push Notifications',
          subtitle: 'Receive notifications on this device',
          icon: 'notifications-outline',
          type: 'switch',
          value: pushNotifications,
          onValueChange: setPushNotifications,
          color: theme.colors.status.warning,
        },
        {
          id: 'email-notifications',
          title: 'Email Notifications',
          subtitle: 'Receive notifications via email',
          icon: 'mail-outline',
          type: 'switch',
          value: emailNotifications,
          onValueChange: setEmailNotifications,
          color: theme.colors.interactive.accent,
        },
        {
          id: 'sms-notifications',
          title: 'SMS Notifications',
          subtitle: 'Receive notifications via SMS',
          icon: 'chatbubble-outline',
          type: 'switch',
          value: smsNotifications,
          onValueChange: setSmsNotifications,
          color: theme.colors.status.success,
        },
      ],
    },
    {
      title: 'Security & Privacy',
      items: [
        {
          id: 'biometric-auth',
          title: 'Biometric Authentication',
          subtitle: 'Use fingerprint or face recognition',
          icon: 'finger-print-outline',
          type: 'switch',
          value: biometricAuth,
          onValueChange: setBiometricAuth,
          color: theme.colors.status.error,
        },
        {
          id: 'change-password',
          title: 'Change Password',
          subtitle: 'Update your account password',
          icon: 'lock-closed-outline',
          type: 'action',
          onPress: () => console.log('Change password'),
          color: theme.colors.interactive.primary,
        },
        {
          id: 'two-factor-auth',
          title: 'Two-Factor Authentication',
          subtitle: 'Add an extra layer of security',
          icon: 'shield-checkmark-outline',
          type: 'action',
          onPress: () => console.log('Setup 2FA'),
          color: theme.colors.status.success,
        },
      ],
    },
    {
      title: 'Data & Storage',
      items: [
        {
          id: 'auto-sync',
          title: 'Auto-Sync Data',
          subtitle: 'Automatically sync your data',
          icon: 'sync-outline',
          type: 'switch',
          value: autoSync,
          onValueChange: setAutoSync,
          color: theme.colors.interactive.accent,
        },
        {
          id: 'offline-mode',
          title: 'Offline Mode',
          subtitle: 'Enable offline content access',
          icon: 'cloud-offline-outline',
          type: 'switch',
          value: offlineMode,
          onValueChange: setOfflineMode,
          color: theme.colors.icon.secondary,
        },
        {
          id: 'high-quality-images',
          title: 'High Quality Images',
          subtitle: 'Load images in full resolution',
          icon: 'image-outline',
          type: 'switch',
          value: highQualityImages,
          onValueChange: setHighQualityImages,
          color: theme.colors.interactive.purple,
        },
        {
          id: 'auto-play-videos',
          title: 'Auto-Play Videos',
          subtitle: 'Automatically play videos in feeds',
          icon: 'play-circle-outline',
          type: 'switch',
          value: autoPlayVideos,
          onValueChange: setAutoPlayVideos,
          color: theme.colors.status.warning,
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          id: 'language',
          title: 'Language',
          subtitle: 'Choose your preferred language',
          icon: 'language-outline',
          type: 'select',
          value: language,
          onPress: () => setShowLanguageModal(true),
          color: theme.colors.interactive.primary,
        },
        {
          id: 'theme',
          title: 'Theme',
          subtitle: 'Choose your app appearance',
          icon: 'moon-outline',
          type: 'select',
          value: theme_setting,
          onPress: () => setShowThemeModal(true),
          color: theme.colors.icon.secondary,
        },
        {
          id: 'currency',
          title: 'Currency',
          subtitle: 'Select your preferred currency',
          icon: 'cash-outline',
          type: 'select',
          value: currency,
          onPress: () => setShowCurrencyModal(true),
          color: theme.colors.status.success,
        },
        {
          id: 'time-format',
          title: 'Time Format',
          subtitle: 'Choose 12-hour or 24-hour format',
          icon: 'time-outline',
          type: 'select',
          value: timeFormat,
          onPress: () => setShowTimeFormatModal(true),
          color: theme.colors.interactive.accent,
        },
        {
          id: 'date-format',
          title: 'Date Format',
          subtitle: 'Choose your date display format',
          icon: 'calendar-outline',
          type: 'select',
          value: dateFormat,
          onPress: () => setShowDateFormatModal(true),
          color: theme.colors.interactive.purple,
        },
      ],
    },
    {
      title: 'Support & About',
      items: [
        {
          id: 'contact-support',
          title: 'Contact Support',
          subtitle: 'Get help from our support team',
          icon: 'help-circle-outline',
          type: 'action',
          onPress: handleContactSupport,
          color: theme.colors.interactive.primary,
        },
        {
          id: 'send-feedback',
          title: 'Send Feedback',
          subtitle: 'Help us improve the app',
          icon: 'chatbubbles-outline',
          type: 'action',
          onPress: () => console.log('Send feedback'),
          color: theme.colors.status.success,
        },
        {
          id: 'rate-app',
          title: 'Rate App',
          subtitle: 'Rate us in the app store',
          icon: 'star-outline',
          type: 'action',
          onPress: () => console.log('Rate app'),
          color: theme.colors.status.warning,
        },
        {
          id: 'app-version',
          title: 'App Version',
          icon: 'information-circle-outline',
          type: 'info',
          value: '1.0.0 (2024)',
          showChevron: false,
          color: theme.colors.icon.secondary,
        },
      ],
    },
    {
      title: 'Advanced',
      items: [
        {
          id: 'clear-cache',
          title: 'Clear Cache',
          subtitle: 'Free up storage space',
          icon: 'trash-outline',
          type: 'action',
          onPress: handleClearCache,
          color: theme.colors.status.warning,
        },
        {
          id: 'reset-settings',
          title: 'Reset Settings',
          subtitle: 'Reset all settings to defaults',
          icon: 'refresh-outline',
          type: 'action',
          onPress: handleResetSettings,
          color: theme.colors.status.error,
        },
        {
          id: 'export-data',
          title: 'Export Data',
          subtitle: 'Download your data',
          icon: 'download-outline',
          type: 'action',
          onPress: () => console.log('Export data'),
          color: theme.colors.interactive.accent,
        },
      ],
    },
  ];

  const SelectModal: React.FC<{
    visible: boolean;
    title: string;
    options: string[];
    currentValue: string;
    onSelect: (value: string) => void;
    onClose: () => void;
  }> = ({ visible, title, options, currentValue, onSelect, onClose }) => (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
      }}>
        <View style={{
          backgroundColor: theme.colors.background.primary,
          borderTopLeftRadius: theme.borderRadius.xl,
          borderTopRightRadius: theme.borderRadius.xl,
          paddingBottom: insets.bottom,
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: theme.spacing.lg,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border.primary,
          }}>
            <Text style={{
              color: theme.colors.text.primary,
              fontSize: theme.fontSizes.lg,
              fontWeight: theme.fontConfig.fontWeight.semibold,
            }}>
              {title}
            </Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.colors.icon.primary} />
            </Pressable>
          </View>
          
          <ScrollView style={{ maxHeight: 400 }}>
            {options.map((option, index) => (
              <Pressable
                key={option}
                onPress={() => {
                  onSelect(option);
                  onClose();
                }}
                style={{
                  padding: theme.spacing.md,
                  borderBottomWidth: index < options.length - 1 ? 1 : 0,
                  borderBottomColor: theme.colors.border.secondary,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                android_ripple={{ color: theme.colors.interactive.primaryBackground }}
              >
                <Text style={{
                  color: theme.colors.text.primary,
                  fontSize: theme.fontSizes.base,
                  fontWeight: option === currentValue 
                    ? theme.fontConfig.fontWeight.semibold 
                    : theme.fontConfig.fontWeight.normal,
                }}>
                  {option}
                </Text>
                {option === currentValue && (
                  <Ionicons 
                    name="checkmark" 
                    size={20} 
                    color={theme.colors.interactive.primary} 
                  />
                )}
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={{
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: theme.spacing.md,
          paddingBottom: theme.spacing['3xl'],
        }}
        showsVerticalScrollIndicator={false}
      >
        {settingSections.map((section, sectionIndex) => (
          <View
            key={section.title}
            style={{
              paddingHorizontal: theme.spacing.md,
              marginBottom: theme.spacing.xl,
            }}
          >
            <Animated.Text
              entering={FadeInDown.delay(sectionIndex * 100).springify()}
              style={{
                color: theme.colors.text.primary,
                fontSize: theme.fontSizes.lg,
                fontWeight: theme.fontConfig.fontWeight.semibold,
                marginBottom: theme.spacing.md,
              }}
            >
              {section.title}
            </Animated.Text>
            
            {section.items.map((item, index) => (
              <SettingItemComponent
                key={item.id}
                item={item}
                index={index}
              />
            ))}
          </View>
        ))}
      </ScrollView>

      {/* Selection Modals */}
      <SelectModal
        visible={showLanguageModal}
        title="Choose Language"
        options={languages}
        currentValue={language}
        onSelect={setLanguage}
        onClose={() => setShowLanguageModal(false)}
      />
      
      <SelectModal
        visible={showThemeModal}
        title="Choose Theme"
        options={themes}
        currentValue={theme_setting}
        onSelect={setThemeSetting}
        onClose={() => setShowThemeModal(false)}
      />
      
      <SelectModal
        visible={showCurrencyModal}
        title="Choose Currency"
        options={currencies}
        currentValue={currency}
        onSelect={setCurrency}
        onClose={() => setShowCurrencyModal(false)}
      />
      
      <SelectModal
        visible={showTimeFormatModal}
        title="Choose Time Format"
        options={timeFormats}
        currentValue={timeFormat}
        onSelect={setTimeFormat}
        onClose={() => setShowTimeFormatModal(false)}
      />
      
      <SelectModal
        visible={showDateFormatModal}
        title="Choose Date Format"
        options={dateFormats}
        currentValue={dateFormat}
        onSelect={setDateFormat}
        onClose={() => setShowDateFormatModal(false)}
      />
    </View>
  );
};