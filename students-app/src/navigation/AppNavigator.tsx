import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '@academy/mobile-shared';

import { TabNavigator } from './TabNavigator';
import { AuthNavigator } from '../features/auth/navigation/AuthNavigator';

export type AppStackParamList = {
  Auth: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppNavigator: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={TabNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};