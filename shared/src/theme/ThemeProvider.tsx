/**
 * Academy Mobile Apps Theme Provider
 * 
 * Provides theme context with support for light/dark/night modes, system preferences,
 * and persistent theme selection with smooth transitions.
 */


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
import { lightColorScheme, darkColorScheme, type ColorScheme } from './colors';
import { typography, type Typography } from './typography';
import { spacing, borderRadius, borderWidth, elevation, componentSpacing, safeArea, type Spacing, type BorderWidth, type Elevation } from './spacing';
import { fontConfig, fontSizes, lineHeights, letterSpacing } from './typography';
import { STORAGE_KEYS } from '../utils/constants';

// Icon sizes for consistent UI
const iconSize = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// Theme interface
export interface Theme {
  colors: ColorScheme;
  typography: Typography;
  spacing: Spacing;
  borderRadius: typeof borderRadius;
  borderWidth: BorderWidth;
  elevation: Elevation;
  fontConfig: typeof fontConfig;
  fontSizes: typeof fontSizes;
  lineHeights: typeof lineHeights;
  letterSpacing: typeof letterSpacing;
  componentSpacing: typeof componentSpacing;
  safeArea: typeof safeArea;
  iconSize: typeof iconSize;
  isDark: boolean;
}

// Light theme
const lightTheme: Theme = {
  colors: lightColorScheme,
  typography,
  spacing,
  borderRadius,
  borderWidth,
  elevation,
  fontConfig,
  fontSizes,
  lineHeights,
  letterSpacing,
  componentSpacing,
  safeArea,
  iconSize,
  isDark: false,
};

// Dark theme
const darkTheme: Theme = {
  colors: darkColorScheme,
  typography,
  spacing,
  borderRadius,
  borderWidth,
  elevation,
  fontConfig,
  fontSizes,
  lineHeights,
  letterSpacing,
  componentSpacing,
  safeArea,
  iconSize,
  isDark: true,
};

export type ThemeMode = 'light' | 'dark';

// Export the theme objects
export { lightTheme, darkTheme };

