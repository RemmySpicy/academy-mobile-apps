import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

export interface BookingData {
  id: string;
  courseTitle: string;
  courseLevel: string;
  instructor: string;
  date: string;
  time: string;
  location: string;
  status: 'upcoming' | 'completed' | 'cancelled' | 'rescheduled';
  price: number;
  sessionNumber: number;
  totalSessions: number;
  color?: string;
}

export interface BookingCardProps {
  booking: BookingData;
  onPress?: (booking: BookingData) => void;
  onStatusPress?: (booking: BookingData) => void;
  variant?: 'default' | 'compact';
  showProgress?: boolean;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onPress,
  onStatusPress,
  variant = 'default',
  showProgress = true,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme, variant);

  const getStatusColor = (status: BookingData['status']) => {
    switch (status) {
      case 'upcoming':
        return theme.colors.interactive.primary;
      case 'completed':
        return theme.colors.status.success;
      case 'cancelled':
        return theme.colors.status.error;
      case 'rescheduled':
        return theme.colors.status.warning;
      default:
        return theme.colors.text.secondary;
    }
  };

  const getStatusIcon = (status: BookingData['status']) => {
    switch (status) {
      case 'upcoming':
        return 'time';
      case 'completed':
        return 'checkmark-circle';
      case 'cancelled':
        return 'close-circle';
      case 'rescheduled':
        return 'refresh-circle';
      default:
        return 'help-circle';
    }
  };

  const progressPercentage = (booking.sessionNumber / booking.totalSessions) * 100;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(booking)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.content}>
          <Text style={styles.title}>{booking.courseTitle}</Text>
          <Text style={styles.level}>{booking.courseLevel}</Text>
          <Text style={styles.instructor}>with {booking.instructor}</Text>
        </View>
        <View style={[
          styles.iconContainer,
          { backgroundColor: booking.color || theme.colors.interactive.primary + '20' }
        ]}>
          <Ionicons
            name="water"
            size={24}
            color={booking.color || theme.colors.interactive.primary}
          />
        </View>
      </View>

      {showProgress && variant === 'default' && (
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>
              Session Progress
            </Text>
            <Text style={styles.progressText}>
              {booking.sessionNumber}/{booking.totalSessions}
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progressPercentage}%`,
                    backgroundColor: booking.color || theme.colors.interactive.primary,
                  },
                ]}
              />
            </View>
          </View>
        </View>
      )}

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar" size={16} color={theme.colors.text.secondary} />
          <Text style={styles.detailText}>{booking.date}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="time" size={16} color={theme.colors.text.secondary} />
          <Text style={styles.detailText}>{booking.time}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="location" size={16} color={theme.colors.text.secondary} />
          <Text style={styles.detailText}>{booking.location}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) + '20' }]}
          onPress={() => onStatusPress?.(booking)}
        >
          <Ionicons
            name={getStatusIcon(booking.status)}
            size={14}
            color={getStatusColor(booking.status)}
          />
          <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Text>
        </TouchableOpacity>
        <Text style={styles.price}>${booking.price}</Text>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (theme: any, variant: 'default' | 'compact') =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      ...theme.elevation.sm,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      marginBottom: theme.spacing.sm,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: variant === 'compact' ? theme.spacing.sm : theme.spacing.md,
    },
    content: {
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    title: {
      color: theme.colors.text.primary,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      fontSize: variant === 'compact' ? theme.fontSizes.base : theme.fontSizes.lg,
      marginBottom: theme.spacing.xs / 2,
    },
    level: {
      color: theme.colors.text.secondary,
      fontSize: theme.fontSizes.sm,
      marginBottom: theme.spacing.xs / 2,
    },
    instructor: {
      color: theme.colors.text.tertiary,
      fontSize: theme.fontSizes.sm,
    },
    iconContainer: {
      width: variant === 'compact' ? 40 : 48,
      height: variant === 'compact' ? 40 : 48,
      borderRadius: theme.borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
    progressContainer: {
      marginBottom: theme.spacing.sm,
    },
    progressHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.xs,
    },
    progressLabel: {
      color: theme.colors.text.tertiary,
      fontSize: theme.fontSizes.xs,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
    progressText: {
      color: theme.colors.text.secondary,
      fontSize: theme.fontSizes.xs,
      fontWeight: theme.fontConfig.fontWeight.semibold,
    },
    progressBarContainer: {
      height: 4,
      backgroundColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.sm,
      overflow: 'hidden',
    },
    progressBar: {
      flex: 1,
      backgroundColor: theme.colors.background.tertiary,
      borderRadius: theme.borderRadius.sm,
    },
    progressFill: {
      height: '100%',
      borderRadius: theme.borderRadius.sm,
    },
    details: {
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.md,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    detailText: {
      color: theme.colors.text.secondary,
      fontSize: theme.fontSizes.sm,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs / 2,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs / 2,
      borderRadius: theme.borderRadius.md,
    },
    statusText: {
      fontSize: theme.fontSizes.xs,
      fontWeight: theme.fontConfig.fontWeight.medium,
      textTransform: 'capitalize',
    },
    price: {
      color: theme.colors.interactive.primary,
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontConfig.fontWeight.bold,
    },
  });

export default BookingCard;