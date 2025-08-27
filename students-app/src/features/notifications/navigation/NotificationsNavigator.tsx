import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NotificationsScreen from '../screens/NotificationsScreen';

export type NotificationsStackParamList = {
  NotificationsList: undefined;
  // Add additional notification screens here if needed
  // NotificationDetail: { notificationId: string };
};

const Stack = createNativeStackNavigator<NotificationsStackParamList>();

/**
 * Notifications Navigator for Students
 * 
 * Handles navigation within the notifications feature
 */
export const NotificationsNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="NotificationsList" 
        component={NotificationsScreen}
      />
    </Stack.Navigator>
  );
};