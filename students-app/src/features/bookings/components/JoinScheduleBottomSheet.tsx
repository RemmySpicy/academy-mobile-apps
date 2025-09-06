import React, { useState, useEffect, useMemo, useCallback } from 'react';
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

interface SessionDate {
  id: string;
  date: Date;
  dayOfWeek: string;
  formattedDate: string;
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
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.xs / 2,
    },
    participantItemSelected: {
      backgroundColor: theme.colors.interactive.primary + '08',
      borderWidth: 1,
      borderColor: theme.colors.interactive.primary + '20',
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
    participantCredits: {
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: theme.colors.interactive.primary,
    },
    participantWarning: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.xs / 2,
      padding: theme.spacing.xs,
      backgroundColor: theme.colors.status.warning + '15',
      borderRadius: theme.borderRadius.sm,
      gap: theme.spacing.xs / 2,
      borderWidth: 1,
      borderColor: theme.colors.status.warning + '30',
    },
    warningText: {
      fontSize: theme.fontSizes.xs,
      color: theme.colors.status.warning,
      fontWeight: theme.fontConfig.fontWeight.medium,
      flex: 1,
    },
    creditsRightColumn: {
      alignItems: 'flex-end',
      minWidth: 80,
    },
    sessionScheduleContainer: {
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginTop: theme.spacing.sm,
    },
    sessionScheduleTitle: {
      fontSize: theme.fontSizes.base,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.sm,
    },
    sessionGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.xs,
    },
    sessionItem: {
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      backgroundColor: theme.colors.background.tertiary,
      minWidth: '31%',
      alignItems: 'center',
    },
    sessionItemSelected: {
      backgroundColor: theme.colors.interactive.primary + '15',
      borderColor: theme.colors.interactive.primary,
    },
    sessionItemDeselected: {
      backgroundColor: theme.colors.status.error + '10',
      borderColor: theme.colors.status.error + '40',
    },
    sessionDate: {
      fontSize: theme.fontSizes.xs,
      color: theme.colors.text.secondary,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
    sessionDateSelected: {
      color: theme.colors.interactive.primary,
    },
    sessionDateDeselected: {
      color: theme.colors.status.error,
    },
    sessionDay: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text.primary,
      fontWeight: theme.fontConfig.fontWeight.medium,
      marginTop: theme.spacing.xs / 2,
    },
    sessionDaySelected: {
      color: theme.colors.interactive.primary,
    },
    sessionDayDeselected: {
      color: theme.colors.status.error,
    },
    sessionScheduleInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: theme.spacing.sm,
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.primary,
    },
    sessionScheduleInfoText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text.secondary,
    },
    sessionScheduleCount: {
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: theme.colors.interactive.primary,
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
    participantBreakdownContainer: {
      marginTop: theme.spacing.sm,
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.primary,
    },
    participantBreakdownItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.xs / 2,
    },
    participantBreakdownName: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text.secondary,
    },
    participantBreakdownCredits: {
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: theme.colors.text.primary,
    },
    participantBreakdownWarning: {
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: theme.colors.status.warning,
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
  const [customSessions, setCustomSessions] = useState<SessionDate[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([
    { id: 'self', firstName: 'John', lastName: 'Parent', relationship: 'self', isSelected: true },
    { id: 'child1', firstName: 'Emma', lastName: 'Parent', relationship: 'child', isSelected: false },
    { id: 'child2', firstName: 'Noah', lastName: 'Parent', relationship: 'child', isSelected: false },
    { id: 'spouse', firstName: 'Jane', lastName: 'Parent', relationship: 'spouse', isSelected: false },
  ]);

  // Helper functions - memoized to prevent recreating on every render
  const getDayOfWeekNumber = useCallback((dayName: string): number => {
    if (!dayName || typeof dayName !== 'string') return -1;
    
    // Normalize to lowercase and then capitalize first letter for consistent matching
    const normalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1).toLowerCase();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    return days.indexOf(normalizedDay);
  }, []);
  
  const formatSessionDate = useCallback((date: Date): string => {
    try {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      console.warn('Error formatting date:', error);
      return 'Invalid Date';
    }
  }, []);

  // Generate session dates based on selected count and schedule day
  useEffect(() => {
    if (!schedule) {
      setCustomSessions([]);
      return;
    }
    
    const dates: SessionDate[] = [];
    const today = new Date();
    const targetDay = getDayOfWeekNumber(schedule.dayOfWeek);
    
    // Safety check for valid day
    if (targetDay === -1) {
      console.warn('Invalid day of week:', schedule.dayOfWeek);
      setCustomSessions([]);
      return;
    }
    
    // Find next occurrence of the target day
    let currentDate = new Date(today);
    let daysAdded = 0;
    while (currentDate.getDay() !== targetDay && daysAdded < 7) {
      currentDate.setDate(currentDate.getDate() + 1);
      daysAdded++;
    }
    
    // Safety check to prevent infinite loops
    if (daysAdded >= 7) {
      console.warn('Could not find target day within a week');
      setCustomSessions([]);
      return;
    }
    
    // Generate dates for the specified number of sessions
    for (let i = 0; i < selectedSessionCount && i < 52; i++) { // Max 52 weeks
      const sessionDate = new Date(currentDate);
      sessionDate.setDate(currentDate.getDate() + (i * 7)); // Weekly sessions
      
      dates.push({
        id: `session-${i}`,
        date: new Date(sessionDate), // Create new date object to prevent mutation
        dayOfWeek: schedule.dayOfWeek,
        formattedDate: formatSessionDate(sessionDate),
        isSelected: true,
      });
    }
    
    setCustomSessions(dates);
  }, [schedule?.dayOfWeek, schedule?.id, selectedSessionCount]); // More specific dependencies

  if (!schedule) return null;

  const getRelationshipLabel = (relationship: string) => {
    switch (relationship) {
      case 'self': return 'You';
      case 'child': return 'Your child';
      case 'spouse': return 'Your spouse';
      default: return '';
    }
  };

  // Calculate max session count based on enrollment credits
  const selectedParticipants = participants.filter(p => p.isSelected);
  const maxSessionCount = Math.min(userSessionCredits, schedule.totalSessions || 8);
  
  // Calculate selected sessions count and credits needed
  const selectedSessionsCount = customSessions.filter(s => s.isSelected).length;
  const totalCreditsNeeded = selectedSessionsCount * selectedParticipants.length;
  const hasInsufficientCredits = totalCreditsNeeded > userSessionCredits;
  
  const availabilityPercentage = (schedule.currentParticipants / schedule.maxParticipants) * 100;

  const canJoin = selectedSessionCount > 0 && selectedParticipants.length > 0 && 
                 (schedule.currentParticipants + selectedParticipants.length <= schedule.maxParticipants) &&
                 !hasInsufficientCredits; // Must have enough credits

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
  
  const toggleSessionDate = (sessionId: string) => {
    setCustomSessions(prev => prev.map(session => 
      session.id === sessionId ? { ...session, isSelected: !session.isSelected } : session
    ));
  };

  const handleJoinSchedule = () => {
    if (!canJoin) {
      if (selectedParticipants.length === 0) {
        Alert.alert('No Participants Selected', 'Please select at least one participant to join the schedule.');
      } else if (schedule.currentParticipants + selectedParticipants.length > schedule.maxParticipants) {
        Alert.alert('Schedule Full', 'There are not enough spots available for all selected participants.');
      } else {
        Alert.alert('Unable to Join', 'Please select at least one participant and ensure there are available spots.');
      }
      return;
    }

    // Proceed with enrollment
    const participantIds = selectedParticipants.map(p => p.id);
    const selectedDates = customSessions.filter(s => s.isSelected).map(s => s.date);
    onJoinSchedule(schedule.id, selectedSessionsCount, participantIds);
  };

  return (
    <BottomSheet 
      visible={visible} 
      onClose={onClose}
      snapPoints={['large', 'full']}
      initialSnapPoint="large"
      showDragHandle={true}
      enablePanDownToClose={true}
    >
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

          {/* Participant Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Who's joining?</Text>
            <View style={styles.participantContainer}>
              {participants.map((participant) => (
                <Pressable
                  key={participant.id}
                  style={[
                    styles.participantItem,
                    participant.isSelected && styles.participantItemSelected
                  ]}
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

          {/* Session Frequency */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How many sessions?</Text>
            <View style={styles.frequencyContainer}>
              <View style={styles.frequencyHeader}>
                <Text style={styles.frequencyTitle}>Sessions to book</Text>
                <Text style={styles.remainingSessionsText}>
                  {selectedParticipants.length > 0 ? `Up to ${maxSessionCount} sessions available` : 'Select participants first'}
                </Text>
              </View>
              
              <View style={styles.frequencyControls}>
                <Pressable
                  style={[
                    styles.frequencyButton,
                    (selectedSessionCount <= 1 || selectedParticipants.length === 0) && styles.frequencyButtonDisabled,
                  ]}
                  onPress={() => handleSessionCountChange(-1)}
                  disabled={selectedSessionCount <= 1 || selectedParticipants.length === 0}
                >
                  <Text
                    style={[
                      styles.frequencyButtonText,
                      (selectedSessionCount <= 1 || selectedParticipants.length === 0) && styles.frequencyButtonTextDisabled,
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
                    (selectedSessionCount >= maxSessionCount || selectedParticipants.length === 0) && styles.frequencyButtonDisabled,
                  ]}
                  onPress={() => handleSessionCountChange(1)}
                  disabled={selectedSessionCount >= maxSessionCount || selectedParticipants.length === 0}
                >
                  <Text
                    style={[
                      styles.frequencyButtonText,
                      (selectedSessionCount >= maxSessionCount || selectedParticipants.length === 0) && styles.frequencyButtonTextDisabled,
                    ]}
                  >
                    +
                  </Text>
                </Pressable>
              </View>
              
              {/* Session Schedule Display */}
              {customSessions.length > 0 && (
                <View style={styles.sessionScheduleContainer}>
                  <Text style={styles.sessionScheduleTitle}>Session Schedule</Text>
                  <View style={styles.sessionGrid}>
                    {customSessions.map((session) => (
                      <Pressable
                        key={session.id}
                        style={[
                          styles.sessionItem,
                          session.isSelected 
                            ? styles.sessionItemSelected 
                            : styles.sessionItemDeselected
                        ]}
                        onPress={() => toggleSessionDate(session.id)}
                      >
                        <Text style={[
                          styles.sessionDate,
                          session.isSelected 
                            ? styles.sessionDateSelected 
                            : styles.sessionDateDeselected
                        ]}>
                          {session.formattedDate}
                        </Text>
                        <Text style={[
                          styles.sessionDay,
                          session.isSelected 
                            ? styles.sessionDaySelected 
                            : styles.sessionDayDeselected
                        ]}>
                          {session.dayOfWeek}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                  <View style={styles.sessionScheduleInfo}>
                    <Text style={styles.sessionScheduleInfoText}>
                      Tap sessions to include/exclude from enrollment
                    </Text>
                    <Text style={styles.sessionScheduleCount}>
                      {selectedSessionsCount} of {customSessions.length} selected
                    </Text>
                  </View>
                </View>
              )}
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
                {selectedSessionsCount} session{selectedSessionsCount !== 1 ? 's' : ''}
              </Text>
              <Text style={styles.breakdownText}>
                {selectedParticipants.length} participant{selectedParticipants.length !== 1 ? 's' : ''}
              </Text>
            </View>
            
            {/* Participant Breakdown */}
            {selectedParticipants.length > 0 && (
              <View style={styles.participantBreakdownContainer}>
                {selectedParticipants.map((participant) => (
                  <View key={participant.id} style={styles.participantBreakdownItem}>
                    <Text style={styles.participantBreakdownName}>
                      {participant.firstName} {participant.lastName}
                    </Text>
                    <Text style={styles.participantBreakdownCredits}>
                      {selectedSessionsCount} session{selectedSessionsCount !== 1 ? 's' : ''}
                    </Text>
                  </View>
                ))}
              </View>
            )}
            
            <View style={styles.remainingCreditsRow}>
              <Text style={styles.remainingCreditsLabel}>
                Total credits needed
              </Text>
              <Text style={[
                styles.remainingCreditsValue,
                { 
                  color: hasInsufficientCredits 
                    ? theme.colors.status.error
                    : theme.colors.interactive.primary
                }
              ]}>
                {totalCreditsNeeded} credit{totalCreditsNeeded !== 1 ? 's' : ''}
              </Text>
            </View>
            
            <View style={styles.remainingCreditsRow}>
              <Text style={styles.remainingCreditsLabel}>
                Available credits
              </Text>
              <Text style={styles.remainingCreditsValue}>
                {userSessionCredits} credit{userSessionCredits !== 1 ? 's' : ''}
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
            {canJoin 
              ? `Join Schedule - ${totalCreditsNeeded} Credits`
              : selectedParticipants.length === 0
                ? 'Select Participants'
                : hasInsufficientCredits
                  ? `Insufficient Credits (Need ${totalCreditsNeeded})`
                  : 'Cannot Join Schedule'
            }
          </Text>
        </Pressable>
      </View>
    </BottomSheet>
  );
};

export default JoinScheduleBottomSheet;