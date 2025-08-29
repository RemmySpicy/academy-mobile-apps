# Academy Settings System

The Academy Apps feature a comprehensive settings system designed for both students and instructors with persistent storage, role-based customization, and a complete component library.

## 🎯 Overview

### Key Features
- **Persistent Storage**: All settings automatically saved to AsyncStorage using Zustand
- **Role-Based Customization**: Different options and layouts for students vs instructors
- **5 Setting Categories**: App, Notifications, Privacy, Academy, Security settings
- **Type Safety**: Complete TypeScript interfaces with validation functions
- **Academy Theming**: Consistent `theme.colors.interactive.primary` usage

### Architecture
```typescript
interface SettingsState {
  app: AppSettings;           // Theme, language, font size, animations
  notifications: NotificationSettings;  // Push, email, SMS preferences
  privacy: PrivacySettings;   // Analytics, data sharing, permissions
  academy: AcademySettings;   // Program-specific preferences
  security: SecuritySettings; // Biometric, auto-lock, 2FA
}
```

## 📱 Components

### SettingsCard
Interactive setting items with icons, variants, and proper theming.

```tsx
import { SettingsCard } from '@academy/mobile-shared';

<SettingsCard
  icon="flash"
  title="Animations"
  subtitle="Enable smooth transitions and animations"
  rightElement={<SettingsSwitch />}
  variant="default"
  onPress={() => console.log('Pressed')}
  showChevron
/>
```

**Props:**
- `title: string` - Setting title
- `subtitle?: string` - Optional description
- `description?: string` - Extended description
- `icon: keyof typeof Ionicons.glyphMap` - Ionicon name
- `rightElement?: React.ReactNode` - Switch, picker, or other control
- `onPress?: () => void` - Navigation or action handler
- `variant?: 'default' | 'danger' | 'warning' | 'success'` - Visual style
- `showChevron?: boolean` - Show navigation arrow
- `disabled?: boolean` - Disable interaction

**Variants:**
- `default` - Standard Academy purple theming
- `warning` - Yellow accent for reset/warning actions
- `danger` - Red accent for destructive actions
- `success` - Green accent for confirmations

### SettingsSection
Organized setting groups with staggered animations.

```tsx
import { SettingsSection } from '@academy/mobile-shared';

<SettingsSection 
  title="App Preferences" 
  subtitle="Customize your experience"
  delay={300}
  showDivider
>
  {/* Settings cards */}
</SettingsSection>
```

**Props:**
- `title: string` - Section title
- `subtitle?: string` - Optional section description
- `delay?: number` - Animation delay in milliseconds
- `showDivider?: boolean` - Show divider line
- `children: React.ReactNode` - Settings cards content

### SettingsSwitch
Themed toggle switches with platform-specific optimizations.

```tsx
import { SettingsSwitch } from '@academy/mobile-shared';

<SettingsSwitch
  value={settings.animations}
  onValueChange={updateSetting}
  disabled={false}
  size="medium"
/>
```

**Props:**
- `value: boolean` - Current switch state
- `onValueChange: (value: boolean) => void` - Value change handler
- `disabled?: boolean` - Disable interaction
- `size?: 'small' | 'medium'` - Switch size

### SettingsPicker
Modal-based option selectors with search functionality.

```tsx
import { SettingsPicker, PickerOption } from '@academy/mobile-shared';

const themeOptions: PickerOption[] = [
  { 
    label: 'Light Mode', 
    value: 'light', 
    description: 'Always use light theme', 
    icon: 'sunny' 
  },
  { 
    label: 'Dark Mode', 
    value: 'dark', 
    description: 'Always use dark theme', 
    icon: 'moon' 
  },
];

<SettingsPicker
  title="Theme"
  options={themeOptions}
  selectedValue={settings.theme}
  onSelectionChange={updateTheme}
  placeholder="Select theme"
/>
```

**Props:**
- `title: string` - Picker title
- `options: PickerOption[]` - Available options
- `selectedValue: string` - Currently selected value
- `onSelectionChange: (value: string) => void` - Selection handler
- `placeholder?: string` - Placeholder text
- `disabled?: boolean` - Disable interaction

**PickerOption Interface:**
```typescript
interface PickerOption {
  label: string;          // Display text
  value: string;          // Unique identifier
  description?: string;   // Optional description
  icon?: keyof typeof Ionicons.glyphMap; // Optional icon
}
```

## 🏪 Settings Store

### Basic Usage
```tsx
import { useSettingsStore } from '@academy/mobile-shared';

const Component = () => {
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
    exportSettings,
    importSettings,
  } = useSettingsStore();

  return (
    <SettingsSection title="App Preferences">
      <SettingsCard
        title="Animations"
        rightElement={
          <SettingsSwitch
            value={app.animations}
            onValueChange={(value) => updateAppSettings({ animations: value })}
          />
        }
      />
    </SettingsSection>
  );
};
```

### Settings Categories

#### App Settings
```typescript
interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'es' | 'fr';
  fontSize: 'small' | 'medium' | 'large';
  animations: boolean;
  hapticFeedback: boolean;
  soundEffects: boolean;
}
```

#### Notification Settings
```typescript
interface NotificationSettings {
  pushNotifications: boolean;
  bookingUpdates: boolean;
  achievements: boolean;
  paymentNotifications: boolean;
  weeklyEmailSummary: boolean;
  marketingEmails: boolean;
  sessionReminders: boolean;
  emergencyAlerts: boolean;
  smsConfirmations: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string; // HH:MM format
  quietHoursEnd: string;   // HH:MM format
}
```

