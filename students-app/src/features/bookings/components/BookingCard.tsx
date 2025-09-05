import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInRight,
  Layout,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme, createThemedStyles } from '@academy/mobile-shared';
import { ParticipantManagementBottomSheet } from './ParticipantManagementBottomSheet';
import { JoinScheduleBottomSheet } from './JoinScheduleBottomSheet';

interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  role: 'student' | 'parent' | 'instructor';
}

interface Booking {
  id: string;
  scheduleTitle: string;
  scheduleType: string;
  instructor: string;
  date: string;
  time: string;
  location: string;
  status?: 'upcoming' | 'completed' | 'cancelled' | 'rescheduled';
  price: number;
  sessionNumber?: number;
  totalSessions: number;
  color: string;
  participants?: Participant[];
  maxParticipants?: number;
  currentParticipants?: number;
  availableSpots?: number;
  isRecurring?: boolean;
  recurringDay?: string;
  dayOfWeek?: string;
  description?: string;
  ageRange?: string;
  skillLevel?: string;
}

interface BookingCardProps {
  booking: Booking;
  index: number;
  variant?: 'booking' | 'facility-schedule';
  onPress?: (booking: Booking) => void;
  onManageParticipants?: (bookingId: string) => void;
  onJoinSchedule?: (scheduleId: string, sessionCount: number, participants: string[]) => void;
  onViewDetails?: (booking: Booking) => void;
  userSessionCredits?: number;
}

