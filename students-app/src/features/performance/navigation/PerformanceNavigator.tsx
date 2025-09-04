import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, NavigationHeader } from '@academy/mobile-shared';
import { PerformanceScreen } from '../screens/PerformanceScreen';

export type PerformanceStackParamList = {
  PerformanceMain: undefined;
  PerformanceGoals: undefined;
  PerformanceHistory: undefined;
  PerformanceCompare: undefined;
  PerformanceExport: undefined;
};

const Stack = createNativeStackNavigator<PerformanceStackParamList>();

export const PerformanceNavigator: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        header: ({ navigation, route }) => (
          <NavigationHeader
            title={getScreenTitle(route.name as keyof PerformanceStackParamList)}
            onBackPress={() => navigation.goBack()}
            style={{ paddingTop: insets.top }}
          />
        ),
      }}
    >
      <Stack.Screen 
        name="PerformanceMain" 
        component={PerformanceScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

function getScreenTitle(routeName: keyof PerformanceStackParamList): string {
  const titleMap: Record<keyof PerformanceStackParamList, string> = {
    PerformanceMain: 'Performance',
    PerformanceGoals: 'Goals',
    PerformanceHistory: 'History',
    PerformanceCompare: 'Compare',
    PerformanceExport: 'Export',
  };
  
  return titleMap[routeName] || 'Performance';
}