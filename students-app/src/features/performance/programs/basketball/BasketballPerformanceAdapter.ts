/**
 * Basketball Performance Adapter
 * 
 * Handles basketball-specific performance calculations, analytics, and recommendations
 */

import { 
  ProgramPerformanceAdapter, 
  BasePerformanceMetric, 
  PerformanceSession, 
  PerformanceChartData, 
  PerformanceAnalytics, 
  TimePeriod,
  ProgramPerformanceConfig 
} from '../../types';

import { 
  BasketballPerformanceMetric, 
  BasketballSession, 
  BasketballSkill, 
  BasketballPosition,
  BASKETBALL_STANDARDS
} from './types';

export class BasketballPerformanceAdapter implements ProgramPerformanceAdapter {
  program = 'basketball' as const;
  
  config: ProgramPerformanceConfig = {
    program: 'basketball',
    displayName: 'Basketball',
    primaryColor: '#F97316', // Orange
    secondaryColor: '#EA580C', // Darker orange
    icon: 'basketball',
    metrics: ['shooting', 'dribbling', 'passing', 'defense', 'rebounding', 'game_stats'],
    chartTypes: ['line', 'bar', 'pie', 'radar'],
    sessionTypes: ['practice', 'scrimmage', 'game', 'skills', 'conditioning'],
    skillLevels: ['beginner', 'recreational', 'intermediate', 'advanced', 'competitive', 'elite'],
    equipment: ['basketball', 'cones', 'agility_ladder', 'resistance_bands'],
  };

  transformMetrics(rawData: any[]): BasePerformanceMetric[] {
    return rawData.map((data, index) => {
      const basketballData = data as BasketballPerformanceMetric;
      
      return {
        id: `basketball_metric_${index}`,
        title: this.getMetricTitle(basketballData),
        value: this.formatMetricValue(basketballData),
        unit: this.getMetricUnit(basketballData),
        type: basketballData.type,
        trend: this.calculateTrend(basketballData, rawData),
        icon: this.getMetricIcon(basketballData),
        color: this.getMetricColor(basketballData),
        category: basketballData.category,
        lastUpdated: basketballData.lastUpdated,
        goal: basketballData.goal,
        personalBest: basketballData.personalBest,
      };
    });
  }

  generateCharts(sessions: PerformanceSession[], period: TimePeriod): PerformanceChartData[] {
    const basketballSessions = sessions.filter(s => s.program === 'basketball') as BasketballSession[];
    
    if (basketballSessions.length === 0) {
      return [];
    }

    const charts: PerformanceChartData[] = [];

    // Shooting accuracy progress
    charts.push(this.generateShootingChart(basketballSessions, period));
    
    // Skills radar chart
    charts.push(this.generateSkillsRadarChart(basketballSessions, period));
    
    // Game statistics trends
    charts.push(this.generateGameStatsChart(basketballSessions, period));

    return charts;
  }

  calculateAnalytics(sessions: PerformanceSession[], period: TimePeriod): PerformanceAnalytics {
    const basketballSessions = sessions.filter(s => s.program === 'basketball') as BasketballSession[];
    
    return {
      program: 'basketball',
      period,
      totalSessions: basketballSessions.length,
      totalDuration: basketballSessions.reduce((sum, session) => sum + session.duration, 0),
      averageRating: basketballSessions.length > 0 
        ? basketballSessions.reduce((sum, session) => sum + (session.rating || 0), 0) / basketballSessions.length
        : 0,
      improvementMetrics: [],
      topAchievements: [],
      goalProgress: [],
      recommendations: this.getBasketballRecommendations(basketballSessions),
      strengths: [],
      areasForImprovement: [],
    };
  }

  validatePerformanceData(data: any): boolean {
    // Validate basketball-specific data
    if (data.skill && !this.isValidSkill(data.skill)) {
      return false;
    }

    if (data.position && !this.isValidPosition(data.position)) {
      return false;
    }

    return true;
  }

