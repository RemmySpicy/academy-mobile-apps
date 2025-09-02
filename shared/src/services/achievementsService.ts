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
  Program,
} from '../types';

class AchievementsService {
  private readonly baseUrl = '/api/v1/achievements';

  // Program type definitions for different academy programs
  private static readonly PROGRAM_TYPES = {
    swimming: {
      name: 'Swimming',
      categories: ['Technique', 'Speed', 'Endurance', 'Safety', 'Competition'],
      achievements: {
        technique: ['first_stroke', 'all_strokes', 'perfect_form', 'breathing_master'],
        speed: ['speed_demon', 'sprint_champion', 'time_beater', 'record_holder'],
        endurance: ['distance_swimmer', 'marathon_swimmer', 'endurance_king', 'iron_swimmer'],
        safety: ['safety_first', 'lifeguard_ready', 'rescue_hero', 'pool_guardian'],
        competition: ['first_race', 'medal_winner', 'champion', 'legend']
      },
      icons: { primary: 'water', secondary: 'trophy', tertiary: 'time' },
      colors: { primary: '#2563EB', secondary: '#1D4ED8', accent: '#3B82F6' }
    },
    basketball: {
      name: 'Basketball',
      categories: ['Shooting', 'Defense', 'Teamwork', 'Fundamentals', 'Leadership'],
      achievements: {
        shooting: ['first_basket', 'sharpshooter', 'three_point_master', 'clutch_shooter'],
        defense: ['steal_master', 'block_party', 'defensive_wall', 'lockdown_defender'],
        teamwork: ['team_player', 'assist_king', 'court_vision', 'playmaker'],
        fundamentals: ['dribble_master', 'footwork_pro', 'ball_handler', 'court_awareness'],
        leadership: ['team_captain', 'mentor', 'court_general', 'game_changer']
      },
      icons: { primary: 'basketball', secondary: 'trophy', tertiary: 'people' },
      colors: { primary: '#EA580C', secondary: '#DC2626', accent: '#F97316' }
    },
    football: {
      name: 'Football',
      categories: ['Offense', 'Defense', 'Special Teams', 'Conditioning', 'Strategy'],
      achievements: {
        offense: ['first_touchdown', 'rushing_yards', 'passing_master', 'red_zone_specialist'],
        defense: ['tackle_master', 'interception_king', 'sack_specialist', 'defensive_mvp'],
        special_teams: ['kick_returner', 'field_goal_hero', 'punt_coverage', 'special_teams_ace'],
        conditioning: ['iron_man', 'speed_demon', 'strength_master', 'endurance_pro'],
        strategy: ['playbook_master', 'field_general', 'game_planner', 'tactical_genius']
      },
      icons: { primary: 'american-football', secondary: 'trophy', tertiary: 'fitness' },
      colors: { primary: '#15803D', secondary: '#166534', accent: '#22C55E' }
    },
    music: {
      name: 'Music',
      categories: ['Technique', 'Theory', 'Performance', 'Composition', 'Collaboration'],
      achievements: {
        technique: ['first_song', 'scale_master', 'rhythm_keeper', 'instrument_virtuoso'],
        theory: ['note_reader', 'chord_master', 'harmony_expert', 'theory_scholar'],
        performance: ['stage_debut', 'solo_artist', 'crowd_pleaser', 'concert_star'],
        composition: ['first_composition', 'songwriter', 'melody_maker', 'composer'],
        collaboration: ['ensemble_member', 'duet_partner', 'band_member', 'orchestra_pro']
      },
      icons: { primary: 'musical-notes', secondary: 'trophy', tertiary: 'mic' },
      colors: { primary: '#7C3AED', secondary: '#6D28D9', accent: '#8B5CF6' }
    },
    coding: {
      name: 'Coding',
      categories: ['Fundamentals', 'Problem Solving', 'Projects', 'Collaboration', 'Innovation'],
      achievements: {
        fundamentals: ['first_program', 'syntax_master', 'debug_detective', 'code_reviewer'],
        problem_solving: ['logic_master', 'algorithm_ace', 'puzzle_solver', 'optimization_expert'],
        projects: ['first_app', 'full_stack', 'open_source', 'portfolio_builder'],
        collaboration: ['pair_programmer', 'code_mentor', 'team_contributor', 'community_member'],
        innovation: ['creative_coder', 'tech_innovator', 'solution_architect', 'code_artist']
      },
      icons: { primary: 'code-slash', secondary: 'trophy', tertiary: 'laptop' },
      colors: { primary: '#059669', secondary: '#047857', accent: '#10B981' }
    },
    dance: {
      name: 'Dance',
      categories: ['Technique', 'Choreography', 'Performance', 'Flexibility', 'Expression'],
      achievements: {
        technique: ['basic_steps', 'advanced_moves', 'perfect_posture', 'rhythm_master'],
        choreography: ['routine_learner', 'choreographer', 'sequence_master', 'dance_creator'],
        performance: ['stage_presence', 'solo_performer', 'group_harmony', 'showstopper'],
        flexibility: ['flexibility_pro', 'stretch_master', 'mobility_expert', 'body_control'],
        expression: ['emotional_dancer', 'storyteller', 'artistic_expression', 'dance_poet']
      },
      icons: { primary: 'body', secondary: 'trophy', tertiary: 'musical-notes' },
      colors: { primary: '#EC4899', secondary: '#DB2777', accent: '#F472B6' }
    },
    martial_arts: {
      name: 'Martial Arts',
      categories: ['Technique', 'Discipline', 'Forms', 'Sparring', 'Philosophy'],
      achievements: {
        technique: ['first_kick', 'strike_master', 'grappling_pro', 'technique_perfectionist'],
        discipline: ['focused_mind', 'self_control', 'meditation_master', 'disciplined_warrior'],
        forms: ['kata_learner', 'form_master', 'pattern_expert', 'traditional_keeper'],
        sparring: ['first_spar', 'tactical_fighter', 'ring_warrior', 'sparring_champion'],
        philosophy: ['way_follower', 'honor_keeper', 'wisdom_seeker', 'martial_philosopher']
      },
      icons: { primary: 'shield-checkmark', secondary: 'trophy', tertiary: 'fitness' },
      colors: { primary: '#DC2626', secondary: '#B91C1C', accent: '#EF4444' }
    }
  } as const;

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
  public getProgramType!: typeof AchievementsService.getProgramType;

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

