import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AttendanceScreen } from '../screens/AttendanceScreen';
import { AttendanceMarkingScreen } from '../screens/AttendanceMarkingScreen';

interface Student {
  id: string;
  name: string;
  avatar: string;
  status: 'present' | 'absent' | 'late' | 'not_marked';
  profileImage?: string;
  parentName?: string;
  parentPhone?: string;
  notes?: string;
}

interface AttendanceClass {
  id: string;
  name: string;
  level: string;
  time: string;
  date: string;
  location: string;
  studentsCount: number;
  attendanceMarked: boolean;
  students: Student[];
  instructorId: string;
}

export type AttendanceStackParamList = {
  AttendanceMain: undefined;
  AttendanceMarking: {
    classId: string;
    classData: AttendanceClass;
  };
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
      <Stack.Screen
        name="AttendanceMarking"
        component={AttendanceMarkingScreen}
        options={{
          title: 'Mark Attendance',
        }}
      />
    </Stack.Navigator>
  );
};