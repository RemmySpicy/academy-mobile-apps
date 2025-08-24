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
import { useAuthStore, useTheme, Header, MenuList } from '@academy/mobile-shared';
import { MenuStackParamList } from '../navigation/MenuNavigator';

type AppMenuScreenNavigationProp = NativeStackNavigationProp<MenuStackParamList, 'MenuMain'>;

interface MenuItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
  showChevron?: boolean;
  badge?: string;
}

const MenuItemComponent: React.FC<{ item: MenuItem; index: number }> = ({
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

export const AppMenuScreen: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
  const navigation = useNavigation<AppMenuScreenNavigationProp>();
  const [notificationCount] = useState(0);
  const [isParentMode, setIsParentMode] = useState(user?.role === 'parent');

  const handleSearch = () => {
    console.log('Search pressed');
  };

  const handleNotifications = () => {
    console.log('Notifications pressed');
  };

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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
  };

  const accountMenuItems: MenuItem[] = [
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

  const settingsMenuItems: MenuItem[] = [
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

  const supportMenuItems: MenuItem[] = [
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

  return (
    <View style={{
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    }}>
      <Header
        title="Menu"
        showProgramSwitcher={true}
        showNotifications={notificationCount > 0}
        onNotificationPress={handleNotifications}
        notificationCount={notificationCount}
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

        {/* Academy Features Header Section */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          style={{
            paddingHorizontal: theme.spacing.lg,
            marginBottom: theme.spacing.xl,
            alignItems: 'center',
          }}
        >
          <Text style={{
            color: theme.colors.text.primary,
            fontSize: theme.fontSizes['2xl'],
            fontWeight: theme.fontConfig.fontWeight.bold,
            textAlign: 'center',
            marginBottom: theme.spacing.md,
          }}>
            Academy Features
          </Text>
          <Text style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.base,
            textAlign: 'center',
            lineHeight: 24,
          }}>
            Explore all the features and services available in your Academy app.
          </Text>
        </Animated.View>

        {/* App Features Grid */}
        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          style={{
            paddingHorizontal: theme.spacing.lg,
            marginBottom: theme.spacing.xl,
          }}
        >          
          <MenuList
            items={[
              {
                id: 'our-courses',
                title: 'Our Courses',
                icon: 'school',
                onPress: () => navigation.navigate('OurCourses'),
                backgroundColor: theme.isDark ? '#1a365d' : '#e8f4fd',
                iconColor: theme.colors.interactive.primary,
              },
              {
                id: 'our-services',
                title: 'Our Services',
                icon: 'business',
                onPress: () => navigation.navigate('OurServices'),
                backgroundColor: theme.isDark ? '#2d3a4f' : '#f0f4ff',
                iconColor: theme.colors.interactive.accent,
              },
              {
                id: 'achievements',
                title: 'Achievements',
                icon: 'trophy',
                onPress: () => navigation.navigate('Achievements'),
                badge: '3',
                backgroundColor: theme.isDark ? '#1e4a3f' : '#e8f5e8',
                iconColor: theme.colors.status.success,
              },
              {
                id: 'store',
                title: 'Store',
                icon: 'storefront',
                onPress: () => navigation.navigate('Store'),
                backgroundColor: theme.isDark ? '#4a2f1a' : '#fff3cd',
                iconColor: theme.colors.status.warning,
              },
              {
                id: 'transactions',
                title: 'Transactions',
                icon: 'card',
                onPress: () => navigation.navigate('Transactions'),
                backgroundColor: theme.isDark ? '#2d1b4e' : '#f3e8ff',
                iconColor: theme.colors.interactive.purple,
              },
              {
                id: 'referrals',
                title: 'Referrals',
                icon: 'people',
                onPress: () => navigation.navigate('Referrals'),
                backgroundColor: theme.isDark ? '#1f3a3d' : '#e0f7fa',
                iconColor: theme.colors.interactive.accent,
              },
              {
                id: 'my-schedule',
                title: 'My Schedule',
                icon: 'calendar',
                onPress: () => navigation.navigate('MySchedule'),
                backgroundColor: theme.isDark ? '#3a2f1f' : '#fef7e0',
                iconColor: theme.colors.status.warning,
              },
              {
                id: 'progress-report',
                title: 'Progress Report',
                icon: 'trending-up',
                onPress: () => navigation.navigate('ProgressReport'),
                backgroundColor: theme.isDark ? '#1e3a4a' : '#e8f4f8',
                iconColor: theme.colors.interactive.primary,
              },
              {
                id: 'locate-us',
                title: 'Locate Us',
                icon: 'location',
                onPress: () => navigation.navigate('LocateUs'),
                backgroundColor: theme.isDark ? '#4a1e3d' : '#fce4ec',
                iconColor: theme.colors.status.error,
              },
              {
                id: 'contact-us',
                title: 'Contact Us',
                icon: 'mail',
                onPress: () => navigation.navigate('ContactUs'),
                backgroundColor: theme.isDark ? '#2f4a1a' : '#f1f8e9',
                iconColor: theme.colors.status.success,
              },
              {
                id: 'help-support',
                title: 'Help & Support',
                icon: 'help-circle',
                onPress: () => navigation.navigate('HelpAndSupport'),
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

        {/* Quick Access Section */}
        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          style={{
            paddingHorizontal: theme.spacing.lg,
            marginBottom: theme.spacing.xl,
          }}
        >
          <Text style={{
            color: theme.colors.text.primary,
            fontSize: theme.fontSizes.lg,
            fontWeight: theme.fontConfig.fontWeight.semibold,
            marginBottom: theme.spacing.md,
          }}>
            Quick Access
          </Text>
          
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
            <Pressable
              onPress={() => navigation.navigate('MySchedule')}
              style={{
                backgroundColor: theme.colors.background.primary,
                borderRadius: theme.borderRadius.xl,
                padding: theme.spacing.md,
                flex: 1,
                marginRight: theme.spacing.sm,
                alignItems: 'center',
                ...theme.elevation.sm,
              }}
            >
              <View style={{
                width: 40,
                height: 40,
                backgroundColor: `${theme.colors.interactive.primary}15`,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: theme.spacing.sm,
              }}>
                <Ionicons
                  name="calendar"
                  size={20}
                  color={theme.colors.interactive.primary}
                />
              </View>
              <Text style={{
                color: theme.colors.text.primary,
                fontSize: theme.fontSizes.sm,
                fontWeight: theme.fontConfig.fontWeight.medium,
                textAlign: 'center',
              }}>
                Today's Schedule
              </Text>
            </Pressable>
            
            <Pressable
              onPress={() => navigation.navigate('Achievements')}
              style={{
                backgroundColor: theme.colors.background.primary,
                borderRadius: theme.borderRadius.xl,
                padding: theme.spacing.md,
                flex: 1,
                marginHorizontal: theme.spacing.xs,
                alignItems: 'center',
                ...theme.elevation.sm,
              }}
            >
              <View style={{
                width: 40,
                height: 40,
                backgroundColor: `${theme.colors.status.success}15`,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: theme.spacing.sm,
              }}>
                <Ionicons
                  name="trophy"
                  size={20}
                  color={theme.colors.status.success}
                />
              </View>
              <Text style={{
                color: theme.colors.text.primary,
                fontSize: theme.fontSizes.sm,
                fontWeight: theme.fontConfig.fontWeight.medium,
                textAlign: 'center',
              }}>
                My Progress
              </Text>
            </Pressable>
            
            <Pressable
              onPress={() => navigation.navigate('Store')}
              style={{
                backgroundColor: theme.colors.background.primary,
                borderRadius: theme.borderRadius.xl,
                padding: theme.spacing.md,
                flex: 1,
                marginLeft: theme.spacing.sm,
                alignItems: 'center',
                ...theme.elevation.sm,
              }}
            >
              <View style={{
                width: 40,
                height: 40,
                backgroundColor: `${theme.colors.status.warning}15`,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: theme.spacing.sm,
              }}>
                <Ionicons
                  name="storefront"
                  size={20}
                  color={theme.colors.status.warning}
                />
              </View>
              <Text style={{
                color: theme.colors.text.primary,
                fontSize: theme.fontSizes.sm,
                fontWeight: theme.fontConfig.fontWeight.medium,
                textAlign: 'center',
              }}>
                Shop Now
              </Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* Account Section */}
        <View style={{ paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.xl }}>
          <Animated.Text
            entering={FadeInDown.delay(500).springify()}
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
            <MenuItemComponent
              key={item.id}
              item={item}
              index={index}
            />
          ))}
        </View>

        {/* Preferences Section */}
        <View style={{ paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.xl }}>
          <Animated.Text
            entering={FadeInDown.delay(600).springify()}
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
            <MenuItemComponent
              key={item.id}
              item={item}
              index={index}
            />
          ))}
        </View>

        {/* Support Section */}
        <View style={{ paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.xl }}>
          <Animated.Text
            entering={FadeInDown.delay(700).springify()}
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
            <MenuItemComponent
              key={item.id}
              item={item}
              index={index}
            />
          ))}
        </View>

        {/* Featured Section */}
        <Animated.View
          entering={FadeInDown.delay(800).springify()}
          style={{
            margin: theme.spacing.lg,
            backgroundColor: theme.colors.interactive.primary,
            borderRadius: theme.borderRadius.xl,
            padding: theme.spacing.lg,
            alignItems: 'center',
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
            Refer a Friend, Earn $50!
          </Text>
          <Text style={{
            color: 'white',
            fontSize: theme.fontSizes.base,
            textAlign: 'center',
            opacity: 0.9,
            marginBottom: theme.spacing.lg,
          }}>
            Share your referral code and earn rewards when friends join Academy
          </Text>
          <Pressable
            onPress={() => navigation.navigate('Referrals')}
            style={{
              backgroundColor: 'white',
              borderRadius: theme.borderRadius.lg,
              paddingHorizontal: theme.spacing.xl,
              paddingVertical: theme.spacing.md,
            }}
          >
            <Text style={{
              color: theme.colors.interactive.primary,
              fontWeight: theme.fontConfig.fontWeight.medium,
              fontSize: theme.fontSizes.base,
            }}>
              Start Referring
            </Text>
          </Pressable>
        </Animated.View>

        {/* Logout Button */}
        <Animated.View
          entering={FadeInDown.delay(900).springify()}
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
          entering={FadeInDown.delay(1000).springify()}
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