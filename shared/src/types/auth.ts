/**
 * Authentication Types for Academy Management System
 * 
 * This module defines comprehensive TypeScript types for authentication,
 * authorization, and user management across Academy mobile applications.
 * 
 * Backend API Base URL: http://localhost:8000/api/v1
 * JWT Token Expiry: 30 minutes
 * Program Context Header: X-Program-Context
 */

/**
 * Enumeration of all user roles in the Academy Management System
 */
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  PROGRAM_ADMIN = 'program_admin', 
  PROGRAM_COORDINATOR = 'program_coordinator',
  TUTOR = 'tutor',
  STUDENT = 'student',
  PARENT = 'parent'
}

/**
 * User role type union for type safety
 */
export type UserRoleType = keyof typeof UserRole;

/**
 * Program assignment interface representing a user's role within a specific program
 */
export interface ProgramAssignment {
  /** Unique identifier for the program */
  program_id: string;
  /** Display name of the program */
  program_name: string;
  /** User's role within this specific program */
  role: UserRole;
  /** Alternative name for backward compatibility */
  role_in_program?: UserRole;
  /** Whether the assignment is currently active */
  is_active: boolean;
  /** Date when the assignment was created (ISO string) */
  enrolled_at: string;
  /** Alternative name for backward compatibility */
  assigned_at?: string;
  /** Optional date when the assignment expires */
  expires_at?: string;
}

/**
 * Core user interface representing authenticated users in the system
 */
export interface User {
  /** Unique user identifier */
  id: string;
  /** User's email address (used for login) */
  email: string;
  /** User's full display name */
  full_name?: string;
  /** User's first name */
  first_name: string;
  /** User's last name */
  last_name: string;
  /** Optional phone number */
  phone_number?: string;
  /** Primary role of the user (system-wide) */
  role: UserRole;
  /** Whether the user account is active */
  is_active: boolean;
  /** Whether the user's email has been verified */
  is_verified: boolean;
  /** Alternative name for email verification */
  is_email_verified?: boolean;
  /** List of program assignments for this user */
  program_assignments: ProgramAssignment[];
  /** Account creation timestamp */
  created_at: string;
  /** Last account update timestamp */
  updated_at: string;
  /** Optional profile image URL */
  profile_image_url?: string;
  /** User's timezone */
  timezone?: string;
  /** User's preferred language */
  language?: string;
}

/**
 * Login request payload
 */
export interface LoginRequest {
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
  /** Optional program context for login */
  program_id?: string;
}

/**
 * User registration request
 */
export interface RegisterRequest {
  /** User's first name */
  firstName: string;
  /** User's last name */
  lastName: string;
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
  /** User's phone number */
  phone: string;
  /** Optional program context for registration */
  program_id?: string;
}

/**
 * Registration response from the backend
 */
export interface RegisterResponse {
  /** Success status */
  success: boolean;
  /** Success message */
  message: string;
  /** User ID if registration was successful */
  user_id?: string;
}

/**
 * Login response from the backend
 */
export interface LoginResponse {
  /** JWT access token */
  access_token: string;
  /** JWT refresh token */
  refresh_token: string;
  /** Token type (typically "bearer") */
  token_type: string;
  /** Token expiry time in seconds */
  expires_in: number;
  /** Authenticated user information */
  user: User;
  /** Current program context if provided */
  current_program?: Program;
}

/**
 * Current user response (from /auth/me endpoint)
 */
export interface CurrentUserResponse {
  /** Current authenticated user */
  user: User;
  /** Current program context */
  current_program?: Program;
  /** Available programs for the user */
  available_programs: Program[];
}

/**
 * Refresh token request payload
 */
export interface RefreshTokenRequest {
  /** Refresh token */
  refresh_token: string;
}

/**
 * Refresh token response
 */
export interface RefreshTokenResponse {
  /** New JWT access token */
  access_token: string;
  /** New refresh token */
  refresh_token: string;
  /** Token type */
  token_type: string;
  /** Token expiry time in seconds */
  expires_in: number;
}

/**
 * Password reset request payload
 */
export interface PasswordResetRequest {
  /** User's email address */
  email: string;
}

/**
 * Password reset confirmation payload
 */
export interface PasswordResetConfirmRequest {
  /** Password reset token */
  token: string;
  /** New password */
  new_password: string;
  /** Password confirmation */
  confirm_password: string;
}

/**
 * Email verification request payload
 */
export interface EmailVerificationRequest {
  /** Verification token */
  token: string;
}

/**
 * Program information interface
 */
