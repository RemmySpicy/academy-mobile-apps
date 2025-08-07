import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';

export type HomeStackParamList = {
  HomeMain: undefined;
  CourseDetail: { courseId: string };
  BookingDetail: { bookingId: string };
  QuickBooking: undefined;
  Notifications: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="HomeMain" 
        component={HomeScreen}
      />
      {/* Additional screens will be added here */}
    </Stack.Navigator>
  );
};