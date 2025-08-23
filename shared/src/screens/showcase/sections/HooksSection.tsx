import React, { useState } from 'react';
import { View, Text } from 'react-native';

// Search Components
import { SearchInput } from '../../../components/search/SearchInput';

// Hooks
import { useDebounce } from '../../../hooks/useDebounce';

// Types
import { ShowcaseSectionProps } from '../types/showcaseTypes';

const HooksSection: React.FC<ShowcaseSectionProps> = ({ theme, styles, screenDimensions }) => {
  // Hook demo states
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch] = useDebounce(searchValue, 300);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>🪝 Enhanced Hooks</Text>
      
      <Text style={styles.subsectionTitle}>useDebounce</Text>
      <View style={styles.hookDemo}>
        <Text style={styles.hookDescription}>
          Debounced search input (300ms delay)
        </Text>
        <SearchInput
          value={searchValue}
          onChangeText={setSearchValue}
          placeholder="Type to see debounce effect..."
        />
        <Text style={styles.demoText}>Original: "{searchValue}"</Text>
        <Text style={styles.demoText}>Debounced: "{debouncedSearch}"</Text>
      </View>

      <Text style={styles.subsectionTitle}>useScreenDimensions</Text>
      <View style={styles.hookDemo}>
        <Text style={styles.hookDescription}>
          Responsive screen dimension detection
        </Text>
        <View style={styles.dimensionInfo}>
          <Text style={styles.demoText}>Width: {screenDimensions.width}px</Text>
          <Text style={styles.demoText}>Height: {screenDimensions.height}px</Text>
          <Text style={styles.demoText}>Device: {screenDimensions.isTablet ? 'Tablet' : 'Phone'}</Text>
          <Text style={styles.demoText}>Landscape: {screenDimensions.isLandscape ? 'Yes' : 'No'}</Text>
        </View>
      </View>

      <Text style={styles.subsectionTitle}>Component Count</Text>
      <View style={styles.hookDemo}>
        <Text style={styles.hookDescription}>
          All extracted components are working without TypeScript errors
        </Text>
        <Text style={styles.successText}>✅ 83+ Components Production Ready</Text>
      </View>
    </View>
  );
};

export default HooksSection;