  // Get program type from program name or return default
  static getProgramType(program: Program) {
    const programName = program.name.toLowerCase().replace(/\s+/g, '_');
    
    // Try exact match first
    if (programName in this.PROGRAM_TYPES) {
      return this.PROGRAM_TYPES[programName as keyof typeof this.PROGRAM_TYPES];
    }

    // Try partial matches
    for (const [key, type] of Object.entries(this.PROGRAM_TYPES)) {
      if (programName.includes(key) || key.includes(programName)) {
        return type;
      }
    }

    // Default fallback
    return {
      name: program.name,
      categories: ['General', 'Attendance', 'Performance', 'Community'],
      achievements: {
        general: ['first_step', 'dedication', 'improvement', 'excellence'],
        attendance: ['perfect_attendance', 'consistent', 'committed', 'reliable'],
        performance: ['skilled', 'advanced', 'expert', 'master'],
        community: ['team_player', 'mentor', 'leader', 'inspiration']
      },
      icons: { primary: 'school', secondary: 'trophy', tertiary: 'star' },
      colors: { primary: '#6B7280', secondary: '#4B5563', accent: '#9CA3AF' }
    };
  }

  // Achievement templates for different programs
  private static readonly ACHIEVEMENT_TEMPLATES = {
    // Swimming achievements
    first_stroke: {
      title: 'First Stroke', description: 'Complete your first swimming lesson', 
      type: 'milestone', rarity: 'common', points: 100, icon: 'water'
    },
    all_strokes: {
      title: 'Four Stroke Master', description: 'Learn all four basic swimming strokes', 
      type: 'performance', rarity: 'uncommon', points: 500, icon: 'trophy'
    },
    perfect_form: {
      title: 'Perfect Form', description: 'Achieve excellent technique rating', 
      type: 'performance', rarity: 'rare', points: 800, icon: 'checkmark-circle'
    },
    breathing_master: {
      title: 'Breathing Master', description: 'Master proper breathing technique', 
      type: 'performance', rarity: 'uncommon', points: 300, icon: 'sunny'
    },
    
    // Basketball achievements  
    first_basket: {
      title: 'First Basket', description: 'Score your first basketball shot', 
      type: 'milestone', rarity: 'common', points: 100, icon: 'basketball'
    },
    sharpshooter: {
      title: 'Sharpshooter', description: 'Make 10 consecutive free throws', 
      type: 'performance', rarity: 'rare', points: 600, icon: 'target'
    },
    three_point_master: {
      title: 'Three Point Master', description: 'Make 5 three-point shots in a game', 
      type: 'performance', rarity: 'epic', points: 1000, icon: 'radio-button-on'
    },
    team_captain: {
      title: 'Team Captain', description: 'Lead your team to victory', 
      type: 'social', rarity: 'rare', points: 750, icon: 'people'
    },

    // Football achievements
    first_touchdown: {
      title: 'First Touchdown', description: 'Score your first touchdown', 
      type: 'milestone', rarity: 'common', points: 150, icon: 'american-football'
    },
    tackle_master: {
      title: 'Tackle Master', description: 'Complete 20 successful tackles', 
      type: 'performance', rarity: 'uncommon', points: 400, icon: 'shield'
    },
    field_general: {
      title: 'Field General', description: 'Lead the team in strategy discussions', 
      type: 'social', rarity: 'rare', points: 700, icon: 'megaphone'
    },
    iron_man: {
      title: 'Iron Man', description: 'Play full game without substitution', 
      type: 'performance', rarity: 'epic', points: 900, icon: 'fitness'
    },

    // Music achievements
    first_song: {
      title: 'First Song', description: 'Learn and perform your first song', 
      type: 'milestone', rarity: 'common', points: 100, icon: 'musical-notes'
    },
    scale_master: {
      title: 'Scale Master', description: 'Master all major scales', 
      type: 'performance', rarity: 'uncommon', points: 400, icon: 'layers'
    },
    stage_debut: {
      title: 'Stage Debut', description: 'Perform solo on stage', 
      type: 'performance', rarity: 'rare', points: 800, icon: 'mic'
    },
    composer: {
      title: 'Composer', description: 'Write your own original composition', 
      type: 'performance', rarity: 'epic', points: 1200, icon: 'create'
    },

    // Coding achievements
    first_program: {
      title: 'Hello World', description: 'Write your first program', 
      type: 'milestone', rarity: 'common', points: 100, icon: 'code-slash'
    },
    debug_detective: {
      title: 'Debug Detective', description: 'Successfully debug 10 programs', 
      type: 'performance', rarity: 'uncommon', points: 350, icon: 'bug'
    },
    full_stack: {
      title: 'Full Stack', description: 'Build complete web application', 
      type: 'performance', rarity: 'epic', points: 1500, icon: 'layers'
    },
    code_mentor: {
      title: 'Code Mentor', description: 'Help 5 fellow students with coding', 
      type: 'social', rarity: 'rare', points: 600, icon: 'people'
    },

    // Dance achievements
    basic_steps: {
      title: 'Basic Steps', description: 'Learn fundamental dance steps', 
      type: 'milestone', rarity: 'common', points: 100, icon: 'body'
    },
    choreographer: {
      title: 'Choreographer', description: 'Create your own dance routine', 
      type: 'performance', rarity: 'rare', points: 700, icon: 'create'
    },
    showstopper: {
      title: 'Showstopper', description: 'Deliver outstanding performance', 
      type: 'performance', rarity: 'epic', points: 1100, icon: 'star'
    },
    flexibility_pro: {
      title: 'Flexibility Pro', description: 'Achieve advanced flexibility', 
      type: 'performance', rarity: 'uncommon', points: 300, icon: 'fitness'
    },

    // Martial Arts achievements
    first_kick: {
      title: 'First Kick', description: 'Execute your first martial arts technique', 
      type: 'milestone', rarity: 'common', points: 100, icon: 'shield-checkmark'
    },
    form_master: {
      title: 'Form Master', description: 'Perfect execution of traditional form', 
      type: 'performance', rarity: 'uncommon', points: 450, icon: 'body'
    },
    sparring_champion: {
      title: 'Sparring Champion', description: 'Win tournament competition', 
      type: 'performance', rarity: 'epic', points: 1000, icon: 'trophy'
    },
    martial_philosopher: {
      title: 'Martial Philosopher', description: 'Understand the deeper philosophy', 
      type: 'performance', rarity: 'legendary', points: 2000, icon: 'book'
    },

    // General achievements (apply to all programs)
    perfect_attendance: {
      title: 'Perfect Attendance', description: 'Attend all classes this month', 
      type: 'attendance', rarity: 'rare', points: 500, icon: 'calendar'
    },
    dedication: {
      title: 'Dedication', description: 'Show consistent improvement over time', 
      type: 'performance', rarity: 'uncommon', points: 300, icon: 'trending-up'
    },
    team_player: {
      title: 'Team Player', description: 'Help fellow students succeed', 
      type: 'social', rarity: 'uncommon', points: 250, icon: 'people'
    },
    mentor: {
      title: 'Mentor', description: 'Guide and support newer students', 
      type: 'social', rarity: 'rare', points: 600, icon: 'school'
    }
  } as const;

