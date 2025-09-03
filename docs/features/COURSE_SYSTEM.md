# Course System Documentation

## Overview

The Academy Apps feature a comprehensive course catalog and detail system with modern enrollment tracking, location-based pricing, and enhanced user experience patterns.

## Course Detail Screen Features

### 🎥 Video Introduction Section
- **Clickable Hero Image**: Large video thumbnail with play button overlay
- **Course Title Overlay**: Course name and subtitle displayed over the image
- **Video Integration**: Ready for video playbook integration for course introductions
- **Mobile Optimized**: 16:9 aspect ratio with responsive design

### 📊 Course Information Cards
Quick reference information displayed in a clean grid layout:
- **Age Range**: Target demographic (e.g., "5-17 years")
- **Course Length**: Total duration (e.g., "8 sessions over 4 weeks")
- **Session Duration**: Individual lesson time (e.g., "45 min")
- **Enrollment Stats**: Total students enrolled with Nigerian number formatting

### 📍 Location Options (Informational)
Displays available location options without requiring selection (selection happens during enrollment):

#### Our Facilities
- **Description**: "Professional facilities with specialized equipment"
- **Icon**: `business-outline`
- **Availability**: Course-dependent

#### Your Location  
- **Description**: "We bring our instructors to your preferred location"
- **Icon**: `location-outline`
- **Availability**: Course-dependent

#### Course-Specific Availability Examples:
- **Learn to Swim**: Both facility and mobile options ✅✅
- **Swimming Club**: Facility only (specialized equipment) ✅❌
- **Adult Swimming**: Both options ✅✅
- **Aqua Babies**: Both options ✅✅

#### Visual Indicators
- **Available**: Green dot indicator with normal styling
- **Unavailable**: Gray dot indicator with muted styling and "Not available for this course" text

### 💰 Advanced Pricing System

#### Age Group Filtering
- Dynamic filter bar that appears when multiple age groups exist
- Options: All Ages, Youth, Adult, Senior, etc.
- Filters lesson types and pricing based on selected demographic

#### Multiple Lesson Types
Each course offers different instruction formats:

1. **Group Lessons**
   - 4-6 students per session
   - Cost-effective option (base price)
   - Features: Social learning, peer motivation, cost effective

2. **Private Lessons** 
   - 1-on-1 personalized instruction
   - Premium pricing (typically 80% higher than group)
   - Features: Personalized attention, flexible schedule, faster progress, custom curriculum

3. **Semi-Private Lessons**
   - 2-3 students per session
   - Mid-tier pricing (typically 40% higher than group)
   - Features: More attention, shared costs, friend/family groups

#### Pricing Transparency
- **Dynamic Pricing**: Automatic calculations based on lesson type and age group
- **Universal "From" Pricing**: All courses show "From ₦X" format since multiple lesson types always exist
- **Lowest Price Display**: Shows the most affordable option (typically group lessons)
- **Clear Disclaimer**: Location and facility cost variations explained

### 🎯 Additional Content Sections

#### What You'll Learn
- Feature highlights with green checkmark icons
- Course-specific learning outcomes
- Visual list format for easy scanning

#### Perks & Benefits
Professional cards displaying various perks:
- **🤝 Referral Discount**: 15% off when you refer a friend
- **👨‍👩‍👧‍👦 Family Discount**: 10% off for each additional family member  
- **📅 Flexible Scheduling**: Easy rescheduling and makeup sessions
- **🛡️ Money Back Guarantee**: 100% satisfaction guarantee on first session

#### Perks & Benefits
Professional cards displaying various benefits:
- **🤝 Referral Discount**: 15% off when you refer a friend
- **👨‍👩‍👧‍👦 Family Discount**: 10% off for each additional family member  
- **📅 Flexible Scheduling**: Easy rescheduling and makeup sessions
- **🛡️ Money Back Guarantee**: 100% satisfaction guarantee on first session

#### Contact for Enrollment
Two prominent action cards for immediate assistance:
- **📞 Call Us**: "Speak to our enrollment team"
- **💬 WhatsApp**: "Quick chat support"
- Both cards use Academy purple theme and are fully interactive

#### Instructor Profile (Optional)
- Some courses include dedicated instructor information
- Profile avatar with initials
- Experience and certifications
- Only displayed when instructor data is available

## Technical Implementation

### Course Data Structure
```typescript
interface CourseDetail {
  id: string;
  title: string;
  subtitle: string;
  longDescription: string;
  ageRange: string;
  courseLength: string; // e.g., "8 sessions over 4 weeks"
  sessionDuration: string; // e.g., "45 min"
  lessonTypes: LessonType[];
  locationOptions: LocationOption[];
  features: string[];
  totalEnrolled?: number;
  instructor?: InstructorProfile;
  // ... other properties
}
```

