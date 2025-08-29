import React from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { 
  useTheme, 
  NavigationHeader,
  useSettingsStore,
  useAuthStore,
  SettingsCard,
  SettingsSection,
  SettingsSwitch,
  SettingsPicker,
  PickerOption,
  formatQuietHours,
} from '@academy/mobile-shared';
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
  const {
    app,
    notifications,
    privacy,
    security,
    academy,
    updateAppSettings,
    updateNotificationSettings,
    updatePrivacySettings,
    updateSecuritySettings,
    updateAcademySettings,
    resetToDefaults,
  } = useSettingsStore();

  const { user, logout } = useAuthStore();

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'This will reset all settings to their default values. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            resetToDefaults();
            Alert.alert('Settings Reset', 'All settings have been reset to defaults.');
          }
        }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: logout
        }
      ]
    );
  };

  const themeOptions: PickerOption[] = [
    { label: 'Light Mode', value: 'light', description: 'Always use light theme', icon: 'sunny' },
    { label: 'Dark Mode', value: 'dark', description: 'Always use dark theme', icon: 'moon' },
    { label: 'System', value: 'system', description: 'Follow device settings', icon: 'phone-portrait' },
  ];

  const languageOptions: PickerOption[] = [
    { label: 'English', value: 'en', icon: 'globe' },
    { label: 'Español', value: 'es', icon: 'globe' },
    { label: 'Français', value: 'fr', icon: 'globe' },
  ];

  const fontSizeOptions: PickerOption[] = [
    { label: 'Small', value: 'small', description: 'Compact text size', icon: 'remove-circle-outline' },
    { label: 'Medium', value: 'medium', description: 'Standard text size', icon: 'text' },
    { label: 'Large', value: 'large', description: 'Larger text for readability', icon: 'add-circle-outline' },
  ];

  const autoLockOptions: PickerOption[] = [
    { label: 'Never', value: '0', icon: 'ban-outline' },
    { label: '5 minutes', value: '5', icon: 'time-outline' },
    { label: '15 minutes', value: '15', icon: 'time-outline' },
    { label: '30 minutes', value: '30', icon: 'time-outline' },
    { label: '1 hour', value: '60', icon: 'time-outline' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.secondary }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: theme.spacing.lg,
          paddingBottom: theme.spacing['3xl'],
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          style={{
            paddingHorizontal: theme.spacing.md,
            marginBottom: theme.spacing.xl,
          }}
        >
          <Text style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.base,
            textAlign: 'center',
            lineHeight: 24,
          }}>
            Customize your teaching experience and manage your instructor preferences.
          </Text>
        </Animated.View>

        {/* Professional Section */}
        <SettingsSection title="Professional Profile" delay={200}>
          <SettingsCard
            icon="school"
            title={`${user?.name || 'Instructor'} - ${user?.role || 'Teacher'}`}
            subtitle={user?.email || 'instructor@academy.com'}
            onPress={() => console.log('Edit Profile')}
            showChevron
            style={{ marginBottom: theme.spacing.sm }}
          />
          
          <SettingsCard
            icon="calendar"
            title="Teaching Schedule"
            subtitle="Manage your class schedule and availability"
            onPress={() => console.log('Teaching Schedule')}
            showChevron
            style={{ marginBottom: theme.spacing.sm }}
          />

          <SettingsCard
            icon="people"
            title="My Students"
            subtitle="View and manage your student roster"
            onPress={() => console.log('My Students')}
            showChevron
          />
        </SettingsSection>

        {/* Teaching Preferences */}
        <SettingsSection title="Teaching Preferences" delay={300}>
          <SettingsCard
            icon="trophy"
            title="Progress Tracking"
            subtitle="Show detailed student progress metrics"
            rightElement={
              <SettingsSwitch
                value={academy.progressSharingEnabled}
                onValueChange={(value) => updateAcademySettings({ progressSharingEnabled: value })}
              />
            }
            style={{ marginBottom: theme.spacing.sm }}
          />

          <SettingsCard
            icon="bar-chart"
            title="Skill Level Display"
            subtitle="Display student skill levels in class view"
            rightElement={
              <SettingsSwitch
                value={academy.skillLevelDisplay}
                onValueChange={(value) => updateAcademySettings({ skillLevelDisplay: value })}
              />
            }
            style={{ marginBottom: theme.spacing.sm }}
          />

          <SettingsCard
            icon="shield-checkmark"
            title="Parental Controls"
            subtitle="Enhanced safety features for minor students"
            rightElement={
              <SettingsSwitch
                value={academy.parentalControls}
                onValueChange={(value) => updateAcademySettings({ parentalControls: value })}
              />
            }
          />
        </SettingsSection>

        {/* App Preferences */}
        <SettingsSection title="App Preferences" delay={400}>
          <View style={{ gap: theme.spacing.sm }}>
            <SettingsPicker
              title="Theme"
              options={themeOptions}
              selectedValue={app.theme}
              onSelectionChange={(value) => updateAppSettings({ theme: value as any })}
            />

            <SettingsPicker
              title="Language"
              options={languageOptions}
              selectedValue={app.language}
              onSelectionChange={(value) => updateAppSettings({ language: value as any })}
            />

            <SettingsPicker
              title="Font Size"
              options={fontSizeOptions}
              selectedValue={app.fontSize}
              onSelectionChange={(value) => updateAppSettings({ fontSize: value as any })}
            />
          </View>
        </SettingsSection>

        {/* Notifications for Instructors */}
        <SettingsSection title="Instructor Notifications" delay={500}>
          <SettingsCard
            icon="notifications"
            title="Class Notifications"
            subtitle="Updates about your classes and students"
            rightElement={
              <SettingsSwitch
                value={notifications.bookingUpdates}
                onValueChange={(value) => updateNotificationSettings({ bookingUpdates: value })}
              />
            }
            style={{ marginBottom: theme.spacing.sm }}
          />

          <SettingsCard
            icon="people"
            title="Student Notifications"
            subtitle="Student enrollment and progress updates"
            rightElement={
              <SettingsSwitch
                value={notifications.achievements}
                onValueChange={(value) => updateNotificationSettings({ achievements: value })}
              />
            }
            style={{ marginBottom: theme.spacing.sm }}
          />

          <SettingsCard
            icon="warning"
            title="Emergency Alerts"
            subtitle="Critical updates and safety notifications"
            rightElement={
              <SettingsSwitch
                value={notifications.emergencyAlerts}
                onValueChange={(value) => updateNotificationSettings({ emergencyAlerts: value })}
              />
            }
            style={{ marginBottom: theme.spacing.sm }}
          />

          <SettingsCard
            icon="moon"
            title="Quiet Hours"
            subtitle={`${formatQuietHours(notifications.quietHoursStart, notifications.quietHoursEnd)}`}
            rightElement={
              <SettingsSwitch
                value={notifications.quietHoursEnabled}
                onValueChange={(value) => updateNotificationSettings({ quietHoursEnabled: value })}
              />
            }
          />
        </SettingsSection>

        {/* Security & Privacy */}
        <SettingsSection title="Security & Privacy" delay={600}>
          <SettingsCard
            icon="lock-closed"
            title="Biometric Login"
            subtitle="Use fingerprint or face ID to sign in"
            rightElement={
              <SettingsSwitch
                value={security.biometricLogin}
                onValueChange={(value) => updateSecuritySettings({ biometricLogin: value })}
              />
            }
            style={{ marginBottom: theme.spacing.sm }}
          />

          <View style={{ marginBottom: theme.spacing.sm }}>
            <SettingsPicker
              title="Auto-Lock"
              options={autoLockOptions}
              selectedValue={security.autoLockTimeout.toString()}
              onSelectionChange={(value) => updateSecuritySettings({ autoLockTimeout: parseInt(value) })}
            />
          </View>

          <SettingsCard
            icon="analytics"
            title="Usage Analytics"
            subtitle="Help improve the instructor experience"
            rightElement={
              <SettingsSwitch
                value={privacy.usageAnalytics}
                onValueChange={(value) => updatePrivacySettings({ usageAnalytics: value })}
              />
            }
          />
        </SettingsSection>

        {/* Professional Development */}
        <SettingsSection title="Professional Development" delay={700}>
          <SettingsCard
            icon="school"
            title="Training Notifications"
            subtitle="Get notified about new training opportunities"
            rightElement={
              <SettingsSwitch
                value={notifications.marketingEmails}
                onValueChange={(value) => updateNotificationSettings({ marketingEmails: value })}
              />
            }
            style={{ marginBottom: theme.spacing.sm }}
          />

          <SettingsCard
            icon="certificate"
            title="Certification Reminders"
            subtitle="Reminders for certification renewals"
            rightElement={
              <SettingsSwitch
                value={notifications.sessionReminders}
                onValueChange={(value) => updateNotificationSettings({ sessionReminders: value })}
              />
            }
          />
        </SettingsSection>

        {/* Account Actions */}
        <SettingsSection title="Account Actions" delay={800}>
          <SettingsCard
            icon="refresh"
            title="Reset Settings"
            subtitle="Restore all settings to defaults"
            onPress={handleResetSettings}
            variant="warning"
            style={{ marginBottom: theme.spacing.sm }}
          />
          
          <SettingsCard
            icon="log-out"
            title="Sign Out"
            subtitle="Sign out of your instructor account"
            onPress={handleLogout}
            variant="danger"
          />
        </SettingsSection>
      </ScrollView>
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