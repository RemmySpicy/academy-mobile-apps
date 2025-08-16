import React from 'react';
import { View, Text, Pressable, Image, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, createThemedStyles } from '../../theme/ThemeProvider';
import { useProgramContext } from '../program/ProgramContextProvider';
import { useAuthStore } from '../../store/authStore';

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

  // Program context (for instructors)
  showProgramInfo?: boolean;

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
  const { currentProgram } = useProgramContext();
  const { user } = useAuthStore();
  const styles = useThemedStyles();

  // Auto-configure based on variant
  React.useEffect(() => {
    switch (variant) {
      case 'withBack':
        showBackButton = true;
        break;
      case 'withNotification':
        showNotifications = true;
        break;
      case 'withProgram':
        showProgramInfo = true;
        break;
      case 'instructor':
        showInstructorActions = true;
        showNotifications = true;
        break;
    }
  }, [variant]);

  const renderLeftSection = () => {
    if (showBackButton && onBack) {
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

    if (showInstructorActions) {
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

        {showProgramInfo && currentProgram && (
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
        {showNotifications && onNotificationPress && (
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
            {userImageUri || user?.avatar_url ? (
              <Image
                source={{ uri: userImageUri || user?.avatar_url }}
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
    <View
      style={[styles.container, backgroundColor && { backgroundColor }, style]}
      accessibilityLabel={accessibilityLabel || `Header: ${title}`}
      testID={testID}
    >
      {renderLeftSection()}
      {renderCenterSection()}
      {renderRightSection()}
    </View>
  );
};

const useThemedStyles = createThemedStyles(theme =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[3],
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
      marginTop: theme.spacing[1],
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
      gap: theme.spacing[1],
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
      top: theme.spacing[1],
      right: theme.spacing[1],
      backgroundColor: theme.colors.status.error,
      borderRadius: theme.borderRadius.full,
      minWidth: theme.spacing[5],
      height: theme.spacing[5],
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing[1],
    },

    notificationCount: {
      ...theme.typography.caption.base,
      color: theme.colors.text.inverse,
      fontWeight: theme.fontConfig.fontWeight.bold,
      fontSize: theme.fontSizes.xs,
    },
  })
);

export default Header;
