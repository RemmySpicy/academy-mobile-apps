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

### 🔐 Authentication
- **[Authentication System](./authentication/README.md)** - Complete authentication implementation guide
- **[User Roles & Permissions](./authentication/ROLES_AND_PERMISSIONS.md)** - Role-based access control

### 🎨 Design System
- **[Theme System](./THEME_SYSTEM.md)** - Complete theming reference with Academy branding
- **[Design System](./design-system/README.md)** - Colors, typography, spacing, and component patterns

### 🧩 Components
- **[Form Components](./components/forms/README.md)** - Form components and usage patterns

### 🌐 API & Services
- **[API Client](./api/API_CLIENT.md)** - HTTP client and service layer
- **[Notification System](./api/NOTIFICATIONS.md)** - User notification and alert system

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
- **Academy Theming** - Consistent branding with light/dark/night modes
- **Component Library** - 80+ Academy-themed components
- **Type Safety** - Full TypeScript support with zero compilation errors
- **Modern Architecture** - React 19, Zustand, React Navigation 6
- **Production Ready** - Complete authentication, error handling, and testing

## 🤝 Contributing

See the [Development Guide](./development/DEVELOPMENT_GUIDE.md) for contribution guidelines and development workflow.

## 📄 License

MIT License - Academy Management System Mobile Applications