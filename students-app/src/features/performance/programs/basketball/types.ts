/**
 * Basketball-Specific Performance Types
 * 
 * Defines basketball-specific metrics, skills, positions, and performance indicators
 */

import { BasePerformanceMetric, PerformanceSession, ProgramType } from '../../types';

export type BasketballPosition = 'point_guard' | 'shooting_guard' | 'small_forward' | 'power_forward' | 'center';

export type BasketballSkill = 
  | 'shooting'
  | 'dribbling'
  | 'passing'
  | 'defense'
  | 'rebounding'
  | 'footwork'
  | 'game_iq';

export type BasketballDrill = 
  | 'free_throws'
  | 'three_pointers'
  | 'layups'
  | 'crossover'
  | 'defensive_slides'
  | 'box_out'
  | 'passing_accuracy';

export type BasketballSkillLevel = 
  | 'beginner' 
  | 'recreational' 
  | 'intermediate' 
  | 'advanced' 
  | 'competitive' 
  | 'elite';

/**
 * Basketball-specific performance metrics
 */
export interface BasketballPerformanceMetric extends BasePerformanceMetric {
  skill?: BasketballSkill;
  position?: BasketballPosition;
  attempts?: number;
  makes?: number;
  accuracy?: number; // percentage
  gameStats?: BasketballGameStats;
}

/**
 * Basketball game statistics
 */
export interface BasketballGameStats {
  points: number;
  assists: number;
  rebounds: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fouls: number;
  fieldGoalsMade: number;
  fieldGoalsAttempted: number;
  threePointersMade: number;
  threePointersAttempted: number;
  freeThrowsMade: number;
  freeThrowsAttempted: number;
  minutesPlayed: number;
}

/**
 * Basketball skill assessment
 */
export interface BasketballSkillAssessment {
  skill: BasketballSkill;
  level: number; // 1-10 scale
  accuracy: number; // percentage for applicable skills
  consistency: number; // 1-10 scale
  gameApplication: number; // 1-10 scale
  notes?: string;
  videoReference?: string;
}

/**
 * Basketball training session
 */
export interface BasketballSession extends PerformanceSession {
  drills: BasketballDrill[];
  skillsFocus: BasketballSkill[];
  position?: BasketballPosition;
  gameplay: boolean;
  scrimmage: boolean;
  skillAssessments: BasketballSkillAssessment[];
  shootingStats?: {
    freeThrows: { made: number; attempted: number };
    threePointers: { made: number; attempted: number };
    midRange: { made: number; attempted: number };
    layups: { made: number; attempted: number };
  };
}

/**
 * Basketball personal records
 */
export interface BasketballPersonalRecord {
  skill: BasketballSkill | 'overall';
  metric: string;
  value: number;
  date: Date;
  context: string; // practice, scrimmage, game
}

/**
 * Basketball standards by skill level
 */
export const BASKETBALL_STANDARDS: Record<BasketballSkillLevel, Record<BasketballSkill, number>> = {
  beginner: {
    shooting: 30, // free throw percentage
    dribbling: 40, // control rating
    passing: 50, // accuracy percentage
    defense: 30, // defensive rating
    rebounding: 40, // rebounding efficiency
    footwork: 35, // footwork rating
    game_iq: 25, // basketball IQ rating
  },
  recreational: {
    shooting: 50,
    dribbling: 60,
    passing: 65,
    defense: 50,
    rebounding: 55,
    footwork: 50,
    game_iq: 45,
  },
  intermediate: {
    shooting: 65,
    dribbling: 75,
    passing: 75,
    defense: 65,
    rebounding: 70,
    footwork: 65,
    game_iq: 60,
  },
  advanced: {
    shooting: 75,
    dribbling: 85,
    passing: 85,
    defense: 78,
    rebounding: 80,
    footwork: 78,
    game_iq: 75,
  },
  competitive: {
    shooting: 85,
    dribbling: 92,
    passing: 92,
    defense: 88,
    rebounding: 88,
    footwork: 88,
    game_iq: 85,
  },
  elite: {
    shooting: 92,
    dribbling: 98,
    passing: 98,
    defense: 95,
    rebounding: 95,
    footwork: 95,
    game_iq: 95,
  },
};