# ProfileSwitcherBottomSheet

A comprehensive profile switching component that allows parents to switch between their own profile and their children's profiles, providing seamless multi-user account management for families.

## Overview

The ProfileSwitcherBottomSheet is a specialized bottom sheet component built on top of the Academy theme system, designed specifically for family account management in educational contexts.

## Features

- 👥 **Multi-Profile Support** - Switch between parent and children profiles
- 🎨 **Academy Theming** - Full integration with Academy design system
- 📱 **Mobile-First Design** - Optimized for touch interactions
- ♿ **Accessibility** - Screen reader support and proper labels
- ✨ **Visual Indicators** - Active profile checkmarks and role badges
- ➕ **Create New Profile** - Option to add new family member profiles

## Usage

### Basic Implementation

```tsx
import React, { useState } from 'react';
import { ProfileSwitcherBottomSheet } from '@academy/mobile-shared';

const MyComponent = () => {
  const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);
  const [activeProfileId, setActiveProfileId] = useState('parent-profile');

  const handleProfileSelect = (profile) => {
    console.log('Selected profile:', profile);
    setActiveProfileId(profile.id);
    // Implement profile switching logic here
    setShowProfileSwitcher(false);
  };

  return (
    <>
      <Button 
        title="Switch Profiles" 
        onPress={() => setShowProfileSwitcher(true)} 
      />
      
      <ProfileSwitcherBottomSheet
        visible={showProfileSwitcher}
        onClose={() => setShowProfileSwitcher(false)}
        onProfileSelect={handleProfileSelect}
        activeProfileId={activeProfileId}
      />
    </>
  );
};
```

### Menu Integration Example

```tsx
// In AppMenuScreen.tsx
const AppMenuScreen = () => {
  const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);

  return (
    <View>
      {/* Clickable Profile Card */}
      <Pressable onPress={() => navigation.navigate('EditProfile')}>
        <View style={styles.profileCard}>
          {/* Profile info */}
          
          {/* Profile Switcher Icon */}
          <Pressable onPress={() => setShowProfileSwitcher(true)}>
            <Ionicons name="people" size={24} />
          </Pressable>
        </View>
      </Pressable>

      <ProfileSwitcherBottomSheet
        visible={showProfileSwitcher}
        onClose={() => setShowProfileSwitcher(false)}
        onProfileSelect={handleProfileSelect}
      />
    </View>
  );
};
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | `boolean` | `false` | Controls bottom sheet visibility |
| `onClose` | `() => void` | Required | Callback when bottom sheet should close |
| `activeProfileId` | `string` | `undefined` | ID of currently active profile |
| `onProfileSelect` | `(profile: ProfileOption) => void` | `undefined` | Callback when profile is selected |
| `profiles` | `ProfileOption[]` | Auto-generated | Custom profiles array |

### ProfileOption Interface

```typescript
interface ProfileOption {
  id: string;           // Unique identifier
  name: string;         // Display name
  role: 'parent' | 'student';  // User role
  isActive: boolean;    // Profile status
  avatar?: string;      // Profile image URL
  grade?: string;       // For student profiles
  program?: string;     // Associated academy program
}
```

## Auto-Generated Profiles

The component automatically generates appropriate profiles based on user role:

### For Parent Users (UserRole.PARENT)
- Parent profile with user's actual name
- Mock children profiles with names, grades, and programs
- "Create New Profile" option

### For Student Users (UserRole.STUDENT)
- Student's own profile
- Optional family member profiles (if applicable)
- "Create New Profile" option

## Visual Design

```
┌─────────────────────────────────────┐
│          Switch Profile             │
│                                     │
│  Choose which profile you'd like... │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │ ✓ [SJ] Sarah Johnson (Parent)  │ │ ← Active profile
│  └─────────────────────────────────┘ │
│  ┌─────────────────────────────────┐ │
│  │   [EJ] Emma Johnson (Student)  │ │ ← Child profile
│  │       Grade 5 • Swimming Academy│ │
│  └─────────────────────────────────┘ │
│  ┌─────────────────────────────────┐ │
│  │   [JJ] James Johnson (Student) │ │ ← Child profile
│  │       Grade 3 • Football Training │
│  └─────────────────────────────────┘ │
│  ┌─────────────────────────────────┐ │
│  │ ➕ Create New Profile          │ │ ← Add profile option
│  │    Add a child or family member│ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## Theme Integration

The component uses Academy theme tokens for consistent styling:

- **Colors**: `theme.colors.interactive.primary` for active states
- **Spacing**: Academy spacing system (`theme.spacing.*`)
- **Typography**: Academy font system (`theme.fontSizes.*`)
- **Borders**: Academy border radius (`theme.borderRadius.*`)
- **Elevation**: Academy shadow system (`theme.elevation.*`)

## Best Practices

### Profile Management
```tsx
// Store selected profile in state management
const handleProfileSelect = (profile: ProfileOption) => {
  // Update global user context
  userStore.setActiveProfile(profile);
  
  // Update navigation context if needed
  navigation.setParams({ profileId: profile.id });
  
  // Close bottom sheet
  setShowProfileSwitcher(false);
};
```

### Error Handling
```tsx
// Handle empty or failed profile generation
<ProfileSwitcherBottomSheet
  visible={showProfileSwitcher}
  onClose={handleClose}
  profiles={profiles.length > 0 ? profiles : defaultProfiles}
  onProfileSelect={handleProfileSelect}
/>
```

### Accessibility
```tsx
// Ensure proper accessibility labels
<Pressable
  onPress={openProfileSwitcher}
  accessibilityLabel="Switch between family profiles"
  accessibilityHint="Opens profile selection menu"
>
  <Ionicons name="people" size={24} />
</Pressable>
```

## Related Components

- **[BottomSheet](../ui/BottomSheet.md)** - Base bottom sheet component
- **[CustomModal](../ui/Modal.md)** - Alternative modal patterns
- **[MenuList](../ui/MenuList.md)** - List interface patterns
- **[Header](../ui/Header.md)** - Navigation header integration

## Academy Design System

Part of the Academy Mobile Apps component library, following:
- 🎨 **Academy Brand Colors** - Consistent purple (#4F2EC9) theming
- 📱 **Mobile-First Design** - Touch-optimized interactions
- ♿ **Accessibility Standards** - WCAG compliance
- 🏗️ **TypeScript Support** - Full type safety and IntelliSense