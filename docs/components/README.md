# Academy Components Library

The Academy Mobile Apps feature a comprehensive component library with 85+ shared components designed for educational institutions. All components are built with **mobile-first Academy theming**, accessibility, and TypeScript support. **Production-verified** - all components are actively used in the live applications.\n\n## 📱 Mobile-First Design\n\nAll components are optimized for mobile-first usage with:\n- 🌞 **High contrast support** for outdoor visibility\n- 🤏 **Touch-friendly interactions** with proper tap targets\n- 🔄 **Platform-specific optimizations** (iOS/Android)\n- 📐 **Dynamic safe area support** for modern devices\n- ⚡ **Gesture support** with haptic feedback integration

## 🎯 Component Categories

### 🎨 Design System Components
Core design system elements with Academy branding:

- **[CustomButton](./forms/CustomButton.md)** - Enhanced Academy button with 18 variants, icon support, and comprehensive theming
- **[LoadingSpinner](./ui/LoadingSpinner.md)** - Animated loading indicators with Academy theming
- **[Alert](./ui/Alert.md)** - Toast notifications and alert system with animations
- **[Modal Components](./ui/Modal.md)** - CustomModal, CustomModalWithDot, and BottomSheet with Academy styling

### 📝 Form & Selection Components
Comprehensive form system with React Hook Form integration and advanced selection components:

- **[Form Components](./forms/README.md)** - Complete form component documentation
- **[CustomInput](./forms/CustomInput.md)** - Text inputs with validation
- **[CustomCheckBox](./forms/CustomCheckBox.md)** - Checkboxes with Academy theming
- **[SelectOptions](./ui/SelectOptions.md)** - Grid-based selection with multi/single modes and comprehensive variants
- **[FormDropdown](./ui/FormDropdown.md)** - Traditional modal dropdown with search capability
- **[CustomDropdown](./forms/CustomDropdown.md)** - Legacy dropdown selector (use FormDropdown for new implementations)

#### **Selection Component Usage Guidelines** ⭐ RECOMMENDED

**SelectOptions** - Grid-based visual selection:
```typescript
import { SelectOptions } from '@academy/mobile-shared';

// For skill levels, program types, visual option grids (2-8 options)
<SelectOptions
  title="Swimming Level"
  options={['Beginner', 'Intermediate', 'Advanced']}
  value={selectedLevel}
  onSelectionChange={setSelectedLevel}
  multiSelect={false}
  size="md"
  variant="filled"
/>
```

**FormDropdown** - Traditional dropdown with search:
```typescript
import { FormDropdown } from '@academy/mobile-shared';

// For form fields, large option sets (10+ options), instructor selection
<FormDropdown
  label="Assign Instructor"
  options={instructorList}
  value={selectedInstructor}
  onSelectionChange={setSelectedInstructor}
  placeholder="Select instructor"
  searchable={true}
  required
/>
```

**Usage Rules:**
- **SelectOptions**: Visual grids, skill levels, program selection (2-8 options)
- **FormDropdown**: Forms, large option sets (10+ options), searchable lists
- **Always provide titles/labels** for accessibility and user clarity
- **Use search capability** for option sets larger than 10 items
- **Follow Academy theming** with `theme.colors.interactive.primary` for selections

### 🎓 Academy-Specific Components
Educational institution focused components:

- **[StudentCard](./academy/StudentCard.md)** - Modern student display with progress tracking
- **[ClassroomCard](./academy/ClassroomCard.md)** - Classroom management interface
- **[CourseProgression](./academy/CourseProgression.md)** - Course progress visualization
- **[StarRating](./academy/StarRating.md)** ⭐ NEW - Instructor grading system with 3-star rating display for lesson performance
- **[MyClassroom](./academy/MyClassroom.md)** - Classroom overview component

### 🏆 Achievement System Components
**Multi-program gamification system with contextual achievements:**

- **[AchievementsScreen](./achievements/AchievementsScreen.md)** - Main achievement screen with program-aware filtering, search, and modals
- **[AchievementCelebration](./achievements/AchievementCelebration.md)** - Animated celebration modal with confetti and sparkles
- **[AchievementNotificationToast](./achievements/AchievementNotificationToast.md)** - Toast notification for achievement progress updates
- **[AchievementLeaderboard](./achievements/AchievementLeaderboard.md)** - Competitive leaderboard with podium display
- **[AchievementsService](./achievements/AchievementsService.md)** - Service layer with program-aware achievement generation

