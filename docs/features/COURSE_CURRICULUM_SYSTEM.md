# Course Curriculum System

The Academy Apps feature an advanced course curriculum system with dynamic difficulty support, hierarchical lesson structure, and multi-level progress tracking.

## Overview

The Course Curriculum System provides students with a comprehensive view of their learning journey through structured levels, modules, sections, and lessons. Each course is organized hierarchically to provide clear progression paths with detailed tracking and assessment capabilities.

## Architecture

### Hierarchical Structure

```
Course
├── Level 1 (Beginner)
│   ├── Module 1: Foundation Skills
│   │   ├── Section 1: Basic Techniques
│   │   │   ├── Lesson 1: Introduction
│   │   │   ├── Lesson 2: Practice Session
│   │   │   └── Lesson 3: Assessment
│   │   └── Section 2: Advanced Techniques
│   └── Module 2: Skill Development
└── Level 2 (Intermediate)
    └── ...
```

### Data Interfaces

```typescript
interface CourseLevel {
  id: string;
  title: string;
  shortTitle: string; // For filter tabs (e.g., "Level 1", "Level 2")
  description: string;
  difficulty: string; // Dynamic - any string from curriculum data
  totalModules: number;
  completedModules: number;
  progress: number; // 0-100
  isCurrentLevel: boolean;
  isCompleted: boolean;
  isUnlocked: boolean;
  modules: Module[];
  assessment?: LevelAssessment;
}

interface Module {
  id: string;
  moduleNumber: number;
  title: string;
  description: string;
  totalLessons: number;
  completedLessons: number;
  progress: number;
  estimatedTime: string;
  difficulty: string; // Inherited from level, but modules can override
  isUnlocked: boolean;
  totalStars: number;
  earnedStars: number;
  sections: Section[];
}

interface Section {
  id: string;
  title: string;
  description: string;
  totalLessons: number;
  completedLessons: number;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: 'theory' | 'practical' | 'assessment' | 'review';
  isCompleted: boolean;
  progress: number;
  objectives: string[];
  starsEarned: number;
  maxStars: number;
}
```

## Key Features

### 🎨 Dynamic Difficulty System

The system supports **any difficulty terminology** provided by curriculum data, making it future-proof for diverse academy programs.

#### Supported Difficulty Variations

**Beginner Category (Green - Success)**
- `Beginner`, `Basic`, `Starter`, `Foundation`, `Intro`, `Level 1`

**Intermediate Category (Orange - Warning)**
- `Intermediate`, `Middle`, `Developing`, `Progressing`, `Level 2-4`

**Advanced Category (Red - Error)**  
- `Advanced`, `Expert`, `Mastery`, `Professional`, `Competitive`, `Level 5-7`

**Unknown Difficulties (Academy Purple)**
- Any unrecognized difficulty defaults to Academy brand color

#### Intelligent Fallback System

The system includes keyword-based detection:

```typescript
// Keyword matching examples:
"Beginning Swimmer" → Green (contains "begin")
"Advanced Techniques" → Red (contains "advanc") 
"Intermediate Skills" → Orange (contains "intermedi")
"Championship Level" → Academy Purple (no keywords matched)
```

### 🏗️ UI Components

#### Level Filter Navigation
- **Swipeable horizontal tabs** for level selection
- **Current level highlighting** with visual indicators
- **Locked/unlocked states** with appropriate styling
- **Responsive design** for different screen sizes

#### Module Cards
- **Expandable design** with smooth animations
- **Progress indicators** showing completion status
- **Star rating system** with earned/total stars
- **Section tabs** within expanded modules
- **Lesson cards** with detailed information

#### Difficulty Badges
- **Dynamic positioning** in level headers (not filter tabs)
- **Themed colors** using Academy status color system
- **Contextual display** alongside level titles and descriptions

### 📊 Progress Tracking

#### Multi-Level Progress
- **Course-wide progress** across all levels
- **Level progress** based on module completion
- **Module progress** based on lesson completion  
- **Lesson progress** with star-based grading