  // Mock data for development/testing - now program-aware
  static generateMockAchievements(program?: Program): Achievement[] {
    if (!program) {
      // Return general achievements if no program specified
      return this.generateGeneralAchievements();
    }

    const programType = this.getProgramType(program);
    const achievements: Achievement[] = [];
    let achievementId = 1;

    // Generate program-specific achievements
    Object.entries(programType.achievements).forEach(([categoryKey, achievementKeys]) => {
      const category = programType.categories.find(cat => 
        cat.toLowerCase().includes(categoryKey) || categoryKey.includes(cat.toLowerCase())
      ) || programType.categories[0];

      achievementKeys.forEach((achievementKey, index) => {
        const template = this.ACHIEVEMENT_TEMPLATES[achievementKey as keyof typeof this.ACHIEVEMENT_TEMPLATES];
        if (template) {
          const status: AchievementStatus = 
            index === 0 ? 'completed' : 
            index === 1 ? 'in_progress' : 
            index < achievementKeys.length - 1 ? 'available' : 'locked';

          const progress = 
            status === 'completed' ? 100 :
            status === 'in_progress' ? Math.floor(Math.random() * 80) + 10 :
            status === 'available' ? Math.floor(Math.random() * 50) :
            0;

          achievements.push({
            id: achievementId.toString(),
            title: template.title,
            description: template.description,
            icon: template.icon,
            icon_color: programType.colors.primary,
            background_color: programType.colors.primary + '20',
            type: template.type as AchievementType,
            category: category,
            rarity: template.rarity as AchievementRarity,
            status: status,
            criteria: {
              type: 'count',
              target_value: template.rarity === 'legendary' ? 100 : 
                          template.rarity === 'epic' ? 50 :
                          template.rarity === 'rare' ? 25 : 
                          template.rarity === 'uncommon' ? 10 : 5,
              current_value: Math.floor((progress / 100) * (
                template.rarity === 'legendary' ? 100 : 
                template.rarity === 'epic' ? 50 :
                template.rarity === 'rare' ? 25 : 
                template.rarity === 'uncommon' ? 10 : 5
              )),
              unit: template.type === 'attendance' ? 'classes' : 
                   template.type === 'social' ? 'interactions' : 
                   template.type === 'milestone' ? 'completions' : 'points',
              description: `Complete ${template.title.toLowerCase()} requirements`,
            },
            points: template.points,
            progress_percentage: progress,
            program_id: program.id,
            is_hidden: status === 'locked',
            display_order: achievementId,
            unlocked_at: status === 'completed' ? '2024-01-15T10:00:00Z' : undefined,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-25T10:00:00Z',
          });
          achievementId++;
        }
      });
    });

    // Add some general achievements for all programs
    const generalAchievements = [
      {
        id: (achievementId++).toString(),
        title: 'Perfect Attendance',
        description: `Attend all ${programType.name.toLowerCase()} classes this month`,
        icon: 'calendar',
        icon_color: '#059669',
        background_color: '#ECFDF5',
        type: 'attendance' as AchievementType,
        category: 'General',
        rarity: 'rare' as AchievementRarity,
        status: 'in_progress' as AchievementStatus,
        criteria: {
          type: 'count',
          target_value: 12,
          current_value: 8,
          unit: 'classes',
          description: 'Attend all classes this month',
        },
        points: 500,
        progress_percentage: 67,
        program_id: program.id,
        is_hidden: false,
        display_order: achievementId - 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-20T10:00:00Z',
      }
    ];

    return [...achievements, ...generalAchievements];
  }

