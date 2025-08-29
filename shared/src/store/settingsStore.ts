import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { immer } from 'zustand/middleware/immer';

// App Settings
export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'es' | 'fr';
  fontSize: 'small' | 'medium' | 'large';
  animations: boolean;
  hapticFeedback: boolean;
  soundEffects: boolean;
}

// Notification Settings
export interface NotificationSettings {
  pushNotifications: boolean;
  bookingUpdates: boolean;
  achievements: boolean;
  paymentNotifications: boolean;
  weeklyEmailSummary: boolean;
  marketingEmails: boolean;
  sessionReminders: boolean;
  emergencyAlerts: boolean;
  smsConfirmations: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string; // HH:MM format
  quietHoursEnd: string; // HH:MM format
}

// Privacy Settings
export interface PrivacySettings {
  usageAnalytics: boolean;
  crashReports: boolean;
  locationServices: boolean;
  contactAccess: boolean;
  photoLibraryAccess: boolean;
  adTracking: boolean;
  marketingCommunications: boolean;
}

// Academy Specific Settings
export interface AcademySettings {
  defaultProgram: string | null;
  favoriteInstructors: string[];
  preferredSessionTimes: string[];
  skillLevelDisplay: boolean;
  progressSharingEnabled: boolean;
  parentalControls: boolean;
  emergencyContacts: Array<{
    id: string;
    name: string;
    phone: string;
    relationship: string;
  }>;
}

// Security Settings
export interface SecuritySettings {
  biometricLogin: boolean;
  autoLockTimeout: number; // minutes
  sessionTimeout: number; // minutes
  twoFactorEnabled: boolean;
  loginNotifications: boolean;
  securityAlerts: boolean;
}

// Complete Settings State
export interface SettingsState {
  app: AppSettings;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  academy: AcademySettings;
  security: SecuritySettings;
  
  // Actions
  updateAppSettings: (settings: Partial<AppSettings>) => void;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  updatePrivacySettings: (settings: Partial<PrivacySettings>) => void;
  updateAcademySettings: (settings: Partial<AcademySettings>) => void;
  updateSecuritySettings: (settings: Partial<SecuritySettings>) => void;
  resetToDefaults: () => void;
  exportSettings: () => SettingsState;
  importSettings: (settings: Partial<SettingsState>) => void;
}

// Default Settings
const defaultAppSettings: AppSettings = {
  theme: 'system',
  language: 'en',
  fontSize: 'medium',
  animations: true,
  hapticFeedback: true,
  soundEffects: true,
};

const defaultNotificationSettings: NotificationSettings = {
  pushNotifications: true,
  bookingUpdates: true,
  achievements: true,
  paymentNotifications: true,
  weeklyEmailSummary: true,
  marketingEmails: false,
  sessionReminders: true,
  emergencyAlerts: true,
  smsConfirmations: false,
  quietHoursEnabled: true,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
};

const defaultPrivacySettings: PrivacySettings = {
  usageAnalytics: true,
  crashReports: true,
  locationServices: false,
  contactAccess: false,
  photoLibraryAccess: true,
  adTracking: false,
  marketingCommunications: true,
};

const defaultAcademySettings: AcademySettings = {
  defaultProgram: null,
  favoriteInstructors: [],
  preferredSessionTimes: [],
  skillLevelDisplay: true,
  progressSharingEnabled: true,
  parentalControls: false,
  emergencyContacts: [],
};

const defaultSecuritySettings: SecuritySettings = {
  biometricLogin: false,
  autoLockTimeout: 15,
  sessionTimeout: 60,
  twoFactorEnabled: false,
  loginNotifications: true,
  securityAlerts: true,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    immer((set, get) => ({
      app: defaultAppSettings,
      notifications: defaultNotificationSettings,
      privacy: defaultPrivacySettings,
      academy: defaultAcademySettings,
      security: defaultSecuritySettings,

      updateAppSettings: (settings) =>
        set((state) => {
          Object.assign(state.app, settings);
        }),

      updateNotificationSettings: (settings) =>
        set((state) => {
          Object.assign(state.notifications, settings);
        }),

      updatePrivacySettings: (settings) =>
        set((state) => {
          Object.assign(state.privacy, settings);
        }),

      updateAcademySettings: (settings) =>
        set((state) => {
          Object.assign(state.academy, settings);
        }),

      updateSecuritySettings: (settings) =>
        set((state) => {
          Object.assign(state.security, settings);
        }),

      resetToDefaults: () =>
        set(() => ({
          app: { ...defaultAppSettings },
          notifications: { ...defaultNotificationSettings },
          privacy: { ...defaultPrivacySettings },
          academy: { ...defaultAcademySettings },
          security: { ...defaultSecuritySettings },
        })),

      exportSettings: () => {
        const state = get();
        return {
          app: state.app,
          notifications: state.notifications,
          privacy: state.privacy,
          academy: state.academy,
          security: state.security,
        } as SettingsState;
      },

      importSettings: (settings) =>
        set((state) => {
          if (settings.app) Object.assign(state.app, settings.app);
          if (settings.notifications) Object.assign(state.notifications, settings.notifications);
          if (settings.privacy) Object.assign(state.privacy, settings.privacy);
          if (settings.academy) Object.assign(state.academy, settings.academy);
          if (settings.security) Object.assign(state.security, settings.security);
        }),
    })),
    {
      name: 'academy-settings-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        app: state.app,
        notifications: state.notifications,
        privacy: state.privacy,
        academy: state.academy,
        security: state.security,
      }),
    }
  )
);

// Utility functions for settings
export const getSettingsVersion = () => '1.0.0';

export const validateSettings = (settings: any): boolean => {
  try {
    return (
      settings &&
      typeof settings === 'object' &&
      settings.app &&
      settings.notifications &&
      settings.privacy &&
      settings.academy &&
      settings.security
    );
  } catch {
    return false;
  }
};

export const formatQuietHours = (start: string, end: string) => {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour24 = parseInt(hours);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  return `${formatTime(start)} - ${formatTime(end)}`;
};