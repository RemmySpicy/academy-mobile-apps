import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Network from 'expo-network';
import type { AppState } from './types';

/**
 * Application Store
 * 
 * Manages global application state, settings, and UI state.
 * Handles network connectivity, theme preferences, and onboarding state.
 * 
 * Features:
 * - Theme management with system preference detection
 * - Network connectivity monitoring
 * - Onboarding and first-launch tracking
 * - Tab navigation state management
 * - Push notification preferences
 * - Offline sync timing
 */
export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        isFirstLaunch: true,
        hasCompletedOnboarding: false,
        theme: 'system',
        isOnline: true,
        lastSyncTime: null,
        activeTab: 'home',
        isTabBarVisible: true,
        notificationPermission: 'undetermined',
        pushToken: null,

        // First launch management
        setFirstLaunch: (value: boolean): void => {
          set({ isFirstLaunch: value });
        },

        // Onboarding completion
        setOnboardingCompleted: (value: boolean): void => {
          set({ hasCompletedOnboarding: value });
          
          // Automatically mark as not first launch when onboarding is completed
          if (value) {
            set({ isFirstLaunch: false });
          }
        },

        // Theme management
        setTheme: (theme: 'light' | 'dark' | 'system'): void => {
          set({ theme });
        },

        // Network connectivity management
        setOnlineStatus: (isOnline: boolean): void => {
          const wasOffline = !get().isOnline;
          set({ isOnline });
          
          // If coming back online, update sync time
          if (isOnline && wasOffline) {
            set({ lastSyncTime: new Date() });
          }
        },

        // Sync time management
        setLastSyncTime: (time: Date): void => {
          set({ lastSyncTime: time });
        },

        // Tab navigation state
        setActiveTab: (tab: string): void => {
          set({ activeTab: tab });
        },

        // Tab bar visibility (useful for modal screens)
        setTabBarVisible: (visible: boolean): void => {
          set({ isTabBarVisible: visible });
        },

        // Notification permission management
        setNotificationPermission: (permission: 'granted' | 'denied' | 'undetermined'): void => {
          set({ notificationPermission: permission });
        },

        // Push token management
        setPushToken: (token: string | null): void => {
          set({ pushToken: token });
        },

        // Initialize network monitoring
        initializeNetworkMonitoring: (): void => {
          // Check initial network state
          Network.getNetworkStateAsync().then((networkState) => {
            get().setOnlineStatus(networkState.isConnected ?? true);
          });

          // Note: In a real app, you'd set up a network state listener here
          // For now, we'll rely on manual updates or periodic checks
        },

        // Hydrate store on app startup
        hydrate: async (): Promise<void> => {
          // Initialize network monitoring
          get().initializeNetworkMonitoring();
          
          // Check if this is truly the first launch
          const { isFirstLaunch, hasCompletedOnboarding } = get();
          
          // If onboarding is completed but still marked as first launch, fix it
          if (hasCompletedOnboarding && isFirstLaunch) {
            set({ isFirstLaunch: false });
          }
        },
      }),
      {
        name: 'academy-instructors-app',
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({
          // Persist all state except runtime-only values
          isFirstLaunch: state.isFirstLaunch,
          hasCompletedOnboarding: state.hasCompletedOnboarding,
          theme: state.theme,
          lastSyncTime: state.lastSyncTime,
          notificationPermission: state.notificationPermission,
          pushToken: state.pushToken,
        }),
        version: 1,
      }
    ),
    {
      name: 'AppStore',
      enabled: __DEV__,
    }
  )
);