# System Overview

The Academy Mobile Apps project is a comprehensive mobile solution for the Academy Management System, built with React Native and Expo.

## 🏗️ Architecture Overview

```
Academy Mobile Apps
├── academy-instructors-app/     # Instructor & Coordinator Mobile App
├── academy-students-app/        # Student & Parent Mobile App
├── shared/                      # Shared Components & Services
└── docs/                        # Documentation
```

## 📱 Application Architecture

### Monorepo Structure
The project uses a **monorepo approach** with npm workspaces for:
- **Code sharing** between instructor and student apps
- **Consistent dependencies** across all packages
- **Centralized configuration** for linting, testing, and building
- **Shared component library** for UI consistency

### Key Design Decisions

#### 1. **Modern State Management**
- **Zustand** instead of Redux for simpler state management
- **Immer middleware** for immutable state updates
- **Selective subscriptions** for performance optimization

#### 2. **Security-First Authentication**
- **SecureStore** for sensitive token storage (not AsyncStorage)
- **Automatic token validation** on app startup
- **JWT-based authentication** with refresh token support
- **Role-based access control** with program context

#### 3. **Form-Heavy Architecture**
- **React Hook Form** for performant form handling
- **Comprehensive form components** with built-in validation
- **Accessibility-first design** for all input components
- **Real-time validation** with user-friendly error messages

#### 4. **API-First Integration**
- **Type-safe API client** with automatic error handling
- **Program context headers** for multi-program support
- **Retry logic** with exponential backoff
- **Automatic notification** for user feedback

## 🔧 Technology Stack

### Core Technologies
- **React**: 19.1.1 (Latest)
- **React Native**: 0.80.2
- **Expo SDK**: 53.0.0
- **TypeScript**: 5.6.2 (Strict mode)

### State Management
- **Zustand**: 5.0.2 (Primary state store)
- **Immer**: Integration for immutable updates
- **React Hook Form**: 7.62.0 (Form state management)

### Development & Quality
- **ESLint**: 8.57.0 (Code linting)
- **Prettier**: 3.3.3 (Code formatting)
- **Jest**: 29.0.0 (Testing framework)
- **TypeScript**: Strict typing throughout

### Security & Storage
- **Expo SecureStore**: Sensitive data storage
- **JWT Authentication**: Secure token-based auth
- **HTTPS Only**: Secure API communication

## 🏛️ Architectural Patterns

### 1. **Feature-Based Organization**
```
src/
├── features/
│   ├── auth/                 # Authentication feature
│   ├── students/             # Student management
│   ├── courses/              # Course management
│   └── attendance/           # Attendance tracking
├── core/                     # Core app functionality
├── shared/                   # Shared utilities
└── services/                 # API services
```

### 2. **Layered Architecture**
```
┌─────────────────────────────────────┐
│             UI Layer                │
│        (Screens & Components)       │
├─────────────────────────────────────┤
│           Business Logic            │
│         (Hooks & Services)          │
├─────────────────────────────────────┤
│            Data Layer               │
│        (API Client & Storage)       │
├─────────────────────────────────────┤
│          External Services          │
│        (Backend API & APIs)         │
└─────────────────────────────────────┘
```

### 3. **Shared Component Strategy**
```
shared/
├── components/
│   ├── forms/               # Reusable form components
│   ├── ui/                  # Basic UI elements
│   └── layout/              # Layout components
├── hooks/                   # Custom React hooks
├── services/                # API services
├── store/                   # Zustand stores
├── types/                   # TypeScript definitions
└── utils/                   # Utility functions
```

## 🔐 Security Architecture

