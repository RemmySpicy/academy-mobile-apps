import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

// Components
import { ToggleCard, OptionMenu, TabBar, StrokeTab, SegmentedControl, IconTabBar, Alert as ToastAlert, MenuList, MetricPool, Stations, LoadingSpinner, NotificationList, BottomSheet, BottomSheetProvider, useBottomSheet, useBottomSheetActions, useBottomSheetState, useQuickBottomSheet } from '../../../components/ui';
import { EmptySearchResult } from '../../../components/ui/EmptySearchResult';
import { SelectOptions } from '../../../components/ui/SelectOptions';
import { FormDropdown } from '../../../components/ui/FormDropdown';
import { HeaderComponent } from '../../../components/ui/HeaderComponent';
import FilterBar from '../../../components/ui/FilterBar';
import Lessons from '../../../components/ui/Lessons';
import { Chip } from '../../../components/ui/Chip';
import { StudentCard } from '../../../components/academy';
import { CustomButton } from '../../../components/forms';

// Conditional Rendering Components
import { 
  Show, 
  ShowWhen, 
  ShowElse, 
  ShowUnless, 
  ShowSwitch, 
  ShowCase, 
  ShowDefault, 
  when, 
  unless, 
  either, 
  switchRender, 
  withConditionalRender, 
  useConditionalRender 
} from '../../../components/ui';

// Types
import type { ShowcaseSectionProps } from '../types/showcaseTypes';

// Sample Data
import {
  sampleSelectOptions,
  sampleDropdownOptions,
  largeDropdownOptions,
  sampleFilterGroups,
  sampleMenuOptions,
  sampleNotifications,
  sampleStudents,
  sampleLessons,
  segmentedOptions,
  iconTabOptions,
  fixedTabOptions,
  pillTabOptions,
  sampleStrokes,
} from '../data/sampleData';

