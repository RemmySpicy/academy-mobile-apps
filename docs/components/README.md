# Academy Components Library

The Academy Mobile Apps feature a comprehensive component library with 90+ shared components designed for educational institutions. All components are built with **mobile-first Academy theming**, accessibility, and TypeScript support. **Production-verified** - all components are actively used in the live applications.\n\n## 📱 Mobile-First Design\n\nAll components are optimized for mobile-first usage with:\n- 🌞 **High contrast support** for outdoor visibility\n- 🤏 **Touch-friendly interactions** with proper tap targets\n- 🔄 **Platform-specific optimizations** (iOS/Android)\n- 📐 **Dynamic safe area support** for modern devices\n- ⚡ **Gesture support** with haptic feedback integration

## 🎯 Component Categories

### 🎨 Design System Components
Core design system elements with Academy branding:

- **[CustomButton](./forms/CustomButton.md)** - Enhanced Academy button with 18 variants, icon support, and comprehensive theming
- **[LoadingSpinner](./ui/LoadingSpinner.md)** - Animated loading indicators with Academy theming
- **[Alert](./ui/Alert.md)** - Toast notifications and alert system with animations
- **[Modal Components](./ui/Modal.md)** - CustomModal, CustomModalWithDot, and BottomSheet with Academy styling
- **[ProfileSwitcherBottomSheet](./profile/ProfileSwitcherBottomSheet.md)** - Multi-profile management with parent-child relationships

### 📝 Form & Selection Components
Comprehensive form system with React Hook Form integration and advanced selection components:

- **[Form Components](./forms/README.md)** - Complete form component documentation
- **[CustomInput](./forms/CustomInput.md)** - Text inputs with validation
- **[CustomCheckBox](./forms/CustomCheckBox.md)** - Checkboxes with Academy theming
- **[SelectOptions](./ui/SelectOptions.md)** - Grid-based selection with multi/single modes and comprehensive variants
- **[FormDropdown](./ui/FormDropdown.md)** - Traditional modal dropdown with search capability
- **[CustomDropdown](./forms/CustomDropdown.md)** - Legacy dropdown selector (use FormDropdown for new implementations)

### 🎓 Academy-Specific Components
Educational institution focused components:

- **[StudentCard](./academy/StudentCard.md)** - Modern student display with progress tracking
- **[ClassroomCard](./academy/ClassroomCard.md)** - Classroom management interface
- **[CourseProgression](./academy/CourseProgression.md)** - Course progress visualization
- **[MyClassroom](./academy/MyClassroom.md)** - Classroom overview component

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

### 📱 Navigation Components
Navigation and layout management components:

- **[Header](./navigation/Header.md)** - Academy header component with program switching and notifications
- **[MenuList](./navigation/MenuList.md)** - Grid-based navigation menus with customizable cards
- **[NavigationHeader](./navigation/NavigationHeader.md)** - Stack navigation headers
- **[BottomSheet](./navigation/BottomSheet.md)** - Bottom sheet interface

### ⚙️ Settings System Components
Comprehensive user preferences management with persistent storage:

- **[SettingsCard](./settings/SettingsCard.md)** - Interactive setting items with icons and variants
- **[SettingsSection](./settings/SettingsSection.md)** - Organized setting groups with animations
- **[SettingsSwitch](./settings/SettingsSwitch.md)** - Themed toggle switches for preferences
- **[SettingsPicker](./settings/SettingsPicker.md)** - Modal-based option selectors with search
- **[Settings Store](./settings/SettingsStore.md)** - Zustand store with 5 categories and AsyncStorage persistence

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

### 🏆 Gamification Components
Achievement and progress tracking system for enhanced student engagement:

- **[AchievementsScreen](./gamification/AchievementsScreen.md)** - Comprehensive achievement system with progress tracking, rarity levels, and category filtering
- **[Achievement Components](./gamification/AchievementComponents.md)** - Individual achievement cards, progress bars, and status indicators
- **[Gamification System](./gamification/GamificationSystem.md)** - Points system, rarity hierarchy, and motivational elements

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

All Academy components include:

- **Screen Reader Support**: Proper accessibility labels and hints
- **Keyboard Navigation**: Full keyboard support with focus management
- **Color Contrast**: WCAG 2.1 AA compliant color combinations
- **Touch Targets**: Minimum 44px touch targets for mobile accessibility
- **Focus Indicators**: Clear focus states with Academy theming

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