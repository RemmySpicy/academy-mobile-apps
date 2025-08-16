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
} from './components/program';

// Hooks - Direct exports
export {
  useApiClient,
  useAuth,
  useProgramContext,
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
  AuthError,
  Program,
  ProgramAssignment,
} from './types';

// Utils - Direct exports  
export {
  validateEmail,
  validatePassword,
  formatters,
  constants,
  programUtils,
} from './utils';

// Store
export { useAuthStore, authSelectors } from './store/authStore';
export { useNotificationStore, notificationSelectors, useNotifications } from './store/notificationStore';
export type { Notification, NotificationType } from './store/notificationStore';

// Theme - Direct exports
export {
  lightTheme,
  darkTheme,
  colors,
  spacing,
  typography,
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