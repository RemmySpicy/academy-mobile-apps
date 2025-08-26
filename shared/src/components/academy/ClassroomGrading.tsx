import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// Note: @gorhom/bottom-sheet would be imported when available
// import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { useScreenDimensions } from '../../hooks';

export interface GradingStudent {
  id: string;
  name: string;
  stars: number;
  groupId?: string;
  groupName?: string;
  progress?: number;
  level?: string;
  imageUrl?: string;
}

export interface GradingGroup {
  id: string;
  name: string;
  studentCount: number;
  color?: string;
}

export interface LessonInfo {
  id: string;
  title: string;
  description?: string;
  maxStars: number;
}

export interface ClassroomGradingProps {
  lesson: LessonInfo;
  students: GradingStudent[];
  groups: GradingGroup[];
  onClose?: () => void;
  onStudentGradeChange?: (studentId: string, stars: number) => void;
  onGroupAssignmentChange?: (studentId: string, groupId: string | null) => void;
  onSearch?: (query: string) => void;
  showSearch?: boolean;
  showGrouping?: boolean;
  defaultView?: 'progress' | 'group';
}

const ClassroomGrading: React.FC<ClassroomGradingProps> = ({
  lesson,
  students,
  groups,
  onClose,
  onStudentGradeChange,
  onGroupAssignmentChange,
  onSearch,
  showSearch = true,
  showGrouping = true,
  defaultView = 'progress',
}) => {
  const { theme } = useTheme();
  const { isTablet } = useScreenDimensions();
  const styles = createStyles(theme, isTablet);

  const [activeView, setActiveView] = useState<'progress' | 'group'>(defaultView);
  const [selectedStarFilter, setSelectedStarFilter] = useState<number | 'all'>('all');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // const bottomSheetRef = useRef<BottomSheet>(null);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleSheetChanges = useCallback(
    (index: number) => {
      Animated.timing(fadeAnim, {
        toValue: index === -1 ? 0 : 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    },
    [fadeAnim]
  );

  const handleGroupSelection = () => {
    setShowGroupModal(true);
  };

  const handleBackdropPress = useCallback(() => {
    setShowGroupModal(false);
  }, []);

  const filteredStudents = students.filter(student => {
    // Search filter
    if (searchQuery && !student.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Star filter (only in progress view)
    if (activeView === 'progress' && selectedStarFilter !== 'all') {
      if (student.stars !== selectedStarFilter) {
        return false;
      }
    }

    // Group filter (only in group view)
    if (activeView === 'group' && selectedGroupFilter !== 'all') {
      if (selectedGroupFilter === 'ungrouped') {
        return !student.groupId;
      }
      return student.groupId === selectedGroupFilter;
    }

    return true;
  });

  const getStarFilterOptions = () => {
    const options: Array<{ label: string; value: number | 'all' }> = [
      { label: 'All stars', value: 'all' as const }
    ];
    for (let i = 0; i <= lesson.maxStars; i++) {
      options.push({ label: `${i} Stars`, value: i });
    }
    return options;
  };

  const getGroupFilterOptions = () => {
    const ungroupedCount = students.filter(s => !s.groupId).length;
    const options = [
      { label: `Ungrouped: ${ungroupedCount}`, value: 'ungrouped' },
    ];
    
    groups.forEach(group => {
      const count = students.filter(s => s.groupId === group.id).length;
      options.push({ label: `${group.name}: ${count}`, value: group.id });
    });
    
    return options;
  };

  const renderStarFilter = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.filterScrollView}
    >
      {getStarFilterOptions().map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.filterChip,
            selectedStarFilter === option.value && styles.filterChipActive,
          ]}
          onPress={() => setSelectedStarFilter(option.value)}
        >
          <Text style={[
            styles.filterChipText,
            selectedStarFilter === option.value && styles.filterChipTextActive,
          ]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderGroupFilter = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.filterScrollView}
    >
      {getGroupFilterOptions().map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.filterChip,
            selectedGroupFilter === option.value && styles.filterChipActive,
          ]}
          onPress={() => setSelectedGroupFilter(option.value)}
        >
          <Text style={[
            styles.filterChipText,
            selectedGroupFilter === option.value && styles.filterChipTextActive,
          ]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderStudentCard = (student: GradingStudent) => (
    <View key={student.id} style={styles.studentCard}>
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{student.name}</Text>
        {student.level && (
          <Text style={styles.studentLevel}>{student.level}</Text>
        )}
        {student.groupName && (
          <Text style={styles.studentGroup}>Group: {student.groupName}</Text>
        )}
      </View>

      {activeView === 'progress' && (
        <View style={styles.starRating}>
          {Array.from({ length: lesson.maxStars }, (_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => onStudentGradeChange?.(student.id, i + 1)}
            >
              <Ionicons
                name={i < student.stars ? 'star' : 'star-outline'}
                size={24}
                color={i < student.stars ? theme.colors.status.warning : theme.colors.border.primary}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {activeView === 'group' && (
        <View style={styles.groupActions}>
          <TouchableOpacity
            style={styles.groupButton}
            onPress={() => {/* Handle group assignment */}}
          >
            <Ionicons name="people" size={16} color={theme.colors.interactive.primary} />
            <Text style={styles.groupButtonText}>
              {student.groupName || 'Assign'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Grading</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Lesson Info Card */}
        <View style={styles.lessonCard}>
          <Text style={styles.lessonTitle}>Lesson: {lesson.title}</Text>
          {lesson.description && (
            <Text style={styles.lessonDescription}>{lesson.description}</Text>
          )}

          <Text style={styles.sectionLabel}>Views</Text>

          {/* Filter Controls */}
          <View style={styles.filterControls}>
            {showGrouping && (
              <TouchableOpacity 
                style={styles.viewSelector}
                onPress={handleGroupSelection}
              >
                <Ionicons name="people" size={16} color={theme.colors.interactive.primary} />
                <Text style={styles.viewSelectorText}>
                  Group: {activeView === 'progress' ? 'Progress' : 'Group'}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.viewSelector}>
              <Ionicons name="eye-outline" size={16} color={theme.colors.text.secondary} />
              <Text style={styles.viewSelectorTextSecondary}>All Lessons</Text>
            </TouchableOpacity>

            {showSearch && (
              <TouchableOpacity style={styles.viewSelector}>
                <Ionicons name="search" size={16} color={theme.colors.text.secondary} />
                <Text style={styles.viewSelectorTextSecondary}>Search</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Quick Filters */}
          <View style={styles.quickFilters}>
            <Text style={styles.quickFilterLabel}>Quick Filter</Text>
            {activeView === 'progress' ? renderStarFilter() : renderGroupFilter()}
          </View>
        </View>

        {/* Students List */}
        <View style={styles.studentsContainer}>
          {filteredStudents.map(renderStudentCard)}
        </View>
      </ScrollView>

      {/* Modal for View Selection */}
      <Modal
        visible={showGroupModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleBackdropPress}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            onPress={handleBackdropPress}
          />
          <View style={styles.modalContent}>
            <View style={styles.bottomSheetContent}>
              <Text style={styles.bottomSheetTitle}>Group By:</Text>
              {['Progress', 'Group'].map((view) => (
                <TouchableOpacity
                  key={view}
                  style={styles.bottomSheetItem}
                  onPress={() => {
                    setActiveView(view.toLowerCase() as 'progress' | 'group');
                    setShowGroupModal(false);
                  }}
                >
                  <Text style={styles.bottomSheetItemText}>{view}</Text>
                  {activeView === view.toLowerCase() && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={theme.colors.interactive.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const createStyles = (theme: any, isTablet: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: theme.fontSizes.h3,
    fontWeight: theme.fontConfig.fontWeight.semibold,
    color: theme.colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  lessonCard: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    margin: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  lessonTitle: {
    fontSize: theme.fontSizes.body,
    fontWeight: theme.fontConfig.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  lessonDescription: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  sectionLabel: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  filterControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  viewSelector: {
    backgroundColor: theme.colors.interactive.primary + '20',
    borderColor: theme.colors.interactive.primary + '40',
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  viewSelectorText: {
    fontSize: theme.fontSizes.caption,
    color: theme.colors.interactive.primary,
    marginLeft: theme.spacing.xs,
    fontWeight: theme.fontConfig.fontWeight.medium,
    flexShrink: 1,
  },
  viewSelectorTextSecondary: {
    fontSize: theme.fontSizes.caption,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
    flexShrink: 1,
  },
  quickFilters: {
    marginTop: theme.spacing.sm,
  },
  quickFilterLabel: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  filterScrollView: {
    flexDirection: 'row',
  },
  filterChip: {
    backgroundColor: 'transparent',
    borderColor: theme.colors.interactive.primary + '40',
    borderWidth: 1,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    marginRight: theme.spacing.sm,
  },
  filterChipActive: {
    backgroundColor: theme.colors.interactive.primary + '20',
  },
  filterChipText: {
    fontSize: theme.fontSizes.caption,
    color: theme.colors.text.secondary,
  },
  filterChipTextActive: {
    color: theme.colors.interactive.primary,
    fontWeight: theme.fontConfig.fontWeight.medium,
  },
  studentsContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  studentCard: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: theme.colors.shadow.default,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: theme.fontSizes.body,
    fontWeight: theme.fontConfig.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  studentLevel: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  studentGroup: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.interactive.primary,
  },
  starRating: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  groupActions: {
    alignItems: 'flex-end',
  },
  groupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.interactive.primary + '20',
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  groupButtonText: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.interactive.primary,
    marginLeft: theme.spacing.xs,
    fontWeight: theme.fontConfig.fontWeight.medium,
  },
  bottomSheet: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: 30,
  },
  bottomSheetContainer: {
    flex: 1,
    padding: theme.spacing.sm,
  },
  bottomSheetContent: {
    paddingHorizontal: theme.spacing.md,
  },
  bottomSheetTitle: {
    fontSize: theme.fontSizes.body,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  bottomSheetItem: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: theme.colors.shadow.default,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  bottomSheetItemText: {
    fontSize: theme.fontSizes.body,
    fontWeight: theme.fontConfig.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: theme.colors.background.secondary,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: 20,
  },
});

export default ClassroomGrading;