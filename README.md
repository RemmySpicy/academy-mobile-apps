# Academy Mobile Apps

Mobile applications for the Academy Management System, now developed independently from the main admin system.

## 📱 Applications

### Academy Instructors App
React Native/Expo app for tutors and program coordinators.

**Features:**
- Student management and progress tracking
- Attendance recording
- Communication with students and parents
- Task management and scheduling
- Program oversight and analytics

### Academy Students App
React Native/Expo app for students and their parents/guardians.

**Features:**
- Dashboard with progress overview
- Course progress tracking
- Assignment management
- Communication with tutors
- Parent monitoring capabilities

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Backend services running (from `../academy-admin`)

### Development Setup

1. **Start Backend Services** (from academy-admin directory):
   ```bash
   cd ../academy-admin
   docker-compose up db backend
   ```

2. **Install Dependencies**:
   ```bash
   npm run install:all
   ```

3. **Start Mobile Development**:
   ```bash
   # Both apps
   npm run dev:all
   
   # Individual apps
   npm run dev:instructor
   npm run dev:student
   
   # Docker development
   npm run docker:up
   ```

## Shared Resources

All apps use shared resources from `/shared/`:
- **Types**: TypeScript definitions from backend schemas
- **API Client**: Unified API client with authentication and program context
- **Utils**: Common utilities and helpers

## Backend Integration

All mobile apps connect to the same FastAPI backend:
- **Base URL**: `http://localhost:8000` (development)
- **Authentication**: JWT tokens with role-based access
- **Program Context**: Automatic program filtering based on user assignments
- **API Documentation**: `http://localhost:8000/docs`

## Role-Based Access

### Instructor App Roles
- **Instructor**: Basic student interaction and progress viewing
- **Program Coordinator**: Enhanced student management and reporting

### Student App Roles  
- **Student**: Course access, assignment submission, progress tracking
- **Parent/Guardian**: Child's progress monitoring, communication with instructors

## Development Guidelines

1. **Use shared API client** - Don't create separate HTTP clients
2. **Follow program context** - All data requests must include program context
3. **Consistent UI patterns** - Use shared design tokens where possible
4. **Error handling** - Use shared error handling patterns
5. **Testing** - Test against shared backend in development