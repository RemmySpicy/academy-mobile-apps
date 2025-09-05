# JoinScheduleBottomSheet Component

**Status**: ✅ **PRODUCTION READY** - Enhanced with advanced session management

The `JoinScheduleBottomSheet` is an advanced bottom sheet component that provides comprehensive session scheduling, multi-participant credit management, and individual session date selection for facility schedules.

## 📋 Features

### **Core Functionality** ⭐ **ENHANCED**
- **Multi-Participant Management**: Select family members with individual credit balances
- **Interactive Session Calendar**: Visual calendar showing specific session dates ⭐ **NEW**
- **Individual Date Selection**: Tap sessions to include/exclude from enrollment ⭐ **NEW**
- **Smart Credit Management**: Per-participant credit tracking with warnings ⭐ **NEW**
- **Partial Enrollment Support**: Handle mixed credit scenarios gracefully ⭐ **NEW**
- **Performance Optimized**: Efficient date generation preventing app freezing ⭐ **NEW**

### **Advanced Credit Features** ⭐ **NEW**
- **Individual Credit Display**: Shows available credits next to each participant name
- **Smart Session Limits**: Adjusts max sessions based on highest credit balance in group
- **Visual Warning System**: Amber alerts for participants with insufficient credits
- **Real-Time Calculations**: Credits update as sessions are selected/deselected
- **Detailed Breakdown**: Per-participant credit allocation with warnings

### **Session Schedule Management** ⭐ **NEW**
- **Dynamic Date Generation**: Automatically creates session dates based on schedule day
- **Weekly Patterns**: Generates weekly recurring sessions (e.g., every Monday)
- **Flexible Selection**: Remove specific conflicting dates while keeping others
- **Visual Calendar**: 3-column grid showing session dates with clear formatting
- **Interactive States**: Purple for selected, red for deselected sessions

## 🎨 Design & Layout

### **Large Bottom Sheet Interface**
- **75% Screen Height**: Uses 'large' snap point for comprehensive content display
- **Expandable to Full**: Can expand to 95% with drag handle
- **Scrollable Content**: Smooth scrolling through all sections
- **Academy Theming**: Consistent purple brand colors throughout

### **Section Organization**
1. **Schedule Details**: Overview of the facility schedule
2. **Participant Selection**: Choose family members with credit display ⭐ **REORDERED**
3. **Session Count**: Set base number of sessions with smart limits
4. **Session Schedule**: Interactive calendar with date selection ⭐ **NEW**
5. **Credit Breakdown**: Detailed per-participant allocation
6. **Join Button**: Context-aware enrollment action

### **Visual Design Elements**
- **Credit Display**: Right-aligned credit counts next to participant names
- **Warning Badges**: Amber alerts for insufficient credits
- **Session Grid**: Responsive 3-column layout for session dates
- **Progress Indicators**: Visual feedback for selected/deselected states
- **Status Colors**: Academy purple for positive states, red for warnings

## 🔧 Technical Implementation

### **Interface Definition**
```typescript
interface JoinScheduleBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  schedule: FacilitySchedule | null;
  userSessionCredits: number;
  onJoinSchedule: (scheduleId: string, sessionCount: number, participants: string[]) => void;
}

interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  relationship: 'self' | 'child' | 'spouse';
  isSelected: boolean;
  sessionCredits: number; // ⭐ NEW - Individual credit balance
}

interface SessionDate {
  id: string;
  date: Date;
  dayOfWeek: string;
  formattedDate: string;
  isSelected: boolean; // ⭐ NEW - Individual session selection
}
```

