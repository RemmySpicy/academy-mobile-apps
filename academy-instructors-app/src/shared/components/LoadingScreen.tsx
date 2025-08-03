import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

/**
 * Loading Screen
 * 
 * Beautiful animated loading screen shown during:
 * - App initialization
 * - Store hydration
 * - Authentication verification
 * 
 * Features:
 * - Smooth gradient background
 * - Animated academy icon
 * - Professional loading indicator
 * - Consistent branding
 */
export const LoadingScreen: React.FC = () => {
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 2000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <LinearGradient
      colors={['#3B82F6', '#1E40AF', '#1E3A8A']}
      className="flex-1 items-center justify-center"
    >
      <View className="items-center">
        {/* Animated Academy Icon */}
        <Animated.View style={[animatedStyle]} className="mb-8">
          <View className="bg-white/20 p-6 rounded-full">
            <Ionicons name="school" size={48} color="white" />
          </View>
        </Animated.View>

        {/* Loading Indicator */}
        <ActivityIndicator size="large" color="white" />
        
        {/* Loading Text */}
        <View className="mt-4">
          <Animated.Text className="text-white text-lg font-medium text-center">
            Academy Instructors
          </Animated.Text>
          <Animated.Text className="text-white/80 text-sm text-center mt-1">
            Loading your workspace...
          </Animated.Text>
        </View>
      </View>
    </LinearGradient>
  );
};