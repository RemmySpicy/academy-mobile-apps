/**
 * Tutor Service for Academy Tutor App
 * 
 * This service demonstrates how to use the shared API client
 * for instructor-specific operations in the mobile app.
 */

import { apiClient } from '@academy/mobile-shared';
import type {
  TutorProfile,
  StudentOverview,
  ClassSchedule,
  AttendanceSession,
  StudentAttendance,
  StudentProgress,
  CommunicationMessage,
  TaskItem,
  PerformanceAnalytics,
} from '../types';

export class TutorService {
  /**
   * Get current instructor's profile
   */
  static async getMyProfile(): Promise<TutorProfile> {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching instructor profile:', error);
      throw error;
    }
  }

  /**
   * Get assigned students
   */
  static async getMyStudents(
    programId?: string,
    search?: string,
    status?: string
  ): Promise<StudentOverview[]> {
    try {
      const params = new URLSearchParams();
      if (programId) params.append('program_id', programId);
      if (search) params.append('search', search);
      if (status) params.append('status', status);
      
      const response = await apiClient.get(`/students?${params.toString()}`);
      return response.data.items || response.data;
    } catch (error) {
      console.error('Error fetching assigned students:', error);
      throw error;
    }
  }

  /**
   * Get student details
   */
  static async getStudentDetails(studentId: string): Promise<StudentOverview> {
    try {
      const response = await apiClient.get(`/students/${studentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student details:', error);
      throw error;
    }
  }

  /**
   * Update student information
   */
  static async updateStudent(
    studentId: string,
    updates: Partial<StudentOverview>
  ): Promise<StudentOverview> {
    try {
      const response = await apiClient.put(`/students/${studentId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  }

  /**
   * Get class schedule for instructor
   */
  static async getMySchedule(
    startDate?: string,
    endDate?: string,
    programId?: string
  ): Promise<ClassSchedule[]> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      if (programId) params.append('program_id', programId);
      
      const response = await apiClient.get(`/courses/schedule?${params.toString()}`);
      return response.data.items || response.data;
    } catch (error) {
      console.error('Error fetching class schedule:', error);
      throw error;
    }
  }

  /**
   * Start attendance session
   */
  static async startAttendanceSession(
    classId: string,
    sessionData: {
      date: string;
      notes?: string;
    }
  ): Promise<AttendanceSession> {
    try {
      const response = await apiClient.post('/attendance/sessions', {
        class_id: classId,
        ...sessionData,
      });
      return response.data;
    } catch (error) {
      console.error('Error starting attendance session:', error);
      throw error;
    }
  }

  /**
   * Record student attendance
   */
  static async recordAttendance(
    sessionId: string,
    attendanceData: {
      student_id: string;
      status: 'present' | 'absent' | 'late' | 'excused';
      notes?: string;
    }[]
  ): Promise<StudentAttendance[]> {
    try {
      const response = await apiClient.post(`/attendance/sessions/${sessionId}/record`, {
        attendance: attendanceData,
      });
      return response.data;
    } catch (error) {
      console.error('Error recording attendance:', error);
      throw error;
    }
  }

  /**
   * Send message to parent/student
   */
  static async sendMessage(
    recipientId: string,
    messageData: {
      subject: string;
      content: string;
      priority?: 'low' | 'normal' | 'high';
      type?: 'general' | 'progress' | 'attendance' | 'behavioral';
    }
  ): Promise<CommunicationMessage> {
    try {
      const response = await apiClient.post('/communications/messages', {
        recipient_id: recipientId,
        ...messageData,
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * Get communication history
   */
  static async getCommunicationHistory(
    studentId?: string,
    type?: string,
    limit: number = 20
  ): Promise<CommunicationMessage[]> {
    try {
      const params = new URLSearchParams();
      if (studentId) params.append('student_id', studentId);
      if (type) params.append('type', type);
      params.append('limit', limit.toString());
      
      const response = await apiClient.get(`/communications/messages?${params.toString()}`);
      return response.data.items || response.data;
    } catch (error) {
      console.error('Error fetching communication history:', error);
      throw error;
    }
  }

  /**
   * Create task for student
   */
  static async createTask(taskData: {
    student_id: string;
    title: string;
    description?: string;
    due_date?: string;
    priority?: 'low' | 'normal' | 'high';
    type?: 'homework' | 'practice' | 'assessment' | 'goal';
  }): Promise<TaskItem> {
    try {
      const response = await apiClient.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  /**
   * Update task status
   */
  static async updateTaskStatus(
    taskId: string,
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled',
    notes?: string
  ): Promise<TaskItem> {
    try {
      const response = await apiClient.put(`/tasks/${taskId}`, {
        status,
        notes,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating task status:', error);
      throw error;
    }
  }

  /**
   * Get performance analytics
   */
  static async getPerformanceAnalytics(
    programId?: string,
    timeRange?: '7d' | '30d' | '90d' | '1y'
  ): Promise<PerformanceAnalytics> {
    try {
      const params = new URLSearchParams();
      if (programId) params.append('program_id', programId);
      if (timeRange) params.append('time_range', timeRange);
      
      const response = await apiClient.get(`/analytics/performance?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching performance analytics:', error);
      throw error;
    }
  }

  /**
   * Submit student assessment
   */
  static async submitAssessment(assessmentData: {
    student_id: string;
    assessment_type: string;
    scores: Record<string, number>;
    notes?: string;
    date?: string;
  }): Promise<any> {
    try {
      const response = await apiClient.post('/assessments', assessmentData);
      return response.data;
    } catch (error) {
      console.error('Error submitting assessment:', error);
      throw error;
    }
  }
}