  getRecommendations(analytics: PerformanceAnalytics): string[] {
    // Return default recommendations regardless of analytics data for now
    return this.getBasketballRecommendations([]);
  }

  // Private helper methods
  private getMetricTitle(metric: BasketballPerformanceMetric): string {
    if (metric.skill) {
      return `${this.formatSkill(metric.skill)} ${metric.title}`;
    }
    return metric.title;
  }

  private formatMetricValue(metric: BasketballPerformanceMetric): string | number {
    if (metric.accuracy !== undefined) {
      return `${metric.accuracy}%`;
    }
    return metric.value;
  }

  private getMetricUnit(metric: BasketballPerformanceMetric): string | undefined {
    switch (metric.type) {
      case 'percentage':
        return '%';
      case 'count':
        return 'makes';
      default:
        return metric.unit;
    }
  }

  private getMetricIcon(metric: BasketballPerformanceMetric): string {
    if (metric.icon) return metric.icon;
    
    switch (metric.skill) {
      case 'shooting':
        return 'radio-button-on';
      case 'passing':
        return 'swap-horizontal';
      case 'dribbling':
        return 'basketball';
      case 'defense':
        return 'shield';
      default:
        return 'basketball';
    }
  }

  private getMetricColor(metric: BasketballPerformanceMetric): string {
    if (metric.color) return metric.color;
    
    switch (metric.skill) {
      case 'shooting':
        return '#F97316'; // Orange
      case 'passing':
        return '#3B82F6'; // Blue
      case 'dribbling':
        return '#10B981'; // Green
      case 'defense':
        return '#EF4444'; // Red
      case 'rebounding':
        return '#8B5CF6'; // Purple
      default:
        return this.config.primaryColor;
    }
  }

  private calculateTrend(current: BasketballPerformanceMetric, allData: any[]): any {
    // Simplified trend calculation
    return undefined;
  }

  private generateShootingChart(sessions: BasketballSession[], period: TimePeriod): PerformanceChartData {
    const data = sessions.slice(-10).map((session, index) => {
      const shooting = session.skillAssessments.find(s => s.skill === 'shooting');
      return {
        label: session.date.toLocaleDateString().slice(-5),
        value: shooting?.accuracy || 0,
        date: session.date,
      };
    });

    return {
      id: 'basketball_shooting_progress',
      title: 'Shooting Accuracy Progress',
      type: 'line',
      data,
      xAxisLabel: 'Date',
      yAxisLabel: 'Shooting %',
      color: this.config.primaryColor,
      period,
    };
  }

  private generateSkillsRadarChart(sessions: BasketballSession[], period: TimePeriod): PerformanceChartData {
    // Would generate radar chart data for all skills
    return {
      id: 'basketball_skills_radar',
      title: 'Skills Overview',
      type: 'radar',
      data: [],
      period,
    };
  }

  private generateGameStatsChart(sessions: BasketballSession[], period: TimePeriod): PerformanceChartData {
    // Would generate game statistics trends
    return {
      id: 'basketball_game_stats',
      title: 'Game Performance',
      type: 'bar',
      data: [],
      period,
    };
  }

  private getBasketballRecommendations(sessions: BasketballSession[]): string[] {
    return [
      "Focus on consistent shooting form and follow-through",
      "Practice dribbling with both hands to improve ball handling", 
      "Work on defensive positioning and footwork",
      "Increase practice frequency for skill development",
      "Set specific goals for free throw and field goal percentages",
    ];
  }

  private formatSkill(skill: BasketballSkill): string {
    return skill.charAt(0).toUpperCase() + skill.slice(1).replace('_', ' ');
  }

  private isValidSkill(skill: string): skill is BasketballSkill {
    return [
      'shooting', 'dribbling', 'passing', 'defense', 
      'rebounding', 'footwork', 'game_iq'
    ].includes(skill);
  }

  private isValidPosition(position: string): position is BasketballPosition {
    return [
      'point_guard', 'shooting_guard', 'small_forward', 
      'power_forward', 'center'
    ].includes(position);
  }
}