# Booking System Documentation

**Status**: ✅ **COMPLETE & PRODUCTION READY**

The Academy Apps feature a comprehensive booking and session management system that handles scheduling, participant management, and term progress tracking for all academy programs.

## 📋 Table of Contents

- [Overview](#overview)
- [Dual Schedule System](#dual-schedule-system)
- [Booking Card System](#booking-card-system)
- [Facility Schedule System](#facility-schedule-system)
- [Day-Based Filtering](#day-based-filtering)
- [Term Progress System](#term-progress-system)
- [Participant Management](#participant-management)
- [Schedule Types](#schedule-types)
- [Technical Implementation](#technical-implementation)
- [Usage Examples](#usage-examples)
- [Navigation Flow](#navigation-flow)

## 🎯 Overview

The booking system provides students and parents with comprehensive session management capabilities:

- **Session Booking & Management**: Book, reschedule, and cancel sessions
- **Facility Schedule Browsing**: Discover and join available facility schedules ⭐ **NEW**
- **Day-Based Filtering**: Browse schedules by day of the week with current day highlighting ⭐ **NEW**
- **Term Progress Tracking**: Visual progress indicators for 8-session terms
- **Participant Management**: Add/remove family members from sessions
- **Multi-Program Support**: Works across all academy programs (swimming, music, etc.)
- **Schedule Flexibility**: Supports one-time and recurring sessions
- **Session Credits System**: Credit-based booking for facility schedules ⭐ **NEW**
- **Payment Integration**: Price display for personal bookings (already paid)

## 🔄 Dual Schedule System ⭐ **NEW**

The Academy Apps feature a comprehensive dual schedule system that allows users to switch between personal bookings and facility-wide schedule browsing.

### **My Schedules Tab**
- **Personal Bookings**: Display user's booked sessions and family member enrollments
- **Status-Based Filtering**: All, Upcoming, Completed, Cancelled filter options
- **Enhanced BookingCard**: Participant management with add/remove functionality
- **Term Progress Tracking**: Visual progress indicators for ongoing terms
- **Action Capabilities**: Reschedule, cancel, and review completed sessions

### **Facility Schedules Tab** 
- **Available Schedule Browsing**: Discover open sessions across all programs
- **Day-Based Filtering**: Sunday through Saturday with current day highlighting
- **Availability Indicators**: Real-time capacity and spots available
- **Join Functionality**: Credit-based enrollment for available schedules ⭐ **NEW**
- **Detailed Information**: Instructor, session credits required, session count, and descriptions ⭐ **UPDATED**

### **Custom Tab Selector**
- **Academy Design**: Purple active state with clean visual hierarchy
- **Smooth Transitions**: Instant switching between schedule types
- **Mobile-Optimized**: Touch-friendly design with proper spacing
- **Consistent Theming**: Matches Course Curriculum section tab patterns

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

## 🏢 Facility Schedule System ⭐ **NEW**

The Academy Apps feature a comprehensive facility schedule browsing system that allows users to discover and join available sessions.

### **Enhanced Join Schedule System** ⭐ **NEW**
- **Smart Session Credits Management**: Individual participant credit tracking with warnings ⭐ **NEW**
- **Interactive Session Schedule**: Visual calendar showing specific session dates ⭐ **NEW**
- **Individual Session Selection**: Allow users to select/deselect specific session dates ⭐ **NEW**
- **Partial Enrollment Support**: Handle participants with varying credit balances ⭐ **NEW**
- **Performance-Optimized**: Efficient date generation preventing app freezing ⭐ **NEW**
- **Large Bottom Sheet**: 75% screen height for comprehensive session management ⭐ **NEW**

### **Advanced Credit Management** ⭐ **NEW**
- **Individual Credit Display**: Shows available credits next to each participant name
- **Smart Session Count Limits**: Adjusts max sessions based on highest credit balance in group
- **Visual Warning System**: Amber warnings for participants with insufficient credits
- **Partial Participation Logic**: Calculates credits based on individual limits
- **Detailed Credit Breakdown**: Per-participant credit allocation with warnings

### **Schedule Information Display**
- **Program Details**: Age group, session type, and skill level
- **Instructor Information**: Single or multiple instructor display
- **Schedule Pattern**: Day-based recurring schedule information
- **Location Details**: Specific pool or facility area
- **Capacity Management**: Current enrollment and available spots

### **Visual Design Features**
- **Academy Purple Theming**: Consistent color scheme with brand colors
- **Progress Visualization**: Animated progress bars for availability
- **Card-Based Layout**: Mobile-optimized card design with proper spacing
- **Status Indicators**: Clear visual feedback for schedule availability
- **Touch Interactions**: Smooth animations and haptic feedback

### **Enhanced User Actions** ⭐ **UPDATED**
- **Smart Join Schedule**: Multi-participant enrollment with credit management ⭐ **NEW**
- **Session Date Management**: Visual session calendar with individual date selection ⭐ **NEW**
- **Flexible Scheduling**: Remove specific conflicting dates from enrollment ⭐ **NEW**
- **Partial Enrollment Confirmations**: Clear warnings and confirmation for mixed credit scenarios ⭐ **NEW**
- **Real-Time Validation**: Dynamic credit calculation and availability checking ⭐ **NEW**

## 📅 Day-Based Filtering ⭐ **NEW**

The Academy Apps implement intelligent day-based filtering for facility schedules with current day highlighting.

### **Filter Design**
- **Weekly Layout**: Sunday through Saturday abbreviated labels (Sun, Mon, Tue, etc.)
- **Schedule Counts**: Each day shows number of available schedules
- **Current Day Highlighting**: Automatic detection and visual emphasis
- **Mobile-Optimized**: Horizontal scrollable filter tabs

### **Visual States**
- **Selected Day**: Purple background with white text (`theme.colors.interactive.primary`)
- **Current Day** (unselected): Semi-transparent purple background with purple border
- **Regular Days**: Light background with secondary text
- **Current Day Indicator**: Small dot (•) indicator when not selected

### **Smart Behavior**
- **Automatic Detection**: Uses JavaScript `Date.getDay()` for current day
- **Dynamic Filtering**: Shows only schedules for selected day
- **Count Accuracy**: Real-time schedule count for each day
- **All Option**: View all schedules regardless of day

### **Implementation Details**
```typescript
// Current day detection
const getCurrentDay = () => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[new Date().getDay()];
};

// Filter styling with current day emphasis
const isCurrentDay = filter.key === currentDay;
const filterStyle = isCurrentDay ? styles.currentDayFilter : styles.inactiveFilter;
```

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

## 💳 Enhanced Session Credits System ⭐ **UPGRADED**

The Academy Apps implement an advanced credit-based booking system with individual participant tracking and flexible session management.

### **Advanced Credit Features** ⭐ **NEW**
1. **Individual Credit Tracking**: Each participant has their own credit balance
2. **Smart Session Management**: Visual session calendar with date-specific selection
3. **Partial Enrollment Support**: Handle mixed credit scenarios gracefully
4. **Performance Optimization**: Efficient date generation and rendering

### **Individual Participant Credits** ⭐ **NEW**
- **Credit Display**: Shows available credits next to each participant name (e.g., "12 credits")
- **Smart Limits**: Session count adjusts to highest credit balance in selected group
- **Visual Warnings**: Amber alerts for participants with insufficient credits
- **Partial Participation**: Automatically calculates individual session limits

### **Interactive Session Selection** ⭐ **NEW**
- **Visual Calendar**: Shows specific session dates based on schedule day
- **Individual Selection**: Tap sessions to include/exclude from enrollment
- **Flexible Scheduling**: Remove conflicting dates while keeping others
- **Real-Time Updates**: Credit calculations update as sessions are selected/deselected

### **Enhanced User Experience** ⭐ **NEW**
- **Detailed Breakdown**: Per-participant credit allocation with warnings
- **Smart Confirmations**: Clear dialogs explaining partial enrollment scenarios
- **Large Interface**: 75% screen height bottom sheet for comprehensive management
- **Performance Optimized**: Prevents app freezing with efficient date logic

### **Implementation** ⭐ **UPDATED**
```typescript
// Individual participant credits
interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  sessionCredits: number; // Individual credit balance
  isSelected: boolean;
}

// Session date management
interface SessionDate {
  id: string;
  date: Date;
  formattedDate: string;
  isSelected: boolean;
}

// Smart credit calculation
const selectedSessionsCount = customSessions.filter(s => s.isSelected).length;
const totalCreditsNeeded = selectedParticipants.reduce((total, participant) => {
  const sessionsForParticipant = Math.min(selectedSessionsCount, participant.sessionCredits);
  return total + sessionsForParticipant;
}, 0);

// Partial enrollment detection
const participantsWithWarnings = selectedParticipants.filter(p => 
  p.sessionCredits < selectedSessionsCount
);
```

## 📅 Interactive Session Schedule System ⭐ **NEW**

The Academy Apps feature an advanced session schedule management system that allows users to view and customize their enrollment on a session-by-session basis.

### **Dynamic Date Generation**
- **Weekly Scheduling**: Automatically generates dates based on schedule's day of the week
- **Smart Start Date**: Finds next occurrence of target day from current date
- **Performance Optimized**: Efficient date calculation with safety limits (max 52 sessions)
- **Error Handling**: Graceful handling of invalid days and date edge cases

### **Visual Session Calendar**
- **Grid Layout**: 3-column responsive grid showing session dates
- **Date Formatting**: Clean "Dec 15" format with day name display
- **Interactive Selection**: Tap any session to include/exclude from enrollment
- **Visual States**:
  - **Selected**: Purple background with purple text (`theme.colors.interactive.primary`)
  - **Deselected**: Red tinted background with red text (`theme.colors.status.error`)
  - **Clear Labeling**: Date and day of week for each session

### **Flexible Session Management**
- **Custom Selection**: Users can deselect specific conflicting dates
- **Real-Time Counting**: "X of Y selected" counter updates dynamically
- **Helper Text**: "Tap sessions to include/exclude from enrollment"
- **Credit Recalculation**: Credits update automatically based on selected sessions

### **User Flow Integration**
1. **Select Participants**: Choose family members with their individual credit balances
2. **Set Base Session Count**: Use slider to set desired number of sessions
3. **View Generated Schedule**: See specific dates for that day of the week
4. **Customize Schedule**: Tap to remove conflicting dates
5. **Review Credits**: See per-participant allocation and warnings
6. **Confirm Enrollment**: Join with customized session selection

### **Performance Optimizations** ⭐ **CRITICAL**
- **useCallback Memoization**: Helper functions cached to prevent recreation
- **Efficient useEffect**: Direct state updates instead of circular dependencies
- **Safety Limits**: Maximum iteration counts to prevent infinite loops
- **Error Boundaries**: Try-catch blocks for date operations
- **Optimized Dependencies**: Specific property watching instead of full objects

### **Implementation Example**
```typescript
// Session date generation with safety checks
useEffect(() => {
  if (!schedule) {
    setCustomSessions([]);
    return;
  }
  
  const dates: SessionDate[] = [];
  const today = new Date();
  const targetDay = getDayOfWeekNumber(schedule.dayOfWeek);
  
  // Safety check for valid day
  if (targetDay === -1) {
    console.warn('Invalid day of week:', schedule.dayOfWeek);
    return;
  }
  
  // Find next occurrence with loop protection
  let currentDate = new Date(today);
  let daysAdded = 0;
  while (currentDate.getDay() !== targetDay && daysAdded < 7) {
    currentDate.setDate(currentDate.getDate() + 1);
    daysAdded++;
  }
  
  // Generate weekly sessions
  for (let i = 0; i < selectedSessionCount && i < 52; i++) {
    const sessionDate = new Date(currentDate);
    sessionDate.setDate(currentDate.getDate() + (i * 7));
    
    dates.push({
      id: `session-${i}`,
      date: new Date(sessionDate),
      dayOfWeek: schedule.dayOfWeek,
      formattedDate: formatSessionDate(sessionDate),
      isSelected: true,
    });
  }
  
  setCustomSessions(dates);
}, [schedule?.dayOfWeek, schedule?.id, selectedSessionCount]);

// Session selection toggle
const toggleSessionDate = useCallback((sessionId: string) => {
  setCustomSessions(prev => prev.map(session => 
    session.id === sessionId ? { ...session, isSelected: !session.isSelected } : session
  ));
}, []);
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
├── Stats Cards (Next Session + Term Progress)
├── Custom Schedule Type Selector ⭐ NEW
│   ├── My Schedules Tab
│   └── Facility Schedules Tab
├── Dynamic Filter Tabs ⭐ ENHANCED
│   ├── My Schedules: All/Upcoming/Completed/Cancelled
│   └── Facility Schedules: All/Sun/Mon/Tue/Wed/Thu/Fri/Sat ⭐ NEW
└── Conditional Content Display ⭐ NEW
    ├── My Schedules: BookingCard List (variant="booking")
    │   ├── Unified BookingCard Component ⭐ UNIFIED
    │   ├── Participant Management Features
    │   ├── Status Badges & Actions
    │   └── ParticipantManagementBottomSheet
    └── Facility Schedules: BookingCard List (variant="facility-schedule") ⭐ UNIFIED
        ├── Unified BookingCard Component ⭐ UNIFIED
        ├── Availability Progress Bars
        ├── Join Schedule Actions
        ├── Session Credits Display ⭐ **NEW**
        └── JoinScheduleBottomSheet ⭐ **NEW**
```

### **Key Components**

- **`BookingsScreen`**: Main screen with dual schedule system and stats
- **`BookingCard`**: ⭐ **UNIFIED** - Single component with variants for both booking types (`booking` | `facility-schedule`)
- **`ParticipantManagementBottomSheet`**: Participant management interface  
- **`JoinScheduleBottomSheet`**: ⭐ **ENHANCED** - Advanced session management with individual date selection, multi-participant credit tracking, and partial enrollment support
- **`TermProgressCalculator`**: Smart progress calculation logic

### **State Management**

```typescript
interface BookingState {
  bookings: Booking[];
  facilitySchedules: FacilitySchedule[]; // ⭐ NEW
  selectedFilter: FilterType;
  facilityFilter: DayFilterType; // ⭐ NEW
  scheduleType: 'my-schedules' | 'facility-schedules';
  termStats: TermStats;
  currentDay: string; // ⭐ NEW
  userSessionCredits: number; // ⭐ NEW
}

interface FacilitySchedule {
  id: string;
  scheduleTitle: string;
  scheduleType: string;
  instructor: string;
  dayOfWeek: string; // ⭐ NEW
  time: string;
  location: string;
  // No price field - uses session credits ⭐ **UPDATED**
  totalSessions: number;
  currentParticipants: number;
  maxParticipants: number;
  availableSpots: number;
  // ... other properties
}
```

### **Data Flow**

1. **Fetch Bookings**: Load user's booking data and facility schedules ⭐ **ENHANCED**
2. **Detect Current Day**: Automatically determine today's day of the week ⭐ **NEW**
3. **Calculate Progress**: Compute term statistics
4. **Filter & Display**: Show filtered content based on selected tab and filters ⭐ **ENHANCED**
5. **Manage Participants**: Handle add/remove operations (My Schedules)
6. **Join Schedules**: Handle facility schedule enrollment (Facility Schedules) ⭐ **NEW**
7. **Update Progress**: Recalculate on booking changes

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

### **Unified BookingCard - Facility Schedule Variant** ⭐ **NEW**

```typescript
// Facility schedule variant - shows availability and join actions
<BookingCard
  booking={{
    id: 'fs1',
    scheduleTitle: 'Beginner Adult Swimming',
    scheduleType: 'Adults • Group • Beginner',
    instructor: 'Sarah Johnson',
    dayOfWeek: 'monday',
    time: '6:00 PM - 7:00 PM',
    location: 'Pool A',
    // No price field - uses session credits
    totalSessions: 8,
    currentParticipants: 4,
    maxParticipants: 8,
    availableSpots: 4,
    color: theme.colors.interactive.primary
  }}
  variant="facility-schedule"
  onJoinSchedule={handleJoinSchedule}
  onViewDetails={handleViewDetails}
  userSessionCredits={userSessionCredits}
/>

// Personal booking variant - shows participants and status
<BookingCard
  booking={{
    id: '1',
    scheduleTitle: 'Learn to Swim',
    scheduleType: 'Kids • Private • Beginner',
    instructor: 'Sarah Johnson',
    status: 'upcoming',
    participants: familyMembers,
    maxParticipants: 6,
    sessionNumber: 3,
    totalSessions: 8
  }}
  variant="booking" // default variant
  onPress={handleBookingPress}
  onManageParticipants={handleManageParticipants}
/>
```

### **Day-Based Filtering** ⭐ **NEW**

```typescript
// Current day detection
const getCurrentDay = () => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[new Date().getDay()];
};

// Filter configuration
const facilityFilters = [
  { key: 'all', label: 'All', count: facilitySchedules.length },
  { key: 'sunday', label: 'Sun', count: schedules.filter(s => s.dayOfWeek === 'sunday').length },
  { key: 'monday', label: 'Mon', count: schedules.filter(s => s.dayOfWeek === 'monday').length },
  // ... other days
];

// Filter rendering with current day highlighting
{facilityFilters.map(filter => {
  const isCurrentDay = filter.key === currentDay;
  const isSelected = facilityFilter === filter.key;
  return (
    <FilterButton
      isSelected={isSelected}
      isCurrentDay={isCurrentDay}
      label={filter.label}
      count={filter.count}
    />
  );
})}
```

### **Dual Schedule System** ⭐ **NEW**

```typescript
// Schedule type state management
const [scheduleType, setScheduleType] = useState<'my-schedules' | 'facility-schedules'>('my-schedules');

// Conditional content rendering with unified BookingCard
{scheduleType === 'my-schedules' ? (
  <FlatList
    data={filteredBookings}
    renderItem={({ item }) => (
      <BookingCard 
        booking={item} 
        variant="booking"
        onPress={handleBookingPress}
        onManageParticipants={handleManageParticipants}
      />
    )}
  />
) : (
  <FlatList
    data={filteredFacilitySchedules}
    renderItem={({ item }) => (
      <BookingCard 
        booking={item} 
        variant="facility-schedule"
        onJoinSchedule={handleJoinSchedule}
        onViewDetails={handleViewDetails}
      />
    )}
  />
)}
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