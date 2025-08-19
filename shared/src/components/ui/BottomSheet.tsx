/**
 * BottomSheet Component
 * 
 * Enhanced bottom sheet modal with snap points, dynamic heights, and advanced gesture handling.
 * Built on top of the Academy theme system with comprehensive accessibility support.
 */

import React, { useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
  Dimensions,
  Animated,
  PanResponder,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  BackHandler,
  ViewStyle,
  TextStyle,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';

export type BottomSheetSnapPoint = 'small' | 'medium' | 'large' | 'full' | number;

export interface BottomSheetProps {
  /** Whether the bottom sheet is visible */
  visible: boolean;
  /** Callback when bottom sheet should close */
  onClose: () => void;
  /** Bottom sheet content */
  children: React.ReactNode;
  
  // Snap Points and Heights
  /** Available snap points for the bottom sheet */
  snapPoints?: BottomSheetSnapPoint[];
  /** Initial snap point when opened */
  initialSnapPoint?: BottomSheetSnapPoint;
  /** Current snap point (for controlled mode) */
  currentSnapPoint?: BottomSheetSnapPoint;
  /** Callback when snap point changes */
  onSnapPointChange?: (snapPoint: BottomSheetSnapPoint) => void;
  
  // Behavior
  /** Whether modal can be closed by tapping backdrop */
  closeOnBackdrop?: boolean;
  /** Whether to show the drag handle */
  showDragHandle?: boolean;
  /** Whether modal can be dismissed by swiping down */
  enablePanDownToClose?: boolean;
  /** Whether to enable background dim */
  enableBackgroundDim?: boolean;
  /** Animation duration in milliseconds */
  animationDuration?: number;
  
  // Header
  /** Title text for the header */
  title?: string;
  /** Custom header component */
  headerComponent?: React.ReactNode;
  /** Whether to show close button in header */
  showCloseButton?: boolean;
  
  // Content
  /** Whether content should be scrollable */
  scrollable?: boolean;
  /** Custom scroll view props */
  scrollViewProps?: any;
  /** Whether to handle keyboard automatically */
  keyboardBehavior?: 'padding' | 'height' | 'position' | 'none';
  
  // Styling
  /** Custom backdrop styles */
  backdropStyle?: ViewStyle;
  /** Custom container styles */
  containerStyle?: ViewStyle;
  /** Custom content styles */
  contentStyle?: ViewStyle;
  /** Custom header styles */
  headerStyle?: ViewStyle;
  /** Custom title styles */
  titleStyle?: TextStyle;
  /** Custom handle styles */
  handleStyle?: ViewStyle;
  
  // Accessibility
  /** Test ID for testing */
  testID?: string;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Accessibility hint */
  accessibilityHint?: string;
  
  // Callbacks
  /** Callback when bottom sheet opens */
  onOpen?: () => void;
  /** Callback when backdrop is pressed */
  onBackdropPress?: () => void;
}

export interface BottomSheetRef {
  /** Programmatically open the bottom sheet */
  open: () => void;
  /** Programmatically close the bottom sheet */
  close: () => void;
  /** Snap to a specific point */
  snapTo: (point: BottomSheetSnapPoint) => void;
  /** Get current snap point */
  getCurrentSnapPoint: () => BottomSheetSnapPoint;
}

const SNAP_POINT_HEIGHTS = {
  small: 0.25,   // 25% of screen
  medium: 0.5,   // 50% of screen  
  large: 0.75,   // 75% of screen
  full: 0.95,    // 95% of screen
};

export const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(({
  visible,
  onClose,
  children,
  snapPoints = ['medium'],
  initialSnapPoint = 'medium',
  currentSnapPoint,
  onSnapPointChange,
  closeOnBackdrop = true,
  showDragHandle = true,
  enablePanDownToClose = true,
  enableBackgroundDim = true,
  animationDuration = 300,
  title,
  headerComponent,
  showCloseButton = true,
  scrollable = false,
  scrollViewProps,
  keyboardBehavior = Platform.OS === 'ios' ? 'padding' : 'height',
  backdropStyle,
  containerStyle,
  contentStyle,
  headerStyle,
  titleStyle,
  handleStyle,
  testID = 'bottom-sheet',
  accessibilityLabel,
  accessibilityHint,
  onOpen,
  onBackdropPress,
}, ref) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  
  const [modalVisible, setModalVisible] = React.useState(false);
  const [internalSnapPoint, setInternalSnapPoint] = React.useState(initialSnapPoint);
  
  // Controlled vs uncontrolled snap point
  const activeSnapPoint = currentSnapPoint !== undefined ? currentSnapPoint : internalSnapPoint;
  
  // Animation values
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  
  // Screen dimensions
  const screenHeight = Dimensions.get('window').height;
  
  // Calculate height for snap point
  const getHeightForSnapPoint = useCallback((point: BottomSheetSnapPoint): number => {
    if (typeof point === 'number') {
      return point > 1 ? point : screenHeight * point;
    }
    return screenHeight * SNAP_POINT_HEIGHTS[point];
  }, [screenHeight]);
  
  const currentHeight = getHeightForSnapPoint(activeSnapPoint);
  
  // Pan responder for gestures
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dy) > 10 && Math.abs(gestureState.dx) < Math.abs(gestureState.dy);
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 0) {
          // Dragging down
          slideAnim.setValue(gestureState.dy);
        } else if (gestureState.dy < 0 && snapPoints.length > 1) {
          // Dragging up - allow if multiple snap points
          const maxUpDrag = currentHeight * 0.3;
          slideAnim.setValue(Math.max(gestureState.dy, -maxUpDrag));
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        const { dy, vy } = gestureState;
        
        // If dragged down significantly or with high velocity, close or snap to smaller point
        if (dy > 100 || vy > 0.5) {
          if (enablePanDownToClose && activeSnapPoint === snapPoints[0]) {
            // Close if at smallest snap point
            closeBottomSheet();
            return;
          } else if (snapPoints.length > 1) {
            // Snap to smaller point
            const currentIndex = snapPoints.indexOf(activeSnapPoint);
            if (currentIndex > 0) {
              const smallerPoint = snapPoints[currentIndex - 1];
              snapToPoint(smallerPoint);
              return;
            }
          }
        }
        
        // If dragged up significantly, snap to larger point
        if (dy < -50 || vy < -0.5) {
          if (snapPoints.length > 1) {
            const currentIndex = snapPoints.indexOf(activeSnapPoint);
            if (currentIndex < snapPoints.length - 1) {
              const largerPoint = snapPoints[currentIndex + 1];
              snapToPoint(largerPoint);
              return;
            }
          }
        }
        
        // Snap back to current position
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }).start();
      },
    })
  ).current;
  
  // Snap to a specific point
  const snapToPoint = useCallback((point: BottomSheetSnapPoint) => {
    const newHeight = getHeightForSnapPoint(point);
    const currentOffset = (slideAnim as any)._value;
    
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
    
    // Update snap point
    if (currentSnapPoint === undefined) {
      setInternalSnapPoint(point);
    }
    onSnapPointChange?.(point);
  }, [slideAnim, getHeightForSnapPoint, currentSnapPoint, onSnapPointChange]);
  
  // Open bottom sheet
  const openBottomSheet = useCallback(() => {
    setModalVisible(true);
    onOpen?.();
    
    // Reset animations
    slideAnim.setValue(currentHeight);
    opacityAnim.setValue(0);

    // Start animations
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: true,
      }),
    ]).start();
  }, [slideAnim, opacityAnim, currentHeight, animationDuration, onOpen]);

  // Close bottom sheet
  const closeBottomSheet = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: currentHeight,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
      onClose?.();
    });
  }, [slideAnim, opacityAnim, currentHeight, animationDuration, onClose]);

  // Effect to handle visibility changes
  useEffect(() => {
    if (visible && !modalVisible) {
      openBottomSheet();
    } else if (!visible && modalVisible) {
      closeBottomSheet();
    }
  }, [visible, modalVisible, openBottomSheet, closeBottomSheet]);

  // Handle Android back button
  useEffect(() => {
    if (!modalVisible || Platform.OS !== 'android') return;

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      closeBottomSheet();
      return true;
    });

    return () => backHandler.remove();
  }, [modalVisible, closeBottomSheet]);

  // Imperative API
  useImperativeHandle(ref, () => ({
    open: openBottomSheet,
    close: closeBottomSheet,
    snapTo: snapToPoint,
    getCurrentSnapPoint: () => activeSnapPoint,
  }));

  const handleBackdropPress = () => {
    onBackdropPress?.();
    if (closeOnBackdrop) {
      closeBottomSheet();
    }
  };

  const handleClosePress = () => {
    closeBottomSheet();
  };

  // Render header
  const renderHeader = () => {
    if (headerComponent) {
      return headerComponent;
    }

    if (!title && !showDragHandle && !showCloseButton) {
      return null;
    }

    return (
      <View style={[styles.header, headerStyle]}>
        {showDragHandle && (
          <View style={[styles.dragHandle, handleStyle]} />
        )}
        
        <View style={styles.headerContent}>
          {title && (
            <Text style={[styles.title, titleStyle]} numberOfLines={1}>
              {title}
            </Text>
          )}
          
          {showCloseButton && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClosePress}
              testID={`${testID}-close-button`}
              accessibilityRole="button"
              accessibilityLabel="Close bottom sheet"
            >
              <Ionicons
                name="close"
                size={24}
                color={theme.colors.text.secondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  // Render content
  const renderContent = () => {
    const content = (
      <View style={[styles.content, contentStyle]}>
        {children}
      </View>
    );

    if (scrollable) {
      return (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
          {...scrollViewProps}
        >
          {content}
        </ScrollView>
      );
    }

    return content;
  };

  if (!modalVisible && !visible) {
    return null;
  }

  const modalContent = (
    <>
      {/* Backdrop */}
      {enableBackgroundDim && (
        <Animated.View
          style={[
            styles.backdrop,
            backdropStyle,
            {
              opacity: opacityAnim,
            },
          ]}
        >
          <Pressable
            style={styles.backdropPressable}
            onPress={handleBackdropPress}
            testID={`${testID}-backdrop`}
          />
        </Animated.View>
      )}

      {/* Bottom Sheet Container */}
      <Animated.View
        style={[
          styles.container,
          {
            height: currentHeight,
            transform: [
              {
                translateY: slideAnim,
              },
            ],
          },
          containerStyle,
        ]}
        {...panResponder.panHandlers}
        testID={`${testID}-container`}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityRole="none"
      >
        {renderHeader()}
        {renderContent()}
      </Animated.View>
    </>
  );

  if (keyboardBehavior !== 'none') {
    return (
      <Modal
        transparent
        visible={modalVisible}
        onRequestClose={closeBottomSheet}
        animationType="none"
        statusBarTranslucent
        testID={testID}
      >
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={keyboardBehavior}
        >
          {modalContent}
        </KeyboardAvoidingView>
      </Modal>
    );
  }

  return (
    <Modal
      transparent
      visible={modalVisible}
      onRequestClose={closeBottomSheet}
      animationType="none"
      statusBarTranslucent
      testID={testID}
    >
      {modalContent}
    </Modal>
  );
});

const createStyles = (theme: any) => {
  return StyleSheet.create({
    keyboardAvoidingView: {
      flex: 1,
    },
    
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.colors.background.overlay,
    },

    backdropPressable: {
      flex: 1,
    },

    container: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.background.elevated,
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
      shadowColor: theme.colors.shadow.primary,
      shadowOffset: {
        width: 0,
        height: -4,
      },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 16,
    },

    header: {
      alignItems: 'center',
      paddingTop: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
    },

    dragHandle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.colors.border.secondary,
      marginBottom: theme.spacing.sm,
    },

    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      minHeight: 24,
    },

    title: {
      flex: 1,
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
      textAlign: 'center',
    },

    closeButton: {
      position: 'absolute',
      right: 0,
      padding: theme.spacing.xs,
      borderRadius: theme.borderRadius.full,
    },

    content: {
      flex: 1,
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.sm,
      paddingBottom: theme.spacing.lg,
    },

    scrollView: {
      flex: 1,
    },

    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.sm,
      paddingBottom: theme.spacing.lg,
    },
  });
};

BottomSheet.displayName = 'BottomSheet';

export default BottomSheet;