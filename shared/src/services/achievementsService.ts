import { apiClient } from './apiClient';
import type {
  Achievement,
  AchievementCategory,
  StudentAchievementStats,
  AchievementLeaderboard,
  GetAchievementsRequest,
  GetAchievementsResponse,
  UnlockAchievementRequest,
  UnlockAchievementResponse,
  GetLeaderboardRequest,
  GetLeaderboardResponse,
  AchievementProgress,
  AchievementUnlock,
  AchievementType,
  AchievementStatus,
  AchievementRarity,
} from '../types';

class AchievementsService {
  private readonly baseUrl = '/api/v1/achievements';

  // Instance method signatures for static methods (added at export)
  public sortAchievements!: typeof AchievementsService.sortAchievements;
  public getAchievementsByType!: typeof AchievementsService.getAchievementsByType;
  public getAchievementsByStatus!: typeof AchievementsService.getAchievementsByStatus;
  public getAchievementsByRarity!: typeof AchievementsService.getAchievementsByRarity;
  public calculateProgress!: typeof AchievementsService.calculateProgress;
  public getRarityColor!: typeof AchievementsService.getRarityColor;
  public getTypeColor!: typeof AchievementsService.getTypeColor;
  public formatPoints!: typeof AchievementsService.formatPoints;
  public generateMockAchievements!: typeof AchievementsService.generateMockAchievements;
  public generateMockCategories!: typeof AchievementsService.generateMockCategories;
  public generateMockStats!: typeof AchievementsService.generateMockStats;

