import { use, useMemo, useOptimistic, useTransition } from 'react';
import { useAuthStore, authSelectors } from '../store/authStore';
import { LoginRequest, User } from '../types';

interface UseAuthReturn {
  // Auth state
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  user: User | null;
  error: string | null;
  
  // Optimistic state
  optimisticUser: User | null;
  
  // Actions with transition support
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateUserOptimistic: (updates: Partial<User>) => void;
  
  // Transition states
  isPending: boolean;
  startTransition: (callback: () => void) => void;
}

export function useAuth(): UseAuthReturn {
  const [isPending, startTransition] = useTransition();
  
  // Subscribe to auth store with selectors for optimal re-renders
  const isAuthenticated = useAuthStore(authSelectors.isAuthenticated);
  const isLoading = useAuthStore(authSelectors.isLoading);
  const isInitializing = useAuthStore(authSelectors.isInitializing);
  const user = useAuthStore(authSelectors.user);
  const error = useAuthStore(authSelectors.error);
  
  // Actions from store
  const { login: storeLogin, logout: storeLogout } = useAuthStore();
  
  // Optimistic updates for user data
  const [optimisticUser, updateOptimisticUser] = useOptimistic(
    user,
    (currentUser: User | null, updates: Partial<User>) => {
      if (!currentUser) return null;
      return { ...currentUser, ...updates };
    }
  );
  
  // Enhanced login with transition
  const login = useMemo(() => async (credentials: LoginRequest) => {
    startTransition(() => {
      storeLogin(credentials);
    });
  }, [storeLogin, startTransition]);
  
  // Enhanced logout with transition
  const logout = useMemo(() => async () => {
    startTransition(() => {
      storeLogout();
    });
  }, [storeLogout, startTransition]);
  
  // Optimistic user updates
  const updateUserOptimistic = useMemo(() => (updates: Partial<User>) => {
    updateOptimisticUser(updates);
  }, [updateOptimisticUser]);
  
  return useMemo(() => ({
    isAuthenticated,
    isLoading,
    isInitializing,
    user,
    optimisticUser,
    error: error?.message || null,
    login,
    logout,
    updateUserOptimistic,
    isPending,
    startTransition,
  }), [
    isAuthenticated,
    isLoading,
    isInitializing,
    user,
    optimisticUser,
    error,
    login,
    logout,
    updateUserOptimistic,
    isPending,
    startTransition,
  ]);
}

export default useAuth;