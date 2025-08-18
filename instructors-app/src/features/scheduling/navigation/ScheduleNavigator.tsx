import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme, createThemedStyles } from '@academy/mobile-shared';
export type ScheduleStackParamList = {
  ScheduleMain: undefined;
};

const Stack = createNativeStackNavigator<ScheduleStackParamList>();

// Placeholder screen - will be implemented later
const ScheduleScreen = () => {
  const { theme } = useTheme();
  const styles = useThemedStyles();
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Schedule Management
        </Text>
        <Text style={styles.description}>
          Coming soon: Full scheduling system with calendar integration
        </Text>
        <View style={styles.featureList}>
          <Text style={styles.featureItem}>• Class scheduling</Text>
          <Text style={styles.featureItem}>• Calendar integration</Text>
          <Text style={styles.featureItem}>• Availability management</Text>
          <Text style={styles.featureItem}>• Schedule conflicts detection</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

/**
 * Schedule Feature Navigator
 * 
 * TODO: Implement scheduling system with:
 * - Calendar view of classes
 * - Schedule creation and editing
 * - Availability management
 * - Conflict detection and resolution
 */
export const ScheduleNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="Calendar"
        component={ScheduleScreen}
        options={{
          title: 'Schedule',
        }}
      />
    </Stack.Navigator>
  );
};

const useThemedStyles = createThemedStyles((theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.lg,
    },
    title: {
      fontSize: theme.fontSizes['2xl'],
      fontWeight: theme.fontConfig.fontWeight.bold,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.md,
    },
    description: {
      fontSize: theme.fontSizes.base,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
    featureList: {
      alignItems: 'flex-start',
    },
    featureItem: {
      fontSize: theme.fontSizes.base,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.sm,
    },
  })
);