import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@academy/mobile-shared';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import { HomeNavigator } from '../features/home/navigation/HomeNavigator';
import { StudentsNavigator } from '../features/students/navigation/StudentsNavigator';
import { AttendanceNavigator } from '../features/attendance/navigation/AttendanceNavigator';
import { PerformanceNavigator } from '../features/performance/navigation/PerformanceNavigator';
import { ClassroomNavigator } from '../features/classroom/navigation/ClassroomNavigator';

export type TabParamList = {
  HomeTab: undefined;
  StudentsTab: undefined;
  AttendanceTab: undefined;
  PerformanceTab: undefined;
  ClassroomTab: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

interface AnimatedTabIconProps {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  size: number;
  focused: boolean;
}

/**
 * Animated Tab Icon with Academy styling
 */
const AnimatedTabIcon: React.FC<AnimatedTabIconProps> = ({ name, color, size, focused }) => {
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
 * Tab Navigator for Instructor App
 * 
 * Features:
 * - Home dashboard with InstructorDashboard
 * - Student management with enhanced StudentCards
 * - Attendance tracking
 * - Performance analytics with charts
 * - Classroom management
 */
export const TabNavigator: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const tabBarHeight = Platform.OS === 'ios' ? 85 + insets.bottom : 70;

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: tabBarHeight,
          backgroundColor: theme.colors.background.primary,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border.primary,
          elevation: 20,
          shadowColor: theme.colors.shadow.color,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: theme.colors.shadow.opacity,
          shadowRadius: theme.borderRadius.lg,
          paddingTop: theme.spacing.xs,
          paddingBottom: Platform.OS === 'ios' ? insets.bottom + theme.spacing.xs : theme.spacing.xs,
        },
        tabBarActiveTintColor: theme.colors.interactive.primary,
        tabBarInactiveTintColor: theme.colors.text.tertiary,
        tabBarLabelStyle: {
          fontSize: theme.typography.fontSize.xs,
          fontWeight: theme.fontConfig.fontWeight.medium,
          marginTop: theme.spacing.xs,
        },
        tabBarItemStyle: {
          paddingVertical: theme.spacing.xs,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'HomeTab':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'StudentsTab':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'AttendanceTab':
              iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
              break;
            case 'PerformanceTab':
              iconName = focused ? 'bar-chart' : 'bar-chart-outline';
              break;
            case 'ClassroomTab':
              iconName = focused ? 'school' : 'school-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return (
            <AnimatedTabIcon
              name={iconName}
              color={color}
              size={size}
              focused={focused}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeNavigator}
        options={{
          tabBarLabel: 'Dashboard',
        }}
      />
      
      <Tab.Screen
        name="StudentsTab"
        component={StudentsNavigator}
        options={{
          tabBarLabel: 'Students',
        }}
      />
      
      <Tab.Screen
        name="AttendanceTab"
        component={AttendanceNavigator}
        options={{
          tabBarLabel: 'Attendance',
        }}
      />
      
      <Tab.Screen
        name="PerformanceTab"
        component={PerformanceNavigator}
        options={{
          tabBarLabel: 'Performance',
        }}
      />
      
      <Tab.Screen
        name="ClassroomTab"
        component={ClassroomNavigator}
        options={{
          tabBarLabel: 'Classroom',
        }}
      />
    </Tab.Navigator>
  );
};