**Multi-Program Support:**
- **7+ Program Types**: Swimming, Basketball, Football, Music, Coding, Dance, Martial Arts
- **Dynamic Generation**: 25+ unique achievements per program with contextual categories
- **Visual Theming**: Program-specific colors, icons, and themes
- **Smart Fallbacks**: Automatic support for custom program types

### 👤 Profile & User Management Components
Advanced profile management with modern UI patterns:

- **[ProfileSwitcherBottomSheet](./profile/ProfileSwitcherBottomSheet.md)** - Multi-profile switching with bottom sheet interface
- **[EnhancedProfileCard](./profile/EnhancedProfileCard.md)** - Interactive profile card with cover photo and expansion modals
- **[ImageExpansionModal](./profile/ImageExpansionModal.md)** - Full-screen image viewer for profile and cover photos

### 📊 Performance Components
Sports and performance tracking components:

- **[WorkoutCard](./performance/WorkoutCard.md)** - Exercise session tracking
- **[PerformanceTimes](./performance/PerformanceTimes.md)** - Time tracking interface
- **[ScoreStatistics](./performance/ScoreStatistics.md)** - Performance analytics
- **[AdvancedMetrics](./performance/AdvancedMetrics.md)** - Advanced performance data

### 🎛️ Control & Management Components
Advanced control interfaces for data management:

- **[ControlCard](./controls/ControlCard.md)** - Enhanced management interface with calendar, filters, and search
- **[FilterComponent](./controls/FilterComponent.md)** - Advanced filtering system
- **[QuickFilter](./controls/QuickFilter.md)** - Quick filter interface
- **[SearchComponent](./controls/SearchComponent.md)** - Search utilities

### 🔍 Search & Filter Components
Complete search system with Academy theming and accessibility:

- **[SearchInput](./search/SearchInput.md)** - Enhanced search input with size variants and loading states
- **[Chip](./ui/Chip.md)** - Unified chip component (consolidated FilterChip and PillTabs)
- **[QuickFilterBar](./search/QuickFilterBar.md)** - Horizontal scrollable filter bar
- **[SearchBar](./search/SearchBar.md)** - Complete search interface with actions
- **[SearchContainer](./search/SearchContainer.md)** - Unified search wrapper component

### 📅 Calendar Components
Comprehensive calendar and scheduling system:

- **[Calendar](./calendar/Calendar.md)** - Main calendar component
- **[DatePicker](./calendar/DatePicker.md)** - Date selection interface
- **[ClassroomCalendar](./calendar/ClassroomCalendar.md)** - Classroom scheduling
- **[StudentProfileCalendar](./calendar/StudentProfileCalendar.md)** - Student-specific calendar

### 🏢 Booking & Scheduling Components ⭐ **NEW**
Comprehensive booking and facility schedule management:

- **[BookingCard](./booking/BookingCard.md)** ⭐ **UNIFIED** - Single component with variants for both personal bookings and facility schedules
- **[ParticipantManagementBottomSheet](./booking/ParticipantManagementBottomSheet.md)** - Participant add/remove interface
- **[BookingsScreen](./booking/BookingsScreen.md)** - Dual schedule system (My Schedules vs Facility Schedules) with day-based filtering

**Unified BookingCard Features:**
- **Dual Variants**: `variant="booking"` for personal bookings, `variant="facility-schedule"` for facility schedules
- **Smart Conditional Rendering**: Automatically shows relevant sections based on variant
- **Availability Tracking**: Progress bars and capacity management for facility schedules
- **Participant Management**: Add/remove family members for personal bookings
- **Status Management**: Status badges and actions for personal bookings
- **Join Actions**: Join/View Details actions for facility schedules
- **Interactive Design**: Touch feedback, animations, and Academy theming
- **DRY Architecture**: Single maintainable component instead of separate components

### 📱 Navigation & Settings Components
Navigation, layout, and settings management components:

- **[Header](./navigation/Header.md)** - Academy header component with program switching and notifications
- **[MenuList](./navigation/MenuList.md)** - Grid-based navigation menus with customizable cards
- **[NavigationHeader](./navigation/NavigationHeader.md)** - Stack navigation headers
- **[BottomSheet](./navigation/BottomSheet.md)** - Bottom sheet interface
- **[SettingCard](./settings/SettingCard.md)** - Settings interface component
- **[CustomSwitch](./settings/CustomSwitch.md)** - Toggle switches for settings

### 🍔 Menu System Components
Complete menu system for both student and instructor applications:

- **[AppMenuScreen](./menu/AppMenuScreen.md)** - Main menu screen with role-based features
- **[MenuNavigator](./menu/MenuNavigator.md)** - Stack navigator for menu screens
- **[Menu Features](./menu/MenuFeatures.md)** - Role-specific menu feature documentation

