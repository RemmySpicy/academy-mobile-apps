/**
 * Fallback theme module that provides the same API as the shared ThemeProvider
 * but uses the app-level fallback theme context
 */

import React, { createContext, useContext } from 'react';

const fallbackTheme = {
  colors: {
    background: { primary: '#ffffff', secondary: '#f5f5f5', elevated: '#ffffff' },
    text: { primary: '#000000', secondary: '#666666', inverse: '#ffffff' },
    interactive: { primary: '#007AFF', secondary: '#5856D6' },
    status: { error: '#FF3B30', success: '#34C759', warning: '#FF9500' },
    border: { primary: '#e0e0e0' }
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  borderRadius: { sm: 4, md: 8, lg: 12, full: 9999 },
  elevation: { sm: { elevation: 2 }, md: { elevation: 4 } },
  typography: {
    heading: { 
      h4: { fontSize: 18, fontWeight: '600', lineHeight: 24 }, 
      h5: { fontSize: 16, fontWeight: '600', lineHeight: 22 } 
    },
    body: { 
      base: { fontSize: 16, lineHeight: 24, fontWeight: '400' }, 
      sm: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
      lg: { fontSize: 18, lineHeight: 26, fontWeight: '400' },
      xs: { fontSize: 12, lineHeight: 18, fontWeight: '400' }
    },
    caption: { 
      base: { fontSize: 12, lineHeight: 16 }, 
      small: { fontSize: 10, lineHeight: 14 } 
    },
    fontSize: {
      body: 16,
      sm: 14,
      base: 16,
      lg: 18
    }
  },
  fontConfig: { fontWeight: { medium: '500', semibold: '600' } }
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
    setThemeMode: () => {},
    toggleTheme: () => {},
    systemColorScheme: 'light'
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