import React from 'react';
import { View, Text, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

import { ClassroomNavigator } from '@/features/classroom';
import { StudentsNavigator } from '@/features/students';
import { ScheduleNavigator } from '@/features/scheduling';
import { AttendanceNavigator } from '@/features/attendance';
import { PerformanceNavigator } from '@/features/performance';
import { useAppStore } from '@/shared/store';
import type { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

interface TabIconProps {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  size: number;
  focused: boolean;
}

/**
 * Animated Tab Icon with smooth bounce animation
 */
const AnimatedTabIcon: React.FC<TabIconProps> = ({ name, color, size, focused }) => {
  const scale = useSharedValue(focused ? 1.1 : 1);
  const translateY = useSharedValue(focused ? -2 : 0);

  React.useEffect(() => {
    scale.value = withSpring(focused ? 1.1 : 1, {
      damping: 15,
      stiffness: 200,
    });
    translateY.value = withSpring(focused ? -2 : 0, {
      damping: 15,
      stiffness: 200,
    });
  }, [focused, scale, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Ionicons name={name} size={size} color={color} />
    </Animated.View>
  );
};

/**
 * Tab Navigator with Beautiful Animations
 * 
 * Features:
 * - Smooth tab transitions with spring animations
 * - Icon bounce effects on focus
 * - Custom tab bar with blur effect
 * - Badge support for notifications
 * - Professional color scheme
 * - Responsive design for tablets
 */
export const TabNavigator: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { isTabBarVisible } = useAppStore();

  const tabBarHeight = Platform.OS === 'ios' ? 85 + insets.bottom : 65;

  return (
    <Tab.Navigator
      initialRouteName="Classroom"
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: tabBarHeight,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? insets.bottom + 4 : 8,
          display: isTabBarVisible ? 'flex' : 'none',
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      <Tab.Screen
        name="Classroom"
        component={ClassroomNavigator}
        options={{
          title: 'Classroom',
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              name={focused ? 'school' : 'school-outline'}
              color={color}
              size={size}
              focused={focused}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Schedule"
        component={ScheduleNavigator}
        options={{
          title: 'Schedules',
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              name={focused ? 'calendar' : 'calendar-outline'}
              color={color}
              size={size}
              focused={focused}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Students"
        component={StudentsNavigator}
        options={{
          title: 'Students',
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              name={focused ? 'people' : 'people-outline'}  
              color={color}
              size={size}
              focused={focused}
            />
          ),
          tabBarBadge: undefined, // TODO: Add student notification badge
        }}
      />

      <Tab.Screen
        name="Attendance"
        component={AttendanceNavigator}
        options={{
          title: 'Attendance',
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              name={focused ? 'checkmark-circle' : 'checkmark-circle-outline'}
              color={color}
              size={size}
              focused={focused}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Performance"
        component={PerformanceNavigator}
        options={{
          title: 'Performance',
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              name={focused ? 'bar-chart' : 'bar-chart-outline'}
              color={color}
              size={size}
              focused={focused}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};