# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Architecture

This is a monorepo containing mobile applications for the Multi-Program Academy Management System, supporting diverse programs including swimming, football, basketball, music, coding, and other specialized programs:

- **instructors-app/**: React Native/Expo app for tutors and program coordinators
- **students-app/**: React Native/Expo app for students and parents/guardians
- **shared/**: Common components, utilities, API client, and TypeScript types

## Important: Rebuilding Strategy

**CRITICAL**: Both apps contain `existing-code/` directories with working features that serve as **reference implementations**:

### Development Approach:

1. **Reference existing-code/ implementations** - Study the working features and patterns
2. **Rebuild optimally in main src/ directories** - Using latest dependencies and best practices
3. **Extract common functionality to shared/** - For code reuse between apps
4. **DO NOT modify existing-code/** - These are reference implementations only
5. **Plan to remove existing-code/** - Once all features are rebuilt and tested

The goal is to rebuild the apps with modern architecture while maintaining feature parity with the existing implementations.

## 🎨 CRITICAL: Theme System Usage

**⚠️ IMPORTANT**: The Academy Apps use a **mobile-first optimized** theme structure. Always use these exact variable names:

### Academy Purple (Brand Color)
```typescript
// ✅ CORRECT - Academy brand purple (#4F2EC9)
theme.colors.interactive.primary

// 🌞 NEW - High contrast variants for outdoor mobile use
theme.colors.interactive.primaryHighContrast  // Enhanced contrast
theme.colors.interactive.primarySunlight      // Maximum contrast

// ❌ WRONG - These DO NOT exist:
theme.colors.primary.main
theme.colors.academy.purple[500]
```

### Common Theme Variables
```typescript
// Colors
theme.colors.interactive.primary     // Academy purple #4F2EC9
theme.colors.text.primary           // Main text
theme.colors.text.secondary         // Secondary text
theme.colors.background.primary     // Main background
theme.colors.background.secondary   // Card backgrounds
theme.colors.border.primary         // Default borders
theme.colors.status.error           // Error states

// 🌞 NEW - High contrast status colors
theme.colors.status.errorHighContrast    // Enhanced error visibility
theme.colors.status.successHighContrast  // Enhanced success visibility

// Spacing
theme.spacing.xs                    // 4px
theme.spacing.sm                    // 8px  
theme.spacing.md                    // 16px
theme.spacing.lg                    // 24px

// Typography
theme.fontSizes.base                // 16px
theme.fontConfig.fontWeight.medium  // '500'
theme.borderRadius.lg               // 12px
```

### 📱 Mobile-First Features
```typescript
// Mobile breakpoints (preferred over web breakpoints)
theme.tokens.breakpoints.mobile.phone       // 375px
theme.tokens.breakpoints.mobile.tablet      // 768px
theme.tokens.breakpoints.mobile.foldable    // 673px

// Touch interactions
theme.safeArea.mobile.swipeThreshold     // 48px swipe minimum
theme.safeArea.mobile.longPressDelay     // 500ms long press
theme.safeArea.haptic.selection          // Haptic feedback types

// Dynamic safe areas (recommended)
theme.safeArea.dynamic.top      // Runtime top inset
theme.safeArea.dynamic.bottom   // Runtime bottom inset

// Mobile animations
theme.tokens.animation.mobile.swipe       // 200ms swipe
theme.tokens.animation.mobile.transition  // 250ms transitions
```

### Implementation Pattern
```typescript
import { useTheme } from '@academy/mobile-shared';

const createStyles = (theme: any) => StyleSheet.create({
  button: {
    backgroundColor: theme.colors.interactive.primary, // Academy purple
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  }
});

const MyComponent = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  // ...
};
```

**📖 Full Documentation**: See `/docs/THEME_SYSTEM.md` for complete reference including mobile-first features.\n\n### 📱 Mobile-First Usage Recommendations\n- **Use high contrast variants** (`primarySunlight`) for outdoor visibility\n- **Leverage dynamic safe areas** instead of static constants when possible\n- **Include haptic feedback** with `theme.safeArea.haptic.*` constants\n- **Use mobile breakpoints** for device-specific layouts\n- **Consider gesture support** with proper touch thresholds

## Feature-Based Architecture

Both apps use a feature-based architecture with:

- **features/**: Feature modules (auth, attendance, classroom, performance, scheduling, students, menu) - designed to work across all program types
- **navigation/**: App navigation components with tab-based structure
- **services/**: API client and service layer
- **components/**: App-specific components

### App Navigation Structure

#### **Students App Navigation**
- Home → Bookings → Progress → Menu (+ Dev tabs in development)

#### **Instructors App Navigation** 
- Dashboard → Students → Attendance → Performance → Classroom → Menu (+ Dev tabs in development)

> **📝 Recent Change**: Courses moved from primary tab navigation to menu system for cleaner UX

#### **Navigation Header Configuration**

**Header Management Strategy:**
- **Menu Screens**: Inherit headers from MenuNavigator with screen titles
- **Detail Screens**: Use custom headers with contextual information (e.g., "50m Breaststroke")
- **Nested Navigators**: Configure `headerShown: false` in parent navigator to prevent duplicates

**Implementation Pattern:**
```typescript
// Parent navigator - hide header for nested navigators
<Stack.Screen 
  name="Performance" 
  component={PerformanceNavigator}
  options={{ headerShown: false }}
/>

// Child navigator - handle own headers
<Stack.Screen 
  name="SwimmingPerformanceDetail" 
  component={SwimmingPerformanceDetailScreen}
  options={{ headerShown: false }} // Uses custom header
/>
```

**Key Rules:**
- Set `headerShown: false` for nested navigators in MenuNavigator
- Detail screens with custom headers should manage their own header display
- Avoid duplicate headers by properly configuring navigation hierarchy

The apps connect to a FastAPI backend (from ../academy-admin/backend) with JWT authentication and role-based access control.

## 📖 Documentation Structure

### Core Documentation:
- **📋 [Development Guide](./docs/development/DEVELOPMENT_GUIDE.md)** - Setup, commands, environment configuration
- **🎨 [Theme System](./docs/THEME_SYSTEM.md)** - Complete theming reference
- **🏗️ [System Overview](./docs/architecture/SYSTEM_OVERVIEW.md)** - High-level architecture
- **🔐 [Authentication](./docs/authentication/README.md)** - Auth system and roles

### Advanced Features:
- **🏆 [Achievement System](./docs/features/achievements/README.md)** - Multi-program achievement system with dynamic generation
- **📊 [Performance System](./docs/features/PERFORMANCE_SYSTEM.md)** - Comprehensive performance tracking with modern UI, charts, and multi-program support
- **🎯 [Multi-Program Context](./docs/architecture/MULTI_PROGRAM_CONTEXT.md)** - Program switching system
- **🎨 [Multi-Program Achievements](./docs/features/achievements/MULTI_PROGRAM_SUPPORT.md)** - Program-specific achievement templates and theming
- **🚀 [Achievements API](./docs/api/ACHIEVEMENTS_API.md)** - Program-aware achievement API integration
- **🔔 [Notifications System](./docs/api/NOTIFICATIONS.md)** - Toast notifications and centralized notification page
- **🔧 [Component Library](./docs/components/README.md)** - Shared component usage
- **🌐 [API Client](./docs/api/API_CLIENT.md)** - Backend integration

### Development Resources:
- **✅ [Production Readiness](./docs/development/PRODUCTION_READINESS_STATUS.md)** - Current status
- **🔧 [TypeScript Fixes](./docs/development/TYPE_SYSTEM_FIXES_SUMMARY.md)** - Recent improvements
- **🚀 [Modernization Guide](./docs/development/MODERNIZATION.md)** - Ecosystem updates

## Key Implementation Notes

### Multi-Program Support
The apps support multiple academy programs (swimming, football, basketball, music, coding, etc.) with automatic context switching. Each program can have its own specific requirements while sharing common functionality. See [Multi-Program Context](./docs/architecture/MULTI_PROGRAM_CONTEXT.md) for integration details.

### Component Usage
All shared components and utilities are exported from `@academy/mobile-shared`. Use Academy-themed components with proper TypeScript interfaces.

### Component Usage
All shared components and utilities are exported from `@academy/mobile-shared`. Use Academy-themed components with proper TypeScript interfaces.

**📖 Full Documentation**: See **[Component Library Documentation](./docs/components/README.md)** for comprehensive component reference, including selection components, form utilities, and Academy-specific components.

#### Available Utilities
- **Date Utilities**: `getDateRange`, `formatDate`, `isToday`, `getStartOfWeek`, `getMonthBoundaries`, `isDateInRange`
- **Style Utilities**: `getContainerStyles`, `getActionButtonStyles`, `getDayBoxStyles`, `createControlCardStyles`
- **Type Definitions**: All utility functions include comprehensive TypeScript interfaces

### Enhanced Profile Card System
The Academy Apps feature a modern, interactive profile card system with advanced UI patterns including cover photo expansion, profile switching, and multi-profile management.

**Key Features:**
- **Interactive Profile Cards**: Cover photo expansion and overlapping profile pictures
- **Profile Switching System**: Multi-profile support with bottom sheet interface
- **Image Expansion Modal**: Full-screen image viewing with touch interactions
- **Academy Integration**: Performance metrics and achievement progress display

**📖 Full Documentation**: See **[Profile System Documentation](./docs/features/PROFILE_SYSTEM.md)** for comprehensive technical details, implementation examples, and UI patterns.

### Booking System Implementation
The Academy Apps feature a comprehensive booking and session management system with enhanced UI components and term progress tracking.

**Key Features:**
- **Enhanced BookingCard Component**: Displays participant info with improved status badges and outline-style action buttons ⭐ **UPDATED**
- **Custom Schedule Type Selector**: Toggle between "My Schedules" and "Facility Schedules" with clean tab design ⭐ **NEW**
- **Term Progress System**: 8-session term tracking with visual progress indicators
- **Participant Management**: Bottom sheet interface for add/remove family members
- **Multi-Program Support**: Works across all academy programs
- **Schedule Flexibility**: One-time and recurring sessions with multi-instructor support

**Recent Enhancements:**
- **Status Badge Styling**: Rounded background badges with proper padding and capitalization
- **Action Button Design**: Outline-style Add/Remove button with people icon for better visual hierarchy
- **Custom Segmented Control**: Academy-themed tab selector inspired by Course Curriculum design patterns

**Implementation**: Home → Bookings → Enhanced BookingCard with custom schedule selector

**📖 Full Documentation**: See **[Booking System Documentation](./docs/features/BOOKING_SYSTEM.md)** for comprehensive technical details, API reference, and implementation examples.

### Menu System Implementation
The Academy Apps feature comprehensive menu systems with production-ready screens, tailored for each user type.

**Key Features:**
- **Enhanced Profile Cards**: Modern cards with cover photo, profile switching, and expansion modals
- **Settings Screens**: Notification settings, privacy settings, about screen
- **Academy Features**: Courses, services, achievements, store, transactions, referrals
- **Professional Tools**: Class management, student reports, attendance tracker (Instructors)
- **Mobile-Optimized**: Modern UI patterns with expandable images, bottom sheets, smooth animations

**📖 Full Documentation**: See **[Menu System Documentation](./docs/features/MENU_SYSTEM.md)** for comprehensive screen details and implementation patterns.

### Course System Implementation
The Academy Apps feature a comprehensive course catalog and detail system with modern enrollment tracking and enhanced curriculum features.

**Key Features:**
- **Course Catalog**: Comprehensive listing with search, filtering, and age-based pricing tiers
- **Course Detail System**: Video introductions, interactive pricing selection, tabbed interface
- **Enhanced Curriculum**: 3-star instructor grading system with hierarchical lesson structure ⭐ NEW
- **Enrollment Integration**: Streamlined enrollment flow with pricing tier data
- **Mobile-Optimized**: Touch-friendly interactions with swipeable filters and smooth animations

**Implementation**: Menu → Our Courses → Course Detail → Enrollment Flow

**📖 Full Documentation**: See **[Course System Documentation](./docs/features/COURSE_SYSTEM.md)** for comprehensive technical details, pricing systems, and curriculum features.

### Development Commands
```bash
# Install dependencies
npm install

# Start development
cd instructors-app && npx expo start --offline
cd students-app && npx expo start --offline

# Type checking (ALWAYS run before commits)
npm run type-check:all

# Testing
npm run test:all
```

## Technology Stack

- **React**: 19.0.0 with React Native 0.79.5
- **Expo SDK**: 53.0.20 
- **TypeScript**: 5.8.3 (Production ready, zero errors)
- **State Management**: Zustand 5.0.7 with Immer
- **Navigation**: React Navigation 6.x with type safety
- **Forms**: React Hook Form 7.62.0 with yup validation
- **Icons**: @expo/vector-icons (Ionicons)
- **Charts**: react-native-gifted-charts v1.4.0 (React 19 compatible)
- **Animation**: React Native Reanimated v3.17.4
- **Monorepo**: npm workspaces with Metro configuration

## Production Status

**✅ FULLY PRODUCTION READY** - All core systems are complete:

- ✅ Theme system with Academy branding
- ✅ Authentication with JWT and program context
- ✅ **85+ shared components with TypeScript interfaces and utility functions (production-verified)**
- ✅ Modern chart system (React 19 compatible)
- ✅ Type-safe navigation and state management
- ✅ Both apps building and running successfully
- ✅ **Complete component extraction from existing code finished**
- ✅ **Complete menu system with all settings screens implemented**
- ✅ **Enhanced Profile Card System with expandable images and profile switching**
- ✅ **ProfileSwitcherBottomSheet component for multi-user support**
- ✅ **Multi-Program Achievement System with 7+ program types and 25+ achievements each**
- ✅ **Dynamic program-aware achievement generation with contextual theming**
- ✅ **Modern UI patterns: image expansion modals, overlapping layouts, smooth animations**

## Development Best Practices

1. **Reference existing-code/ first** - Always check existing implementations
2. **Use exact theme variables** - Follow Academy design system
3. **Run type checking** - `npm run type-check:all` before commits
4. **Feature-based organization** - Group by feature, not by file type
5. **Shared components** - Use `@academy/mobile-shared` for reusable code and utility functions
6. **Program context** - Implement multi-program support in new features

## Working with Existing Features

When rebuilding features from `existing-code/`:

1. **Study the existing implementation** - Understand current patterns
2. **Plan modern architecture** - Use current tech stack and patterns
3. **Extract to shared/** - Put reusable components in shared package
4. **Maintain feature parity** - Ensure rebuilt features match functionality
5. **Test thoroughly** - Verify rebuilt features work as expected

---

**For detailed implementation guides, see the [docs directory](./docs/) for comprehensive documentation on all aspects of the Academy Mobile Apps.**