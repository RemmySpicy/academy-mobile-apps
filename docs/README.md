# Academy Mobile Apps Documentation

Welcome to the Academy Management System mobile applications documentation. This project consists of two React Native/Expo applications with shared components and services.

## 📱 Applications

- **Academy Instructors App** - Mobile application for tutors and program coordinators
- **Academy Students App** - Mobile application for students and parents/guardians  
- **Shared Package** - Common components, services, and utilities

## 📚 Documentation Structure

### 🏗️ Architecture
- [**System Overview**](./architecture/SYSTEM_OVERVIEW.md) - High-level system architecture and design decisions
- [**Project Structure**](./architecture/PROJECT_STRUCTURE.md) - Monorepo organization and file structure
- [**Technology Stack**](./architecture/TECHNOLOGY_STACK.md) - Dependencies, versions, and technology choices

### 🔐 Authentication
- [**Authentication System**](./authentication/README.md) - Complete authentication implementation guide
- [**User Roles & Permissions**](./authentication/ROLES_AND_PERMISSIONS.md) - Role-based access control
- [**Program Context**](./authentication/PROGRAM_CONTEXT.md) - Multi-program user management

### 📋 Form Components
- [**Form Components Overview**](./components/forms/README.md) - All form components and usage
- [**CustomInput**](./components/forms/CUSTOM_INPUT.md) - Input field component documentation
- [**CustomDropdown**](./components/forms/CUSTOM_DROPDOWN.md) - Dropdown/select component
- [**OTP Field**](./components/forms/OTP_FIELD.md) - One-time password input component
- [**Other Form Components**](./components/forms/OTHER_COMPONENTS.md) - CheckBox, RadioButton, etc.

### 🌐 API & Services
- [**API Client**](./api/API_CLIENT.md) - HTTP client and service layer
- [**Error Handling**](./api/ERROR_HANDLING.md) - Error management and user feedback
- [**Notification System**](./api/NOTIFICATIONS.md) - User notification and alert system

### 🎨 UI/UX
- [**Design System**](./ui/DESIGN_SYSTEM.md) - Colors, typography, spacing, and themes
- [**Accessibility**](./ui/ACCESSIBILITY.md) - Accessibility implementation and guidelines
- [**Navigation**](./ui/NAVIGATION.md) - Navigation structure and routing

### 🚀 Development
- [**Getting Started**](./development/GETTING_STARTED.md) - Setup and development workflow
- [**Environment Setup**](./development/ENVIRONMENT_SETUP.md) - Development environment configuration
- [**Testing Guide**](./development/TESTING.md) - Testing strategies and examples
- [**Build & Deployment**](./development/BUILD_DEPLOYMENT.md) - Build processes and deployment

### 📱 App-Specific Features
- [**Instructor App Features**](./features/instructor-app/README.md) - Instructor app specific functionality
- [**Student App Features**](./features/student-app/README.md) - Student app specific functionality
- [**Shared Features**](./features/shared/README.md) - Common features between apps

### 🔧 Troubleshooting
- [**Common Issues**](./troubleshooting/COMMON_ISSUES.md) - Frequently encountered problems and solutions
- [**WSL Setup Issues**](./troubleshooting/WSL_ISSUES.md) - Windows Subsystem for Linux specific issues
- [**Dependency Issues**](./troubleshooting/DEPENDENCY_ISSUES.md) - Package and dependency problems

## 🏃‍♂️ Quick Start

1. **Read the [Getting Started Guide](./development/GETTING_STARTED.md)**
2. **Set up your [Development Environment](./development/ENVIRONMENT_SETUP.md)**
3. **Review the [System Overview](./architecture/SYSTEM_OVERVIEW.md)**
4. **Check out [Form Components](./components/forms/README.md)** for UI development
5. **Understand [Authentication](./authentication/README.md)** for user management

## 📋 Development Checklist

When working on the mobile apps, ensure you:

- [ ] Use shared components from `@shared` package
- [ ] Follow the authentication patterns in the docs
- [ ] Implement proper error handling and notifications
- [ ] Add accessibility support to new components
- [ ] Write tests for new functionality
- [ ] Update documentation for new features

## 🤝 Contributing

See the [Development Guide](./development/GETTING_STARTED.md) for contribution guidelines and development workflow.

## 📄 License

MIT License - Academy Management System Mobile Applications