### **Performance Optimizations** ⭐ **CRITICAL**
```typescript
// Memoized helper functions to prevent recreation
const getDayOfWeekNumber = useCallback((dayName: string): number => {
  if (!dayName || typeof dayName !== 'string') return -1;
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days.indexOf(dayName);
}, []);

// Efficient date generation with safety checks
useEffect(() => {
  if (!schedule) {
    setCustomSessions([]);
    return;
  }
  
  // Safety check for valid day
  const targetDay = getDayOfWeekNumber(schedule.dayOfWeek);
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
  
  // Generate sessions with limits (max 52 sessions/year)
  for (let i = 0; i < selectedSessionCount && i < 52; i++) {
    // ... date generation logic
  }
}, [schedule?.dayOfWeek, schedule?.id, selectedSessionCount]);
```

### **Smart Credit Calculation** ⭐ **NEW**
```typescript
// Calculate based on selected sessions and individual limits
const selectedSessionsCount = customSessions.filter(s => s.isSelected).length;
const totalCreditsNeeded = selectedParticipants.reduce((total, participant) => {
  const sessionsForParticipant = Math.min(selectedSessionsCount, participant.sessionCredits);
  return total + sessionsForParticipant;
}, 0);

// Identify participants with warnings
const participantsWithWarnings = selectedParticipants.filter(p => 
  p.sessionCredits < selectedSessionsCount
);
```

## 🚀 Usage Examples

### **Basic Implementation**
```typescript
import { JoinScheduleBottomSheet } from '@academy/mobile-shared';

const [showJoinSheet, setShowJoinSheet] = useState(false);
const [selectedSchedule, setSelectedSchedule] = useState<FacilitySchedule | null>(null);

const handleJoinSchedule = (scheduleId: string, sessionCount: number, participants: string[]) => {
  // Process enrollment with selected sessions and participants
  console.log(`Joining ${scheduleId} for ${sessionCount} sessions with participants:`, participants);
  setShowJoinSheet(false);
};

<JoinScheduleBottomSheet
  visible={showJoinSheet}
  onClose={() => setShowJoinSheet(false)}
  schedule={selectedSchedule}
  userSessionCredits={userSessionCredits}
  onJoinSchedule={handleJoinSchedule}
/>
```

### **Integration with BookingCard**
```typescript
<BookingCard
  booking={facilitySchedule}
  variant="facility-schedule"
  onJoinSchedule={(schedule) => {
    setSelectedSchedule(schedule);
    setShowJoinSheet(true);
  }}
  userSessionCredits={userSessionCredits}
/>
```

### **Advanced Usage with Custom Props**
```typescript
<JoinScheduleBottomSheet
  visible={showJoinSheet}
  onClose={() => setShowJoinSheet(false)}
  schedule={{
    id: 'swim-101',
    scheduleTitle: 'Beginner Adult Swimming',
    scheduleType: 'Adults • Group • Beginner',
    instructor: 'Sarah Johnson',
    dayOfWeek: 'Monday', // Used for date generation
    time: '6:00 PM - 7:00 PM',
    location: 'Pool A',
    totalSessions: 8,
    currentParticipants: 4,
    maxParticipants: 8,
    availableSpots: 4,
  }}
  userSessionCredits={15}
  onJoinSchedule={(scheduleId, sessionCount, participants) => {
    // Handle enrollment with custom session selection
    console.log(`Enrolling in ${sessionCount} selected sessions`);
  }}
/>
```

## 🎯 User Experience Flow

### **Complete Enrollment Journey**
1. **Open Bottom Sheet**: Triggered from BookingCard "Join Schedule" action
2. **Review Schedule**: See instructor, time, location, availability
3. **Select Participants**: Choose family members, see individual credit balances
4. **Set Session Count**: Use slider, automatically limited by highest credits
5. **View Session Calendar**: See specific dates generated for that day of week ⭐ **NEW**
6. **Customize Schedule**: Tap to remove conflicting dates ⭐ **NEW**
7. **Review Credits**: See per-participant allocation and warnings
8. **Confirm Enrollment**: Join with customized selection

### **Smart Confirmations**
```typescript
// Partial enrollment confirmation
if (participantsWithWarnings.length > 0) {
  Alert.alert(
    'Partial Enrollment Notice',
    `Some participants will be enrolled in fewer sessions due to insufficient credits:\n\n${warningMessage}\n\nDo you want to continue?`,
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Continue', onPress: confirmEnrollment }
    ]
  );
}
```

