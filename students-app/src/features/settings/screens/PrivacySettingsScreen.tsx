import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  StyleSheet,
  Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme, CustomButton } from '@academy/mobile-shared';

interface PrivacySetting {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  enabled: boolean;
  category: 'data' | 'sharing' | 'tracking';
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

export const PrivacySettingsScreen: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [settings, setSettings] = useState<PrivacySetting[]>([
    {
      id: 'analytics',
      title: 'Usage Analytics',
      subtitle: 'Help improve the app by sharing usage data',
      icon: 'analytics',
      enabled: true,
      category: 'data',
    },
    {
      id: 'crash-reports',
      title: 'Crash Reports',
      subtitle: 'Automatically send crash reports to help fix issues',
      icon: 'bug',
      enabled: true,
      category: 'data',
    },
    {
      id: 'location',
      title: 'Location Services',
      subtitle: 'Share location for venue recommendations',
      icon: 'location',
      enabled: false,
      category: 'sharing',
    },
    {
      id: 'contacts',
      title: 'Contact Access',
      subtitle: 'Access contacts for easy referral invitations',
      icon: 'people',
      enabled: false,
      category: 'sharing',
    },
    {
      id: 'photo-library',
      title: 'Photo Library',
      subtitle: 'Access photos for profile pictures and achievements',
      icon: 'image',
      enabled: true,
      category: 'sharing',
    },
    {
      id: 'ad-tracking',
      title: 'Ad Tracking',
      subtitle: 'Allow tracking for personalized advertisements',
      icon: 'eye',
      enabled: false,
      category: 'tracking',
    },
    {
      id: 'marketing',
      title: 'Marketing Communications',
      subtitle: 'Receive targeted offers and promotions',
      icon: 'mail-open',
      enabled: true,
      category: 'tracking',
    },
  ]);