### Authentication Flow
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │───▶│  Auth Service   │───▶│  Backend API    │
│                 │    │                 │    │                 │
│ - Login Screen  │    │ - Token Mgmt    │    │ - JWT Validation│
│ - SecureStore   │    │ - Role Checking │    │ - User Data     │
│ - Auto Refresh  │    │ - Program Ctx   │    │ - Permissions   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Security Measures
- **Token Storage**: SecureStore (encrypted) for access/refresh tokens
- **Network Security**: HTTPS-only API communication
- **Input Validation**: Client-side and server-side validation
- **Role-Based Access**: Program context and role-based permissions
- **Auto Logout**: Automatic logout on token expiry or security breach

## 🌐 Backend Integration

### API Architecture
```
Mobile Apps ──HTTP/HTTPS──▶ Academy Backend API
                            │
                            ├─ Authentication Endpoints
                            ├─ Student Management
                            ├─ Course Management
                            ├─ Attendance Tracking
                            ├─ Progress Reporting
                            └─ File Upload/Download
```

### Program Context Support
- **Multi-Program Users**: Users can be assigned to multiple programs
- **Context Headers**: `X-Program-Context` header on all requests
- **Data Filtering**: Backend automatically filters by program context
- **Role Validation**: Program-specific role validation

## 👤 User Profile Management Architecture

### Profile Management System
The Academy Apps feature a comprehensive profile management system with modern social media-inspired design:

#### **Dual Photo System**
```
┌─────────────────────────────────┐
│         Cover Photo             │ ← 240px height background
│  ┌─────┐                       │ ← Camera controls (edit mode)
│  │ 👤  │ Alex Johnson          │ ← Profile picture (140px, left)
│  │140px│ Swimming • Intermediate│ ← User information (right)  
│  └─────┘                       │ ← Stats integration below
└─────────────────────────────────┘
```

#### **Key Features**
- **Enhanced EditProfileScreen**: Cover photo + profile picture management
- **Comprehensive Forms**: Personal, emergency, address, and Academy information
- **Professional Layout**: LinkedIn/Facebook inspired design with stats display
- **State Management**: Edit/view modes with change tracking and confirmations
- **Photo Management**: Camera/gallery integration with proper permissions

#### **Data Architecture**
```typescript
interface UserProfile {
  // Core Information
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  
  // Emergency Contact
  emergencyContact: string;
  emergencyPhone: string;
  
  // Address Information
  address: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Photo System
  profilePicture?: string;    // Circular avatar photo
  coverPhoto?: string;        // Background cover photo
  
  // Academy Information
  program: string;
  skillLevel: string;
  goals: string;
  medicalConditions: string;
}
```

### Account Management Features
- **Payment Methods**: Comprehensive payment method management with card/PayPal support
- **Settings Management**: Complete settings system with persistent storage and role-based customization
- **Security Features**: Photo upload permissions, data validation, change confirmations
- **Professional Design**: Academy-branded interface with proper theming and accessibility

### Multi-Profile Management System
The Academy Apps support comprehensive profile switching functionality for family account management:

#### **Profile Switching Architecture**
```
┌─────────────────────────────────────┐
│           Profile Card              │
│  ┌─────┐ Sarah Johnson     [👥]    │ ← Clickable card + switcher icon
│  │ 👤  │ Parent              │     │ ← Profile info + role badge
│  └─────┘ 2 Active • 15 Sessions    │ ← Quick stats
└─────────────────────────────────────┘
                    ↓ Tap people icon
┌─────────────────────────────────────┐
│        Profile Switcher             │
│  ✓ Sarah Johnson (Parent)           │ ← Active profile with checkmark
│    Emma Johnson (Student) Grade 5   │ ← Child profile with details
│    James Johnson (Student) Grade 3  │ ← Child profile with details
│  ➕ Create New Profile              │ ← Add new family member
└─────────────────────────────────────┘
```

#### **Profile Data Structure**
```typescript
interface ProfileOption {
  id: string;
  name: string;
  role: 'parent' | 'student';
  isActive: boolean;
  avatar?: string;
  grade?: string;          // For student profiles
  program?: string;        // Associated academy program
}

// Generated profiles based on user role
interface ProfileSwitcherProps {
  activeProfileId?: string;
  onProfileSelect?: (profile: ProfileOption) => void;
  profiles?: ProfileOption[];  // Custom or auto-generated
}
```

