import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, createThemedStyles } from '../../theme';

const { width } = Dimensions.get('window');

export interface FilterGroup {
  group: string;
  id: string | number;
}

export interface FilterComponentProps {
  groups?: FilterGroup[];
  groupName?: string;
  allNames?: string;
  onGroupSelect?: (group: FilterGroup) => void;
  onStudentFilter?: () => void;
  onSearchToggle?: () => void;
  groupIcon?: React.ReactNode;
  studentIcon?: React.ReactNode;
  searchIcon?: React.ReactNode;
  showBottomSheet?: boolean;
  activeGroup?: string;
}

export const FilterComponent: React.FC<FilterComponentProps> = ({
  groups = [],
  groupName = "All Groups",
  allNames = "All Students",
  onGroupSelect,
  onStudentFilter,
  onSearchToggle,
  groupIcon,
  studentIcon,
  searchIcon,
  showBottomSheet = false,
  activeGroup,
}) => {
  const { theme } = useTheme();
  const styles = useThemedStyles();
  
  const [selectedGroup, setSelectedGroup] = useState(activeGroup || groupName);
  const [isVisible, setIsVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleGroupPress = () => {
    if (showBottomSheet && groups.length > 0) {
      // Toggle bottom sheet animation
      setIsVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
    // Could trigger bottom sheet here
  };

  const handleGroupSelect = (group: FilterGroup) => {
    setSelectedGroup(group.group);
    onGroupSelect?.(group);
    
    // Hide bottom sheet
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setIsVisible(false));
  };

  const renderGroupIcon = () => {
    if (groupIcon) return groupIcon;
    return <Ionicons name="people" size={15} color={theme.colors.interactive.primary} />;
  };

  const renderStudentIcon = () => {
    if (studentIcon) return studentIcon;
    return <Ionicons name="eye" size={15} color={theme.colors.text.secondary} />;
  };

  const renderSearchIcon = () => {
    if (searchIcon) return searchIcon;
    return <Ionicons name="search" size={15} color={theme.colors.text.secondary} />;
  };

  return (
    <View style={styles.container}>
      {/* Group Filter */}
      <TouchableOpacity
        style={[styles.filterButton, styles.groupFilter]}
        onPress={handleGroupPress}
        accessibilityRole="button"
        accessibilityLabel={`Group filter: ${selectedGroup}`}
      >
        {renderGroupIcon()}
        <Text style={styles.groupFilterText} numberOfLines={1} ellipsizeMode="tail">
          Group: {selectedGroup}
        </Text>
      </TouchableOpacity>

      {/* Student Filter */}
      <TouchableOpacity
        style={[styles.filterButton, styles.studentFilter]}
        onPress={onStudentFilter}
        accessibilityRole="button"
        accessibilityLabel={`Student filter: ${allNames}`}
      >
        {renderStudentIcon()}
        <Text style={styles.studentFilterText} numberOfLines={1} ellipsizeMode="tail">
          {allNames}
        </Text>
      </TouchableOpacity>

      {/* Search */}
      <TouchableOpacity
        style={[styles.filterButton, styles.searchFilter]}
        onPress={onSearchToggle}
        accessibilityRole="button"
        accessibilityLabel="Search"
      >
        {renderSearchIcon()}
        <Text style={styles.searchFilterText}>Search</Text>
      </TouchableOpacity>

      {/* Bottom Sheet Options - Simple implementation without external dependency */}
      {showBottomSheet && groups.length > 0 && (
        <Animated.View
          style={[
            styles.bottomSheetOverlay,
            {
              opacity: fadeAnim,
            },
          ]}
          pointerEvents={isVisible ? 'auto' : 'none'}
        >
          <TouchableOpacity
            style={styles.bottomSheetBackdrop}
            onPress={() => {
              Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
              }).start();
            }}
            activeOpacity={1}
          />
          
          <Animated.View
            style={[
              styles.bottomSheetContent,
              {
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [300, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.bottomSheetTitle}>Group By:</Text>
            </View>
            
            {groups.map((group, index) => (
              <TouchableOpacity
                key={group.id || index}
                style={styles.bottomSheetItem}
                onPress={() => handleGroupSelect(group)}
                accessibilityRole="button"
                accessibilityLabel={`Select ${group.group} group`}
              >
                <Text style={styles.bottomSheetItemText}>{group.group}</Text>
                {selectedGroup === group.group && (
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color={theme.colors.interactive.primary}
                  />
                )}
              </TouchableOpacity>
            ))}
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
};

const useThemedStyles = createThemedStyles((theme) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
    width: '100%',
    gap: theme.spacing.sm,
  },
  filterButton: {
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
  },
  groupFilter: {
    backgroundColor: theme.colors.interactive.faded,
    flex: 0.5,
  },
  studentFilter: {
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    backgroundColor: theme.colors.background.primary,
    flex: 0.4,
  },
  searchFilter: {
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    backgroundColor: theme.colors.background.primary,
    flex: 0.35,
  },
  groupFilterText: {
    fontSize: theme.fontSizes.caption,
    color: theme.colors.interactive.primary,
    marginLeft: theme.spacing.xs,
    flexShrink: 1,
    fontWeight: theme.fontConfig.fontWeight.semibold,
  },
  studentFilterText: {
    fontSize: theme.fontSizes.caption,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
    flexShrink: 1,
  },
  searchFilterText: {
    fontSize: theme.fontSizes.caption,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
  },
  bottomSheetOverlay: {
    position: 'absolute',
    top: 0,
    left: -theme.spacing.lg,
    right: -theme.spacing.lg,
    bottom: -200,
    zIndex: 1000,
  },
  bottomSheetBackdrop: {
    flex: 1,
    backgroundColor: theme.colors.overlay.medium,
  },
  bottomSheetContent: {
    backgroundColor: theme.colors.background.primary,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    padding: theme.spacing.md,
    maxHeight: width * 0.6,
  },
  bottomSheetHeader: {
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
    marginBottom: theme.spacing.md,
  },
  bottomSheetTitle: {
    fontSize: theme.fontSizes.body,
    color: theme.colors.text.secondary,
    fontWeight: theme.fontConfig.fontWeight.medium,
  },
  bottomSheetItem: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    shadowColor: theme.colors.shadow.default,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomSheetItemText: {
    fontSize: theme.fontSizes.body,
    color: theme.colors.text.primary,
    fontWeight: theme.fontConfig.fontWeight.medium,
  },
}));

export default FilterComponent;