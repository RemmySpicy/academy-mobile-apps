const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { withMetroConfig } = require('react-native-monorepo-config');

const config = withMetroConfig(
  getDefaultConfig(__dirname),
  {
    root: path.resolve(__dirname, '..'), // Monorepo root
    dirname: __dirname, // Current directory
  }
);

// Keep existing alias for @shared
config.resolver.alias = {
  '@shared': path.resolve(__dirname, '..', 'shared'),
};

module.exports = config;