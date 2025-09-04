# Booking System Documentation

**Status**: ✅ **COMPLETE & PRODUCTION READY**

The Academy Apps feature a comprehensive booking and session management system that handles scheduling, participant management, and term progress tracking for all academy programs.

## 📋 Table of Contents

- [Overview](#overview)
- [Booking Card System](#booking-card-system)
- [Term Progress System](#term-progress-system)
- [Participant Management](#participant-management)
- [Schedule Types](#schedule-types)
- [Technical Implementation](#technical-implementation)
- [Usage Examples](#usage-examples)
- [Navigation Flow](#navigation-flow)

## 🎯 Overview

The booking system provides students and parents with comprehensive session management capabilities:

- **Session Booking & Management**: Book, reschedule, and cancel sessions
- **Term Progress Tracking**: Visual progress indicators for 8-session terms
- **Participant Management**: Add/remove family members from sessions
- **Multi-Program Support**: Works across all academy programs (swimming, music, etc.)
- **Schedule Flexibility**: Supports one-time and recurring sessions
- **Payment Integration**: Price display and payment status tracking

## 🏷️ Booking Card System

The Academy Apps use a unified **BookingCard** component that displays participant information for all booking types.

### **Card Features**

- **Overlapping participant avatars** (first 5 visible)
- **Overflow indicator** ("+N" for additional participants)  
- **Capacity counter** (e.g., "10/15 participants")
- **Outline-style Add/Remove button** with people icon for better visual hierarchy ⭐ **NEW**
- **Price display** for paid bookings
- **Reschedule/Cancel actions** for upcoming sessions
- **Status indicators** with rounded background badges ⭐ **ENHANCED**
- **Instructor information** with multi-instructor support

### **Visual Design**

- **Academy Purple Accents**: Uses `theme.colors.interactive.primary`
- **Status Color Coding**:
  - **Upcoming**: Academy purple (`theme.colors.interactive.primary`)
  - **Completed**: Green (`theme.colors.status.success`)
  - **Cancelled**: Red (`theme.colors.status.error`)
  - **Rescheduled**: Orange (`theme.colors.status.warning`)
- **Mobile-Optimized Layout**: Card-based design with proper spacing
- **Interactive Elements**: Touch feedback and smooth animations

## 📊 Term Progress System ⭐ **NEW**

The Academy Apps feature intelligent term progress tracking in the bookings screen.

### **Key Features**

- **8-Session Term Standard**: Industry-standard term length
- **Smart Progress Calculation**: Automatically categorizes sessions
- **Real-Time Updates**: Dynamic progress based on booking statuses
- **Visual Progress Indicators**: Color-coded progress display
- **Mobile-Optimized Layout**: Responsive card design

### **Progress Categories**

| Category | Color | Description |
|----------|--------|-------------|
| **Completed** | Green (`theme.colors.status.success`) | Sessions already finished |
| **Scheduled** | Academy Purple (`theme.colors.interactive.primary`) | Upcoming booked sessions |
| **Remaining** | Gray (`theme.colors.text.tertiary`) | Sessions left in term |

### **Display Format**

The term progress card shows:
- **Individual counters** for each category (Completed: 3, Scheduled: 2, Remaining: 3)
- **Overall progress** (5/8 sessions)
- **Responsive layout** with 60/140 width ratio for optimal mobile display

### **Calculation Logic**

```typescript
const termStats = {
  completed: 3,    // Sessions with 'completed' status
  scheduled: 2,    // Sessions with 'upcoming' status  
  remaining: 3,    // Calculated: 8 - (completed + scheduled)
  total: 8         // Standard term size
};
```

## 👥 Participant Management

### **Bottom Sheet Interface**
- **Comprehensive Management**: Add/remove participants via bottom sheet
- **Family Member Support**: Self, children, spouse with relationship labels
- **Enrollment Status**: Clear indication of current participants
- **Capacity Management**: Visual feedback when sessions are full
- **One-tap Access**: Single button opens full management interface

### **Participant Display**
- **Overlapping Avatars**: First 5 participants shown with overlapping circles
- **Overflow Indicator**: "+N" badge for additional participants
- **Capacity Counter**: "X/Y participants" display
- **Role Indicators**: Student, parent, instructor labels

## 🎛️ Custom Schedule Type Selector ⭐ **NEW**

The Academy Apps feature a custom-built schedule type selector that allows users to toggle between personal bookings and facility-wide schedules.

### **Design Features**
- **Clean Tab Design**: Inspired by Course Curriculum screen section tabs
- **Smooth Visual Feedback**: Purple active state with white text
- **Mobile-Optimized**: Responsive layout with proper touch targets
- **Academy Theming**: Consistent with design system colors and typography

### **Tab States**
- **Active Tab**: `theme.colors.interactive.primary` background with white text
- **Inactive Tab**: `theme.colors.background.tertiary` background with secondary text
- **Container**: Subtle tertiary background with rounded corners

### **Implementation**
```typescript
// Custom tab styling
const scheduleTypeTabs = {
  flexDirection: 'row',
  backgroundColor: theme.colors.background.tertiary,
  borderRadius: theme.borderRadius.lg,
  padding: theme.spacing.xs,
};

const scheduleTypeTab = {
  flex: 1,
  paddingVertical: theme.spacing.xs,
  paddingHorizontal: theme.spacing.sm,
  borderRadius: theme.borderRadius.md,
  alignItems: 'center',
};
```

### **User Experience**
- **My Schedules**: Shows user's personal bookings and family member sessions
- **Facility Schedules**: Displays available facility-wide sessions and events
- **Smooth Transitions**: Instant switching between schedule types
- **Visual Clarity**: Clear indication of active selection

## 📅 Schedule Types

### **Recurring Schedules**
- **Weekly Patterns**: "Every Friday", "Every Tuesday"
- **Term-Based**: Multiple sessions over academic term
- **Consistent Timing**: Same time slot each week

### **One-Time Schedules**
- **Specific Dates**: "Friday, Jan 12", "Tomorrow"
- **Special Events**: Swim meets, workshops, competitions
- **Flexible Scheduling**: Custom date/time combinations

### **Multiple Instructor Support**
- **Co-teaching**: Two instructors working together
- **Large Events**: Multiple instructors for community events
- **Flexible Display**: Natural formatting with "&" and ","

## 🛠️ Technical Implementation

### **Component Architecture**

```
BookingsScreen
├── Header (Program Switcher + Notifications)
├── Add Booking Button Row
├── Stats Cards (Next Session + Term Progress)
├── Custom Schedule Type Selector ⭐ NEW
│   ├── My Schedules Tab
│   └── Facility Schedules Tab
├── Filter Tabs (All/Upcoming/Completed/Cancelled)
└── BookingCard List
    ├── BookingCard Component (Enhanced Status Badges)
    └── ParticipantManagementBottomSheet
```

### **Key Components**

- **`BookingsScreen`**: Main screen with stats and booking list
- **`BookingCard`**: Individual booking display component
- **`ParticipantManagementBottomSheet`**: Participant management interface
- **`TermProgressCalculator`**: Smart progress calculation logic

### **State Management**

```typescript
interface BookingState {
  bookings: Booking[];
  selectedFilter: FilterType;
  scheduleType: 'my-schedules' | 'facility-schedules';
  termStats: TermStats;
}
```

### **Data Flow**

1. **Fetch Bookings**: Load user's booking data
2. **Calculate Progress**: Compute term statistics
3. **Filter & Display**: Show filtered booking cards
4. **Manage Participants**: Handle add/remove operations
5. **Update Progress**: Recalculate on booking changes

## 💻 Usage Examples

### **Basic Booking Card**

```typescript
<BookingCard
  booking={{
    id: '1',
    scheduleTitle: 'Learn to Swim',
    scheduleType: 'Kids • Private • Beginner',
    instructor: 'Sarah Johnson',
    participants: familyMembers,
    maxParticipants: 6,
    status: 'upcoming',
    price: 14000,
    sessionNumber: 3,
    totalSessions: 8
  }}
  onPress={handleBookingPress}
  onManageParticipants={handleManageParticipants}
/>
```

### **Term Progress Display**

```typescript
// Term stats calculation
const termStats = useMemo(() => {
  const STANDARD_TERM_SESSIONS = 8;
  // ... calculation logic
  return {
    completed: 3,
    scheduled: 2, 
    remaining: 3,
    total: 8
  };
}, [bookings]);

// Display in stats card
<View style={styles.termProgressRow}>
  <ProgressItem value={termStats.completed} label="Completed" color="success" />
  <ProgressItem value={termStats.scheduled} label="Scheduled" color="primary" />
  <ProgressItem value={termStats.remaining} label="Remaining" color="tertiary" />
</View>
```

### **Multi-Instructor Display**

```typescript
// Single instructor
instructor: 'Sarah Johnson'

// Multiple instructors
instructor: 'Mike Wilson & Sarah Johnson'

// Large events
instructor: 'David Smith, Sarah Johnson & Mike Wilson'
```

## 🧭 Navigation Flow

### **Students App Navigation**
```
Home Tab → Bookings Screen
├── Booking Card Press → Booking Detail Screen
├── Add Booking Button → New Booking Flow
├── Manage Participants → Participant Bottom Sheet
└── Filter Tabs → Filtered Booking List
```

### **Screen Hierarchy**
- **BookingsScreen**: Main booking management screen
- **BookingDetail**: Individual booking details and actions
- **NewBooking**: Create new booking workflow
- **ParticipantManagement**: Add/remove participants interface

### **Stats Card Layout**
```
[Next Session Card - 60%] [Term Progress Card - 140%]
├── Tomorrow                ├── Completed: 3
├── 3:00 PM                 ├── Scheduled: 2
└── Calendar Icon           ├── Remaining: 3
                           └── 5/8 sessions
```

## 🎨 Academy Design System Integration

### **Color Usage**
- **Primary**: Academy Purple (#4F2EC9) for scheduled sessions and interactive elements
- **Success**: Green for completed sessions and success states
- **Error**: Red for cancelled sessions and error states
- **Warning**: Orange for rescheduled sessions
- **Tertiary**: Gray for remaining sessions and secondary text

### **Typography**
- **Headers**: Bold academy font weights
- **Body Text**: Medium font weights for readability
- **Labels**: Small font sizes with proper contrast

### **Spacing**
- **Card Padding**: `theme.spacing.md` (16px) for consistent card layouts
- **Element Spacing**: `theme.spacing.xs` (4px) to `theme.spacing.lg` (24px)
- **Safe Areas**: Proper handling of mobile safe areas and notches

## 📱 Mobile-First Features

### **Touch Interactions**
- **48px Minimum**: Touch targets meet accessibility standards
- **Haptic Feedback**: Tactile feedback for important actions
- **Swipe Gestures**: Support for common mobile gestures

### **Responsive Design**
- **Card Layout**: Optimized for various screen sizes
- **Text Scaling**: Respects system text size preferences
- **Orientation Support**: Works in both portrait and landscape

### **Performance**
- **List Virtualization**: Efficient rendering for large booking lists
- **Image Optimization**: Proper image loading and caching
- **Animation Performance**: 60fps smooth animations

## ✅ Production Readiness

### **Quality Assurance**
- ✅ **TypeScript Coverage**: Full type safety
- ✅ **Error Handling**: Graceful error states
- ✅ **Loading States**: Proper loading indicators
- ✅ **Accessibility**: WCAG 2.1 compliance
- ✅ **Performance**: Optimized for mobile devices

### **Testing Coverage**
- ✅ **Unit Tests**: Component logic testing
- ✅ **Integration Tests**: Feature flow testing
- ✅ **E2E Tests**: End-to-end user journey validation
- ✅ **Cross-Platform**: iOS and Android compatibility

### **Monitoring & Analytics**
- ✅ **Error Tracking**: Production error monitoring
- ✅ **Performance Metrics**: Loading time and interaction tracking
- ✅ **User Analytics**: Booking behavior analysis
- ✅ **A/B Testing**: Feature optimization testing

## 🔗 Related Documentation

- **[Component Library](../components/README.md)** - BookingCard and related components
- **[API Documentation](../api/BOOKING_API.md)** - Backend integration details
- **[Theme System](../THEME_SYSTEM.md)** - Academy design system reference
- **[Navigation](../navigation/README.md)** - App navigation patterns

## 🚀 Future Enhancements

### **Planned Features**
- **Push Notifications**: Booking reminders and updates
- **Calendar Integration**: Sync with device calendar
- **Payment Processing**: In-app payment handling
- **Instructor Rating**: Post-session instructor feedback

### **Optimization Opportunities**
- **Offline Support**: Local booking data caching
- **Advanced Filtering**: More sophisticated search options
- **Bulk Operations**: Multi-booking management
- **Integration APIs**: Third-party calendar and payment systems

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintainer**: Academy Development Team