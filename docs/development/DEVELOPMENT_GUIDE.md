# Academy Mobile Apps - Development Guide

## Tech Stack & Status ✅

- **React**: 19.0.0 (Production Ready)
- **React Native**: 0.79.5 
- **Expo SDK**: 53.0.22
- **TypeScript**: 5.8.3 (Zero Critical Errors)
- **State Management**: Zustand 5.0.7
- **Navigation**: React Navigation 7.x
- **Charts**: react-native-gifted-charts v1.4.0 (React 19 Compatible)

## Development Commands

### Installation & Setup

```bash
# Install all dependencies (enforces @types/react version alignment)
npm install

# Fresh start (clean and reinstall everything)
rm -rf node_modules package-lock.json
npm install

# Verify React types alignment after installation
npm ls @types/react
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
# TypeScript type checking (CRITICAL - run before commits)
npx tsc --noEmit  # From any app directory
# OR
npm run type-check  # If available in package.json

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
```

## React 19 & TypeScript Setup Notes ⚠️

### Key Configuration Details

1. **Version Alignment**: All packages use `@types/react@19.1.12` via package.json `resolutions`
2. **Metro Config**: React resolves to root `node_modules` to prevent duplicates  
3. **TypeScript Config**: Minimal setup works best - let Expo handle the complexity
4. **JSX Transform**: Uses React 19's automatic JSX runtime

### Troubleshooting Common Issues

```bash
# If you see "Unable to resolve 'react'" errors:
# 1. Check Metro config points to workspaceRoot
# 2. Restart Metro bundler completely

# If you see JSX component errors:
# 1. Verify @types/react version alignment: npm ls @types/react
# 2. Check TypeScript config is minimal (no complex type mappings)
# 3. Clear TypeScript cache and restart

# Force clean restart:
rm -rf node_modules package-lock.json
npm install
npx expo start --clear
```
# which run automatically when you commit code
```

## ⚡ Performance Optimization Patterns

### Component-Level Performance

**1. Use React.memo for List Components**

```typescript
// ✅ Optimized list item with custom comparison
const AchievementCard = React.memo<AchievementCardProps>(({ achievement, onPress, index }) => {
  // Component implementation
}, (prevProps, nextProps) => 
  prevProps.achievement.id === nextProps.achievement.id &&
  prevProps.achievement.status === nextProps.achievement.status &&
  prevProps.achievement.progress_percentage === nextProps.achievement.progress_percentage
);

// ❌ Avoid shallow comparison for complex objects
const BadComponent = React.memo(Component); // Will re-render unnecessarily
```

**2. Custom Hooks for Complex Logic**

```typescript
// ✅ Extract filtering logic to custom hook
const useFilteredData = (data: T[], filters: Filters) => {
  return useMemo(() => {
    // Apply most restrictive filters first for performance
    return data.filter(item => /* filtering logic */);
  }, [data, filters]);
};

// Usage in component
const filteredResults = useFilteredData(achievements, filters);
```

**3. useCallback for Event Handlers**

```typescript
// ✅ Memoize event handlers to prevent child re-renders
const handlePress = useCallback((item: Item) => {
  setSelectedItem(item);
}, []);

const handleToggle = useCallback((key: string, value: any) => {
  setFilters(prev => ({ ...prev, [key]: value }));
}, []);
```

**4. Themed Styles with createThemedStyles**

```typescript
// ✅ Use createThemedStyles for consistent theming
const createCardStyles = (theme: Theme) => ({
  container: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.xl,
  },
});

const useCardStyles = createThemedStyles(createCardStyles);

// In component
const styles = useCardStyles();
```

### Memory Management

**Animation Cleanup**

```typescript
// ✅ Always cleanup animations to prevent memory leaks
useEffect(() => {
  return () => {
    cancelAnimation(scaleValue);
    cancelAnimation(fadeValue);
  };
}, [scaleValue, fadeValue]);
```

**Large List Optimization**

```typescript
// ✅ Consider FlashList for large datasets
import { FlashList } from "@shopify/flash-list";

<FlashList
  data={items}
  renderItem={({ item }) => <ItemComponent item={item} />}
  estimatedItemSize={100}
  keyExtractor={(item) => item.id}
/>
```

### Accessibility Best Practices

**Comprehensive A11y Labels**

```typescript
// ✅ Provide meaningful accessibility information
<Pressable
  accessibilityRole="button"
  accessibilityLabel={`${item.title} - ${item.status}`}
  accessibilityHint={`${item.progress}% complete. Tap for details.`}
  accessibilityState={{ selected: item.isSelected }}
>
```

**Touch Target Optimization**

```typescript
// ✅ Ensure minimum 44px touch targets
const buttonStyle = {
  minWidth: 44,
  minHeight: 44,
  padding: theme.spacing.md,
};
```

### Performance Monitoring

**Measure Component Performance**

```bash
# Use React DevTools Profiler to measure render performance
# Enable in development:
npx expo start --offline

