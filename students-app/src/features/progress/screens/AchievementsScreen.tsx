import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useTheme } from '@academy/mobile-shared';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  category: 'academic' | 'attendance' | 'participation' | 'skill' | 'milestone';
  status: 'locked' | 'in_progress' | 'completed';
  progress?: number;
  maxProgress?: number;
  dateEarned?: string;
  points?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: '1',
    title: 'First Day Victory',
    description: 'Complete your first day of classes',
    icon: 'trophy',
    category: 'milestone',
    status: 'completed',
    dateEarned: '2024-01-15',
    points: 10,
    rarity: 'common',
  },
  {
    id: '2',
    title: 'Perfect Attendance',
    description: 'Attend all classes for a week',
    icon: 'calendar-check',
    category: 'attendance',
    status: 'completed',
    dateEarned: '2024-02-20',
    points: 25,
    rarity: 'rare',
  },
  {
    id: '3',
    title: 'Swimming Pro',
    description: 'Complete 20 swimming sessions',
    icon: 'water',
    category: 'skill',
    status: 'in_progress',
    progress: 15,
    maxProgress: 20,
    points: 50,
    rarity: 'epic',
  },
  {
    id: '4',
    title: 'Academic Excellence',
    description: 'Score above 95% in 5 assessments',
    icon: 'school',
    category: 'academic',
    status: 'in_progress',
    progress: 3,
    maxProgress: 5,
    points: 75,
    rarity: 'epic',
  },
  {
    id: '5',
    title: 'Team Player',
    description: 'Participate in 10 group activities',
    icon: 'people',
    category: 'participation',
    status: 'locked',
    points: 30,
    rarity: 'rare',
  },
  {
    id: '6',
    title: 'Coding Master',
    description: 'Complete advanced coding challenges',
    icon: 'code',
    category: 'skill',
    status: 'locked',
    points: 100,
    rarity: 'legendary',
  },
];

const CATEGORY_FILTERS = [
  { id: 'all', label: 'All', icon: 'apps' as const },
  { id: 'academic', label: 'Academic', icon: 'school' as const },
  { id: 'attendance', label: 'Attendance', icon: 'calendar' as const },
  { id: 'participation', label: 'Activity', icon: 'people' as const },
  { id: 'skill', label: 'Skills', icon: 'flash' as const },
  { id: 'milestone', label: 'Milestones', icon: 'flag' as const },
];

const getRarityColor = (rarity: Achievement['rarity'], theme: any) => {
  switch (rarity) {
    case 'common':
      return theme.colors.icon.secondary;
    case 'rare':
      return theme.colors.interactive.primary;
    case 'epic':
      return theme.colors.interactive.purple;
    case 'legendary':
      return theme.colors.status.warning;
    default:
      return theme.colors.icon.secondary;
  }
};

const getStatusColor = (status: Achievement['status'], theme: any) => {
  switch (status) {
    case 'completed':
      return theme.colors.status.success;
    case 'in_progress':
      return theme.colors.interactive.primary;
    case 'locked':
      return theme.colors.icon.tertiary;
    default:
      return theme.colors.icon.tertiary;
  }
};

