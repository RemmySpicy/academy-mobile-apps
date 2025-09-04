# Profile Card System Documentation

**Status**: ✅ **COMPLETE & PRODUCTION READY**

The Academy Apps feature a modern, interactive profile card system with advanced UI patterns for enhanced user experience and multi-profile management.

## 📋 Table of Contents

- [Overview](#overview)
- [Profile Card Features](#profile-card-features)
- [Profile Switching System](#profile-switching-system)
- [Image Expansion Modal](#image-expansion-modal)
- [Technical Implementation](#technical-implementation)
- [Usage Examples](#usage-examples)
- [Academy Design Integration](#academy-design-integration)

## 🎯 Overview

The profile card system provides a comprehensive user profile experience with:

- **Interactive Profile Cards**: Modern cards with cover photos and overlapping profile pictures
- **Multi-Profile Management**: Support for parents managing multiple child profiles
- **Image Expansion Modals**: Full-screen image viewing with touch interactions
- **Profile Switching**: Seamless switching between family member profiles
- **Academic Progress Display**: Integration with performance and achievement systems

## 🎨 Profile Card Features

### **Visual Design**
- **Cover Photo with Expansion**: Clickable cover image that expands to full-screen modal
- **Overlapping Profile Picture**: Large profile avatar (84px) that overlaps the cover photo for modern layered design
- **Expandable Profile Picture**: Profile picture expands to 200px with enhanced details and context
- **Academy Theming**: Consistent with Academy purple brand colors and design system

### **Interactive Elements**
- **Touch Interactions**: Tap-to-expand functionality for both cover photos and profile pictures
- **Profile Switcher Integration**: Quick access button to switch between multiple profiles
- **Academic Progress Display**: Level, class, and achievement progress indicators
- **Performance Metrics Access**: Direct navigation to detailed performance analytics

### **Content Display**
- **Student Information**: Name, level, program, and academic status
- **Progress Indicators**: Visual representation of course progress and achievements
- **Quick Actions**: Fast access to common profile management tasks
- **Contextual Information**: Relevant details based on user type and program enrollment

## 👥 Profile Switching System

### **Multi-Profile Support**
- **Parent Dashboard**: Parents can manage multiple child profiles from a single account
- **Profile Overview**: Quick view of all family member profiles with status indicators
- **Active Profile Indicator**: Clear visual indication of currently selected profile
- **Easy Profile Creation**: Streamlined process for adding new student profiles

### **Bottom Sheet Interface**
- **Smooth Animation**: Elegant bottom sheet presentation with Academy-themed design
- **Profile Selection Cards**: Visual profile cards showing name, level, program, and active status
- **Quick Switching**: One-tap profile switching with immediate context updates
- **Profile Management**: Access to profile editing and settings from the switcher

### **Visual Profile Cards**
```
┌─────────────────────────────────┐
│  [Avatar] Emma Wilson          │
│           Level 2 • Swimming   │
│           ● Active             │
└─────────────────────────────────┘
```

Each profile card displays:
- **Profile Avatar**: Student's profile picture or placeholder
- **Name & Level**: Full name with current academic level
- **Program Information**: Enrolled program(s) with status indicators
- **Active Status**: Visual indicator for currently selected profile

## 🖼️ Image Expansion Modal

### **Full-Screen Experience**
- **Dark Overlay**: Semi-transparent dark background for focus and contrast
- **Centered Image Display**: Optimally positioned image with proper aspect ratio handling
- **Contextual Information**: Overlay text showing relevant details (student name, photo context)
- **Touch Interactions**: Tap anywhere outside image or dedicated close button to dismiss

### **Technical Features**
- **Safe Area Handling**: Proper insets for devices with notches and dynamic islands
- **Responsive Sizing**: Images scale appropriately for different screen sizes and orientations
- **Performance Optimization**: Efficient image loading and memory management
- **Accessibility Support**: VoiceOver and screen reader compatibility

### **Interaction Patterns**
- **Tap to Expand**: Single tap on cover photo or profile picture to expand
- **Tap to Close**: Tap anywhere outside the image or close button to dismiss
- **Gesture Support**: Support for common mobile gestures (pinch-to-zoom planned)
- **Animation**: Smooth transition animations for expand/collapse

## 🛠️ Technical Implementation

### **Component Architecture**

```
ProfileCard
├── CoverPhoto (expandable)
├── ProfilePicture (overlapping, expandable)
├── ProfileInfo (name, level, progress)
├── QuickActions (switcher, settings)
└── ImageExpansionModal
```

### **State Management**

```typescript
interface ProfileCardState {
  activeProfile: UserProfile;
  availableProfiles: UserProfile[];
  showImageModal: boolean;
  expandedImage: ImageSource | null;
  showProfileSwitcher: boolean;
}

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  level: string;
  program: string;
  avatarUrl?: string;
  coverPhotoUrl?: string;
  isActive: boolean;
  academicProgress: AcademicProgress;
}
```

### **Key Components**

- **`ProfileCard`**: Main profile display component
- **`ProfileSwitcherBottomSheet`**: Multi-profile management interface
- **`ImageExpansionModal`**: Full-screen image viewer
- **`ProfileProgressIndicator`**: Academic progress visualization

## 💻 Usage Examples

### **Basic Profile Card**

```typescript
import { ProfileCard } from '@academy/mobile-shared';

<ProfileCard
  profile={{
    id: '1',
    firstName: 'Emma',
    lastName: 'Wilson',
    level: 'Level 2',
    program: 'Swimming',
    avatarUrl: 'https://example.com/avatar.jpg',
    coverPhotoUrl: 'https://example.com/cover.jpg',
    isActive: true,
    academicProgress: {
      completedSessions: 12,
      totalSessions: 16,
      currentLevel: 2,
      achievements: 8
    }
  }}
  onProfileSwitch={() => setShowProfileSwitcher(true)}
  onImageExpand={handleImageExpansion}
/>
```

### **Profile Switcher Bottom Sheet**

```typescript
import { ProfileSwitcherBottomSheet } from '@academy/mobile-shared';

<ProfileSwitcherBottomSheet
  visible={showProfileSwitcher}
  onClose={() => setShowProfileSwitcher(false)}
  profiles={familyProfiles}
  activeProfile={currentProfile}
  onProfileSelect={handleProfileSwitch}
  onCreateProfile={handleCreateNewProfile}
/>
```

### **Image Expansion Modal**

```typescript
import { ImageExpansionModal } from '@academy/mobile-shared';

<ImageExpansionModal
  visible={showImageModal}
  imageSource={expandedImage}
  title="Emma's Profile Photo"
  subtitle="Swimming Program • Level 2"
  onClose={() => setShowImageModal(false)}
/>
```

## 🎨 Academy Design Integration

### **Color Scheme**
- **Primary**: Academy Purple (#4F2EC9) for interactive elements and active states
- **Success**: Green for progress indicators and positive status
- **Background**: Academy background colors for cards and overlays
- **Text**: Academy text colors with proper contrast ratios

### **Typography**
- **Headers**: Academy bold font weights for names and titles
- **Body Text**: Academy medium weights for descriptions and details
- **Labels**: Academy small fonts for secondary information

### **Spacing & Layout**
- **Card Padding**: `theme.spacing.md` (16px) for consistent internal spacing
- **Element Margins**: Academy spacing scale for consistent gaps
- **Responsive Design**: Optimal layout across different screen sizes

### **Interactive Elements**
- **Touch Targets**: Minimum 48px for accessibility compliance
- **Hover States**: Subtle visual feedback for interactive elements
- **Focus States**: Clear focus indicators for keyboard navigation

## 📱 Mobile-First Features

### **Touch Interactions**
- **Tap Targets**: Optimized touch zones for easy interaction
- **Gesture Support**: Natural mobile gestures for navigation
- **Haptic Feedback**: Tactile feedback for important interactions

### **Performance**
- **Image Optimization**: Efficient loading and caching strategies
- **Animation Performance**: 60fps smooth animations
- **Memory Management**: Optimal resource usage for large profile lists

### **Accessibility**
- **VoiceOver Support**: Complete screen reader compatibility
- **Dynamic Text**: Respects system text size preferences
- **High Contrast**: Support for accessibility display modes

## 🔗 Navigation Integration

### **Profile Access Points**
- **Menu Screen**: Primary profile card display
- **Settings**: Profile management and editing
- **Profile Switcher**: Quick profile changing interface
- **Achievement Pages**: Context-aware profile information

### **Navigation Flow**
```
Menu → Profile Card → Profile Switcher → Individual Profile
                  → Image Expansion → Full-Screen View
                  → Profile Settings → Edit Profile
```

## ✅ Production Readiness

### **Quality Assurance**
- ✅ **TypeScript Coverage**: Full type safety for all components
- ✅ **Error Handling**: Graceful handling of missing images and network issues
- ✅ **Loading States**: Smooth loading indicators for image content
- ✅ **Accessibility**: WCAG 2.1 AA compliance
- ✅ **Performance**: Optimized for mobile device constraints

### **Cross-Platform**
- ✅ **iOS**: Native iOS design patterns and interactions
- ✅ **Android**: Material Design compliance where appropriate
- ✅ **Web**: Responsive web interface compatibility
- ✅ **Development**: Hot reload and fast refresh support

### **Testing**
- ✅ **Unit Tests**: Component logic and state management
- ✅ **Integration Tests**: Profile switching and image expansion flows
- ✅ **Visual Tests**: Consistent rendering across devices
- ✅ **Accessibility Tests**: Screen reader and keyboard navigation

## 🔗 Related Documentation

- **[Component Library](../components/README.md)** - ProfileCard and related components
- **[Menu System](./MENU_SYSTEM.md)** - Profile card integration in menu
- **[Achievement System](./achievements/README.md)** - Academic progress integration
- **[Theme System](../THEME_SYSTEM.md)** - Academy design system reference

## 🚀 Future Enhancements

### **Planned Features**
- **Pinch-to-Zoom**: Advanced image interaction in expansion modal
- **Profile Customization**: Custom cover photos and themes
- **Social Features**: Profile sharing and family connections
- **Offline Support**: Local profile data caching

### **Optimization Opportunities**
- **Advanced Animations**: More sophisticated transition effects
- **Batch Operations**: Multi-profile management features
- **Integration APIs**: Third-party photo services and social platforms
- **Analytics**: Profile interaction tracking and optimization

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintainer**: Academy Development Team