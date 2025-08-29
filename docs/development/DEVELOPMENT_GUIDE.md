# Academy Mobile Apps - Development Guide

## Development Commands

### Installation & Setup

```bash
# Install all dependencies
npm install

# Fresh start (clean and reinstall everything)
rm -rf node_modules package-lock.json
npm install
```

### Development

```bash
# Start individual apps (recommended approach)
npm run start:instructors
# or
cd instructors-app && npx expo start --offline

npm run start:students  
# or
cd students-app && npx expo start --offline
```

### Code Quality & Testing

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Test individual apps
npm run test:students
npm run test:instructors

# Test in watch mode
npm run test:watch

# Note: Formatting and linting are handled by pre-commit hooks
# which run automatically when you commit code
```

### Building & Deployment

```bash
# EAS builds (individual apps)
cd instructors-app
npx eas build --platform ios --profile development
npx eas build --platform android --profile development

# Production builds
npx eas build --platform all --profile production
```

## Environment Configuration

Environment files are located in the root directory:

- `.env.development` - Local development
- `.env.staging` - Staging environment
- `.env.production` - Production environment
- `.env.example` - Template for new environments

Key environment variables:

- `EXPO_PUBLIC_API_URL` - Backend API URL
- `EXPO_PUBLIC_ENV` - Environment name
- `EXPO_PUBLIC_DEBUG_MODE` - Enable/disable debug features

## Pre-commit Hooks

Husky is configured to run on every commit:

1. **ESLint** - Fixes linting issues automatically
2. **Prettier** - Formats code consistently
3. **TypeScript** - Type checking across all packages
4. **Jest** - Runs related tests for changed files

## Backend Dependencies

Before starting mobile development, ensure backend services are running:

```bash
cd ../academy-admin
docker-compose up db backend
```

- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs
- Backend Source: ../academy-admin/backend

## Technology Stack

- **React**: 19.0.0 (Production ready)
- **React Native**: 0.79.5 
- **Expo SDK**: 53.0.20
- **TypeScript**: 5.8.3 (Core type system production ready)
- **React Navigation**: 6.x with @react-navigation/native-stack
- **State Management**: Zustand 5.0.7 with Immer integration
- **Forms**: React Hook Form 7.62.0 with yup validation
- **Icons**: @expo/vector-icons (Ionicons) - ✅ Fully migrated from Remix Icons
- **Charts**: react-native-gifted-charts v1.4.0 (React 19 compatible, modern alternative)
- **Animation**: React Native Reanimated v3.17.4 (proper v3 API usage)
- **Testing**: Jest 29.0.0 with React Native Testing Library
- **Linting**: ESLint 9.25.0 with TypeScript support
- **Formatting**: Prettier 3.4.2 with Husky pre-commit hooks
- **Monorepo**: npm workspaces with optimized module resolution

## 🚀 Academy Shared Components Library

**✅ COMPONENT EXTRACTION COMPLETE** - All components extracted from existing code
**✅ MENU SYSTEM COMPLETE** - All settings and feature screens implemented

### Total Components: **85+ Production-Ready Components**

The Academy Apps feature a comprehensive shared component library with complete coverage for all mobile app needs.

### Recently Added Features
- **Settings Management**: NotificationSettings, PrivacySettings, About screens
- **Analytics Dashboard**: ProgressReport screen with charts and metrics
- **Complete Menu System**: All menu navigation screens fully implemented
- **Advanced Data Visualization**: Charts, progress tracking, and export functionality
- **Profile Management System**: Enhanced EditProfileScreen with cover photo + profile picture dual system
- **Payment Methods**: Comprehensive payment method management with card/PayPal support
- **Photo Management**: Professional photo upload system with camera/gallery selection and removal options

### Testing Components
```bash
# Test all components in ExtractedComponentsShowcase
cd shared && npx expo start