export interface Program {
  /** Unique program identifier */
  id: string;
  /** Program display name */
  name: string;
  /** Program description */
  description?: string;
  /** Organization that owns this program */
  organization_id: string;
  /** Whether the program is active */
  is_active: boolean;
  /** Program creation timestamp */
  created_at: string;
  /** Program last update timestamp */
  updated_at: string;
  /** Program settings and configuration */
  settings?: Record<string, any>;
}

/**
 * Authentication state interface for Zustand store
 */
export interface AuthState {
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Whether authentication is being checked/loaded */
  isLoading: boolean;
  /** Whether app is initializing */
  isInitializing: boolean;
  /** JWT access token */
  accessToken: string | null;
  /** JWT refresh token (stored securely) */
  refreshToken: string | null;
  /** Current authenticated user */
  user: User | null;
  /** Current program context */
  currentProgram: ProgramAssignment | null;
  /** Available programs for the user */
  availablePrograms: ProgramAssignment[];
  /** Last login timestamp */
  lastLoginAt: string | null;
  /** Token expiry timestamp */
  tokenExpiresAt: string | null;
  /** Current error state */
  error: AuthError | null;
}

/**
 * Authentication actions interface for Zustand store
 */
export interface AuthActions {
  /** Login action */
  login: (credentials: LoginRequest) => Promise<void>;
  /** Registration action */
  register: (userData: RegisterRequest) => Promise<boolean>;
  /** Social login action */
  loginWithSocial: (provider: string, token: string, userInfo: any) => Promise<void>;
  /** Logout action */
  logout: () => Promise<void>;
  /** Refresh token action (returns new token) */
  refreshTokenAction: () => Promise<string>;
  /** Refresh user data */
  refreshUser: () => Promise<void>;
  /** Initialize auth from storage */
  initializeAuth: () => Promise<void>;
  /** Switch program context */
  setCurrentProgram: (program: ProgramAssignment) => void;
  /** Update user information */
  updateUser: (user: Partial<User>) => void;
  /** Clear authentication error */
  clearError: () => void;
  /** Get auth headers */
  getAuthHeaders: () => AuthHeaders;
  /** Check if user has role */
  hasRole: (role: UserRole) => boolean;
  /** Check program access */
  hasProgramAccess: (programId: string) => boolean;
  /** Check role allowed in app */
  isRoleAllowedInApp: (appType: 'instructor' | 'student') => boolean;
  /** Development bypass login */
  bypassLogin: (appType?: 'instructor' | 'student') => void;
}

/**
 * Complete authentication store interface
 * Note: Combines state and actions but handles refreshToken property conflict
 */
export interface AuthStore extends Omit<AuthState, 'refreshToken'>, AuthActions {
  /** JWT refresh token (from state) */
  refreshToken: string | null;
  /** Alias for accessing token (legacy compatibility) */
  token: string | null;
}

/**
 * Enhanced API Error class for comprehensive error handling
 */
export class ApiError extends Error {
  /** HTTP status code */
  public readonly status: number;
  /** Error code for programmatic handling */
  public readonly code?: string;
  /** Additional error details from server */
  public readonly details?: Record<string, any>;
  /** Validation errors for form fields */
  public readonly field_errors?: Record<string, string[]>;
  /** Original server response */
  public readonly response?: any;
  /** Whether this is a network error */
  public readonly isNetworkError: boolean;
  /** Whether this is a client error (4xx) */
  public readonly isClientError: boolean;
  /** Whether this is a server error (5xx) */
  public readonly isServerError: boolean;

