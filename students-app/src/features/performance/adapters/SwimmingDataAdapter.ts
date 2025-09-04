import {
  SwimmingPerformanceCard,
  SwimmingStrokeCard,
  SwimmingPerformanceDetail,
  SwimmingTimeDetail,
  SwimmingPerformanceGoal,
  SwimmingPerformanceStats,
  SwimmingChartData,
  PoolSize,
  SwimmingStroke,
} from '../programs/swimming/types';

/**
 * Swimming Data Adapter
 * 
 * This adapter transforms raw performance data into swimming-specific formats
 * and provides extensibility patterns for other programs (basketball, football, etc.)
 * 
 * Future programs can follow this pattern:
 * - BasketballDataAdapter
 * - FootballDataAdapter
 * - MusicDataAdapter
 */

export interface PerformanceDataAdapter<TPerformanceCard, TPerformanceDetail, TStats> {
  transformPerformanceCard(rawData: any): TPerformanceCard;
  transformPerformanceDetail(rawData: any): TPerformanceDetail;
  transformStats(rawData: any): TStats;
  filterByPeriod(data: any[], period: string): any[];
  generateChartData(rawData: any[]): any;
}

export class SwimmingDataAdapter implements PerformanceDataAdapter<SwimmingPerformanceCard, SwimmingPerformanceDetail, SwimmingPerformanceStats> {
  
  /**
   * Transform raw swimming performance data into SwimmingPerformanceCard format
   */
  transformPerformanceCard(rawData: any): SwimmingPerformanceCard {
    return {
      id: rawData.id || `event_${Date.now()}`,
      title: this.formatEventTitle(rawData.distance, rawData.stroke),
      distance: rawData.distance || 50,
      stroke: this.normalizeStroke(rawData.stroke),
      poolSize: this.normalizePoolSize(rawData.poolSize),
      bestTime: rawData.bestTime || '00:00.00',
      bestTimeInSeconds: rawData.bestTimeInSeconds || 0,
      lastSwam: rawData.lastSwam || new Date().toISOString().split('T')[0],
      totalRaces: rawData.totalRaces || 0,
      improvement: this.calculateImprovement(rawData),
    };
  }

  /**
   * Transform raw data into detailed swimming performance view
   */
  transformPerformanceDetail(rawData: any): SwimmingPerformanceDetail {
    const performanceCard = this.transformPerformanceCard(rawData);
    
    return {
      performance: {
        title: performanceCard.title,
        distance: performanceCard.distance,
        stroke: performanceCard.stroke,
        poolSize: performanceCard.poolSize,
      },
      bestTime: {
        time: performanceCard.bestTime,
        timeInSeconds: performanceCard.bestTimeInSeconds,
        date: rawData.bestTimeDate || performanceCard.lastSwam,
        venue: rawData.bestTimeVenue || 'Academy Pool',
      },
      clubRecord: rawData.clubRecord ? {
        time: rawData.clubRecord.time,
        timeInSeconds: rawData.clubRecord.timeInSeconds,
        holder: rawData.clubRecord.holder || 'Club Record',
        date: rawData.clubRecord.date,
      } : undefined,
      goals: this.transformGoals(rawData.goals || []),
      allTimes: this.transformAllTimes(rawData.allTimes || []),
      chartData: this.generateChartData(rawData.chartData || rawData.allTimes || []),
      statistics: this.transformStats(rawData.statistics || rawData),
    };
  }

  /**
   * Transform raw stats into swimming performance stats
   */
  transformStats(rawData: any): SwimmingPerformanceStats {
    return {
      totalRaces: rawData.totalRaces || 0,
      averageTime: rawData.averageTime || '00:00.00',
      averageTimeInSeconds: rawData.averageTimeInSeconds || 0,
      improvement: rawData.improvement ? {
        percentage: rawData.improvement.percentage || 0,
        timeChange: rawData.improvement.timeChange || '0.00',
        period: rawData.improvement.period || 'this season',
      } : {
        percentage: 0,
        timeChange: '0.00',
        period: 'this season',
      },
      consistency: rawData.consistency || 0,
    };
  }

  /**
   * Filter data by time period
   */
  filterByPeriod(data: SwimmingTimeDetail[], period: string): SwimmingTimeDetail[] {
    const now = new Date();
    let filterDate: Date;

    switch (period.toLowerCase()) {
      case 'week':
        filterDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        filterDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'season':
        filterDate = new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000); // ~4 months
        break;
      case 'year':
        filterDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        return data;
    }

