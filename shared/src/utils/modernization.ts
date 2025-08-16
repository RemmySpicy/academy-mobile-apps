import { ViewStyle, Platform } from 'react-native';

/**
 * Modernization utilities for upgrading deprecated React Native patterns
 */

/**
 * Convert legacy shadow properties to modern elevation-based styling
 * @deprecated Direct shadow props are deprecated. Use elevation system instead.
 */
export function convertShadowToElevation(shadowStyle: {
  shadowColor?: string;
  shadowOffset?: { width: number; height: number };
  shadowOpacity?: number;
  shadowRadius?: number;
  elevation?: number;
}): ViewStyle {
  const { shadowColor, shadowOffset, shadowOpacity, shadowRadius, elevation } = shadowStyle;
  
  if (Platform.OS === 'web') {
    // For web, create a proper CSS box-shadow
    const offsetX = shadowOffset?.width || 0;
    const offsetY = shadowOffset?.height || 2;
    const blur = shadowRadius || 4;
    const opacity = shadowOpacity || 0.1;
    const color = shadowColor || '#000000';
    
    return {
      boxShadow: `${offsetX}px ${offsetY}px ${blur}px rgba(${hexToRgb(color)}, ${opacity})`,
    } as ViewStyle;
  }
  
  if (Platform.OS === 'ios') {
    return {
      shadowColor: shadowColor || '#000000',
      shadowOffset: shadowOffset || { width: 0, height: 2 },
      shadowOpacity: shadowOpacity || 0.1,
      shadowRadius: shadowRadius || 4,
    };
  }
  
  // Android uses elevation
  return {
    elevation: elevation || shadowRadius || 4,
  };
}

/**
 * Convert hex color to RGB values
 */
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `${r}, ${g}, ${b}`;
  }
  return '0, 0, 0';
}

/**
 * Migration guide for common deprecated patterns
 */
export const modernizationGuide = {
  touchables: {
    'Pressable': 'Pressable with opacity style',
    'TouchableHighlight': 'Pressable with background color change',
    'TouchableWithoutFeedback': 'Pressable without feedback',
  },
  
  styling: {
    'shadowColor/shadowOffset/shadowOpacity/shadowRadius': 'Use elevation system or convertShadowToElevation',
    'absolute positioning without insets': 'Use modern positioning with insets',
  },
  
  apis: {
    'Dimensions.get()': 'useWindowDimensions hook',
    'AsyncStorage': '@react-native-async-storage/async-storage',
    'NetInfo': '@react-native-community/netinfo',
  }
};

/**
 * Check if current React Native version supports new features
 */
export function checkFeatureSupport() {
  return {
    pressable: true, // Available since RN 0.63
    useWindowDimensions: true, // Available since RN 0.63
    appearance: true, // Available since RN 0.62
    deviceColorScheme: true, // Available since RN 0.62
  };
}

/**
 * Create modern styles with proper platform handling
 */
export function createModernStyles(styles: Record<string, ViewStyle>) {
  const modernStyles: Record<string, ViewStyle> = {};
  
  for (const [key, style] of Object.entries(styles)) {
    modernStyles[key] = {
      ...style,
      // Convert any legacy shadow properties
      ...convertShadowToElevation(style),
    };
    
    // Remove the old shadow properties to avoid conflicts
    delete modernStyles[key].shadowColor;
    delete modernStyles[key].shadowOffset;
    delete modernStyles[key].shadowOpacity;
    delete modernStyles[key].shadowRadius;
  }
  
  return modernStyles;
}

export default {
  convertShadowToElevation,
  modernizationGuide,
  checkFeatureSupport,
  createModernStyles,
};