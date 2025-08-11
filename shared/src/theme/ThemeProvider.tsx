/**
 * Academy Mobile Apps Theme Provider
 * 
 * Provides theme context with support for light/dark/night modes, system preferences,
 * and persistent theme selection with smooth transitions.
 */

// @ts-nocheck

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
  useMemo,
} from 'react';
import {
  Appearance,
  ColorSchemeName,
  StatusBar,
  Platform,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, type Theme, type ThemeMode } from './index';
import { STORAGE_KEYS } from '../utils/constants';

// Night mode - enhanced dark theme with deeper blacks and reduced blue light
const nightTheme: Theme = {
  ...darkTheme,
  colors: {
    ...darkTheme.colors,
    background: {
      primary: '#000000',        // Pure black for OLED
      secondary: '#0A0A0A',      // Very dark gray
      tertiary: '#121212',       // Slightly lighter
      elevated: '#0F0F0F',       // Elevated surfaces
      overlay: 'rgba(0, 0, 0, 0.8)',
      backdrop: 'rgba(0, 0, 0, 0.6)',
    },
    text: {
      primary: '#E8E8E8',        // Softer white to reduce eye strain
      secondary: '#B8B8B8',      // Muted secondary text
      tertiary: '#888888',       // Even more muted
      disabled: '#555555',       // Darker disabled text
      inverse: '#000000',
      link: '#7C9AFF',           // Softer blue for night mode
      linkHover: '#9BB0FF',
    },
    border: {
      primary: '#2A2A2A',        // Darker borders
      secondary: '#1F1F1F',      // Even darker
      focused: '#7C9AFF',        // Softer focus color
      error: '#CC4444',          // Muted error color
      success: '#44AA44',        // Muted success color
      warning: '#BB8844',        // Muted warning color
    },
    interactive: {
      primary: '#7C9AFF',        // Softer primary for night
      primaryHover: '#9BB0FF',
      primaryPressed: '#6B87E6',
      primaryDisabled: '#444444',
      
      secondary: '#1A1A1A',
      secondaryHover: '#2A2A2A',
      secondaryPressed: '#333333',
      secondaryBorder: '#333333',
      
      tertiary: 'transparent',
      tertiaryHover: '#1A1A1A',
      tertiaryPressed: '#2A2A2A',
      
      destructive: '#CC4444',
      destructiveHover: '#BB3333',
      destructivePressed: '#DD5555',
    },
    status: {
      success: '#44AA44',
      successBackground: '#001100',
      successBorder: '#223322',
      
      warning: '#BB8844',
      warningBackground: '#110800',
      warningBorder: '#332211',
      
      error: '#CC4444',
      errorBackground: '#110000',
      errorBorder: '#332222',
      
      info: '#7C9AFF',
      infoBackground: '#000011',
      infoBorder: '#222233',
    },
  },
};

export type ExtendedThemeMode = 'light' | 'dark' | 'night' | 'system';

