import React, { useState } from 'react';
import { View, Text, Alert as RNAlert } from 'react-native';
import { ShowcaseSectionProps } from '../types/showcaseTypes';

// Search System Components
import { SearchInput } from '../../../components/search/SearchInput';
import { QuickFilterBar, useQuickFilters } from '../../../components/search/QuickFilterBar';
import { SearchBar, SimpleSearchBar } from '../../../components/search/SearchBar';
import { SearchContainer } from '../../../components/search/SearchContainer';

// Hooks
import { useDebounce } from '../../../hooks/useDebounce';

// Sample Data
import { sampleFilters } from '../data/sampleData';

interface SearchSectionProps extends ShowcaseSectionProps {
  // Additional props if needed
}

const SearchSection: React.FC<SearchSectionProps> = ({ theme, styles, screenDimensions }) => {
  // Component states for demo
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch] = useDebounce(searchValue, 300);
  
  // Search filters demo
  const { selectedFilters, handleFilterChange } = useQuickFilters(['active'], true);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>🔍 Search System</Text>
      
      <Text style={styles.subsectionTitle}>SearchInput Sizes</Text>
      <View style={styles.componentGroup}>
        <Text style={styles.componentDescription}>Small Size</Text>
        <SearchInput
          value={searchValue}
          onChangeText={setSearchValue}
          placeholder="Small search..."
          size="sm"
          showClearButton={true}
        />
      </View>
      
      <View style={styles.componentGroup}>
        <Text style={styles.componentDescription}>Medium Size (Default)</Text>
        <SearchInput
          value={searchValue}
          onChangeText={setSearchValue}
          placeholder="Search students, instructors..."
          size="md"
          showClearButton={true}
        />
        <Text style={styles.demoText}>
          Debounced value: "{debouncedSearch}"
        </Text>
      </View>

      <View style={styles.componentGroup}>
        <Text style={styles.componentDescription}>Large Size</Text>
        <SearchInput
          value={searchValue}
          onChangeText={setSearchValue}
          placeholder="Large search input..."
          size="lg"
          showClearButton={true}
        />
      </View>

      <View style={styles.componentGroup}>
        <Text style={styles.componentDescription}>Loading State</Text>
        <SearchInput
          value=""
          onChangeText={() => {}}
          placeholder="Loading search..."
          loading={true}
          loadingIcon="hourglass"
        />
      </View>

      <Text style={styles.subsectionTitle}>QuickFilterBar</Text>
      <QuickFilterBar
        filters={sampleFilters}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        multiSelect={true}
        showCount={true}
      />

      <Text style={styles.subsectionTitle}>Complete SearchBar</Text>
      <SearchBar
        searchProps={{
          value: searchValue,
          onChangeText: setSearchValue,
          placeholder: "Search Academy...",
          size: "md",
        }}
        filterProps={{
          filters: sampleFilters,
          selectedFilters: selectedFilters,
          onFilterChange: handleFilterChange,
          multiSelect: true,
        }}
        title="Academy Search"
        subtitle="Find students, instructors, and sessions"
        actions={[
          {
            label: "Done",
            onPress: () => RNAlert.alert('Done', 'Search completed'),
            variant: 'primary',
          },
        ]}
      />

      <Text style={styles.subsectionTitle}>SimpleSearchBar</Text>
      <SimpleSearchBar
        value={searchValue}
        onChangeText={setSearchValue}
        placeholder="Quick search..."
        onDonePress={() => RNAlert.alert('Done', 'Quick search done')}
      />

      <Text style={styles.subsectionTitle}>SearchContainer</Text>
      <View style={styles.componentGroup}>
        <Text style={styles.componentDescription}>Complete search experience with unified state management</Text>
        <SearchContainer
          searchProps={{
            value: searchValue,
            onChangeText: setSearchValue,
            placeholder: "Search with container...",
            size: "md",
          }}
          filterProps={{
            filters: sampleFilters.slice(0, 3), // Show fewer filters for demo
            selectedFilters: selectedFilters,
            onFilterChange: handleFilterChange,
            multiSelect: true,
          }}
          showEmptyState={true}
          emptyStateProps={{
            title: "No results found",
            description: "Try adjusting your search criteria",
            iconName: "search",
          }}
          compact={true}
        />
      </View>
    </View>
  );
};

export default SearchSection;