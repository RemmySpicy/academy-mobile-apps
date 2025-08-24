import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StoreScreen } from '../screens/StoreScreen';

export type StoreStackParamList = {
  StoreMain: undefined;
};

const Stack = createNativeStackNavigator<StoreStackParamList>();

export const StoreNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="StoreMain" 
        component={StoreScreen}
      />
    </Stack.Navigator>
  );
};