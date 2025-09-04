/**
 * Performance Feature Types
 * 
 * Defines interfaces for program-agnostic performance tracking with support for
 * swimming, basketball, football, music, coding, and other academy programs.
 */

export type ProgramType = 'swimming' | 'basketball' | 'football' | 'music' | 'coding' | 'tennis' | 'soccer';

export type MetricType = 'time' | 'distance' | 'score' | 'percentage' | 'count' | 'rating' | 'level';

export type TrendDirection = 'up' | 'down' | 'neutral';

export type ChartType = 'line' | 'bar' | 'pie' | 'area' | 'radar' | 'progress';

export type TimePeriod = 'week' | 'month' | 'quarter' | 'semester' | 'year' | 'all';

/**
 * Base performance metric that all programs can extend
 */
export interface BasePerformanceMetric {
  id: string;
  title: string;
  value: number | string;
  unit?: string;
  type: MetricType;
  trend?: {
    direction: TrendDirection;
    percentage: number;
    period: string;
  };
  icon?: string;
  color?: string;
  category: string;
  lastUpdated: Date;
  goal?: number | string;
  personalBest?: number | string;
}

/**
 * Chart data structure for performance visualizations
 */
export interface PerformanceChartData {
  id: string;
  title: string;
  type: ChartType;
  data: ChartDataPoint[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  color?: string;
  period: TimePeriod;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  date?: Date;
  color?: string;
  metadata?: Record<string, any>;
}

/**
 * Performance session/workout data
 */
export interface PerformanceSession {
  id: string;
  date: Date;
  program: ProgramType;
  sessionType: string;
  duration: number; // in minutes
  metrics: BasePerformanceMetric[];
  notes?: string;
  instructor?: string;
  location?: string;
  weather?: string; // for outdoor activities
  difficulty?: number; // 1-10 scale
  rating?: number; // student's self-rating 1-5
}

/**
 * Performance comparison data
 */
export interface PerformanceComparison {
  metric: string;
  current: number | string;
  previous: number | string;
  improvement: number;
  percentageChange: number;
  period: string;
}

/**
 * Achievement/milestone tracking
 */
export interface PerformanceAchievement {
  id: string;
  title: string;
  description: string;
  category: string;
  dateAchieved: Date;
  metric: string;
  value: number | string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  program: ProgramType;
}

/**
 * Performance goals and targets
 */
export interface PerformanceGoal {
  id: string;
  title: string;
  description: string;
  targetValue: number | string;
  currentValue: number | string;
  unit: string;
  category: string;
  deadline?: Date;
  progress: number; // 0-100 percentage
  status: 'active' | 'completed' | 'paused' | 'missed';
  program: ProgramType;
}

/**
 * Program-specific configuration
 */
export interface ProgramPerformanceConfig {
  program: ProgramType;
  displayName: string;
  primaryColor: string;
  secondaryColor: string;
  icon: string;
  metrics: string[]; // Available metric categories
  chartTypes: ChartType[]; // Supported chart types
  sessionTypes: string[]; // Available session/workout types
  skillLevels: string[]; // Program-specific skill levels
  equipment?: string[]; // Required/optional equipment
}

/**
 * Performance analytics summary
 */
export interface PerformanceAnalytics {
  program: ProgramType;
  period: TimePeriod;
  totalSessions: number;
  totalDuration: number;
  averageRating: number;
  improvementMetrics: PerformanceComparison[];
  topAchievements: PerformanceAchievement[];
  goalProgress: PerformanceGoal[];
  recommendations: string[];
  strengths: string[];
  areasForImprovement: string[];
}

/**
 * Performance data filters
 */
export interface PerformanceFilters {
  program?: ProgramType;
  period: TimePeriod;
  metrics?: string[];
  sessionTypes?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  instructor?: string;
  location?: string;
}

/**
 * Real-time performance tracking
 */
export interface LivePerformanceData {
  sessionId: string;
  metrics: BasePerformanceMetric[];
  startTime: Date;
  currentDuration: number;
  isActive: boolean;
  notes: string[];
}

/**
 * Performance export/sharing options
 */
export interface PerformanceExportOptions {
  format: 'pdf' | 'csv' | 'json' | 'image';
  period: TimePeriod;
  includeCharts: boolean;
  includeMetrics: boolean;
  includeGoals: boolean;
  includeAchievements: boolean;
  program?: ProgramType;
}

/**
 * Program-specific performance adapter interface
 */
export interface ProgramPerformanceAdapter {
  program: ProgramType;
  config: ProgramPerformanceConfig;
  
  // Transform raw data into program-specific metrics
  transformMetrics(rawData: any[]): BasePerformanceMetric[];
  
  // Generate program-specific charts
  generateCharts(sessions: PerformanceSession[], period: TimePeriod): PerformanceChartData[];
  
  // Calculate program-specific analytics
  calculateAnalytics(sessions: PerformanceSession[], period: TimePeriod): PerformanceAnalytics;
  
  // Validate program-specific performance data
  validatePerformanceData(data: any): boolean;
  
  // Get program-specific recommendations
  getRecommendations(analytics: PerformanceAnalytics): string[];
}