### Location Availability Logic
```typescript
const getLocationOptions = (courseId: string): LocationOption[] => {
  const locationAvailability: Record<string, { facility: boolean; preferred: boolean }> = {
    '1': { facility: true, preferred: true }, // Learn to Swim
    '2': { facility: true, preferred: false }, // Swimming Club
    // ... other courses
  };
  // Returns location options with availability flags
};
```

### Pricing Calculation
```typescript
// Private lessons typically cost 80% more
const privatePricing = basePricing.map(tier => ({
  ...tier,
  price: Math.round(tier.price * 1.8)
}));

// Semi-private lessons typically cost 40% more  
const semiPrivatePricing = basePricing.map(tier => ({
  ...tier,
  price: Math.round(tier.price * 1.4)
}));
```

## Course Card Updates

### Course List Display
Each course card now shows optimized information:
- **Age Range**: Target demographic (e.g., "5-17 years")
- **Sessions**: Total sessions (e.g., "8 sessions")
- **Students Enrolled**: Social proof with formatted numbers (e.g., "1,247 enrolled")
- **Level Badge**: Difficulty indicator
- **Universal "From" Pricing**: Always shows "From ₦X" with lowest available price

### Pricing Logic
```typescript
// All courses show "From" pricing since multiple lesson types exist
const displayPrice = `From ₦${course.pricingTiers && course.pricingTiers.length > 0 ? 
  Math.min(...course.pricingTiers.map(t => t.price)).toLocaleString('en-NG') : 
  course.price.toLocaleString('en-NG')}`;
```

## User Experience Flow

1. **Course Discovery**: Users browse course catalog with social proof
2. **Course Selection**: Tap on course card to view comprehensive details
3. **Information Review**: 
   - Watch introduction video
   - Review course information cards
   - Check location availability (informational)
   - Compare lesson type pricing with age filters
   - Review perks and benefits
4. **Contact/Enrollment**: 
   - Contact support for questions via call/WhatsApp
   - Proceed to enrollment with selected options

## Course Curriculum System ⭐ NEW

### Overview
The **Course Curriculum Screen** provides students with detailed progress tracking through a comprehensive, hierarchical learning structure with instructor-based star ratings and comprehensive assessments.

### 🌟 Key Features

#### 3-Star Instructor Grading System
- **Individual Lesson Rating**: Each lesson rated 0-3 stars by instructor based on student performance
- **Visual Feedback**: Filled stars for earned ratings, outline stars for unearned
- **Performance Tracking**: Clear indication of lesson mastery level
- **Instructor Assessment**: Objective grading system for consistent evaluation

#### Hierarchical Course Structure
```
Course → Levels → Modules → Section Tabs → Individual Lessons
```

**Example: Learn to Swim Course**
- **Level 1**: Water Familiarization (5 modules, 36 lessons)
- **Level 2**: Basic Swimming Skills (5 modules, 38 lessons) 
- **Level 3**: Advanced Techniques (locked until Level 2 completion)

#### Swipeable Level Filter System
- **Horizontal Scroll Navigation**: Touch-friendly level selection
- **Visual Status Indicators**: 
  - Active (purple), Current (accent), Completed (green), Locked (gray)
- **Scalable Design**: Supports 5+ course levels
- **Mobile Optimized**: Smooth scrolling and haptic feedback

#### Enhanced Module Organization
- **Module X Format**: "Module 1: Water Safety & Pool Rules"
- **Progress Indicators**: Visual progress bars and completion percentages
- **Difficulty Badges**: Beginner/Intermediate/Advanced indicators
- **Expandable Content**: Smooth animation reveals lesson details
- **Estimated Time**: Duration estimates for planning

#### Comprehensive Assessment System
- **Level-Based Assessments**: 6-10 assessment items per level
- **Individual Star Ratings**: Each assessment item rated 0-3 stars
- **Overall Scoring**: Percentage scores with visual progress indication
- **Progress Tracking**: Completed vs total items tracking

### 📊 Technical Implementation

#### Data Structure
```typescript
interface CourseCurriculum {
  id: string;
  title: string;
  subtitle: string;
  overallProgress: number;
  currentLevel: number;
  totalLevels: number;
  levels: CourseLevel[];
}

interface CourseLevel {
  id: string;
  title: string;
  shortTitle: string; // For filter tabs
  modules: Module[];
  assessment?: LevelAssessment;
}

interface Module {
  id: string;
  moduleNumber: number;
  title: string;
  sections: Section[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  progress: number;
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'theory' | 'practical' | 'assessment' | 'review';
  starsEarned: number; // 0-3 stars earned by instructor grading
  maxStars: number; // Always 3 by default
  isCompleted: boolean;
  progress: number;
}

interface LevelAssessment {
  id: string;
  title: string;
  totalItems: number;
  completedItems: number;
  totalStars: number; // Sum of all possible stars
  earnedStars: number; // Sum of all earned stars
  overallScore: number; // Percentage score
  items: AssessmentItem[];
}
```

