/**
 * Date utilities for ControlCard and other components
 */

export type DateRangeType = 'week' | 'month' | 'custom' | 'none';

/**
 * Generate an array of date strings for a given range type
 * @param baseDate - Base date as ISO string
 * @param type - Type of date range to generate
 * @returns Array of date strings in YYYY-MM-DD format
 */
export const getDateRange = (baseDate: string, type: DateRangeType): string[] => {
  const date = new Date(baseDate);
  
  switch (type) {
    case 'week': {
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay() + 1); // Monday
      return Array.from({ length: 7 }).map((_, i) => {
        const weekDate = new Date(startOfWeek);
        weekDate.setDate(startOfWeek.getDate() + i);
        return weekDate.toISOString().split('T')[0];
      });
    }
    case 'month': {
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      const daysInMonth = endOfMonth.getDate();
      return Array.from({ length: daysInMonth }).map((_, i) => {
        const monthDate = new Date(startOfMonth);
        monthDate.setDate(i + 1);
        return monthDate.toISOString().split('T')[0];
      });
    }
    default:
      return [];
  }
};

/**
 * Format a date string with custom format patterns
 * @param dateString - Date string in ISO format
 * @param format - Optional format string (DD, MM, YYYY tokens supported)
 * @returns Formatted date string
 */
export const formatDate = (dateString: string, format?: string): string => {
  const date = new Date(dateString);
  if (format) {
    // Simple format support - can be extended
    return format
      .replace('DD', date.getDate().toString().padStart(2, '0'))
      .replace('MM', (date.getMonth() + 1).toString().padStart(2, '0'))
      .replace('YYYY', date.getFullYear().toString());
  }
  return date.toLocaleDateString();
};

/**
 * Get the start of week for a given date (Monday)
 * @param date - Date to get start of week for
 * @returns Date object representing start of week
 */
export const getStartOfWeek = (date: Date): Date => {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay() + 1); // Monday
  return startOfWeek;
};

/**
 * Get the start and end of month for a given date
 * @param date - Date to get month boundaries for
 * @returns Object with startOfMonth and endOfMonth Date objects
 */
export const getMonthBoundaries = (date: Date): { startOfMonth: Date; endOfMonth: Date } => {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return { startOfMonth, endOfMonth };
};

/**
 * Check if a date is today
 * @param dateString - Date string in ISO format
 * @returns Boolean indicating if the date is today
 */
export const isToday = (dateString: string): boolean => {
  const today = new Date().toISOString().split('T')[0];
  return dateString === today;
};

/**
 * Check if a date is within a range
 * @param dateString - Date string to check
 * @param startDate - Start of range
 * @param endDate - End of range
 * @returns Boolean indicating if date is in range
 */
export const isDateInRange = (dateString: string, startDate: string, endDate: string): boolean => {
  const date = new Date(dateString);
  const start = new Date(startDate);
  const end = new Date(endDate);
  return date >= start && date <= end;
};