# Search System Components

The Academy Apps feature a comprehensive search system with debouncing, filtering, and Academy theming. All search components are optimized for accessibility and performance.

## 🔍 Available Components

### Core Components

- **[SearchInput](#searchinput)** - Enhanced search input with size variants and loading states
- **[Chip](../ui/Chip.md)** - Unified chip component (replaces FilterChip) with 5 variants  
- **[QuickFilterBar](#quickfilterbar)** - Horizontal scrollable filter bar
- **[SearchBar](#searchbar)** - Complete search interface with actions
- **[SearchContainer](#searchcontainer)** - Unified search wrapper component

### Utility Hooks

- **[useQuickFilters](#usequickfilters)** - Hook for managing filter state

## SearchInput

Enhanced search input component with Academy theming, debouncing, and size variants.

### Features

- **Size Variants**: `sm`, `md`, `lg` for different contexts
- **Loading States**: Built-in loading indicator
- **Debouncing**: Configurable debounce delay (default 300ms)
- **Clear Button**: Optional clear functionality
- **Academy Theming**: Full theme system integration
- **Accessibility**: Screen reader support and keyboard navigation

### Basic Usage

```typescript
import { SearchInput } from '@academy/mobile-shared';

function SearchExample() {
  const [searchValue, setSearchValue] = useState('');
  
  return (
    <SearchInput
      value={searchValue}
      onChangeText={setSearchValue}
      placeholder="Search students..."
      size="md"
      showClearButton={true}
    />
  );
}
```

### Advanced Usage with Debouncing

```typescript
import { SearchInput } from '@academy/mobile-shared';

function AdvancedSearch() {
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleDebouncedSearch = async (query: string) => {
    if (query.length === 0) return;
    
    setLoading(true);
    try {
      const results = await searchAPI(query);
      setResults(results);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <SearchInput
      value={searchValue}
      onChangeText={setSearchValue}
      onDebouncedSearch={handleDebouncedSearch}
      placeholder="Search Academy..."
      size="lg"
      loading={loading}
      debounceDelay={500}
    />
  );
}
```

### Size Variants

```typescript
// Small - compact interfaces
<SearchInput size="sm" placeholder="Quick search..." />

// Medium - default size
<SearchInput size="md" placeholder="Search students..." />

// Large - prominent search interfaces
<SearchInput size="lg" placeholder="Search Academy database..." />
```

## Chip Component

**Note**: FilterChip has been consolidated into the unified [Chip component](../ui/Chip.md). The Chip component provides all FilterChip functionality plus additional features like multi-chip collections and more variants.

### Quick Migration

```typescript
// FilterChip usage remains the same!
import { Chip } from '@academy/mobile-shared';

function FilterExample() {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      <Chip
        label="Active Students"
        value="active"
        count={24}
        selected={true}
        variant="primary"
        countStyle="badge"
        onPress={(value) => console.log('Filter:', value)}
      />
      
      <Chip
        label="Beginner Level"
        value="beginner"
        count={12}
        selected={false}
        variant="filled"
        countStyle="inline"
        onPress={(value) => console.log('Filter:', value)}
      />
    </View>
  );
}
```

For complete documentation, see **[Chip Component Documentation](../ui/Chip.md)**.

## QuickFilterBar

Horizontal scrollable filter bar with multi-select support and state management.

### Features

- **Horizontal Scrolling**: Smooth scrollable interface
- **Multi-Select**: Support for multiple active filters
- **State Management**: Built-in filter state handling
- **Count Display**: Show item counts for each filter
- **Responsive**: Adapts to tablet and mobile screens

### Usage

```typescript
import { QuickFilterBar, useQuickFilters } from '@academy/mobile-shared';
// Note: QuickFilterBar now uses the unified Chip component internally

function FilterBarExample() {
  const { selectedFilters, handleFilterChange } = useQuickFilters(['active'], true);
  
  const filters = [
    { id: '1', label: 'Active', value: 'active', count: 24 },
    { id: '2', label: 'Pending', value: 'pending', count: 8 },
    { id: '3', label: 'Completed', value: 'completed', count: 156 },
    { id: '4', label: 'Cancelled', value: 'cancelled', count: 3 },
  ];
  
  return (
    <QuickFilterBar
      filters={filters}
      selectedFilters={selectedFilters}
      onFilterChange={handleFilterChange}
      multiSelect={true}
      showCount={true}
    />
  );
}
```

## SearchBar

Complete search interface that combines SearchInput with QuickFilterBar and action buttons.

### Features

- **Integrated Search**: Combines input and filters
- **Action Buttons**: Support for Done, Cancel, etc.
- **Title & Subtitle**: Optional header information
- **Results Display**: Custom results component support
- **Compact Mode**: Reduced padding for tight layouts

### Usage

```typescript
import { SearchBar } from '@academy/mobile-shared';

function CompleteSearchExample() {
  const [searchValue, setSearchValue] = useState('');
  const { selectedFilters, handleFilterChange } = useQuickFilters();
  
  return (
    <SearchBar
      searchProps={{
        value: searchValue,
        onChangeText: setSearchValue,
        placeholder: "Search Academy...",
        size: "md",
      }}
      filterProps={{
        filters: availableFilters,
        selectedFilters: selectedFilters,
        onFilterChange: handleFilterChange,
        multiSelect: true,
      }}
      title="Academy Search"
      subtitle="Find students, instructors, and sessions"
      actions={[
        {
          label: "Done",
          onPress: () => handleSearchComplete(),
          variant: 'primary',
        },
        {
          label: "Cancel", 
          onPress: () => handleCancel(),
          variant: 'text',
        },
      ]}
      showResults={searchValue.length > 0}
      resultsComponent={<SearchResults />}
    />
  );
}
```

### SimpleSearchBar

Simplified search bar for common use cases:

```typescript
import { SimpleSearchBar } from '@academy/mobile-shared';

function SimpleSearch() {
  const [searchValue, setSearchValue] = useState('');
  
  return (
    <SimpleSearchBar
      value={searchValue}
      onChangeText={setSearchValue}
      placeholder="Quick search..."
      onDonePress={() => handleSearch()}
    />
  );
}
```

## SearchContainer

Unified search wrapper that combines SearchInput, QuickFilterBar, and EmptySearchResult for a complete search experience.

### Features

- **Complete Search Experience**: Input + Filters + Results
- **Empty State Management**: Automatic empty state display
- **Loading States**: Built-in loading handling
- **State Coordination**: Manages search and filter states
- **Accessibility**: Full keyboard and screen reader support

### Usage

```typescript
import { SearchContainer, EmptySearchResult } from '@academy/mobile-shared';

function UnifiedSearchExample() {
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  
  const handleSearch = async (query: string) => {
    setLoading(true);
    const searchResults = await performSearch(query);
    setResults(searchResults);
    setLoading(false);
  };
  
  return (
    <SearchContainer
      searchProps={{
        value: searchValue,
        onChangeText: setSearchValue,
        onDebouncedSearch: handleSearch,
        placeholder: "Search students and instructors...",
        size: "md",
      }}
      filterProps={{
        filters: availableFilters,
        selectedFilters: selectedFilters,
        onFilterChange: handleFilterChange,
        multiSelect: true,
      }}
      loading={loading}
      showEmptyState={true}
      emptyStateProps={{
        title: "No students found",
        description: "Try adjusting your search criteria",
        iconName: "people-outline",
      }}
      resultsComponent={
        results.length > 0 ? (
          <StudentsList students={results} />
        ) : undefined
      }
      onSearchStateChange={(hasActiveSearch) => {
        console.log('Search active:', hasActiveSearch);
      }}
    />
  );
}
```

## useQuickFilters Hook

State management hook for filter functionality.

### Usage

```typescript
import { useQuickFilters } from '@academy/mobile-shared';

function FilterHookExample() {
  const {
    selectedFilters,
    handleFilterChange,
    clearFilters,
    selectFilter,
    isFilterSelected,
  } = useQuickFilters(['active'], true); // Initial filters, multiSelect
  
  return (
    <View>
      <Button onPress={clearFilters} title="Clear All" />
      <Button 
        onPress={() => selectFilter('pending')} 
        title="Select Pending" 
      />
      <Text>
        Is active selected: {isFilterSelected('active') ? 'Yes' : 'No'}
      </Text>
    </View>
  );
}
```

## 🎨 Academy Theming

### Theme Integration

All search components use Academy theme variables:

```typescript
// Correct Academy theme usage
theme.colors.interactive.primary     // Academy purple
theme.colors.background.primary      // Main background  
theme.colors.text.primary           // Primary text
theme.colors.border.focused          // Focus states
```

### Responsive Design

Components automatically adapt to different screen sizes:

- **Mobile**: Compact sizing and touch-optimized interactions
- **Tablet**: Larger touch targets and increased font sizes
- **Accessibility**: Minimum 44px touch targets

## 🚀 Performance Optimization

### Debouncing

SearchInput includes built-in debouncing to prevent excessive API calls:

```typescript
<SearchInput
  onDebouncedSearch={handleSearch}
  debounceDelay={300} // Customize delay
/>
```

### Memory Management

- Components properly clean up timers and listeners
- Optimized re-renders with React.memo where appropriate
- Efficient filter state management

## ♿ Accessibility Features

### Screen Reader Support

All components include proper accessibility labels:

```typescript
<SearchInput
  accessibilityLabel="Search students and instructors"
  accessibilityHint="Enter text to search through Academy database"
/>
```

### Keyboard Navigation

- Full keyboard support for all interactive elements
- Proper focus management and tab order
- Clear focus indicators with Academy theming

### Color Contrast

- WCAG 2.1 AA compliant color combinations
- High contrast focus states
- Readable text at all supported font sizes

## 📱 Real-World Examples

### Students Screen Implementation

The instructors app Students screen demonstrates the modern search implementation:

```typescript
// Modern implementation using SearchInput
<SearchInput
  value={searchQuery}
  onChangeText={setSearchQuery}
  placeholder="Search students..."
  size="md"
  testID="students-search"
/>

// Filter integration with unified Chip component
<Chip
  label={filter.label}
  value={filter.key}
  count={filter.count}
  selected={selectedFilter === filter.key}
  onPress={(value) => setSelectedFilter(value)}
  variant="primary"
  countStyle="inline"
  size="md"
/>
```

## 🔧 Migration Guide

### From Legacy SearchComp

```typescript
// Old approach ❌
import { SearchComp } from '../existing-code/components/reuseable/SearchComp';

<SearchComp 
  setQueryText={setQuery}
  toggleSearch={toggleSearch}
/>

// New approach ✅
import { SearchInput } from '@academy/mobile-shared';

<SearchInput
  value={query}
  onChangeText={setQuery}
  placeholder="Search..."
  size="md"
  showClearButton={true}
/>
```

### From Basic TextInput

```typescript
// Old approach ❌
<View style={styles.searchContainer}>
  <Ionicons name="search" size={20} />
  <TextInput
    style={styles.searchInput}
    placeholder="Search..."
    value={searchQuery}
    onChangeText={setSearchQuery}
  />
</View>

// New approach ✅
<SearchInput
  value={searchQuery}
  onChangeText={setSearchQuery}
  placeholder="Search..."
  size="md"
/>
```

## 📚 Related Documentation

- **[Academy Theme System](../../THEME_SYSTEM.md)** - Complete theming reference
- **[Component Library](../README.md)** - Full component documentation
- **[Development Guide](../../development/DEVELOPMENT_GUIDE.md)** - Setup and development

The Search System provides a complete, accessible, and performant search experience that integrates seamlessly with Academy theming and supports all educational program types.