import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Image,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheet, useTheme, createThemedStyles } from '@academy/mobile-shared';

interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  role: 'student' | 'parent' | 'instructor';
}

interface PotentialParticipant {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  relationship: 'self' | 'child' | 'spouse';
  isEnrolled: boolean;
}

interface ParticipantManagementBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  bookingTitle: string;
  currentParticipants: Participant[];
  maxParticipants: number;
  onAddParticipant: (participantId: string) => void;
  onRemoveParticipant: (participantId: string, reason: string) => void;
}

interface RemovalConfirmationProps {
  visible: boolean;
  participantName: string;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
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
    participantItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.xs,
    },
    enrolledParticipant: {
      backgroundColor: theme.colors.interactive.primary + '10',
      borderWidth: 1,
      borderColor: theme.colors.interactive.primary + '30',
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.background.tertiary,
      marginRight: theme.spacing.sm,
    },
    avatarPlaceholder: {
      justifyContent: 'center',
      alignItems: 'center',
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
    enrolledLabel: {
      fontSize: theme.fontSizes.xs,
      color: theme.colors.interactive.primary,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
    actionButton: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.md,
      marginLeft: theme.spacing.sm,
    },
    addButton: {
      backgroundColor: theme.colors.interactive.primary,
    },
    removeButton: {
      backgroundColor: theme.colors.status.error,
    },
    disabledButton: {
      backgroundColor: theme.colors.background.tertiary,
    },
    actionButtonText: {
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: 'white',
    },
    disabledButtonText: {
      color: theme.colors.text.tertiary,
    },
    removeButtonText: {
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: 'white',
    },
    addButtonText: {
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: 'white',
    },
    capacityInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.lg,
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    capacityText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text.secondary,
      marginLeft: theme.spacing.xs,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.xl,
    },
    emptyStateText: {
      fontSize: theme.fontSizes.base,
      color: theme.colors.text.tertiary,
      textAlign: 'center',
      marginTop: theme.spacing.sm,
    },
    
    // Removal confirmation modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginHorizontal: theme.spacing.lg,
      width: '90%',
      maxWidth: 400,
    },
    modalTitle: {
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    modalMessage: {
      fontSize: theme.fontSizes.base,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    reasonInput: {
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      fontSize: theme.fontSizes.base,
      color: theme.colors.text.primary,
      backgroundColor: theme.colors.background.secondary,
      marginBottom: theme.spacing.md,
      minHeight: 80,
      textAlignVertical: 'top',
    },
    reasonLabel: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.xs,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
    modalActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: theme.spacing.sm,
    },
    modalButton: {
      flex: 1,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: theme.colors.background.secondary,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    confirmButton: {
      backgroundColor: theme.colors.status.error,
    },
    modalButtonText: {
      fontSize: theme.fontSizes.base,
      fontWeight: theme.fontConfig.fontWeight.medium,
    },
    cancelButtonText: {
      color: theme.colors.text.secondary,
    },
    confirmButtonText: {
      color: 'white',
    },
  })
);

