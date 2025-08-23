import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';

// Student Components
import { StudentProfile } from '../../../components/student';
import { StudentCard } from '../../../components/academy';

// Sample Data
import { sampleStudentInfo } from '../data/sampleData';

// Types
import { ShowcaseSectionProps } from '../types/showcaseTypes';

const StudentSection: React.FC<ShowcaseSectionProps> = ({ theme, styles }) => {
  // Modal demo states
  const [studentProfileVisible, setStudentProfileVisible] = useState(false);

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
    </View>
  );
};

export default StudentSection;