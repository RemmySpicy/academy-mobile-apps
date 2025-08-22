# Date Utilities

Comprehensive date manipulation and formatting functions for Academy components.

## 📅 Overview

The date utilities provide consistent date handling across Academy components, with functions for date range generation, formatting, and common date operations.

## 🚀 Quick Start

```typescript
import { 
  getDateRange, 
  formatDate, 
  isToday,
  getStartOfWeek,
  getMonthBoundaries,
  isDateInRange 
} from '@academy/mobile-shared';
```

## 🔧 Functions

### getDateRange(baseDate, type)

Generate an array of date strings for a given range type.

```typescript
function getDateRange(baseDate: string, type: DateRangeType): string[]

type DateRangeType = 'week' | 'month' | 'custom' | 'none'
```

**Examples:**
```typescript
// Get current week (Monday to Sunday)
const weekDates = getDateRange('2024-12-15', 'week');
// Returns: ['2024-12-09', '2024-12-10', ..., '2024-12-15']

// Get current month
const monthDates = getDateRange('2024-12-15', 'month');
// Returns: ['2024-12-01', '2024-12-02', ..., '2024-12-31']

// No dates for 'none' type
const noDates = getDateRange('2024-12-15', 'none');
// Returns: []
```

### formatDate(dateString, format?)

Format a date string with custom format patterns.

```typescript
function formatDate(dateString: string, format?: string): string
```

**Format Tokens:**
- `DD` - Day with leading zero (01-31)
- `MM` - Month with leading zero (01-12) 
- `YYYY` - Full year (2024)

**Examples:**
```typescript
// Default locale formatting
const defaultFormat = formatDate('2024-12-15');
// Returns: "12/15/2024" (US locale)

// Custom format
const customFormat = formatDate('2024-12-15', 'DD/MM/YYYY');
// Returns: "15/12/2024"

// Another custom format
const anotherFormat = formatDate('2024-12-15', 'YYYY-MM-DD');
// Returns: "2024-12-15"
```

### isToday(dateString)

Check if a date string represents today's date.

```typescript
function isToday(dateString: string): boolean
```

**Examples:**
```typescript
const today = new Date().toISOString().split('T')[0];
console.log(isToday(today)); // true

console.log(isToday('2024-12-15')); // false (unless today is Dec 15, 2024)
```

### getStartOfWeek(date)

Get the Monday start of week for a given date.

```typescript
function getStartOfWeek(date: Date): Date
```

**Examples:**
```typescript
const someDate = new Date('2024-12-15'); // Sunday
const monday = getStartOfWeek(someDate);
// Returns: Date object for Monday, December 9, 2024
```

### getMonthBoundaries(date)

Get the start and end dates of the month for a given date.

```typescript
function getMonthBoundaries(date: Date): { 
  startOfMonth: Date; 
  endOfMonth: Date; 
}
```

**Examples:**
```typescript
const someDate = new Date('2024-12-15');
const { startOfMonth, endOfMonth } = getMonthBoundaries(someDate);
// startOfMonth: December 1, 2024
// endOfMonth: December 31, 2024
```

### isDateInRange(dateString, startDate, endDate)

Check if a date falls within a specified range.

```typescript
function isDateInRange(
  dateString: string, 
  startDate: string, 
  endDate: string
): boolean
```

**Examples:**
```typescript
const inRange = isDateInRange('2024-12-15', '2024-12-01', '2024-12-31');
// Returns: true

const outOfRange = isDateInRange('2024-11-15', '2024-12-01', '2024-12-31');
// Returns: false
```

## 🎯 Common Use Cases

### Calendar Components

```typescript
import { getDateRange, isToday, formatDate } from '@academy/mobile-shared';

function CalendarWeekView({ baseDate }: { baseDate: string }) {
  const weekDates = getDateRange(baseDate, 'week');
  
  return (
    <View style={styles.weekContainer}>
      {weekDates.map(date => (
        <View 
          key={date}
          style={[
            styles.dayBox,
            isToday(date) && styles.todayBox
          ]}
        >
          <Text>{formatDate(date, 'DD')}</Text>
          <Text>{new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}</Text>
        </View>
      ))}
    </View>
  );
}
```

### Date Range Validation

```typescript
import { isDateInRange, getMonthBoundaries } from '@academy/mobile-shared';

function validateSessionDate(sessionDate: string, month: Date): boolean {
  const { startOfMonth, endOfMonth } = getMonthBoundaries(month);
  
  return isDateInRange(
    sessionDate,
    startOfMonth.toISOString().split('T')[0],
    endOfMonth.toISOString().split('T')[0]
  );
}
```

### Dynamic Date Formatting

```typescript
import { formatDate } from '@academy/mobile-shared';

function formatSessionDate(date: string, locale: string) {
  switch (locale) {
    case 'en-US':
      return formatDate(date, 'MM/DD/YYYY');
    case 'en-GB':
      return formatDate(date, 'DD/MM/YYYY');
    case 'iso':
      return formatDate(date, 'YYYY-MM-DD');
    default:
      return formatDate(date); // Default browser locale
  }
}
```

## 🎨 Integration with ControlCard

The date utilities are used extensively in ControlCard:

```typescript
import { ControlCard, getDateRange, formatDate } from '@academy/mobile-shared';

function SessionManagement() {
  const today = new Date().toISOString().split('T')[0];
  const weekDates = getDateRange(today, 'week');
  
  return (
    <ControlCard
      title="Session Calendar"
      dateRangeType="week"
      customDateFormat="DD/MM/YYYY"
      markedDates={weekDates.filter(date => /* has sessions */)}
      onDateSelect={(date) => {
        console.log('Selected:', formatDate(date, 'DD/MM/YYYY'));
      }}
    />
  );
}
```

## 🌍 Internationalization Support

While the current utilities provide basic formatting, they can be extended for full i18n:

```typescript
// Future enhancement example
function formatDateI18n(dateString: string, locale: string, format?: string) {
  const date = new Date(dateString);
  
  if (format) {
    // Custom format with locale-aware patterns
    return applyFormatWithLocale(date, format, locale);
  }
  
  // Use browser's locale formatting
  return date.toLocaleDateString(locale);
}
```

## 🔧 Performance Considerations

- All functions are pure and side-effect free
- Date objects are created as needed (not cached)
- Array operations use efficient `Array.from()` with mapping
- String operations are optimized for common use cases

## 📋 Type Definitions

```typescript
export type DateRangeType = 'week' | 'month' | 'custom' | 'none';

export interface MonthBoundaries {
  startOfMonth: Date;
  endOfMonth: Date;
}

// Function signatures
export function getDateRange(baseDate: string, type: DateRangeType): string[];
export function formatDate(dateString: string, format?: string): string;
export function isToday(dateString: string): boolean;
export function getStartOfWeek(date: Date): Date;
export function getMonthBoundaries(date: Date): MonthBoundaries;
export function isDateInRange(dateString: string, startDate: string, endDate: string): boolean;
```

## 🔗 Related Utilities

- **[Style Utilities](./styleUtils.md)** - Dynamic style generation
- **[ControlCard](../controls/ControlCard.md)** - Main component using these utilities
- **[Calendar Components](../calendar/)** - Calendar-specific components

---

The date utilities provide a robust foundation for date handling across Academy components while maintaining consistency and performance.