#### Star Rating System
- **3-star maximum** per lesson
- **Instructor grading** with detailed feedback
- **Progress visualization** with filled/outline stars
- **Aggregated scoring** at module and level levels

## Implementation Guide

### Dynamic Difficulty Integration

When integrating with curriculum data, the system automatically handles any difficulty strings:

```typescript
// Example curriculum data - any difficulty works
const curriculumData = {
  levels: [
    {
      id: "1",
      title: "Water Safety Basics",
      difficulty: "Foundation Level", // ← Any string works
      // ...
    },
    {
      id: "2", 
      title: "Stroke Development",
      difficulty: "Skill Building", // ← System adapts automatically
      // ...
    }
  ]
};
```

### Color Mapping Function

The `getDifficultyColor()` function handles all difficulty-to-color mapping:

```typescript
const getDifficultyColor = (difficulty: string, theme: any) => {
  const normalized = difficulty.toLowerCase().trim();
  
  // Direct mappings
  const colorMap = {
    'beginner': theme.colors.status.success,
    'intermediate': theme.colors.status.warning,
    'advanced': theme.colors.status.error,
    // ... extensive list of variations
  };
  
  if (colorMap[normalized]) return colorMap[normalized];
  
  // Keyword-based fallbacks
  if (normalized.includes('begin') || normalized.includes('basic')) {
    return theme.colors.status.success;
  }
  // ... intelligent pattern matching
  
  // Default fallback
  return theme.colors.interactive.primary;
};
```

### Adding New Difficulty Categories

To extend the system with new difficulty types:

1. **Add direct mappings** in the `difficultyColorMap` object
2. **Add keyword patterns** in the fallback logic
3. **Use existing theme colors** or define new ones in theme system

## Navigation Flow

```
Progress Tab → Course Curriculum Screen
├── Level Filter Selection (Swipeable tabs)
├── Current Level Display (Title + Difficulty Badge)
├── Module Cards (Expandable)
│   ├── Section Tabs
│   └── Lesson Cards (Progress + Stars)
├── Level Assessment (If available)
└── Locked Level Indicator (For future levels)
```

## Best Practices

### 1. Curriculum Data Structure
- Keep difficulty strings **consistent** within a program
- Use **descriptive names** that indicate skill level
- Maintain **logical progression** from easier to harder

### 2. Progress Tracking
- Update **star ratings** immediately after lesson completion
- Aggregate **module progress** based on lesson stars (2+ stars = completed)
- Calculate **level progress** based on completed modules

### 3. Visual Design
- Use **Academy theme colors** for consistency
- Maintain **clear visual hierarchy** with proper spacing
- Ensure **touch targets** meet mobile accessibility standards

### 4. Performance
- Implement **lazy loading** for large curriculum datasets
- Use **memoization** for expensive progress calculations
- Cache **difficulty color mappings** to avoid repeated calculations

## Multi-Program Support

The system is designed to work across all Academy programs:

- **Swimming**: Foundation → Stroke Development → Competition Ready
- **Music**: Beginner → Grade 1-8 → Performance Level  
- **Coding**: Intro → Intermediate → Advanced → Expert
- **Sports**: Basics → Skill Development → Competitive → Elite

Each program can define its own difficulty terminology while leveraging the same underlying system architecture.

## Future Enhancements

### Planned Features
- **Adaptive difficulty** based on student performance
- **Prerequisite system** with dependency tracking
- **Custom learning paths** for different student needs
- **Instructor feedback integration** with detailed comments
- **Achievement unlocking** based on curriculum milestones

### API Integration
- **Real-time sync** with backend curriculum data
- **Progress persistence** across devices
- **Instructor dashboard** for monitoring student progress
- **Parent notifications** for significant milestones

---

## Technical Implementation

**Location**: `students-app/src/features/progress/screens/CourseCurriculumScreen.tsx`  
**Dependencies**: Academy theme system, React Native Reanimated  
**Navigation**: Progress tab → Course Curriculum  
**State Management**: Local state with curriculum data integration  

For additional technical details, see the main [CLAUDE.md](../../CLAUDE.md) development guide.