  constructor(
    status: number,
    message: string,
    code?: string,
    details?: Record<string, any>,
    field_errors?: Record<string, string[]>,
    response?: any
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.field_errors = field_errors;
    this.response = response;
    this.isNetworkError = status === 0;
    this.isClientError = status >= 400 && status < 500;
    this.isServerError = status >= 500;

    // Maintain proper stack trace for where our error was thrown (Node.js only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  /**
   * Create ApiError from axios error response
   */
  static fromResponse(error: any): ApiError {
    const response = error.response;
    const status = response?.status || 0;
    const data = response?.data || {};
    
    // Extract message from various possible locations
    const message = data.message || data.detail || data.error || error.message || 'An error occurred';
    
    return new ApiError(
      status,
      message,
      data.code || data.error_type,
      data.details || data,
      data.field_errors || data.errors,
      response
    );
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(): string {
    switch (this.status) {
      case 400:
        return this.field_errors 
          ? 'Please check the form fields and try again'
          : this.message;
      case 401:
        return 'Authentication required. Please log in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return this.message || 'A conflict occurred. Please try again.';
      case 422:
        return 'Invalid data provided. Please check your input.';
      case 500:
        return 'Server error occurred. Please try again later.';
      case 0:
        return 'Network error. Please check your connection.';
      default:
        return this.message || 'An unexpected error occurred.';
    }
  }

  /**
   * Check if error indicates authentication failure
   */
  isAuthError(): boolean {
    return this.status === 401;
  }

  /**
   * Check if error indicates authorization failure  
   */
  isAuthorizationError(): boolean {
    return this.status === 403;
  }

  /**
   * Check if error has validation field errors
   */
  hasFieldErrors(): boolean {
    return !!this.field_errors && Object.keys(this.field_errors).length > 0;
  }

  /**
   * Get field errors as an array of formatted messages
   */
  getFieldErrorMessages(): string[] {
    if (!this.field_errors) return [];
    
    const messages: string[] = [];
    Object.entries(this.field_errors).forEach(([field, errors]) => {
      if (Array.isArray(errors)) {
        errors.forEach(error => {
          messages.push(`${field}: ${error}`);
        });
      }
    });
    
    return messages;
  }
}

/**
 * Generic API error interface (deprecated - use ApiError class instead)
 * @deprecated Use ApiError class for better error handling
 */
export interface ApiErrorInterface {
  /** Error message */
  message: string;
  /** HTTP status code */
  status: number;
  /** Error code for programmatic handling */
  code?: string;
  /** Additional error details */
  details?: Record<string, any>;
  /** Validation errors for form fields */
  field_errors?: Record<string, string[]>;
}

/**
 * Authentication-specific error class
 */
export class AuthError extends ApiError {
  /** Whether this is a token expiry error */
  public readonly is_token_expired: boolean;
  /** Whether this is an invalid credentials error */
  public readonly is_invalid_credentials: boolean;
  /** Whether this is an account disabled error */
  public readonly is_account_disabled: boolean;
  /** Whether this is an email not verified error */
  public readonly is_email_not_verified: boolean;

  constructor(
    code: string,
    message: string,
    status: number = 0,
    details?: Record<string, any>
  ) {
    super(status, message, code, details);
    this.name = 'AuthError';
    
    this.is_token_expired = code === 'TOKEN_EXPIRED' || status === 401;
    this.is_invalid_credentials = code === 'INVALID_CREDENTIALS';
    this.is_account_disabled = code === 'ACCOUNT_DISABLED';
    this.is_email_not_verified = code === 'EMAIL_NOT_VERIFIED';
  }

  /**
   * Get user-friendly authentication error message
   */
  getUserMessage(): string {
    if (this.is_invalid_credentials) {
      return 'Invalid email or password. Please try again.';
    }
    if (this.is_token_expired) {
      return 'Your session has expired. Please log in again.';
    }
    if (this.is_account_disabled) {
      return 'Your account has been disabled. Please contact support.';
    }
    if (this.is_email_not_verified) {
      return 'Please verify your email address before logging in.';
    }
    return super.getUserMessage();
  }
}

/**
 * Authentication configuration interface
 */
export interface AuthConfig {
  /** API base URL */
  apiBaseUrl: string;
  /** Authentication endpoints */
  endpoints: {
    login: string;
    logout: string;
    refresh: string;
    me: string;
    passwordReset: string;
    passwordResetConfirm: string;
    emailVerify: string;
  };
  /** Storage keys for SecureStore */
  storageKeys: {
    accessToken: string;
    refreshToken: string;
    user: string;
    currentProgram: string;
    lastLoginAt: string;
  };
  /** Token configuration */
  token: {
    /** Token expiry time in milliseconds */
    expiryTime: number;
    /** Time before expiry to refresh token (in milliseconds) */
    refreshThreshold: number;
    /** Token type prefix */
    type: string;
  };
  /** HTTP headers */
  headers: {
    /** Authorization header name */
    authorization: string;
    /** Program context header name */
    programContext: string;
    /** Content type header */
    contentType: string;
  };
}

/**
 * Permission check utility types
 */
export type Permission = 
  | 'manage_users'
  | 'manage_programs' 
  | 'manage_courses'
  | 'view_analytics'
  | 'manage_enrollments'
  | 'view_student_progress'
  | 'manage_attendance'
  | 'schedule_classes'
  | 'grade_assignments'
  | 'communicate_with_parents';

/**
 * Role-based permissions mapping
 */
export interface RolePermissions {
  [UserRole.SUPER_ADMIN]: Permission[];
  [UserRole.PROGRAM_ADMIN]: Permission[];
  [UserRole.PROGRAM_COORDINATOR]: Permission[];
  [UserRole.TUTOR]: Permission[];
  [UserRole.STUDENT]: Permission[];
  [UserRole.PARENT]: Permission[];
}

/**
 * Authentication headers utility type
 */
export interface AuthHeaders {
  /** Authorization header with Bearer token */
  Authorization?: string;
  /** Program context header */
  'X-Program-Context'?: string;
  /** Content type header */
  'Content-Type'?: string;
}

/**
 * Authentication status enumeration
 */
export enum AuthStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
  ERROR = 'error'
}

/**
 * Device information for authentication tracking
 */
export interface DeviceInfo {
  /** Device unique identifier */
  device_id: string;
  /** Device platform (ios/android) */
  platform: 'ios' | 'android';
  /** App version */
  app_version: string;
  /** Device model */
  device_model?: string;
  /** OS version */
  os_version?: string;
  /** Push notification token */
  push_token?: string;
}

/**
 * Extended login request with device information
 */
export interface ExtendedLoginRequest extends LoginRequest {
  /** Device information for tracking */
  device_info?: DeviceInfo;
}

/**
 * Session information interface
 */
export interface SessionInfo {
  /** Session identifier */
  session_id: string;
  /** Device information */
  device_info: DeviceInfo;
  /** Login timestamp */
  logged_in_at: string;
  /** Last activity timestamp */
  last_activity_at: string;
  /** Whether session is active */
  is_active: boolean;
  /** IP address */
  ip_address?: string;
  /** User agent string */
  user_agent?: string;
}

/**
 * Utility type for creating auth headers
 */
export type CreateAuthHeaders = (
  token?: string | null,
  programId?: string | null
) => AuthHeaders;

/**
 * Utility type for token validation
 */
export type TokenValidator = (token: string) => {
  isValid: boolean;
  isExpired: boolean;
  payload: any;
};

/**
 * Authentication hook return type
 */
export interface UseAuthReturn extends AuthState {
  /** Authentication actions */
  actions: AuthActions;
  /** Whether user has specific permission */
  hasPermission: (permission: Permission) => boolean;
  /** Whether user has specific role */
  hasRole: (role: UserRole) => boolean;
  /** Whether user has role in current program */
  hasRoleInProgram: (role: UserRole, programId?: string) => boolean;
  /** Get user's role in specific program */
  getRoleInProgram: (programId: string) => UserRole | null;
}

/**
 * Default authentication configuration
 */
export const DEFAULT_AUTH_CONFIG: AuthConfig = {
  apiBaseUrl: 'http://localhost:8000/api/v1',
  endpoints: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
    passwordReset: '/auth/password-reset',
    passwordResetConfirm: '/auth/password-reset/confirm',
    emailVerify: '/auth/email/verify',
  },
  storageKeys: {
    accessToken: 'academy_access_token',
    refreshToken: 'academy_refresh_token',
    user: 'academy_user',
    currentProgram: 'academy_current_program',
    lastLoginAt: 'academy_last_login_at',
  },
  token: {
    expiryTime: 30 * 60 * 1000, // 30 minutes in milliseconds
    refreshThreshold: 5 * 60 * 1000, // 5 minutes before expiry
    type: 'Bearer',
  },
  headers: {
    authorization: 'Authorization',
    programContext: 'X-Program-Context',
    contentType: 'Content-Type',
  },
};

