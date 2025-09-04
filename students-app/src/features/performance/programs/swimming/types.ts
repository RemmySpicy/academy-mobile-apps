/**
 * Swimming-Specific Performance Types
 * 
 * Defines swimming-specific metrics, strokes, distances, and performance indicators
 * Extended with UI-focused types for modern performance tracking interface
 */

import { BasePerformanceMetric, PerformanceSession, ProgramType } from '../../types';

export type SwimmingStroke = 'freestyle' | 'backstroke' | 'breaststroke' | 'butterfly' | 'individual_medley';

export type SwimmingDistance = 25 | 50 | 100 | 200 | 400 | 800 | 1500;

export type PoolType = 'short_course' | 'long_course'; // 25m vs 50m

export type SwimmingSkillLevel = 
  | 'beginner' 
  | 'intermediate' 
  | 'advanced' 
  | 'competitive' 
  | 'elite';

/**
 * Swimming-specific performance metrics
 */
export interface SwimmingPerformanceMetric extends BasePerformanceMetric {
  stroke?: SwimmingStroke;
  distance?: SwimmingDistance;
  poolType?: PoolType;
  timeInSeconds?: number;
  strokeRate?: number; // strokes per minute
  strokeCount?: number; // total strokes for distance
  splits?: number[]; // lap times in seconds
}

/**
 * Swimming technique metrics
 */
export interface SwimmingTechniqueMetrics {
  stroke: SwimmingStroke;
  efficiency: number; // 0-100 scale
  streamline: number; // 0-100 scale
  timing: number; // 0-100 scale
  breathing: number; // 0-100 scale
  turns: number; // 0-100 scale (if applicable)
  starts: number; // 0-100 scale (if applicable)
  overallTechnique: number; // calculated average
}

/**
 * Swimming workout session
 */
export interface SwimmingSession extends PerformanceSession {
  poolType: PoolType;
  waterTemperature?: number;
  sets: SwimmingSet[];
  totalDistance: number;
  averagePace: number; // seconds per 100m
  technique: SwimmingTechniqueMetrics[];
}

/**
 * Swimming training set
 */
export interface SwimmingSet {
  id: string;
  type: 'warmup' | 'main' | 'cooldown' | 'drill' | 'kick' | 'pull';
  description: string;
  repetitions: number;
  distance: SwimmingDistance;
  restInterval: number; // seconds
  stroke: SwimmingStroke;
  times: number[]; // time for each repetition in seconds
  effort: number; // 1-10 scale
  notes?: string;
}

/**
 * Swimming personal best tracking
 */
export interface SwimmingPersonalBest {
  stroke: SwimmingStroke;
  distance: SwimmingDistance;
  poolType: PoolType;
  time: number; // in seconds
  date: Date;
  location: string;
  splits?: number[];
}

/**
 * Swimming competition result
 */
export interface SwimmingCompetitionResult {
  id: string;
  eventName: string;
  date: Date;
  venue: string;
  stroke: SwimmingStroke;
  distance: SwimmingDistance;
  poolType: PoolType;
  time: number;
  placement: number;
  totalCompetitors: number;
  splits?: number[];
  reactionTime?: number;
  disqualified?: boolean;
  disqualificationReason?: string;
}

/**
 * Swimming goal types
 */
export interface SwimmingGoal {
  id: string;
  type: 'time' | 'distance' | 'technique' | 'endurance' | 'strength';
  stroke?: SwimmingStroke;
  distance?: SwimmingDistance;
  targetTime?: number; // for time goals
  targetDistance?: number; // for distance goals
  currentBest?: number;
  deadline?: Date;
  status: 'active' | 'achieved' | 'missed' | 'paused';
  progress: number; // 0-100 percentage
}

/**
 * Swimming analytics data
 */
export interface SwimmingAnalytics {
  totalDistance: number;
  totalSessions: number;
  averageSessionDuration: number;
  favoriteStroke: SwimmingStroke;
  personalBests: SwimmingPersonalBest[];
  improvements: {
    stroke: SwimmingStroke;
    distance: SwimmingDistance;
    improvement: number; // seconds improved
    timeframe: string;
  }[];
  techniqueScores: SwimmingTechniqueMetrics[];
  weeklyProgress: {
    week: string;
    distance: number;
    sessions: number;
    averageTime: number;
  }[];
  strengthsAndWeaknesses: {
    strengths: string[];
    improvements: string[];
    recommendations: string[];
  };
}

/**
 * Swimming training zones
 */
