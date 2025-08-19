/**
 * BottomSheetProvider
 * 
 * Global state management for bottom sheets across the app.
 * Provides context and hooks for managing multiple bottom sheets.
 */

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BottomSheet, BottomSheetProps, BottomSheetRef, BottomSheetSnapPoint } from './BottomSheet';

export interface BottomSheetConfig extends Omit<BottomSheetProps, 'visible' | 'onClose' | 'children'> {
  /** Unique identifier for the bottom sheet */
  id: string;
  /** Content to display in the bottom sheet */
  content: React.ReactNode;
  /** Whether this bottom sheet should be persistent (not auto-closed) */
  persistent?: boolean;
}

export interface BottomSheetContextValue {
  /** Show a bottom sheet with the given configuration */
  showBottomSheet: (config: BottomSheetConfig) => void;
  /** Hide a specific bottom sheet by ID */
  hideBottomSheet: (id: string) => void;
  /** Hide all bottom sheets */
  hideAllBottomSheets: () => void;
  /** Check if a bottom sheet is currently visible */
  isBottomSheetVisible: (id: string) => boolean;
  /** Get all currently visible bottom sheet IDs */
  getVisibleBottomSheets: () => string[];
  /** Update configuration of an existing bottom sheet */
  updateBottomSheet: (id: string, updates: Partial<BottomSheetConfig>) => void;
  /** Get reference to a specific bottom sheet */
  getBottomSheetRef: (id: string) => BottomSheetRef | null;
}

const BottomSheetContext = createContext<BottomSheetContextValue | null>(null);

export interface BottomSheetProviderProps {
  children: React.ReactNode;
  /** Maximum number of bottom sheets that can be shown simultaneously */
  maxConcurrent?: number;
  /** Default configuration for all bottom sheets */
  defaultConfig?: Partial<BottomSheetConfig>;
}

export const BottomSheetProvider: React.FC<BottomSheetProviderProps> = ({
  children,
  maxConcurrent = 3,
  defaultConfig = {},
}) => {
  const [bottomSheets, setBottomSheets] = useState<Map<string, BottomSheetConfig>>(new Map());
  const [visibleSheets, setVisibleSheets] = useState<Set<string>>(new Set());
  const bottomSheetRefs = useRef<Map<string, BottomSheetRef>>(new Map());

  const showBottomSheet = useCallback((config: BottomSheetConfig) => {
    const finalConfig = { ...defaultConfig, ...config };
    
    // Check if we're at the maximum concurrent limit
    if (visibleSheets.size >= maxConcurrent) {
      // Hide the oldest non-persistent bottom sheet
      const sheetsArray = Array.from(visibleSheets);
      const oldestId = sheetsArray.find(id => !bottomSheets.get(id)?.persistent);
      if (oldestId) {
        hideBottomSheet(oldestId);
      } else {
        console.warn(`BottomSheetProvider: Cannot show more than ${maxConcurrent} bottom sheets simultaneously`);
        return;
      }
    }

    setBottomSheets(prev => new Map(prev).set(config.id, finalConfig));
    setVisibleSheets(prev => new Set(prev).add(config.id));
  }, [bottomSheets, visibleSheets, maxConcurrent, defaultConfig]);

  const hideBottomSheet = useCallback((id: string) => {
    setVisibleSheets(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    
    // Keep the config for potential re-showing, but remove after a delay
    setTimeout(() => {
      setBottomSheets(prev => {
        const newMap = new Map(prev);
        newMap.delete(id);
        return newMap;
      });
      bottomSheetRefs.current.delete(id);
    }, 1000); // Allow time for closing animation
  }, []);

  const hideAllBottomSheets = useCallback(() => {
    setVisibleSheets(new Set());
    
    // Clear all after animation delay
    setTimeout(() => {
      setBottomSheets(new Map());
      bottomSheetRefs.current.clear();
    }, 1000);
  }, []);

  const isBottomSheetVisible = useCallback((id: string) => {
    return visibleSheets.has(id);
  }, [visibleSheets]);

  const getVisibleBottomSheets = useCallback(() => {
    return Array.from(visibleSheets);
  }, [visibleSheets]);

  const updateBottomSheet = useCallback((id: string, updates: Partial<BottomSheetConfig>) => {
    setBottomSheets(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(id);
      if (existing) {
        newMap.set(id, { ...existing, ...updates });
      }
      return newMap;
    });
  }, []);

  const getBottomSheetRef = useCallback((id: string) => {
    return bottomSheetRefs.current.get(id) || null;
  }, []);

  const contextValue: BottomSheetContextValue = {
    showBottomSheet,
    hideBottomSheet,
    hideAllBottomSheets,
    isBottomSheetVisible,
    getVisibleBottomSheets,
    updateBottomSheet,
    getBottomSheetRef,
  };

  return (
    <BottomSheetContext.Provider value={contextValue}>
      {children}
      
      {/* Render all active bottom sheets */}
      {Array.from(bottomSheets.entries()).map(([id, config]) => (
        <BottomSheet
          key={id}
          ref={(ref) => {
            if (ref) {
              bottomSheetRefs.current.set(id, ref);
            }
          }}
          visible={visibleSheets.has(id)}
          onClose={() => hideBottomSheet(id)}
          testID={`bottom-sheet-${id}`}
          {...config}
        >
          {config.content}
        </BottomSheet>
      ))}
    </BottomSheetContext.Provider>
  );
};

