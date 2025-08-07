import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { 
  ProgramSelector, 
  ProgramHeader, 
  ProgramGuard,
  useProgramContext,
  useTheme,
  componentThemes
} from '@shared';

/**
 * Example component demonstrating program context integration
 * 
 * This shows how to:
 * 1. Use ProgramContextProvider (should be in App.tsx)
 * 2. Display current program info
 * 3. Allow program switching
 * 4. Protect content based on user roles
 * 5. Use program context in data fetching
 */
export function ProgramIntegrationExample() {
  const { currentProgram } = useProgramContext();
  const theme = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      {/* Program Header */}
      <View style={[componentThemes.card.default(theme), { marginBottom: theme.spacing[4] }]}>
        <ProgramHeader showDescription textAlign="center" />
      </View>

      {/* Program Selector */}
      <View style={[componentThemes.card.default(theme), { marginBottom: theme.spacing[4] }]}>
        <Text style={[theme.typography.heading.h4, { color: theme.colors.text.primary, marginBottom: theme.spacing[3] }]}>
          Switch Programs
        </Text>
        <ProgramSelector variant="card" />
      </View>

      {/* Role-Based Content */}
      <ProgramGuard requiredRole="program_coordinator">
        <View style={[componentThemes.card.default(theme), { marginBottom: theme.spacing[4] }]}>
          <Text style={[theme.typography.heading.h4, { color: theme.colors.text.primary, marginBottom: theme.spacing[3] }]}>
            Coordinator Features
          </Text>
          <Text style={[theme.typography.body.base, { color: theme.colors.text.secondary }]}>
            This content is only visible to program coordinators and above.
          </Text>
        </View>
      </ProgramGuard>

      <ProgramGuard minimumRoleLevel="tutor">
        <View style={[componentThemes.card.default(theme), { marginBottom: theme.spacing[4] }]}>
          <Text style={[theme.typography.heading.h4, { color: theme.colors.text.primary, marginBottom: theme.spacing[3] }]}>
            Instructor Features
          </Text>
          <Text style={[theme.typography.body.base, { color: theme.colors.text.secondary }]}>
            This content is visible to tutors, coordinators, and admins.
          </Text>
        </View>
      </ProgramGuard>

      {/* Program Info Display */}
      <View style={[componentThemes.card.default(theme), { marginBottom: theme.spacing[4] }]}>
        <Text style={[theme.typography.heading.h4, { color: theme.colors.text.primary, marginBottom: theme.spacing[3] }]}>
          Current Program Details
        </Text>
        {currentProgram ? (
          <View>
            <Text style={[theme.typography.body.base, { color: theme.colors.text.secondary }]}>
              <Text style={[{ fontWeight: 'bold', color: theme.colors.text.primary }]}>ID:</Text> {currentProgram.id}
            </Text>
            <Text style={[theme.typography.body.base, { color: theme.colors.text.secondary, marginTop: theme.spacing[1] }]}>
              <Text style={[{ fontWeight: 'bold', color: theme.colors.text.primary }]}>Name:</Text> {currentProgram.name}
            </Text>
            <Text style={[theme.typography.body.base, { color: theme.colors.text.secondary, marginTop: theme.spacing[1] }]}>
              <Text style={[{ fontWeight: 'bold', color: theme.colors.text.primary }]}>Your Role:</Text> {currentProgram.user_role || 'Unknown'}
            </Text>
            <Text style={[theme.typography.body.base, { color: theme.colors.text.secondary, marginTop: theme.spacing[1] }]}>
              <Text style={[{ fontWeight: 'bold', color: theme.colors.text.primary }]}>Status:</Text> {currentProgram.is_active ? 'Active' : 'Inactive'}
            </Text>
          </View>
        ) : (
          <Text style={[theme.typography.body.base, { color: theme.colors.text.tertiary }]}>
            No program context available
          </Text>
        )}
      </View>

      {/* Integration Instructions */}
      <View style={[componentThemes.alert.info(theme), { marginBottom: theme.spacing[4] }]}>
        <Text style={[theme.typography.heading.h5, { color: theme.colors.status.info, marginBottom: theme.spacing[2] }]}>
          Integration Instructions
        </Text>
        <Text style={[theme.typography.body.small, { color: theme.colors.text.primary }]}>
          1. Wrap your app with ProgramContextProvider{'\n'}
          2. All API requests will automatically include program context{'\n'}
          3. Use ProgramGuard to protect role-based content{'\n'}
          4. Use useProgramContext() hook to access current program data
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default ProgramIntegrationExample;