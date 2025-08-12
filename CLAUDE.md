# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
repository.

## Project Architecture

This is a monorepo containing mobile applications for the Academy Management System:

- **academy-instructors-app/**: React Native/Expo app for tutors and program coordinators
- **academy-students-app/**: React Native/Expo app for students and parents/guardians
- **shared/**: Common components, utilities, API client, and TypeScript types

## Important: Rebuilding Strategy

**CRITICAL**: Both apps contain `existing-code/` directories with working features that serve as
**reference implementations**:

### Academy Instructors App (existing-code/) - Reference Only

- **Complete authentication system** with AuthContext
- **Student management features** (attendance, performance tracking, scheduling)
- **Classroom management** with calendar integration
- **UI components** (forms, modals, charts)
- **Navigation setup** with React Navigation
- **State management** using Redux Toolkit
- **Asset library** with fonts, icons, and images

### Academy Students App (existing-code/) - Reference Only

- **Student portal features** (course booking, progression tracking)
- **Payment processing** integration
- **Profile management** for students and parents
- **Course catalog** and booking system
- **Progress tracking** and analytics
- **Native Android build** configuration

**Development Approach**:

1. **Reference existing-code/ implementations** - Study the working features and patterns
2. **Rebuild optimally in main src/ directories** - Using latest dependencies and best practices
3. **Extract common functionality to shared/** - For code reuse between apps
4. **DO NOT modify existing-code/** - These are reference implementations only
5. **Plan to remove existing-code/** - Once all features are rebuilt and tested

The goal is to rebuild the apps with modern architecture while maintaining feature parity with the
existing implementations.

## 🎨 CRITICAL: Theme System Usage (January 2025)

**⚠️ IMPORTANT**: The Academy Apps use a specific theme structure. Always use these exact variable names:

### **Academy Purple (Brand Color)**
```typescript
// ✅ CORRECT - Academy brand purple (#4F2EC9)
theme.colors.interactive.primary

// ❌ WRONG - These DO NOT exist:
theme.colors.primary.main
theme.colors.academy.purple[500]
```

### **Common Theme Variables**
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
theme.typography.fontSize.body      // 16px
theme.fontConfig.fontWeight.medium  // '500'
theme.borderRadius.lg               // 12px
```

### **Implementation Pattern**
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

## ✅ Enhanced Components (January 2025)

The shared component library has been enhanced with Academy-themed, instructor-specific components:

### Enhanced UI Components
- **Header**: Academy themed with instructor actions (search, filter, notifications)
- **StudentCard**: Performance indicators, attendance status, quick actions for instructors
- **InstructorDashboard**: Comprehensive dashboard with metrics, charts, and activity feeds
- **PerformanceChart**: Academy themed analytics charts with interactive features

### Enhanced Form Components
- **CustomInput**: Refined validation, accessibility, and Academy theming
- **CustomButton**: All 11 Academy button variants with loading states and icons

### Key Features
- **Academy Theming**: Full integration with design system colors, typography, spacing
- **Instructor Utilities**: Quick attendance, grading, parent contact, student management
- **Program Context**: Automatic filtering and role-based access control
- **Accessibility**: Full ARIA support, proper touch targets, screen reader compatibility
- **TypeScript**: Complete type safety with exported interfaces

All components are exported from `@academy/mobile-shared` and maintain feature parity with existing implementations while adding modern functionality.

Both apps use a feature-based architecture with:

- **core/**: Base components, config, hooks, navigation, providers
- **features/**: Feature modules (auth, attendance, classroom, performance, scheduling, students)
- **shared/**: Cross-app components and services
- **services/**: API client and service layer

The apps connect to a FastAPI backend (from ../academy-admin/backend) with JWT authentication and
role-based access control.

## Technology Stack (Updated January 2025)

- **React**: 19.1.1
- **React Native**: 0.80.2
- **Expo SDK**: 53.0.0
- **TypeScript**: 5.9.2
- **React Navigation**: 6.x with @react-navigation/native-stack
- **State Management**: Zustand 5.0.7
- **Forms**: React Hook Form 7.62.0
- **Icons**: @expo/vector-icons (Ionicons)
- **Charts**: react-native-chart-kit with react-native-svg
- **Testing**: Jest 30.0.5 with React Native Testing Library
- **Linting**: ESLint 8.57.0 with TypeScript support
- **Formatting**: Prettier 3.4.2 with Husky pre-commit hooks
- **Monorepo**: react-native-monorepo-config for proper module resolution

## Development Commands

### Installation & Setup

```bash
# Install all dependencies
npm install

# Fresh start (clean and reinstall everything)
npm run dev:fresh

# Complete reset (nuclear option)
npm run reset

# Individual apps
npm run install:instructor
npm run install:student
npm run install:shared
```

### Development

```bash
# Start individual apps (recommended for testing)
cd academy-instructors-app
npx expo start --offline

cd academy-students-app  
npx expo start --offline

# Start both apps simultaneously
npm run dev:all

# Docker development
npm run docker:up
```

### Code Quality & Testing

```bash
# Run all tests with coverage
npm run test:all

# Lint all packages
npm run lint:all

# Type check all packages
npm run type-check:all

# Format code
npm run format

# Check formatting
npm run format:check

# Pre-commit checks (runs automatically on git commit)
npm run pre-commit
```

### Building & Deployment

```bash
# Build both apps for development
npm run build:all

# EAS builds (individual apps)
cd academy-instructors-app
npm run build:development
npm run build:preview
npm run build:production

# Deploy to Expo
npm run deploy
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

## Multi-Program Context System

The mobile apps now support multi-program academies with automatic program context switching:

### 🔗 Key Components (in `/shared/src/components/program/`)

**ProgramContextProvider**: Wraps the entire app to provide program context

```typescript
import { ProgramContextProvider } from '@shared';

export default function App() {
  return (
    <ProgramContextProvider>
      {/* Your app content */}
    </ProgramContextProvider>
  );
}
```

**ProgramSelector**: UI component for switching between programs

```typescript
import { ProgramSelector } from '@shared';