  const handleToggle = (id: string) => {
    setSettings(prev => 
      prev.map(setting => 
        setting.id === id 
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    );
  };

  const handleDataDownload = () => {
    Alert.alert(
      'Download Your Data',
      'We\'ll prepare a file with all your personal data and send it to your registered email address within 48 hours.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Request Download', onPress: () => console.log('Data download requested') }
      ]
    );
  };

  const handleDataDeletion = () => {
    Alert.alert(
      'Delete Account & Data',
      'This will permanently delete your account and all associated data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete Account', 
          style: 'destructive',
          onPress: () => console.log('Account deletion requested') 
        }
      ]
    );
  };

  const dataSettings = settings.filter(s => s.category === 'data');
  const sharingSettings = settings.filter(s => s.category === 'sharing');
  const trackingSettings = settings.filter(s => s.category === 'tracking');

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
            Manage how your data is collected, used, and shared. You have full control over your privacy.
          </Text>
        </Animated.View>

        {/* Data Collection Section */}
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
            Data Collection
          </Text>

          {dataSettings.map((setting, index) => (
            <SettingCard
              key={setting.id}
              title={setting.title}
              subtitle={setting.subtitle}
              icon={setting.icon}
              rightElement={
                <Switch
                  value={setting.enabled}
                  onValueChange={() => handleToggle(setting.id)}
                  trackColor={{
                    false: theme.colors.background.secondary,
                    true: theme.colors.interactive.primary,
                  }}
                  thumbColor={setting.enabled ? 'white' : '#f4f3f4'}
                  ios_backgroundColor={theme.colors.background.secondary}
                />
              }
              style={{ marginBottom: theme.spacing.sm }}
            />
          ))}
        </Animated.View>

        {/* Data Sharing Section */}
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
            Data Sharing & Permissions
          </Text>

          {sharingSettings.map((setting, index) => (
            <SettingCard
              key={setting.id}
              title={setting.title}
              subtitle={setting.subtitle}
              icon={setting.icon}
              rightElement={
                <Switch
                  value={setting.enabled}
                  onValueChange={() => handleToggle(setting.id)}
                  trackColor={{
                    false: theme.colors.background.secondary,
                    true: theme.colors.interactive.primary,
                  }}
                  thumbColor={setting.enabled ? 'white' : '#f4f3f4'}
                  ios_backgroundColor={theme.colors.background.secondary}
                />
              }
              style={{ marginBottom: theme.spacing.sm }}
            />
          ))}
        </Animated.View>

        {/* Tracking & Marketing Section */}
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
            Tracking & Marketing
          </Text>

          {trackingSettings.map((setting, index) => (
            <SettingCard
              key={setting.id}
              title={setting.title}
              subtitle={setting.subtitle}
              icon={setting.icon}
              rightElement={
                <Switch
                  value={setting.enabled}
                  onValueChange={() => handleToggle(setting.id)}
                  trackColor={{
                    false: theme.colors.background.secondary,
                    true: theme.colors.interactive.primary,
                  }}
                  thumbColor={setting.enabled ? 'white' : '#f4f3f4'}
                  ios_backgroundColor={theme.colors.background.secondary}
                />
              }
              style={{ marginBottom: theme.spacing.sm }}
            />
          ))}
        </Animated.View>

        {/* Data Rights Section */}
        <Animated.View
          entering={FadeInDown.delay(500).springify()}
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
            Your Data Rights
          </Text>

          <View style={{
            backgroundColor: theme.colors.background.primary,
            borderRadius: theme.borderRadius.xl,
            padding: theme.spacing.lg,
            marginBottom: theme.spacing.md,
            ...theme.elevation.sm,
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: theme.spacing.md,
            }}>
              <View style={{
                width: 40,
                height: 40,
                backgroundColor: `${theme.colors.interactive.accent}15`,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: theme.spacing.md,
              }}>
                <Ionicons name="download" size={20} color={theme.colors.interactive.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{
                  color: theme.colors.text.primary,
                  fontSize: theme.fontSizes.base,
                  fontWeight: theme.fontConfig.fontWeight.medium,
                }}>
                  Download Your Data
                </Text>
                <Text style={{
                  color: theme.colors.text.secondary,
                  fontSize: theme.fontSizes.sm,
                  marginTop: 2,
                }}>
                  Get a copy of all data we have about you
                </Text>
              </View>
            </View>
            <CustomButton
              title="Request Download"
              variant="outlineTheme"
              size="sm"
              onPress={handleDataDownload}
              style={{ width: '100%' }}
            />
          </View>

          <View style={{
            backgroundColor: theme.colors.background.primary,
            borderRadius: theme.borderRadius.xl,
            padding: theme.spacing.lg,
            marginBottom: theme.spacing.md,
            ...theme.elevation.sm,
            borderWidth: 1,
            borderColor: theme.colors.status.errorBackground,
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: theme.spacing.md,
            }}>
              <View style={{
                width: 40,
                height: 40,
                backgroundColor: `${theme.colors.status.error}15`,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: theme.spacing.md,
              }}>
                <Ionicons name="trash" size={20} color={theme.colors.status.error} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{
                  color: theme.colors.text.primary,
                  fontSize: theme.fontSizes.base,
                  fontWeight: theme.fontConfig.fontWeight.medium,
                }}>
                  Delete Account & Data
                </Text>
                <Text style={{
                  color: theme.colors.text.secondary,
                  fontSize: theme.fontSizes.sm,
                  marginTop: 2,
                }}>
                  Permanently delete your account and all data
                </Text>
              </View>
            </View>
            <CustomButton
              title="Delete Account"
              variant="danger"
              size="sm"
              onPress={handleDataDeletion}
              style={{ width: '100%' }}
            />
          </View>
        </Animated.View>

        {/* Privacy Policy Section */}
        <Animated.View
          entering={FadeInDown.delay(600).springify()}
          style={{
            backgroundColor: theme.colors.background.primary,
            borderRadius: theme.borderRadius.xl,
            padding: theme.spacing.lg,
            marginHorizontal: theme.spacing.md,
            alignItems: 'center',
            ...theme.elevation.sm,
          }}
        >
          <Ionicons
            name="document-text"
            size={32}
            color={theme.colors.interactive.primary}
            style={{ marginBottom: theme.spacing.md }}
          />
          <Text style={{
            color: theme.colors.text.primary,
            fontSize: theme.fontSizes.lg,
            fontWeight: theme.fontConfig.fontWeight.semibold,
            textAlign: 'center',
            marginBottom: theme.spacing.sm,
          }}>
            Learn More
          </Text>
          <Text style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.base,
            textAlign: 'center',
            lineHeight: 22,
            marginBottom: theme.spacing.lg,
          }}>
            Read our Privacy Policy and Terms of Service to understand how we protect your data.
          </Text>
          <View style={{
            flexDirection: 'row',
            gap: theme.spacing.sm,
            width: '100%',
          }}>
            <CustomButton
              title="Privacy Policy"
              variant="outlineTheme"
              size="sm"
              onPress={() => console.log('Open privacy policy')}
              style={{ flex: 1 }}
            />
            <CustomButton
              title="Terms of Service"
              variant="outlineTheme"
              size="sm"
              onPress={() => console.log('Open terms of service')}
              style={{ flex: 1 }}
            />
          </View>
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