import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheet, useTheme, createThemedStyles } from '@academy/mobile-shared';

interface FacilitySchedule {
  id: string;
  scheduleTitle: string;
  scheduleType: string;
  instructor: string;
  dayOfWeek: string;
  time: string;
  location: string;
  totalSessions: number;
  currentParticipants: number;
  maxParticipants: number;
  availableSpots: number;
  description?: string;
  ageGroup?: string;
  skillLevel?: string;
}

interface JoinScheduleBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  schedule: FacilitySchedule | null;
  userSessionCredits: number;
  onJoinSchedule: (scheduleId: string, sessionCount: number, participants: string[]) => void;
}

interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  relationship: 'self' | 'child' | 'spouse';
  isSelected: boolean;
}

const useStyles = createThemedStyles((theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
    },
    title: {
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
      flex: 1,
    },
    subtitle: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text.secondary,
      marginTop: theme.spacing.xs / 2,
    },
    closeButton: {
      padding: theme.spacing.xs,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.background.secondary,
    },
    content: {
      flex: 1,
      paddingHorizontal: theme.spacing.md,
    },
    section: {
      marginTop: theme.spacing.md,
    },
    sectionTitle: {
      fontSize: theme.fontSizes.base,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.sm,
    },
    scheduleCard: {
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    scheduleHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    scheduleInfo: {
      flex: 1,
    },
    scheduleTitleText: {
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.xs / 2,
    },
    scheduleTypeText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.xs / 2,
    },
    instructorText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text.tertiary,
    },
    creditsDisplayContainer: {
      alignItems: 'flex-end',
    },
    creditsDisplayText: {
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontConfig.fontWeight.bold,
      color: theme.colors.interactive.primary,
    },
    sessionCountText: {
      fontSize: theme.fontSizes.xs,
      color: theme.colors.text.tertiary,
      marginTop: theme.spacing.xs / 2,
    },
    detailsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
    },
    detailItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      minWidth: '45%',
    },
    detailText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text.secondary,
    },
    availabilityContainer: {
      marginTop: theme.spacing.sm,
      padding: theme.spacing.sm,
      backgroundColor: theme.colors.background.tertiary,
      borderRadius: theme.borderRadius.md,
    },
    availabilityRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    availabilityText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text.secondary,
    },
    spotsText: {
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: theme.colors.interactive.primary,
    },
    progressBarContainer: {
      height: 4,
      backgroundColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.sm,
      marginTop: theme.spacing.xs,
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      backgroundColor: theme.colors.interactive.primary,
      borderRadius: theme.borderRadius.sm,
    },
    frequencyContainer: {
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
    },
    frequencyHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    frequencyTitle: {
      fontSize: theme.fontSizes.base,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
    },
    remainingSessionsText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text.secondary,
    },
    frequencyControls: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.md,
    },
    frequencyButton: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.interactive.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    frequencyButtonDisabled: {
      backgroundColor: theme.colors.background.tertiary,
    },
    frequencyButtonText: {
      color: 'white',
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontConfig.fontWeight.bold,
    },
    frequencyButtonTextDisabled: {
      color: theme.colors.text.tertiary,
    },
    frequencyDisplay: {
      minWidth: 60,
      alignItems: 'center',
    },
    frequencyValue: {
      fontSize: theme.fontSizes.xl,
      fontWeight: theme.fontConfig.fontWeight.bold,
      color: theme.colors.interactive.primary,
    },
    frequencyLabel: {
      fontSize: theme.fontSizes.xs,
      color: theme.colors.text.tertiary,
      marginTop: theme.spacing.xs / 2,
    },
    participantContainer: {
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
    },
    participantItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: theme.borderRadius.sm,
      borderWidth: 2,
      borderColor: theme.colors.border.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.sm,
    },
    checkboxSelected: {
      backgroundColor: theme.colors.interactive.primary,
      borderColor: theme.colors.interactive.primary,
    },
    participantInfo: {
      flex: 1,
    },
    participantName: {
      fontSize: theme.fontSizes.base,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: theme.colors.text.primary,
    },
    participantRelation: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text.secondary,
      marginTop: theme.spacing.xs / 2,
    },
    creditsContainer: {
      backgroundColor: theme.colors.interactive.primary + '10',
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.interactive.primary + '30',
    },
    creditsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    creditsLabel: {
      fontSize: theme.fontSizes.base,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
    },
    creditsValue: {
      fontSize: theme.fontSizes.xl,
      fontWeight: theme.fontConfig.fontWeight.bold,
      color: theme.colors.interactive.primary,
    },
    creditsBreakdown: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.spacing.xs,
    },
    remainingCreditsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: theme.spacing.sm,
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.primary,
    },
    remainingCreditsLabel: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text.secondary,
    },
    remainingCreditsValue: {
      fontSize: theme.fontSizes.base,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
    },
    breakdownText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text.secondary,
    },
    joinButton: {
      backgroundColor: theme.colors.interactive.primary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      alignItems: 'center',
      margin: theme.spacing.md,
    },
    joinButtonDisabled: {
      backgroundColor: theme.colors.background.tertiary,
    },
    joinButtonText: {
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: 'white',
    },
    joinButtonTextDisabled: {
      color: theme.colors.text.tertiary,
    },
  })
);

