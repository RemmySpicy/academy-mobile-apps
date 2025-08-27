import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useTheme } from '@academy/mobile-shared';

interface ScheduleItem {
  id: string;
  title: string;
  type: 'class' | 'training' | 'assessment';
  instructor: string;
  time: string;
  duration: number;
  location: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  date: string;
  color: string;
  canCancel?: boolean;
  canReschedule?: boolean;
}

const ScheduleCard: React.FC<{ item: ScheduleItem; index: number }> = ({
  item,
  index,
}) => {
  const { theme } = useTheme();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return theme.colors.interactive.primary;
      case 'completed':
        return theme.colors.status.success;
      case 'cancelled':
        return theme.colors.status.error;
      default:
        return theme.colors.text.secondary;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'class':
        return 'people-outline';
      case 'training':
        return 'fitness-outline';
      case 'assessment':
        return 'analytics-outline';
      default:
        return 'calendar-outline';
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Session',
      `Are you sure you want to cancel "${item.title}"?`,
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes, Cancel', 
          style: 'destructive',
          onPress: () => console.log('Cancelled:', item.id)
        },
      ]
    );
  };

  const handleReschedule = () => {
    console.log('Reschedule:', item.id);
  };
  
  return (
    <Animated.View
      entering={FadeInRight.delay(index * 50).springify()}
      style={[
        styles.scheduleCard,
        {
          backgroundColor: theme.colors.background.primary,
          borderColor: theme.colors.border.primary,
          borderRadius: theme.borderRadius.xl,
          padding: theme.spacing.md,
          marginBottom: theme.spacing.md,
          borderLeftWidth: 4,
          borderLeftColor: item.color,
          ...theme.elevation.sm,
        }
      ]}
    >
      <View style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.sm,
      }}>
        <View style={{
          width: 40,
          height: 40,
          backgroundColor: `${item.color}15`,
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: theme.spacing.md,
        }}>
          <Ionicons
            name={getTypeIcon(item.type)}
            size={20}
            color={item.color}
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
              fontSize: theme.fontSizes.base,
              fontWeight: theme.fontConfig.fontWeight.medium,
              flex: 1,
            }}>
              {item.title}
            </Text>
            <View style={{
              backgroundColor: `${getStatusColor(item.status)}15`,
              paddingHorizontal: theme.spacing.sm,
              paddingVertical: 2,
              borderRadius: theme.borderRadius.full,
            }}>
              <Text style={{
                color: getStatusColor(item.status),
                fontSize: theme.fontSizes.xs,
                fontWeight: theme.fontConfig.fontWeight.medium,
                textTransform: 'capitalize',
              }}>
                {item.status}
              </Text>
            </View>
          </View>
          
          <Text style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.sm,
            marginBottom: theme.spacing.xs,
          }}>
            with {item.instructor}
          </Text>
          
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: theme.spacing.md,
              marginBottom: theme.spacing.xs,
            }}>
              <Ionicons
                name="time-outline"
                size={14}
                color={theme.colors.icon.secondary}
                style={{ marginRight: theme.spacing.xs }}
              />
              <Text style={{
                color: theme.colors.text.secondary,
                fontSize: theme.fontSizes.sm,
              }}>
                {item.time} ({item.duration}min)
              </Text>
            </View>
            
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: theme.spacing.xs,
            }}>
              <Ionicons
                name="location-outline"
                size={14}
                color={theme.colors.icon.secondary}
                style={{ marginRight: theme.spacing.xs }}
              />
              <Text style={{
                color: theme.colors.text.secondary,
                fontSize: theme.fontSizes.sm,
              }}>
                {item.location}
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      {item.status === 'upcoming' && (item.canCancel || item.canReschedule) && (
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
          borderTopWidth: 1,
          borderTopColor: theme.colors.border.primary,
          paddingTop: theme.spacing.sm,
          marginTop: theme.spacing.sm,
        }}>
          {item.canReschedule && (
            <Pressable
              onPress={handleReschedule}
              style={{
                backgroundColor: theme.colors.background.secondary,
                borderRadius: theme.borderRadius.lg,
                paddingHorizontal: theme.spacing.md,
                paddingVertical: theme.spacing.sm,
                marginRight: theme.spacing.sm,
              }}
            >
              <Text style={{
                color: theme.colors.text.primary,
                fontWeight: theme.fontConfig.fontWeight.medium,
                fontSize: theme.fontSizes.sm,
              }}>
                Reschedule
              </Text>
            </Pressable>
          )}
          
          {item.canCancel && (
            <Pressable
              onPress={handleCancel}
              style={{
                backgroundColor: theme.colors.status.errorBackground,
                borderRadius: theme.borderRadius.lg,
                paddingHorizontal: theme.spacing.md,
                paddingVertical: theme.spacing.sm,
              }}
            >
              <Text style={{
                color: theme.colors.status.error,
                fontWeight: theme.fontConfig.fontWeight.medium,
                fontSize: theme.fontSizes.sm,
              }}>
                Cancel
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </Animated.View>
  );
};

