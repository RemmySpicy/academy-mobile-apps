import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, {
  FadeInDown,
  FadeInRight,
  Layout,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { 
  useTheme, 
  createThemedStyles, 
  Badge
} from '@academy/mobile-shared';
import type { AttendanceStackParamList } from '../navigation/AttendanceNavigator';

type AttendanceMarkingScreenRouteProp = RouteProp<AttendanceStackParamList, 'AttendanceMarking'>;
type AttendanceMarkingScreenNavigationProp = NativeStackNavigationProp<AttendanceStackParamList, 'AttendanceMarking'>;

interface Student {
  id: string;
  name: string;
  avatar: string;
  status: 'present' | 'absent' | 'late' | 'not_marked';
  profileImage?: string;
  parentName?: string;
  parentPhone?: string;
  notes?: string;
}

interface AttendanceClass {
  id: string;
  name: string;
  level: string;
  time: string;
  date: string;
  location: string;
  studentsCount: number;
  attendanceMarked: boolean;
  students: Student[];
  instructorId: string;
}

interface StudentRowProps {
  student: Student;
  index: number;
  onStatusChange: (studentId: string, status: Student['status']) => void;
  disabled: boolean;
}

const StudentRow: React.FC<StudentRowProps> = ({ 
  student, 
  index, 
  onStatusChange, 
  disabled 
}) => {
  const { theme } = useTheme();
  const styles = useThemedStyles();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getStatusColor = (status: Student['status']) => {
    switch (status) {
      case 'present':
        return theme.colors.status.success;
      case 'absent':
        return theme.colors.status.error;
      case 'late':
        return theme.colors.status.warning;
      default:
        return theme.colors.text.tertiary;
    }
  };

  const getStatusIcon = (status: Student['status']) => {
    switch (status) {
      case 'present':
        return 'checkmark-circle';
      case 'absent':
        return 'close-circle';
      case 'late':
        return 'time';
      default:
        return 'help-circle-outline';
    }
  };

  const statusOptions: { status: Student['status']; label: string; icon: string }[] = [
    { status: 'present', label: 'Present', icon: 'checkmark-circle' },
    { status: 'late', label: 'Late', icon: 'time' },
    { status: 'absent', label: 'Absent', icon: 'close-circle' },
    { status: 'not_marked', label: 'Pending', icon: 'help-circle-outline' },
  ];

  return (
    <Animated.View
      layout={Layout.springify()}
      entering={FadeInRight.delay(index * 50).springify()}
    >
      <Animated.View style={animatedStyle}>
        <View style={styles.studentRow}>
          {/* Student Info */}
          <View style={styles.studentInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {student.avatar}
              </Text>
            </View>
            <View style={styles.studentDetails}>
              <Text style={styles.studentName}>{student.name}</Text>
              {student.parentName && (
                <Text style={styles.parentInfo}>
                  Parent: {student.parentName}
                </Text>
              )}
              {student.notes && (
                <Text style={styles.studentNotes} numberOfLines={1}>
                  {student.notes}
                </Text>
              )}
            </View>
          </View>

          {/* Status Buttons */}
          <View style={styles.statusButtonsContainer}>
            {statusOptions.map((option) => (
              <Pressable
                key={option.status}
                onPress={() => {
                  if (!disabled) {
                    scale.value = withSpring(0.95, undefined, () => {
                      scale.value = withSpring(1);
                    });
                    onStatusChange(student.id, option.status);
                  }
                }}
                style={[
                  styles.statusButton,
                  {
                    backgroundColor: student.status === option.status 
                      ? getStatusColor(option.status)
                      : theme.colors.background.secondary,
                    opacity: disabled ? 0.6 : 1,
                  }
                ]}
                disabled={disabled}
              >
                <Ionicons
                  name={option.icon as any}
                  size={16}
                  color={
                    student.status === option.status
                      ? theme.colors.text.inverse
                      : theme.colors.text.secondary
                  }
                />
                <Text
                  style={[
                    styles.statusButtonText,
                    {
                      color: student.status === option.status
                        ? theme.colors.text.inverse
                        : theme.colors.text.secondary,
                    }
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

/**
 * Attendance Marking Screen
 * 
 * Features:
 * - Individual student attendance marking
 * - Bulk attendance actions
 * - Real-time attendance status updates
 * - Notes for individual students
 * - Parent contact information
 * - Save and submit functionality
 */
export const AttendanceMarkingScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = useThemedStyles();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<AttendanceMarkingScreenNavigationProp>();
  const route = useRoute<AttendanceMarkingScreenRouteProp>();

  // Get class data from navigation params
  const { classId, classData } = route.params;

  // Initialize students state
  const [students, setStudents] = useState<Student[]>(classData?.students || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleStatusChange = useCallback((studentId: string, status: Student['status']) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId 
        ? { ...student, status }
        : student
    ));
    setHasChanges(true);
  }, []);

  const handleBulkAction = (status: Student['status']) => {
    const actionLabels = {
      present: 'Present',
      absent: 'Absent', 
      late: 'Late',
      not_marked: 'Pending'
    };

    Alert.alert(
      `Mark All ${actionLabels[status]}`,
      `Are you sure you want to mark all students as ${actionLabels[status].toLowerCase()}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            setStudents(prev => prev.map(student => ({ ...student, status })));
            setHasChanges(true);
          }
        }
      ]
    );
  };


  const handleSave = async (shouldSubmit: boolean = false) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement API call to save attendance
      console.log('Saving attendance:', {
        classId,
        students: students.map(s => ({ id: s.id, status: s.status })),
        submitted: shouldSubmit,
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setHasChanges(false);
      
      if (shouldSubmit) {
        Alert.alert(
          'Attendance Submitted',
          'Attendance has been successfully submitted.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert('Attendance Saved', 'Your changes have been saved as draft.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save attendance. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (hasChanges) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Do you want to save before leaving?',
        [
          { text: 'Discard', onPress: () => navigation.goBack() },
          { text: 'Save', onPress: () => handleSave(false).then(() => navigation.goBack()) },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  // Calculate stats
  const presentCount = students.filter(s => s.status === 'present').length;
  const absentCount = students.filter(s => s.status === 'absent').length;
  const lateCount = students.filter(s => s.status === 'late').length;
  const notMarkedCount = students.filter(s => s.status === 'not_marked').length;

  const completionPercentage = Math.round(((students.length - notMarkedCount) / students.length) * 100);

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={[styles.header, { paddingTop: insets.top + theme.spacing.sm }]}>
        <View style={styles.headerContent}>
          <Pressable onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
          </Pressable>
          
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Mark Attendance</Text>
          </View>

          <Pressable
            onPress={() => handleSave(true)}
            disabled={isSubmitting || notMarkedCount > 0}
            style={[
              styles.headerSubmitButton,
              {
                opacity: (isSubmitting || notMarkedCount > 0) ? 0.5 : 1,
                backgroundColor: (isSubmitting || notMarkedCount > 0) 
                  ? theme.colors.background.secondary 
                  : theme.colors.interactive.primary,
              }
            ]}
          >
            <Text style={[
              styles.headerSubmitButtonText,
              {
                color: (isSubmitting || notMarkedCount > 0) 
                  ? theme.colors.text.secondary 
                  : theme.colors.text.inverse,
              }
            ]}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Class Info Card */}
      <Animated.View
        entering={FadeInDown.delay(200).springify()}
        style={styles.classInfoContainer}
      >
        <View style={styles.classInfoCard}>
          <View style={styles.classInfoHeader}>
            <View>
              <Text style={styles.classInfoTitle}>{classData?.name}</Text>
              <Text style={styles.classInfoSubtitle}>{classData?.level}</Text>
            </View>
            <View style={styles.classInfoDetails}>
              <Text style={styles.classInfoTime}>{classData?.time}</Text>
              <Text style={styles.classInfoDate}>{classData?.date}</Text>
              <Text style={styles.classInfoLocation}>{classData?.location}</Text>
            </View>
          </View>
          
          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={[styles.statIndicator, { backgroundColor: theme.colors.status.success }]} />
              <Text style={styles.statLabel}>Present</Text>
              <Text style={styles.statValue}>{presentCount}</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIndicator, { backgroundColor: theme.colors.status.warning }]} />
              <Text style={styles.statLabel}>Late</Text>
              <Text style={styles.statValue}>{lateCount}</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIndicator, { backgroundColor: theme.colors.status.error }]} />
              <Text style={styles.statLabel}>Absent</Text>
              <Text style={styles.statValue}>{absentCount}</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIndicator, { backgroundColor: theme.colors.text.tertiary }]} />
              <Text style={styles.statLabel}>Pending</Text>
              <Text style={styles.statValue}>{notMarkedCount}</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Bulk Actions */}
      <Animated.View
        entering={FadeInDown.delay(300).springify()}
        style={styles.bulkActionsContainer}
      >
        <Text style={styles.bulkActionsTitle}>Quick Actions</Text>
        <View style={styles.bulkActionsGrid}>
          <Pressable
            onPress={() => handleBulkAction('present')}
            style={[styles.bulkActionButton, { backgroundColor: theme.colors.status.success }]}
          >
            <Ionicons name="checkmark-circle" size={18} color={theme.colors.text.inverse} />
            <Text style={styles.bulkActionText}>All Present</Text>
          </Pressable>
          
          <Pressable
            onPress={() => handleBulkAction('absent')}
            style={[styles.bulkActionButton, { backgroundColor: theme.colors.status.error }]}
          >
            <Ionicons name="close-circle" size={18} color={theme.colors.text.inverse} />
            <Text style={styles.bulkActionText}>All Absent</Text>
          </Pressable>
          
          <Pressable
            onPress={() => handleBulkAction('not_marked')}
            style={[styles.bulkActionButton, { backgroundColor: theme.colors.text.tertiary }]}
          >
            <Ionicons name="refresh" size={18} color={theme.colors.text.inverse} />
            <Text style={styles.bulkActionText}>Reset All</Text>
          </Pressable>
        </View>
      </Animated.View>

      {/* Students List */}
      <ScrollView
        style={styles.studentsContainer}
        contentContainerStyle={[
          styles.studentsContent,
          { paddingBottom: 80 + insets.bottom } // Space for tab bar only
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.delay(400).springify()}>
          <Text style={styles.studentsTitle}>
            Students ({students.length})
          </Text>
          
          {students.map((student, index) => (
            <StudentRow
              key={student.id}
              student={student}
              index={index}
              onStatusChange={handleStatusChange}
              disabled={isSubmitting}
            />
          ))}
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
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.md,
    },
    backButton: {
      padding: theme.spacing.xs,
      marginRight: theme.spacing.sm,
    },
    headerTextContainer: {
      flex: 1,
    },
    headerTitle: {
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
    },
    headerSubmitButton: {
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    headerSubmitButtonText: {
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
    classInfoContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.md,
    },
    classInfoCard: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      shadowColor: theme.colors.shadow.default,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 2,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    classInfoHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.md,
    },
    classInfoTitle: {
      fontSize: theme.fontSizes.base,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
    },
    classInfoSubtitle: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text.secondary,
    },
    classInfoDetails: {
      alignItems: 'flex-end',
    },
    classInfoTime: {
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: theme.colors.interactive.primary,
    },
    classInfoDate: {
      fontSize: theme.fontSizes.xs,
      color: theme.colors.text.secondary,
    },
    classInfoLocation: {
      fontSize: theme.fontSizes.xs,
      color: theme.colors.text.tertiary,
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.sm,
    },
    statItem: {
      alignItems: 'center',
      flex: 1,
    },
    statIndicator: {
      width: 12,
      height: 12,
      borderRadius: theme.borderRadius.full,
      marginBottom: theme.spacing.xs,
    },
    statLabel: {
      fontSize: theme.fontSizes.xs,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.xs,
    },
    statValue: {
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
    },
    bulkActionsContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.md,
    },
    bulkActionsTitle: {
      fontSize: theme.fontSizes.base,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.sm,
    },
    bulkActionsGrid: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      flexWrap: 'wrap',
    },
    bulkActionButton: {
      minWidth: 100,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
    },
    bulkActionText: {
      color: theme.colors.text.inverse,
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
      marginLeft: theme.spacing.xs,
    },
    studentsContainer: {
      flex: 1,
    },
    studentsContent: {
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.lg,
    },
    studentsTitle: {
      fontSize: theme.fontSizes.base,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.md,
    },
    studentRow: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      shadowColor: theme.colors.shadow.default,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    studentInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.interactive.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      color: theme.colors.text.inverse,
      fontSize: theme.fontSizes.base,
      fontWeight: theme.fontConfig.fontWeight.semibold,
    },
    studentDetails: {
      flex: 1,
      marginLeft: theme.spacing.sm,
    },
    studentName: {
      fontSize: theme.fontSizes.base,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: theme.colors.text.primary,
    },
    parentInfo: {
      fontSize: theme.fontSizes.xs,
      color: theme.colors.text.secondary,
      marginTop: theme.spacing.xs,
    },
    studentNotes: {
      fontSize: theme.fontSizes.xs,
      color: theme.colors.text.tertiary,
      fontStyle: 'italic',
      marginTop: theme.spacing.xs,
    },
    statusButtonsContainer: {
      flexDirection: 'row',
      gap: theme.spacing.xs,
      flexWrap: 'wrap',
    },
    statusButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    statusButtonText: {
      fontSize: theme.fontSizes.xs,
      fontWeight: theme.fontConfig.fontWeight.medium,
      marginLeft: theme.spacing.xs,
    },
  })
);