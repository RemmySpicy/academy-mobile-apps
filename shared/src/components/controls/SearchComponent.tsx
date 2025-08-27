import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, createThemedStyles } from '../../theme';

export interface SearchComponentProps {
  onQueryChange?: (text: string) => void;
  onToggleSearch?: () => void;
  placeholder?: string;
  value?: string;
  onDone?: () => void;
  doneText?: string;
  autoFocus?: boolean;
}

export const SearchComponent: React.FC<SearchComponentProps> = ({
  onQueryChange,
  onToggleSearch,
  placeholder = "Search...",
  value = "",
  onDone,
  doneText = "Done",
  autoFocus = true,
}) => {
  const { theme } = useTheme();
  const styles = useThemedStyles();

  const handleDone = () => {
    onDone?.();
    onToggleSearch?.();
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={14}
          color={theme.colors.text.secondary}
          style={styles.searchIcon}
        />
        <TextInput
          placeholder={placeholder}
          style={styles.input}
          onChangeText={onQueryChange}
          value={value}
          placeholderTextColor={theme.colors.text.secondary}
          autoFocus={autoFocus}
          returnKeyType="search"
          accessibilityLabel="Search input"
          accessibilityHint="Enter text to search"
        />
      </View>

      <TouchableOpacity 
        onPress={handleDone} 
        style={styles.doneButton}
        accessibilityRole="button"
        accessibilityLabel={doneText}
      >
        <Text style={styles.doneText}>{doneText}</Text>
      </TouchableOpacity>
    </View>
  );
};

export interface StaticSearchComponentProps {
  schoolName?: string;
  viewsLabel?: string;
  onQueryChange?: (text: string) => void;
  onToggleSearch?: () => void;
  onMoreOptions?: () => void;
  placeholder?: string;
  value?: string;
  onDone?: () => void;
  doneText?: string;
}

export const StaticSearchComponent: React.FC<StaticSearchComponentProps> = ({
  schoolName = "Academy School",
  viewsLabel = "Views",
  onQueryChange,
  onToggleSearch,
  onMoreOptions,
  placeholder = "Search...",
  value = "",
  onDone,
  doneText = "Done",
}) => {
  const { theme } = useTheme();
  const styles = useThemedStyles();

  const handleDone = () => {
    onDone?.();
    onToggleSearch?.();
  };

  return (
    <View style={styles.staticContainer}>
      <View style={styles.staticCard}>
        <View style={styles.staticHeader}>
          <Text style={styles.schoolName}>{schoolName}</Text>
          <TouchableOpacity 
            style={styles.moreButton}
            onPress={onMoreOptions}
            accessibilityRole="button"
            accessibilityLabel="More options"
          >
            <Ionicons name="ellipsis-horizontal" size={12} color={theme.colors.text.primary} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.viewsLabel}>{viewsLabel}</Text>

        <View style={styles.container}>
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={14}
              color={theme.colors.text.secondary}
              style={styles.searchIcon}
            />
            <TextInput
              placeholder={placeholder}
              style={styles.input}
              onChangeText={onQueryChange}
              value={value}
              placeholderTextColor={theme.colors.text.secondary}
              returnKeyType="search"
              accessibilityLabel="Search input"
            />
          </View>

          <TouchableOpacity 
            onPress={handleDone} 
            style={styles.doneButton}
            accessibilityRole="button"
            accessibilityLabel={doneText}
          >
            <Text style={styles.doneText}>{doneText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const useThemedStyles = createThemedStyles((theme) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
    width: '100%',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    marginRight: theme.spacing.sm,
    backgroundColor: theme.colors.background.primary,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: theme.fontSizes.small,
    paddingVertical: theme.spacing.xs,
    color: theme.colors.text.primary,
  },
  doneButton: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  doneText: {
    color: theme.colors.interactive.primary,
    fontSize: theme.fontSizes.small,
    fontWeight: theme.fontConfig.fontWeight.medium,
  },
  staticContainer: {
    marginTop: theme.spacing.sm,
  },
  staticCard: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  staticHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: theme.spacing.xs,
  },
  schoolName: {
    fontSize: theme.fontSizes.body,
    color: theme.colors.text.primary,
    fontWeight: theme.fontConfig.fontWeight.medium,
  },
  moreButton: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  viewsLabel: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.xs,
  },
}));

export { SearchComponent as SearchComp, StaticSearchComponent as StaticSearchComp };
export default SearchComponent;