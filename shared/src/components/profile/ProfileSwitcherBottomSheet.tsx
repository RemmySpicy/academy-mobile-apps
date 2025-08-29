/**
 * ProfileSwitcherBottomSheet Component
 * 
 * A bottom sheet that allows parents to switch between their own profile
 * and their children's profiles, or access their own student profile.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { BottomSheet, BottomSheetProps } from '../ui/BottomSheet';
import { useAuthStore } from '../../store/authStore';
import { UserRole } from '../../types/auth';

export interface ProfileOption {
  id: string;
  name: string;
  role: 'parent' | 'student';
  isActive: boolean;
  avatar?: string;
  grade?: string;
  program?: string;
}

export interface ProfileSwitcherBottomSheetProps extends Omit<BottomSheetProps, 'children'> {
  /** Current active profile */
  activeProfileId?: string;
  /** Callback when a profile is selected */
  onProfileSelect?: (profile: ProfileOption) => void;
  /** Custom profiles to display (if not provided, will use mock data based on user role) */
  profiles?: ProfileOption[];
}

export const ProfileSwitcherBottomSheet: React.FC<ProfileSwitcherBottomSheetProps> = ({
  visible,
  onClose,
  activeProfileId,
  onProfileSelect,
  profiles: customProfiles,
  ...bottomSheetProps
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { user } = useAuthStore();
  
  // Generate mock profiles based on user role
  const generateMockProfiles = (): ProfileOption[] => {
    const mockProfiles: ProfileOption[] = [];
    
    console.log('ProfileSwitcher: User role:', user?.role);
    console.log('ProfileSwitcher: UserRole.PARENT:', UserRole.PARENT);
    
    if (user?.role === UserRole.PARENT) {
      // Add parent profile
      mockProfiles.push({
        id: 'parent-profile',
        name: `${user.first_name} ${user.last_name}`,
        role: 'parent',
        isActive: true,
      });
      
      // Add mock children profiles
      mockProfiles.push(
        {
          id: 'child-1',
          name: 'Emma Johnson',
          role: 'student',
          isActive: true,
          grade: 'Grade 5',
          program: 'Swimming Academy',
        },
        {
          id: 'child-2',
          name: 'James Johnson',
          role: 'student',
          isActive: true,
          grade: 'Grade 3',
          program: 'Football Training',
        }
      );
    } else if (user?.role === UserRole.STUDENT) {
      // Student can also be a parent, add their own profile
      mockProfiles.push({
        id: 'student-profile',
        name: `${user.first_name} ${user.last_name}`,
        role: 'student',
        isActive: true,
      });
      
      // If they're also a parent (dual role), add children
      if (user.first_name.toLowerCase().includes('parent')) {
        mockProfiles.push({
          id: 'child-3',
          name: 'Alex Student',
          role: 'student',
          isActive: true,
          grade: 'Grade 7',
          program: 'Basketball Club',
        });
      }
    } else {
      // Fallback - always show at least current user profile
      mockProfiles.push({
        id: 'current-user',
        name: user ? `${user.first_name} ${user.last_name}` : 'Current User',
        role: user?.role === UserRole.PARENT ? 'parent' : 'student',
        isActive: true,
      });
    }
    
    // Always ensure we have at least one profile
    if (mockProfiles.length === 0) {
      mockProfiles.push({
        id: 'default-profile',
        name: 'Default Profile',
        role: 'student',
        isActive: true,
      });
    }
    
    console.log('ProfileSwitcher: Generated profiles:', mockProfiles);
    return mockProfiles;
  };
  
  const profiles = customProfiles || generateMockProfiles();
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
  };
  
  const handleProfileSelect = (profile: ProfileOption) => {
    onProfileSelect?.(profile);
    onClose();
  };
  
  const renderProfileOption = (profile: ProfileOption, index: number) => {
    const isActive = activeProfileId === profile.id;
    
    return (
      <Pressable
        key={profile.id}
        style={[
          styles.profileOption,
          isActive && styles.activeProfileOption,
        ]}
        onPress={() => handleProfileSelect(profile)}
      >
        <View style={styles.profileRow}>
          {/* Avatar */}
          <View style={[
            styles.avatar,
            { backgroundColor: isActive 
              ? theme.colors.interactive.primary 
              : `${theme.colors.interactive.accent}20` 
            }
          ]}>
            <Text style={[
              styles.avatarText,
              { color: isActive 
                ? 'white' 
                : theme.colors.interactive.accent 
              }
            ]}>
              {getInitials(profile.name)}
            </Text>
          </View>
          
          {/* Profile Info */}
          <View style={styles.profileInfo}>
            <View style={styles.profileHeader}>
              <Text style={[
                styles.profileName,
                isActive && styles.activeProfileName,
              ]}>
                {profile.name}
              </Text>
              <View style={[
                styles.roleBadge,
                { backgroundColor: profile.role === 'parent' 
                  ? theme.colors.interactive.purple 
                  : theme.colors.interactive.accent 
                }
              ]}>
                <Text style={styles.roleBadgeText}>
                  {profile.role === 'parent' ? 'Parent' : 'Student'}
                </Text>
              </View>
            </View>
            
            {profile.role === 'student' && (profile.grade || profile.program) && (
              <View style={styles.profileDetails}>
                {profile.grade && (
                  <Text style={styles.detailText}>
                    {profile.grade}
                  </Text>
                )}
                {profile.program && (
                  <Text style={styles.detailText}>
                    • {profile.program}
                  </Text>
                )}
              </View>
            )}
          </View>
          
          {/* Active Indicator */}
          {isActive && (
            <View style={styles.activeIndicator}>
              <Ionicons 
                name="checkmark-circle" 
                size={24} 
                color={theme.colors.interactive.primary} 
              />
            </View>
          )}
        </View>
      </Pressable>
    );
  };
  
  return (
    <BottomSheet
      {...bottomSheetProps}
      visible={visible}
      onClose={onClose}
      title="Switch Profile"
      snapPoints={['medium']}
      showCloseButton={true}
      scrollable={true}
    >
      <View style={styles.container}>
        <Text style={styles.subtitle}>
          Choose which profile you'd like to view and manage
        </Text>
        
        <ScrollView
          style={styles.profileList}
          showsVerticalScrollIndicator={false}
        >
          {profiles.map((profile, index) => renderProfileOption(profile, index))}
        </ScrollView>
        
        {/* Create New Profile Option */}
        <Pressable style={styles.addChildButton}>
          <View style={styles.addChildRow}>
            <View style={styles.addChildIcon}>
              <Ionicons 
                name="add-circle-outline" 
                size={24} 
                color={theme.colors.interactive.primary} 
              />
            </View>
            <View style={styles.addChildInfo}>
              <Text style={styles.addChildText}>Create New Profile</Text>
              <Text style={styles.addChildSubtext}>
                {user?.role === UserRole.PARENT 
                  ? 'Add a child or family member profile' 
                  : 'Add a new user profile to your account'}
              </Text>
            </View>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={theme.colors.icon.tertiary} 
            />
          </View>
        </Pressable>
      </View>
    </BottomSheet>
  );
};

