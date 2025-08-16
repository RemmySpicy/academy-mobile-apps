import React from 'react';
import { View, ViewProps } from 'react-native';
import { Platform } from 'react-native';

interface FormProps extends ViewProps {
  onSubmit?: () => void;
  children: React.ReactNode;
}

const Form: React.FC<FormProps> = ({ onSubmit, children, style, ...props }) => {
  if (Platform.OS === 'web') {
    // On web, render as a proper HTML form element
    return React.createElement(
      'form',
      {
        onSubmit: (e: Event) => {
          e.preventDefault();
          onSubmit?.();
        },
        style,
        ...props,
      },
      children
    );
  }

  // On native, render as a View
  return (
    <View style={style} {...props}>
      {children}
    </View>
  );
};

export { Form };