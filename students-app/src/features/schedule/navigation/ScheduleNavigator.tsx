import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScheduleScreen } from '../screens/ScheduleScreen';

export type ScheduleStackParamList = {
  ScheduleMain: undefined;
};

const Stack = createNativeStackNavigator<ScheduleStackParamList>();

export const ScheduleNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="ScheduleMain" 
        component={ScheduleScreen}
      />
    </Stack.Navigator>
  );
};