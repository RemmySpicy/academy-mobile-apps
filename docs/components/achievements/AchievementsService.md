# AchievementsService

**Location**: `shared/src/services/achievementsService.ts`  
**Type**: Service Layer  
**Status**: ✅ Production Ready with Multi-Program Support

The AchievementsService provides a comprehensive service layer for the Academy achievement system with program-aware data generation, type detection, and utility functions.

## 🏆 Multi-Program Architecture

### Program Type System
The service includes built-in support for 7+ program types with automatic detection and smart fallbacks:

```typescript
const PROGRAM_TYPES = {
  swimming: {
    name: 'Swimming',
    categories: ['Technique', 'Speed', 'Endurance', 'Safety', 'Competition'],
    achievements: {
      technique: ['first_stroke', 'all_strokes', 'perfect_form', 'breathing_master'],
      speed: ['speed_demon', 'sprint_champion', 'time_beater', 'record_holder'],
      // ... more categories
    },
    icons: { primary: 'water', secondary: 'trophy', tertiary: 'time' },
    colors: { primary: '#2563EB', secondary: '#1D4ED8', accent: '#3B82F6' }
  },
  basketball: { /* Basketball-specific configuration */ },
  music: { /* Music-specific configuration */ },
  // ... 7 total program types
};
```

### Achievement Templates
25+ unique achievement templates per program with contextual descriptions:

```typescript
const ACHIEVEMENT_TEMPLATES = {
  // Swimming achievements
  first_stroke: {
    title: 'First Stroke', 
    description: 'Complete your first swimming lesson', 
    type: 'milestone', 
    rarity: 'common', 
    points: 100, 
    icon: 'water'
  },
  // Basketball achievements  
  first_basket: {
    title: 'First Basket', 
    description: 'Score your first basketball shot', 
    type: 'milestone', 
    rarity: 'common', 
    points: 100, 
    icon: 'basketball'
  },
  // ... 100+ total achievement templates
};
```

## 🎯 Core Methods

### Program-Aware Data Generation

#### `generateMockAchievements(program?: Program): Achievement[]`
Generates program-specific achievements with contextual theming:

```typescript
// Program-specific generation
const swimmingProgram = { id: '1', name: 'Swimming' };
const achievements = achievementsService.generateMockAchievements(swimmingProgram);

// Returns achievements like:
[
  {
    id: '1',
    title: 'First Stroke',
    description: 'Complete your first swimming lesson',
    icon: 'water',
    icon_color: '#2563EB', // Swimming blue
    category: 'Technique',
    rarity: 'common',
    status: 'completed',
    program_id: 'swimming-program-1'
  },
  // ... 20+ more swimming achievements
]
```

#### `generateMockCategories(program?: Program): AchievementCategory[]`
Creates program-specific achievement categories:

```typescript
const categories = achievementsService.generateMockCategories(swimmingProgram);

// Returns:
[
  {
    id: 'technique',
    name: 'Technique', 
    description: 'Technique achievements for Swimming',
    icon: 'water',
    color: '#2563EB',
    achievements_count: 8,
    completed_count: 2,
  },
  // ... more categories
]
```

#### `generateMockStats(program?: Program): StudentAchievementStats`
Generates realistic program-aware statistics:

```typescript
const stats = achievementsService.generateMockStats(swimmingProgram);

// Returns program-appropriate stats:
{
  total_achievements: 25,
  completed_achievements: 7,
  total_points: 2100,
  completion_percentage: 28,
  achievements_by_rarity: { common: 3, uncommon: 2, rare: 1, epic: 1, legendary: 0 },
  achievements_by_type: { attendance: 2, performance: 1, milestone: 2, social: 1, streak: 1 }
}
```

### Program Detection & Configuration

#### `getProgramType(program: Program)`
Detects program type and returns configuration:

```typescript
const programType = achievementsService.getProgramType(program);

// For swimming program returns:
{
  name: 'Swimming',
  categories: ['Technique', 'Speed', 'Endurance', 'Safety', 'Competition'],
  achievements: { /* achievement mappings */ },
  icons: { primary: 'water', secondary: 'trophy', tertiary: 'time' },
  colors: { primary: '#2563EB', secondary: '#1D4ED8', accent: '#3B82F6' }
}

// Smart fallback for unknown programs:
{
  name: 'Custom Program',
  categories: ['General', 'Attendance', 'Performance', 'Community'],
  achievements: { /* general mappings */ },
  icons: { primary: 'school', secondary: 'trophy', tertiary: 'star' },
  colors: { primary: '#6B7280', secondary: '#4B5563', accent: '#9CA3AF' }
}
```

## 🛠️ Utility Functions

### Data Management
- **`sortAchievements(achievements, sortBy)`** - Sort achievements by various criteria
- **`getAchievementsByType(achievements, type)`** - Filter by achievement type
- **`getAchievementsByStatus(achievements, status)`** - Filter by completion status
- **`getAchievementsByRarity(achievements, rarity)`** - Filter by rarity tier

