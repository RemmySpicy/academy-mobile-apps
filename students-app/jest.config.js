module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
  
  // Transform patterns for React Native/Expo
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
  ],
  
  // Test file patterns
  testMatch: [
    '<rootDir>/src/**/*.test.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}'
  ],
  
  // Coverage settings
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/*.d.ts',
    '!src/types/**',
  ],
  
  // Module name mapping for path aliases
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@academy/mobile-shared$': '<rootDir>/../shared/src',
    '^@shared/(.*)$': '<rootDir>/../shared/src/$1',
  },
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.expo/',
  ],
  
  // Allow tests to pass even if no test files exist
  passWithNoTests: true,
  
  // Coverage thresholds (optional)
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  
  // Test environment
  testEnvironment: 'node',
  
  // Verbose output
  verbose: true,
};