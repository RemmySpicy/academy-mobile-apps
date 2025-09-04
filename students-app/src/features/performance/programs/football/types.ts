/**
 * Football-Specific Performance Types
 * 
 * Defines football-specific metrics, positions, skills, and performance indicators
 */

import { BasePerformanceMetric, PerformanceSession, ProgramType } from '../../types';

export type FootballPosition = 
  | 'goalkeeper'
  | 'defender'
  | 'midfielder'
  | 'forward'
  | 'left_back'
  | 'right_back'
  | 'center_back'
  | 'defensive_midfielder'
  | 'attacking_midfielder'
  | 'winger'
  | 'striker';

export type FootballSkill = 
  | 'passing'
  | 'shooting'
  | 'dribbling'
  | 'defending'
  | 'crossing'
  | 'heading'
  | 'first_touch'
  | 'speed'
  | 'agility'
  | 'stamina'
  | 'tactical_awareness';

export type FootballDrill = 
  | 'cone_weaving'
  | 'passing_accuracy'
  | 'shooting_practice'
  | 'juggling'
  | '1v1_defending'
  | 'crossing_practice'
  | 'free_kicks'
  | 'penalties'
  | 'sprint_intervals'
  | 'possession_play';

export type FootballSkillLevel = 
  | 'beginner' 
  | 'youth' 
  | 'intermediate' 
  | 'advanced' 
  | 'semi_pro' 
  | 'professional';

/**
 * Football-specific performance metrics
 */
export interface FootballPerformanceMetric extends BasePerformanceMetric {
  skill?: FootballSkill;
  position?: FootballPosition;
  accuracy?: number; // percentage for applicable skills
  distance?: number; // for running, passing distance
  speed?: number; // km/h or m/s
  gameStats?: FootballGameStats;
}

/**
 * Football game statistics
 */
export interface FootballGameStats {
  goals: number;
  assists: number;
  shotsOnTarget: number;
  totalShots: number;
  passes: number;
  passesCompleted: number;
  tackles: number;
  tacklesWon: number;
  interceptions: number;
  crosses: number;
  crossesCompleted: number;
  dribblesAttempted: number;
  dribblesSuccessful: number;
  distanceCovered: number; // in kilometers
  sprintDistance: number; // in meters
  topSpeed: number; // km/h
  minutesPlayed: number;
  yellowCards: number;
  redCards: number;
}

/**
 * Football skill assessment
 */
export interface FootballSkillAssessment {
  skill: FootballSkill;
  rating: number; // 1-10 scale
  accuracy: number; // percentage where applicable
  consistency: number; // 1-10 scale
  gameApplication: number; // 1-10 scale
  weakFoot?: number; // 1-10 scale for technical skills
  underPressure?: number; // 1-10 scale
  notes?: string;
}

/**
 * Football training session
 */
export interface FootballSession extends PerformanceSession {
  drills: FootballDrill[];
  skillsFocus: FootballSkill[];
  position?: FootballPosition;
  matchPlay: boolean;
  scrimmage: boolean;
  physicalConditions?: {
    weather: string;
    temperature: number;
    pitchCondition: 'excellent' | 'good' | 'fair' | 'poor';
  };
  skillAssessments: FootballSkillAssessment[];
  physicalStats?: {
    distanceCovered: number;
    sprintsCompleted: number;
    maxSpeed: number;
    averageSpeed: number;
  };
}

/**
 * Football fitness metrics
 */
export interface FootballFitnessMetrics {
  yoyoTest?: {
    level: number;
    shuttle: number;
    totalDistance: number;
    date: Date;
  };
  cooperTest?: {
    distanceIn12Min: number; // meters
    vo2Max: number;
    date: Date;
  };
  sprintTimes?: {
    distance: number; // meters (10m, 20m, 30m, etc.)
    time: number; // seconds
    date: Date;
  }[];
  agilityTest?: {
    testType: string; // e.g., "T-Test", "Illinois Agility"
    time: number;
    date: Date;
  };
}

/**
 * Football personal records
 */
export interface FootballPersonalRecord {
  skill: FootballSkill | 'fitness';
  metric: string;
  value: number;
  unit: string;
  date: Date;
  context: string; // training, match, fitness test
}

/**
 * Football standards by skill level (1-10 rating scale)
 */
export const FOOTBALL_STANDARDS: Record<FootballSkillLevel, Record<FootballSkill, number>> = {
  beginner: {
    passing: 3,
    shooting: 2,
    dribbling: 3,
    defending: 2,
    crossing: 2,
    heading: 2,
    first_touch: 3,
    speed: 3,
    agility: 3,
    stamina: 3,
    tactical_awareness: 2,
  },
  youth: {
    passing: 5,
    shooting: 4,
    dribbling: 5,
    defending: 4,
    crossing: 4,
    heading: 4,
    first_touch: 5,
    speed: 5,
    agility: 5,
    stamina: 5,
    tactical_awareness: 4,
  },
  intermediate: {
    passing: 6,
    shooting: 6,
    dribbling: 6,
    defending: 6,
    crossing: 5,
    heading: 6,
    first_touch: 6,
    speed: 6,
    agility: 6,
    stamina: 6,
    tactical_awareness: 6,
  },
  advanced: {
    passing: 8,
    shooting: 7,
    dribbling: 7,
    defending: 7,
    crossing: 7,
    heading: 7,
    first_touch: 8,
    speed: 7,
    agility: 7,
    stamina: 7,
    tactical_awareness: 7,
  },
  semi_pro: {
    passing: 9,
    shooting: 8,
    dribbling: 8,
    defending: 8,
    crossing: 8,
    heading: 8,
    first_touch: 9,
    speed: 8,
    agility: 8,
    stamina: 8,
    tactical_awareness: 8,
  },
  professional: {
    passing: 10,
    shooting: 9,
    dribbling: 9,
    defending: 9,
    crossing: 9,
    heading: 9,
    first_touch: 10,
    speed: 9,
    agility: 9,
    stamina: 9,
    tactical_awareness: 9,
  },
};