# Achievements API Documentation

The Academy Apps feature a comprehensive achievements API that integrates with the multi-program context system to provide program-aware gamification functionality.

## 🏆 API Overview

The Achievements API provides:
- **Program-Aware Achievement Data** - Achievements filtered by current program context
- **Multi-Program Support** - Dynamic achievement generation for 7+ program types  
- **Real-time Progress Tracking** - Live updates on achievement progress
- **Celebration System** - Achievement unlock notifications and animations
- **Leaderboard Integration** - Competitive rankings within programs

## 🎯 Core Endpoints

### Achievement Management

#### `GET /api/v1/achievements`
Get achievements for the current program context.

**Headers:**
- `Authorization: Bearer {jwt_token}` (automatic)
- `X-Program-Context: {program_id}` (automatic via program context)

**Query Parameters:**
```typescript
interface GetAchievementsRequest {
  program_id?: string;        // Override program context
  course_id?: string;         // Filter by specific course
  category?: string;          // Filter by achievement category
  type?: AchievementType;     // Filter by achievement type
  status?: AchievementStatus; // Filter by completion status
  rarity?: AchievementRarity; // Filter by rarity tier
  include_hidden?: boolean;   // Include hidden/locked achievements
  limit?: number;             // Pagination limit
  offset?: number;            // Pagination offset
}
```

**Response:**
```typescript
interface GetAchievementsResponse {
  achievements: Achievement[];
  total_count: number;
  categories: AchievementCategory[];
  user_stats: StudentAchievementStats;
}
```

**Example Usage:**
```typescript
// Automatic program context filtering
const achievements = await apiClient.get('/api/v1/achievements');

// Manual program filtering
const swimmingAchievements = await apiClient.get('/api/v1/achievements', {
  params: { 
    program_id: 'swimming-program-1',
    status: 'available' 
  }
});
```

#### `POST /api/v1/achievements/{achievement_id}/unlock`
Unlock an achievement for the current user.

**Request Body:**
```typescript
interface UnlockAchievementRequest {
  progress_data?: {
    current_value: number;
    additional_data?: Record<string, any>;
  };
  celebration?: boolean; // Trigger celebration animation
}
```

**Response:**
```typescript
interface UnlockAchievementResponse {
  achievement: Achievement;
  celebration_data?: AchievementCelebration;
  points_earned: number;
  new_level?: number;
}
```

#### `GET /api/v1/achievements/categories`
Get achievement categories for the current program.

**Response:**
```typescript
interface AchievementCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  achievements_count: number;
  completed_count: number;
  program_id: string;
}
```

### Statistics & Progress

#### `GET /api/v1/achievements/stats`
Get achievement statistics for the current user and program.

**Response:**
```typescript
interface StudentAchievementStats {
  total_achievements: number;
  completed_achievements: number;
  total_points: number;
  completion_percentage: number;
  achievements_by_rarity: {
    common: number;
    uncommon: number; 
    rare: number;
    epic: number;
    legendary: number;
  };
  achievements_by_type: {
    attendance: number;
    performance: number;
    milestone: number;
    social: number;
    streak: number;
    special: number;
    certification: number;
  };
  recent_unlocks: Achievement[];
  next_achievements: Achievement[];
}
```

#### `GET /api/v1/achievements/leaderboard`
Get achievement leaderboard for the current program.

**Query Parameters:**
```typescript
interface GetLeaderboardRequest {
  time_period?: 'week' | 'month' | 'all_time';
  limit?: number;
  category?: string;
}
```

**Response:**
```typescript
interface GetLeaderboardResponse {
  leaderboard: AchievementLeaderboard[];
  current_user_rank?: number;
  current_user_points?: number;
}

interface AchievementLeaderboard {
  user_id: string;
  user_name: string;
  user_avatar?: string;
  total_points: number;
  achievements_count: number;
  rank: number;
  program_id: string;
}
```

## 🎮 Program-Specific Integration

### Multi-Program Context
The achievements API seamlessly integrates with the multi-program context system:

```typescript
import { useProgramContext, achievementsService } from '@academy/mobile-shared';

function useAchievements() {
  const { currentProgram } = useProgramContext();
  
  // API calls automatically include X-Program-Context header
  const { data: achievements } = useQuery(
    ['achievements', currentProgram?.id],
    () => apiClient.get('/api/v1/achievements'),
    {
      enabled: !!currentProgram,
      staleTime: 5 * 60 * 1000 // 5 minutes
    }
  );
  
  return achievements;
}
```

### Program Type Support
The API supports dynamic achievement generation based on program type:

```typescript
// Swimming Program - Returns water-themed achievements
GET /api/v1/achievements
X-Program-Context: swimming-program-1

// Response includes:
{
  "achievements": [
    {
      "id": "1",
      "title": "First Stroke",
      "description": "Complete your first swimming lesson",
      "category": "Technique",
      "icon": "water",
      "icon_color": "#2563EB"
    }
  ],
  "categories": [
    {
      "id": "technique", 
      "name": "Technique",
      "description": "Swimming technique achievements",
      "icon": "water",
      "color": "#2563EB"
    }
  ]
}

// Basketball Program - Returns sports-themed achievements  
GET /api/v1/achievements
X-Program-Context: basketball-program-1

// Response includes:
{
  "achievements": [
    {
      "id": "1", 
      "title": "First Basket",
      "description": "Score your first basketball shot",
      "category": "Shooting",
      "icon": "basketball", 
      "icon_color": "#EA580C"
    }
  ],
  "categories": [
    {
      "id": "shooting",
      "name": "Shooting", 
      "description": "Basketball shooting achievements",
      "icon": "basketball",
      "color": "#EA580C"
    }
  ]
}
```