/**
 * Role hierarchy for permission checking
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.SUPER_ADMIN]: 100,
  [UserRole.PROGRAM_ADMIN]: 80,
  [UserRole.PROGRAM_COORDINATOR]: 60,
  [UserRole.TUTOR]: 40,
  [UserRole.PARENT]: 20,
  [UserRole.STUDENT]: 10,
};

/**
 * Default role permissions mapping
 */
export const DEFAULT_ROLE_PERMISSIONS: RolePermissions = {
  [UserRole.SUPER_ADMIN]: [
    'manage_users',
    'manage_programs',
    'manage_courses',
    'view_analytics',
    'manage_enrollments',
    'view_student_progress',
    'manage_attendance',
    'schedule_classes',
    'grade_assignments',
    'communicate_with_parents',
  ],
  [UserRole.PROGRAM_ADMIN]: [
    'manage_users',
    'manage_courses',
    'view_analytics',
    'manage_enrollments',
    'view_student_progress',
    'manage_attendance',
    'schedule_classes',
    'grade_assignments',
    'communicate_with_parents',
  ],
  [UserRole.PROGRAM_COORDINATOR]: [
    'manage_courses',
    'view_analytics',
    'manage_enrollments',
    'view_student_progress',
    'manage_attendance',
    'schedule_classes',
    'communicate_with_parents',
  ],
  [UserRole.TUTOR]: [
    'view_student_progress',
    'manage_attendance',
    'grade_assignments',
    'communicate_with_parents',
  ],
  [UserRole.STUDENT]: [],
  [UserRole.PARENT]: [],
};

// Re-export commonly used types for convenience
export type { User as AuthUser };
export type { Program as AuthProgram };
export type { ProgramAssignment as UserProgramAssignment };