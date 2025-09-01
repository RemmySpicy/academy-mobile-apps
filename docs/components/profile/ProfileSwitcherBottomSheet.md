# ProfileSwitcherBottomSheet Component

A sophisticated bottom sheet component for managing multiple user profiles within Academy mobile applications, designed for parent/guardian accounts with multiple child profiles.

## Overview

The `ProfileSwitcherBottomSheet` provides an intuitive interface for users to switch between different profiles, view profile information, and create new child profiles. It's built on top of the Academy BottomSheet component with custom styling and interactions.

## Features

### 🎯 Core Features
- **Multi-Profile Display** - Visual list of all available profiles with active indicators
- **Profile Information** - Shows name, email, academic level, and program details
- **Active Profile Highlighting** - Clear visual indication of currently active profile
- **Child Profile Creation** - Easy access to create new student profiles
- **Smooth Animations** - Academy-themed transitions and interactions
- **Responsive Design** - Adapts to different screen sizes and content lengths

### 📱 Mobile Optimizations
- **Touch-friendly Cards** - Large touch targets for easy profile selection
- **Scrollable Content** - Handles large numbers of profiles gracefully
- **Safe Area Support** - Proper handling of device safe areas
- **Haptic Feedback** - Subtle feedback for profile selection

## Usage

### Basic Implementation

```typescript
import { ProfileSwitcherBottomSheet } from '../features/menu/components/ProfileSwitcherBottomSheet';

const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);
const [profiles, setProfiles] = useState<Profile[]>([]);

<ProfileSwitcherBottomSheet
  visible={showProfileSwitcher}
  onClose={() => setShowProfileSwitcher(false)}
  profiles={profiles}
  onProfileSelect={handleProfileSelect}
  onCreateChildProfile={handleCreateChildProfile}
/>
```

### With Mock Data

```typescript
const mockProfiles = [
  {
    id: '1',
    name: 'Benson Adeyemi',
    email: 'benson.adeyemi@example.com',
    role: 'student',
    isActive: true,
    level: 'Level 2: Fundamental Aquatic Skills',
    program: 'Swimming',
  },
  {
    id: '2',
    name: 'Kemi Adeyemi',
    email: 'kemi.adeyemi@example.com',
    role: 'student',
    isActive: false,
    level: 'Level 1: Water Safety',
    program: 'Swimming',
  },
];
```

## Props Interface

```typescript
interface Profile {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'parent';
  avatar?: string;
  isActive: boolean;
  level?: string;
  program?: string;
}

interface ProfileSwitcherBottomSheetProps {
  /** Whether the bottom sheet is visible */
  visible: boolean;
  /** Callback when bottom sheet should close */
  onClose: () => void;
  /** Array of available profiles */
  profiles: Profile[];
  /** Callback when a profile is selected */
  onProfileSelect: (profile: Profile) => void;
  /** Callback when create child profile is pressed */
  onCreateChildProfile: () => void;
}
```

## Profile Card Design

### Active Profile Styling
```typescript
// Active profile card features
{
  backgroundColor: theme.colors.interactive.primaryBackground,
  borderColor: theme.colors.interactive.primary,
  borderWidth: 1,
}

// Active profile avatar
{
  backgroundColor: theme.colors.interactive.primary,
  color: 'white', // White initials on purple background
}

// Active indicator
<Ionicons name="checkmark-circle" color={theme.colors.interactive.primary} />
```

### Inactive Profile Styling
```typescript
// Inactive profile card features
{
  backgroundColor: theme.colors.background.primary,
  borderColor: 'transparent',
}

// Inactive profile avatar  
{
  backgroundColor: `${theme.colors.interactive.accent}15`,
  color: theme.colors.interactive.accent,
}
```

## Component Structure

### Profile List Section
```typescript
<FlatList
  data={profiles}
  renderItem={({ item: profile }) => (
    <ProfileCard
      profile={profile}
      isActive={profile.isActive}
      onPress={() => selectProfile(profile)}
    >
      <ProfileAvatar />
      <ProfileDetails>
        <NameWithBadge />
        <EmailAddress />
        <AcademicInfo />
      </ProfileDetails>
      <ActiveIndicator />
    </ProfileCard>
  )}
/>
```

### Create Child Profile Section
```typescript
<CreateChildProfileCard>
  <PlusIcon />
  <CreateProfileText>
    <Title>Create Child Profile</Title>
    <Subtitle>Add a new student profile</Subtitle>
  </CreateProfileText>
</CreateChildProfileCard>
```

### Information Panel
```typescript
<InfoPanel>
  <InfoIcon />
  <InfoTitle>Profile Management</InfoTitle>
  <InfoDescription>
    Switch between profiles to manage different students' activities...
  </InfoDescription>
</InfoPanel>
```

## Theming

### Academy Theme Integration

```typescript
// Colors used
theme.colors.interactive.primary        // Active profile highlighting
theme.colors.interactive.primaryBackground // Active profile background
theme.colors.background.primary         // Card backgrounds
theme.colors.text.primary              // Profile names
theme.colors.text.secondary            // Email addresses
theme.colors.text.tertiary             // Academic info

// Interactive elements
theme.colors.status.warningBackground  // Info panel background
theme.colors.border.primary            // Card borders
```

