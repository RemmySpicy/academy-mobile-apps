// Calendar Components

export { default as Calendar } from './Calendar';
export type { CalendarProps, CalendarEvent } from './Calendar';

export { default as DatePicker, SimpleDatePicker } from './DatePicker';
export type { DatePickerProps } from './DatePicker';

// New consolidated calendar component
export { default as AcademyCalendar } from './AcademyCalendar';
export type { AcademyCalendarProps, CalendarEvent as AcademyCalendarEvent } from './AcademyCalendar';

// Legacy calendar components (now wrappers around AcademyCalendar)
export { default as ClassroomCalendar } from './ClassroomCalendar';
export type { ClassroomCalendarProps, ClassroomEvent } from './ClassroomCalendar';

export { default as StudentProfileCalendar } from './StudentProfileCalendar';
export type { StudentProfileCalendarProps, StudentEvent } from './StudentProfileCalendar';