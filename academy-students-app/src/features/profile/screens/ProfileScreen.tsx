import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInRight,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useAuthStore } from '@/shared/store';

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
        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-3"
      >
        <View className="flex-row items-center">
          <View
            className="w-10 h-10 rounded-full items-center justify-center mr-4"
            style={{ backgroundColor: `${color}15` }}
          >
            <Ionicons name={icon} size={20} color={color} />
          </View>
          
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text className="text-gray-900 font-medium text-base flex-1">
                {title}
              </Text>
              {badge && (
                <View className="bg-red-500 rounded-full px-2 py-1 mr-2">
                  <Text className="text-white text-xs font-bold">{badge}</Text>
                </View>
              )}
            </View>
            {subtitle && (
              <Text className="text-gray-500 text-sm mt-1">{subtitle}</Text>
            )}
          </View>
          
          {showChevron && (
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
};

/**
 * Profile Screen - User Profile Management
 * 
 * Features:
 * - User profile overview
 * - Account settings and preferences
 * - Payment method management
 * - Notification settings
 * - Help and support
 * - Parent/Student role switching
 * - Privacy and security settings
 */
export const ProfileScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
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
          color: '#3B82F6',
          onPress: () => console.log('Navigate to edit profile'),
        },
        {
          id: 'payment-methods',
          title: 'Payment Methods',
          subtitle: 'Manage cards and billing',
          icon: 'card-outline',
          color: '#10B981',
          onPress: () => console.log('Navigate to payment methods'),
        },
        ...(user?.role === 'parent' || isParentMode ? [{
          id: 'manage-children',
          title: 'Manage Children',
          subtitle: 'Add or edit child profiles',
          icon: 'people-outline' as const,
          color: '#8B5CF6',
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
          color: '#F59E0B',
          onPress: () => console.log('Navigate to notifications'),
          badge: '3',
        },
        {
          id: 'privacy',
          title: 'Privacy & Security',
          subtitle: 'Control your data and security',
          icon: 'shield-outline',
          color: '#EF4444',
          onPress: () => console.log('Navigate to privacy'),
        },
        {
          id: 'settings',
          title: 'App Settings',
          subtitle: 'Language, theme, and more',
          icon: 'settings-outline',
          color: '#6B7280',
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
          color: '#8B5CF6',
          onPress: () => console.log('Navigate to help'),
        },
        {
          id: 'about',
          title: 'About Academy',
          subtitle: 'App version and information',
          icon: 'information-circle-outline',
          color: '#6B7280',
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

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: 100, // Space for tab bar
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          className="px-6 mb-8"
        >
          <View className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <View className="flex-row items-center mb-4">
              <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mr-4">
                <Text className="text-blue-600 font-bold text-xl">
                  {getInitials(user?.firstName + ' ' + user?.lastName || 'User')}
                </Text>
              </View>
              
              <View className="flex-1">
                <Text className="text-gray-900 font-bold text-xl">
                  {user?.firstName} {user?.lastName}
                </Text>
                <Text className="text-gray-600 text-base mt-1">
                  {user?.email}
                </Text>
                <View className="flex-row items-center mt-2">
                  <View className="bg-blue-50 px-3 py-1 rounded-full">
                    <Text className="text-blue-600 font-medium text-sm">
                      {isParentMode ? 'Parent' : 'Student'}
                    </Text>
                  </View>
                  {user?.role === 'parent' && (
                    <TouchableOpacity
                      onPress={toggleParentMode}
                      className="ml-2 bg-gray-100 px-3 py-1 rounded-full"
                    >
                      <Text className="text-gray-600 font-medium text-sm">
                        Switch to {isParentMode ? 'Student' : 'Parent'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              
              <TouchableOpacity className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
                <Ionicons name="pencil" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            {/* Quick Stats */}
            <View className="flex-row justify-between border-t border-gray-100 pt-4">
              <View className="items-center">
                <Text className="text-gray-900 font-bold text-lg">2</Text>
                <Text className="text-gray-500 text-sm">Active Courses</Text>
              </View>
              <View className="items-center">
                <Text className="text-gray-900 font-bold text-lg">15</Text>
                <Text className="text-gray-500 text-sm">Sessions</Text>
              </View>
              <View className="items-center">
                <Text className="text-gray-900 font-bold text-lg">3</Text>
                <Text className="text-gray-500 text-sm">Achievements</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <View key={section.title} className="px-6 mb-8">
            <Animated.Text
              entering={FadeInDown.delay((sectionIndex + 2) * 100).springify()}
              className="text-gray-900 text-lg font-semibold mb-4"
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
          className="px-6 mb-8"
        >
          <Pressable
            onPress={handleLogout}
            className="bg-red-50 rounded-xl p-4 border border-red-200"
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
              <Text className="text-red-600 font-medium text-base ml-3">
                Sign Out
              </Text>
            </View>
          </Pressable>
        </Animated.View>

        {/* App Version */}
        <Animated.View
          entering={FadeInDown.delay(600).springify()}
          className="px-6 mb-4"
        >
          <Text className="text-gray-400 text-center text-sm">
            Academy Students App v1.0.0
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
};