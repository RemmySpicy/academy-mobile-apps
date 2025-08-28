# EditProfileScreen Component

The `EditProfileScreen` provides a comprehensive profile editing interface for Academy students, featuring dual photo management (cover photo + profile picture), extensive form sections, and a professional social media-inspired layout.

## 🎯 Overview

**Location**: `students-app/src/features/profile/screens/EditProfileScreen.tsx`

The EditProfileScreen offers a complete profile management solution with:
- **Dual Photo System**: Cover photo with overlapping profile picture
- **Professional Layout**: Modern design similar to LinkedIn/Facebook
- **Comprehensive Forms**: Personal, emergency, address, and Academy-specific information
- **State Management**: Edit/view modes with change tracking and confirmation dialogs
- **Mobile-First Design**: Optimized for touch interactions and mobile screens

## 🚀 Key Features

### **Visual Design**
- **240px cover photo** with gradient overlays and professional styling
- **140px profile picture** positioned on the left side, overlapping the cover
- **Stats section** below the cover showing Sessions, Achievements, and Progress
- **Academy branding** with consistent theming and animations

### **Photo Management**
- **Cover Photo**: Camera/gallery selection, remove option, placeholder state
- **Profile Picture**: Separate management with initials fallback
- **Interactive Editing**: Camera icons appear in edit mode
- **Visual Feedback**: Proper loading states and error handling

### **Form Sections**
1. **Personal Information**: Name, email, phone, date of birth
2. **Emergency Contact**: Contact name and phone number
3. **Address Information**: Street, city, state, ZIP code
4. **Academy Information**: Program, skill level, goals, medical conditions

### **State Management**
- **Edit/View Modes**: Toggle between viewing and editing
- **Change Tracking**: Detects unsaved changes
- **Confirmation Dialogs**: Save/discard confirmations
- **Form Validation**: Proper input validation and error states

## 📱 User Interface

### **Cover Photo Layout**
```
┌─────────────────────────────────┐
│         Cover Photo             │ ← 240px height
│  ┌─────┐                       │ ← Camera button (edit mode)
│  │ 👤  │ Alex Johnson          │ ← Profile (140px) + User info
│  │140px│ Swimming • Intermediate│ ← Program badge
│  └─────┘                       │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│    12      3      85%          │ ← Stats section
│ Sessions  Achiev  Progress     │
└─────────────────────────────────┘
```

### **Profile Picture Features**
- **Left-positioned** overlapping the cover photo
- **6px white border** for separation and elegance
- **Camera edit button** in bottom-right corner when editing
- **Initials fallback** when no profile picture is set
- **Elevated shadow** for depth and visual hierarchy

### **User Information Display**
- **White text** on cover photo with text shadows for readability
- **Program badge** with semi-transparent black background
- **School icon** for visual context and branding
- **Responsive text sizing** for different screen sizes

## 🔧 Implementation

### **Basic Usage**

```typescript
import React from 'react';
import { EditProfileScreen } from '../features/profile/screens/EditProfileScreen';

// Navigation setup
<Stack.Screen 
  name="EditProfile" 
  component={EditProfileScreen}
  options={{
    title: 'Edit Profile',
    headerShown: true,
  }}
/>
```

### **Data Structure**

```typescript
interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  emergencyContact: string;
  emergencyPhone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  profilePicture?: string;
  coverPhoto?: string;        // ← New cover photo field
  program: string;
  skillLevel: string;
  goals: string;
  medicalConditions: string;
}
```

### **Photo Management Functions**

```typescript
// Cover photo management
const handleChangeCoverPhoto = () => {
  const options = [
    { text: 'Take Photo', onPress: () => takeCoverPhoto() },
    { text: 'Choose from Gallery', onPress: () => selectCoverPhoto() },
    // Remove option only shown if cover exists
    ...(profile.coverPhoto ? [{
      text: 'Remove Cover Photo',
      onPress: () => removeCoverPhoto(),
      style: 'destructive'
    }] : [])
  ];
  Alert.alert('Change Cover Photo', 'Choose an option', options);
};

// Profile picture management
const handleChangeProfilePicture = () => {
  Alert.alert('Change Profile Picture', 'Choose an option', [
    { text: 'Take Photo', onPress: () => takeProfilePhoto() },
    { text: 'Choose from Gallery', onPress: () => selectProfilePhoto() }
  ]);
};
```

### **State Management**