export const JoinScheduleBottomSheet: React.FC<JoinScheduleBottomSheetProps> = ({
  visible,
  onClose,
  schedule,
  userSessionCredits,
  onJoinSchedule,
}) => {
  const { theme } = useTheme();
  const styles = useStyles();
  
  const [selectedSessionCount, setSelectedSessionCount] = useState(1);
  const [participants, setParticipants] = useState<Participant[]>([
    { id: 'self', firstName: 'John', lastName: 'Parent', relationship: 'self', isSelected: true },
    { id: 'child1', firstName: 'Emma', lastName: 'Parent', relationship: 'child', isSelected: false },
    { id: 'child2', firstName: 'Noah', lastName: 'Parent', relationship: 'child', isSelected: false },
    { id: 'spouse', firstName: 'Jane', lastName: 'Parent', relationship: 'spouse', isSelected: false },
  ]);

  if (!schedule) return null;

  const getRelationshipLabel = (relationship: string) => {
    switch (relationship) {
      case 'self': return 'You';
      case 'child': return 'Your child';
      case 'spouse': return 'Your spouse';
      default: return '';
    }
  };

  const maxSessionCount = Math.min(userSessionCredits, schedule.totalSessions || 8);
  const selectedParticipants = participants.filter(p => p.isSelected);
  const totalCreditsNeeded = selectedSessionCount * selectedParticipants.length;
  const availabilityPercentage = (schedule.currentParticipants / schedule.maxParticipants) * 100;

  const canJoin = selectedSessionCount > 0 && selectedParticipants.length > 0 && 
                 (schedule.currentParticipants + selectedParticipants.length <= schedule.maxParticipants) &&
                 totalCreditsNeeded <= userSessionCredits;

  const handleSessionCountChange = (delta: number) => {
    const newCount = selectedSessionCount + delta;
    if (newCount >= 1 && newCount <= maxSessionCount) {
      setSelectedSessionCount(newCount);
    }
  };

  const toggleParticipant = (participantId: string) => {
    setParticipants(prev => prev.map(p => 
      p.id === participantId ? { ...p, isSelected: !p.isSelected } : p
    ));
  };

  const handleJoinSchedule = () => {
    if (!canJoin) {
      if (totalCreditsNeeded > userSessionCredits) {
        Alert.alert('Insufficient Credits', `You need ${totalCreditsNeeded} session credits but only have ${userSessionCredits} available.`);
      } else {
        Alert.alert('Unable to Join', 'Please select at least one participant and ensure there are available spots.');
      }
      return;
    }

    const participantIds = selectedParticipants.map(p => p.id);
    onJoinSchedule(schedule.id, selectedSessionCount, participantIds);
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Join Schedule</Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              {schedule.scheduleTitle}
            </Text>
          </View>
          
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Ionicons
              name="close"
              size={20}
              color={theme.colors.text.secondary}
            />
          </Pressable>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Schedule Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Schedule Details</Text>
            <View style={styles.scheduleCard}>
              <View style={styles.scheduleHeader}>
                <View style={styles.scheduleInfo}>
                  <Text style={styles.scheduleTitleText}>{schedule.scheduleTitle}</Text>
                  <Text style={styles.scheduleTypeText}>{schedule.scheduleType}</Text>
                  <Text style={styles.instructorText}>with {schedule.instructor}</Text>
                </View>
                <View style={styles.creditsDisplayContainer}>
                  <Text style={styles.creditsDisplayText}>1 Credit</Text>
                  <Text style={styles.sessionCountText}>per session</Text>
                </View>
              </View>

              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <Ionicons name="calendar" size={16} color={theme.colors.text.secondary} />
                  <Text style={styles.detailText}>{schedule.dayOfWeek}s</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="time" size={16} color={theme.colors.text.secondary} />
                  <Text style={styles.detailText}>{schedule.time}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="location" size={16} color={theme.colors.text.secondary} />
                  <Text style={styles.detailText}>{schedule.location}</Text>
                </View>
                {schedule.ageGroup && (
                  <View style={styles.detailItem}>
                    <Ionicons name="people" size={16} color={theme.colors.text.secondary} />
                    <Text style={styles.detailText}>{schedule.ageGroup}</Text>
                  </View>
                )}
              </View>

              <View style={styles.availabilityContainer}>
                <View style={styles.availabilityRow}>
                  <Text style={styles.availabilityText}>Availability</Text>
                  <Text style={styles.spotsText}>
                    {schedule.availableSpots} spots available
                  </Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View 
                    style={[styles.progressBar, { width: `${availabilityPercentage}%` }]} 
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Session Frequency */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How many sessions?</Text>
            <View style={styles.frequencyContainer}>
              <View style={styles.frequencyHeader}>
                <Text style={styles.frequencyTitle}>Sessions to book</Text>
                <Text style={styles.remainingSessionsText}>
                  {userSessionCredits} credits available
                </Text>
              </View>
              
              <View style={styles.frequencyControls}>
                <Pressable
                  style={[
                    styles.frequencyButton,
                    selectedSessionCount <= 1 && styles.frequencyButtonDisabled,
                  ]}
                  onPress={() => handleSessionCountChange(-1)}
                  disabled={selectedSessionCount <= 1}
                >
                  <Text
                    style={[
                      styles.frequencyButtonText,
                      selectedSessionCount <= 1 && styles.frequencyButtonTextDisabled,
                    ]}
                  >
                    −
                  </Text>
                </Pressable>

                <View style={styles.frequencyDisplay}>
                  <Text style={styles.frequencyValue}>{selectedSessionCount}</Text>
                  <Text style={styles.frequencyLabel}>
                    {selectedSessionCount === 1 ? 'session' : 'sessions'}
                  </Text>
                </View>

                <Pressable
                  style={[
                    styles.frequencyButton,
                    selectedSessionCount >= maxSessionCount && styles.frequencyButtonDisabled,
                  ]}
                  onPress={() => handleSessionCountChange(1)}
                  disabled={selectedSessionCount >= maxSessionCount}
                >
                  <Text
                    style={[
                      styles.frequencyButtonText,
                      selectedSessionCount >= maxSessionCount && styles.frequencyButtonTextDisabled,
                    ]}
                  >
                    +
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Participant Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Who's joining?</Text>
            <View style={styles.participantContainer}>
              {participants.map((participant) => (
                <Pressable
                  key={participant.id}
                  style={styles.participantItem}
                  onPress={() => toggleParticipant(participant.id)}
                >
                  <View style={[
                    styles.checkbox,
                    participant.isSelected && styles.checkboxSelected
                  ]}>
                    {participant.isSelected && (
                      <Ionicons
                        name="checkmark"
                        size={14}
                        color="white"
                      />
                    )}
                  </View>
                  
                  <View style={styles.participantInfo}>
                    <Text style={styles.participantName}>
                      {participant.firstName} {participant.lastName}
                    </Text>
                    <Text style={styles.participantRelation}>
                      {getRelationshipLabel(participant.relationship)}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Session Credits */}
          <View style={styles.creditsContainer}>
            <View style={styles.creditsRow}>
              <Text style={styles.creditsLabel}>Credits Required</Text>
              <Text style={styles.creditsValue}>{totalCreditsNeeded}</Text>
            </View>
            <View style={styles.creditsBreakdown}>
              <Text style={styles.breakdownText}>
                {selectedSessionCount} session{selectedSessionCount !== 1 ? 's' : ''}
              </Text>
              <Text style={styles.breakdownText}>
                {selectedParticipants.length} participant{selectedParticipants.length !== 1 ? 's' : ''}
              </Text>
            </View>
            
            <View style={styles.remainingCreditsRow}>
              <Text style={styles.remainingCreditsLabel}>Remaining after booking</Text>
              <Text style={[
                styles.remainingCreditsValue,
                { 
                  color: userSessionCredits - totalCreditsNeeded >= 0 
                    ? theme.colors.status.success 
                    : theme.colors.status.error 
                }
              ]}>
                {userSessionCredits - totalCreditsNeeded} credits
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Join Button */}
        <Pressable
          style={[styles.joinButton, !canJoin && styles.joinButtonDisabled]}
          onPress={handleJoinSchedule}
          disabled={!canJoin}
        >
          <Text style={[styles.joinButtonText, !canJoin && styles.joinButtonTextDisabled]}>
            {canJoin ? `Join Schedule - ${totalCreditsNeeded} Credits` : 
             totalCreditsNeeded > userSessionCredits ? 'Insufficient Credits' : 'Cannot Join Schedule'}
          </Text>
        </Pressable>
      </View>
    </BottomSheet>
  );
};

export default JoinScheduleBottomSheet;