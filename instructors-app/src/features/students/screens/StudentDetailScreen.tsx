import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInRight,
} from 'react-native-reanimated';
import { useTheme, createThemedStyles } from '@academy/mobile-shared';
import type { ScreenProps, StudentsStackParamList } from '../types';

type StudentDetailScreenProps = ScreenProps<StudentsStackParamList, 'StudentDetail'>;

/**
 * Student Detail Screen
 * 
 * Features:
 * - Detailed student information
 * - Progress tracking
 * - Attendance history
 * - Notes and assessments
 * - Contact information
 */
export const StudentDetailScreen: React.FC<StudentDetailScreenProps> = ({ route, navigation }) => {
  const { studentId, studentName } = route.params;
  const { theme } = useTheme();
  const styles = useThemedStyles();
  const insets = useSafeAreaInsets();

  // Mock student data - replace with real API call
  const student = {
    id: studentId,
    name: studentName,
    level: 'Swimming Level 2',
    progress: 75,
    attendance: 92,
    joinDate: '2024-01-15',
    age: 12,
    parentName: 'Sarah Johnson',
    parentPhone: '+1 (555) 123-4567',
    parentEmail: 'sarah.johnson@email.com',
    notes: 'Excellent swimmer, shows great improvement in backstroke technique.',
    nextSession: '2024-02-15 10:00 AM',
    totalSessions: 24,
    completedSessions: 18,
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View
        entering={FadeInDown.delay(100).springify()}
        style={[styles.header, { paddingTop: insets.top + 16 }]}
      >
        <View style={styles.headerContent}>
          <Pressable 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text.secondary} />
          </Pressable>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{student.name}</Text>
            <Text style={styles.headerSubtitle}>{student.level}</Text>
          </View>
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Student Avatar & Basic Info */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={styles.sectionContainer}
        >
          <View style={styles.avatarCard}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </Text>
            </View>
            <Text style={styles.studentName}>{student.name}</Text>
            <Text style={styles.studentLevel}>{student.level}</Text>
            <Text style={styles.studentAge}>Age: {student.age}</Text>
          </View>
        </Animated.View>

        {/* Progress & Stats */}
        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          style={styles.progressContainer}
        >
          <View style={styles.progressCard}>
            <Text style={styles.sectionTitle}>Progress Overview</Text>
            
            <View style={styles.progressBarsContainer}>
              <View style={styles.progressBarSection}>
                <Text style={styles.progressLabel}>Overall Progress</Text>
                <View style={styles.progressBarBackground}>
                  <View 
                    style={[styles.progressBarFill, styles.progressBarPrimary, { width: `${student.progress}%` }]}
                  />
                </View>
                <Text style={styles.progressPercentage}>{student.progress}%</Text>
              </View>
              <View style={styles.progressBarSection}>
                <Text style={styles.progressLabel}>Attendance Rate</Text>
                <View style={styles.progressBarBackground}>
                  <View 
                    style={[styles.progressBarFill, styles.progressBarSuccess, { width: `${student.attendance}%` }]}
                  />
                </View>
                <Text style={styles.progressPercentage}>{student.attendance}%</Text>
              </View>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{student.completedSessions}</Text>
                <Text style={styles.statLabel}>Sessions Completed</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{student.totalSessions}</Text>
                <Text style={styles.statLabel}>Total Sessions</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{student.totalSessions - student.completedSessions}</Text>
                <Text style={styles.statLabel}>Remaining</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Parent Information */}
        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          style={styles.progressContainer}
        >
          <View style={styles.progressCard}>
            <Text style={styles.sectionTitle}>Parent Information</Text>
            
            <View style={styles.parentInfoContainer}>
              <View style={styles.parentInfoItem}>
                <Ionicons name="person-outline" size={20} color={theme.colors.text.tertiary} />
                <Text style={styles.parentInfoText}>{student.parentName}</Text>
              </View>
              <View style={styles.parentInfoItem}>
                <Ionicons name="call-outline" size={20} color={theme.colors.text.tertiary} />
                <Text style={styles.parentInfoText}>{student.parentPhone}</Text>
              </View>
              <View style={styles.parentInfoItem}>
                <Ionicons name="mail-outline" size={20} color={theme.colors.text.tertiary} />
                <Text style={styles.parentInfoText}>{student.parentEmail}</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Notes & Assessments */}
        <Animated.View
          entering={FadeInDown.delay(500).springify()}
          style={styles.progressContainer}
        >
          <View style={styles.progressCard}>
            <View style={styles.notesHeader}>
              <Text style={styles.sectionTitle}>Notes & Assessments</Text>
              <Pressable style={styles.addButton}>
                <Ionicons name="add" size={24} color={theme.colors.interactive.accent} />
              </Pressable>
            </View>
            
            <View style={styles.notesContainer}>
              <Text style={styles.notesText}>{student.notes}</Text>
              <Text style={styles.notesTimestamp}>Last updated: 3 days ago</Text>
            </View>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View
          entering={FadeInDown.delay(600).springify()}
          style={styles.actionsContainer}
        >
          <View style={styles.actionsWrapper}>
            <Pressable style={styles.primaryActionButton}>
              <View style={styles.actionButtonContent}>
                <Ionicons name="checkmark-circle" size={20} color={theme.colors.text.inverse} />
                <Text style={styles.primaryActionText}>Mark Attendance</Text>
              </View>
            </Pressable>
            
            <View style={styles.secondaryActionsRow}>
              <Pressable style={styles.secondaryActionButton}>
                <View style={styles.secondaryActionContent}>
                  <Ionicons name="clipboard-outline" size={20} color={theme.colors.text.secondary} />
                  <Text style={styles.secondaryActionText}>Add Note</Text>
                </View>
              </Pressable>
              <Pressable style={styles.secondaryActionButton}>
                <View style={styles.secondaryActionContent}>
                  <Ionicons name="call-outline" size={20} color={theme.colors.text.secondary} />
                  <Text style={styles.secondaryActionText}>Contact Parent</Text>
                </View>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const useThemedStyles = createThemedStyles((theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    },
    header: {
      backgroundColor: theme.colors.background.primary,
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.md,
      shadowColor: theme.colors.shadow.default,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      marginRight: theme.spacing.md,
      padding: theme.spacing.sm,
    },
    headerTextContainer: {
      flex: 1,
    },
    headerTitle: {
      fontSize: theme.fontSizes.xl,
      fontWeight: theme.fontConfig.fontWeight.bold,
      color: theme.colors.text.primary,
    },
    headerSubtitle: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text.secondary,
      marginTop: theme.spacing.xs,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 100, // Space for tab bar
    },
    sectionContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.lg,
    },
    avatarCard: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      alignItems: 'center',
      shadowColor: theme.colors.shadow.default,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 2,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    avatarContainer: {
      width: 80,
      height: 80,
      backgroundColor: theme.colors.status.infoBackground,
      borderRadius: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.md,
    },
    avatarText: {
      color: theme.colors.interactive.accent,
      fontSize: theme.fontSizes['2xl'],
      fontWeight: theme.fontConfig.fontWeight.bold,
    },
    studentName: {
      fontSize: theme.fontSizes.xl,
      fontWeight: theme.fontConfig.fontWeight.bold,
      color: theme.colors.text.primary,
    },
    studentLevel: {
      fontSize: theme.fontSizes.base,
      color: theme.colors.text.secondary,
      marginTop: theme.spacing.xs,
    },
    studentAge: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text.tertiary,
      marginTop: theme.spacing.xs,
    },
    progressContainer: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    progressCard: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      shadowColor: theme.colors.shadow.default,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 2,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    sectionTitle: {
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.md,
    },
    progressBarsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.md,
    },
    progressBarSection: {
      flex: 1,
      marginHorizontal: theme.spacing.sm,
    },
    progressLabel: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.sm,
    },
    progressBarBackground: {
      backgroundColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.full,
      height: 12,
    },
    progressBarFill: {
      height: 12,
      borderRadius: theme.borderRadius.full,
    },
    progressBarPrimary: {
      backgroundColor: theme.colors.interactive.accent,
    },
    progressBarSuccess: {
      backgroundColor: theme.colors.status.success,
    },
    progressPercentage: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text.secondary,
      marginTop: theme.spacing.xs,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    statItem: {
      alignItems: 'center',
    },
    statNumber: {
      fontSize: theme.fontSizes['2xl'],
      fontWeight: theme.fontConfig.fontWeight.bold,
      color: theme.colors.text.primary,
    },
    statLabel: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text.secondary,
    },
    parentInfoContainer: {
      gap: theme.spacing.md,
    },
    parentInfoItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    parentInfoText: {
      fontSize: theme.fontSizes.base,
      color: theme.colors.text.secondary,
      marginLeft: theme.spacing.md,
    },
    notesHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.md,
    },
    addButton: {
      padding: theme.spacing.sm,
    },
    notesContainer: {
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
    },
    notesText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text.secondary,
    },
    notesTimestamp: {
      fontSize: theme.fontSizes.xs,
      color: theme.colors.text.tertiary,
      marginTop: theme.spacing.sm,
    },
    actionsContainer: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing['2xl'],
    },
    actionsWrapper: {
      gap: theme.spacing.md,
    },
    primaryActionButton: {
      backgroundColor: theme.colors.interactive.accent,
      borderRadius: theme.borderRadius.xl,
      paddingVertical: theme.spacing.md,
    },
    actionButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    primaryActionText: {
      color: theme.colors.text.inverse,
      fontSize: theme.fontSizes.base,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      marginLeft: theme.spacing.sm,
    },
    secondaryActionsRow: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    secondaryActionButton: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      paddingVertical: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    secondaryActionContent: {
      alignItems: 'center',
    },
    secondaryActionText: {
      color: theme.colors.text.primary,
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
      marginTop: theme.spacing.xs,
    },
  })
);