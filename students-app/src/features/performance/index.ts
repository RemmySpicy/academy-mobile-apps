/**
 * Performance Feature Exports
 * 
 * Main entry point for the performance tracking feature
 */

export { PerformanceNavigator } from './navigation/PerformanceNavigator';
export { PerformanceScreen } from './screens/PerformanceScreen';

// Components
export { PerformanceMetricCard } from './components/shared/PerformanceMetricCard';
export { PerformanceChart } from './components/charts/PerformanceChart';

// Types
export * from './types';

// Program Adapters
export { SwimmingPerformanceAdapter } from './programs/swimming/SwimmingPerformanceAdapter';

// Swimming-specific exports
export * from './programs/swimming/types';