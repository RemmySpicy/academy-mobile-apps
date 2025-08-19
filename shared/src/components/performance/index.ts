// Performance & Classroom Components

export { default as WorkoutCard } from './WorkoutCard';
export type { 
  WorkoutCardProps, 
  WorkoutPhase, 
  WorkoutUser, 
  WorkoutDetail 
} from './WorkoutCard';

export { default as ClassroomCard } from './ClassroomCard';
export type { 
  ClassroomCardProps, 
  PerformanceLevel, 
  ClassroomSchedule 
} from './ClassroomCard';

// Performance Analytics Components
export { default as Performance } from './Performance';
export type {
  PerformanceProps,
  MetricTab,
  PoolSize,
  PerformanceUser,
  PerformanceTabData,
  PoolConfig,
} from './Performance';

export { default as PerformanceTimes } from './PerformanceTimes';
export type {
  PerformanceTimesProps,
  PerformanceTimeData,
  PerformanceGoal,
  PerformanceBest,
  PerformanceComparison,
} from './PerformanceTimes';

export { default as ClassroomProgressCard } from './ClassroomProgressCard';
export type {
  ClassroomProgressCardProps,
  StarRating,
  ConfirmationStatus,
  StudentProgress,
  ProgressSection,
} from './ClassroomProgressCard';

export { default as ScoreStatistics } from './ScoreStatistics';
export type { 
  ScoreStatisticsProps,
  ScoreStatsData,
  ChartDataPoint
} from './ScoreStatistics';

export { 
  MetricPoolRender, 
  MetricsTime, 
  AdvancedScoreStatistics 
} from './AdvancedMetrics';
export type { 
  MetricPoolRenderProps, 
  MetricsTimeProps, 
  AdvancedScoreStatisticsProps,
  MetricData
} from './AdvancedMetrics';