export interface SwimmingTrainingZones {
  recovery: { min: number; max: number }; // percentage of threshold pace
  aerobic: { min: number; max: number };
  threshold: { min: number; max: number };
  vo2max: { min: number; max: number };
  neuromuscular: { min: number; max: number };
}

// ===== MODERN UI-FOCUSED TYPES (Based on Screenshot Design) =====

/**
 * Pool size options for UI filtering (matches screenshot)
 */
export type PoolSize = '17m' | '25m' | '50m';

/**
 * Human-readable stroke labels for UI display
 */
export const STROKE_LABELS: Record<SwimmingStroke, string> = {
  freestyle: 'Free',
  backstroke: 'Back', 
  breaststroke: 'Breast',
  butterfly: 'Fly',
  individual_medley: 'IM',
};

/**
 * Pool configuration with location context
 */
export interface PoolConfig {
  size: PoolSize;
  location?: string;
  isUserLocation?: boolean;
}

/**
 * Performance card data (for main performance screen cards)
 */
export interface SwimmingPerformanceCard {
  id: string;
  title: string; // e.g., "50m Freestyle", "100m Breaststroke"
  distance: number;
  stroke: SwimmingStroke;
  poolSize: PoolSize;
  currentTime: string; // formatted time (e.g., "00:26.30")
  currentTimeInSeconds: number;
  personalBest: string;
  personalBestInSeconds: number;
  improvement: {
    percentage: number;
    timeChange: string; // e.g., "-0.23" or "+0.15"
    period: string; // e.g., "vs last month"
  };
  totalRaces: number;
  lastRaceDate: string;
  trend: 'improving' | 'stable' | 'declining';
}

/**
 * Stroke technique card data (for stroke analysis view)
 */
export interface SwimmingStrokeCard {
  id: string;
  title: string; // e.g., "Single Arm Free: R", "Breast Pull"
  stroke: SwimmingStroke;
  distance: number;
  poolSize: PoolSize;
  value: number; // main metric value (stroke count, rate, etc.)
  unit: string; // e.g., "strokes", "spm", "%"
  date: string;
  description: string; // technique description
  improvement?: {
    value: number;
    period: string;
  };
}

/**
 * Detailed time record for progression screen
 */
export interface SwimmingTimeDetail {
  id: string;
  time: string; // formatted time
  timeInSeconds: number;
  date: string; // formatted date
  venue?: string;
  competition?: string;
  heat?: string;
  lane?: number;
  splits?: string[]; // formatted split times
  points?: number;
  isPB: boolean;
  isSeasonBest?: boolean;
  isClubRecord?: boolean;
  notes?: string;
}

/**
 * Performance goal for detailed view
 */
export interface SwimmingPerformanceGoal {
  id: string;
  targetTime: string; // formatted time
  targetTimeInSeconds: number;
  label: string; // e.g., "Club Record", "Season Goal"
  type: 'personal' | 'club' | 'national' | 'season';
  achieved: boolean;
  achievedDate?: string;
  deadline?: string;
}

/**
 * Comprehensive performance details for detailed progression screen
 */
export interface SwimmingPerformanceDetail {
  performance: {
    title: string; // e.g., "50m Breaststroke"
    distance: number;
    stroke: SwimmingStroke;
    poolSize: PoolSize;
  };
  bestTime: {
    time: string;
    timeInSeconds: number;
    date: string;
    venue?: string;
  };
  clubRecord?: {
    time: string;
    timeInSeconds: number;
    holder: string;
    date: string;
  };
  goals: SwimmingPerformanceGoal[];
  allTimes: SwimmingTimeDetail[];
  chartData: {
    data: Array<{
      label: string; // date
      value: number; // time in seconds for chart
      formattedValue: string; // formatted time for display
    }>;
    goalLine?: number; // goal time in seconds
    personalBestLine?: number; // PB line
  };
  statistics: {
    totalRaces: number;
    averageTime: string;
    averageTimeInSeconds: number;
    improvement: {
      percentage: number;
      timeChange: string;
      period: string;
    };
    consistency: number; // variance percentage
  };
}

/**
 * Performance view mode (Times or Stroke analysis)
 */
export type PerformanceViewMode = 'times' | 'stroke';

/**
 * Filters for the performance screen
 */
export interface SwimmingPerformanceFilters {
  viewMode: PerformanceViewMode;
  selectedStrokes: SwimmingStroke[];
  selectedPoolSize: PoolSize;
  timePeriod: 'week' | 'month' | 'quarter' | 'season' | 'year' | 'all';
  sortBy: 'date' | 'time' | 'event';
  sortOrder: 'asc' | 'desc';
}