const useCardStyles = createThemedStyles((theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      ...theme.elevation.sm,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      marginBottom: theme.spacing.sm,
      marginHorizontal: theme.spacing.md,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    content: {
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    title: {
      color: theme.colors.text.primary,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      fontSize: theme.fontSizes.lg,
    },
    level: {
      color: theme.colors.text.secondary,
      fontSize: theme.fontSizes.sm,
    },
    levelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    levelItem: {
      color: theme.colors.text.secondary,
      fontSize: theme.fontSizes.sm,
    },
    levelSeparator: {
      color: theme.colors.text.tertiary,
      fontSize: theme.fontSizes.sm,
      marginHorizontal: theme.spacing.sm,
    },
    instructor: {
      color: theme.colors.text.tertiary,
      fontSize: theme.fontSizes.sm,
      marginTop: theme.spacing.xs / 2,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: theme.borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    // Participants section
    participantsContainer: {
      marginBottom: theme.spacing.sm,
    },
    participantsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.xs,
    },
    participantsLabel: {
      color: theme.colors.text.tertiary,
      fontSize: theme.fontSizes.xs,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
    participantsCount: {
      color: theme.colors.text.secondary,
      fontSize: theme.fontSizes.xs,
    },
    participantsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    participantsList: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    participantAvatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.colors.background.secondary,
      borderWidth: 2,
      borderColor: theme.colors.background.primary,
    },
    participantAvatarOverlap: {
      marginLeft: -theme.spacing.sm, // Less aggressive overlap
    },
    participantPlaceholder: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background.tertiary,
    },
    overflowIndicator: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.interactive.primary + '20', // Semi-transparent Academy purple
      borderColor: theme.colors.interactive.primary,
    },
    overflowText: {
      fontSize: theme.fontSizes.xs,
      color: theme.colors.interactive.primary,
      fontWeight: theme.fontConfig.fontWeight.bold,
    },
    participantActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    actionButton: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
    },
    addButton: {
      backgroundColor: 'transparent',
      borderColor: theme.colors.interactive.primary,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    addButtonText: {
      color: theme.colors.interactive.primary,
      fontSize: theme.fontSizes.xs,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
    
    // Detail rows
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    detailItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    detailText: {
      color: theme.colors.text.secondary,
      fontSize: theme.fontSizes.sm,
      marginLeft: theme.spacing.xs,
    },
    
    // Status and actions
    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    statusItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs / 2,
      paddingHorizontal: theme.spacing.sm + theme.spacing.xs / 2,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.md,
    },
    statusText: {
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
      marginLeft: theme.spacing.xs,
      textTransform: 'capitalize',
    },
    actionsRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionTextButton: {
      marginRight: theme.spacing.sm,
    },
    rescheduleText: {
      color: theme.colors.status.warning,
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
    cancelText: {
      color: theme.colors.status.error,
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
    reviewText: {
      color: theme.colors.interactive.primary,
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },

    // Facility Schedule Specific Styles
    availabilityContainer: {
      marginBottom: theme.spacing.sm,
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.sm,
    },
    availabilityRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.xs,
    },
    availabilityLabel: {
      color: theme.colors.text.tertiary,
      fontSize: theme.fontSizes.xs,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
    spotsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    spotsText: {
      color: theme.colors.text.secondary,
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
    spotsIcon: {
      padding: theme.spacing.xs / 2,
    },
    progressBar: {
      height: 6,
      backgroundColor: theme.colors.background.tertiary,
      borderRadius: theme.borderRadius.full,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: theme.borderRadius.full,
    },
    priceText: {
      color: theme.colors.interactive.primary,
      fontSize: theme.fontSizes.base,
      fontWeight: theme.fontConfig.fontWeight.semibold,
    },
    detailsButton: {
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
    },
    detailsButtonText: {
      color: theme.colors.interactive.primary,
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
    joinButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.interactive.primary,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    joinButtonDisabled: {
      backgroundColor: theme.colors.text.tertiary,
    },
    joinButtonText: {
      color: 'white',
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
    fullBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs / 2,
      backgroundColor: theme.colors.status.error + '20',
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.status.error,
    },
    fullBadgeText: {
      color: theme.colors.status.error,
      fontSize: theme.fontSizes.xs,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
  })
);

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  index,
  variant = 'booking',
  onPress,
  onManageParticipants,
  onJoinSchedule,
  onViewDetails,
  userSessionCredits = 8,
}) => {
  const { theme } = useTheme();
  const styles = useCardStyles();
  const scale = useSharedValue(1);
  const [showParticipantSheet, setShowParticipantSheet] = useState(false);
  const [showJoinScheduleSheet, setShowJoinScheduleSheet] = useState(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getStatusColor = (status: Booking['status']) => {
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
        return theme.colors.text.tertiary;
    }
  };

  const getStatusText = (status: Booking['status']) => {
    switch (status) {
      case 'upcoming':
        return 'Upcoming';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'rescheduled':
        return 'Rescheduled';
      default:
        return 'Unknown';
    }
  };

  const getStatusIcon = (status: Booking['status']) => {
    switch (status) {
      case 'upcoming':
        return 'time-outline';
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

  const renderParticipantAvatar = (participant: Participant, index: number) => {
    const isOverlapping = index > 0;
    return (
      <View
        key={participant.id}
        style={[
          styles.participantAvatar,
          isOverlapping && styles.participantAvatarOverlap,
        ]}
      >
        {participant.avatarUrl ? (
          <Image
            source={{ uri: participant.avatarUrl }}
            style={styles.participantAvatar}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.participantAvatar, styles.participantPlaceholder]}>
            <Ionicons
              name="person"
              size={16}
              color={theme.colors.text.tertiary}
            />
          </View>
        )}
      </View>
    );
  };

  const maxParticipants = booking.maxParticipants || 6;

  // Facility schedule specific variables
  const isFullyBooked = variant === 'facility-schedule' && booking.availableSpots === 0;
  const progressPercentage = variant === 'facility-schedule' 
    ? ((booking.currentParticipants || 0) / maxParticipants) * 100 
    : 0;

  const getProgressColor = () => {
    if (progressPercentage >= 90) return theme.colors.status.error;
    if (progressPercentage >= 70) return theme.colors.status.warning;
    return theme.colors.status.success;
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free';
    return `₦${price.toLocaleString()}`;
  };

  // Handler functions for participant management
  const handleAddParticipant = (participantId: string) => {
    console.log('Add participant:', participantId, 'to booking:', booking.id);
    // TODO: Implement add participant logic
    onManageParticipants?.(booking.id);
  };

  const handleRemoveParticipant = (participantId: string, reason: string) => {
    console.log('Remove participant:', participantId, 'from booking:', booking.id, 'reason:', reason);
    // TODO: Implement remove participant logic
    onManageParticipants?.(booking.id);
  };

  // Handler function for joining schedule
  const handleJoinSchedule = (scheduleId: string, sessionCount: number, participants: string[]) => {
    console.log('Join schedule:', scheduleId, 'sessions:', sessionCount, 'participants:', participants);
    onJoinSchedule?.(scheduleId, sessionCount, participants);
    setShowJoinScheduleSheet(false);
  };

  return (
    <Animated.View
      layout={Layout.springify()}
      entering={FadeInRight.delay(index * 50).springify()}
      style={animatedStyle}
    >
      <Pressable
        onPress={() => onPress?.(booking)}
        onPressIn={() => {
          scale.value = withSpring(0.98);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        style={styles.card}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.content}>
            <Text style={styles.title}>
              {booking.scheduleTitle}
            </Text>
            <View style={styles.levelRow}>
              {booking.scheduleType.split('•').map((item, index, array) => (
                <React.Fragment key={index}>
                  <Text style={styles.levelItem}>{item.trim()}</Text>
                  {index < array.length - 1 && (
                    <Text style={styles.levelSeparator}>•</Text>
                  )}
                </React.Fragment>
              ))}
            </View>
            <Text style={styles.instructor}>
              with {booking.instructor}
            </Text>
          </View>
          
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: `${booking.color}15` }
            ]}
          >
            <Ionicons name="water" size={24} color={booking.color} />
          </View>
        </View>

        {/* Conditional Section - Participants or Availability */}
        {variant === 'booking' ? (
          <View style={styles.participantsContainer}>
            <View style={styles.participantsHeader}>
              <Text style={styles.participantsLabel}>Participants</Text>
              <Text style={styles.participantsCount}>
                {(booking.participants || []).length}/{maxParticipants}
              </Text>
            </View>
            
            <View style={styles.participantsRow}>
              <View style={styles.participantsList}>
                {(booking.participants || []).slice(0, 5).map((participant, index) => 
                  renderParticipantAvatar(participant, index)
                )}
                {(booking.participants || []).length > 5 && (
                  <View style={[styles.participantAvatar, styles.overflowIndicator, styles.participantAvatarOverlap]}>
                    <Text style={styles.overflowText}>
                      +{(booking.participants || []).length - 5}
                    </Text>
                  </View>
                )}
                {(booking.participants || []).length === 0 && (
                  <Text style={{
                    color: theme.colors.text.tertiary,
                    fontSize: theme.fontSizes.sm,
                    fontStyle: 'italic'
                  }}>
                    No participants yet
                  </Text>
                )}
              </View>

              <View style={styles.participantActions}>
                <Pressable
                  style={[styles.actionButton, styles.addButton]}
                  onPress={() => setShowParticipantSheet(true)}
                >
                  <Ionicons 
                    name="people-outline" 
                    size={14} 
                    color={theme.colors.interactive.primary} 
                  />
                  <Text style={styles.addButtonText}>Add/Remove</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.availabilityContainer}>
            <View style={styles.availabilityRow}>
              <Text style={styles.availabilityLabel}>Availability</Text>
              <View style={styles.spotsContainer}>
                <Ionicons 
                  name="people" 
                  size={16} 
                  color={theme.colors.text.secondary}
                  style={styles.spotsIcon}
                />
                <Text style={styles.spotsText}>
                  {booking.currentParticipants || 0}/{maxParticipants}
                </Text>
                {isFullyBooked && (
                  <View style={styles.fullBadge}>
                    <Text style={styles.fullBadgeText}>FULL</Text>
                  </View>
                )}
              </View>
            </View>
            
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { 
                    width: `${progressPercentage}%`,
                    backgroundColor: getProgressColor()
                  }
                ]} 
              />
            </View>
          </View>
        )}

        {/* Date and Time */}
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={16} color={theme.colors.text.tertiary} />
            <Text style={styles.detailText}>
              {booking.isRecurring && booking.recurringDay 
                ? `Every ${booking.recurringDay}` 
                : booking.date}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color={theme.colors.text.tertiary} />
            <Text style={styles.detailText}>{booking.time}</Text>
          </View>
        </View>

        {/* Location and Credits */}
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={16} color={theme.colors.text.tertiary} />
            <Text style={styles.detailText}>{booking.location}</Text>
          </View>
          {variant === 'facility-schedule' && booking.totalSessions > 1 && (
            <View style={styles.detailItem}>
              <Ionicons name="calendar-outline" size={16} color={theme.colors.text.tertiary} />
              <Text style={styles.detailText}>
                {booking.totalSessions} sessions available
              </Text>
            </View>
          )}
        </View>

        {/* Status and Actions */}
        <View style={styles.statusRow}>
          {variant === 'booking' ? (
            <>
              <View style={[
                styles.statusItem,
                { backgroundColor: getStatusColor(booking.status) + '20' }
              ]}>
                <Ionicons 
                  name={getStatusIcon(booking.status) as any} 
                  size={16} 
                  color={getStatusColor(booking.status)} 
                />
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(booking.status) }
                  ]}
                >
                  {getStatusText(booking.status)}
                </Text>
              </View>
              
              <View style={styles.actionsRow}>
                {booking.status === 'upcoming' && (
                  <>
                    <Pressable style={styles.actionTextButton}>
                      <Text style={styles.rescheduleText}>Reschedule</Text>
                    </Pressable>
                    <Pressable>
                      <Text style={styles.cancelText}>Cancel</Text>
                    </Pressable>
                  </>
                )}
                {booking.status === 'completed' && (
                  <Pressable>
                    <Text style={styles.reviewText}>Review</Text>
                  </Pressable>
                )}
              </View>
            </>
          ) : (
            <>
              <Pressable 
                style={styles.detailsButton}
                onPress={() => setShowJoinScheduleSheet(true)}
              >
                <Text style={styles.detailsButtonText}>View Details</Text>
              </Pressable>
              
              <Pressable
                style={[
                  styles.joinButton,
                  isFullyBooked && styles.joinButtonDisabled
                ]}
                onPress={() => !isFullyBooked && setShowJoinScheduleSheet(true)}
                disabled={isFullyBooked}
              >
                <Ionicons 
                  name={isFullyBooked ? "close-circle" : "add-circle"} 
                  size={16} 
                  color="white" 
                />
                <Text style={styles.joinButtonText}>
                  {isFullyBooked ? 'Full' : 'Join Schedule'}
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </Pressable>

      {/* Participant Management Bottom Sheet - Only for booking variant */}
      {variant === 'booking' && (
        <ParticipantManagementBottomSheet
          visible={showParticipantSheet}
          onClose={() => setShowParticipantSheet(false)}
          bookingTitle={booking.scheduleTitle}
          currentParticipants={booking.participants || []}
          maxParticipants={maxParticipants}
          onAddParticipant={handleAddParticipant}
          onRemoveParticipant={handleRemoveParticipant}
        />
      )}

      {/* Join Schedule Bottom Sheet - Only for facility-schedule variant */}
      {variant === 'facility-schedule' && (
        <JoinScheduleBottomSheet
          visible={showJoinScheduleSheet}
          onClose={() => setShowJoinScheduleSheet(false)}
          schedule={{
            id: booking.id,
            scheduleTitle: booking.scheduleTitle,
            scheduleType: booking.scheduleType,
            instructor: booking.instructor,
            dayOfWeek: booking.dayOfWeek || 'Monday',
            time: booking.time,
            location: booking.location,
            totalSessions: booking.totalSessions,
            currentParticipants: booking.currentParticipants || 0,
            maxParticipants: maxParticipants,
            availableSpots: booking.availableSpots || 0,
            description: booking.description,
            ageGroup: booking.ageRange,
            skillLevel: booking.skillLevel,
          }}
          userSessionCredits={userSessionCredits}
          onJoinSchedule={handleJoinSchedule}
        />
      )}
    </Animated.View>
  );
};

export default BookingCard;