// Different variants available
<ProgramSelector variant="button" />     // Simple button
<ProgramSelector variant="dropdown" />   // Dropdown style
<ProgramSelector variant="card" />       // Card style
```

**ProgramGuard**: Protects content based on user roles

```typescript
import { ProgramGuard } from '@shared';

// Require specific role
<ProgramGuard requiredRole="program_coordinator">
  <CoordinatorFeatures />
</ProgramGuard>

// Require minimum role level
<ProgramGuard minimumRoleLevel="tutor">
  <InstructorFeatures />
</ProgramGuard>
```

**useProgramContext**: Hook for accessing program data

```typescript
import { useProgramContext } from '@shared';

function MyComponent() {
  const {
    currentProgram, // Current program object
    availablePrograms, // Array of available programs
    switchProgram, // Function to switch programs
    isLoading, // Loading state
  } = useProgramContext();

  // Your component logic
}
```

### 🎯 Integration Steps

1. **Wrap App with Provider** (in `App.tsx`):

```typescript
import { ProgramContextProvider, ThemeProvider } from '@shared';

export default function App() {
  return (
    <ThemeProvider>
      <ProgramContextProvider>
        <NavigationContainer>
          {/* Your navigation */}
        </NavigationContainer>
      </ProgramContextProvider>
    </ThemeProvider>
  );
}
```

2. **Add Program Selector to Navigation** (recommended in header):

```typescript
import { ProgramSelector } from '@shared';

function HeaderComponent() {
  return (
    <View style={styles.header}>
      <ProgramSelector variant="button" />
    </View>
  );
}
```

3. **Protect Role-Specific Content**:

```typescript
// Instructor App - coordinator-only features
<ProgramGuard requiredRole="program_coordinator">
  <StudentManagement />
</ProgramGuard>

// Student App - parent-only features
<ProgramGuard requiredRole="parent">
  <ChildProgressView />
</ProgramGuard>
```

4. **Use Program Context in Data Fetching**:

```typescript
import { useProgramContext } from '@shared';