// Hook for using bottom sheet context
export const useBottomSheet = (): BottomSheetContextValue => {
  const context = useContext(BottomSheetContext);
  
  if (!context) {
    throw new Error('useBottomSheet must be used within a BottomSheetProvider');
  }
  
  return context;
};

// Convenience hooks for common operations
export const useBottomSheetActions = () => {
  const { showBottomSheet, hideBottomSheet, hideAllBottomSheets } = useBottomSheet();
  
  return {
    show: showBottomSheet,
    hide: hideBottomSheet,
    hideAll: hideAllBottomSheets,
  };
};

export const useBottomSheetState = (id?: string) => {
  const { isBottomSheetVisible, getVisibleBottomSheets, getBottomSheetRef } = useBottomSheet();
  
  if (id) {
    return {
      isVisible: isBottomSheetVisible(id),
      ref: getBottomSheetRef(id),
    };
  }
  
  return {
    visibleSheets: getVisibleBottomSheets(),
  };
};

// Quick show functions for common patterns
export const useQuickBottomSheet = () => {
  const { showBottomSheet, hideBottomSheet } = useBottomSheet();
  
  const showConfirm = useCallback((
    title: string,
    content: React.ReactNode,
    onConfirm: () => void,
    onCancel?: () => void,
    options?: Partial<BottomSheetConfig>
  ) => {
    const id = `confirm-${Date.now()}`;
    
    showBottomSheet({
      id,
      title,
      content: (
        <View style={{ padding: 16 }}>
          {content}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 }}>
            <TouchableOpacity
              onPress={() => {
                onCancel?.();
                hideBottomSheet(id);
              }}
              style={{
                flex: 1,
                padding: 12,
                marginRight: 8,
                backgroundColor: '#f0f0f0',
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => {
                onConfirm();
                hideBottomSheet(id);
              }}
              style={{
                flex: 1,
                padding: 12,
                marginLeft: 8,
                backgroundColor: '#007AFF',
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white' }}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      ),
      snapPoints: ['small'],
      ...options,
    });
    
    return id;
  }, [showBottomSheet, hideBottomSheet]);

  const showMenu = useCallback((
    title: string,
    items: Array<{ label: string; onPress: () => void; icon?: string }>,
    options?: Partial<BottomSheetConfig>
  ) => {
    const id = `menu-${Date.now()}`;
    
    showBottomSheet({
      id,
      title,
      content: (
        <View style={{ paddingVertical: 8 }}>
          {items.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                item.onPress();
                hideBottomSheet(id);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                borderRadius: 8,
              }}
            >
              {item.icon && (
                <Text style={{ marginRight: 12, fontSize: 20 }}>{item.icon}</Text>
              )}
              <Text style={{ fontSize: 16 }}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ),
      snapPoints: ['small'],
      ...options,
    });
    
    return id;
  }, [showBottomSheet, hideBottomSheet]);

  const showContent = useCallback((
    content: React.ReactNode,
    options?: Partial<BottomSheetConfig>
  ) => {
    const id = `content-${Date.now()}`;
    
    showBottomSheet({
      id,
      content,
      snapPoints: ['medium'],
      ...options,
    });
    
    return id;
  }, [showBottomSheet]);

  return {
    showConfirm,
    showMenu,
    showContent,
  };
};

export default BottomSheetProvider;