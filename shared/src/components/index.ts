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
} from './ui';