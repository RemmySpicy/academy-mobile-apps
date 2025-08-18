// Components - Direct exports to avoid property descriptor conflicts
export {
  Form,
  CustomButton, // Primary button component for Academy apps
  CustomInput,
  CustomDropdown,
  CustomTextArea,
  CustomCheckBox,
  RadioButton,
  SingleRadioButton,
  OtpField,
  QuantityController,
} from './components/forms';

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
  // Newly extracted UI components
  ToggleCard,
  EmptySearchResult,
  SelectOptions,
  HeaderComponent,
  ControlCard,
  FilterComponent,
  OptionMenu,
  TimesTab,
  StrokeTab,
  CustomModalWithDot,
} from './components/ui';

export {
  SocialAuthButton,
  GoogleSignInButton,
  AppleSignInButton,
  FacebookSignInButton,
  SocialAuthGroup,
  SocialAuthButtons,
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
  FilterChip,
  QuickFilterBar,
  SearchBar,
  SimpleSearchBar,
  useQuickFilters,
} from './components/search';

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
} from './components/performance';

// Scheduling Components
export {
  ScheduleInput,
  ScheduleList,
  Schedules,
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
} from './components/academy';

// Phase 4: Enhanced UI Components
export {
  Button,
  FilterBar,
  StudentListCard,
  Lessons,
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
  ExtractedComponentsShowcase,
} from './screens';