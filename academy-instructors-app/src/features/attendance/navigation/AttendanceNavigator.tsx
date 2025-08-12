import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AttendanceScreen } from '../screens/AttendanceScreen';
export type AttendanceStackParamList = {
  AttendanceMain: undefined;
};

const Stack = createNativeStackNavigator<AttendanceStackParamList>();

/**
 * Attendance Feature Navigator
 * 
 * Handles attendance management:
 * - Mark daily attendance
 * - View attendance history
 * - Generate attendance reports
 * - Track attendance patterns
 */
export const AttendanceNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 250,
      }}
    >
      <Stack.Screen
        name="AttendanceMain"
        component={AttendanceScreen}
        options={{
          title: 'Attendance',
        }}
      />
    </Stack.Navigator>
  );
};