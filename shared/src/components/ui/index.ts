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
export { default as ErrorBoundary } from './ErrorBoundary';

// Animation Components
export { AnimatedWrapper, FadeInWrapper } from './AnimatedWrapper';

// New Core UI Components
export { default as ToggleCard } from './ToggleCard';
export type { ToggleCardProps } from './ToggleCard';

export { default as EmptySearchResult } from './EmptySearchResult';
export type { EmptySearchResultProps } from './EmptySearchResult';

export { default as SelectOptions } from './SelectOptions';
export type { SelectOptionsProps, SelectOption } from './SelectOptions';

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

export { default as TimesTab } from './TimesTab';
export type { TimesTabProps, TimeTab } from './TimesTab';

export { default as StrokeTab } from './StrokeTab';
export type { StrokeTabProps, StrokeTab as StrokeTabType, PerformanceTime } from './StrokeTab';

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
export { default as Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button';

export { default as FilterBar } from './FilterBar';
export type { FilterBarProps, FilterGroup, FilterOption } from './FilterBar';

export { default as StudentListCard } from './StudentListCard';
export type { StudentListCardProps, StudentData, StudentTag } from './StudentListCard';

export { default as Lessons } from './Lessons';
export type { LessonsProps, LessonData, LessonStation, LessonActivity } from './Lessons';