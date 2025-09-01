# AppMenuScreen Component

Main menu screen component for Academy mobile applications with role-based features and professional interface design.

## Overview

The `AppMenuScreen` is a comprehensive menu interface that adapts to different user roles (student, parent, instructor, coordinator) and provides access to all app features through an organized, visually appealing interface.

## Features

### 🎯 Core Features
- **Role-based content** - Different menu items and features based on user role
- **Enhanced Profile Card** - Interactive profile header with cover photo and expansion modals
- **Profile Switching** - Multi-profile support with bottom sheet interface
- **Expandable Images** - Cover photo and profile picture expand to full-screen modals
- **Categorized sections** - Organized menu items in logical groups
- **Quick access cards** - Prominent access to frequently used features
- **Animated transitions** - Smooth entrance animations with staggered timing
- **Academy theming** - Full integration with Academy design system

### 📱 Mobile Optimizations
- **Touch-friendly interface** - Properly sized touch targets
- **Responsive layout** - Adapts to different screen sizes
- **Safe area support** - Proper handling of device safe areas
- **Accessibility** - Full accessibility support with proper labels

## Usage

### Basic Implementation

```typescript
import { AppMenuScreen } from '@academy/mobile-shared';
// Or for app-specific implementations:
import { AppMenuScreen } from '../features/menu/screens/AppMenuScreen';

// Used within a stack navigator
<Stack.Screen 
  name="MenuMain" 
  component={AppMenuScreen}
  options={{ headerShown: false }}
/>
```

### Navigation Integration

```typescript
// Menu Navigator setup
import { MenuNavigator } from '../features/menu/navigation/MenuNavigator';

<Tab.Screen
  name="MenuTab"
  component={MenuNavigator}
  options={{
    tabBarLabel: 'Menu',
    tabBarIcon: ({ focused, color, size }) => (
      <Ionicons 
        name={focused ? 'menu' : 'menu-outline'} 
        size={size} 
        color={color} 
      />
    ),
  }}
/>
```

## Role-Specific Content

### Student App Features
- **Enhanced Profile Card**: Cover photo, overlapping profile picture (84px), profile switcher
- **Profile Switching**: Bottom sheet with multi-profile support and child profile creation
- **Academic Display**: Level, class, progress indicators (18/36 achievements)
- **Academy Features**: Courses, services, achievements, store, transactions, referrals
- **Quick Access**: Today's schedule, achievements, store
- **Image Expansion**: Clickable cover photo and profile picture with full-screen modals
- **Parent Mode**: Switch between student and parent views (for parent users)

### Instructor App Features
- **Instructor Tools**: Class management, student reports, attendance tracker, grade book
- **Professional Features**: Lesson plans, communication tools, analytics, resources
- **Quick Access**: Today's classes, take attendance, grade book
- **Profile Stats**: Active students, classes today, instructor rating
- **Professional Development**: Access to training and certification programs

## Component Structure

### Enhanced Profile Card
```typescript
// Modern profile card with cover photo and interactive elements
<EnhancedProfileCard>
  <Pressable onPress={handleExpandCoverPhoto}>
    <CoverPhoto />
  </Pressable>
  <Pressable onPress={handleExpandProfilePicture}>
    <OverlappingAvatar size={84} />
  </Pressable>
  <StudentDetails>
    <UserName />
    <AcademicLevel icon="school" />
    <ProgressIndicator stars="18/36" />
  </StudentDetails>
  <ProfileSwitcher icon="people" onPress={handleProfileSwitch} />
  <PerformanceMetricsButton />
</EnhancedProfileCard>
```

### Profile Switching System
```typescript
// Bottom sheet for profile management
<ProfileSwitcherBottomSheet
  visible={showProfileSwitcher}
  profiles={userProfiles}
  onProfileSelect={handleProfileSelect}
  onCreateChildProfile={handleCreateChildProfile}
>
  <ProfileCard active={profile.isActive}>
    <ProfileAvatar />
    <ProfileInfo level={profile.level} program={profile.program} />
    <ActiveIndicator />
  </ProfileCard>
  <CreateChildProfileCard />
</ProfileSwitcherBottomSheet>
```

### Image Expansion Modal
```typescript
// Full-screen image viewer
<ImageExpansionModal visible={showImageModal}>
  <DarkOverlay />
  <CloseButton />
  {selectedImage.type === 'cover' ? (
    <ExpandedCoverPhoto />
  ) : (
    <ExpandedProfilePicture size={200} />
  )}
  <ImageInfo />
  <TapToCloseHint />
</ImageExpansionModal>
```

### Feature Sections
```typescript
// Main feature grid using MenuList
<MenuList
  items={roleBasedFeatures}
  columns={2}
  variant="card"
  spacing={theme.spacing.sm}
/>
```

### Quick Access Cards
```typescript
// Horizontal row of quick access actions
<QuickAccessSection>
  <ActionCard />
  <ActionCard />
  <ActionCard />
</QuickAccessSection>
```

## Props Interface

```typescript
interface AppMenuScreenProps {
  // No props - uses navigation and auth context
}

// Navigation types
type MenuStackParamList = {
  MenuMain: undefined;
  EditProfile: undefined;
  Settings: undefined;
  // ... additional screens
};
```