#### **User Role Integration**
- **Parents (UserRole.PARENT)**: See parent profile + mock children profiles
- **Students (UserRole.STUDENT)**: See their own profile + potential family members
- **Fallback Support**: Always displays at least one profile option
- **Create New Profile**: Universal option to add family member profiles

#### **Component Architecture**
- **ProfileSwitcherBottomSheet**: Shared component for profile selection
- **Menu Integration**: Seamless integration in app menu with intuitive UX
- **Theme Consistency**: Full Academy design system integration
- **State Management**: Proper profile state handling and persistence

## ⚙️ Settings System Architecture

### Comprehensive User Preferences Management
The Academy Apps feature a comprehensive settings system designed for both students and instructors with persistent storage and role-based customization:

#### **Settings Data Structure**
```typescript
interface SettingsState {
  app: AppSettings;           // Theme, language, font size, animations
  notifications: NotificationSettings;  // Push, email, SMS preferences
  privacy: PrivacySettings;   // Analytics, data sharing, permissions
  academy: AcademySettings;   // Program-specific preferences
  security: SecuritySettings; // Biometric, auto-lock, 2FA
}
```

#### **Key Features**
- **Persistent Storage**: All settings automatically saved to AsyncStorage using Zustand persistence
- **Role-Based Customization**: Different options and layouts for students vs instructors
- **5 Setting Categories**: Organized into logical groups with proper validation
- **Type Safety**: Complete TypeScript interfaces with validation functions
- **Academy Theming**: Consistent use of `theme.colors.interactive.primary` throughout

#### **Settings Components**
```typescript
// Reusable settings UI components
<SettingsSection title="App Preferences" delay={300}>
  <SettingsCard
    icon="flash"
    title="Animations"
    subtitle="Enable smooth transitions"
    rightElement={<SettingsSwitch />}
    variant="default"
  />
  
  <SettingsPicker
    title="Theme"
    options={themeOptions}
    selectedValue={settings.theme}
    onSelectionChange={updateTheme}
  />
</SettingsSection>
```

#### **Student vs Instructor Differences**
- **Students**: Focus on learning preferences, notifications, privacy controls
- **Instructors**: Professional settings, teaching preferences, class management options
- **Shared Features**: App preferences, security settings, account management

#### **Technical Implementation**
- **Zustand Store**: Immer-based state management with selectors
- **AsyncStorage Integration**: Automatic persistence with validation
- **Component Library**: 4 reusable settings components (Card, Section, Switch, Picker)
- **Animation System**: Staggered entrance animations with React Native Reanimated
- **Mobile-First Design**: Touch-friendly interactions with proper accessibility

## 🏆 Gamification Architecture

### Achievement System
The Academy Apps feature a comprehensive achievement system designed to enhance student engagement and motivation:

#### **Achievement Data Structure**
```typescript
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  category: 'academic' | 'attendance' | 'participation' | 'skill' | 'milestone';
  status: 'locked' | 'in_progress' | 'completed';
  progress?: number;
  maxProgress?: number;
  dateEarned?: string;
  points?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}
```

#### **Key Features**
- **Category-Based Organization**: Achievements organized into Academic, Attendance, Participation, Skills, and Milestones
- **Progress Tracking**: Real-time progress indicators for ongoing achievements
- **Rarity System**: Four-tier rarity system (Common, Rare, Epic, Legendary) with visual hierarchy
- **Points System**: Point accumulation for completed achievements
- **Visual Feedback**: Color-coded status indicators and animated progress bars

#### **User Experience Design**
- **Statistics Dashboard**: Overview showing earned achievements, total count, and accumulated points
- **Interactive Filtering**: Horizontal scrolling category filters with active state highlighting
- **Achievement Cards**: Rich visual cards with icons, descriptions, progress tracking, and earn dates
- **Motivational Elements**: Encouraging messaging and empty states to drive continued engagement

