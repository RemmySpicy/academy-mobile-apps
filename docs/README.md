# Academy Mobile Apps Documentation

Welcome to the Academy Management System mobile applications documentation. This project consists of two React Native/Expo applications with shared components and services.

## 📱 Applications

- **Academy Instructors App** - Mobile application for tutors and program coordinators
- **Academy Students App** - Mobile application for students and parents/guardians  
- **Shared Package** - Common components, services, and utilities

## 📚 Documentation Structure

### 🏗️ Architecture
- **[System Overview](./architecture/SYSTEM_OVERVIEW.md)** - High-level system architecture and design decisions
- **[Multi-Program Context](./architecture/MULTI_PROGRAM_CONTEXT.md)** - Multi-program user management and switching
- **[Navigation Structure](./navigation/NAVIGATION_STRUCTURE.md)** - Complete navigation system documentation

### 🔐 Authentication
- **[Authentication System](./authentication/README.md)** - Complete authentication implementation guide
- **[User Roles & Permissions](./authentication/ROLES_AND_PERMISSIONS.md)** - Role-based access control

### 🎨 Design System
- **[Theme System](./THEME_SYSTEM.md)** - Complete theming reference with Academy branding
- **[Design System](./design-system/README.md)** - Colors, typography, spacing, and component patterns

### 🧩 Components  
- **[Component Library](./components/README.md)** - Complete component library with 85+ Academy components
- **[Form Components](./components/forms/README.md)** - Form components and usage patterns
- **[Control Components](./components/controls/ControlCard.md)** - ControlCard and management interfaces
- **[UI Components](./components/ui/)** - Modal, SelectOptions, FormDropdown, SegmentedControl, TabBar
- **[Profile Components](./components/profile/)** - Enhanced Profile Card System with expandable images
- **[Menu Components](./components/menu/)** - Complete menu system with all settings screens
- **[Utility Functions](./components/utilities/)** - Reusable utility functions (date, style utilities)

### 🌐 API & Services
- **[API Client](./api/API_CLIENT.md)** - HTTP client and service layer
- **[Notification System](./api/NOTIFICATIONS.md)** - User notification and alert system

### 🎯 Features
- **[Features Overview](./features/README.md)** - Complete feature documentation index
- **[Achievement System](./features/achievements/README.md)** - Multi-Program Achievement System with 7+ program types and 25+ achievements each
- **[Menu System](./features/MENU_SYSTEM.md)** - Complete menu system with all settings screens implemented
- **[Help & Support System](./features/HELP_SUPPORT_SYSTEM.md)** - Comprehensive user support and knowledge base

### 🎨 User Experience  
- **[Support System UX](./ui-ux/SUPPORT_SYSTEM_UX.md)** - UX design patterns for user support interfaces

### 🚀 Development
- **[Development Guide](./development/DEVELOPMENT_GUIDE.md)** - Commands, environment, and best practices
- **[Production Readiness](./development/PRODUCTION_READINESS_STATUS.md)** - Current production status
- **[Modernization Guide](./development/MODERNIZATION.md)** - Ecosystem updates and patterns

## 🏃‍♂️ Quick Start

1. **Review the [Development Guide](./development/DEVELOPMENT_GUIDE.md)**
2. **Understand the [System Overview](./architecture/SYSTEM_OVERVIEW.md)**
3. **Check out [Theme System](./THEME_SYSTEM.md)** for styling
4. **Review [Authentication](./authentication/README.md)** for user management

## 📋 Development Checklist

When working on the mobile apps, ensure you:

- [ ] Use shared components from `@academy/mobile-shared` package
- [ ] Follow the Academy theme system patterns
- [ ] Implement proper authentication and program context
- [ ] Add comprehensive error handling
- [ ] Write tests for new functionality
- [ ] Update documentation for new features
- [ ] Run type checking before commits (`npm run type-check:all`)

## 🎯 Key Features

- **Multi-Program Support** - Handle multiple academy programs with context switching
- **Academy Theming** - Consistent branding with mobile-first optimizations and high contrast variants
- **Component Library** - 85+ Academy-themed components with TypeScript interfaces and utility functions
- **Enhanced Profile System** - Profile Card System with expandable images, cover photos, and profile switching
- **Complete Menu System** - Comprehensive menu systems with production-ready screens for both apps
- **Modern UI Patterns** - Image expansion modals, overlapping layouts, smooth animations, bottom sheets
- **Performance Optimized** - React.memo, custom hooks, memoization, and memory management
- **Accessibility Compliant** - Full WCAG 2.1 support with screen reader compatibility
- **Type Safety** - Full TypeScript support with zero compilation errors (React 19 compatible)
- **Modern Architecture** - React 19, Zustand, React Navigation 6
- **Production Ready** - Complete authentication, error handling, and testing

## 🤝 Contributing

See the [Development Guide](./development/DEVELOPMENT_GUIDE.md) for contribution guidelines and development workflow.

## 📄 License

MIT License - Academy Management System Mobile Applications