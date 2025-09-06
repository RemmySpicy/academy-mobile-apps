import React from 'react';
import { View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, NavigationHeader } from '@academy/mobile-shared';
import { AppMenuScreen } from '../screens/AppMenuScreen';
import { EditProfileScreen } from '../../profile/screens/EditProfileScreen';
import { SettingsScreen } from '../../settings/screens/SettingsScreen';
import { AppPreferencesScreen } from '../../settings/screens/AppPreferencesScreen';
import { PaymentMethodsScreen } from '../../payments/screens/PaymentMethodsScreen';

// Import screens from existing features
import { CoursesNavigator } from '../../courses/navigation/CoursesNavigator';
import { AchievementsScreen } from '../../progress/screens/AchievementsScreen';

// Import new feature screens - using full-featured versions
import { ServicesScreen } from '../../services/screens/ServicesScreen';
import { StoreScreen } from '../../store/screens/StoreScreen';
import { TransactionsScreen } from '../../transactions/screens/TransactionsScreen';
import { ReferralsScreen } from '../../referrals/screens/ReferralsScreen';
import { ScheduleScreen } from '../../schedule/screens/ScheduleScreen';
import { FacilityScreen } from '../../facilities';
import { HelpScreen } from '../../help/screens/HelpScreen';

// Import settings screens
import { NotificationSettingsScreen } from '../../settings/screens/NotificationSettingsScreen';
import { PrivacySettingsScreen } from '../../settings/screens/PrivacySettingsScreen';
import { AboutScreen } from '../../settings/screens/AboutScreen';
import { ProgressReportScreen } from '../../progress/screens/ProgressReportScreen';

// Import performance feature
import { PerformanceNavigator } from '../../performance/navigation/PerformanceNavigator';

export type MenuStackParamList = {
  MenuMain: undefined;
  EditProfile: undefined;
  Settings: undefined;
  AppPreferences: undefined;
  PaymentMethods: undefined;
  NotificationSettings: undefined;
  PrivacySettings: undefined;
  HelpSupport: undefined;
  About: undefined;
  
  // New feature screens accessible from menu
  OurCourses: undefined;
  OurServices: undefined;
  Achievements: undefined;
  Store: undefined;
  Transactions: undefined;
  Referrals: undefined;
  MySchedule: undefined;
  ProgressReport: undefined;
  Performance: undefined;
  OurFacilities: undefined;
  HelpAndSupport: undefined;
};

/**
 * Get screen title for header
 */
function getScreenTitle(routeName: keyof MenuStackParamList): string {
  const titleMap: Record<keyof MenuStackParamList, string> = {
    MenuMain: 'Menu',
    EditProfile: 'Edit Profile',
    Settings: 'Settings',
    AppPreferences: 'App Preferences',
    PaymentMethods: 'Payment Methods',
    NotificationSettings: 'Notifications',
    PrivacySettings: 'Privacy',
    HelpSupport: 'Help & Support',
    About: 'About',
    OurCourses: 'Our Courses',
    OurServices: 'Our Services',
    Achievements: 'Achievements',
    Store: 'Store',
    Transactions: 'Transactions',
    Referrals: 'Referrals',
    MySchedule: 'My Schedule',
    ProgressReport: 'Progress Report',
    Performance: 'Performance',
    OurFacilities: 'Our Facilities',
    HelpAndSupport: 'Help & Support',
  };
  
  return titleMap[routeName] || 'Menu';
}

const Stack = createNativeStackNavigator<MenuStackParamList>();

export const MenuNavigator: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        header: ({ navigation, route }) => (
          <NavigationHeader
            title={getScreenTitle(route.name as keyof MenuStackParamList)}
            onBackPress={() => navigation.goBack()}
            style={{ paddingTop: insets.top }}
          />
        ),
      }}
    >
      <Stack.Screen 
        name="MenuMain" 
        component={AppMenuScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
      />
      <Stack.Screen 
        name="AppPreferences" 
        component={AppPreferencesScreen}
      />
      <Stack.Screen 
        name="PaymentMethods" 
        component={PaymentMethodsScreen}
      />
      <Stack.Screen 
        name="NotificationSettings" 
        component={NotificationSettingsScreen}
      />
      <Stack.Screen 
        name="PrivacySettings" 
        component={PrivacySettingsScreen}
      />
      <Stack.Screen 
        name="About" 
        component={AboutScreen}
      />
      
      {/* New feature screens accessible from menu */}
      <Stack.Screen 
        name="OurCourses" 
        component={CoursesNavigator}
      />
      <Stack.Screen 
        name="OurServices" 
        component={ServicesScreen}
      />
      <Stack.Screen 
        name="Achievements" 
        component={AchievementsScreen}
      />
      <Stack.Screen 
        name="Store" 
        component={StoreScreen}
      />
      <Stack.Screen 
        name="Transactions" 
        component={TransactionsScreen}
      />
      <Stack.Screen 
        name="Referrals" 
        component={ReferralsScreen}
      />
      <Stack.Screen 
        name="MySchedule" 
        component={ScheduleScreen}
      />
      <Stack.Screen 
        name="ProgressReport" 
        component={ProgressReportScreen}
      />
      <Stack.Screen 
        name="Performance" 
        component={PerformanceNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="OurFacilities" 
        component={FacilityScreen}
      />
      <Stack.Screen 
        name="HelpAndSupport" 
        component={HelpScreen}
      />
    </Stack.Navigator>
  );
};