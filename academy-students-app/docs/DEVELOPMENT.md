# Development Guide

This guide covers local development setup, workflows, and best practices for contributing to the Academy Students App.

## 🚀 Quick Start

### Prerequisites

- **Node.js**: 18.x or higher
- **npm**: 8.x or higher 
- **Expo CLI**: Latest version
- **Git**: For version control
- **iOS Simulator** (macOS) or **Android Emulator**
- **Physical device** (optional, recommended for testing)

### Initial Setup

```bash
# 1. Clone the repository
git clone <repository-url>
cd academy-apps

# 2. Install all dependencies
npm run install:all

# 3. Set up environment variables
cp .env.example .env.development

# 4. Start the backend (required for API calls)
cd ../academy-admin
docker-compose up db backend

# 5. Return to students app and start development
cd academy-apps/academy-students-app
npm start
```

### Environment Configuration

Create environment files in the root directory:

```bash
# .env.development
EXPO_PUBLIC_API_URL=http://localhost:8000
EXPO_PUBLIC_ENV=development
EXPO_PUBLIC_DEBUG_MODE=true
EXPO_PUBLIC_ANALYTICS=false
EXPO_PUBLIC_CRASH_REPORTING=false

# .env.staging  
EXPO_PUBLIC_API_URL=https://api-staging.academy.com
EXPO_PUBLIC_ENV=staging
EXPO_PUBLIC_DEBUG_MODE=false
EXPO_PUBLIC_ANALYTICS=true
EXPO_PUBLIC_CRASH_REPORTING=true

# .env.production
EXPO_PUBLIC_API_URL=https://api.academy.com
EXPO_PUBLIC_ENV=production
EXPO_PUBLIC_DEBUG_MODE=false
EXPO_PUBLIC_ANALYTICS=true
EXPO_PUBLIC_CRASH_REPORTING=true
```

## 🛠️ Development Commands

### Core Commands

```bash
# Start development server
npm start                    # Start with dev-client
npm run ios                  # Start iOS simulator
npm run android              # Start Android emulator
npm run web                  # Start web version

# Fresh development start
npm run dev:fresh            # Clean and restart everything
npm run reset                # Nuclear reset (clean all caches)
```

### Code Quality

```bash
# Linting and formatting
npm run lint                 # Run ESLint
npm run lint:fix             # Fix auto-fixable ESLint issues
npm run format               # Format code with Prettier
npm run format:check         # Check if code is properly formatted

# Type checking
npm run type-check           # Run TypeScript compiler checks

# All quality checks
npm run pre-commit           # Run all checks (lint, format, type-check, test)
```

### Testing

```bash
# Run tests
npm test                     # Run all tests
npm run test:watch           # Run tests in watch mode
npm run test:coverage        # Run tests with coverage report
npm run test:debug           # Run tests with debugging enabled

# Specific test types
npm run test:unit            # Run unit tests only
npm run test:integration     # Run integration tests only
npm run test:e2e             # Run end-to-end tests
```

### Building

```bash
# Development builds
npm run build                # Create development build
npm run build:development    # EAS development build
npm run build:preview        # EAS preview build
npm run build:production     # EAS production build

# Deploy
npm run deploy               # Deploy to Expo
```

## 📁 Project Structure Deep Dive

### Feature Organization

Each feature follows this structure:

```
src/features/[feature-name]/
├── components/              # Feature-specific components
│   ├── [Component].tsx     # Individual components
│   └── __tests__/          # Component tests
├── hooks/                  # Feature-specific hooks
│   ├── use[Hook].ts       # Custom hooks
│   └── __tests__/         # Hook tests
├── navigation/             # Feature navigation
│   └── [Feature]Navigator.tsx
├── screens/                # Feature screens
│   ├── [Screen]Screen.tsx # Individual screens
│   └── __tests__/         # Screen tests
├── services/              # Feature API services
│   ├── [feature]Api.ts   # API calls
│   └── __tests__/        # Service tests
├── store/                 # Feature state management
│   ├── [feature]Store.ts # Zustand stores
│   └── __tests__/        # Store tests
└── types/                 # Feature-specific types
    └── index.ts          # Type definitions
```

