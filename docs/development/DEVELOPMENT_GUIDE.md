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

**✅ PHASE 4 COMPLETE** - Component extraction from existing code is **100% FINISHED**

### Total Components: **49+ Production-Ready Components**

The Academy Apps now feature a comprehensive shared component library:

- **Phase 1**: Core UI Components (10 components)
- **Phase 2**: Enhanced UI Components (4 components)  
- **Phase 3**: Academy Core Components (3 components)
- **Phase 4**: Enhanced UI Components (4 components) ✅ **JUST COMPLETED**
  - Button (9 variants, icon support)
  - FilterBar (advanced filtering interface)
  - StudentListCard (generalized student display)
  - Lessons (comprehensive lesson management)
- **Supporting Systems**: Search, Calendar, Performance, Scheduling, Forms (+28 components)

### Testing Components
```bash
# Test all components in ExtractedComponentsShowcase
cd shared && npx expo start

# Navigate to "UI" section to see Phase 4 components in action
# Interactive demos available for all 49+ components
```

## Development Best Practices

1. **Use shared components** - Import from `@academy/mobile-shared` (49+ available)
2. **Follow Academy theming** - Use `theme.colors.interactive.primary` (#4F2EC9)
3. **Component extraction complete** - existing-code/ can now be safely removed
4. **Test your changes** - Run `npm run test` before committing
5. **Use exact dependency versions** - no carets or tildes
6. **Write tests for new features** - coverage thresholds are enforced
7. **Use the pre-commit hooks** - they catch issues early
8. **Keep environment variables in .env files** - never hardcode URLs or keys