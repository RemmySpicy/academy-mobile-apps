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