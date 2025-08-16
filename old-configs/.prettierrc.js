module.exports = {
  // Basic formatting
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  
  // JSX specific
  jsxSingleQuote: true,
  jsxBracketSameLine: false,
  
  // Other options
  arrowParens: 'avoid',
  endOfLine: 'lf',
  bracketSpacing: true,
  
  // File-specific overrides
  overrides: [
    {
      files: '*.{js,jsx,ts,tsx}',
      options: {
        parser: 'typescript',
      },
    },
    {
      files: '*.json',
      options: {
        parser: 'json',
        printWidth: 120,
      },
    },
    {
      files: '*.md',
      options: {
        parser: 'markdown',
        printWidth: 100,
        proseWrap: 'always',
      },
    },
  ],
};