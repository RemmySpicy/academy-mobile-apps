# Academy Apps - Extracted Components Reference

This comprehensive guide documents all components extracted from the Academy Apps instructor app existing code and modernized for the shared library.

## 📊 **Component Overview**

**Total Components Extracted: 25+**
- 10 Core UI Components
- 4 Search System Components  
- 4 Calendar Components
- 5 Performance Components
- 3 Scheduling Components
- 1 Student Management Component
- 3+ Enhanced Hooks
- 15+ Utility Functions

## 🎨 **Core UI Components**

### **ToggleCard**
**Location:** `@academy/mobile-shared`
**Purpose:** Expandable/collapsible card with count badge and Academy theming

```typescript
import { ToggleCard } from '@academy/mobile-shared';

<ToggleCard
  title="Swimming Sessions"
  count={12}
  initialExpanded={false}
  onToggle={(expanded) => console.log('Expanded:', expanded)}
  widthPercentage={0.9}
/>
```

**Features:**
- Academy purple theming
- Responsive design for mobile/tablet
- Animated expand/collapse with Academy-styled chevron
- Optional count badge with customizable colors
- Touch feedback with proper accessibility

---

### **ControlCard**
**Location:** `@academy/mobile-shared`
**Purpose:** Complex control panel with calendar, filters, and search integration

```typescript
import { ControlCard } from '@academy/mobile-shared';

<ControlCard
  schoolName="Academy School"
  dateSchedule="Week of Dec 16-22"
  markedDates={['2024-12-18', '2024-12-20']}
  onDateSelect={(date) => handleDateSelect(date)}
  queryFilter={[
    { label: 'Students', num: '24' },
    { label: 'Classes', num: '6' }
  ]}
  viewName="Class Views"
  groupName="All Groups"
  quickFilter={[
    { label: 'Present', count: '18' },
    { label: 'Absent', count: '6' }
  ]}
/>
```

**Features:**
- Week view navigation with day selection
- Statistical query filters with counts
- Search and group filter controls
- Quick filter pills with count badges
- Calendar modal integration (placeholder)
- Academy design system integration

---

### **FilterComponent**
**Location:** `@academy/mobile-shared`
**Purpose:** Bottom sheet filter with animated overlays

```typescript
import { FilterComponent, type FilterGroup } from '@academy/mobile-shared';

const groups: FilterGroup[] = [
  { id: '1', name: 'Morning', displayName: 'Morning Classes' },
  { id: '2', name: 'Afternoon', displayName: 'Afternoon Classes' },
];

<FilterComponent
  groups={groups}
  groupName="Morning"
  allNames="All Students (24)"
  setActiveSearch={(active) => setSearchVisible(active)}
  onGroupChange={(group) => handleGroupChange(group)}
  onStudentFilter={() => openStudentFilter()}
/>
```

**Features:**
- Custom bottom sheet without external dependencies
- Animated overlays with smooth transitions
- Academy theming with proper touch targets
- Accessibility support with proper roles
- Loading states and error handling

---

### **EmptySearchResult**
**Location:** `@academy/mobile-shared`
**Purpose:** User-friendly empty state display

```typescript
import { EmptySearchResult } from '@academy/mobile-shared';

<EmptySearchResult
  title="No Results Found"
  description="Try adjusting your search criteria"
  iconName="search"
  imageSource={customImage}
  iconSize={48}
/>
```

**Features:**
- Customizable icon from Ionicons
- Alternative image support
- Academy typography and spacing
- Responsive design for different screen sizes

---

### **SelectOptions**
**Location:** `@academy/mobile-shared`
**Purpose:** Multi-select option grid with responsive layout

```typescript
import { SelectOptions, type SelectOption } from '@academy/mobile-shared';

const options: SelectOption[] = [
  { id: '1', label: 'Beginner', value: 'beginner' },
  { id: '2', label: 'Advanced', value: 'advanced', disabled: true },
];

<SelectOptions
  title="Swimming Level"
  options={options}
  value={selectedValues}
  onSelectionChange={(selected) => setSelectedValues(selected)}
  multiSelect={true}
  columns={2}
  minOptionWidth={120}
/>
```

**Features:**
- Single or multi-select modes
- Auto-calculated responsive columns
- Academy theming with pressed states
- Proper accessibility support

---

### **OptionMenu**
**Location:** `@academy/mobile-shared`
**Purpose:** Dropdown menu component with Academy styling

```typescript
import { OptionMenu } from '@academy/mobile-shared';

<OptionMenu
  options={[
    { id: '1', label: 'Edit', iconName: 'pencil', onPress: handleEdit },
    { id: '2', label: 'Delete', iconName: 'trash', onPress: handleDelete, destructive: true }
  ]}
  position="bottom"
  triggerComponent={<CustomButton title="Actions" />}
/>
```

