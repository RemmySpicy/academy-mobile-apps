import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ServicesScreen } from '../screens/ServicesScreen';

export type ServicesStackParamList = {
  ServicesMain: undefined;
};

const Stack = createNativeStackNavigator<ServicesStackParamList>();

export const ServicesNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="ServicesMain" 
        component={ServicesScreen}
      />
    </Stack.Navigator>
  );
};