export interface ThemeContextValue {
  theme: Theme;
  themeMode: ExtendedThemeMode;
  isDark: boolean;
  isNight: boolean;
  setThemeMode: (mode: ExtendedThemeMode) => void;
  toggleTheme: () => void;
  systemColorScheme: ColorSchemeName;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: ExtendedThemeMode;
  enableSystemTheme?: boolean;
  enableTransitions?: boolean;
  persistTheme?: boolean;
  onThemeChange?: (theme: Theme, mode: ExtendedThemeMode) => void;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialTheme = 'system',
  enableSystemTheme = true,
  enableTransitions = true,
  persistTheme = true,
  onThemeChange,
}) => {
  const [themeMode, setThemeModeState] = useState<ExtendedThemeMode>(initialTheme);
  const [systemColorScheme, setSystemColorScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );
  const [isLoading, setIsLoading] = useState(persistTheme);
  
  // Animation value for smooth transitions
  const transitionValue = useMemo(() => new Animated.Value(0), []);

  // Get the actual theme based on mode and system preference
  const getTheme = useCallback((mode: ExtendedThemeMode, systemScheme: ColorSchemeName): Theme => {
    switch (mode) {
      case 'light':
        return lightTheme;
      case 'dark':
        return darkTheme;
      case 'night':
        return nightTheme;
      case 'system':
      default:
        if (systemScheme === 'dark') {
          return darkTheme;
        }
        return lightTheme;
    }
  }, []);

  const currentTheme = useMemo(() => 
    getTheme(themeMode, systemColorScheme), 
    [themeMode, systemColorScheme, getTheme]
  );

  const isDark = useMemo(() => 
    themeMode === 'dark' || themeMode === 'night' || (themeMode === 'system' && systemColorScheme === 'dark'),
    [themeMode, systemColorScheme]
  );

  const isNight = useMemo(() => themeMode === 'night', [themeMode]);

  // Load persisted theme on mount
  useEffect(() => {
    if (!persistTheme) {
      setIsLoading(false);
      return;
    }

    const loadPersistedTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
        if (savedTheme && ['light', 'dark', 'night', 'system'].includes(savedTheme)) {
          setThemeModeState(savedTheme as ExtendedThemeMode);
        }
      } catch (error) {
        console.warn('Failed to load persisted theme:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPersistedTheme();
  }, [persistTheme]);

  // Listen to system color scheme changes
  useEffect(() => {
    if (!enableSystemTheme) return;

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme);
    });

    return () => subscription?.remove();
  }, [enableSystemTheme]);

  // Update status bar when theme changes
  useEffect(() => {
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content', true);
    } else {
      StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
      StatusBar.setBackgroundColor(currentTheme.colors.background.primary, true);
    }
  }, [isDark, currentTheme]);

  // Animate theme transitions
  useEffect(() => {
    if (!enableTransitions) return;

    Animated.timing(transitionValue, {
      toValue: isDark ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isDark, transitionValue, enableTransitions]);

  // Persist theme changes
  const setThemeMode = useCallback(async (mode: ExtendedThemeMode) => {
    setThemeModeState(mode);
    
    if (persistTheme) {
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.THEME, mode);
      } catch (error) {
        console.warn('Failed to persist theme:', error);
      }
    }

    // Call onChange callback
    const newTheme = getTheme(mode, systemColorScheme);
    onThemeChange?.(newTheme, mode);
  }, [persistTheme, onThemeChange, getTheme, systemColorScheme]);

  // Toggle between themes
  const toggleTheme = useCallback(() => {
    const themeSequence: ExtendedThemeMode[] = ['light', 'dark', 'night'];
    const currentIndex = themeSequence.indexOf(themeMode === 'system' ? 'light' : themeMode);
    const nextIndex = (currentIndex + 1) % themeSequence.length;
    setThemeMode(themeSequence[nextIndex]);
  }, [themeMode, setThemeMode]);

  // Show loading state while theme is being loaded
  if (isLoading) {
    return null; // Or a loading component
  }

  const contextValue: ThemeContextValue = {
    theme: currentTheme,
    themeMode,
    isDark,
    isNight,
    setThemeMode,
    toggleTheme,
    systemColorScheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Theme hook
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Convenience hooks
export const useThemeColors = () => {
  const { theme } = useTheme();
  return theme.colors;
};

export const useThemeSpacing = () => {
  const { theme } = useTheme();
  return theme.spacing;
};

export const useThemeTypography = () => {
  const { theme } = useTheme();
  return theme.typography;
};

export const useThemeMode = () => {
  const { themeMode, setThemeMode, toggleTheme, isDark, isNight } = useTheme();
  return {
    mode: themeMode,
    setMode: setThemeMode,
    toggle: toggleTheme,
    isDark,
    isNight,
  };
};

// HOC for theme-aware components
export function withTheme<P extends object>(
  Component: React.ComponentType<P & { theme: Theme }>
): React.ComponentType<P> {
  return React.forwardRef<any, P>((props, ref) => {
    const { theme } = useTheme();
    return <Component {...props} theme={theme} ref={ref} />;
  });
}

// Theme-aware styled component helper
export const createThemedStyles = <T extends Record<string, any>>(
  stylesCreator: (theme: Theme) => T
) => {
  return (): T => {
    const { theme } = useTheme();
    return useMemo(() => stylesCreator(theme), [theme]);
  };
};

// Theme mode selector component
export interface ThemeModeSelectorProps {
  modes?: ExtendedThemeMode[];
  showLabels?: boolean;
  onModeChange?: (mode: ExtendedThemeMode) => void;
}

export const ThemeModeSelector: React.FC<ThemeModeSelectorProps> = ({
  modes = ['light', 'dark', 'night', 'system'],
  showLabels = true,
  onModeChange,
}) => {
  const { themeMode, setThemeMode } = useTheme();

  const handleModeChange = useCallback((mode: ExtendedThemeMode) => {
    setThemeMode(mode);
    onModeChange?.(mode);
  }, [setThemeMode, onModeChange]);

  // This would render the actual selector UI
  // Implementation depends on your UI library
  return null; // Placeholder
};

// Theme utilities
export const themeHelpers = {
  /**
   * Check if current theme is dark
   */
  isDarkTheme: (theme: Theme): boolean => theme.isDark,

  /**
   * Get theme-appropriate color
   */
  getColor: (theme: Theme, colorPath: string): string => {
    const paths = colorPath.split('.');
    let color: any = theme.colors;
    
    for (const path of paths) {
      color = color?.[path];
      if (!color) break;
    }
    
    return color || theme.colors.text.primary;
  },

  /**
   * Create responsive theme styles
   */
  createResponsiveStyles: <T extends Record<string, any>>(
    theme: Theme,
    baseStyles: T,
    darkOverrides?: Partial<T>,
    nightOverrides?: Partial<T>
  ): T => {
    if (theme === nightTheme && nightOverrides) {
      return { ...baseStyles, ...nightOverrides };
    }
    if (theme.isDark && darkOverrides) {
      return { ...baseStyles, ...darkOverrides };
    }
    return baseStyles;
  },

  /**
   * Get theme mode from theme object
   */
  getThemeMode: (theme: Theme): ExtendedThemeMode => {
    if (theme === nightTheme) return 'night';
    if (theme === darkTheme) return 'dark';
    return 'light';
  },
};

export default ThemeProvider;