# Academy Mobile Apps

Mobile applications for the Academy Management System, built with React Native and Expo.

## ✅ Current Status (Latest Update)

**🎉 Development Environment Ready!**
- Both instructor and student apps load successfully in Expo Go
- React version conflicts resolved (19.1.0 across all dependencies)
- Metro bundler and Babel configuration optimized for monorepo
- All development dependencies installed and working

**Ready for feature implementation** - Reference `existing-code/` directories for building full navigation and features.

## 📱 Applications

- **[Academy Instructors App](./academy-instructors-app/)** - Mobile app for tutors and program coordinators
- **[Academy Students App](./academy-students-app/)** - Mobile app for students and parents/guardians
- **[Shared Package](./shared/)** - Common components, services, and utilities

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start individual apps (recommended)
cd academy-instructors-app
npx expo start --offline

cd academy-students-app
npx expo start --offline

# Or start both simultaneously
npm run dev:all
```

## 📚 Documentation

Comprehensive documentation is available in the [`/docs`](./docs/) directory:

- **[Getting Started](./docs/development/GETTING_STARTED.md)** - Setup and development guide
- **[System Overview](./docs/architecture/SYSTEM_OVERVIEW.md)** - Architecture and design decisions
- **[Authentication](./docs/authentication/README.md)** - User management and security
- **[Form Components](./docs/components/forms/README.md)** - UI component library
- **[API Client](./docs/api/API_CLIENT.md)** - Backend integration

## 🏗️ Architecture

### Monorepo Structure
```
academy-apps/
├── academy-instructors-app/  # Instructor & Coordinator App
├── academy-students-app/     # Student & Parent App  
├── shared/                   # Shared Components & Services
└── docs/                     # Documentation
```

### Key Features
- ✅ **Modern React Native** with Expo SDK 53
- ✅ **TypeScript** throughout with strict typing
- ✅ **Zustand State Management** replacing Redux complexity
- ✅ **Secure Authentication** with JWT and SecureStore
- ✅ **Form Components** with React Hook Form integration
- ✅ **Comprehensive Testing** with Jest and Testing Library
- ✅ **Accessibility First** design with ARIA support

## 🔐 Authentication & Security

- **JWT Authentication** with automatic token refresh
- **SecureStore Integration** for encrypted token storage
- **Role-Based Access Control** for different user types
- **Program Context** for multi-program support
- **Automatic Logout** on token expiry

## 📋 Form System

Comprehensive form components with:
- **React Hook Form** integration
- **Real-time validation** with user-friendly errors
- **Accessibility support** with screen readers
- **Consistent styling** across all components
- **TypeScript** for type safety

## 🌐 API Integration

- **Type-safe API client** with automatic error handling
- **Retry logic** with exponential backoff
- **Program context headers** for multi-program filtering
- **Notification integration** for user feedback
- **Offline support** (planned)

## 🎨 Design System

- **Consistent theming** across both applications
- **Accessibility compliant** color palette
- **Responsive design** for different screen sizes
- **Platform-specific** optimizations for iOS and Android

## 🧪 Development

### Prerequisites
- Node.js 18.0.0+
- npm 9.0.0+
- Expo CLI
- Backend API running (see [academy-admin](../academy-admin))

### Commands

```bash
# Development
npm run dev:all              # Start both apps
npm run dev:instructor       # Start instructor app
npm run dev:student         # Start student app

# Code Quality
npm run type-check:all      # TypeScript checking
npm run lint:all           # ESLint checking
npm run test:all           # Run all tests
npm run format             # Format code with Prettier

# Build & Deploy
npm run build:all          # Build both apps
npm run deploy             # Deploy to Expo
```

### Testing

```bash
# Run all tests
npm run test:all

# Run with coverage
npm run test:all -- --coverage

# Run in watch mode  
npm run test:all -- --watch
```

## 📱 Platform Support

### iOS
- **iOS 13.0+** minimum deployment target
- **iPhone and iPad** support
- **Native performance** with Expo development builds
- **App Store** ready builds with EAS

### Android
- **Android 6.0+ (API 23)** minimum SDK version
- **Phone and tablet** layouts
- **Google Play Store** ready builds with EAS
- **Android-specific** optimizations

## 🔄 Deployment

### Development Builds
```bash
# iOS development build
cd academy-instructors-app
npm run build:development

# Android development build  
npm run build:development -- --platform android
```

### Production Builds
```bash
# Production builds via EAS
npm run build:production
```

### Expo Updates
```bash
# Publish OTA updates
npm run deploy
```

## 🤝 Contributing

1. **Read the documentation** in `/docs`
2. **Study existing code** patterns in `existing-code/` directories  
3. **Follow the coding standards** (ESLint, Prettier, TypeScript)
4. **Write tests** for new functionality
5. **Update documentation** for changes

### Development Workflow

1. Create feature branch: `git checkout -b feature/new-feature`
2. Study existing implementations in `existing-code/`
3. Build with shared components from `@shared`
4. Test thoroughly with `npm run test:all`
5. Submit pull request with documentation

## 🐛 Issues & Support

- **Bugs**: Report issues via GitHub Issues
- **Questions**: Use GitHub Discussions
- **Documentation**: Check `/docs` directory first
- **Examples**: Study `existing-code/` implementations

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Academy Management System Mobile Apps** - Building the future of educational program management. 🚀