// Components - Direct exports to avoid property descriptor conflicts
export { Form } from './components/forms/Form';
export { CustomButton } from './components/forms/CustomButton'; // Primary button component for Academy apps
export { CustomInput } from './components/forms/CustomInput';
export { CustomDropdown } from './components/forms/CustomDropdown';
export { CustomTextArea } from './components/forms/CustomTextArea';
export { CustomCheckBox } from './components/forms/CustomCheckBox';
export { RadioButton, SingleRadioButton } from './components/forms/RadioButton';
export { OtpField } from './components/forms/OtpField';
export { QuantityController } from './components/forms/QuantityController';

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
  NavigationHeader,
  StudentCard,
  InstructorDashboard,
  // Animation components
  AnimatedWrapper,
  FadeInWrapper,
  // Newly extracted UI components
  ToggleCard,
  EmptySearchResult,
  SelectOptions,
  FormDropdown,
  HeaderComponent,
  ControlCard,
  FilterComponent,
  OptionMenu,
  StrokeTab,
  SegmentedControl,
  IconTabBar,
  TabBar,
  Chip,
  CustomModalWithDot,
  ErrorBoundary,
} from './components/ui';

export {
  SocialAuthButton,
  GoogleSignInButton,
  AppleSignInButton,
  FacebookSignInButton,
  SocialAuthGroup,
  SocialAuthButtons,
  LoginForm,
  OnboardingModal,
} from './components/auth';

export {
  PerformanceChart,
} from './components/charts';


export {
  ProgramContextProvider,
  ProgramGuard,
  ProgramHeader,
  ProgramSelector,
  useProgramContext,
} from './components/program';

// Search System Components
export {
  SearchInput,
  QuickFilterBar,
  SearchBar,
  SimpleSearchBar,
  SearchContainer,
  useQuickFilters,
} from './components/search';

// Note: FilterChip has been consolidated into the unified Chip component
// Available as: import { Chip } from '@academy/mobile-shared';

// Calendar Components
export {
  Calendar,
  DatePicker,
  ClassroomCalendar,
  StudentProfileCalendar,
} from './components/calendar';

// Performance Components
export {
  WorkoutCard,
  ClassroomCard,
  Performance,
  PerformanceTimes,
  ClassroomProgressCard,
  ScoreStatistics,
  MetricPoolRender,
  MetricsTime,
  AdvancedScoreStatistics,
} from './components/performance';

// Scheduling Components
export {
  ScheduleInput,
  ScheduleList,
  Schedules,
  ScheduleTypeSelector,
} from './components/scheduling';

// Student Components
export {
  StudentProfile,
} from './components/student';

// Phase 2: Enhanced UI Components
export {
  Alert,
  MenuList,
  MetricPool,
  Stations,
} from './components/ui';

// Phase 3: Academy-Specific Components
export {
  ClassroomGrading,
  MyClassroom,
  CourseProgression,
  ProfileSettingsSection,
  ProfileInfoSection,
  NotificationSection,
  SessionManagementSection,
  PreferencesSupportSection,
  StationProgress,
  GroupedCards,
  StudentCard as AcademyStudentCard,
} from './components/academy';

// Phase 4: Enhanced UI Components
export {
  FilterBar,
  StudentListCard,
  Lessons,
  Badge,
  LoadingSpinner,
  NotificationList,
  BottomSheet,
  BottomSheetProvider,
  useBottomSheet,
  useBottomSheetActions,
  useBottomSheetState,
  useQuickBottomSheet,
} from './components/ui';

// Hooks - Direct exports
export {
  useApiClient,
  useAuth,
  // Newly extracted hooks
  useDebounce,
  useDebouncedCallback,
  useScreenDimensions,
  useLocationPermission,
} from './hooks';

// Services - Direct exports
export {
  apiClient,
  authService,
} from './services';

// Types - Direct exports
export type {
  User,
  AuthState,
  Program,
  ProgramAssignment,
} from './types';

export type {
  CalendarProps,
  CalendarEvent,
  DatePickerProps,
  ClassroomCalendarProps,
  ClassroomEvent,
  StudentProfileCalendarProps,
  StudentEvent,
} from './components/calendar';

// Class exports - must be direct, not type exports
export {
  ApiError,
  AuthError,
} from './types';

// Utils - Direct exports  
export {
  validateEmail,
  validatePassword,
  formatCurrency,
  formatDate,
  formatPhone,
  formatProgress,
  formatName,
  formatFileSize,
  truncateText,
  capitalizeFirst,
  formatInitials,
  isValidEmail,
  isValidPhone,
  isValidPassword,
  validateRequired,
  validateAge,
  validateFileSize,
  validateImageType,
  STORAGE_KEYS,
  API_ENDPOINTS,
  USER_TYPES,
  ENROLLMENT_STATUS,
  PAYMENT_STATUS,
  THEME_COLORS,
  GENDER_OPTIONS,
  AGE_GROUPS,
  SWIMMING_LEVELS,
  PAGINATION,
  FILE_UPLOAD,
  VALIDATION_RULES,
  programAssignmentToProgram,
  programToProgramAssignment,
  hasPermissionInProgram,
  hasRoleInProgram,
  getRoleLevel,
  hasMinimumRoleLevel,
} from './utils';

// Store
export { useAuthStore, authSelectors } from './store/authStore';
export { useNotificationStore, notificationSelectors, useNotifications } from './store/notificationStore';
export type { Notification, NotificationType } from './store/notificationStore';

// Theme - All theme exports
export {
  // Core theme objects
  lightTheme,
  darkTheme,
  defaultTheme,
  
  // Colors
  baseColors,
  semanticColors,
  darkColors,
  colorUtils,
  lightColorScheme,
  darkColorScheme,
  
  // Typography
  fontConfig,
  scaleFont,
  fontSizes,
  lineHeights,
  letterSpacing,
  typography,
  accessibilityText,
  responsiveText,
  typographyUtils,
  
  // Spacing & Layout
  spacing,
  componentSpacing,
  responsiveSpacing,
  borderRadius,
  borderWidth,
  elevation,
  safeArea,
  spacingUtils,
  
  // Theme utilities
  themeUtils,
  componentThemes,
  tokens,
  iconSize,
  
  // Theme Provider hooks (from theme/index.ts re-exports)
  useTheme,
  useThemeColors,
  useThemeSpacing,
  useThemeTypography,
  useThemeMode,
  withTheme,
  createThemedStyles,
  ThemeProvider,
  ThemeModeSelector,
  themeHelpers,
} from './theme';

// Theme types (all types from theme/index.ts re-exports)
export type {
  Theme,
  ThemeMode,
  ComponentThemes,
  Tokens,
  ColorScheme,
  Typography,
  FontConfig,
  FontSizes,
  Spacing,
  ComponentSpacing,
  BorderRadius,
  BorderWidth,
  Elevation,
  BaseColors,
  SemanticColors,
  ExtendedThemeMode,
  ThemeContextValue,
  ThemeProviderProps,
} from './theme';

// Screens - Design System and Component Showcase
export {
  DesignSystemShowcase,
  FormExamplesScreen,
  ComponentLibraryShowcase,
} from './screens';

// Debug Components (for development)
export { ThemeDebugger } from './components/debug/ThemeDebugger';
export { StyleSheetTester } from './components/debug/StyleSheetTester';
export { ThemeSystemValidator } from './components/debug/ThemeSystemValidator';
export { PlatformThemeDiagnostic } from './components/debug/PlatformThemeDiagnostic';
export { ImportDiagnostic } from './components/debug/ImportDiagnostic';