const UIComponentsSection: React.FC<ShowcaseSectionProps> = ({ theme, styles, screenDimensions }) => {
  // Component states for demo
  const [selectOptionsValue, setSelectOptionsValue] = useState<string[]>([]);
  const [singleSelectValue, setSingleSelectValue] = useState<string>('beginner');
  const [disabledSelectValue, setDisabledSelectValue] = useState<string>('option1');
  const [dropdownValue, setDropdownValue] = useState<string>('');
  const [searchableDropdownValue, setSearchableDropdownValue] = useState<string>('');
  const [filterBarSelectedFilters, setFilterBarSelectedFilters] = useState<{ [groupId: string]: string[] }>({});
  
  // Tab component state values
  const [segmentedValue, setSegmentedValue] = useState('list');
  const [iconTabValue, setIconTabValue] = useState('home');
  const [fixedTabValue, setFixedTabValue] = useState('all');
  const [pillTabsValue, setChipValue] = useState(['beginner']);
  
  // Bottom Sheet state values
  const [standardBottomSheetVisible, setStandardBottomSheetVisible] = useState(false);
  const [studentDetailsSheetVisible, setStudentDetailsSheetVisible] = useState(false);
  const [quickActionsSheetVisible, setQuickActionsSheetVisible] = useState(false);

  // Conditional Rendering state values
  const [showContent, setShowContent] = useState(true);
  const [userRole, setUserRole] = useState<'admin' | 'instructor' | 'student'>('instructor');
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [currentView, setCurrentView] = useState<'list' | 'grid' | 'calendar'>('list');
  const [studentCount, setStudentCount] = useState(15);

  const handleFilterBarChange = (groupId: string, optionId: string, selected: boolean) => {
    setFilterBarSelectedFilters(prev => {
      const currentFilters = prev[groupId] || [];
      if (selected) {
        return { ...prev, [groupId]: [...currentFilters, optionId] };
      } else {
        return { ...prev, [groupId]: currentFilters.filter(id => id !== optionId) };
      }
    });
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>🎨 UI Components Library</Text>
      <Text style={styles.sectionDescription}>
        Comprehensive collection of 20+ UI components with Academy theming and modern React patterns
      </Text>

      {/* Phase 1: Core Components Section */}
      <View style={styles.componentSection}>
        <Text style={[styles.subsectionTitle, { color: theme.colors.interactive.primary, fontSize: 18 }]}>
          📋 Phase 1: Core UI Components
        </Text>
        
        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>ToggleCard Variants</Text>
          
          {/* Status Variants */}
          <Text style={[styles.componentDescription, { fontWeight: '600', marginBottom: 8 }]}>
            Status Variants
          </Text>
          
          <ToggleCard
            title="Default Toggle"
            count={8}
            variant="default"
            onToggle={(expanded) => console.log('Default Toggle:', expanded)}
          />
          
          <ToggleCard
            title="Primary Notice"
            count={3}
            variant="primary"
            onToggle={(expanded) => console.log('Primary Toggle:', expanded)}
          />
          
          <ToggleCard
            title="Mark Present"
            count={12}
            variant="success"
            onToggle={(expanded) => console.log('Success Toggle:', expanded)}
          />
          
          <ToggleCard
            title="Unmarked List"
            count={5}
            variant="warning"
            onToggle={(expanded) => console.log('Warning Toggle:', expanded)}
          />
          
          <ToggleCard
            title="Mark Absent"
            count={2}
            variant="error"
            onToggle={(expanded) => console.log('Error Toggle:', expanded)}
          />
          
          <ToggleCard
            title="Additional Info"
            count={1}
            variant="info"
            onToggle={(expanded) => console.log('Info Toggle:', expanded)}
          />
          
          {/* Size Variants */}
          <Text style={[styles.componentDescription, { fontWeight: '600', marginTop: 16, marginBottom: 8 }]}>
            Size Variants
          </Text>
          
          <ToggleCard
            title="Small Toggle"
            count={3}
            size="sm"
            variant="primary"
            onToggle={(expanded) => console.log('Small Toggle:', expanded)}
          />
          
          <ToggleCard
            title="Medium Toggle"
            count={7}
            size="md"
            variant="success"
            onToggle={(expanded) => console.log('Medium Toggle:', expanded)}
          />
          
          <ToggleCard
            title="Large Toggle"
            count={15}
            size="lg"
            variant="warning"
            onToggle={(expanded) => console.log('Large Toggle:', expanded)}
          />
          
          {/* Style Variants */}
          <Text style={[styles.componentDescription, { fontWeight: '600', marginTop: 16, marginBottom: 8 }]}>
            Style Variants
          </Text>
          
          <ToggleCard
            title="Filled Style"
            count={4}
            variant="primary"
            styleVariant="filled"
            onToggle={(expanded) => console.log('Filled Toggle:', expanded)}
          />
          
          <ToggleCard
            title="Outlined Style"
            count={6}
            variant="success"
            styleVariant="outlined"
            onToggle={(expanded) => console.log('Outlined Toggle:', expanded)}
          />
          
          <ToggleCard
            title="Ghost Style"
            count={2}
            variant="warning"
            styleVariant="ghost"
            onToggle={(expanded) => console.log('Ghost Toggle:', expanded)}
          />
          
          <ToggleCard
            title="Elevated Style"
            count={9}
            variant="info"
            styleVariant="elevated"
            onToggle={(expanded) => console.log('Elevated Toggle:', expanded)}
          />
          
          {/* Icon Variants */}
          <Text style={[styles.componentDescription, { fontWeight: '600', marginTop: 16, marginBottom: 8 }]}>
            Icon Variants
          </Text>
          
          <ToggleCard
            title="Arrow Icons"
            count={3}
            variant="default"
            iconStyle="arrow"
            onToggle={(expanded) => console.log('Arrow Toggle:', expanded)}
          />
          
          <ToggleCard
            title="Chevron Icons"
            count={5}
            variant="primary"
            iconStyle="chevron"
            onToggle={(expanded) => console.log('Chevron Toggle:', expanded)}
          />
          
          <ToggleCard
            title="Plus/Minus Icons"
            count={7}
            variant="success"
            iconStyle="plus"
            onToggle={(expanded) => console.log('Plus Toggle:', expanded)}
          />
          
          <Text style={styles.componentDescription}>
            Comprehensive expandable cards with status variants, size options, style variants, and icon styles for Academy Apps
          </Text>
        </View>

        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>SelectOptions</Text>
          
          {/* Multi-select variant */}
          <Text style={[styles.componentDescription, { fontWeight: '600', marginBottom: 8 }]}>
            Multi-Select Mode
          </Text>
          <SelectOptions
            title="Swimming Levels (Multi-select)"
            options={sampleSelectOptions}
            value={selectOptionsValue}
            onSelectionChange={(selected) => {
              setSelectOptionsValue(Array.isArray(selected) ? selected : [selected]);
            }}
            multiSelect={true}
          />
          
          {/* Single-select variant */}
          <Text style={[styles.componentDescription, { fontWeight: '600', marginTop: 16, marginBottom: 8 }]}>
            Single-Select Mode
          </Text>
          <SelectOptions
            title="Primary Swimming Level (Single-select)"
            options={sampleSelectOptions}
            value={singleSelectValue}
            onSelectionChange={(selected) => {
              setSingleSelectValue(typeof selected === 'string' ? selected : selected[0]);
            }}
            multiSelect={false}
          />
          
          {/* Size variants */}
          <Text style={[styles.componentDescription, { fontWeight: '600', marginTop: 16, marginBottom: 8 }]}>
            Size Variants
          </Text>
          <SelectOptions
            title="Small Size"
            options={['Option 1', 'Option 2', 'Option 3']}
            value="Option 1"
            size="sm"
            multiSelect={false}
          />
          <SelectOptions
            title="Medium Size (Default)"
            options={['Option 1', 'Option 2', 'Option 3']}
            value="Option 1"
            size="md"
            multiSelect={false}
          />
          <SelectOptions
            title="Large Size"
            options={['Option 1', 'Option 2', 'Option 3']}
            value="Option 1"
            size="lg"
            multiSelect={false}
          />
          
          {/* Visual style variants */}
          <Text style={[styles.componentDescription, { fontWeight: '600', marginTop: 16, marginBottom: 8 }]}>
            Visual Style Variants
          </Text>
          <SelectOptions
            title="Filled Style (Default)"
            options={['Option A', 'Option B', 'Option C']}
            value="Option A"
            variant="filled"
            multiSelect={false}
          />
          <SelectOptions
            title="Outlined Style"
            options={['Option A', 'Option B', 'Option C']}
            value="Option A"
            variant="outlined"
            multiSelect={false}
          />
          <SelectOptions
            title="Minimal Style"
            options={['Option A', 'Option B', 'Option C']}
            value="Option A"
            variant="minimal"
            multiSelect={false}
          />
          
          {/* Disabled state variant */}
          <Text style={[styles.componentDescription, { fontWeight: '600', marginTop: 16, marginBottom: 8 }]}>
            Disabled States
          </Text>
          <SelectOptions
            title="Disabled Component"
            options={['Option 1', 'Option 2', 'Option 3']}
            value={disabledSelectValue}
            onSelectionChange={(selected) => {
              setDisabledSelectValue(typeof selected === 'string' ? selected : selected[0]);
            }}
            disabled={true}
            multiSelect={false}
          />
          <SelectOptions
            title="Mixed Disabled Options"
            options={[
              { id: '1', label: 'Available Option', value: 'available' },
              { id: '2', label: 'Disabled Option', value: 'disabled', disabled: true },
              { id: '3', label: 'Another Available', value: 'available2' },
            ]}
            value="available"
            multiSelect={false}
          />

          {/* Column variants */}
          <Text style={[styles.componentDescription, { fontWeight: '600', marginTop: 16, marginBottom: 8 }]}>
            Layout Variants
          </Text>
          <SelectOptions
            title="2-Column Layout"
            options={['Option A', 'Option B', 'Option C', 'Option D', 'Option E', 'Option F']}
            value={['Option A']}
            columns={2}
            multiSelect={true}
            onSelectionChange={(value) => setSelectOptionsValue(Array.isArray(value) ? value : [value])}
          />
          <SelectOptions
            title="3-Column Layout"
            options={['Opt 1', 'Opt 2', 'Opt 3', 'Opt 4', 'Opt 5', 'Opt 6']}
            value={['Opt 1']}
            columns={3}
            multiSelect={true}
          />

          {/* Complex options demo */}
          <Text style={[styles.componentDescription, { fontWeight: '600', marginTop: 16, marginBottom: 8 }]}>
            Complex Options with Custom Data
          </Text>
          <SelectOptions
            title="Program Selection"
            options={[
              { id: 'swim', label: 'Swimming Program', value: 'swimming' },
              { id: 'football', label: 'Football Training', value: 'football' },
              { id: 'basketball', label: 'Basketball Skills', value: 'basketball' },
              { id: 'music', label: 'Music Lessons', value: 'music' },
              { id: 'coding', label: 'Coding Bootcamp', value: 'coding', disabled: true },
            ]}
            value={['swimming', 'football']}
            multiSelect={true}
            size="lg"
            variant="outlined"
          />
          
          <Text style={styles.componentDescription}>
            🎯 **SelectOptions Coverage**: Grid-based selection with comprehensive variants: single/multi-select, 3 sizes, 3 visual styles, disabled states, custom layouts, and Academy theming.
          </Text>
        </View>

        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>FormDropdown</Text>
          
          {/* Basic dropdown */}
          <Text style={[styles.componentDescription, { fontWeight: '600', marginBottom: 8 }]}>
            Basic Form Dropdown
          </Text>
          <FormDropdown
            label="Role Assignment"
            options={sampleDropdownOptions}
            value={dropdownValue}
            onSelectionChange={setDropdownValue}
            placeholder="Select a role"
            required
          />
          
          {/* Searchable dropdown */}
          <Text style={[styles.componentDescription, { fontWeight: '600', marginTop: 16, marginBottom: 8 }]}>
            Searchable Dropdown (Large Option Set)
          </Text>
          <FormDropdown
            label="Assign Instructor"
            options={largeDropdownOptions}
            value={searchableDropdownValue}
            onSelectionChange={setSearchableDropdownValue}
            placeholder="Search and select instructor"
            searchable
          />
          
          {/* Error state */}
          <Text style={[styles.componentDescription, { fontWeight: '600', marginTop: 16, marginBottom: 8 }]}>
            Error State
          </Text>
          <FormDropdown
            label="Program Type"
            options={['Swimming', 'Football', 'Basketball']}
            value=""
            placeholder="Select program type"
            error="Please select a program type"
            required
          />
          
          {/* Disabled state */}
          <Text style={[styles.componentDescription, { fontWeight: '600', marginTop: 16, marginBottom: 8 }]}>
            Disabled State
          </Text>
          <FormDropdown
            label="Restricted Field"
            options={sampleDropdownOptions}
            value="swim_instructor"
            disabled
            placeholder="Cannot be changed"
          />
          
          <Text style={styles.componentDescription}>
            🎯 **FormDropdown**: Traditional modal-based dropdown with React Hook Form integration, search capability, icons, error states, and Academy theming. Perfect for forms and large option sets.
            {'\n\n'}📋 **Remaining Gaps**: ListSelector (vertical list layout), CascadingSelector (dependent selections), and specialized range/date selectors.
          </Text>
        </View>

        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>HeaderComponent</Text>
          <HeaderComponent title="Academy Pool" />
          <Text style={styles.componentDescription}>
            Navigation header with Academy branding and responsive layout
          </Text>
        </View>

        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>EmptySearchResult</Text>
          <EmptySearchResult
            title="No Results Found"
            description="Try adjusting your search criteria or filters"
            iconName="search"
          />
          <Text style={styles.componentDescription}>
            User-friendly empty states with customizable icons and messages
          </Text>
        </View>

        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>Enhanced Tab Components</Text>
          
          {/* SegmentedControl */}
          <Text style={[styles.componentDescription, { fontWeight: '600', marginTop: 16, marginBottom: 8 }]}>
            SegmentedControl - iOS-style Selector
          </Text>
          <SegmentedControl
            options={segmentedOptions}
            selectedValue={segmentedValue}
            onChange={setSegmentedValue}
            variant="primary"
            size="md"
          />
          <Text style={styles.componentDescription}>
            Animated segmented control for view modes and settings
          </Text>

          {/* IconTabBar */}
          <Text style={[styles.componentDescription, { fontWeight: '600', marginTop: 16, marginBottom: 8 }]}>
            IconTabBar - Navigation with Badges
          </Text>
          <IconTabBar
            tabs={iconTabOptions}
            activeTab={iconTabValue}
            onTabChange={setIconTabValue}
            variant="default"
            showLabels={true}
            showBadges={true}
          />
          <Text style={styles.componentDescription}>
            Icon-focused navigation with badge support and labels
          </Text>

          {/* TabBar - Fixed Mode */}
          <Text style={[styles.componentDescription, { fontWeight: '600', marginTop: 16, marginBottom: 8 }]}>
            TabBar - Fixed Mode (Equal Width)
          </Text>
          <TabBar
            tabs={fixedTabOptions}
            activeTab={fixedTabValue}
            onTabChange={setFixedTabValue}
            mode="fixed"
            variant="underline"
            showIcons={true}
            showBadges={true}
          />
          <Text style={styles.componentDescription}>
            Non-scrolling tabs with underline indicator and badges
          </Text>

        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>Unified Chip Component</Text>
          <Text style={styles.componentDescription}>
            Consolidated FilterChip and PillTabs into a single powerful component
          </Text>

          {/* Multi-Chip Collection Example */}
          <Text style={[styles.componentDescription, { fontWeight: '600', marginTop: 16, marginBottom: 8 }]}>
            Multi-Chip Collection (Multi-Select)
          </Text>
          <Chip
            chips={pillTabOptions}
            activeChips={pillTabsValue}
            onChipChange={(value) => {
              if (Array.isArray(value)) {
                setChipValue(value);
              } else {
                setChipValue([value]);
              }
            }}
            variant="outlined"
            multiSelect={true}
            showIcons={true}
            showCounts={true}
          />
          <Text style={styles.componentDescription}>
            Multi-select chip collection with icons and count badges
          </Text>

          {/* Single Chip Examples */}
          <Text style={[styles.componentDescription, { fontWeight: '600', marginTop: 20, marginBottom: 8 }]}>
            Single Chip Variants
          </Text>
          <View style={styles.chipContainer}>
            <Chip
              label="Default"
              value="default"
              selected={true}
              count={12}
              variant="default"
              onPress={() => {}}
            />
            <Chip
              label="Primary"
              value="primary"
              selected={true}
              count={8}
              variant="primary"
              onPress={() => {}}
            />
            <Chip
              label="Filled"
              value="filled"
              selected={false}
              count={5}
              variant="filled"
              onPress={() => {}}
            />
            <Chip
              label="Outlined"
              value="outlined"
              selected={false}
              count={3}
              variant="outlined"
              onPress={() => {}}
            />
            <Chip
              label="Ghost"
              value="ghost"
              selected={true}
              count={7}
              variant="ghost"
              onPress={() => {}}
            />
          </View>

          {/* Size Variants */}
          <Text style={[styles.componentDescription, { fontWeight: '600', marginTop: 20, marginBottom: 8 }]}>
            Size Variants
          </Text>
          <View style={styles.chipContainer}>
            <Chip
              label="XS"
              value="xs"
              selected={true}
              count={5}
              size="xs"
              variant="primary"
              onPress={() => {}}
            />
            <Chip
              label="Small"
              value="sm"
              selected={true}
              count={12}
              size="sm"
              variant="primary"
              onPress={() => {}}
            />
            <Chip
              label="Medium"
              value="md"
              selected={true}
              count={25}
              size="md"
              variant="primary"
              onPress={() => {}}
            />
            <Chip
              label="Large"
              value="lg"
              selected={true}
              count={50}
              size="lg"
              variant="primary"
              onPress={() => {}}
            />
          </View>

          {/* Count Styles */}
          <Text style={[styles.componentDescription, { fontWeight: '600', marginTop: 20, marginBottom: 8 }]}>
            Count Display Styles
          </Text>
          <View style={styles.chipContainer}>
            <Chip
              label="Badge Style"
              value="badge"
              selected={true}
              count={12}
              countStyle="badge"
              variant="primary"
              onPress={() => {}}
            />
            <Chip
              label="Inline Style"
              value="inline"
              selected={false}
              count={8}
              countStyle="inline"
              variant="outlined"
              onPress={() => {}}
            />
            <Chip
              label="Separate Style"
              value="separate"
              selected={false}
              count={15}
              countStyle="separate"
              variant="filled"
              onPress={() => {}}
            />
          </View>

          {/* With Icons and Dots */}
          <Text style={[styles.componentDescription, { fontWeight: '600', marginTop: 20, marginBottom: 8 }]}>
            With Icons and Status Dots
          </Text>
          <View style={styles.chipContainer}>
            <Chip
              label="With Icon"
              value="icon"
              selected={true}
              icon="star"
              count={5}
              variant="primary"
              onPress={() => {}}
            />
            <Chip
              label="With Dot"
              value="dot"
              selected={false}
              showDot={true}
              dotColor={theme.colors.status.error}
              variant="outlined"
              onPress={() => {}}
            />
            <Chip
              label="Both"
              value="both"
              selected={true}
              icon="heart"
              showDot={true}
              dotColor={theme.colors.status.success}
              count={3}
              variant="ghost"
              onPress={() => {}}
            />
          </View>
        </View>

          {/* TabBar - Scrollable Mode */}
          <Text style={[styles.componentDescription, { fontWeight: '600', marginTop: 16, marginBottom: 8 }]}>
            TabBar - Scrollable Mode with Icons & Badges
          </Text>
          <TabBar
            tabs={[
              { value: 'week', label: 'This Week', icon: 'calendar' as const, badge: 7 },
              { value: 'month', label: 'This Month', icon: 'calendar-outline' as const, badge: 30 },
              { value: 'year', label: 'This Year', icon: 'calendar-sharp' as const, badge: 365 },
              { value: 'quarter', label: 'Quarter', icon: 'calendar-clear' as const, badge: 90 },
              { value: 'semester', label: 'Semester', icon: 'calendar-number' as const, badge: 180 },
            ]}
            activeTab="week"
            onTabChange={(tab) => console.log('TabBar scrollable changed:', tab)}
            mode="scrollable"
            variant="pills"
            showIcons={true}
            showBadges={true}
            iconPosition="left"
          />
          <Text style={styles.componentDescription}>
            Scrollable tabs with more options, icons, badges, and flexible positioning
          </Text>

          {/* StrokeTab */}
          <Text style={[styles.componentDescription, { fontWeight: '600', marginTop: 16, marginBottom: 8 }]}>
            StrokeTab - Specialized Performance Tabs
          </Text>
          <StrokeTab
            tabs={sampleStrokes}
            activeTab="freestyle"
            onTabChange={(stroke) => console.log('Stroke changed:', stroke)}
            showPerformanceTimes={true}
          />
          <Text style={styles.componentDescription}>
            Swimming stroke selector with performance metrics and timing data
          </Text>
        </View>

        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>Unified TabBar Component</Text>
          <Text style={styles.componentDescription}>
            Consolidated FixedTabBar and TimesTab into a single powerful component
          </Text>

          {/* Variant Examples */}
          <Text style={[styles.componentDescription, { fontWeight: '600', marginTop: 20, marginBottom: 8 }]}>
            TabBar Variants
          </Text>
          
          <Text style={[styles.componentDescription, { marginBottom: 8 }]}>Default Variant</Text>
          <TabBar
            tabs={['All', 'Active', 'Completed', 'Cancelled']}
            activeTab="Active"
            onTabChange={() => {}}
            mode="fixed"
            variant="default"
          />
          
          <Text style={[styles.componentDescription, { marginTop: 16, marginBottom: 8 }]}>Underline Variant</Text>
          <TabBar
            tabs={[
              { value: 'overview', label: 'Overview', icon: 'analytics' },
              { value: 'students', label: 'Students', icon: 'people', badge: 24 },
              { value: 'classes', label: 'Classes', icon: 'school', badge: 8 }
            ]}
            activeTab="students"
            onTabChange={() => {}}
            mode="fixed"
            variant="underline"
            showIcons={true}
            showBadges={true}
          />
          
          <Text style={[styles.componentDescription, { marginTop: 16, marginBottom: 8 }]}>Pills Variant</Text>
          <TabBar
            tabs={[
              { value: 'beginner', label: 'Beginner', badge: 15 },
              { value: 'intermediate', label: 'Intermediate', badge: 8 },
              { value: 'advanced', label: 'Advanced', badge: 3 }
            ]}
            activeTab="intermediate"
            onTabChange={() => {}}
            mode="fixed"
            variant="pills"
            showBadges={true}
          />
          
          <Text style={[styles.componentDescription, { marginTop: 16, marginBottom: 8 }]}>Cards Variant</Text>
          <TabBar
            tabs={['Swimming', 'Football', 'Basketball']}
            activeTab="Swimming"
            onTabChange={() => {}}
            mode="fixed"
            variant="cards"
            size="lg"
          />

          {/* Size Examples */}
          <Text style={[styles.componentDescription, { fontWeight: '600', marginTop: 20, marginBottom: 8 }]}>
            Size Variants
          </Text>
          
          <Text style={[styles.componentDescription, { marginBottom: 8 }]}>Small Size</Text>
          <TabBar
            tabs={['Week', 'Month', 'Year']}
            activeTab="Month"
            onTabChange={() => {}}
            variant="underline"
            size="sm"
          />
          
          <Text style={[styles.componentDescription, { marginTop: 16, marginBottom: 8 }]}>Large Size</Text>
          <TabBar
            tabs={[
              { value: 'dashboard', label: 'Dashboard', icon: 'speedometer' },
              { value: 'analytics', label: 'Analytics', icon: 'bar-chart' }
            ]}
            activeTab="dashboard"
            onTabChange={() => {}}
            variant="pills"
            size="lg"
            showIcons={true}
          />

          {/* Mode Examples */}
          <Text style={[styles.componentDescription, { fontWeight: '600', marginTop: 20, marginBottom: 8 }]}>
            Mode Examples
          </Text>
          
          <Text style={[styles.componentDescription, { marginBottom: 8 }]}>Fixed Mode (Equal Width)</Text>
          <TabBar
            tabs={['Home', 'Search', 'Profile']}
            activeTab="Search"
            onTabChange={() => {}}
            mode="fixed"
            variant="minimal"
            equalWidth={true}
          />
          
          <Text style={[styles.componentDescription, { marginTop: 16, marginBottom: 8 }]}>Scrollable Mode (Many Tabs)</Text>
          <TabBar
            tabs={[
              { value: 'all', label: 'All Programs', badge: 156 },
              { value: 'swimming', label: 'Swimming', badge: 45 },
              { value: 'football', label: 'Football', badge: 32 },
              { value: 'basketball', label: 'Basketball', badge: 28 },
              { value: 'music', label: 'Music', badge: 21 },
              { value: 'coding', label: 'Coding', badge: 18 },
              { value: 'art', label: 'Art', badge: 12 }
            ]}
            activeTab="swimming"
            onTabChange={() => {}}
            mode="scrollable"
            variant="pills"
            showBadges={true}
          />

          {/* Icon Position Examples */}
          <Text style={[styles.componentDescription, { fontWeight: '600', marginTop: 20, marginBottom: 8 }]}>
            Icon Positioning
          </Text>
          
          <Text style={[styles.componentDescription, { marginBottom: 8 }]}>Icons on Top</Text>
          <TabBar
            tabs={[
              { value: 'stats', label: 'Stats', icon: 'stats-chart' },
              { value: 'goals', label: 'Goals', icon: 'flag' },
              { value: 'progress', label: 'Progress', icon: 'trending-up' }
            ]}
            activeTab="goals"
            onTabChange={() => {}}
            variant="default"
            iconPosition="top"
            showIcons={true}
          />
          
          <Text style={[styles.componentDescription, { marginTop: 16, marginBottom: 8 }]}>Icons on Right</Text>
          <TabBar
            tabs={[
              { value: 'inbox', label: 'Inbox', icon: 'mail', badge: 5 },
              { value: 'sent', label: 'Sent', icon: 'paper-plane' }
            ]}
            activeTab="inbox"
            onTabChange={() => {}}
            variant="underline"
            iconPosition="right"
            showIcons={true}
            showBadges={true}
          />
        </View>

        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>OptionMenu</Text>
          <OptionMenu
            options={sampleMenuOptions}
          />
          <Text style={styles.componentDescription}>
            Dropdown option menu with icons and custom styling
          </Text>
        </View>
      </View>

      {/* Phase 2: Enhanced UI Components */}
      <View style={styles.componentSection}>
        <Text style={[styles.subsectionTitle, { color: theme.colors.interactive.primary, fontSize: 18 }]}>
          🔧 Phase 2: Enhanced UI Components
        </Text>
        
        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>Alert (Toast Notifications)</Text>
          <ToastAlert
            type="success"
            message="Profile updated successfully!"
            visible={true}
            onDismiss={() => {}}
            position="top"
            dismissible={true}
          />
          <Text style={styles.componentDescription}>
            Modern toast notification system with animations and Academy theming
          </Text>
        </View>

        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>MenuList (Navigation Grid)</Text>
          <MenuList
            items={[
              {
                id: '1',
                title: 'Our Courses',
                icon: 'school',
                onPress: () => console.log('Courses'),
              },
              {
                id: '2',
                title: 'Achievements',
                icon: 'trophy',
                onPress: () => console.log('Achievements'),
                badge: '5',
              },
            ]}
            columns={2}
            variant="card"
          />
          <Text style={styles.componentDescription}>
            Configurable grid layout for navigation items with badges and icons
          </Text>
        </View>

        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>MetricPool (Statistical Cards)</Text>
          <View style={{ flexDirection: 'row', gap: 16, justifyContent: 'center' }}>
            <MetricPool
              poolName="Sessions"
              poolNumber="24"
              poolRate="+12%"
              icon="time"
              variant="default"
            />
            <MetricPool
              poolName="Progress"
              poolNumber="87"
              poolRate="+5%"
              suffix="%"
              icon="trending-up"
              variant="detailed"
            />
          </View>
          <Text style={styles.componentDescription}>
            Statistical display cards with trend indicators and formatting
          </Text>
        </View>

        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>Stations (Rating & Progress Cards)</Text>
          <Stations
            title="Swimming Progress"
            rating="4.8"
            starRating={4}
            heading="Freestyle Mastery"
            subtitle="Advanced Level"
            icons={[
              { name: 'checkmark-circle', color: theme.colors.status.success },
              { name: 'trending-up', color: theme.colors.status.warning },
              { name: 'star', color: theme.colors.status.warning },
            ]}
            variant="default"
          />
          <Text style={styles.componentDescription}>
            Rating and progress cards with customizable icons and star ratings
          </Text>
        </View>
      </View>

      {/* Phase 4: Enhanced UI Components */}
      <View style={styles.componentSection}>
        <Text style={[styles.subsectionTitle, { color: theme.colors.interactive.primary, fontSize: 18 }]}>
          🚀 Phase 4: Enhanced UI Components
        </Text>
        
        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>FilterBar (Advanced Filtering)</Text>
          <FilterBar
            filters={sampleFilterGroups}
            selectedFilters={filterBarSelectedFilters}
            onFilterChange={handleFilterBarChange}
            variant="horizontal"
            showClearAll={true}
            title="Filter Students"
          />
          <Text style={styles.componentDescription}>
            Advanced FilterBar with multi-group filtering, modal support, horizontal/vertical layouts, and clear all functionality
          </Text>
        </View>

        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>StudentCard (Modern Student Display with Session Types)</Text>
          <View style={{ gap: 12 }}>
            {sampleStudents.map((student, index) => (
              <StudentCard
                key={student.id}
                student={{
                  id: student.id,
                  name: student.name,
                  level: student.level,
                  className: student.className,
                  progress: student.progress,
                  attendance: {
                    attended: student.attended,
                    absence: student.absence,
                    sessions: student.sessions,
                  },
                  paymentStatus: index === 0 ? 'fully-paid' : index === 1 ? 'partial-paid' : 'overdue',
                  sessionType: index === 0 ? 'school-group' : index === 1 ? 'private-session' : 'mixed',
                  tags: student.tags?.map(tag => tag.label) || [],
                }}
                onPress={(student) => console.log('Student pressed:', student.name)}
                variant={index === 0 ? 'detailed' : index === 1 ? 'default' : 'compact'}
                showProgress={true}
                showAttendance={true}
                showPaymentStatus={true}
                showSessionType={true}
                showTags={true}
              />
            ))}
          </View>
          <Text style={styles.componentDescription}>
            Enhanced StudentCard with Session Type indicators (School Group/Private Session/Mixed) and Payment Status. Includes all features from NurserySchool/PreSchool components with Academy design system.
          </Text>
        </View>

        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>Lessons (Lesson Management)</Text>
          <Lessons
            lessons={sampleLessons}
            onLessonPress={(lesson) => console.log('Lesson pressed:', lesson.title)}
            onActivityPress={(lessonId, stationId, activityId) => 
              console.log('Activity pressed:', { lessonId, stationId, activityId })
            }
            showStations={true}
            defaultExpanded={false}
            variant="default"
          />
          <Text style={styles.componentDescription}>
            Comprehensive lesson management with station-based organization, activity tracking, expandable cards, and progress monitoring
          </Text>
        </View>

        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>LoadingSpinner (Modern Loading States)</Text>
          <View style={{ gap: 16 }}>
            <View>
              <Text style={[styles.componentDescription, { marginBottom: 8 }]}>4 Spinner Variants:</Text>
              <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
                <LoadingSpinner variant="spinner" size="medium" color={theme.colors.interactive.primary} />
                <LoadingSpinner variant="dots" size="medium" color={theme.colors.interactive.primary} />
                <LoadingSpinner variant="pulse" size="medium" color={theme.colors.interactive.primary} />
                <LoadingSpinner variant="bars" size="medium" color={theme.colors.interactive.primary} />
              </View>
            </View>
            
            <View>
              <Text style={[styles.componentDescription, { marginBottom: 8 }]}>Different Sizes:</Text>
              <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <LoadingSpinner variant="spinner" size="small" color={theme.colors.interactive.primary} />
                <LoadingSpinner variant="spinner" size="medium" color={theme.colors.interactive.primary} />
                <LoadingSpinner variant="spinner" size="large" color={theme.colors.interactive.primary} />
              </View>
            </View>
            
            <View>
              <Text style={[styles.componentDescription, { marginBottom: 8 }]}>With Text Messages:</Text>
              <View style={{ gap: 12 }}>
                <LoadingSpinner 
                  variant="dots" 
                  size="medium" 
                  color={theme.colors.interactive.primary}
                  message="Loading students..." 
                />
                <LoadingSpinner 
                  variant="pulse" 
                  size="medium" 
                  color={theme.colors.status.success}
                  message="Processing data..." 
                />
                <LoadingSpinner 
                  variant="bars" 
                  size="large" 
                  color={theme.colors.status.warning}
                  message="Saving changes..." 
                />
              </View>
            </View>
          </View>
          <Text style={styles.componentDescription}>
            Modern loading spinner component with 4 variants, multiple sizes, overlay support, and Academy theming
          </Text>
        </View>

        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>NotificationList (Notification Management)</Text>
          <View style={{ gap: 16 }}>
            <View>
              <Text style={[styles.componentDescription, { marginBottom: 8 }]}>Interactive Notification List:</Text>
              <View style={{ height: 300, borderWidth: 1, borderColor: theme.colors.border.primary, borderRadius: 8 }}>
                <NotificationList
                  notifications={sampleNotifications}
                  onMarkAsRead={(id) => console.log('Mark as read:', id)}
                  onMarkAsUnread={(id) => console.log('Mark as unread:', id)}
                  title="Academy Notifications"
                  showBackButton={false}
                />
              </View>
            </View>
          </View>
          <Text style={styles.componentDescription}>
            Complete notification management system with read/unread states, timestamps, type-based icons, and Academy theming
          </Text>
        </View>

        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>BottomSheet System (Modal Overlays)</Text>
          <Text style={styles.componentDescription}>
            Complete bottom sheet system with provider pattern, hooks, and customizable snap points for mobile-first interactions
          </Text>

          {/* Bottom Sheet Demo Buttons */}
          <View style={{ gap: 12, marginVertical: 16 }}>
            <CustomButton
              title="Open Standard Bottom Sheet"
              onPress={() => setStandardBottomSheetVisible(true)}
              variant="primary"
              size="md"
            />
            
            <CustomButton
              title="Show Student Details Sheet"
              onPress={() => setStudentDetailsSheetVisible(true)}
              variant="outline"
              size="md"
            />
            
            <CustomButton
              title="Quick Actions Sheet"
              onPress={() => setQuickActionsSheetVisible(true)}
              variant="gray"
              size="md"
            />
          </View>

          {/* Standard Bottom Sheet */}
          <BottomSheet
            visible={standardBottomSheetVisible}
            onClose={() => setStandardBottomSheetVisible(false)}
            snapPoints={['small', 'medium', 'large']}
            title="Standard Bottom Sheet"
            enablePanDownToClose
            closeOnBackdrop
          >
            <ScrollView style={{ padding: 20 }}>
              <Text style={[styles.componentDescription, { marginBottom: 16 }]}>
                This is a standard bottom sheet with multiple snap points. You can:
              </Text>
              <Text style={[styles.componentDescription, { marginBottom: 8 }]}>
                • Drag to resize between small, medium, and large heights
              </Text>
              <Text style={[styles.componentDescription, { marginBottom: 8 }]}>
                • Pan down to close
              </Text>
              <Text style={[styles.componentDescription, { marginBottom: 8 }]}>
                • Tap backdrop to dismiss
              </Text>
              <Text style={[styles.componentDescription, { marginBottom: 16 }]}>
                • Customizable content and styling
              </Text>
              
              <View style={{ gap: 12 }}>
                <CustomButton
                  title="Sample Action 1"
                  onPress={() => console.log('Action 1')}
                  variant="outline"
                  size="sm"
                />
                <CustomButton
                  title="Sample Action 2"
                  onPress={() => console.log('Action 2')}
                  variant="gray"
                  size="sm"
                />
              </View>
            </ScrollView>
          </BottomSheet>

          {/* Student Details Bottom Sheet */}
          <BottomSheet
            visible={studentDetailsSheetVisible}
            onClose={() => setStudentDetailsSheetVisible(false)}
            snapPoints={['medium', 'large']}
            title="Student Profile - Emma Johnson (Level 3)"
            enablePanDownToClose
            closeOnBackdrop
          >
            <ScrollView style={{ padding: 20 }}>
              <View style={{ gap: 16 }}>
                {/* Student Info Card */}
                <View style={{
                  backgroundColor: theme.colors.background.secondary,
                  padding: 16,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: theme.colors.border.primary
                }}>
                  <Text style={[styles.componentTitle, { fontSize: 16, marginBottom: 8 }]}>
                    Student Information
                  </Text>
                  <Text style={[styles.componentDescription, { marginBottom: 4 }]}>
                    <Text style={{ fontWeight: '600' }}>Level:</Text> Advanced Swimming
                  </Text>
                  <Text style={[styles.componentDescription, { marginBottom: 4 }]}>
                    <Text style={{ fontWeight: '600' }}>Progress:</Text> 85%
                  </Text>
                  <Text style={[styles.componentDescription, { marginBottom: 4 }]}>
                    <Text style={{ fontWeight: '600' }}>Attendance:</Text> 18/20 sessions
                  </Text>
                  <Text style={[styles.componentDescription, { marginBottom: 4 }]}>
                    <Text style={{ fontWeight: '600' }}>Payment:</Text> Fully Paid
                  </Text>
                </View>

                {/* Quick Actions */}
                <View style={{ gap: 12 }}>
                  <Text style={[styles.componentTitle, { fontSize: 16 }]}>
                    Quick Actions
                  </Text>
                  <CustomButton
                    title="Mark Attendance"
                    onPress={() => console.log('Mark attendance')}
                    variant="primary"
                    size="md"
                  />
                  <CustomButton
                    title="View Performance"
                    onPress={() => console.log('View performance')}
                    variant="outline"
                    size="md"
                  />
                  <CustomButton
                    title="Send Message"
                    onPress={() => console.log('Send message')}
                    variant="gray"
                    size="md"
                  />
                </View>
              </View>
            </ScrollView>
          </BottomSheet>

          {/* Quick Actions Bottom Sheet */}
          <BottomSheet
            visible={quickActionsSheetVisible}
            onClose={() => setQuickActionsSheetVisible(false)}
            snapPoints={['small']}
            title="Quick Actions"
            enablePanDownToClose
            closeOnBackdrop
          >
            <View style={{ padding: 20, gap: 12 }}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 16,
                  backgroundColor: theme.colors.background.secondary,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: theme.colors.border.primary
                }}
                onPress={() => {
                  console.log('Add New Student');
                  setQuickActionsSheetVisible(false);
                }}
              >
                <Text style={[styles.componentDescription, { fontSize: 16, fontWeight: '500' }]}>
                  ➕ Add New Student
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 16,
                  backgroundColor: theme.colors.background.secondary,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: theme.colors.border.primary
                }}
                onPress={() => {
                  console.log('Create Class');
                  setQuickActionsSheetVisible(false);
                }}
              >
                <Text style={[styles.componentDescription, { fontSize: 16, fontWeight: '500' }]}>
                  📚 Create New Class
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 16,
                  backgroundColor: theme.colors.background.secondary,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: theme.colors.border.primary
                }}
                onPress={() => {
                  console.log('Generate Report');
                  setQuickActionsSheetVisible(false);
                }}
              >
                <Text style={[styles.componentDescription, { fontSize: 16, fontWeight: '500' }]}>
                  📊 Generate Report
                </Text>
              </TouchableOpacity>
            </View>
          </BottomSheet>

          <Text style={[styles.componentDescription, { fontWeight: '600', marginTop: 16, marginBottom: 8 }]}>
            BottomSheet System Features:
          </Text>
          <Text style={styles.componentDescription}>
            🎯 **Complete Bottom Sheet System**: Provider pattern with context hooks for state management{'\n'}
            📏 **Flexible Snap Points**: Predefined sizes (small, medium, large, full) and custom numbers{'\n'}
            🎨 **Academy Theming**: Consistent with Academy design system and colors{'\n'}
            👆 **Gesture Support**: Pan to resize, drag to close, backdrop tap to dismiss{'\n'}
            🔧 **Hook System**: useBottomSheet, useBottomSheetActions, useBottomSheetState, useQuickBottomSheet{'\n'}
            📱 **Mobile Optimized**: Touch-friendly interactions and responsive layouts{'\n'}
            🎛️ **Customizable**: Titles, subtitles, content areas, and styling options
          </Text>
        </View>
      </View>

      {/* Phase 5: Conditional Rendering Components */}
      <View style={styles.componentSection}>
        <Text style={[styles.subsectionTitle, { color: theme.colors.interactive.primary, fontSize: 18 }]}>
          🔧 Phase 5: Conditional Rendering Components
        </Text>
        <Text style={styles.sectionDescription}>
          Declarative conditional rendering components for cleaner, more maintainable UI logic
        </Text>

        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>Show with ShowWhen/ShowElse Pattern</Text>
          <Text style={styles.componentDescription}>
            Basic conditional rendering with if/else pattern using Show component
          </Text>

          {/* Toggle Controls */}
          <View style={{ gap: 8, marginVertical: 16 }}>
            <CustomButton
              title={`Toggle Content (Currently: ${showContent ? 'Visible' : 'Hidden'})`}
              onPress={() => setShowContent(!showContent)}
              variant="outline"
              size="md"
            />
          </View>

          {/* Show/ShowWhen/ShowElse Example */}
          <View style={{
            backgroundColor: theme.colors.background.secondary,
            padding: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.colors.border.primary,
            marginVertical: 8
          }}>
            <Show>
              <ShowWhen isTrue={showContent}>
                <View style={{
                  backgroundColor: theme.colors.status.success + '20',
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 8
                }}>
                  <Text style={[styles.componentDescription, { color: theme.colors.status.success }]}>
                    ✅ Content is currently visible
                  </Text>
                  <Text style={styles.componentDescription}>
                    This content appears when showContent is true
                  </Text>
                </View>
              </ShowWhen>
              <ShowElse>
                <View style={{
                  backgroundColor: theme.colors.status.error + '20',
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 8
                }}>
                  <Text style={[styles.componentDescription, { color: theme.colors.status.error }]}>
                    ❌ Content is currently hidden
                  </Text>
                  <Text style={styles.componentDescription}>
                    This fallback content appears when showContent is false
                  </Text>
                </View>
              </ShowElse>
            </Show>
          </View>

          <Text style={styles.componentDescription}>
            💡 **Usage**: Declarative if/else pattern for cleaner conditional rendering logic
          </Text>
        </View>

        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>ShowUnless for Negative Conditions</Text>
          <Text style={styles.componentDescription}>
            Render content when a condition is NOT met - useful for error states and restrictions
          </Text>

          {/* Permission Toggle */}
          <View style={{ gap: 8, marginVertical: 16 }}>
            <CustomButton
              title={`Toggle Permissions (Currently: ${hasPermissions ? 'Granted' : 'Denied'})`}
              onPress={() => setHasPermissions(!hasPermissions)}
              variant="outline"
              size="md"
            />
          </View>

          {/* ShowUnless Example */}
          <View style={{
            backgroundColor: theme.colors.background.secondary,
            padding: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.colors.border.primary,
            marginVertical: 8
          }}>
            <ShowUnless isTrue={hasPermissions}>
              <View style={{
                backgroundColor: theme.colors.status.warning + '20',
                padding: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: theme.colors.status.warning
              }}>
                <Text style={[styles.componentDescription, { color: theme.colors.status.warning, fontWeight: '600' }]}>
                  ⚠️ Access Restricted
                </Text>
                <Text style={styles.componentDescription}>
                  You don't have permission to view this content. Please contact an administrator.
                </Text>
              </View>
            </ShowUnless>

            <Show>
              <ShowWhen isTrue={hasPermissions}>
              <View style={{
                backgroundColor: theme.colors.status.success + '20',
                padding: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: theme.colors.status.success
              }}>
                <Text style={[styles.componentDescription, { color: theme.colors.status.success, fontWeight: '600' }]}>
                  ✅ Access Granted
                </Text>
                <Text style={styles.componentDescription}>
                  You have full access to the administrative features.
                </Text>
              </View>
              </ShowWhen>
            </Show>
          </View>

          <Text style={styles.componentDescription}>
            💡 **Usage**: ShowUnless is perfect for error states, permission checks, and guard clauses
          </Text>
        </View>

        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>ShowSwitch with ShowCase/ShowDefault</Text>
          <Text style={styles.componentDescription}>
            Multi-condition rendering similar to switch statements for complex conditional logic
          </Text>

          {/* Role and View Controls */}
          <View style={{ gap: 8, marginVertical: 16 }}>
            <Text style={[styles.componentDescription, { fontWeight: '600', marginBottom: 8 }]}>
              User Role Selection:
            </Text>
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              {(['admin', 'instructor', 'student'] as const).map((role) => (
                <CustomButton
                  key={role}
                  title={role.charAt(0).toUpperCase() + role.slice(1)}
                  onPress={() => setUserRole(role)}
                  variant={userRole === role ? 'primary' : 'outline'}
                  size="sm"
                />
              ))}
            </View>

            <Text style={[styles.componentDescription, { fontWeight: '600', marginTop: 16, marginBottom: 8 }]}>
              View Mode Selection:
            </Text>
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              {(['list', 'grid', 'calendar'] as const).map((view) => (
                <CustomButton
                  key={view}
                  title={view.charAt(0).toUpperCase() + view.slice(1)}
                  onPress={() => setCurrentView(view)}
                  variant={currentView === view ? 'primary' : 'outline'}
                  size="sm"
                />
              ))}
            </View>
          </View>

          {/* ShowSwitch Examples */}
          <View style={{
            backgroundColor: theme.colors.background.secondary,
            padding: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.colors.border.primary,
            marginVertical: 8
          }}>
            <Text style={[styles.componentDescription, { fontWeight: '600', marginBottom: 12 }]}>
              Role-Based Content:
            </Text>
            
            <ShowSwitch value={userRole}>
              <ShowCase value="admin">
                <View style={{
                  backgroundColor: theme.colors.interactive.purple + '20',
                  padding: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: theme.colors.interactive.purple
                }}>
                  <Text style={[styles.componentDescription, { color: theme.colors.interactive.purple, fontWeight: '600' }]}>
                    👑 Administrator Dashboard
                  </Text>
                  <Text style={styles.componentDescription}>
                    • Manage all users and permissions{'\n'}
                    • View system analytics{'\n'}
                    • Configure academy settings
                  </Text>
                </View>
              </ShowCase>

              <ShowCase value="instructor">
                <View style={{
                  backgroundColor: theme.colors.interactive.primary + '20',
                  padding: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: theme.colors.interactive.primary
                }}>
                  <Text style={[styles.componentDescription, { color: theme.colors.interactive.primary, fontWeight: '600' }]}>
                    🎓 Instructor Panel
                  </Text>
                  <Text style={styles.componentDescription}>
                    • Manage assigned classes{'\n'}
                    • Track student progress{'\n'}
                    • Create lesson plans
                  </Text>
                </View>
              </ShowCase>

              <ShowCase value="student">
                <View style={{
                  backgroundColor: theme.colors.status.success + '20',
                  padding: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: theme.colors.status.success
                }}>
                  <Text style={[styles.componentDescription, { color: theme.colors.status.success, fontWeight: '600' }]}>
                    📚 Student Portal
                  </Text>
                  <Text style={styles.componentDescription}>
                    • View course progress{'\n'}
                    • Access learning materials{'\n'}
                    • Check upcoming classes
                  </Text>
                </View>
              </ShowCase>

              <ShowDefault>
                <View style={{
                  backgroundColor: theme.colors.status.warning + '20',
                  padding: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: theme.colors.status.warning
                }}>
                  <Text style={[styles.componentDescription, { color: theme.colors.status.warning, fontWeight: '600' }]}>
                    ⚠️ Unknown Role
                  </Text>
                  <Text style={styles.componentDescription}>
                    Please contact support for role assignment
                  </Text>
                </View>
              </ShowDefault>
            </ShowSwitch>

            <Text style={[styles.componentDescription, { fontWeight: '600', marginTop: 20, marginBottom: 12 }]}>
              View Mode Rendering:
            </Text>

            <ShowSwitch value={currentView}>
              <ShowCase value="list">
                <View style={{
                  backgroundColor: theme.colors.background.primary,
                  padding: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: theme.colors.border.primary
                }}>
                  <Text style={[styles.componentDescription, { fontWeight: '600' }]}>
                    📋 List View
                  </Text>
                  <Text style={styles.componentDescription}>
                    Showing students in a vertical list format
                  </Text>
                </View>
              </ShowCase>

              <ShowCase value="grid">
                <View style={{
                  backgroundColor: theme.colors.background.primary,
                  padding: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: theme.colors.border.primary
                }}>
                  <Text style={[styles.componentDescription, { fontWeight: '600' }]}>
                    🔲 Grid View
                  </Text>
                  <Text style={styles.componentDescription}>
                    Showing students in a grid layout with cards
                  </Text>
                </View>
              </ShowCase>

              <ShowCase value="calendar">
                <View style={{
                  backgroundColor: theme.colors.background.primary,
                  padding: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: theme.colors.border.primary
                }}>
                  <Text style={[styles.componentDescription, { fontWeight: '600' }]}>
                    📅 Calendar View
                  </Text>
                  <Text style={styles.componentDescription}>
                    Showing students organized by class schedule
                  </Text>
                </View>
              </ShowCase>
            </ShowSwitch>
          </View>

          <Text style={styles.componentDescription}>
            💡 **Usage**: ShowSwitch replaces complex nested ternary operators and provides cleaner multi-condition logic
          </Text>
        </View>

        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>Hook-based Conditional Rendering</Text>
          <Text style={styles.componentDescription}>
            Use React hooks for dynamic conditional rendering with computed conditions
          </Text>

          {/* Student Count Control */}
          <View style={{ gap: 8, marginVertical: 16 }}>
            <Text style={[styles.componentDescription, { fontWeight: '600', marginBottom: 8 }]}>
              Student Count: {studentCount}
            </Text>
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              <CustomButton
                title="Set to 0"
                onPress={() => setStudentCount(0)}
                variant="outline"
                size="sm"
              />
              <CustomButton
                title="Set to 5"
                onPress={() => setStudentCount(5)}
                variant="outline"
                size="sm"
              />
              <CustomButton
                title="Set to 25"
                onPress={() => setStudentCount(25)}
                variant="outline"
                size="sm"
              />
              <CustomButton
                title="Set to 100"
                onPress={() => setStudentCount(100)}
                variant="outline"
                size="sm"
              />
            </View>
          </View>

          {/* useConditionalRender Hook Example */}
          <View style={{
            backgroundColor: theme.colors.background.secondary,
            padding: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.colors.border.primary,
            marginVertical: 8
          }}>
            <Text style={[styles.componentDescription, { fontWeight: '600', marginBottom: 12 }]}>
              useConditionalRender Hook:
            </Text>

            {useConditionalRender(studentCount === 0).when(
              <View style={{
                backgroundColor: theme.colors.status.error + '20',
                padding: 12,
                borderRadius: 8,
                marginBottom: 8
              }}>
                <Text style={[styles.componentDescription, { color: theme.colors.status.error, fontWeight: '600' }]}>
                  📭 No Students Found
                </Text>
                <Text style={styles.componentDescription}>
                  Start by adding your first student to the academy.
                </Text>
              </View>
            )}

            {useConditionalRender(studentCount > 0 && studentCount <= 10).when(
              <View style={{
                backgroundColor: theme.colors.status.warning + '20',
                padding: 12,
                borderRadius: 8,
                marginBottom: 8
              }}>
                <Text style={[styles.componentDescription, { color: theme.colors.status.warning, fontWeight: '600' }]}>
                  📈 Small Class Size
                </Text>
                <Text style={styles.componentDescription}>
                  You have {studentCount} students. Consider expanding enrollment.
                </Text>
              </View>
            )}

            {useConditionalRender(studentCount > 10 && studentCount <= 50).when(
              <View style={{
                backgroundColor: theme.colors.status.success + '20',
                padding: 12,
                borderRadius: 8,
                marginBottom: 8
              }}>
                <Text style={[styles.componentDescription, { color: theme.colors.status.success, fontWeight: '600' }]}>
                  ✅ Optimal Class Size
                </Text>
                <Text style={styles.componentDescription}>
                  Great! You have {studentCount} students - perfect for quality instruction.
                </Text>
              </View>
            )}

            {useConditionalRender(studentCount > 50).when(
              <View style={{
                backgroundColor: theme.colors.interactive.primary + '20',
                padding: 12,
                borderRadius: 8,
                marginBottom: 8
              }}>
                <Text style={[styles.componentDescription, { color: theme.colors.interactive.primary, fontWeight: '600' }]}>
                  🎉 Large Academy
                </Text>
                <Text style={styles.componentDescription}>
                  Impressive! You have {studentCount} students. Consider adding more instructors.
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.componentDescription}>
            💡 **Usage**: useConditionalRender is perfect for complex computed conditions and reusable conditional logic
          </Text>
        </View>

        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>Utility Functions for Inline Conditions</Text>
          <Text style={styles.componentDescription}>
            Helper functions for quick inline conditional rendering without component wrappers
          </Text>

          {/* Login Toggle */}
          <View style={{ gap: 8, marginVertical: 16 }}>
            <CustomButton
              title={`Toggle Login Status (Currently: ${isLoggedIn ? 'Logged In' : 'Logged Out'})`}
              onPress={() => setIsLoggedIn(!isLoggedIn)}
              variant="outline"
              size="md"
            />
          </View>

          {/* Utility Functions Examples */}
          <View style={{
            backgroundColor: theme.colors.background.secondary,
            padding: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.colors.border.primary,
            marginVertical: 8
          }}>
            <Text style={[styles.componentDescription, { fontWeight: '600', marginBottom: 12 }]}>
              Utility Function Examples:
            </Text>

            {/* when() function */}
            <View style={{ marginBottom: 16 }}>
              <Text style={[styles.componentDescription, { fontWeight: '600', marginBottom: 8 }]}>
                when() function:
              </Text>
              {when(isLoggedIn, 
                <View style={{
                  backgroundColor: theme.colors.status.success + '20',
                  padding: 10,
                  borderRadius: 6
                }}>
                  <Text style={[styles.componentDescription, { color: theme.colors.status.success }]}>
                    ✅ Welcome back! You are logged in.
                  </Text>
                </View>
              )}
            </View>

            {/* unless() function */}
            <View style={{ marginBottom: 16 }}>
              <Text style={[styles.componentDescription, { fontWeight: '600', marginBottom: 8 }]}>
                unless() function:
              </Text>
              {unless(isLoggedIn, 
                <View style={{
                  backgroundColor: theme.colors.status.error + '20',
                  padding: 10,
                  borderRadius: 6
                }}>
                  <Text style={[styles.componentDescription, { color: theme.colors.status.error }]}>
                    🔒 Please log in to access your account.
                  </Text>
                </View>
              )}
            </View>

            {/* either() function */}
            <View style={{ marginBottom: 16 }}>
              <Text style={[styles.componentDescription, { fontWeight: '600', marginBottom: 8 }]}>
                either() function:
              </Text>
              {either(
                isLoggedIn,
                <View style={{
                  backgroundColor: theme.colors.interactive.primary + '20',
                  padding: 10,
                  borderRadius: 6
                }}>
                  <Text style={[styles.componentDescription, { color: theme.colors.interactive.primary }]}>
                    📊 Dashboard available
                  </Text>
                </View>,
                <View style={{
                  backgroundColor: theme.colors.status.warning + '20',
                  padding: 10,
                  borderRadius: 6
                }}>
                  <Text style={[styles.componentDescription, { color: theme.colors.status.warning }]}>
                    🔐 Login required
                  </Text>
                </View>
              )}
            </View>

            {/* switchRender() function */}
            <View style={{ marginBottom: 16 }}>
              <Text style={[styles.componentDescription, { fontWeight: '600', marginBottom: 8 }]}>
                switchRender() function:
              </Text>
              {switchRender(userRole, {
                admin: (
                  <View style={{
                    backgroundColor: theme.colors.interactive.purple + '20',
                    padding: 10,
                    borderRadius: 6
                  }}>
                    <Text style={[styles.componentDescription, { color: theme.colors.interactive.purple }]}>
                      👑 Admin privileges active
                    </Text>
                  </View>
                ),
                instructor: (
                  <View style={{
                    backgroundColor: theme.colors.interactive.primary + '20',
                    padding: 10,
                    borderRadius: 6
                  }}>
                    <Text style={[styles.componentDescription, { color: theme.colors.interactive.primary }]}>
                      🎓 Instructor mode enabled
                    </Text>
                  </View>
                ),
                student: (
                  <View style={{
                    backgroundColor: theme.colors.status.success + '20',
                    padding: 10,
                    borderRadius: 6
                  }}>
                    <Text style={[styles.componentDescription, { color: theme.colors.status.success }]}>
                      📚 Student portal active
                    </Text>
                  </View>
                ),
                default: (
                  <View style={{
                    backgroundColor: theme.colors.status.warning + '20',
                    padding: 10,
                    borderRadius: 6
                  }}>
                    <Text style={[styles.componentDescription, { color: theme.colors.status.warning }]}>
                      ❓ Unknown role
                    </Text>
                  </View>
                )
              })}
            </View>
          </View>

          <Text style={styles.componentDescription}>
            💡 **Usage**: Utility functions provide concise inline conditional rendering for simple cases
          </Text>
        </View>

        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>Higher-Order Component Pattern</Text>
          <Text style={styles.componentDescription}>
            withConditionalRender HOC for reusable conditional rendering logic
          </Text>

          {/* HOC Example */}
          <View style={{
            backgroundColor: theme.colors.background.secondary,
            padding: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.colors.border.primary,
            marginVertical: 8
          }}>
            <Text style={[styles.componentDescription, { fontWeight: '600', marginBottom: 12 }]}>
              Higher-Order Component Example:
            </Text>

            {/* Create a conditionally rendered component */}
            {(() => {
              const ConditionalContent = withConditionalRender(
                ({ children }: { children: React.ReactNode }) => (
                  <View style={{
                    backgroundColor: theme.colors.status.info + '20',
                    padding: 12,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: theme.colors.status.info
                  }}>
                    {children}
                  </View>
                ),
                () => isLoggedIn && userRole === 'admin'
              );

              return (
                <ConditionalContent>
                  <Text style={[styles.componentDescription, { color: theme.colors.status.info, fontWeight: '600' }]}>
                    🔧 Admin Configuration Panel
                  </Text>
                  <Text style={styles.componentDescription}>
                    This component only renders when the user is logged in AND has admin role.
                    The condition is encapsulated in the HOC.
                  </Text>
                </ConditionalContent>
              );
            })()}

            {/* Show alternative when conditions not met */}
            {(!isLoggedIn || userRole !== 'admin') && (
              <View style={{
                backgroundColor: theme.colors.status.warning + '20',
                padding: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: theme.colors.status.warning
              }}>
                <Text style={[styles.componentDescription, { color: theme.colors.status.warning, fontWeight: '600' }]}>
                  🚫 Admin Panel Hidden
                </Text>
                <Text style={styles.componentDescription}>
                  The admin configuration panel is hidden because you are {!isLoggedIn ? 'not logged in' : 'not an admin'}.
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.componentDescription}>
            💡 **Usage**: HOCs are perfect for reusable conditional rendering patterns and component-level access control
          </Text>
        </View>

        <View style={styles.componentGroup}>
          <Text style={styles.componentTitle}>Summary: Conditional Rendering Components</Text>
          <View style={{
            backgroundColor: theme.colors.background.secondary,
            padding: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.colors.border.primary,
            marginVertical: 8
          }}>
            <Text style={[styles.componentDescription, { fontWeight: '600', marginBottom: 12 }]}>
              🎯 Complete Conditional Rendering System:
            </Text>
            <Text style={styles.componentDescription}>
              **Declarative Components:**{'\n'}
              • Show, ShowWhen, ShowElse - Basic if/else patterns{'\n'}
              • ShowUnless - Negative condition rendering{'\n'}
              • ShowSwitch, ShowCase, ShowDefault - Multi-condition logic{'\n'}
              {'\n'}
              **Utility Functions:**{'\n'}
              • when(), unless(), either() - Inline conditional helpers{'\n'}
              • switchRender() - Switch-like rendering function{'\n'}
              {'\n'}
              **Advanced Patterns:**{'\n'}
              • useConditionalRender() - Hook for computed conditions{'\n'}
              • withConditionalRender() - HOC for reusable conditional logic{'\n'}
              {'\n'}
              **Benefits:**{'\n'}
              ✅ Cleaner, more readable conditional rendering{'\n'}
              ✅ Reduced nested ternary operators{'\n'}
              ✅ Reusable conditional logic patterns{'\n'}
              ✅ Type-safe with TypeScript{'\n'}
              ✅ Academy-themed styling support
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default UIComponentsSection;