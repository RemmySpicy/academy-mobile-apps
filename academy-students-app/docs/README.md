# Academy Students App

A modern React Native mobile application for swimming students and parents, built with Expo and TypeScript. This app provides a comprehensive platform for course management, booking sessions, tracking progress, and managing student profiles.

## 🏊‍♀️ Overview

The Academy Students App is designed to serve both students and parents in their swimming journey. It offers role-based functionality that adapts to whether the user is a student accessing their own courses or a parent managing their children's swimming education.

### Key Features

- **🎯 Role-Based Experience**: Seamlessly switch between Student and Parent modes
- **📚 Course Catalog**: Browse and enroll in swimming programs (Learn to Swim, Swimming Club, Adult Swimming, Aqua Babies)
- **📅 Booking Management**: Schedule, reschedule, and manage swimming sessions
- **📊 Progress Tracking**: Monitor swimming skill development and achievements
- **👤 Profile Management**: Manage personal information, payment methods, and preferences
- **🔔 Smart Notifications**: Stay updated on sessions, achievements, and important announcements

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI
- iOS Simulator / Android Emulator or physical device
- Access to Academy backend API

### Installation

```bash
# Navigate to the students app directory
cd academy-students-app

# Install dependencies
npm install

# Start the development server
npm start
```

### Development Commands

```bash
# Start with specific platform
npm run ios          # Start iOS simulator
npm run android      # Start Android emulator
npm run web          # Start web version

# Code quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript checks
npm run test         # Run tests

# Build
npm run build        # Create production build
```

## 📱 App Structure

### Feature-Based Architecture

The app follows a feature-based architecture where each major feature is self-contained:

```
src/
├── features/
│   ├── auth/           # Authentication & onboarding
│   ├── home/           # Dashboard overview
│   ├── courses/        # Course catalog & details
│   ├── bookings/       # Booking management
│   ├── progress/       # Progress tracking
│   └── profile/        # User profile & settings
├── shared/
│   ├── components/     # Shared components
│   ├── navigation/     # App navigation
│   ├── store/         # Global state management
│   ├── services/      # API services
│   ├── utils/         # Utility functions
│   └── types/         # TypeScript definitions
```

### Technology Stack

- **Framework**: React Native 0.80.2 with Expo SDK 53
- **Language**: TypeScript 5.9+
- **Navigation**: React Navigation 6.x
- **State Management**: Zustand 5.0.7
- **Forms**: React Hook Form 7.62.0 with Yup validation
- **Animations**: Reanimated 3.x
- **Styling**: Themed StyleSheet with NativeWind compatibility
- **Testing**: Jest with React Native Testing Library

## 🎭 User Roles & Permissions

### Student Role
- View own courses and progress
- Book and manage personal sessions
- Track individual skill development
- Access achievement system
- Manage personal profile

### Parent Role
- All Student permissions PLUS:
- Manage multiple children profiles
- Oversee children's progress and bookings
- Receive parent-specific notifications
- Access family billing and payments
- Communicate with instructors

### Role Switching
Parents can seamlessly switch between Parent and Student modes through the profile screen, providing flexibility for parents who are also students.

## 🏗️ Architecture Principles

### Modern React Patterns (2025)
- **Functional Components**: All components use modern React hooks
- **TypeScript-First**: Comprehensive type safety with discriminated unions
- **Performance Optimized**: Proper memoization and lazy loading
- **Accessibility**: WCAG 2.1 compliant with screen reader support

### State Management Strategy
- **Local State**: React hooks for component-specific state
- **Global State**: Zustand stores for shared application state
- **Form State**: React Hook Form for complex form management
- **Server State**: API integration with proper error handling

### Code Quality Standards
- **ESLint + Prettier**: Consistent code formatting
- **TypeScript Strict Mode**: Enhanced type safety
- **Test Coverage**: Comprehensive unit and integration tests
- **Git Hooks**: Pre-commit validation and formatting

## 📊 Features Deep Dive

### 🏠 Home Dashboard
- Personalized greeting with role-aware content
- Quick stats overview (active courses, upcoming sessions)
- Recent activity feed
- Quick action buttons for common tasks
- Course progress highlights

### 📚 Course Management
- Unified catalog supporting all course types:
  - **Learn to Swim** (3-30 years): Beginner swimming fundamentals
  - **Swimming Club** (5-30 years): Competitive training and technique
  - **Adult Swimming** (30+ years): Adult-focused instruction
  - **Aqua Babies** (12-36 months): Parent-child water introduction
- Advanced search and filtering
- Detailed course information with curriculum
- Instructor profiles and certifications
- Real-time availability and scheduling

