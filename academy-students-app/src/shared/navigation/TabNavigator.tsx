import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import { useTheme } from '@shared/theme/ThemeProvider';

import { HomeNavigator } from '@/features/home/navigation/HomeNavigator';
import { CoursesNavigator } from '@/features/courses/navigation/CoursesNavigator';
import { BookingsNavigator } from '@/features/bookings/navigation/BookingsNavigator';
import { ProgressNavigator } from '@/features/progress/navigation/ProgressNavigator';
import { ProfileNavigator } from '@/features/profile/navigation/ProfileNavigator';

export type TabParamList = {
  HomeTab: undefined;
  CoursesTab: undefined;
  BookingsTab: undefined;
  ProgressTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

interface TabIconProps {
  focused: boolean;
  color: string;
  size: number;
  iconName: keyof typeof Ionicons.glyphMap;
}

const TabIcon: React.FC<TabIconProps> = ({ focused, color, size, iconName }) => {
  const { theme } = useTheme();
  
  return (
    <View className="items-center justify-center">
      <Ionicons
        name={focused ? iconName : (`${iconName.replace('-outline', '')}-outline` as any)}
        size={size}
        color={color}
      />
    </View>
  );
};

/**
 * Tab Navigator for Student App
 * 
 * Features:
 * - Home dashboard
 * - Course catalog and management
 * - Booking management
 * - Progress tracking
 * - Profile and settings
 */
export const TabNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'HomeTab':
              iconName = 'home-outline';
              break;
            case 'CoursesTab':
              iconName = 'library-outline';
              break;
            case 'BookingsTab':
              iconName = 'calendar-outline';
              break;
            case 'ProgressTab':
              iconName = 'analytics-outline';
              break;
            case 'ProfileTab':
              iconName = 'person-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return (
            <TabIcon
              focused={focused}
              color={color}
              size={size}
              iconName={iconName}
            />
          );
        },
        tabBarActiveTintColor: theme.colors.interactive.primary,
        tabBarInactiveTintColor: theme.colors.text.tertiary,
        tabBarStyle: {
          backgroundColor: theme.colors.background.primary,
          borderTopColor: theme.colors.border.primary,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeNavigator}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="CoursesTab"
        component={CoursesNavigator}
        options={{
          tabBarLabel: 'Courses',
        }}
      />
      <Tab.Screen
        name="BookingsTab"
        component={BookingsNavigator}
        options={{
          tabBarLabel: 'Bookings',
        }}
      />
      <Tab.Screen
        name="ProgressTab"
        component={ProgressNavigator}
        options={{
          tabBarLabel: 'Progress',
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileNavigator}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};