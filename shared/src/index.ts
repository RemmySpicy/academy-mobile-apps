// Components - Direct exports to avoid property descriptor conflicts
export {
  Form,
  CustomInput,
  CustomButton,
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

// Hooks - Direct exports
export {
  useApiClient,
  useAuth,
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

// Theme - Direct exports
export {
  lightTheme,
  darkTheme,
  baseColors,
  semanticColors,
  darkColors,
  colorUtils,
  lightColorScheme,
  darkColorScheme,
  spacing,
  componentSpacing,
  responsiveSpacing,
  borderRadius,
  borderWidth,
  elevation,
  safeArea,
  spacingUtils,
  fontConfig,
  scaleFont,
  fontSizes,
  lineHeights,
  letterSpacing,
  typography,
  accessibilityText,
  responsiveText,
  typographyUtils,
} from './theme';

export { 
  ThemeProvider, 
  useTheme, 
  useThemeColors, 
  useThemeSpacing, 
  useThemeTypography,
  useThemeMode,
  withTheme,
  createThemedStyles,
} from './theme/ThemeProvider';

// Screens - Design System and Component Showcase
export {
  DesignSystemShowcase,
  FormExamplesScreen,
} from './screens';