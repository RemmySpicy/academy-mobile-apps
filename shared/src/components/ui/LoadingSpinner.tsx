/**
 * LoadingSpinner Component
 * 
 * Modern React Native loading component with Academy theming.
 * Replaces the web-based loader from students-app with a native solution.
 * 
 * Features multiple spinner types, overlay modes, and customizable messaging.
 */

import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  ActivityIndicator, 
  StyleSheet, 
  ViewStyle, 
  TextStyle,
  Modal,
  Dimensions 
} from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  withSequence,
  Easing
} from 'react-native-reanimated';
import { useTheme } from '../../theme';

const { width, height } = Dimensions.get('window');

export interface LoadingSpinnerProps {
  /** Whether the loading spinner is visible */
  visible?: boolean;
  /** Loading message to display */
  message?: string;
  /** Type of spinner */
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars';
  /** Size of the spinner */
  size?: 'small' | 'medium' | 'large';
  /** Color override for the spinner */
  color?: string;
  /** Whether to show as full-screen overlay */
  overlay?: boolean;
  /** Background color for overlay */
  overlayColor?: string;
  /** Whether overlay is transparent */
  transparent?: boolean;
  /** Custom container style */
  style?: ViewStyle;
  /** Custom message style */
  messageStyle?: TextStyle;
  /** Test ID for testing */
  testID?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  visible = true,
  message = 'Loading...',
  variant = 'spinner',
  size = 'medium',
  color,
  overlay = false,
  overlayColor,
  transparent = false,
  style,
  messageStyle,
  testID = 'loading-spinner',
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme, size, transparent, overlayColor);

  if (!visible) return null;

  const spinnerColor = color || theme.colors.interactive.primary;

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return <DotsSpinner color={spinnerColor} size={size} />;
      case 'pulse':
        return <PulseSpinner color={spinnerColor} size={size} />;
      case 'bars':
        return <BarsSpinner color={spinnerColor} size={size} />;
      default:
        return (
          <ActivityIndicator 
            size={size === 'small' ? 'small' : 'large'} 
            color={spinnerColor}
          />
        );
    }
  };

  const renderContent = () => (
    <View style={[styles.container, style]} testID={testID}>
      <View style={styles.spinnerContainer}>
        {renderSpinner()}
        {message && (
          <Text style={[styles.message, messageStyle]}>
            {message}
          </Text>
        )}
      </View>
    </View>
  );

  if (overlay) {
    return (
      <Modal
        transparent
        visible={visible}
        statusBarTranslucent
        animationType="fade"
      >
        {renderContent()}
      </Modal>
    );
  }

  return renderContent();
};

// Custom animated spinners
const DotsSpinner: React.FC<{ color: string; size: string }> = ({ color, size }) => {
  const dot1 = useSharedValue(0.3);
  const dot2 = useSharedValue(0.3);
  const dot3 = useSharedValue(0.3);

  const dotSize = size === 'small' ? 8 : size === 'large' ? 16 : 12;

  useEffect(() => {
    dot1.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 600 }),
        withTiming(0.3, { duration: 600 })
      ),
      -1
    );
    dot2.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 200 }),
        withTiming(1, { duration: 600 }),
        withTiming(0.3, { duration: 400 })
      ),
      -1
    );
    dot3.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 400 }),
        withTiming(1, { duration: 600 }),
        withTiming(0.3, { duration: 200 })
      ),
      -1
    );
  }, []);

  const dot1Style = useAnimatedStyle(() => ({ opacity: dot1.value }));
  const dot2Style = useAnimatedStyle(() => ({ opacity: dot2.value }));
  const dot3Style = useAnimatedStyle(() => ({ opacity: dot3.value }));

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Animated.View style={[
        { 
          width: dotSize, 
          height: dotSize, 
          borderRadius: dotSize / 2, 
          backgroundColor: color 
        }, 
        dot1Style
      ]} />
      <Animated.View style={[
        { 
          width: dotSize, 
          height: dotSize, 
          borderRadius: dotSize / 2, 
          backgroundColor: color 
        }, 
        dot2Style
      ]} />
      <Animated.View style={[
        { 
          width: dotSize, 
          height: dotSize, 
          borderRadius: dotSize / 2, 
          backgroundColor: color 
        }, 
        dot3Style
      ]} />
    </View>
  );
};

const PulseSpinner: React.FC<{ color: string; size: string }> = ({ color, size }) => {
  const scale = useSharedValue(1);

  const spinnerSize = size === 'small' ? 24 : size === 'large' ? 48 : 32;

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 800, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 800, easing: Easing.in(Easing.quad) })
      ),
      -1
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[
      {
        width: spinnerSize,
        height: spinnerSize,
        borderRadius: spinnerSize / 2,
        backgroundColor: color,
        opacity: 0.7,
      },
      animatedStyle
    ]} />
  );
};

const BarsSpinner: React.FC<{ color: string; size: string }> = ({ color, size }) => {
  const bar1 = useSharedValue(0.3);
  const bar2 = useSharedValue(0.3);
  const bar3 = useSharedValue(0.3);
  const bar4 = useSharedValue(0.3);

  const barWidth = size === 'small' ? 3 : size === 'large' ? 6 : 4;
  const barHeight = size === 'small' ? 16 : size === 'large' ? 32 : 24;

  useEffect(() => {
    const animateBar = (value: Animated.SharedValue<number>, delay: number) => {
      value.value = withRepeat(
        withSequence(
          withTiming(0.3, { duration: delay }),
          withTiming(1, { duration: 400 }),
          withTiming(0.3, { duration: 800 - delay })
        ),
        -1
      );
    };

    animateBar(bar1, 0);
    animateBar(bar2, 100);
    animateBar(bar3, 200);
    animateBar(bar4, 300);
  }, []);

  const bar1Style = useAnimatedStyle(() => ({ opacity: bar1.value }));
  const bar2Style = useAnimatedStyle(() => ({ opacity: bar2.value }));
  const bar3Style = useAnimatedStyle(() => ({ opacity: bar3.value }));
  const bar4Style = useAnimatedStyle(() => ({ opacity: bar4.value }));

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      {[bar1Style, bar2Style, bar3Style, bar4Style].map((style, index) => (
        <Animated.View
          key={index}
          style={[
            {
              width: barWidth,
              height: barHeight,
              backgroundColor: color,
              borderRadius: barWidth / 2,
            },
            style
          ]}
        />
      ))}
    </View>
  );
};

const createStyles = (theme: any, size: string, transparent: boolean, overlayColor?: string) => {
  const containerPadding = size === 'small' ? theme.spacing.md : 
                          size === 'large' ? theme.spacing['2xl'] : 
                          theme.spacing.lg;

  return StyleSheet.create({
    container: {
      ...(transparent ? {} : {
        position: 'absolute',
        top: 0,
        left: 0,
        width,
        height,
        backgroundColor: overlayColor || 'rgba(0, 0, 0, 0.5)',
      }),
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
    },

    spinnerContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: transparent ? 'transparent' : theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      padding: containerPadding,
      shadowColor: theme.colors.shadow.default,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: transparent ? 0 : 0.25,
      shadowRadius: 4,
      elevation: transparent ? 0 : 5,
    },

    message: {
      marginTop: theme.spacing.md,
      fontSize: size === 'small' ? theme.fontSizes.small : 
               size === 'large' ? theme.fontSizes.lg : 
               theme.fontSizes.body,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: transparent ? theme.colors.text.inverse : theme.colors.text.primary,
      textAlign: 'center',
    },
  });
};

export default LoadingSpinner;