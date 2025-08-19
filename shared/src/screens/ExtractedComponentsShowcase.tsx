import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet, Alert as RNAlert, Pressable, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Theme
import { useTheme, createThemedStyles } from '../theme';

// Our newly extracted components
import { ToggleCard, ControlCard, FilterComponent, OptionMenu, TimesTab, StrokeTab, CustomModalWithDot, Alert as ToastAlert, MenuList, MetricPool, Stations, BottomSheet, BottomSheetProvider, useBottomSheet, useBottomSheetActions, useQuickBottomSheet, LoadingSpinner, NotificationList } from '../components/ui';
import { EmptySearchResult } from '../components/ui/EmptySearchResult';
import { SelectOptions, SelectOption } from '../components/ui/SelectOptions';
import { HeaderComponent } from '../components/ui/HeaderComponent';

// Phase 4: Enhanced UI Components
import { CustomButton } from '../components/forms/CustomButton';
import { Button } from '../components/ui';
import FilterBar from '../components/ui/FilterBar';
import StudentListCard from '../components/ui/StudentListCard';
import Lessons from '../components/ui/Lessons';

// Search System Components
import { SearchInput } from '../components/search/SearchInput';
import { FilterChip } from '../components/search/FilterChip';
import { QuickFilterBar, FilterItem, useQuickFilters } from '../components/search/QuickFilterBar';
import { SearchBar, SimpleSearchBar } from '../components/search/SearchBar';

// Calendar Components
import { Calendar, ClassroomCalendar, StudentProfileCalendar, AcademyCalendar } from '../components/calendar';
import { DatePicker } from '../components/calendar/DatePicker';

// Performance Components
import { WorkoutCard, ClassroomCard, Performance, PerformanceTimes, ClassroomProgressCard } from '../components/performance';
import { ScoreStatistics } from '../components/performance/ScoreStatistics';
import { MetricPoolRender, MetricsTime, AdvancedScoreStatistics } from '../components/performance/AdvancedMetrics';

// Additional Components
import { StudentProfile } from '../components/student';
import { ScheduleInput, ScheduleList, Schedules, ScheduleTypeSelector } from '../components/scheduling';

// Academy-Specific Components
import { ClassroomGrading, MyClassroom, CourseProgression, ProfileInfoSection, NotificationSection, SessionManagementSection, PreferencesSupportSection, StationProgress, GroupedCards, StudentCard } from '../components/academy';

// Auth Components
import { OnboardingModal } from '../components/auth';

// Hooks
import { useDebounce } from '../hooks/useDebounce';
import { useScreenDimensions } from '../hooks/useScreenDimensions';

type ShowcaseSection = 
  | 'overview'
  | 'ui' 
  | 'modals'
  | 'search' 
  | 'calendar' 
  | 'performance' 
  | 'scheduling'
  | 'student'
  | 'academy'
  | 'advanced'
  | 'hooks';

