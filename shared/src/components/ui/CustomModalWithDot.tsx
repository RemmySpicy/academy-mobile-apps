/**
 * CustomModalWithDot Component
 * 
 * A bottom sheet-style modal with a close dot indicator at the top.
 * Uses modern modal presentation with Academy theming and accessibility features.
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
  Dimensions,
  Animated,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';

export interface CustomModalWithDotProps {
  /** Whether the modal is visible */
  visible: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Modal content */
  children: React.ReactNode;
  /** Maximum height as percentage of screen height (0-1) */
  maxHeightPercentage?: number;
  /** Whether modal can be closed by tapping backdrop */
  closeOnBackdrop?: boolean;
  /** Whether to show the close dot */
  showCloseDot?: boolean;
  /** Animation duration in milliseconds */
  animationDuration?: number;
  /** Custom backdrop styles */
  backdropStyle?: ViewStyle;
  /** Custom container styles */
  containerStyle?: ViewStyle;
  /** Custom close button styles */
  closeButtonStyle?: ViewStyle;
  /** Whether modal can be dismissed by swiping down */
  swipeToClose?: boolean;
  /** Minimum swipe distance to close */
  swipeCloseThreshold?: number;
  /** Test ID for testing */
  testID?: string;
  /** Callback when modal opens */
  onModalShow?: () => void;
  /** Callback when modal closes */
  onModalHide?: () => void;
}

export const CustomModalWithDot: React.FC<CustomModalWithDotProps> = ({
  visible,
  onClose,
  children,
  maxHeightPercentage = 0.9,
  closeOnBackdrop = true,
  showCloseDot = true,
  animationDuration = 300,
  backdropStyle,
  containerStyle,
  closeButtonStyle,
  swipeToClose = true,
  swipeCloseThreshold = 100,
  testID = 'custom-modal-with-dot',
  onModalShow,
  onModalHide,
}) => {
  const { theme, screenDimensions } = useTheme();
  const styles = createStyles(theme, screenDimensions, maxHeightPercentage);
  
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(0)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  // Screen dimensions
  const screenHeight = Dimensions.get('window').height;
  const maxHeight = screenHeight * maxHeightPercentage;

  // Pan responder for swipe to close
  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return swipeToClose && gestureState.dy > 10 && Math.abs(gestureState.dx) < Math.abs(gestureState.dy);
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > swipeCloseThreshold) {
          closeModal();
        } else {
          // Snap back to original position
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // Effect to handle visibility changes
  useEffect(() => {
    if (visible && !modalVisible) {
      openModal();
    } else if (!visible && modalVisible) {
      closeModal();
    }
  }, [visible]);

  const openModal = () => {
    setModalVisible(true);
    onModalShow?.();
    
    // Reset animations
    slideAnim.setValue(maxHeight);
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
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: maxHeight,
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
      onModalHide?.();
      onClose();
    });
  };

  const handleBackdropPress = () => {
    if (closeOnBackdrop) {
      closeModal();
    }
  };

  const handleClosePress = () => {
    closeModal();
  };

  if (!modalVisible && !visible) {
    return null;
  }

  return (
    <Modal
      transparent
      visible={modalVisible}
      onRequestClose={closeModal}
      animationType="none"
      statusBarTranslucent
      testID={testID}
    >
      {/* Backdrop */}
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

      {/* Modal Container */}
      <Animated.View
        style={[
          styles.modalContainer,
          {
            transform: [
              {
                translateY: slideAnim,
              },
            ],
          },
          containerStyle,
        ]}
        {...(swipeToClose ? panResponder.panHandlers : {})}
        testID={`${testID}-container`}
      >
        {/* Close Dot */}
        {showCloseDot && (
          <View style={styles.closeButtonContainer}>
            <TouchableOpacity
              style={[styles.closeButton, closeButtonStyle]}
              onPress={handleClosePress}
              testID={`${testID}-close-button`}
              accessibilityRole="button"
              accessibilityLabel="Close modal"
              accessibilityHint="Closes the modal dialog"
            >
              <Ionicons
                name="close"
                size={theme.iconSize.md}
                color={theme.colors.icon.primary}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Modal Content */}
        <View 
          style={styles.contentContainer}
          testID={`${testID}-content`}
        >
          {children}
        </View>
      </Animated.View>
    </Modal>
  );
};

const createStyles = (theme: any, screenDimensions: any, maxHeightPercentage: number) => {
  const screenHeight = Dimensions.get('window').height;
  const maxHeight = screenHeight * maxHeightPercentage;

  return StyleSheet.create({
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.colors.background.overlay,
      justifyContent: 'flex-end',
    },

    backdropPressable: {
      flex: 1,
    },

    modalContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.background.elevated,
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
      maxHeight,
      shadowColor: theme.colors.shadow.primary,
      shadowOffset: {
        width: 0,
        height: -4,
      },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 16,
    },

    closeButtonContainer: {
      alignItems: 'center',
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
    },

    closeButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.background.primary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: theme.colors.shadow.primary,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },

    contentContainer: {
      flex: 1,
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.lg,
    },
  });
};

export default CustomModalWithDot;