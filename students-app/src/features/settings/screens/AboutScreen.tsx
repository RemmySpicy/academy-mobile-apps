import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme, CustomButton } from '@academy/mobile-shared';
import Constants from 'expo-constants';

interface AboutItem {
  id: string;
  title: string;
  subtitle?: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
}

const SettingCard: React.FC<{
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  showChevron?: boolean;
  style?: any;
}> = ({ title, subtitle, icon, onPress, showChevron = false, style }) => {
  const { theme } = useTheme();
  
  return (
    <Pressable
      style={[{
        backgroundColor: theme.colors.background.primary,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        ...theme.elevation.sm,
      }, style]}
      onPress={onPress}
      android_ripple={{ color: `${theme.colors.interactive.primary}20` }}
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
          marginBottom: subtitle ? theme.spacing.xs / 2 : 0,
        }}>
          {title}
        </Text>
        {subtitle && (
          <Text style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.sm,
          }}>
            {subtitle}
          </Text>
        )}
      </View>
      
      {showChevron && (
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color={theme.colors.text.tertiary} 
        />
      )}
    </Pressable>
  );
};

export const AboutScreen: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const aboutItems: AboutItem[] = [
    {
      id: 'version',
      title: 'App Version',
      value: '1.0.0',
      icon: 'information-circle',
    },
    {
      id: 'build',
      title: 'Build Number',
      value: Constants.manifest?.revisionId?.substring(0, 8) || '12345678',
      icon: 'construct',
    },
    {
      id: 'platform',
      title: 'Platform',
      value: Constants.platform?.ios ? 'iOS' : 'Android',
      icon: 'phone-portrait',
    },
    {
      id: 'expo-version',
      title: 'Expo SDK',
      value: Constants.expoVersion || '53.0.0',
      icon: 'logo-react',
    },
  ];

  const supportItems: AboutItem[] = [
    {
      id: 'website',
      title: 'Visit Our Website',
      subtitle: 'Learn more about Elitesgen Academy',
      value: 'www.academy.com',
      icon: 'globe',
      onPress: () => Linking.openURL('https://www.academy.com'),
    },
    {
      id: 'contact',
      title: 'Contact Support',
      subtitle: 'Get help with your account',
      value: 'support@academy.com',
      icon: 'mail',
      onPress: () => Linking.openURL('mailto:support@academy.com'),
    },
    {
      id: 'phone',
      title: 'Call Us',
      subtitle: 'Speak with our team',
      value: '+234 800 ACADEMY',
      icon: 'call',
      onPress: () => Linking.openURL('tel:+2348003223369'),
    },
  ];

  const legalItems: AboutItem[] = [
    {
      id: 'privacy',
      title: 'Privacy Policy',
      subtitle: 'How we handle your data',
      value: '',
      icon: 'shield',
      onPress: () => console.log('Open privacy policy'),
    },
    {
      id: 'terms',
      title: 'Terms of Service',
      subtitle: 'App usage agreement',
      value: '',
      icon: 'document-text',
      onPress: () => console.log('Open terms of service'),
    },
    {
      id: 'licenses',
      title: 'Open Source Licenses',
      subtitle: 'Third-party software',
      value: '',
      icon: 'code-slash',
      onPress: () => console.log('Show licenses'),
    },
  ];

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
        {/* App Logo and Info */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          style={{
            alignItems: 'center',
            paddingHorizontal: theme.spacing.md,
            marginBottom: theme.spacing.xl,
          }}
        >
          <View style={{
            width: 100,
            height: 100,
            backgroundColor: theme.colors.interactive.primary,
            borderRadius: 24,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: theme.spacing.lg,
            ...theme.elevation.md,
          }}>
            <Text style={{
              color: 'white',
              fontSize: 36,
              fontWeight: theme.fontConfig.fontWeight.bold,
            }}>
              A
            </Text>
          </View>
          
          <Text style={{
            color: theme.colors.text.primary,
            fontSize: theme.fontSizes.xl,
            fontWeight: theme.fontConfig.fontWeight.bold,
            marginBottom: theme.spacing.sm,
          }}>
            Elitesgen Academy Students
          </Text>
          
          <Text style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.base,
            textAlign: 'center',
            lineHeight: 24,
          }}>
            Your gateway to excellence in sports, academics, and personal development
          </Text>
        </Animated.View>

        {/* App Information Section */}
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
            App Information
          </Text>

          {aboutItems.map((item, index) => (
            <SettingCard
              key={item.id}
              title={item.title}
              subtitle={item.value}
              icon={item.icon}
              onPress={item.onPress}
              showChevron={false}
              style={{ marginBottom: theme.spacing.sm }}
            />
          ))}
        </Animated.View>

        {/* Contact & Support Section */}
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
            Contact & Support
          </Text>

          {supportItems.map((item, index) => (
            <SettingCard
              key={item.id}
              title={item.title}
              subtitle={item.subtitle}
              icon={item.icon}
              onPress={item.onPress}
              showChevron={true}
              style={{ marginBottom: theme.spacing.sm }}
            />
          ))}
        </Animated.View>

        {/* Legal Section */}
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
            Legal
          </Text>

          {legalItems.map((item, index) => (
            <SettingCard
              key={item.id}
              title={item.title}
              subtitle={item.subtitle}
              icon={item.icon}
              onPress={item.onPress}
              showChevron={true}
              style={{ marginBottom: theme.spacing.sm }}
            />
          ))}
        </Animated.View>

        {/* What's New Section */}
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
              backgroundColor: `${theme.colors.status.success}15`,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: theme.spacing.md,
            }}>
              <Ionicons name="sparkles" size={20} color={theme.colors.status.success} />
            </View>
            <Text style={{
              color: theme.colors.text.primary,
              fontSize: theme.fontSizes.lg,
              fontWeight: theme.fontConfig.fontWeight.semibold,
            }}>
              What's New in v1.0.0
            </Text>
          </View>

          <View style={{ marginBottom: theme.spacing.md }}>
            {[
              'Enhanced user interface with Elitesgen Academy design system',
              'Improved performance and stability',
              'New achievement tracking system',
              'Better notification management',
              'Updated privacy controls',
            ].map((feature, index) => (
              <View key={index} style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: theme.spacing.xs,
              }}>
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={theme.colors.status.success}
                  style={{ marginRight: theme.spacing.sm }}
                />
                <Text style={{
                  color: theme.colors.text.primary,
                  fontSize: theme.fontSizes.sm,
                  flex: 1,
                  lineHeight: 20,
                }}>
                  {feature}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Rate & Review Section */}
        <Animated.View
          entering={FadeInDown.delay(600).springify()}
          style={{
            backgroundColor: theme.colors.interactive.primary,
            borderRadius: theme.borderRadius.xl,
            padding: theme.spacing.lg,
            marginHorizontal: theme.spacing.md,
            alignItems: 'center',
            marginBottom: theme.spacing.xl,
          }}
        >
          <Ionicons
            name="star"
            size={32}
            color="white"
            style={{ marginBottom: theme.spacing.md }}
          />
          <Text style={{
            color: 'white',
            fontSize: theme.fontSizes.lg,
            fontWeight: theme.fontConfig.fontWeight.bold,
            textAlign: 'center',
            marginBottom: theme.spacing.sm,
          }}>
            Enjoying Elitesgen Academy?
          </Text>
          <Text style={{
            color: 'white',
            fontSize: theme.fontSizes.base,
            textAlign: 'center',
            opacity: 0.9,
            lineHeight: 22,
            marginBottom: theme.spacing.lg,
          }}>
            Rate us on the App Store and let us know what you think!
          </Text>
          <CustomButton
            title="Rate Elitesgen Academy"
            variant="secondary"
            size="md"
            onPress={() => console.log('Open app store for rating')}
            style={{
              backgroundColor: 'white',
              borderColor: 'white',
            }}
            textStyle={{
              color: theme.colors.interactive.primary,
            }}
          />
        </Animated.View>

        {/* Footer */}
        <Animated.View
          entering={FadeInDown.delay(700).springify()}
          style={{
            alignItems: 'center',
            paddingHorizontal: theme.spacing.md,
          }}
        >
          <Text style={{
            color: theme.colors.text.tertiary,
            fontSize: theme.fontSizes.sm,
            textAlign: 'center',
            lineHeight: 20,
          }}>
            © 2024 Elitesgen Academy. All rights reserved.
          </Text>
          <Text style={{
            color: theme.colors.text.tertiary,
            fontSize: theme.fontSizes.sm,
            textAlign: 'center',
            marginTop: theme.spacing.xs,
          }}>
            Made with ❤️ for our Elitesgen Academy community
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