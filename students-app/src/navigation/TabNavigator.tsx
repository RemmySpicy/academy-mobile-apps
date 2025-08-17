import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@academy/mobile-shared';

import { HomeNavigator } from '../features/home/navigation/HomeNavigator';
import { CoursesNavigator } from '../features/courses/navigation/CoursesNavigator';
import { BookingsNavigator } from '../features/bookings/navigation/BookingsNavigator';
import { ProgressNavigator } from '../features/progress/navigation/ProgressNavigator';
import { ProfileNavigator } from '../features/profile/navigation/ProfileNavigator';

// Development-only imports
import { DesignSystemShowcase, FormExamplesScreen } from '@academy/mobile-shared';

export type TabParamList = {
  HomeTab: undefined;
  CoursesTab: undefined;
  BookingsTab: undefined;
  ProgressTab: undefined;
  ProfileTab: undefined;
  DesignSystemTab?: undefined; // Development only
  FormsTab?: undefined; // Development only
};

const Tab = createBottomTabNavigator<TabParamList>();

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
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'CoursesTab':
              iconName = focused ? 'book' : 'book-outline';
              break;
            case 'BookingsTab':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'ProgressTab':
              iconName = focused ? 'trophy' : 'trophy-outline';
              break;
            case 'ProfileTab':
              iconName = focused ? 'person' : 'person-outline';
              break;
            case 'DesignSystemTab':
              iconName = focused ? 'color-palette' : 'color-palette-outline';
              break;
            case 'FormsTab':
              iconName = focused ? 'document-text' : 'document-text-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.interactive.primary,
        tabBarInactiveTintColor: theme.colors.text.tertiary,
        tabBarStyle: {
          backgroundColor: theme.colors.background.primary,
          borderTopColor: theme.colors.border.primary,
          paddingTop: theme.spacing.xs,
          paddingBottom: theme.spacing.xs,
        },
        tabBarLabelStyle: {
          fontSize: theme.fontSizes.sm,
          fontFamily: theme.fontConfig.fontFamily.primary,
        },
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeNavigator}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="CoursesTab" 
        component={CoursesNavigator}
        options={{ tabBarLabel: 'Courses' }}
      />
      <Tab.Screen 
        name="BookingsTab" 
        component={BookingsNavigator}
        options={{ tabBarLabel: 'Bookings' }}
      />
      <Tab.Screen 
        name="ProgressTab" 
        component={ProgressNavigator}
        options={{ tabBarLabel: 'Progress' }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileNavigator}
        options={{ tabBarLabel: 'Profile' }}
      />

      {/* Development-only Design System tabs */}
      {__DEV__ && (
        <>
          <Tab.Screen
            name="DesignSystemTab"
            component={DesignSystemShowcase}
            options={{
              tabBarLabel: 'Design',
            }}
          />
          
          <Tab.Screen
            name="FormsTab"
            component={FormExamplesScreen}
            options={{
              tabBarLabel: 'Forms',
            }}
          />
        </>
      )}
    </Tab.Navigator>
  );
};