    return data.filter(timeDetail => {
      const timeDate = new Date(timeDetail.date);
      return timeDate >= filterDate;
    });
  }

  /**
   * Generate chart data from swimming times
   */
  generateChartData(rawData: any[]): SwimmingChartData {
    const chartData = rawData
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((item, index) => ({
        label: this.formatDateForChart(item.date),
        value: item.timeInSeconds || item.time ? this.timeStringToSeconds(item.time) : 0,
        formattedValue: item.time || this.secondsToTimeString(item.timeInSeconds || 0),
      }));

    // Calculate goal lines
    const bestTime = Math.min(...chartData.map(d => d.value).filter(v => v > 0));
    const goalLine = bestTime * 0.97; // 3% improvement as season goal

    return {
      data: chartData,
      goalLine,
      personalBestLine: bestTime,
    };
  }

  // Private helper methods

  private formatEventTitle(distance: number, stroke: string): string {
    return `${distance}m ${this.capitalizeStroke(stroke)}`;
  }

  private normalizeStroke(stroke: string): SwimmingStroke {
    const strokeMap: Record<string, SwimmingStroke> = {
      'free': 'freestyle',
      'freestyle': 'freestyle',
      'back': 'backstroke',
      'backstroke': 'backstroke',
      'breast': 'breaststroke',
      'breaststroke': 'breaststroke',
      'fly': 'butterfly',
      'butterfly': 'butterfly',
      'im': 'individual medley',
      'individual medley': 'individual medley',
      'medley': 'individual medley',
    };

    return strokeMap[stroke.toLowerCase()] || 'freestyle';
  }

  private normalizePoolSize(poolSize: string): PoolSize {
    if (poolSize?.includes('25')) return '25m';
    if (poolSize?.includes('50')) return '50m';
    return '25m';
  }

  private capitalizeStroke(stroke: string): string {
    const strokes: Record<string, string> = {
      'freestyle': 'Freestyle',
      'backstroke': 'Backstroke',
      'breaststroke': 'Breaststroke',
      'butterfly': 'Butterfly',
      'individual medley': 'Individual Medley',
    };

    return strokes[stroke] || stroke.charAt(0).toUpperCase() + stroke.slice(1);
  }

  private calculateImprovement(rawData: any): number {
    if (rawData.improvement?.percentage) {
      return rawData.improvement.percentage;
    }

    // Calculate from times if available
    const times = rawData.allTimes || [];
    if (times.length < 2) return 0;

    const sortedTimes = times.sort((a: any, b: any) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const firstTime = sortedTimes[0].timeInSeconds || this.timeStringToSeconds(sortedTimes[0].time);
    const lastTime = sortedTimes[sortedTimes.length - 1].timeInSeconds || 
      this.timeStringToSeconds(sortedTimes[sortedTimes.length - 1].time);

    if (firstTime === 0 || lastTime === 0) return 0;

    return Math.round(((firstTime - lastTime) / firstTime) * 100 * 10) / 10;
  }

  private transformGoals(rawGoals: any[]): SwimmingPerformanceGoal[] {
    return rawGoals.map((goal, index) => ({
      id: goal.id || `goal_${index}`,
      targetTime: goal.targetTime || '00:00.00',
      targetTimeInSeconds: goal.targetTimeInSeconds || this.timeStringToSeconds(goal.targetTime || '00:00.00'),
      label: goal.label || 'Performance Goal',
      type: goal.type || 'personal',
      achieved: goal.achieved || false,
      achievedDate: goal.achievedDate,
    }));
  }

  private transformAllTimes(rawTimes: any[]): SwimmingTimeDetail[] {
    return rawTimes.map((time, index) => ({
      id: time.id || `time_${index}`,
      time: time.time || '00:00.00',
      timeInSeconds: time.timeInSeconds || this.timeStringToSeconds(time.time || '00:00.00'),
      date: time.date || new Date().toISOString().split('T')[0],
      venue: time.venue || 'Academy Pool',
      heat: time.heat,
      isPB: time.isPB || false,
    }));
  }

  private formatDateForChart(dateString: string): string {
    const date = new Date(dateString);
    return `${String(date.getMonth() + 1).padStart(2, '0')}:${String(date.getDate()).padStart(2, '0')}`;
  }

  private timeStringToSeconds(timeString: string): number {
    if (!timeString || timeString === '00:00.00') return 0;
    
    const parts = timeString.split(':');
    if (parts.length === 2) {
      const minutes = parseInt(parts[0], 10);
      const seconds = parseFloat(parts[1]);
      return minutes * 60 + seconds;
    }
    
    return parseFloat(timeString) || 0;
  }

  private secondsToTimeString(seconds: number): string {
    if (seconds === 0) return '00:00.00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${String(minutes).padStart(2, '0')}:${remainingSeconds.toFixed(2).padStart(5, '0')}`;
  }
}

// Export singleton instance
export const swimmingDataAdapter = new SwimmingDataAdapter();

/**
 * Future Program Adapters
 * 
 * This pattern can be extended for other Academy programs:
 * 
 * export class BasketballDataAdapter implements PerformanceDataAdapter<BasketballEventCard, BasketballEventDetail, BasketballStats> {
 *   // Transform shooting percentages, game stats, skill assessments
 * }
 * 
 * export class FootballDataAdapter implements PerformanceDataAdapter<FootballEventCard, FootballEventDetail, FootballStats> {
 *   // Transform speed times, skill drills, match performance
 * }
 * 
 * export class MusicDataAdapter implements PerformanceDataAdapter<MusicEventCard, MusicEventDetail, MusicStats> {
 *   // Transform practice sessions, recital performance, technique assessments
 * }
 */