## 🔧 Service Integration

### AchievementsService Mock Data
During development, the `AchievementsService` provides program-aware mock data:

```typescript
// Mock data automatically adapts to program context
const { currentProgram } = useProgramContext();

// Generate program-specific mock data
const mockAchievements = achievementsService.generateMockAchievements(currentProgram);
const mockCategories = achievementsService.generateMockCategories(currentProgram);
const mockStats = achievementsService.generateMockStats(currentProgram);

// Data structure matches API response format
interface MockAchievement extends Achievement {
  program_id: string;  // Matches current program
  icon_color: string;  // Program theme color
  category: string;    // Program-specific category
}
```

### API Client Integration
The achievements endpoints integrate with the existing API client:

```typescript
import { apiClient } from '@academy/mobile-shared';

class AchievementsAPI {
  // Get achievements with automatic program context
  async getAchievements(params?: GetAchievementsRequest) {
    return await apiClient.get<GetAchievementsResponse>('/api/v1/achievements', {
      params
    });
  }
  
  // Unlock achievement with celebration
  async unlockAchievement(achievementId: string, data?: UnlockAchievementRequest) {
    return await apiClient.post<UnlockAchievementResponse>(
      `/api/v1/achievements/${achievementId}/unlock`, 
      data
    );
  }
  
  // Get program-specific leaderboard
  async getLeaderboard(params?: GetLeaderboardRequest) {
    return await apiClient.get<GetLeaderboardResponse>('/api/v1/achievements/leaderboard', {
      params
    });
  }
}

export const achievementsAPI = new AchievementsAPI();
```

## 🎨 Response Data Structures

### Achievement Object
```typescript
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  icon_color?: string;
  background_color?: string;
  type: AchievementType;
  category: string;
  rarity: AchievementRarity;
  status: AchievementStatus;
  criteria: {
    type: 'count' | 'percentage' | 'time' | 'score';
    target_value: number;
    current_value: number;
    unit: string;
    description: string;
  };
  points: number;
  progress_percentage: number;
  program_id: string;
  course_id?: string;
  prerequisites?: string[];
  is_hidden: boolean;
  display_order: number;
  unlocked_at?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}
```

### Achievement Types
```typescript
type AchievementType = 
  | 'attendance'     // Class attendance achievements
  | 'performance'    // Skill and performance milestones
  | 'milestone'      // Major accomplishments
  | 'social'         // Teamwork and collaboration
  | 'streak'         // Consistency achievements
  | 'special'        // Special events and challenges
  | 'certification'; // Skill certifications

type AchievementStatus = 
  | 'locked'         // Requirements not met
  | 'available'      // Can be worked on
  | 'in_progress'    // Currently progressing
  | 'completed'      // Fully completed
  | 'expired';       // Time limit expired

type AchievementRarity =
  | 'common'         // Easy to achieve
  | 'uncommon'       // Moderate difficulty
  | 'rare'           // Challenging
  | 'epic'           // Very difficult
  | 'legendary';     // Extremely rare
```

## 🚀 Usage Examples

### React Hook Integration
```typescript
import { useQuery, useMutation } from 'react-query';
import { achievementsAPI } from '@academy/mobile-shared';

function useAchievements() {
  // Get achievements with automatic refetch
  const {
    data: achievements,
    isLoading,
    refetch
  } = useQuery(
    ['achievements'],
    () => achievementsAPI.getAchievements(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000 // 10 minutes
    }
  );

  // Unlock achievement mutation
  const unlockMutation = useMutation(
    ({ achievementId, data }: { achievementId: string, data?: UnlockAchievementRequest }) =>
      achievementsAPI.unlockAchievement(achievementId, data),
    {
      onSuccess: (response) => {
        // Trigger celebration if included
        if (response.celebration_data) {
          showCelebration(response.celebration_data);
        }
        
        // Refetch achievements to update state
        refetch();
      }
    }
  );

  return {
    achievements: achievements?.achievements || [],
    categories: achievements?.categories || [],
    stats: achievements?.user_stats,
    isLoading,
    unlockAchievement: unlockMutation.mutate,
    refetch
  };
}
```

### Component Integration
```typescript
function AchievementsScreen() {
  const { achievements, categories, stats, unlockAchievement } = useAchievements();
  const { currentProgram } = useProgramContext();

  const handleAchievementPress = (achievement: Achievement) => {
    if (achievement.status === 'available') {
      unlockAchievement({ 
        achievementId: achievement.id,
        data: { celebration: true }
      });
    }
  };

  // Program theming
  const programType = achievementsService.getProgramType(currentProgram);
  
  return (
    <AchievementDisplay
      achievements={achievements}
      categories={categories}
      stats={stats}
      themeColor={programType.colors.primary}
      onAchievementPress={handleAchievementPress}
    />
  );
}
```

## ✅ Production Features

- **✅ Multi-Program Context**: Automatic program filtering via headers
- **✅ Real-time Updates**: WebSocket integration for live progress updates
- **✅ Caching Strategy**: Intelligent caching with React Query integration
- **✅ Error Handling**: Comprehensive error states and retry logic
- **✅ Type Safety**: Full TypeScript support for all API responses
- **✅ Performance Optimized**: Efficient pagination and data loading
- **✅ Authentication**: Seamless JWT integration with automatic refresh
- **✅ Offline Support**: Cached data available when offline

The Achievements API provides a comprehensive, program-aware gamification system that automatically adapts to any Academy program type while maintaining consistent performance and developer experience.