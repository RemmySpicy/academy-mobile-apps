import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CoursesScreen } from '../screens/CoursesScreen';
import { CourseDetailScreen } from '../screens/CourseDetailScreen';

export type CoursesStackParamList = {
  CoursesList: undefined;
  CourseDetail: { courseId: string };
  CourseSearch: undefined;
  CourseCategories: undefined;
};

const Stack = createNativeStackNavigator<CoursesStackParamList>();

export const CoursesNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="CoursesList" 
        component={CoursesScreen}
        options={{
          headerShown: false, // Let MenuNavigator handle the header
        }}
      />
      <Stack.Screen 
        name="CourseDetail" 
        component={CourseDetailScreen}
        options={{
          headerShown: false, // CourseDetail has its own custom header
        }}
      />
    </Stack.Navigator>
  );
};