/**
 * FilterComponent - Modern filter interface with bottom sheet
 * 
 * Provides group filtering, student filtering, and search functionality
 * with a responsive bottom sheet for group selection.
 */

import React, { useCallback, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  Animated,
  ScrollView,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, createThemedStyles } from '../../theme';

const { height: screenHeight } = Dimensions.get('window');

// TypeScript Interfaces
export interface FilterGroup {
  id: string;
  name: string;
  displayName?: string;
}

export interface FilterComponentProps {
  /** Array of available groups for filtering */
  groups?: FilterGroup[];
  /** Currently selected group name */
  groupName: string;
  /** Text to display for student filter (e.g., "All Students" or student count) */
  allNames: string;
  /** Callback when search is activated */
  setActiveSearch: (active: boolean) => void;
  /** Callback when group is changed */
  onGroupChange?: (group: FilterGroup) => void;
  /** Callback when student filter is pressed */
  onStudentFilter?: () => void;
  /** Whether the component is in loading state */
  loading?: boolean;
  /** Custom styles */
  style?: object;
  /** Test ID for testing */
  testID?: string;
}

export interface FilterBottomSheetProps {
  visible: boolean;
  groups: FilterGroup[];
  activeGroup: string;
  onClose: () => void;
  onGroupSelect: (group: FilterGroup) => void;
}

/**
 * Bottom Sheet Component for Group Selection
 */
