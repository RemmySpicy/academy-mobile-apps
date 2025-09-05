/**
 * Fallback theme module that provides the same API as the shared ThemeProvider
 * but uses the app-level fallback theme context
 */

import React, { createContext, useContext } from 'react';

const fallbackTheme = {
  colors: {
    background: { 
      primary: '#ffffff', 
      secondary: '#f5f5f5', 
      tertiary: '#f0f0f0',
      elevated: '#ffffff',
      accent: '#f8fafc',
      overlay: 'rgba(0, 0, 0, 0.5)',
      backdrop: 'rgba(0, 0, 0, 0.3)'
    },
    text: { 
      primary: '#000000', 
      secondary: '#666666', 
      tertiary: '#999999',
      inverse: '#ffffff',
      disabled: '#cccccc',
      link: '#4F2EC9',
      linkHover: '#4227B3'
    },
    interactive: { 
      primary: '#4F2EC9',
      primaryHover: '#4227B3',
      primaryPressed: '#371F97',
      primaryDisabled: '#D1D5DB',
      
      secondary: '#FFFFFF',
      secondaryHover: '#FAFAFA',
      secondaryPressed: '#F5F5F5',
      secondaryBorder: '#D4D4D4',
      
      tertiary: 'transparent',
      tertiaryHover: '#EAF4F4',
      tertiaryPressed: '#D1E7E7',
      
      faded: '#EAF4F4',
      fadedHover: '#D1E7E7',
      
      orange: '#FEAE24',
      orangeHover: '#F09006',
      
      teal: '#52E2BB',
      tealHover: '#14B8A6',
      tealPressed: '#0D9488',
      
      destructive: '#EF4444',
      destructiveHover: '#DC2626',
      destructivePressed: '#B91C1C',
      
      themeBlack: '#121212',
      danger: '#EE4A52',
      cancel: '#4F2EC9',
      gray: '#F5F5F5',
      lightGray: '#FAFAFA',
      accent: '#3B82F6',
      accentHover: '#2563EB',
      purple: '#A855F7'
    },
    status: { 
      error: '#FF3B30', 
      success: '#34C759', 
      warning: '#FF9500',
      info: '#007AFF',
      infoBackground: '#E7F3FF',
      successBackground: '#E7F8F0',
      warningBackground: '#FFF4E6',
      errorBackground: '#FFEBEE'
    },
    border: { 
      primary: '#E5E7EB',
      secondary: '#D1D5DB',
      focused: '#4F2EC9',
      error: '#EF4444',
      success: '#10B981',
      warning: '#F59E0B',
      teal: '#52E2BB'
    },
    icon: {
      primary: '#374151',
      secondary: '#6B7280',
      tertiary: '#9CA3AF',
      disabled: '#D1D5DB',
      accent: '#3B82F6',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      purple: '#A855F7',
      interactive: '#4F2EC9'
    },
    shadow: {
      default: 'rgba(0, 0, 0, 0.1)',
      light: 'rgba(0, 0, 0, 0.05)',
      medium: 'rgba(0, 0, 0, 0.1)',
      heavy: 'rgba(0, 0, 0, 0.25)',
      colored: 'rgba(99, 102, 241, 0.1)'
    },
    overlay: {
      light: 'rgba(0, 0, 0, 0.3)',
      medium: 'rgba(0, 0, 0, 0.5)',
      dark: 'rgba(0, 0, 0, 0.7)',
      heavy: 'rgba(0, 0, 0, 0.8)'
    }
  },
  // Add missing fontSizes that components expect
  fontSizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    
    // Aliases for component compatibility
    body: 16,      // Same as base
    small: 14,     // Same as sm
    caption: 12,   // Same as xs
    
    // Heading aliases
    h1: 36,        // Same as 4xl
    h2: 30,        // Same as 3xl
    h3: 24,        // Same as 2xl
    h4: 20,        // Same as xl
    h5: 18,        // Same as lg
    h6: 16,        // Same as base
  },
  spacing: { 
    // Numeric indices (matching actual theme system)
    0: 0,
    px: 1,
    0.5: 2,  // 2px
    1: 4,    // 4px  
    1.5: 6,  // 6px
    2: 8,    // 8px
    2.5: 10, // 10px
    3: 12,   // 12px
    3.5: 14, // 14px
    4: 16,   // 16px
    5: 20,   // 20px
    6: 24,   // 24px
    7: 28,   // 28px
    8: 32,   // 32px
    9: 36,   // 36px
    10: 40,  // 40px
    11: 44,  // 44px
    12: 48,  // 48px
    14: 56,  // 56px
    16: 64,  // 64px
    20: 80,  // 80px
    24: 96,  // 96px
    
    // Semantic aliases (for backward compatibility)
    xs: 4,    // spacing[1]
    sm: 8,    // spacing[2] 
    md: 16,   // spacing[4]
    lg: 24,   // spacing[6]
    xl: 32,   // spacing[8]
    '2xl': 48, // spacing[12]
    '3xl': 64  // spacing[16]
  },
  // Add missing borderWidth that components expect
  borderWidth: {
    none: 0,
    xs: 0.5,
    sm: 1,
    thin: 1,  // Some components use 'thin'
    base: 1.5,
    md: 2,
    lg: 3,
    xl: 4,
    '2xl': 6,
  },
  borderRadius: { 
    none: 0,
    sm: 4, 
    base: 8,
    md: 12, 
    lg: 16, 
    xl: 20, 
    '2xl': 24,
    '3xl': 32,
    full: 9999 
  },
  elevation: { 
    none: { 
      elevation: 0,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0
    },
    sm: { 
      elevation: 2,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 3.84
    }, 
    base: { 
      elevation: 3,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 4
    },
    md: { 
      elevation: 4,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.1,
      shadowRadius: 8
    },
    lg: { 
      elevation: 6,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.1,
      shadowRadius: 12
    },
    xl: { 
      elevation: 8,
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.15,
      shadowRadius: 16
    },
    '2xl': { 
      elevation: 12,
      shadowOffset: { width: 0, height: 24 },
      shadowOpacity: 0.2,
      shadowRadius: 24
    }
  },
  lineHeights: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  letterSpacing: {
    tighter: -0.05,
    tight: -0.025,
    normal: 0,
    wide: 0.025,
    wider: 0.05,
    widest: 0.1,
  },
  typography: {
    heading: { h4: { fontSize: 18, fontWeight: '600' }, h5: { fontSize: 16, fontWeight: '600' } },
    body: { base: { fontSize: 16 }, sm: { fontSize: 14 } },
    caption: { base: { fontSize: 12 }, small: { fontSize: 10 } },
    
    // LineHeight aliases for component compatibility
    lineHeight: {
      body: 24,      // 16 * 1.5 = 24
      small: 21,     // 14 * 1.5 = 21  
      caption: 18,   // 12 * 1.5 = 18
    }
  },
  fontConfig: { 
    fontWeight: { 
      regular: '400',
      medium: '500', 
      semibold: '600',
      bold: '700'
    } 
  },
  // Add missing properties that components expect
  componentSpacing: {
    form: { fieldGap: 16, labelGap: 8, sectionGap: 24, buttonGap: 12 },
    layout: { screenPadding: 16, sectionGap: 32, cardGap: 16, listGap: 8 },
    modal: { padding: 24, margin: 16, buttonGap: 12 },
    card: { padding: 16, headerGap: 12, contentGap: 16 },
    button: { paddingX: 16, paddingY: 12, iconGap: 8, groupGap: 12 },
    navigation: { tabPadding: 16, tabGap: 8, headerPadding: 16 },
    list: { itemPadding: 16, itemGap: 4, sectionGap: 24 }
  },
  safeArea: {
    minTouchTarget: { width: 44, height: 44 },
    statusBar: { height: 24 },
    keyboard: { padding: 16 },
    notch: { top: 44, bottom: 32 }
  },
  iconSize: {
    xs: 12, sm: 16, md: 20, lg: 24, xl: 32, xxl: 48
  },
  isDark: false
};

const FallbackThemeContext = createContext(fallbackTheme);

// Hook that mimics the shared library's useTheme
export const useTheme = () => {
  const context = useContext(FallbackThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider. Make sure your component is wrapped in <ThemeProvider>');
  }
  return { 
    theme: context,
    themeMode: 'light',
    isDark: false,
    screenDimensions: {
      width: 375,
      height: 667,
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
      responsiveWidth: (percentage) => (375 * percentage) / 100,
      responsiveHeight: (percentage) => (667 * percentage) / 100,
      responsiveSize: (size) => Math.min(375, 667) * (size / 100)
    }
  };
};

// Function that creates themed styles (mimics shared library API)
export const createThemedStyles = (stylesFn) => {
  return () => stylesFn(fallbackTheme);
};

// Provider component
export const ThemeProvider = ({ children }) => (
  <FallbackThemeContext.Provider value={fallbackTheme}>
    {children}
  </FallbackThemeContext.Provider>
);

// Default export matches shared library structure
export default {
  useTheme,
  createThemedStyles,
  ThemeProvider
};