# StarRating Component

## Overview

The **StarRating** component is an Academy-specific component designed for displaying instructor-based performance ratings in the curriculum system. It provides visual feedback for student lesson performance using a 0-3 star rating system.

## ⭐ Core Features

### Visual Star Display
- **Filled Stars**: Represent earned performance ratings
- **Outline Stars**: Represent unearned performance ratings  
- **Consistent Sizing**: Configurable star size with responsive design
- **Academy Theming**: Uses warning color for filled stars, tertiary text color for outlines

### Flexible Configuration
- **Variable Star Count**: Supports any maximum star count (default: 3)
- **Size Variants**: Customizable star size for different UI contexts
- **Optional Count Display**: Shows "earned/total" text alongside stars
- **Zero State Support**: Handles 0-star ratings gracefully

## 🎯 Use Cases

### Course Curriculum System
- **Lesson Performance**: Display instructor ratings for individual lessons
- **Assessment Items**: Show star ratings for assessment components
- **Progress Tracking**: Visual indication of learning mastery levels
- **Performance Overview**: Quick visual scan of achievement levels

### Instructor Dashboard (Future)
- **Grading Interface**: Interactive star selection for rating submissions
- **Performance Analytics**: Visual representation of student progress
- **Batch Grading**: Consistent rating display across multiple students

## 📊 Technical Implementation

### Component Interface
```typescript
interface StarRatingProps {
  starsEarned: number;    // Number of stars earned (0 to maxStars)
  maxStars: number;       // Maximum possible stars (typically 3)
  size?: number;          // Star icon size in pixels (default: 12)
  showCount?: boolean;    // Show "earned/total" text (default: false)
}
```

### Component Implementation
```typescript
const StarRating: React.FC<StarRatingProps> = ({ 
  starsEarned, 
  maxStars, 
  size = 12, 
  showCount = false 
}) => {
  const { theme } = useTheme();
  
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {Array.from({ length: maxStars }).map((_, index) => (
        <Ionicons
          key={index}
          name={index < starsEarned ? "star" : "star-outline"}
          size={size}
          color={index < starsEarned ? theme.colors.status.warning : theme.colors.text.tertiary}
          style={{ marginLeft: index > 0 ? 2 : 0 }}
        />
      ))}
      {showCount && (
        <Text style={{ 
          color: theme.colors.text.tertiary, 
          fontSize: theme.fontSizes.xs, 
          marginLeft: theme.spacing.xs 
        }}>
          {starsEarned}/{maxStars}
        </Text>
      )}
    </View>
  );
};
```

## 🎨 Usage Examples

### Basic Lesson Rating
```typescript
// Display 2 out of 3 stars for a lesson
<StarRating starsEarned={2} maxStars={3} size={14} />
```

### Assessment Item with Count
```typescript
// Show assessment performance with text count
<StarRating 
  starsEarned={3} 
  maxStars={3} 
  size={16} 
  showCount={true} 
/>
// Renders: ★★★ 3/3
```

### Zero Performance Rating
```typescript
// Show unearned rating for incomplete lesson
<StarRating starsEarned={0} maxStars={3} size={12} />
// Renders: ☆☆☆
```

### Large Format for Headers
```typescript
// Larger stars for module or section headers
<StarRating 
  starsEarned={1} 
  maxStars={3} 
  size={20} 
  showCount={true} 
/>
```

## 🎯 Design System Integration

### Color Usage
- **Filled Stars**: `theme.colors.status.warning` (Academy yellow/gold)
- **Outline Stars**: `theme.colors.text.tertiary` (muted text color)
- **Count Text**: `theme.colors.text.tertiary` with `theme.fontSizes.xs`

### Spacing and Layout
- **Star Spacing**: 2px margin between stars for optimal readability
- **Text Margin**: `theme.spacing.xs` between stars and count text
- **Vertical Alignment**: Center-aligned with adjacent text content

### Size Variants
```typescript
// Common size configurations
const StarSizes = {
  small: 10,     // Compact contexts, secondary information
  medium: 12,    // Default size, lesson cards
  large: 16,     // Assessment headers, emphasis contexts
  xlarge: 20,    // Module headers, primary displays
};
```