/**
 * Main data structure for swimming performance screen
 */
export interface SwimmingPerformanceScreenData {
  // For Times tab
  performanceCards: SwimmingPerformanceCard[];
  
  // For Stroke analysis tab  
  strokeCards: SwimmingStrokeCard[];
  
  // Available filter options
  availableStrokes: SwimmingStroke[];
  availablePoolSizes: PoolConfig[];
  
  // Summary statistics
  overview: {
    totalRaces: number;
    personalBests: number;
    recentImprovement: string;
    favoriteStroke: SwimmingStroke;
    averageSessionsPerWeek: number;
  };
}

/**
 * Standard swimming times for comparison (in seconds)
 */
export const SWIMMING_STANDARDS: Record<SwimmingSkillLevel, Record<SwimmingStroke, Record<SwimmingDistance, number>>> = {
  beginner: {
    freestyle: { 25: 30, 50: 65, 100: 140, 200: 300, 400: 650, 800: 1400, 1500: 2700 },
    backstroke: { 25: 35, 50: 75, 100: 160, 200: 340, 400: 720, 800: 1500, 1500: 2900 },
    breaststroke: { 25: 40, 50: 85, 100: 180, 200: 380, 400: 800, 800: 1650, 1500: 3100 },
    butterfly: { 25: 35, 50: 80, 100: 170, 200: 380, 400: 820, 800: 1700, 1500: 3200 },
    individual_medley: { 25: 40, 50: 85, 100: 180, 200: 360, 400: 760, 800: 1600, 1500: 3000 },
  },
  intermediate: {
    freestyle: { 25: 22, 50: 48, 100: 105, 200: 220, 400: 460, 800: 980, 1500: 1850 },
    backstroke: { 25: 25, 50: 55, 100: 120, 200: 250, 400: 520, 800: 1100, 1500: 2050 },
    breaststroke: { 25: 28, 50: 62, 100: 135, 200: 285, 400: 590, 800: 1230, 1500: 2300 },
    butterfly: { 25: 25, 50: 58, 100: 125, 200: 270, 400: 580, 800: 1220, 1500: 2280 },
    individual_medley: { 25: 28, 50: 62, 100: 135, 200: 280, 400: 580, 800: 1200, 1500: 2250 },
  },
  advanced: {
    freestyle: { 25: 18, 50: 38, 100: 82, 200: 170, 400: 350, 800: 740, 1500: 1400 },
    backstroke: { 25: 20, 50: 43, 100: 92, 200: 190, 400: 395, 800: 830, 1500: 1550 },
    breaststroke: { 25: 22, 50: 48, 100: 105, 200: 220, 400: 460, 800: 960, 1500: 1800 },
    butterfly: { 25: 19, 50: 42, 100: 92, 200: 200, 400: 430, 800: 900, 1500: 1700 },
    individual_medley: { 25: 21, 50: 46, 100: 100, 200: 210, 400: 440, 800: 920, 1500: 1750 },
  },
  competitive: {
    freestyle: { 25: 15, 50: 32, 100: 68, 200: 142, 400: 295, 800: 620, 1500: 1170 },
    backstroke: { 25: 17, 50: 36, 100: 77, 200: 160, 400: 335, 800: 705, 1500: 1320 },
    breaststroke: { 25: 18, 50: 40, 100: 87, 200: 183, 400: 385, 800: 810, 1500: 1520 },
    butterfly: { 25: 16, 50: 35, 100: 77, 200: 168, 400: 365, 800: 770, 1500: 1450 },
    individual_medley: { 25: 17, 50: 38, 100: 83, 200: 175, 400: 370, 800: 780, 1500: 1480 },
  },
  elite: {
    freestyle: { 25: 12, 50: 26, 100: 55, 200: 115, 400: 240, 800: 500, 1500: 940 },
    backstroke: { 25: 13, 50: 29, 100: 62, 200: 130, 400: 270, 800: 570, 1500: 1070 },
    breaststroke: { 25: 14, 50: 32, 100: 70, 200: 148, 400: 310, 800: 650, 1500: 1220 },
    butterfly: { 25: 12, 50: 28, 100: 62, 200: 135, 400: 295, 800: 620, 1500: 1170 },
    individual_medley: { 25: 13, 50: 30, 100: 67, 200: 142, 400: 300, 800: 630, 1500: 1190 },
  },
};