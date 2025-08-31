import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FacilityScreen } from '../screens/FacilityScreen';

export type FacilityStackParamList = {
  FacilityMain: undefined;
};

const Stack = createNativeStackNavigator<FacilityStackParamList>();

export const FacilityNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="FacilityMain" 
        component={FacilityScreen}
      />
    </Stack.Navigator>
  );
};