  // Generate general achievements when no program is specified
  private static generateGeneralAchievements(): Achievement[] {
    return [
      {
        id: '1',
        title: 'First Steps',
        description: 'Complete your first lesson',
        icon: 'school',
        icon_color: '#6B7280',
        background_color: '#F9FAFB',
        type: 'milestone',
        category: 'General',
        rarity: 'common',
        status: 'completed',
        criteria: {
          type: 'count',
          target_value: 1,
          current_value: 1,
          unit: 'lessons',
          description: 'Complete 1 lesson',
        },
        points: 100,
        progress_percentage: 100,
        unlocked_at: '2024-01-15T10:00:00Z',
        is_hidden: false,
        display_order: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
      }
    ];
  }

  // Mock categories for development - now program-aware
  static generateMockCategories(program?: Program): AchievementCategory[] {
    if (!program) {
      return this.generateGeneralCategories();
    }

    const programType = this.getProgramType(program);
    
    return programType.categories.map((category, index) => ({
      id: category.toLowerCase().replace(/\s+/g, '_'),
      name: category,
      description: `${category} achievements for ${programType.name}`,
      icon: index === 0 ? programType.icons.primary :
            index === 1 ? programType.icons.secondary :
            programType.icons.tertiary,
      color: index === 0 ? programType.colors.primary :
             index === 1 ? programType.colors.secondary :
             programType.colors.accent,
      achievements_count: Math.floor(Math.random() * 10) + 5,
      completed_count: Math.floor(Math.random() * 3) + 1,
    }));
  }

