import React from 'react';
import { View, Text } from 'react-native';

// Academy-Specific Components
import { 
  ClassroomGrading, 
  MyClassroom, 
  CourseProgression, 
  ProfileInfoSection, 
  NotificationSection, 
  SessionManagementSection, 
  PreferencesSupportSection, 
  StationProgress, 
  GroupedCards, 
  StudentCard 
} from '../../../components/academy';

// Sample Data
import { sampleStudentInfo, sampleGroupedSections } from '../data/sampleData';

// Types
import type { ShowcaseSectionProps } from '../types/showcaseTypes';

const AcademySection: React.FC<ShowcaseSectionProps> = ({ theme, styles }) => {
  return (
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
          { id: 'group1', name: 'Advanced Group', studentCount: 8, color: theme.colors.interactive.primary },
          { id: 'group2', name: 'Intermediate Group', studentCount: 12, color: theme.colors.status.success },
          { id: 'group3', name: 'Beginner Group', studentCount: 15, color: theme.colors.status.warning },
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
          { id: 'group1', name: 'Advanced Group', studentCount: 8, color: theme.colors.interactive.primary, isActive: true },
          { id: 'group2', name: 'Intermediate Group', studentCount: 12, color: theme.colors.status.success, isActive: false },
          { id: 'group3', name: 'Beginner Group', studentCount: 15, color: theme.colors.status.warning, isActive: false },
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

      <Text style={styles.subsectionTitle}>StudentCard (Enhanced with Session Type & Payment Status)</Text>
      <View style={{ gap: 12 }}>
        <StudentCard
          student={{
            ...sampleStudentInfo,
            paymentStatus: 'fully-paid',
            sessionType: 'school-group',
            tags: ['Star Student'],
          }}
          onPress={(student) => console.log('Student card pressed:', student.name)}
          variant="default"
          showProgress={true}
          showAttendance={true}
          showPaymentStatus={true}
          showSessionType={true}
          showTags={true}
        />
        
        <StudentCard
          student={{
            ...sampleStudentInfo,
            id: '2',
            name: 'Alex Thompson',
            progress: 45,
            paymentStatus: 'partial-paid',
            sessionType: 'private-session',
            attendance: { attended: 6, absence: 4, sessions: 10 },
            tags: ['Advanced'],
          }}
          onPress={(student) => console.log('Student card pressed:', student.name)}
          variant="compact"
          showProgress={true}
          showAttendance={true}
          showPaymentStatus={true}
          showSessionType={true}
          showTags={true}
        />
        
        <StudentCard
          student={{
            ...sampleStudentInfo,
            id: '3',
            name: 'Maya Rodriguez',
            progress: 92,
            paymentStatus: 'overdue',
            sessionType: 'mixed',
            attendance: { attended: 12, absence: 1, sessions: 13 },
            tags: ['Competition Team'],
          }}
          onPress={(student) => console.log('Student card pressed:', student.name)}
          variant="detailed"
          showProgress={true}
          showAttendance={true}
          showPaymentStatus={true}
          showSessionType={true}
          showTags={true}
        />

        <StudentCard
          student={{
            ...sampleStudentInfo,
            id: '4',
            name: 'Emma Johnson',
            progress: 85,
            paymentStatus: 'unpaid',
            sessionType: 'school-group',
            attendance: { attended: 18, absence: 2, sessions: 20 },
            tags: [],
          }}
          onPress={(student) => console.log('Student card pressed:', student.name)}
          variant="default"
          showProgress={true}
          showAttendance={true}
          showPaymentStatus={true}
          showSessionType={true}
          showTags={false}
        />
      </View>
      <Text style={styles.cardContent}>
        Enhanced StudentCard - Now includes Session Type indicators (School Group/Private Session/Mixed) and improved Payment Status indicators. Features all functionality from NurserySchool/PreSchool components with modern design system integration.
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
};

export default AcademySection;