### 👤 Profile & Account Management Components
Comprehensive user profile and account management system:

- **[EditProfileScreen](./profile/EditProfileScreen.md)** - Enhanced profile editing with cover photo and comprehensive form sections
- **[PaymentMethodsScreen](./payments/PaymentMethodsScreen.md)** - Payment method management with card/PayPal support
- **[ProfilePhotoSystem](./profile/ProfilePhotoSystem.md)** - Dual photo system with cover photo and profile picture
- **[SettingsScreens](./settings/SettingsScreens.md)** - Privacy, notification, and account settings management

### 🔧 Utility Functions
Reusable utility functions for component development:

- **[Date Utilities](./utilities/dateUtils.md)** - Date manipulation and formatting functions
- **[Style Utilities](./utilities/styleUtils.md)** - Dynamic style generation utilities
- **[Control Card Utilities](./utilities/controlCardUtils.md)** - ControlCard-specific helper functions

## 🚀 Quick Start

### Installation

All components are exported from the shared package:

```typescript
import { 
  CustomButton, 
  StudentCard, 
  ControlCard,
  CustomInput, 
  SearchInput,
  SearchContainer,
  Chip,
  Calendar,
  // Selection components
  SelectOptions,
  FormDropdown,
  // Utility functions
  getDateRange,
  formatDate,
  getActionButtonStyles
} from '@academy/mobile-shared';
```

### Basic Usage

```typescript
import React from 'react';
import { View } from 'react-native';
import { 
  CustomButton, 
  StudentCard, 
  useTheme 
} from '@academy/mobile-shared';

export default function ExampleScreen() {
  const { theme } = useTheme();
  
  return (
    <View style={{ padding: theme.spacing.lg }}>
      <StudentCard
        student={{
          id: '1',
          name: 'Emma Johnson',
          level: 'Advanced',
          progress: 85,
          attendance: { attended: 18, absence: 2, sessions: 20 },
          paymentStatus: 'fully-paid',
          tags: ['Star Student']
        }}
        variant="detailed"
        showProgress={true}
        showAttendance={true}
        onPress={(student) => console.log('Student selected:', student.name)}
      />
      
      <CustomButton
        title="View Details"
        variant="primary"
        onPress={() => {}}
        style={{ marginTop: theme.spacing.md }}
      />
    </View>
  );
}
```

## 🎨 Academy Theming

### Theme Integration

All components automatically use the Academy theme system:

```typescript
import { useTheme } from '@academy/mobile-shared';

function ThemedComponent() {
  const { theme } = useTheme();
  
  return (
    <View style={{
      backgroundColor: theme.colors.background.primary,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
    }}>
      {/* Component content */}
    </View>
  );
}
```

### Academy Brand Colors

Components use consistent Academy branding:

