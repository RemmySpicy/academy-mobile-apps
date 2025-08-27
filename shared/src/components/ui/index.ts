// UI Components

export { default as CustomModal } from './CustomModal';
export type { CustomModalProps, CustomModalRef } from './CustomModal';

export { default as CustomAlert } from './CustomAlert';
export type { CustomAlertProps, AlertType, AlertPosition, AlertAction } from './CustomAlert';

export {
  default as Show,
  ShowWhen,
  ShowElse,
  ShowUnless,
  ShowSwitch,
  ShowCase,
  ShowDefault,
  when,
  unless,
  either,
  switchRender,
  withConditionalRender,
  useConditionalRender,
} from './Show';

export {
  default as ErrorMessage,
  ErrorAlert,
  WarningAlert,
  InfoAlert,
  useErrorMessage,
} from './ErrorMessage';
export type { ErrorMessageProps } from './ErrorMessage';

// Enhanced UI Components
export { default as Header } from './Header';
export { default as StudentCard } from './StudentCard';
export { default as InstructorDashboard } from './InstructorDashboard';
export { default as StudentDashboard } from './StudentDashboard';
export { default as ErrorBoundary } from './ErrorBoundary';

// Animation Components
export { AnimatedWrapper, FadeInWrapper } from './AnimatedWrapper';
export type { AnimatedWrapperProps } from './AnimatedWrapper';

// New Core UI Components
export { default as ToggleCard } from './ToggleCard';
export type { 
  ToggleCardProps,
  ToggleCardVariant,
  ToggleCardSize,
  ToggleCardStyle,
  ToggleCardIconStyle
} from './ToggleCard';

export { default as EmptySearchResult } from './EmptySearchResult';
export type { EmptySearchResultProps } from './EmptySearchResult';

export { default as SelectOptions } from './SelectOptions';
export type { SelectOptionsProps, SelectOption } from './SelectOptions';

export { default as FormDropdown } from './FormDropdown';
export type { FormDropdownProps, DropdownOption } from './FormDropdown';

export {
  default as HeaderComponents,
  SimpleHeader,
  NavigationHeader,
  CustomHeader,
  HeaderComponent,
  HeaderWithNotification,
} from './HeaderComponent';
export type { 
  SimpleHeaderProps, 
  NavigationHeaderProps, 
  CustomHeaderProps 
} from './HeaderComponent';

export { default as ControlCard } from '../controls/ControlCard';
export type { 
  ControlCardProps, 
  QueryFilterItem, 
  QuickFilterItem 
} from '../controls/ControlCard';

export { default as FilterComponent } from './FilterComponent';
export type { 
  FilterComponentProps, 
  FilterGroup as FilterComponentGroup, 
  FilterBottomSheetProps 
} from './FilterComponent';

// Additional UI Components
export { default as OptionMenu } from './OptionMenu';
export type { OptionMenuProps, MenuOption } from './OptionMenu';

// Legacy alias for backward compatibility
export { default as TimesTab } from './TabBar';
export type { 
  TabBarProps as TimesTabProps, 
  Tab as TimeTab 
} from './TabBar';

export { default as StrokeTab } from './StrokeTab';
export type { StrokeTabProps, StrokeTab as StrokeTabType, PerformanceTime } from './StrokeTab';

// New Tab Components
export { default as SegmentedControl } from './SegmentedControl';
export type { 
  SegmentedControlProps,
  SegmentedControlOption,
  SegmentedControlVariant,
  SegmentedControlSize
} from './SegmentedControl';

export { default as IconTabBar } from './IconTabBar';
export type { 
  IconTabBarProps,
  IconTab,
  TabBadge,
  IconTabBarSize,
  IconTabBarVariant
} from './IconTabBar';

export { default as TabBar } from './TabBar';
export type { 
  TabBarProps,
  Tab,
  TabBarVariant,
  TabBarSize,
  TabBarMode
} from './TabBar';

// Legacy aliases for backward compatibility
export { default as FixedTabBar } from './TabBar';
export type { 
  TabBarProps as FixedTabBarProps,
  Tab as FixedTab,
  TabBarVariant as FixedTabBarVariant,
  TabBarSize as FixedTabBarSize
} from './TabBar';

export { default as Chip } from './Chip';
export type { 
  ChipProps,
  ChipItem,
  ChipVariant,
  ChipSize,
  ChipCountStyle
} from './Chip';

// Legacy alias for backward compatibility
export { default as PillTabs } from './Chip';
export type { 
  ChipProps as PillTabsProps,
  ChipItem as PillTab,
  ChipVariant as PillTabsVariant,
  ChipSize as PillTabsSize
} from './Chip';

export { default as CustomModalWithDot } from './CustomModalWithDot';
export type { CustomModalWithDotProps } from './CustomModalWithDot';

// Phase 2: Enhanced UI Components  
export { default as Alert } from './Alert';
export type { AlertProps } from './Alert';

export { default as MenuList } from './MenuList';
export type { MenuListProps, MenuItem } from './MenuList';

export { default as MetricPool } from './MetricPool';
export type { MetricPoolProps } from './MetricPool';

export { default as Stations } from './Stations';
export type { StationsProps, StationIconConfig } from './Stations';

// Phase 4: Enhanced UI Components
// Button removed - use CustomButton from forms instead

export { default as FilterBar } from './FilterBar';
export type { FilterBarProps, FilterGroup, FilterOption } from './FilterBar';

export { default as StudentListCard } from './StudentListCard';
export type { StudentListCardProps, StudentData, StudentTag } from './StudentListCard';

export { default as Lessons } from './Lessons';
export type { LessonsProps, LessonData, LessonStation, LessonActivity } from './Lessons';

export { default as Badge } from './Badge';
export type { BadgeProps } from './Badge';

export { default as LoadingSpinner } from './LoadingSpinner';
export type { LoadingSpinnerProps } from './LoadingSpinner';

export { default as NotificationList } from './NotificationList';
export type { NotificationListProps, NotificationItem } from './NotificationList';

// Bottom Sheet Components
export { default as BottomSheet } from './BottomSheet';
export type { BottomSheetProps, BottomSheetRef, BottomSheetSnapPoint } from './BottomSheet';

export { 
  default as BottomSheetProvider, 
  useBottomSheet, 
  useBottomSheetActions, 
  useBottomSheetState, 
  useQuickBottomSheet 
} from './BottomSheetProvider';
export type { 
  BottomSheetConfig, 
  BottomSheetContextValue, 
  BottomSheetProviderProps 
} from './BottomSheetProvider';