# Navigate to "UI" section to see all components in action
# Interactive demos available for all 85+ components
```

## Development Best Practices

1. **Use shared components** - Import from `@academy/mobile-shared` (85+ available)
2. **Follow Academy theming** - Use `theme.colors.interactive.primary` (#4F2EC9)
3. **Component extraction complete** - existing-code/ can now be safely removed
4. **Test your changes** - Run `npm run test` before committing
5. **Use exact dependency versions** - no carets or tildes
6. **Write tests for new features** - coverage thresholds are enforced
7. **Use the pre-commit hooks** - they catch issues early
8. **Keep environment variables in .env files** - never hardcode URLs or keys

## 🎨 Design System Consistency

### Horizontal Padding Standards (Updated 2025)

**✅ PADDING CONSISTENCY ACHIEVED** - All screen files now use standardized horizontal spacing

#### Standard Horizontal Padding
- **Screen edges**: Always use `theme.spacing.md` (16px) for consistent content alignment
- **Component internal padding**: Use appropriate theme spacing tokens (`xs`, `sm`, `md`, `lg`, etc.)
- **Never hardcode**: Avoid hardcoded pixel values like `paddingHorizontal: 24`

#### Fixed Files (35+ screens updated)
**Students App:** All auth screens, feature screens (Transactions, Schedule, Contact, Store, Referrals, Location, Services, Bookings, Progress, Help, Courses, etc.)

**Instructors App:** All auth screens, feature screens (Performance, Classroom, Students, Attendance, etc.)

#### Best Practices
```tsx
// ✅ CORRECT - Use theme spacing tokens
paddingHorizontal: theme.spacing.md,  // 16px for screen edges

// ❌ WRONG - Hardcoded values
paddingHorizontal: 24,
paddingHorizontal: 16,
```

This ensures visual consistency across all Academy Apps screens and maintains compliance with the design system.

## 👤 Profile Management Development

### **Dual Photo System Implementation**

The Academy Apps feature a comprehensive profile management system with dual photo support:

#### **Cover Photo + Profile Picture Layout**
```tsx
// Modern social media-inspired design
const profileLayoutStyle = {
  coverPhoto: { height: 240, width: '100%' },
  profilePicture: { 
    width: 140, 
    height: 140, 
    position: 'absolute',
    bottom: -40,
    left: theme.spacing.lg 
  }
};
```

#### **Implementation Guidelines**
```tsx
// Profile data structure
interface UserProfile {
  // ... existing fields
  profilePicture?: string;
  coverPhoto?: string;        // ← New dual photo system
}

// Photo management functions
const handleChangeCoverPhoto = () => {
  // Take photo, choose from gallery, remove (if exists)
};

const handleChangeProfilePicture = () => {
  // Take photo, choose from gallery
};
```

### **Profile Switching System**

The Academy Apps feature comprehensive profile switching functionality allowing parents to manage multiple child profiles:

#### **ProfileSwitcherBottomSheet Component**
```tsx
import { ProfileSwitcherBottomSheet } from '@academy/mobile-shared';

// Basic usage in any screen
const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);

const handleProfileSelect = (profile: ProfileOption) => {
  console.log('Selected profile:', profile);
  // Implement profile switching logic
  setShowProfileSwitcher(false);
};

<ProfileSwitcherBottomSheet
  visible={showProfileSwitcher}
  onClose={() => setShowProfileSwitcher(false)}
  onProfileSelect={handleProfileSelect}
  activeProfileId="current-profile-id"
/>
```

#### **Profile Data Structure**
```tsx
interface ProfileOption {
  id: string;
  name: string;
  role: 'parent' | 'student';
  isActive: boolean;
  avatar?: string;
  grade?: string;
  program?: string;
}
```

#### **Menu Integration**
- **Profile Card**: Clickable to navigate to EditProfile screen
- **Switcher Icon**: People icon button to open profile switcher
- **Multi-User Support**: Parents can switch between their profile and children profiles
- **Create New Profile**: Option to add new family member profiles

#### **User Role Support**
- **Parents (UserRole.PARENT)**: See parent profile + children profiles
- **Students (UserRole.STUDENT)**: See their own profile + potential family members
- **Fallback Handling**: Always shows at least one profile option

### **Key Features Implemented**
- **✅ EditProfileScreen**: Enhanced with cover photo, comprehensive form sections
- **✅ PaymentMethodsScreen**: Card/PayPal management with default selection
- **✅ SettingsScreens**: Privacy, Notification, and About screens with local components
- **✅ Photo Management**: Dual photo system with camera/gallery integration
- **✅ Professional Layout**: LinkedIn/Facebook inspired design with stats section
- **✅ AchievementsScreen**: Comprehensive gamification system with progress tracking and category filtering
- **✅ Profile Switching System**: Multi-profile management with parent-child relationships

### **Development Commands for Profile Features**
```bash
# Test profile screens
cd students-app && npx expo start
# Navigate to Menu → Account → Edit Profile

