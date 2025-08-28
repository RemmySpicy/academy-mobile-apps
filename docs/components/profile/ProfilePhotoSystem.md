# Profile Photo System

The Academy Profile Photo System provides a comprehensive dual-photo management solution featuring cover photos and profile pictures with modern social media-inspired design and functionality.

## 🎯 Overview

The Profile Photo System consists of two main photo components:
1. **Cover Photo** - Large background photo (240px height)  
2. **Profile Picture** - Circular avatar photo (140px) overlapping the cover

**Key Features:**
- **Professional Layout**: Similar to LinkedIn/Facebook profile designs
- **Interactive Management**: Separate editing for each photo type
- **Fallback States**: Elegant placeholders when photos aren't set
- **Academy Theming**: Consistent with Academy design system
- **Mobile-First**: Optimized for touch interactions and mobile screens

## 📐 Visual Design

### **Layout Structure**
```
┌─────────────────────────────────┐
│         Cover Photo             │ ← 240px height, full width
│  ┌─────┐                       │ ← Camera button (top-right)
│  │ 👤  │ User Name              │ ← Profile pic (140px, left)  
│  │140px│ Program • Level        │ ← User info (right side)
│  └─────┘                       │ ← -40px overlap from cover
└─────────────────────────────────┘
┌─────────────────────────────────┐
│    Stats Section Below          │ ← Connected design
└─────────────────────────────────┘
```

### **Visual Hierarchy**
- **Cover Photo**: Primary background element, sets the visual tone
- **Profile Picture**: Focal point, positioned on left with elevation
- **User Information**: Secondary content, positioned on right side
- **Stats Section**: Supporting content below with connected styling

## 🖼️ Cover Photo Component

### **Specifications**
- **Dimensions**: 240px height, full width with rounded corners
- **Aspect Ratio**: Landscape orientation optimized
- **Position**: Top section of profile layout
- **Styling**: Rounded corners, elevation shadow, gradient overlays

### **States**

#### **With Cover Photo**
```typescript
{profile.coverPhoto ? (
  <Image 
    source={{ uri: profile.coverPhoto }}
    style={{ 
      width: '100%', 
      height: '100%',
      resizeMode: 'cover',
    }}
  />
) : (
  // Placeholder state
)}
```

#### **Placeholder State**
- **Gradient Background**: Subtle Academy purple gradient
- **Icon Display**: Large image icon (40px) in centered circle
- **Call-to-Action**: "Add Cover Photo" with subtitle
- **Interactive**: Clickable area for photo selection

### **Interactive Features**
- **Edit Button**: 44px camera button in top-right corner (edit mode only)
- **Photo Options**: Take photo, choose from gallery, remove (if exists)
- **Gradient Overlay**: Semi-transparent overlay for better text contrast
- **Touch Feedback**: Proper touch states and haptic feedback

## 👤 Profile Picture Component

### **Specifications**
- **Dimensions**: 140px circular (70px radius)
- **Position**: Overlapping cover photo, positioned on left side
- **Border**: 6px white border for separation and elegance
- **Elevation**: Strong shadow for depth and visual hierarchy

### **States**

#### **With Profile Picture**
```typescript
{profile.profilePicture ? (
  <Image 
    source={{ uri: profile.profilePicture }}
    style={{ width: 128, height: 128, borderRadius: 64 }}
  />
) : (
  // Initials fallback
)}
```

#### **Initials Fallback**
- **Academy Purple Background**: Brand color for consistency
- **White Text**: User's initials (first + last name)
- **Typography**: Bold 48px font size for readability
- **Accessibility**: Proper contrast ratio for text visibility

### **Interactive Features**
- **Edit Button**: 40px camera button in bottom-right corner
- **Photo Options**: Take photo, choose from gallery
- **Proper Layering**: Always above cover photo with proper z-index
- **Touch Area**: Sufficient touch area for mobile interaction

## 🎨 Styling Implementation

### **Cover Photo Styling**
```typescript
const coverPhotoContainerStyle = {
  height: 240,
  borderRadius: theme.borderRadius.xl,
  backgroundColor: profile.coverPhoto ? 'transparent' : theme.colors.background.primary,
  overflow: 'hidden',
  position: 'relative',
  ...theme.elevation.md,
};

const gradientOverlayStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.1)', // Fallback for gradient
};
```

### **Profile Picture Styling**
```typescript
const profilePictureStyle = {
  width: 140,
  height: 140,
  borderRadius: 70,
  backgroundColor: theme.colors.interactive.primary,
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 6,
  borderColor: theme.colors.background.secondary,
  position: 'absolute',
  bottom: -40, // Overlap with cover photo
  left: theme.spacing.lg,
  ...theme.elevation.lg,
};
```

