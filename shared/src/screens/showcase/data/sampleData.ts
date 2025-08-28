// Sample data for Component Library Showcase
// This file contains all the sample data constants used throughout the showcase

import type { SelectOption } from '../../../components/ui/SelectOptions';
import type { DropdownOption } from '../../../components/ui/FormDropdown';
import type { FilterItem } from '../../../components/search/QuickFilterBar';
import type { FilterItem as ControlCardFilterItem, QuickFilterItem } from '../../../components/ui/ControlCard';

// Select Options Sample Data
export const sampleSelectOptions: SelectOption[] = [
  { id: '1', label: 'Beginner', value: 'beginner' },
  { id: '2', label: 'Intermediate', value: 'intermediate' },
  { id: '3', label: 'Advanced', value: 'advanced' },
  { id: '4', label: 'Expert', value: 'expert' },
];

// Dropdown Options Sample Data
export const sampleDropdownOptions: DropdownOption[] = [
  { id: '1', label: 'Swimming Instructor', value: 'swim_instructor', icon: 'water' },
  { id: '2', label: 'Football Coach', value: 'football_coach', icon: 'football' },
  { id: '3', label: 'Basketball Trainer', value: 'basketball_trainer', icon: 'basketball' },
  { id: '4', label: 'Music Teacher', value: 'music_teacher', icon: 'musical-notes' },
  { id: '5', label: 'Coding Mentor', value: 'coding_mentor', icon: 'code-slash', disabled: true },
];

// Large Dropdown Options for testing search functionality
export const largeDropdownOptions: DropdownOption[] = Array.from({ length: 50 }, (_, i) => ({
  id: `instructor-${i}`,
  label: `Instructor ${i + 1} - ${['John', 'Jane', 'Mike', 'Sarah', 'Alex', 'Emma'][i % 6]} ${['Smith', 'Johnson', 'Williams', 'Brown', 'Davis'][i % 5]}`,
  value: `instructor_${i}`,
  icon: 'person',
}));

// Filter Items Sample Data
export const sampleFilters: FilterItem[] = [
  { id: '1', label: 'Active', value: 'active', count: 12, icon: 'checkmark-circle' },
  { id: '2', label: 'Pending', value: 'pending', count: 5, icon: 'time' },
  { id: '3', label: 'Completed', value: 'completed', count: 8, icon: 'checkmark' },
  { id: '4', label: 'Cancelled', value: 'cancelled', count: 2, icon: 'close-circle' },
];

// Workout Sample Data
export const sampleWorkouts = [
  {
    id: '1',
    title: 'Morning Swim Session',
    user: {
      name: 'Sarah Johnson',
      avatar: 'https://via.placeholder.com/40',
    },
    phases: [
      { id: 'warmup', name: 'Warm-up', progress: 100, status: 'completed' as const },
      { id: 'main', name: 'Main Set', progress: 75, status: 'in-progress' as const },
      { id: 'cooldown', name: 'Cool-down', progress: 0, status: 'not-started' as const },
    ],
    details: [
      { label: 'Duration', value: '60 minutes' },
      { label: 'Level', value: 'Intermediate' },
      { label: 'Capacity', value: '6/8 enrolled' },
    ],
  },
  {
    id: '2', 
    title: 'Water Aerobics',
    user: {
      name: 'Mike Chen',
      avatar: 'https://via.placeholder.com/40',
    },
    phases: [
      { id: 'warmup', name: 'Warm-up', progress: 100, status: 'completed' as const },
      { id: 'cardio', name: 'Cardio Phase', progress: 60, status: 'in-progress' as const },
      { id: 'strength', name: 'Strength Training', progress: 30, status: 'in-progress' as const },
      { id: 'cooldown', name: 'Cool-down', progress: 0, status: 'not-started' as const },
    ],
    details: [
      { label: 'Duration', value: '45 minutes' },
      { label: 'Level', value: 'Beginner' },
      { label: 'Capacity', value: '10/12 enrolled' },
    ],
  },
];

// Classroom Sample Data
export const sampleClassrooms = [
  {
    id: '1',
    title: 'Pool A - Main Training',
    location: 'Main Pool Complex',
    schedule: { 
      startTime: '9:00 AM', 
      endTime: '5:00 PM' 
    },
    performanceLevels: [
      { type: 'highest' as const, description: 'Advanced students' },
      { type: 'average' as const, description: 'Intermediate level' },
    ],
    metadata: [
      { label: 'Capacity', value: '12/15', icon: 'people' as const },
      { label: 'Instructor', value: 'Sarah Johnson', icon: 'person' as const },
    ],
    status: 'Active',
  },
  {
    id: '2',
    title: 'Pool B - Kids Area', 
    location: 'Children\'s Pool',
    schedule: { 
      startTime: '10:00 AM', 
      endTime: '4:00 PM' 
    },
    performanceLevels: [
      { type: 'lowest' as const, description: 'Beginner students' },
    ],
    metadata: [
      { label: 'Capacity', value: '0/8', icon: 'people' as const },
      { label: 'Instructor', value: 'Emma Wilson', icon: 'person' as const },
    ],
    status: 'Available',
  },
];

