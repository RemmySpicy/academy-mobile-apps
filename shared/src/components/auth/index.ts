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
export type {
  SocialAuthButtonProps,
  SocialAuthConfig,
  SocialAuthGroupProps,
} from './SocialAuthButtons';
export type { GuestLoginButtonProps } from './GuestLoginButton';