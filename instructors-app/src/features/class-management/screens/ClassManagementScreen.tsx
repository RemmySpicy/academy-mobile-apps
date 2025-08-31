import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@academy/mobile-shared';

export const ClassManagementScreen: React.FC = () => {
  const { theme } = useTheme();
  const [classes, setClasses] = React.useState([
    {
      id: '1',
      name: 'Swimming - Beginner',
      time: '9:00 AM - 10:00 AM',
      students: 12,
      maxStudents: 15,
      status: 'active',
      date: 'Today',
    },
    {
      id: '2',
      name: 'Swimming - Intermediate',
      time: '10:30 AM - 11:30 AM',
      students: 8,
      maxStudents: 12,
      status: 'active',
      date: 'Today',
    },
    {
      id: '3',
      name: 'Swimming - Advanced',
      time: '2:00 PM - 3:00 PM',
      students: 6,
      maxStudents: 10,
      status: 'scheduled',
      date: 'Today',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return theme.colors.status.success;
      case 'scheduled':
        return theme.colors.status.warning;
      case 'completed':
        return theme.colors.icon.secondary;
      default:
        return theme.colors.icon.tertiary;
    }
  };

  const ClassCard = ({ classItem }: { classItem: any }) => (
    <View style={{
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      ...theme.elevation.sm,
    }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.sm }}>
        <Text style={{
          color: theme.colors.text.primary,
          fontSize: theme.fontSizes.lg,
          fontWeight: theme.fontConfig.fontWeight.semibold,
        }}>
          {classItem.name}
        </Text>
        <View style={{
          backgroundColor: getStatusColor(classItem.status) + '15',
          paddingHorizontal: theme.spacing.sm,
          paddingVertical: theme.spacing.xs,
          borderRadius: theme.borderRadius.full,
        }}>
          <Text style={{
            color: getStatusColor(classItem.status),
            fontSize: theme.fontSizes.sm,
            fontWeight: theme.fontConfig.fontWeight.medium,
            textTransform: 'capitalize',
          }}>
            {classItem.status}
          </Text>
        </View>
      </View>
      
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.xs }}>
        <Ionicons name="time-outline" size={16} color={theme.colors.icon.secondary} />
        <Text style={{
          color: theme.colors.text.secondary,
          fontSize: theme.fontSizes.base,
          marginLeft: theme.spacing.xs,
        }}>
          {classItem.time}
        </Text>
      </View>
      
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.md }}>
        <Ionicons name="people-outline" size={16} color={theme.colors.icon.secondary} />
        <Text style={{
          color: theme.colors.text.secondary,
          fontSize: theme.fontSizes.base,
          marginLeft: theme.spacing.xs,
        }}>
          {classItem.students}/{classItem.maxStudents} students
        </Text>
      </View>
      
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Pressable style={{
          backgroundColor: theme.colors.interactive.primary,
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
          borderRadius: theme.borderRadius.md,
          flex: 1,
          marginRight: theme.spacing.xs,
          alignItems: 'center',
        }}>
          <Text style={{
            color: 'white',
            fontSize: theme.fontSizes.sm,
            fontWeight: theme.fontConfig.fontWeight.medium,
          }}>
            View Details
          </Text>
        </Pressable>
        
        <Pressable style={{
          backgroundColor: theme.colors.status.success,
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
          borderRadius: theme.borderRadius.md,
          flex: 1,
          marginLeft: theme.spacing.xs,
          alignItems: 'center',
        }}>
          <Text style={{
            color: 'white',
            fontSize: theme.fontSizes.sm,
            fontWeight: theme.fontConfig.fontWeight.medium,
          }}>
            Take Attendance
          </Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.secondary }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.md,
          paddingTop: theme.spacing.lg,
          paddingBottom: theme.spacing['3xl'],
        }}
      >
        {/* Stats Cards */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: theme.spacing.xl,
        }}>
          <View style={{
            backgroundColor: theme.colors.background.primary,
            borderRadius: theme.borderRadius.lg,
            padding: theme.spacing.md,
            flex: 1,
            marginRight: theme.spacing.sm,
            alignItems: 'center',
            ...theme.elevation.sm,
          }}>
            <Text style={{
              color: theme.colors.interactive.primary,
              fontSize: theme.fontSizes.xl,
              fontWeight: theme.fontConfig.fontWeight.bold,
            }}>3</Text>
            <Text style={{
              color: theme.colors.text.secondary,
              fontSize: theme.fontSizes.sm,
              textAlign: 'center',
            }}>Today's Classes</Text>
          </View>
          
          <View style={{
            backgroundColor: theme.colors.background.primary,
            borderRadius: theme.borderRadius.lg,
            padding: theme.spacing.md,
            flex: 1,
            marginLeft: theme.spacing.sm,
            alignItems: 'center',
            ...theme.elevation.sm,
          }}>
            <Text style={{
              color: theme.colors.status.success,
              fontSize: theme.fontSizes.xl,
              fontWeight: theme.fontConfig.fontWeight.bold,
            }}>26</Text>
            <Text style={{
              color: theme.colors.text.secondary,
              fontSize: theme.fontSizes.sm,
              textAlign: 'center',
            }}>Total Students</Text>
          </View>
        </View>

        {/* Today's Classes */}
        <Text style={{
          color: theme.colors.text.primary,
          fontSize: theme.fontSizes.lg,
          fontWeight: theme.fontConfig.fontWeight.semibold,
          marginBottom: theme.spacing.md,
        }}>
          Today's Classes
        </Text>
        
        {classes.map((classItem) => (
          <ClassCard key={classItem.id} classItem={classItem} />
        ))}
        
        {/* Quick Actions */}
        <View style={{
          marginTop: theme.spacing.xl,
        }}>
          <Text style={{
            color: theme.colors.text.primary,
            fontSize: theme.fontSizes.lg,
            fontWeight: theme.fontConfig.fontWeight.semibold,
            marginBottom: theme.spacing.md,
          }}>
            Quick Actions
          </Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Pressable style={{
              backgroundColor: theme.colors.interactive.accent,
              borderRadius: theme.borderRadius.lg,
              padding: theme.spacing.md,
              flex: 1,
              marginRight: theme.spacing.sm,
              alignItems: 'center',
            }}>
              <Ionicons name="add-circle" size={24} color="white" style={{ marginBottom: theme.spacing.sm }} />
              <Text style={{
                color: 'white',
                fontSize: theme.fontSizes.sm,
                fontWeight: theme.fontConfig.fontWeight.medium,
                textAlign: 'center',
              }}>
                Create Class
              </Text>
            </Pressable>
            
            <Pressable style={{
              backgroundColor: theme.colors.interactive.purple,
              borderRadius: theme.borderRadius.lg,
              padding: theme.spacing.md,
              flex: 1,
              marginLeft: theme.spacing.sm,
              alignItems: 'center',
            }}>
              <Ionicons name="calendar" size={24} color="white" style={{ marginBottom: theme.spacing.sm }} />
              <Text style={{
                color: 'white',
                fontSize: theme.fontSizes.sm,
                fontWeight: theme.fontConfig.fontWeight.medium,
                textAlign: 'center',
              }}>
                View Schedule
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};