export const ScheduleScreen: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const periods = [
    { id: 'week', title: 'This Week' },
    { id: 'month', title: 'This Month' },
    { id: 'upcoming', title: 'Upcoming' },
  ];

  const filters = [
    { id: 'all', title: 'All' },
    { id: 'class', title: 'Classes' },
    { id: 'training', title: 'Training' },
    { id: 'assessment', title: 'Assessments' },
  ];

  const scheduleItems: ScheduleItem[] = [
    {
      id: 'sch-001',
      title: 'Swimming Technique Class',
      type: 'class',
      instructor: 'Coach Sarah',
      time: '2:00 PM',
      duration: 60,
      location: 'Pool A',
      status: 'upcoming',
      date: 'Today',
      color: theme.colors.interactive.primary,
      canCancel: true,
      canReschedule: true,
    },
    {
      id: 'sch-002',
      title: 'Personal Training',
      type: 'training',
      instructor: 'Coach Mike',
      time: '4:30 PM',
      duration: 45,
      location: 'Gym 1',
      status: 'upcoming',
      date: 'Today',
      color: theme.colors.status.success,
      canCancel: true,
      canReschedule: true,
    },
    {
      id: 'sch-003',
      title: 'Skill Assessment',
      type: 'assessment',
      instructor: 'Coach Emma',
      time: '10:00 AM',
      duration: 30,
      location: 'Pool B',
      status: 'completed',
      date: 'Yesterday',
      color: theme.colors.interactive.purple,
    },
    {
      id: 'sch-004',
      title: 'Group Fitness',
      type: 'class',
      instructor: 'Coach Alex',
      time: '6:00 PM',
      duration: 50,
      location: 'Studio 2',
      status: 'upcoming',
      date: 'Tomorrow',
      color: theme.colors.status.warning,
      canCancel: true,
      canReschedule: false,
    },
    {
      id: 'sch-005',
      title: 'Advanced Swimming',
      type: 'class',
      instructor: 'Coach David',
      time: '3:00 PM',
      duration: 75,
      location: 'Pool A',
      status: 'cancelled',
      date: 'Aug 22',
      color: theme.colors.status.error,
    },
  ];

  const filteredItems = scheduleItems.filter(item => {
    if (selectedFilter === 'all') return true;
    return item.type === selectedFilter;
  });

  const upcomingCount = scheduleItems.filter(item => item.status === 'upcoming').length;
  const completedCount = scheduleItems.filter(item => item.status === 'completed').length;

  return (
    <View style={{
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: theme.spacing.lg,
          paddingBottom: theme.spacing['3xl'],
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Cards */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          style={{
            paddingHorizontal: theme.spacing.md,
            marginBottom: theme.spacing.xl,
          }}
        >
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: theme.spacing.md,
          }}>
            <View style={{
              backgroundColor: theme.colors.background.primary,
              borderRadius: theme.borderRadius.xl,
              padding: theme.spacing.md,
              flex: 1,
              marginRight: theme.spacing.sm,
              alignItems: 'center',
              ...theme.elevation.sm,
            }}>
              <View style={{
                width: 32,
                height: 32,
                backgroundColor: `${theme.colors.interactive.primary}15`,
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: theme.spacing.sm,
              }}>
                <Ionicons
                  name="time"
                  size={16}
                  color={theme.colors.interactive.primary}
                />
              </View>
              <Text style={{
                color: theme.colors.interactive.primary,
                fontSize: theme.fontSizes.xl,
                fontWeight: theme.fontConfig.fontWeight.bold,
                marginBottom: theme.spacing.xs,
              }}>
                {upcomingCount}
              </Text>
              <Text style={{
                color: theme.colors.text.secondary,
                fontSize: theme.fontSizes.sm,
                textAlign: 'center',
              }}>
                Upcoming Sessions
              </Text>
            </View>
            
            <View style={{
              backgroundColor: theme.colors.background.primary,
              borderRadius: theme.borderRadius.xl,
              padding: theme.spacing.md,
              flex: 1,
              marginLeft: theme.spacing.sm,
              alignItems: 'center',
              ...theme.elevation.sm,
            }}>
              <View style={{
                width: 32,
                height: 32,
                backgroundColor: `${theme.colors.status.success}15`,
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: theme.spacing.sm,
              }}>
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={theme.colors.status.success}
                />
              </View>
              <Text style={{
                color: theme.colors.status.success,
                fontSize: theme.fontSizes.xl,
                fontWeight: theme.fontConfig.fontWeight.bold,
                marginBottom: theme.spacing.xs,
              }}>
                {completedCount}
              </Text>
              <Text style={{
                color: theme.colors.text.secondary,
                fontSize: theme.fontSizes.sm,
                textAlign: 'center',
              }}>
                Completed
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Period Selector */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={{
            paddingHorizontal: theme.spacing.md,
            marginBottom: theme.spacing.lg,
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 0 }}
          >
            {periods.map((period, index) => (
              <Pressable
                key={period.id}
                onPress={() => setSelectedPeriod(period.id)}
                style={{
                  backgroundColor: selectedPeriod === period.id
                    ? theme.colors.interactive.primary
                    : theme.colors.background.primary,
                  borderColor: selectedPeriod === period.id
                    ? theme.colors.interactive.primary
                    : theme.colors.border.primary,
                  borderWidth: 1,
                  borderRadius: theme.borderRadius.full,
                  paddingHorizontal: theme.spacing.md,
                  paddingVertical: theme.spacing.sm,
                  marginRight: theme.spacing.md,
                }}
              >
                <Text style={{
                  color: selectedPeriod === period.id
                    ? 'white'
                    : theme.colors.text.primary,
                  fontWeight: theme.fontConfig.fontWeight.medium,
                  fontSize: theme.fontSizes.sm,
                }}>
                  {period.title}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Filter Tabs */}
        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          style={{
            paddingHorizontal: theme.spacing.md,
            marginBottom: theme.spacing.xl,
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 0 }}
          >
            {filters.map((filter, index) => (
              <Pressable
                key={filter.id}
                onPress={() => setSelectedFilter(filter.id)}
                style={{
                  backgroundColor: selectedFilter === filter.id
                    ? theme.colors.background.primary
                    : 'transparent',
                  borderBottomWidth: 2,
                  borderBottomColor: selectedFilter === filter.id
                    ? theme.colors.interactive.primary
                    : 'transparent',
                  paddingHorizontal: theme.spacing.md,
                  paddingVertical: theme.spacing.sm,
                  marginRight: theme.spacing.lg,
                }}
              >
                <Text style={{
                  color: selectedFilter === filter.id
                    ? theme.colors.interactive.primary
                    : theme.colors.text.secondary,
                  fontWeight: selectedFilter === filter.id
                    ? theme.fontConfig.fontWeight.semibold
                    : theme.fontConfig.fontWeight.medium,
                  fontSize: theme.fontSizes.base,
                }}>
                  {filter.title}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Schedule List */}
        <View style={{ paddingHorizontal: theme.spacing.md }}>
          <Animated.Text
            entering={FadeInDown.delay(400).springify()}
            style={{
              color: theme.colors.text.primary,
              fontSize: theme.fontSizes.lg,
              fontWeight: theme.fontConfig.fontWeight.semibold,
              marginBottom: theme.spacing.md,
            }}
          >
            Schedule
          </Animated.Text>
          
          {filteredItems.map((item, index) => (
            <ScheduleCard
              key={item.id}
              item={item}
              index={index}
            />
          ))}

          {filteredItems.length === 0 && (
            <Animated.View
              entering={FadeInDown.delay(500).springify()}
              style={{
                backgroundColor: theme.colors.background.primary,
                borderRadius: theme.borderRadius.xl,
                padding: theme.spacing['2xl'],
                alignItems: 'center',
                marginTop: theme.spacing.xl,
              }}
            >
              <Ionicons
                name="calendar-outline"
                size={48}
                color={theme.colors.icon.tertiary}
                style={{ marginBottom: theme.spacing.md }}
              />
              <Text style={{
                color: theme.colors.text.primary,
                fontSize: theme.fontSizes.lg,
                fontWeight: theme.fontConfig.fontWeight.medium,
                textAlign: 'center',
                marginBottom: theme.spacing.sm,
              }}>
                No sessions found
              </Text>
              <Text style={{
                color: theme.colors.text.secondary,
                fontSize: theme.fontSizes.base,
                textAlign: 'center',
              }}>
                Try adjusting your filters or book a new session
              </Text>
            </Animated.View>
          )}
        </View>

        {/* Quick Actions */}
        <Animated.View
          entering={FadeInDown.delay(600).springify()}
          style={{
            margin: theme.spacing.lg,
            backgroundColor: theme.colors.background.primary,
            borderRadius: theme.borderRadius.xl,
            padding: theme.spacing.lg,
            ...theme.elevation.sm,
          }}
        >
          <Text style={{
            color: theme.colors.text.primary,
            fontSize: theme.fontSizes.lg,
            fontWeight: theme.fontConfig.fontWeight.semibold,
            marginBottom: theme.spacing.md,
          }}>
            Quick Actions
          </Text>
          
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
            <Pressable style={{
              backgroundColor: theme.colors.interactive.primary,
              borderRadius: theme.borderRadius.lg,
              paddingHorizontal: theme.spacing.md,
              paddingVertical: theme.spacing.md,
              flex: 1,
              marginRight: theme.spacing.sm,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
              <Ionicons
                name="add-circle"
                size={20}
                color="white"
                style={{ marginRight: theme.spacing.sm }}
              />
              <Text style={{
                color: 'white',
                fontWeight: theme.fontConfig.fontWeight.medium,
                fontSize: theme.fontSizes.sm,
              }}>
                Book Session
              </Text>
            </Pressable>
            
            <Pressable style={{
              backgroundColor: theme.colors.background.secondary,
              borderRadius: theme.borderRadius.lg,
              paddingHorizontal: theme.spacing.md,
              paddingVertical: theme.spacing.md,
              flex: 1,
              marginLeft: theme.spacing.sm,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
              <Ionicons
                name="calendar"
                size={20}
                color={theme.colors.text.primary}
                style={{ marginRight: theme.spacing.sm }}
              />
              <Text style={{
                color: theme.colors.text.primary,
                fontWeight: theme.fontConfig.fontWeight.medium,
                fontSize: theme.fontSizes.sm,
              }}>
                View Calendar
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scheduleCard: {
    borderWidth: 1,
  },
});