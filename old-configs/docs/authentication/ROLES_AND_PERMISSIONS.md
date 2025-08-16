# User Roles and Permissions

The Academy Mobile Apps implement a comprehensive role-based access control system with support for multi-program assignments.

## 🎭 User Roles

### Instructor App Roles

#### **TUTOR**
- **Description**: Front-line instructors who work directly with students
- **Permissions**:
  - View assigned student information
  - Mark attendance for their sessions
  - View basic student progress
  - Update session notes
  - Access their schedule
- **Limitations**:
  - Cannot modify student assignments
  - Cannot access administrative features
  - Limited reporting capabilities

#### **PROGRAM_COORDINATOR**
- **Description**: Managers who oversee program operations and multiple tutors
- **Permissions**:
  - All TUTOR permissions
  - Manage student assignments within their program
  - Access detailed analytics and reporting
  - View and modify schedules for their program
  - Manage tutor assignments
  - Access financial reporting for their program
- **Limitations**:
  - Cannot access other programs without assignment
  - Cannot modify program settings
  - Cannot manage other coordinators

#### **PROGRAM_ADMIN**
- **Description**: Administrators with full control over their assigned programs
- **Permissions**:
  - All PROGRAM_COORDINATOR permissions
  - Modify program settings and configurations
  - Manage all user roles within their program
  - Access full financial and operational reporting
  - Configure course offerings and pricing
  - Manage facilities and resources
- **Limitations**:
  - Cannot access programs they're not assigned to
  - Cannot create new programs

#### **SUPER_ADMIN**
- **Description**: System administrators with global access
- **Permissions**:
  - Access all programs and features
  - Create and manage programs
  - Manage all user accounts
  - System-wide configuration
  - Global reporting and analytics
- **Limitations**: None (full system access)

### Student App Roles

#### **STUDENT**
- **Description**: Enrolled students accessing their courses and progress
- **Permissions**:
  - View their course enrollments
  - Access course materials and assignments
  - Submit assignments and assessments
  - View their progress and grades
  - Communicate with instructors
  - Book available sessions
  - View their schedule and attendance
- **Limitations**:
  - Cannot access other students' information
  - Cannot modify their enrollments (parent/admin required)
  - Cannot access administrative features

#### **PARENT**
- **Description**: Parents or guardians monitoring their children's progress
- **Permissions**:
  - View all information for their linked students
  - Communicate with instructors on behalf of students
  - Manage student enrollments and bookings
  - Make payments for student courses
  - Access progress reports and analytics
  - Receive notifications about student activities
- **Limitations**:
  - Can only access information for their linked students
  - Cannot access administrative features
  - Cannot modify course content or schedules

## 🏢 Program Context

### Multi-Program Support

Users can be assigned to multiple programs with different roles:

```typescript
interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole; // Primary system role
  program_assignments: ProgramAssignment[];
}

interface ProgramAssignment {
  program_id: string;
  program_name: string;
  role_in_program: string;
  is_active: boolean;
  assigned_at: string;
  expires_at?: string;
}
```

### Example Multi-Program User

```typescript
const user: User = {
  id: "user_123",
  email: "john.doe@academy.com",
  full_name: "John Doe",
  role: UserRole.PROGRAM_COORDINATOR,
  program_assignments: [
    {
      program_id: "swimming_program",
      program_name: "Swimming Academy",
      role_in_program: "program_coordinator",
      is_active: true,
      assigned_at: "2024-01-01T00:00:00Z"
    },
    {
      program_id: "tennis_program", 
      program_name: "Tennis Academy",
      role_in_program: "tutor",
      is_active: true,
      assigned_at: "2024-06-01T00:00:00Z"
    }
  ]
};
```

## 🔐 Permission Implementation

### Role Checking

```typescript
import { useAuthStore, UserRole } from '@shared';

function AdminPanel() {
  const { hasRole, user } = useAuthStore();
  
  // Check primary system role
  if (hasRole(UserRole.PROGRAM_ADMIN)) {
    return <FullAdminInterface />;
  }
  
  // Check role in current program context
  const currentProgramRole = user?.program_assignments
    ?.find(p => p.is_active && p.program_id === currentProgram?.program_id)
    ?.role_in_program;
    
  if (currentProgramRole === 'program_coordinator') {
    return <CoordinatorInterface />;
  }
  
  return <BasicInterface />;
}
```