  // Get all achievements for current student
  async getAchievements(params: GetAchievementsRequest = {}): Promise<GetAchievementsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.program_id) searchParams.append('program_id', params.program_id);
    if (params.course_id) searchParams.append('course_id', params.course_id);
    if (params.category) searchParams.append('category', params.category);
    if (params.type) searchParams.append('type', params.type);
    if (params.status) searchParams.append('status', params.status);
    if (params.rarity) searchParams.append('rarity', params.rarity);
    if (params.include_hidden !== undefined) searchParams.append('include_hidden', params.include_hidden.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.offset) searchParams.append('offset', params.offset.toString());

    const url = searchParams.toString() ? `${this.baseUrl}?${searchParams.toString()}` : this.baseUrl;
    return apiClient.get<GetAchievementsResponse>(url);
  }

  // Get single achievement details
  async getAchievement(achievementId: string): Promise<Achievement> {
    return apiClient.get<Achievement>(`${this.baseUrl}/${achievementId}`);
  }

  // Get achievement categories
  async getCategories(programId?: string): Promise<AchievementCategory[]> {
    const url = programId 
      ? `${this.baseUrl}/categories?program_id=${programId}` 
      : `${this.baseUrl}/categories`;
    return apiClient.get<AchievementCategory[]>(url);
  }

  // Get student's achievement statistics
  async getStats(programId?: string): Promise<StudentAchievementStats> {
    const url = programId 
      ? `${this.baseUrl}/stats?program_id=${programId}` 
      : `${this.baseUrl}/stats`;
    return apiClient.get<StudentAchievementStats>(url);
  }

  // Get student's achievement progress
  async getProgress(achievementId: string): Promise<AchievementProgress> {
    return apiClient.get<AchievementProgress>(`${this.baseUrl}/${achievementId}/progress`);
  }

  // Unlock/claim an achievement
  async unlockAchievement(data: UnlockAchievementRequest): Promise<UnlockAchievementResponse> {
    return apiClient.post<UnlockAchievementResponse>(`${this.baseUrl}/unlock`, data);
  }

  // Get recent achievement unlocks
  async getRecentUnlocks(limit: number = 10, programId?: string): Promise<AchievementUnlock[]> {
    const url = programId 
      ? `${this.baseUrl}/recent?limit=${limit}&program_id=${programId}`
      : `${this.baseUrl}/recent?limit=${limit}`;
    return apiClient.get<AchievementUnlock[]>(url);
  }

  // Get leaderboard
  async getLeaderboard(params: GetLeaderboardRequest = {}): Promise<GetLeaderboardResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.program_id) searchParams.append('program_id', params.program_id);
    if (params.timeframe) searchParams.append('timeframe', params.timeframe);
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const url = searchParams.toString() 
      ? `${this.baseUrl}/leaderboard?${searchParams.toString()}` 
      : `${this.baseUrl}/leaderboard`;
    return apiClient.get<GetLeaderboardResponse>(url);
  }

  // Mark achievement celebration as viewed
  async markCelebrationViewed(achievementId: string): Promise<void> {
    await apiClient.post(`${this.baseUrl}/${achievementId}/celebration-viewed`);
  }

  // Update achievement progress (for manual tracking)
  async updateProgress(achievementId: string, currentValue: number): Promise<AchievementProgress> {
    return apiClient.patch<AchievementProgress>(`${this.baseUrl}/${achievementId}/progress`, {
      current_value: currentValue,
    });
  }

  // Helper methods for filtering and sorting
  static getAchievementsByType(achievements: Achievement[], type: AchievementType): Achievement[] {
    return achievements.filter(achievement => achievement.type === type);
  }

  static getAchievementsByStatus(achievements: Achievement[], status: AchievementStatus): Achievement[] {
    return achievements.filter(achievement => achievement.status === status);
  }

  static getAchievementsByRarity(achievements: Achievement[], rarity: AchievementRarity): Achievement[] {
    return achievements.filter(achievement => achievement.rarity === rarity);
  }

  static sortAchievements(achievements: Achievement[], sortBy: 'newest' | 'oldest' | 'progress' | 'points' | 'rarity' | 'alphabetical'): Achievement[] {
    const sorted = [...achievements];
    
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      case 'progress':
        return sorted.sort((a, b) => b.progress_percentage - a.progress_percentage);
      case 'points':
        return sorted.sort((a, b) => b.points - a.points);
      case 'rarity':
        const rarityOrder: Record<AchievementRarity, number> = {
          'legendary': 5,
          'epic': 4,
          'rare': 3,
          'uncommon': 2,
          'common': 1,
        };
        return sorted.sort((a, b) => rarityOrder[b.rarity] - rarityOrder[a.rarity]);
      case 'alphabetical':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return sorted;
    }
  }

  // Calculate progress percentage
  static calculateProgress(current: number, target: number): number {
    if (target <= 0) return 0;
    return Math.min(Math.round((current / target) * 100), 100);
  }

  // Get achievement rarity color
  static getRarityColor(rarity: AchievementRarity): string {
    switch (rarity) {
      case 'common': return '#6B7280'; // Gray
      case 'uncommon': return '#059669'; // Green
      case 'rare': return '#2563EB'; // Blue
      case 'epic': return '#7C3AED'; // Purple
      case 'legendary': return '#DC2626'; // Red/Orange
      default: return '#6B7280';
    }
  }

  // Get achievement type color
  static getTypeColor(type: AchievementType): string {
    switch (type) {
      case 'attendance': return '#059669'; // Green
      case 'performance': return '#2563EB'; // Blue
      case 'milestone': return '#7C3AED'; // Purple
      case 'social': return '#EC4899'; // Pink
      case 'streak': return '#F59E0B'; // Amber
      case 'special': return '#DC2626'; // Red
      case 'certification': return '#0891B2'; // Cyan
      default: return '#6B7280';
    }
  }

  // Format points for display
  static formatPoints(points: number): string {
    if (points >= 1000) {
      return `${(points / 1000).toFixed(1)}k`;
    }
    return points.toString();
  }

  // Mock data for development/testing
  static generateMockAchievements(): Achievement[] {
    return [
      {
        id: '1',
        title: 'First Steps',
        description: 'Complete your first swimming lesson',
        icon: 'water',
        icon_color: '#2563EB',
        background_color: '#EBF4FF',
        type: 'milestone',
        category: 'Swimming',
        rarity: 'common',
        status: 'completed',
        criteria: {
          type: 'count',
          target_value: 1,
          current_value: 1,
          unit: 'lessons',
          description: 'Complete 1 swimming lesson',
        },
        points: 100,
        progress_percentage: 100,
        unlocked_at: '2024-01-15T10:00:00Z',
        program_id: 'swimming-program-1',
        is_hidden: false,
        display_order: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
      },
      {
        id: '2',
        title: 'Perfect Attendance',
        description: 'Attend all classes in a month without missing any',
        icon: 'calendar',
        icon_color: '#059669',
        background_color: '#ECFDF5',
        type: 'attendance',
        category: 'General',
        rarity: 'rare',
        status: 'in_progress',
        criteria: {
          type: 'count',
          target_value: 12,
          current_value: 8,
          unit: 'classes',
          description: 'Attend 12/12 classes this month',
        },
        points: 500,
        progress_percentage: 67,
        program_id: 'swimming-program-1',
        is_hidden: false,
        display_order: 2,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-20T10:00:00Z',
      },
      {
        id: '3',
        title: 'Stroke Master',
        description: 'Master all four swimming strokes with excellent technique',
        icon: 'trophy',
        icon_color: '#7C3AED',
        background_color: '#F3E8FF',
        type: 'performance',
        category: 'Swimming',
        rarity: 'epic',
        status: 'available',
        criteria: {
          type: 'count',
          target_value: 4,
          current_value: 2,
          unit: 'strokes',
          description: 'Master 4 swimming strokes',
        },
        points: 1000,
        progress_percentage: 50,
        program_id: 'swimming-program-1',
        is_hidden: false,
        display_order: 3,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-20T10:00:00Z',
      },
      {
        id: '4',
        title: 'Team Player',
        description: 'Help 5 fellow students during practice sessions',
        icon: 'people',
        icon_color: '#EC4899',
        background_color: '#FDF2F8',
        type: 'social',
        category: 'Community',
        rarity: 'uncommon',
        status: 'in_progress',
        criteria: {
          type: 'count',
          target_value: 5,
          current_value: 3,
          unit: 'helps',
          description: 'Help 5 fellow students',
        },
        points: 300,
        progress_percentage: 60,
        is_hidden: false,
        display_order: 4,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-25T10:00:00Z',
      },
      {
        id: '5',
        title: 'Century Club',
        description: 'Accumulate 100 practice hours',
        icon: 'time',
        icon_color: '#F59E0B',
        background_color: '#FFFBEB',
        type: 'milestone',
        category: 'Training',
        rarity: 'legendary',
        status: 'locked',
        criteria: {
          type: 'count',
          target_value: 100,
          current_value: 45,
          unit: 'hours',
          description: 'Complete 100 hours of practice',
        },
        points: 2000,
        progress_percentage: 45,
        prerequisites: ['1', '2'],
        is_hidden: true,
        display_order: 5,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-25T10:00:00Z',
      },
    ];
  }

  // Mock categories for development
  static generateMockCategories(): AchievementCategory[] {
    return [
      {
        id: 'swimming',
        name: 'Swimming',
        description: 'Swimming technique and skill achievements',
        icon: 'water',
        color: '#2563EB',
        achievements_count: 15,
        completed_count: 3,
      },
      {
        id: 'attendance',
        name: 'Attendance',
        description: 'Consistency and attendance achievements',
        icon: 'calendar',
        color: '#059669',
        achievements_count: 8,
        completed_count: 2,
      },
      {
        id: 'performance',
        name: 'Performance',
        description: 'Skill level and performance achievements',
        icon: 'trending-up',
        color: '#7C3AED',
        achievements_count: 12,
        completed_count: 1,
      },
      {
        id: 'community',
        name: 'Community',
        description: 'Social and teamwork achievements',
        icon: 'people',
        color: '#EC4899',
        achievements_count: 6,
        completed_count: 1,
      },
    ];
  }

  // Mock stats for development
  static generateMockStats(): StudentAchievementStats {
    return {
      total_achievements: 25,
      completed_achievements: 7,
      total_points: 2100,
      completion_percentage: 28,
      achievements_by_rarity: {
        common: 3,
        uncommon: 2,
        rare: 1,
        epic: 1,
        legendary: 0,
      },
      achievements_by_type: {
        attendance: 2,
        performance: 1,
        milestone: 2,
        social: 1,
        streak: 1,
        special: 0,
        certification: 0,
      },
      recent_unlocks: [],
      next_achievements: [],
    };
  }
}

// Create singleton instance with static methods as instance methods
const serviceInstance = new AchievementsService();

// Add static methods to the instance for easier access
serviceInstance.sortAchievements = AchievementsService.sortAchievements;
serviceInstance.getAchievementsByType = AchievementsService.getAchievementsByType;
serviceInstance.getAchievementsByStatus = AchievementsService.getAchievementsByStatus;
serviceInstance.getAchievementsByRarity = AchievementsService.getAchievementsByRarity;
serviceInstance.calculateProgress = AchievementsService.calculateProgress;
serviceInstance.getRarityColor = AchievementsService.getRarityColor;
serviceInstance.getTypeColor = AchievementsService.getTypeColor;
serviceInstance.formatPoints = AchievementsService.formatPoints;
serviceInstance.generateMockAchievements = AchievementsService.generateMockAchievements;
serviceInstance.generateMockCategories = AchievementsService.generateMockCategories;
serviceInstance.generateMockStats = AchievementsService.generateMockStats;

export const achievementsService = serviceInstance;