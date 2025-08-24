import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HelpScreen } from '../screens/HelpScreen';

export type HelpStackParamList = {
  HelpMain: undefined;
};

const Stack = createNativeStackNavigator<HelpStackParamList>();

export const HelpNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="HelpMain" 
        component={HelpScreen}
      />
    </Stack.Navigator>
  );
};