function StudentsScreen() {
  const { currentProgram } = useProgramContext();

  // API calls automatically include program context via X-Program-Context header
  const { data: students } = useQuery(['students', currentProgram?.id],
    () => api.get('/students') // Filtered by program automatically
  );

  return (
    <ProgramGuard minimumRoleLevel="tutor">
      {/* Your component */}
    </ProgramGuard>
  );
}
```

### 🔒 Automatic Features

- **API Header Injection**: All API requests automatically include `X-Program-Context` header
- **Data Filtering**: Backend filters all data by user's current program context
- **Role-Based Access**: Components automatically respect user's role within the current program
- **Persistent Context**: Program selection is stored and restored between app sessions
- **Error Handling**: Graceful fallbacks when programs are unavailable

### 📱 App-Specific Roles

**Instructor App**:

- `tutor` - Basic student interaction
- `program_coordinator` - Enhanced management
- `program_admin` - Full program control
- `super_admin` - System-wide access

**Student App**:

- `student` - Course access and progress
- `parent` - Child monitoring and communication

### 🎨 Theming Integration

All program components use the shared design system:

- Consistent styling across both apps
- Dark/light mode support
- Responsive design
- Accessibility compliance

### 🔄 Migration from Swimming-Only

The existing code in `existing-code/` directories assumes a single swimming program. When rebuilding
features:

1. **Wrap with ProgramContextProvider**
2. **Add ProgramGuard** for role-based features
3. **Use useProgramContext()** instead of hardcoded program assumptions
4. **Test with multiple programs** to ensure proper filtering

### 📋 Example Integration Files

See example implementations:

- **Instructor App**: `/academy-instructors-app/src/components/ProgramIntegrationExample.tsx`
- **Student App**: `/academy-students-app/src/components/ProgramIntegrationExample.tsx`

These show practical usage patterns for both apps.

### 🔧 Troubleshooting

**Program Context Not Loading:**

- Ensure `ProgramContextProvider` wraps your app root
- Check that user is authenticated before using program context
- Verify backend API returns program assignments for the user

**API Requests Not Filtered:**

- Confirm `X-Program-Context` header is being added automatically
- Check that API client is properly configured in auth store
- Verify program context is set before making requests

**Role-Based Guards Not Working:**

- Ensure user has proper role assignments in the backend
- Check that role names match exactly (case-sensitive)
- Verify `ProgramGuard` is getting correct program context

**Performance Issues:**

- Use `ProgramGuard` to conditionally render heavy components
- Implement proper loading states with `isLoading` from context
- Consider memoizing components that depend on program context

**Dependency Resolution Issues:**

- **Module not found errors**: Check if dependency is in correct package.json (shared for runtime,
  root for build tools)
- **Version conflicts**: Ensure only one version of each dependency across all packages
- **Plugin resolution errors**: Build plugins like `expo-build-properties` should be in root
  devDependencies
- **Shared package not found**: Run `npm install` from root to recreate workspace symlinks
- **Expo plugin errors**: Verify plugin is accessible with
  `node -e "console.log(require.resolve('plugin-name'))"`

**Metro Configuration Issues:**

- **Module resolution errors**: Ensure metro.config.js uses proper monorepo configuration
- **Iconify errors**: Use @expo/vector-icons (Ionicons) instead of react-native-iconify
- **Theme variables**: Use `theme.colors.interactive.primary` for Academy purple (#4F2EC9)

**Common Fixes:**

```bash
# Recreate workspace links
npm install

# Clear all caches and reinstall
npm run reset

# Clear metro cache
npx expo start --clear

