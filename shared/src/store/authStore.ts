import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import * as SecureStore from 'expo-secure-store';
import {
  AuthState,
  AuthActions,
  User,
  ProgramAssignment,
  UserRole,
  LoginRequest,
  AuthHeaders,
  AuthError,
  ApiError,
} from '../types/auth';

/**
 * Secure storage keys for authentication data
 */
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'academy_access_token',
  REFRESH_TOKEN: 'academy_refresh_token',
  USER_DATA: 'academy_user_data',
  CURRENT_PROGRAM: 'academy_current_program',
} as const;

/**
 * Authentication configuration
 */
const AUTH_CONFIG = {
  BASE_URL: 'http://localhost:8000/api/v1',
  TOKEN_EXPIRY_MINUTES: 30,
  ENDPOINTS: {
    LOGIN: '/auth/login/json',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
  },
} as const;

/**
 * Enhanced AuthState interface for Zustand store
 */
interface AuthStoreState extends AuthState, AuthActions {
  // Legacy compatibility alias
  token: string | null;
}

/**
 * Create HTTP headers with authentication and program context
 */
const createAuthHeaders = (
  token: string | null, 
  programId: string | null = null
): AuthHeaders => {
  const headers: AuthHeaders = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (programId) {
    headers['X-Program-Context'] = programId;
  }

  return headers;
};

/**
 * Check if SecureStore is properly available
 */
const isSecureStoreAvailable = (): boolean => {
  try {
    // Check if we're on web platform
    if (typeof window !== 'undefined') {
      return false; // Use localStorage fallback on web
    }
    
    return !!(
      SecureStore &&
      typeof SecureStore.getItemAsync === 'function' &&
      typeof SecureStore.setItemAsync === 'function' &&
      typeof SecureStore.deleteItemAsync === 'function'
    );
  } catch (error) {
    console.warn('SecureStore availability check failed:', error);
    return false;
  }
};

/**
 * Secure storage utilities with robust fallback handling
 */
const secureStorage = {
  async setItem(key: string, value: string): Promise<void> {
    if (!isSecureStoreAvailable()) {
      // Use localStorage fallback on web
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          localStorage.setItem(key, value);
        } catch (error) {
          console.error(`Failed to store ${key} in localStorage:`, error);
        }
      } else {
        console.warn('SecureStore not available, skipping storage operation');
      }
      return;
    }

    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error(`Failed to store ${key}:`, error);
      // Don't throw error to prevent app crashes during development
      console.warn('Continuing without secure storage...');
    }
  },

  async getItem(key: string): Promise<string | null> {
    if (!isSecureStoreAvailable()) {
      // Use localStorage fallback on web
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          return localStorage.getItem(key);
        } catch (error) {
          console.error(`Failed to retrieve ${key} from localStorage:`, error);
          return null;
        }
      } else {
        console.warn('SecureStore not available, returning null for', key);
        return null;
      }
    }

    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error(`Failed to retrieve ${key}:`, error);
      return null;
    }
  },

  async removeItem(key: string): Promise<void> {
    if (!isSecureStoreAvailable()) {
      // Use localStorage fallback on web
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.error(`Failed to remove ${key} from localStorage:`, error);
        }
      } else {
        console.warn('SecureStore not available, skipping removal of', key);
      }
      return;
    }

    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`Failed to remove ${key}:`, error);
    }
  },

  async clearAll(): Promise<void> {
    if (!isSecureStoreAvailable()) {
      // Use localStorage fallback on web
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
          });
        } catch (error) {
          console.error('Failed to clear localStorage:', error);
        }
      } else {
        console.warn('SecureStore not available, skipping clear operation');
      }
      return;
    }

    try {
      await Promise.all(
        Object.values(STORAGE_KEYS).map(key => SecureStore.deleteItemAsync(key))
      );
    } catch (error) {
      console.error('Failed to clear secure storage:', error);
    }
  },
};

/**
 * API client utilities
 */
const apiClient = {
  async request<T>(
    endpoint: string, 
    options: RequestInit & { token?: string; programId?: string } = {}
  ): Promise<T> {
    const { token, programId, ...fetchOptions } = options;
    
    const url = `${AUTH_CONFIG.BASE_URL}${endpoint}`;
    const headers = createAuthHeaders(token, programId);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: {
          ...headers,
          ...fetchOptions.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          response.status,
          errorData.detail || `HTTP ${response.status}`,
          errorData.error_type
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new AuthError('NETWORK_ERROR', 'Failed to connect to server');
    }
  },
};

