/**
 * ClassroomCard Component
 * 
 * A card component for displaying classroom information with Academy theming.
 * Supports student performance levels, scheduling, and location details.
 */

import React from 'react';
import { 
  View, 
  Text, 
  Pressable, 
  Image, 
  StyleSheet, 
  ViewStyle, 
  TextStyle,
  ImageSourcePropType 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

export interface PerformanceLevel {
  /** Level type */
  type: 'lowest' | 'highest' | 'average';
  /** Level description */
  description: string;
  /** Custom color for the level indicator */
  color?: string;
}

export interface ClassroomSchedule {
  /** Start time */
  startTime: string;
  /** End time */
  endTime: string;
  /** Date (optional) */
  date?: string;
}

export interface ClassroomCardProps {
  /** Unique classroom identifier */
  id: string;
  /** Classroom/year name */
  title: string;
  /** Performance levels */
  performanceLevels?: PerformanceLevel[];
  /** Location information */
  location: string;
  /** Schedule information */
  schedule: ClassroomSchedule;
  /** Classroom image */
  image?: ImageSourcePropType;
  /** Callback when card is pressed */
  onPress?: (classroomId: string) => void;
  /** Container styles */
  style?: ViewStyle;
  /** Test ID for testing */
  testID?: string;
  /** Additional metadata */
  metadata?: { label: string; value: string; icon?: keyof typeof Ionicons.glyphMap }[];
  /** Show performance indicator icon */
  showPerformanceIcon?: boolean;
  /** Custom status */
  status?: string;
  /** Disabled state */
  disabled?: boolean;
}

export const ClassroomCard: React.FC<ClassroomCardProps> = ({
  id,
  title,
  performanceLevels = [],
  location,
  schedule,
  image,
  onPress,
  style,
  testID = "classroom-card",
  metadata = [],
  showPerformanceIcon = true,
  status,
  disabled = false,
}) => {
  const { theme, screenDimensions } = useTheme();
  const styles = createStyles(theme, screenDimensions);

  const handlePress = () => {
    if (!disabled && onPress) {
      onPress(id);
    }
  };

  const formatTime = (startTime: string, endTime: string): string => {
    return `${startTime} - ${endTime}`;
  };

  const getPerformanceLevelColor = (type: PerformanceLevel['type']): string => {
    switch (type) {
      case 'highest':
        return theme.colors.status.success;
      case 'lowest':
        return theme.colors.status.warning;
      case 'average':
        return theme.colors.interactive.primary;
      default:
        return theme.colors.text.secondary;
    }
  };

  const renderPerformanceLevel = (level: PerformanceLevel, index: number) => {
    const levelColor = level.color || getPerformanceLevelColor(level.type);
    
    return (
      <View key={index} style={styles.performanceRow}>
        <View style={styles.performanceIndicator}>
          {showPerformanceIcon && (
            <Ionicons
              name="star"
              size={theme.iconSize.xs}
              color={levelColor}
              style={styles.performanceIcon}
            />
          )}
          <Text style={[styles.performanceLabel, { color: levelColor }]}>
            {level.type.charAt(0).toUpperCase() + level.type.slice(1)}:
          </Text>
        </View>
        <Text style={styles.performanceDescription} numberOfLines={1}>
          {level.description}
        </Text>
      </View>
    );
  };

  const renderImage = () => {
    if (!image) {
      return (
        <View style={styles.placeholderImage}>
          <Ionicons
            name="school-outline"
            size={theme.iconSize.lg}
            color={theme.colors.icon.tertiary}
          />
        </View>
      );
    }

    return (
      <Image
        source={image}
        style={styles.classroomImage}
        accessibilityIgnoresInvertColors
      />
    );
  };

  const renderMetadata = () => {
    if (metadata.length === 0) return null;

    return (
      <View style={styles.metadataContainer}>
        {metadata.map((item, index) => (
          <View key={index} style={styles.metadataItem}>
            {item.icon && (
              <Ionicons
                name={item.icon}
                size={theme.iconSize.xs}
                color={theme.colors.icon.secondary}
                style={styles.metadataIcon}
              />
            )}
            <Text style={styles.metadataLabel}>{item.label}:</Text>
            <Text style={styles.metadataValue}>{item.value}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && !disabled && styles.cardPressed,
        disabled && styles.cardDisabled,
        style,
      ]}
      onPress={handlePress}
      disabled={disabled || !onPress}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={`${title} classroom at ${location}, scheduled ${formatTime(schedule.startTime, schedule.endTime)}`}
      accessibilityState={{ disabled }}
    >
      {/* Main Content */}
      <View style={styles.cardContent}>
        <View style={styles.mainRow}>
          {renderImage()}
          
          <View style={styles.contentColumn}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{title}</Text>
              {status && (
                <Text style={styles.status}>{status}</Text>
              )}
              {showPerformanceIcon && (
                <Ionicons
                  name="trophy-outline"
                  size={theme.iconSize.md}
                  color={theme.colors.interactive.primary}
                  style={styles.titleIcon}
                />
              )}
            </View>
            
            {/* Performance Levels */}
            <View style={styles.performanceContainer}>
              {performanceLevels.map((level, index) => renderPerformanceLevel(level, index))}
            </View>

            {/* Additional Metadata */}
            {renderMetadata()}
          </View>
        </View>
      </View>

      {/* Footer with Schedule and Location */}
      <View style={styles.cardFooter}>
        <View style={styles.footerItem}>
          <Ionicons
            name="time-outline"
            size={theme.iconSize.sm}
            color={theme.colors.icon.secondary}
          />
          <Text style={styles.footerText}>
            {formatTime(schedule.startTime, schedule.endTime)}
          </Text>
        </View>
        
        <View style={styles.footerItem}>
          <Ionicons
            name="location-outline"
            size={theme.iconSize.sm}
            color={theme.colors.icon.secondary}
          />
          <Text style={styles.footerText} numberOfLines={1}>
            {location}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const createStyles = (theme: any, screenDimensions: any) => {
  const isTablet = screenDimensions.isTablet;
  
  return StyleSheet.create({
    card: {
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.lg,
      marginVertical: theme.spacing.sm,
      marginHorizontal: theme.spacing.md,
      overflow: 'hidden',
      borderWidth: theme.borderWidth.sm,
      borderColor: theme.colors.border.primary,
      ...theme.elevation.sm,
      maxWidth: isTablet ? 600 : undefined,
      alignSelf: isTablet ? 'center' : 'stretch',
    },
    
    cardPressed: {
      opacity: 0.9,
      transform: [{ scale: 0.98 }],
    },
    
    cardDisabled: {
      opacity: 0.6,
    },
    
    cardContent: {
      padding: theme.spacing.lg,
    },
    
    mainRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    
    classroomImage: {
      width: isTablet ? 80 : 70,
      height: isTablet ? 80 : 70,
      borderRadius: theme.borderRadius.md,
      marginRight: theme.spacing.md,
      backgroundColor: theme.colors.background.secondary,
    },
    
    placeholderImage: {
      width: isTablet ? 80 : 70,
      height: isTablet ? 80 : 70,
      borderRadius: theme.borderRadius.md,
      marginRight: theme.spacing.md,
      backgroundColor: theme.colors.background.secondary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    contentColumn: {
      flex: 1,
    },
    
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    
    title: {
      fontSize: isTablet ? theme.fontSizes.body : theme.fontSizes.caption,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
      flex: 1,
    },
    
    status: {
      fontSize: isTablet ? theme.fontSizes.caption : theme.fontSizes.caption * 0.9,
      color: theme.colors.text.secondary,
      marginRight: theme.spacing.sm,
    },
    
    titleIcon: {
      marginLeft: theme.spacing.sm,
    },
    
    performanceContainer: {
      gap: theme.spacing.xs,
    },
    
    performanceRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    
    performanceIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      minWidth: isTablet ? 80 : 70,
    },
    
    performanceIcon: {
      marginRight: theme.spacing.xs,
    },
    
    performanceLabel: {
      fontSize: isTablet ? theme.fontSizes.caption * 0.9 : theme.fontSizes.caption * 0.8,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
    
    performanceDescription: {
      fontSize: isTablet ? theme.fontSizes.caption : theme.fontSizes.caption * 0.9,
      color: theme.colors.text.secondary,
      flex: 1,
      marginLeft: theme.spacing.sm,
    },
    
    metadataContainer: {
      marginTop: theme.spacing.sm,
      gap: theme.spacing.xs,
    },
    
    metadataItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    
    metadataIcon: {
      marginRight: theme.spacing.xs,
    },
    
    metadataLabel: {
      fontSize: isTablet ? theme.fontSizes.caption : theme.fontSizes.caption * 0.9,
      color: theme.colors.text.secondary,
      marginRight: theme.spacing.xs,
    },
    
    metadataValue: {
      fontSize: isTablet ? theme.fontSizes.caption : theme.fontSizes.caption * 0.9,
      color: theme.colors.text.primary,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
    
    cardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.background.secondary,
    },
    
    footerItem: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    
    footerText: {
      fontSize: isTablet ? theme.fontSizes.caption : theme.fontSizes.caption * 0.9,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: theme.colors.text.secondary,
      marginLeft: theme.spacing.xs,
    },
  });
};

export default ClassroomCard;