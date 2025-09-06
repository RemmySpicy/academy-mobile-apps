import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  ImageBackground,
  Modal,
  Image,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useAuthStore, useTheme, Header, MenuList } from '@academy/mobile-shared';
import { MenuStackParamList } from '../navigation/MenuNavigator';
import type { AppStackParamList } from '../../../navigation/AppNavigator';
import { ProfileSwitcherBottomSheet } from '../components/ProfileSwitcherBottomSheet';

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
  const appNavigation = useNavigation<NavigationProp<AppStackParamList>>();
  const [notificationCount] = useState(0);
  const [isParentMode, setIsParentMode] = useState(user?.role === 'parent');
  const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ uri: string; type: 'cover' | 'profile' } | null>(null);

  const handleSearch = () => {
    console.log('Search pressed');
  };

  const handleNotifications = () => {
    appNavigation.navigate('Notifications');
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

  const handleProfileSwitch = () => {
    setShowProfileSwitcher(true);
  };

  // Mock profiles data - in real app, this would come from the backend
  const mockProfiles = [
    {
      id: '1',
      name: `${user?.first_name || 'Benson'} ${user?.last_name || 'Adeyemi'}`,
      email: user?.email || 'benson.adeyemi@example.com',
      role: 'student' as const,
      isActive: true,
      level: 'Level 2: Fundamental Aquatic Skills',
      program: 'Swimming',
      module: 'Module 3: Introduction to Breaststroke',
      achievements: '18/36',
      attendance: '95%',
      badges: '3',
    },
    {
      id: '2',
      name: 'Kemi Adeyemi',
      email: 'kemi.adeyemi@example.com',
      role: 'student' as const,
      isActive: false,
      level: 'Level 1: Water Safety',
      program: 'Swimming',
      module: 'Module 2: Floating Techniques',
      achievements: '24/30',
      attendance: '92%',
      badges: '5',
    },
    {
      id: '3',
      name: 'Tunde Adeyemi',
      email: 'tunde.adeyemi@example.com',
      role: 'parent' as const,
      isActive: false,
    },
  ];

  const handleProfileSelect = (profile: any) => {
    console.log('Selected profile:', profile.name);
    // TODO: Implement actual profile switching logic
    Alert.alert(
      'Profile Selected',
      `Switching to ${profile.name}`,
      [{ text: 'OK' }]
    );
  };

  const handleCreateChildProfile = () => {
    console.log('Create child profile');
    // TODO: Navigate to create child profile screen
    Alert.alert(
      'Create Child Profile',
      'This will navigate to create child profile screen',
      [{ text: 'OK' }]
    );
  };

  const handleExpandCoverPhoto = () => {
    setSelectedImage({
      uri: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&crop=center',
      type: 'cover'
    });
    setShowImageModal(true);
  };

  const handleExpandProfilePicture = () => {
    // For profile picture, we'll show a larger version of the initials or actual photo if available
    setSelectedImage({
      uri: 'placeholder', // This would be actual profile image URI in real app
      type: 'profile'
    });
    setShowImageModal(true);
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

  const preferencesMenuItems: MenuItem[] = [
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: 'Customize alerts and quiet hours',
      icon: 'notifications-outline',
      color: theme.colors.status.warning,
      onPress: () => navigation.navigate('NotificationSettings'),
      badge: '3',
    },
    {
      id: 'privacy',
      title: 'Privacy & Data',
      subtitle: 'Control your data and permissions',
      icon: 'shield-outline',
      color: theme.colors.status.error,
      onPress: () => navigation.navigate('PrivacySettings'),
    },
    {
      id: 'app-preferences',
      title: 'App Preferences',
      subtitle: 'Language, theme, currency',
      icon: 'settings-outline',
      color: theme.colors.icon.secondary,
      onPress: () => navigation.navigate('AppPreferences'),
    },
  ];

  const supportMenuItems: MenuItem[] = [
    {
      id: 'help-support',
      title: 'Help & Support',
      subtitle: 'Get help or contact our team',
      icon: 'help-circle-outline',
      color: theme.colors.interactive.purple,
      onPress: () => navigation.navigate('HelpAndSupport'),
    },
    {
      id: 'about',
      title: 'About & Legal',
      subtitle: 'App info, terms, and privacy policy',
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
            paddingHorizontal: theme.spacing.md,
            marginBottom: theme.spacing.xl,
          }}
        >
          <View style={{
            backgroundColor: theme.colors.background.primary,
            borderRadius: theme.borderRadius.xl,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: theme.colors.border.primary,
            ...theme.elevation.sm,
          }}>
            {/* Cover Image Background */}
            <Pressable onPress={handleExpandCoverPhoto}>
              <ImageBackground
                source={{
                  uri: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=200&fit=crop&crop=center'
                }}
                style={{
                  height: 120,
                  justifyContent: 'flex-end',
                  paddingBottom: theme.spacing.md,
                  paddingHorizontal: theme.spacing.md,
                }}
                imageStyle={{
                  opacity: 0.8,
                }}
              >
                {/* Gradient overlay for better text contrast */}
                <View style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.3)',
                }} />
              </ImageBackground>
            </Pressable>

            {/* Profile Info Section */}
            <View style={{ padding: theme.spacing.lg, paddingTop: 0 }}>
              {/* Profile Picture overlapping cover - positioned absolutely */}
              <Pressable 
                onPress={handleExpandProfilePicture}
                style={{
                  position: 'absolute',
                  top: -40, // Adjusted for larger profile picture
                  left: theme.spacing.lg,
                  width: 84,
                  height: 84,
                  backgroundColor: theme.colors.background.primary,
                  borderRadius: 42,
                  padding: 3,
                  zIndex: 1,
                  ...theme.elevation.md,
                }}
              >
                <View style={{
                  width: 78,
                  height: 78,
                  backgroundColor: `${theme.colors.interactive.accent}15`,
                  borderRadius: 39,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Text style={{
                    color: theme.colors.interactive.accent,
                    fontWeight: theme.fontConfig.fontWeight.bold,
                    fontSize: theme.fontSizes['2xl'],
                  }}>
                    {getInitials(user?.first_name + ' ' + user?.last_name || 'User')}
                  </Text>
                </View>
              </Pressable>

              {/* Student Details Section - below profile picture */}
              <View style={{
                marginTop: 48, // Space for larger overlapping profile picture
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: theme.spacing.md,
              }}>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    color: theme.colors.text.primary,
                    fontWeight: theme.fontConfig.fontWeight.bold,
                    fontSize: theme.fontSizes.xl,
                  }}>
                    {user?.first_name} {user?.last_name}
                  </Text>
                  
                  {/* Academic Progress Path - Level → Module */}
                  <View style={{
                    marginTop: 6,
                    backgroundColor: theme.colors.interactive.primaryBackground,
                    paddingHorizontal: theme.spacing.sm,
                    paddingVertical: theme.spacing.sm,
                    borderRadius: theme.borderRadius.lg,
                    alignSelf: 'flex-start',
                  }}>
                    {/* Header with school icon */}
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 4,
                    }}>
                      <Ionicons name="school" size={14} color={theme.colors.interactive.primary} />
                      <Text style={{
                        color: theme.colors.interactive.primary,
                        fontSize: theme.fontSizes.xs,
                        fontWeight: theme.fontConfig.fontWeight.semibold,
                        marginLeft: 4,
                      }}>
                        Academic Progress
                      </Text>
                    </View>
                    
                    {/* Level → Module Path */}
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                      {/* Level */}
                      <Text style={{
                        color: theme.colors.interactive.primary,
                        fontSize: theme.fontSizes.sm,
                        fontWeight: theme.fontConfig.fontWeight.bold,
                      }}>
                        Level 2
                      </Text>
                      
                      {/* Arrow connector */}
                      <Ionicons 
                        name="chevron-forward" 
                        size={12} 
                        color={theme.colors.interactive.primary}
                        style={{ marginHorizontal: 4 }}
                      />
                      
                      {/* Module */}
                      <Text style={{
                        color: theme.colors.interactive.primary,
                        fontSize: theme.fontSizes.sm,
                        fontWeight: theme.fontConfig.fontWeight.bold,
                      }}>
                        Module 3
                      </Text>
                    </View>
                    
                    {/* Course Title */}
                    <Text style={{
                      color: theme.colors.text.primary,
                      fontSize: theme.fontSizes.xs,
                      marginTop: 4,
                      fontStyle: 'italic',
                    }}>
                      "Introduction to Breaststroke"
                    </Text>
                  </View>
                  
                  {/* Progress and Achievement Row */}
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 8,
                    gap: theme.spacing.sm,
                  }}>
                    {/* Achievement Progress */}
                    <View style={{
                      backgroundColor: theme.colors.status.warningBackground,
                      paddingHorizontal: theme.spacing.sm,
                      paddingVertical: theme.spacing.xs,
                      borderRadius: theme.borderRadius.full,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                      <Text style={{
                        color: theme.colors.status.warning,
                        fontSize: 10,
                        marginRight: 2,
                      }}>
                        ⭐
                      </Text>
                      <Text style={{
                        color: theme.colors.status.warning,
                        fontWeight: theme.fontConfig.fontWeight.bold,
                        fontSize: theme.fontSizes.xs,
                      }}>
                        18 / 36
                      </Text>
                    </View>
                    
                    {/* Attendance Badge */}
                    <View style={{
                      backgroundColor: theme.colors.status.successBackground,
                      paddingHorizontal: theme.spacing.sm,
                      paddingVertical: theme.spacing.xs,
                      borderRadius: theme.borderRadius.full,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                      <Ionicons 
                        name="checkmark-circle" 
                        size={10} 
                        color={theme.colors.status.success} 
                        style={{ marginRight: 3 }}
                      />
                      <Text style={{
                        color: theme.colors.status.success,
                        fontWeight: theme.fontConfig.fontWeight.medium,
                        fontSize: theme.fontSizes.xs,
                      }}>
                        95% Attendance
                      </Text>
                    </View>
                    
                    {/* Badges/Certificates Count */}
                    <View style={{
                      backgroundColor: theme.colors.interactive.accentBackground,
                      paddingHorizontal: theme.spacing.sm,
                      paddingVertical: theme.spacing.xs,
                      borderRadius: theme.borderRadius.full,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                      <Ionicons 
                        name="medal" 
                        size={10} 
                        color={theme.colors.interactive.accent} 
                        style={{ marginRight: 3 }}
                      />
                      <Text style={{
                        color: theme.colors.interactive.accent,
                        fontWeight: theme.fontConfig.fontWeight.medium,
                        fontSize: theme.fontSizes.xs,
                      }}>
                        3 Badges
                      </Text>
                    </View>
                  </View>
                  
                  {/* Parent Mode Switch */}
                  {user?.role === 'parent' && (
                    <View style={{
                      marginTop: theme.spacing.sm,
                    }}>
                      <Pressable
                        onPress={toggleParentMode}
                        style={{
                          backgroundColor: theme.colors.background.secondary,
                          paddingHorizontal: theme.spacing.sm,
                          paddingVertical: 4,
                          borderRadius: theme.borderRadius.full,
                          alignSelf: 'flex-start',
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
                    </View>
                  )}
                </View>

                {/* Profile switcher icon beside student details */}
                <Pressable 
                  onPress={handleProfileSwitch}
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: theme.colors.background.primary,
                    borderRadius: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: theme.spacing.sm,
                    borderWidth: 2,
                    borderColor: theme.colors.border.secondary,
                    ...theme.elevation.sm,
                  }}
                >
                  <Ionicons 
                    name="people" 
                    size={20} 
                    color={theme.colors.interactive.primary}
                    style={{ opacity: 1 }}
                  />
                </Pressable>
              </View>

              {/* Performance Metrics Button */}
              <Pressable
                onPress={() => navigation.navigate('Performance')}
                style={{
                  backgroundColor: theme.colors.background.secondary,
                  borderRadius: theme.borderRadius.lg,
                  padding: theme.spacing.md,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: theme.colors.border.primary,
                }}
              >
                <Ionicons name="analytics" size={16} color={theme.colors.icon.secondary} />
                <Text style={{
                  color: theme.colors.text.secondary,
                  fontSize: theme.fontSizes.sm,
                  fontWeight: theme.fontConfig.fontWeight.medium,
                  marginLeft: theme.spacing.xs,
                }}>
                  See Performance metrics
                </Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>

        {/* Academy Features Section */}
        <View style={{ marginBottom: theme.spacing.xl }}>
          <Animated.Text
            entering={FadeInDown.delay(200).springify()}
            style={{
              color: theme.colors.text.primary,
              fontSize: theme.fontSizes.lg,
              fontWeight: theme.fontConfig.fontWeight.semibold,
              marginBottom: theme.spacing.md,
              paddingHorizontal: theme.spacing.md,
            }}
          >
            Elitesgen Academy Features
          </Animated.Text>

          <View style={{ paddingHorizontal: theme.spacing.md }}>
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
                id: 'performance',
                title: 'Performance',
                icon: 'analytics',
                onPress: () => navigation.navigate('Performance'),
                backgroundColor: theme.isDark ? '#2d1b4e' : '#f3e8ff',
                iconColor: theme.colors.interactive.purple,
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
                title: 'Our Facilities',
                icon: 'location',
                onPress: () => navigation.navigate('OurFacilities'),
                backgroundColor: theme.isDark ? '#4a1e3d' : '#fce4ec',
                iconColor: theme.colors.status.error,
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
            spacing={theme.spacing.sm}
            containerPadding={theme.spacing.md * 2}
            variant="card"
            scrollEnabled={false}
          />
          </View>
        </View>

        {/* Quick Access Section */}
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
                borderWidth: 1,
                borderColor: theme.colors.border.primary,
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
                borderWidth: 1,
                borderColor: theme.colors.border.primary,
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
                borderWidth: 1,
                borderColor: theme.colors.border.primary,
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
        <View style={{ paddingHorizontal: theme.spacing.md, marginBottom: theme.spacing.xl }}>
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
        <View style={{ paddingHorizontal: theme.spacing.md, marginBottom: theme.spacing.xl }}>
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
          
          {preferencesMenuItems.map((item, index) => (
            <MenuItemComponent
              key={item.id}
              item={item}
              index={index}
            />
          ))}
        </View>

        {/* Support & Information Section */}
        <View style={{ paddingHorizontal: theme.spacing.md, marginBottom: theme.spacing.xl }}>
          <Animated.Text
            entering={FadeInDown.delay(700).springify()}
            style={{
              color: theme.colors.text.primary,
              fontSize: theme.fontSizes.lg,
              fontWeight: theme.fontConfig.fontWeight.semibold,
              marginBottom: theme.spacing.md,
            }}
          >
            Support & Information
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
            margin: theme.spacing.md,
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
            Refer a Friend, Earn ₦20,000!
          </Text>
          <Text style={{
            color: 'white',
            fontSize: theme.fontSizes.base,
            textAlign: 'center',
            opacity: 0.9,
            marginBottom: theme.spacing.lg,
          }}>
            Share your referral code and earn rewards when friends join Elitesgen Academy
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
            paddingHorizontal: theme.spacing.md,
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
            paddingHorizontal: theme.spacing.md,
            marginBottom: theme.spacing.md,
          }}
        >
          <Text style={{
            color: theme.colors.text.tertiary,
            textAlign: 'center',
            fontSize: theme.fontSizes.sm,
          }}>
            Elitesgen Academy Students App v1.0.0
          </Text>
        </Animated.View>
      </ScrollView>

      {/* Profile Switcher Bottom Sheet */}
      <ProfileSwitcherBottomSheet
        visible={showProfileSwitcher}
        onClose={() => setShowProfileSwitcher(false)}
        profiles={mockProfiles}
        onProfileSelect={handleProfileSelect}
        onCreateChildProfile={handleCreateChildProfile}
      />

      {/* Image Expansion Modal */}
      <Modal
        visible={showImageModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowImageModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.9)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          {/* Close button */}
          <Pressable
            onPress={() => setShowImageModal(false)}
            style={{
              position: 'absolute',
              top: insets.top + 20,
              right: 20,
              width: 44,
              height: 44,
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: 22,
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
            }}
          >
            <Ionicons name="close" size={24} color="white" />
          </Pressable>

          {selectedImage?.type === 'cover' ? (
            /* Expanded Cover Photo */
            <Image
              source={{ uri: selectedImage.uri }}
              style={{
                width: Dimensions.get('window').width - 40,
                height: (Dimensions.get('window').width - 40) * 0.6,
                borderRadius: theme.borderRadius.lg,
              }}
              resizeMode="cover"
            />
          ) : (
            /* Expanded Profile Picture */
            <View style={{
              width: 200,
              height: 200,
              backgroundColor: `${theme.colors.interactive.accent}15`,
              borderRadius: 100,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 4,
              borderColor: 'white',
            }}>
              <Text style={{
                color: theme.colors.interactive.accent,
                fontWeight: theme.fontConfig.fontWeight.bold,
                fontSize: 64,
              }}>
                {getInitials(user?.first_name + ' ' + user?.last_name || 'User')}
              </Text>
            </View>
          )}

          {/* Image info */}
          <View style={{
            position: 'absolute',
            bottom: insets.bottom + 40,
            left: 20,
            right: 20,
            alignItems: 'center',
          }}>
            <Text style={{
              color: 'white',
              fontSize: theme.fontSizes.lg,
              fontWeight: theme.fontConfig.fontWeight.semibold,
              textAlign: 'center',
            }}>
              {selectedImage?.type === 'cover' ? 'Cover Photo' : `${user?.first_name} ${user?.last_name}`}
            </Text>
            {selectedImage?.type === 'cover' && (
              <Text style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: theme.fontSizes.sm,
                textAlign: 'center',
                marginTop: 4,
              }}>
                Elitesgen Swimming Academy Students
              </Text>
            )}
          </View>

          {/* Tap to close hint */}
          <Pressable
            onPress={() => setShowImageModal(false)}
            style={{
              position: 'absolute',
              bottom: insets.bottom + 10,
              alignSelf: 'center',
            }}
          >
            <Text style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: theme.fontSizes.xs,
              textAlign: 'center',
            }}>
              Tap anywhere to close
            </Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};