const ExtractedComponentsShowcase: React.FC = () => {
  const { theme } = useTheme();
  const styles = useThemedStyles();
  const screenDimensions = useScreenDimensions();

  // Component states for demo
  const [currentSection, setCurrentSection] = useState<ShowcaseSection>('overview');
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch] = useDebounce(searchValue, 300);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [selectOptionsValue, setSelectOptionsValue] = useState<string[]>([]);
  
  // Search filters demo
  const { selectedFilters, handleFilterChange } = useQuickFilters(['active'], true);
  
  // Phase 4 component states
  const [filterBarSelectedFilters, setFilterBarSelectedFilters] = useState<{ [groupId: string]: string[] }>({});
  
  // Bottom sheet demo states
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [currentBottomSheetDemo, setCurrentBottomSheetDemo] = useState<'simple' | 'snapPoints' | 'scrollable' | 'form'>('simple');
  
  const handleFilterBarChange = (groupId: string, optionId: string, selected: boolean) => {
    setFilterBarSelectedFilters(prev => {
      const currentFilters = prev[groupId] || [];
      if (selected) {
        return { ...prev, [groupId]: [...currentFilters, optionId] };
      } else {
        return { ...prev, [groupId]: currentFilters.filter(id => id !== optionId) };
      }
    });
  };

  // Sample data
  const sampleSelectOptions: SelectOption[] = [
    { id: '1', label: 'Beginner', value: 'beginner' },
    { id: '2', label: 'Intermediate', value: 'intermediate' },
    { id: '3', label: 'Advanced', value: 'advanced' },
    { id: '4', label: 'Expert', value: 'expert' },
  ];

  const sampleFilters: FilterItem[] = [
    { id: '1', label: 'Active', value: 'active', count: 12, icon: 'checkmark-circle' },
    { id: '2', label: 'Pending', value: 'pending', count: 5, icon: 'time' },
    { id: '3', label: 'Completed', value: 'completed', count: 8, icon: 'checkmark' },
    { id: '4', label: 'Cancelled', value: 'cancelled', count: 2, icon: 'close-circle' },
  ];

  const sampleWorkouts = [
    {
      id: '1',
      title: 'Morning Swim Session',
      user: {
        name: 'Sarah Johnson',
        avatar: 'https://via.placeholder.com/40',
      },
      phases: [
        { id: 'warmup', name: 'Warm-up', progress: 100, status: 'completed' as const },
        { id: 'main', name: 'Main Set', progress: 75, status: 'in-progress' as const },
        { id: 'cooldown', name: 'Cool-down', progress: 0, status: 'not-started' as const },
      ],
      details: [
        { label: 'Duration', value: '60 minutes' },
        { label: 'Level', value: 'Intermediate' },
        { label: 'Capacity', value: '6/8 enrolled' },
      ],
    },
    {
      id: '2', 
      title: 'Water Aerobics',
      user: {
        name: 'Mike Chen',
        avatar: 'https://via.placeholder.com/40',
      },
      phases: [
        { id: 'warmup', name: 'Warm-up', progress: 100, status: 'completed' as const },
        { id: 'cardio', name: 'Cardio Phase', progress: 60, status: 'in-progress' as const },
        { id: 'strength', name: 'Strength Training', progress: 30, status: 'in-progress' as const },
        { id: 'cooldown', name: 'Cool-down', progress: 0, status: 'not-started' as const },
      ],
      details: [
        { label: 'Duration', value: '45 minutes' },
        { label: 'Level', value: 'Beginner' },
        { label: 'Capacity', value: '10/12 enrolled' },
      ],
    },
  ];

  const sampleClassrooms = [
    {
      id: '1',
      title: 'Pool A - Main Training',
      location: 'Main Pool Complex',
      schedule: { 
        startTime: '9:00 AM', 
        endTime: '5:00 PM' 
      },
      performanceLevels: [
        { type: 'highest' as const, description: 'Advanced students' },
        { type: 'average' as const, description: 'Intermediate level' },
      ],
      metadata: [
        { label: 'Capacity', value: '12/15', icon: 'people' as const },
        { label: 'Instructor', value: 'Sarah Johnson', icon: 'person' as const },
      ],
      status: 'Active',
    },
    {
      id: '2',
      title: 'Pool B - Kids Area', 
      location: 'Children\'s Pool',
      schedule: { 
        startTime: '10:00 AM', 
        endTime: '4:00 PM' 
      },
      performanceLevels: [
        { type: 'lowest' as const, description: 'Beginner students' },
      ],
      metadata: [
        { label: 'Capacity', value: '0/8', icon: 'people' as const },
        { label: 'Instructor', value: 'Emma Wilson', icon: 'person' as const },
      ],
      status: 'Available',
    },
  ];

  // Phase 4 sample data
  const sampleFilterGroups = [
    {
      id: 'level',
      title: 'Level',
      options: [
        { id: 'beginner', label: 'Beginner', value: 'beginner' },
        { id: 'intermediate', label: 'Intermediate', value: 'intermediate' },
        { id: 'advanced', label: 'Advanced', value: 'advanced' },
      ],
      multiSelect: true,
    },
    {
      id: 'status',
      title: 'Status',
      options: [
        { id: 'active', label: 'Active', value: 'active' },
        { id: 'inactive', label: 'Inactive', value: 'inactive' },
        { id: 'pending', label: 'Pending', value: 'pending' },
      ],
      multiSelect: false,
    },
  ];

  const sampleStudents = [
    {
      id: '1',
      name: 'Emma Johnson',
      level: 'Level 3',
      className: 'Advanced Swimming',
      progress: 85,
      attended: 18,
      absence: 2,
      sessions: 20,
      tags: [
        { id: '1', label: 'Star Student', color: '#00C851', variant: 'success' as const },
        { id: '2', label: 'Fully Paid', color: '#4F2EC9', variant: 'info' as const },
      ],
    },
    {
      id: '2',
      name: 'Michael Chen',
      level: 'Level 2',
      className: 'Intermediate',
      progress: 67,
      attended: 12,
      absence: 3,
      sessions: 15,
      tags: [
        { id: '3', label: 'Needs Attention', color: '#FF851B', variant: 'warning' as const },
        { id: '4', label: 'Payment Due', color: '#FF4444', variant: 'error' as const },
      ],
    },
  ];

  const sampleLessons = [
    {
      id: '1',
      title: 'Swimming Fundamentals',
      className: 'Beginner Class A',
      completion: 75,
      totalActivities: 12,
      completedActivities: 9,
      overallRating: '4.2/5',
      stations: [
        {
          id: 'st1',
          name: 'Station 1',
          title: 'Water Safety',
          activities: [
            {
              id: 'act1',
              title: 'Float Practice',
              description: 'Learn basic floating techniques',
              stars: 4,
              maxStars: 5,
              rating: '4.5/5',
              completed: true,
            },
            {
              id: 'act2',
              title: 'Breathing Exercises',
              description: 'Master rhythmic breathing',
              stars: 3,
              maxStars: 5,
              rating: '3.8/5',
              completed: false,
            },
          ],
        },
        {
          id: 'st2',
          name: 'Station 2',
          title: 'Stroke Basics',
          activities: [
            {
              id: 'act3',
              title: 'Freestyle Introduction',
              description: 'Basic technique fundamentals',
              stars: 5,
              maxStars: 5,
              rating: '4.9/5',
              completed: true,
            },
          ],
        },
      ],
    },
  ];

  // Sample data for TimesTab
  const sampleTimeTabs = [
    { id: '1', label: 'Week', value: 'week', active: true },
    { id: '2', label: 'Month', value: 'month', active: false },
    { id: '3', label: 'Year', value: 'year', active: false },
  ];

  // Sample data for StrokeTab
  const sampleStrokes = [
    { id: '1', label: 'Freestyle', value: 'freestyle', time: '1:23', active: true },
    { id: '2', label: 'Backstroke', value: 'backstroke', time: '1:45', active: false },
    { id: '3', label: 'Breaststroke', value: 'breaststroke', time: '1:56', active: false },
  ];

  // Sample data for OptionMenu
  const sampleMenuOptions = [
    { id: '1', label: 'Swimming Lessons', value: 'swimming', icon: 'water', onPress: () => console.log('Swimming selected') },
    { id: '2', label: 'Basketball Classes', value: 'basketball', icon: 'basketball', onPress: () => console.log('Basketball selected') },
    { id: '3', label: 'Football Training', value: 'football', icon: 'football', onPress: () => console.log('Football selected') },
    { id: '4', label: 'Music Lessons', value: 'music', icon: 'musical-notes', onPress: () => console.log('Music selected') },
    { id: '5', label: 'Coding Classes', value: 'coding', icon: 'code', onPress: () => console.log('Coding selected') },
  ];

  // Sample data for new Phase 5 components
  const [onboardingModalVisible, setOnboardingModalVisible] = useState(false);
  
  const sampleNotifications = [
    {
      id: '1',
      title: 'Reminder!',
      message: 'Sarah Johnson has progressed to Swimming Club: Level 2 Class 2 with Tutor Mike Chen on 15/08/24.',
      timestamp: '2 hrs ago',
      isRead: false,
      type: 'reminder' as const,
    },
    {
      id: '2',
      title: 'Class Update',
      message: 'New lesson scheduled for tomorrow at 10:00 AM in Studio A.',
      timestamp: 'Yesterday',
      isRead: false,
      type: 'update' as const,
    },
    {
      id: '3',
      title: 'Payment Received',
      message: 'Payment of $120 has been processed for Tom Wilson\'s program lessons.',
      timestamp: '2 days ago',
      isRead: true,
      type: 'info' as const,
    },
  ];

  const sampleStudentInfo = {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'https://via.placeholder.com/50',
    level: 'Level 2',
    className: 'Class 3',
    progress: 75,
    attendance: {
      attended: 8,
      absence: 2,
      sessions: 10,
    },
    paymentStatus: 'fully-paid' as const,
    studentType: 'regular' as const,
    tags: ['School'],
  };

  const sampleGroupedSections = [
    {
      id: 'ungrouped',
      title: 'Ungrouped',
      count: 5,
      items: [
        {
          id: '1',
          name: 'Alex Rodriguez',
          currentLevel: 'L2S2 - Introduction to Butterfly',
          starRating: 4,
          status: 'active' as const,
        },
        {
          id: '2', 
          name: 'Maya Patel',
          currentLevel: 'L1S3 - Freestyle Basics',
          starRating: 3,
          status: 'active' as const,
        },
      ],
      initialExpanded: true,
    },
    {
      id: 'advanced',
      title: '5 stars',
      count: 3,
      items: [
        {
          id: '3',
          name: 'Jake Thompson',
          currentLevel: 'L3S1 - Advanced Techniques',
          starRating: 5,
          status: 'active' as const,
        },
      ],
      initialExpanded: false,
    },
  ];

  const sampleMetricData = [
    [
      {
        id: '1',
        skill: 'Freestyle: 25m',
        count: 45,
        swolf: 85,
      },
      {
        id: '2',
        skill: 'Backstroke: 25m', 
        count: 32,
        swolf: 92,
      },
    ]
  ];

  const sampleTimeMetrics = [
    [
      {
        id: '1',
        skill: 'Freestyle: 50m',
        time: '1:23.45',
        improvement: 12,
      },
      {
        id: '2',
        skill: 'Butterfly: 25m',
        time: '0:45.67',
        improvement: -5,
      },
    ]
  ];

  const renderNavigation = () => (
    <View style={styles.navigation}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.navScrollContent}
      >
        {(['overview', 'ui', 'modals', 'search', 'calendar', 'performance', 'scheduling', 'student', 'academy', 'advanced', 'hooks'] as const).map((section) => (
          <FilterChip
            key={section}
            label={section.charAt(0).toUpperCase() + section.slice(1)}
            value={section}
            selected={currentSection === section}
            onPress={(value) => setCurrentSection(value as ShowcaseSection)}
            variant="primary"
            size="md"
          />
        ))}
      </ScrollView>
    </View>
  );

  const renderOverview = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>📦 Extracted Components Overview</Text>
      <Text style={styles.sectionDescription}>
        83+ components and utilities extracted from Academy Apps existing code, 
        modernized with Academy theming and React 19 compatibility.
      </Text>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>30</Text>
          <Text style={styles.statLabel}>Enhanced UI Components</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>10</Text>
          <Text style={styles.statLabel}>Form Components</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>4</Text>
          <Text style={styles.statLabel}>Search System</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>9</Text>
          <Text style={styles.statLabel}>Performance & Analytics</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>8</Text>
          <Text style={styles.statLabel}>Academy Management</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>22+</Text>
          <Text style={styles.statLabel}>Supporting Components</Text>
        </View>
      </View>

      <Text style={styles.subsectionTitle}>✅ Phase 5 Features</Text>
      <View style={styles.featureList}>
        <Text style={styles.featureItem}>• 83+ Production-ready components</Text>
        <Text style={styles.featureItem}>• Advanced notification management</Text>
        <Text style={styles.featureItem}>• Comprehensive metrics & analytics</Text>
        <Text style={styles.featureItem}>• Student grouping & classroom management</Text>
        <Text style={styles.featureItem}>• Enhanced onboarding flows</Text>
        <Text style={styles.featureItem}>• Zero TypeScript errors across all components</Text>
        <Text style={styles.featureItem}>• Academy Design System integration</Text>
        <Text style={styles.featureItem}>• Complete responsive mobile/tablet support</Text>
      </View>

      <Text style={styles.deviceInfo}>
        Current Device: {screenDimensions.isTablet ? 'Tablet' : 'Phone'} 
        ({screenDimensions.width}x{screenDimensions.height})
      </Text>
    </View>
  );

  const renderUIComponents = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>🎨 UI Components Library</Text>
      <Text style={styles.sectionDescription}>
        Comprehensive collection of 18+ UI components with Academy theming and modern React patterns
      </Text>

      {/* Phase 1: Core Components Section */}
      <View style={styles.componentSection}>
        <Text style={[styles.subsectionTitle, { color: theme.colors.interactive.primary, fontSize: 18 }]}>
          📋 Phase 1: Core UI Components
        </Text>
        
        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>ToggleCard</Text>
          <ToggleCard
            title="Swimming Session Details"
            count={5}
            initialExpanded={false}
            onToggle={(expanded) => console.log('Toggle:', expanded)}
          />
          <Text style={styles.componentDescription}>
            Expandable interface with count badge and smooth animations
          </Text>
        </View>

        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>SelectOptions</Text>
          <SelectOptions
            title="Swimming Level"
            options={sampleSelectOptions}
            value={selectOptionsValue}
            onSelectionChange={(selected) => {
              setSelectOptionsValue(Array.isArray(selected) ? selected : [selected]);
            }}
            multiSelect={true}
          />
          <Text style={styles.componentDescription}>
            Dropdown menu with multi-select support and Academy theming
          </Text>
        </View>

        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>HeaderComponent</Text>
          <HeaderComponent title="Academy Pool" />
          <Text style={styles.componentDescription}>
            Navigation header with Academy branding and responsive layout
          </Text>
        </View>

        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>EmptySearchResult</Text>
          <EmptySearchResult
            title="No Results Found"
            description="Try adjusting your search criteria or filters"
            iconName="search"
          />
          <Text style={styles.componentDescription}>
            User-friendly empty states with customizable icons and messages
          </Text>
        </View>

        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>TimesTab</Text>
          <TimesTab
            tabs={sampleTimeTabs}
            activeTab="week"
            onTabChange={(tab) => console.log('Time tab changed:', tab)}
          />
          <Text style={styles.componentDescription}>
            Time period tab selector for performance tracking and analytics
          </Text>
        </View>

        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>StrokeTab</Text>
          <StrokeTab
            tabs={sampleStrokes}
            activeTab="freestyle"
            onTabChange={(stroke) => console.log('Stroke changed:', stroke)}
            showPerformanceTimes={true}
          />
          <Text style={styles.componentDescription}>
            Swimming stroke selector with performance metrics and timing data
          </Text>
        </View>

        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>OptionMenu</Text>
          <OptionMenu
            options={sampleMenuOptions}
          />
          <Text style={styles.componentDescription}>
            Dropdown option menu with icons and custom styling
          </Text>
        </View>
      </View>

      {/* Phase 2: Enhanced UI Components */}
      <View style={styles.componentSection}>
        <Text style={[styles.subsectionTitle, { color: theme.colors.interactive.primary, fontSize: 18 }]}>
          🔧 Phase 2: Enhanced UI Components
        </Text>
        
        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>Alert (Toast Notifications)</Text>
          <ToastAlert
            type="success"
            message="Profile updated successfully!"
            visible={true}
            onDismiss={() => {}}
            position="top"
            dismissible={true}
          />
          <Text style={styles.componentDescription}>
            Modern toast notification system with animations and Academy theming
          </Text>
        </View>

        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>MenuList (Navigation Grid)</Text>
          <MenuList
            items={[
              {
                id: '1',
                title: 'Our Courses',
                icon: 'school',
                onPress: () => console.log('Courses'),
              },
              {
                id: '2',
                title: 'Achievements',
                icon: 'trophy',
                onPress: () => console.log('Achievements'),
                badge: '5',
              },
            ]}
            columns={2}
            variant="card"
          />
          <Text style={styles.componentDescription}>
            Configurable grid layout for navigation items with badges and icons
          </Text>
        </View>

        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>MetricPool (Statistical Cards)</Text>
          <View style={{ flexDirection: 'row', gap: 16, justifyContent: 'center' }}>
            <MetricPool
              poolName="Sessions"
              poolNumber="24"
              poolRate="+12%"
              icon="time"
              variant="default"
            />
            <MetricPool
              poolName="Progress"
              poolNumber="87"
              poolRate="+5%"
              suffix="%"
              icon="trending-up"
              variant="detailed"
            />
          </View>
          <Text style={styles.componentDescription}>
            Statistical display cards with trend indicators and formatting
          </Text>
        </View>

        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>Stations (Rating & Progress Cards)</Text>
          <Stations
            title="Swimming Progress"
            rating="4.8"
            starRating={4}
            heading="Freestyle Mastery"
            subtitle="Advanced Level"
            icons={[
              { name: 'checkmark-circle', color: theme.colors.status.success },
              { name: 'trending-up', color: theme.colors.status.warning },
              { name: 'star', color: theme.colors.status.warning },
            ]}
            variant="default"
          />
          <Text style={styles.componentDescription}>
            Rating and progress cards with customizable icons and star ratings
          </Text>
        </View>
      </View>

      {/* Phase 4: Enhanced UI Components */}
      <View style={styles.componentSection}>
        <Text style={[styles.subsectionTitle, { color: theme.colors.interactive.primary, fontSize: 18 }]}>
          🚀 Phase 4: Enhanced UI Components
        </Text>
        
        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>Button (Enhanced Component)</Text>
          <View style={{ gap: 12 }}>
            <View>
              <Text style={[styles.componentDescription, { marginBottom: 8 }]}>9 Variants with Academy theming:</Text>
              <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                <Button title="Primary" variant="primary" size="sm" onPress={() => console.log('Primary')} />
                <Button title="Secondary" variant="secondary" size="sm" onPress={() => console.log('Secondary')} />
                <Button title="Outline" variant="outline" size="sm" onPress={() => console.log('Outline')} />
                <Button title="Ghost" variant="ghost" size="sm" onPress={() => console.log('Ghost')} />
              </View>
              <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                <Button title="Academy" variant="academy" size="sm" onPress={() => console.log('Academy')} />
                <Button title="Danger" variant="danger" size="sm" onPress={() => console.log('Danger')} />
                <Button title="Success" variant="success" size="sm" onPress={() => console.log('Success')} />
                <Button title="Warning" variant="warning" size="sm" onPress={() => console.log('Warning')} />
                <Button title="Info" variant="info" size="sm" onPress={() => console.log('Info')} />
              </View>
            </View>
            
            <View>
              <Text style={[styles.componentDescription, { marginBottom: 8 }]}>With icons and loading states:</Text>
              <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                <Button title="Save" variant="academy" size="md" startIcon="save" onPress={() => console.log('Save')} />
                <Button title="Download" variant="primary" size="md" endIcon="download" onPress={() => console.log('Download')} />
                <Button title="Loading" variant="secondary" size="md" loading={true} loadingText="Saving..." />
              </View>
            </View>
            
            <View>
              <Text style={[styles.componentDescription, { marginBottom: 8 }]}>5 different sizes:</Text>
              <View style={{ alignItems: 'flex-start', gap: 8 }}>
                <Button title="Extra Small" variant="academy" size="xs" onPress={() => console.log('XS')} />
                <Button title="Small" variant="academy" size="sm" onPress={() => console.log('SM')} />
                <Button title="Medium" variant="academy" size="md" onPress={() => console.log('MD')} />
                <Button title="Large" variant="academy" size="lg" onPress={() => console.log('LG')} />
                <Button title="Extra Large" variant="academy" size="xl" onPress={() => console.log('XL')} />
              </View>
            </View>
          </View>
          <Text style={styles.componentDescription}>
            Enhanced button component with 9 variants, 5 sizes, icon support, loading states, and complete Academy theming
          </Text>
        </View>
        
        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>FilterBar (Advanced Filtering)</Text>
          <FilterBar
            filters={sampleFilterGroups}
            selectedFilters={filterBarSelectedFilters}
            onFilterChange={handleFilterBarChange}
            variant="horizontal"
            showClearAll={true}
            title="Filter Students"
          />
          <Text style={styles.componentDescription}>
            Advanced FilterBar with multi-group filtering, modal support, horizontal/vertical layouts, and clear all functionality
          </Text>
        </View>

        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>StudentListCard (Student Display)</Text>
          <StudentListCard
            students={sampleStudents}
            onStudentPress={(student) => console.log('Student pressed:', student.name)}
            variant="detailed"
            showProgress={true}
            showStatistics={true}
            showTags={true}
          />
          <Text style={styles.componentDescription}>
            Generalized student display with progress bars, statistics, tag system, and multiple variants
          </Text>
        </View>

        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>Lessons (Lesson Management)</Text>
          <Lessons
            lessons={sampleLessons}
            onLessonPress={(lesson) => console.log('Lesson pressed:', lesson.title)}
            onActivityPress={(lessonId, stationId, activityId) => 
              console.log('Activity pressed:', { lessonId, stationId, activityId })
            }
            showStations={true}
            defaultExpanded={false}
            variant="default"
          />
          <Text style={styles.componentDescription}>
            Comprehensive lesson management with station-based organization, activity tracking, expandable cards, and progress monitoring
          </Text>
        </View>

        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>LoadingSpinner (Modern Loading States)</Text>
          <View style={{ gap: 16 }}>
            <View>
              <Text style={[styles.componentDescription, { marginBottom: 8 }]}>4 Spinner Variants:</Text>
              <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
                <LoadingSpinner variant="spinner" size="medium" color={theme.colors.interactive.primary} />
                <LoadingSpinner variant="dots" size="medium" color={theme.colors.interactive.primary} />
                <LoadingSpinner variant="pulse" size="medium" color={theme.colors.interactive.primary} />
                <LoadingSpinner variant="bars" size="medium" color={theme.colors.interactive.primary} />
              </View>
            </View>
            
            <View>
              <Text style={[styles.componentDescription, { marginBottom: 8 }]}>Different Sizes:</Text>
              <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <LoadingSpinner variant="spinner" size="small" color={theme.colors.interactive.primary} />
                <LoadingSpinner variant="spinner" size="medium" color={theme.colors.interactive.primary} />
                <LoadingSpinner variant="spinner" size="large" color={theme.colors.interactive.primary} />
              </View>
            </View>
            
            <View>
              <Text style={[styles.componentDescription, { marginBottom: 8 }]}>With Text Messages:</Text>
              <View style={{ gap: 12 }}>
                <LoadingSpinner 
                  variant="dots" 
                  size="medium" 
                  color={theme.colors.interactive.primary}
                  message="Loading students..." 
                />
                <LoadingSpinner 
                  variant="pulse" 
                  size="medium" 
                  color={theme.colors.status.success}
                  message="Processing data..." 
                />
                <LoadingSpinner 
                  variant="bars" 
                  size="large" 
                  color={theme.colors.status.warning}
                  message="Saving changes..." 
                />
              </View>
            </View>
          </View>
          <Text style={styles.componentDescription}>
            Modern loading spinner component with 4 variants, multiple sizes, overlay support, and Academy theming
          </Text>
        </View>

        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>NotificationList (Notification Management)</Text>
          <View style={{ gap: 16 }}>
            <View>
              <Text style={[styles.componentDescription, { marginBottom: 8 }]}>Interactive Notification List:</Text>
              <View style={{ height: 300, borderWidth: 1, borderColor: theme.colors.border.primary, borderRadius: 8 }}>
                <NotificationList
                  notifications={sampleNotifications}
                  onMarkAsRead={(id) => console.log('Mark as read:', id)}
                  onMarkAsUnread={(id) => console.log('Mark as unread:', id)}
                  title="Academy Notifications"
                  showBackButton={false}
                />
              </View>
            </View>
          </View>
          <Text style={styles.componentDescription}>
            Complete notification management system with read/unread states, timestamps, type-based icons, and Academy theming
          </Text>
        </View>
      </View>
    </View>
  );

  const renderModalsComponents = () => (
    <BottomSheetProvider maxConcurrent={2}>
      <ModalsContent />
    </BottomSheetProvider>
  );

  const ModalsContent = () => {
    const { show, hide, hideAll } = useBottomSheetActions();
    const { showConfirm, showMenu, showContent } = useQuickBottomSheet();

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔧 Modal & Bottom Sheet Components</Text>
        <Text style={styles.sectionDescription}>
          Comprehensive modal system with bottom sheets, snap points, and provider-based management
        </Text>

        {/* Basic Bottom Sheet */}
        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>Basic Bottom Sheet</Text>
          <View style={{ gap: 12 }}>
            <CustomButton 
              title="Show Simple Bottom Sheet"
              onPress={() => {
                show({
                  id: 'simple-demo',
                  content: (
                    <View style={{ padding: 20 }}>
                      <Text style={[styles.componentTitle, { marginBottom: 12 }]}>Welcome to Bottom Sheet!</Text>
                      <Text style={styles.componentDescription}>
                        This is a simple bottom sheet with basic content. It can be closed by tapping the backdrop or using the close button.
                      </Text>
                    </View>
                  ),
                  title: "Simple Demo",
                  snapPoints: ['small'],
                });
              }}
            />
          </View>
          <Text style={styles.componentDescription}>
            Simple bottom sheet with backdrop close and basic content
          </Text>
        </View>

        {/* Snap Points Demo */}
        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>Snap Points Bottom Sheet</Text>
          <CustomButton 
            title="Show Snap Points Demo"
            onPress={() => {
              show({
                id: 'snap-points-demo',
                content: (
                  <View style={{ padding: 20 }}>
                    <Text style={[styles.componentTitle, { marginBottom: 12 }]}>Multi-Height Bottom Sheet</Text>
                    <Text style={styles.componentDescription}>
                      This bottom sheet supports multiple snap points. Try dragging the handle up and down to see different height states:
                    </Text>
                    <Text style={[styles.componentDescription, { marginTop: 12 }]}>
                      • Small: 25% of screen{'\n'}
                      • Medium: 50% of screen{'\n'}
                      • Large: 75% of screen
                    </Text>
                    <View style={{ height: 200, backgroundColor: theme.colors.background.secondary, borderRadius: 8, marginTop: 16, justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={styles.componentDescription}>Scroll content area</Text>
                    </View>
                  </View>
                ),
                title: "Snap Points Demo",
                snapPoints: ['small', 'medium', 'large'],
                initialSnapPoint: 'medium',
              });
            }}
          />
          <Text style={styles.componentDescription}>
            Bottom sheet with multiple snap points (small, medium, large)
          </Text>
        </View>

        {/* Scrollable Content */}
        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>Scrollable Bottom Sheet</Text>
          <CustomButton 
            title="Show Scrollable Content"
            onPress={() => {
              show({
                id: 'scrollable-demo',
                content: (
                  <View>
                    {Array.from({ length: 20 }, (_, i) => (
                      <View key={i} style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.border.secondary }}>
                        <Text style={styles.componentTitle}>Swimming Lesson {i + 1}</Text>
                        <Text style={styles.componentDescription}>
                          Learn freestyle techniques with professional instructors. Session includes warm-up, technique practice, and cool-down exercises.
                        </Text>
                      </View>
                    ))}
                  </View>
                ),
                title: "Swimming Lessons",
                snapPoints: ['medium', 'large'],
                scrollable: true,
              });
            }}
          />
          <Text style={styles.componentDescription}>
            Bottom sheet with scrollable content for long lists
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>Quick Bottom Sheet Actions</Text>
          <View style={{ gap: 8 }}>
            <CustomButton 
              title="Show Confirmation"
              onPress={() => {
                showConfirm(
                  'Delete Session',
                  <Text>Are you sure you want to delete this swimming session? This action cannot be undone.</Text>,
                  () => console.log('Confirmed delete'),
                  () => console.log('Cancelled delete')
                );
              }}
            />
            
            <CustomButton 
              title="Show Menu"
              onPress={() => {
                showMenu(
                  'Session Actions',
                  [
                    { label: 'Edit Session', onPress: () => console.log('Edit pressed'), icon: '✏️' },
                    { label: 'Duplicate', onPress: () => console.log('Duplicate pressed'), icon: '📋' },
                    { label: 'Share', onPress: () => console.log('Share pressed'), icon: '📤' },
                    { label: 'Delete', onPress: () => console.log('Delete pressed'), icon: '🗑️' },
                  ]
                );
              }}
            />
            
            <CustomButton 
              title="Show Custom Content"
              onPress={() => {
                showContent(
                  <View style={{ padding: 20 }}>
                    <Text style={[styles.componentTitle, { marginBottom: 16 }]}>Student Progress</Text>
                    <View style={{ gap: 12 }}>
                      {['Freestyle', 'Backstroke', 'Breaststroke', 'Butterfly'].map((stroke) => (
                        <View key={stroke} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text style={styles.componentDescription}>{stroke}</Text>
                          <View style={{ width: 100, height: 8, backgroundColor: theme.colors.background.secondary, borderRadius: 4 }}>
                            <View style={{ 
                              width: `${Math.floor(Math.random() * 100)}%`, 
                              height: '100%', 
                              backgroundColor: theme.colors.interactive.primary, 
                              borderRadius: 4 
                            }} />
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>,
                  { snapPoints: ['medium'], title: 'Progress Report' }
                );
              }}
            />
          </View>
          <Text style={styles.componentDescription}>
            Pre-built bottom sheet patterns: confirmations, menus, and custom content
          </Text>
        </View>

        {/* Provider Management */}
        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>Provider Management</Text>
          <View style={{ gap: 8 }}>
            <CustomButton 
              title="Show Multiple Sheets"
              onPress={() => {
                show({
                  id: 'first-sheet',
                  content: (
                    <View style={{ padding: 20 }}>
                      <Text style={[styles.componentTitle, { marginBottom: 12 }]}>First Sheet</Text>
                      <Text style={styles.componentDescription}>This is the first bottom sheet.</Text>
                      <CustomButton 
                        title="Open Second Sheet"
                        style={{ marginTop: 16 }}
                        onPress={() => {
                          show({
                            id: 'second-sheet',
                            content: (
                              <View style={{ padding: 20 }}>
                                <Text style={[styles.componentTitle, { marginBottom: 12 }]}>Second Sheet</Text>
                                <Text style={styles.componentDescription}>This is the second sheet, opened on top!</Text>
                              </View>
                            ),
                            title: "Second Sheet",
                            snapPoints: ['small'],
                          });
                        }}
                      />
                    </View>
                  ),
                  title: "First Sheet",
                  snapPoints: ['medium'],
                });
              }}
            />
            
            <CustomButton 
              title="Hide All Sheets"
              onPress={hideAll}
              variant="outline"
            />
          </View>
          <Text style={styles.componentDescription}>
            Global provider supports multiple concurrent bottom sheets with z-index management
          </Text>
        </View>

        {/* Legacy Comparison */}
        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>Legacy vs New Implementation</Text>
          <View style={{ gap: 8 }}>
            <BottomSheet
              visible={isBottomSheetVisible}
              onClose={() => setIsBottomSheetVisible(false)}
              title="Direct Bottom Sheet"
              snapPoints={['small', 'medium']}
            >
              <View style={{ padding: 20 }}>
                <Text style={[styles.componentTitle, { marginBottom: 12 }]}>Direct Usage</Text>
                <Text style={styles.componentDescription}>
                  This bottom sheet is used directly without the provider, similar to CustomModalWithDot but with enhanced features.
                </Text>
              </View>
            </BottomSheet>
            
            <CustomButton 
              title="Show Direct Bottom Sheet"
              onPress={() => setIsBottomSheetVisible(true)}
            />
            
            <CustomModalWithDot
              visible={false}
              onClose={() => {}}
            >
              <View />
            </CustomModalWithDot>
          </View>
          <Text style={styles.componentDescription}>
            Comparison between legacy CustomModalWithDot and new enhanced BottomSheet component
          </Text>
        </View>

        {/* OnboardingModal Demo */}
        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>OnboardingModal (User Authentication)</Text>
          <View style={{ gap: 12 }}>
            <Button 
              title="Show Onboarding Modal"
              onPress={() => setOnboardingModalVisible(true)}
              variant="academy"
            />
            
            <OnboardingModal
              visible={onboardingModalVisible}
              onClose={() => setOnboardingModalVisible(false)}
              onLogin={() => {
                setOnboardingModalVisible(false);
                console.log('Navigate to login');
              }}
              onSignup={() => {
                setOnboardingModalVisible(false);
                console.log('Navigate to signup');
              }}
              title="Welcome to Academy"
              subtitle="Choose how you'd like to get started with your swimming journey"
              showSocialAuth={true}
              socialAuthConfig={{
                enableGoogle: true,
                enableApple: true,
                enableFacebook: true,
              }}
            />
          </View>
          <Text style={styles.componentDescription}>
            Complete onboarding modal with social authentication, customizable content, and Academy theming for user registration flows
          </Text>
        </View>
      </View>
    );
  };

  const renderSearchComponents = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>🔍 Search System</Text>
      
      <Text style={styles.subsectionTitle}>SearchInput</Text>
      <SearchInput
        value={searchValue}
        onChangeText={setSearchValue}
        placeholder="Search students, instructors..."
        showClearButton={true}
      />
      <Text style={styles.demoText}>
        Debounced value: "{debouncedSearch}"
      </Text>

      <Text style={styles.subsectionTitle}>FilterChip</Text>
      <View style={styles.chipContainer}>
        <FilterChip
          label="Active Sessions"
          value="active"
          selected={true}
          count={12}
          icon="checkmark-circle"
          onPress={() => {}}
        />
        <FilterChip
          label="Pending"
          value="pending"
          selected={false}
          count={5}
          icon="time"
          onPress={() => {}}
        />
      </View>

      <Text style={styles.subsectionTitle}>QuickFilterBar</Text>
      <QuickFilterBar
        filters={sampleFilters}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        multiSelect={true}
        showCount={true}
      />

      <Text style={styles.subsectionTitle}>Complete SearchBar</Text>
      <SearchBar
        searchProps={{
          value: searchValue,
          onChangeText: setSearchValue,
          placeholder: "Search Academy...",
        }}
        filterProps={{
          filters: sampleFilters,
          selectedFilters: selectedFilters,
          onFilterChange: handleFilterChange,
          multiSelect: true,
        }}
        title="Academy Search"
        subtitle="Find students, instructors, and sessions"
        actions={[
          {
            label: "Done",
            onPress: () => RNAlert.alert('Done', 'Search completed'),
            variant: 'primary',
          },
        ]}
      />

      <Text style={styles.subsectionTitle}>SimpleSearchBar</Text>
      <SimpleSearchBar
        value={searchValue}
        onChangeText={setSearchValue}
        placeholder="Quick search..."
        onDonePress={() => RNAlert.alert('Done', 'Quick search done')}
      />
    </View>
  );

  const renderCalendarComponents = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>📅 Calendar System</Text>
      
      <Text style={styles.subsectionTitle}>Calendar</Text>
      <Calendar
        selectedDate={selectedDate ? selectedDate.toISOString().split('T')[0] : undefined}
        onDateSelect={(dateString) => setSelectedDate(new Date(dateString))}
        events={[
          {
            id: '1',
            date: new Date().toISOString().split('T')[0],
            title: 'Swimming Lesson',
            type: 'event',
          },
          {
            id: '2', 
            date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            title: 'Pool Maintenance',
            type: 'deadline',
          },
        ]}
        minDate={new Date().toISOString().split('T')[0]}
        maxDate={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
      />

      <Text style={styles.subsectionTitle}>DatePicker</Text>
      <DatePicker
        value={selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
        onDateChange={(date) => setSelectedDate(new Date(date))}
      />
      <Text style={styles.cardContent}>
        DatePicker component with Academy theming for session scheduling and event creation
      </Text>

      <Text style={styles.subsectionTitle}>ClassroomCalendar</Text>
      <ClassroomCalendar
        events={[
          {
            id: '1',
            date: new Date().getDate(),
            type: 'class',
          },
          {
            id: '2',
            date: new Date(Date.now() + 24 * 60 * 60 * 1000).getDate(),
            type: 'attendance',
          },
        ]}
      />
      <Text style={styles.cardContent}>
        ClassroomCalendar - Advanced calendar for pool scheduling, session management, and instructor assignments
      </Text>

      <Text style={styles.subsectionTitle}>StudentProfileCalendar</Text>
      <StudentProfileCalendar
        selectedDate={selectedDate}
        onDateSelect={(date) => setSelectedDate(date)}
        events={[
          {
            id: '1',
            date: new Date().getDate(),
            type: 'lesson',
            title: 'Swimming Practice',
          },
          {
            id: '2',
            date: new Date(Date.now() + 24 * 60 * 60 * 1000).getDate(),
            type: 'assignment',
            title: 'Advanced Techniques',
          },
        ]}
      />
      <Text style={styles.cardContent}>
        StudentProfileCalendar - Student-specific calendar with session tracking, progress monitoring, and achievement history
      </Text>

      <Text style={styles.subsectionTitle}>AcademyCalendar (New Consolidated)</Text>
      <AcademyCalendar
        variant="default"
        selectedDate={selectedDate}
        onDateSelect={(date) => setSelectedDate(date)}
        events={[
          {
            id: '1',
            date: 5,
            type: 'class',
            title: 'Swimming Lesson',
            color: 'purple'
          },
          {
            id: '2',
            date: 12,
            type: 'assignment',
            title: 'Pool Test',
            color: 'blue'
          },
          {
            id: '3',
            date: 18,
            type: 'exam',
            title: 'Level Assessment',
            color: 'red'
          },
          {
            id: '4',
            date: 25,
            type: 'holiday',
            title: 'Pool Closed',
            color: 'green'
          }
        ]}
        showNavigation={true}
        enableDateSelection={true}
      />
      <Text style={styles.cardContent}>
        AcademyCalendar - New consolidated calendar component that replaces both ClassroomCalendar and StudentProfileCalendar. Features full Sunday-first week layout, navigation controls, date selection, and comprehensive event highlighting.
      </Text>
    </View>
  );

  const renderPerformanceComponents = () => (
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
      <PerformanceTimes
        visible={true}
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
        onClose={() => console.log('PerformanceTimes closed')}
        onTimeSelect={(timeData) => console.log('Time selected:', timeData)}
      />
      <Text style={styles.cardContent}>
        PerformanceTimes component for swimming time tracking with stroke analysis, personal bests, and goal comparisons
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
              color: '#4CAF50',
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
              color: '#FF9800',
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

  const renderSchedulingComponents = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>📋 Scheduling Components</Text>
      
      <Text style={styles.subsectionTitle}>ScheduleInput</Text>
      <ScheduleInput
        date={new Date()}
        startTime={new Date(new Date().setHours(9, 0, 0, 0))}
        endTime={new Date(new Date().setHours(10, 0, 0, 0))}
      />
      <Text style={styles.cardContent}>
        ScheduleInput - Input component for creating and editing swimming session schedules
      </Text>

      <Text style={styles.subsectionTitle}>ScheduleList</Text>
      <ScheduleList
        columns={[
          {
            dateLabel: 'Today',
            schedules: [
              {
                id: '1',
                title: 'Morning Swimming',
                time: '09:00-10:00',
                sessionType: 'Group Training',
                bookingType: 'Regular',
                status: 'scheduled',
                participantCount: 6,
              },
              {
                id: '2',
                title: 'Afternoon Training',
                time: '14:00-15:30',
                sessionType: 'Advanced',
                bookingType: 'Premium',
                status: 'scheduled',
                participantCount: 10,
              },
            ],
          },
          {
            dateLabel: 'Tomorrow',
            schedules: [
              {
                id: '3',
                title: 'Evening Session',
                time: '18:00-19:00',
                sessionType: 'Beginner',
                bookingType: 'Regular',
                status: 'scheduled',
                participantCount: 4,
              },
            ],
          },
        ]}
        onSchedulePress={(schedule) => console.log('Schedule pressed:', schedule)}
        onParticipantsPress={(schedule) => console.log('Participants pressed:', schedule)}
        onStatusPress={(schedule, status) => console.log('Status changed:', schedule, status)}
      />
      <Text style={styles.cardContent}>
        ScheduleList - List component for displaying multiple schedule items with sorting and filtering
      </Text>

      <Text style={styles.subsectionTitle}>Schedules</Text>
      <Schedules
        scheduleData={[
          {
            dateLabel: 'This Week',
            schedules: [
              {
                id: '1',
                title: 'Weekly Swimming Program',
                time: '09:00-10:00',
                sessionType: 'Regular • Group • All Levels',
                bookingType: '8/12 Booked',
                recurrence: 'Mon, Wed, Fri',
                status: 'scheduled',
                participantCount: 8,
              },
              {
                id: '2',
                title: 'Advanced Training',
                time: '14:00-15:30',
                sessionType: 'Advanced • Group • Competitive',
                bookingType: '6/8 Booked',
                recurrence: 'Tue, Thu',
                status: 'scheduled',
                participantCount: 6,
              },
            ],
          },
        ]}
        onSchedulePress={(schedule) => console.log('Schedule pressed:', schedule)}
        onAddSchedule={() => console.log('Add new schedule')}
        onParticipantsPress={(schedule) => console.log('Participants pressed:', schedule)}
      />
      <Text style={styles.cardContent}>
        Schedules - Comprehensive schedule management component with CRUD operations
      </Text>

      <Text style={styles.subsectionTitle}>ScheduleTypeSelector</Text>
      <ScheduleTypeSelector
        onSelectionChange={(selections) => console.log('Schedule selections changed:', selections)}
        initialSelections={{
          sessionType: 'Group',
          skillLevel: 'Intermediate',
          scheduleType: 'Recurring',
        }}
        sessionOptions={['Group', 'Private', 'Semi-Private']}
        skillOptions={['Beginner', 'Intermediate', 'Advanced', 'Swim Team', 'Masters']}
        scheduleOptions={['One Time', 'Recurring', 'Package Deal']}
        variant="default"
      />
      <Text style={styles.cardContent}>
        ScheduleTypeSelector - Multi-dropdown component for comprehensive schedule configuration with session type, skill level, and schedule pattern selection
      </Text>
    </View>
  );

  const renderStudentComponents = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>👥 Student Components</Text>
      
      <Text style={styles.subsectionTitle}>StudentProfile</Text>
      <StudentProfile
        student={{
          id: '1',
          firstName: 'Emma',
          lastName: 'Johnson',
          level: 'Level 3',
          currentClass: 'Advanced Swimming',
          achievements: [
            { id: '1', title: 'Freestyle Master', date: new Date().toISOString().split('T')[0], iconType: 'ten' },
            { id: '2', title: 'Perfect Attendance', date: new Date().toISOString().split('T')[0], iconType: 'twenty' },
          ],
          overallRating: { current: 4.5, total: 5 },
          progressSummary: { currentTerm: 'Term 2', improvedLessons: 8, earnedStars: 12, newAchievements: 3, watermanshipPoints: 85 },
          timeline: [],
          attendance: { present: 18, remaining: 2, totalSessions: 20 },
        }}
        visible={true}
        onClose={() => {}}
      />
      <Text style={styles.cardContent}>
        StudentProfile - Comprehensive student profile component with academic and swimming progress
      </Text>

      <Text style={styles.subsectionTitle}>StudentCard</Text>
      <View style={{ gap: 12 }}>
        <StudentCard
          student={sampleStudentInfo}
          onPress={(student) => console.log('Student card pressed:', student.name)}
          variant="default"
          showProgress={true}
          showAttendance={true}
          showPaymentStatus={true}
          showTags={true}
        />
        
        <StudentCard
          student={{
            ...sampleStudentInfo,
            id: '2',
            name: 'Alex Thompson',
            progress: 45,
            paymentStatus: 'partial-paid',
            attendance: { attended: 6, absence: 4, sessions: 10 },
            tags: ['Private Sessions'],
          }}
          onPress={(student) => console.log('Student card pressed:', student.name)}
          variant="compact"
        />
        
        <StudentCard
          student={{
            ...sampleStudentInfo,
            id: '3',
            name: 'Maya Rodriguez',
            progress: 92,
            paymentStatus: 'overdue',
            attendance: { attended: 12, absence: 1, sessions: 13 },
            tags: ['Competition Team', 'Advanced'],
          }}
          onPress={(student) => console.log('Student card pressed:', student.name)}
          variant="detailed"
        />
      </View>
      <Text style={styles.cardContent}>
        StudentCard - Unified student display component with progress tracking, attendance statistics, payment status, and customizable variants (extracted from NurserySchool/PreSchool components)
      </Text>
    </View>
  );

  const renderAcademyComponents = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>🎓 Academy Components</Text>
      <Text style={styles.cardContent}>
        Phase 3: Core Academy functionality components for educational management
      </Text>
      
      <Text style={styles.subsectionTitle}>ClassroomGrading</Text>
      <ClassroomGrading
        lesson={{
          id: '1',
          title: 'Swimming Fundamentals',
          description: 'Basic swimming techniques and water safety',
          maxStars: 5,
        }}
        students={[
          {
            id: '1',
            name: 'Emma Johnson',
            stars: 4,
            groupId: 'group1',
            groupName: 'Advanced Group',
            progress: 85,
            level: 'Advanced',
          },
          {
            id: '2',
            name: 'Michael Chen',
            stars: 3,
            groupId: 'group2',
            groupName: 'Intermediate Group',
            progress: 78,
            level: 'Intermediate',
          },
        ]}
        groups={[
          { id: 'group1', name: 'Advanced Group', studentCount: 8, color: '#4F2EC9' },
          { id: 'group2', name: 'Intermediate Group', studentCount: 12, color: '#00C851' },
          { id: 'group3', name: 'Beginner Group', studentCount: 15, color: '#FF851B' },
        ]}
        onStudentGradeChange={(studentId, stars) => 
          console.log('Grade student:', { studentId, stars })
        }
        onGroupAssignmentChange={(studentId, groupId) => 
          console.log('Group assignment:', { studentId, groupId })
        }
        onSearch={(query) => console.log('Search:', query)}
      />
      <Text style={styles.cardContent}>
        ClassroomGrading - Comprehensive grading system with star ratings, student filtering, lesson tracking, and group management
      </Text>

      <Text style={styles.subsectionTitle}>MyClassroom</Text>
      <MyClassroom
        schoolName="Academy Swimming Center"
        location="Pool A - Advanced Training"
        groups={[
          { id: 'group1', name: 'Advanced Group', studentCount: 8, color: '#4F2EC9', isActive: true },
          { id: 'group2', name: 'Intermediate Group', studentCount: 12, color: '#00C851', isActive: false },
          { id: 'group3', name: 'Beginner Group', studentCount: 15, color: '#FF851B', isActive: false },
        ]}
        lessons={[
          {
            id: '1',
            level: 'Advanced',
            title: 'Water Safety & Rescue',
            className: 'Advanced Swimming',
            currentSection: 'Safety Techniques',
            sections: [
              {
                id: 'sec1',
                title: 'Basic Water Safety',
                description: 'Fundamental safety techniques in water',
                warmUp: ['Float practice', 'Treading water'],
                mainSet: [
                  {
                    id: 'act1',
                    title: 'Emergency Float',
                    description: 'Practice emergency floating techniques',
                    starDistribution: { 5: 3, 4: 5, 3: 2, 2: 1, 1: 0 },
                  },
                ],
              },
            ],
            icon: 'shield-checkmark',
          },
          {
            id: '2',
            level: 'Advanced',
            title: 'Stroke Refinement',
            className: 'Advanced Swimming',
            currentSection: 'Technique Focus',
            sections: [
              {
                id: 'sec2',
                title: 'Freestyle Mastery',
                description: 'Advanced freestyle stroke techniques',
                warmUp: ['Arm circles', 'Kick practice'],
                mainSet: [
                  {
                    id: 'act2',
                    title: 'Stroke Efficiency',
                    description: 'Focus on stroke efficiency and timing',
                    starDistribution: { 5: 2, 4: 6, 3: 3, 2: 0, 1: 0 },
                  },
                ],
              },
            ],
            icon: 'fitness',
          },
        ]}
        stats={{
          totalStudents: 35,
          myStudents: 15,
          instructors: 3,
          totalLessons: 24,
          zeroStars: 0,
          oneStars: 1,
          twoStars: 3,
        }}
        onGroupChange={(groupId) => console.log('Group changed:', groupId)}
        onGradingModalOpen={() => console.log('Grading modal opened')}
        onLessonToggle={(lessonId, expanded) => console.log('Lesson toggle:', { lessonId, expanded })}
        defaultExpandedLesson="1"
      />
      <Text style={styles.cardContent}>
        MyClassroom - Complete classroom management interface with lesson sections, activity tracking, progress statistics, and expandable content
      </Text>

      <Text style={styles.subsectionTitle}>CourseProgression</Text>
      <CourseProgression
        progression={{
          id: 'course1',
          title: 'Swimming Mastery Course',
          description: 'Complete swimming program from beginner to advanced',
          levels: [
            {
              id: 'level1',
              name: 'beginner',
              title: 'Beginner - Water Confidence',
              isUnlocked: true,
              classes: [
                {
                  id: 'class1',
                  title: 'Water Safety Basics',
                  description: 'Learn fundamental water safety',
                  lessonsCount: 8,
                  completedLessons: 8,
                  achievedStars: 32,
                  totalStars: 40,
                  percentageCompleted: 100,
                  isUnlocked: true,
                  level: 'beginner',
                  sections: [
                    {
                      id: 'sec1',
                      name: 'safety',
                      title: 'Water Safety',
                      isUnlocked: true,
                      lessons: [
                        {
                          id: 'lesson1',
                          title: 'Pool Entry & Exit',
                          description: 'Safe pool entry and exit techniques',
                          achievableStars: 5,
                          achievedStars: 4,
                          isCompleted: true,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: 'level2',
              name: 'intermediate',
              title: 'Intermediate - Stroke Development',
              isUnlocked: true,
              classes: [
                {
                  id: 'class2',
                  title: 'Basic Strokes',
                  description: 'Master fundamental swimming strokes',
                  lessonsCount: 12,
                  completedLessons: 8,
                  achievedStars: 35,
                  totalStars: 60,
                  percentageCompleted: 67,
                  isUnlocked: true,
                  level: 'intermediate',
                  sections: [
                    {
                      id: 'sec2',
                      name: 'strokes',
                      title: 'Stroke Techniques',
                      isUnlocked: true,
                      lessons: [
                        {
                          id: 'lesson2',
                          title: 'Freestyle Basics',
                          description: 'Learn basic freestyle technique',
                          achievableStars: 5,
                          achievedStars: 4,
                          isCompleted: true,
                        },
                        {
                          id: 'lesson3',
                          title: 'Backstroke Introduction',
                          description: 'Introduction to backstroke swimming',
                          achievableStars: 5,
                          achievedStars: 3,
                          isCompleted: false,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: 'level3',
              name: 'advanced',
              title: 'Advanced - Technique Mastery',
              isUnlocked: false,
              classes: [],
            },
          ],
        }}
        currentLevel="intermediate"
        onLessonPress={(lessonId, classId, sectionId) => 
          console.log('Lesson pressed:', { lessonId, classId, sectionId })
        }
        onClassPress={(classId) => console.log('Class pressed:', classId)}
        showEmptyStates={true}
        compactMode={false}
      />
      <Text style={styles.cardContent}>
        CourseProgression - Student progress tracking across multiple levels with unlockable content, star achievements, and detailed lesson visualization
      </Text>

      <Text style={styles.subsectionTitle}>ProfileSettings Components</Text>
      <ProfileInfoSection
        items={[
          { label: 'Personal Information', onPress: () => console.log('Personal Info') },
          { label: 'Emergency Contacts', onPress: () => console.log('Emergency Contacts') },
          { label: 'Account Security', onPress: () => console.log('Account Security') },
        ]}
      />
      <NotificationSection
        notificationsEnabled={true}
        appNotificationsEnabled={false}
        onNotificationToggle={(enabled) => console.log('Notifications:', enabled)}
        onAppNotificationToggle={(enabled) => console.log('App notifications:', enabled)}
      />
      <SessionManagementSection />
      <PreferencesSupportSection />
      <Text style={styles.cardContent}>
        ProfileSettings - Complete profile management system with sections for personal info, notifications, session management, and support
      </Text>

      <Text style={styles.subsectionTitle}>StationProgress</Text>
      <StationProgress
        station={{
          id: 'station1',
          name: 'Freestyle Fundamentals',
          lessons: [
            { id: '1', description: 'Floating and breathing techniques', achievableStars: 3, achievedStars: 3, status: 'completed' },
            { id: '2', description: 'Basic freestyle arm movement', achievableStars: 3, achievedStars: 2, status: 'in_progress' },
            { id: '3', description: 'Kick coordination and timing', achievableStars: 2, achievedStars: 0, status: 'not_started' },
            { id: '4', description: 'Advanced freestyle techniques', achievableStars: 3, achievedStars: 0, status: 'locked' },
          ]
        }}
        showStatusIcons={true}
        maxHeight={200}
      />
      <Text style={styles.cardContent}>
        StationProgress - Individual lesson progress tracking with star ratings and status indicators for swimming stations
      </Text>

      <Text style={[styles.subsectionTitle, { marginTop: 24, color: theme.colors.interactive.primary }]}>
        🏆 Academy Integration Features
      </Text>
      <Text style={styles.cardContent}>
        • Multi-level progression tracking with unlock mechanics{'\n'}
        • Comprehensive grading system with star ratings{'\n'}
        • Classroom management with lesson sectioning{'\n'}
        • Group management and student filtering{'\n'}
        • Academy-themed UI with consistent branding{'\n'}
        • Mobile and tablet responsive design{'\n'}
        • Complete TypeScript interfaces for data modeling
      </Text>
    </View>
  );

  const renderAdvancedComponents = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>🚀 Advanced Components</Text>
      
      <Text style={styles.subsectionTitle}>Advanced Calendar Components</Text>
      <Text style={styles.cardContent}>
        Specialized calendar implementations for different user contexts:
      </Text>
      
      <View style={styles.componentGroup}>
        <Text style={styles.componentTitle}>ClassroomCalendar (Pool Scheduling)</Text>
        <ClassroomCalendar
          events={[
            {
              id: '1',
              date: new Date().getDate(),
              type: 'class',
              color: 'purple'
            },
            {
              id: '2', 
              date: new Date().getDate() + 1,
              type: 'exam',
              color: 'red'
            }
          ]}
          currentMonth={new Date()}
          onMonthChange={(month) => console.log('Month changed:', month)}
          showHeader={true}
        />
        <Text style={styles.componentDescription}>
          Full calendar implementation with pool scheduling, class management, and instructor assignments
        </Text>
      </View>

      <View style={styles.componentGroup}>
        <Text style={styles.componentTitle}>StudentProfileCalendar (Student Progress)</Text>
        <StudentProfileCalendar
          events={[
            {
              id: '1',
              date: new Date().getDate(),
              type: 'lesson',
              title: 'Swimming Lesson',
              color: 'purple'
            },
            {
              id: '2',
              date: new Date().getDate() + 2,
              type: 'test',
              title: 'Skills Assessment',
              color: 'red'
            },
            {
              id: '3',
              date: new Date().getDate() + 5,
              type: 'assignment',
              title: 'Practice Session',
              color: 'green'
            }
          ]}
          currentMonth={new Date()}
          onMonthChange={(month) => console.log('Month changed:', month)}
          onDateSelect={(date) => console.log('Date selected:', date)}
          showHeader={true}
          showNavigation={true}
        />
        <Text style={styles.componentDescription}>
          Student-specific calendar with session tracking, progress monitoring, and achievement history
        </Text>
      </View>

      <Text style={styles.subsectionTitle}>Advanced Performance Analytics</Text>
      <Text style={styles.cardContent}>
        Complex performance tracking with detailed metrics:
      </Text>
      
      <View style={styles.componentGroup}>
        <Text style={styles.componentTitle}>MetricPoolRender (Advanced Pool Analytics)</Text>
        <MetricPoolRender
          courseActionMetrics={[
            [
              { id: '1', skill: 'Freestyle', count: 85, improvement: 5.2 },
              { id: '2', skill: 'Backstroke', count: 92, improvement: 8.1 },
              { id: '3', skill: 'Breaststroke', count: 78, improvement: -2.3 },
            ],
            [
              { id: '4', skill: 'Butterfly', count: 95, improvement: 12.5 },
              { id: '5', skill: 'Diving', count: 87, improvement: 3.8 },
            ]
          ]}
          title="Pool Performance Metrics"
          showShadow={true}
        />
        <Text style={styles.componentDescription}>
          Advanced pool analytics with period selection, progress tracking, and interactive bar charts
        </Text>
      </View>

      <View style={styles.componentGroup}>
        <Text style={styles.componentTitle}>MetricsTime (Time-Based Analytics)</Text>
        <MetricsTime
          courseTimeMetrics={[
            [
              { id: '1', skill: 'Lap Time', time: '1:23.45', improvement: 2.1 },
              { id: '2', skill: 'Split Time', time: '0:41.23', improvement: -0.8 },
            ],
            [
              { id: '3', skill: 'Recovery Time', time: '2:15.67', improvement: 5.3 },
            ]
          ]}
          title="Time-Based Metrics"
          showShadow={true}
        />
        <Text style={styles.componentDescription}>
          Time-based analytics with trend indicators, goal tracking, and comparative analysis
        </Text>
      </View>

      <View style={styles.componentGroup}>
        <Text style={styles.componentTitle}>AdvancedScoreStatistics (Statistical Analysis)</Text>
        <AdvancedScoreStatistics
          title="Advanced Statistics"
          subtitle="Performance Analytics"
          timePeriods={['Week', 'Month', 'Quarter', 'Year']}
          defaultPeriod="Month"
          stats={[
            { value: 87.5, label: 'Average Score', type: 'neutral' },
            { value: 95, label: 'Best Score', type: 'progress-up' },
            { value: 92, label: 'Recent Score', type: 'progress-up' },
            { value: 8.3, label: 'Improvement', type: 'progress-up' },
            { value: 85, label: 'Consistency', type: 'neutral' },
            { value: 78, label: 'Goal Progress', type: 'progress-down' }
          ]}
          chartData={[
            { label: 'Jan', value: 78 },
            { label: 'Feb', value: 82 },
            { label: 'Mar', value: 87 },
            { label: 'Apr', value: 85 },
          ]}
          onPeriodChange={(period) => console.log('Period changed:', period)}
        />
        <Text style={styles.componentDescription}>
          Comprehensive statistical analysis with performance indicators and goal tracking
        </Text>
      </View>

      <View style={styles.componentGroup}>
        <Text style={styles.componentTitle}>ClassroomProgressCard (Student Progress)</Text>
        <ClassroomProgressCard
          sections={[
            {
              id: '1',
              title: 'Intermediate Level',
              rating: 4,
              count: 8,
              expanded: true,
              students: [
                {
                  id: 'student-1',
                  name: 'Alex Johnson',
                  avatar: 'https://via.placeholder.com/40',
                  rating: 4,
                  status: 'confirmed',
                  additionalInfo: 'Session 8/12',
                  lastActivity: '2 hours ago',
                  achievements: ['Freestyle Technique', 'Breathing Control']
                },
                {
                  id: 'student-2',
                  name: 'Sarah Wilson',
                  avatar: 'https://via.placeholder.com/40',
                  rating: 5,
                  status: 'pending',
                  additionalInfo: 'Session 10/12',
                  lastActivity: '1 hour ago',
                  achievements: ['Advanced Techniques']
                }
              ]
            }
          ]}
          onSectionToggle={(sectionId, isExpanded) => console.log('Section toggled:', sectionId, isExpanded)}
          onStudentPress={(student) => console.log('Student pressed:', student.name)}
          onConfirmationAction={(studentId, action) => console.log('Confirmation action:', studentId, action)}
          showConfirmationActions={true}
          showStudentCount={true}
          showStarRatings={true}
          showLastActivity={true}
        />
        <Text style={styles.componentDescription}>
          Individual student progress tracking with star ratings, completion status, and lesson details
        </Text>
      </View>

      <Text style={styles.subsectionTitle}>Complex UI Control Patterns</Text>
      <Text style={styles.cardContent}>Advanced UI patterns for professional applications:</Text>
      
      <Text style={styles.subsectionTitle}>ControlCard (Management Interface)</Text>
      <ControlCard
        schoolName="Academy Management Center"
        groupName="Advanced control panel for complex data management"
        onFilterAction={() => console.log('Filter action triggered')}
        searchComponent={
          <SearchInput
            value={searchValue}
            onChangeText={setSearchValue}
            placeholder="Search within control panel..."
            showClearButton={true}
          />
        }
        filterComponent={
          <FilterComponent
            groupName="Status Filter"
            allNames="All Statuses"
            setActiveSearch={() => {}}
          />
        }
      />
      <Text style={styles.cardContent}>
        ControlCard - Complex control panel with integrated search and filtering capabilities for data management
      </Text>

      <Text style={styles.subsectionTitle}>Advanced Modal Patterns</Text>
      <CustomModalWithDot
        visible={false}
        onClose={() => {}}
        showCloseDot={true}
      >
        <View style={{ padding: 20 }}>
          <Text style={{ color: theme.colors.text.primary, fontSize: 18, fontWeight: '600', marginBottom: 8 }}>
            Advanced Modal
          </Text>
          <Text style={{ color: theme.colors.text.secondary }}>
            Bottom sheet modal with indicator dot for advanced UI interactions
          </Text>
        </View>
      </CustomModalWithDot>
      <Text style={styles.cardContent}>
        CustomModalWithDot - Bottom sheet modal with indicator dot for advanced user interactions and content presentation
      </Text>

      <Text style={styles.subsectionTitle}>GroupedCards (Classroom Management)</Text>
      <GroupedCards
        sections={sampleGroupedSections}
        onItemMove={(itemId, fromSection, toSection) => console.log('Item moved:', itemId, 'from:', fromSection, 'to:', toSection)}
        onSectionToggle={(sectionId, isExpanded) => console.log('Section toggled:', sectionId, isExpanded)}
        showMoveAction={true}
        cardVariant="default"
      />
      <Text style={styles.cardContent}>
        GroupedCards - Expandable student grouping system with star ratings, move functionality, and collapsible sections for classroom organization
      </Text>
    </View>
  );

  const renderHooksDemo = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>🪝 Enhanced Hooks</Text>
      
      <Text style={styles.subsectionTitle}>useDebounce</Text>
      <View style={styles.hookDemo}>
        <Text style={styles.hookDescription}>
          Debounced search input (300ms delay)
        </Text>
        <SearchInput
          value={searchValue}
          onChangeText={setSearchValue}
          placeholder="Type to see debounce effect..."
        />
        <Text style={styles.demoText}>Original: "{searchValue}"</Text>
        <Text style={styles.demoText}>Debounced: "{debouncedSearch}"</Text>
      </View>

      <Text style={styles.subsectionTitle}>useScreenDimensions</Text>
      <View style={styles.hookDemo}>
        <Text style={styles.hookDescription}>
          Responsive screen dimension detection
        </Text>
        <View style={styles.dimensionInfo}>
          <Text style={styles.demoText}>Width: {screenDimensions.width}px</Text>
          <Text style={styles.demoText}>Height: {screenDimensions.height}px</Text>
          <Text style={styles.demoText}>Device: {screenDimensions.isTablet ? 'Tablet' : 'Phone'}</Text>
          <Text style={styles.demoText}>Landscape: {screenDimensions.isLandscape ? 'Yes' : 'No'}</Text>
        </View>
      </View>

      <Text style={styles.subsectionTitle}>Component Count</Text>
      <View style={styles.hookDemo}>
        <Text style={styles.hookDescription}>
          All extracted components are working without TypeScript errors
        </Text>
        <Text style={styles.successText}>✅ 83+ Components Production Ready</Text>
      </View>
    </View>
  );

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'overview':
        return renderOverview();
      case 'ui':
        return renderUIComponents();
      case 'modals':
        return renderModalsComponents();
      case 'search':
        return renderSearchComponents();
      case 'calendar':
        return renderCalendarComponents();
      case 'performance':
        return renderPerformanceComponents();
      case 'scheduling':
        return renderSchedulingComponents();
      case 'student':
        return renderStudentComponents();
      case 'academy':
        return renderAcademyComponents();
      case 'advanced':
        return renderAdvancedComponents();
      case 'hooks':
        return renderHooksDemo();
      default:
        return renderOverview();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🚀 Extracted Components</Text>
        <Text style={styles.subtitle}>Academy Apps Shared Library</Text>
      </View>

      {renderNavigation()}

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderCurrentSection()}
      </ScrollView>
    </SafeAreaView>
  );
};

const useThemedStyles = createThemedStyles((theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },

    header: {
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
      backgroundColor: theme.colors.background.elevated,
    },

    title: {
      ...theme.typography.heading.h2,
      color: theme.colors.text.primary,
      textAlign: 'center',
    },

    subtitle: {
      ...theme.typography.body.base,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      marginTop: theme.spacing[1],
    },

    navigation: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
      backgroundColor: theme.colors.background.secondary,
    },

    navScrollContent: {
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[2],
      gap: theme.spacing[2],
    },


    content: {
      flex: 1,
    },

    contentContainer: {
      padding: theme.spacing[4],
    },

    section: {
      marginBottom: theme.spacing[6],
    },

    sectionTitle: {
      ...theme.typography.heading.h3,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[3],
    },

    sectionDescription: {
      ...theme.typography.body.base,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing[4],
      lineHeight: 24,
    },

    subsectionTitle: {
      ...theme.typography.heading.h5,
      color: theme.colors.text.primary,
      marginTop: theme.spacing[4],
      marginBottom: theme.spacing[2],
    },

    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing[2],
      marginBottom: theme.spacing[4],
    },

    statCard: {
      flex: 1,
      minWidth: 100,
      backgroundColor: theme.colors.background.elevated,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[3],
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },

    statNumber: {
      ...theme.typography.heading.h2,
      color: theme.colors.interactive.primary,
      fontWeight: theme.fontConfig.fontWeight.bold,
    },

    statLabel: {
      ...theme.typography.caption.base,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      marginTop: theme.spacing[1],
    },

    featureList: {
      backgroundColor: theme.colors.background.elevated,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[3],
      marginBottom: theme.spacing[4],
    },

    featureItem: {
      ...theme.typography.body.sm,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[1],
      lineHeight: 20,
    },

    deviceInfo: {
      ...theme.typography.caption.base,
      color: theme.colors.text.tertiary,
      textAlign: 'center',
      fontStyle: 'italic',
    },

    cardContent: {
      ...theme.typography.body.base,
      color: theme.colors.text.secondary,
      lineHeight: 22,
    },

    demoText: {
      ...theme.typography.caption.base,
      color: theme.colors.text.secondary,
      marginTop: theme.spacing[2],
      fontFamily: 'monospace',
    },

    chipContainer: {
      flexDirection: 'row',
      gap: theme.spacing[2],
      marginBottom: theme.spacing[3],
    },

    hookDemo: {
      backgroundColor: theme.colors.background.elevated,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[3],
      marginBottom: theme.spacing[3],
    },

    hookDescription: {
      ...theme.typography.body.sm,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing[2],
    },

    dimensionInfo: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing[3],
    },

    successText: {
      ...theme.typography.body.base,
      color: theme.colors.status.success,
      fontWeight: theme.fontConfig.fontWeight.semibold,
      textAlign: 'center',
    },

    // New component organization styles
    componentSection: {
      marginBottom: theme.spacing[6],
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[4],
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },

    componentGroup: {
      marginBottom: theme.spacing[5],
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing[3],
      borderWidth: 1,
      borderColor: theme.colors.border.secondary,
    },

    componentTitle: {
      ...theme.typography.heading.h6,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[2],
      fontWeight: theme.fontConfig.fontWeight.semibold,
    },

    componentDescription: {
      ...theme.typography.body.sm,
      color: theme.colors.text.secondary,
      marginTop: theme.spacing[2],
      lineHeight: 20,
      fontStyle: 'italic',
    },
  })
);

export default ExtractedComponentsShowcase;