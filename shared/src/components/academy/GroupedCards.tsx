import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, createThemedStyles } from '../../theme';
import { ToggleCard } from '../ui';

export interface GroupedCardItem {
  id: string;
  name: string;
  avatar?: string;
  currentLevel: string;
  starRating?: number;
  status?: 'active' | 'inactive' | 'pending';
  badge?: string;
  moveTo?: string;
  onMove?: () => void;
}

export interface GroupedSection {
  id: string;
  title: string;
  count: number;
  items: GroupedCardItem[];
  initialExpanded?: boolean;
  color?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export interface GroupedCardsProps {
  sections: GroupedSection[];
  onItemMove?: (itemId: string, fromSection: string, toSection?: string) => void;
  onSectionToggle?: (sectionId: string, isExpanded: boolean) => void;
  showMoveAction?: boolean;
  cardVariant?: 'default' | 'compact' | 'detailed';
}

const GroupedCards: React.FC<GroupedCardsProps> = ({
  sections,
  onItemMove,
  onSectionToggle,
  showMoveAction = true,
  cardVariant = 'default',
}) => {
  const { theme } = useTheme();
  const styles = useThemedStyles();
  
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    sections.reduce((acc, section) => ({
      ...acc,
      [section.id]: section.initialExpanded || false,
    }), {})
  );

  const handleSectionToggle = (sectionId: string) => {
    const newExpandedState = !expandedSections[sectionId];
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: newExpandedState,
    }));
    onSectionToggle?.(sectionId, newExpandedState);
  };

  const handleItemMove = (itemId: string, fromSectionId: string) => {
    onItemMove?.(itemId, fromSectionId);
  };

  const renderStarRating = (rating: number = 0) => {
    return (
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? 'star' : 'star-outline'}
            size={10}
            color={star <= rating ? '#FFC107' : theme.colors.text.tertiary}
          />
        ))}
      </View>
    );
  };

  const renderCardItem = (item: GroupedCardItem, sectionId: string) => {
    return (
      <View key={item.id} style={styles.cardItem}>
        <View style={styles.cardContent}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            {item.avatar ? (
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons 
                  name="person" 
                  size={24} 
                  color={theme.colors.text.tertiary} 
                />
              </View>
            )}
          </View>

          {/* Main Content */}
          <View style={styles.itemInfo}>
            <View style={styles.itemHeader}>
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                
                <View style={styles.currentLevelContainer}>
                  {item.starRating !== undefined && renderStarRating(item.starRating)}
                  <Text style={styles.currentLevel}>
                    Current: {item.currentLevel}
                  </Text>
                </View>
                
                {item.badge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                )}
              </View>

              {/* Actions */}
              {showMoveAction && (
                <TouchableOpacity
                  style={styles.moveAction}
                  onPress={() => handleItemMove(item.id, sectionId)}
                >
                  <Text style={styles.moveText}>Move to</Text>
                  <Ionicons 
                    name="chevron-forward" 
                    size={12} 
                    color={theme.colors.text.secondary} 
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Status Indicator */}
        {item.status && (
          <View style={[
            styles.statusIndicator,
            { backgroundColor: getStatusColor(item.status) }
          ]} />
        )}
      </View>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return theme.colors.status.success;
      case 'inactive':
        return theme.colors.status.error;
      case 'pending':
        return theme.colors.status.warning;
      default:
        return theme.colors.text.tertiary;
    }
  };

  return (
    <View style={styles.container}>
      {sections.map((section) => (
        <View key={section.id} style={styles.section}>
          <ToggleCard
            title={section.title}
            count={section.count}
            initialExpanded={expandedSections[section.id]}
            onToggle={() => handleSectionToggle(section.id)}
            backgroundColor={section.color}
          />

          {expandedSections[section.id] && (
            <View style={styles.sectionContent}>
              {section.items.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons 
                    name="folder-outline" 
                    size={32} 
                    color={theme.colors.text.tertiary} 
                  />
                  <Text style={styles.emptyText}>
                    No items in this group
                  </Text>
                </View>
              ) : (
                section.items.map((item) => renderCardItem(item, section.id))
              )}
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

const useThemedStyles = createThemedStyles((theme) => StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: theme.spacing.md,
  },
  sectionContent: {
    marginTop: theme.spacing.sm,
  },
  cardItem: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    marginBottom: theme.spacing.sm,
    overflow: 'hidden',
    ...theme.elevation.md,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  avatarContainer: {
    marginRight: theme.spacing.md,
  },
  avatar: {
    width: 47,
    height: 47,
    borderRadius: 47 / 2,
  },
  avatarPlaceholder: {
    width: 47,
    height: 47,
    borderRadius: 47 / 2,
    backgroundColor: theme.colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: theme.fontSizes.base,
    fontWeight: theme.fontConfig.fontWeight.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  currentLevelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  starContainer: {
    flexDirection: 'row',
    marginRight: theme.spacing.xs,
  },
  currentLevel: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.interactive.primary,
    flex: 1,
  },
  badge: {
    backgroundColor: theme.colors.status.info + '20',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    alignSelf: 'flex-start',
    marginTop: theme.spacing.xs,
  },
  badgeText: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.status.info,
    fontWeight: theme.fontConfig.fontWeight.medium,
  },
  moveAction: {
    backgroundColor: '#DCF9F1',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    marginLeft: theme.spacing.sm,
  },
  moveText: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.text.secondary,
    fontWeight: theme.fontConfig.fontWeight.semibold,
    marginRight: theme.spacing.xs,
  },
  statusIndicator: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.sm,
  },
}));

export default GroupedCards;