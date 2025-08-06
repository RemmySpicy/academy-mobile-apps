/**
 * Type definitions for react-native-iconify
 * 
 * This module provides type definitions for the react-native-iconify library
 * used throughout the Academy Mobile Apps for consistent iconography.
 */

declare module 'react-native-iconify' {
  import { Component } from 'react';
  import { ViewStyle } from 'react-native';

  export interface IconifyProps {
    /**
     * The icon identifier from Iconify collection
     * Format: "collection:icon-name" (e.g., "ri:home-line", "mdi:account")
     */
    icon: string;
    
    /**
     * Size of the icon in pixels
     * @default 24
     */
    size?: number;
    
    /**
     * Color of the icon
     * Can be any valid color string (hex, rgb, named colors)
     * @default "currentColor"
     */
    color?: string;
    
    /**
     * Width of the icon in pixels
     * If provided, overrides the size prop for width
     */
    width?: number;
    
    /**
     * Height of the icon in pixels
     * If provided, overrides the size prop for height
     */
    height?: number;
    
    /**
     * Style object for the icon container
     */
    style?: ViewStyle;
    
    /**
     * Test ID for testing purposes
     */
    testID?: string;
    
    /**
     * Accessibility label for screen readers
     */
    accessibilityLabel?: string;
    
    /**
     * Whether the icon should be accessible to screen readers
     * @default true
     */
    accessible?: boolean;
  }

  /**
   * Iconify React Native component
   * 
   * @example
   * ```tsx
   * import { Iconify } from 'react-native-iconify';
   * 
   * // Basic usage
   * <Iconify icon="ri:home-line" size={24} color="#000" />
   * 
   * // With Academy theme colors
   * <Iconify 
   *   icon="ri:user-line" 
   *   size={20} 
   *   color={theme.colors.interactive.primary} 
   * />
   * 
   * // With custom styling
   * <Iconify 
   *   icon="ri:arrow-right-line" 
   *   size={16} 
   *   color="white"
   *   style={{ marginLeft: 8 }}
   * />
   * ```
   */
  export class Iconify extends Component<IconifyProps> {}

  /**
   * Available icon collections in react-native-iconify
   * This is a subset of commonly used collections in Academy apps
   */
  export type IconCollection = 
    | 'ri'          // Remix Icon
    | 'mdi'         // Material Design Icons
    | 'fa'          // Font Awesome
    | 'ion'         // Ionicons
    | 'feather'     // Feather Icons
    | 'heroicons'   // Heroicons
    | 'tabler'      // Tabler Icons
    | 'lucide'      // Lucide Icons
    | 'phosphor'    // Phosphor Icons
    | 'carbon'      // Carbon Icons
    | 'fluent'      // Fluent UI Icons
    | 'ant-design'  // Ant Design Icons
    | 'bootstrap'   // Bootstrap Icons
    | 'octicon'     // GitHub Octicons
    | 'simple-icons'; // Simple Icons

  /**
   * Common Academy app icons
   * These are frequently used icons across the Academy mobile applications
   */
  export type AcademyIcon = 
    // Navigation
    | 'ri:home-line'
    | 'ri:home-fill'
    | 'ri:arrow-left-line'
    | 'ri:arrow-right-line'
    | 'ri:arrow-up-line'
    | 'ri:arrow-down-line'
    | 'ri:close-line'
    | 'ri:menu-line'
    
    // User & Profile
    | 'ri:user-line'
    | 'ri:user-fill'
    | 'ri:account-circle-line'
    | 'ri:account-circle-fill'
    | 'ri:group-line'
    | 'ri:group-fill'
    | 'ri:parent-line'
    | 'ri:parent-fill'
    
    // Education & Learning
    | 'ri:book-line'
    | 'ri:book-fill'
    | 'ri:book-open-line'
    | 'ri:graduation-cap-line'
    | 'ri:graduation-cap-fill'
    | 'ri:school-line'
    | 'ri:school-fill'
    | 'ri:pencil-line'
    | 'ri:pencil-fill'
    
    // Communication
    | 'ri:mail-line'
    | 'ri:mail-fill'
    | 'ri:chat-1-line'
    | 'ri:chat-1-fill'
    | 'ri:notification-line'
    | 'ri:notification-fill'
    | 'ri:phone-line'
    | 'ri:phone-fill'
    
    // Actions
    | 'ri:add-line'
    | 'ri:subtract-line'
    | 'ri:edit-line'
    | 'ri:edit-fill'
    | 'ri:delete-bin-line'
    | 'ri:delete-bin-fill'
    | 'ri:save-line'
    | 'ri:save-fill'
    | 'ri:download-line'
    | 'ri:upload-line'
    
    // Status & Feedback
    | 'ri:check-line'
    | 'ri:check-fill'
    | 'ri:close-circle-line'
    | 'ri:close-circle-fill'
    | 'ri:error-warning-line'
    | 'ri:error-warning-fill'
    | 'ri:information-line'
    | 'ri:information-fill'
    | 'ri:alert-line'
    | 'ri:alert-fill'
    
    // Settings & Configuration
    | 'ri:settings-line'
    | 'ri:settings-fill'
    | 'ri:tools-line'
    | 'ri:tools-fill'
    | 'ri:lock-line'
    | 'ri:lock-fill'
    | 'ri:eye-line'
    | 'ri:eye-off-line'
    
    // Calendar & Time
    | 'ri:calendar-line'
    | 'ri:calendar-fill'
    | 'ri:calendar-event-line'
    | 'ri:calendar-event-fill'
    | 'ri:time-line'
    | 'ri:time-fill'
    
    // Media & Content
    | 'ri:image-line'
    | 'ri:image-fill'
    | 'ri:video-line'
    | 'ri:video-fill'
    | 'ri:file-line'
    | 'ri:file-fill'
    | 'ri:folder-line'
    | 'ri:folder-fill'
    
    // System
    | 'ri:refresh-line'
    | 'ri:search-line'
    | 'ri:filter-line'
    | 'ri:more-line'
    | 'ri:more-fill'
    | 'ri:star-line'
    | 'ri:star-fill'
    | 'ri:heart-line'
    | 'ri:heart-fill'
    
    // Login & Authentication
    | 'ri:login-circle-line'
    | 'ri:logout-circle-line'
    | 'ri:key-line'
    | 'ri:shield-line'
    | 'ri:shield-fill'
    
    // Progress & Performance
    | 'ri:bar-chart-line'
    | 'ri:bar-chart-fill'
    | 'ri:pie-chart-line'
    | 'ri:pie-chart-fill'
    | 'ri:trophy-line'
    | 'ri:trophy-fill'
    | 'ri:medal-line'
    | 'ri:medal-fill'
    
    // Send & Share
    | 'ri:send-plane-line'
    | 'ri:send-plane-fill'
    | 'ri:share-line'
    | 'ri:share-fill'
    | 'ri:external-link-line';

  /**
   * Utility type for icon props with Academy-specific icons
   */
  export interface AcademyIconProps extends Omit<IconifyProps, 'icon'> {
    icon: AcademyIcon;
  }
}

/**
 * Global module augmentation for better IDE support
 */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'iconify-icon': any;
    }
  }
}