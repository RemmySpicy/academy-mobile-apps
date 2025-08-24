import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TransactionsScreen } from '../screens/TransactionsScreen';

export type TransactionsStackParamList = {
  TransactionsMain: undefined;
};

const Stack = createNativeStackNavigator<TransactionsStackParamList>();

export const TransactionsNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="TransactionsMain" 
        component={TransactionsScreen}
      />
    </Stack.Navigator>
  );
};