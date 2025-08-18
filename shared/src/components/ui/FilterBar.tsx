import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { useScreenDimensions } from '../../hooks';

export interface FilterOption {
  id: string;
  label: string;
  value: any;
  count?: number;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
  active?: boolean;
  disabled?: boolean;
}

export interface FilterGroup {
  id: string;
  title: string;
  options: FilterOption[];
  multiSelect?: boolean;
  required?: boolean;
}

export interface FilterBarProps {
  title?: string;
  filters: FilterGroup[];
  selectedFilters: { [groupId: string]: string[] };
  onFilterChange: (groupId: string, optionId: string, selected: boolean) => void;
  onClearAll?: () => void;
  onApply?: () => void;
  
  // Display options
  variant?: 'horizontal' | 'vertical' | 'modal';
  showCounts?: boolean;
  showIcons?: boolean;
  showClearAll?: boolean;
  showApply?: boolean;
  
  // Styling
  maxItemsVisible?: number;
  scrollable?: boolean;
  compactMode?: boolean;
  
  // Modal specific
  modalTitle?: string;
  modalVisible?: boolean;
  onModalClose?: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  title = 'Filters',
  filters,
  selectedFilters,
  onFilterChange,
  onClearAll,
  onApply,
  variant = 'horizontal',
  showCounts = true,
  showIcons = true,
  showClearAll = true,
  showApply = false,
  maxItemsVisible = 5,
  scrollable = true,
  compactMode = false,
  modalTitle,
  modalVisible = false,
  onModalClose,
}) => {
  const { theme } = useTheme();
  const { isTablet } = useScreenDimensions();
  const styles = createStyles(theme, isTablet, compactMode);

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const isOptionSelected = (groupId: string, optionId: string) => {
    return selectedFilters[groupId]?.includes(optionId) || false;
  };

  const handleOptionPress = (group: FilterGroup, option: FilterOption) => {
    if (option.disabled) return;
    
    const isSelected = isOptionSelected(group.id, option.id);
    onFilterChange(group.id, option.id, !isSelected);
  };

  const getActiveFilterCount = () => {
    return Object.values(selectedFilters).reduce((total, groupFilters) => {
      return total + groupFilters.length;
    }, 0);
  };

  const renderFilterOption = (group: FilterGroup, option: FilterOption) => {
    const isSelected = isOptionSelected(group.id, option.id);
    
    return (
      <TouchableOpacity
        key={option.id}
        style={[
          styles.filterOption,
          isSelected && styles.filterOptionSelected,
          option.disabled && styles.filterOptionDisabled,
          option.color && { borderColor: option.color },
        ]}
        onPress={() => handleOptionPress(group, option)}
        disabled={option.disabled}
      >
        <View style={styles.filterOptionContent}>
          {showIcons && option.icon && (
            <Ionicons
              name={option.icon}
              size={16}
              color={isSelected ? theme.colors.text.inverse : theme.colors.interactive.primary}
              style={styles.filterOptionIcon}
            />
          )}
          
          <Text style={[
            styles.filterOptionText,
            isSelected && styles.filterOptionTextSelected,
            option.disabled && styles.filterOptionTextDisabled,
          ]}>
            {option.label}
          </Text>
          
          {showCounts && option.count !== undefined && (
            <View style={[
              styles.countBadge,
              isSelected && styles.countBadgeSelected,
            ]}>
              <Text style={[
                styles.countText,
                isSelected && styles.countTextSelected,
              ]}>
                {option.count}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderFilterGroup = (group: FilterGroup) => {
    const isExpanded = expandedGroups.has(group.id) || variant === 'horizontal';
    const visibleOptions = variant === 'horizontal' && maxItemsVisible 
      ? group.options.slice(0, maxItemsVisible)
      : group.options;
    const hasMoreOptions = group.options.length > maxItemsVisible && variant === 'horizontal';

    return (
      <View key={group.id} style={styles.filterGroup}>
        {variant !== 'horizontal' && (
          <TouchableOpacity
            style={styles.groupHeader}
            onPress={() => toggleGroup(group.id)}
          >
            <Text style={styles.groupTitle}>{group.title}</Text>
            <Ionicons
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={theme.colors.text.secondary}
            />
          </TouchableOpacity>
        )}

        {(isExpanded || variant !== 'vertical') && (
          <View style={[
            styles.optionsContainer,
            variant === 'horizontal' && styles.horizontalOptionsContainer,
          ]}>
            {visibleOptions.map(option => renderFilterOption(group, option))}
            
            {hasMoreOptions && (
              <TouchableOpacity style={styles.moreButton}>
                <Text style={styles.moreButtonText}>
                  +{group.options.length - maxItemsVisible} more
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderActions = () => {
    if (!showClearAll && !showApply) return null;

    return (
      <View style={styles.actionsContainer}>
        {showClearAll && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={onClearAll}
          >
            <Text style={styles.actionButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
        
        {showApply && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.applyButton]}
            onPress={onApply}
          >
            <Text style={[styles.actionButtonText, styles.applyButtonText]}>
              Apply Filters ({getActiveFilterCount()})
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderContent = () => (
    <View style={styles.container}>
      {title && variant !== 'horizontal' && (
        <Text style={styles.title}>{title}</Text>
      )}
      
      <View style={[
        styles.filtersContainer,
        variant === 'horizontal' && styles.horizontalFiltersContainer,
      ]}>
        {filters.map(renderFilterGroup)}
      </View>

      {renderActions()}
    </View>
  );

  if (variant === 'modal') {
    return (
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onModalClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{modalTitle || title}</Text>
            <TouchableOpacity onPress={onModalClose}>
              <Ionicons name="close" size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {renderContent()}
          </ScrollView>
        </View>
      </Modal>
    );
  }

  if (scrollable && variant === 'horizontal') {
    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {renderContent()}
      </ScrollView>
    );
  }

  return renderContent();
};

const createStyles = (theme: any, isTablet: boolean, compactMode: boolean) => StyleSheet.create({
  container: {
    paddingVertical: compactMode ? theme.spacing.sm : theme.spacing.md,
  },
  scrollContainer: {
    paddingHorizontal: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSizes.body,
    fontWeight: theme.fontConfig.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  filtersContainer: {
    gap: theme.spacing.md,
  },
  horizontalFiltersContainer: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
  filterGroup: {
    marginBottom: theme.spacing.sm,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  groupTitle: {
    fontSize: theme.fontSizes.body,
    fontWeight: theme.fontConfig.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  optionsContainer: {
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  horizontalOptionsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  filterOption: {
    backgroundColor: theme.colors.background.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: compactMode ? theme.spacing.xs : theme.spacing.sm,
  },
  filterOptionSelected: {
    backgroundColor: theme.colors.interactive.primary,
    borderColor: theme.colors.interactive.primary,
  },
  filterOptionDisabled: {
    opacity: 0.5,
  },
  filterOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  filterOptionIcon: {
    marginRight: theme.spacing.xs,
  },
  filterOptionText: {
    fontSize: theme.fontSizes.small,
    fontWeight: theme.fontConfig.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  filterOptionTextSelected: {
    color: theme.colors.text.inverse,
  },
  filterOptionTextDisabled: {
    color: theme.colors.text.tertiary,
  },
  countBadge: {
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    marginLeft: theme.spacing.xs,
  },
  countBadgeSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  countText: {
    fontSize: theme.fontSizes.caption,
    fontWeight: theme.fontConfig.fontWeight.bold,
    color: theme.colors.text.secondary,
  },
  countTextSelected: {
    color: theme.colors.text.inverse,
  },
  moreButton: {
    padding: theme.spacing.sm,
    alignItems: 'center',
  },
  moreButtonText: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.interactive.primary,
    fontWeight: theme.fontConfig.fontWeight.medium,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.primary,
    marginTop: theme.spacing.lg,
  },
  actionButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.secondary,
    alignItems: 'center',
  },
  applyButton: {
    backgroundColor: theme.colors.interactive.primary,
  },
  actionButtonText: {
    fontSize: theme.fontSizes.body,
    fontWeight: theme.fontConfig.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  applyButtonText: {
    color: theme.colors.text.inverse,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  modalTitle: {
    fontSize: theme.fontSizes.h3,
    fontWeight: theme.fontConfig.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  modalContent: {
    flex: 1,
  },
});

export default FilterBar;