## 🎨 Theming & Customization

### **Academy Theme Integration**
```typescript
const styles = createThemedStyles((theme) => ({
  // Session item states
  sessionItemSelected: {
    backgroundColor: theme.colors.interactive.primary + '15',
    borderColor: theme.colors.interactive.primary,
  },
  sessionItemDeselected: {
    backgroundColor: theme.colors.status.error + '10',
    borderColor: theme.colors.status.error + '40',
  },
  
  // Warning system
  participantWarning: {
    backgroundColor: theme.colors.status.warning + '15',
    borderColor: theme.colors.status.warning + '30',
  },
  
  // Credit display
  participantCredits: {
    color: theme.colors.interactive.primary,
    fontWeight: theme.fontConfig.fontWeight.medium,
  },
}));
```

### **Customizable Elements**
- **Color Scheme**: Supports Academy purple, warning amber, error red
- **Typography**: Uses Academy font weights and sizes
- **Spacing**: Consistent with Academy spacing system
- **Animations**: Smooth state transitions and interactions

## 🔍 Accessibility Features

- **Screen Reader Support**: Proper accessibility labels and hints
- **Touch Targets**: 44px minimum for all interactive elements
- **Color Contrast**: WCAG 2.1 AA compliance
- **Focus Management**: Proper focus order for keyboard navigation
- **Haptic Feedback**: Tactile feedback for important actions

## 🐛 Error Handling

### **Robust Error Management**
```typescript
// Date validation
if (targetDay === -1) {
  console.warn('Invalid day of week:', schedule.dayOfWeek);
  setCustomSessions([]);
  return;
}

// Loop protection
if (daysAdded >= 7) {
  console.warn('Could not find target day within a week');
  setCustomSessions([]);
  return;
}

// Date formatting safety
const formatSessionDate = useCallback((date: Date): string => {
  try {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    console.warn('Error formatting date:', error);
    return 'Invalid Date';
  }
}, []);
```

## 📱 Mobile-First Features

- **Large Bottom Sheet**: 75% screen height for comprehensive content
- **Touch Interactions**: Smooth tap feedback on all interactive elements
- **Gesture Support**: Drag to expand, swipe to close
- **Performance Optimized**: Prevents freezing with efficient date logic
- **Responsive Grid**: 3-column session layout adapts to screen width

## 🔗 Related Components

- **[BookingCard](./BookingCard.md)** - Triggers the join schedule flow
- **[ParticipantManagementBottomSheet](./ParticipantManagementBottomSheet.md)** - Similar participant management patterns
- **[BottomSheet](../navigation/BottomSheet.md)** - Underlying bottom sheet implementation
- **[BookingsScreen](./BookingsScreen.md)** - Main screen containing facility schedules

## 🚀 Recent Enhancements

### **Version 2.0** ⭐ **NEW FEATURES**
- ✅ **Interactive Session Calendar**: Visual date selection with tap interactions
- ✅ **Individual Credit Management**: Per-participant credit tracking and warnings
- ✅ **Performance Optimization**: Fixed app freezing with efficient date logic
- ✅ **Enhanced UX Flow**: Reordered sections for better user experience
- ✅ **Large Bottom Sheet**: Expanded to 75% screen height for better content display
- ✅ **Smart Confirmations**: Clear dialogs for partial enrollment scenarios

### **Performance Improvements**
- ✅ **Memoized Functions**: useCallback for helper functions
- ✅ **Optimized Dependencies**: Specific property watching instead of full objects
- ✅ **Safety Limits**: Maximum iteration counts and error boundaries
- ✅ **Memory Management**: Proper cleanup and state management

---

**Last Updated**: January 2025  
**Version**: 2.0.0  
**Component**: JoinScheduleBottomSheet  
**Location**: `students-app/src/features/bookings/components/JoinScheduleBottomSheet.tsx`