## Theming

### Academy Theme Integration

```typescript
// Colors used
theme.colors.interactive.primary    // Academy purple for primary actions
theme.colors.background.primary     // Card backgrounds
theme.colors.text.primary          // Main text
theme.colors.status.success        // Success indicators
theme.colors.status.warning        // Warning/attention items

// Spacing
theme.spacing.md                   // Standard padding
theme.spacing.lg                   // Section spacing
theme.spacing.xl                   // Large section breaks

// Elevation
theme.elevation.sm                 // Card shadows
```

### Dark Mode Support
- Automatic theme switching based on system preferences
- Consistent color schemes across light and dark modes
- High contrast support for accessibility

## Animation System

### Entrance Animations
```typescript
// Staggered entrance animations
<Animated.View
  entering={FadeInDown.delay(index * 100).springify()}
>
  <MenuSection />
</Animated.View>

// Icon animations with spring physics
<Animated.View
  entering={FadeInRight.delay(index * 50).springify()}
>
  <MenuItem />
</Animated.View>
```

### Timing Schedule
- Profile header: 100ms delay
- Feature sections: 200ms delay
- Quick access: 400ms delay  
- Account section: 500ms delay
- Support section: 700ms delay
- Featured content: 800ms delay

## User Experience Features

### Visual Hierarchy
- **Large profile header** - Establishes user context immediately
- **Grouped sections** - Related features organized together  
- **Color-coded icons** - Different colors for different feature categories
- **Clear typography** - Proper font weights and sizes for readability

### Interactive Elements
- **Haptic feedback** - Subtle feedback for button presses
- **Loading states** - Proper loading indicators during navigation
- **Error handling** - Graceful error states with retry options
- **Offline support** - Cached content for offline viewing

## Accessibility

### Screen Reader Support
- Proper heading structure with role="heading"
- Descriptive button labels and hints
- Semantic grouping with role="group"
- Focus management for keyboard navigation

### Visual Accessibility  
- High contrast color schemes
- Minimum 44pt touch targets
- Clear visual hierarchy
- Support for system font scaling

## Performance

### Optimizations
- **Lazy loading** - Menu items load as needed
- **Image optimization** - Compressed icons and graphics
- **Memory management** - Proper cleanup of event listeners
- **Bundle splitting** - Code splitting for faster initial load

### Metrics
- **Load time**: < 100ms for menu rendering
- **Animation performance**: 60fps on all target devices
- **Memory usage**: < 50MB additional heap usage
- **Bundle size**: ~15KB gzipped (including dependencies)

## Testing

### Unit Tests
```typescript
describe('AppMenuScreen', () => {
  it('renders role-based menu items correctly', () => {
    render(<AppMenuScreen />);
    expect(screen.getByText('Instructor Tools')).toBeInTheDocument();
  });

  it('handles navigation correctly', () => {
    const mockNavigate = jest.fn();
    render(<AppMenuScreen navigation={{ navigate: mockNavigate }} />);
    fireEvent.press(screen.getByText('Class Management'));
    expect(mockNavigate).toHaveBeenCalledWith('ClassManagement');
  });
});
```

### Integration Tests
- Navigation flow testing
- Role-based content testing  
- Authentication state testing
- Theme switching testing

## Common Patterns

### Adding New Menu Items

```typescript
// Add to the appropriate section array
const instructorMenuItems: MenuItem[] = [
  ...existingItems,
  {
    id: 'new-feature',
    title: 'New Feature',
    subtitle: 'Description of new feature',
    icon: 'add-circle-outline',
    color: theme.colors.interactive.primary,
    onPress: () => navigation.navigate('NewFeature'),
  }
];
```

### Role-based Feature Flags

```typescript
// Conditional rendering based on user role
{user?.role === 'coordinator' && (
  <MenuItem
    title="Admin Tools"
    onPress={() => navigation.navigate('AdminTools')}
  />
)}
```

### Feature Badges

```typescript
// Add notification badges to menu items  
{
  id: 'messages',
  title: 'Messages',
  icon: 'mail-outline',
  badge: unreadCount > 0 ? unreadCount.toString() : undefined,
  onPress: () => navigation.navigate('Messages'),
}
```

## Related Components

- **[MenuNavigator](./MenuNavigator.md)** - Navigation stack for menu screens
- **[MenuList](../navigation/MenuList.md)** - Grid-based menu component
- **[Header](../navigation/Header.md)** - Page header component
- **[NavigationHeader](../navigation/NavigationHeader.md)** - Stack navigation header

## Migration Guide

### From Legacy Menu Systems
1. Replace static menu arrays with role-based dynamic content
2. Update navigation props to use new MenuStackParamList types
3. Migrate animations to React Native Reanimated v3
4. Update theme references to new Academy theme system
5. Add accessibility labels and semantic markup

### Breaking Changes
- Menu item structure changed to include subtitles and colors
- Navigation prop types updated for TypeScript 5.x
- Animation timing values adjusted for better UX
- Icon names updated to use Ionicons v6 naming convention