const createStyles = (theme: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    
    subtitle: {
      fontSize: theme.fontSizes.base,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.lg,
      textAlign: 'center',
      lineHeight: 22,
    },
    
    profileList: {
      flex: 1,
    },
    
    profileOption: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.sm,
      borderWidth: 2,
      borderColor: 'transparent',
      ...theme.elevation.sm,
    },
    
    activeProfileOption: {
      borderColor: theme.colors.interactive.primary,
      backgroundColor: theme.colors.background.elevated,
    },
    
    profileRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
    },
    
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    
    avatarText: {
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontConfig.fontWeight.bold,
    },
    
    profileInfo: {
      flex: 1,
    },
    
    profileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.xs,
    },
    
    profileName: {
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      color: theme.colors.text.primary,
      flex: 1,
    },
    
    activeProfileName: {
      color: theme.colors.interactive.primary,
    },
    
    roleBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.full,
      marginLeft: theme.spacing.sm,
    },
    
    roleBadgeText: {
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: 'white',
    },
    
    profileDetails: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    
    detailText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text.secondary,
      marginRight: theme.spacing.sm,
    },
    
    activeIndicator: {
      marginLeft: theme.spacing.sm,
    },
    
    addChildButton: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderStyle: 'dashed',
      marginTop: theme.spacing.md,
    },
    
    addChildRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
    },
    
    addChildIcon: {
      width: 50,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    
    addChildInfo: {
      flex: 1,
    },
    
    addChildText: {
      fontSize: theme.fontSizes.base,
      fontWeight: theme.fontConfig.fontWeight.medium,
      color: theme.colors.interactive.primary,
      marginBottom: 4,
    },
    
    addChildSubtext: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text.secondary,
    },
  });
};

export default ProfileSwitcherBottomSheet;