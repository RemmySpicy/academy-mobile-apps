# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Architecture

This is a monorepo containing mobile applications for the Academy Management System:

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

**⚠️ IMPORTANT**: The Academy Apps use a specific theme structure. Always use these exact variable names:

### Academy Purple (Brand Color)
```typescript
// ✅ CORRECT - Academy brand purple (#4F2EC9)
theme.colors.interactive.primary

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

**📖 Full Documentation**: See `/docs/THEME_SYSTEM.md` for complete reference.

## Feature-Based Architecture

Both apps use a feature-based architecture with:

- **features/**: Feature modules (auth, attendance, classroom, performance, scheduling, students)
- **navigation/**: App navigation components
- **services/**: API client and service layer
- **components/**: App-specific components

The apps connect to a FastAPI backend (from ../academy-admin/backend) with JWT authentication and role-based access control.

## 📖 Documentation Structure

### Core Documentation:
- **📋 [Development Guide](./docs/development/DEVELOPMENT_GUIDE.md)** - Setup, commands, environment configuration
- **🎨 [Theme System](./docs/THEME_SYSTEM.md)** - Complete theming reference
- **🏗️ [System Overview](./docs/architecture/SYSTEM_OVERVIEW.md)** - High-level architecture
- **🔐 [Authentication](./docs/authentication/README.md)** - Auth system and roles

### Advanced Features:
- **🎯 [Multi-Program Context](./docs/architecture/MULTI_PROGRAM_CONTEXT.md)** - Program switching system
- **🔧 [Component Library](./docs/components/README.md)** - Shared component usage
- **🌐 [API Client](./docs/api/API_CLIENT.md)** - Backend integration

### Development Resources:
- **✅ [Production Readiness](./docs/development/PRODUCTION_READINESS_STATUS.md)** - Current status
- **🔧 [TypeScript Fixes](./docs/development/TYPE_SYSTEM_FIXES_SUMMARY.md)** - Recent improvements
- **🚀 [Modernization Guide](./docs/development/MODERNIZATION.md)** - Ecosystem updates

## Key Implementation Notes

### Multi-Program Support
The apps support multiple academy programs with automatic context switching. See [Multi-Program Context](./docs/architecture/MULTI_PROGRAM_CONTEXT.md) for integration details.

### Component Usage
All shared components are exported from `@academy/mobile-shared`. Use Academy-themed components with proper TypeScript interfaces.

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
- ✅ **49+ shared components with TypeScript interfaces (Phase 4 Complete)**
- ✅ Modern chart system (React 19 compatible)
- ✅ Type-safe navigation and state management
- ✅ Both apps building and running successfully
- ✅ **Complete component extraction from existing code finished**

### 🚀 Phase 4 Completion Summary:
- **Button Component**: Enhanced with 9 variants, multiple sizes, and icon support
- **FilterBar Component**: Advanced filtering with multi-group support and modal interface
- **StudentListCard Component**: Generalized student display with progress tracking and tags
- **Lessons Component**: Comprehensive lesson management with station-based organization
- **All components fully tested and integrated** with ExtractedComponentsShowcase

## Development Best Practices

1. **Reference existing-code/ first** - Always check existing implementations
2. **Use exact theme variables** - Follow Academy design system
3. **Run type checking** - `npm run type-check:all` before commits
4. **Feature-based organization** - Group by feature, not by file type
5. **Shared components** - Use `@academy/mobile-shared` for reusable code
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