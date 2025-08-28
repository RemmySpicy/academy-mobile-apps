import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@academy/mobile-shared';

interface NotificationSetting {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  enabled: boolean;
  category: 'push' | 'email' | 'sms';
}

const SettingCard: React.FC<{
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  rightElement: React.ReactNode;
  style?: any;
}> = ({ title, subtitle, icon, rightElement, style }) => {
  const { theme } = useTheme();
  
  return (
    <View
      style={[{
        backgroundColor: theme.colors.background.primary,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        ...theme.elevation.sm,
      }, style]}
    >
      <View style={{
        width: 40,
        height: 40,
        backgroundColor: `${theme.colors.interactive.primary}15`,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing.md,
      }}>
        <Ionicons name={icon} size={20} color={theme.colors.interactive.primary} />
      </View>
      
      <View style={{ flex: 1 }}>
        <Text style={{
          color: theme.colors.text.primary,
          fontSize: theme.fontSizes.base,
          fontWeight: theme.fontConfig.fontWeight.medium,
          marginBottom: theme.spacing.xs / 2,
        }}>
          {title}
        </Text>
        <Text style={{
          color: theme.colors.text.secondary,
          fontSize: theme.fontSizes.sm,
        }}>
          {subtitle}
        </Text>
      </View>
      
      {rightElement}
    </View>
  );
};

