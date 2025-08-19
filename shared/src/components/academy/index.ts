// Academy-specific Components
// Core Academy functionality components for educational management

export { default as ClassroomGrading } from './ClassroomGrading';
export type { 
  ClassroomGradingProps,
  GradingStudent,
  GradingGroup,
  LessonInfo
} from './ClassroomGrading';

export { default as MyClassroom } from './MyClassroom';
export type { 
  MyClassroomProps,
  ClassroomGroup,
  ClassroomLesson,
  LessonSection,
  LessonActivity,
  ClassroomStats
} from './MyClassroom';

export { default as CourseProgression } from './CourseProgression';
export type { 
  CourseProgressionProps,
  CourseProgressionData,
  ProgressionLevel,
  ProgressionClass,
  ProgressionSection,
  ProgressionLesson
} from './CourseProgression';

export { 
  default as ProfileSettingsSection,
  ProfileInfoSection,
  NotificationSection,
  SessionManagementSection,
  PreferencesSupportSection
} from './ProfileSettings';
export type { 
  ProfileSettingsSectionProps,
  ProfileSettingsSection as ProfileSettingsSectionType,
  ProfileSettingsItem,
  ProfileInfoSectionProps,
  NotificationSectionProps,
  SessionManagementSectionProps,
  PreferencesSupportSectionProps
} from './ProfileSettings';

export { default as StationProgress } from './StationProgress';
export type { 
  StationProgressProps,
  StationLesson
} from './StationProgress';

export { default as GroupedCards } from './GroupedCards';
export type { 
  GroupedCardsProps,
  GroupedCardItem,
  GroupedSection
} from './GroupedCards';

export { default as StudentCard } from './StudentCard';
export type { 
  StudentCardProps,
  StudentInfo
} from './StudentCard';