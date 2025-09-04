/**
 * Football Performance Adapter
 * 
 * Handles football-specific performance calculations, analytics, and recommendations
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
  FootballPerformanceMetric, 
  FootballSession, 
  FootballSkill, 
  FootballPosition,
  FOOTBALL_STANDARDS
} from './types';

export class FootballPerformanceAdapter implements ProgramPerformanceAdapter {
  program = 'football' as const;
  
  config: ProgramPerformanceConfig = {
    program: 'football',
    displayName: 'Football',
    primaryColor: '#22C55E', // Green
    secondaryColor: '#16A34A', // Darker green
    icon: 'football',
    metrics: ['passing', 'shooting', 'dribbling', 'defending', 'fitness', 'tactical'],
    chartTypes: ['line', 'bar', 'pie', 'radar'],
    sessionTypes: ['training', 'match', 'fitness', 'tactical', 'technical'],
    skillLevels: ['beginner', 'youth', 'intermediate', 'advanced', 'semi_pro', 'professional'],
    equipment: ['football', 'cones', 'goals', 'bibs', 'agility_poles'],
  };

  transformMetrics(rawData: any[]): BasePerformanceMetric[] {
    return rawData.map((data, index) => {
      const footballData = data as FootballPerformanceMetric;
      
      return {
        id: `football_metric_${index}`,
        title: this.getMetricTitle(footballData),
        value: this.formatMetricValue(footballData),
        unit: this.getMetricUnit(footballData),
        type: footballData.type,
        trend: this.calculateTrend(footballData, rawData),
        icon: this.getMetricIcon(footballData),
        color: this.getMetricColor(footballData),
        category: footballData.category,
        lastUpdated: footballData.lastUpdated,
        goal: footballData.goal,
        personalBest: footballData.personalBest,
      };
    });
  }

  generateCharts(sessions: PerformanceSession[], period: TimePeriod): PerformanceChartData[] {
    const footballSessions = sessions.filter(s => s.program === 'football') as FootballSession[];
    
    if (footballSessions.length === 0) {
      return [];
    }

    const charts: PerformanceChartData[] = [];

    // Technical skills progress
    charts.push(this.generateTechnicalSkillsChart(footballSessions, period));
    
    // Physical performance
    charts.push(this.generatePhysicalChart(footballSessions, period));
    
    // Match performance trends
    charts.push(this.generateMatchPerformanceChart(footballSessions, period));

    return charts;
  }

  calculateAnalytics(sessions: PerformanceSession[], period: TimePeriod): PerformanceAnalytics {
    const footballSessions = sessions.filter(s => s.program === 'football') as FootballSession[];
    
    return {
      program: 'football',
      period,
      totalSessions: footballSessions.length,
      totalDuration: footballSessions.reduce((sum, session) => sum + session.duration, 0),
      averageRating: footballSessions.length > 0 
        ? footballSessions.reduce((sum, session) => sum + (session.rating || 0), 0) / footballSessions.length
        : 0,
      improvementMetrics: [],
      topAchievements: [],
      goalProgress: [],
      recommendations: this.getFootballRecommendations(footballSessions),
      strengths: [],
      areasForImprovement: [],
    };
  }

  validatePerformanceData(data: any): boolean {
    // Validate football-specific data
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
    return this.getFootballRecommendations([]);
  }

  // Private helper methods
  private getMetricTitle(metric: FootballPerformanceMetric): string {
    if (metric.skill) {
      return `${this.formatSkill(metric.skill)} ${metric.title}`;
    }
    return metric.title;
  }

  private formatMetricValue(metric: FootballPerformanceMetric): string | number {
    if (metric.accuracy !== undefined) {
      return `${metric.accuracy}%`;
    }
    if (metric.speed !== undefined) {
      return `${metric.speed} km/h`;
    }
    return metric.value;
  }

  private getMetricUnit(metric: FootballPerformanceMetric): string | undefined {
    switch (metric.type) {
      case 'percentage':
        return '%';
      case 'distance':
        return 'm';
      default:
        return metric.unit;
    }
  }

  private getMetricIcon(metric: FootballPerformanceMetric): string {
    if (metric.icon) return metric.icon;
    
    switch (metric.skill) {
      case 'passing':
        return 'share';
      case 'shooting':
        return 'radio-button-on';
      case 'dribbling':
        return 'football';
      case 'defending':
        return 'shield';
      case 'speed':
        return 'flash';
      case 'stamina':
        return 'battery-charging';
      default:
        return 'football';
    }
  }

  private getMetricColor(metric: FootballPerformanceMetric): string {
    if (metric.color) return metric.color;
    
    switch (metric.skill) {
      case 'passing':
        return '#3B82F6'; // Blue
      case 'shooting':
        return '#F59E0B'; // Yellow/Gold
      case 'dribbling':
        return '#10B981'; // Green
      case 'defending':
        return '#EF4444'; // Red
      case 'speed':
        return '#8B5CF6'; // Purple
      case 'stamina':
        return '#06B6D4'; // Cyan
      default:
        return this.config.primaryColor;
    }
  }

  private calculateTrend(current: FootballPerformanceMetric, allData: any[]): any {
    // Simplified trend calculation
    return undefined;
  }

  private generateTechnicalSkillsChart(sessions: FootballSession[], period: TimePeriod): PerformanceChartData {
    const data = sessions.slice(-10).map((session, index) => {
      const avgTechnical = session.skillAssessments
        .filter(s => ['passing', 'shooting', 'dribbling', 'first_touch'].includes(s.skill))
        .reduce((sum, s) => sum + s.rating, 0) / 4;
      
      return {
        label: session.date.toLocaleDateString().slice(-5),
        value: avgTechnical,
        date: session.date,
      };
    });

    return {
      id: 'football_technical_skills',
      title: 'Technical Skills Progress',
      type: 'line',
      data,
      xAxisLabel: 'Date',
      yAxisLabel: 'Skill Rating (1-10)',
      color: this.config.primaryColor,
      period,
    };
  }

  private generatePhysicalChart(sessions: FootballSession[], period: TimePeriod): PerformanceChartData {
    const data = sessions
      .filter(s => s.physicalStats)
      .slice(-10)
      .map((session, index) => ({
        label: session.date.toLocaleDateString().slice(-5),
        value: session.physicalStats?.distanceCovered || 0,
        date: session.date,
      }));

    return {
      id: 'football_physical_performance',
      title: 'Distance Covered',
      type: 'bar',
      data,
      xAxisLabel: 'Date',
      yAxisLabel: 'Distance (km)',
      color: '#06B6D4',
      period,
    };
  }

  private generateMatchPerformanceChart(sessions: FootballSession[], period: TimePeriod): PerformanceChartData {
    // Would generate match performance data
    return {
      id: 'football_match_performance',
      title: 'Match Performance',
      type: 'line',
      data: [],
      period,
    };
  }

  private getFootballRecommendations(sessions: FootballSession[]): string[] {
    return [
      "Focus on first touch and ball control in tight spaces",
      "Improve passing accuracy under pressure",
      "Work on shooting technique and power", 
      "Enhance defensive positioning and timing",
      "Build endurance through interval running",
      "Practice both feet for balanced development",
    ];
  }

  private formatSkill(skill: FootballSkill): string {
    return skill.charAt(0).toUpperCase() + skill.slice(1).replace('_', ' ');
  }

  private isValidSkill(skill: string): skill is FootballSkill {
    return [
      'passing', 'shooting', 'dribbling', 'defending', 'crossing',
      'heading', 'first_touch', 'speed', 'agility', 'stamina', 'tactical_awareness'
    ].includes(skill);
  }

  private isValidPosition(position: string): position is FootballPosition {
    return [
      'goalkeeper', 'defender', 'midfielder', 'forward',
      'left_back', 'right_back', 'center_back', 'defensive_midfielder',
      'attacking_midfielder', 'winger', 'striker'
    ].includes(position);
  }
}