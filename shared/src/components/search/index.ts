// Search System Components

export { default as SearchInput } from './SearchInput';
export type { SearchInputProps } from './SearchInput';

// Note: FilterChip has been consolidated into the unified Chip component
// export { Chip as FilterChip } from '../ui/Chip';
// export type { ChipProps as FilterChipProps } from '../ui/Chip';

export { default as QuickFilterBar, useQuickFilters } from './QuickFilterBar';
export type { QuickFilterBarProps, FilterItem } from './QuickFilterBar';

export { default as SearchBar, SimpleSearchBar } from './SearchBar';
export type { SearchBarProps, SearchBarAction } from './SearchBar';

export { default as SearchContainer } from './SearchContainer';
export type { SearchContainerProps } from './SearchContainer';