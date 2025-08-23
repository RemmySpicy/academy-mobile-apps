import React, { useState } from 'react';
import { View, Text } from 'react-native';

// Calendar Components
import { ClassroomCalendar, StudentProfileCalendar } from '../../../components/calendar';

// Performance Components
import { ClassroomProgressCard } from '../../../components/performance';
import { MetricPoolRender, MetricsTime, AdvancedScoreStatistics } from '../../../components/performance/AdvancedMetrics';

// Program Management Components
import {
  ProgramContextProvider,
  ProgramGuard,
  ProgramHeader,
  ProgramSelector,
  useProgramContext,
} from '../../../components/program';

// UI Components
import { ControlCard } from '../../../components/ui';
import { GroupedCards } from '../../../components/academy';

// Theme
import { useTheme } from '../../../theme';

// Sample Data
import { sampleGroupedSections } from '../data/sampleData';

// Types
import { ShowcaseSectionProps } from '../types/showcaseTypes';

const AdvancedSection: React.FC<ShowcaseSectionProps> = ({ theme, styles }) => {
  // State for demo
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [controlCardSearchValue, setControlCardSearchValue] = useState('');

  return (
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
      
      <Text style={styles.subsectionTitle}>ControlCard - Enhanced Management Interface</Text>
      <Text style={styles.cardContent}>Comprehensive control card with multiple layouts, sizes, and variants:</Text>
      
      {/* Default ControlCard with Calendar */}
      <View style={styles.componentGroup}>
        <Text style={styles.componentTitle}>Default Layout with Calendar</Text>
        <ControlCard
          title="Swimming Academy - Downtown"
          subtitle="Year 2 Program"
          description="Advanced swimming techniques and competitive training"
          dateSchedule="December 18 - 22"
          dateSchedule2="This Week"
          dateRangeType="week"
          markedDates={['2024-12-20', '2024-12-22']}
          onDateSelect={(date) => console.log('Selected date:', date)}
          viewAll={() => console.log('View all dates')}
          moreInfo={true}
          onMoreInfo={() => console.log('More info pressed')}
        />
      </View>

      {/* Compact Variant with Filters */}
      <View style={styles.componentGroup}>
        <Text style={styles.componentTitle}>Compact with Query Filters</Text>
        <ControlCard
          size="compact"
          variant="outlined"
          title="Quick Stats"
          queryFilter={[
            { id: '1', label: 'Active', num: '24', icon: 'checkmark-circle', color: theme.colors.status.success },
            { id: '2', label: 'Pending', num: '8', icon: 'time', color: theme.colors.status.warning },
            { id: '3', label: 'Completed', num: '156', icon: 'trophy', color: theme.colors.interactive.primary, isActive: true }
          ]}
          onQueryFilterPress={(item) => console.log('Query filter pressed:', item)}
        />
      </View>

      {/* Search Enabled Variant */}
      <View style={styles.componentGroup}>
        <Text style={styles.componentTitle}>With Search and Quick Filters</Text>
        <ControlCard
          layout="detailed"
          title="Student Management"
          subtitle="Manage and track student progress"
          searchEnabled={true}
          searchPlaceholder="Search students..."
          searchValue={controlCardSearchValue}
          onSearchChange={setControlCardSearchValue}
          activeSearch={controlCardSearchValue.length > 0}
          quickFilter={[
            { id: '1', label: 'Beginners', count: '12', icon: 'star-outline' },
            { id: '2', label: 'Intermediate', count: '18', icon: 'star-half', isActive: true },
            { id: '3', label: 'Advanced', count: '8', icon: 'star', color: theme.colors.status.success }
          ]}
          filterName="Skill Level"
          onQuickFilterPress={(item) => console.log('Quick filter pressed:', item)}
        />
      </View>

      {/* Dashboard Layout with Actions */}
      <View style={styles.componentGroup}>
        <Text style={styles.componentTitle}>Dashboard Layout with Actions</Text>
        <ControlCard
          layout="dashboard"
          variant="elevated"
          title="Session Overview"
          description="Manage today's swimming sessions and track attendance"
          actions={[
            { id: '1', label: 'New Session', onPress: () => console.log('New session'), icon: 'add', variant: 'primary' },
            { id: '2', label: 'Export', onPress: () => console.log('Export'), icon: 'download-outline', variant: 'outline' }
          ]}
          queryFilter={[
            { id: '1', label: 'Today', num: '6', isActive: true },
            { id: '2', label: 'This Week', num: '42' },
            { id: '3', label: 'This Month', num: '186' }
          ]}
          dateRangeType="none"
        />
      </View>

      {/* Monthly Calendar Variant */}
      <View style={styles.componentGroup}>
        <Text style={styles.componentTitle}>Monthly Calendar View</Text>
        <ControlCard
          title="December Schedule"
          dateRangeType="month"
          selectedDate={selectedDate?.toISOString().split('T')[0]}
          markedDates={['2024-12-05', '2024-12-12', '2024-12-19', '2024-12-26']}
          onDateSelect={(date) => {
            setSelectedDate(new Date(date));
            console.log('Selected date:', date);
          }}
          showWeekdays={false}
          size="expanded"
        />
      </View>

      {/* Minimal Layout */}
      <View style={styles.componentGroup}>
        <Text style={styles.componentTitle}>Minimal Layout</Text>
        <ControlCard
          layout="minimal"
          variant="ghost"
          title="Quick Access"
          actions={[
            { id: '1', label: 'Check In', onPress: () => console.log('Check in'), icon: 'log-in', variant: 'primary' },
            { id: '2', label: 'Reports', onPress: () => console.log('Reports'), icon: 'document-text', variant: 'secondary' }
          ]}
        />
      </View>

      {/* Loading State */}
      <View style={styles.componentGroup}>
        <Text style={styles.componentTitle}>Loading State</Text>
        <ControlCard
          loading={true}
          loadingText="Loading session data..."
        />
      </View>

      {/* Error State */}
      <View style={styles.componentGroup}>
        <Text style={styles.componentTitle}>Error State</Text>
        <ControlCard
          error="Failed to load session data. Please check your connection."
          onRetry={() => console.log('Retry pressed')}
        />
      </View>

      {/* Custom Components */}
      <View style={styles.componentGroup}>
        <Text style={styles.componentTitle}>With Custom Components</Text>
        <ControlCard
          title="Custom Integration"
          headerComponent={
            <View style={{ backgroundColor: theme.colors.interactive.primary, padding: 8, borderRadius: 4, marginBottom: 12 }}>
              <Text style={{ color: theme.colors.text.inverse, textAlign: 'center', fontSize: 12 }}>🏆 Premium Account</Text>
            </View>
          }
          footerComponent={
            <View style={{ marginTop: 16, padding: 12, backgroundColor: theme.colors.background.primary, borderRadius: 8 }}>
              <Text style={{ fontSize: 12, color: theme.colors.text.secondary, textAlign: 'center' }}>
                Last updated: {new Date().toLocaleTimeString()}
              </Text>
            </View>
          }
          dateRangeType="none"
        />
      </View>

      <Text style={styles.cardContent}>
        ControlCard now supports multiple layouts (default, minimal, detailed, dashboard), sizes (compact, normal, expanded), 
        variants (elevated, outlined, filled, ghost), comprehensive date handling, search functionality, filtering, 
        custom actions, loading/error states, and extensive customization options.
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

      <Text style={styles.subsectionTitle}>Program Management System</Text>
      <Text style={styles.cardContent}>
        Multi-program academy management with context switching, role-based access control, and program-specific headers:
      </Text>
      
      <View style={styles.componentGroup}>
        <Text style={styles.componentTitle}>ProgramSelector - Program Switching</Text>
        <Text style={styles.cardContent}>
          Button variant for compact program selection:
        </Text>
        <ProgramSelector 
          variant="button"
          onProgramChange={(program) => console.log('Program changed:', program.name)}
          showRefresh={true}
        />
        
        <Text style={styles.cardContent}>
          Card variant for detailed program display:
        </Text>
        <ProgramSelector 
          variant="card"
          onProgramChange={(program) => console.log('Program changed:', program.name)}
          showRefresh={true}
          style={{ marginTop: 12 }}
        />
        
        <Text style={styles.cardContent}>
          Dropdown variant for form integration:
        </Text>
        <ProgramSelector 
          variant="dropdown"
          onProgramChange={(program) => console.log('Program changed:', program.name)}
          showRefresh={false}
          style={{ marginTop: 12 }}
        />
        
        <Text style={styles.componentDescription}>
          Interactive program selector with modal interface, switching functionality, and multiple display variants
        </Text>
      </View>

      <View style={styles.componentGroup}>
        <Text style={styles.componentTitle}>ProgramHeader - Program-Specific Headers</Text>
        <ProgramHeader 
          showDescription={true}
          textAlign="left"
        />
        
        <Text style={styles.cardContent}>
          Centered alignment:
        </Text>
        <ProgramHeader 
          showDescription={true}
          textAlign="center"
          style={{ marginTop: 12 }}
        />
        
        <Text style={styles.cardContent}>
          Header only (no description):
        </Text>
        <ProgramHeader 
          showDescription={false}
          textAlign="right"
          style={{ marginTop: 12 }}
        />
        
        <Text style={styles.componentDescription}>
          Dynamic program headers that display current program name and description with flexible alignment options
        </Text>
      </View>

      <View style={styles.componentGroup}>
        <Text style={styles.componentTitle}>ProgramGuard - Role-Based Access Control</Text>
        
        <Text style={styles.cardContent}>
          Content accessible to instructors:
        </Text>
        <ProgramGuard 
          requiredRole="instructor"
          errorMessage="This feature is only available to instructors"
          showRefresh={true}
        >
          <View style={[{
            backgroundColor: theme.colors.status.success + '20',
            padding: theme.spacing.md,
            borderRadius: theme.borderRadius.md,
            borderWidth: 1,
            borderColor: theme.colors.status.success,
          }]}>
            <Text style={[{
              color: theme.colors.status.success,
              fontWeight: '600',
            }]}>
              ✅ Instructor Access Granted
            </Text>
            <Text style={[{
              color: theme.colors.text.secondary,
              marginTop: 4,
            }]}>
              This content is only visible to instructors and administrators
            </Text>
          </View>
        </ProgramGuard>
        
        <Text style={styles.cardContent}>
          Content requiring admin role (simulated restriction):
        </Text>
        <ProgramGuard 
          requiredRole="super_admin"
          errorMessage="Administrative privileges required for this feature"
          showRefresh={true}
        >
          <View style={[{
            backgroundColor: theme.colors.interactive.primary + '20',
            padding: theme.spacing.md,
            borderRadius: theme.borderRadius.md,
            borderWidth: 1,
            borderColor: theme.colors.interactive.primary,
          }]}>
            <Text style={[{
              color: theme.colors.interactive.primary,
              fontWeight: '600',
            }]}>
              🔐 Admin-Only Content
            </Text>
            <Text style={[{
              color: theme.colors.text.secondary,
              marginTop: 4,
            }]}>
              Super administrator features
            </Text>
          </View>
        </ProgramGuard>
        
        <Text style={styles.cardContent}>
          Minimum role level requirement:
        </Text>
        <ProgramGuard 
          minimumRoleLevel="instructor"
          errorMessage="Instructor level access required"
          showRefresh={true}
        >
          <View style={[{
            backgroundColor: theme.colors.status.warning + '20',
            padding: theme.spacing.md,
            borderRadius: theme.borderRadius.md,
            borderWidth: 1,
            borderColor: theme.colors.status.warning,
          }]}>
            <Text style={[{
              color: theme.colors.status.warning,
              fontWeight: '600',
            }]}>
              ⚠️ Role Level Protected Content
            </Text>
            <Text style={[{
              color: theme.colors.text.secondary,
              marginTop: 4,
            }]}>
              Requires minimum instructor role level
            </Text>
          </View>
        </ProgramGuard>
        
        <Text style={styles.componentDescription}>
          Conditional rendering based on user roles and permissions with customizable error messages and fallback components
        </Text>
      </View>

      <View style={styles.componentGroup}>
        <Text style={styles.componentTitle}>useProgramContext Hook Usage</Text>
        <DemoProgramContextHook />
        <Text style={styles.componentDescription}>
          React hook providing access to current program context, available programs, and program switching functionality
        </Text>
      </View>

      <View style={styles.componentGroup}>
        <Text style={styles.componentTitle}>ProgramContextProvider - Context Setup</Text>
        <View style={[{
          backgroundColor: theme.colors.background.secondary,
          padding: theme.spacing.md,
          borderRadius: theme.borderRadius.md,
          borderWidth: 1,
          borderColor: theme.colors.border.primary,
        }]}>
          <Text style={[{
            color: theme.colors.text.primary,
            fontFamily: 'monospace',
            fontSize: 14,
            lineHeight: 20,
          }]}>
            {`// App setup with ProgramContextProvider\n<ProgramContextProvider>\n  <App />\n</ProgramContextProvider>\n\n// Component using program context\nconst { \n  currentProgram,\n  availablePrograms,\n  switchProgram,\n  isLoading \n} = useProgramContext();`}
          </Text>
        </View>
        <Text style={styles.componentDescription}>
          Provider component that manages program state and provides context to all child components in the application
        </Text>
      </View>
    </View>
  );
};

