import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

export interface SettingsCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  style?: any;
  showChevron?: boolean;
  badge?: string;
  variant?: 'default' | 'danger' | 'warning' | 'success';
}

export const SettingsCard: React.FC<SettingsCardProps> = ({
  title,
  subtitle,
  description,
  icon,
  iconColor,
  rightElement,
  onPress,
  disabled = false,
  style,
  showChevron = false,
  badge,
  variant = 'default',
}) => {
  const { theme } = useTheme();

  const getVariantColors = () => {
    switch (variant) {
      case 'danger':
        return {
          iconBg: `${theme.colors.status.error}15`,
          iconColor: iconColor || theme.colors.status.error,
          borderColor: theme.colors.status.errorBackground,
        };
      case 'warning':
        return {
          iconBg: `${theme.colors.status.warning}15`,
          iconColor: iconColor || theme.colors.status.warning,
          borderColor: theme.colors.status.warningBackground,
        };
      case 'success':
        return {
          iconBg: `${theme.colors.status.success}15`,
          iconColor: iconColor || theme.colors.status.success,
          borderColor: theme.colors.status.successBackground,
        };
      default:
        return {
          iconBg: `${theme.colors.interactive.primary}15`,
          iconColor: iconColor || theme.colors.interactive.primary,
          borderColor: 'transparent',
        };
    }
  };

  const variantColors = getVariantColors();
  const isInteractive = onPress && !disabled;

  const cardStyle = [
    {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      ...theme.elevation.sm,
      borderWidth: variant !== 'default' ? 1 : 0,
      borderColor: variantColors.borderColor,
      opacity: disabled ? 0.6 : 1,
    },
    style,
  ];

  const content = (
    <View style={cardStyle}>
      {/* Icon */}
      <View style={{
        width: 40,
        height: 40,
        backgroundColor: variantColors.iconBg,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing.md,
      }}>
        <Ionicons name={icon} size={20} color={variantColors.iconColor} />
      </View>
      
      {/* Content */}
      <View style={{ flex: 1, paddingRight: theme.spacing.sm }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{
            color: theme.colors.text.primary,
            fontSize: theme.fontSizes.base,
            fontWeight: theme.fontConfig.fontWeight.medium,
            flex: 1,
          }}>
            {title}
          </Text>
          
          {badge && (
            <View style={{
              backgroundColor: theme.colors.interactive.primary,
              paddingHorizontal: theme.spacing.sm,
              paddingVertical: theme.spacing.xs / 2,
              borderRadius: theme.borderRadius.full,
              marginLeft: theme.spacing.sm,
            }}>
              <Text style={{
                color: 'white',
                fontSize: theme.fontSizes.xs,
                fontWeight: theme.fontConfig.fontWeight.medium,
              }}>
                {badge}
              </Text>
            </View>
          )}
        </View>
        
        {subtitle && (
          <Text style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.sm,
            marginTop: theme.spacing.xs / 2,
            lineHeight: 18,
          }}>
            {subtitle}
          </Text>
        )}
        
        {description && (
          <Text style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.xs,
            marginTop: theme.spacing.xs,
            lineHeight: 16,
            opacity: 0.8,
          }}>
            {description}
          </Text>
        )}
      </View>
      
      {/* Right Element */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {rightElement}
        
        {showChevron && !rightElement && (
          <Ionicons 
            name="chevron-forward" 
            size={18} 
            color={theme.colors.text.secondary} 
            style={{ marginLeft: theme.spacing.xs }}
          />
        )}
      </View>
    </View>
  );

  if (isInteractive) {
    return (
      <Pressable
        onPress={onPress}
        android_ripple={{
          color: theme.colors.interactive.primary + '20',
          borderless: false,
        }}
        style={({ pressed }) => [
          { opacity: pressed ? 0.95 : 1 }
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return content;
};