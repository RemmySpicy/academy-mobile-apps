# Booking Cards - Academy Mobile Apps

## Overview

The Academy Apps use a unified **BookingCard** component that displays participant information for all booking types, providing a consistent experience focused on showing who's enrolled in each session.

## Components

### BookingCard

Unified booking card component with participant management capabilities.

**Features:**
- Overlapping participant avatars (first 5 visible)
- Overflow indicator ("+5" for additional participants)
- Capacity counter (e.g., "10/15 participants")
- Single "Add/Remove Participant" management button
- Bottom sheet interface for participant management
- Support for multiple instructors
- Price display for paid bookings
- Reschedule/Cancel actions
- Support for recurring schedules

**Usage:**
```typescript
<BookingCard
  booking={bookingData}
  index={index}
  onPress={handleBookingPress}
  onManageParticipants={handleManageParticipants}
/>
```

### ParticipantManagementBottomSheet

Comprehensive participant management interface using the shared `BottomSheet` component.

**Features:**
- Family member management (self, children, spouse)
- Clear relationship labels ("You", "Your child", "Your spouse")
- Enrollment status indication
- Individual add/remove actions per family member
- Capacity management with visual feedback

**Usage:**
```typescript
<ParticipantManagementBottomSheet
  visible={showSheet}
  onClose={() => setShowSheet(false)}
  bookingTitle="Family Swimming Session"
  currentParticipants={participants}
  maxParticipants={6}
  onAddParticipant={handleAddParticipant}
  onRemoveParticipant={handleRemoveParticipant}
/>
```

## Schedule Types

### Recurring Schedules
Display recurring patterns for regular classes:
- `"Every Friday"` for weekly sessions
- `"Every Tuesday"` for regular training

### One-time Schedules
Show specific dates for special events:
- `"Friday, Jan 12"` for makeup sessions
- `"Saturday, Jan 13"` for swim meets
- `"Tomorrow"` for immediate sessions

## Implementation Notes

### Multiple Instructors
Cards support flexible instructor display:
- Single: `"Sarah Johnson"`
- Two instructors: `"Mike Wilson & Sarah Johnson"`
- Three or more: `"David Smith, Sarah Johnson & Mike Wilson"`

### Participant Management
- Uses existing `BottomSheet` component from `@academy/mobile-shared`
- Handles family member relationships with appropriate labels
- Provides clear visual feedback for enrollment status
- Supports capacity limits with disabled states

### Theme Integration
- Follows Academy design system with `theme.colors.interactive.primary`
- Uses proper spacing with `theme.spacing.*` constants
- Implements Academy typography standards
- Supports both light and dark mode variations

## File Structure

```
src/features/bookings/
├── components/
│   ├── BookingCard.tsx                      # Unified booking card component
│   └── ParticipantManagementBottomSheet.tsx # Participant management
├── screens/
│   └── BookingsScreen.tsx                   # Main booking screen
└── README.md                                # This documentation
```

## Related Components

- `BottomSheet` - From `@academy/mobile-shared` for modal interfaces
- `Header` - From `@academy/mobile-shared` for screen headers
- `CustomButton` - From `@academy/mobile-shared` for action buttons

## API Integration

The booking cards expect booking data with the following structure:

```typescript
interface Booking {
  id: string;
  scheduleTitle: string;
  scheduleType: string; // Format: "Age Group • Class Type • Skill Level"
  instructor: string; // Supports multiple instructors with "&" and ","
  date: string;
  time: string;
  location: string;
  status: 'upcoming' | 'completed' | 'cancelled' | 'rescheduled';
  price: number;
  sessionNumber: number;
  totalSessions: number;
  color: string;
  participants?: Participant[];
  maxParticipants?: number;
  isRecurring?: boolean;
  recurringDay?: string; // e.g., "Friday", "Tuesday"
}
```