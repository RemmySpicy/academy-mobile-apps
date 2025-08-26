import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';

// Performance Components
import { WorkoutCard, ClassroomCard, Performance, PerformanceTimes, ClassroomProgressCard } from '../../../components/performance';
import { ScoreStatistics } from '../../../components/performance/ScoreStatistics';
import { MetricPoolRender, MetricsTime, AdvancedScoreStatistics } from '../../../components/performance/AdvancedMetrics';

// Sample Data
import {
  sampleWorkouts,
  sampleClassrooms,
  sampleMetricData,
  sampleTimeMetrics,
} from '../data/sampleData';

// Types
import type { ShowcaseSectionProps } from '../types/showcaseTypes';

const PerformanceSection: React.FC<ShowcaseSectionProps> = ({ theme, styles }) => {
  // State for Performance Times modal
  const [performanceTimesVisible, setPerformanceTimesVisible] = useState(false);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>🏊 Performance Components</Text>
      
      <Text style={styles.subsectionTitle}>WorkoutCard</Text>
      <View style={{ gap: 8 }}>
        {sampleWorkouts.map((workout) => (
          <WorkoutCard
            key={workout.id}
            id={workout.id}
            title={workout.title}
            user={workout.user}
            phases={workout.phases}
            details={workout.details}
            onActionPress={() => console.log('Workout action pressed:', workout.title)}
            actionButtonText="View Details"
            showActionButton={true}
          />
        ))}
      </View>
      <Text style={styles.cardContent}>
        WorkoutCard component for displaying swimming sessions with instructor details, capacity, and booking functionality
      </Text>

      <Text style={styles.subsectionTitle}>ClassroomCard</Text>
      <View style={{ gap: 8 }}>
        {sampleClassrooms.map((classroom) => (
          <ClassroomCard
            key={classroom.id}
            id={classroom.id}
            title={classroom.title}
            location={classroom.location}
            schedule={classroom.schedule}
            performanceLevels={classroom.performanceLevels}
            metadata={classroom.metadata}
            status={classroom.status}
            onPress={() => console.log('Classroom pressed:', classroom.title)}
          />
        ))}
      </View>
      <Text style={styles.cardContent}>
        ClassroomCard component for displaying pool and training area information with capacity, status, and instructor details
      </Text>

      <Text style={styles.subsectionTitle}>Performance</Text>
      <Performance
        user={{
          id: "student-1",
          name: "Emma Johnson",
          avatar: "https://via.placeholder.com/40"
        }}
        activeTab="Times"
        timesTabs={[
          { id: 'recent', label: 'Recent Times', data: [
            { stroke: 'Freestyle', time: '1:23', improvement: '+5%' },
            { stroke: 'Backstroke', time: '1:45', improvement: '+2%' },
          ]},
          { id: 'personal', label: 'Personal Bests' },
        ]}
        strokeTabs={[
          { id: 'freestyle', label: 'Freestyle' },
          { id: 'backstroke', label: 'Backstroke' },
        ]}
        onTabChange={(tab) => console.log('Tab changed:', tab)}
        onTimesTabChange={(tabId) => console.log('Times tab changed:', tabId)}
        title="Performance Analytics"
      />
      <Text style={styles.cardContent}>
        Performance component with advanced analytics, progress tracking, time comparisons, and goal management
      </Text>

      <Text style={styles.subsectionTitle}>PerformanceTimes</Text>
      <Pressable
        style={[styles.showcaseButton, { backgroundColor: theme.colors.interactive.primary }]}
        onPress={() => setPerformanceTimesVisible(true)}
      >
        <Text style={[styles.showcaseButtonText, { color: theme.colors.text.inverse }]}>
          Open Performance Times Modal
        </Text>
      </Pressable>
      <PerformanceTimes
        visible={performanceTimesVisible}
        eventName="100m Freestyle"
        poolSize="25m"
        distance="100m"
        stroke="Freestyle"
        bestTime={{
          time: "1:23.45",
          date: "2024-03-15",
          location: "Academy Pool",
          isPersonalBest: true,
        }}
        goals={[
          { time: "1:20.00", label: "Season Goal", type: "personal" },
          { time: "1:15.00", label: "Club Record", type: "club" },
        ]}
        comparison={{
          current: "1:23.45",
          goal: "1:20.00",
          difference: "+3.45",
          type: "behind",
        }}
        allTimes={[
          { id: "1", time: "1:23.45", date: "2024-03-15", isPB: true },
          { id: "2", time: "1:25.12", date: "2024-03-01" },
          { id: "3", time: "1:24.89", date: "2024-02-15" },
        ]}
        onClose={() => setPerformanceTimesVisible(false)}
        onTimeSelect={(timeData) => console.log('Time selected:', timeData)}
      />
      <Text style={styles.cardContent}>
        PerformanceTimes component for time tracking with analysis, personal bests, and goal comparisons
      </Text>

      <Text style={styles.subsectionTitle}>ClassroomProgressCard</Text>
      <View style={{ gap: 8 }}>
        <ClassroomProgressCard
          sections={[
            {
              id: 'advanced',
              title: 'Advanced Students',
              rating: 4,
              count: 2,
              students: [
                {
                  id: '1',
                  name: 'Emma Johnson',
                  avatar: 'https://via.placeholder.com/40',
                  rating: 4,
                  status: 'confirmed',
                  additionalInfo: 'Swimming Fundamentals - 85% complete',
                  lastActivity: 'Today',
                },
                {
                  id: '3',
                  name: 'Sarah Davis',
                  avatar: 'https://via.placeholder.com/40',
                  rating: 5,
                  status: 'confirmed',
                  additionalInfo: 'Advanced Stroke Techniques - 92% complete',
                  lastActivity: 'Yesterday',
                },
              ],
              expanded: true,
              color: theme.colors.status.success,
            },
            {
              id: 'intermediate',
              title: 'Intermediate Students',
              rating: 3,
              count: 1,
              students: [
                {
                  id: '2',
                  name: 'Michael Chen',
                  avatar: 'https://via.placeholder.com/40',
                  rating: 3,
                  status: 'pending',
                  additionalInfo: 'Stroke Techniques - 67% complete',
                  lastActivity: '2 days ago',
                },
              ],
              expanded: false,
              color: theme.colors.status.warning,
            },
          ]}
          showConfirmationActions={true}
          showStudentCount={true}
          showStarRatings={true}
          showLastActivity={true}
          onSectionToggle={(sectionId, isExpanded) => console.log('Section toggled:', sectionId, isExpanded)}
          onStudentPress={(student) => console.log('Student pressed:', student.name)}
          onConfirmationAction={(studentId, action) => console.log('Confirmation action:', studentId, action)}
        />
      </View>
      <Text style={styles.cardContent}>
        ClassroomProgressCard component for tracking individual student progress with star ratings, completion status, and lesson details
      </Text>

      <Text style={styles.subsectionTitle}>ScoreStatistics</Text>
      <ScoreStatistics
        title="Weekly Performance"
        subtitle="swimming progress metrics"
        timePeriods={['7 Days', '14 Days', '30 Days']}
        defaultPeriod="7 Days"
        stats={[
          { value: 5, label: 'Training Days' },
          { value: 78, label: 'Improvement', percentage: 78, trend: 'up' },
          { value: 12, label: 'Missed Goals', percentage: 12, trend: 'down' },
        ]}
        chartData={[
          { day: 'Mon', value: 85 },
          { day: 'Tue', value: 45 },
          { day: 'Wed', value: 92 },
          { day: 'Thu', value: 38 },
          { day: 'Fri', value: 78 },
          { day: 'Sat', value: 95 },
          { day: 'Sun', value: 62 },
        ]}
        onPeriodChange={(period) => console.log('Period changed:', period)}
      />
      <Text style={styles.cardContent}>
        ScoreStatistics - Advanced performance analytics with customizable time periods, trend indicators, and interactive bar charts
      </Text>

      <Text style={styles.subsectionTitle}>MetricPoolRender</Text>
      <MetricPoolRender
        courseActionMetrics={sampleMetricData}
        title="Pool Metrics: Academy Pool A"
        showShadow={true}
      />
      <Text style={styles.cardContent}>
        MetricPoolRender - Advanced pool metrics display with skill tracking, count statistics, and SWOLF percentage calculations
      </Text>

      <Text style={styles.subsectionTitle}>MetricsTime</Text>
      <MetricsTime
        courseTimeMetrics={sampleTimeMetrics}
        title="Best Times:"
        showShadow={true}
      />
      <Text style={styles.cardContent}>
        MetricsTime - Time-based performance metrics with improvement percentages and best time tracking
      </Text>

      <Text style={styles.subsectionTitle}>AdvancedScoreStatistics</Text>
      <AdvancedScoreStatistics
        title="Advanced Score Statistics"
        subtitle="comprehensive weekly analytics"
        timePeriods={['7 Days', '14 Days', '30 Days', '90 Days']}
        defaultPeriod="14 Days"
        stats={[
          { value: 6, label: 'Training Days', type: 'days' },
          { value: 85, label: 'Progress', type: 'progress-up' },
          { value: 15, label: 'Missed', type: 'progress-down' },
        ]}
        chartData={[
          { label: 'Mon', value: 90 },
          { label: 'Tue', value: 25 },
          { label: 'Wed', value: 75 },
          { label: 'Thu', value: 10 },
          { label: 'Fri', value: 95 },
          { label: 'Sat', value: 65 },
          { label: 'Sun', value: 30 },
        ]}
        onPeriodChange={(period) => console.log('Advanced period changed:', period)}
      />
      <Text style={styles.cardContent}>
        AdvancedScoreStatistics - Comprehensive analytics with custom period selection, trend analysis, and interactive bar charts with Academy theming
      </Text>
    </View>
  );
};

export default PerformanceSection;