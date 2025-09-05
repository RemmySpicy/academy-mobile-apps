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
  useWindowDimensions,
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

export type ThemeMode = 'light' | 'dark' | 'system';

// Export the theme objects
export { lightTheme, darkTheme };

export interface ThemeContextValue {
  theme: Theme;
  themeMode: ThemeMode;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
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
  initialTheme?: ThemeMode;
  enableSystemTheme?: boolean;
  enableTransitions?: boolean;
  persistTheme?: boolean;
  onThemeChange?: (theme: Theme, mode: ThemeMode) => void;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialTheme = 'system',
  enableSystemTheme = true,
  enableTransitions = true,
  persistTheme = true,
  onThemeChange,
}) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(initialTheme);
  const [systemColorScheme, setSystemColorScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );
  const [isLoading, setIsLoading] = useState(persistTheme);
  
  // Animation value for smooth transitions
  const transitionValue = useMemo(() => new Animated.Value(0), []);
  
  // Real screen dimensions using useWindowDimensions for mobile-first approach
  const windowDimensions = useWindowDimensions();
  const screenDimensions = useMemo(() => {
    const { width, height, scale, fontScale } = windowDimensions;
    
    return {
      width,
      height,
      scale,
      fontScale,
      
      // Modern responsive breakpoints
      isXSmall: width < 360,
      isSmall: width >= 360 && width < 768,
      isMedium: width >= 768 && width < 1024,
      isLarge: width >= 1024 && width < 1440,
      isXLarge: width >= 1440,
      
      // Orientation detection
      isPortrait: height > width,
      isLandscape: width > height,
      
      // Device type approximations for mobile-first design
      isPhone: width < 768,
      isTablet: width >= 768 && width < 1200,
      isDesktop: width >= 1200,
      
      // Aspect ratio calculations
      aspectRatio: width / height,
      isWideScreen: (width / height) > 1.5,
      isUltraWide: (width / height) > 2.0,
      
      // Responsive sizing helpers with real dimensions
      responsiveWidth: (percentage: number) => (width * percentage) / 100,
      responsiveHeight: (percentage: number) => (height * percentage) / 100,
      responsiveSize: (size: number) => Math.min(width, height) * (size / 100),
    };
  }, [windowDimensions]);

  // Get the actual theme based on mode and system preference
  const getTheme = useCallback((mode: ThemeMode, systemScheme: ColorSchemeName): Theme => {
    switch (mode) {
      case 'light':
        return lightTheme;
      case 'dark':
        return darkTheme;
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
    themeMode === 'dark' || (themeMode === 'system' && systemColorScheme === 'dark'),
    [themeMode, systemColorScheme]
  );

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
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
          console.log('✅ Loaded theme:', savedTheme);
          setThemeModeState(savedTheme as ThemeMode);
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
  const setThemeMode = useCallback(async (mode: ThemeMode) => {
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
    const themeSequence: ThemeMode[] = ['light', 'dark'];
    const currentIndex = themeSequence.indexOf(themeMode === 'system' ? 'light' : themeMode);
    const nextIndex = (currentIndex + 1) % themeSequence.length;
    setThemeMode(themeSequence[nextIndex]);
  }, [themeMode, setThemeMode]);

  // Debug logging for theme changes
  useEffect(() => {
    if (Platform.OS !== 'web') {
      console.log('🎨 Theme updated:', {
        mode: themeMode,
        primaryColor: currentTheme.colors.interactive.primary,
        isLoading,
      });
    }
  }, [themeMode, currentTheme, isLoading]);

  // Create context value - always create this regardless of loading state
  const contextValue: ThemeContextValue = {
    theme: isLoading ? lightTheme : currentTheme, // Use fallback theme while loading
    themeMode: isLoading ? 'light' : themeMode,
    isDark: isLoading ? false : isDark,
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
  const { themeMode, setThemeMode, toggleTheme, isDark } = useTheme();
  return {
    mode: themeMode,
    setMode: setThemeMode,
    toggle: toggleTheme,
    isDark,
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
  modes?: ThemeMode[];
  showLabels?: boolean;
  onModeChange?: (mode: ThemeMode) => void;
}

export const ThemeModeSelector: React.FC<ThemeModeSelectorProps> = ({
  modes = ['light', 'dark', 'system'],
  showLabels = true,
  onModeChange,
}) => {
  const { themeMode, setThemeMode } = useTheme();

  const handleModeChange = useCallback((mode: ThemeMode) => {
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
    darkOverrides?: Partial<T>
  ): T => {
    if (theme.isDark && darkOverrides) {
      return { ...baseStyles, ...darkOverrides };
    }
    return baseStyles;
  },

  /**
   * Get theme mode from theme object
   */
  getThemeMode: (theme: Theme): ThemeMode => {
    if (theme.isDark) return 'dark';
    return 'light';
  },
};

export default ThemeProvider;