## ♿ Accessibility Features

### Screen Reader Support
```typescript
// Accessibility implementation (future enhancement)
<View 
  accessible={true}
  accessibilityLabel={`${starsEarned} out of ${maxStars} stars earned`}
  accessibilityRole="progressbar"
>
  {/* Star display */}
</View>
```

### High Contrast Support
- Uses Academy theme colors that support high contrast modes
- Sufficient color contrast between filled and outline states
- Compatible with system accessibility settings

## 📱 Mobile Optimization

### Touch Interactions
- **Read-Only Display**: Current implementation is display-only
- **Future Interactive**: Planned support for instructor rating input
- **Touch Targets**: When interactive, will meet 48px minimum requirement

### Performance Considerations
- **Lightweight Rendering**: Minimal re-renders with proper key usage
- **Icon Caching**: Ionicons are efficiently cached by React Native
- **Memory Efficient**: No complex state management required

## 🔄 Integration Examples

### In Lesson Cards
```typescript
<View style={styles.lessonMeta}>
  <Text style={styles.lessonDuration}>{lesson.duration}</Text>
  <StarRating 
    starsEarned={lesson.starsEarned} 
    maxStars={lesson.maxStars} 
    size={12} 
  />
</View>
```

### In Assessment Items
```typescript
<View style={styles.assessmentItemStars}>
  <StarRating 
    starsEarned={item.starsEarned} 
    maxStars={item.maxStars} 
    size={14} 
  />
</View>
```

### In Progress Summaries
```typescript
<StarRating 
  starsEarned={assessment.earnedStars} 
  maxStars={assessment.totalStars}
  size={14}
  showCount={true}
/>
```

## 🚀 Future Enhancements

### Interactive Rating Input
```typescript
interface InteractiveStarRatingProps extends StarRatingProps {
  onRatingChange?: (newRating: number) => void;
  interactive?: boolean;
  disabled?: boolean;
}
```

### Animation Support
- **Tap Animations**: Scale effect when rating changes
- **Fill Animations**: Progressive fill animation for newly earned stars
- **Celebration Effects**: Sparkle or glow effects for perfect ratings

### Advanced Features
- **Half-Star Support**: Decimal ratings (e.g., 2.5 stars)
- **Color Variants**: Different star colors for different contexts
- **Size Presets**: Predefined size variants with consistent scaling
- **Tooltip Support**: Hover/press explanations for rating meanings

## 📚 Related Components

- **[CourseProgression](./CourseProgression.md)** - Uses StarRating for overall course performance
- **[StudentCard](./StudentCard.md)** - May integrate StarRating for student overview
- **[PerformanceTimes](../performance/PerformanceTimes.md)** - Related performance tracking component
- **[AchievementsScreen](../achievements/AchievementsScreen.md)** - Achievement progress visualization

## 🔗 Navigation Integration

### Course Curriculum Flow
```
CourseCurriculumScreen → LevelFilter → ModuleCard → LessonCard → StarRating
                     → AssessmentCard → AssessmentItem → StarRating
```

### Data Flow
```typescript
// Lesson data with star rating
interface Lesson {
  id: string;
  title: string;
  starsEarned: number;  // 0-3 instructor rating
  maxStars: number;     // Always 3
  // ... other properties
}

// Assessment item data
interface AssessmentItem {
  id: string;
  title: string;
  starsEarned: number;  // 0-3 evaluation score
  maxStars: number;     // Always 3
  isCompleted: boolean;
}
```

## 📈 Performance Metrics

### Rendering Performance
- **Minimal Re-renders**: Only updates when star data changes
- **Efficient Icons**: Ionicons are optimized for mobile performance
- **Memory Usage**: Lightweight component with no complex state

### User Experience Metrics
- **Recognition Speed**: Users quickly understand rating system
- **Visual Clarity**: Clear distinction between earned and unearned stars
- **Consistency**: Uniform appearance across all curriculum contexts