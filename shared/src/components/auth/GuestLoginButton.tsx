import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, createThemedStyles } from '../../theme/ThemeProvider';

export interface GuestLoginButtonProps {
  onPress?: () => void;
  text?: string;
  variant?: 'outline' | 'filled' | 'minimal';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: any;
  textStyle?: any;
  accessibilityLabel?: string;
}

export const GuestLoginButton: React.FC<GuestLoginButtonProps> = ({
  onPress,
  text = 'Continue as Guest',
  variant = 'outline',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
  accessibilityLabel,
}) => {
  const { theme } = useTheme();
  const styles = useThemedStyles();

  const getSizeConfig = () => {
    const sizes = {
      small: { 
        height: theme.safeArea.minTouchTarget.height * 0.9, 
        paddingHorizontal: theme.spacing[4], 
        fontSize: theme.typography.caption.base.fontSize 
      },
      medium: { 
        height: theme.safeArea.minTouchTarget.height, 
        paddingHorizontal: theme.spacing[5], 
        fontSize: theme.typography.body.base.fontSize 
      },
      large: { 
        height: theme.safeArea.minTouchTarget.height * 1.2, 
        paddingHorizontal: theme.spacing[6], 
        fontSize: theme.typography.body.lg.fontSize 
      },
    };
    return sizes[size];
  };

  const getVariantStyles = () => {
    const sizeConfig = getSizeConfig();
    
    const variants = {
      filled: {
        backgroundColor: theme.colors.interactive.secondary,
        borderColor: theme.colors.interactive.secondary,
        textColor: theme.colors.text.primary,
      },
      outline: {
        backgroundColor: theme.colors.background.primary,
        borderColor: theme.colors.border.secondary,
        textColor: theme.colors.text.secondary,
      },
      minimal: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        textColor: theme.colors.text.secondary,
      },
    };

    return {
      ...variants[variant],
      ...sizeConfig,
    };
  };

  const variantStyles = getVariantStyles();

  return (
    <Pressable style={({ pressed }) => [
        { opacity: pressed ? 0.8 : 1 },
        styles.button,
        {
          height: variantStyles.height,
          paddingHorizontal: variantStyles.paddingHorizontal,
          backgroundColor: variantStyles.backgroundColor,
          borderColor: variantStyles.borderColor,
        },
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || text}
      accessibilityState={{ disabled }}
      >
      <Ionicons
        name="person-outline"
        size={20}
        color={variantStyles.textColor}
        style={styles.icon}
      />
      
      <Text
        style={[
          styles.text,
          {
            fontSize: variantStyles.fontSize,
            color: variantStyles.textColor,
          },
          textStyle,
        ]}
      >
        {text}
      </Text>
    </Pressable>
  );
};

const useThemedStyles = createThemedStyles((theme) =>
  StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.borderRadius.md,
      borderWidth: theme.borderWidth.sm,
      width: '100%',
    },
    icon: {
      marginRight: theme.spacing[3],
    },
    text: {
      ...theme.typography.body.base,
      fontWeight: theme.fontConfig.fontWeight.medium,
      textAlign: 'center',
    },
    disabled: {
      opacity: 0.6,
    },
  })
);

export default GuestLoginButton;