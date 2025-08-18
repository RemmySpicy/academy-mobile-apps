// Re-export components with direct exports to avoid property descriptor conflicts
export {
  SocialAuthButton,
  GoogleSignInButton,
  AppleSignInButton,
  FacebookSignInButton,
  SocialAuthGroup,
  SocialAuthButtons,
} from './auth';

export {
  PerformanceChart,
} from './charts';

export {
  CustomInput,
  CustomButton,
  CustomDropdown,
  CustomTextArea,
  CustomCheckBox,
  RadioButton,
  SingleRadioButton,
  OtpField,
  QuantityController,
} from './forms';

export {
  ProgramContextProvider,
  ProgramGuard,
  ProgramHeader,
  ProgramSelector,
} from './program';

export {
  CustomModal,
  CustomAlert,
  Show,
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
  ErrorMessage,
  ErrorAlert,
  WarningAlert,
  InfoAlert,
  useErrorMessage,
  Header,
  StudentCard,
  InstructorDashboard,
  ToggleCard,
  EmptySearchResult,
  SelectOptions,
  HeaderComponents,
  SimpleHeader,
  NavigationHeader,
  CustomHeader,
  HeaderComponent,
  HeaderWithNotification,
  OptionMenu,
  TimesTab,
  StrokeTab,
  CustomModalWithDot,
  Button,
  FilterBar,
  StudentListCard,
  Lessons,
} from './ui';

export {
  SearchInput,
  FilterChip,
  QuickFilterBar,
  useQuickFilters,
  SearchBar,
  SimpleSearchBar,
} from './search';

export {
  Calendar,
  DatePicker,
  SimpleDatePicker,
  ClassroomCalendar,
  StudentProfileCalendar,
} from './calendar';

export {
  WorkoutCard,
  ClassroomCard,
} from './performance';

export {
  ControlCard,
  QuickFilter,
  SearchComponent,
  StaticSearchComponent,
  SearchComp,
  StaticSearchComp,
  FilterComponent,
} from './controls';

export {
  ScheduleInput,
  ScheduleList,
  Schedules,
} from './scheduling';

export {
  StudentProfile,
} from './student';