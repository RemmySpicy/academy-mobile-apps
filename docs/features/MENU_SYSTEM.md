# Academy Menu System Implementation

## Overview

The Academy Mobile Apps feature a comprehensive menu system with production-ready screens covering settings management, analytics, feature access, and enhanced profile management. All screens are built with Academy design system compliance, full TypeScript support, accessibility features, and modern UI patterns including expandable images and profile switching.

## Menu Structure

### Main Categories

#### **Academy Features**
- **Our Courses** → `CoursesScreen` - Course catalog and enrollment
- **Our Services** → `ServicesScreen` - Service offerings with filtering
- **Achievements** → `AchievementsScreen` - Progress tracking and rewards
- **Store** → `StoreScreen` - Product catalog with cart functionality
- **Transactions** → `TransactionsScreen` - Payment history and receipts
- **Referrals** → `ReferralsScreen` - Referral program management
- **My Schedule** → `ScheduleScreen` - Personal scheduling interface
- **Progress Report** → `ProgressReportScreen` - Advanced analytics dashboard
- **Our Facilities** → `FacilityScreen` - Academy facility finder
- **Help & Support** → `HelpScreen` - Support system integration

#### **Enhanced Profile System**
- **Interactive Profile Card** → Enhanced profile card with cover photo and expansion modals
- **Profile Switching** → Multi-profile support with ProfileSwitcherBottomSheet
- **Image Expansion** → Full-screen modals for cover photo and profile picture viewing
- **Edit Profile** → `EditProfileScreen` - Personal information management
- **Payment Methods** → `PaymentMethodsScreen` - Payment card management
- **Manage Children** → Parent-specific child profile management with creation workflow

#### **Settings & Preferences**
- **Notifications** → `NotificationSettingsScreen` - Notification preferences
- **Privacy & Security** → `PrivacySettingsScreen` - Privacy controls
- **App Settings** → `SettingsScreen` - Comprehensive app configuration and preferences

#### **Support & Information**
- **Help & Support** → `HelpScreen` - Comprehensive support system
- **About Academy** → `AboutScreen` - App information and legal

## Screen Implementations

### Enhanced Profile System

#### Interactive Profile Card
**Location**: `students-app/src/features/menu/screens/AppMenuScreen.tsx`

**Features:**
- **Cover Photo with Expansion**: Clickable cover image (120px height) that expands to full-screen modal
- **Overlapping Profile Picture**: Large profile avatar (84px) positioned to overlap the cover photo
- **Expandable Profile Picture**: Profile picture expands to 200px with enhanced details in modal
- **Academic Progress Display**: Level, class, and achievement progress indicators (18/36 format)
- **Profile Switcher Integration**: Quick access button using "people" icon
- **Performance Metrics Access**: Direct button to detailed performance analytics

**Key Components:**
```typescript
// Enhanced profile card structure
<ImageBackground source={{ uri: coverPhotoUri }}>
  <Pressable onPress={handleExpandCoverPhoto}>
    <CoverPhotoOverlay />
  </Pressable>
</ImageBackground>

<Pressable onPress={handleExpandProfilePicture}>
  <OverlappingAvatar size={84} />
</Pressable>

<ProfileSwitcherButton onPress={handleProfileSwitch}>
  <Ionicons name="people" />
</ProfileSwitcherButton>
```

#### ProfileSwitcherBottomSheet
**Location**: `students-app/src/features/menu/components/ProfileSwitcherBottomSheet.tsx`

**Features:**
- **Multi-Profile Display**: Visual list with active profile highlighting
- **Profile Cards**: Name, email, level, program, and active status
- **Child Profile Creation**: Dedicated creation button with dashed border design
- **Bottom Sheet Interface**: Smooth Academy-themed bottom sheet with snap points
- **Information Panel**: User guidance about profile management

**Key Components:**
```typescript
import { BottomSheet, useTheme } from '@academy/mobile-shared';

<ProfileSwitcherBottomSheet
  visible={showProfileSwitcher}
  profiles={userProfiles}
  onProfileSelect={handleProfileSelect}
  onCreateChildProfile={handleCreateChildProfile}
>
  <ProfileCard active={profile.isActive}>
    <ProfileAvatar size={48} />
    <ProfileInfo />
    <ActiveIndicator />
  </ProfileCard>
</ProfileSwitcherBottomSheet>
```

