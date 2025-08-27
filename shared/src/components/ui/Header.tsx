import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, Image, StyleSheet, ViewStyle, TextStyle, Modal, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { useProgramContext } from '../program/ProgramContextProvider';
import { useAuthStore } from '../../store/authStore';
import { ProgramContext } from '../../types';

// Header variants for different use cases
type HeaderVariant =
  | 'default'
  | 'withBack'
  | 'withNotification'
  | 'withProgram'
  | 'instructor';

interface HeaderProps {
  title: string;
  variant?: HeaderVariant;

  // Navigation
  onBack?: () => void;
  showBackButton?: boolean;

  // Notifications
  onNotificationPress?: () => void;
  showNotifications?: boolean;
  notificationCount?: number;

  // Program context
  showProgramInfo?: boolean;
  showProgramSwitcher?: boolean;

  // User profile
  onProfilePress?: () => void;
  showProfile?: boolean;
  userImageUri?: string;

  // Instructor utilities
  onSearchPress?: () => void;
  onFilterPress?: () => void;
  onMorePress?: () => void;
  showInstructorActions?: boolean;

  // Custom styling
  style?: ViewStyle;
  titleStyle?: TextStyle;
  backgroundColor?: string;

  // Accessibility
  accessibilityLabel?: string;
  testID?: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  variant = 'default',
  onBack,
  showBackButton = false,
  onNotificationPress,
  showNotifications = false,
  notificationCount = 0,
  showProgramInfo = false,
  showProgramSwitcher = false,
  onProfilePress,
  showProfile = true,
  userImageUri,
  onSearchPress,
  onFilterPress,
  onMorePress,
  showInstructorActions = false,
  style,
  titleStyle,
  backgroundColor,
  accessibilityLabel,
  testID,
}) => {
  const { theme } = useTheme();
  const { currentProgram, availablePrograms, switchProgram, isLoading } = useProgramContext();
  const { user } = useAuthStore();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [showProgramModal, setShowProgramModal] = useState(false);

  const handleProgramSwitch = async (program: ProgramContext) => {
    if (program.id === currentProgram?.id) {
      setShowProgramModal(false);
      return;
    }

    try {
      await switchProgram(program.id);
      setShowProgramModal(false);
    } catch (error: any) {
      Alert.alert(
        'Switch Failed',
        error.message || 'Failed to switch program',
        [{ text: 'OK' }]
      );
    }
  };

  // Get program code (first 4 characters, uppercase)
  const programCode = currentProgram?.name?.substring(0, 4).toUpperCase() || 'TEST';

  // Auto-configure based on variant
  const shouldShowBackButton = showBackButton || variant === 'withBack';
  const shouldShowNotifications = showNotifications || variant === 'withNotification' || variant === 'instructor';
  const shouldShowProgramInfo = showProgramInfo || variant === 'withProgram';
  const shouldShowInstructorActions = showInstructorActions || variant === 'instructor';

  const renderLeftSection = () => {
    if (shouldShowBackButton && onBack) {
      return (
        <Pressable 
          onPress={onBack}
          style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }, styles.iconButton]}
          accessibilityRole='button'
          accessibilityLabel='Go back'
          testID={`${testID}-back-button`}
        >
          <Ionicons
            name='arrow-back-outline'
            size={24}
            color={theme.colors.text.primary}
          />
        </Pressable>
      );
    }

    if (showProgramSwitcher) {
      const hasMultiplePrograms = availablePrograms.length > 1;
      
      return (
        <Pressable 
          onPress={hasMultiplePrograms ? () => setShowProgramModal(true) : undefined}
          style={({ pressed }) => [
            { opacity: pressed && hasMultiplePrograms ? 0.8 : 1 }, 
            styles.programSwitcherButton,
            !hasMultiplePrograms && styles.programSwitcherButtonDisabled
          ]}
          accessibilityRole='button'
          accessibilityLabel={hasMultiplePrograms ? `Switch program. Current: ${currentProgram?.name}` : `Current program: ${currentProgram?.name}`}
          testID={`${testID}-program-switcher`}
          disabled={isLoading || !hasMultiplePrograms}
        >
          <Text style={styles.programCode}>{programCode}</Text>
          {hasMultiplePrograms && (
            <Ionicons
              name='chevron-down-outline'
              size={16}
              color={theme.colors.text.secondary}
              style={styles.dropdownIcon}
            />
          )}
        </Pressable>
      );
    }

    if (shouldShowInstructorActions) {
      return (
        <View style={styles.actionGroup}>
          {onSearchPress && (
            <Pressable 
              onPress={onSearchPress}
              style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }, styles.actionButton]}
              accessibilityRole='button'
              accessibilityLabel='Search'
            >
              <Ionicons
                name='search-outline'
                size={20}
                color={theme.colors.text.secondary}
              />
            </Pressable>
          )}
          {onFilterPress && (
            <Pressable 
              onPress={onFilterPress}
              style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }, styles.actionButton]}
              accessibilityRole='button'
              accessibilityLabel='Filter'
            >
              <Ionicons
                name='filter-outline'
                size={20}
                color={theme.colors.text.secondary}
              />
            </Pressable>
          )}
        </View>
      );
    }

    return <View style={styles.leftSpacer} />;
  };

  const renderCenterSection = () => {
    return (
      <View style={styles.centerSection}>
        <Text
          style={[styles.title, titleStyle]}
          numberOfLines={1}
          accessibilityRole='header'
        >
          {title}
        </Text>

        {shouldShowProgramInfo && currentProgram && (
          <Text style={styles.programInfo} numberOfLines={1}>
            {currentProgram.name}
          </Text>
        )}
      </View>
    );
  };

  const renderRightSection = () => {
    return (
      <View style={styles.rightSection}>
        {shouldShowNotifications && onNotificationPress && (
          <Pressable 
            onPress={onNotificationPress}
            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }, styles.iconButton]}
            accessibilityRole='button'
            accessibilityLabel={`Notifications${notificationCount > 0 ? ` (${notificationCount} unread)` : ''}`}
            testID={`${testID}-notification-button`}
          >
            <Ionicons
              name='notifications-outline'
              size={24}
              color={theme.colors.text.primary}
            />
            {notificationCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>
                  {notificationCount > 99
                    ? '99+'
                    : notificationCount.toString()}
                </Text>
              </View>
            )}
          </Pressable>
        )}

        {onMorePress && (
          <Pressable 
            onPress={onMorePress}
            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }, styles.iconButton]}
            accessibilityRole='button'
            accessibilityLabel='More options'
          >
            <Ionicons
              name='ellipsis-horizontal-outline'
              size={24}
              color={theme.colors.text.primary}
            />
          </Pressable>
        )}

        {showProfile && (
          <Pressable 
            onPress={onProfilePress}
            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }, styles.profileButton]}
            accessibilityRole='button'
            accessibilityLabel={`Profile${user?.first_name ? ` for ${user.first_name}` : ''}`}
            testID={`${testID}-profile-button`}
          >
            {userImageUri || user?.profile_image_url ? (
              <Image
                source={{ uri: userImageUri || user?.profile_image_url }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profilePlaceholder}>
                <Ionicons
                  name='person-outline'
                  size={20}
                  color={theme.colors.text.tertiary}
                />
              </View>
            )}
          </Pressable>
        )}
      </View>
    );
  };

  return (
    <>
      <View
        style={[styles.container, backgroundColor && { backgroundColor }, style]}
        accessibilityLabel={accessibilityLabel || `Header: ${title}`}
        testID={testID}
      >
        {renderLeftSection()}
        {renderCenterSection()}
        {renderRightSection()}
      </View>

      {/* Program Switching Modal */}
      {showProgramSwitcher && (
        <Modal
          visible={showProgramModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowProgramModal(false)}
        >
          <Pressable 
            style={styles.modalBackdrop}
            onPress={() => setShowProgramModal(false)}
          >
            <View
              style={styles.modalContainer}
              onStartShouldSetResponder={() => true}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Switch Program</Text>
                <Pressable 
                  onPress={() => setShowProgramModal(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color={theme.colors.text.secondary} />
                </Pressable>
              </View>

              <FlatList
                data={availablePrograms}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Pressable 
                    style={[
                      styles.programOption,
                      {
                        backgroundColor: item.id === currentProgram?.id 
                          ? theme.colors.background.elevated 
                          : 'transparent',
                      }
                    ]}
                    onPress={() => handleProgramSwitch(item)}
                  >
                    <View style={styles.programOptionContent}>
                      <Text style={[
                        styles.programOptionCode,
                        {
                          color: item.id === currentProgram?.id 
                            ? theme.colors.interactive.primary 
                            : theme.colors.text.primary,
                        }
                      ]}>
                        {item.name?.substring(0, 4).toUpperCase()}
                      </Text>
                      <Text style={[
                        styles.programOptionName,
                        {
                          color: item.id === currentProgram?.id 
                            ? theme.colors.interactive.primary 
                            : theme.colors.text.secondary,
                        }
                      ]}>
                        {item.name}
                      </Text>
                    </View>
                    {item.id === currentProgram?.id && (
                      <Ionicons 
                        name="checkmark" 
                        size={20} 
                        color={theme.colors.interactive.primary} 
                      />
                    )}
                  </Pressable>
                )}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </Pressable>
        </Modal>
      )}
    </>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing[4] || theme.spacing.md,
      paddingVertical: theme.spacing[3] || theme.spacing.sm,
      backgroundColor: theme.colors.background.primary,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
      minHeight: 60,
    },

    leftSpacer: {
      width: theme.safeArea.minTouchTarget.width, // Reserve space for symmetry
    },

    centerSection: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },

    title: {
      ...theme.typography.heading.h4,
      color: theme.colors.text.primary,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      textAlign: 'center',
    },

    programInfo: {
      ...theme.typography.caption.base,
      color: theme.colors.text.secondary,
      marginTop: theme.spacing[1] || theme.spacing.xs,
      textAlign: 'center',
    },

    rightSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[2],
    },

    actionGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[1] || theme.spacing.xs,
    },

    actionButton: {
      padding: theme.spacing[2],
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.background.secondary,
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: theme.safeArea.minTouchTarget.width,
      minHeight: theme.safeArea.minTouchTarget.height,
    },

    iconButton: {
      padding: theme.spacing[2],
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: theme.safeArea.minTouchTarget.width,
      minHeight: theme.safeArea.minTouchTarget.height,
      position: 'relative',
    },

    profileButton: {
      alignItems: 'center',
      justifyContent: 'center',
    },

    profileImage: {
      width: theme.safeArea.minTouchTarget.width,
      height: theme.safeArea.minTouchTarget.height,
      borderRadius: theme.safeArea.minTouchTarget.width / 2,
      backgroundColor: theme.colors.background.secondary,
    },

    profilePlaceholder: {
      width: theme.safeArea.minTouchTarget.width,
      height: theme.safeArea.minTouchTarget.height,
      borderRadius: theme.safeArea.minTouchTarget.width / 2,
      backgroundColor: theme.colors.background.secondary,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: theme.borderWidth.sm,
      borderColor: theme.colors.border.primary,
    },

    notificationBadge: {
      position: 'absolute',
      top: theme.spacing[1] || theme.spacing.xs,
      right: theme.spacing[1] || theme.spacing.xs,
      backgroundColor: theme.colors.status.error,
      borderRadius: theme.borderRadius.full,
      minWidth: theme.spacing[5],
      height: theme.spacing[5],
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing[1] || theme.spacing.xs,
    },

    notificationCount: {
      ...theme.typography.caption.base,
      color: theme.colors.text.inverse,
      fontWeight: theme.fontConfig.fontWeight.bold,
      fontSize: theme.fontSizes.xs,
    },

    // Program Switcher Styles
    programSwitcherButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[2],
      backgroundColor: theme.colors.background.elevated,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      minHeight: theme.safeArea.minTouchTarget.height,
    },

    programSwitcherButtonDisabled: {
      backgroundColor: theme.colors.background.primary,
      borderColor: theme.colors.border.secondary,
    },

    programCode: {
      ...theme.typography.body.base,
      color: theme.colors.text.primary,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      fontSize: theme.fontSizes.sm,
    },

    dropdownIcon: {
      marginLeft: theme.spacing[1] || theme.spacing.xs,
    },

    // Modal Styles
    modalBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },

    modalContainer: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      maxWidth: 300,
      width: '90%',
      maxHeight: 400,
      shadowColor: theme.colors.shadow.default,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 8,
    },

    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing[4] || theme.spacing.md,
      paddingVertical: theme.spacing[3] || theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
    },

    modalTitle: {
      ...theme.typography.heading.h4,
      color: theme.colors.text.primary,
      fontWeight: theme.fontConfig.fontWeight.semibold,
    },

    closeButton: {
      padding: theme.spacing[1] || theme.spacing.xs,
    },

    programOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing[4] || theme.spacing.md,
      paddingVertical: theme.spacing[3] || theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
    },

    programOptionContent: {
      flex: 1,
    },

    programOptionCode: {
      ...theme.typography.body.base,
      fontWeight: theme.fontConfig.fontWeight.bold,
      fontSize: theme.fontSizes.base,
    },

    programOptionName: {
      ...theme.typography.body.sm,
      marginTop: theme.spacing[1] || theme.spacing.xs,
    },
  });

// Add displayName for debugging
Header.displayName = 'Header';

export default Header;