/**
 * Modern Zustand-based authentication store
 */
export const useAuthStore = create<AuthStoreState>()(
  immer((set, get) => ({
    // Initial state
    isAuthenticated: false,
    isLoading: false,
    isInitializing: true,
    accessToken: null,
    token: null, // Legacy compatibility alias
    refreshToken: null,
    user: null,
    error: null,
    currentProgram: null,
    availablePrograms: [],
    lastLoginAt: null,
    tokenExpiresAt: null,

    /**
     * Initialize authentication state from secure storage
     */
    initializeAuth: async () => {
      set((state) => {
        state.isInitializing = true;
        state.error = null;
      });

      try {
        const [token, refreshToken, userData, currentProgramData] = await Promise.all([
          secureStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
          secureStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
          secureStorage.getItem(STORAGE_KEYS.USER_DATA),
          secureStorage.getItem(STORAGE_KEYS.CURRENT_PROGRAM),
        ]);

        if (token && userData) {
          const user: User = JSON.parse(userData);
          const currentProgram: ProgramAssignment | null = currentProgramData 
            ? JSON.parse(currentProgramData) 
            : null;

          // Validate token by fetching current user
          try {
            const freshUser = await apiClient.request<User>(
              AUTH_CONFIG.ENDPOINTS.ME, 
              { token }
            );

            set((state) => {
              state.isAuthenticated = true;
              state.accessToken = token;
              state.token = token; // Legacy compatibility
              state.refreshToken = refreshToken;
              state.user = freshUser;
              state.currentProgram = currentProgram;
              state.availablePrograms = freshUser.program_assignments || [];
              state.isInitializing = false;
              state.lastLoginAt = new Date().toISOString();
              state.tokenExpiresAt = new Date(Date.now() + AUTH_CONFIG.TOKEN_EXPIRY_MINUTES * 60 * 1000).toISOString();
            });
          } catch (error) {
            // Token is invalid, clear storage
            await secureStorage.clearAll();
            set((state) => {
              state.isAuthenticated = false;
              state.accessToken = null;
              state.token = null; // Legacy compatibility
              state.refreshToken = null;
              state.user = null;
              state.currentProgram = null;
              state.availablePrograms = [];
              state.isInitializing = false;
              state.lastLoginAt = null;
              state.tokenExpiresAt = null;
            });
          }
        } else {
          set((state) => {
            state.isInitializing = false;
          });
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        set((state) => {
          state.error = error instanceof AuthError 
            ? error 
            : new AuthError('INITIALIZATION_ERROR', 'Failed to initialize authentication');
          state.isInitializing = false;
        });
      }
    },

    /**
     * Login with email and password
     */
    login: async (credentials: LoginRequest) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const response = await apiClient.request<{
          access_token: string;
          token_type: string;
          user: User;
        }>(AUTH_CONFIG.ENDPOINTS.LOGIN, {
          method: 'POST',
          body: JSON.stringify(credentials),
        });

        const { access_token, user } = response;

        // Store tokens and user data securely
        await Promise.all([
          secureStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token),
          secureStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user)),
        ]);

        // Set default program if user has program assignments
        const defaultProgram = user.program_assignments?.[0] || null;
        if (defaultProgram) {
          await secureStorage.setItem(
            STORAGE_KEYS.CURRENT_PROGRAM, 
            JSON.stringify(defaultProgram)
          );
        }

        set((state) => {
          state.isAuthenticated = true;
          state.isLoading = false;
          state.accessToken = access_token;
          state.token = access_token; // Legacy compatibility
          state.user = user;
          state.currentProgram = defaultProgram;
          state.availablePrograms = user.program_assignments || [];
          state.error = null;
          state.lastLoginAt = new Date().toISOString();
          state.tokenExpiresAt = new Date(Date.now() + AUTH_CONFIG.TOKEN_EXPIRY_MINUTES * 60 * 1000).toISOString();
        });
      } catch (error) {
        set((state) => {
          state.isLoading = false;
          state.error = error instanceof AuthError
            ? error
            : error instanceof ApiError
            ? new AuthError('LOGIN_ERROR', error.message, error.status)
            : new AuthError('LOGIN_ERROR', 'Login failed');
        });
        throw error;
      }
    },

    /**
     * Login with social auth provider
     */
    loginWithSocial: async (provider: string, token: string, userInfo: any) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        // For now, simulate social login by creating a mock user
        // In a real app, you'd send the social token to your backend
        const mockUser: User = {
          id: `social_${Date.now()}`,
          email: userInfo.email || `${provider}@example.com`,
          first_name: userInfo.firstName || userInfo.name?.split(' ')[0] || 'Social',
          last_name: userInfo.lastName || userInfo.name?.split(' ')[1] || 'User',
          role: UserRole.STUDENT,
          is_active: true,
          is_verified: true,
          program_assignments: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const mockToken = `social_token_${Date.now()}`;

        // Store tokens and user data securely
        await Promise.all([
          secureStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, mockToken),
          secureStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(mockUser)),
        ]);

        set((state) => {
          state.isAuthenticated = true;
          state.isLoading = false;
          state.accessToken = mockToken;
          state.token = mockToken; // Legacy compatibility
          state.user = mockUser;
          state.currentProgram = null;
          state.availablePrograms = [];
          state.error = null;
          state.lastLoginAt = new Date().toISOString();
          state.tokenExpiresAt = new Date(Date.now() + AUTH_CONFIG.TOKEN_EXPIRY_MINUTES * 60 * 1000).toISOString();
        });
      } catch (error) {
        set((state) => {
          state.isLoading = false;
          state.error = error instanceof AuthError
            ? error
            : error instanceof ApiError
            ? new AuthError('SOCIAL_LOGIN_ERROR', error.message, error.status)
            : new AuthError('SOCIAL_LOGIN_ERROR', 'Social login failed');
        });
        throw error;
      }
    },

    /**
     * Logout and clear all authentication data
     */
    logout: async () => {
      set((state) => {
        state.isLoading = true;
      });

      try {
        const { accessToken } = get();
        
        // Attempt server logout (don't fail if this fails)
        if (accessToken) {
          try {
            await apiClient.request(AUTH_CONFIG.ENDPOINTS.LOGOUT, {
              method: 'POST',
              token: accessToken,
            });
          } catch (error) {
            console.warn('Server logout failed:', error);
          }
        }

        // Clear all secure storage
        await secureStorage.clearAll();

        set((state) => {
          state.isAuthenticated = false;
          state.isLoading = false;
          state.accessToken = null;
          state.token = null; // Legacy compatibility
          state.refreshToken = null;
          state.user = null;
          state.currentProgram = null;
          state.availablePrograms = [];
          state.error = null;
          state.lastLoginAt = null;
          state.tokenExpiresAt = null;
        });
      } catch (error) {
        // Force logout even if server call fails
        await secureStorage.clearAll();
        
        set((state) => {
          state.isAuthenticated = false;
          state.isLoading = false;
          state.accessToken = null;
          state.token = null; // Legacy compatibility
          state.refreshToken = null;
          state.user = null;
          state.currentProgram = null;
          state.availablePrograms = [];
          state.error = error instanceof AuthError
            ? error
            : new AuthError('LOGOUT_ERROR', 'Logout failed');
          state.lastLoginAt = null;
          state.tokenExpiresAt = null;
        });
      }
    },

    /**
     * Refresh current user data
     */
    refreshUser: async () => {
      const { accessToken } = get();
      if (!accessToken) {
        throw new AuthError('NO_TOKEN', 'No authentication token available');
      }

      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const user = await apiClient.request<User>(
          AUTH_CONFIG.ENDPOINTS.ME, 
          { token: accessToken }
        );

        await secureStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));

        set((state) => {
          state.user = user;
          state.availablePrograms = user.program_assignments || [];
          state.isLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.isLoading = false;
          state.error = error instanceof AuthError
            ? error
            : error instanceof ApiError
            ? new AuthError('REFRESH_ERROR', error.message, error.status)
            : new AuthError('REFRESH_ERROR', 'Failed to refresh user data');
        });

        // If refresh fails with 401, logout user
        if (error instanceof ApiError && error.status === 401) {
          const authStore = get();
          await authStore.logout();
        }

        throw error;
      }
    },

    /**
     * Refresh token action (alias for refreshUser)
     */
    refreshTokenAction: async (): Promise<string> => {
      const { accessToken } = get();
      if (!accessToken) {
        throw new AuthError('NO_TOKEN', 'No authentication token available');
      }
      
      // In a real implementation, this would call a refresh token endpoint
      // For now, we'll just return the current token
      return accessToken;
    },

    /**
     * Update user information
     */
    updateUser: (userData: Partial<User>) => {
      set((state) => {
        if (state.user) {
          state.user = { ...state.user, ...userData };
        }
      });
    },

    /**
     * Set current program context
     */
    setCurrentProgram: (program: ProgramAssignment) => {
      set((state) => {
        state.currentProgram = program;
      });

      // Persist program selection
      secureStorage.setItem(
        STORAGE_KEYS.CURRENT_PROGRAM, 
        JSON.stringify(program)
      ).catch(error => {
        console.error('Failed to persist program selection:', error);
      });
    },

    /**
     * Clear current error
     */
    clearError: () => {
      set((state) => {
        state.error = null;
      });
    },

    /**
     * Get authentication headers for API requests
     */
    getAuthHeaders: (): AuthHeaders => {
      const { accessToken, currentProgram } = get();
      return createAuthHeaders(accessToken, currentProgram?.program_id || null);
    },

    /**
     * Check if user has specific role
     */
    hasRole: (role: UserRole): boolean => {
      const { user } = get();
      return user?.role === role;
    },

    /**
     * Check if user has access to specific program
     */
    hasProgramAccess: (programId: string): boolean => {
      const { availablePrograms } = get();
      return availablePrograms.some(
        (program) => program.program_id === programId && program.is_active
      );
    },

    /**
     * Check if user's role is allowed in specific app type
     */
    isRoleAllowedInApp: (appType: 'instructor' | 'student'): boolean => {
      const { user } = get();
      if (!user) return false;

      const instructorRoles: UserRole[] = [
        UserRole.TUTOR,
        UserRole.PROGRAM_COORDINATOR,
        UserRole.PROGRAM_ADMIN,
        UserRole.SUPER_ADMIN,
      ];

      const studentRoles: UserRole[] = [
        UserRole.STUDENT,
        UserRole.PARENT,
      ];

      return appType === 'instructor' 
        ? instructorRoles.includes(user.role)
        : studentRoles.includes(user.role);
    },

    /**
     * Bypass login for development/testing (creates mock authenticated state)
     * Automatically creates the appropriate user role based on app context
     */
    bypassLogin: (appType?: 'instructor' | 'student') => {
      // Detect app type from environment or use default
      const defaultAppType = appType || 
        (typeof window !== 'undefined' && window.location?.pathname?.includes('instructor')) ? 'instructor' : 'student';
      
      const isInstructorApp = defaultAppType === 'instructor';
      
      const mockUser: User = {
        id: `dev_user_${isInstructorApp ? 'instructor' : 'student'}_123`,
        email: `dev.${isInstructorApp ? 'instructor' : 'student'}@academy.com`,
        first_name: isInstructorApp ? 'Dev' : 'Student',
        last_name: isInstructorApp ? 'Instructor' : 'User',
        role: isInstructorApp ? UserRole.TUTOR : UserRole.STUDENT,
        is_active: true,
        is_verified: true,
        program_assignments: [{
          program_id: 'dev_program_1',
          program_name: 'Development Swimming Program',
          role: isInstructorApp ? UserRole.TUTOR : UserRole.STUDENT,
          is_active: true,
          enrolled_at: new Date().toISOString(),
        }],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const mockToken = 'dev_token_bypass';

      set((state) => {
        state.isAuthenticated = true;
        state.accessToken = mockToken;
        state.token = mockToken; // Legacy compatibility
        state.user = mockUser;
        state.currentProgram = mockUser.program_assignments[0];
        state.availablePrograms = mockUser.program_assignments;
        state.error = null;
        state.isLoading = false;
        state.isInitializing = false;
        state.lastLoginAt = new Date().toISOString();
        state.tokenExpiresAt = new Date(Date.now() + AUTH_CONFIG.TOKEN_EXPIRY_MINUTES * 60 * 1000).toISOString();
      });
    },
  }))
);

/**
 * Authentication store selectors for optimized re-renders
 */
export const authSelectors = {
  isAuthenticated: (state: AuthStoreState) => state.isAuthenticated,
  isLoading: (state: AuthStoreState) => state.isLoading,
  isInitializing: (state: AuthStoreState) => state.isInitializing,
  user: (state: AuthStoreState) => state.user,
  currentProgram: (state: AuthStoreState) => state.currentProgram,
  availablePrograms: (state: AuthStoreState) => state.availablePrograms,
  error: (state: AuthStoreState) => state.error,
  authHeaders: (state: AuthStoreState) => createAuthHeaders(state.accessToken, state.currentProgram?.program_id || null),
};

export default useAuthStore;