### App-Specific Role Validation

```typescript
function AppGuard({ children }: { children: React.ReactNode }) {
  const { isRoleAllowedInApp, user } = useAuthStore();
  
  // Check if user can access instructor app
  if (!isRoleAllowedInApp('instructor')) {
    return (
      <AccessDenied 
        message="This app is for instructors and coordinators only"
        redirectTo="student-app"
      />
    );
  }
  
  return <>{children}</>;
}
```

### Program Access Control

```typescript
function ProgramSpecificFeature({ programId }: { programId: string }) {
  const { hasProgramAccess, currentProgram } = useAuthStore();
  
  if (!hasProgramAccess(programId)) {
    return <AccessDenied message="You don't have access to this program" />;
  }
  
  if (currentProgram?.program_id !== programId) {
    return <ProgramSwitchPrompt targetProgram={programId} />;
  }
  
  return <FeatureContent />;
}
```

## 🎯 Permission Patterns

### Component-Level Permissions

```typescript
// Higher-Order Component for role protection
function withRoleProtection<T>(
  Component: React.ComponentType<T>,
  requiredRole: UserRole
) {
  return function ProtectedComponent(props: T) {
    const { hasRole } = useAuthStore();
    
    if (!hasRole(requiredRole)) {
      return <UnauthorizedAccess />;
    }
    
    return <Component {...props} />;
  };
}

// Usage
const AdminOnlyComponent = withRoleProtection(AdminPanel, UserRole.PROGRAM_ADMIN);
```

### Hook-Based Permissions

```typescript
// Custom hook for permission checking
function usePermissions() {
  const { hasRole, hasProgramAccess, user, currentProgram } = useAuthStore();
  
  const canManageStudents = useMemo(() => {
    return hasRole(UserRole.PROGRAM_COORDINATOR) || 
           hasRole(UserRole.PROGRAM_ADMIN);
  }, [hasRole]);
  
  const canAccessReports = useMemo(() => {
    return hasRole(UserRole.PROGRAM_COORDINATOR) ||
           hasRole(UserRole.PROGRAM_ADMIN) ||
           hasRole(UserRole.SUPER_ADMIN);
  }, [hasRole]);
  
  const canModifyProgram = useMemo(() => {
    return hasRole(UserRole.PROGRAM_ADMIN) ||
           hasRole(UserRole.SUPER_ADMIN);
  }, [hasRole]);
  
  return {
    canManageStudents,
    canAccessReports,
    canModifyProgram,
    hasRole,
    hasProgramAccess,
  };
}

// Usage in components
function StudentManagement() {
  const { canManageStudents, canAccessReports } = usePermissions();
  
  return (
    <View>
      <StudentList />
      {canManageStudents && <StudentActions />}
      {canAccessReports && <ReportsSection />}
    </View>
  );
}
```

### Navigation Guards

```typescript
// Navigation-level permission checking
function useNavigationGuards() {
  const { hasRole, isRoleAllowedInApp } = useAuthStore();
  
  const getAvailableScreens = useCallback(() => {
    const screens = ['Home', 'Profile'];
    
    if (hasRole(UserRole.TUTOR)) {
      screens.push('Students', 'Attendance');
    }
    
    if (hasRole(UserRole.PROGRAM_COORDINATOR)) {
      screens.push('Reports', 'Schedule');
    }
    
    if (hasRole(UserRole.PROGRAM_ADMIN)) {
      screens.push('Admin', 'Settings');
    }
    
    return screens;
  }, [hasRole]);
  
  const canNavigateTo = useCallback((screenName: string) => {
    const availableScreens = getAvailableScreens();
    return availableScreens.includes(screenName);
  }, [getAvailableScreens]);
  
  return { getAvailableScreens, canNavigateTo };
}
```

## 📊 Role Hierarchy