#### Image Expansion Modal
**Location**: `students-app/src/features/menu/screens/AppMenuScreen.tsx`

**Features:**
- **Full-Screen Experience**: Dark overlay (rgba(0,0,0,0.9)) with centered image
- **Responsive Sizing**: Cover photos scale with screen width, profile pictures fixed at 200px
- **Touch Interactions**: Tap anywhere to close, dedicated close button
- **Safe Area Handling**: Proper insets for notched devices
- **Contextual Information**: Shows relevant details (cover context, student name)

**Key Components:**
```typescript
<Modal visible={showImageModal} transparent animationType="fade">
  <DarkOverlay>
    <CloseButton />
    {selectedImage.type === 'cover' ? (
      <ExpandedCoverPhoto />
    ) : (
      <ExpandedProfilePicture />
    )}
    <ImageInfo />
    <TapToCloseHint />
  </DarkOverlay>
</Modal>
```

### Settings Screens

#### NotificationSettingsScreen
**Location**: `students-app/src/features/settings/screens/NotificationSettingsScreen.tsx`

**Features:**
- **Push Notifications**: Device notification controls
- **Email Notifications**: Weekly summaries, marketing updates, reminders
- **SMS Notifications**: Emergency alerts and confirmations
- **Quiet Hours**: Do-not-disturb scheduling (10:00 PM - 8:00 AM)
- **Interactive Toggles**: Real-time preference management

**Key Components:**
```typescript
import { CustomSwitch, SettingCard } from '@academy/mobile-shared';

// Toggle implementation
<CustomSwitch
  value={notification.enabled}
  onValueChange={() => handleToggle(notification.id)}
  trackColor={{
    false: theme.colors.background.secondary,
    true: theme.colors.interactive.primary,
  }}
/>
```

#### PrivacySettingsScreen
**Location**: `students-app/src/features/settings/screens/PrivacySettingsScreen.tsx`

**Features:**
- **Data Collection**: Usage analytics and crash reporting controls
- **Data Sharing**: Location, contacts, photo library permissions
- **Tracking & Marketing**: Ad tracking and marketing communications
- **User Rights**: Data download and account deletion
- **Legal Integration**: Privacy policy and terms of service access

**Key Components:**
```typescript
// Data rights management
const handleDataDownload = () => {
  Alert.alert(
    'Download Your Data',
    'We\'ll prepare a file with all your personal data and send it to your registered email address within 48 hours.',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Request Download', onPress: () => console.log('Data download requested') }
    ]
  );
};
```

#### SettingsScreen (App Settings)
**Location**: `students-app/src/features/settings/screens/SettingsScreen.tsx`

**Features:**
- **Comprehensive Settings Categories**: Notifications, Security & Privacy, Data & Storage, Preferences, Support & About, Advanced
- **Interactive Components**: Toggle switches, selection modals, action buttons with proper feedback
- **Mobile-First Design**: Bottom sheet modals for selections, touch-friendly interactions
- **Multi-Language Support**: Language selection with local options (English, Yoruba, Hausa, Igbo, French)
- **Theme Management**: Light/Dark/System theme selection
- **Currency & Format Settings**: Multiple currencies and date/time format options
- **Advanced Options**: Cache management, settings reset, data export functionality

**Setting Categories:**
1. **Notifications**: Push, email, SMS notification toggles
2. **Security & Privacy**: Biometric auth, password change, two-factor authentication
3. **Data & Storage**: Auto-sync, offline mode, image quality, video autoplay settings
4. **Preferences**: Language, theme, currency, time/date format selection
5. **Support & About**: Contact support, feedback, app rating, version information
6. **Advanced**: Clear cache, reset settings, export data

**Key Components:**
```typescript
interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  type: 'switch' | 'select' | 'action' | 'info';
  value?: boolean | string;
  onPress?: () => void;
  onValueChange?: (value: boolean | string) => void;
  color?: string;
}

// Selection modal for preferences
const SelectModal: React.FC<{
  visible: boolean;
  title: string;
  options: string[];
  currentValue: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}> = ({ visible, title, options, currentValue, onSelect, onClose }) => (
  <Modal visible={visible} transparent animationType="slide">
    <BottomSheetContent>
      {options.map(option => (
        <SelectOption 
          key={option}
          selected={option === currentValue}
          onPress={() => onSelect(option)}
        />
      ))}
    </BottomSheetContent>
  </Modal>
);
```