export const AchievementsScreen: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredAchievements = MOCK_ACHIEVEMENTS.filter(achievement =>
    selectedCategory === 'all' || achievement.category === selectedCategory
  );

  const completedCount = MOCK_ACHIEVEMENTS.filter(a => a.status === 'completed').length;
  const totalPoints = MOCK_ACHIEVEMENTS
    .filter(a => a.status === 'completed')
    .reduce((sum, a) => sum + (a.points || 0), 0);

  const renderAchievement = (achievement: Achievement, index: number) => {
    const rarityColor = getRarityColor(achievement.rarity, theme);
    const statusColor = getStatusColor(achievement.status, theme);
    const isLocked = achievement.status === 'locked';

    return (
      <Animated.View
        key={achievement.id}
        entering={FadeInDown.delay(index * 50).springify()}
        style={[
          {
            backgroundColor: theme.colors.background.primary,
            borderRadius: theme.borderRadius.xl,
            padding: theme.spacing.lg,
            marginBottom: theme.spacing.md,
            borderWidth: 2,
            borderColor: achievement.status === 'completed' ? rarityColor : theme.colors.border.primary,
            opacity: isLocked ? 0.6 : 1,
          },
          theme.elevation.sm,
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          <View style={{
            width: 60,
            height: 60,
            backgroundColor: `${statusColor}15`,
            borderRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: theme.spacing.md,
            borderWidth: 2,
            borderColor: statusColor,
          }}>
            <Ionicons
              name={isLocked ? 'lock-closed' : achievement.icon}
              size={28}
              color={statusColor}
            />
          </View>

          <View style={{ flex: 1 }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: theme.spacing.xs,
            }}>
              <Text style={{
                color: theme.colors.text.primary,
                fontWeight: theme.fontConfig.fontWeight.bold,
                fontSize: theme.fontSizes.lg,
              }}>
                {achievement.title}
              </Text>
              <View style={{
                backgroundColor: `${rarityColor}15`,
                paddingHorizontal: theme.spacing.sm,
                paddingVertical: theme.spacing.xs,
                borderRadius: theme.borderRadius.full,
              }}>
                <Text style={{
                  color: rarityColor,
                  fontWeight: theme.fontConfig.fontWeight.medium,
                  fontSize: theme.fontSizes.xs,
                  textTransform: 'uppercase',
                }}>
                  {achievement.rarity}
                </Text>
              </View>
            </View>

            <Text style={{
              color: theme.colors.text.secondary,
              fontSize: theme.fontSizes.base,
              marginBottom: theme.spacing.sm,
            }}>
              {achievement.description}
            </Text>

            {achievement.status === 'in_progress' && achievement.progress && achievement.maxProgress && (
              <View style={{ marginBottom: theme.spacing.sm }}>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: theme.spacing.xs,
                }}>
                  <Text style={{
                    color: theme.colors.text.secondary,
                    fontSize: theme.fontSizes.sm,
                  }}>
                    Progress
                  </Text>
                  <Text style={{
                    color: theme.colors.text.primary,
                    fontWeight: theme.fontConfig.fontWeight.medium,
                    fontSize: theme.fontSizes.sm,
                  }}>
                    {achievement.progress}/{achievement.maxProgress}
                  </Text>
                </View>
                <View style={{
                  height: 8,
                  backgroundColor: theme.colors.border.secondary,
                  borderRadius: 4,
                  overflow: 'hidden',
                }}>
                  <View style={{
                    height: '100%',
                    width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                    backgroundColor: theme.colors.interactive.primary,
                  }} />
                </View>
              </View>
            )}

            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="star" size={16} color={theme.colors.status.warning} />
                <Text style={{
                  color: theme.colors.text.secondary,
                  fontSize: theme.fontSizes.sm,
                  marginLeft: 4,
                }}>
                  {achievement.points} points
                </Text>
              </View>
              {achievement.dateEarned && (
                <Text style={{
                  color: theme.colors.text.tertiary,
                  fontSize: theme.fontSizes.sm,
                }}>
                  Earned {new Date(achievement.dateEarned).toLocaleDateString()}
                </Text>
              )}
            </View>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={{
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    }}>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: theme.spacing.xl,
          paddingBottom: theme.spacing['3xl'],
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Overview */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          style={{
            paddingHorizontal: theme.spacing.md,
            marginBottom: theme.spacing.xl,
          }}
        >
          <View style={{
            backgroundColor: theme.colors.interactive.primary,
            borderRadius: theme.borderRadius.xl,
            padding: theme.spacing.lg,
            ...theme.elevation.md,
          }}>
            <Text style={{
              color: 'white',
              fontSize: theme.fontSizes.xl,
              fontWeight: theme.fontConfig.fontWeight.bold,
              textAlign: 'center',
              marginBottom: theme.spacing.md,
            }}>
              Your Achievement Progress
            </Text>
            
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{
                  color: 'white',
                  fontSize: theme.fontSizes['2xl'],
                  fontWeight: theme.fontConfig.fontWeight.bold,
                }}>
                  {completedCount}
                </Text>
                <Text style={{
                  color: 'white',
                  fontSize: theme.fontSizes.sm,
                  opacity: 0.9,
                }}>
                  Earned
                </Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{
                  color: 'white',
                  fontSize: theme.fontSizes['2xl'],
                  fontWeight: theme.fontConfig.fontWeight.bold,
                }}>
                  {MOCK_ACHIEVEMENTS.length}
                </Text>
                <Text style={{
                  color: 'white',
                  fontSize: theme.fontSizes.sm,
                  opacity: 0.9,
                }}>
                  Total
                </Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{
                  color: 'white',
                  fontSize: theme.fontSizes['2xl'],
                  fontWeight: theme.fontConfig.fontWeight.bold,
                }}>
                  {totalPoints}
                </Text>
                <Text style={{
                  color: 'white',
                  fontSize: theme.fontSizes.sm,
                  opacity: 0.9,
                }}>
                  Points
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Category Filters */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={{
            marginBottom: theme.spacing.xl,
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: theme.spacing.md,
              paddingRight: theme.spacing.lg,
            }}
          >
            {CATEGORY_FILTERS.map((filter, index) => (
              <Pressable
                key={filter.id}
                onPress={() => setSelectedCategory(filter.id)}
                style={[
                  {
                    backgroundColor: selectedCategory === filter.id
                      ? theme.colors.interactive.primary
                      : theme.colors.background.primary,
                    borderRadius: theme.borderRadius.full,
                    paddingHorizontal: theme.spacing.lg,
                    paddingVertical: theme.spacing.md,
                    marginRight: theme.spacing.sm,
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: selectedCategory === filter.id
                      ? theme.colors.interactive.primary
                      : theme.colors.border.primary,
                  },
                  theme.elevation.sm,
                ]}
              >
                <Ionicons
                  name={filter.icon}
                  size={18}
                  color={selectedCategory === filter.id ? 'white' : theme.colors.icon.secondary}
                  style={{ marginRight: theme.spacing.xs }}
                />
                <Text style={{
                  color: selectedCategory === filter.id ? 'white' : theme.colors.text.primary,
                  fontWeight: theme.fontConfig.fontWeight.medium,
                  fontSize: theme.fontSizes.base,
                }}>
                  {filter.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Achievements List */}
        <View style={{ paddingHorizontal: theme.spacing.md }}>
          <Text style={{
            color: theme.colors.text.primary,
            fontSize: theme.fontSizes.lg,
            fontWeight: theme.fontConfig.fontWeight.semibold,
            marginBottom: theme.spacing.lg,
          }}>
            {selectedCategory === 'all' ? 'All Achievements' : `${CATEGORY_FILTERS.find(f => f.id === selectedCategory)?.label} Achievements`}
            {` (${filteredAchievements.length})`}
          </Text>

          {filteredAchievements.map((achievement, index) => renderAchievement(achievement, index))}

          {filteredAchievements.length === 0 && (
            <Animated.View
              entering={FadeInDown.delay(300).springify()}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: theme.spacing['2xl'],
              }}
            >
              <Ionicons name="trophy-outline" size={64} color={theme.colors.icon.tertiary} />
              <Text style={{
                color: theme.colors.text.secondary,
                fontSize: theme.fontSizes.lg,
                fontWeight: theme.fontConfig.fontWeight.medium,
                marginTop: theme.spacing.md,
                textAlign: 'center',
              }}>
                No achievements in this category yet
              </Text>
              <Text style={{
                color: theme.colors.text.tertiary,
                fontSize: theme.fontSizes.base,
                textAlign: 'center',
                marginTop: theme.spacing.sm,
              }}>
                Keep participating to unlock new achievements!
              </Text>
            </Animated.View>
          )}
        </View>

        {/* Motivational Footer */}
        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          style={{
            margin: theme.spacing.md,
            marginTop: theme.spacing.xl,
            backgroundColor: theme.colors.status.successBackground,
            borderRadius: theme.borderRadius.xl,
            padding: theme.spacing.lg,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: theme.colors.status.success,
          }}
        >
          <Ionicons name="rocket" size={32} color={theme.colors.status.success} />
          <Text style={{
            color: theme.colors.status.success,
            fontSize: theme.fontSizes.lg,
            fontWeight: theme.fontConfig.fontWeight.bold,
            textAlign: 'center',
            marginTop: theme.spacing.md,
          }}>
            Keep Going!
          </Text>
          <Text style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.base,
            textAlign: 'center',
            marginTop: theme.spacing.xs,
          }}>
            Every class attended and skill learned brings you closer to your next achievement.
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
};