### Permission Inheritance

```typescript
const ROLE_HIERARCHY = {
  [UserRole.SUPER_ADMIN]: [
    UserRole.PROGRAM_ADMIN,
    UserRole.PROGRAM_COORDINATOR,
    UserRole.TUTOR,
    UserRole.STUDENT,
    UserRole.PARENT
  ],
  [UserRole.PROGRAM_ADMIN]: [
    UserRole.PROGRAM_COORDINATOR,
    UserRole.TUTOR
  ],
  [UserRole.PROGRAM_COORDINATOR]: [
    UserRole.TUTOR
  ],
  [UserRole.TUTOR]: [],
  [UserRole.STUDENT]: [],
  [UserRole.PARENT]: [UserRole.STUDENT] // Can act on behalf of students
};

function hasPermissionLevel(userRole: UserRole, requiredRole: UserRole): boolean {
  if (userRole === requiredRole) return true;
  
  const subordinateRoles = ROLE_HIERARCHY[userRole] || [];
  return subordinateRoles.includes(requiredRole);
}
```

## 🔒 Security Considerations

### Principle of Least Privilege
- Users are granted only the minimum permissions necessary
- Program-specific access prevents cross-program data exposure
- Regular audit of user permissions and assignments

### Defense in Depth
- **Client-side validation**: UI-level permission checks
- **API-level validation**: Server-side permission enforcement
- **Data-level filtering**: Database queries filtered by user context

### Permission Escalation Prevention
- Role changes require admin approval
- Program assignments have expiration dates
- Audit logging for all permission changes

## 🧪 Testing Permissions

### Unit Tests

```typescript
import { renderHook } from '@testing-library/react-hooks';
import { useAuthStore } from '@shared';

describe('Permission System', () => {
  it('should restrict tutor access to admin features', () => {
    // Mock user with tutor role
    useAuthStore.setState({
      user: { role: UserRole.TUTOR, /* ... */ },
      isAuthenticated: true,
    });
    
    const { result } = renderHook(() => useAuthStore());
    
    expect(result.current.hasRole(UserRole.PROGRAM_ADMIN)).toBe(false);
    expect(result.current.hasRole(UserRole.TUTOR)).toBe(true);
  });
  
  it('should allow program coordinator to access tutor features', () => {
    useAuthStore.setState({
      user: { role: UserRole.PROGRAM_COORDINATOR, /* ... */ },
      isAuthenticated: true,
    });
    
    const { result } = renderHook(() => useAuthStore());
    
    expect(result.current.hasRole(UserRole.TUTOR)).toBe(true);
    expect(result.current.hasRole(UserRole.PROGRAM_COORDINATOR)).toBe(true);
  });
});
```

### Integration Tests

```typescript
import { render, screen } from '@testing-library/react-native';
import { AdminPanel } from '../components/AdminPanel';

describe('AdminPanel Integration', () => {
  it('should show admin features for program admin', () => {
    // Setup auth state with program admin role
    setupAuthState({ role: UserRole.PROGRAM_ADMIN });
    
    render(<AdminPanel />);
    
    expect(screen.getByText('User Management')).toBeTruthy();
    expect(screen.getByText('Program Settings')).toBeTruthy();
  });
  
  it('should hide admin features for tutors', () => {
    setupAuthState({ role: UserRole.TUTOR });
    
    render(<AdminPanel />);
    
    expect(screen.queryByText('User Management')).toBeNull();
    expect(screen.queryByText('Program Settings')).toBeNull();
  });
});
```

## 📱 Mobile-Specific Considerations

### App Store Compliance
- Role-based features comply with app store guidelines
- No hidden or undocumented administrative features
- Clear user role indication in the UI

### Offline Handling
- Cached permission data for offline operation
- Graceful degradation when role data is unavailable
- Secure permission validation on reconnection

### Performance Optimization
- Efficient role checking with memoization
- Minimal re-renders with selective subscriptions
- Lazy loading of role-specific components

This role and permission system ensures secure, scalable access control across both Academy mobile applications while maintaining flexibility for complex organizational structures.