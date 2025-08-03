module.exports = {
  '**/*.{js,jsx,ts,tsx}': [
    'eslint --fix',
    'prettier --write',
  ],
  '**/*.{json,md,yml,yaml}': [
    'prettier --write',
  ],
  // Run type checking on staged TypeScript files
  '**/*.{ts,tsx}': () => [
    'npm run type-check:all',
  ],
  // Run tests related to staged files
  '**/*.{js,jsx,ts,tsx}': () => [
    'npm run test:all -- --bail --findRelatedTests --passWithNoTests',
  ],
};