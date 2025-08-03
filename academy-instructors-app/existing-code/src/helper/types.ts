export type MarkedDate = {
  selected?: boolean;
  selectedColor?: string;
  dotColor?: string;
  marked?: boolean;
  disabled?: boolean;
};

export type MarkedDates = Record<string, MarkedDate>;

export type CalendarFilter = {
  id: string;
  label: string;
  active?: boolean;
  icon?: string;
};

export type QuickFilter = {
  id: string;
  label: string;
};

export type CalendarViewMode = "week" | "month";

export type CalendarTheme = {
  backgroundColor?: string;
  calendarBackground?: string;
  textSectionTitleColor?: string;
  selectedDayBackgroundColor?: string;
  selectedDayTextColor?: string;
  todayTextColor?: string;
  dayTextColor?: string;
  textDisabledColor?: string;
  dotColor?: string;
  selectedDotColor?: string;
  arrowColor?: string;
  monthTextColor?: string;
  indicatorColor?: string;
  textDayFontWeight?: string;
  textMonthFontWeight?: string;
  textDayHeaderFontWeight?: string;
  textDayFontSize?: number;
  textMonthFontSize?: number;
  textDayHeaderFontSize?: number;
};

export type CalendarDay = {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
};
