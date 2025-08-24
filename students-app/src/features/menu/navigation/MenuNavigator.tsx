import React from 'react';
import { View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, Header } from '@academy/mobile-shared';
import { AppMenuScreen } from '../screens/AppMenuScreen';
import { EditProfileScreen } from '../../profile/screens/EditProfileScreen';
import { SettingsScreen } from '../../settings/screens/SettingsScreen';
import { PaymentMethodsScreen } from '../../payments/screens/PaymentMethodsScreen';

// Import screens from existing features
import { CoursesScreen } from '../../courses/screens/CoursesScreen';
import { AchievementsScreen } from '../../progress/screens/AchievementsScreen';

// Import new feature screens - using full-featured versions
import { ServicesScreen } from '../../services/screens/ServicesScreen';
import { StoreScreen } from '../../store/screens/StoreScreen';
import { TransactionsScreen } from '../../transactions/screens/TransactionsScreen';
import { ReferralsScreen } from '../../referrals/screens/ReferralsScreen';
import { ScheduleScreen } from '../../schedule/screens/ScheduleScreen';
import { LocationScreen } from '../../location/screens/LocationScreen';
import { ContactScreen } from '../../contact/screens/ContactScreen';
import { HelpScreen } from '../../help/screens/HelpScreen';

export type MenuStackParamList = {
  MenuMain: undefined;
  EditProfile: undefined;
  Settings: undefined;
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
  LocateUs: undefined;
  ContactUs: undefined;
  HelpAndSupport: undefined;
};


const Stack = createNativeStackNavigator<MenuStackParamList>();

export const MenuNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="MenuMain" 
        component={AppMenuScreen}
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
        name="PaymentMethods" 
        component={PaymentMethodsScreen}
      />
      
      {/* New feature screens accessible from menu */}
      <Stack.Screen 
        name="OurCourses" 
        component={CoursesScreen}
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
        component={AchievementsScreen}
      />
      <Stack.Screen 
        name="LocateUs" 
        component={LocationScreen}
      />
      <Stack.Screen 
        name="ContactUs" 
        component={ContactScreen}
      />
      <Stack.Screen 
        name="HelpAndSupport" 
        component={HelpScreen}
      />
    </Stack.Navigator>
  );
};