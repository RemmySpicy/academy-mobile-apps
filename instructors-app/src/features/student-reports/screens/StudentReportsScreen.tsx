import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@academy/mobile-shared';

export const StudentReportsScreen: React.FC = () => {
  const { theme } = useTheme();
  const [selectedFilter, setSelectedFilter] = React.useState('all');
  const [students] = React.useState([
    {
      id: '1',
      name: 'Emily Johnson',
      level: 'Intermediate',
      attendance: 95,
      progress: 85,
      lastSession: '2024-08-28',
      improvement: '+12%',
      status: 'excellent',
    },
    {
      id: '2',
      name: 'Michael Chen',
      level: 'Beginner',
      attendance: 88,
      progress: 70,
      lastSession: '2024-08-27',
      improvement: '+8%',
      status: 'good',
    },
    {
      id: '3',
      name: 'Sarah Williams',
      level: 'Advanced',
      attendance: 92,
      progress: 90,
      lastSession: '2024-08-28',
      improvement: '+15%',
      status: 'excellent',
    },
    {
      id: '4',
      name: 'David Brown',
      level: 'Intermediate',
      attendance: 75,
      progress: 60,
      lastSession: '2024-08-26',
      improvement: '+3%',
      status: 'needs_attention',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return theme.colors.status.success;
      case 'good':
        return theme.colors.interactive.accent;
      case 'needs_attention':
        return theme.colors.status.warning;
      default:
        return theme.colors.icon.secondary;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return theme.colors.status.success;
    if (progress >= 60) return theme.colors.status.warning;
    return theme.colors.status.error;
  };

  const StudentCard = ({ student }: { student: any }) => (
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
        <View style={{ flex: 1 }}>
          <Text style={{
            color: theme.colors.text.primary,
            fontSize: theme.fontSizes.lg,
            fontWeight: theme.fontConfig.fontWeight.semibold,
            marginBottom: 4,
          }}>
            {student.name}
          </Text>
          <Text style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.base,
          }}>
            {student.level} Level
          </Text>
        </View>
        <View style={{
          backgroundColor: getStatusColor(student.status) + '15',
          paddingHorizontal: theme.spacing.sm,
          paddingVertical: theme.spacing.xs,
          borderRadius: theme.borderRadius.full,
        }}>
          <Text style={{
            color: getStatusColor(student.status),
            fontSize: theme.fontSizes.sm,
            fontWeight: theme.fontConfig.fontWeight.medium,
            textTransform: 'capitalize',
          }}>
            {student.status.replace('_', ' ')}
          </Text>
        </View>
      </View>
      
      {/* Progress Bars */}
      <View style={{ marginBottom: theme.spacing.md }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.xs }}>
          <Text style={{ color: theme.colors.text.secondary, fontSize: theme.fontSizes.sm }}>Attendance</Text>
          <Text style={{ color: theme.colors.text.primary, fontSize: theme.fontSizes.sm, fontWeight: theme.fontConfig.fontWeight.medium }}>
            {student.attendance}%
          </Text>
        </View>
        <View style={{
          height: 6,
          backgroundColor: theme.colors.border.primary,
          borderRadius: 3,
          overflow: 'hidden',
        }}>
          <View style={{
            height: '100%',
            width: `${student.attendance}%`,
            backgroundColor: student.attendance >= 90 ? theme.colors.status.success : theme.colors.status.warning,
          }} />
        </View>
      </View>
      
      <View style={{ marginBottom: theme.spacing.md }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.xs }}>
          <Text style={{ color: theme.colors.text.secondary, fontSize: theme.fontSizes.sm }}>Progress</Text>
          <Text style={{ color: theme.colors.text.primary, fontSize: theme.fontSizes.sm, fontWeight: theme.fontConfig.fontWeight.medium }}>
            {student.progress}%
          </Text>
        </View>
        <View style={{
          height: 6,
          backgroundColor: theme.colors.border.primary,
          borderRadius: 3,
          overflow: 'hidden',
        }}>
          <View style={{
            height: '100%',
            width: `${student.progress}%`,
            backgroundColor: getProgressColor(student.progress),
          }} />
        </View>
      </View>
      
      {/* Action Buttons */}
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
          backgroundColor: theme.colors.interactive.accent,
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
            Send Report
          </Text>
        </Pressable>
      </View>
    </View>
  );

  const filters = [
    { id: 'all', label: 'All Students' },
    { id: 'excellent', label: 'Excellent' },
    { id: 'good', label: 'Good' },
    { id: 'needs_attention', label: 'Needs Attention' },
  ];

  const filteredStudents = selectedFilter === 'all' 
    ? students 
    : students.filter(s => s.status === selectedFilter);

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
        {/* Summary Stats */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: theme.spacing.lg,
        }}>
          <View style={{
            backgroundColor: theme.colors.background.primary,
            borderRadius: theme.borderRadius.lg,
            padding: theme.spacing.sm,
            flex: 1,
            marginRight: theme.spacing.xs,
            alignItems: 'center',
            ...theme.elevation.sm,
          }}>
            <Text style={{
              color: theme.colors.status.success,
              fontSize: theme.fontSizes.lg,
              fontWeight: theme.fontConfig.fontWeight.bold,
            }}>2</Text>
            <Text style={{
              color: theme.colors.text.secondary,
              fontSize: theme.fontSizes.xs,
              textAlign: 'center',
            }}>Excellent</Text>
          </View>
          
          <View style={{
            backgroundColor: theme.colors.background.primary,
            borderRadius: theme.borderRadius.lg,
            padding: theme.spacing.sm,
            flex: 1,
            marginHorizontal: theme.spacing.xs,
            alignItems: 'center',
            ...theme.elevation.sm,
          }}>
            <Text style={{
              color: theme.colors.interactive.accent,
              fontSize: theme.fontSizes.lg,
              fontWeight: theme.fontConfig.fontWeight.bold,
            }}>1</Text>
            <Text style={{
              color: theme.colors.text.secondary,
              fontSize: theme.fontSizes.xs,
              textAlign: 'center',
            }}>Good</Text>
          </View>
          
          <View style={{
            backgroundColor: theme.colors.background.primary,
            borderRadius: theme.borderRadius.lg,
            padding: theme.spacing.sm,
            flex: 1,
            marginLeft: theme.spacing.xs,
            alignItems: 'center',
            ...theme.elevation.sm,
          }}>
            <Text style={{
              color: theme.colors.status.warning,
              fontSize: theme.fontSizes.lg,
              fontWeight: theme.fontConfig.fontWeight.bold,
            }}>1</Text>
            <Text style={{
              color: theme.colors.text.secondary,
              fontSize: theme.fontSizes.xs,
              textAlign: 'center',
            }}>Needs Attention</Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: theme.spacing.lg }}
        >
          {filters.map((filter) => (
            <Pressable
              key={filter.id}
              onPress={() => setSelectedFilter(filter.id)}
              style={{
                backgroundColor: selectedFilter === filter.id 
                  ? theme.colors.interactive.primary 
                  : theme.colors.background.primary,
                paddingHorizontal: theme.spacing.md,
                paddingVertical: theme.spacing.sm,
                borderRadius: theme.borderRadius.full,
                marginRight: theme.spacing.sm,
                borderWidth: 1,
                borderColor: selectedFilter === filter.id 
                  ? theme.colors.interactive.primary 
                  : theme.colors.border.primary,
              }}
            >
              <Text style={{
                color: selectedFilter === filter.id 
                  ? 'white' 
                  : theme.colors.text.primary,
                fontSize: theme.fontSizes.sm,
                fontWeight: theme.fontConfig.fontWeight.medium,
              }}>
                {filter.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Student List */}
        <Text style={{
          color: theme.colors.text.primary,
          fontSize: theme.fontSizes.lg,
          fontWeight: theme.fontConfig.fontWeight.semibold,
          marginBottom: theme.spacing.md,
        }}>
          Student Reports ({filteredStudents.length})
        </Text>
        
        {filteredStudents.map((student) => (
          <StudentCard key={student.id} student={student} />
        ))}
        
        {/* Export Actions */}
        <View style={{
          marginTop: theme.spacing.xl,
          backgroundColor: theme.colors.background.primary,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.md,
          ...theme.elevation.sm,
        }}>
          <Text style={{
            color: theme.colors.text.primary,
            fontSize: theme.fontSizes.lg,
            fontWeight: theme.fontConfig.fontWeight.semibold,
            marginBottom: theme.spacing.md,
          }}>
            Export Reports
          </Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Pressable style={{
              backgroundColor: theme.colors.status.success,
              borderRadius: theme.borderRadius.md,
              padding: theme.spacing.md,
              flex: 1,
              marginRight: theme.spacing.sm,
              alignItems: 'center',
            }}>
              <Ionicons name="document-text" size={20} color="white" style={{ marginBottom: theme.spacing.xs }} />
              <Text style={{
                color: 'white',
                fontSize: theme.fontSizes.sm,
                fontWeight: theme.fontConfig.fontWeight.medium,
              }}>
                PDF Report
              </Text>
            </Pressable>
            
            <Pressable style={{
              backgroundColor: theme.colors.interactive.accent,
              borderRadius: theme.borderRadius.md,
              padding: theme.spacing.md,
              flex: 1,
              marginLeft: theme.spacing.sm,
              alignItems: 'center',
            }}>
              <Ionicons name="mail" size={20} color="white" style={{ marginBottom: theme.spacing.xs }} />
              <Text style={{
                color: 'white',
                fontSize: theme.fontSizes.sm,
                fontWeight: theme.fontConfig.fontWeight.medium,
              }}>
                Email Reports
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};