#### **Technical Implementation**
- **Academy Theme Integration**: Consistent use of Academy purple branding and theme system
- **Animation System**: Staggered entrance animations using React Native Reanimated
- **TypeScript Safety**: Comprehensive interfaces for all achievement-related data structures
- **Mobile-First Design**: Touch-friendly interactions with proper safe area handling

## 📊 Performance Considerations

### Optimization Strategies
1. **Component Optimization**
   - React.memo for expensive components
   - useCallback and useMemo for expensive calculations
   - Lazy loading for non-critical components

2. **State Management**
   - Selective Zustand subscriptions
   - Store selectors for optimized re-renders
   - Minimal state updates with Immer

3. **Navigation**
   - Native stack navigation for performance
   - Tab navigation with lazy loading
   - Proper screen transitions

4. **Data Loading**
   - Intelligent caching strategies
   - Pagination for large datasets
   - Background data synchronization

## 🧪 Testing Strategy

### Testing Pyramid
```
┌─────────────────────────────────────┐
│              E2E Tests              │ ◄── Critical user flows
├─────────────────────────────────────┤
│          Integration Tests          │ ◄── API + Component integration
├─────────────────────────────────────┤
│            Unit Tests               │ ◄── Individual functions/components
└─────────────────────────────────────┘
```

### Testing Technologies
- **Jest**: Primary testing framework
- **React Native Testing Library**: Component testing
- **Mock Service Worker**: API mocking
- **Detox**: E2E testing (planned)

## 🚀 Deployment Architecture

### Build Pipeline
```
Development ──▶ Git Push ──▶ CI/CD ──▶ EAS Build ──▶ App Stores
     │                          │           │
     ├─ Local Testing           ├─ Tests     ├─ Android APK
     ├─ Type Checking           ├─ Linting   └─ iOS IPA
     └─ Code Review             └─ Building
```

### Environment Management
- **Development**: Local development with mock data
- **Staging**: Integration testing with staging backend
- **Production**: Live app with production backend

## 🔄 Data Flow

### Authentication Flow
```
App Launch ──▶ Check SecureStore ──▶ Validate Token ──▶ Set Auth State
     │                                     │
     ├─ No Token: Show Login              ├─ Valid: Show App
     └─ Invalid Token: Clear & Login      └─ Invalid: Show Login
```

### API Request Flow
```
Component ──▶ Zustand Store ──▶ API Client ──▶ Backend
     │             │                │              │
     ├─ UI Update  ├─ State Update  ├─ Auth Headers├─ Response
     └─ Loading    └─ Error Handle  └─ Retry Logic └─ Data/Error
```

## 📈 Scalability Considerations

### Horizontal Scaling
- **Feature Modules**: Independent feature development
- **Shared Components**: Reusable across multiple apps
- **Micro-Frontend Ready**: Each app can be developed independently

### Vertical Scaling
- **Performance Monitoring**: Built-in performance tracking
- **Memory Management**: Efficient component lifecycle
- **Bundle Optimization**: Code splitting and lazy loading

## 🔮 Future Architecture

### Planned Enhancements
- **Offline Support**: Local data caching and sync
- ✅ **Notifications Page**: Centralized notification management with modal navigation (COMPLETED)
- ✅ **Achievements System**: Comprehensive gamification with progress tracking and rarity levels (COMPLETED)
- ✅ **Settings System**: Complete user preferences management with persistent storage (COMPLETED)
- **Push Notifications**: Real-time updates
- **Biometric Authentication**: Enhanced security (Settings UI ready)
- **Multi-Language Support**: Internationalization (Settings infrastructure ready)
- **Dark Mode**: Theme switching support (Settings infrastructure ready)
- **Advanced Analytics**: User behavior tracking

This architecture provides a solid foundation for building scalable, maintainable, and secure mobile applications for the Academy Management System.