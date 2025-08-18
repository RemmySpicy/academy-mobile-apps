import React from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, { 
  FadeInDown, 
  EntryAnimationsValues, 
  ExitAnimationsValues,
  AnimatedStyleProp
} from 'react-native-reanimated';

interface AnimatedWrapperProps {
  children: React.ReactNode;
  entering?: any;
  exiting?: any;
  style?: AnimatedStyleProp<ViewStyle>;
  delay?: number;
  duration?: number;
  springify?: boolean;
  testID?: string;
}

/**
 * AnimatedWrapper - Prevents transform conflicts in Reanimated
 * 
 * This component wraps children with an outer View and applies
 * layout animations to the outer container, preventing conflicts
 * with manual transform animations applied to children.
 * 
 * Usage:
 * ```tsx
 * <AnimatedWrapper entering={FadeInDown} delay={200}>
 *   <MyComponent />
 * </AnimatedWrapper>
 * ```
 */
export const AnimatedWrapper: React.FC<AnimatedWrapperProps> = ({
  children,
  entering,
  exiting,
  style,
  delay = 0,
  duration = 300,
  springify = false,
  testID,
}) => {
  // Build the entering animation
  const buildAnimation = (animation: any) => {
    if (!animation) return undefined;
    
    let anim = animation;
    
    if (delay > 0) {
      anim = anim.delay(delay);
    }
    
    if (duration && !springify) {
      anim = anim.duration(duration);
    }
    
    if (springify) {
      // Use damping and stiffness for spring configuration in v3
      anim = anim.damping(15).stiffness(200);
    }
    
    return anim;
  };

  const enteringAnimation = buildAnimation(entering);
  const exitingAnimation = buildAnimation(exiting);

  return (
    <Animated.View 
      entering={enteringAnimation}
      exiting={exitingAnimation}
      style={style}
      testID={testID}
    >
      <View>
        {children}
      </View>
    </Animated.View>
  );
};

/**
 * Convenience wrapper for common FadeInDown animations
 */
export const FadeInWrapper: React.FC<Omit<AnimatedWrapperProps, 'entering'>> = (props) => (
  <AnimatedWrapper {...props} entering={FadeInDown} />
);

// Add displayName for debugging
AnimatedWrapper.displayName = 'AnimatedWrapper';
FadeInWrapper.displayName = 'FadeInWrapper';

export default AnimatedWrapper;