# Then use React DevTools Profiler tab to identify:
# - Slow rendering components
# - Unnecessary re-renders
# - Memory usage patterns
```

**Performance Metrics to Track**

- **List scrolling FPS**: Target 60 FPS for smooth scrolling
- **Memory usage**: Monitor for memory leaks in long-running screens
- **Bundle size**: Keep feature additions under 50KB per feature
- **Animation performance**: Use native driver where possible

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

**✅ COMPONENT EXTRACTION COMPLETE** - All components extracted from existing code
**✅ MENU SYSTEM COMPLETE** - All settings and feature screens implemented

### Total Components: **85+ Production-Ready Components**

The Academy Apps feature a comprehensive shared component library with complete coverage for all mobile app needs.

### Recently Added Features
- **Settings Management**: NotificationSettings, PrivacySettings, About screens
- **Analytics Dashboard**: ProgressReport screen with charts and metrics
- **Complete Menu System**: All menu navigation screens fully implemented
- **Advanced Data Visualization**: Charts, progress tracking, and export functionality
- **Profile Management System**: Enhanced EditProfileScreen with cover photo + profile picture dual system
- **Payment Methods**: Comprehensive payment method management with card/PayPal support
- **Photo Management**: Professional photo upload system with camera/gallery selection and removal options

### Testing Components
```bash
# Test all components in ExtractedComponentsShowcase
cd shared && npx expo start

# Navigate to "UI" section to see all components in action
# Interactive demos available for all 85+ components
```

## Development Best Practices

1. **Use shared components** - Import from `@academy/mobile-shared` (85+ available)
2. **Follow Academy theming** - Use `theme.colors.interactive.primary` (#4F2EC9)
3. **Component extraction complete** - existing-code/ can now be safely removed
4. **Test your changes** - Run `npm run test` before committing
5. **Use exact dependency versions** - no carets or tildes
6. **Write tests for new features** - coverage thresholds are enforced
7. **Use the pre-commit hooks** - they catch issues early
8. **Keep environment variables in .env files** - never hardcode URLs or keys

## 🎨 Design System Consistency

### Horizontal Padding Standards (Updated 2025)

**✅ PADDING CONSISTENCY ACHIEVED** - All screen files now use standardized horizontal spacing

#### Standard Horizontal Padding
- **Screen edges**: Always use `theme.spacing.md` (16px) for consistent content alignment
- **Component internal padding**: Use appropriate theme spacing tokens (`xs`, `sm`, `md`, `lg`, etc.)
- **Never hardcode**: Avoid hardcoded pixel values like `paddingHorizontal: 24`

#### Fixed Files (35+ screens updated)
**Students App:** All auth screens, feature screens (Transactions, Schedule, Contact, Store, Referrals, Facilities, Services, Bookings, Progress, Help, Courses, etc.)

**Instructors App:** All auth screens, feature screens (Performance, Classroom, Students, Attendance, etc.)

#### Best Practices
```tsx
// ✅ CORRECT - Use theme spacing tokens
paddingHorizontal: theme.spacing.md,  // 16px for screen edges

// ❌ WRONG - Hardcoded values
paddingHorizontal: 24,
paddingHorizontal: 16,
```

This ensures visual consistency across all Academy Apps screens and maintains compliance with the design system.

## 👤 Profile Management Development

### **Dual Photo System Implementation**

The Academy Apps feature a comprehensive profile management system with dual photo support:

#### **Cover Photo + Profile Picture Layout**
```tsx
// Modern social media-inspired design
const profileLayoutStyle = {
  coverPhoto: { height: 240, width: '100%' },
  profilePicture: { 
    width: 140, 
    height: 140, 
    position: 'absolute',
    bottom: -40,
    left: theme.spacing.lg 
  }
};
```

#### **Implementation Guidelines**
```tsx
// Profile data structure
interface UserProfile {
  // ... existing fields
  profilePicture?: string;
  coverPhoto?: string;        // ← New dual photo system
}

// Photo management functions
const handleChangeCoverPhoto = () => {
  // Take photo, choose from gallery, remove (if exists)
};

const handleChangeProfilePicture = () => {
  // Take photo, choose from gallery
};
```

### **Key Features Implemented**
- **✅ EditProfileScreen**: Enhanced with cover photo, comprehensive form sections
- **✅ PaymentMethodsScreen**: Card/PayPal management with default selection
- **✅ SettingsScreens**: Privacy, Notification, and About screens with local components
- **✅ Photo Management**: Dual photo system with camera/gallery integration
- **✅ Professional Layout**: LinkedIn/Facebook inspired design with stats section

### **Development Commands for Profile Features**
```bash
# Test profile screens
cd students-app && npx expo start
# Navigate to Menu → Account → Edit Profile

# Test payment methods
# Navigate to Menu → Account → Payment Methods

# Test settings screens
# Navigate to Menu → Settings → [Privacy/Notifications/About]
```

### **Photo Upload Integration**
```tsx
import * as ImagePicker from 'expo-image-picker';

// Camera permissions
const requestCameraPermission = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  return status === 'granted';
};

// Photo selection
const selectPhoto = async (aspectRatio: [number, number]) => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: aspectRatio, // [16,9] for cover, [1,1] for profile
    quality: 0.8,
  });
  return result;
};
```

### **State Management Best Practices**
```tsx
// Change tracking for unsaved changes
const [hasChanges, setHasChanges] = useState(false);
const [isEditing, setIsEditing] = useState(false);

// Handle input changes with tracking
const handleInputChange = (field: keyof UserProfile, value: string) => {
  setProfile(prev => ({ ...prev, [field]: value }));
  setHasChanges(true);
};

// Confirmation dialogs for data integrity
const handleSave = () => {
  Alert.alert('Save Changes', 'Are you sure?', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Save', onPress: () => saveProfile() }
  ]);
};
```