# Mobile Apps Monorepo

This is an Expo monorepo containing two mobile applications:

- **students-app**: Mobile app for students
- **instructors-app**: Mobile app for instructors

## Project Structure

```
academy-apps/
├── students-app/         # Student-facing mobile app (TypeScript, Expo Router)
├── instructors-app/      # Instructor-facing mobile app (TypeScript, Expo Router)
├── shared/               # Shared packages/libraries
│   ├── shared-components/  # Reusable UI components
│   ├── shared-utils/       # Common utility functions
│   └── shared-types/       # TypeScript type definitions
├── .github/workflows/    # CI/CD pipeline configuration
└── package.json          # Monorepo workspace configuration
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI

### Installation
```bash
# Install dependencies for all workspaces
npm install

# Or install dependencies for a specific app
npm install --workspace=students-app
```

### Running the Apps

#### Students App
```bash
# Start students app
npm run start:students

# Or directly
cd students-app && npm start
```

#### Instructors App
```bash
# Start instructors app
npm run start:instructors

# Or directly
cd instructors-app && npm start
```

### Development Scripts

Available scripts from the root:
- `npm run start` - Starts the students app (default)
- `npm run start:students` - Starts the students app
- `npm run start:instructors` - Starts the instructors app

## Apps Overview

### Students App
- **Framework**: Expo with TypeScript
- **Navigation**: Expo Router with tab-based navigation
- **Features**: Built with modern components and theming

### Instructors App
- **Framework**: Expo with TypeScript
- **Navigation**: Expo Router with tab-based navigation
- **Features**: Built with modern components and theming

## Shared Packages

The monorepo includes three shared packages:

### shared-components
Reusable UI components with TypeScript support:
- `Button` - Customizable button with variants
- `Card` - Container component with shadow
- `Text` - Typography component with variants

### shared-utils
Common utility functions:
- Date formatting (`formatDate`, `formatTime`, `formatDateTime`)
- Validation (`validateEmail`, `validatePhone`, `validatePassword`)
- String utilities (`capitalize`, `truncate`, `slugify`)
- Function utilities (`debounce`, `throttle`)

### shared-types
TypeScript type definitions:
- User types (`User`, `Student`, `Instructor`)
- Course types (`Course`, `Lesson`, `Assignment`)
- API types (`ApiResponse`, `ErrorResponse`)
- Navigation types (`NavigationProps`, `ScreenProps`)

## Using Shared Packages

To use shared packages in your apps:

1. Add the package as a dependency in app's `package.json`:
```json
{
  "dependencies": {
    "shared-components": "*",
    "shared-utils": "*",
    "shared-types": "*"
  }
}
```

2. Install dependencies from root:
```bash
npm install
```

3. Import in your code:
```typescript
import { Button, Card } from 'shared-components';
import { formatDate, validateEmail } from 'shared-utils';
import type { User, Course } from 'shared-types';
```

## CI/CD Pipeline

The project includes a GitHub Actions workflow that:
- Runs linting and TypeScript checks on both apps
- Builds both apps for web platform
- Publishes to Expo on main branch pushes

To set up publishing, add your `EXPO_TOKEN` to GitHub repository secrets.