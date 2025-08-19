// Authentication Components

export {
  default as SocialAuthButton,
  GoogleSignInButton,
  AppleSignInButton,
  FacebookSignInButton,
  SocialAuthGroup,
  SocialAuthGroup as SocialAuthButtons, // Alias for backward compatibility
} from './SocialAuthButtons';
export { default as GuestLoginButton } from './GuestLoginButton';
export { LoginForm } from './LoginForm';
export { default as OnboardingModal } from './OnboardingModal';
export type {
  SocialAuthButtonProps,
  SocialAuthConfig,
  SocialAuthGroupProps,
} from './SocialAuthButtons';
export type { GuestLoginButtonProps } from './GuestLoginButton';
export type { OnboardingModalProps } from './OnboardingModal';