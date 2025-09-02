# Development Guide - Academy Mobile Apps

## Recent Features Added

### Booking Card System with Participant Management

#### **Overview**
The Academy Apps now include a comprehensive booking card system that supports both individual lessons and group sessions with participant management capabilities.

#### **New Components Added**

1. **ParticipantBookingCard** (`students-app/src/features/bookings/components/ParticipantBookingCard.tsx`)
   - Group session management with overlapping participant avatars
   - Single "Add/Remove Participant" button for streamlined UX
   - Support for recurring and one-time schedules
   - Multiple instructor display capability
   - No price display (schedule-focused)

2. **ParticipantManagementBottomSheet** (`students-app/src/features/bookings/components/ParticipantManagementBottomSheet.tsx`)
   - Uses existing `BottomSheet` component from `@academy/mobile-shared`
   - Family member management interface
   - Clear enrollment status and relationship labels
   - Capacity management with visual feedback

#### **Key Implementation Details**

**Recurring Schedules Support:**
```typescript
// Booking interface now supports recurring schedules
interface Booking {
  // ... existing fields
  isRecurring?: boolean;
  recurringDay?: string; // "Friday", "Tuesday", etc.
}

// Display logic in both BookingCard and ParticipantBookingCard
{booking.isRecurring && booking.recurringDay 
  ? `Every ${booking.recurringDay}` 
  : booking.date}
```

**Multiple Instructor Support:**
- Instructor field supports single or multiple instructors
- Natural formatting: `"Mike Wilson & Sarah Johnson"` or `"David Smith, Sarah Johnson & Mike Wilson"`
- Text wraps naturally within card layout

**Participant Management:**
- Overlapping avatars with `-theme.spacing.sm` offset for optimal visibility
- Overflow indicator shows "+N" for participants beyond the first 5
- Bottom sheet provides comprehensive family member management
- Mock family data includes self, children, and spouse relationships

#### **Design Patterns Used**

**Theme Integration:**
- All components use Academy theme system with `theme.colors.interactive.primary`
- Proper spacing with `theme.spacing.*` constants
- Consistent typography with `theme.fontSizes.*` and `theme.fontConfig.fontWeight.*`

**Component Architecture:**
- Feature-based organization under `src/features/bookings/`
- Shared component usage from `@academy/mobile-shared`
- TypeScript interfaces for all props and data structures
- Animated components using React Native Reanimated

**State Management:**
- Local state for bottom sheet visibility
- Parent component handles participant data updates
- Console logging for development/debugging

#### **Usage Examples**

**BookingsScreen Integration:**
```typescript
// Conditional rendering based on booking variant
renderItem={({ item, index }) => {
  if (item.variant === 'participant' && item.participants) {
    return (
      <ParticipantBookingCard
        booking={item}
        index={index}
        onPress={handleBookingPress}
        onManageParticipants={handleManageParticipants}
      />
    );
  }
  
  return (
    <BookingCard
      booking={item}
      index={index}
      onPress={handleBookingPress}
    />
  );
}}
```

**Sample Data Structure:**
```typescript
// Recurring group session with multiple instructors
{
  id: '2',
  courseTitle: 'Family Swimming Session',
  courseLevel: 'Group Class',
  instructor: 'Mike Wilson & Sarah Johnson',
  date: 'Friday, Jan 12',
  time: '4:00 PM - 5:00 PM',
  location: 'Pool B',
  status: 'upcoming',
  price: 0, // No price for schedule cards
  isRecurring: true,
  recurringDay: 'Friday',
  variant: 'participant',
  maxParticipants: 6,
  participants: [/* family members */],
}
```

#### **Testing Scenarios**

1. **Recurring Schedule Display**
   - Verify "Every Friday" displays instead of specific date
   - Test both recurring and one-time schedules side by side

2. **Participant Management**
   - Test bottom sheet open/close functionality
   - Verify family member add/remove operations
   - Check capacity limits and disabled states

3. **Multiple Instructors**
   - Test single instructor: `"Sarah Johnson"`
   - Test two instructors: `"Mike Wilson & Sarah Johnson"`
   - Test three instructors: `"David Smith, Sarah Johnson & Mike Wilson"`

4. **Responsive Layout**
   - Verify text wrapping for long instructor names
   - Test participant avatar overflow with 5+ participants
   - Check spacing and alignment across different screen sizes

#### **Future Enhancements**

- **Real Family Data**: Replace mock family data with actual user profile data
- **Haptic Feedback**: Add haptic feedback for button interactions
- **Animation**: Enhanced transitions for participant avatar changes
- **Backend Integration**: Connect to actual participant management API endpoints
- **Push Notifications**: Notify family members when added to sessions
- **Accessibility**: Enhanced screen reader support for participant management

#### **Performance Considerations**

- **Component Memoization**: Consider `React.memo` for booking cards if list becomes large
- **Image Loading**: Implement lazy loading for participant avatars
- **Animation Optimization**: Use `useSharedValue` for smooth scale animations
- **List Virtualization**: For large booking lists, consider FlatList optimization

## Development Best Practices

### When to Use Each Card Type

**Default Booking Card:**
- Individual lessons with progress tracking
- Paid courses requiring price display
- Traditional lesson-by-lesson structure
- Private or one-on-one sessions

**Participant Booking Card:**
- Group classes and activities
- Family sessions with multiple participants
- Community events and swim meets
- Scheduled activities without individual pricing

### Component Integration

Always use the existing shared components:
- `BottomSheet` for modal interfaces
- `Header` for screen headers
- `CustomButton` for action buttons
- Academy theme system for consistent styling

### Testing Checklist

Before deploying booking card changes:
- [ ] Test recurring schedule display logic
- [ ] Verify participant management bottom sheet
- [ ] Check multiple instructor text formatting
- [ ] Test participant avatar overflow display
- [ ] Verify theme integration and responsive design
- [ ] Test on both iOS and Android platforms
- [ ] Check accessibility with screen reader

## File Structure

```
students-app/src/features/bookings/
├── components/
│   ├── ParticipantBookingCard.tsx           # NEW: Group session management
│   └── ParticipantManagementBottomSheet.tsx # NEW: Participant bottom sheet
├── screens/
│   └── BookingsScreen.tsx                   # Updated: Both card types
└── README.md                                # NEW: Component documentation
```