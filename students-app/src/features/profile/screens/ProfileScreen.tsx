import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useAuthStore, useTheme, Header } from '@academy/mobile-shared';
import { ProfileStackParamList } from '../navigation/ProfileNavigator';

type ProfileScreenNavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'Profile'>;

interface ProfileMenuItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
  showChevron?: boolean;
  badge?: string;
}

const ProfileMenuItemComponent: React.FC<{ item: ProfileMenuItem; index: number }> = ({
  item,
  index,
}) => {
  const { theme } = useTheme();
  
  return (
    <Animated.View
      entering={FadeInRight.delay(index * 50).springify()}
      style={{
        backgroundColor: theme.colors.background.primary,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.sm,
        borderWidth: 1,
        borderColor: theme.colors.border.primary,
        ...theme.elevation.sm,
      }}
    >
      <Pressable onPress={item.onPress}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{
            width: 40,
            height: 40,
            backgroundColor: `${item.color}15`,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: theme.spacing.md,
          }}>
            <Ionicons name={item.icon} size={20} color={item.color} />
          </View>
          
          <View style={{ flex: 1 }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <Text style={{
                color: theme.colors.text.primary,
                fontWeight: theme.fontConfig.fontWeight.medium,
                fontSize: theme.fontSizes.base,
              }}>
                {item.title}
              </Text>
              {item.badge && (
                <View style={{
                  backgroundColor: theme.colors.status.error,
                  borderRadius: theme.borderRadius.full,
                  paddingHorizontal: theme.spacing.xs,
                  paddingVertical: theme.spacing.xs,
                  marginRight: theme.spacing.xs,
                }}>
                  <Text style={{
                    color: 'white',
                    fontSize: theme.fontSizes.xs,
                    fontWeight: theme.fontConfig.fontWeight.bold,
                  }}>{item.badge}</Text>
                </View>
              )}
            </View>
            {item.subtitle && (
              <Text style={{
                color: theme.colors.text.secondary,
                fontSize: theme.fontSizes.sm,
                marginTop: 4,
              }}>{item.subtitle}</Text>
            )}
          </View>
          
          {item.showChevron !== false && (
            <Ionicons name="chevron-forward" size={20} color={theme.colors.icon.tertiary} />
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
};

export const ProfileScreen: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [isParentMode, setIsParentMode] = useState(user?.role === 'parent');

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of your account?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const toggleParentMode = () => {
    setIsParentMode(!isParentMode);
  };

  const accountMenuItems: ProfileMenuItem[] = [
    {
      id: 'edit-profile',
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      icon: 'person-outline',
      color: theme.colors.interactive.accent,
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      id: 'payment-methods',
      title: 'Payment Methods',
      subtitle: 'Manage cards and billing',
      icon: 'card-outline',
      color: theme.colors.status.success,
      onPress: () => navigation.navigate('PaymentMethods'),
    },
    ...(user?.role === 'parent' || isParentMode ? [{
      id: 'manage-children',
      title: 'Manage Children',
      subtitle: 'Add or edit child profiles',
      icon: 'people-outline' as const,
      color: theme.colors.interactive.purple,
      onPress: () => console.log('Navigate to manage children'),
    }] : []),
  ];

  const settingsMenuItems: ProfileMenuItem[] = [
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: 'Customize your alerts',
      icon: 'notifications-outline',
      color: theme.colors.status.warning,
      onPress: () => navigation.navigate('NotificationSettings'),
      badge: '3',
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      subtitle: 'Control your data and security',
      icon: 'shield-outline',
      color: theme.colors.status.error,
      onPress: () => navigation.navigate('PrivacySettings'),
    },
    {
      id: 'settings',
      title: 'App Settings',
      subtitle: 'Language, theme, and more',
      icon: 'settings-outline',
      color: theme.colors.icon.secondary,
      onPress: () => navigation.navigate('Settings'),
    },
  ];

  const supportMenuItems: ProfileMenuItem[] = [
    {
      id: 'help',
      title: 'Help & Support',
      subtitle: 'Get help or contact us',
      icon: 'help-circle-outline',
      color: theme.colors.interactive.purple,
      onPress: () => navigation.navigate('HelpAndSupport'),
    },
    {
      id: 'about',
      title: 'About Academy',
      subtitle: 'App version and information',
      icon: 'information-circle-outline',
      color: theme.colors.icon.secondary,
      onPress: () => navigation.navigate('About'),
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <View style={{
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    }}>
      <Header
        title="Profile"
        showProgramSwitcher={true}
        rightComponent={
          <Pressable 
            onPress={() => navigation.navigate('AppMenu')}
            style={{
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons
              name="menu-outline"
              size={24}
              color={theme.colors.icon.primary}
            />
          </Pressable>
        }
        style={{ paddingTop: insets.top }}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: theme.spacing.lg,
          paddingBottom: theme.spacing['3xl'],
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          style={{
            paddingHorizontal: theme.spacing.lg,
            marginBottom: theme.spacing.xl,
          }}
        >
          <View style={{
            backgroundColor: theme.colors.background.primary,
            borderRadius: theme.borderRadius.xl,
            padding: theme.spacing.lg,
            borderWidth: 1,
            borderColor: theme.colors.border.primary,
            ...theme.elevation.sm,
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: theme.spacing.md,
            }}>
              <View style={{
                width: 64,
                height: 64,
                backgroundColor: `${theme.colors.interactive.accent}15`,
                borderRadius: 32,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: theme.spacing.md,
              }}>
                <Text style={{
                  color: theme.colors.interactive.accent,
                  fontWeight: theme.fontConfig.fontWeight.bold,
                  fontSize: theme.fontSizes.xl,
                }}>
                  {getInitials(user?.first_name + ' ' + user?.last_name || 'User')}
                </Text>
              </View>
              
              <View style={{ flex: 1 }}>
                <Text style={{
                  color: theme.colors.text.primary,
                  fontWeight: theme.fontConfig.fontWeight.bold,
                  fontSize: theme.fontSizes.xl,
                }}>
                  {user?.first_name} {user?.last_name}
                </Text>
                <Text style={{
                  color: theme.colors.text.secondary,
                  fontSize: theme.fontSizes.base,
                  marginTop: 4,
                }}>
                  {user?.email}
                </Text>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 8,
                }}>
                  <View style={{
                    backgroundColor: theme.colors.status.infoBackground,
                    paddingHorizontal: theme.spacing.sm,
                    paddingVertical: theme.spacing.xs,
                    borderRadius: theme.borderRadius.full,
                  }}>
                    <Text style={{
                      color: theme.colors.interactive.accent,
                      fontWeight: theme.fontConfig.fontWeight.medium,
                      fontSize: theme.fontSizes.sm,
                    }}>
                      {isParentMode ? 'Parent' : 'Student'}
                    </Text>
                  </View>
                  {user?.role === 'parent' && (
                    <Pressable
                      onPress={toggleParentMode}
                      style={{
                        marginLeft: theme.spacing.xs,
                        backgroundColor: theme.colors.background.secondary,
                        paddingHorizontal: 12,
                        paddingVertical: 4,
                        borderRadius: theme.borderRadius.full,
                      }}
                    >
                      <Text style={{
                        color: theme.colors.text.secondary,
                        fontWeight: theme.fontConfig.fontWeight.medium,
                        fontSize: theme.fontSizes.sm,
                      }}>
                        Switch to {isParentMode ? 'Student' : 'Parent'}
                      </Text>
                    </Pressable>
                  )}
                </View>
              </View>
              
              <Pressable 
                onPress={() => navigation.navigate('EditProfile')}
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: theme.colors.background.secondary,
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="pencil" size={20} color={theme.colors.icon.secondary} />
              </Pressable>
            </View>
            
            {/* Quick Stats */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderTopWidth: 1,
              borderTopColor: theme.colors.border.primary,
              paddingTop: theme.spacing.md,
            }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{
                  color: theme.colors.text.primary,
                  fontWeight: theme.fontConfig.fontWeight.bold,
                  fontSize: theme.fontSizes.lg,
                }}>2</Text>
                <Text style={{
                  color: theme.colors.text.secondary,
                  fontSize: theme.fontSizes.sm,
                }}>Active Courses</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{
                  color: theme.colors.text.primary,
                  fontWeight: theme.fontConfig.fontWeight.bold,
                  fontSize: theme.fontSizes.lg,
                }}>15</Text>
                <Text style={{
                  color: theme.colors.text.secondary,
                  fontSize: theme.fontSizes.sm,
                }}>Sessions</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{
                  color: theme.colors.text.primary,
                  fontWeight: theme.fontConfig.fontWeight.bold,
                  fontSize: theme.fontSizes.lg,
                }}>3</Text>
                <Text style={{
                  color: theme.colors.text.secondary,
                  fontSize: theme.fontSizes.sm,
                }}>Achievements</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Account Section */}
        <View style={{ paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.xl }}>
          <Animated.Text
            entering={FadeInDown.delay(200).springify()}
            style={{
              color: theme.colors.text.primary,
              fontSize: theme.fontSizes.lg,
              fontWeight: theme.fontConfig.fontWeight.semibold,
              marginBottom: theme.spacing.md,
            }}
          >
            Account
          </Animated.Text>
          
          {accountMenuItems.map((item, index) => (
            <ProfileMenuItemComponent
              key={item.id}
              item={item}
              index={index}
            />
          ))}
        </View>

        {/* Preferences Section */}
        <View style={{ paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.xl }}>
          <Animated.Text
            entering={FadeInDown.delay(300).springify()}
            style={{
              color: theme.colors.text.primary,
              fontSize: theme.fontSizes.lg,
              fontWeight: theme.fontConfig.fontWeight.semibold,
              marginBottom: theme.spacing.md,
            }}
          >
            Preferences
          </Animated.Text>
          
          {settingsMenuItems.map((item, index) => (
            <ProfileMenuItemComponent
              key={item.id}
              item={item}
              index={index}
            />
          ))}
        </View>

        {/* Support Section */}
        <View style={{ paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.xl }}>
          <Animated.Text
            entering={FadeInDown.delay(400).springify()}
            style={{
              color: theme.colors.text.primary,
              fontSize: theme.fontSizes.lg,
              fontWeight: theme.fontConfig.fontWeight.semibold,
              marginBottom: theme.spacing.md,
            }}
          >
            Support
          </Animated.Text>
          
          {supportMenuItems.map((item, index) => (
            <ProfileMenuItemComponent
              key={item.id}
              item={item}
              index={index}
            />
          ))}
        </View>

        {/* Logout Button */}
        <Animated.View
          entering={FadeInDown.delay(500).springify()}
          style={{
            paddingHorizontal: theme.spacing.lg,
            marginBottom: theme.spacing.xl,
          }}
        >
          <Pressable
            onPress={handleLogout}
            style={{
              backgroundColor: theme.colors.status.errorBackground,
              borderRadius: theme.borderRadius.xl,
              padding: theme.spacing.md,
              borderWidth: 1,
              borderColor: theme.colors.status.error,
            }}
          >
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Ionicons name="log-out-outline" size={20} color={theme.colors.status.error} />
              <Text style={{
                color: theme.colors.status.error,
                fontWeight: theme.fontConfig.fontWeight.medium,
                fontSize: theme.fontSizes.base,
                marginLeft: theme.spacing.sm,
              }}>
                Sign Out
              </Text>
            </View>
          </Pressable>
        </Animated.View>

        {/* App Version */}
        <Animated.View
          entering={FadeInDown.delay(600).springify()}
          style={{
            paddingHorizontal: theme.spacing.lg,
            marginBottom: theme.spacing.md,
          }}
        >
          <Text style={{
            color: theme.colors.text.tertiary,
            textAlign: 'center',
            fontSize: theme.fontSizes.sm,
          }}>
            Academy Students App v1.0.0
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
};