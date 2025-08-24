import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ContactScreen } from '../screens/ContactScreen';

export type ContactStackParamList = {
  ContactMain: undefined;
};

const Stack = createNativeStackNavigator<ContactStackParamList>();

export const ContactNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="ContactMain" 
        component={ContactScreen}
      />
    </Stack.Navigator>
  );
};