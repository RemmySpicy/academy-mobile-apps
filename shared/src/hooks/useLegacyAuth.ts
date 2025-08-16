import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../services/authService';
import { User, AuthState } from '../types';

const TOKEN_KEY = 'academy_auth_token';

interface UseAuthReturn {
  authState: AuthState;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Record<string, any>) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  refreshAuth: () => Promise<boolean>;
}

export default function useAuth(): UseAuthReturn {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    token: null,
    user: null,
    currentProgram: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from storage
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async (): Promise<void> => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      
      if (token) {
        // Try to get current user to validate token
        const user = await authService.getCurrentUser();
        setAuthState({
          isAuthenticated: true,
          token,
          user,
          currentProgram: null, // Will be set by program context hook
        });
      }
    } catch (error) {
      console.warn('Failed to initialize auth:', error);
      // Clear invalid token
      await AsyncStorage.removeItem(TOKEN_KEY);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.login({ email, password });
      
      setAuthState({
        isAuthenticated: true,
        token: response.access_token,
        user: response.user,
        currentProgram: null,
      });
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (userData: Record<string, any>): Promise<boolean> => {
    try {
      setIsLoading(true);
      await authService.register(userData);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      await authService.logout();
      setAuthState({
        isAuthenticated: false,
        token: null,
        user: null,
        currentProgram: null,
      });
    } catch (error) {
      console.error('Logout failed:', error);
      // Force local logout even if server fails
      setAuthState({
        isAuthenticated: false,
        token: null,
        user: null,
        currentProgram: null,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUser = useCallback((user: User): void => {
    setAuthState(prev => ({
      ...prev,
      user,
    }));
  }, []);

  const refreshAuth = useCallback(async (): Promise<boolean> => {
    try {
      const user = await authService.getCurrentUser();
      updateUser(user);
      return true;
    } catch (error) {
      console.error('Auth refresh failed:', error);
      await logout();
      return false;
    }
  }, [logout, updateUser]);

  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(() => ({
    authState,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    refreshAuth,
  }), [authState, isLoading, login, register, logout, updateUser, refreshAuth]);
}