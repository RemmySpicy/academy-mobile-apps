# BookingsScreen Component

**Status**: ✅ **COMPLETE & PRODUCTION READY**

The main booking management screen featuring a dual schedule system with personal bookings and facility schedule browsing.

## 🎯 Overview

BookingsScreen provides comprehensive session management with:
- **Dual Schedule System**: Switch between "My Schedules" and "Facility Schedules"
- **Day-Based Filtering**: Sunday through Saturday filtering with current day highlighting
- **Term Progress Tracking with Expiry**: Visual indicators with term date ranges (e.g., "This Term (Jan 1 - Feb 11)") ⭐ **UPDATED**
- **Enrollment-Based Logic**: Term expiry calculated from first session date, not enrollment ⭐ **NEW**
- **Unified BookingCard**: Single component handling both variants

## 📱 Key Features

### My Schedules Tab
- Personal bookings with status filtering (All, Upcoming, Completed, Cancelled)
- Participant management with add/remove functionality
- **Term progress statistics with date ranges** (e.g., "This Term (Jan 1 - Feb 11)") ⭐ **UPDATED**
- **Enrollment-based progress tracking** using actual enrollment data ⭐ **NEW**
- Reschedule/cancel actions

### Facility Schedules Tab
- Available schedules with day-based filtering
- Real-time availability tracking
- Join schedule functionality
- Current day highlighting

## 🔧 Implementation

```typescript
import { BookingsScreen } from '../features/bookings/screens/BookingsScreen';

// Navigation integration
<Stack.Screen 
  name="Bookings" 
  component={BookingsScreen}
  options={{ headerShown: false }}
/>
```

## 🎨 Architecture

- **Header**: Program switcher and notifications
- **Stats Cards**: Next session and **enhanced term progress with expiry dates** ⭐ **UPDATED**
- **Term Logic**: Enrollment-based tracking with first session date as term start ⭐ **NEW**
- **Custom Tab Selector**: Academy-themed schedule type switcher
- **Dynamic Filters**: Context-aware filter options
- **Unified Content**: BookingCard with appropriate variants (no individual term expiry) ⭐ **UPDATED**

## 📊 Term Expiry System ⭐ **NEW**

### Key Components
- **Enrollment Interface**: Tracks enrollment date vs. first session date
- **Term Calculation**: 6 or 8 weeks from first session (not enrollment)
- **Header Display**: "This Term (Jan 1 - Feb 11)" or "This Term (Not Started)"
- **Progress Integration**: Uses enrollment data for accurate session counting

### Implementation Details
```typescript
interface Enrollment {
  enrollmentDate: string;        // When user enrolled
  firstSessionDate?: string;     // When term starts counting
  termDurationWeeks: number;     // 6 or 8 weeks
  totalSessions: number;         // Available credits
  usedSessions: number;          // Completed sessions
}

// Term date calculation
const termEndDate = calculateTermEndDate(
  currentEnrollment.firstSessionDate, 
  currentEnrollment.termDurationWeeks
);

// Display format
const termLabel = currentEnrollment.firstSessionDate 
  ? `This Term (${formatTermDateRange(startDate, endDate)})`
  : 'This Term (Not Started)';
```

---

**Related**: [BookingCard](./BookingCard.md) | [BOOKING_SYSTEM.md](../../features/BOOKING_SYSTEM.md)