#### Privacy Settings
```typescript
interface PrivacySettings {
  usageAnalytics: boolean;
  crashReports: boolean;
  locationServices: boolean;
  contactAccess: boolean;
  photoLibraryAccess: boolean;
  adTracking: boolean;
  marketingCommunications: boolean;
}
```

#### Academy Settings
```typescript
interface AcademySettings {
  defaultProgram: string | null;
  favoriteInstructors: string[];
  preferredSessionTimes: string[];
  skillLevelDisplay: boolean;
  progressSharingEnabled: boolean;
  parentalControls: boolean;
  emergencyContacts: Array<{
    id: string;
    name: string;
    phone: string;
    relationship: string;
  }>;
}
```

#### Security Settings
```typescript
interface SecuritySettings {
  biometricLogin: boolean;
  autoLockTimeout: number; // minutes
  sessionTimeout: number;  // minutes
  twoFactorEnabled: boolean;
  loginNotifications: boolean;
  securityAlerts: boolean;
}
```

## 🎨 Role-Based Implementation

### Student Settings Focus
```tsx
const StudentSettings = () => (
  <>
    <SettingsSection title="Account">
      <SettingsCard icon="person-circle" title="Profile" />
      <SettingsCard icon="notifications" title="Notifications" />
      <SettingsCard icon="shield-checkmark" title="Privacy & Security" />
    </SettingsSection>
    
    <SettingsSection title="Learning Experience">
      <SettingsCard icon="flash" title="Animations" />
      <SettingsCard icon="phone-portrait" title="Haptic Feedback" />
      <SettingsCard icon="volume-high" title="Sound Effects" />
    </SettingsSection>
    
    <SettingsSection title="Quick Settings">
      <SettingsCard icon="lock-closed" title="Biometric Login" />
      <SettingsCard icon="moon" title="Quiet Hours" />
      <SettingsCard icon="eye-off" title="Usage Analytics" />
    </SettingsSection>
  </>
);
```

### Instructor Settings Focus
```tsx
const InstructorSettings = () => (
  <>
    <SettingsSection title="Professional Profile">
      <SettingsCard icon="school" title="Teaching Credentials" />
      <SettingsCard icon="calendar" title="Schedule Management" />
      <SettingsCard icon="people" title="Student Roster" />
    </SettingsSection>
    
    <SettingsSection title="Teaching Preferences">
      <SettingsCard icon="trophy" title="Progress Tracking" />
      <SettingsCard icon="bar-chart" title="Skill Level Display" />
      <SettingsCard icon="shield-checkmark" title="Parental Controls" />
    </SettingsSection>
    
    <SettingsSection title="Professional Development">
      <SettingsCard icon="school" title="Training Notifications" />
      <SettingsCard icon="certificate" title="Certification Reminders" />
    </SettingsSection>
  </>
);
```

## 🔧 Utility Functions

### Validation
```tsx
import { validateSettings } from '@academy/mobile-shared';

const isValid = validateSettings(settingsData);
```

### Time Formatting
```tsx
import { formatQuietHours } from '@academy/mobile-shared';

const display = formatQuietHours('22:00', '08:00'); 
// Returns: "10:00 PM - 8:00 AM"
```

### Settings Reset
```tsx
const handleResetSettings = () => {
  Alert.alert(
    'Reset Settings',
    'This will restore all settings to defaults. Continue?',
    [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Reset', 
        style: 'destructive',
        onPress: () => {
          resetToDefaults();
          Alert.alert('Settings Reset', 'All settings restored to defaults.');
        }
      }
    ]
  );
};
```

## 📱 Valid Icons

All settings components use validated Ionicons names:

```tsx
const validSettingsIcons = [
  // Account & Profile
  'person-circle', 'notifications', 'shield-checkmark',
  
  // Experience
  'flash', 'phone-portrait', 'volume-high',
  
  // Security
  'lock-closed', 'moon', 'eye-off',
  
  // Information & Actions
  'help-circle', 'document-text', 'refresh', 'log-out',
  
  // Timing
  'time-outline', 'ban-outline',
  
  // Size Options
  'remove-circle-outline', 'add-circle-outline',
  
  // Professional (Instructors)
  'school', 'calendar', 'people', 'trophy', 'bar-chart'
];
```

## 🎯 Best Practices

### 1. Settings Organization
- Group related settings into logical sections
- Use clear, descriptive titles and subtitles
- Provide helpful descriptions for complex settings

### 2. Icon Usage
- Always use valid Ionicons names
- Choose icons that clearly represent the setting
- Maintain consistency across similar settings

### 3. Theming
- Use Academy design system colors consistently
- Apply proper variants for different action types
- Follow mobile-first responsive patterns

### 4. User Experience
- Provide confirmation dialogs for destructive actions
- Show current setting states clearly
- Use staggered animations for smooth interactions

### 5. Data Management
- Validate settings data before persistence
- Provide import/export for user data portability
- Handle edge cases and fallback values

## 📚 Related Documentation

- [Component Library Overview](../README.md)
- [Development Guide](../../development/DEVELOPMENT_GUIDE.md)
- [Academy Design System](../../THEME_SYSTEM.md)
- [Production Readiness Status](../../development/PRODUCTION_READINESS_STATUS.md)