# Check dependency resolution
cd academy-instructors-app
node -e "console.log(require.resolve('@academy/mobile-shared'))"
```

**Metro Bundler & React Version Issues:**

- **React version mismatch**: Use npm overrides in root package.json to force consistent versions:
  ```json
  "overrides": {
    "react": "19.1.0",
    "react-native-renderer": "19.1.0"
  }
  ```
- **Babel plugin errors**: Ensure all required Babel plugins are installed:
  ```bash
  npm install --save-dev @babel/plugin-transform-template-literals
  ```
- **Network fetch errors**: Use `--offline` flag when behind firewalls:
  ```bash
  npx expo start --offline
  ```

## Monorepo Configuration (Updated January 2025)

The Academy Apps use a properly configured npm workspaces monorepo with react-native-monorepo-config for optimal module resolution.

### Metro Configuration

Both apps use identical metro configurations for consistent module resolution:

```javascript
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// 1. Watch the entire monorepo
config.watchFolders = [workspaceRoot];

// 2. Let Metro know where to resolve packages
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 3. Configure extensions and platforms
config.resolver.platforms = ['ios', 'android', 'native', 'web'];
config.resolver.sourceExts = ['js', 'jsx', 'ts', 'tsx', 'json'];

// 4. Add explicit alias for the shared package
config.resolver.alias = {
  '@academy/mobile-shared': path.resolve(workspaceRoot, 'shared'),
};

