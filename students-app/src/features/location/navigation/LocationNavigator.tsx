import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LocationScreen } from '../screens/LocationScreen';

export type LocationStackParamList = {
  LocationMain: undefined;
};

const Stack = createNativeStackNavigator<LocationStackParamList>();

export const LocationNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="LocationMain" 
        component={LocationScreen}
      />
    </Stack.Navigator>
  );
};