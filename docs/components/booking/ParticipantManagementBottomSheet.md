# ParticipantManagementBottomSheet Component

**Status**: ✅ **PRODUCTION READY**

A bottom sheet interface for managing participants in booking sessions, allowing users to add or remove family members from scheduled sessions.

## 🎯 Overview

Provides comprehensive participant management with:
- **Family Member Selection**: Add/remove family members from bookings
- **Capacity Management**: Visual feedback when sessions reach capacity
- **Bottom Sheet Interface**: Modern mobile UX with smooth animations
- **Role-Based Display**: Clear indication of participant roles (student, parent)

## 📱 Usage

```typescript
import { ParticipantManagementBottomSheet } from '@academy/mobile-shared';

<ParticipantManagementBottomSheet
  visible={showParticipantSheet}
  onClose={() => setShowParticipantSheet(false)}
  bookingTitle="Learn to Swim"
  currentParticipants={participants}
  maxParticipants={6}
  onAddParticipant={handleAddParticipant}
  onRemoveParticipant={handleRemoveParticipant}
/>
```

## 🔧 Props Interface

```typescript
interface ParticipantManagementBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  bookingTitle: string;
  currentParticipants: Participant[];
  maxParticipants: number;
  onAddParticipant: (participantId: string) => void;
  onRemoveParticipant: (participantId: string, reason: string) => void;
}
```

## 🎨 Features

- **Modern Bottom Sheet**: Snap points and smooth animations
- **Capacity Indicators**: Visual feedback for session limits
- **Family Management**: Easy selection of family members
- **Academy Theming**: Consistent with design system

---

**Related**: [BookingCard](./BookingCard.md) | [BottomSheet](../navigation/BottomSheet.md)