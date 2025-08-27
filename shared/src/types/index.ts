// Core Academy Types
// Authentication types are now in ./auth.ts - import from there for auth-related types

// User interface is now defined in ./auth.ts - re-export for compatibility
export type { User } from './auth';

export interface Program {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  organization_id: string;
  created_at: string;
  updated_at: string;
}

// Enhanced program context that includes user's role in the program
export interface ProgramContext extends Program {
  user_role?: string; // User's role in this program
  permissions?: string[]; // User's permissions in this program
}

// AuthState is now defined in ./auth.ts - re-export for compatibility  
export type { AuthState } from './auth';

// Re-export authentication types for convenience - Direct exports
export {
  UserRole,
  ApiError,
  AuthError,
  AuthStatus,
  DEFAULT_AUTH_CONFIG,
  ROLE_HIERARCHY,
  DEFAULT_ROLE_PERMISSIONS,
} from './auth';

export type {
  UserRoleType,
  ProgramAssignment,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  LoginResponse,
  CurrentUserResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  PasswordResetRequest,
  PasswordResetConfirmRequest,
  EmailVerificationRequest,
  AuthActions,
  AuthStore,
  ApiErrorInterface,
  AuthConfig,
  Permission,
  RolePermissions,
  AuthHeaders,
  DeviceInfo,
  ExtendedLoginRequest,
  SessionInfo,
  CreateAuthHeaders,
  TokenValidator,
  UseAuthReturn,
  AuthUser,
  AuthProgram,
  UserProgramAssignment,
} from './auth';

// API response interface for legacy compatibility
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

// Form Types
export interface FormFieldProps {
  name: string;
  control?: any; // React Hook Form control object - properly typed in components
  rules?: any; // React Hook Form validation rules - properly typed in components
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

// Program Context Types
export interface ProgramContextValue {
  currentProgram: ProgramContext | null;
  availablePrograms: ProgramContext[];
  switchProgram: (programId: string) => Promise<void>;
  isLoading: boolean;
  refreshPrograms: () => Promise<void>;
  error: string | null;
}

// Course Types
export interface Course {
  id: string;
  name: string;
  description?: string;
  program_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Enrollment Types
export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  status: 'active' | 'completed' | 'cancelled' | 'pending';
  enrollment_date: string;
  completion_date?: string;
  progress_percentage: number;
}

export type { Program as AcademyProgram };
export type { Course as AcademyCourse };
export type { Enrollment as CourseEnrollment };