# Test payment methods
# Navigate to Menu → Account → Payment Methods

# Test settings screens
# Navigate to Menu → Settings → [Privacy/Notifications/About]

# Test profile switching system
# 1. Use bypass login to create parent user
# 2. Navigate to Menu tab
# 3. Click people icon (profile switcher) in profile card
# 4. Select different profiles or create new profile
# 5. Profile card click navigates to edit profile

# Test achievements screen
# Navigate to Menu → Academy Features → Achievements
# or use Quick Access → My Progress
```

### **Photo Upload Integration**
```tsx
import * as ImagePicker from 'expo-image-picker';

// Camera permissions
const requestCameraPermission = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  return status === 'granted';
};

// Photo selection
const selectPhoto = async (aspectRatio: [number, number]) => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: aspectRatio, // [16,9] for cover, [1,1] for profile
    quality: 0.8,
  });
  return result;
};
```

### **State Management Best Practices**
```tsx
// Change tracking for unsaved changes
const [hasChanges, setHasChanges] = useState(false);
const [isEditing, setIsEditing] = useState(false);

// Handle input changes with tracking
const handleInputChange = (field: keyof UserProfile, value: string) => {
  setProfile(prev => ({ ...prev, [field]: value }));
  setHasChanges(true);
};

// Confirmation dialogs for data integrity
const handleSave = () => {
  Alert.alert('Save Changes', 'Are you sure?', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Save', onPress: () => saveProfile() }
  ]);
};
```

## 🏆 Gamification System Development

### **Achievements System**

The Academy Apps include a comprehensive achievements system designed to enhance student engagement through gamification principles.

#### **Achievement Categories**
- **Academic**: Performance-based achievements and learning milestones
- **Attendance**: Perfect attendance streaks and participation rewards
- **Participation**: Group activities, leadership, and community engagement
- **Skill**: Program-specific skill development and proficiency levels
- **Milestone**: Major accomplishments and program completion markers

#### **Development Implementation**
```tsx
// Achievement data structure
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  category: 'academic' | 'attendance' | 'participation' | 'skill' | 'milestone';
  status: 'locked' | 'in_progress' | 'completed';
  progress?: number;
  maxProgress?: number;
  dateEarned?: string;
  points?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// Achievement filtering and organization
const filteredAchievements = achievements.filter(achievement =>
  selectedCategory === 'all' || achievement.category === selectedCategory
);

// Progress calculations
const completedCount = achievements.filter(a => a.status === 'completed').length;
const totalPoints = achievements
  .filter(a => a.status === 'completed')
  .reduce((sum, a) => sum + (a.points || 0), 0);
```

#### **Visual Design Implementation**
```tsx
// Rarity color system
const getRarityColor = (rarity: Achievement['rarity'], theme: any) => {
  switch (rarity) {
    case 'common': return theme.colors.icon.secondary;
    case 'rare': return theme.colors.interactive.primary;
    case 'epic': return theme.colors.interactive.purple;
    case 'legendary': return theme.colors.status.warning;
  }
};

// Status indicators
const getStatusColor = (status: Achievement['status'], theme: any) => {
  switch (status) {
    case 'completed': return theme.colors.status.success;
    case 'in_progress': return theme.colors.interactive.primary;
    case 'locked': return theme.colors.icon.tertiary;
  }
};
```

### **Development Testing Commands**
```bash
# Test achievements functionality
cd students-app && npx expo start

# Navigation paths to test:
# 1. Menu → Academy Features → Achievements
# 2. Menu Quick Access → My Progress
# 3. Profile stats → Achievements count

# Test category filtering
# - Tap different category filters (All, Academic, Attendance, etc.)
# - Verify achievement counts update correctly
# - Check empty states for categories with no achievements

# Test progress tracking
# - Verify progress bars display correctly for in-progress achievements
# - Check that completed achievements show earn dates
# - Validate point calculations in statistics dashboard
```

## ⚙️ Settings System Development

### **Comprehensive User Preferences Implementation**

The Academy Apps feature a complete settings system with persistent storage and role-based customization:

#### **Settings Store Integration**
```tsx
import { 
  useSettingsStore,
  SettingsCard,
  SettingsSection,
  SettingsSwitch,
  SettingsPicker
} from '@academy/mobile-shared';

// Basic settings hook usage
const {
  app,
  notifications,
  privacy,
  security,
  updateAppSettings,
  resetToDefaults
} = useSettingsStore();