// Night mode - enhanced dark theme with deeper blacks and reduced blue light
const createNightTheme = (): Theme => ({
  ...darkTheme,
  colors: {
    ...darkTheme.colors,
    background: {
      primary: '#000000',        // Pure black for OLED
      secondary: '#0A0A0A',      // Very dark gray
      tertiary: '#121212',       // Slightly lighter
      elevated: '#0F0F0F',       // Elevated surfaces
      accent: '#1A1A2E',         // Night mode accent
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
      
      faded: '#1A1A1A',
      fadedHover: '#2A2A2A',
      
      orange: '#BB8844',
      orangeHover: '#AA7733',
      
      teal: '#5A8A8A',
      tealHover: '#6A9A9A',
      tealPressed: '#4A7A7A',
      
      destructive: '#CC4444',
      destructiveHover: '#BB3333',
      destructivePressed: '#DD5555',
      
      themeBlack: '#E8E8E8',
      danger: '#CC4444',
      cancel: '#7C9AFF',
      gray: '#1A1A1A',
      lightGray: '#0A0A0A',
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
    overlay: {
      light: 'rgba(0, 0, 0, 0.6)',
      medium: 'rgba(0, 0, 0, 0.8)',
      dark: 'rgba(0, 0, 0, 0.9)',
      heavy: 'rgba(0, 0, 0, 0.95)',
    },
    shadow: {
      default: 'rgba(0, 0, 0, 0.5)',
      light: 'rgba(0, 0, 0, 0.4)',
      medium: 'rgba(0, 0, 0, 0.5)',
      heavy: 'rgba(0, 0, 0, 0.7)',
      colored: 'rgba(124, 154, 255, 0.3)',
    },
  },
});

export type ExtendedThemeMode = 'light' | 'dark' | 'night' | 'system';

export interface ThemeContextValue {
  theme: Theme;
  themeMode: ExtendedThemeMode;
  isDark: boolean;
  isNight: boolean;
  setThemeMode: (mode: ExtendedThemeMode) => void;
  toggleTheme: () => void;
  systemColorScheme: ColorSchemeName;
  screenDimensions: {
    width: number;
    height: number;
    scale: number;
    fontScale: number;
    isXSmall: boolean;
    isSmall: boolean;
    isMedium: boolean;
    isLarge: boolean;
    isXLarge: boolean;
    isPortrait: boolean;
    isLandscape: boolean;
    isPhone: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    aspectRatio: number;
    isWideScreen: boolean;
    isUltraWide: boolean;
    responsiveWidth: (percentage: number) => number;
    responsiveHeight: (percentage: number) => number;
    responsiveSize: (size: number) => number;
  };
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
  
  // Simple screen dimensions fallback to avoid circular dependency
  const screenDimensions = useMemo(() => ({
    width: 375, // Default mobile width
    height: 667, // Default mobile height
    scale: 1,
    fontScale: 1,
    isXSmall: false,
    isSmall: true,
    isMedium: false,
    isLarge: false,
    isXLarge: false,
    isPortrait: true,
    isLandscape: false,
    isPhone: true,
    isTablet: false,
    isDesktop: false,
    aspectRatio: 0.56,
    isWideScreen: false,
    isUltraWide: false,
    responsiveWidth: (percentage: number) => (375 * percentage) / 100,
    responsiveHeight: (percentage: number) => (667 * percentage) / 100,
    responsiveSize: (size: number) => Math.min(375, 667) * (size / 100),
  }), []);

  // Get the actual theme based on mode and system preference
  const getTheme = useCallback((mode: ExtendedThemeMode, systemScheme: ColorSchemeName): Theme => {
    switch (mode) {
      case 'light':
        return lightTheme;
      case 'dark':
        return darkTheme;
      case 'night':
        return createNightTheme();
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
      console.log('🚀 Theme persistence disabled, using default');
      setIsLoading(false);
      return;
    }

    const loadPersistedTheme = async () => {
      try {
        console.log('🔄 Loading persisted theme...');
        const savedTheme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
        if (savedTheme && ['light', 'dark', 'night', 'system'].includes(savedTheme)) {
          console.log('✅ Loaded theme:', savedTheme);
          setThemeModeState(savedTheme as ExtendedThemeMode);
        } else {
          console.log('ℹ️ No saved theme found, using default');
        }
      } catch (error) {
        console.warn('❌ Failed to load persisted theme:', error);
      } finally {
        console.log('🏁 Theme loading complete');
        // Reduce loading delay for mobile
        setTimeout(() => {
          setIsLoading(false);
        }, Platform.OS === 'web' ? 100 : 50);
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

  // Debug logging for theme changes
  useEffect(() => {
    console.log('🎨 Theme context updated:', {
      mode: themeMode,
      isDark,
      isNight,
      primaryColor: currentTheme.colors.interactive.primary,
      backgroundColor: currentTheme.colors.background.primary,
      textColor: currentTheme.colors.text.primary,
    });
  }, [themeMode, isDark, isNight, currentTheme]);

  // Create context value - always create this regardless of loading state
  const contextValue: ThemeContextValue = {
    theme: isLoading ? lightTheme : currentTheme, // Use fallback theme while loading
    themeMode: isLoading ? 'light' : themeMode,
    isDark: isLoading ? false : isDark,
    isNight: isLoading ? false : isNight,
    setThemeMode: isLoading ? (() => {}) : setThemeMode, // No-op while loading
    toggleTheme: isLoading ? (() => {}) : toggleTheme, // No-op while loading
    systemColorScheme,
    screenDimensions,
  };

  // Always render the provider, never return null or conditional components
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
    throw new Error('useTheme must be used within a ThemeProvider. Make sure your component is wrapped in <ThemeProvider>');
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
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => {
    const { theme } = useTheme();
    return <Component {...(props as P & { theme: Theme })} theme={theme} ref={ref} />;
  });
  
  WrappedComponent.displayName = `withTheme(${Component.displayName || Component.name || 'Component'})`;
  
  return WrappedComponent as React.ComponentType<P>;
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
    if (theme.isDark && theme.colors.background.primary === '#000000' && nightOverrides) {
      // Night theme check (pure black background)
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
    if (theme.isDark && theme.colors.background.primary === '#000000') return 'night';
    if (theme.isDark) return 'dark';
    return 'light';
  },
};

export default ThemeProvider;