### Shared Resources

```
src/shared/
├── components/             # Reusable UI components
├── hooks/                 # Shared custom hooks
├── navigation/            # App-wide navigation
├── services/              # Global services (API client, etc.)
├── store/                 # Global state management
├── theme/                 # Design system and theming
├── types/                 # Global TypeScript types
└── utils/                 # Utility functions
```

## 🎨 Styling and Theming

### Theme Usage

All components should use the shared theme system:

```typescript
import { useTheme, createThemedStyles } from '@shared/theme/ThemeProvider';

const MyComponent = () => {
  const { theme } = useTheme();
  const styles = useThemedStyles();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello World</Text>
    </View>
  );
};

const useThemedStyles = createThemedStyles((theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background.primary,
      padding: theme.spacing[4],
      borderRadius: theme.borderRadius.md,
    },
    title: {
      ...theme.typography.heading.h2,
      color: theme.colors.text.primary,
    },
  })
);
```

### Design Tokens

Use design tokens instead of hardcoded values:

```typescript
// ❌ Don't do this
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
});

// ✅ Do this
const useThemedStyles = createThemedStyles((theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background.primary,
      padding: theme.spacing[4],
      borderRadius: theme.borderRadius.md,
      ...theme.typography.body.large,
      color: theme.colors.text.primary,
    },
  })
);
```

### Responsive Design

Use responsive utilities for different screen sizes:

```typescript
import { useResponsive } from '@shared/hooks';

const MyComponent = () => {
  const { isTablet, screenWidth } = useResponsive();
  const styles = useThemedStyles();

  return (
    <View style={[
      styles.container,
      isTablet && styles.tabletContainer,
    ]}>
      {/* Content */}
    </View>
  );
};
```

## 🔧 Development Workflows

