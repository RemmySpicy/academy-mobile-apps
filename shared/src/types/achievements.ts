// Achievement System Types
export type AchievementType = 
  | 'attendance'      // Attendance-based achievements
  | 'performance'     // Performance/skill-based achievements
  | 'milestone'       // Course/program milestones
  | 'social'          // Community/social achievements
  | 'streak'          // Streak-based achievements
  | 'special'         // Special event achievements
  | 'certification'; // Certification achievements

export type AchievementStatus = 
  | 'locked'          // Not yet available
  | 'available'       // Available to unlock
  | 'in_progress'     // Currently working towards
  | 'completed'       // Achievement unlocked
  | 'expired';        // Time-limited achievement that expired

export type AchievementRarity = 
  | 'common'          // Easy to achieve
  | 'uncommon'        // Moderate difficulty
  | 'rare'            // Difficult to achieve
  | 'epic'            // Very difficult
  | 'legendary';      // Extremely rare

export interface AchievementCriteria {
  type: 'count' | 'percentage' | 'streak' | 'date' | 'score' | 'custom';
  target_value: number;
  current_value: number;
  unit?: string; // e.g., 'classes', 'points', 'days'
  description?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Icon name from Ionicons
  icon_color?: string;
  background_color?: string;
  type: AchievementType;
  category: string; // e.g., 'Swimming', 'Attendance', 'Performance'
  rarity: AchievementRarity;
  status: AchievementStatus;
  criteria: AchievementCriteria;
  points: number; // Points awarded for this achievement
  progress_percentage: number;
  unlocked_at?: string;
  expires_at?: string; // For time-limited achievements
  prerequisites?: string[]; // Achievement IDs that must be completed first
  program_id?: string; // Associated program (null for global achievements)
  course_id?: string; // Associated course (null for program/global achievements)
  is_hidden: boolean; // Hidden until unlocked or prerequisites met
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface AchievementCategory {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  achievements_count: number;
  completed_count: number;
}

export interface AchievementProgress {
  achievement_id: string;
  student_id: string;
  current_value: number;
  progress_percentage: number;
  status: AchievementStatus;
  started_at?: string;
  completed_at?: string;
  last_updated: string;
  metadata?: Record<string, any>; // Additional progress data
}

export interface AchievementUnlock {
  id: string;
  achievement_id: string;
  student_id: string;
  unlocked_at: string;
  points_awarded: number;
  celebration_viewed: boolean;
  achievement?: Achievement; // Populated achievement details
}

export interface StudentAchievementStats {
  total_achievements: number;
  completed_achievements: number;
  total_points: number;
  completion_percentage: number;
  achievements_by_rarity: Record<AchievementRarity, number>;
  achievements_by_type: Record<AchievementType, number>;
  recent_unlocks: AchievementUnlock[];
  next_achievements: Achievement[]; // Next available achievements to work on
}

export interface AchievementLeaderboard {
  student_id: string;
  student_name: string;
  student_avatar?: string;
  total_points: number;
  completed_achievements: number;
  rank: number;
  recent_achievement?: Achievement;
}

// API Request/Response Types
export interface GetAchievementsRequest {
  program_id?: string;
  course_id?: string;
  category?: string;
  type?: AchievementType;
  status?: AchievementStatus;
  rarity?: AchievementRarity;
  include_hidden?: boolean;
  limit?: number;
  offset?: number;
}

export interface GetAchievementsResponse {
  achievements: Achievement[];
  categories: AchievementCategory[];
  total: number;
  stats: StudentAchievementStats;
}

export interface UnlockAchievementRequest {
  achievement_id: string;
  trigger_celebration?: boolean;
}

export interface UnlockAchievementResponse {
  achievement: Achievement;
  points_awarded: number;
  new_total_points: number;
  rank_change?: number;
  success: boolean;
  message?: string;
}

export interface GetLeaderboardRequest {
  program_id?: string;
  timeframe?: 'weekly' | 'monthly' | 'all_time';
  limit?: number;
}

export interface GetLeaderboardResponse {
  leaderboard: AchievementLeaderboard[];
  user_rank: number;
  total_participants: number;
}

// Achievement Filter and Sort Options
export interface AchievementFilters {
  categories: string[];
  types: AchievementType[];
  statuses: AchievementStatus[];
  rarities: AchievementRarity[];
  show_locked: boolean;
  show_completed: boolean;
}

export type AchievementSortBy = 
  | 'newest'
  | 'oldest'
  | 'progress'
  | 'points'
  | 'rarity'
  | 'alphabetical';

// Achievement Celebration/Animation Types
export interface AchievementCelebration {
  achievement: Achievement;
  points_awarded: number;
  animation_type: 'confetti' | 'sparkles' | 'fireworks' | 'simple';
  sound_enabled: boolean;
  show_leaderboard_update: boolean;
}

// Achievement Templates for Dynamic Creation
export interface AchievementTemplate {
  id: string;
  title_template: string; // e.g., "Complete {count} {type} classes"
  description_template: string;
  icon: string;
  type: AchievementType;
  rarity: AchievementRarity;
  points_formula: string; // Formula for calculating points
  criteria_template: AchievementCriteria;
  is_repeatable: boolean;
}

export interface CreateAchievementFromTemplate {
  template_id: string;
  variables: Record<string, any>; // Values to substitute in templates
  program_id?: string;
  course_id?: string;
}

// Notification Types for Achievement System
export interface AchievementNotification {
  id: string;
  type: 'unlock' | 'progress' | 'streak' | 'leaderboard';
  title: string;
  message: string;
  achievement_id?: string;
  points_awarded?: number;
  rank_change?: number;
  created_at: string;
  read: boolean;
  action_url?: string;
}