#### StarRating Component
```typescript
const StarRating: React.FC<StarRatingProps> = ({ 
  starsEarned, 
  maxStars, 
  size = 12, 
  showCount = false 
}) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {Array.from({ length: maxStars }).map((_, index) => (
        <Ionicons
          key={index}
          name={index < starsEarned ? "star" : "star-outline"}
          size={size}
          color={index < starsEarned ? theme.colors.status.warning : theme.colors.text.tertiary}
        />
      ))}
    </View>
  );
};
```

### 🎯 User Experience Features

#### Interactive Navigation
- **Swipeable Level Filters**: Horizontal scrolling for level selection
- **Expandable Modules**: Tap to expand/collapse module details
- **Section Tabs**: Multiple sections within each module
- **Lesson Cards**: Detailed lesson information with progress indicators

#### Visual Progress Tracking
- **Course Progress Bar**: Overall completion percentage
- **Module Progress**: Individual module completion status  
- **Star Display**: Visual representation of instructor ratings
- **Assessment Scoring**: Comprehensive evaluation progress
- **Status Icons**: Checkmarks, play buttons, lock icons for lesson states

#### Real-time Data Examples
```typescript
// Level 1 Assessment - Completed
{
  totalItems: 8,
  completedItems: 8,
  totalStars: 24,
  earnedStars: 22,
  overallScore: 92, // Excellent performance
  isCompleted: true
}

// Level 2 Assessment - In Progress  
{
  totalItems: 10,
  completedItems: 4,
  totalStars: 30,
  earnedStars: 11,
  overallScore: 37, // Room for improvement
  isCompleted: false
}
```

### 📱 Mobile-First Design

#### Touch Interactions
- **Swipe Navigation**: Level filter bar with smooth scrolling
- **Tap to Expand**: Module cards with spring animations
- **Touch Targets**: 48px minimum for accessibility
- **Visual Feedback**: Immediate response to user actions

#### Performance Optimizations
- **Lazy Loading**: Module content loaded on expansion
- **Smooth Animations**: React Native Reanimated for fluid motion
- **Memory Efficient**: Proper state management with useState/useMemo
- **Responsive Design**: Adapts to different screen sizes

### 🔗 Integration Points

#### Navigation Flow
- **Progress Screen** → **Course Progress Card** → **Course Curriculum**
- **Level Selection** → **Module Expansion** → **Lesson Details**
- **Assessment Cards** → **Individual Item Scoring** → **Overall Progress**

#### Data Sources
- **Student Progress API**: Real-time lesson completion data
- **Instructor Grading API**: Star rating submissions
- **Assessment API**: Level-based evaluation results
- **Course Content API**: Curriculum structure and lesson details

## Navigation Integration

- **Entry Point**: Course catalog screen (`CoursesScreen`)
- **Detail Screen**: `CourseDetailScreen` with custom header
- **Progress Navigation**: `ProgressScreen` → `CourseCurriculumScreen` (detailed lesson progression)
- **Exit Points**: 
  - Enrollment flow (with selected pricing data)
  - Contact support (call/WhatsApp)
  - Back to course catalog
  - Back to progress overview

## Key Implementation Notes

- **No Selection State**: Location options are informational only (selection during enrollment)
- **Universal Pricing Format**: All courses show "From ₦X" regardless of tier complexity
- **Social Proof Integration**: Enrollment numbers prominently displayed for decision-making
- **Mobile First**: Touch-friendly design with proper spacing and visual hierarchy
- **Progressive Disclosure**: Information organized by priority and decision relevance
- **Accessibility**: Proper icons, contrast, and text sizing
- **Performance**: Optimized images and smooth animations
- **Error Handling**: Graceful fallbacks for missing enrollment data
- **Localization Ready**: Nigerian currency and number formatting throughout

## Future Enhancements

### Course Catalog & Detail Enhancements
- Video player integration for course introductions
- Real-time availability checking for locations
- Dynamic pricing based on location selection
- Advanced filtering and search capabilities
- Course comparison features
- Social proof and reviews integration

### Course Curriculum System Enhancements
- **Lesson Content Integration**: Rich media lesson content (videos, documents, interactive elements)
- **Offline Content Access**: Download lessons for offline study
- **Progress Synchronization**: Real-time sync across devices
- **Gamification Elements**: Achievement badges, progress streaks, completion celebrations
- **Social Features**: Peer progress comparison, study groups, discussion forums
- **Advanced Assessments**: Interactive quizzes, skill demonstrations, peer evaluations
- **Personalized Learning Paths**: AI-driven content recommendations based on performance
- **Parent/Guardian Access**: Progress monitoring for dependent students
- **Instructor Dashboard**: Grading interface, performance analytics, lesson planning tools
- **Accessibility Features**: Screen reader support, high contrast mode, text scaling
- **Multi-language Support**: Localized content and assessment in multiple languages