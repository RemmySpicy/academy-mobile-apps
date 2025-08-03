module.exports = {
  preset: 'jest-expo',
  projects: [
    {
      displayName: 'Academy Instructors App',
      preset: 'jest-expo',
      testMatch: ['<rootDir>/academy-instructors-app/**/*.test.{js,jsx,ts,tsx}'],
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
      transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
      },
      testPathIgnorePatterns: [
        '<rootDir>/academy-instructors-app/node_modules/',
        '<rootDir>/academy-instructors-app/.expo/',
        '<rootDir>/academy-instructors-app/existing-code/',
      ],
      collectCoverageFrom: [
        'academy-instructors-app/src/**/*.{js,jsx,ts,tsx}',
        '!academy-instructors-app/src/**/*.test.{js,jsx,ts,tsx}',
        '!academy-instructors-app/src/**/__tests__/**',
        '!academy-instructors-app/src/**/index.{js,jsx,ts,tsx}',
      ],
      setupFilesAfterEnv: ['<rootDir>/academy-instructors-app/jest-setup.js'],
      moduleNameMapping: {
        '^@/(.*)$': '<rootDir>/academy-instructors-app/src/$1',
        '^@shared/(.*)$': '<rootDir>/shared/src/$1',
      },
    },
    {
      displayName: 'Academy Students App',
      preset: 'jest-expo',
      testMatch: ['<rootDir>/academy-students-app/**/*.test.{js,jsx,ts,tsx}'],
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
      transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
      },
      testPathIgnorePatterns: [
        '<rootDir>/academy-students-app/node_modules/',
        '<rootDir>/academy-students-app/.expo/',
        '<rootDir>/academy-students-app/existing-code/',
      ],
      collectCoverageFrom: [
        'academy-students-app/src/**/*.{js,jsx,ts,tsx}',
        '!academy-students-app/src/**/*.test.{js,jsx,ts,tsx}',
        '!academy-students-app/src/**/__tests__/**',
        '!academy-students-app/src/**/index.{js,jsx,ts,tsx}',
      ],
      setupFilesAfterEnv: ['<rootDir>/academy-students-app/jest-setup.js'],
      moduleNameMapping: {
        '^@/(.*)$': '<rootDir>/academy-students-app/src/$1',
        '^@shared/(.*)$': '<rootDir>/shared/src/$1',
      },
    },
    {
      displayName: 'Shared Package',
      testMatch: ['<rootDir>/shared/**/*.test.{js,jsx,ts,tsx}'],
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
      transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
      },
      testPathIgnorePatterns: [
        '<rootDir>/shared/node_modules/',
      ],
      collectCoverageFrom: [
        'shared/src/**/*.{js,jsx,ts,tsx}',
        '!shared/src/**/*.test.{js,jsx,ts,tsx}',
        '!shared/src/**/__tests__/**',
        '!shared/src/**/index.{js,jsx,ts,tsx}',
      ],
      setupFilesAfterEnv: ['<rootDir>/shared/jest-setup.js'],
      moduleNameMapping: {
        '^@/(.*)$': '<rootDir>/shared/src/$1',
      },
    },
  ],
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};