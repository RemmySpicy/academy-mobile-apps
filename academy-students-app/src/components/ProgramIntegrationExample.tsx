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
 * Example component demonstrating program context integration for student app
 * 
 * This shows how to:
 * 1. Display program information for students/parents
 * 2. Allow program switching (if student is enrolled in multiple programs)
 * 3. Show role-appropriate content
 * 4. Use program context for student-specific features
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
          My Programs
        </Text>
        <ProgramSelector variant="card" />
        <Text style={[theme.typography.body.small, { color: theme.colors.text.tertiary, marginTop: theme.spacing[2] }]}>
          Switch between programs you're enrolled in
        </Text>
      </View>

      {/* Student Content */}
      <ProgramGuard requiredRole="student">
        <View style={[componentThemes.card.default(theme), { marginBottom: theme.spacing[4] }]}>
          <Text style={[theme.typography.heading.h4, { color: theme.colors.text.primary, marginBottom: theme.spacing[3] }]}>
            Student Dashboard
          </Text>
          <Text style={[theme.typography.body.base, { color: theme.colors.text.secondary }]}>
            • View your courses and progress{'\n'}
            • Book new sessions{'\n'}
            • Track achievements{'\n'}
            • Access course materials
          </Text>
        </View>
      </ProgramGuard>

      {/* Parent Content */}
      <ProgramGuard requiredRole="parent">
        <View style={[componentThemes.card.default(theme), { marginBottom: theme.spacing[4] }]}>
          <Text style={[theme.typography.heading.h4, { color: theme.colors.text.primary, marginBottom: theme.spacing[3] }]}>
            Parent Dashboard
          </Text>
          <Text style={[theme.typography.body.base, { color: theme.colors.text.secondary }]}>
            • Monitor child's progress{'\n'}
            • Communicate with instructors{'\n'}
            • Manage bookings and payments{'\n'}
            • View reports and achievements
          </Text>
        </View>
      </ProgramGuard>

      {/* Student/Parent Shared Content */}
      <ProgramGuard minimumRoleLevel="student">
        <View style={[componentThemes.card.default(theme), { marginBottom: theme.spacing[4] }]}>
          <Text style={[theme.typography.heading.h4, { color: theme.colors.text.primary, marginBottom: theme.spacing[3] }]}>
            Program Resources
          </Text>
          <Text style={[theme.typography.body.base, { color: theme.colors.text.secondary }]}>
            • Schedule and calendar{'\n'}
            • Program announcements{'\n'}
            • Contact information{'\n'}
            • FAQ and support
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
              <Text style={[{ fontWeight: 'bold', color: theme.colors.text.primary }]}>Program:</Text> {currentProgram.name}
            </Text>
            <Text style={[theme.typography.body.base, { color: theme.colors.text.secondary, marginTop: theme.spacing[1] }]}>
              <Text style={[{ fontWeight: 'bold', color: theme.colors.text.primary }]}>Role:</Text> {currentProgram.user_role || 'Student'}
            </Text>
            <Text style={[theme.typography.body.base, { color: theme.colors.text.secondary, marginTop: theme.spacing[1] }]}>
              <Text style={[{ fontWeight: 'bold', color: theme.colors.text.primary }]}>Enrollment:</Text> {currentProgram.is_active ? 'Active' : 'Inactive'}
            </Text>
            {currentProgram.description && (
              <Text style={[theme.typography.body.base, { color: theme.colors.text.secondary, marginTop: theme.spacing[2] }]}>
                {currentProgram.description}
              </Text>
            )}
          </View>
        ) : (
          <Text style={[theme.typography.body.base, { color: theme.colors.text.tertiary }]}>
            No program enrollment found
          </Text>
        )}
      </View>

      {/* Integration Notes for Developers */}
      <View style={[componentThemes.alert.info(theme), { marginBottom: theme.spacing[4] }]}>
        <Text style={[theme.typography.heading.h5, { color: theme.colors.status.info, marginBottom: theme.spacing[2] }]}>
          Student App Integration
        </Text>
        <Text style={[theme.typography.body.small, { color: theme.colors.text.primary }]}>
          • All course data is automatically filtered by program{'\n'}
          • Progress tracking is program-specific{'\n'}
          • Bookings are made within program context{'\n'}
          • Payments are handled per program
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