// Removal Confirmation Modal Component
const RemovalConfirmationModal: React.FC<RemovalConfirmationProps> = ({
  visible,
  participantName,
  onConfirm,
  onCancel,
}) => {
  const { theme } = useTheme();
  const styles = useStyles();
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason.trim());
      setReason('');
    } else {
      Alert.alert('Required', 'Please provide a reason for removal.');
    }
  };

  const handleCancel = () => {
    setReason('');
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={styles.modalOverlay}>
        <SafeAreaView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Remove Participant</Text>
          <Text style={styles.modalMessage}>
            Are you sure you want to remove {participantName} from this session?
          </Text>
          
          <Text style={styles.reasonLabel}>Reason for removal *</Text>
          <TextInput
            style={styles.reasonInput}
            placeholder="Please provide a reason (e.g., schedule conflict, illness, etc.)"
            placeholderTextColor={theme.colors.text.tertiary}
            value={reason}
            onChangeText={setReason}
            multiline
            textAlignVertical="top"
          />
          
          <View style={styles.modalActions}>
            <Pressable
              style={[styles.modalButton, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={[styles.modalButtonText, styles.cancelButtonText]}>
                Cancel
              </Text>
            </Pressable>
            
            <Pressable
              style={[styles.modalButton, styles.confirmButton]}
              onPress={handleConfirm}
            >
              <Text style={[styles.modalButtonText, styles.confirmButtonText]}>
                Remove
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export const ParticipantManagementBottomSheet: React.FC<ParticipantManagementBottomSheetProps> = ({
  visible,
  onClose,
  bookingTitle,
  currentParticipants,
  maxParticipants,
  onAddParticipant,
  onRemoveParticipant,
}) => {
  const { theme } = useTheme();
  const styles = useStyles();
  const [showRemovalModal, setShowRemovalModal] = useState(false);
  const [participantToRemove, setParticipantToRemove] = useState<PotentialParticipant | null>(null);

  // Mock potential participants (in real app, this would come from user's family/profile data)
  const [potentialParticipants] = useState<PotentialParticipant[]>([
    {
      id: 'self',
      firstName: 'John',
      lastName: 'Parent',
      relationship: 'self',
      isEnrolled: currentParticipants.some(p => p.id === 'self'),
    },
    {
      id: 'child1',
      firstName: 'Emma',
      lastName: 'Parent',
      relationship: 'child',
      isEnrolled: currentParticipants.some(p => p.id === 'child1'),
    },
    {
      id: 'child2',
      firstName: 'Noah',
      lastName: 'Parent',
      relationship: 'child',
      isEnrolled: currentParticipants.some(p => p.id === 'child2'),
    },
    {
      id: 'spouse',
      firstName: 'Jane',
      lastName: 'Parent',
      relationship: 'spouse',
      isEnrolled: currentParticipants.some(p => p.id === 'spouse'),
    },
  ]);

  const getRelationshipLabel = (relationship: string) => {
    switch (relationship) {
      case 'self':
        return 'You';
      case 'child':
        return 'Your child';
      case 'spouse':
        return 'Your spouse';
      default:
        return '';
    }
  };

  const canAddMore = currentParticipants.length < maxParticipants;

  // Separate enrolled and available participants
  const enrolledParticipants = potentialParticipants.filter(p => 
    currentParticipants.some(cp => cp.id === p.id)
  );
  
  const availableParticipants = potentialParticipants.filter(p => 
    !currentParticipants.some(cp => cp.id === p.id)
  );

  const handleRemovalRequest = (participant: PotentialParticipant) => {
    setParticipantToRemove(participant);
    setShowRemovalModal(true);
  };

  const handleRemovalConfirm = (reason: string) => {
    if (participantToRemove) {
      onRemoveParticipant(participantToRemove.id, reason);
      setShowRemovalModal(false);
      setParticipantToRemove(null);
    }
  };

  const handleRemovalCancel = () => {
    setShowRemovalModal(false);
    setParticipantToRemove(null);
  };

  const renderEnrolledParticipant = (participant: PotentialParticipant) => {
    return (
      <View
        key={participant.id}
        style={[styles.participantItem, styles.enrolledParticipant]}
      >
        <View style={[styles.avatar, styles.avatarPlaceholder]}>
          {participant.avatarUrl ? (
            <Image
              source={{ uri: participant.avatarUrl }}
              style={styles.avatar}
              resizeMode="cover"
            />
          ) : (
            <Ionicons
              name="person"
              size={20}
              color={theme.colors.text.tertiary}
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
          <Text style={styles.enrolledLabel}>Enrolled in this session</Text>
        </View>

        <Pressable
          style={[styles.actionButton, styles.removeButton]}
          onPress={() => handleRemovalRequest(participant)}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </Pressable>
      </View>
    );
  };

  const renderAvailableParticipant = (participant: PotentialParticipant) => {
    const canAdd = canAddMore;

    return (
      <View
        key={participant.id}
        style={styles.participantItem}
      >
        <View style={[styles.avatar, styles.avatarPlaceholder]}>
          {participant.avatarUrl ? (
            <Image
              source={{ uri: participant.avatarUrl }}
              style={styles.avatar}
              resizeMode="cover"
            />
          ) : (
            <Ionicons
              name="person"
              size={20}
              color={theme.colors.text.tertiary}
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

        {canAdd ? (
          <Pressable
            style={[styles.actionButton, styles.addButton]}
            onPress={() => onAddParticipant(participant.id)}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </Pressable>
        ) : (
          <Pressable
            style={[styles.actionButton, styles.disabledButton]}
            disabled
          >
            <Text style={[styles.addButtonText, styles.disabledButtonText]}>
              Full
            </Text>
          </Pressable>
        )}
      </View>
    );
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Add/Remove Participants</Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              {bookingTitle}
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
          <View style={styles.capacityInfo}>
            <Ionicons
              name="people-outline"
              size={16}
              color={theme.colors.text.secondary}
            />
            <Text style={styles.capacityText}>
              {currentParticipants.length} of {maxParticipants} spots filled
            </Text>
          </View>

          {/* Enrolled Participants Section */}
          {enrolledParticipants.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Enrolled Participants ({enrolledParticipants.length})
              </Text>
              {enrolledParticipants.map(renderEnrolledParticipant)}
            </View>
          )}

          {/* Available Family Members Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Available Family Members ({availableParticipants.length})
            </Text>
            
            {availableParticipants.length > 0 ? (
              availableParticipants.map(renderAvailableParticipant)
            ) : (
              <View style={styles.emptyState}>
                <Ionicons
                  name="person-add-outline"
                  size={48}
                  color={theme.colors.text.tertiary}
                />
                <Text style={styles.emptyStateText}>
                  {enrolledParticipants.length > 0 
                    ? "All family members are already enrolled"
                    : "No family members available to add"
                  }
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Removal Confirmation Modal */}
        <RemovalConfirmationModal
          visible={showRemovalModal}
          participantName={participantToRemove ? `${participantToRemove.firstName} ${participantToRemove.lastName}` : ''}
          onConfirm={handleRemovalConfirm}
          onCancel={handleRemovalCancel}
        />
      </View>
    </BottomSheet>
  );
};

export default ParticipantManagementBottomSheet;