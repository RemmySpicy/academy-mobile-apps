import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, KeyboardTypeOptions, StyleSheet } from 'react-native';
import { useController } from 'react-hook-form';
import { Iconify } from 'react-native-iconify';
import { FormFieldProps } from '../../types';

interface CustomTextAreaProps extends FormFieldProps {
  numberOfLines?: number;
  maxLength?: number;
  keyboardType?: KeyboardTypeOptions;
  handleOnChange?: (value: string) => void;
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
  handleOnChange,
  numberOfLines = 4,
  keyboardType = "default",
  maxLength,
  defaultValue,
  editable = true,
  disabled = false,
  required = false,
  placeholderTextColor = "#9CA3AF",
  autoFocus = false,
  showCharacterCount = false,
  minHeight = 96,
  maxHeight = 200,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [textHeight, setTextHeight] = useState(minHeight);

  const { field, fieldState } = useController({
    name,
    control,
    defaultValue: defaultValue || "",
  });

  const handleChangeText = useCallback((text: string) => {
    field.onChange(text);
    if (handleOnChange) {
      handleOnChange(text);
    }
  }, [field, handleOnChange]);

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
    const baseStyle = [
      styles.textArea,
      { height: textHeight }
    ];
    
    if (isFocused) {
      baseStyle.push(styles.textAreaFocused);
    }
    
    if (fieldState.error) {
      baseStyle.push(styles.textAreaError);
    }
    
    if (disabled) {
      baseStyle.push(styles.textAreaDisabled);
    }
    
    return baseStyle;
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
          placeholderTextColor={placeholderTextColor}
          maxLength={maxLength}
          onChangeText={handleChangeText}
          value={field.value}
          editable={editable && !disabled}
          autoFocus={autoFocus}
          onContentSizeChange={handleContentSizeChange}
          scrollEnabled={textHeight >= maxHeight}
          accessibilityLabel={placeholder}
          accessibilityHint={fieldState.error ? fieldState.error.message : undefined}
          accessibilityRequired={required}
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
          <Iconify icon="ri:error-warning-line" size={16} color="#EF4444" />
          <Text style={styles.errorText}>{fieldState.error.message}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  textAreaContainer: {
    position: 'relative',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#111827',
    fontWeight: '400',
    lineHeight: 22,
  },
  textAreaFocused: {
    borderColor: '#3B82F6',
    borderWidth: 2,
    shadowColor: '#3B82F6',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  textAreaError: {
    borderColor: '#EF4444',
    borderWidth: 2,
  },
  textAreaDisabled: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
    color: '#9CA3AF',
  },
  characterCountContainer: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  characterCount: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '400',
  },
  characterCountError: {
    color: '#EF4444',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingHorizontal: 4,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginLeft: 6,
    flex: 1,
    fontWeight: '400',
  },
});

export default React.memo(CustomTextArea);