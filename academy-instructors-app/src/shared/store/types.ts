import type { User, Program } from '@shared/types';

// Auth Store Types
export interface AuthState {
  // Auth state
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  
  // Program context
  currentProgram: Program | null;
  availablePrograms: Program[];
  
  // Loading states
  isLoading: boolean;
  isRefreshing: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<boolean>;
  switchProgram: (programId: string) => Promise<void>;
  updateUser: (user: User) => void;
  setPrograms: (programs: Program[]) => void;
  
  // Hydration
  hydrate: () => Promise<void>;
}

// App Store Types
export interface AppState {
  // App state
  isFirstLaunch: boolean;
  hasCompletedOnboarding: boolean;
  theme: 'light' | 'dark' | 'system';
  
  // Network state
  isOnline: boolean;
  lastSyncTime: Date | null;
  
  // UI state
  activeTab: string;
  isTabBarVisible: boolean;
  
  // Notifications
  notificationPermission: 'granted' | 'denied' | 'undetermined';
  pushToken: string | null;
  
  // Actions
  setFirstLaunch: (value: boolean) => void;
  setOnboardingCompleted: (value: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setOnlineStatus: (isOnline: boolean) => void;
  setLastSyncTime: (time: Date) => void;
  setActiveTab: (tab: string) => void;
  setTabBarVisible: (visible: boolean) => void;
  setNotificationPermission: (permission: 'granted' | 'denied' | 'undetermined') => void;
  setPushToken: (token: string | null) => void;
  
  // Hydration
  hydrate: () => Promise<void>;
}

// Cache Store Types
export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  expiresAt: number;
  key: string;
}

export interface CacheState {
  // Cache storage
  cache: Map<string, CacheEntry>;
  
  // Cache configuration
  defaultTTL: number; // Time to live in milliseconds
  maxSize: number;    // Maximum number of entries
  
  // Actions
  set: <T>(key: string, data: T, ttl?: number) => void;
  get: <T>(key: string) => T | null;
  has: (key: string) => boolean;
  delete: (key: string) => void;
  clear: () => void;
  cleanup: () => void; // Remove expired entries
  
  // Bulk operations
  setMany: <T>(entries: Array<{ key: string; data: T; ttl?: number }>) => void;
  getMany: <T>(keys: string[]) => Array<{ key: string; data: T | null }>;
  deleteMany: (keys: string[]) => void;
  
  // Cache statistics
  getStats: () => {
    size: number;
    hitRate: number;
    missRate: number;
    totalRequests: number;
  };
}

// Combined Store Type (for devtools)
export interface RootState {
  auth: AuthState;
  app: AppState;
  cache: CacheState;
}