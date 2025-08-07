import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme, createThemedStyles } from '@shared/theme/ThemeProvider';

/**
 * Loading Screen Component
 * 
 * Displays a centered loading indicator with Academy branding
 * Used during app initialization and authentication checks
 */
export const LoadingScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = useThemedStyles();
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1500,
        easing: Easing.linear,
      }),
      -1
    );
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.View 
          style={[animatedStyle, styles.iconContainer]}
        >
          <View style={styles.iconBackground}>
            <Ionicons 
              name="water" 
              size={32} 
              color={theme.colors.interactive.primary} 
            />
          </View>
        </Animated.View>
        
        <Text style={styles.title}>
          Academy Students
        </Text>
        <Text style={styles.subtitle}>
          Loading your swimming journey...
        </Text>
      </View>
    </View>
  );
};

const useThemedStyles = createThemedStyles((theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      alignItems: 'center',
    },
    iconContainer: {
      marginBottom: theme.spacing[6],
    },
    iconBackground: {
      width: 64,
      height: 64,
      backgroundColor: `${theme.colors.interactive.primary}15`,
      borderRadius: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      ...theme.typography.heading.h2,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[2],
      fontWeight: theme.fontConfig.fontWeight.bold,
    },
    subtitle: {
      ...theme.typography.body.base,
      color: theme.colors.text.secondary,
    },
  })
);