- **Primary**: `theme.colors.interactive.primary` (#4F2EC9 Academy purple)
- **Secondary**: `theme.colors.interactive.secondary` (Gray theme)
- **Success**: `theme.colors.status.success` (Green states)
- **Warning**: `theme.colors.status.warning` (Orange alerts)
- **Error**: `theme.colors.status.error` (Red errors)

## 📚 Component Showcase

### Live Component Demos

The academy apps include two showcase screens for testing components:

1. **DesignSystemShowcase** - Core design system elements (buttons, inputs, modals, alerts, loaders)
2. **ExtractedComponentsShowcase** - Feature-specific components (student cards, performance tracking, etc.)

**Modal Component Organization:**
- **Basic Modals** → Design System Showcase (CustomModal, CustomModalWithDot, BottomSheet)
- **Feature Modals** → Extracted Components Showcase (OnboardingModal, StudentProfile, PerformanceTimes)

Access these from your development environment to see all components in action.

## 🔧 Development Guidelines

### Creating New Components

When building new Academy components:

1. **Use Academy Theme System**
   ```typescript
   import { useTheme } from '@academy/mobile-shared';
   
   const { theme } = useTheme();
   ```

2. **Follow TypeScript Interfaces**
   ```typescript
   export interface ComponentProps {
     title: string;
     variant?: 'primary' | 'secondary';
     onPress?: () => void;
   }
   ```

3. **Include Accessibility Support**
   ```typescript
   <TouchableOpacity
     accessibilityLabel="Button description"
     accessibilityRole="button"
     accessibilityHint="Performs action when pressed"
   >
   ```

4. **Export from Shared Package**
   ```typescript
   // shared/src/components/ui/index.ts
   export { default as NewComponent } from './NewComponent';
   export type { NewComponentProps } from './NewComponent';
   ```

### Component Testing

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from '@academy/mobile-shared';

test('component renders with Academy theming', () => {
  const { getByText } = render(
    <ThemeProvider>
      <YourComponent title="Test" />
    </ThemeProvider>
  );
  
  expect(getByText('Test')).toBeTruthy();
});
```

## 🎯 Migration from Legacy Components

### Recent Improvements

- **✅ StudentCard**: Replaced outdated StudentListCard with modern StudentCard
- **✅ CustomButton**: Enhanced with new variants (secondary, ghost, success, warning, info) - now the standard button component  
- **✅ Alert System**: Comprehensive alert system with multiple types and animations
- **✅ LoadingSpinner**: Modern loading states with Academy theming

### Migration Examples

```typescript
// Old approach ❌
import StudentListCard from '../components/ui/StudentListCard';
import { CustomButton } from '../components/forms/CustomButton';

// New approach ✅  
import { StudentCard, CustomButton } from '@academy/mobile-shared';

// Replace StudentListCard with individual StudentCards
{students.map(student => (
  <StudentCard
    key={student.id}
    student={student}
    variant="detailed"
    showProgress={true}
    onPress={handleStudentPress}
  />
))}

// Enhanced CustomButton usage
<CustomButton
  title="Submit"
  variant="primary"
  isLoading={isLoading}
  onPress={handleSubmit}
/>
```

## ♿ Accessibility Features

All Academy components include **comprehensive WCAG 2.1 accessibility support**:

### Core Accessibility Features
- **Screen Reader Support**: Comprehensive accessibility labels, hints, and state information for iOS VoiceOver and Android TalkBack
- **Keyboard Navigation**: Full keyboard support with focus management and logical tab order
- **Color Contrast**: WCAG 2.1 AA compliant color combinations with enhanced high contrast variants
- **Touch Targets**: Minimum 44px touch targets optimized for mobile accessibility
- **Focus Indicators**: Clear focus states with Academy theming and proper focus management

### Enhanced Mobile Accessibility
- **Dynamic Content Announcements**: Proper aria-live regions for real-time status updates
- **Gesture Support**: Alternative interaction methods with haptic feedback integration
- **Reduced Motion Support**: Respects user's motion preferences for animations
- **Text Scaling**: Support for system font size preferences up to 200% scaling

### Implementation Examples
```typescript
// ✅ Comprehensive accessibility implementation
<Pressable
  accessibilityRole="button"
  accessibilityLabel="View achievement details"
  accessibilityHint="Completed achievement worth 100 points. Double tap to view full details and progress"
  accessibilityState={{ 
    selected: isSelected,
    disabled: isDisabled 
  }}
  accessibilityValue={{
    now: progressValue,
    min: 0,
    max: 100,
    text: `${progressValue} percent complete`
  }}
>
  <Text accessibilityRole="text">Achievement Title</Text>
</Pressable>
```

### Accessibility Performance Optimizations
- **Optimized Screen Reader Flow**: Efficient navigation patterns that don't impact performance
- **Smart Focus Management**: Automated focus handling for modal and navigation transitions
- **Accessibility Testing**: Components tested with automated tools and manual testing on real devices

## 📱 Multi-Program Support

Components are designed to work across all Academy programs:

- **Swimming Academies**: Pool-specific metrics and terminology
- **Football Academies**: Field-specific features and tracking
- **Basketball Academies**: Court-specific components
- **Music Academies**: Instrument and practice tracking
- **Coding Academies**: Project and skill progression

## 🔄 Component Lifecycle

### Component States

1. **Development**: In active development
2. **Stable**: Production ready with full testing
3. **Deprecated**: Replaced by newer components (e.g., Enhanced Button → CustomButton)
4. **Legacy**: Maintained for backward compatibility

### Version Management

Components follow semantic versioning with Academy apps:

- **Major**: Breaking changes requiring migration
- **Minor**: New features, backward compatible
- **Patch**: Bug fixes and improvements

## 📚 Related Documentation

- **[Academy Theme System](../THEME_SYSTEM.md)** - Complete theming reference
- **[Design System](../design-system/README.md)** - Academy design principles
- **[Multi-Program Context](../architecture/MULTI_PROGRAM_CONTEXT.md)** - Program-specific features
- **[Development Guide](../development/DEVELOPMENT_GUIDE.md)** - Setup and development workflow

The Academy Components Library provides a comprehensive foundation for building consistent, accessible, and feature-rich educational applications across multiple programs and platforms.