**Features:**
- Auto-positioning with screen boundary detection
- Academy theming with proper contrast
- Icon support from Ionicons
- Destructive action styling

---

### **TimesTab & StrokeTab**
**Location:** `@academy/mobile-shared`
**Purpose:** Specialized tab selectors for swimming academy

```typescript
import { TimesTab, StrokeTab } from '@academy/mobile-shared';

// Time period selector
<TimesTab
  tabs={['Today', 'Week', 'Month']}
  activeTab="Week"
  onTabChange={setActiveTab}
  showEmptyState={results.length === 0}
  emptyStateProps={{
    title: "No sessions",
    description: "Try a different time period"
  }}
/>

// Swimming stroke selector with performance
<StrokeTab
  tabs={['Freestyle', 'Backstroke', 'Butterfly']}
  activeTab="Freestyle"
  onTabChange={setStroke}
  performanceTimes={[
    { stroke: 'Freestyle', time: '1:45', change: '+0:03', improved: false },
    { stroke: 'Backstroke', time: '2:10', change: '-0:05', improved: true }
  ]}
  onPerformancePress={(stroke) => viewDetails(stroke)}
/>
```

---

### **CustomModalWithDot**
**Location:** `@academy/mobile-shared`
**Purpose:** Bottom sheet-style modal with close dot

```typescript
import { CustomModalWithDot } from '@academy/mobile-shared';

<CustomModalWithDot
  visible={isVisible}
  onClose={() => setIsVisible(false)}
  swipeToClose={true}
  backdropOpacity={0.5}
>
  <YourModalContent />
</CustomModalWithDot>
```

**Features:**
- Smooth slide animations
- Swipe-to-close gesture
- Backdrop dismiss
- Academy theming

---

## 🔍 **Search System Components**

### **SearchInput**
**Location:** `@academy/mobile-shared`
**Purpose:** Debounced search input with clear functionality

```typescript
import { SearchInput } from '@academy/mobile-shared';

<SearchInput
  value={searchValue}
  onChangeText={setSearchValue}
  placeholder="Search students, instructors..."
  showClearButton={true}
  onClear={() => setSearchValue('')}
/>
```

### **FilterChip**
**Location:** `@academy/mobile-shared`
**Purpose:** Interactive filter chips with count display

```typescript
import { FilterChip } from '@academy/mobile-shared';

<FilterChip
  label="Active Sessions"
  value="active"
  selected={true}
  count={12}
  icon="checkmark-circle"
  variant="primary"
  onPress={(value) => handleFilter(value)}
/>
```

### **QuickFilterBar**
**Location:** `@academy/mobile-shared`
**Purpose:** Horizontal scrollable filter system

```typescript
import { QuickFilterBar, useQuickFilters } from '@academy/mobile-shared';

const { selectedFilters, handleFilterChange } = useQuickFilters(['active'], true);

<QuickFilterBar
  filters={[
    { id: '1', label: 'Active', value: 'active', count: 12, icon: 'checkmark-circle' },
    { id: '2', label: 'Pending', value: 'pending', count: 5, icon: 'time' }
  ]}
  selectedFilters={selectedFilters}
  onFilterChange={handleFilterChange}
  multiSelect={true}
  showCount={true}
/>
```

### **SearchBar**
**Location:** `@academy/mobile-shared`
**Purpose:** Complete search interface with filters and actions

```typescript
import { SearchBar, SimpleSearchBar } from '@academy/mobile-shared';

// Full search bar
<SearchBar
  searchProps={{
    value: searchValue,
    onChangeText: setSearchValue,
    placeholder: "Search Academy...",
  }}
  filterProps={{
    filters: filterItems,
    selectedFilters: selectedFilters,
    onFilterChange: handleFilterChange,
    multiSelect: true,
  }}
  title="Academy Search"
  subtitle="Find students, instructors, and sessions"
  actions={[
    { label: "Done", onPress: handleDone, variant: 'primary' }
  ]}
/>

// Simple search bar
<SimpleSearchBar
  value={searchValue}
  onChangeText={setSearchValue}
  placeholder="Quick search..."
  onDonePress={handleDone}
/>
```

---

## 📅 **Calendar Components**

### **Calendar**
**Location:** `@academy/mobile-shared`
**Purpose:** Basic calendar with event support

### **DatePicker**
**Location:** `@academy/mobile-shared`
**Purpose:** Modal date picker with Academy styling

### **ClassroomCalendar**
**Location:** `@academy/mobile-shared`
**Purpose:** Specialized classroom calendar with attendance tracking

