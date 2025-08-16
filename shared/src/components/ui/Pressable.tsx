import React, { forwardRef, ReactNode } from 'react';
import { 
  Pressable as RNPressable, 
  PressableProps as RNPressableProps,
  ViewStyle,
  TextStyle,
  View,
  Text
} from 'react-native';

interface PressableProps extends Omit<RNPressableProps, 'style'> {
  children: ReactNode;
  style?: ViewStyle | TextStyle | ((state: { pressed: boolean }) => ViewStyle | TextStyle);
  pressedStyle?: ViewStyle | TextStyle;
  disabledStyle?: ViewStyle | TextStyle;
  android_ripple?: {
    color?: string;
    borderless?: boolean;
    radius?: number;
    foreground?: boolean;
  };
  unstable_pressDelay?: number;
  testID?: string;
}

const Pressable = forwardRef<View, PressableProps>(({
  children,
  style,
  pressedStyle,
  disabledStyle,
  disabled,
  android_ripple,
  ...props
}, ref) => {
  const getStyle = ({ pressed }: { pressed: boolean }) => {
    if (typeof style === 'function') {
      return style({ pressed });
    }
    
    let combinedStyle = style;
    
    if (pressed && pressedStyle) {
      combinedStyle = [style, pressedStyle];
    }
    
    if (disabled && disabledStyle) {
      combinedStyle = [combinedStyle, disabledStyle];
    }
    
    return combinedStyle;
  };

  return (
    <RNPressable
      ref={ref}
      style={getStyle}
      disabled={disabled}
      android_ripple={android_ripple}
      {...props}
    >
      {children}
    </RNPressable>
  );
});

Pressable.displayName = 'Pressable';

export { Pressable };
export default Pressable;
export type { PressableProps };