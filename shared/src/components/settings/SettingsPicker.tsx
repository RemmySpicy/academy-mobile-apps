import React, { useState } from 'react';
import { View, Text, Modal, Pressable, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { CustomButton } from '../forms/CustomButton';

export interface PickerOption {
  label: string;
  value: string;
  description?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export interface SettingsPickerProps {
  title: string;
  options: PickerOption[];
  selectedValue: string;
  onSelectionChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const SettingsPicker: React.FC<SettingsPickerProps> = ({
  title,
  options,
  selectedValue,
  onSelectionChange,
  placeholder = 'Select an option',
  disabled = false,
}) => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  const selectedOption = options.find(option => option.value === selectedValue);

  const handleSelect = (value: string) => {
    onSelectionChange(value);
    setIsVisible(false);
  };

  const renderOption = ({ item }: { item: PickerOption }) => (
    <Pressable
      onPress={() => handleSelect(item.value)}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        backgroundColor: pressed ? theme.colors.interactive.primary + '10' : 'transparent',
        marginBottom: theme.spacing.xs,
      })}
    >
      {item.icon && (
        <View style={{
          width: 32,
          height: 32,
          backgroundColor: `${theme.colors.interactive.primary}15`,
          borderRadius: 16,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: theme.spacing.md,
        }}>
          <Ionicons name={item.icon} size={16} color={theme.colors.interactive.primary} />
        </View>
      )}
      
      <View style={{ flex: 1 }}>
        <Text style={{
          color: theme.colors.text.primary,
          fontSize: theme.fontSizes.base,
          fontWeight: theme.fontConfig.fontWeight.medium,
        }}>
          {item.label}
        </Text>
        
        {item.description && (
          <Text style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.sm,
            marginTop: theme.spacing.xs / 2,
          }}>
            {item.description}
          </Text>
        )}
      </View>
      
      {selectedValue === item.value && (
        <Ionicons 
          name="checkmark-circle" 
          size={20} 
          color={theme.colors.interactive.primary} 
        />
      )}
    </Pressable>
  );

  return (
    <>
      <Pressable
        onPress={() => !disabled && setIsVisible(true)}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.colors.background.primary,
          borderRadius: theme.borderRadius.md,
          padding: theme.spacing.md,
          borderWidth: 1,
          borderColor: theme.colors.border.primary,
          opacity: disabled ? 0.6 : pressed ? 0.95 : 1,
        })}
      >
        <View style={{ flex: 1 }}>
          <Text style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.sm,
            marginBottom: theme.spacing.xs / 2,
          }}>
            {title}
          </Text>
          
          <Text style={{
            color: theme.colors.text.primary,
            fontSize: theme.fontSizes.base,
            fontWeight: theme.fontConfig.fontWeight.medium,
          }}>
            {selectedOption?.label || placeholder}
          </Text>
        </View>
        
        <Ionicons 
          name="chevron-down" 
          size={16} 
          color={theme.colors.text.secondary} 
        />
      </Pressable>

      <Modal
        visible={isVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: theme.colors.background.secondary,
        }}>
          {/* Header */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: theme.spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border.primary,
            backgroundColor: theme.colors.background.primary,
          }}>
            <Text style={{
              color: theme.colors.text.primary,
              fontSize: theme.fontSizes.lg,
              fontWeight: theme.fontConfig.fontWeight.semibold,
            }}>
              {title}
            </Text>
            
            <Pressable
              onPress={() => setIsVisible(false)}
              style={{
                padding: theme.spacing.sm,
              }}
            >
              <Ionicons name="close" size={24} color={theme.colors.text.primary} />
            </Pressable>
          </View>

          {/* Options List */}
          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            renderItem={renderOption}
            contentContainerStyle={{
              padding: theme.spacing.md,
            }}
            showsVerticalScrollIndicator={false}
          />

          {/* Footer */}
          <View style={{
            padding: theme.spacing.md,
            backgroundColor: theme.colors.background.primary,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border.primary,
          }}>
            <CustomButton
              title="Cancel"
              variant="outlineTheme"
              onPress={() => setIsVisible(false)}
              size="md"
            />
          </View>
        </View>
      </Modal>
    </>
  );
};