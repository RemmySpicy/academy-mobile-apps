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
      elevated: '#ffffff' 
    },
    text: { 
      primary: '#000000', 
      secondary: '#666666', 
      tertiary: '#999999',
      inverse: '#ffffff',
      disabled: '#cccccc'
    },
    interactive: { 
      primary: '#4F2EC9',
      accent: '#3B82F6', 
      secondary: '#5856D6',
      purple: '#8B5CF6'
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
    border: { primary: '#e0e0e0' },
    icon: {
      primary: '#374151',
      secondary: '#6B7280',
      tertiary: '#9CA3AF',
      disabled: '#D1D5DB'
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
    '3xl': 30
  },
  spacing: { 
    xs: 4, 
    sm: 8, 
    md: 16, 
    lg: 24, 
    xl: 32,
    '2xl': 48,
    '3xl': 64  // Add missing 3xl spacing
  },
  borderRadius: { sm: 4, md: 8, lg: 12, xl: 16, full: 9999 },
  elevation: { sm: { elevation: 2 }, md: { elevation: 4 } },
  typography: {
    heading: { h4: { fontSize: 18, fontWeight: '600' }, h5: { fontSize: 16, fontWeight: '600' } },
    body: { base: { fontSize: 16 }, sm: { fontSize: 14 } },
    caption: { base: { fontSize: 12 }, small: { fontSize: 10 } }
  },
  fontConfig: { 
    fontWeight: { 
      regular: '400',
      medium: '500', 
      semibold: '600',
      bold: '700'
    } 
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
  return context;
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