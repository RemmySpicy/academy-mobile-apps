import React, { useCallback, useEffect, useImperativeHandle, forwardRef } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Animated,
  BackHandler,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, createThemedStyles } from '../../theme/ThemeProvider';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface CustomModalProps {
  children: React.ReactNode;
  isVisible: boolean;
  onClose: () => void;
  
  // Animation and presentation
  animationType?: 'slide' | 'fade' | 'none';
  presentationStyle?: 'fullScreen' | 'pageSheet' | 'formSheet' | 'overFullScreen';
  
  // Behavior
  dismissible?: boolean;
  closeOnBackdropPress?: boolean;
  closeOnBackButton?: boolean;
  avoidKeyboard?: boolean;
  scrollable?: boolean;
  
  // Styling
  backdropColor?: string;
  backdropOpacity?: number;
  containerStyle?: any;
  contentContainerStyle?: any;
  
  // Layout
  position?: 'center' | 'bottom' | 'top' | 'fullscreen';
  maxHeight?: number | string;
  
  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: string;
  
  // Callbacks
  onShow?: () => void;
  onDismiss?: () => void;
  onRequestClose?: () => void;
}

export interface CustomModalRef {
  show: () => void;
  hide: () => void;
  toggle: () => void;
}

const CustomModal = forwardRef<CustomModalRef, CustomModalProps>(({
  children,
  isVisible,
  onClose,
  animationType = 'slide',
  presentationStyle = 'overFullScreen',
  dismissible = true,
  closeOnBackdropPress = true,
  closeOnBackButton = true,
  avoidKeyboard = true,
  scrollable = false,
  backdropColor,
  backdropOpacity = 0.5,
  containerStyle,
  contentContainerStyle,
  position = 'center',
  maxHeight = '80%',
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'dialog',
  onShow,
  onDismiss,
  onRequestClose,
}, ref) => {
  const { theme } = useTheme();
  const styles = useThemedStyles();
  const insets = useSafeAreaInsets();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  
  // Use theme colors for backdrop if not provided
  const dynamicBackdropColor = backdropColor || theme.colors.background.backdrop;

  // Imperative API
  useImperativeHandle(ref, () => ({
    show: () => onShow?.(),
    hide: () => handleClose(),
    toggle: () => isVisible ? handleClose() : onShow?.(),
  }));

  const handleClose = useCallback(() => {
    if (!dismissible) return;
    onClose();
  }, [dismissible, onClose]);

  const handleBackdropPress = useCallback(() => {
    if (closeOnBackdropPress && dismissible) {
      handleClose();
    }
  }, [closeOnBackdropPress, dismissible, handleClose]);

  const handleRequestClose = useCallback(() => {
    if (onRequestClose) {
      onRequestClose();
    } else {
      handleClose();
    }
  }, [onRequestClose, handleClose]);

  // Handle Android back button
  useEffect(() => {
    if (!isVisible || !closeOnBackButton || Platform.OS !== 'android') return;

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (dismissible) {
        handleClose();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [isVisible, closeOnBackButton, dismissible, handleClose]);

  // Animate backdrop
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isVisible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isVisible, fadeAnim]);

  // Get container styles based on position
  const getContainerStyles = () => {
    const baseStyle = [styles.container];
    
    switch (position) {
      case 'bottom':
        return [...baseStyle, styles.bottom, { paddingBottom: Math.max(insets.bottom, theme.spacing[4]) }];
      case 'top':
        return [...baseStyle, styles.top, { paddingTop: Math.max(insets.top, theme.spacing[4]) }];
      case 'fullscreen':
        return [...baseStyle, styles.fullscreen];
      default:
        return [...baseStyle, styles.center];
    }
  };

  const getContentStyles = () => {
    const baseStyle = [styles.content];
    
    if (position === 'fullscreen') {
      return [...baseStyle, styles.fullscreenContent];
    }
    
    return [
      ...baseStyle,
      {
        maxHeight: typeof maxHeight === 'string' ? 
          SCREEN_HEIGHT * (parseInt(maxHeight) / 100) : 
          maxHeight
      }
    ];
  };

  const renderContent = () => {
    const content = (
      <View 
        style={[getContentStyles(), contentContainerStyle]}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityRole={accessibilityRole}
        accessibilityModal={isVisible}
      >
        {children}
      </View>
    );

    if (scrollable && position !== 'fullscreen') {
      return (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {content}
        </ScrollView>
      );
    }

    return content;
  };

  const modalContent = (
    <View style={[getContainerStyles(), containerStyle]}>
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <Animated.View 
          style={[
            styles.backdrop,
            {
              backgroundColor: dynamicBackdropColor,
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, backdropOpacity],
              }),
            }
          ]} 
        />
      </TouchableWithoutFeedback>
      
      <TouchableWithoutFeedback>
        <View style={styles.contentWrapper}>
          {renderContent()}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );

  if (avoidKeyboard && Platform.OS === 'ios') {
    return (
      <Modal
        visible={isVisible}
        transparent
        animationType={animationType}
        presentationStyle={presentationStyle}
        onShow={onShow}
        onDismiss={onDismiss}
        onRequestClose={handleRequestClose}
        statusBarTranslucent
      >
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior="padding"
        >
          {modalContent}
        </KeyboardAvoidingView>
      </Modal>
    );
  }

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType={animationType}
      presentationStyle={presentationStyle}
      onShow={onShow}
      onDismiss={onDismiss}
      onRequestClose={handleRequestClose}
      statusBarTranslucent
    >
      {modalContent}
    </Modal>
  );
});

const useThemedStyles = createThemedStyles((theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    center: {
      justifyContent: 'center',
    },
    bottom: {
      justifyContent: 'flex-end',
    },
    top: {
      justifyContent: 'flex-start',
    },
    fullscreen: {
      justifyContent: 'center',
      alignItems: 'stretch',
    },
    backdrop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    contentWrapper: {
      flex: 1,
      justifyContent: 'inherit',
      alignItems: 'inherit',
    },
    content: {
      backgroundColor: theme.colors.background.elevated,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[5],
      margin: theme.spacing[5],
      maxWidth: SCREEN_WIDTH - (theme.spacing[5] * 2),
      ...Platform.select({
        ios: {
          shadowColor: theme.colors.shadow.heavy,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.25,
          shadowRadius: 12,
        },
        android: {
          elevation: 8,
        },
      }),
    },
    fullscreenContent: {
      flex: 1,
      margin: 0,
      borderRadius: 0,
      maxWidth: '100%',
      backgroundColor: theme.colors.background.primary,
    },
    scrollView: {
      maxHeight: '80%',
    },
    scrollContent: {
      flexGrow: 1,
    },
    keyboardAvoidingView: {
      flex: 1,
    },
  })
);

CustomModal.displayName = 'CustomModal';

export default CustomModal;