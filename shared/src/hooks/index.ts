// Custom Hooks

export { default as useAuth } from './useAuth';
export { default as useLegacyAuth } from './useLegacyAuth';
export { default as useApiClient } from './useApiClient';
// useProgramContext is exported from components/program/ProgramContextProvider
// export { default as useProgramContext } from './useProgramContext';
export { 
  default as useScreenDimensions, 
  useResponsiveDimensions,
  useResponsiveValue 
} from './useScreenDimensions';

// New utility hooks
export { 
  default as useDebounce, 
  useDebouncedCallback 
} from './useDebounce';
export { default as useLocationPermission } from './useLocationPermission';