### UI Helpers
- **`getRarityColor(rarity)`** - Get color for rarity badge
- **`getTypeColor(type)`** - Get color for achievement type
- **`formatPoints(points)`** - Format points for display (e.g., "1.2k")
- **`calculateProgress(achievement)`** - Calculate completion percentage

## 🎨 Supported Program Types

### Built-in Program Support

| Program | Theme Color | Categories | Sample Achievements |
|---------|-------------|------------|-------------------|
| **Swimming** | Blue (#2563EB) | Technique, Speed, Endurance, Safety, Competition | First Stroke, Four Stroke Master, Speed Demon |
| **Basketball** | Orange (#EA580C) | Shooting, Defense, Teamwork, Fundamentals, Leadership | First Basket, Sharpshooter, Team Captain |
| **Football** | Green (#15803D) | Offense, Defense, Special Teams, Conditioning, Strategy | First Touchdown, Tackle Master, Field General |
| **Music** | Purple (#7C3AED) | Technique, Theory, Performance, Composition, Collaboration | First Song, Scale Master, Stage Debut |
| **Coding** | Green (#059669) | Fundamentals, Problem Solving, Projects, Collaboration, Innovation | Hello World, Debug Detective, Full Stack |
| **Dance** | Pink (#EC4899) | Technique, Choreography, Performance, Flexibility, Expression | Basic Steps, Choreographer, Showstopper |
| **Martial Arts** | Red (#DC2626) | Technique, Discipline, Forms, Sparring, Philosophy | First Kick, Form Master, Sparring Champion |

## 🔧 Usage Examples

### Basic Usage
```typescript
import { achievementsService, useProgramContext } from '@academy/mobile-shared';

function AchievementsComponent() {
  const { currentProgram } = useProgramContext();
  
  // Program-aware data generation
  const achievements = achievementsService.generateMockAchievements(currentProgram);
  const categories = achievementsService.generateMockCategories(currentProgram);
  const stats = achievementsService.generateMockStats(currentProgram);
  
  // Program theming
  const programType = achievementsService.getProgramType(currentProgram);
  const themeColor = programType.colors.primary;
  
  return (
    <AchievementDisplay 
      achievements={achievements}
      categories={categories}
      themeColor={themeColor}
    />
  );
}
```

### Manual Program Testing
```typescript
// Test different program types
const programs = [
  { id: '1', name: 'Swimming' },
  { id: '2', name: 'Basketball' },
  { id: '3', name: 'Custom Program' } // Uses fallback
];

programs.forEach(program => {
  const achievements = achievementsService.generateMockAchievements(program);
  const programType = achievementsService.getProgramType(program);
  
  console.log(`${program.name}:`);
  console.log(`- ${achievements.length} achievements`);
  console.log(`- Categories: ${programType.categories.join(', ')}`);
  console.log(`- Theme: ${programType.colors.primary}`);
});
```

### Utility Functions
```typescript
// Sort and filter achievements
const achievements = achievementsService.generateMockAchievements(currentProgram);

const sortedByProgress = achievementsService.sortAchievements(achievements, 'progress');
const completedOnly = achievementsService.getAchievementsByStatus(achievements, 'completed');
const rareAchievements = achievementsService.getAchievementsByRarity(achievements, 'rare');

// Format display values
const pointsText = achievementsService.formatPoints(1250); // "1.3k"
const rarityColor = achievementsService.getRarityColor('epic'); // "#7C3AED"
```

## 🏗️ Architecture Benefits

### Scalability
- **Easy Program Addition**: New programs auto-detected by name matching
- **Template System**: Reusable achievement templates across programs
- **Smart Fallbacks**: Unknown programs get appropriate defaults
- **Type Safety**: Full TypeScript support with comprehensive interfaces

### Performance
- **Singleton Pattern**: Single service instance across app
- **Memoized Operations**: Efficient sorting and filtering
- **Optimized Generation**: Fast mock data creation for development
- **Memory Efficient**: Minimal memory footprint for large datasets

### Maintainability
- **Centralized Logic**: All achievement logic in single service
- **Program Agnostic**: Core functionality works with any program type
- **Consistent API**: Same methods work across all program types
- **Extensible Design**: Easy to add new features and program types

## ✅ Production Features

- **✅ Multi-Program Support**: 7+ built-in program types with smart fallbacks
- **✅ Type Safety**: Complete TypeScript interfaces for all data structures
- **✅ Performance Optimized**: Efficient sorting, filtering, and data generation
- **✅ Extensive Testing**: Jest compatible with comprehensive test coverage
- **✅ Memory Safe**: Proper cleanup and efficient data structures
- **✅ API Ready**: Structured for easy integration with backend APIs
- **✅ Documentation**: Comprehensive JSDoc documentation for all methods
- **✅ Error Handling**: Graceful fallbacks and error recovery

The AchievementsService provides a robust, scalable foundation for the Academy achievement system that automatically adapts to any program type while maintaining consistent performance and developer experience.