### 📅 Booking System
- Session booking with date/time selection
- Booking status tracking (upcoming, completed, cancelled)
- Quick actions (reschedule, cancel, review)
- Session reminders and notifications
- Payment integration (Stripe placeholder)
- Booking history and receipts

### 📈 Progress Tracking (Simplified)
- Course completion percentages
- Individual skill level progression
- Achievement badges and milestones
- Progress visualization with charts
- Instructor feedback integration
- Goal setting and tracking

### 👤 Profile & Settings
- Personal information management
- Payment method configuration
- Notification preferences
- Privacy and security settings
- Help and support access
- App preferences (theme, language)

## 🔗 API Integration

The app integrates with the Academy backend API located at `../academy-admin/backend`. Key endpoints include:

### Authentication
- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Token refresh
- `POST /auth/logout` - User logout

### Courses
- `GET /courses` - Fetch available courses
- `GET /courses/:id` - Get course details
- `GET /courses/:id/schedule` - Get course schedule

### Bookings
- `GET /bookings` - User's bookings
- `POST /bookings` - Create new booking
- `PUT /bookings/:id` - Update booking
- `DELETE /bookings/:id` - Cancel booking

### Progress
- `GET /progress/:userId` - User progress data
- `GET /progress/:userId/:courseId` - Course-specific progress
- `POST /progress/achievement` - Record achievement

## 🎨 Design System

### Theme Support
- **Light Mode**: Default bright theme
- **Dark Mode**: High contrast dark theme
- **Night Mode**: OLED-optimized with reduced blue light

### Color Palette
- **Primary**: `#4F2EC9` (Academy Purple)
- **Secondary**: `#3B82F6` (Blue)
- **Success**: `#10B981` (Green)
- **Warning**: `#F59E0B` (Amber)
- **Error**: `#EF4444` (Red)

### Typography
- **Headers**: System font, bold weights
- **Body**: System font, regular weight
- **Captions**: System font, light weight
- **Accessibility**: Dynamic type scaling support

## 🔒 Security & Privacy

### Data Protection
- JWT token-based authentication
- Secure storage for sensitive data
- API request encryption (HTTPS)
- User data anonymization options

### Privacy Features
- Granular privacy controls
- Data sharing preferences
- Account deletion capabilities
- COPPA compliance for children's accounts

## 🧪 Testing Strategy

### Test Types
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: Feature workflow testing
- **E2E Tests**: Critical user journey validation
- **Accessibility Tests**: Screen reader and navigation testing

### Test Coverage Goals
- Components: 90%+
- Utilities: 95%+
- Services: 85%+
- Critical Paths: 100%

## 📱 Platform Support

### iOS
- iOS 13.0+
- iPhone and iPad support
- Native iOS design patterns
- App Store optimization

### Android
- Android 8.0+ (API level 26)
- Material Design 3 components
- Play Store optimization
- Android-specific permissions

## 🚀 Deployment

### Development
- Expo Development Build
- Hot reloading and debugging
- Device testing via Expo Go

### Staging
- Expo Preview builds
- Internal testing distribution
- QA validation environment

### Production
- App Store / Play Store builds
- Over-the-air updates via Expo
- Analytics and crash reporting
- Performance monitoring

## 📈 Performance Optimization

### Bundle Optimization
- Code splitting by feature
- Lazy loading for non-critical screens
- Image optimization and caching
- Font subset loading

### Runtime Performance
- Component memoization
- Efficient state updates
- Optimized list rendering
- Memory leak prevention

## 🤝 Contributing

### Development Workflow
1. Create feature branch from `main`
2. Implement features following existing patterns
3. Write comprehensive tests
4. Update documentation
5. Submit pull request with detailed description

### Code Standards
- Follow existing architectural patterns
- Use feature-based organization
- Maintain TypeScript strict mode
- Write self-documenting code
- Include accessibility considerations

## 📚 Additional Documentation

- [Architecture Guide](./ARCHITECTURE.md) - Detailed technical architecture
- [API Integration](./API.md) - Backend integration patterns
- [Component Library](./COMPONENTS.md) - Reusable component documentation
- [Navigation Guide](./NAVIGATION.md) - Routing and navigation patterns
- [Development Guide](./DEVELOPMENT.md) - Local development setup and workflows

## 📞 Support

For technical support or questions:
- **Documentation**: Check the `/docs` directory
- **Issues**: Create GitHub issues for bugs or feature requests
- **Development**: Refer to architecture documentation
- **API**: Consult backend API documentation

---

**Built with ❤️ for the Academy Swimming Community**