### Feature Development

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/course-booking-enhancement
   ```

2. **Set Up Feature Structure**
   ```bash
   mkdir -p src/features/booking/{components,hooks,screens,services,store,types}
   ```

3. **Implement Feature**
   - Start with types and interfaces
   - Create API services
   - Build components and screens
   - Add navigation
   - Write tests

4. **Test Feature**
   ```bash
   npm run test:watch              # Run tests during development
   npm run type-check             # Check TypeScript
   npm run lint                   # Check code quality
   ```

5. **Create Pull Request**
   - Ensure all tests pass
   - Include comprehensive description
   - Add screenshots for UI changes
   - Request appropriate reviewers

### Component Development

1. **Create Component File**
   ```typescript
   // src/features/courses/components/CourseCard.tsx
   import React from 'react';
   import { View, Text, StyleSheet } from 'react-native';
   import { useTheme, createThemedStyles } from '@shared/theme/ThemeProvider';

   interface CourseCardProps {
     title: string;
     description: string;
     onPress?: () => void;
   }

   export const CourseCard: React.FC<CourseCardProps> = ({
     title,
     description,
     onPress,
   }) => {
     const { theme } = useTheme();
     const styles = useThemedStyles();

     return (
       <View style={styles.container}>
         <Text style={styles.title}>{title}</Text>
         <Text style={styles.description}>{description}</Text>
       </View>
     );
   };

   const useThemedStyles = createThemedStyles((theme) =>
     StyleSheet.create({
       container: {
         backgroundColor: theme.colors.background.primary,
         padding: theme.spacing[4],
         borderRadius: theme.borderRadius.md,
       },
       title: {
         ...theme.typography.heading.h3,
         color: theme.colors.text.primary,
       },
       description: {
         ...theme.typography.body.base,
         color: theme.colors.text.secondary,
       },
     })
   );
   ```

2. **Create Component Test**
   ```typescript
   // src/features/courses/components/__tests__/CourseCard.test.tsx
   import { render } from '@testing-library/react-native';
   import { CourseCard } from '../CourseCard';
   import { TestWrapper } from '../../../../test/TestWrapper';

   const renderWithProviders = (props: any = {}) => {
     return render(
       <TestWrapper>
         <CourseCard {...props} />
       </TestWrapper>
     );
   };

   describe('CourseCard', () => {
     it('renders correctly', () => {
       const { getByText } = renderWithProviders({
         title: 'Test Course',
         description: 'Test Description',
       });

       expect(getByText('Test Course')).toBeTruthy();
       expect(getByText('Test Description')).toBeTruthy();
     });
   });
   ```

3. **Export Component**
   ```typescript
   // src/features/courses/components/index.ts
   export { CourseCard } from './CourseCard';
   ```

### API Integration

1. **Define Types**
   ```typescript
   // src/features/courses/types/index.ts
   export interface Course {
     id: string;
     title: string;
     description: string;
     price: number;
     instructor: Instructor;
   }

   export interface GetCoursesRequest {
     search?: string;
     category?: string;
     page?: number;
   }
   ```

2. **Create API Service**
   ```typescript
   // src/features/courses/services/coursesApi.ts
   import { apiClient } from '@shared/services/apiClient';
   import type { Course, GetCoursesRequest } from '../types';

   export class CoursesService {
     async getCourses(params: GetCoursesRequest): Promise<Course[]> {
       try {
         const response = await apiClient.get('/courses', { params });
         return response.data;
       } catch (error) {
         throw new Error('Failed to fetch courses');
       }
     }

     async getCourseById(id: string): Promise<Course> {
       try {
         const response = await apiClient.get(`/courses/${id}`);
         return response.data;
       } catch (error) {
         throw new Error(`Failed to fetch course ${id}`);
       }
     }
   }

   export const coursesService = new CoursesService();
   ```

3. **Create Store**
   ```typescript
   // src/features/courses/store/coursesStore.ts
   import { create } from 'zustand';
   import { coursesService } from '../services/coursesApi';
   import type { Course } from '../types';

   interface CoursesStore {
     courses: Course[];
     isLoading: boolean;
     error: string | null;
     fetchCourses: () => Promise<void>;
     getCourseById: (id: string) => Promise<Course | null>;
   }

   export const useCoursesStore = create<CoursesStore>((set, get) => ({
     courses: [],
     isLoading: false,
     error: null,
     
     fetchCourses: async () => {
       set({ isLoading: true, error: null });
       try {
         const courses = await coursesService.getCourses({});
         set({ courses, isLoading: false });
       } catch (error) {
         set({ 
           error: error instanceof Error ? error.message : 'Unknown error',
           isLoading: false 
         });
       }
     },

     getCourseById: async (id: string) => {
       try {
         const course = await coursesService.getCourseById(id);
         return course;
       } catch (error) {
         set({ error: error instanceof Error ? error.message : 'Unknown error' });
         return null;
       }
     },
   }));
   ```

### Testing Strategies

#### Unit Testing

```typescript
// Component testing
describe('CourseCard', () => {
  it('displays course information correctly', () => {
    const mockCourse = {
      title: 'Swimming Basics',
      description: 'Learn fundamental swimming skills',
    };

    const { getByText } = render(<CourseCard {...mockCourse} />);
    
    expect(getByText('Swimming Basics')).toBeTruthy();
    expect(getByText('Learn fundamental swimming skills')).toBeTruthy();
  });

  it('handles press events', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <CourseCard 
        title="Test Course" 
        description="Test" 
        onPress={onPress}
        testID="course-card"
      />
    );

    fireEvent.press(getByTestId('course-card'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

#### Integration Testing

```typescript
// Navigation testing
describe('Course Navigation', () => {
  it('navigates from course list to course detail', () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <CoursesNavigator />
      </NavigationContainer>
    );

    const courseCard = getByTestId('course-card-1');
    fireEvent.press(courseCard);

    expect(getByTestId('course-detail-screen')).toBeTruthy();
  });
});
```

#### E2E Testing

```typescript
// End-to-end testing with Detox
describe('Course Booking Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should complete course booking', async () => {
    // Navigate to courses
    await element(by.id('courses-tab')).tap();
    
    // Select a course
    await element(by.id('course-card-1')).tap();
    
    // Book the course
    await element(by.id('book-now-button')).tap();
    
    // Fill booking form
    await element(by.id('date-picker')).tap();
    await element(by.text('Tomorrow')).tap();
    
    // Confirm booking
    await element(by.id('confirm-booking-button')).tap();
    
    // Verify success
    await expect(element(by.text('Booking Confirmed!'))).toBeVisible();
  });
});
```

## 🔍 Debugging

### React Native Debugging

```bash
# Enable debugging
npm start
# Then press 'd' in terminal or shake device

# Remote JS debugging
npx react-devtools

# Network inspection
npx react-native log-ios    # iOS logs
npx react-native log-android # Android logs
```

### Expo Debugging

```typescript
// Add to App.tsx for development
if (__DEV__) {
  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'));
}

// ReactotronConfig.ts
import Reactotron from 'reactotron-react-native';

Reactotron
  .configure({ name: 'Academy Students' })
  .useReactNative()
  .connect();

console.tron = Reactotron;
```

### Performance Debugging

```typescript
// Performance monitoring
import { InteractionManager } from 'react-native';

const MyComponent = () => {
  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      // Heavy operation
      console.log('Heavy operation completed');
    });

    return () => task.cancel();
  }, []);
};

// Memory leak detection
const useMemoryLeak = () => {
  useEffect(() => {
    const subscription = someObservable.subscribe();
    
    return () => {
      subscription.unsubscribe(); // Prevent memory leaks
    };
  }, []);
};
```

## 🚀 Deployment

### Development Deployment

```bash
# Create development build
npm run build:development

# Install on device
expo install:ios
expo install:android
```

### Staging Deployment

```bash
# Create preview build
npm run build:preview

# Create update
expo publish --release-channel staging
```

### Production Deployment

```bash
# Create production build
npm run build:production

# Create update
expo publish --release-channel production
```

### CI/CD Integration

```yaml
# .github/workflows/build.yml
name: Build and Deploy

on:
  push:
    branches: [main, develop]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm run install:all
        
      - name: Run tests
        run: npm run test:all
        
      - name: Build app
        run: npm run build
        
      - name: Deploy to Expo
        if: github.ref == 'refs/heads/main'
        run: expo publish --release-channel production
```

## 📋 Code Review Checklist

### Before Submitting PR

- [ ] All tests pass (`npm run test`)
- [ ] Code is properly formatted (`npm run format`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] Components follow established patterns
- [ ] API calls include proper error handling
- [ ] New features include tests
- [ ] Documentation is updated if needed
- [ ] Accessibility requirements are met
- [ ] Performance considerations addressed

### PR Description Template

```markdown
## Summary
Brief description of changes

## Changes Made
- Feature/component added or modified
- Bug fixes
- Performance improvements

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] Accessibility testing done

## Screenshots
Include before/after screenshots for UI changes

## Additional Notes
Any additional context or considerations
```

## 🔧 Troubleshooting

### Common Issues

**Metro bundler errors:**
```bash
npm run reset                # Clear all caches
rm -rf node_modules         # Remove node_modules
npm install                 # Reinstall dependencies
```

**iOS build issues:**
```bash
cd ios && pod install       # Update iOS dependencies
```

**Android build issues:**
```bash
cd android
./gradlew clean            # Clean Android build
cd .. && npm run android   # Rebuild
```

**TypeScript errors:**
```bash
npm run type-check         # Check TypeScript errors
```

### Performance Issues

- Use React DevTools Profiler
- Monitor bundle size with `expo build:web --analyze`
- Profile navigation performance
- Check for memory leaks with Flipper

### Getting Help

1. **Documentation**: Check `/docs` directory
2. **Issues**: Create GitHub issues for bugs
3. **Discussions**: Use GitHub discussions for questions
4. **Team**: Contact team leads for architecture questions

---

This development guide provides comprehensive coverage of all aspects of developing the Academy Students App, from setup to deployment.