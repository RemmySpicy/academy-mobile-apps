/**
 * Swimming Performance Adapter
 * 
 * Handles swimming-specific performance calculations, analytics, and recommendations
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
  SwimmingPerformanceMetric, 
  SwimmingSession, 
  SwimmingStroke, 
  SwimmingDistance, 
  SwimmingAnalytics,
  SwimmingPersonalBest,
  SWIMMING_STANDARDS,
  SwimmingSkillLevel
} from './types';

export class SwimmingPerformanceAdapter implements ProgramPerformanceAdapter {
  program = 'swimming' as const;
  
  config: ProgramPerformanceConfig = {
    program: 'swimming',
    displayName: 'Swimming',
    primaryColor: '#0EA5E9', // Sky blue
    secondaryColor: '#0284C7', // Darker blue
    icon: 'water',
    metrics: ['time', 'distance', 'stroke_rate', 'technique', 'endurance'],
    chartTypes: ['line', 'bar', 'radar'],
    sessionTypes: ['training', 'technique', 'endurance', 'sprint', 'recovery'],
    skillLevels: ['beginner', 'intermediate', 'advanced', 'competitive', 'elite'],
    equipment: ['kickboard', 'pull_buoy', 'fins', 'paddles', 'snorkel'],
  };

  transformMetrics(rawData: any[]): BasePerformanceMetric[] {
    return rawData.map((data, index) => {
      const swimmingData = data as SwimmingPerformanceMetric;
      
      return {
        id: `swimming_metric_${index}`,
        title: this.getMetricTitle(swimmingData),
        value: this.formatMetricValue(swimmingData),
        unit: this.getMetricUnit(swimmingData),
        type: swimmingData.type,
        trend: this.calculateTrend(swimmingData, rawData),
        icon: this.getMetricIcon(swimmingData),
        color: this.getMetricColor(swimmingData),
        category: swimmingData.category,
        lastUpdated: swimmingData.lastUpdated,
        goal: swimmingData.goal,
        personalBest: swimmingData.personalBest,
      };
    });
  }

  generateCharts(sessions: PerformanceSession[], period: TimePeriod): PerformanceChartData[] {
    const swimmingSessions = sessions.filter(s => s.program === 'swimming') as SwimmingSession[];
    
    if (swimmingSessions.length === 0) {
      return [];
    }

    const charts: PerformanceChartData[] = [];

    // Swimming Times Progress Chart
    charts.push(this.generateTimesProgressChart(swimmingSessions, period));
    
    // Distance Covered Chart
    charts.push(this.generateDistanceChart(swimmingSessions, period));
    
    // Stroke Distribution Chart
    charts.push(this.generateStrokeDistributionChart(swimmingSessions, period));
    
    // Technique Scores Chart
    charts.push(this.generateTechniqueChart(swimmingSessions, period));

    return charts;
  }

  calculateAnalytics(sessions: PerformanceSession[], period: TimePeriod): PerformanceAnalytics {
    const swimmingSessions = sessions.filter(s => s.program === 'swimming') as SwimmingSession[];
    
    const totalSessions = swimmingSessions.length;
    const totalDuration = swimmingSessions.reduce((sum, session) => sum + session.duration, 0);
    const averageRating = swimmingSessions.length > 0 
      ? swimmingSessions.reduce((sum, session) => sum + (session.rating || 0), 0) / swimmingSessions.length
      : 0;

    // Calculate swimming-specific analytics
    const swimmingAnalytics = this.calculateSwimmingAnalytics(swimmingSessions);

    return {
      program: 'swimming',
      period,
      totalSessions,
      totalDuration,
      averageRating,
      improvementMetrics: this.calculateImprovementMetrics(swimmingSessions),
      topAchievements: [], // Would be populated from achievements service
      goalProgress: [], // Would be populated from goals service
      recommendations: this.getRecommendations(swimmingAnalytics),
      strengths: swimmingAnalytics.strengthsAndWeaknesses.strengths,
      areasForImprovement: swimmingAnalytics.strengthsAndWeaknesses.improvements,
    };
  }

  validatePerformanceData(data: any): boolean {
    // Validate swimming-specific data structure
    if (!data.stroke || !this.isValidStroke(data.stroke)) {
      return false;
    }

    if (data.distance && !this.isValidDistance(data.distance)) {
      return false;
    }

    if (data.timeInSeconds && (typeof data.timeInSeconds !== 'number' || data.timeInSeconds <= 0)) {
      return false;
    }

    return true;
  }

  getRecommendations(analytics: PerformanceAnalytics | SwimmingAnalytics): string[] {
    const swimmingAnalytics = analytics as SwimmingAnalytics;
    const recommendations: string[] = [];

    // Return default recommendations if analytics is not available or incomplete
    if (!swimmingAnalytics || typeof swimmingAnalytics !== 'object') {
      return this.getDefaultRecommendations();
    }

    // Analyze training consistency
    if (swimmingAnalytics.totalSessions !== undefined && swimmingAnalytics.totalSessions < 3) {
      recommendations.push("Increase training frequency to 3-4 sessions per week for better progress");
    }

    // Analyze technique scores (with safety checks)
    if (swimmingAnalytics.techniqueScores && Array.isArray(swimmingAnalytics.techniqueScores) && swimmingAnalytics.techniqueScores.length > 0) {
      const avgTechnique = swimmingAnalytics.techniqueScores.reduce((sum, score) => 
        sum + (score?.overallTechnique || 0), 0) / swimmingAnalytics.techniqueScores.length;
      
      if (avgTechnique < 70) {
        recommendations.push("Focus on technique work with drills and video analysis");
      }
    }

    // Analyze stroke balance
    if (swimmingAnalytics.favoriteStroke) {
      recommendations.push(`Consider working on other strokes beyond ${swimmingAnalytics.favoriteStroke} for balanced development`);
    }

    // Distance-based recommendations
    if (swimmingAnalytics.totalDistance !== undefined && swimmingAnalytics.totalDistance < 5000) {
      recommendations.push("Gradually increase weekly distance to build endurance base");
    }

    // If no specific recommendations, return default ones
    if (recommendations.length === 0) {
      return this.getDefaultRecommendations();
    }

    return recommendations;
  }

  private getDefaultRecommendations(): string[] {
    return [
      "Start with consistent training sessions 3-4 times per week",
      "Focus on proper breathing technique and body position",
      "Practice all four strokes for balanced development",
      "Set realistic goals and track your progress regularly",
      "Work with a qualified instructor to improve technique",
    ];
  }

  // Private helper methods
  private getMetricTitle(metric: SwimmingPerformanceMetric): string {
    if (metric.stroke && metric.distance) {
      return `${metric.distance}m ${this.formatStroke(metric.stroke)}`;
    }
    return metric.title;
  }

  private formatMetricValue(metric: SwimmingPerformanceMetric): string | number {
    if (metric.type === 'time' && metric.timeInSeconds) {
      return this.formatTime(metric.timeInSeconds);
    }
    return metric.value;
  }

  private getMetricUnit(metric: SwimmingPerformanceMetric): string | undefined {
    switch (metric.type) {
      case 'time':
        return 'min:sec';
      case 'distance':
        return 'm';
      case 'percentage':
        return '%';
      default:
        return metric.unit;
    }
  }

  private getMetricIcon(metric: SwimmingPerformanceMetric): string {
    if (metric.icon) return metric.icon;
    
    switch (metric.type) {
      case 'time':
        return 'timer';
      case 'distance':
        return 'trending-up';
      case 'percentage':
        return 'analytics';
      default:
        return 'water';
    }
  }

  private getMetricColor(metric: SwimmingPerformanceMetric): string {
    if (metric.color) return metric.color;
    
    switch (metric.stroke) {
      case 'freestyle':
        return '#0EA5E9'; // Sky blue
      case 'backstroke':
        return '#8B5CF6'; // Purple
      case 'breaststroke':
        return '#10B981'; // Green
      case 'butterfly':
        return '#F59E0B'; // Amber
      case 'individual_medley':
        return '#EF4444'; // Red
      default:
        return this.config.primaryColor;
    }
  }

  private calculateTrend(current: SwimmingPerformanceMetric, allData: any[]): any {
    // Simple trend calculation - would be more sophisticated in real implementation
    const previousData = allData.find(d => 
      d.stroke === current.stroke && 
      d.distance === current.distance && 
      d.id !== current.id
    );

    if (!previousData || !current.timeInSeconds || !previousData.timeInSeconds) {
      return undefined;
    }

    const improvement = previousData.timeInSeconds - current.timeInSeconds;
    const percentage = Math.abs(improvement / previousData.timeInSeconds * 100);
    
    return {
      direction: improvement > 0 ? 'up' : improvement < 0 ? 'down' : 'neutral',
      percentage: Math.round(percentage * 10) / 10,
      period: 'vs last session',
    };
  }

  private generateTimesProgressChart(sessions: SwimmingSession[], period: TimePeriod): PerformanceChartData {
    const data = sessions.slice(-10).map((session, index) => ({
      label: session.date.toLocaleDateString().slice(-5),
      value: session.averagePace,
      date: session.date,
    }));

    return {
      id: 'swimming_times_progress',
      title: 'Swimming Times Progress',
      type: 'line',
      data,
      xAxisLabel: 'Date',
      yAxisLabel: 'Average Pace (sec/100m)',
      color: this.config.primaryColor,
      period,
    };
  }

  private generateDistanceChart(sessions: SwimmingSession[], period: TimePeriod): PerformanceChartData {
    const data = sessions.slice(-10).map((session, index) => ({
      label: session.date.toLocaleDateString().slice(-5),
      value: session.totalDistance,
      date: session.date,
    }));

    return {
      id: 'swimming_distance',
      title: 'Training Distance',
      type: 'bar',
      data,
      xAxisLabel: 'Date',
      yAxisLabel: 'Distance (m)',
      color: this.config.secondaryColor,
      period,
    };
  }

  private generateStrokeDistributionChart(sessions: SwimmingSession[], period: TimePeriod): PerformanceChartData {
    const strokeCounts: Record<SwimmingStroke, number> = {
      freestyle: 0,
      backstroke: 0,
      breaststroke: 0,
      butterfly: 0,
      individual_medley: 0,
    };

    sessions.forEach(session => {
      session.sets.forEach(set => {
        strokeCounts[set.stroke] += set.repetitions * set.distance;
      });
    });

    const data = Object.entries(strokeCounts)
      .filter(([_, distance]) => distance > 0)
      .map(([stroke, distance]) => ({
        label: this.formatStroke(stroke as SwimmingStroke),
        value: distance,
        color: this.getMetricColor({ stroke: stroke as SwimmingStroke } as SwimmingPerformanceMetric),
      }));

    return {
      id: 'swimming_stroke_distribution',
      title: 'Stroke Distribution',
      type: 'pie',
      data,
      period,
    };
  }

  private generateTechniqueChart(sessions: SwimmingSession[], period: TimePeriod): PerformanceChartData {
    const recentSessions = sessions.slice(-5);
    const avgTechnique = recentSessions.reduce((sum, session) => {
      const sessionAvg = session.technique.reduce((s, t) => s + t.overallTechnique, 0) / session.technique.length;
      return sum + sessionAvg;
    }, 0) / recentSessions.length;

    const data = recentSessions.map((session, index) => ({
      label: session.date.toLocaleDateString().slice(-5),
      value: session.technique.reduce((s, t) => s + t.overallTechnique, 0) / session.technique.length,
      date: session.date,
    }));

    return {
      id: 'swimming_technique',
      title: 'Technique Scores',
      type: 'line',
      data,
      xAxisLabel: 'Date',
      yAxisLabel: 'Technique Score (0-100)',
      color: '#10B981',
      period,
    };
  }

  private calculateSwimmingAnalytics(sessions: SwimmingSession[]): SwimmingAnalytics {
    const totalDistance = sessions.reduce((sum, session) => sum + session.totalDistance, 0);
    const totalSessions = sessions.length;
    const averageSessionDuration = sessions.reduce((sum, session) => sum + session.duration, 0) / sessions.length;

    // Calculate favorite stroke
    const strokeDistances: Record<SwimmingStroke, number> = {
      freestyle: 0,
      backstroke: 0,
      breaststroke: 0,
      butterfly: 0,
      individual_medley: 0,
    };

    sessions.forEach(session => {
      session.sets.forEach(set => {
        strokeDistances[set.stroke] += set.repetitions * set.distance;
      });
    });

    const favoriteStroke = Object.entries(strokeDistances)
      .reduce((a, b) => strokeDistances[a[0] as SwimmingStroke] > strokeDistances[b[0] as SwimmingStroke] ? a : b)[0] as SwimmingStroke;

    return {
      totalDistance,
      totalSessions,
      averageSessionDuration,
      favoriteStroke,
      personalBests: [], // Would be calculated from session data
      improvements: [], // Would be calculated from historical data
      techniqueScores: sessions.flatMap(s => s.technique),
      weeklyProgress: this.calculateWeeklyProgress(sessions),
      strengthsAndWeaknesses: this.analyzeStrengthsAndWeaknesses(sessions),
    };
  }

  private calculateImprovementMetrics(sessions: SwimmingSession[]): any[] {
    // Simplified improvement calculation
    return [];
  }

  private calculateWeeklyProgress(sessions: SwimmingSession[]): any[] {
    // Group sessions by week and calculate progress
    return [];
  }

  private analyzeStrengthsAndWeaknesses(sessions: SwimmingSession[]): any {
    return {
      strengths: ['Consistent training', 'Good technique'],
      improvements: ['Increase distance', 'Work on sprint speed'],
      recommendations: ['Focus on interval training', 'Add more technique drills'],
    };
  }

  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toFixed(2).padStart(5, '0')}`;
  }

  private formatStroke(stroke: SwimmingStroke): string {
    return stroke.charAt(0).toUpperCase() + stroke.slice(1).replace('_', ' ');
  }

  private isValidStroke(stroke: string): stroke is SwimmingStroke {
    return ['freestyle', 'backstroke', 'breaststroke', 'butterfly', 'individual_medley'].includes(stroke);
  }

  private isValidDistance(distance: number): distance is SwimmingDistance {
    return [25, 50, 100, 200, 400, 800, 1500].includes(distance);
  }
}