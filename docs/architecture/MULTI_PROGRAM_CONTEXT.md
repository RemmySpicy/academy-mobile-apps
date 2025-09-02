# Multi-Program Context System

The mobile apps support multi-program academies with automatic program context switching.

## 🔗 Key Components (in `/shared/src/components/program/`)

### ProgramContextProvider
Wraps the entire app to provide program context:

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

### ProgramSelector
UI component for switching between programs:

```typescript
import { ProgramSelector } from '@shared';

// Different variants available
<ProgramSelector variant="button" />     // Simple button
<ProgramSelector variant="dropdown" />   // Dropdown style
<ProgramSelector variant="card" />       // Card style
```

### ProgramGuard
Protects content based on user roles:

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

### useProgramContext Hook
Hook for accessing program data:

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

## 🎯 Integration Steps

### 1. Wrap App with Provider (in `App.tsx`):

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

### 2. Add Program Selector to Navigation (recommended in header):

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

### 3. Protect Role-Specific Content:

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

### 4. Use Program Context in Data Fetching:

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

### 5. Use Program Context in Achievement System:

```typescript
import { useProgramContext, achievementsService } from '@shared';

function AchievementsScreen() {
  const { currentProgram, isLoading: programLoading } = useProgramContext();

  // Achievement data automatically adapts to current program
  const achievements = achievementsService.generateMockAchievements(currentProgram);
  const categories = achievementsService.generateMockCategories(currentProgram);
  const stats = achievementsService.generateMockStats(currentProgram);

  // Program type provides visual theming
  const programType = achievementsService.getProgramType(currentProgram);
  
  if (programLoading || !currentProgram) {
    return <LoadingSpinner />;
  }

  return (
    <AchievementDisplay 
      achievements={achievements}
      categories={categories}
      themeColor={programType.colors.primary}
      primaryIcon={programType.icons.primary}
    />
  );
}
```

## 🔒 Automatic Features

- **API Header Injection**: All API requests automatically include `X-Program-Context` header
- **Data Filtering**: Backend filters all data by user's current program context
- **Achievement Adaptation**: Achievement system automatically adapts to current program
- **Visual Theming**: Program-specific colors, icons, and themes applied automatically
- **Role-Based Access**: Components automatically respect user's role within the current program
- **Persistent Context**: Program selection is stored and restored between app sessions
- **Error Handling**: Graceful fallbacks when programs are unavailable

### 🏆 **Achievement System Integration**

The achievement system seamlessly integrates with program context:

- **Dynamic Achievement Generation**: Each program gets unique, contextual achievements
- **Program-Specific Categories**: Categories automatically match program focus areas
- **Visual Identity**: Colors and icons adapt to program type (e.g., blue water theme for Swimming)
- **Smart Fallbacks**: Unknown program types get appropriate default configurations
- **Performance Optimized**: Achievement data refreshes efficiently on program switch

## 📱 App-Specific Roles

### Instructor App:
- `tutor` - Basic student interaction
- `program_coordinator` - Enhanced management
- `program_admin` - Full program control
- `super_admin` - System-wide access

### Student App:
- `student` - Course access and progress
- `parent` - Child monitoring and communication

## 🎨 Theming Integration

All program components use the shared design system:
- Consistent styling across both apps
- Dark/light mode support
- Responsive design
- Accessibility compliance

## 🔄 Migration from Swimming-Only

The existing code in `existing-code/` directories assumes a single swimming program. When rebuilding features:

1. **Wrap with ProgramContextProvider**
2. **Add ProgramGuard** for role-based features
3. **Use useProgramContext()** instead of hardcoded program assumptions
4. **Test with multiple programs** to ensure proper filtering

## 📋 Example Integration Files

See example implementations:
- **Instructor App**: `/academy-instructors-app/src/components/ProgramIntegrationExample.tsx`
- **Student App**: `/academy-students-app/src/components/ProgramIntegrationExample.tsx`

These show practical usage patterns for both apps.

## 🔧 Troubleshooting

### Program Context Not Loading:
- Ensure `ProgramContextProvider` wraps your app root
- Check that user is authenticated before using program context
- Verify backend API returns program assignments for the user

### API Requests Not Filtered:
- Confirm `X-Program-Context` header is being added automatically
- Check that API client is properly configured in auth store
- Verify program context is set before making requests

### Role-Based Guards Not Working:
- Ensure user has proper role assignments in the backend
- Check that role names match exactly (case-sensitive)
- Verify `ProgramGuard` is getting correct program context

### Performance Issues:
- Use `ProgramGuard` to conditionally render heavy components
- Implement proper loading states with `isLoading` from context
- Consider memoizing components that depend on program context