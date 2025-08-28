import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { LineChart, BarChart, PieChart } from 'react-native-gifted-charts';
import { 
  useTheme, 
  FilterBar, 
  SegmentedControl, 
  CustomButton,
  StatsCard 
} from '@academy/mobile-shared';

const { width: screenWidth } = Dimensions.get('window');

interface PerformanceMetric {
  id: string;
  title: string;
  value: number;
  change: number;
  unit: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

interface ProgressData {
  month: string;
  score: number;
  attendance: number;
}

export const ProgressReportScreen: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedPeriod, setSelectedPeriod] = useState('3months');
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string[] }>({
    period: ['3months']
  });

  const filterGroups = [
    {
      id: 'period',
      title: 'Time Period',
      options: [
        { id: '1month', label: '1 Month', value: '1month' },
        { id: '3months', label: '3 Months', value: '3months' },
        { id: '6months', label: '6 Months', value: '6months' },
        { id: '1year', label: '1 Year', value: '1year' },
      ],
      multiSelect: false,
    }
  ];

  const performanceMetrics: PerformanceMetric[] = [
    {
      id: 'overall-score',
      title: 'Overall Score',
      value: 87,
      change: 5.2,
      unit: '%',
      icon: 'trending-up',
      color: theme.colors.interactive.primary,
    },
    {
      id: 'attendance',
      title: 'Attendance Rate',
      value: 92,
      change: 2.1,
      unit: '%',
      icon: 'calendar-outline',
      color: theme.colors.status.success,
    },
    {
      id: 'skill-improvement',
      title: 'Skill Improvement',
      value: 78,
      change: 8.7,
      unit: '%',
      icon: 'bar-chart',
      color: theme.colors.interactive.accent,
    },
    {
      id: 'assignments',
      title: 'Assignment Score',
      value: 85,
      change: -1.3,
      unit: '%',
      icon: 'document-text',
      color: theme.colors.status.warning,
    },
  ];

  const progressData: ProgressData[] = [
    { month: 'Jan', score: 75, attendance: 85 },
    { month: 'Feb', score: 78, attendance: 88 },
    { month: 'Mar', score: 82, attendance: 92 },
    { month: 'Apr', score: 80, attendance: 89 },
    { month: 'May', score: 85, attendance: 94 },
    { month: 'Jun', score: 87, attendance: 92 },
  ];

  const lineChartData = progressData.map((item, index) => ({
    value: item.score,
    label: item.month,
    dataPointText: item.score.toString(),
  }));

  const attendanceData = progressData.map((item, index) => ({
    value: item.attendance,
    label: item.month,
    frontColor: theme.colors.status.success,
    gradientColor: `${theme.colors.status.success}80`,
  }));

  const skillDistribution = [
    { value: 30, color: theme.colors.interactive.primary, text: 'Technical' },
    { value: 25, color: theme.colors.status.success, text: 'Physical' },
    { value: 20, color: theme.colors.interactive.accent, text: 'Mental' },
    { value: 15, color: theme.colors.status.warning, text: 'Tactical' },
    { value: 10, color: theme.colors.interactive.purple, text: 'Other' },
  ];

  const handleFilterChange = (groupId: string, optionId: string, selected: boolean) => {
    setSelectedFilters(prev => {
      const group = filterGroups.find(g => g.id === groupId);
      if (!group) return prev;

      if (group.multiSelect) {
        const currentSelections = prev[groupId] || [];
        if (selected) {
          return { ...prev, [groupId]: [...currentSelections, optionId] };
        } else {
          return { ...prev, [groupId]: currentSelections.filter(id => id !== optionId) };
        }
      } else {
        setSelectedPeriod(optionId);
        return { ...prev, [groupId]: [optionId] };
      }
    });
  };

  const achievements = [
    { id: '1', title: 'Perfect Attendance', date: 'This Month', icon: 'calendar', color: theme.colors.status.success },
    { id: '2', title: 'Top Performer', date: 'Last Week', icon: 'trophy', color: theme.colors.status.warning },
    { id: '3', title: 'Improvement Star', date: '2 Weeks Ago', icon: 'star', color: theme.colors.interactive.primary },
  ];

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
        {/* Header Description */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          style={{
            paddingHorizontal: theme.spacing.md,
            marginBottom: theme.spacing.xl,
          }}
        >
          <Text style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.base,
            textAlign: 'center',
            lineHeight: 24,
          }}>
            Track your learning progress with detailed analytics and performance insights.
          </Text>
        </Animated.View>

        {/* Time Period Filter */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={{ marginBottom: theme.spacing.xl }}
        >
          <FilterBar
            filters={filterGroups}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            variant="horizontal"
            scrollable={true}
            showCounts={false}
            showIcons={false}
            showClearAll={false}
            compactMode={true}
          />
        </Animated.View>

        {/* Performance Metrics */}
        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          style={{
            paddingHorizontal: theme.spacing.md,
            marginBottom: theme.spacing.xl,
          }}
        >
          <Text style={{
            color: theme.colors.text.primary,
            fontSize: theme.fontSizes.lg,
            fontWeight: theme.fontConfig.fontWeight.semibold,
            marginBottom: theme.spacing.md,
          }}>
            Key Performance Metrics
          </Text>

          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}>
            {performanceMetrics.map((metric, index) => (
              <StatsCard
                key={metric.id}
                title={metric.title}
                value={metric.value}
                unit={metric.unit}
                change={metric.change}
                icon={metric.icon}
                color={metric.color}
                style={{
                  width: '48%',
                  marginBottom: theme.spacing.sm,
                }}
              />
            ))}
          </View>
        </Animated.View>

        {/* Progress Chart */}
        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          style={{
            paddingHorizontal: theme.spacing.md,
            marginBottom: theme.spacing.xl,
          }}
        >
          <Text style={{
            color: theme.colors.text.primary,
            fontSize: theme.fontSizes.lg,
            fontWeight: theme.fontConfig.fontWeight.semibold,
            marginBottom: theme.spacing.md,
          }}>
            Progress Over Time
          </Text>

          <View style={{
            backgroundColor: theme.colors.background.primary,
            borderRadius: theme.borderRadius.xl,
            padding: theme.spacing.lg,
            ...theme.elevation.sm,
          }}>
            <LineChart
              data={lineChartData}
              width={screenWidth - (theme.spacing.md * 4)}
              height={200}
              color={theme.colors.interactive.primary}
              thickness={3}
              startFillColor={`${theme.colors.interactive.primary}40`}
              endFillColor={`${theme.colors.interactive.primary}10`}
              startOpacity={0.8}
              endOpacity={0.1}
              backgroundColor="transparent"
              rulesType="solid"
              rulesColor={theme.colors.border.primary}
              xAxisColor={theme.colors.border.primary}
              yAxisColor={theme.colors.border.primary}
              yAxisTextStyle={{ color: theme.colors.text.secondary }}
              xAxisLabelTextStyle={{ color: theme.colors.text.secondary }}
              showDataPointOnPress
              pressEnabled
              showTextOnPress
              textShiftY={-10}
              textShiftX={-10}
              textColor1={theme.colors.text.primary}
            />
          </View>
        </Animated.View>

        {/* Attendance Chart */}
        <Animated.View
          entering={FadeInDown.delay(500).springify()}
          style={{
            paddingHorizontal: theme.spacing.md,
            marginBottom: theme.spacing.xl,
          }}
        >
          <Text style={{
            color: theme.colors.text.primary,
            fontSize: theme.fontSizes.lg,
            fontWeight: theme.fontConfig.fontWeight.semibold,
            marginBottom: theme.spacing.md,
          }}>
            Attendance Tracking
          </Text>

          <View style={{
            backgroundColor: theme.colors.background.primary,
            borderRadius: theme.borderRadius.xl,
            padding: theme.spacing.lg,
            ...theme.elevation.sm,
          }}>
            <BarChart
              data={attendanceData}
              width={screenWidth - (theme.spacing.md * 4)}
              height={180}
              barWidth={35}
              spacing={25}
              backgroundColor="transparent"
              yAxisColor={theme.colors.border.primary}
              xAxisColor={theme.colors.border.primary}
              yAxisTextStyle={{ color: theme.colors.text.secondary }}
              xAxisLabelTextStyle={{ color: theme.colors.text.secondary }}
              showGradient
              gradientMargins={10}
              roundedTop
              roundedBottom
            />
          </View>
        </Animated.View>

        {/* Skill Distribution */}
        <Animated.View
          entering={FadeInDown.delay(600).springify()}
          style={{
            paddingHorizontal: theme.spacing.md,
            marginBottom: theme.spacing.xl,
          }}
        >
          <Text style={{
            color: theme.colors.text.primary,
            fontSize: theme.fontSizes.lg,
            fontWeight: theme.fontConfig.fontWeight.semibold,
            marginBottom: theme.spacing.md,
          }}>
            Skill Distribution
          </Text>

          <View style={{
            backgroundColor: theme.colors.background.primary,
            borderRadius: theme.borderRadius.xl,
            padding: theme.spacing.lg,
            ...theme.elevation.sm,
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <PieChart
                data={skillDistribution}
                donut
                radius={60}
                innerRadius={35}
                centerLabelComponent={() => (
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{
                      color: theme.colors.text.primary,
                      fontSize: theme.fontSizes.lg,
                      fontWeight: theme.fontConfig.fontWeight.bold,
                    }}>
                      100%
                    </Text>
                    <Text style={{
                      color: theme.colors.text.secondary,
                      fontSize: theme.fontSizes.sm,
                    }}>
                      Skills
                    </Text>
                  </View>
                )}
              />
              <View style={{ flex: 1, marginLeft: theme.spacing.lg }}>
                {skillDistribution.map((skill, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: theme.spacing.sm,
                    }}
                  >
                    <View style={{
                      width: 16,
                      height: 16,
                      borderRadius: 8,
                      backgroundColor: skill.color,
                      marginRight: theme.spacing.sm,
                    }} />
                    <Text style={{
                      color: theme.colors.text.primary,
                      fontSize: theme.fontSizes.sm,
                      flex: 1,
                    }}>
                      {skill.text}
                    </Text>
                    <Text style={{
                      color: theme.colors.text.secondary,
                      fontSize: theme.fontSizes.sm,
                      fontWeight: theme.fontConfig.fontWeight.medium,
                    }}>
                      {skill.value}%
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Recent Achievements */}
        <Animated.View
          entering={FadeInDown.delay(700).springify()}
          style={{
            paddingHorizontal: theme.spacing.md,
            marginBottom: theme.spacing.xl,
          }}
        >
          <Text style={{
            color: theme.colors.text.primary,
            fontSize: theme.fontSizes.lg,
            fontWeight: theme.fontConfig.fontWeight.semibold,
            marginBottom: theme.spacing.md,
          }}>
            Recent Achievements
          </Text>

          {achievements.map((achievement, index) => (
            <View
              key={achievement.id}
              style={{
                backgroundColor: theme.colors.background.primary,
                borderRadius: theme.borderRadius.lg,
                padding: theme.spacing.md,
                marginBottom: theme.spacing.sm,
                flexDirection: 'row',
                alignItems: 'center',
                ...theme.elevation.sm,
              }}
            >
              <View style={{
                width: 40,
                height: 40,
                backgroundColor: `${achievement.color}15`,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: theme.spacing.md,
              }}>
                <Ionicons
                  name={achievement.icon as keyof typeof Ionicons.glyphMap}
                  size={20}
                  color={achievement.color}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{
                  color: theme.colors.text.primary,
                  fontSize: theme.fontSizes.base,
                  fontWeight: theme.fontConfig.fontWeight.medium,
                }}>
                  {achievement.title}
                </Text>
                <Text style={{
                  color: theme.colors.text.secondary,
                  fontSize: theme.fontSizes.sm,
                  marginTop: 2,
                }}>
                  {achievement.date}
                </Text>
              </View>
            </View>
          ))}
        </Animated.View>

        {/* Export Report */}
        <Animated.View
          entering={FadeInDown.delay(800).springify()}
          style={{
            backgroundColor: theme.colors.interactive.primary,
            borderRadius: theme.borderRadius.xl,
            padding: theme.spacing.lg,
            marginHorizontal: theme.spacing.md,
            alignItems: 'center',
          }}
        >
          <Ionicons
            name="download"
            size={32}
            color="white"
            style={{ marginBottom: theme.spacing.md }}
          />
          <Text style={{
            color: 'white',
            fontSize: theme.fontSizes.lg,
            fontWeight: theme.fontConfig.fontWeight.bold,
            textAlign: 'center',
            marginBottom: theme.spacing.sm,
          }}>
            Export Progress Report
          </Text>
          <Text style={{
            color: 'white',
            fontSize: theme.fontSizes.base,
            textAlign: 'center',
            opacity: 0.9,
            marginBottom: theme.spacing.lg,
          }}>
            Get a detailed PDF report of your progress and share it with parents or coaches.
          </Text>
          <CustomButton
            title="Download Report"
            variant="secondary"
            size="md"
            onPress={() => console.log('Export progress report')}
            style={{
              backgroundColor: 'white',
            }}
            textStyle={{
              color: theme.colors.interactive.primary,
            }}
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});