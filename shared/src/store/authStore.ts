import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import * as SecureStore from 'expo-secure-store';
import {
  AuthState,
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
interface AuthStoreState extends Omit<AuthState, 'program_assignments'> {
  // Core auth state
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  error: AuthError | null;

  // Program context
  currentProgram: ProgramAssignment | null;
  availablePrograms: ProgramAssignment[];

  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setCurrentProgram: (program: ProgramAssignment) => void;
  clearError: () => void;
  initializeAuth: () => Promise<void>;

  // Utilities
  getAuthHeaders: () => AuthHeaders;
  hasRole: (role: UserRole) => boolean;
  hasProgramAccess: (programId: string) => boolean;
  isRoleAllowedInApp: (appType: 'instructor' | 'student') => boolean;
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
 * Secure storage utilities
 */
const secureStorage = {
  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error(`Failed to store ${key}:`, error);
      throw new AuthError('STORAGE_ERROR', 'Failed to store authentication data');
    }
  },

  async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error(`Failed to retrieve ${key}:`, error);
      return null;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`Failed to remove ${key}:`, error);
    }
  },

  async clearAll(): Promise<void> {
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
    token: null,
    refreshToken: null,
    user: null,
    error: null,
    currentProgram: null,
    availablePrograms: [],

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
              state.token = token;
              state.refreshToken = refreshToken;
              state.user = freshUser;
              state.currentProgram = currentProgram;
              state.availablePrograms = freshUser.program_assignments || [];
              state.isInitializing = false;
            });
          } catch (error) {
            // Token is invalid, clear storage
            await secureStorage.clearAll();
            set((state) => {
              state.isAuthenticated = false;
              state.token = null;
              state.refreshToken = null;
              state.user = null;
              state.currentProgram = null;
              state.availablePrograms = [];
              state.isInitializing = false;
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
          state.token = access_token;
          state.user = user;
          state.currentProgram = defaultProgram;
          state.availablePrograms = user.program_assignments || [];
          state.error = null;
        });
      } catch (error) {
        set((state) => {
          state.isLoading = false;
          state.error = error instanceof AuthError || error instanceof ApiError
            ? error
            : new AuthError('LOGIN_ERROR', 'Login failed');
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
        const { token } = get();
        
        // Attempt server logout (don't fail if this fails)
        if (token) {
          try {
            await apiClient.request(AUTH_CONFIG.ENDPOINTS.LOGOUT, {
              method: 'POST',
              token,
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
          state.token = null;
          state.refreshToken = null;
          state.user = null;
          state.currentProgram = null;
          state.availablePrograms = [];
          state.error = null;
        });
      } catch (error) {
        // Force logout even if server call fails
        await secureStorage.clearAll();
        
        set((state) => {
          state.isAuthenticated = false;
          state.isLoading = false;
          state.token = null;
          state.refreshToken = null;
          state.user = null;
          state.currentProgram = null;
          state.availablePrograms = [];
          state.error = error instanceof AuthError
            ? error
            : new AuthError('LOGOUT_ERROR', 'Logout failed');
        });
      }
    },

    /**
     * Refresh current user data
     */
    refreshUser: async () => {
      const { token } = get();
      if (!token) {
        throw new AuthError('NO_TOKEN', 'No authentication token available');
      }

      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const user = await apiClient.request<User>(
          AUTH_CONFIG.ENDPOINTS.ME, 
          { token }
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
          state.error = error instanceof AuthError || error instanceof ApiError
            ? error
            : new AuthError('REFRESH_ERROR', 'Failed to refresh user data');
        });

        // If refresh fails with 401, logout user
        if (error instanceof ApiError && error.status === 401) {
          await get().logout();
        }

        throw error;
      }
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
      const { token, currentProgram } = get();
      return createAuthHeaders(token, currentProgram?.program_id || null);
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
  authHeaders: (state: AuthStoreState) => state.getAuthHeaders(),
};

export default useAuthStore;