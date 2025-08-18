import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

export interface StationIconConfig {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
}

export interface StationsProps {
  title?: string;
  rating?: string | number;
  starRating?: number;
  heading: string;
  icons?: StationIconConfig[];
  onPress?: () => void;
  marginBottom?: number;
  backgroundColor?: string;
  variant?: 'default' | 'compact' | 'detailed';
  showStarRating?: boolean;
  maxStars?: number;
  disabled?: boolean;
  subtitle?: string;
  rightContent?: React.ReactNode;
}

const Stations: React.FC<StationsProps> = ({
  title,
  rating,
  starRating,
  heading,
  icons = [],
  onPress,
  marginBottom = 16,
  backgroundColor,
  variant = 'default',
  showStarRating = true,
  maxStars = 5,
  disabled = false,
  subtitle,
  rightContent,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme, marginBottom);

  const renderStars = () => {
    if (!showStarRating || starRating === undefined) return null;
    
    const stars = [];
    for (let i = 1; i <= maxStars; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= starRating ? 'star' : 'star-outline'}
          size={16}
          color={i <= starRating ? theme.colors.status.warning : theme.colors.border.primary}
        />
      );
    }
    return stars;
  };

  const renderIcons = () => {
    if (icons.length === 0) return null;
    
    return (
      <View style={styles.iconsContainer}>
        {icons.map((icon, index) => (
          <Ionicons
            key={index}
            name={icon.name}
            size={19}
            color={icon.color || theme.colors.interactive.primary}
            style={styles.iconItem}
          />
        ))}
      </View>
    );
  };

  const containerStyle = [
    styles.container,
    variant === 'compact' && styles.compactContainer,
    variant === 'detailed' && styles.detailedContainer,
    backgroundColor && { backgroundColor },
    disabled && styles.disabled,
  ];

  const cardStyle = [
    styles.card,
    variant === 'compact' && styles.compactCard,
    variant === 'detailed' && styles.detailedCard,
  ];

  const content = (
    <View style={containerStyle}>
      {/* Header Section */}
      {(title || showStarRating) && (
        <View style={styles.header}>
          {title && (
            <Text style={[styles.title, { color: theme.colors.text.secondary }]}>
              {title}
            </Text>
          )}
          
          {showStarRating && (rating !== undefined || starRating !== undefined) && (
            <View style={styles.ratingContainer}>
              {starRating !== undefined && (
                <View style={styles.starsContainer}>
                  {renderStars()}
                </View>
              )}
              {rating !== undefined && (
                <Text style={[styles.rating, { color: theme.colors.text.primary }]}>
                  {rating}
                </Text>
              )}
            </View>
          )}

          {rightContent}
        </View>
      )}

      {/* Content Card */}
      <View style={cardStyle}>
        <View style={styles.cardContent}>
          <Text 
            style={[styles.heading, { color: theme.colors.text.primary }]}
            numberOfLines={variant === 'compact' ? 1 : 2}
          >
            {heading}
          </Text>
          
          {subtitle && (
            <Text 
              style={[styles.subtitle, { color: theme.colors.text.secondary }]}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          )}
        </View>

        {renderIcons()}
      </View>
    </View>
  );

  if (onPress && !disabled) {
    return (
      <TouchableOpacity 
        onPress={onPress}
        style={styles.touchable}
        accessibilityRole="button"
        accessibilityLabel={heading}
        accessibilityHint={title}
        accessibilityState={{ disabled }}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const createStyles = (theme: any, marginBottom: number) => StyleSheet.create({
  touchable: {
    borderRadius: theme.borderRadius.lg,
  },
  container: {
    paddingHorizontal: theme.spacing.md,
    marginBottom,
  },
  compactContainer: {
    paddingHorizontal: theme.spacing.sm,
  },
  detailedContainer: {
    paddingHorizontal: theme.spacing.lg,
  },
  disabled: {
    opacity: 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSizes.small,
    fontWeight: theme.fontConfig.fontWeight.regular,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  rating: {
    fontSize: theme.fontSizes.small,
    fontWeight: theme.fontConfig.fontWeight.medium,
  },
  card: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    shadowColor: theme.colors.shadow?.primary || '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compactCard: {
    padding: theme.spacing.sm,
  },
  detailedCard: {
    padding: theme.spacing.lg,
  },
  cardContent: {
    flex: 1,
    paddingRight: theme.spacing.sm,
  },
  heading: {
    fontSize: theme.fontSizes.body,
    fontWeight: theme.fontConfig.fontWeight.semibold,
    lineHeight: theme.typography.lineHeight?.body || 20,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSizes.small,
    fontWeight: theme.fontConfig.fontWeight.regular,
    lineHeight: theme.typography.lineHeight?.small || 16,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  iconItem: {
    marginLeft: 2,
  },
});

export default Stations;