### **Edit Button Styling**
```typescript
const editButtonStyle = {
  width: 44,
  height: 44,
  borderRadius: 22,
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  ...theme.elevation.sm,
};

const profileEditButtonStyle = {
  ...editButtonStyle,
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: theme.colors.interactive.primary,
  borderWidth: 4,
  borderColor: theme.colors.background.secondary,
  bottom: 4,
  right: 4,
};
```

## 🔧 Implementation

### **Photo Management Functions**

```typescript
// Cover photo management with conditional remove option
const handleChangeCoverPhoto = () => {
  const options = [
    { text: 'Cancel', style: 'cancel' as const },
    { text: 'Take Photo', onPress: () => console.log('Take cover photo') },
    { text: 'Choose from Gallery', onPress: () => console.log('Choose cover from gallery') },
  ];

  // Only show remove option if cover photo exists
  if (profile.coverPhoto) {
    options.push({
      text: 'Remove Cover Photo',
      onPress: () => handleInputChange('coverPhoto', ''),
      style: 'destructive' as const,
    });
  }

  Alert.alert('Change Cover Photo', 'Choose an option', options);
};

// Profile picture management
const handleChangeProfilePicture = () => {
  Alert.alert('Change Profile Picture', 'Choose an option', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Take Photo', onPress: () => console.log('Take profile photo') },
    { text: 'Choose from Gallery', onPress: () => console.log('Choose profile from gallery') },
  ]);
};
```

### **Image Handling**

```typescript
// Image picker integration
import * as ImagePicker from 'expo-image-picker';

const selectCoverPhoto = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [16, 9], // Landscape aspect ratio for cover
    quality: 0.8,
  });

  if (!result.canceled) {
    handleInputChange('coverPhoto', result.assets[0].uri);
  }
};

const selectProfilePicture = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1], // Square aspect ratio for profile
    quality: 0.8,
  });

  if (!result.canceled) {
    handleInputChange('profilePicture', result.assets[0].uri);
  }
};
```

## 📱 User Experience

### **Interaction Flow**
1. **View Mode**: Photos displayed with user information overlay
2. **Edit Mode**: Camera buttons appear for photo management
3. **Photo Selection**: Modal with take/choose/remove options
4. **Confirmation**: Changes tracked and saved with user confirmation

### **Visual Feedback**
- **Loading States**: Spinner during photo upload/processing
- **Error Handling**: Graceful error messages for failed operations
- **Success Feedback**: Confirmation when photos are successfully updated
- **Change Indicators**: Visual cues for unsaved changes

### **Accessibility Features**
- **Screen Reader Support**: Proper labels and descriptions
- **High Contrast**: Sufficient color contrast for text visibility
- **Touch Targets**: Minimum 44px touch areas for all buttons
- **Focus Management**: Proper focus order for keyboard navigation

## 🌟 Advanced Features

### **Image Optimization**
- **Automatic Resizing**: Photos resized to optimal dimensions
- **Compression**: Quality optimization for faster loading
- **Format Support**: JPEG, PNG, and WebP format handling
- **Caching**: Local caching for improved performance

### **Permission Handling**
```typescript
// Camera permissions
const requestCameraPermission = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission Required', 'Camera access is needed to take photos.');
    return false;
  }
  return true;
};

// Gallery permissions
const requestGalleryPermission = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission Required', 'Gallery access is needed to select photos.');
    return false;
  }
  return true;
};
```

## 🎯 Usage Guidelines

### **Photo Recommendations**
- **Cover Photo**: Landscape orientation, high resolution (1200x400px minimum)
- **Profile Picture**: Square format, clear face visibility, good lighting
- **Content Guidelines**: Professional or personal photos appropriate for Academy context
- **File Size**: Optimized for mobile networks (< 2MB recommended)

### **Design Principles**
- **Consistent Branding**: Photos should align with Academy's professional image
- **Personal Expression**: Allow users to showcase their personality
- **Visual Hierarchy**: Profile picture should complement, not compete with cover photo
- **Accessibility**: Ensure photos don't interfere with text readability

## 🔒 Privacy & Security

### **Data Handling**
- **Secure Upload**: HTTPS encryption for photo transfers
- **Privacy Controls**: User control over photo visibility
- **Storage Security**: Encrypted storage of photo data
- **Content Moderation**: Automated screening for inappropriate content

### **User Rights**
- **Photo Ownership**: Users retain rights to their uploaded photos
- **Removal Rights**: Ability to remove photos at any time
- **Data Export**: Photos included in data export requests
- **Account Deletion**: Photos removed when account is deleted

## 📊 Analytics & Insights

### **Usage Metrics**
- **Photo Upload Rates**: Track user engagement with photo features
- **Completion Rates**: Monitor profile completion with photos
- **Feature Usage**: Most popular photo management actions
- **Error Tracking**: Monitor and resolve photo upload issues

The Profile Photo System enhances user engagement and personalization while maintaining Academy's professional standards and user experience quality.