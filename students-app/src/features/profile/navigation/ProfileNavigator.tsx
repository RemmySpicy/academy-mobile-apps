import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MenuScreen } from '../screens/MenuScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { PaymentMethodsScreen } from '../screens/PaymentMethodsScreen';

export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
  Settings: undefined;
  PaymentMethods: undefined;
  NotificationSettings: undefined;
  PrivacySettings: undefined;
  HelpSupport: undefined;
  About: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="ProfileMain" 
        component={MenuScreen}
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
    </Stack.Navigator>
  );
};