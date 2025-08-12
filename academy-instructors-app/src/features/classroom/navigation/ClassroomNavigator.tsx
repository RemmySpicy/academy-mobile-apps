import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ClassroomScreen } from '../screens/ClassroomScreen';
export type ClassroomStackParamList = {
  ClassroomMain: undefined;
};

const Stack = createNativeStackNavigator<ClassroomStackParamList>();

/**
 * Classroom Feature Navigator
 * 
 * Main hub for instructors to manage their classes:
 * - Class overview and management
 * - Active class sessions
 * - Quick grading and notes
 * - Class progress tracking
 */
export const ClassroomNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 250,
      }}
    >
      <Stack.Screen
        name="ClassroomMain"
        component={ClassroomScreen}
        options={{
          title: 'Classroom',
        }}
      />
    </Stack.Navigator>
  );
};