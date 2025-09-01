import React from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheet, useTheme } from '@academy/mobile-shared';

interface Profile {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'parent';
  avatar?: string;
  isActive: boolean;
  level?: string;
  program?: string;
  module?: string;
  achievements?: string;
  attendance?: string;
  badges?: string;
}

interface ProfileSwitcherBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  profiles: Profile[];
  onProfileSelect: (profile: Profile) => void;
  onCreateChildProfile: () => void;
}

export const ProfileSwitcherBottomSheet: React.FC<ProfileSwitcherBottomSheetProps> = ({
  visible,
  onClose,
  profiles,
  onProfileSelect,
  onCreateChildProfile,
}) => {
  const { theme } = useTheme();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
  };

  const renderProfile = ({ item: profile }: { item: Profile }) => (
    <Pressable
      onPress={() => {
        onProfileSelect(profile);
        onClose();
      }}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.md,
        backgroundColor: profile.isActive 
          ? theme.colors.interactive.primaryBackground 
          : theme.colors.background.primary,
        borderRadius: theme.borderRadius.lg,
        marginBottom: theme.spacing.sm,
        borderWidth: profile.isActive ? 1 : 0,
        borderColor: profile.isActive ? theme.colors.interactive.primary : 'transparent',
      }}
    >
      {/* Profile Picture */}
      <View style={{
        width: 48,
        height: 48,
        backgroundColor: profile.isActive 
          ? theme.colors.interactive.primary 
          : `${theme.colors.interactive.accent}15`,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing.md,
      }}>
        <Text style={{
          color: profile.isActive 
            ? 'white' 
            : theme.colors.interactive.accent,
          fontWeight: theme.fontConfig.fontWeight.bold,
          fontSize: theme.fontSizes.lg,
        }}>
          {getInitials(profile.name)}
        </Text>
      </View>

      {/* Profile Info */}
      <View style={{ flex: 1 }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <Text style={{
            color: profile.isActive 
              ? theme.colors.interactive.primary 
              : theme.colors.text.primary,
            fontWeight: theme.fontConfig.fontWeight.semibold,
            fontSize: theme.fontSizes.base,
          }}>
            {profile.name}
          </Text>
          {profile.isActive && (
            <View style={{
              backgroundColor: theme.colors.interactive.primary,
              borderRadius: theme.borderRadius.full,
              paddingHorizontal: theme.spacing.xs,
              paddingVertical: 2,
              marginLeft: theme.spacing.sm,
            }}>
              <Text style={{
                color: 'white',
                fontSize: theme.fontSizes.xs,
                fontWeight: theme.fontConfig.fontWeight.medium,
              }}>
                Active
              </Text>
            </View>
          )}
        </View>
        
        <Text style={{
          color: theme.colors.text.secondary,
          fontSize: theme.fontSizes.sm,
          marginTop: 2,
        }}>
          {profile.email}
        </Text>

        {profile.role === 'student' && profile.level && (
          <View style={{
            marginTop: 6,
            backgroundColor: theme.colors.interactive.primaryBackground,
            paddingHorizontal: theme.spacing.xs,
            paddingVertical: theme.spacing.xs,
            borderRadius: theme.borderRadius.md,
          }}>
            {/* Academic Progress Header */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 3,
            }}>
              <Ionicons 
                name="school" 
                size={10} 
                color={theme.colors.interactive.primary} 
              />
              <Text style={{
                color: theme.colors.interactive.primary,
                fontSize: 8,
                fontWeight: theme.fontConfig.fontWeight.semibold,
                marginLeft: 3,
              }}>
                Progress
              </Text>
            </View>
            
            {/* Level → Module Path */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 4,
            }}>
              {/* Level */}
              <Text style={{
                color: theme.colors.interactive.primary,
                fontSize: theme.fontSizes.xs,
                fontWeight: theme.fontConfig.fontWeight.bold,
              }}>
                Level {profile.level?.match(/Level (\d+)/)?.[1] || '2'}
              </Text>
              
              {/* Arrow connector */}
              <Ionicons 
                name="chevron-forward" 
                size={8} 
                color={theme.colors.interactive.primary}
                style={{ marginHorizontal: 3 }}
              />
              
              {/* Module */}
              <Text style={{
                color: theme.colors.interactive.primary,
                fontSize: theme.fontSizes.xs,
                fontWeight: theme.fontConfig.fontWeight.bold,
              }}>
                Module {profile.module?.match(/Module (\d+)/)?.[1] || '3'}
              </Text>
            </View>
            
            {/* Progress Badges */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
            }}>
              {profile.achievements && (
                <View style={{
                  backgroundColor: theme.colors.status.warningBackground,
                  paddingHorizontal: 4,
                  paddingVertical: 2,
                  borderRadius: theme.borderRadius.full,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                  <Text style={{ fontSize: 6, marginRight: 2 }}>⭐</Text>
                  <Text style={{
                    color: theme.colors.status.warning,
                    fontSize: 7,
                    fontWeight: theme.fontConfig.fontWeight.bold,
                  }}>
                    {profile.achievements}
                  </Text>
                </View>
              )}
              {profile.attendance && (
                <View style={{
                  backgroundColor: theme.colors.status.successBackground,
                  paddingHorizontal: 4,
                  paddingVertical: 2,
                  borderRadius: theme.borderRadius.full,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                  <Ionicons 
                    name="checkmark-circle" 
                    size={6} 
                    color={theme.colors.status.success} 
                    style={{ marginRight: 2 }}
                  />
                  <Text style={{
                    color: theme.colors.status.success,
                    fontSize: 7,
                    fontWeight: theme.fontConfig.fontWeight.medium,
                  }}>
                    {profile.attendance}
                  </Text>
                </View>
              )}
              {profile.badges && (
                <View style={{
                  backgroundColor: theme.colors.interactive.accentBackground,
                  paddingHorizontal: 4,
                  paddingVertical: 2,
                  borderRadius: theme.borderRadius.full,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                  <Ionicons 
                    name="medal" 
                    size={6} 
                    color={theme.colors.interactive.accent} 
                    style={{ marginRight: 2 }}
                  />
                  <Text style={{
                    color: theme.colors.interactive.accent,
                    fontSize: 7,
                    fontWeight: theme.fontConfig.fontWeight.medium,
                  }}>
                    {profile.badges} Badges
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </View>

      {/* Active Indicator */}
      {profile.isActive && (
        <Ionicons 
          name="checkmark-circle" 
          size={24} 
          color={theme.colors.interactive.primary} 
        />
      )}
    </Pressable>
  );

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Switch Profile"
      snapPoints={['medium', 'large']}
      initialSnapPoint="medium"
      scrollable
    >
      <View style={{ flex: 1 }}>
        {/* Current Profiles */}
        <Text style={{
          color: theme.colors.text.primary,
          fontSize: theme.fontSizes.base,
          fontWeight: theme.fontConfig.fontWeight.semibold,
          marginBottom: theme.spacing.md,
        }}>
          Your Profiles
        </Text>

        <FlatList
          data={profiles}
          renderItem={renderProfile}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          style={{ marginBottom: theme.spacing.lg }}
        />

        {/* Create New Child Profile */}
        <Pressable
          onPress={() => {
            onCreateChildProfile();
            onClose();
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: theme.spacing.md,
            backgroundColor: theme.colors.interactive.primaryBackground,
            borderRadius: theme.borderRadius.lg,
            borderWidth: 1,
            borderColor: theme.colors.interactive.primary,
            borderStyle: 'dashed',
            marginTop: theme.spacing.md,
          }}
        >
          <View style={{
            width: 32,
            height: 32,
            backgroundColor: theme.colors.interactive.primary,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: theme.spacing.sm,
          }}>
            <Ionicons name="add" size={18} color="white" />
          </View>
          
          <View>
            <Text style={{
              color: theme.colors.interactive.primary,
              fontSize: theme.fontSizes.base,
              fontWeight: theme.fontConfig.fontWeight.semibold,
            }}>
              Create Child Profile
            </Text>
            <Text style={{
              color: theme.colors.text.secondary,
              fontSize: theme.fontSizes.sm,
            }}>
              Add a new student profile
            </Text>
          </View>
        </Pressable>

        {/* Info Section */}
        <View style={{
          backgroundColor: theme.colors.background.secondary,
          padding: theme.spacing.md,
          borderRadius: theme.borderRadius.lg,
          marginTop: theme.spacing.lg,
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: theme.spacing.xs,
          }}>
            <Ionicons 
              name="information-circle" 
              size={16} 
              color={theme.colors.interactive.primary} 
            />
            <Text style={{
              color: theme.colors.interactive.primary,
              fontSize: theme.fontSizes.sm,
              fontWeight: theme.fontConfig.fontWeight.medium,
              marginLeft: theme.spacing.xs,
            }}>
              Profile Management
            </Text>
          </View>
          <Text style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.xs,
            lineHeight: 18,
          }}>
            Switch between profiles to manage different students' activities and progress. 
            Parents can create and manage multiple child profiles from this account.
          </Text>
        </View>
      </View>
    </BottomSheet>
  );
};