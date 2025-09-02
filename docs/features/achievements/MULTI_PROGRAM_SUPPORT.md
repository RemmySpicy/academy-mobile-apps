# Multi-Program Achievement System

The Academy Apps achievement system supports diverse program types with contextual achievements, categories, and visual themes tailored to each discipline.

## 🏆 Supported Program Types

### 🏊 **Swimming Program**
**Theme**: Aquatic blue (#2563EB)  
**Categories**: Technique, Speed, Endurance, Safety, Competition  
**Icon**: Water droplet  

**Sample Achievements:**
- **First Stroke** - Complete your first swimming lesson
- **Four Stroke Master** - Learn all four basic swimming strokes  
- **Breathing Master** - Master proper breathing technique
- **Speed Demon** - Achieve fast lap times
- **Safety First** - Complete water safety training

---

### 🏀 **Basketball Program**  
**Theme**: Athletic orange (#EA580C)  
**Categories**: Shooting, Defense, Teamwork, Fundamentals, Leadership  
**Icon**: Basketball  

**Sample Achievements:**
- **First Basket** - Score your first basketball shot
- **Sharpshooter** - Make 10 consecutive free throws
- **Three Point Master** - Make 5 three-point shots in a game
- **Team Captain** - Lead your team to victory
- **Lockdown Defender** - Excel in defensive plays

---

### 🏈 **Football Program**
**Theme**: Team green (#15803D)  
**Categories**: Offense, Defense, Special Teams, Conditioning, Strategy  
**Icon**: American football  

**Sample Achievements:**
- **First Touchdown** - Score your first touchdown
- **Tackle Master** - Complete 20 successful tackles
- **Field General** - Lead team in strategy discussions
- **Iron Man** - Play full game without substitution
- **Special Teams Ace** - Excel in special teams play

---

### 🎵 **Music Program**
**Theme**: Creative purple (#7C3AED)  
**Categories**: Technique, Theory, Performance, Composition, Collaboration  
**Icon**: Musical notes  

**Sample Achievements:**
- **First Song** - Learn and perform your first song
- **Scale Master** - Master all major scales
- **Stage Debut** - Perform solo on stage
- **Composer** - Write your own original composition
- **Harmony Expert** - Master complex harmonies

---

### 💻 **Coding Program**
**Theme**: Tech green (#059669)  
**Categories**: Fundamentals, Problem Solving, Projects, Collaboration, Innovation  
**Icon**: Code slash  

**Sample Achievements:**
- **Hello World** - Write your first program
- **Debug Detective** - Successfully debug 10 programs
- **Full Stack** - Build complete web application
- **Code Mentor** - Help 5 fellow students with coding
- **Open Source** - Contribute to open source projects

---

### 💃 **Dance Program**
**Theme**: Artistic pink (#EC4899)  
**Categories**: Technique, Choreography, Performance, Flexibility, Expression  
**Icon**: Body/dancer  

**Sample Achievements:**
- **Basic Steps** - Learn fundamental dance steps
- **Choreographer** - Create your own dance routine
- **Showstopper** - Deliver outstanding performance
- **Flexibility Pro** - Achieve advanced flexibility
- **Emotional Dancer** - Excel in expressive movement

---

### 🥋 **Martial Arts Program**
**Theme**: Discipline red (#DC2626)  
**Categories**: Technique, Discipline, Forms, Sparring, Philosophy  
**Icon**: Shield with checkmark  

**Sample Achievements:**
- **First Kick** - Execute your first martial arts technique
- **Form Master** - Perfect execution of traditional form
- **Sparring Champion** - Win tournament competition
- **Disciplined Warrior** - Show exceptional self-control
- **Martial Philosopher** - Understand the deeper philosophy

---

## 🔧 Technical Implementation

### Program Type Detection

```typescript
// Automatic program type detection
const programType = achievementsService.getProgramType(currentProgram);

// Returns program configuration
{
  name: 'Swimming',
  categories: ['Technique', 'Speed', 'Endurance', 'Safety', 'Competition'],
  achievements: {
    technique: ['first_stroke', 'all_strokes', 'perfect_form', 'breathing_master'],
    speed: ['speed_demon', 'sprint_champion', 'time_beater', 'record_holder'],
    // ... more categories
  },
  icons: { primary: 'water', secondary: 'trophy', tertiary: 'time' },
  colors: { primary: '#2563EB', secondary: '#1D4ED8', accent: '#3B82F6' }
}
```

### Dynamic Achievement Generation

```typescript
// Generate program-specific achievements
const swimmingProgram = { id: '1', name: 'Swimming', /* ... */ };
const achievements = achievementsService.generateMockAchievements(swimmingProgram);

// Each achievement includes:
{
  id: '1',
  title: 'First Stroke',
  description: 'Complete your first swimming lesson',
  icon: 'water',
  icon_color: '#2563EB', // Program primary color
  category: 'Technique',   // Program-specific category
  rarity: 'common',
  status: 'completed',
  program_id: 'swimming-program-1'
}
```

### Category Generation

```typescript
// Dynamic categories based on program
const categories = achievementsService.generateMockCategories(swimmingProgram);

// Returns program-specific categories:
[
  {
    id: 'technique',
    name: 'Technique',
    description: 'Technique achievements for Swimming',
    icon: 'water',        // Program primary icon
    color: '#2563EB',     // Program primary color
    achievements_count: 8,
    completed_count: 2,
  },
  // ... more categories
]
```

## 🎨 Visual Theming

### Program-Specific Colors

Each program has a unique color palette:

```typescript
const PROGRAM_COLORS = {
  swimming: { primary: '#2563EB', secondary: '#1D4ED8', accent: '#3B82F6' },
  basketball: { primary: '#EA580C', secondary: '#DC2626', accent: '#F97316' },
  music: { primary: '#7C3AED', secondary: '#6D28D9', accent: '#8B5CF6' },
  coding: { primary: '#059669', secondary: '#047857', accent: '#10B981' },
  // ... more programs
};
```

### Icon Selection

Icons automatically adapt to program type:

```typescript
const PROGRAM_ICONS = {
  swimming: { primary: 'water', secondary: 'trophy', tertiary: 'time' },
  basketball: { primary: 'basketball', secondary: 'trophy', tertiary: 'people' },
  music: { primary: 'musical-notes', secondary: 'trophy', tertiary: 'mic' },
  coding: { primary: 'code-slash', secondary: 'trophy', tertiary: 'laptop' },
  // ... more programs
};
```

## 🔄 Smart Fallback System

For custom or unknown program types:

```typescript
// Fallback configuration for any program
const fallbackType = {
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
```

## 🚀 Usage Examples

### Program Context Integration

```typescript
import { useProgramContext, achievementsService } from '@academy/mobile-shared';

const AchievementsScreen = () => {
  const { currentProgram } = useProgramContext();
  
  // Data automatically adapts to current program
  const achievements = achievementsService.generateMockAchievements(currentProgram);
  const categories = achievementsService.generateMockCategories(currentProgram);
  const stats = achievementsService.generateMockStats(currentProgram);
  
  // Program type information
  const programType = achievementsService.getProgramType(currentProgram);
  const themeColor = programType.colors.primary;
  const primaryIcon = programType.icons.primary;
  
  return (
    // UI automatically themed for current program
    <AchievementDisplay 
      achievements={achievements}
      categories={categories}
      themeColor={themeColor}
      primaryIcon={primaryIcon}
    />
  );
};
```

### Manual Program Switching

```typescript
// Test different program types
const programs = [
  { id: '1', name: 'Swimming' },
  { id: '2', name: 'Basketball' },  
  { id: '3', name: 'Music' },
  { id: '4', name: 'Custom Program Name' } // Uses fallback
];

programs.forEach(program => {
  const achievements = achievementsService.generateMockAchievements(program);
  const programType = achievementsService.getProgramType(program);
  
  console.log(`${program.name}: ${achievements.length} achievements`);
  console.log(`Categories: ${programType.categories.join(', ')}`);
  console.log(`Theme: ${programType.colors.primary}`);
});
```

## ✅ Benefits

1. **Contextual Experience** - Students see achievements relevant to their program
2. **Visual Identity** - Each program has distinct colors, icons, and themes  
3. **Scalable Architecture** - Easy to add new program types
4. **Automatic Adaptation** - No manual configuration needed
5. **Consistent Framework** - Same achievement structure across all programs
6. **Smart Fallbacks** - Handles any custom program gracefully
7. **Performance Optimized** - Efficient rendering and memory management

The multi-program achievement system creates a more engaging and personalized experience for students across all Academy program types while maintaining consistent technical architecture and user experience patterns.