```typescript
import { ClassroomCalendar } from '@academy/mobile-shared';

<ClassroomCalendar
  currentDate="2024-12-18"
  events={[
    {
      date: '2024-12-18',
      type: 'class',
      title: 'Swimming Lesson',
      color: theme.colors.interactive.primary
    }
  ]}
  onDatePress={(date) => handleDatePress(date)}
  term="Current Term"
/>
```

### **StudentProfileCalendar**
**Location:** `@academy/mobile-shared`
**Purpose:** Interactive calendar for student profiles

```typescript
import { StudentProfileCalendar } from '@academy/mobile-shared';

<StudentProfileCalendar
  selectedDate="2024-12-18"
  onDateSelect={(date) => handleDateSelect(date)}
  events={studentEvents}
  enableNavigation={true}
  allowPastNavigation={false}
  allowFutureNavigation={true}
/>
```

---

## 🏊 **Performance Components**

### **WorkoutCard**
**Location:** `@academy/mobile-shared`
**Purpose:** Display workout sessions with instructor and progress

### **ClassroomCard**
**Location:** `@academy/mobile-shared`
**Purpose:** Classroom information with capacity and status

### **Performance**
**Location:** `@academy/mobile-shared`
**Purpose:** Main performance dashboard component

### **PerformanceTimes**
**Location:** `@academy/mobile-shared`
**Purpose:** Time-based performance metrics display

### **ClassroomProgressCard**
**Location:** `@academy/mobile-shared`
**Purpose:** Progress tracking for classroom activities

---

## 📋 **Scheduling Components**

### **ScheduleInput**
**Location:** `@academy/mobile-shared`
**Purpose:** Session schedule input with date/time pickers

```typescript
import { ScheduleInput } from '@academy/mobile-shared';

<ScheduleInput
  sessionName="Swimming Lesson"
  onSessionNameChange={setSessionName}
  selectedDate="2024-12-18"
  onDateChange={setSelectedDate}
  selectedTime="10:00"
  onTimeChange={setSelectedTime}
  instructorName="Sarah Johnson"
  onInstructorChange={setInstructor}
  onSave={handleSave}
/>
```

### **ScheduleList**
**Location:** `@academy/mobile-shared`
**Purpose:** Schedule display with status management

```typescript
import { ScheduleList } from '@academy/mobile-shared';

<ScheduleList
  schedules={scheduleItems}
  onEditSchedule={(id) => handleEdit(id)}
  onCancelSchedule={(id) => handleCancel(id)}
  onRescheduleSchedule={(id) => handleReschedule(id)}
  showStatusFilter={true}
/>
```

### **Schedules**
**Location:** `@academy/mobile-shared`
**Purpose:** Comprehensive schedule management

```typescript
import { Schedules } from '@academy/mobile-shared';

<Schedules
  schedules={scheduleData}
  onAddSchedule={handleAddSchedule}
  onEditSchedule={handleEditSchedule}
  onDeleteSchedule={handleDeleteSchedule}
/>
```

---

## 👥 **Student Components**

### **StudentProfile**
**Location:** `@academy/mobile-shared`
**Purpose:** Complete student profile with progress and achievements

```typescript
import { StudentProfile, type StudentProfileData } from '@academy/mobile-shared';

const student: StudentProfileData = {
  id: "1",
  firstName: "Benson",
  lastName: "Adeyemi", 
  level: "Level 2: Fundamental Aquatic Skills",
  currentClass: "Class 3: Introduction to Breaststroke",
  avatar: "https://example.com/avatar.jpg",
  parentName: "John Adeyemi",
  parentContact: "+1234567890",
  instructorName: "Sarah Johnson",
  // ... more student data
};

<StudentProfile
  visible={showProfile}
  onClose={() => setShowProfile(false)}
  student={student}
  onEditProfile={() => openEditMode()}
  onViewPerformanceMetrics={() => openMetrics()}
  onContactParent={() => initiateContact()}
  onContactInstructor={() => contactInstructor()}
/>
```

**Features:**
- Full student information display
- Parent and instructor contact integration
- Progress summary with term navigation
- Interactive timeline with performance tracking
- Attendance statistics
- Achievement showcase with expandable view
- Avatar and background image editing
- Academy theming throughout

---

## 🪝 **Enhanced Hooks**

### **useDebounce**
**Location:** `@academy/mobile-shared`
**Purpose:** Advanced debounce with leading/trailing/maxWait options

```typescript
import { useDebounce, useDebouncedCallback } from '@academy/mobile-shared';

// Debounce a value
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebounce(searchTerm, 300);

// Debounce a callback
const { callback: debouncedSave, cancel, flush, isPending } = useDebouncedCallback(
  (data) => saveData(data),
  500,
  { leading: true, trailing: true, maxWait: 2000 }
);
```

### **useScreenDimensions**
**Location:** `@academy/mobile-shared`
**Purpose:** Enhanced responsive design with tablet support