// Update individual settings
updateAppSettings({ theme: 'dark' });
updateNotificationSettings({ pushNotifications: false });
```

#### **Settings Components Usage**
```tsx
// Organized settings sections with animations
<SettingsSection title="App Preferences" delay={300}>
  {/* Toggle switch setting */}
  <SettingsCard
    icon="flash"
    title="Animations"
    subtitle="Enable smooth transitions and animations"
    rightElement={
      <SettingsSwitch
        value={app.animations}
        onValueChange={(value) => updateAppSettings({ animations: value })}
      />
    }
  />
  
  {/* Option picker setting */}
  <SettingsPicker
    title="Theme"
    options={[
      { label: 'Light Mode', value: 'light', icon: 'sunny' },
      { label: 'Dark Mode', value: 'dark', icon: 'moon' },
      { label: 'System', value: 'system', icon: 'phone-portrait' }
    ]}
    selectedValue={app.theme}
    onSelectionChange={(value) => updateAppSettings({ theme: value })}
  />
  
  {/* Interactive navigation setting */}
  <SettingsCard
    icon="shield-checkmark"
    title="Privacy & Security"
    subtitle="Control your data and security settings"
    onPress={() => navigation.navigate('PrivacySettings')}
    showChevron
    variant="default"
  />
</SettingsSection>
```

#### **Card Variants and Icons**
```tsx
// Different card variants for visual hierarchy
<SettingsCard variant="default" />   // Standard appearance
<SettingsCard variant="warning" />   // Yellow accent (reset settings)
<SettingsCard variant="danger" />    // Red accent (account deletion)
<SettingsCard variant="success" />   // Green accent (confirmations)

// Valid Ionicons for consistent theming
const validIcons = [
  'person-circle', 'notifications', 'shield-checkmark',
  'flash', 'phone-portrait', 'volume-high', 'lock-closed',
  'moon', 'eye-off', 'help-circle', 'document-text',
  'refresh', 'log-out', 'time-outline', 'ban-outline'
];
```

#### **Role-Based Settings Implementation**
```tsx
// Student-specific settings focus
const StudentSettings = () => (
  <>
    <SettingsSection title="Account">
      <SettingsCard icon="person-circle" title="Profile" />
      <SettingsCard icon="notifications" title="Notifications" />
    </SettingsSection>
    
    <SettingsSection title="Learning Preferences">
      <SettingsCard icon="trophy" title="Progress Tracking" />
      <SettingsCard icon="flash" title="Animations" />
    </SettingsSection>
  </>
);

// Instructor-specific settings focus
const InstructorSettings = () => (
  <>
    <SettingsSection title="Professional Profile">
      <SettingsCard icon="school" title="Teaching Credentials" />
      <SettingsCard icon="calendar" title="Schedule Management" />
    </SettingsSection>
    
    <SettingsSection title="Teaching Preferences">
      <SettingsCard icon="bar-chart" title="Student Progress Display" />
      <SettingsCard icon="shield-checkmark" title="Parental Controls" />
    </SettingsSection>
  </>
);
```

#### **Persistent Storage & Validation**
```tsx
// Settings automatically persist to AsyncStorage
// Validation functions available for data integrity
import { validateSettings, formatQuietHours } from '@academy/mobile-shared';

// Usage examples
const isValidSettings = validateSettings(currentSettings);
const quietHoursDisplay = formatQuietHours('22:00', '08:00'); // "10:00 PM - 8:00 AM"

// Settings reset with confirmation
const handleResetSettings = () => {
  Alert.alert(
    'Reset Settings',
    'This will restore all settings to defaults. Continue?',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: resetToDefaults }
    ]
  );
};
```

### **Development Testing Commands**
```bash
# Test settings functionality
cd students-app && npx expo start
cd instructors-app && npx expo start

# Navigation paths to test:
# Students: Menu → Settings (comprehensive settings screen)
# Instructors: Menu → App Settings (instructor-focused settings)

# Test persistent storage
# 1. Change settings values
# 2. Close/restart app
# 3. Verify settings persist correctly

# Test role-based customization
# 1. Compare student vs instructor settings screens
# 2. Verify different options and layouts
# 3. Check Academy-specific preferences

# Test settings components
# - SettingsSwitch: Toggle animations, haptic feedback
# - SettingsPicker: Theme selection, language options
# - SettingsCard: Various icons, variants, interactions
```