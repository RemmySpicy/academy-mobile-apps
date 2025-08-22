/**
 * WorkoutCard Component
 * 
 * A card component for displaying workout/activity progress with Academy theming.
 * Supports expandable details, progress tracking, and user information.
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Pressable, 
  Image, 
  StyleSheet, 
  ViewStyle, 
  TextStyle,
  ImageSourcePropType,
  LayoutAnimation,
  Platform,
  UIManager
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export interface WorkoutPhase {
  /** Unique identifier for the phase */
  id: string;
  /** Phase name/title */
  name: string;
  /** Progress percentage (0-100) */
  progress: number;
  /** Custom color for progress bar */
  color?: string;
  /** Phase status */
  status?: 'not-started' | 'in-progress' | 'completed';
}

export interface WorkoutUser {
  /** User's name */
  name: string;
  /** User's avatar image */
  avatar: ImageSourcePropType | string;
}

export interface WorkoutDetail {
  /** Detail label */
  label: string;
  /** Detail value */
  value: string;
}

export interface WorkoutCardProps {
  /** Unique workout identifier */
  id: string;
  /** Workout title */
  title: string;
  /** User information */
  user: WorkoutUser;
  /** Workout phases */
  phases: WorkoutPhase[];
  /** Additional workout details */
  details?: WorkoutDetail[];
  /** Initially expanded state */
  initiallyExpanded?: boolean;
  /** Callback when card is expanded/collapsed */
  onToggleExpanded?: (expanded: boolean) => void;
  /** Callback when action button is pressed */
  onActionPress?: (workoutId: string) => void;
  /** Action button text */
  actionButtonText?: string;
  /** Container styles */
  style?: ViewStyle;
  /** Disable expansion */
  disableExpansion?: boolean;
  /** Test ID for testing */
  testID?: string;
  /** Custom status text */
  customStatus?: string;
  /** Show action button */
  showActionButton?: boolean;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({
  id,
  title,
  user,
  phases,
  details = [],
  initiallyExpanded = false,
  onToggleExpanded,
  onActionPress,
  actionButtonText = "View Details",
  style,
  disableExpansion = false,
  testID = "workout-card",
  customStatus,
  showActionButton = true,
}) => {
  const { theme, screenDimensions } = useTheme();
  const [expanded, setExpanded] = useState(initiallyExpanded);
  
  const styles = createStyles(theme, screenDimensions);

  // Calculate status based on phases
  const getStatusInfo = () => {
    if (customStatus) return customStatus;
    
    const completedPhases = phases.filter(phase => 
      phase.status === 'completed' || phase.progress === 100
    ).length;
    const totalPhases = phases.length;

    if (completedPhases === totalPhases) {
      return "Completed";
    } else if (completedPhases === 0) {
      return "Not started";
    } else {
      return `${completedPhases}/${totalPhases} completed`;
    }
  };

  const toggleExpand = () => {
    if (disableExpansion) return;
    
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    onToggleExpanded?.(newExpanded);
  };

  const handleActionPress = () => {
    onActionPress?.(id);
  };

  const getPhaseColor = (phase: WorkoutPhase): string => {
    if (phase.color) return phase.color;
    
    if (phase.status === 'completed' || phase.progress === 100) {
      return theme.colors.status.success;
    } else if (phase.status === 'in-progress' || phase.progress > 0) {
      return theme.colors.status.warning;
    } else {
      return theme.colors.interactive.primaryDisabled;
    }
  };

  const renderAvatar = () => {
    const avatarSource = typeof user.avatar === 'string' 
      ? { uri: user.avatar } 
      : user.avatar;

    return (
      <Image
        source={avatarSource}
        style={styles.avatar}
        accessibilityIgnoresInvertColors
      />
    );
  };

  const renderPhase = (phase: WorkoutPhase, index: number) => {
    const phaseColor = getPhaseColor(phase);
    
    return (
      <View key={phase.id} style={styles.phaseContainer}>
        <View style={styles.phaseHeader}>
          <View style={styles.phaseLabel}>
            <Text style={styles.phaseLabelText}>{phase.name}</Text>
          </View>
        </View>

        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${Math.max(0, Math.min(100, phase.progress))}%`,
                backgroundColor: phaseColor,
              },
            ]}
          />
        </View>

        <Text style={styles.progressText}>{phase.progress}%</Text>
      </View>
    );
  };

  const renderExpandedContent = () => {
    if (!expanded) return null;

    return (
      <View style={styles.expandedContent}>
        {details.length > 0 && (
          <>
            <Text style={styles.expandedTitle}>Details</Text>
            {details.map((detail, index) => (
              <View key={index} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{detail.label}:</Text>
                <Text style={styles.detailValue}>{detail.value}</Text>
              </View>
            ))}
          </>
        )}

        {showActionButton && onActionPress && (
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              pressed && styles.actionButtonPressed,
            ]}
            onPress={handleActionPress}
            testID={`${testID}-action`}
            accessibilityRole="button"
            accessibilityLabel={actionButtonText}
          >
            <Text style={styles.actionButtonText}>{actionButtonText}</Text>
          </Pressable>
        )}
      </View>
    );
  };

  return (
    <View 
      style={[styles.card, style]}
      testID={testID}
    >
      {/* Card Header */}
      <Pressable
        style={({ pressed }) => [
          styles.cardHeader,
          !disableExpansion && pressed && styles.cardHeaderPressed,
        ]}
        onPress={toggleExpand}
        disabled={disableExpansion}
        testID={`${testID}-header`}
        accessibilityRole={disableExpansion ? undefined : "button"}
        accessibilityLabel={`${title} by ${user.name}, ${getStatusInfo()}${!disableExpansion ? ', tap to expand' : ''}`}
        accessibilityState={{ expanded: expanded }}
      >
        <View style={styles.userInfo}>
          {renderAvatar()}
          <View style={styles.userDetails}>
            <Text style={styles.workoutTitle} numberOfLines={1}>{title}</Text>
            <Text style={styles.userName} numberOfLines={1}>{user.name}</Text>
          </View>
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{getStatusInfo()}</Text>
          {!disableExpansion && (
            <Ionicons
              name={expanded ? "chevron-up" : "chevron-down"}
              size={theme.iconSize.sm}
              color={theme.colors.icon.secondary}
            />
          )}
        </View>
      </Pressable>

      {/* Progress Container */}
      <View style={styles.progressContainer}>
        {phases.map((phase, index) => renderPhase(phase, index))}
      </View>

      {/* Expanded Content */}
      {renderExpandedContent()}
    </View>
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
      borderWidth: theme.borderWidth.thin,
      borderColor: theme.colors.border.primary,
      ...theme.elevation.sm,
      maxWidth: isTablet ? 600 : undefined,
      alignSelf: isTablet ? 'center' : 'stretch',
    },
    
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.lg,
      borderBottomWidth: theme.borderWidth.thin,
      borderBottomColor: theme.colors.border.secondary,
      backgroundColor: theme.colors.background.primary,
    },
    
    cardHeaderPressed: {
      backgroundColor: theme.colors.background.elevated,
    },
    
    userInfo: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: theme.spacing.md,
    },
    
    avatar: {
      width: isTablet ? 48 : 40,
      height: isTablet ? 48 : 40,
      borderRadius: theme.borderRadius.full,
      marginRight: theme.spacing.md,
      backgroundColor: theme.colors.background.secondary,
    },
    
    userDetails: {
      flex: 1,
    },
    
    workoutTitle: {
      fontSize: isTablet ? theme.fontSizes.body : theme.fontSizes.caption,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.xs / 2,
    },
    
    userName: {
      fontSize: isTablet ? theme.fontSizes.caption : theme.fontSizes.caption * 0.9,
      fontWeight: theme.fontConfig.fontWeight.regular,
      color: theme.colors.text.secondary,
    },
    
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    
    statusText: {
      fontSize: isTablet ? theme.fontSizes.caption : theme.fontSizes.caption * 0.9,
      color: theme.colors.text.secondary,
      marginRight: theme.spacing.sm,
    },
    
    progressContainer: {
      padding: theme.spacing.md,
      gap: theme.spacing.md,
    },
    
    phaseContainer: {
      gap: theme.spacing.sm,
    },
    
    phaseHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    
    phaseLabel: {
      backgroundColor: theme.colors.background.secondary,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
    },
    
    phaseLabelText: {
      fontSize: isTablet ? theme.fontSizes.caption : theme.fontSizes.caption * 0.9,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: theme.colors.text.secondary,
    },
    
    progressBarContainer: {
      height: isTablet ? 10 : 8,
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.sm,
      overflow: 'hidden',
    },
    
    progressBar: {
      height: '100%',
      borderRadius: theme.borderRadius.sm,
    },
    
    progressText: {
      fontSize: isTablet ? theme.fontSizes.caption : theme.fontSizes.caption * 0.9,
      color: theme.colors.text.secondary,
      textAlign: 'right',
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
    
    expandedContent: {
      padding: theme.spacing.md,
      borderTopWidth: theme.borderWidth.sm,
      borderTopColor: theme.colors.border.primary,
      backgroundColor: theme.colors.background.secondary,
    },
    
    expandedTitle: {
      fontSize: isTablet ? theme.fontSizes.body : theme.fontSizes.caption,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.md,
    },
    
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    
    detailLabel: {
      fontSize: isTablet ? theme.fontSizes.caption : theme.fontSizes.caption * 0.9,
      color: theme.colors.text.secondary,
      flex: 1,
    },
    
    detailValue: {
      fontSize: isTablet ? theme.fontSizes.caption : theme.fontSizes.caption * 0.9,
      color: theme.colors.text.primary,
      fontWeight: theme.fontConfig.fontWeight.medium,
      textAlign: 'right',
      flex: 1,
    },
    
    actionButton: {
      backgroundColor: theme.colors.interactive.primary,
      borderRadius: theme.borderRadius.lg,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.xl,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: theme.spacing.lg,
      minHeight: theme.safeArea.minTouchTarget.height,
      ...theme.elevation.xs,
    },
    
    actionButtonPressed: {
      opacity: 0.8,
      transform: [{ scale: 0.98 }],
    },
    
    actionButtonText: {
      color: theme.colors.text.inverse,
      fontSize: isTablet ? theme.fontSizes.body : theme.fontSizes.caption,
      fontWeight: theme.fontConfig.fontWeight.semibold,
    },
  });
};

export default WorkoutCard;