import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BookingsScreen } from '../screens/BookingsScreen';
import { BookingDetailScreen } from '../screens/BookingDetailScreen';
import { CreateBookingScreen } from '../screens/CreateBookingScreen';

export type BookingsStackParamList = {
  BookingsList: undefined;
  BookingDetail: { bookingId: string };
  CreateBooking: { sessionId?: string };
  BookingConfirmation: { bookingId: string };
  RescheduleBooking: { bookingId: string };
};

const Stack = createNativeStackNavigator<BookingsStackParamList>();

export const BookingsNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="BookingsList" 
        component={BookingsScreen}
      />
      <Stack.Screen 
        name="BookingDetail" 
        component={BookingDetailScreen}
      />
      <Stack.Screen 
        name="CreateBooking" 
        component={CreateBookingScreen}
      />
    </Stack.Navigator>
  );
};