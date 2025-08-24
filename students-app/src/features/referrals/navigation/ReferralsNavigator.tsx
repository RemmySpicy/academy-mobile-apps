import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ReferralsScreen } from '../screens/ReferralsScreen';

export type ReferralsStackParamList = {
  ReferralsMain: undefined;
};

const Stack = createNativeStackNavigator<ReferralsStackParamList>();

export const ReferralsNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="ReferralsMain" 
        component={ReferralsScreen}
      />
    </Stack.Navigator>
  );
};