// Demo component to showcase useProgramContext hook
const DemoProgramContextHook: React.FC = () => {
  const programContext = useProgramContext();
  const { theme } = useTheme();

  if (!programContext) {
    return (
      <View style={[{
        backgroundColor: theme.colors.background.secondary,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border.primary,
      }]}>
        <Text style={[{
          color: theme.colors.text.secondary,
          textAlign: 'center',
        }]}>
          Program context not available
        </Text>
      </View>
    );
  }

  const { 
    currentProgram, 
    availablePrograms, 
    isLoading, 
    error 
  } = programContext;

  return (
    <View style={[{
      backgroundColor: theme.colors.background.secondary,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    }]}>
      <Text style={[{
        color: theme.colors.interactive.primary,
        fontWeight: '600',
        marginBottom: 8,
      }]}>
        Program Context State:
      </Text>
      
      <Text style={[{
        color: theme.colors.text.primary,
        marginBottom: 4,
      }]}>
        Current Program: {currentProgram?.name || 'None'}
      </Text>
      
      <Text style={[{
        color: theme.colors.text.primary,
        marginBottom: 4,
      }]}>
        Available Programs: {availablePrograms.length}
      </Text>
      
      <Text style={[{
        color: theme.colors.text.primary,
        marginBottom: 4,
      }]}>
        Loading: {isLoading ? 'Yes' : 'No'}
      </Text>
      
      {error && (
        <Text style={[{
          color: theme.colors.status.error,
          marginTop: 4,
        }]}>
          Error: {error}
        </Text>
      )}
      
      {currentProgram?.description && (
        <Text style={[{
          color: theme.colors.text.secondary,
          marginTop: 8,
          fontSize: 12,
        }]}>
          Description: {currentProgram.description}
        </Text>
      )}
    </View>
  );
};

export default AdvancedSection;