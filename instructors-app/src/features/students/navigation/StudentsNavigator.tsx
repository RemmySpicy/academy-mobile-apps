import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StudentsScreen } from '../screens/StudentsScreen';
import { StudentDetailScreen } from '../screens/StudentDetailScreen';
import type { StudentsStackParamList } from './types';

const Stack = createNativeStackNavigator<StudentsStackParamList>();

/**
 * Students Feature Navigator
 * 
 * Handles navigation within the Students feature including:
 * - Student list and search
 * - Individual student details
 * - Progress tracking
 * - Attendance management
 */
export const StudentsNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 250,
      }}
    >
      <Stack.Screen
        name="StudentsList"
        component={StudentsScreen}
        options={{
          title: 'Students',
        }}
      />
      <Stack.Screen
        name="StudentDetail"
        component={StudentDetailScreen}
        options={{
          title: 'Student Details',
        }}
      />
    </Stack.Navigator>
  );
};