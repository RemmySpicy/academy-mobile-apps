import React from 'react';
import { View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, NavigationHeader } from '@academy/mobile-shared';
import { AppMenuScreen } from '../screens/AppMenuScreen';
import { MenuStackParamList } from '../types';

// Import placeholder screens - these would be implemented later
const EditProfileScreen = () => {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background.primary }}>
      <Text style={{ color: theme.colors.text.primary }}>Edit Profile Screen</Text>
    </View>
  );
};

const SettingsScreen = () => {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background.primary }}>
      <Text style={{ color: theme.colors.text.primary }}>Settings Screen</Text>
    </View>
  );
};

const PaymentMethodsScreen = () => {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background.primary }}>
      <Text style={{ color: theme.colors.text.primary }}>Payment Methods Screen</Text>
    </View>
  );
};

const NotificationSettingsScreen = () => {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background.primary }}>
      <Text style={{ color: theme.colors.text.primary }}>Notification Settings Screen</Text>
    </View>
  );
};

const PrivacySettingsScreen = () => {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background.primary }}>
      <Text style={{ color: theme.colors.text.primary }}>Privacy Settings Screen</Text>
    </View>
  );
};

const AboutScreen = () => {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background.primary }}>
      <Text style={{ color: theme.colors.text.primary }}>About Screen</Text>
    </View>
  );
};

const HelpAndSupportScreen = () => {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background.primary }}>
      <Text style={{ color: theme.colors.text.primary }}>Help & Support Screen</Text>
    </View>
  );
};

// Instructor-specific screens
const ClassManagementScreen = () => {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background.primary }}>
      <Text style={{ color: theme.colors.text.primary }}>Class Management Screen</Text>
    </View>
  );
};

const StudentReportsScreen = () => {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background.primary }}>
      <Text style={{ color: theme.colors.text.primary }}>Student Reports Screen</Text>
    </View>
  );
};

const AttendanceTrackerScreen = () => {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background.primary }}>
      <Text style={{ color: theme.colors.text.primary }}>Attendance Tracker Screen</Text>
    </View>
  );
};

const GradeBookScreen = () => {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background.primary }}>
      <Text style={{ color: theme.colors.text.primary }}>Grade Book Screen</Text>
    </View>
  );
};

const LessonPlansScreen = () => {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background.primary }}>
      <Text style={{ color: theme.colors.text.primary }}>Lesson Plans Screen</Text>
    </View>
  );
};

const CommunicationScreen = () => {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background.primary }}>
      <Text style={{ color: theme.colors.text.primary }}>Communication Screen</Text>
    </View>
  );
};

const MyScheduleScreen = () => {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background.primary }}>
      <Text style={{ color: theme.colors.text.primary }}>My Schedule Screen</Text>
    </View>
  );
};

const AnalyticsScreen = () => {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background.primary }}>
      <Text style={{ color: theme.colors.text.primary }}>Analytics Screen</Text>
    </View>
  );
};

const ResourcesScreen = () => {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background.primary }}>
      <Text style={{ color: theme.colors.text.primary }}>Resources Screen</Text>
    </View>
  );
};

const ProfessionalDevelopmentScreen = () => {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background.primary }}>
      <Text style={{ color: theme.colors.text.primary }}>Professional Development Screen</Text>
    </View>
  );
};


/**
 * Get screen title for header
 */
function getScreenTitle(routeName: keyof MenuStackParamList): string {
  const titleMap: Record<keyof MenuStackParamList, string> = {
    MenuMain: 'Menu',
    EditProfile: 'Edit Profile',
    Settings: 'Settings',
    PaymentMethods: 'Payment Methods',
    NotificationSettings: 'Notifications',
    PrivacySettings: 'Privacy',
    About: 'About',
    HelpAndSupport: 'Help & Support',
    ClassManagement: 'Class Management',
    StudentReports: 'Student Reports',
    AttendanceTracker: 'Attendance Tracker',
    GradeBook: 'Grade Book',
    LessonPlans: 'Lesson Plans',
    Communication: 'Communication',
    MySchedule: 'My Schedule',
    Analytics: 'Analytics',
    Resources: 'Resources',
    ProfessionalDevelopment: 'Professional Development',
  };
  
  return titleMap[routeName] || 'Menu';
}

const Stack = createNativeStackNavigator<MenuStackParamList>();

export const MenuNavigator: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        header: ({ navigation, route }) => (
          <NavigationHeader
            title={getScreenTitle(route.name as keyof MenuStackParamList)}
            onBackPress={() => navigation.goBack()}
            style={{ paddingTop: insets.top }}
          />
        ),
      }}
    >
      <Stack.Screen 
        name="MenuMain" 
        component={AppMenuScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
      />
      <Stack.Screen 
        name="PaymentMethods" 
        component={PaymentMethodsScreen}
      />
      <Stack.Screen 
        name="NotificationSettings" 
        component={NotificationSettingsScreen}
      />
      <Stack.Screen 
        name="PrivacySettings" 
        component={PrivacySettingsScreen}
      />
      <Stack.Screen 
        name="About" 
        component={AboutScreen}
      />
      <Stack.Screen 
        name="HelpAndSupport" 
        component={HelpAndSupportScreen}
      />
      
      {/* Instructor-specific screens */}
      <Stack.Screen 
        name="ClassManagement" 
        component={ClassManagementScreen}
      />
      <Stack.Screen 
        name="StudentReports" 
        component={StudentReportsScreen}
      />
      <Stack.Screen 
        name="AttendanceTracker" 
        component={AttendanceTrackerScreen}
      />
      <Stack.Screen 
        name="GradeBook" 
        component={GradeBookScreen}
      />
      <Stack.Screen 
        name="LessonPlans" 
        component={LessonPlansScreen}
      />
      <Stack.Screen 
        name="Communication" 
        component={CommunicationScreen}
      />
      <Stack.Screen 
        name="MySchedule" 
        component={MyScheduleScreen}
      />
      <Stack.Screen 
        name="Analytics" 
        component={AnalyticsScreen}
      />
      <Stack.Screen 
        name="Resources" 
        component={ResourcesScreen}
      />
      <Stack.Screen 
        name="ProfessionalDevelopment" 
        component={ProfessionalDevelopmentScreen}
      />
    </Stack.Navigator>
  );
};