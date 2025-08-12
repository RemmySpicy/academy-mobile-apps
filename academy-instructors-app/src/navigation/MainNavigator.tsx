import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator } from './TabNavigator';

export type MainStackParamList = {
  Tabs: undefined;
  // Add modal screens here if needed
};

const Stack = createNativeStackNavigator<MainStackParamList>();

/**
 * Main Navigator
 * 
 * Contains the tab navigator and any modal screens
 */
export const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Tabs" component={TabNavigator} />
    </Stack.Navigator>
  );
};