import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaymentMethodsScreen } from '../screens/PaymentMethodsScreen';

export type PaymentsStackParamList = {
  PaymentMethods: undefined;
};

const Stack = createNativeStackNavigator<PaymentsStackParamList>();

export const PaymentsNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="PaymentMethods" 
        component={PaymentMethodsScreen}
      />
    </Stack.Navigator>
  );
};