export const NotificationSettingsScreen: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: 'push-general',
      title: 'Push Notifications',
      subtitle: 'Receive notifications on this device',
      icon: 'notifications',
      enabled: true,
      category: 'push',
    },
    {
      id: 'push-bookings',
      title: 'Booking Updates',
      subtitle: 'Session confirmations and changes',
      icon: 'calendar',
      enabled: true,
      category: 'push',
    },
    {
      id: 'push-achievements',
      title: 'Achievements',
      subtitle: 'Progress milestones and rewards',
      icon: 'trophy',
      enabled: true,
      category: 'push',
    },
    {
      id: 'push-payments',
      title: 'Payment Notifications',
      subtitle: 'Transaction confirmations and receipts',
      icon: 'card',
      enabled: true,
      category: 'push',
    },
    {
      id: 'email-weekly',
      title: 'Weekly Summary',
      subtitle: 'Weekly progress and upcoming sessions',
      icon: 'mail',
      enabled: true,
      category: 'email',
    },
    {
      id: 'email-marketing',
      title: 'Marketing Updates',
      subtitle: 'New features, courses, and promotions',
      icon: 'megaphone',
      enabled: false,
      category: 'email',
    },
    {
      id: 'email-reminders',
      title: 'Session Reminders',
      subtitle: 'Email reminders 24 hours before sessions',
      icon: 'alarm',
      enabled: true,
      category: 'email',
    },
    {
      id: 'sms-emergency',
      title: 'Emergency Alerts',
      subtitle: 'Critical updates and cancellations',
      icon: 'warning',
      enabled: true,
      category: 'sms',
    },
    {
      id: 'sms-confirmations',
      title: 'SMS Confirmations',
      subtitle: 'Booking and payment confirmations',
      icon: 'checkmark-circle',
      enabled: false,
      category: 'sms',
    },
  ]);

  const handleToggle = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, enabled: !notification.enabled }
          : notification
      )
    );
  };

  const pushNotifications = notifications.filter(n => n.category === 'push');
  const emailNotifications = notifications.filter(n => n.category === 'email');
  const smsNotifications = notifications.filter(n => n.category === 'sms');

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
        {/* Header Description */}
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
            Customize your notification preferences to stay informed about what matters most to you.
          </Text>
        </Animated.View>

        {/* Push Notifications Section */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={{
            paddingHorizontal: theme.spacing.md,
            marginBottom: theme.spacing.xl,
          }}
        >
          <Text style={{
            color: theme.colors.text.primary,
            fontSize: theme.fontSizes.lg,
            fontWeight: theme.fontConfig.fontWeight.semibold,
            marginBottom: theme.spacing.md,
          }}>
            Push Notifications
          </Text>

          {pushNotifications.map((notification, index) => (
            <SettingCard
              key={notification.id}
              title={notification.title}
              subtitle={notification.subtitle}
              icon={notification.icon}
              rightElement={
                <Switch
                  value={notification.enabled}
                  onValueChange={() => handleToggle(notification.id)}
                  trackColor={{
                    false: theme.colors.background.secondary,
                    true: theme.colors.interactive.primary,
                  }}
                  thumbColor={notification.enabled ? 'white' : '#f4f3f4'}
                  ios_backgroundColor={theme.colors.background.secondary}
                />
              }
              style={{ marginBottom: theme.spacing.sm }}
            />
          ))}
        </Animated.View>

        {/* Email Notifications Section */}
        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          style={{
            paddingHorizontal: theme.spacing.md,
            marginBottom: theme.spacing.xl,
          }}
        >
          <Text style={{
            color: theme.colors.text.primary,
            fontSize: theme.fontSizes.lg,
            fontWeight: theme.fontConfig.fontWeight.semibold,
            marginBottom: theme.spacing.md,
          }}>
            Email Notifications
          </Text>

          {emailNotifications.map((notification, index) => (
            <SettingCard
              key={notification.id}
              title={notification.title}
              subtitle={notification.subtitle}
              icon={notification.icon}
              rightElement={
                <Switch
                  value={notification.enabled}
                  onValueChange={() => handleToggle(notification.id)}
                  trackColor={{
                    false: theme.colors.background.secondary,
                    true: theme.colors.interactive.primary,
                  }}
                  thumbColor={notification.enabled ? 'white' : '#f4f3f4'}
                  ios_backgroundColor={theme.colors.background.secondary}
                />
              }
              style={{ marginBottom: theme.spacing.sm }}
            />
          ))}
        </Animated.View>

        {/* SMS Notifications Section */}
        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          style={{
            paddingHorizontal: theme.spacing.md,
            marginBottom: theme.spacing.xl,
          }}
        >
          <Text style={{
            color: theme.colors.text.primary,
            fontSize: theme.fontSizes.lg,
            fontWeight: theme.fontConfig.fontWeight.semibold,
            marginBottom: theme.spacing.md,
          }}>
            SMS Notifications
          </Text>

          {smsNotifications.map((notification, index) => (
            <SettingCard
              key={notification.id}
              title={notification.title}
              subtitle={notification.subtitle}
              icon={notification.icon}
              rightElement={
                <Switch
                  value={notification.enabled}
                  onValueChange={() => handleToggle(notification.id)}
                  trackColor={{
                    false: theme.colors.background.secondary,
                    true: theme.colors.interactive.primary,
                  }}
                  thumbColor={notification.enabled ? 'white' : '#f4f3f4'}
                  ios_backgroundColor={theme.colors.background.secondary}
                />
              }
              style={{ marginBottom: theme.spacing.sm }}
            />
          ))}
        </Animated.View>

        {/* Quiet Hours Section */}
        <Animated.View
          entering={FadeInDown.delay(500).springify()}
          style={{
            backgroundColor: theme.colors.background.primary,
            borderRadius: theme.borderRadius.xl,
            padding: theme.spacing.lg,
            marginHorizontal: theme.spacing.md,
            marginBottom: theme.spacing.xl,
            ...theme.elevation.sm,
          }}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: theme.spacing.md,
          }}>
            <View style={{
              width: 40,
              height: 40,
              backgroundColor: `${theme.colors.interactive.purple}15`,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: theme.spacing.md,
            }}>
              <Ionicons name="moon" size={20} color={theme.colors.interactive.purple} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{
                color: theme.colors.text.primary,
                fontSize: theme.fontSizes.base,
                fontWeight: theme.fontConfig.fontWeight.medium,
              }}>
                Quiet Hours
              </Text>
              <Text style={{
                color: theme.colors.text.secondary,
                fontSize: theme.fontSizes.sm,
                marginTop: 2,
              }}>
                10:00 PM - 8:00 AM
              </Text>
            </View>
            <Switch
              value={true}
              onValueChange={() => console.log('Toggle quiet hours')}
              trackColor={{
                false: theme.colors.background.secondary,
                true: theme.colors.interactive.primary,
              }}
              thumbColor="white"
              ios_backgroundColor={theme.colors.background.secondary}
            />
          </View>
          <Text style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.sm,
            lineHeight: 20,
          }}>
            During quiet hours, only emergency notifications will be delivered. All other notifications will be delivered when quiet hours end.
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});