#### AboutScreen
**Location**: `students-app/src/features/settings/screens/AboutScreen.tsx`

**Features:**
- **App Information**: Version, build number, platform details
- **Contact & Support**: Website, email, phone integration
- **Legal Links**: Privacy policy, terms of service, licenses
- **What's New**: Feature updates and improvements
- **Rating Prompt**: App store rating integration

**Key Components:**
```typescript
// App info display
const aboutItems: AboutItem[] = [
  {
    id: 'version',
    title: 'App Version',
    value: '1.0.0',
    icon: 'information-circle',
  },
  // ...additional items
];
```

### Analytics Screen

#### ProgressReportScreen
**Location**: `students-app/src/features/progress/screens/ProgressReportScreen.tsx`

**Features:**
- **Performance Metrics**: Overall score, attendance rate, skill improvement
- **Interactive Charts**: Line charts, bar charts, pie charts for data visualization
- **Time Period Filtering**: 1 month, 3 months, 6 months, 1 year views
- **Skill Distribution**: Visual breakdown of technical, physical, mental, tactical skills
- **Export Functionality**: PDF report generation and sharing

**Key Components:**
```typescript
import { LineChart, BarChart, PieChart } from 'react-native-gifted-charts';
import { StatsCard, FilterBar } from '@academy/mobile-shared';

// Performance metrics display
const performanceMetrics: PerformanceMetric[] = [
  {
    id: 'overall-score',
    title: 'Overall Score',
    value: 87,
    change: 5.2,
    unit: '%',
    icon: 'trending-up',
    color: theme.colors.interactive.primary,
  },
  // ...additional metrics
];
```

## Navigation Integration

### MenuNavigator Configuration
**Location**: `students-app/src/features/menu/navigation/MenuNavigator.tsx`

**Screen Routes:**
```typescript
// Settings screens
<Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
<Stack.Screen name="PrivacySettings" component={PrivacySettingsScreen} />
<Stack.Screen name="About" component={AboutScreen} />

// Analytics screen
<Stack.Screen name="ProgressReport" component={ProgressReportScreen} />
```

**Type Definitions:**
```typescript
export type MenuStackParamList = {
  MenuMain: undefined;
  NotificationSettings: undefined;
  PrivacySettings: undefined;
  Settings: undefined;
  About: undefined;
  ProgressReport: undefined;
  // ...additional routes
};
```

## Design System Integration

### Theme Usage
All menu screens follow Academy design system patterns:

```typescript
import { useTheme } from '@academy/mobile-shared';

const { theme } = useTheme();

// Standard Academy theming
const styles = {
  backgroundColor: theme.colors.background.primary,
  padding: theme.spacing.lg,
  borderRadius: theme.borderRadius.xl,
  color: theme.colors.interactive.primary, // Academy purple
};
```

### Component Integration
Screens utilize shared Academy components:

```typescript
import { 
  CustomButton,
  CustomSwitch,
  SettingCard,
  FilterBar,
  StatsCard,
  SearchInput
} from '@academy/mobile-shared';
```

## Accessibility Features

### Screen Reader Support
- Proper accessibility labels and hints
- Logical reading order
- Role-based element identification

```typescript
<TouchableOpacity
  accessibilityLabel="Notification settings toggle"
  accessibilityRole="switch"
  accessibilityState={{ checked: isEnabled }}
>
```

### Keyboard Navigation
- Tab order management
- Focus indicators
- Keyboard shortcuts support

### Visual Accessibility
- High contrast color support
- Scalable text (Dynamic Type)
- Minimum touch target sizes (44px)

## State Management

### Local State Patterns
Settings screens use local state with useState hooks:

```typescript
const [notifications, setNotifications] = useState<NotificationSetting[]>([
  // Initial settings configuration
]);

const handleToggle = (id: string) => {
  setNotifications(prev => 
    prev.map(notification => 
      notification.id === id 
        ? { ...notification, enabled: !notification.enabled }
        : notification
    )
  );
};
```

### Data Persistence
Settings changes are designed to integrate with backend APIs:

```typescript
// Example API integration pattern
const saveSettings = async (settings: NotificationSetting[]) => {
  try {
    await apiClient.updateNotificationSettings(settings);
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

## Animation System

### Entry Animations
All screens use React Native Reanimated v3 for smooth animations:

```typescript
import Animated, { FadeInDown } from 'react-native-reanimated';

<Animated.View entering={FadeInDown.delay(100).springify()}>
  {/* Content */}
</Animated.View>
```

### Staggered Animations
Multiple elements animate with progressive delays:

```typescript
{settingItems.map((item, index) => (
  <Animated.View 
    key={item.id}
    entering={FadeInDown.delay(index * 50).springify()}
  >
    <SettingCard {...item} />
  </Animated.View>
))}
```

## Data Visualization

### Chart Integration
ProgressReportScreen uses react-native-gifted-charts for data visualization:

```typescript
// Line chart for progress over time
<LineChart
  data={progressData}
  width={screenWidth - (theme.spacing.md * 4)}
  height={200}
  color={theme.colors.interactive.primary}
  thickness={3}
  backgroundColor="transparent"
  showDataPointOnPress
  pressEnabled
/>

// Pie chart for skill distribution
<PieChart
  data={skillDistribution}
  donut
  radius={60}
  innerRadius={35}
  centerLabelComponent={() => (
    <View>
      <Text>100%</Text>
      <Text>Skills</Text>
    </View>
  )}
/>
```

## Error Handling

### User-Friendly Error States
Settings screens include proper error handling:

```typescript
const handleDataDeletion = () => {
  Alert.alert(
    'Delete Account & Data',
    'This will permanently delete your account and all associated data. This action cannot be undone.',
    [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete Account', 
        style: 'destructive',
        onPress: () => {
          // Handle account deletion with proper error handling
        }
      }
    ]
  );
};
```

## Testing Considerations

### Unit Testing
Components are designed for comprehensive testing:

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from '@academy/mobile-shared';
import { NotificationSettingsScreen } from '../NotificationSettingsScreen';

test('toggles notification setting', () => {
  const { getByLabelText } = render(
    <ThemeProvider>
      <NotificationSettingsScreen />
    </ThemeProvider>
  );
  
  const toggle = getByLabelText('Push notifications toggle');
  fireEvent.press(toggle);
  // Assert state change
});
```

### Integration Testing
Navigation and state flow testing:

```typescript
test('navigates to privacy settings from menu', () => {
  // Test navigation flow and screen rendering
});
```

## Performance Optimizations

### Memoization
Components use React.memo and useMemo for performance:

```typescript
const SettingItem = React.memo<SettingItemProps>(({ setting, onToggle }) => {
  // Component implementation
});

const filteredSettings = useMemo(() => 
  settings.filter(setting => setting.category === selectedCategory),
  [settings, selectedCategory]
);
```

### Lazy Loading
Charts and complex components load efficiently:

```typescript
const ChartComponent = React.lazy(() => import('./ChartComponent'));

<React.Suspense fallback={<LoadingSpinner />}>
  <ChartComponent data={chartData} />
</React.Suspense>
```

## Future Enhancements

### Planned Features
1. **Real-time Sync**: Live settings synchronization across devices
2. **Advanced Analytics**: Machine learning insights in progress reports
3. **Custom Notifications**: User-defined notification rules
4. **Data Export**: Multiple format support (PDF, CSV, Excel)
5. **Accessibility Improvements**: Voice control integration

### API Integration
Settings screens are designed for easy backend integration:

```typescript
// Example API service integration
class SettingsService {
  async getNotificationSettings(): Promise<NotificationSetting[]> {
    // API call implementation
  }
  
  async updateNotificationSettings(settings: NotificationSetting[]): Promise<void> {
    // API call implementation
  }
}
```

## Related Documentation

- **[Academy Theme System](../THEME_SYSTEM.md)** - Theming guidelines
- **[Component Library](../components/README.md)** - Shared component reference
- **[Navigation](../architecture/NAVIGATION.md)** - Navigation patterns
- **[Development Guide](../development/DEVELOPMENT_GUIDE.md)** - Development workflow

---

**Last Updated**: August 28, 2025  
**Implementation Status**: Complete ✅  
**Production Ready**: Yes ✅