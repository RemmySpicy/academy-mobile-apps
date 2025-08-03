import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService, apiClient } from '@shared/services';
import type { User, Program } from '@shared/types';
import type { AuthState } from './types';

/**
 * Authentication Store
 * 
 * Manages user authentication state, program context, and session persistence.
 * Uses zustand with AsyncStorage persistence for offline capabilities.
 * 
 * Features:
 * - JWT token management with automatic refresh
 * - Program context switching for multi-program users
 * - Secure token storage with AsyncStorage
 * - Optimistic updates with rollback on failure
 * - Comprehensive error handling
 */
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        isAuthenticated: false,
        token: null,
        user: null,
        currentProgram: null,
        availablePrograms: [],
        isLoading: false,
        isRefreshing: false,

        // Login action with comprehensive error handling
        login: async (email: string, password: string): Promise<boolean> => {
          set({ isLoading: true });
          
          try {
            const response = await authService.login({ email, password });
            
            // Update auth state
            set({
              isAuthenticated: true,
              token: response.access_token,
              user: response.user,
              isLoading: false,
            });

            // Load user's programs after successful login
            await get().loadUserPrograms();
            
            return true;
          } catch (error) {
            console.error('Login failed:', error);
            set({
              isAuthenticated: false,
              token: null,
              user: null,
              currentProgram: null,
              availablePrograms: [],
              isLoading: false,
            });
            return false;
          }
        },

        // Logout with cleanup
        logout: async (): Promise<void> => {
          set({ isLoading: true });
          
          try {
            await authService.logout();
          } catch (error) {
            console.warn('Server logout failed, continuing with local logout:', error);
          } finally {
            // Always clear local state
            set({
              isAuthenticated: false,
              token: null,
              user: null,
              currentProgram: null,
              availablePrograms: [],
              isLoading: false,
            });
          }
        },

        // Refresh authentication state
        refreshAuth: async (): Promise<boolean> => {
          const { token } = get();
          
          if (!token) {
            return false;
          }

          set({ isRefreshing: true });
          
          try {
            const user = await authService.getCurrentUser();
            set({ user, isRefreshing: false });
            return true;
          } catch (error) {
            console.error('Auth refresh failed:', error);
            // Don't logout automatically - might be temporary network issue
            set({ isRefreshing: false });
            return false;
          }
        },

        // Switch program context
        switchProgram: async (programId: string): Promise<void> => {
          const { availablePrograms } = get();
          const program = availablePrograms.find(p => p.id === programId);
          
          if (!program) {
            throw new Error('Program not found in available programs');
          }

          // Optimistic update
          const previousProgram = get().currentProgram;
          set({ currentProgram: program });

          try {
            await apiClient.setProgramContext(programId);
          } catch (error) {
            // Rollback on failure
            set({ currentProgram: previousProgram });
            throw error;
          }
        },

        // Update user profile
        updateUser: (user: User): void => {
          set({ user });
        },

        // Set available programs
        setPrograms: (programs: Program[]): void => {
          set({ availablePrograms: programs });
          
          // Auto-select first program if none selected
          const { currentProgram } = get();
          if (!currentProgram && programs.length > 0) {
            get().switchProgram(programs[0]!.id);
          }
        },

        // Load user's programs
        loadUserPrograms: async (): Promise<void> => {
          try {
            const programs = await apiClient.get<Program[]>('/programs/my-programs');
            get().setPrograms(programs);
          } catch (error) {
            console.error('Failed to load user programs:', error);
          }
        },

        // Hydrate store on app startup
        hydrate: async (): Promise<void> => {
          const { token, user } = get();
          
          if (token && user) {
            set({ isAuthenticated: true });
            
            // Verify token is still valid
            const isValid = await get().refreshAuth();
            if (isValid) {
              await get().loadUserPrograms();
            } else {
              // Token invalid, logout
              await get().logout();
            }
          }
        },
      }),
      {
        name: 'academy-instructors-auth',
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({
          // Only persist essential auth data
          token: state.token,
          user: state.user,
          currentProgram: state.currentProgram,
          availablePrograms: state.availablePrograms,
        }),
        version: 1,
      }
    ),
    {
      name: 'AuthStore',
      enabled: __DEV__, // Only enable devtools in development
    }
  )
);