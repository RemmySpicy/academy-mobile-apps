import type { NavigatorScreenParams } from '@react-navigation/native';

// Root Stack Parameter List
export type RootStackParamList = {
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainStackParamList>;
};

// Onboarding Stack Parameter List
export type OnboardingStackParamList = {
  Welcome: undefined;
  Features: undefined;
  Permissions: undefined;
  Complete: undefined;
};

// Authentication Stack Parameter List
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
  VerifyEmail: { email: string };
};

// Main Stack Parameter List (Tab Navigator)
export type MainStackParamList = {
  HomeTabs: NavigatorScreenParams<TabParamList>;
  // Modal screens
  StudentDetail: { studentId: string };
  ClassDetail: { classId: string };
  CreateClass: undefined;
  EditProfile: undefined;
  Settings: undefined;
  Notifications: undefined;
  ProgramSwitch: undefined;
};

// Tab Navigator Parameter List (Instructor App)
export type TabParamList = {
  Classroom: undefined;
  Schedule: undefined;
  Students: undefined;
  Attendance: undefined;
  Performance: undefined;
};

// Classroom Stack Parameter List
export type ClassroomStackParamList = {
  ClassroomMain: undefined;
  ClassDetails: { classId: string };
  ClassGrading: { classId: string };
  ClassNotes: { classId: string };
};

// Students Stack Parameter List
export type StudentsStackParamList = {
  StudentsList: undefined;
  StudentDetail: { studentId: string; studentName: string };
  StudentProgress: { studentId: string };
  AddStudent: undefined;
  EditStudent: { studentId: string };
};

// Schedule Stack Parameter List
export type ScheduleStackParamList = {
  Calendar: undefined;
  ClassDetail: { classId: string };
  CreateClass: undefined;
  EditClass: { classId: string };
  MySchedule: undefined;
};

// Attendance Stack Parameter List
export type AttendanceStackParamList = {
  AttendanceMain: undefined;
  MarkAttendance: { classId: string };
  AttendanceHistory: undefined;
  AttendanceReport: { classId: string };
};

// Performance Stack Parameter List
export type PerformanceStackParamList = {
  PerformanceOverview: undefined;
  StudentAnalytics: undefined;
  ClassPerformance: undefined;
  Reports: undefined;
};

// Navigation Props Types
export type NavigationProps<T extends keyof any> = {
  navigation: import('@react-navigation/native-stack').NativeStackNavigationProp<any, T>;
  route: import('@react-navigation/native').RouteProp<any, T>;
};

// Screen Component Props
export type ScreenProps<
  ParamList extends Record<string, any>,
  RouteName extends keyof ParamList
> = {
  navigation: import('@react-navigation/native-stack').NativeStackNavigationProp<ParamList, RouteName>;
  route: import('@react-navigation/native').RouteProp<ParamList, RouteName>;
};