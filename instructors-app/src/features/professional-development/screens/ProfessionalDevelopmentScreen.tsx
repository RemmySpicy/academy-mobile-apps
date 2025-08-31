import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@academy/mobile-shared';

export const ProfessionalDevelopmentScreen: React.FC = () => {
  const { theme } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.secondary }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.md,
          paddingTop: theme.spacing.lg,
          paddingBottom: theme.spacing['3xl'],
        }}
      >
        <View style={{
          backgroundColor: theme.colors.background.primary,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.xl,
          alignItems: 'center',
          ...theme.elevation.sm,
        }}>
          <Ionicons name="school" size={48} color={theme.colors.interactive.primary} style={{ marginBottom: theme.spacing.md }} />
          <Text style={{
            color: theme.colors.text.primary,
            fontSize: theme.fontSizes.xl,
            fontWeight: theme.fontConfig.fontWeight.bold,
            marginBottom: theme.spacing.sm,
          }}>
            Professional Development
          </Text>
          <Text style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.base,
            textAlign: 'center',
            marginBottom: theme.spacing.lg,
          }}>
            Access training courses, certifications, and professional development resources.
          </Text>
          <Pressable style={{
            backgroundColor: theme.colors.interactive.primary,
            borderRadius: theme.borderRadius.lg,
            paddingHorizontal: theme.spacing.xl,
            paddingVertical: theme.spacing.md,
          }}>
            <Text style={{
              color: 'white',
              fontSize: theme.fontSizes.base,
              fontWeight: theme.fontConfig.fontWeight.medium,
            }}>
              Start Learning
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};