const FilterBottomSheet: React.FC<FilterBottomSheetProps> = ({
  visible,
  groups,
  activeGroup,
  onClose,
  onGroupSelect,
}) => {
  const { theme } = useTheme();
  const bottomSheetStyles = useBottomSheetThemedStyles();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: screenHeight,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, slideAnim]);

  const styles = bottomSheetStyles;

  const handleGroupPress = (group: FilterGroup) => {
    onGroupSelect(group);
    onClose();
  };

  const handleBackdropPress = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Animated.View 
        style={[
          styles.backdrop,
          { opacity: fadeAnim }
        ]}
      >
        <Pressable 
          style={StyleSheet.absoluteFill} 
          onPress={handleBackdropPress}
        />
        
        <Animated.View 
          style={[
            styles.bottomSheet,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          {/* Handle */}
          <View style={styles.handle} />
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Group By:</Text>
          </View>

          {/* Content */}
          <ScrollView 
            style={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {groups.map((group) => (
              <Pressable
                key={group.id}
                style={[
                  styles.groupItem,
                  activeGroup === group.name && styles.groupItemActive
                ]}
                onPress={() => handleGroupPress(group)}
                accessibilityRole="button"
                accessibilityLabel={`Select ${group.displayName || group.name} group`}
              >
                <Text style={[
                  styles.groupItemText,
                  activeGroup === group.name && styles.groupItemTextActive
                ]}>
                  {group.displayName || group.name}
                </Text>
                
                {activeGroup === group.name && (
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={theme.colors.interactive.primary}
                  />
                )}
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

/**
 * Main Filter Component
 */
const FilterComponent: React.FC<FilterComponentProps> = ({
  groups = [],
  groupName,
  allNames,
  setActiveSearch,
  onGroupChange,
  onStudentFilter,
  loading = false,
  style,
  testID = 'filter-component',
}) => {
  const { theme } = useTheme();
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  const styles = useThemedStyles();

  const handleGroupFilterPress = useCallback(() => {
    if (groups.length > 0) {
      setBottomSheetVisible(true);
    }
  }, [groups.length]);

  const handleBottomSheetClose = useCallback(() => {
    setBottomSheetVisible(false);
  }, []);

  const handleGroupSelect = useCallback((group: FilterGroup) => {
    if (onGroupChange) {
      onGroupChange(group);
    }
    setBottomSheetVisible(false);
  }, [onGroupChange]);

  const handleStudentFilterPress = useCallback(() => {
    if (onStudentFilter) {
      onStudentFilter();
    }
  }, [onStudentFilter]);

  const handleSearchPress = useCallback(() => {
    setActiveSearch(true);
  }, [setActiveSearch]);

  return (
    <>
      <View style={[styles.container, style]} testID={testID}>
        {/* Group Filter */}
        <Pressable
          style={[
            styles.filterButton,
            styles.groupFilter,
            loading && styles.filterButtonDisabled
          ]}
          onPress={handleGroupFilterPress}
          disabled={loading || groups.length === 0}
          accessibilityRole="button"
          accessibilityLabel={`Current group: ${groupName}. Press to change group`}
          testID={`${testID}-group-filter`}
        >
          <Ionicons
            name="people"
            size={theme.iconSize.sm}
            color={theme.colors.interactive.primary}
          />
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[
              styles.filterButtonText,
              styles.groupFilterText,
              loading && styles.filterButtonTextDisabled
            ]}
          >
            Group: {groupName}
          </Text>
          {groups.length > 0 && (
            <Ionicons
              name="chevron-down"
              size={theme.iconSize.sm}
              color={theme.colors.interactive.primary}
              style={styles.chevronIcon}
            />
          )}
        </Pressable>

        {/* Student Filter */}
        <Pressable
          style={[
            styles.filterButton,
            styles.secondaryFilter,
            loading && styles.filterButtonDisabled
          ]}
          onPress={handleStudentFilterPress}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel={`Students: ${allNames}. Press to filter students`}
          testID={`${testID}-student-filter`}
        >
          <Ionicons
            name="eye"
            size={theme.iconSize.sm}
            color={theme.colors.text.secondary}
          />
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[
              styles.filterButtonText,
              styles.secondaryFilterText,
              loading && styles.filterButtonTextDisabled
            ]}
          >
            {allNames}
          </Text>
        </Pressable>

        {/* Search */}
        <Pressable
          style={[
            styles.filterButton,
            styles.secondaryFilter,
            loading && styles.filterButtonDisabled
          ]}
          onPress={handleSearchPress}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel="Open search"
          testID={`${testID}-search`}
        >
          <Ionicons
            name="search"
            size={theme.iconSize.sm}
            color={theme.colors.text.secondary}
          />
          <Text
            style={[
              styles.filterButtonText,
              styles.secondaryFilterText,
              loading && styles.filterButtonTextDisabled
            ]}
          >
            Search
          </Text>
        </Pressable>
      </View>

      {/* Bottom Sheet */}
      <FilterBottomSheet
        visible={bottomSheetVisible}
        groups={groups}
        activeGroup={groupName}
        onClose={handleBottomSheetClose}
        onGroupSelect={handleGroupSelect}
      />
    </>
  );
};

/**
 * Styles for the main component
 */
const useThemedStyles = createThemedStyles((theme) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing.xs,
    width: '100%',
    marginBottom: theme.spacing.xs,
  },
  filterButton: {
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 40,
    flexShrink: 1,
    minWidth: 0,
  },
  groupFilter: {
    backgroundColor: theme.colors.interactive.faded,
    flex: 1,
    maxWidth: '45%',
  },
  secondaryFilter: {
    backgroundColor: theme.colors.background.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    flex: 1,
    maxWidth: '30%',
  },
  filterButtonDisabled: {
    opacity: 0.6,
  },
  filterButtonText: {
    marginLeft: theme.spacing.xs,
    fontSize: theme.fontSizes.caption,
    fontWeight: theme.fontConfig.fontWeight.medium,
    flexShrink: 1,
  },
  groupFilterText: {
    color: theme.colors.interactive.primary,
  },
  secondaryFilterText: {
    color: theme.colors.text.secondary,
  },
  filterButtonTextDisabled: {
    color: theme.colors.text.disabled,
  },
  chevronIcon: {
    marginLeft: theme.spacing.xs,
  },
}));

/**
 * Styles for the bottom sheet
 */
const useBottomSheetThemedStyles = createThemedStyles((theme) => StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: theme.colors.background.overlay,
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: theme.colors.background.elevated,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    maxHeight: screenHeight * 0.6,
    minHeight: screenHeight * 0.25,
    paddingTop: theme.spacing.sm,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.border.primary,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.border.primary,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: theme.spacing.md,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  headerTitle: {
    fontSize: theme.fontSizes.body,
    fontWeight: theme.fontConfig.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  groupItem: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.border.primary,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  groupItemActive: {
    backgroundColor: theme.colors.interactive.faded,
    borderWidth: 1,
    borderColor: theme.colors.interactive.primary,
  },
  groupItemText: {
    fontSize: theme.fontSizes.body,
    fontWeight: theme.fontConfig.fontWeight.regular,
    color: theme.colors.text.primary,
    flex: 1,
  },
  groupItemTextActive: {
    color: theme.colors.interactive.primary,
    fontWeight: theme.fontConfig.fontWeight.medium,
  },
}));

export default FilterComponent;