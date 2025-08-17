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
  style?: ViewStyle | TextStyle | (ViewStyle | TextStyle)[] | ((state: { pressed: boolean }) => ViewStyle | TextStyle | (ViewStyle | TextStyle)[]);
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
  const getStyle = ({ pressed }: { pressed: boolean }): ViewStyle | TextStyle | (ViewStyle | TextStyle)[] => {
    if (typeof style === 'function') {
      return style({ pressed });
    }
    
    let combinedStyle: ViewStyle | TextStyle | (ViewStyle | TextStyle)[] = style || {};
    
    if (pressed && pressedStyle) {
      combinedStyle = Array.isArray(style) ? [...style, pressedStyle] : [style || {}, pressedStyle];
    }
    
    if (disabled && disabledStyle) {
      combinedStyle = Array.isArray(combinedStyle) ? [...combinedStyle, disabledStyle] : [combinedStyle, disabledStyle];
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