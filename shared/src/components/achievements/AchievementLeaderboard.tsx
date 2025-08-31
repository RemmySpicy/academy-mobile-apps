import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useTheme } from '../../theme';
import type { AchievementLeaderboard as LeaderboardData } from '../../types';

interface AchievementLeaderboardProps {
  leaderboard: LeaderboardData[];
  currentUserRank?: number;
  currentUserId?: string;
  onUserPress?: (userId: string) => void;
  showViewAll?: boolean;
  onViewAll?: () => void;
  maxItems?: number;
}

export const AchievementLeaderboard: React.FC<AchievementLeaderboardProps> = ({
  leaderboard,
  currentUserRank,
  currentUserId,
  onUserPress,
  showViewAll = false,
  onViewAll,
  maxItems = 10,
}) => {
  const { theme } = useTheme();

  const displayLeaderboard = maxItems ? leaderboard.slice(0, maxItems) : leaderboard;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return 'trophy';
      case 2: return 'medal';
      case 3: return 'medal-outline';
      default: return null;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return '#FFD700'; // Gold
      case 2: return '#C0C0C0'; // Silver
      case 3: return '#CD7F32'; // Bronze
      default: return theme.colors.text.secondary;
    }
  };

  const formatPoints = (points: number): string => {
    if (points >= 1000) {
      return `${(points / 1000).toFixed(1)}k`;
    }
    return points.toString();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <View style={{
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.xl,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <View style={{
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="podium" size={20} color={theme.colors.interactive.primary} />
          <Text style={{
            color: theme.colors.text.primary,
            fontSize: theme.fontSizes.lg,
            fontWeight: theme.fontConfig.fontWeight.semibold,
            marginLeft: theme.spacing.sm,
          }}>
            Leaderboard
          </Text>
        </View>
        
        {showViewAll && onViewAll && (
          <Pressable onPress={onViewAll}>
            <Text style={{
              color: theme.colors.interactive.primary,
              fontSize: theme.fontSizes.sm,
              fontWeight: theme.fontConfig.fontWeight.medium,
            }}>
              View All
            </Text>
          </Pressable>
        )}
      </View>

      {/* Top 3 Podium */}
      {leaderboard.length >= 3 && (
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          style={{
            paddingHorizontal: theme.spacing.lg,
            paddingVertical: theme.spacing.xl,
            backgroundColor: theme.colors.background.secondary,
          }}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'center',
            gap: theme.spacing.md,
          }}>
            {/* Second Place */}
            {leaderboard[1] && (
              <Pressable
                onPress={() => onUserPress?.(leaderboard[1].student_id)}
                style={{
                  alignItems: 'center',
                  flex: 1,
                }}
              >
                <View style={{
                  width: 50,
                  height: 60,
                  backgroundColor: getRankColor(2),
                  borderTopLeftRadius: theme.borderRadius.lg,
                  borderTopRightRadius: theme.borderRadius.lg,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: theme.spacing.sm,
                }}>
                  <Text style={{
                    color: 'white',
                    fontSize: theme.fontSizes.sm,
                    fontWeight: theme.fontConfig.fontWeight.bold,
                  }}>
                    2
                  </Text>
                </View>
                <View style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: `${getRankColor(2)}20`,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: theme.spacing.xs,
                }}>
                  <Text style={{
                    color: getRankColor(2),
                    fontSize: theme.fontSizes.sm,
                    fontWeight: theme.fontConfig.fontWeight.bold,
                  }}>
                    {getInitials(leaderboard[1].student_name)}
                  </Text>
                </View>
                <Text style={{
                  color: theme.colors.text.primary,
                  fontSize: theme.fontSizes.sm,
                  fontWeight: theme.fontConfig.fontWeight.medium,
                  textAlign: 'center',
                }}>
                  {leaderboard[1].student_name.split(' ')[0]}
                </Text>
                <Text style={{
                  color: theme.colors.text.secondary,
                  fontSize: theme.fontSizes.xs,
                }}>
                  {formatPoints(leaderboard[1].total_points)}
                </Text>
              </Pressable>
            )}

            {/* First Place */}
            <Pressable
              onPress={() => onUserPress?.(leaderboard[0].student_id)}
              style={{
                alignItems: 'center',
                flex: 1,
              }}
            >
              <View style={{
                width: 60,
                height: 80,
                backgroundColor: getRankColor(1),
                borderTopLeftRadius: theme.borderRadius.lg,
                borderTopRightRadius: theme.borderRadius.lg,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: theme.spacing.sm,
                ...theme.elevation.sm,
              }}>
                <Ionicons name="crown" size={24} color="white" />
                <Text style={{
                  color: 'white',
                  fontSize: theme.fontSizes.sm,
                  fontWeight: theme.fontConfig.fontWeight.bold,
                }}>
                  1
                </Text>
              </View>
              <View style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: `${getRankColor(1)}20`,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: theme.spacing.xs,
                borderWidth: 2,
                borderColor: getRankColor(1),
              }}>
                <Text style={{
                  color: getRankColor(1),
                  fontSize: theme.fontSizes.base,
                  fontWeight: theme.fontConfig.fontWeight.bold,
                }}>
                  {getInitials(leaderboard[0].student_name)}
                </Text>
              </View>
              <Text style={{
                color: theme.colors.text.primary,
                fontSize: theme.fontSizes.base,
                fontWeight: theme.fontConfig.fontWeight.semibold,
                textAlign: 'center',
              }}>
                {leaderboard[0].student_name.split(' ')[0]}
              </Text>
              <Text style={{
                color: getRankColor(1),
                fontSize: theme.fontSizes.sm,
                fontWeight: theme.fontConfig.fontWeight.semibold,
              }}>
                {formatPoints(leaderboard[0].total_points)}
              </Text>
            </Pressable>

            {/* Third Place */}
            {leaderboard[2] && (
              <Pressable
                onPress={() => onUserPress?.(leaderboard[2].student_id)}
                style={{
                  alignItems: 'center',
                  flex: 1,
                }}
              >
                <View style={{
                  width: 45,
                  height: 50,
                  backgroundColor: getRankColor(3),
                  borderTopLeftRadius: theme.borderRadius.lg,
                  borderTopRightRadius: theme.borderRadius.lg,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: theme.spacing.sm,
                }}>
                  <Text style={{
                    color: 'white',
                    fontSize: theme.fontSizes.sm,
                    fontWeight: theme.fontConfig.fontWeight.bold,
                  }}>
                    3
                  </Text>
                </View>
                <View style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: `${getRankColor(3)}20`,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: theme.spacing.xs,
                }}>
                  <Text style={{
                    color: getRankColor(3),
                    fontSize: theme.fontSizes.sm,
                    fontWeight: theme.fontConfig.fontWeight.bold,
                  }}>
                    {getInitials(leaderboard[2].student_name)}
                  </Text>
                </View>
                <Text style={{
                  color: theme.colors.text.primary,
                  fontSize: theme.fontSizes.sm,
                  fontWeight: theme.fontConfig.fontWeight.medium,
                  textAlign: 'center',
                }}>
                  {leaderboard[2].student_name.split(' ')[0]}
                </Text>
                <Text style={{
                  color: theme.colors.text.secondary,
                  fontSize: theme.fontSizes.xs,
                }}>
                  {formatPoints(leaderboard[2].total_points)}
                </Text>
              </Pressable>
            )}
          </View>
        </Animated.View>
      )}

      {/* Rest of Leaderboard */}
      <ScrollView
        style={{ maxHeight: 300 }}
        showsVerticalScrollIndicator={false}
      >
        {displayLeaderboard.slice(3).map((player, index) => (
          <Animated.View
            key={player.student_id}
            entering={FadeInRight.delay((index + 3) * 50).springify()}
          >
            <Pressable
              onPress={() => onUserPress?.(player.student_id)}
              style={{
                paddingHorizontal: theme.spacing.lg,
                paddingVertical: theme.spacing.md,
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomWidth: index < displayLeaderboard.length - 4 ? 1 : 0,
                borderBottomColor: theme.colors.border.primary,
                backgroundColor: player.student_id === currentUserId 
                  ? `${theme.colors.interactive.primary}08` 
                  : 'transparent',
              }}
            >
              {/* Rank */}
              <View style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: theme.colors.background.secondary,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: theme.spacing.md,
              }}>
                <Text style={{
                  color: theme.colors.text.secondary,
                  fontSize: theme.fontSizes.sm,
                  fontWeight: theme.fontConfig.fontWeight.semibold,
                }}>
                  {player.rank}
                </Text>
              </View>

              {/* Avatar */}
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: `${theme.colors.interactive.primary}15`,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: theme.spacing.md,
              }}>
                <Text style={{
                  color: theme.colors.interactive.primary,
                  fontSize: theme.fontSizes.sm,
                  fontWeight: theme.fontConfig.fontWeight.bold,
                }}>
                  {getInitials(player.student_name)}
                </Text>
              </View>

              {/* Player Info */}
              <View style={{ flex: 1 }}>
                <Text style={{
                  color: theme.colors.text.primary,
                  fontSize: theme.fontSizes.base,
                  fontWeight: theme.fontConfig.fontWeight.medium,
                }}>
                  {player.student_name}
                  {player.student_id === currentUserId && (
                    <Text style={{
                      color: theme.colors.interactive.primary,
                      fontSize: theme.fontSizes.sm,
                      fontWeight: theme.fontConfig.fontWeight.medium,
                    }}>
                      {' (You)'}
                    </Text>
                  )}
                </Text>
                <Text style={{
                  color: theme.colors.text.secondary,
                  fontSize: theme.fontSizes.sm,
                }}>
                  {player.completed_achievements} achievements
                </Text>
              </View>

              {/* Points */}
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{
                  color: theme.colors.text.primary,
                  fontSize: theme.fontSizes.base,
                  fontWeight: theme.fontConfig.fontWeight.semibold,
                }}>
                  {formatPoints(player.total_points)}
                </Text>
                <Text style={{
                  color: theme.colors.text.tertiary,
                  fontSize: theme.fontSizes.xs,
                }}>
                  points
                </Text>
              </View>

              {/* Recent Achievement */}
              {player.recent_achievement && (
                <View style={{
                  marginLeft: theme.spacing.sm,
                  alignItems: 'center',
                }}>
                  <Ionicons
                    name={player.recent_achievement.icon as any}
                    size={16}
                    color={theme.colors.status.success}
                  />
                </View>
              )}
            </Pressable>
          </Animated.View>
        ))}

        {/* Current User Position (if not in top results) */}
        {currentUserRank && currentUserRank > maxItems && (
          <View style={{
            paddingHorizontal: theme.spacing.lg,
            paddingVertical: theme.spacing.md,
            backgroundColor: `${theme.colors.interactive.primary}10`,
            borderTopWidth: 2,
            borderTopColor: theme.colors.border.primary,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <View style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: theme.colors.interactive.primary,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: theme.spacing.md,
            }}>
              <Text style={{
                color: 'white',
                fontSize: theme.fontSizes.sm,
                fontWeight: theme.fontConfig.fontWeight.semibold,
              }}>
                {currentUserRank}
              </Text>
            </View>
            
            <Text style={{
              color: theme.colors.text.primary,
              fontSize: theme.fontSizes.base,
              fontWeight: theme.fontConfig.fontWeight.medium,
              flex: 1,
            }}>
              Your Position
            </Text>
            
            <Ionicons 
              name="arrow-up" 
              size={16} 
              color={theme.colors.interactive.primary} 
            />
            <Text style={{
              color: theme.colors.interactive.primary,
              fontSize: theme.fontSizes.sm,
              fontWeight: theme.fontConfig.fontWeight.medium,
              marginLeft: 4,
            }}>
              Keep going!
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};