import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProgressScreen } from '../screens/ProgressScreen';
import { ProgressDetailScreen } from '../screens/ProgressDetailScreen';
import { AchievementsScreen } from '../screens/AchievementsScreen';
import { CourseCurriculumScreen } from '../screens/CourseCurriculumScreen';

export type ProgressStackParamList = {
  ProgressMain: undefined;
  ProgressDetail: { courseId: string; level?: string };
  CourseCurriculum: { courseId: string };
  Achievements: undefined;
  ProgressHistory: undefined;
  GoalSetting: undefined;
};

const Stack = createNativeStackNavigator<ProgressStackParamList>();

export const ProgressNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="ProgressMain" 
        component={ProgressScreen}
      />
      <Stack.Screen 
        name="ProgressDetail" 
        component={ProgressDetailScreen}
      />
      <Stack.Screen 
        name="CourseCurriculum" 
        component={CourseCurriculumScreen}
      />
      <Stack.Screen 
        name="Achievements" 
        component={AchievementsScreen}
      />
    </Stack.Navigator>
  );
};