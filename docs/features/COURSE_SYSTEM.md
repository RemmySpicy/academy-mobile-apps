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

## Navigation Integration

- **Entry Point**: Course catalog screen (`CoursesScreen`)
- **Detail Screen**: `CourseDetailScreen` with custom header
- **Exit Points**: 
  - Enrollment flow (with selected pricing data)
  - Contact support (call/WhatsApp)
  - Back to course catalog

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

- Video player integration for course introductions
- Real-time availability checking for locations
- Dynamic pricing based on location selection
- Advanced filtering and search capabilities
- Course comparison features
- Social proof and reviews integration