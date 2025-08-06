# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Architecture

This is a monorepo containing mobile applications for the Academy Management System:

- **academy-instructors-app/**: React Native/Expo app for tutors and program coordinators
- **academy-students-app/**: React Native/Expo app for students and parents/guardians  
- **shared/**: Common components, utilities, API client, and TypeScript types

## Important: Rebuilding Strategy

**CRITICAL**: Both apps contain `existing-code/` directories with working features that serve as **reference implementations**:

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

The goal is to rebuild the apps with modern architecture while maintaining feature parity with the existing implementations.

Both apps use a feature-based architecture with:
- **core/**: Base components, config, hooks, navigation, providers
- **features/**: Feature modules (auth, attendance, classroom, performance, scheduling, students)
- **shared/**: Cross-app components and services
- **services/**: API client and service layer

The apps connect to a FastAPI backend (from ../academy-admin/backend) with JWT authentication and role-based access control.

## Technology Stack (Updated January 2025)

- **React**: 19.1.0
- **React Native**: 0.80.2
- **Expo SDK**: 53.0.0
- **TypeScript**: 5.9.2
- **React Navigation**: 6.x
- **State Management**: Zustand 5.0.7
- **Forms**: React Hook Form 7.62.0
- **Testing**: Jest 30.0.5 with React Native Testing Library
- **Linting**: ESLint 8.57.0 with TypeScript support
- **Formatting**: Prettier 3.4.2 with Husky pre-commit hooks

## Development Commands

### Installation & Setup
```bash
# Install all dependencies
npm run install:all

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
# Start both apps (with dev-client)
npm run dev:all

# Individual apps
npm run dev:instructor    # Uses dev-client by default
npm run dev:student      # Uses dev-client by default

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

**Note**: Individual app `.gitignore` and `.eslintrc.js` files have been removed to avoid duplication.

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

## Development Best Practices

1. **Reference existing-code/ first** - Always check existing implementations before building new features
2. **Maintain consistency** - Follow patterns established in existing-code/ for UI, navigation, and state management
3. **Always run `npm run type-check:all` before committing**
4. **Use exact dependency versions** - no carets or tildes
5. **Follow the established path aliases** (@shared/*, @/*)
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
    const [users, posts] = await Promise.all([
      api.getUsers(),
      api.getPosts()
    ]);
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
  immer((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    updateUser: (updates) => set((state) => {
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
2. **Design optimal architecture** - Plan the feature with modern patterns (Zustand, React 19, feature-based structure)
3. **Extract shared components** - Put reusable logic in shared/ package for both apps
4. **Rebuild with latest dependencies** - Use React 19.1.0, Zustand 5.0.2, React Hook Form 7.62.0
5. **Maintain feature parity** - Ensure the rebuilt feature matches existing functionality
6. **Test thoroughly** - Verify the rebuilt feature works as expected
7. **Mark for removal** - Once rebuilt feature is complete and tested, existing-code/ can be removed

**Important**: Never modify files in existing-code/ - they are read-only reference implementations.