// Filter Groups Sample Data (for FilterBar component)
export const sampleFilterGroups = [
  {
    id: 'level',
    title: 'Level',
    options: [
      { id: 'beginner', label: 'Beginner', value: 'beginner' },
      { id: 'intermediate', label: 'Intermediate', value: 'intermediate' },
      { id: 'advanced', label: 'Advanced', value: 'advanced' },
    ],
    multiSelect: true,
  },
  {
    id: 'status',
    title: 'Status',
    options: [
      { id: 'active', label: 'Active', value: 'active' },
      { id: 'inactive', label: 'Inactive', value: 'inactive' },
      { id: 'pending', label: 'Pending', value: 'pending' },
    ],
    multiSelect: false,
  },
];

// Students Sample Data
export const sampleStudents = [
  {
    id: '1',
    name: 'Emma Johnson',
    level: 'Level 3',
    className: 'Advanced Swimming',
    progress: 85,
    attended: 18,
    absence: 2,
    sessions: 20,
    tags: [
      { id: '1', label: 'Star Student', color: '#00C851', variant: 'success' as const },
      { id: '2', label: 'Fully Paid', color: '#4F2EC9', variant: 'info' as const },
    ],
  },
  {
    id: '2',
    name: 'Michael Chen',
    level: 'Level 2',
    className: 'Intermediate',
    progress: 67,
    attended: 12,
    absence: 3,
    sessions: 15,
    tags: [
      { id: '3', label: 'Needs Attention', color: '#FF851B', variant: 'warning' as const },
      { id: '4', label: 'Payment Due', color: '#FF4444', variant: 'error' as const },
    ],
  },
];

// Lessons Sample Data
export const sampleLessons = [
  {
    id: '1',
    title: 'Swimming Fundamentals',
    className: 'Beginner Class A',
    completion: 75,
    totalActivities: 12,
    completedActivities: 9,
    overallRating: '4.2/5',
    stations: [
      {
        id: 'st1',
        name: 'Station 1',
        title: 'Water Safety',
        activities: [
          {
            id: 'act1',
            title: 'Float Practice',
            description: 'Learn basic floating techniques',
            stars: 4,
            maxStars: 5,
            rating: '4.5/5',
            completed: true,
          },
          {
            id: 'act2',
            title: 'Breathing Exercises',
            description: 'Master rhythmic breathing',
            stars: 3,
            maxStars: 5,
            rating: '3.8/5',
            completed: false,
          },
        ],
      },
      {
        id: 'st2',
        name: 'Station 2',
        title: 'Stroke Basics',
        activities: [
          {
            id: 'act3',
            title: 'Freestyle Introduction',
            description: 'Basic technique fundamentals',
            stars: 5,
            maxStars: 5,
            rating: '4.9/5',
            completed: true,
          },
        ],
      },
    ],
  },
];

// Time Tabs Sample Data
export const sampleTimeTabs = [
  { id: '1', label: 'Week', value: 'week', active: true },
  { id: '2', label: 'Month', value: 'month', active: false },
  { id: '3', label: 'Year', value: 'year', active: false },
];

// Stroke Tabs Sample Data
export const sampleStrokes = [
  { id: '1', label: 'Freestyle', value: 'freestyle', time: '1:23', active: true },
  { id: '2', label: 'Backstroke', value: 'backstroke', time: '1:45', active: false },
  { id: '3', label: 'Breaststroke', value: 'breaststroke', time: '1:56', active: false },
];

// Tab Component Sample Data
export const segmentedOptions = [
  { value: 'list', label: 'List', icon: 'list' as const },
  { value: 'grid', label: 'Grid', icon: 'grid' as const },
  { value: 'card', label: 'Card', icon: 'card' as const },
];

export const iconTabOptions = [
  { value: 'home', icon: 'home' as const, label: 'Home' },
  { value: 'stats', icon: 'stats-chart' as const, label: 'Stats', badge: { count: 5 } },
  { value: 'calendar', icon: 'calendar' as const, label: 'Schedule', badge: { showDot: true } },
  { value: 'settings', icon: 'settings' as const, label: 'Settings' },
];

export const fixedTabOptions = [
  { value: 'all', label: 'All', badge: 24 },
  { value: 'active', label: 'Active', badge: 12, icon: 'checkmark-circle' as const },
  { value: 'completed', label: 'Completed', badge: 8, icon: 'checkmark-done' as const },
  { value: 'pending', label: 'Pending', badge: 4, icon: 'time' as const },
];