  // Generate general categories when no program is specified
  private static generateGeneralCategories(): AchievementCategory[] {
    return [
      {
        id: 'general',
        name: 'General',
        description: 'General academy achievements',
        icon: 'school',
        color: '#6B7280',
        achievements_count: 5,
        completed_count: 1,
      },
      {
        id: 'attendance',
        name: 'Attendance',
        description: 'Consistency and attendance achievements',
        icon: 'calendar',
        color: '#059669',
        achievements_count: 3,
        completed_count: 1,
      },
    ];
  }

  // Mock stats for development - now program-aware
  static generateMockStats(program?: Program): StudentAchievementStats {
    const totalAchievements = program ? 20 + Math.floor(Math.random() * 15) : 10;
    const completedAchievements = Math.floor(totalAchievements * 0.3);
    const totalPoints = completedAchievements * (200 + Math.floor(Math.random() * 300));
    
    return {
      total_achievements: totalAchievements,
      completed_achievements: completedAchievements,
      total_points: totalPoints,
      completion_percentage: Math.floor((completedAchievements / totalAchievements) * 100),
      achievements_by_rarity: {
        common: Math.floor(completedAchievements * 0.5),
        uncommon: Math.floor(completedAchievements * 0.3),
        rare: Math.floor(completedAchievements * 0.15),
        epic: Math.floor(completedAchievements * 0.04),
        legendary: Math.floor(completedAchievements * 0.01),
      },
      achievements_by_type: {
        attendance: Math.floor(completedAchievements * 0.2),
        performance: Math.floor(completedAchievements * 0.4),
        milestone: Math.floor(completedAchievements * 0.2),
        social: Math.floor(completedAchievements * 0.1),
        streak: Math.floor(completedAchievements * 0.05),
        special: Math.floor(completedAchievements * 0.03),
        certification: Math.floor(completedAchievements * 0.02),
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
serviceInstance.getProgramType = AchievementsService.getProgramType;

export const achievementsService = serviceInstance;