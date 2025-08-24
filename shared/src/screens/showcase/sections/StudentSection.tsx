import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';

// Student Components
import { StudentProfile } from '../../../components/student';
import { StudentCard } from '@academy/mobile-shared';

// Sample Data
import { sampleStudentInfo } from '../data/sampleData';

// Types
import { ShowcaseSectionProps } from '../types/showcaseTypes';

const StudentSection: React.FC<ShowcaseSectionProps> = ({ theme, styles }) => {
  // Modal demo states
  const [studentProfileVisible, setStudentProfileVisible] = useState(false);

  // Sample student data matching the StudentCard interface
  const excellentStudent = {
    id: '1',
    first_name: 'Emma',
    last_name: 'Johnson',
    email: 'emma.johnson@academy.com',
    program_id: 'swimming-advanced',
    enrollment_date: '2024-01-15',
    level: '3',
    module: '4',
    group: 'A',
    performance_level: 'excellent' as const,
    current_attendance_rate: 94,
    today_attendance: 'present' as const,
    last_lesson_score: 92,
    total_lessons: 20,
    completed_lessons: 18,
    upcoming_assessments: 1,
    overdue_assignments: 0,
    parent_contact_required: false,
    special_notes: 'Excellent progress in backstroke technique'
  };

  const strugglingStudent = {
    id: '2',
    first_name: 'Alex',
    last_name: 'Thompson',
    email: 'alex.thompson@academy.com',
    program_id: 'swimming-beginner',
    enrollment_date: '2024-02-01',
    level: '1',
    module: '2',
    group: 'B',
    performance_level: 'needs-attention' as const,
    current_attendance_rate: 72,
    today_attendance: 'absent' as const,
    last_lesson_score: 65,
    total_lessons: 15,
    completed_lessons: 8,
    upcoming_assessments: 2,
    overdue_assignments: 3,
    parent_contact_required: true,
    special_notes: 'Struggling with floating techniques - needs extra support'
  };

  const criticalStudent = {
    id: '3',
    first_name: 'Maya',
    last_name: 'Rodriguez',
    email: 'maya.rodriguez@academy.com',
    program_id: 'swimming-intermediate',
    enrollment_date: '2024-01-20',
    level: '2',
    module: '1',
    group: 'C',
    performance_level: 'critical' as const,
    current_attendance_rate: 45,
    today_attendance: 'absent' as const,
    last_lesson_score: 45,
    total_lessons: 20,
    completed_lessons: 6,
    upcoming_assessments: 1,
    overdue_assignments: 6,
    parent_contact_required: true,
    special_notes: 'Multiple missed sessions - immediate intervention required'
  };

  const averageStudent = {
    id: '4',
    first_name: 'David',
    last_name: 'Wilson',
    email: 'david.wilson@academy.com',
    program_id: 'swimming-intermediate',
    enrollment_date: '2024-01-10',
    level: '2',
    module: '3',
    group: 'A',
    performance_level: 'average' as const,
    current_attendance_rate: 88,
    today_attendance: 'present' as const,
    last_lesson_score: 76,
    total_lessons: 18,
    completed_lessons: 14,
    upcoming_assessments: 1,
    overdue_assignments: 1,
    parent_contact_required: false,
    special_notes: 'Steady progress, consistent effort'
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>👥 Student Components</Text>
      
      <Text style={styles.subsectionTitle}>StudentProfile</Text>
      <Pressable
        style={[styles.showcaseButton, { backgroundColor: theme.colors.interactive.primary }]}
        onPress={() => setStudentProfileVisible(true)}
      >
        <Text style={[styles.showcaseButtonText, { color: theme.colors.text.inverse }]}>
          Open Student Profile Modal
        </Text>
      </Pressable>
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
        visible={studentProfileVisible}
        onClose={() => setStudentProfileVisible(false)}
      />
      <Text style={styles.cardContent}>
        StudentProfile - Comprehensive student profile component with academic and program progress
      </Text>

      <Text style={styles.subsectionTitle}>StudentCard - All Variants & Configurations</Text>
      
      <Text style={styles.componentDescription}>Variant: Detailed (Full instructor interface)</Text>
      <View style={{ gap: 12 }}>
        <StudentCard
          student={excellentStudent}
          variant="detailed"
          onPress={(student) => console.log('Student pressed:', student.first_name, student.last_name)}
          onAttendancePress={(student) => console.log('Attendance for:', student.first_name)}
          onPerformancePress={(student) => console.log('Performance for:', student.first_name)}
          onContactParentPress={(student) => console.log('Contact parent for:', student.first_name)}
          onMoreOptionsPress={(student) => console.log('Consolidated more options menu for:', student.first_name)}
          showAttendance={true}
          showPerformance={true}
          showProgress={true}
          showQuickActions={true}
          showAlerts={true}
          enableQuickAttendance={true}
          enableQuickGrading={true}
          showInstructorNotes={true}
        />
      </View>

      <Text style={styles.componentDescription}>Variant: Compact (Dashboard overview)</Text>
      <View style={{ gap: 12 }}>
        <StudentCard
          student={excellentStudent}
          variant="compact"
          onPress={(student) => console.log('Student pressed:', student.first_name, student.last_name)}
          showAttendance={true}
          showPerformance={true}
          showProgress={false}
          showQuickActions={false}
          showAlerts={false}
        />
        
        <StudentCard
          student={averageStudent}
          variant="compact"
          onPress={(student) => console.log('Student pressed:', student.first_name, student.last_name)}
          showAttendance={true}
          showPerformance={true}
          showProgress={false}
          showQuickActions={false}
          showAlerts={false}
        />
      </View>

      <Text style={styles.componentDescription}>Variant: Dashboard (Metrics focused)</Text>
      <View style={{ gap: 12 }}>
        <StudentCard
          student={strugglingStudent}
          variant="dashboard"
          onPress={(student) => console.log('Student pressed:', student.first_name, student.last_name)}
          onContactParentPress={(student) => console.log('Contact parent for:', student.first_name)}
          showAttendance={true}
          showPerformance={true}
          showProgress={true}
          showQuickActions={false}
          showAlerts={true}
        />
      </View>

      <Text style={styles.componentDescription}>Performance States (All Levels)</Text>
      <View style={{ gap: 12 }}>
        <StudentCard
          student={{ ...excellentStudent, performance_level: 'excellent' }}
          variant="detailed"
          onPress={(student) => console.log('Excellent student:', student.first_name)}
          showAttendance={true}
          showPerformance={true}
          showProgress={true}
          showQuickActions={true}
          showAlerts={true}
        />

        <StudentCard
          student={{ ...averageStudent, performance_level: 'good', first_name: 'Lisa', last_name: 'Davis' }}
          variant="detailed"
          onPress={(student) => console.log('Good student:', student.first_name)}
          showAttendance={true}
          showPerformance={true}
          showProgress={true}
          showQuickActions={true}
          showAlerts={true}
        />

        <StudentCard
          student={strugglingStudent}
          variant="detailed"
          onPress={(student) => console.log('Struggling student:', student.first_name)}
          onContactParentPress={(student) => console.log('Contact parent for:', student.first_name)}
          showAttendance={true}
          showPerformance={true}
          showProgress={true}
          showQuickActions={true}
          showAlerts={true}
          enableQuickAttendance={true}
          showInstructorNotes={true}
        />

        <StudentCard
          student={criticalStudent}
          variant="detailed"
          onPress={(student) => console.log('Critical student:', student.first_name)}
          onContactParentPress={(student) => console.log('URGENT - Contact parent for:', student.first_name)}
          showAttendance={true}
          showPerformance={true}
          showProgress={true}
          showQuickActions={true}
          showAlerts={true}
          enableQuickAttendance={true}
          showInstructorNotes={true}
          style={{ borderLeftWidth: 4, borderLeftColor: theme.colors.status.error }}
        />
      </View>

      <Text style={styles.componentDescription}>Variant: Academy (Payment & Session focused)</Text>
      <View style={{ gap: 12 }}>
        <StudentCard
          student={{
            ...excellentStudent,
            paymentStatus: 'fully-paid',
            sessionType: 'private-session',
            tags: ['Star Student', 'Competition Ready'],
            progress: 94,
            attendance: { attended: 18, absence: 2, sessions: 20 },
          }}
          variant="academy"
          onPress={(student) => console.log('Academy student pressed:', student.first_name)}
          showProgress={true}
          showAttendance={true}
          showPaymentStatus={true}
          showSessionType={true}
          showTags={true}
          showStatusIndicator={false}
        />

        <StudentCard
          student={{
            ...strugglingStudent,
            paymentStatus: 'overdue',
            sessionType: 'school-group',
            tags: ['Needs Support'],
            progress: 65,
            attendance: { attended: 8, absence: 7, sessions: 15 },
          }}
          variant="academy"
          onPress={(student) => console.log('Academy student with payment issues:', student.first_name)}
          showProgress={true}
          showAttendance={true}
          showPaymentStatus={true}
          showSessionType={true}
          showTags={true}
          showStatusIndicator={true}
        />

        <StudentCard
          student={{
            ...averageStudent,
            paymentStatus: 'partial-paid',
            sessionType: 'mixed',
            tags: ['Regular Student'],
            progress: 78,
            attendance: { attended: 14, absence: 4, sessions: 18 },
          }}
          variant="academy"
          onPress={(student) => console.log('Academy mixed sessions student:', student.first_name)}
          showProgress={true}
          showAttendance={true}
          showPaymentStatus={true}
          showSessionType={true}
          showTags={true}
          showStatusIndicator={false}
        />
      </View>

      <Text style={styles.cardContent}>
        <Text style={{ fontWeight: 'bold' }}>StudentCard</Text> - Comprehensive instructor-enhanced student cards with:
        {'\n'}• <Text style={{ fontWeight: '600' }}>Performance indicators</Text> (colored dots on avatar)
        {'\n'}• <Text style={{ fontWeight: '600' }}>Attendance status</Text> (present/absent/late/excused)
        {'\n'}• <Text style={{ fontWeight: '600' }}>Progress tracking</Text> with lesson completion
        {'\n'}• <Text style={{ fontWeight: '600' }}>Quick actions</Text> (attendance, grading, parent contact)
        {'\n'}• <Text style={{ fontWeight: '600' }}>Alert system</Text> (overdue assignments, parent contact needed)
        {'\n'}• <Text style={{ fontWeight: '600' }}>Instructor notes</Text> and emergency contacts
        {'\n'}• <Text style={{ fontWeight: '600' }}>Payment status</Text> (fully-paid/partial/unpaid/overdue)
        {'\n'}• <Text style={{ fontWeight: '600' }}>Session types</Text> (school-group/private-session/mixed)
        {'\n'}• <Text style={{ fontWeight: '600' }}>Custom tags</Text> and status indicators
        {'\n'}• <Text style={{ fontWeight: '600' }}>Multi-variant support</Text> (compact/detailed/dashboard/academy)
      </Text>
    </View>
  );
};

export default StudentSection;