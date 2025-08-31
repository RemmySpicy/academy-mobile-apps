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

The apps connect to a FastAPI backend (from ../academy-admin/backend) with JWT authentication and role-based access control.

## 📖 Documentation Structure

### Core Documentation:
- **📋 [Development Guide](./docs/development/DEVELOPMENT_GUIDE.md)** - Setup, commands, environment configuration
- **🎨 [Theme System](./docs/THEME_SYSTEM.md)** - Complete theming reference
- **🏗️ [System Overview](./docs/architecture/SYSTEM_OVERVIEW.md)** - High-level architecture
- **🔐 [Authentication](./docs/authentication/README.md)** - Auth system and roles

### Advanced Features:
- **🎯 [Multi-Program Context](./docs/architecture/MULTI_PROGRAM_CONTEXT.md)** - Program switching system
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

### Selection Component Guidelines
The Academy Apps provide comprehensive selection components for different use cases:

#### **SelectOptions** - Grid-based selection
```typescript
import { SelectOptions } from '@academy/mobile-shared';

// For skill levels, program types, visual option grids
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

#### **FormDropdown** - Traditional dropdown
```typescript
import { FormDropdown } from '@academy/mobile-shared';

// For form fields, large option sets, instructor selection
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

**Selection Component Usage Rules:**
- **SelectOptions**: Use for visual grids (2-8 options), skill levels, program selection
- **FormDropdown**: Use for forms, large option sets (10+ options), instructor/student selection
- **Always provide titles/labels** for accessibility and user clarity
- **Use search capability** for option sets larger than 10 items
- **Follow Academy theming** with `theme.colors.interactive.primary` for selections

#### Available Utilities
- **Date Utilities**: `getDateRange`, `formatDate`, `isToday`, `getStartOfWeek`, `getMonthBoundaries`, `isDateInRange`
- **Style Utilities**: `getContainerStyles`, `getActionButtonStyles`, `getDayBoxStyles`, `createControlCardStyles`
- **Type Definitions**: All utility functions include comprehensive TypeScript interfaces

### Menu System Implementation
The Academy Apps feature comprehensive menu systems with production-ready screens, tailored for each user type:

#### **Student App Menu Features**
- **Settings Screens**: Notification settings, privacy settings, about screen
- **Academy Features**: Courses, services, achievements, store, transactions, referrals
- **Quick Access**: Schedule, achievements, store with visual cards
- **Profile Management**: Student/parent mode switching, profile editing

#### **Instructor App Menu Features**
- **Instructor Tools**: Class management, student reports, attendance tracker, grade book
- **Professional Features**: Lesson plans, communication tools, analytics, resources
- **Quick Access**: Today's classes, take attendance, grade book
- **Professional Development**: Training resources and certification programs
- **Profile Management**: Instructor/coordinator role display, professional credentials

All screens are built with:
- Academy design system compliance
- Full TypeScript interfaces
- Accessibility support
- Mobile-first responsive design
- Interactive components and state management

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