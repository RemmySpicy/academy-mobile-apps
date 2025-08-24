import React, { useState, useMemo } from 'react';
import { View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInRight,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useAuthStore, useTheme, Header, MenuList, MenuItem } from '@academy/mobile-shared';

interface ProfileMenuSection {
  title: string;
  items: ProfileMenuItem[];
}

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

interface ProfileMenuItemProps extends ProfileMenuItem {
  index: number;
}

const ProfileMenuItemComponent: React.FC<ProfileMenuItemProps> = ({
  title,
  subtitle,
  icon,
  color,
  onPress,
  showChevron = true,
  badge,
  index,
}) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 50).springify()}
      style={animatedStyle}
    >
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.98);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        style={{
          backgroundColor: theme.colors.background.primary,
          borderRadius: theme.borderRadius.xl,
          padding: theme.spacing.md,
          borderWidth: 1,
          borderColor: theme.colors.border.primary,
          marginBottom: theme.spacing.sm,
          ...theme.elevation.sm,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: theme.spacing.md,
              backgroundColor: `${color}15`,
            }}
          >
            <Ionicons name={icon} size={20} color={color} />
          </View>
          
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{
                color: theme.colors.text.primary,
                fontWeight: theme.fontConfig.fontWeight.medium,
                fontSize: theme.fontSizes.base,
                flex: 1,
              }}>
                {title}
              </Text>
              {badge && (
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
                  }}>{badge}</Text>
                </View>
              )}
            </View>
            {subtitle && (
              <Text style={{
                color: theme.colors.text.secondary,
                fontSize: theme.fontSizes.sm,
                marginTop: 4,
              }}>{subtitle}</Text>
            )}
          </View>
          
          {showChevron && (
            <Ionicons name="chevron-forward" size={20} color={theme.colors.icon.tertiary} />
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
};

/**
 * Menu Screen - Main Navigation Hub
 * 
 * Features:
 * - User profile overview
 * - Navigation grid with MenuList component
 * - Account settings and preferences
 * - Payment method management
 * - Notification settings
 * - Help and support
 * - Parent/Student role switching
 * - Privacy and security settings
 */
export const MenuScreen: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
  const [isParentMode, setIsParentMode] = useState(user?.role === 'parent');
  const [notificationCount, setNotificationCount] = useState(0);

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
    // In a real app, this would switch the user context
  };

  const menuSections: ProfileMenuSection[] = [
    {
      title: 'Account',
      items: [
        {
          id: 'edit-profile',
          title: 'Edit Profile',
          subtitle: 'Update your personal information',
          icon: 'person-outline',
          color: theme.colors.interactive.accent,
          onPress: () => console.log('Navigate to edit profile'),
        },
        {
          id: 'payment-methods',
          title: 'Payment Methods',
          subtitle: 'Manage cards and billing',
          icon: 'card-outline',
          color: theme.colors.status.success,
          onPress: () => console.log('Navigate to payment methods'),
        },
        ...(user?.role === 'parent' || isParentMode ? [{
          id: 'manage-children',
          title: 'Manage Children',
          subtitle: 'Add or edit child profiles',
          icon: 'people-outline' as const,
          color: theme.colors.interactive.purple,
          onPress: () => console.log('Navigate to manage children'),
        }] : []),
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          id: 'notifications',
          title: 'Notifications',
          subtitle: 'Customize your alerts',
          icon: 'notifications-outline',
          color: theme.colors.status.warning,
          onPress: () => console.log('Navigate to notifications'),
          badge: '3',
        },
        {
          id: 'privacy',
          title: 'Privacy & Security',
          subtitle: 'Control your data and security',
          icon: 'shield-outline',
          color: theme.colors.status.error,
          onPress: () => console.log('Navigate to privacy'),
        },
        {
          id: 'settings',
          title: 'App Settings',
          subtitle: 'Language, theme, and more',
          icon: 'settings-outline',
          color: theme.colors.icon.secondary,
          onPress: () => console.log('Navigate to settings'),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          title: 'Help & Support',
          subtitle: 'Get help or contact us',
          icon: 'help-circle-outline',
          color: theme.colors.interactive.purple,
          onPress: () => console.log('Navigate to help'),
        },
        {
          id: 'about',
          title: 'About Academy',
          subtitle: 'App version and information',
          icon: 'information-circle-outline',
          color: theme.colors.icon.secondary,
          onPress: () => console.log('Navigate to about'),
        },
      ],
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
  };

  const handleSearch = () => {
    console.log('Search pressed');
  };

  const handleFilter = () => {
    console.log('Filter pressed');
  };

  const handleNotifications = () => {
    console.log('Notifications pressed');
    setNotificationCount(0);
  };

  return (
    <View style={{
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    }}>
      {/* Header with Program Switcher */}
      <Header
        title="Menu"
        showProgramSwitcher={true}
        showNotifications={notificationCount > 0}
        onNotificationPress={handleNotifications}
        notificationCount={notificationCount}
        showProfile={false}
        style={{ paddingTop: insets.top }}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: theme.spacing.lg,
          paddingBottom: theme.spacing['3xl'], // Space for tab bar
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          style={{
            paddingHorizontal: theme.spacing.lg,
            marginBottom: theme.spacing['2xl'],
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
                  {getInitials(user?.firstName + ' ' + user?.lastName || 'User')}
                </Text>
              </View>
              
              <View style={{ flex: 1 }}>
                <Text style={{
                  color: theme.colors.text.primary,
                  fontWeight: theme.fontConfig.fontWeight.bold,
                  fontSize: theme.fontSizes.xl,
                }}>
                  {user?.firstName} {user?.lastName}
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
              
              <Pressable style={{
                width: 40,
                height: 40,
                backgroundColor: theme.colors.background.secondary,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
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

        {/* Navigation Grid using MenuList */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={{
            paddingHorizontal: theme.spacing.lg,
            marginBottom: theme.spacing['2xl'],
          }}
        >
          <Text
            style={{
              color: theme.colors.text.primary,
              fontSize: theme.fontSizes.lg,
              fontWeight: theme.fontConfig.fontWeight.semibold,
              marginBottom: theme.spacing.md,
            }}
          >
            Quick Actions
          </Text>
          
          <MenuList
            items={[
              {
                id: 'our-courses',
                title: 'Our Courses',
                icon: 'school',
                onPress: () => console.log('Navigate to our courses'),
                backgroundColor: theme.isDark ? '#1a365d' : '#e8f4fd',
                iconColor: theme.colors.interactive.primary,
              },
              {
                id: 'our-services',
                title: 'Our Services',
                icon: 'business',
                onPress: () => console.log('Navigate to our services'),
                backgroundColor: theme.isDark ? '#2d3a4f' : '#f0f4ff',
                iconColor: theme.colors.interactive.accent,
              },
              {
                id: 'achievements',
                title: 'Achievements',
                icon: 'trophy',
                onPress: () => console.log('Navigate to achievements'),
                badge: '3',
                backgroundColor: theme.isDark ? '#1e4a3f' : '#e8f5e8',
                iconColor: theme.colors.status.success,
              },
              {
                id: 'store',
                title: 'Store',
                icon: 'storefront',
                onPress: () => console.log('Navigate to store'),
                backgroundColor: theme.isDark ? '#4a2f1a' : '#fff3cd',
                iconColor: theme.colors.status.warning,
              },
              {
                id: 'transactions',
                title: 'Transactions',
                icon: 'card',
                onPress: () => console.log('Navigate to transactions'),
                backgroundColor: theme.isDark ? '#2d1b4e' : '#f3e8ff',
                iconColor: theme.colors.interactive.purple,
              },
              {
                id: 'referrals',
                title: 'Referrals',
                icon: 'people',
                onPress: () => console.log('Navigate to referrals'),
                backgroundColor: theme.isDark ? '#1f3a3d' : '#e0f7fa',
                iconColor: theme.colors.interactive.accent,
              },
              {
                id: 'my-schedule',
                title: 'My Schedule',
                icon: 'calendar',
                onPress: () => console.log('Navigate to my schedule'),
                backgroundColor: theme.isDark ? '#3a2f1f' : '#fef7e0',
                iconColor: theme.colors.status.warning,
              },
              {
                id: 'progress-report',
                title: 'Progress Report',
                icon: 'trending-up',
                onPress: () => console.log('Navigate to progress report'),
                backgroundColor: theme.isDark ? '#1e3a4a' : '#e8f4f8',
                iconColor: theme.colors.interactive.primary,
              },
              {
                id: 'locate-us',
                title: 'Locate Us',
                icon: 'location',
                onPress: () => console.log('Navigate to locate us'),
                backgroundColor: theme.isDark ? '#4a1e3d' : '#fce4ec',
                iconColor: theme.colors.status.error,
              },
              {
                id: 'contact-us',
                title: 'Contact Us',
                icon: 'mail',
                onPress: () => console.log('Navigate to contact us'),
                backgroundColor: theme.isDark ? '#2f4a1a' : '#f1f8e9',
                iconColor: theme.colors.status.success,
              },
              {
                id: 'help-support',
                title: 'Help & Support',
                icon: 'help-circle',
                onPress: () => console.log('Navigate to help & support'),
                backgroundColor: theme.isDark ? '#4a3a1e' : '#fff8dc',
                iconColor: theme.colors.icon.secondary,
              },
            ]}
            columns={2}
            columnWidth={160}
            spacing={theme.spacing.md}
            containerPadding={theme.spacing.lg * 2}
            variant="card"
            scrollEnabled={false}
          />
        </Animated.View>

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <View key={section.title} style={{
            paddingHorizontal: theme.spacing.lg,
            marginBottom: theme.spacing['2xl'],
          }}>
            <Animated.Text
              entering={FadeInDown.delay((sectionIndex + 2) * 100).springify()}
              style={{
                color: theme.colors.text.primary,
                fontSize: theme.fontSizes.lg,
                fontWeight: theme.fontConfig.fontWeight.semibold,
                marginBottom: theme.spacing.md,
              }}
            >
              {section.title}
            </Animated.Text>
            
            <View>
              {section.items.map((item, itemIndex) => (
                <ProfileMenuItemComponent
                  key={item.id}
                  {...item}
                  index={sectionIndex * 10 + itemIndex}
                />
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <Animated.View
          entering={FadeInDown.delay(500).springify()}
          style={{
            paddingHorizontal: theme.spacing.lg,
            marginBottom: theme.spacing['2xl'],
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