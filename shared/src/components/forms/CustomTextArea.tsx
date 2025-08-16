import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, KeyboardTypeOptions, StyleSheet } from 'react-native';
import { useController } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import { FormFieldProps } from '../../types';
import { useTheme, createThemedStyles } from '../../theme/ThemeProvider';
import { themeUtils } from '../../theme';

interface CustomTextAreaProps extends FormFieldProps {
  numberOfLines?: number;
  maxLength?: number;
  keyboardType?: KeyboardTypeOptions;
  onValueChange?: (value: string) => void;
  handleOnChange?: (value: string) => void; // Legacy support
  defaultValue?: string;
  editable?: boolean;
  placeholderTextColor?: string;
  autoFocus?: boolean;
  showCharacterCount?: boolean;
  minHeight?: number;
  maxHeight?: number;
}

const CustomTextArea: React.FC<CustomTextAreaProps> = ({
  name,
  placeholder,
  control,
  onValueChange,
  handleOnChange, // Legacy support
  numberOfLines = 4,
  keyboardType = "default",
  maxLength,
  defaultValue,
  editable = true,
  disabled = false,
  required = false,
  placeholderTextColor,
  autoFocus = false,
  showCharacterCount = false,
  minHeight = 96,
  maxHeight = 200,
}) => {
  const { theme } = useTheme();
  const styles = useThemedStyles();
  const [isFocused, setIsFocused] = useState(false);
  const [textHeight, setTextHeight] = useState(minHeight);

  const { field, fieldState } = useController({
    name,
    control,
    defaultValue: defaultValue || "",
  });

  const handleChangeText = useCallback((text: string) => {
    field.onChange(text);
    // Call both new and legacy handlers
    onValueChange?.(text);
    handleOnChange?.(text);
  }, [field, onValueChange, handleOnChange]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const handleContentSizeChange = useCallback((event: any) => {
    const { height } = event.nativeEvent.contentSize;
    const newHeight = Math.max(minHeight, Math.min(maxHeight, height));
    setTextHeight(newHeight);
  }, [minHeight, maxHeight]);

  const getTextAreaStyle = () => {
    return [
      styles.textArea,
      { height: textHeight },
      isFocused && styles.textAreaFocused,
      fieldState.error && styles.textAreaError,
      disabled && styles.textAreaDisabled,
    ].filter(Boolean);
  };

  const characterCount = field.value?.length || 0;
  const isOverLimit = maxLength && characterCount > maxLength;

  return (
    <View style={styles.container}>
      <View style={styles.textAreaContainer}>
        <TextInput
          style={getTextAreaStyle()}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          multiline={true}
          numberOfLines={numberOfLines}
          textAlignVertical="top"
          keyboardType={keyboardType}
          placeholderTextColor={placeholderTextColor || theme.colors.text.tertiary}
          maxLength={maxLength}
          onChangeText={handleChangeText}
          value={field.value}
          editable={editable && !disabled}
          autoFocus={autoFocus}
          onContentSizeChange={handleContentSizeChange}
          scrollEnabled={textHeight >= maxHeight}
          accessibilityLabel={placeholder}
          accessibilityHint={fieldState.error ? fieldState.error.message : undefined}
          accessibilityState={{ required }}
          accessibilityMultiline={true}
        />
      </View>

      {(showCharacterCount && maxLength) && (
        <View style={styles.characterCountContainer}>
          <Text style={[
            styles.characterCount,
            isOverLimit && styles.characterCountError
          ]}>
            {characterCount}/{maxLength}
          </Text>
        </View>
      )}

      {fieldState.error && (
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={16} color={theme.colors.status.error} />
          <Text style={styles.errorText}>{fieldState.error.message}</Text>
        </View>
      )}
    </View>
  );
};

const useThemedStyles = createThemedStyles((theme) =>
  StyleSheet.create({
    container: {
      marginBottom: theme.componentSpacing.form.fieldGap,
    },
    textAreaContainer: {
      position: 'relative',
    },
    textArea: {
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[3],
      ...theme.typography.body.base,
      backgroundColor: theme.colors.background.primary,
      color: theme.colors.text.primary,
      textAlignVertical: 'top',
    },
    textAreaFocused: {
      borderColor: theme.colors.border.focused,
      borderWidth: 2,
      ...themeUtils.createShadow('sm', theme.colors.interactive.primary),
    },
    textAreaError: {
      borderColor: theme.colors.border.error,
      borderWidth: 2,
    },
    textAreaDisabled: {
      backgroundColor: theme.colors.background.secondary,
      borderColor: theme.colors.border.primary,
      color: theme.colors.text.disabled,
      opacity: 0.6,
    },
    characterCountContainer: {
      alignItems: 'flex-end',
      marginTop: theme.spacing[1],
    },
    characterCount: {
      ...theme.typography.caption.base,
      color: theme.colors.text.secondary,
    },
    characterCountError: {
      color: theme.colors.status.error,
    },
    errorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing[1],
      paddingHorizontal: theme.spacing[1],
    },
    errorText: {
      ...theme.typography.caption.base,
      color: theme.colors.status.error,
      marginLeft: theme.spacing[1],
      flex: 1,
    },
  })
);

const MemoizedCustomTextArea = React.memo(CustomTextArea);
export { MemoizedCustomTextArea as CustomTextArea };