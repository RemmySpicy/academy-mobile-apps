import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@academy/mobile-shared';

export const GradeBookScreen: React.FC = () => {
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
          <Ionicons name="library" size={48} color={theme.colors.status.warning} style={{ marginBottom: theme.spacing.md }} />
          <Text style={{
            color: theme.colors.text.primary,
            fontSize: theme.fontSizes.xl,
            fontWeight: theme.fontConfig.fontWeight.bold,
            marginBottom: theme.spacing.sm,
          }}>
            Grade Book
          </Text>
          <Text style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.base,
            textAlign: 'center',
            marginBottom: theme.spacing.lg,
          }}>
            Manage student grades, assignments, and academic progress tracking.
          </Text>
          <Pressable style={{
            backgroundColor: theme.colors.status.warning,
            borderRadius: theme.borderRadius.lg,
            paddingHorizontal: theme.spacing.xl,
            paddingVertical: theme.spacing.md,
          }}>
            <Text style={{
              color: 'white',
              fontSize: theme.fontSizes.base,
              fontWeight: theme.fontConfig.fontWeight.medium,
            }}>
              View Gradebook
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};