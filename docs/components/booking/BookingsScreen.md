# BookingsScreen Component

**Status**: ✅ **COMPLETE & PRODUCTION READY**

The main booking management screen featuring a dual schedule system with personal bookings and facility schedule browsing.

## 🎯 Overview

BookingsScreen provides comprehensive session management with:
- **Dual Schedule System**: Switch between "My Schedules" and "Facility Schedules"
- **Day-Based Filtering**: Sunday through Saturday filtering with current day highlighting
- **Term Progress Tracking**: Visual indicators for 8-session terms
- **Unified BookingCard**: Single component handling both variants

## 📱 Key Features

### My Schedules Tab
- Personal bookings with status filtering (All, Upcoming, Completed, Cancelled)
- Participant management with add/remove functionality
- Term progress statistics
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
- **Stats Cards**: Next session and term progress
- **Custom Tab Selector**: Academy-themed schedule type switcher
- **Dynamic Filters**: Context-aware filter options
- **Unified Content**: BookingCard with appropriate variants

---

**Related**: [BookingCard](./BookingCard.md) | [BOOKING_SYSTEM.md](../../features/BOOKING_SYSTEM.md)