```typescript
import { useScreenDimensions } from '@academy/mobile-shared';

const { width, height, isTablet, isPhone, isLandscape } = useScreenDimensions();

// Usage in component
const styles = createStyles({
  container: {
    padding: isTablet ? 24 : 16,
    flexDirection: isLandscape ? 'row' : 'column'
  }
});
```

### **useLocationPermission**
**Location:** `@academy/mobile-shared`
**Purpose:** Location permission management for Academy apps

```typescript
import { useLocationPermission } from '@academy/mobile-shared';

const { 
  hasPermission, 
  requestPermission, 
  permissionStatus,
  isLoading 
} = useLocationPermission();
```

---

## 🛠 **Utility Functions**

**Location:** `@academy/mobile-shared`
**Available Utilities:** 15+ helper functions including:

- Date/time formatting utilities
- String manipulation functions
- Validation helpers
- Academy-specific formatters
- Permission utilities
- Storage helpers

```typescript
import { 
  formatCurrency,
  formatDate,
  formatProgress,
  validateEmail,
  formatInitials,
  truncateText 
} from '@academy/mobile-shared';

// Usage examples
const formattedPrice = formatCurrency(29.99, 'USD');
const displayDate = formatDate(new Date(), 'MMM DD, YYYY');
const progress = formatProgress(0.75); // "75%"
const isValid = validateEmail('user@academy.com');
const initials = formatInitials('John', 'Doe'); // "JD"
const shortText = truncateText('Long text here...', 50);
```

---

## 🎨 **Academy Design System Integration**

All extracted components follow Academy design patterns:

### **Colors**
- **Primary:** `theme.colors.interactive.primary` (#4F2EC9 - Academy Purple)
- **Text:** `theme.colors.text.primary/secondary/tertiary`
- **Background:** `theme.colors.background.primary/secondary/elevated`
- **Status:** `theme.colors.status.success/warning/error`

### **Typography**
- **Headings:** `theme.typography.heading.h1-h6`
- **Body:** `theme.typography.body.base/sm/lg`
- **Captions:** `theme.typography.caption.base`

### **Spacing**
- **Consistent:** `theme.spacing.xs/sm/md/lg/xl`
- **Component:** `theme.componentSpacing.*`

### **Accessibility**
- Proper `accessibilityRole` and `accessibilityLabel`
- Minimum touch targets (44x44pt)
- High contrast color ratios
- Screen reader support

---

## 📱 **Usage in Apps**

### **Import Pattern**
```typescript
// Individual components
import { ControlCard, FilterComponent, StudentProfile } from '@academy/mobile-shared';

// With types
import type { 
  ControlCardProps, 
  FilterComponentProps, 
  StudentProfileData 
} from '@academy/mobile-shared';
```

### **Theme Provider Required**
```typescript
import { ThemeProvider } from '@academy/mobile-shared';

export default function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

---

## 🧪 **Testing & Development**

### **Component Showcase**
Access all components through the ExtractedComponentsShowcase:

1. Run app in development mode (`__DEV__ = true`)
2. Navigate to "Extracted" tab with cube icon 📦
3. Explore 9 sections: Overview, UI, Search, Calendar, Performance, Scheduling, Student, Advanced, Hooks

### **TypeScript Support**
All components are fully typed with:
- Proper prop interfaces
- Type exports for data structures
- Generic type support where applicable
- Zero TypeScript compilation errors

### **Production Ready**
- Academy design system integration
- Responsive mobile/tablet design
- Accessibility compliance
- Modern React 19 patterns
- Performance optimized

---

## 📚 **Related Documentation**

- [Academy Design System](../THEME_SYSTEM.md)
- [Component Showcase Guide](./COMPONENT_SHOWCASE_GUIDE.md) 
- [Development Guide](./DEVELOPMENT_GUIDE.md)
- [Architecture Overview](../architecture/SYSTEM_OVERVIEW.md)

---

## 🎯 **Migration from Existing Code**

If migrating from `existing-code/` directory:

1. **Replace imports:**
   ```typescript
   // Old
   import ToggleCard from '../existing-code/src/screens/home/components/reuseable/ToggleCard';
   
   // New
   import { ToggleCard } from '@academy/mobile-shared';
   ```

2. **Update prop names:**
   - Check component interfaces for exact prop names
   - Some props may be renamed for consistency

3. **Theme integration:**
   - Components now use Academy theme system
   - Remove hardcoded colors/spacing
   - Wrap app in `ThemeProvider`

4. **TypeScript benefits:**
   - Full type safety
   - Better IDE autocomplete
   - Compile-time error checking

---

**The Academy Apps shared component library provides a comprehensive, production-ready set of components following modern React patterns and Academy design standards. All components are accessible, responsive, and ready for use across both instructor and student applications.**