export const pillTabOptions = [
  { value: 'beginner', label: 'Beginner', count: 15, icon: 'star' as const },
  { value: 'intermediate', label: 'Intermediate', count: 8, icon: 'star-half' as const },
  { value: 'advanced', label: 'Advanced', count: 3, icon: 'trophy' as const },
  { value: 'expert', label: 'Expert', count: 1, icon: 'medal' as const },
];

// Menu Options Sample Data
export const sampleMenuOptions = [
  { id: '1', label: 'Swimming Lessons', value: 'swimming', icon: 'water', onPress: () => console.log('Swimming selected') },
  { id: '2', label: 'Basketball Classes', value: 'basketball', icon: 'basketball', onPress: () => console.log('Basketball selected') },
  { id: '3', label: 'Football Training', value: 'football', icon: 'football', onPress: () => console.log('Football selected') },
  { id: '4', label: 'Music Lessons', value: 'music', icon: 'musical-notes', onPress: () => console.log('Music selected') },
  { id: '5', label: 'Coding Classes', value: 'coding', icon: 'code', onPress: () => console.log('Coding selected') },
];

// Notifications Sample Data
export const sampleNotifications = [
  {
    id: '1',
    title: 'Reminder!',
    message: 'Sarah Johnson has progressed to Swimming Club: Level 2 Class 2 with Tutor Mike Chen on 15/08/24.',
    timestamp: '2 hrs ago',
    isRead: false,
    type: 'reminder' as const,
  },
  {
    id: '2',
    title: 'Class Update',
    message: 'New lesson scheduled for tomorrow at 10:00 AM in Studio A.',
    timestamp: 'Yesterday',
    isRead: false,
    type: 'update' as const,
  },
  {
    id: '3',
    title: 'Payment Received',
    message: 'Payment of ₦48,000 has been processed for Tom Wilson\'s program lessons.',
    timestamp: '2 days ago',
    isRead: true,
    type: 'info' as const,
  },
];

// Student Info Sample Data
export const sampleStudentInfo = {
  id: '1',
  name: 'Sarah Johnson',
  avatar: 'https://via.placeholder.com/50',
  level: 'Level 2',
  className: 'Class 3',
  progress: 75,
  attendance: {
    attended: 8,
    absence: 2,
    sessions: 10,
  },
  paymentStatus: 'fully-paid' as const,
  studentType: 'regular' as const,
  tags: ['School'],
};

// Grouped Sections Sample Data
export const sampleGroupedSections = [
  {
    id: 'ungrouped',
    title: 'Ungrouped',
    count: 5,
    items: [
      {
        id: '1',
        name: 'Alex Rodriguez',
        currentLevel: 'L2S2 - Introduction to Butterfly',
        starRating: 4,
        status: 'active' as const,
      },
      {
        id: '2', 
        name: 'Maya Patel',
        currentLevel: 'L1S3 - Freestyle Basics',
        starRating: 3,
        status: 'active' as const,
      },
    ],
    initialExpanded: true,
  },
  {
    id: 'advanced',
    title: '5 stars',
    count: 3,
    items: [
      {
        id: '3',
        name: 'Jake Thompson',
        currentLevel: 'L3S1 - Advanced Techniques',
        starRating: 5,
        status: 'active' as const,
      },
    ],
    initialExpanded: false,
  },
];

// Metric Data Sample Data
export const sampleMetricData = [
  [
    {
      id: '1',
      skill: 'Freestyle: 25m',
      count: 45,
      swolf: 85,
    },
    {
      id: '2',
      skill: 'Backstroke: 25m', 
      count: 32,
      swolf: 92,
    },
  ]
];

// Time Metrics Sample Data
export const sampleTimeMetrics = [
  [
    {
      id: '1',
      skill: 'Freestyle: 50m',
      time: '1:23.45',
      improvement: 12,
    },
    {
      id: '2',
      skill: 'Butterfly: 25m',
      time: '0:45.67',
      improvement: -5,
    },
  ]
];

// ControlCard Sample Data
export const sampleControlCardQueryFilter: ControlCardFilterItem[] = [
  { label: 'Total Students', num: '24' },
  { label: 'Present Today', num: '18' },
  { label: 'Absent', num: '6' },
  { label: 'New This Week', num: '3' },
];

export const sampleControlCardQuickFilter: QuickFilterItem[] = [
  { label: 'All Students', count: '24' },
  { label: 'Present', count: '18' },
  { label: 'Absent', count: '6' },
  { label: 'Late Arrival', count: '2' },
  { label: 'Early Departure', count: '1' },
];

export const sampleControlCardMarkedDates: string[] = [
  '2024-03-15',
  '2024-03-18',
  '2024-03-22',
  '2024-03-25',
  '2024-03-29',
];