### Profile Avatar Colors
- **Active Profile**: Purple background (`theme.colors.interactive.primary`) with white text
- **Inactive Profile**: Light purple background (`theme.colors.interactive.accent + 15%`) with purple text
- **Consistent Sizing**: 48px avatar for profile cards

## User Experience Features

### Visual Hierarchy
- **Active Profile First** - Active profile highlighted and easily identifiable
- **Clear Separation** - Distinct visual separation between profiles
- **Consistent Layout** - All profile cards follow the same layout pattern
- **Accessible Colors** - High contrast colors for better readability

### Interactive Feedback
- **Touch States** - Subtle press states for profile cards
- **Selection Feedback** - Immediate visual feedback on profile selection
- **Loading States** - Proper loading indicators during profile switching
- **Error Handling** - Graceful error states for failed operations

## Accessibility

### Screen Reader Support
- Profile cards have proper accessibility labels
- Active state announced for screen readers
- Create profile button properly labeled
- Information panel properly structured

### Visual Accessibility
- High contrast between active and inactive states
- Minimum 44pt touch targets for all interactive elements
- Clear visual hierarchy with proper color contrast
- Support for system font scaling

## Integration Patterns

### Menu Screen Integration
```typescript
// In AppMenuScreen component
const handleProfileSwitch = () => {
  setShowProfileSwitcher(true);
};

// Profile switcher button
<Pressable onPress={handleProfileSwitch}>
  <Ionicons name="people" />
</Pressable>
```

### Profile Selection Handling
```typescript
const handleProfileSelect = (profile: Profile) => {
  // Update active profile in global state
  updateActiveProfile(profile);
  
  // Update UI to reflect new profile
  setActiveProfile(profile);
  
  // Close bottom sheet
  setShowProfileSwitcher(false);
  
  // Optional: Show confirmation
  showToast(`Switched to ${profile.name}`);
};
```

### Child Profile Creation
```typescript
const handleCreateChildProfile = () => {
  // Close profile switcher
  setShowProfileSwitcher(false);
  
  // Navigate to create profile screen
  navigation.navigate('CreateChildProfile');
};
```

## Animation Details

### Entrance Animation
- Bottom sheet slides up from bottom
- Profile cards fade in with staggered timing
- Icons and text animate with subtle spring physics

### Exit Animation
- Bottom sheet slides down smoothly
- Background overlay fades out
- Maintains 60fps performance on all target devices

## Performance Considerations

### Optimizations
- **FlatList** - Efficient rendering for large profile lists
- **Memoization** - Profile cards memoized to prevent unnecessary re-renders
- **Image Caching** - Profile avatars cached for fast loading
- **Lazy Loading** - Profile data loaded as needed

### Memory Management
- Proper cleanup of event listeners
- Efficient state management
- Minimal re-renders during profile switching

## Related Components

- **[BottomSheet](../ui/BottomSheet.md)** - Base bottom sheet component
- **[AppMenuScreen](../menu/AppMenuScreen.md)** - Parent menu screen
- **[ProfileCard](./ProfileCard.md)** - Individual profile card component

## Testing

### Unit Tests
```typescript
describe('ProfileSwitcherBottomSheet', () => {
  it('renders all profiles correctly', () => {
    render(
      <ProfileSwitcherBottomSheet
        visible={true}
        profiles={mockProfiles}
        onProfileSelect={jest.fn()}
        onCreateChildProfile={jest.fn()}
        onClose={jest.fn()}
      />
    );
    
    expect(screen.getByText('Benson Adeyemi')).toBeInTheDocument();
    expect(screen.getByText('Kemi Adeyemi')).toBeInTheDocument();
  });

  it('highlights active profile correctly', () => {
    const profiles = [
      { ...mockProfile, isActive: true },
      { ...mockProfile, id: '2', isActive: false },
    ];
    
    render(<ProfileSwitcherBottomSheet profiles={profiles} />);
    
    expect(screen.getByTestId('active-indicator')).toBeInTheDocument();
  });

  it('calls onProfileSelect when profile is pressed', () => {
    const onSelect = jest.fn();
    render(
      <ProfileSwitcherBottomSheet
        profiles={mockProfiles}
        onProfileSelect={onSelect}
      />
    );
    
    fireEvent.press(screen.getByText('Kemi Adeyemi'));
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Kemi Adeyemi'
    }));
  });
});
```

### Integration Tests
- Profile switching workflow testing
- Create child profile flow testing
- Bottom sheet open/close behavior
- Theme switching compatibility

## Migration Guide

### From Legacy Profile Switching
1. Replace simple dropdown with bottom sheet interface
2. Update profile data structure to include level and program
3. Add active state management
4. Implement create child profile functionality
5. Update theming to use Academy design system

### Best Practices
- Always provide loading states during profile operations
- Handle network errors gracefully
- Cache profile data for offline viewing
- Implement proper accessibility labels
- Test with multiple profiles to ensure scalability