// 5. Ensure proper module resolution
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config;
```

## Monorepo Structure

### Configuration File Organization

**Root Level (Centralized):**

- `.eslintrc.js` - Unified linting rules for all packages
- `.prettierrc.js` - Code formatting rules
- `.gitignore` - Global ignore patterns
- `jest.config.js` - Monorepo test configuration
- `tsconfig.json` - Base TypeScript configuration
- `.lintstagedrc.js` - Pre-commit checks
- `.husky/` - Git hooks

**Package Level (App-Specific):**

- `babel.config.js` - Expo-specific build configuration (keep separate)
- `jest-setup.js` - Package-specific test mocks (keep separate)
- `tsconfig.json` - Extends root config with package specifics
- `eas.json` - Expo build configuration
- `package.json` - Package dependencies and scripts

**Note**: Individual app `.gitignore` and `.eslintrc.js` files have been removed to avoid
duplication.

### Dependency Management Strategy

**CRITICAL**: This monorepo uses a **centralized dependency management** approach to ensure version
consistency and proper module resolution:

**Root Level (`package.json`):**

- **Build tools**: `husky`, `lint-staged`, `prettier`, `eslint`, `typescript`
- **Expo plugins**: `expo-build-properties` (build-time plugin used by both apps)
- **Development tools**: `concurrently` for running multiple apps
- **Monorepo tooling**: Configuration and shared tooling

**Shared Package (`shared/package.json`):**

- **Runtime dependencies**: `react@19.1.1`, `react-native@0.80.2`, `expo@53.0.0`
- **Core libraries**: `@react-navigation/*`, `zustand`, `react-hook-form`, `axios`
- **UI components**: `@expo/vector-icons`, `react-native-gesture-handler`, etc.
- **All packages both apps need**: Shared to ensure version consistency

**App Level (`academy-*-app/package.json`):**

- **Only app-specific dependencies**: `@academy/mobile-shared` (workspace link)
- **Build configuration**: `babel-preset-expo`, `eslint-config-expo`, `tailwindcss`
- **Minimal footprint**: Everything else comes from shared or root

**Workspace Resolution:**

- Apps automatically resolve shared dependencies through npm workspace hoisting
- `@academy/mobile-shared` symlinked to `./shared/src/index.ts`
- Build plugins (like `expo-build-properties`) available from root node_modules
- No version conflicts between apps

**DO NOT:**

- Add runtime dependencies directly to app package.json files
- Duplicate dependencies across packages
- Use different versions of the same dependency

**DO:**

- Add new runtime dependencies to `shared/package.json`
- Add build tools to root `package.json`
- Keep apps lean with only essential app-specific dependencies

### TypeScript Configuration

- Root `tsconfig.json` provides base configuration
- Each package extends the root config with specific settings
- Project references enable fast builds and better IDE support

### ESLint Configuration

- Unified `.eslintrc.js` at root with React Native specific rules
- Automatic fixing on save and pre-commit
- TypeScript-aware linting

### Testing Strategy

- Jest configured for monorepo with separate projects
- Shared setup files for consistent mocking
- Coverage reporting across all packages
- Automatic test running on file changes

## Shared Resources

The `/shared` directory contains:

- **API Client**: Unified authentication and program context handling
- **Types**: TypeScript definitions from backend schemas
- **Components**: Reusable UI components (forms, buttons, inputs)
- **Utils**: Common utilities, validators, formatters
- **Hooks**: Shared React hooks (useAuth, useApiClient, useProgramContext)

To sync shared resources to apps:

```bash
npm run sync:shared
```

## CI/CD Pipeline

GitHub Actions workflows:

- **ci.yml** - Runs on every push/PR (lint, test, build)
- **eas-build.yml** - Manual EAS builds for app stores
- **deploy.yml** - Automatic Expo publish on main branch

## Role-Based Architecture

### Instructor App

- **Instructor**: Basic student interaction and progress viewing
- **Program Coordinator**: Enhanced management and reporting capabilities

### Student App

- **Student**: Course access, assignment submission, progress tracking
- **Parent/Guardian**: Child progress monitoring, instructor communication

All data requests automatically include program context based on user role assignments.

## Enhanced Component Usage

The shared package now includes enhanced, Academy-themed components optimized for instructor workflows:

### Using Enhanced Components

```typescript
import {
  Header,
  StudentCard,
  InstructorDashboard,
  PerformanceChart,
  ThemeProvider,
  ProgramContextProvider,
} from '@academy/mobile-shared';

// Wrap your app with providers
function App() {
  return (
    <ThemeProvider>
      <ProgramContextProvider>
        <YourAppContent />
      </ProgramContextProvider>
    </ThemeProvider>
  );
}

// Use enhanced header with instructor actions
<Header
  title="Student Management"
  variant="instructor"
  onSearchPress={handleSearch}
  onFilterPress={handleFilter}
  onNotificationPress={handleNotifications}
  notificationCount={5}
/>

// Use enhanced student cards with quick actions
<StudentCard
  student={studentData}
  variant="detailed"
  enableQuickAttendance={true}
  enableQuickGrading={true}
  onAttendancePress={handleAttendance}
  onPerformancePress={handleGrading}
  onContactParentPress={handleParentContact}
/>

// Use instructor dashboard for overview screens
<InstructorDashboard
  metrics={dashboardMetrics}
  chartData={performanceData}
  recentStudents={students}
  recentActivities={activities}
  onMetricPress={handleMetricClick}
  onStudentPress={handleStudentClick}
/>
```

### Component Migration Guide

When migrating from `existing-code/` components:

1. **HeaderComponent** → `Header` with `variant="instructor"`
2. **StudentCard** → Enhanced `StudentCard` with instructor features
3. **Custom UI** → `InstructorDashboard` for overview screens
4. **Charts** → `PerformanceChart` with Academy theming
5. **Forms** → Enhanced `CustomInput` and `CustomButton`

### Enhanced Features Available

- **Instructor Quick Actions**: Attendance, grading, parent contact
- **Performance Monitoring**: Visual indicators and alerts
- **Program Context**: Automatic filtering and role-based access
- **Academy Theming**: Consistent design system integration
- **Accessibility**: Full ARIA support and screen reader compatibility

See `ENHANCED_COMPONENTS.md` for detailed documentation and examples.

## Development Best Practices

1. **Reference existing-code/ first** - Always check existing implementations before building new
   features
2. **Maintain consistency** - Follow patterns established in existing-code/ for UI, navigation, and
   state management
3. **Always run `npm run type-check:all` before committing**
4. **Use exact dependency versions** - no carets or tildes
5. **Follow the established path aliases** (@shared/_, @/_)
6. **Write tests for new features** - coverage thresholds are enforced
7. **Use the pre-commit hooks** - they catch issues early
8. **Keep environment variables in .env files** - never hardcode URLs or keys

## Modern Syntax & Patterns (2025 Standards)

### React 19 Features

- **Use React Compiler optimizations** - Automatic memoization and optimization
- **Server Components** - When applicable for web builds
- **Enhanced Suspense** - Better loading states and error boundaries
- **New React hooks** - `use()`, `useOptimistic()`, `useFormStatus()`

### TypeScript 5.9+ Features

- **Satisfies operator** - `const config = {...} satisfies Config`
- **Template literal types** - For type-safe string patterns
- **Const assertions** - `as const` for immutable arrays/objects
- **Discriminated unions** - Advanced type narrowing

### Modern JavaScript (ES2024)

```typescript
// Use modern async patterns
const fetchData = async () => {
  try {
    const [users, posts] = await Promise.all([api.getUsers(), api.getPosts()]);
    return { users, posts };
  } catch (error) {
    throw new Error(`Failed to fetch: ${error.message}`);
  }
};

// Optional chaining and nullish coalescing
const userName = user?.profile?.name ?? 'Anonymous';

// Array methods over traditional loops
const activeUsers = users
  .filter(user => user.isActive)
  .map(user => ({ ...user, displayName: user.name.toUpperCase() }));

// Destructuring with defaults
const { theme = 'light', locale = 'en' } = userPreferences;
```

### React Native Modern Patterns

```typescript
// Functional components with proper TypeScript
interface Props {
  user: User;
  onPress?: () => void;
}

const UserCard: React.FC<Props> = ({ user, onPress }) => {
  // Use modern hooks
  const [isLoading, setIsLoading] = useState(false);

  // Custom hooks for logic separation
  const { theme } = useTheme();
  const { mutate: updateUser } = useMutation(updateUserApi);

  // Event handlers with useCallback
  const handlePress = useCallback(() => {
    onPress?.();
  }, [onPress]);

  return (
    <TouchableOpacity onPress={handlePress} style={[styles.card, { backgroundColor: theme.cardBg }]}>
      <Text style={styles.name}>{user.name}</Text>
    </TouchableOpacity>
  );
};
```

### Zustand Modern Patterns

```typescript
// Type-safe store with immer
interface AppStore {
  user: User | null;
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
}

const useAppStore = create<AppStore>()(
  immer(set => ({
    user: null,
    setUser: user => set({ user }),
    updateUser: updates =>
      set(state => {
        if (state.user) {
          Object.assign(state.user, updates);
        }
      }),
  }))
);
```

### React Hook Form with TypeScript

```typescript
interface FormData {
  email: string;
  password: string;
}

const LoginForm = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  const onSubmit = (data: FormData) => {
    // Handle form submission
  };

  return (
    <Controller
      control={control}
      name="email"
      render={({ field }) => (
        <CustomInput
          {...field}
          error={errors.email?.message}
          placeholder="Email"
        />
      )}
    />
  );
};
```

### Navigation with TypeScript

```typescript
// Type-safe navigation
type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  Settings: { section?: string };
};

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
```

## Working with Existing Features

### Key Files to Reference

**Instructor App (existing-code/):**

- `src/auth/AuthContext.tsx` - Authentication patterns
- `src/screens/home/` - Main feature screens
- `src/components/` - Reusable UI components
- `src/redux/` - State management patterns
- `src/routes/` - Navigation structure

**Student App (existing-code/):**

- `src/screens/home/` - Student portal features
- `src/components/` - Form and UI components
- `src/redux/` - State management (auth, progression)
- `android/` - Native build configuration

### Rebuilding Strategy

When rebuilding features from existing-code/ into main src/ directories:

1. **Study existing-code/ implementation** - Understand the current feature and its patterns
2. **Design optimal architecture** - Plan the feature with modern patterns (Zustand, React 19,
   feature-based structure)
3. **Extract shared components** - Put reusable logic in shared/ package for both apps
4. **Rebuild with latest dependencies** - Use React 19.1.1, Zustand 5.0.7, React Hook Form 7.62.0
5. **Maintain feature parity** - Ensure the rebuilt feature matches existing functionality
6. **Test thoroughly** - Verify the rebuilt feature works as expected
7. **Mark for removal** - Once rebuilt feature is complete and tested, existing-code/ can be removed

**Important**: Never modify files in existing-code/ - they are read-only reference implementations.