```typescript
const [profile, setProfile] = useState<UserProfile>({...});
const [isEditing, setIsEditing] = useState(false);
const [hasChanges, setHasChanges] = useState(false);

// Handle input changes with change tracking
const handleInputChange = (field: keyof UserProfile, value: string) => {
  setProfile(prev => ({ ...prev, [field]: value }));
  setHasChanges(true);
};

// Save with confirmation
const handleSave = () => {
  Alert.alert('Save Changes', 'Are you sure?', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Save', onPress: () => saveProfile() }
  ]);
};
```

## 🎨 Visual Specifications

### **Cover Photo Styling**
```typescript
const coverPhotoStyle = {
  height: 240,
  borderRadius: theme.borderRadius.xl,
  overflow: 'hidden',
  position: 'relative',
  ...theme.elevation.md,
};
```

### **Profile Picture Styling**
```typescript
const profilePictureStyle = {
  width: 140,
  height: 140,
  borderRadius: 70,
  backgroundColor: theme.colors.interactive.primary,
  borderWidth: 6,
  borderColor: theme.colors.background.secondary,
  position: 'absolute',
  bottom: -40,
  left: theme.spacing.lg,
  ...theme.elevation.lg,
};
```

### **User Info Styling**
```typescript
const userInfoStyle = {
  color: 'white',
  fontSize: theme.fontSizes['2xl'],
  fontWeight: theme.fontConfig.fontWeight.bold,
  textShadowColor: 'rgba(0, 0, 0, 0.7)',
  textShadowOffset: { width: 0, height: 1 },
  textShadowRadius: 3,
};
```

## 🌟 Enhanced Features

### **Stats Display**
- **Session Count**: Total completed sessions
- **Achievements**: Earned badges/milestones  
- **Progress**: Overall Academy progress percentage
- **Connected Design**: Visually connected to cover photo with overlapping layout

### **Form Sections**
- **Personal Information**: Core user details with proper validation
- **Emergency Contact**: Required safety information for Academy programs
- **Address Information**: Location data for scheduling and logistics
- **Academy Information**: Program-specific details and goals

### **User Experience**
- **Touch-friendly**: Large touch targets and proper spacing
- **Visual Feedback**: Loading states, animations, and confirmations
- **Error Handling**: Graceful error states and user feedback
- **Accessibility**: Proper labels, hints, and screen reader support

## 🔒 Data Handling

### **Privacy Considerations**
- **Secure Storage**: Profile data stored securely with encryption
- **Photo Management**: Images handled with proper permissions
- **Form Validation**: Client-side validation with server verification
- **Change Tracking**: Only send modified fields to reduce data transfer

### **API Integration**
```typescript
// Profile update API call
const updateProfile = async (profileData: Partial<UserProfile>) => {
  try {
    const response = await api.patch('/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Profile update failed:', error);
    throw error;
  }
};
```

## 🎯 Usage Guidelines

### **When to Use**
- **Account Management**: Primary profile editing interface
- **Onboarding**: Initial profile setup for new users
- **Settings Integration**: Link from settings/account sections
- **Profile Updates**: Periodic information updates

### **Best Practices**
- **Save Confirmation**: Always confirm before saving changes
- **Change Detection**: Warn users about unsaved changes
- **Photo Quality**: Encourage high-quality photos for better experience
- **Form Validation**: Validate all fields before submission

## 📱 Mobile Optimization

### **Touch Interactions**
- **44px minimum** touch targets for all interactive elements
- **Gesture Support**: Swipe gestures for photo management
- **Haptic Feedback**: Confirmation feedback for important actions
- **Loading States**: Clear feedback during photo uploads

### **Performance**
- **Image Optimization**: Automatic image resizing and compression
- **Lazy Loading**: Load sections as needed for better performance
- **Memory Management**: Proper cleanup of image resources
- **Offline Support**: Cache profile data for offline viewing

## 🔧 Customization

### **Theme Integration**
All styling uses the Academy theme system:

```typescript
import { useTheme } from '@academy/mobile-shared';

const { theme } = useTheme();
// All colors, spacing, and styling from theme
```

### **Program-Specific Customization**
- **Swimming**: Pool-specific terminology and metrics
- **Football**: Field position and role information
- **Basketball**: Court position and statistics
- **Music**: Instrument and practice information

The EditProfileScreen provides a comprehensive, professional profile editing experience that enhances user engagement and maintains Academy's high-quality user experience standards.